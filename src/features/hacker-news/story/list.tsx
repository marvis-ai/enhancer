import { useEffect, useRef, useState, useCallback } from 'react';
import { StoryCard } from '@/features/hacker-news/story/card';
import { LoaderPinwheelIcon } from 'lucide-react';

interface StoryListProps {
  initialStories: Story[];
}

export const StoryList = ({ initialStories }: StoryListProps) => {
  const [stories, setStories] = useState<Story[]>(initialStories);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  console.log({ initialStories });

  const loadMoreStories = useCallback(async () => {
    if (isLoadingMore || !hasMore) return;

    const fetchPage = window.__ENHANCER_AI_FETCH_PAGE__;
    if (!fetchPage) {
      console.error('Fetch page function not available');
      return;
    }

    setIsLoadingMore(true);
    try {
      const nextPage = currentPage + 1;
      const newStories = await fetchPage(nextPage);

      if (newStories.length === 0) {
        setHasMore(false);
      } else {
        setStories((prev) => [...prev, ...newStories]);
        setCurrentPage(nextPage);
      }
    } catch (error) {
      console.error('Error loading more stories:', error);
    } finally {
      setIsLoadingMore(false);
    }
  }, [isLoadingMore, hasMore, currentPage]);

  useEffect(() => {
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isLoadingMore && hasMore) {
          loadMoreStories();
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
  }, [loadMoreStories, isLoadingMore, hasMore]);

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
              <span>Loading more stories...</span>
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
