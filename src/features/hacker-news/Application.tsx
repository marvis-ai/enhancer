import { useEffect, useCallback, useMemo } from 'react';

import { HNHeader } from '@/features/hacker-news/header';
import { StoryList } from '@/features/hacker-news/story/list';
import { CommentList } from '@/features/hacker-news/comment/list';
import { CommentsTabbar } from '@/features/hacker-news/header/comments-tabbar';
import { useHNStore } from '@/features/hacker-news/store/hn';

export const HackerNewsApp = () => {
  const { currentSection, setCurrentSection, initializeSection, loadSection } =
    useHNStore();

  const getPathSection = (path: string): string => {
    if (path === '/newest') return 'new';
    if (path === '/front') return 'past';
    if (path === '/newcomments') return 'newcomments';
    if (path === '/bestcomments') return 'bestcomments';
    if (path.startsWith('/bestcomments?h=')) return 'best24comments';
    if (path === '/ask') return 'ask';
    if (path === '/show') return 'show';
    if (path === '/jobs') return 'jobs';
    return 'home';
  };

  const handleNavigate = useCallback(
    async (section: string) => {
      // Prevent duplicate navigation for the same section
      if (section === currentSection) return;

      // Scroll to top instantly when switching sections
      window.scrollTo({ top: 0 });

      setCurrentSection(section);
      await loadSection(section);
    },
    [currentSection, setCurrentSection, loadSection],
  );

  // Initialize with existing data if available
  const isCommentSection = useMemo(() => {
    return (
      currentSection === 'newcomments' ||
      currentSection === 'bestcomments' ||
      currentSection === 'best24comments'
    );
  }, [currentSection]);

  useEffect(() => {
    const path = window.location.pathname;
    const section = getPathSection(path);

    setCurrentSection(section);

    // Initialize with existing data if available
    const sectionIsCommentSection =
      section === 'newcomments' ||
      section === 'bestcomments' ||
      section === 'best24comments';
    const initialData = sectionIsCommentSection
      ? window.__ENHANCER_AI_COMMENTS__ || []
      : window.__ENHANCER_AI_STORIES__ || [];

    if (initialData.length > 0) {
      // Extract next page URL from the document
      const moreLink = document.querySelector('a.morelink[rel="next"]');
      const nextPageUrl = moreLink?.getAttribute('href') || null;

      // Only initialize if the section doesn't already have data
      const currentState = useHNStore.getState();
      if (!currentState.sections[section]?.items.length) {
        initializeSection(section, initialData, true);

        // Update the section data with the nextPageUrl
        const { updateSectionData } = useHNStore.getState();
        updateSectionData(section, initialData, nextPageUrl, true, false);
      }
    }

    const handleDataReady = (event: Event) => {
      const customEvent = event as CustomEvent<{
        stories: HNStory[];
        comments: HNComment[];
        hasMore: boolean;
      }>;

      // Only initialize if the section doesn't already have data
      const currentState = useHNStore.getState();
      if (!currentState.sections[section]?.items.length) {
        const sectionIsCommentSection =
          section === 'newcomments' ||
          section === 'bestcomments' ||
          section === 'best24comments';
        const data = sectionIsCommentSection
          ? customEvent.detail.comments
          : customEvent.detail.stories;

        initializeSection(section, data, customEvent.detail.hasMore);
      }
    };

    const handlePopState = () => {
      const path = window.location.pathname;
      const section = getPathSection(path);
      if (!section) return;
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
  }, [setCurrentSection, initializeSection, handleNavigate, isCommentSection]);

  return (
    <main className='min-h-screen bg-linear-to-br from-purple-50/85 via-pink-50/85 to-orange-50/85 dark:from-zinc-900 dark:via-slate-800 dark:to-zinc-800'>
      <HNHeader
        onNavigate={handleNavigate}
        currentSection={currentSection}
      />

      <div className='max-w-5xl mx-auto px-6 py-6 gap-6'>
        {/* Comments Tabbar */}
        {isCommentSection && <CommentsTabbar onNavigate={handleNavigate} />}

        {/* Comments List */}
        {isCommentSection ? (
          <CommentList currentSection={currentSection} />
        ) : (
          <StoryList currentSection={currentSection} />
        )}
      </div>
    </main>
  );
};
