import { cn } from '@/lib/utils';
import { SnailIcon } from 'lucide-react';

type Props = {
  enhancedFor?: string;
  className?: string;
};

export const AppLogo = ({ enhancedFor, className }: Props) => {
  return (
    <div className='flex flex-1 gap-2 items-center'>
      <SnailIcon className='size-8 text-pink-500' />
      <h1 className='text-2xl font-bold flex items-center gap-2 text-zinc-800 dark:text-zinc-200'>
        Enhancer AI
        {enhancedFor ? (
          <>
            <span className='text-gray-300 dark:text-gray-100 text-lg font-normal'>
              for
            </span>
            <span
              className={cn(
                'text-gray-400 dark:text-gray-200 text-base font-semibold cursor-pointer hover:text-gray-400 transition-colors italic',
                className,
              )}>
              {enhancedFor}
            </span>
          </>
        ) : null}
      </h1>
      <span className='sr-only'>Enhancer AI</span>
    </div>
  );
};
