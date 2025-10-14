import { Link, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import SEO from './SEO';
import { categories, topics } from '../utils/lists';
import Breadcrumb from './ui/breadcrumb';
import checkRoute from '../utils/checkRoute';
import { capitalizeWords } from '../utils/capitalizedWord';
import { isTopicCompleted, getCategoryProgress } from '../utils/progressTracker';
import { CheckCircle2 } from 'lucide-react';
import { ProgressBar } from './ui/progress-indicator';

const TopicList = () => {
  const { category } = useParams<{ category: string }>();
  const [completedTopics, setCompletedTopics] = useState<Set<string>>(new Set());
  const [categoryProgress, setCategoryProgress] = useState({ completed: 0, total: 0, percentage: 0 });

  // check if route is valid
  checkRoute();

  // get topics for the selected category
  const topicList =
    topics[category?.replaceAll('-', '_') as keyof typeof topics] || [];

  // create a metadata description for the category
  const descSEO = categories.filter((prevCategory) =>
    prevCategory.link.replace('/', '') === category
      ? prevCategory.description
      : null
  )[0].description;

  // Load completion status for all topics in this category
  useEffect(() => {
    if (category) {
      const categoryKey = category.replaceAll('-', '_');
      const completed = new Set<string>();
      
      topicList.forEach((topic) => {
        if (isTopicCompleted(categoryKey, topic)) {
          completed.add(topic);
        }
      });
      
      setCompletedTopics(completed);
      setCategoryProgress(getCategoryProgress(category));
    }
  }, [category, topicList]);

  return (
    <div className='container mx-auto py-1 leading-relaxed pb-12 dark:text-neutral-300 max-w-3xl mt-12 w-11/12'>
      <SEO
        title={`${capitalizeWords(category!)} | Gopher notes`}
        description={descSEO}
        name='Amanuel Chaka'
        type='article'
      />

      <div>
        {' '}
        <Breadcrumb category={category} />
      </div>

      <h1 className='my-10 z-50'>{category?.replaceAll('-', ' ')}</h1>
      
      {/* Category Progress Bar */}
      <div className='mb-8'>
        <ProgressBar 
          percentage={categoryProgress.percentage} 
          height='md'
          showLabel={true}
        />
        <p className='text-sm text-gray-600 dark:text-gray-400 mt-2'>
          {categoryProgress.completed} of {categoryProgress.total} topics completed
        </p>
      </div>

      <ul className='grid md:grid-cols-2 gap-6 list-none'>
        {topicList.map((topic) => {
          const isCompleted = completedTopics.has(topic);
          
          return (
            <Link
              className={`card relative ${isCompleted ? 'border-green-500 dark:border-green-500' : ''}`}
              to={`/${category}/${topic}`}
              key={topic}
            >
              <div className='flex items-center justify-between gap-2'>
                <span className='flex-1'>{topic.split('-').join(' ')}</span>
                {isCompleted && (
                  <CheckCircle2 className='w-5 h-5 text-green-500 flex-shrink-0' />
                )}
              </div>
            </Link>
          );
        })}
      </ul>
    </div>
  );
};

export default TopicList;
