export enum Difficulty {
  EASY = 'easy',
  MEDIUM = 'medium',
  HARD = 'hard'
}

export enum Topic {
  BACTERIOLOGY = 'bacteriology',
  VIROLOGY = 'virology',
  MYCOLOGY = 'mycology',
  PARASITOLOGY = 'parasitology'
}

export enum QuestionType {
  MCQ = 'mcq',
  IMAGE = 'image',
  FILL_IN_BLANK = 'fill_in_blank',
  MATCHING = 'matching',
  TRUE_FALSE = 'true_false',
  THREE_D = '3d'
}

export interface Question {
  id: string;
  topic: Topic;
  difficulty: Difficulty;
  type: QuestionType;
  prompt: string;
  correctAnswer: any;
  options?: string[]; // For MCQ, Image, T/F
  image?: string; // For image-based
  modelId?: string; // For 3D questions
  feedback: string;
  matchingPairs?: { left: string; right: string }[]; // For matching
}

export interface UserProgress {
  questionId: string;
  level: number; // SRS level (0-5)
  lastReviewed: number; // timestamp
  nextReview: number; // timestamp
  history: {
    timestamp: number;
    correct: boolean;
  }[];
}

export interface QuizConfig {
  topics: Topic[];
  difficulties: Difficulty[];
  questionTypes: QuestionType[];
  count: number;
}
