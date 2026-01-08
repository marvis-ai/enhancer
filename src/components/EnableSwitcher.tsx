import { useState } from 'react';
import { toast } from 'sonner';

import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

export const EnableSwitcher = ({ domain }: { domain: string | null }) => {
  const getStoredValue = (domain: string | null) => {
    if (domain) {
      const storedValue = localStorage.getItem(domain);
      return storedValue === 'true';
    }
    return false;
  };

  const setEnabledState = (value: boolean) => {
    if (!domain) {
      toast.info('Please select a site to enable enhancement');
      return;
    }

    setEnabled(value);
    localStorage.setItem(domain, value.toString());
  };

  const [enabled, setEnabled] = useState<boolean>(() => getStoredValue(domain));

  return (
    <div className='flex flex-col gap-1'>
      <div className='flex items-center gap-2'>
        <Label className='text-lg text-zinc-700 dark:text-zinc-400'>
          Enable Enhancement
        </Label>
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
          className='text-zinc-400 dark:text-zinc-700 hover:text-zinc-700 dark:hover:text-zinc-100 transition-colors'>
          Current: {domain} →
        </a>
      ) : (
        <p className='text-zinc-400 dark:text-zinc-600 italic'>
          Extension is not available for this site.
        </p>
      )}
    </div>
  );
};
