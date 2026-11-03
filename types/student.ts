/**
 * Shared Student Profile & Memory Contract
 * Maintained by Team Talha and consumed by Team Anas
 */

import { QuizSessionSummary } from './quiz';
import { ReadinessAssessment, PostTestEvaluationReport } from './mentor';

export interface StudentMemory {
  totalQuizzesTaken: number;
  totalPracticeQuestions: number;
  overallAccuracyRate: number;
  masteredTopics: string[]; // Topic IDs
  troubleTopics: string[]; // Topic IDs that need reinforcement
  recentReports: PostTestEvaluationReport[];
  latestReadinessAssessment?: ReadinessAssessment;
}

export interface StudentProfile {
  id: string;
  name: string;
  enrolledCourse: string;
  joinedAt: string;
  memory: StudentMemory;
  quizHistory: QuizSessionSummary[];
}
