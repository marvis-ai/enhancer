import { useEffect, useState } from 'react';

import { Toaster } from 'sonner';

import { AppLogo } from '@/components/AppLogo';
import { EnableSwitcher } from '@/components/EnableSwitcher';
import { EnhancedSites } from '@/lib/constants';

const App = () => {
  const [siteUrl, setSiteUrl] = useState<string | null>(null);

  useEffect(() => {
    // Get the current active tab's URL
    chrome.tabs.query(
      { active: true, currentWindow: true },
      (tabs: chrome.tabs.Tab[]) => {
        if (tabs[0]?.url) {
          const url = new URL(tabs[0].url);
          const domain = url.hostname;
          setSiteUrl(domain);
        }
      },
    );
  }, []);

  // Derive enhanced site directly from siteUrl - no need for separate state
  const enhanced = siteUrl
    ? EnhancedSites.find((site) => site.domain === siteUrl) || null
    : null;

  return (
    <>
      <main className='min-w-sm max-w-md h-auto flex flex-col p-4 py-6 gap-8'>
        <AppLogo
          enhancedFor={enhanced?.title}
          className={enhanced?.className}
        />

        <EnableSwitcher siteUrl={enhanced?.domain} />
      </main>
      <Toaster position='bottom-center' />
    </>
  );
};

export default App;
