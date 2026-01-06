import { useEffect, useState } from 'react';
import { toast } from 'sonner';

import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { getCurrentTabUrl } from '@/lib/helpers';

export const EnableSwitcher = () => {
  const [domain, setDomain] = useState<string | null>(null);
  const [enabled, setEnabled] = useState<boolean>(false);

  useEffect(() => {
    getCurrentTabUrl()
      .then(({ domain: fetchedDomain }) => {
        setDomain(fetchedDomain);
        if (fetchedDomain) {
          const storedValue = localStorage.getItem(fetchedDomain);
          setEnabled(storedValue === 'true');
        }
      })
      .catch((error) => {
        console.error('Failed to get current tab URL:', error);
        setDomain(null);
      });
  }, []);

  const setEnabledState = (value: boolean) => {
    if (!domain) {
      toast.info('Please select a site to enable enhancement');
      return;
    }

    setEnabled(value);
    localStorage.setItem(domain, value.toString());
  };

  return (
    <div className='flex flex-col gap-1'>
      <div className='flex items-center gap-2'>
        <Label className='text-lg text-zinc-700'>Enable Enhancement</Label>
        <Switch
          className='cursor-pointer data-checked:bg-pink-600'
          checked={enabled}
          onCheckedChange={setEnabledState}
        />
      </div>
      {domain ? (
        <a
          href={`https://${domain}`}
          target='_blank'
          className='text-zinc-400 dark:text-zinc-100 hover:text-zinc-700 transition-colors'>
          Current: {domain} →
        </a>
      ) : (
        <p className='text-zinc-400 dark:text-zinc-100 italic'>
          Extension is not available for this site.
        </p>
      )}
    </div>
  );
};
