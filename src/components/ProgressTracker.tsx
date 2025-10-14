import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  getOverallProgress,
  getAllCategoryProgress,
  resetProgress,
  CategoryProgress,
} from '../utils/progressTracker';
import { Trophy, RotateCcw, TrendingUp } from 'lucide-react';
import SEO from './SEO';

const ProgressTracker = () => {
  const [overallProgress, setOverallProgress] = useState<CategoryProgress>({
    category: 'overall',
    completed: 0,
    total: 0,
    percentage: 0,
  });
  const [categoryProgress, setCategoryProgress] = useState<CategoryProgress[]>(
    []
  );
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const loadProgress = () => {
    setOverallProgress(getOverallProgress());
    setCategoryProgress(getAllCategoryProgress());
  };

  useEffect(() => {
    loadProgress();
  }, []);

  const handleReset = () => {
    resetProgress();
    loadProgress();
    setShowResetConfirm(false);
  };

  const getCategoryDisplayName = (category: string) => {
    return category.replaceAll('_', ' ');
  };

  const getCategoryLink = (category: string) => {
    return `/${category.replaceAll('_', '-')}`;
  };

  const getProgressColor = (percentage: number) => {
    if (percentage === 100) return 'bg-green-500';
    if (percentage >= 75) return 'bg-blue-500';
    if (percentage >= 50) return 'bg-yellow-500';
    if (percentage >= 25) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const getProgressGradient = (percentage: number) => {
    if (percentage === 100) return 'from-green-500 to-emerald-600';
    if (percentage >= 75) return 'from-blue-500 to-cyan-600';
    if (percentage >= 50) return 'from-yellow-500 to-amber-600';
    if (percentage >= 25) return 'from-orange-500 to-red-600';
    return 'from-red-500 to-pink-600';
  };

  return (
    <div className='min-h-screen'>
      <SEO
        title='Progress Tracker | Gopher Notes'
        description='Track your learning progress across all Go programming topics'
        name='Amanuel Chaka'
        type='article'
      />
      <div className='container mx-auto px-4 py-8 dark:text-neutral-300'>
        <div className='max-w-5xl mx-auto'>
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className='mb-12'
          >
            <div className='flex items-center justify-between flex-wrap gap-4'>
              <div className='flex items-center gap-3'>
                <Trophy className='w-8 h-8 text-yellow-500' />
                <h1 className='text-3xl md:text-4xl font-bold'>
                  Your Learning Progress
                </h1>
              </div>
              <button
                onClick={() => setShowResetConfirm(true)}
                className='flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-500 transition-colors duration-200'
              >
                <RotateCcw className='w-4 h-4' />
                Reset Progress
              </button>
            </div>
          </motion.div>

          {/* Overall Progress Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className='mb-12 p-8 rounded-2xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 dark:from-purple-900/20 dark:to-pink-900/20 border border-purple-500/20 dark:border-purple-500/30'
          >
            <div className='flex items-center gap-3 mb-6'>
              <TrendingUp className='w-6 h-6 text-purple-500' />
              <h2 className='text-2xl font-bold'>Overall Progress</h2>
            </div>
            <div className='space-y-4'>
              <div className='flex justify-between items-center'>
                <span className='text-lg'>
                  {overallProgress.completed} of {overallProgress.total} topics
                  completed
                </span>
                <span className='text-3xl font-bold text-purple-500'>
                  {overallProgress.percentage}%
                </span>
              </div>
              <div className='relative h-6 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden'>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${overallProgress.percentage}%` }}
                  transition={{ duration: 1, delay: 0.3 }}
                  className={`h-full bg-gradient-to-r ${getProgressGradient(
                    overallProgress.percentage
                  )} rounded-full`}
                />
              </div>
              {overallProgress.percentage === 100 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className='text-center py-4'
                >
                  <p className='text-xl font-bold text-green-500'>
                    🎉 Congratulations! You've completed all topics! 🎉
                  </p>
                </motion.div>
              )}
            </div>
          </motion.div>

          {/* Category Progress */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h2 className='text-2xl font-bold mb-6'>Progress by Category</h2>
            <div className='grid gap-6 md:grid-cols-2'>
              {categoryProgress.map((category, index) => (
                <motion.div
                  key={category.category}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 * index }}
                >
                  <Link
                    to={getCategoryLink(category.category)}
                    className='block p-6 rounded-xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-gray-800 hover:border-purple-500 dark:hover:border-purple-500 transition-all duration-200 hover:shadow-lg hover:scale-[1.02]'
                  >
                    <div className='space-y-4'>
                      <div className='flex justify-between items-start'>
                        <h3 className='text-lg font-semibold capitalize'>
                          {getCategoryDisplayName(category.category)}
                        </h3>
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-bold text-white ${getProgressColor(
                            category.percentage
                          )}`}
                        >
                          {category.percentage}%
                        </span>
                      </div>
                      <div className='text-sm text-gray-600 dark:text-gray-400'>
                        {category.completed} / {category.total} topics
                      </div>
                      <div className='relative h-3 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden'>
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${category.percentage}%` }}
                          transition={{ duration: 0.8, delay: 0.2 * index }}
                          className={`h-full ${getProgressColor(
                            category.percentage
                          )} rounded-full`}
                        />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Motivational Message */}
          {overallProgress.percentage > 0 &&
            overallProgress.percentage < 100 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className='mt-12 p-6 rounded-xl bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 text-center'
              >
                <p className='text-lg'>
                  {overallProgress.percentage >= 75
                    ? "🚀 You're almost there! Keep up the great work!"
                    : overallProgress.percentage >= 50
                    ? "💪 Great progress! You're halfway through!"
                    : overallProgress.percentage >= 25
                    ? '🌟 Nice start! Keep learning and growing!'
                    : '🎯 Every journey begins with a single step. Keep going!'}
                </p>
              </motion.div>
            )}
        </div>
      </div>

      {/* Reset Confirmation Modal */}
      {showResetConfirm && (
        <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4'>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className='bg-white dark:bg-slate-900 rounded-2xl p-8 max-w-md w-full border border-gray-200 dark:border-gray-800'
          >
            <h3 className='text-2xl font-bold mb-4'>Reset Progress?</h3>
            <p className='text-gray-600 dark:text-gray-400 mb-6'>
              Are you sure you want to reset all your progress? This action
              cannot be undone.
            </p>
            <div className='flex gap-4'>
              <button
                onClick={handleReset}
                className='flex-1 px-4 py-3 rounded-lg bg-red-500 hover:bg-red-600 text-white font-semibold transition-colors'
              >
                Yes, Reset
              </button>
              <button
                onClick={() => setShowResetConfirm(false)}
                className='flex-1 px-4 py-3 rounded-lg bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 font-semibold transition-colors'
              >
                Cancel
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default ProgressTracker;
