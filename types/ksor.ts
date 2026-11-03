/**
 * KSOR (Knowledge Source & Organization Repository) & MCP Contract
 * Powers syllabus guides, verified textbook content, and AgentFactory MCP integration.
 */

import { Question } from './quiz';

export interface KSORDocument {
  id: string;
  title: string;
  chapterId: string;
  chapterTitle: string;
  sourceType: 'guide' | 'textbook' | 'curriculum' | 'agentfactory_mcp';
  contentMarkdown: string;
  keyTerms: string[];
  lastUpdated: string;
}

export interface KSORConceptTerm {
  term: string;
  chapterId: string;
  plainEnglishDefinition: string;
  realWorldAnalogy: string;
  examTrapWarning: string;
  formula?: string;
  relatedTerms: string[];
}

export interface MCPContentQuery {
  serverUrl?: string; // Default: https://agentfactory.panaversity.org/
  chapterId?: string;
  topic?: string;
  term?: string;
  action: 'get_questions' | 'get_guide' | 'explain_term' | 'sync_syllabus';
}

export interface MCPContentResponse {
  success: boolean;
  source: 'agentfactory_mcp' | 'local_ksor';
  data: {
    questions?: Question[];
    guideMarkdown?: string;
    termDefinition?: KSORConceptTerm;
  };
  timestamp: string;
}
