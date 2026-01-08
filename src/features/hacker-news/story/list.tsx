import { useEffect, useRef, useCallback } from 'react';
import { StoryCard } from '@/features/hacker-news/story/card';
import { LoaderPinwheelIcon } from 'lucide-react';
import { useHNStore } from '@/features/hacker-news/store/hn';

interface StoryListProps {
  currentSection: string;
}

export const StoryList = ({ currentSection }: StoryListProps) => {
  const { sections, loadMoreStories } = useHNStore();
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  const sectionData = sections[currentSection] || {
    stories: [],
    isLoading: false,
    isLoadingMore: false,
    hasMore: false,
    nextPageUrl: null,
  };

  const { stories, isLoading, isLoadingMore, hasMore } = sectionData;

  const handleLoadMore = useCallback(async () => {
    if (isLoading || isLoadingMore || !hasMore) return;
    await loadMoreStories(currentSection);
  }, [isLoading, isLoadingMore, hasMore, currentSection, loadMoreStories]);

  useEffect(() => {
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (
          entries[0].isIntersecting &&
          !isLoading &&
          !isLoadingMore &&
          hasMore
        ) {
          handleLoadMore();
        }
      },
      { threshold: 0.1 },
    );

    if (loadMoreRef.current) {
      observerRef.current.observe(loadMoreRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [handleLoadMore, isLoading, isLoadingMore, hasMore]);

  if (isLoading) {
    return (
      <div className='flex items-center justify-center py-12'>
        <div className='flex items-center gap-2 text-zinc-500'>
          <LoaderPinwheelIcon className='w-5 h-5 animate-spin' />
          <span>Loading...</span>
        </div>
      </div>
    );
  }

  if (stories.length === 0) {
    return (
      <div className='text-center py-12 text-zinc-500'>No stories found</div>
    );
  }

  return (
    <div className='space-y-3'>
      {stories.map((story) => (
        <StoryCard
          key={story.id}
          story={story}
        />
      ))}

      {hasMore && (
        <div
          ref={loadMoreRef}
          className='py-8 flex justify-center'>
          {isLoadingMore && (
            <div className='flex items-center gap-2 text-zinc-500'>
              <LoaderPinwheelIcon className='w-5 h-5 animate-spin' />
              <span>Loading more...</span>
            </div>
          )}
        </div>
      )}

      {!hasMore && stories.length > 0 && (
        <div className='text-center py-8 text-zinc-500'>
          You've reached the end
        </div>
      )}
    </div>
  );
};
