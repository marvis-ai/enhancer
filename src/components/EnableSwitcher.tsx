import { useEffect, useState } from 'react';

import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

export const EnableSwitcher = () => {
  const [siteUrl, setSiteUrl] = useState<string | null>(null);
  const [enabled, setEnabled] = useState<boolean>(false);

  useEffect(() => {
    // Get the current active tab's URL
    chrome.tabs.query(
      { active: true, currentWindow: true },
      (tabs: chrome.tabs.Tab[]) => {
        if (tabs[0]?.url) {
          const url = new URL(tabs[0].url);
          const domain = url.hostname;
          setSiteUrl(domain);
          setEnabled(localStorage.getItem(domain) === 'true');
        }
      },
    );
  }, []);

  const setEnabledState = (value: boolean) => {
    if (!siteUrl) return;

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
      <a
        href='https://news.ycombinator.com'
        target='_blank'
        className='text-zinc-400 dark:text-zinc-100 hover:text-zinc-700 transition-colors'>
        Visit Hacker News →
      </a>
    </div>
  );
};
