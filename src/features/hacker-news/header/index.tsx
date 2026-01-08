import { Button } from '@/components/ui/button';

import { UserNav } from '@/features/hacker-news/header/user-nav';
import { HNLogo } from '@/features/hacker-news/header/hn-logo';

interface HNHeaderProps {
  onNavigate?: (section: string) => void;
  currentSection?: string;
}

export const HNHeader = ({
  onNavigate,
  currentSection = 'home',
}: HNHeaderProps) => {
  const navItems = [
    { id: 'new', label: 'new', path: '/newest' },
    { id: 'past', label: 'past', path: '/front' },
    { id: 'comments', label: 'comments', path: '/newcomments' },
    { id: 'ask', label: 'ask', path: '/ask' },
    { id: 'show', label: 'show', path: '/show' },
    { id: 'jobs', label: 'jobs', path: '/jobs' },
  ];

  const handleNavClick = (item: { id: string; path: string }) => {
    window.history.pushState(null, '', item.path);
    onNavigate?.(item.id);
  };

  const handleLogoClick = () => {
    window.history.pushState(null, '', '/');
    onNavigate?.('home');
  };

  return (
    <header className='bg-white/90 dark:bg-primary/90 backdrop-blur-xs border-b border-zinc-200 sticky top-0 z-50'>
      <div className='max-w-7xl mx-auto px-6 py-4'>
        <div className='flex items-center justify-between gap-6'>
          <div className='flex items-center gap-4'>
            {/* Logo */}
            <HNLogo onNavigate={handleLogoClick} />
            {/* Navigation Menu */}
            <nav className='flex items-center gap-1'>
              {navItems.map((item) => (
                <Button
                  key={item.id}
                  onClick={() => handleNavClick(item)}
                  variant='ghost'
                  className={`cursor-pointer transition-colors ${
                    currentSection === item.id
                      ? 'text-zinc-800 font-medium'
                      : 'text-zinc-500 hover:text-zinc-800'
                  }`}>
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
