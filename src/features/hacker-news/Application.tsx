import { useEffect, useCallback } from 'react';

import { HNHeader } from '@/features/hacker-news/header';
import { StoryList } from '@/features/hacker-news/story/list';
import { useHNStore } from '@/features/hacker-news/store/hn';

export const HackerNewsApp = () => {
  const { currentSection, setCurrentSection, initializeSection, loadSection } =
    useHNStore();

  const getPathSection = (path: string): string => {
    if (path === '/newest') return 'new';
    if (path === '/front') return 'past';
    if (path === '/newcomments') return 'comments';
    if (path === '/ask') return 'ask';
    if (path === '/show') return 'show';
    if (path === '/jobs') return 'jobs';
    return 'home';
  };

  const handleNavigate = useCallback(
    async (section: string) => {
      if (section === currentSection) return;

      // Scroll to top instantly when switching sections
      window.scrollTo({ top: 0 });

      setCurrentSection(section);
      await loadSection(section);
    },
    [currentSection, setCurrentSection, loadSection],
  );

  useEffect(() => {
    const path = window.location.pathname;
    const section = getPathSection(path);

    setCurrentSection(section);

    // Initialize with existing stories if available
    const initialStories = window.__ENHANCER_AI_STORIES__ || [];
    if (initialStories.length > 0) {
      // Extract next page URL from the document
      const moreLink = document.querySelector('a.morelink[rel="next"]');
      const nextPageUrl = moreLink?.getAttribute('href') || null;

      // Only initialize if the section doesn't already have data
      const currentState = useHNStore.getState();
      if (!currentState.sections[section]?.stories.length) {
        initializeSection(section, initialStories, true);

        // Update the section data with the nextPageUrl
        const { updateSectionData } = useHNStore.getState();
        updateSectionData(section, initialStories, nextPageUrl, true, false);
      }
    }

    const handleDataReady = (event: Event) => {
      const customEvent = event as CustomEvent<{
        stories: Story[];
        hasMore: boolean;
      }>;

      // Only initialize if the section doesn't already have data
      const currentState = useHNStore.getState();
      if (!currentState.sections[section]?.stories.length) {
        initializeSection(
          section,
          customEvent.detail.stories,
          customEvent.detail.hasMore,
        );
      }
    };

    const handlePopState = () => {
      const path = window.location.pathname;
      const section = getPathSection(path);
      // Scroll to top instantly when navigating via browser back/forward
      window.scrollTo({ top: 0 });
      handleNavigate(section);
    };

    window.addEventListener('enhancer-ai-data-ready', handleDataReady);
    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('enhancer-ai-data-ready', handleDataReady);
      window.removeEventListener('popstate', handlePopState);
    };
  }, [setCurrentSection, initializeSection, handleNavigate]);

  return (
    <main className='min-h-screen bg-linear-to-br from-purple-50/85 via-pink-50/85 to-orange-50/85 dark:from-zinc-900 dark:via-slate-800 dark:to-zinc-800'>
      <HNHeader
        onNavigate={handleNavigate}
        currentSection={currentSection}
      />

      <div className='max-w-5xl mx-auto px-6 py-6 gap-6'>
        {/* Story List */}
        <StoryList currentSection={currentSection} />
      </div>
    </main>
  );
};
