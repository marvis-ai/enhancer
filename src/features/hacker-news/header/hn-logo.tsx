import { Button } from '@/components/ui/button';

interface HNLogoProps {
  onNavigate?: () => void;
}

export const HNLogo = ({ onNavigate }: HNLogoProps) => {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    window.history.pushState(null, '', '/');
    onNavigate?.();
  };

  return (
    <Button
      variant='ghost'
      onClick={handleClick}
      className='flex items-center gap-2 shrink-0'>
      <div className='bg-orange-500 text-white font-bold text-xl w-8 h-8 flex items-center justify-center rounded'>
        Y
      </div>
      <h1 className='text-zinc-900 text-lg font-semibold'>
        <span className='text-zinc-600'>Hacker News</span>
      </h1>
    </Button>
  );
};
