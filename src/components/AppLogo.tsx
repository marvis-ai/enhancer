import { cn } from '@/lib/utils';
import { SnailIcon } from 'lucide-react';

type Props = {
  enhancedFor?: string;
  className?: string;
};

export const AppLogo = ({ enhancedFor, className }: Props) => {
  return (
    <div className='flex flex-col gap-1 border-b border-zinc-200/90 dark:border-zinc-800/900 border-dashed pb-4'>
      <div className='flex gap-2'>
        <SnailIcon className='size-9 text-pink-500' />
        <h1 className='text-3xl font-thin flex flex-col gap-2 text-zinc-700 dark:text-zinc-300'>
          Enhancer AI
        </h1>
      </div>
      {enhancedFor ? (
        <div className='flex justify-end items-baseline gap-2 place-content-end'>
          <span className='text-gray-400 font-serif dark:text-gray-300 text-lg font-normal italic'>
            for
          </span>
          <span
            className={cn(
              'text-gray-400 dark:text-gray-600 text-base font-semibold cursor-pointer hover:text-gray-800 transition-colors italic',
              className,
            )}>
            {enhancedFor}
          </span>
        </div>
      ) : null}
      <span className='sr-only'>Enhancer AI</span>
    </div>
  );
};
