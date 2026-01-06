import { useEffect, useState } from 'react';

import { Toaster } from '@/components/ui/sonner';
import { AppLogo } from '@/components/AppLogo';
import { EnableSwitcher } from '@/components/EnableSwitcher';
import { AppFooter } from '@/components/AppFooter';

import { getCurrentTabUrl } from '@/lib/helpers';

import { EnhancedSites } from '@/lib/constants';

const App = () => {
  const [siteUrl, setSiteUrl] = useState<string | null>(null);

  useEffect(() => {
    getCurrentTabUrl()
      .then(({ domain }) => {
        setSiteUrl(domain);
      })
      .catch((error) => {
        console.error('Failed to get current tab URL:', error);
        setSiteUrl(null);
      });
  }, []);

  // Derive enhanced site directly from siteUrl
  const enhanced = siteUrl
    ? EnhancedSites.find((site) => site.domain === siteUrl) || null
    : null;

  return (
    <>
      <div className='min-w-sm w-full max-w-md h-auto flex flex-col gap-12 px-6 pt-8'>
        <main className='flex flex-col gap-8'>
          <AppLogo
            enhancedFor={enhanced?.title}
            className={enhanced?.className}
          />
          <EnableSwitcher />
        </main>
        <AppFooter />
      </div>
      <Toaster position='bottom-center' />
    </>
  );
};

export default App;
