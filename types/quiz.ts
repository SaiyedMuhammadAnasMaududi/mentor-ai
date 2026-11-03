/**
 * Shared Quiz Data Contract
 * Jointly defined by Team Anas (AI) and Team Talha (Student Interface).
 */

export type QuizMode = 'practice' | 'testing' | 'screening';

export interface MCQOption {
  id: string; // e.g. "A", "B", "C", "D"
  text: string;
}

export interface Question {
  id: string;
  chapterId: string;
  chapterTitle: string;
  topicId: string;
  topicTitle: string;
  questionText: string;
  options: MCQOption[];
  correctOptionId: string;
  explanation: string;
  businessTerms?: string[]; // Related business terms for AI side panel lookup
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface AnswerSubmission {
  questionId: string;
  selectedOptionId: string;
  studentReasoning?: string; // Captured during screening/practice mode
  timeSpentSeconds: number;
}

export interface TopicResult {
  chapterId: string;
  chapterTitle: string;
  topicId: string;
  topicTitle: string;
  totalQuestions: number;
  correctQuestions: number;
  accuracyRate: number; // 0 to 100
  questionResults: {
    questionId: string;
    isCorrect: boolean;
    selectedOptionId: string;
    correctOptionId: string;
  }[];
}

export interface QuizSessionSummary {
  sessionId: string;
  mode: QuizMode;
  startedAt: string;
  completedAt: string;
  totalQuestions: number;
  score: number; // Number of correct questions
  scorePercentage: number;
  topicBreakdown: TopicResult[];
}
