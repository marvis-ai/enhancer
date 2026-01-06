import { MessageCircle, ArrowUpCircle, Clock, User } from 'lucide-react';

import type { Story } from '@/features/hacker-news/types';

interface StoryCardProps {
  story: Story;
}

export const StoryCard = ({ story }: StoryCardProps) => {
  return (
    <article className='bg-white rounded-lg shadow-sm border border-gray-200 p-5 hover:shadow-md transition-shadow'>
      <div className='flex gap-4'>
        <div className='shrink-0 flex flex-col items-center gap-1'>
          <span className='text-2xl font-bold text-gray-300 w-8 text-center'>
            {story.rank}
          </span>
          <div className='flex flex-col items-center gap-1 text-orange-500'>
            <ArrowUpCircle className='w-5 h-5' />
            <span className='text-sm font-semibold'>{story.points}</span>
          </div>
        </div>

        <div className='flex-1 min-w-0'>
          <a
            href={story.url}
            target='_blank'
            rel='noopener noreferrer'
            className='text-lg font-semibold text-gray-900 hover:text-orange-600 transition-colors block mb-1 leading-snug'>
            {story.title}
          </a>

          {story.domain && (
            <a
              href={story.url}
              target='_blank'
              rel='noopener noreferrer'
              className='text-sm text-gray-500 hover:text-gray-700 inline-block mb-3'>
              ({story.domain})
            </a>
          )}

          <div className='flex items-center gap-4 text-sm text-gray-600'>
            <div className='flex items-center gap-1.5'>
              <User className='w-4 h-4' />
              <span className='font-medium'>{story.user}</span>
            </div>

            <div className='flex items-center gap-1.5'>
              <Clock className='w-4 h-4' />
              <span>{story.time}</span>
            </div>

            {story.commentsUrl && (
              <a
                href={story.commentsUrl}
                target='_blank'
                rel='noopener noreferrer'
                className='flex items-center gap-1.5 hover:text-orange-600 transition-colors ml-auto'>
                <MessageCircle className='w-4 h-4' />
                <span className='font-medium'>
                  {story.commentsCount > 0
                    ? `${story.commentsCount} comments`
                    : 'discuss'}
                </span>
              </a>
            )}
          </div>
        </div>
      </div>
    </article>
  );
};
