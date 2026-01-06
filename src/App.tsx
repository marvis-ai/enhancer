import { useEffect, useMemo, useState } from 'react';

import { Toaster } from '@/components/ui/sonner';
import { AppLogo } from '@/components/AppLogo';
import { EnableSwitcher } from '@/components/EnableSwitcher';
import { AppFooter } from '@/components/AppFooter';

import { getCurrentTabUrl } from '@/lib/helpers';

import { EnhancedSites } from '@/lib/constants';

const App = () => {
  const [domain, setDomain] = useState<string | null>(null);

  useEffect(() => {
    getCurrentTabUrl()
      .then(({ domain }) => {
        setDomain(domain);
      })
      .catch((error) => {
        console.error('Failed to get current tab URL:', error);
        setDomain(null);
      });
  }, []);

  // Derive enhanced site from siteUrl, useMemo to prevent re-renders
  const enhanced = useMemo(() => {
    return domain
      ? EnhancedSites.find((site) => site.domain === domain) || null
      : null;
  }, [domain]);

  return (
    <>
      <div className='min-w-sm w-full max-w-md h-auto flex flex-col gap-12 px-6 pt-8'>
        <main className='flex flex-col gap-8'>
          <AppLogo
            enhancedFor={enhanced?.title}
            className={enhanced?.className}
          />
          <EnableSwitcher
            key={domain}
            domain={domain}
          />
        </main>
        <AppFooter />
      </div>
      <Toaster position='bottom-center' />
    </>
  );
};

export default App;
