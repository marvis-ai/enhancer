import { create } from 'zustand';

interface SectionData {
  stories: Story[];
  nextPageUrl: string | null;
  isLoadingMore: boolean;
  isLoading: boolean;
  hasMore: boolean;
}

interface HNStore {
  sections: Record<string, SectionData>;
  currentSection: string;

  // Actions
  setCurrentSection: (section: string) => void;
  initializeSection: (
    section: string,
    stories: Story[],
    hasMore: boolean,
  ) => void;
  loadSection: (section: string) => Promise<void>;
  loadMoreStories: (section: string) => Promise<void>;
  setLoading: (section: string, isLoading: boolean) => void;
  setLoadingMore: (section: string, isLoadingMore: boolean) => void;
  updateSectionData: (
    section: string,
    stories: Story[],
    nextPageUrl: string | null,
    hasMore: boolean,
    append?: boolean,
  ) => void;
}

const createEmptySectionData = (): SectionData => ({
  stories: [],
  nextPageUrl: null,
  isLoading: false,
  isLoadingMore: false,
  hasMore: true,
});

export const useHNStore = create<HNStore>((set, get) => ({
  sections: {},
  currentSection: 'home',

  setCurrentSection: (section: string) => {
    set({ currentSection: section });
  },

  initializeSection: (section: string, stories: Story[], hasMore: boolean) => {
    set((state) => ({
      sections: {
        ...state.sections,
        [section]: {
          stories,
          nextPageUrl: null,
          isLoading: false,
          isLoadingMore: false,
          hasMore,
        },
      },
    }));
  },

  setLoading: (section: string, isLoading: boolean) => {
    set((state) => ({
      sections: {
        ...state.sections,
        [section]: {
          ...(state.sections[section] || createEmptySectionData()),
          isLoading,
        },
      },
    }));
  },

  setLoadingMore: (section: string, isLoadingMore: boolean) => {
    set((state) => ({
      sections: {
        ...state.sections,
        [section]: {
          ...(state.sections[section] || createEmptySectionData()),
          isLoadingMore,
        },
      },
    }));
  },

  updateSectionData: (
    section: string,
    stories: Story[],
    nextPageUrl: string | null,
    hasMore: boolean,
    append: boolean = false,
  ) => {
    set((state) => {
      const existingData = state.sections[section] || createEmptySectionData();

      const newStories = append
        ? [...existingData.stories, ...stories]
        : stories;

      const newState = {
        sections: {
          ...state.sections,
          [section]: {
            stories: newStories,
            nextPageUrl,
            isLoading: false,
            isLoadingMore: false,
            hasMore,
          },
        },
      };

      return newState;
    });
  },

  loadSection: async (section: string) => {
    const state = get();

    // If section already has data, don't reload
    if (state.sections[section]?.stories.length > 0) {
      return;
    }

    // Set loading state
    get().setLoading(section, true);

    try {
      const fetchSection = window.__ENHANCER_AI_FETCH_SECTION__;
      if (!fetchSection) {
        console.error('Fetch section function not available');
        get().setLoading(section, false);
        return;
      }

      const { stories, hasMore } = await fetchSection(section, false);

      get().updateSectionData(section, stories, null, hasMore, false);
    } catch (error) {
      console.error('Error loading section:', error);
      get().setLoading(section, false);
    }
  },

  loadMoreStories: async (section: string) => {
    const state = get();
    const sectionData = state.sections[section];

    if (
      !sectionData ||
      sectionData.isLoading ||
      sectionData.isLoadingMore ||
      !sectionData.hasMore
    ) {
      return;
    }

    // Set loading more state
    get().setLoadingMore(section, true);

    try {
      const fetchSection = window.__ENHANCER_AI_FETCH_SECTION__;
      if (!fetchSection) {
        console.error('Fetch section function not available');
        get().setLoadingMore(section, false);
        return;
      }

      const { stories, hasMore } = await fetchSection(section, true);

      if (stories.length === 0) {
        get().updateSectionData(
          section,
          [],
          sectionData.nextPageUrl,
          false,
          false,
        );
      } else {
        // The fetchSection function internally manages nextPageUrls,
        // so we don't need to track it here - just preserve the existing one
        get().updateSectionData(
          section,
          stories,
          sectionData.nextPageUrl,
          hasMore,
          true,
        );
      }
    } catch (error) {
      console.error('Error loading more stories:', error);
      get().setLoadingMore(section, false);
    }
  },
}));
