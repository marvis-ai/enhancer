import { StoryCard } from '@/features/hacker-news/StoryCard';

interface StoryListProps {
  stories: Story[];
}

export const StoryList = ({ stories }: StoryListProps) => {
  if (stories.length === 0) {
    return (
      <div className='text-center py-12 text-gray-500'>No stories found</div>
    );
  }

  return (
    <div className='space-y-4'>
      {stories.map((story) => (
        <StoryCard
          key={story.id}
          story={story}
        />
      ))}
    </div>
  );
};
