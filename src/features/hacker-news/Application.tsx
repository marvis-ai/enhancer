import { useEffect, useState } from 'react';

import { HNHeader } from '@/features/hacker-news/header';
import { StoryList } from '@/features/hacker-news/story/list';
import { Tabbar } from '@/features/hacker-news/header/tabbar';

export const HackerNewsApp = () => {
  const [stories, setStories] = useState<Story[]>(
    () => window.__ENHANCER_AI_STORIES__ || [],
  );
  const [currentSection, setCurrentSection] = useState(() => {
    const path = window.location.pathname;
    if (path === '/newest') return 'new';
    if (path === '/front') return 'past';
    if (path === '/newcomments') return 'comments';
    if (path === '/ask') return 'ask';
    if (path === '/show') return 'show';
    if (path === '/jobs') return 'jobs';
    return 'home';
  });
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    const handleDataReady = (event: Event) => {
      const customEvent = event as CustomEvent<{
        stories: Story[];
        hasMore: boolean;
      }>;
      setStories(customEvent.detail.stories);
      setHasMore(customEvent.detail.hasMore);
    };

    window.addEventListener('enhancer-ai-data-ready', handleDataReady);

    return () => {
      window.removeEventListener('enhancer-ai-data-ready', handleDataReady);
    };
  }, []);

  const handleNavigate = async (section: string) => {
    if (section === currentSection) return;

    setCurrentSection(section);
    setIsLoading(true);

    try {
      const fetchSection = window.__ENHANCER_AI_FETCH_SECTION__;
      if (fetchSection) {
        const { stories: newStories, hasMore: moreAvailable } =
          await fetchSection(section, false);
        setStories(newStories);
        setHasMore(moreAvailable);
      }
    } catch (error) {
      console.error('Error fetching section:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className='min-h-screen bg-linear-to-br from-purple-50/85 via-pink-50/85 to-orange-50/85 dark:from-zinc-900 dark:via-slate-800 dark:to-zinc-800'>
      <HNHeader
        onNavigate={handleNavigate}
        currentSection={currentSection}
      />

      <div className='max-w-5xl mx-auto px-6 py-6 gap-6'>
        {/* Tabs */}
        <Tabbar />

        {/* Story List */}
        <StoryList
          initialStories={stories}
          currentSection={currentSection}
          isLoading={isLoading}
          initialHasMore={hasMore}
        />
      </div>
    </main>
  );
};
