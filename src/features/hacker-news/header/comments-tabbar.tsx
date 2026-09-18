import { useState, useEffect } from 'react';
import { CalendarIcon, ClockIcon, TrendingUpIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';

import { cn } from '@/lib/utils';

interface CommentsTabbarProps {
  onNavigate: (section: string) => void;
}

export const CommentsTabbar = ({ onNavigate }: CommentsTabbarProps) => {
  // Determine active tab based on current URL
  const getActiveTab = () => {
    const path = window.location?.pathname || '';
    const search = window.location?.search || '';

    if (path === '/bestcomments') {
      return search.includes('h=24') ? 'best24comments' : 'bestcomments';
    }
    return 'newcomments'; // default for /newcomments
  };

  const [activeTab, setActiveTab] = useState(getActiveTab());

  // Update active tab when URL changes
  useEffect(() => {
    const handleUrlChange = () => {
      setActiveTab(getActiveTab());
    };

    // Listen for popstate events (browser back/forward)
    window.addEventListener('popstate', handleUrlChange);

    return () => {
      window.removeEventListener('popstate', handleUrlChange);
    };
  }, []);

  const handleTabClick = (section: string, url: string) => {
    setActiveTab(section);

    // Update URL without full refresh
    window.history.pushState({}, '', url);

    // Navigate to the specific section
    onNavigate(section);
  };

  return (
    <div className='flex items-center gap-2 mb-4'>
      <Button
        variant='ghost'
        className={cn(
          'gap-2 cursor-pointer',
          activeTab === 'newcomments'
            ? 'bg-white/75 dark:bg-zinc-900/75 text-primary-foreground'
            : '',
        )}
        onClick={() => handleTabClick('newcomments', '/newcomments')}>
        <ClockIcon className='size-4' />
        New
      </Button>

      <Button
        variant='ghost'
        className={cn(
          'gap-2 cursor-pointer',
          activeTab === 'bestcomments'
            ? 'bg-white/75 dark:bg-zinc-900/75 text-primary-foreground'
            : '',
        )}
        onClick={() => handleTabClick('bestcomments', '/bestcomments')}>
        <TrendingUpIcon className='size-4' />
        Best
      </Button>

      <Button
        variant='ghost'
        className={cn(
          'gap-2 cursor-pointer',
          activeTab === 'best24comments'
            ? 'bg-white/75 dark:bg-zinc-900/75 text-primary-foreground'
            : '',
        )}
        onClick={() => handleTabClick('best24comments', '/bestcomments?h=24')}>
        <CalendarIcon className='size-4' />
        24h
      </Button>
    </div>
  );
};
