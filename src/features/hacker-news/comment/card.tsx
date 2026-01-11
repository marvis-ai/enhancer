import { motion } from 'motion/react';

import { Button } from '@/components/ui/button';
import { ClockIcon, UserIcon } from 'lucide-react';
import { FaCaretUp } from 'react-icons/fa';

interface CommentCardProps {
  comment: HNComment;
}

export const CommentCard = ({ comment }: CommentCardProps) => {
  return (
    <motion.article
      whileTap={{ scale: 0.99 }}
      className='bg-white/75 dark:bg-zinc-900/75 backdrop-blur-xs rounded-md p-4 transition-all overflow-hidden border border-white dark:border-zinc-900 group'>
      {/* Header with username and timestamp */}
      <div className='flex items-center justify-between mb-3'>
        <div className='flex items-center gap-3 text-xs text-zinc-500'>
          <div className='flex items-center gap-1'>
            <UserIcon className='size-3' />
            <span className='font-medium'>
              {comment.username || 'Unknown User'}
            </span>
          </div>
          <div className='flex items-center gap-1'>
            <ClockIcon className='size-3 text-zinc-500' />
            <span>{comment.timeAgo || 'Unknown time'}</span>
          </div>
        </div>
      </div>

      <div className='flex items-start'>
        {/* Comment body */}
        {comment.body && (
          <div
            className='flex-1 text-base! text-zinc-600! dark:text-zinc-400! mb-4 leading-relaxed'
            dangerouslySetInnerHTML={{ __html: comment.body }}
          />
        )}
        {/* Vote Section */}
        <div className='shrink-0 w-24 flex flex-col items-center justify-center gap-0.5 group'>
          <Button
            className='cursor-pointer'
            size='icon'
            variant='ghost'>
            <FaCaretUp className='size-6 text-zinc-300 group-hover:text-orange-500' />
          </Button>
        </div>
      </div>

      {/* Linked title */}
      {comment.title && (
        <div className='flex gap-1.5 items-center border-l-4 border-zinc-500/50 pl-3'>
          <span className='text-zinc-300 text-xs'>on:</span>
          <a
            href={comment.titleUrl}
            title={comment.title}
            className='text-sm text-zinc-500! visited:text-zinc-300! hover:text-orange-500! dark:text-zinc-500! dark:visited:text-zinc-600! transition-colors block leading-snug cursor-pointer'>
            {comment.title}
          </a>
        </div>
      )}
    </motion.article>
  );
};
