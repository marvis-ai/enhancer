import { useEffect, useState } from 'react';

import { HNHeader } from '@/features/hacker-news/header';
import { StoryList } from '@/features/hacker-news/story/list';
import { Tabbar } from '@/features/hacker-news/header/tabbar';

export const HackerNewsApp = () => {
  const [stories, setStories] = useState<Story[]>(
    () => window.__ENHANCER_AI_STORIES__ || [],
  );
  const [currentSection, setCurrentSection] = useState('popular');

  useEffect(() => {
    const handleDataReady = (event: Event) => {
      const customEvent = event as CustomEvent<{ stories: Story[] }>;
      setStories(customEvent.detail.stories);
    };

    window.addEventListener('enhancer-ai-data-ready', handleDataReady);

    return () => {
      window.removeEventListener('enhancer-ai-data-ready', handleDataReady);
    };
  }, []);

  return (
    <main className='min-h-screen bg-linear-to-br from-purple-50/85 via-pink-50/85 to-orange-50/85 dark:from-zinc-900 dark:via-slate-800 dark:to-zinc-800'>
      <HNHeader
        onNavigate={setCurrentSection}
        currentSection={currentSection}
      />

      <div className='max-w-5xl mx-auto px-6 py-6 gap-6'>
        {/* Tabs */}
        <Tabbar />

        {/* Story List */}
        <StoryList initialStories={stories} />
      </div>
    </main>
  );
};
