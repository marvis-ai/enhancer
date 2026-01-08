import { useEffect } from 'react';

import { HNHeader } from '@/features/hacker-news/header';
import { StoryList } from '@/features/hacker-news/story/list';
import { useHNStore } from '@/features/hacker-news/store/hn';

export const HackerNewsApp = () => {
  const { currentSection, setCurrentSection, initializeSection, loadSection } =
    useHNStore();

  useEffect(() => {
    const path = window.location.pathname;
    let section = 'home';
    if (path === '/newest') section = 'new';
    else if (path === '/front') section = 'past';
    else if (path === '/newcomments') section = 'comments';
    else if (path === '/ask') section = 'ask';
    else if (path === '/show') section = 'show';
    else if (path === '/jobs') section = 'jobs';

    setCurrentSection(section);

    // Initialize with existing stories if available
    const initialStories = window.__ENHANCER_AI_STORIES__ || [];
    if (initialStories.length > 0) {
      // Extract next page URL from the document
      const moreLink = document.querySelector('a.morelink[rel="next"]');
      const nextPageUrl = moreLink?.getAttribute('href') || null;
      initializeSection(section, initialStories, true);

      // Update the section data with the nextPageUrl
      const { updateSectionData } = useHNStore.getState();
      updateSectionData(section, initialStories, nextPageUrl, true, false);
    }

    const handleDataReady = (event: Event) => {
      const customEvent = event as CustomEvent<{
        stories: Story[];
        hasMore: boolean;
      }>;
      initializeSection(
        section,
        customEvent.detail.stories,
        customEvent.detail.hasMore,
      );
    };

    window.addEventListener('enhancer-ai-data-ready', handleDataReady);

    return () => {
      window.removeEventListener('enhancer-ai-data-ready', handleDataReady);
    };
  }, [setCurrentSection, initializeSection]);

  const handleNavigate = async (section: string) => {
    if (section === currentSection) return;

    setCurrentSection(section);
    await loadSection(section);
  };

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
