export const HNHeader = () => {
  return (
    <header className='bg-orange-500 shadow-md sticky top-0 z-50'>
      <div className='max-w-5xl mx-auto px-4 py-3'>
        <div className='flex items-center gap-3'>
          <div className='bg-white text-orange-500 font-bold text-xl w-10 h-10 flex items-center justify-center rounded'>
            Y
          </div>
          <h1 className='text-white text-xl font-semibold'>Hacker News</h1>
        </div>
      </div>
    </header>
  );
};
