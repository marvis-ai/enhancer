import { AppLogo } from '@/components/AppLogo';
import { EnableSwitcher } from '@/components/EnableSwitcher';

const App = () => {
  return (
    <main className='min-w-sm max-w-md h-auto flex flex-col p-4 py-6 gap-8'>
      <AppLogo
        enhanceFor='Hacker News'
        className='text-orange-500'
      />

      <EnableSwitcher />
    </main>
  );
};

export default App;
