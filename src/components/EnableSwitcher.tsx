import { useState } from 'react';

import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';

type Props = {
  siteUrl?: string;
};

export const EnableSwitcher = ({ siteUrl }: Props) => {
  const [enabled, setEnabled] = useState<boolean>(false);

  const setEnabledState = (value: boolean) => {
    if (!siteUrl) {
      toast.info('Please select a site to enable enhancement');
      return;
    }

    setEnabled(value);
    localStorage.setItem(siteUrl, value.toString());
  };

  return (
    <div className='flex flex-col gap-1'>
      <div className='flex items-center gap-2'>
        <Label className='text-lg text-zinc-800'>Enable Enhancement</Label>
        <Switch
          className='cursor-pointer data-checked:bg-pink-600'
          checked={enabled}
          onCheckedChange={setEnabledState}
        />
      </div>
      {siteUrl ? (
        <a
          href={`https://${siteUrl}`}
          target='_blank'
          className='text-zinc-400 dark:text-zinc-100 hover:text-zinc-700 transition-colors'>
          Visit {siteUrl} →
        </a>
      ) : null}
    </div>
  );
};
