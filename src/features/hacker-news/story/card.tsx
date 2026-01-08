import { motion } from 'motion/react';

import { Button } from '@/components/ui/button';
import {
  MessageCircleIcon,
  ClockIcon,
  UserIcon,
  BookmarkIcon,
  LinkIcon,
  SparklesIcon,
  EyeOffIcon,
} from 'lucide-react';
import { FaCaretUp } from 'react-icons/fa';

interface StoryCardProps {
  story: Story;
}

export const StoryCard = ({ story }: StoryCardProps) => {
  const referralUrl = story.url.split('?')[1]
    ? `${story.url}&utm_source=enhancer-ai`
    : `${story.url}?utm_source=enhancer-ai`;

  return (
    <motion.article
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      className='bg-white/75 dark:bg-zinc-900/75 backdrop-blur-xs rounded-md p-4 transition-all flex items-center gap-4 overflow-hidden border border-white dark:border-zinc-900 group'>
      <div className='w-12 h-full flex items-center justify-center'>
        <p className='text-zinc-600 dark:text-zinc-400 text-xl font-serif text-center'>
          {story.rank}
        </p>
      </div>
      <div className='flex-1 flex gap-4'>
        {/* Content Section */}
        <div className='flex flex-col w-full justify-between'>
          <div className='gap-2'>
            {/* Title */}
            <a
              href={referralUrl}
              target='_blank'
              rel='noopener noreferrer'
              title={story.title}
              className='text-2xl text-zinc-700! visited:text-zinc-500! hover:text-orange-600! transition-colors block mb-2 leading-snug cursor-pointer'>
              {story.title}
            </a>

            {/* Metadata */}
            <div className='flex items-center gap-3 text-xs text-zinc-500 mb-2'>
              <div className='flex items-center gap-1'>
                <UserIcon className='size-3' />
                <span>{story.user}</span>
              </div>

              <div className='flex items-center gap-1'>
                <ClockIcon className='size-3 text-zinc-500' />
                <span>{story.time}</span>
              </div>

              {story.domain && (
                <a
                  href={referralUrl}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='flex items-center gap-1 '>
                  <LinkIcon className='size-3 text-zinc-500' />
                  <span className=' text-orange-500 hover:text-orange-800 transition-colors'>
                    {story.domain}
                  </span>
                </a>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className='flex items-center gap-2'>
            {story.commentsUrl && (
              <Button
                variant='ghost'
                onClick={(e) => {
                  e.preventDefault();
                  window.open('comment: ', story.commentsUrl);
                }}
                className='gap-1.5 hover:bg-zinc-100 rounded-md transition-colors cursor-pointer'>
                <MessageCircleIcon className='size-4 text-zinc-500' />
                {story.commentsCount > 0 ? (
                  <span className='text-zinc-500 text-sm'>
                    {story.commentsCount} comments
                  </span>
                ) : (
                  <span className='text-zinc-500 text-sm'>discuss</span>
                )}
              </Button>
            )}

            <Button
              variant='ghost'
              className='gap-1.5 hover:bg-zinc-100 rounded-md transition-colors cursor-pointer'>
              <EyeOffIcon className='size-4 text-zinc-500' />
              <span className='text-zinc-500 text-sm'>hide</span>
            </Button>

            <Button
              variant='ghost'
              onClick={(e) => {
                e.preventDefault();
                console.log('save: ', e);
              }}
              className='gap-1.5 hover:bg-zinc-100 rounded-md transition-colors cursor-pointer'>
              <BookmarkIcon className='size-4 text-zinc-500' />
              <span className='text-zinc-500 text-sm'>save</span>
            </Button>
            <Button
              variant='ghost'
              className='gap-1.5 hover:bg-zinc-100 rounded-md cursor-pointer opacity-0 group-hover:opacity-100 transition-all duration-300'>
              <SparklesIcon className='size-4 text-fuchsia-600' />
              <span className='text-zinc-500 text-sm'>sparkle</span>
            </Button>
          </div>
        </div>

        {/* Vote Section */}
        <div className='shrink-0 w-24 flex flex-col items-center gap-0.5 group'>
          <Button
            className='cursor-pointer'
            size='icon'
            variant='ghost'>
            <FaCaretUp className='size-6 text-zinc-300 group-hover:text-orange-500' />
          </Button>
          <p className='flex flex-col items-center justify-center'>
            <span className='text-3xl font-serif text-zinc-700 group-hover:text-orange-500 transition-colors text-center'>
              {story.points > 1000
                ? `${(story.points / 1000).toFixed(1)}k`
                : story.points}{' '}
            </span>
            <span className='text-[9px] text-zinc-400 text-center'>points</span>
          </p>
        </div>
      </div>
    </motion.article>
  );
};
