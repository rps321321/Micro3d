import { UserProgress } from '../types';

// Simplified Leitner System
export const updateProgress = (
  currentProgress: UserProgress | undefined,
  questionId: string,
  correct: boolean
): UserProgress => {
  const now = Date.now();
  const history = [...(currentProgress?.history || []), { timestamp: now, correct }];
  
  let level = currentProgress?.level || 0;
  if (correct) {
    level = Math.min(level + 1, 5);
  } else {
    level = Math.max(level - 1, 0);
  }

  // Intervals: Day 1, Day 3, Day 7, Day 14, Day 30
  const intervals = [1, 3, 7, 14, 30];
  const nextDays = intervals[level] || 1;
  const nextReview = now + nextDays * 24 * 60 * 60 * 1000;

  return {
    questionId,
    level,
    lastReviewed: now,
    nextReview,
    history
  };
};

export const getQuestionsForReview = (allQuestions: any[], progress: Record<string, UserProgress>) => {
  const now = Date.now();
  return allQuestions.filter(q => {
    const p = progress[q.id];
    if (!p) return true; // New questions
    return p.nextReview <= now; // Due for review
  });
};
