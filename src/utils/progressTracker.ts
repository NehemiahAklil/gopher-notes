import { topics } from './lists';

export interface TopicProgress {
  category: string;
  topic: string;
  completedAt: string;
}

export interface CategoryProgress {
  category: string;
  completed: number;
  total: number;
  percentage: number;
}

// Get all completed topics from localStorage
export const getCompletedTopics = (): TopicProgress[] => {
  const stored = localStorage.getItem('completedTopics');
  return stored ? JSON.parse(stored) : [];
};

// Mark a topic as completed
export const markTopicAsCompleted = (category: string, topic: string): void => {
  const completedTopics = getCompletedTopics();
  
  // Check if already completed
  const exists = completedTopics.some(
    (t) => t.category === category && t.topic === topic
  );
  
  if (!exists) {
    completedTopics.push({
      category,
      topic,
      completedAt: new Date().toISOString(),
    });
    localStorage.setItem('completedTopics', JSON.stringify(completedTopics));
  }
};

// Mark a topic as incomplete
export const markTopicAsIncomplete = (category: string, topic: string): void => {
  const completedTopics = getCompletedTopics();
  const filtered = completedTopics.filter(
    (t) => !(t.category === category && t.topic === topic)
  );
  localStorage.setItem('completedTopics', JSON.stringify(filtered));
};

// Check if a topic is completed
export const isTopicCompleted = (category: string, topic: string): boolean => {
  const completedTopics = getCompletedTopics();
  return completedTopics.some(
    (t) => t.category === category && t.topic === topic
  );
};

// Get progress for a specific category
export const getCategoryProgress = (category: string): CategoryProgress => {
  const categoryKey = category.replaceAll('-', '_');
  const categoryTopics = topics[categoryKey as keyof typeof topics] || [];
  const completedTopics = getCompletedTopics();
  
  const completed = categoryTopics.filter((topic) =>
    completedTopics.some(
      (t) => t.category === categoryKey && t.topic === topic
    )
  ).length;
  
  const total = categoryTopics.length;
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
  
  return {
    category: categoryKey,
    completed,
    total,
    percentage,
  };
};

// Get overall progress across all categories
export const getOverallProgress = (): CategoryProgress => {
  const allCategories = Object.keys(topics);
  let totalCompleted = 0;
  let totalTopics = 0;
  
  allCategories.forEach((category) => {
    const progress = getCategoryProgress(category.replaceAll('_', '-'));
    totalCompleted += progress.completed;
    totalTopics += progress.total;
  });
  
  const percentage = totalTopics > 0 ? Math.round((totalCompleted / totalTopics) * 100) : 0;
  
  return {
    category: 'overall',
    completed: totalCompleted,
    total: totalTopics,
    percentage,
  };
};

// Get all category progress
export const getAllCategoryProgress = (): CategoryProgress[] => {
  const allCategories = Object.keys(topics);
  return allCategories.map((category) =>
    getCategoryProgress(category.replaceAll('_', '-'))
  );
};

// Reset all progress
export const resetProgress = (): void => {
  localStorage.removeItem('completedTopics');
};
