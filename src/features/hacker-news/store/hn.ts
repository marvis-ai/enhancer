import { create } from 'zustand';

type SectionType = 'stories' | 'comments';

interface SectionData {
  items: HNStory[] | HNComment[];
  sectionType: SectionType;
  nextPageUrl: string | null;
  isLoadingMore: boolean;
  isLoading: boolean;
  hasMore: boolean;
}

interface HNStore {
  sections: Record<string, SectionData>;
  currentSection: string;
  loadingSections: Set<string>; // Track sections being loaded

  // Actions
  setCurrentSection: (section: string) => void;
  initializeSection: (
    section: string,
    data: HNStory[] | HNComment[],
    hasMore: boolean,
  ) => void;
  loadSection: (section: string) => Promise<void>;
  loadMoreStories: (section: string) => Promise<void>;
  setLoading: (section: string, isLoading: boolean) => void;
  setLoadingMore: (section: string, isLoadingMore: boolean) => void;
  updateSectionData: (
    section: string,
    data: HNStory[] | HNComment[],
    nextPageUrl: string | null,
    hasMore: boolean,
    append?: boolean,
  ) => void;
}

const createEmptySectionData = (sectionType: SectionType): SectionData => ({
  items: [],
  sectionType,
  nextPageUrl: null,
  isLoading: false,
  isLoadingMore: false,
  hasMore: true,
});

const isCommentSection = (section: string): boolean => {
  return (
    section === 'newcomments' ||
    section === 'bestcomments' ||
    section === 'best24comments'
  );
};

export const useHNStore = create<HNStore>((set, get) => ({
  sections: {},
  currentSection: 'home',
  loadingSections: new Set(),

  setCurrentSection: (section: string) => {
    set({ currentSection: section });
  },

  initializeSection: (
    section: string,
    data: HNStory[] | HNComment[],
    hasMore: boolean,
  ) => {
    set((state) => {
      // Only initialize if the section doesn't exist or has no data
      const existingSection = state.sections[section];
      if (existingSection && existingSection.items.length > 0) {
        return state;
      }

      const sectionType: SectionType = isCommentSection(section)
        ? 'comments'
        : 'stories';

      return {
        sections: {
          ...state.sections,
          [section]: {
            items: data,
            sectionType,
            nextPageUrl: null,
            isLoading: false,
            isLoadingMore: false,
            hasMore,
          },
        },
      };
    });
  },

  setLoading: (section: string, isLoading: boolean) => {
    set((state) => ({
      sections: {
        ...state.sections,
        [section]: {
          ...(state.sections[section] || createEmptySectionData('stories')),
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
          ...(state.sections[section] || createEmptySectionData('stories')),
          isLoadingMore,
        },
      },
    }));
  },

  updateSectionData: (
    section: string,
    data: HNStory[] | HNComment[],
    nextPageUrl: string | null,
    hasMore: boolean,
    append: boolean = false,
  ) => {
    set((state) => {
      const existingData =
        state.sections[section] || createEmptySectionData('stories');

      const newData: HNStory[] | HNComment[] = append
        ? ([...existingData.items, ...data] as HNStory[] | HNComment[])
        : data;

      const newState = {
        sections: {
          ...state.sections,
          [section]: {
            ...existingData,
            items: newData,
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

    // If section already has data or is being loaded, don't reload
    if (
      state.sections[section]?.items.length > 0 ||
      state.loadingSections.has(section)
    ) {
      return;
    }

    // Add to loading sections
    set((prevState) => ({
      loadingSections: new Set([...prevState.loadingSections, section]),
    }));

    // Set loading state
    get().setLoading(section, true);

    try {
      const fetchSection = window.__ENHANCER_AI_FETCH_SECTION__;
      if (!fetchSection) {
        console.error('Fetch section function not available');
        get().setLoading(section, false);
        return;
      }

      const result = await fetchSection(section, false);

      // Type guard to safely extract data
      let data: HNStory[] | HNComment[];
      let hasMore: boolean;

      if ('stories' in result) {
        data = result.stories;
        hasMore = result.hasMore;
      } else {
        data = result.comments;
        hasMore = result.hasMore;
      }

      get().initializeSection(section, data, hasMore);
      get().updateSectionData(section, data, null, hasMore, false);
    } catch (error) {
      console.error('Error loading section:', error);
      get().setLoading(section, false);
    } finally {
      // Remove from loading sections
      set((prevState) => {
        const newLoadingSections = new Set(prevState.loadingSections);
        newLoadingSections.delete(section);
        return { loadingSections: newLoadingSections };
      });
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

      const result = await fetchSection(section, true);

      // Type guard to safely extract data
      let data: HNStory[] | HNComment[];
      let hasMore: boolean;

      if ('stories' in result) {
        data = result.stories;
        hasMore = result.hasMore;
      } else {
        data = result.comments;
        hasMore = result.hasMore;
      }

      if (data.length === 0) {
        get().updateSectionData(
          section,
          data,
          sectionData.nextPageUrl,
          false,
          false,
        );
      } else {
        get().updateSectionData(
          section,
          data,
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
