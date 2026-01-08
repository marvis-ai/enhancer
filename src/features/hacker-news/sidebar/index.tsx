import { Button } from '@/components/ui/button';
import { TrendingUpIcon } from 'lucide-react';

export const HNSidebar = () => {
  return (
    <aside className='space-y-4'>
      {/* Create Post Button */}
      <Button className='w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold h-11'>
        Submit
      </Button>

      {/* Top Users */}
      <div className='bg-white rounded-lg border border-zinc-200 p-4'>
        <h3 className='font-semibold text-zinc-900 mb-4'>Top Users</h3>
        <div className='space-y-3'>
          {[
            { name: 'Cr0s', points: '15.4k' },
            { name: 'alphaomega', points: '11.1k' },
            { name: 'Diomedes', points: '8.4k' },
            { name: 'You', points: '234' },
          ].map((user, idx) => (
            <div
              key={idx}
              className='flex items-center justify-between'>
              <div className='flex items-center gap-2'>
                <div className='w-8 h-8 rounded-full bg-linear-to-br from-orange-400 to-pink-400 flex items-center justify-center text-white text-xs font-semibold'>
                  {user.name.slice(0, 2)}
                </div>
                <span className='text-sm font-medium text-zinc-700'>
                  {user.name}
                </span>
              </div>
              <div className='flex items-center gap-1 text-orange-500'>
                <span className='text-sm font-semibold'>{user.points}</span>
                <TrendingUpIcon className='w-3.5 h-3.5' />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Guidelines */}
      <div className='bg-white rounded-lg border border-zinc-200 p-4'>
        <h3 className='font-semibold text-zinc-900 mb-2'>Guidelines</h3>
        <p className='text-xs text-zinc-600 leading-relaxed'>
          Large App 2022 Y Combinator
        </p>
      </div>
    </aside>
  );
};
