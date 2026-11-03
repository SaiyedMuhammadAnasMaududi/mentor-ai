/**
 * Shared Mentor AI Contract
 * Jointly defined by Team Anas (AI) and Team Talha (Student Interface).
 */

import { TopicResult } from './quiz';

export interface ReasoningEvaluationRequest {
  questionId: string;
  questionText: string;
  selectedOptionText: string;
  correctOptionText: string;
  isCorrect: boolean;
  studentReasoning: string;
}

export interface ReasoningEvaluationResponse {
  scoreRating: 'flawed' | 'partially-correct' | 'sound';
  constructiveFeedback: string;
  misconceptionIdentified?: string;
  correctReasoningWalkthrough: string;
  conceptSummary: string;
}

export interface BusinessTermExplanationRequest {
  term: string;
  contextSentence?: string;
  chapterTitle?: string;
}

export interface BusinessTermExplanationResponse {
  term: string;
  definition: string;
  plainEnglishAnalogy: string;
  examRelevanceTips: string;
  relatedConcepts: string[];
}

export interface ReadinessAssessment {
  isReadyForMainTest: boolean;
  readinessScore: number; // 0 to 100
  strengths: string[];
  weakAreas: string[];
  recommendedAction: 'revise_chapters' | 'more_screening' | 'ready_for_test';
  mentorNote: string;
}

export interface PostTestEvaluationReport {
  sessionId: string;
  overallScorePercentage: number;
  readinessSummary: string;
  topicBreakdown: TopicResult[];
  weakestTopics: {
    chapterTitle: string;
    topicTitle: string;
    accuracyRate: number;
    recommendedFocus: string;
  }[];
  targetedPracticePlan: {
    stepNumber: number;
    title: string;
    description: string;
    type: 'mindmap_review' | 'concept_practice' | 'quiz_retest';
  }[];
}
