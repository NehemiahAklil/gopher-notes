import { categories } from '../utils/lists';
import { HoverEffect } from './ui/card-hover-effect';

const CategoryList = () => {
  return (
    <div className='container mx-auto px-4 py-1 dark:text-neutral-200 mt-16'>
      <div className='mt-4 md:mt-10'>
        <div className='mb-12 text-center'>
          <h1 className='text-6xl font-bold tracking-tight text-foreground sm:text-5xl'>
            Gopher Notes
          </h1>
          <p className='mt-4 text-gray-300 text-md'>
            Learn the Go programming language for free in your browser.
          </p>
        </div>

        <HoverEffect items={categories} />
      </div>
    </div>
  );
};

export default CategoryList;
