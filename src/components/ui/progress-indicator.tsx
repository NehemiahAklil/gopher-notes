import { motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';

interface ProgressIndicatorProps {
  percentage: number;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export const ProgressIndicator = ({
  percentage,
  size = 'md',
  showLabel = true,
}: ProgressIndicatorProps) => {
  const sizeClasses = {
    sm: 'w-12 h-12',
    md: 'w-16 h-16',
    lg: 'w-20 h-20',
  };

  const strokeWidth = {
    sm: 3,
    md: 4,
    lg: 5,
  };

  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  const getColor = (percentage: number) => {
    if (percentage === 100) return '#10b981'; // green
    if (percentage >= 75) return '#3b82f6'; // blue
    if (percentage >= 50) return '#eab308'; // yellow
    if (percentage >= 25) return '#f97316'; // orange
    return '#ef4444'; // red
  };

  return (
    <div className='relative inline-flex items-center justify-center'>
      <svg
        className={`${sizeClasses[size]} transform -rotate-90`}
        viewBox='0 0 100 100'
      >
        {/* Background circle */}
        <circle
          cx='50'
          cy='50'
          r={radius}
          fill='none'
          stroke='currentColor'
          strokeWidth={strokeWidth[size]}
          className='text-gray-200 dark:text-gray-800'
        />
        {/* Progress circle */}
        <motion.circle
          cx='50'
          cy='50'
          r={radius}
          fill='none'
          stroke={getColor(percentage)}
          strokeWidth={strokeWidth[size]}
          strokeLinecap='round'
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1, ease: 'easeInOut' }}
        />
      </svg>
      <div className='absolute inset-0 flex items-center justify-center'>
        {percentage === 100 ? (
          <CheckCircle2
            className='text-green-500'
            size={size === 'sm' ? 16 : size === 'md' ? 20 : 24}
          />
        ) : showLabel ? (
          <span
            className={`font-bold ${
              size === 'sm'
                ? 'text-xs'
                : size === 'md'
                ? 'text-sm'
                : 'text-base'
            }`}
            style={{ color: getColor(percentage) }}
          >
            {percentage}%
          </span>
        ) : null}
      </div>
    </div>
  );
};

interface ProgressBarProps {
  percentage: number;
  height?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  animated?: boolean;
}

export const ProgressBar = ({
  percentage,
  height = 'md',
  showLabel = true,
  animated = true,
}: ProgressBarProps) => {
  const heightClasses = {
    sm: 'h-2',
    md: 'h-3',
    lg: 'h-4',
  };

  const getProgressColor = (percentage: number) => {
    if (percentage === 100) return 'bg-green-500';
    if (percentage >= 75) return 'bg-blue-500';
    if (percentage >= 50) return 'bg-yellow-500';
    if (percentage >= 25) return 'bg-orange-500';
    return 'bg-red-500';
  };

  return (
    <div className='w-full'>
      {showLabel && (
        <div className='flex justify-between items-center mb-2'>
          <span className='text-sm text-gray-600 dark:text-gray-400'>
            Progress
          </span>
          <span className='text-sm font-semibold'>{percentage}%</span>
        </div>
      )}
      <div
        className={`relative ${heightClasses[height]} bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden`}
      >
        {animated ? (
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className={`h-full ${getProgressColor(percentage)} rounded-full`}
          />
        ) : (
          <div
            className={`h-full ${getProgressColor(percentage)} rounded-full`}
            style={{ width: `${percentage}%` }}
          />
        )}
      </div>
    </div>
  );
};
