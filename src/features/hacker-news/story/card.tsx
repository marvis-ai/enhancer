import { motion } from 'motion/react';

import { Button } from '@/components/ui/button';
import {
  MessageCircleIcon,
  ClockIcon,
  UserIcon,
  BookmarkIcon,
  LinkIcon,
} from 'lucide-react';
import { FaCaretUp, FaCaretDown } from 'react-icons/fa';

interface StoryCardProps {
  story: Story;
}

export const StoryCard = ({ story }: StoryCardProps) => {
  // TODO: test this work
  const referralUrl = story.url.split('?')[0]
    ? `${story.url}&utm_source==enhancer-ai`
    : `${story.url}?utm_source==enhancer-ai`;

  return (
    <motion.article
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      className='bg-white/90 dark:bg-primary/90 rounded-md p-4 transition-all flex items-center gap-4'>
      <div className='flex items-center justify-center w-12 h-full'>
        <p className='text-zinc-600 dark:text-zinc-400 text-lg font-serif text-center'>
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
              className='text-xl font-semibold text-zinc-900 hover:text-orange-600 transition-colors block mb-2 leading-snug cursor-pointer'>
              {story.title}
            </a>

            {/* Metadata */}
            <div className='flex items-center gap-3 text-sm text-zinc-600 mb-2'>
              <div className='flex items-center gap-1'>
                <UserIcon className='w-3.5 h-3.5' />
                <span>{story.user}</span>
              </div>

              <div className='flex items-center gap-1'>
                <ClockIcon className='w-3.5 h-3.5' />
                <span>{story.time}</span>
              </div>

              {story.domain && (
                <a
                  href={story.url}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='flex items-center gap-1 text-orange-600 hover:text-orange-800 transition-colors'>
                  <LinkIcon className='w-3.5 h-3.5' />
                  <span>{story.domain}</span>
                </a>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className='flex items-center gap-2'>
            {story.commentsUrl && (
              <a
                href={story.commentsUrl}
                target='_blank'
                rel='noopener noreferrer'
                className='flex items-center gap-1.5 py-1 text-sm text-zinc-600 hover:bg-zinc-100 rounded transition-colors'>
                <MessageCircleIcon className='w-3.5 h-3.5' />
                <span>{story.commentsCount} comments</span>
              </a>
            )}

            <Button className='flex items-center gap-1.5 px-2 py-1 text-sm text-zinc-600 hover:bg-zinc-100 rounded transition-colors'>
              <BookmarkIcon className='size-4' />
              <span>Save</span>
            </Button>
          </div>
        </div>

        {/* Vote Section */}
        <div className='shrink-0 w-16 flex flex-col items-center gap-1 pt-1'>
          <Button
            className='cursor-pointer group'
            size='icon'
            variant='ghost'>
            <FaCaretUp className='size-6 text-zinc-300 group-hover:text-orange-500' />
          </Button>
          <p className='flex flex-col items-center justify-center group'>
            <span className='text-xl font-serif text-zinc-700 group-hover:text-orange-500 transition-colors text-center'>
              {story.points > 1000
                ? `${(story.points / 1000).toFixed(1)}k`
                : story.points}{' '}
            </span>
            <span className='text-[9px] text-zinc-300 text-center'>Points</span>
          </p>
          <Button
            className='cursor-pointer group'
            size='icon'
            variant='ghost'>
            <FaCaretDown className='size-6 text-zinc-300 group-hover:text-zinc-600' />
          </Button>
        </div>
      </div>
    </motion.article>
  );
};
