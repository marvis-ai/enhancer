import { useState } from 'react';
import { Calendar, TrendingUp } from 'lucide-react';

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';

export const Tabbar = () => {
  const [sortBy, setSortBy] = useState('popular');

  return (
    <div className='flex items-center justify-between mb-4'>
      <Tabs
        value={sortBy}
        onValueChange={setSortBy}
        className='w-auto'>
        <TabsList className='bg-white border border-zinc-200'>
          <TabsTrigger
            value='popular'
            className='gap-1.5'>
            <TrendingUp className='w-4 h-4' />
            Popular
          </TabsTrigger>
          <TabsTrigger value='recent'>Recent</TabsTrigger>
          <TabsTrigger value='most-commented'>Most commented</TabsTrigger>
          <TabsTrigger value='most-saved'>Most saved</TabsTrigger>
        </TabsList>
      </Tabs>

      <Button
        variant='ghost'
        size='sm'
        className='gap-1.5'>
        <Calendar className='w-4 h-4' />
        Date
      </Button>
    </div>
  );
};
