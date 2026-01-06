export const AppFooter = () => {
  return (
    <footer className='flex justify-center items-center pb-3'>
      <p className='text-zinc-200 dark:text-zinc-800 text-[11px]'>
        &copy; {new Date().getFullYear()} Enhancer AI. Made with{' '}
        <span className='text-pink-500'>♥</span> by{' '}
        <a
          href='https://marvis.ai'
          target='_blank'
          rel='noopener noreferrer'>
          Marvis AI
        </a>
      </p>
    </footer>
  );
};
