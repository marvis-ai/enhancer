import { useEffect, useRef, useCallback } from 'react';
import { LoaderPinwheelIcon } from 'lucide-react';

import { useHNStore } from '@/features/hacker-news/store/hn';

import { CommentCard } from '@/features/hacker-news/comment/card';

interface CommentListProps {
  currentSection: string;
}

export const CommentList = ({ currentSection }: CommentListProps) => {
  const { sections, loadMoreStories } = useHNStore();
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  const sectionData = sections[currentSection] || {
    items: [],
    sectionType: 'comments' as const,
    isLoading: false,
    isLoadingMore: false,
    hasMore: false,
    nextPageUrl: null,
  };

  const { items, isLoading, isLoadingMore, hasMore } = sectionData;

  const handleLoadMore = useCallback(async () => {
    if (isLoading || isLoadingMore || !hasMore) return;

    // Clear any existing debounce timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // Debounce the load more call
    debounceTimerRef.current = setTimeout(async () => {
      await loadMoreStories(currentSection);
      debounceTimerRef.current = null;
    }, 100); // 100ms debounce
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
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [handleLoadMore, isLoading, isLoadingMore, hasMore]);

  if (isLoading) {
    return (
      <div className='flex items-center justify-center py-12'>
        <div className='flex items-center gap-2 text-zinc-500'>
          <LoaderPinwheelIcon className='w-5 h-5 animate-spin' />
          <span>Loading comments...</span>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className='text-center py-12 text-zinc-500'>No comments found</div>
    );
  }

  return (
    <div className='space-y-3'>
      {items.map((comment) => (
        <CommentCard
          key={comment.id}
          comment={comment as HNComment}
        />
      ))}

      {hasMore && (
        <div
          ref={loadMoreRef}
          className='py-8 flex justify-center'>
          {isLoadingMore && (
            <div className='flex items-center gap-2 text-zinc-500'>
              <LoaderPinwheelIcon className='w-5 h-5 animate-spin' />
              <span>Loading more comments...</span>
            </div>
          )}
        </div>
      )}

      {!hasMore && items.length > 0 && (
        <div className='text-center py-8 text-zinc-500'>
          You've reached the end
        </div>
      )}
    </div>
  );
};
