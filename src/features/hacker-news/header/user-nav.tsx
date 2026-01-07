import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { ALargeSmallIcon } from 'lucide-react';
import { MdOutlineCreate } from 'react-icons/md';

export const UserNav = () => {
  return (
    <div className='flex items-center gap-4'>
      <Button
        variant='ghost'
        size='icon-lg'
        className='cursor-pointer rounded-full group hover:bg-zinc-100 transition-colors p-5'>
        <ALargeSmallIcon className='size-6 text-zinc-500 group-hover:text-zinc-800 transition-colors' />
      </Button>
      <Button className='cursor-pointer bg-transparent border-orange-500 hover:border-orange-600 hover:bg-orange-500 transition-colors  text-zinc-500 hover:text-zinc-100 p-5 py-4.5 group'>
        <MdOutlineCreate className='size-4 text-zinc-500 group-hover:text-zinc-100 transition-colors' />{' '}
        Submit
      </Button>

      <Avatar className='size-10 cursor-pointer'>
        <AvatarImage src='' />
        <AvatarFallback className='bg-orange-500 text-white text-xs'>
          p0
        </AvatarFallback>
      </Avatar>
    </div>
  );
};
