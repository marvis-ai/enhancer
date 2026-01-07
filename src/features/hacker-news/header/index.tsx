import { Button } from '@/components/ui/button';

import { UserNav } from '@/features/hacker-news/header/user-nav';
import { HNLogo } from '@/features/hacker-news/header/hn-logo';

interface HNHeaderProps {
  onNavigate?: (section: string) => void;
  currentSection?: string;
}

export const HNHeader = ({
  onNavigate,
  currentSection = 'popular',
}: HNHeaderProps) => {
  const navItems = [
    { id: 'new', label: 'new' },
    { id: 'past', label: 'past' },
    { id: 'comments', label: 'comments' },
    { id: 'ask', label: 'ask' },
    { id: 'show', label: 'show' },
    { id: 'jobs', label: 'jobs' },
    { id: 'submit', label: 'submit' },
  ];

  return (
    <header className='bg-white/90 dark:bg-primary/90 backdrop-blur-xs border-b border-zinc-200 sticky top-0 z-50'>
      <div className='max-w-7xl mx-auto px-6 py-4'>
        <div className='flex items-center justify-between gap-6'>
          <div className='flex items-center gap-4'>
            {/* Logo */}
            <HNLogo />
            {/* Navigation Menu */}
            <nav className='flex items-center gap-1'>
              {navItems.map((item) => (
                <Button
                  key={item.id}
                  onClick={() =>
                    window.history.pushState(null, '', `/${item.id}`)
                  }
                  variant='ghost'
                  className='cursor-pointer text-zinc-500 hover:text-zinc-800 transition-colors'>
                  {item.label}
                </Button>
              ))}
            </nav>
          </div>

          {/* Right Side Actions */}
          <UserNav />
        </div>
      </div>
    </header>
  );
};
