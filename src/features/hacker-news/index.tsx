import { StrictMode, useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';

import './styles.css';

import { HNHeader } from '@/features/hacker-news/Header';
import { StoryList } from '@/features/hacker-news/StoryList';

export const HackerNewsApp = () => {
  const [stories, setStories] = useState<Story[]>(
    () => window.__ENHANCER_AI_STORIES__ || [],
  );
  const [loading, setLoading] = useState(() => !window.__ENHANCER_AI_STORIES__);

  useEffect(() => {
    // Listen for data ready event
    const handleDataReady = (event: Event) => {
      const customEvent = event as CustomEvent<{ stories: Story[] }>;
      setStories(customEvent.detail.stories);
      setLoading(false);
    };

    window.addEventListener('enhancer-ai-data-ready', handleDataReady);

    return () => {
      window.removeEventListener('enhancer-ai-data-ready', handleDataReady);
    };
  }, []);

  if (loading) {
    return (
      <div className='flex items-center justify-center min-h-screen'>
        <div className='text-gray-600'>Loading...</div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gray-50'>
      <HNHeader />
      <main className='max-w-5xl mx-auto px-4 py-6'>
        <StoryList stories={stories} />
      </main>
    </div>
  );
};

// Wait for root element to be ready
function mountApp() {
  const root = document.getElementById('enhancer-ai-root');
  if (root) {
    createRoot(root).render(
      <StrictMode>
        <HackerNewsApp />
      </StrictMode>,
    );
  }
}

// Mount app immediately when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', mountApp);
} else {
  mountApp();
}
