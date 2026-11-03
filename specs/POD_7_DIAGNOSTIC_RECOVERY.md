# Pod 7 Specification: Post-Test Diagnostics & Recovery Roadmap

> **Dedicated Branch:** `pod/7-diagnostic-recovery`  
> **Assigned Lead Developer:** Shanzay Fatima  
> **Ownership Scope:** `components/quiz/ExamResultsView.tsx`, `lib/ai/diagnostic.ts`, `app/api/ai/diagnostic/route.ts`, `components/ai/RecoveryRoadmapView.tsx`  
> **Strict Rule:** Touch ONLY files in `components/quiz/ExamResultsView.tsx`, `lib/ai/diagnostic.ts`, `app/api/ai/diagnostic/route.ts`, and `components/ai/RecoveryRoadmapView.tsx`.

---

## 1. Architectural Role
Pod 7 closes the learning loop (**Improve Phase**). Once a student finishes the Main Examination, this vertical:
1. Computes the comprehensive scorecard and topic-by-topic MCQ breakdown.
2. Passes the student's errors to DeepSeek to diagnose underlying weakness patterns.
3. Renders a personalized 3-step Recovery Roadmap with direct action buttons.

---

## 2. File Implementation Blueprints

### File 1: `components/quiz/ExamResultsView.tsx`
- **Props:**
  ```typescript
  import { QuizSessionSummary } from '@/types';

  interface ExamResultsViewProps {
    session: QuizSessionSummary;
    onRetakeTest?: () => void;
    onViewRoadmap?: () => void;
  }
  ```
- **Features:**
  - **Scorecard Header:**
    - Large Circular or Badge Score (e.g. `82%`).
    - Performance Tier Badge:
      - `Mastery Tier: 85%+` (Emerald)
      - `Passing Tier: 70-84%` (Blue)
      - `Needs Reinforcement: <70%` (Rose)
    - Stat grid: Total Questions, Correct Answers, Incorrect Answers, Time Elapsed.
  - **Topic-by-Topic Accuracy Breakdown:**
    - Table or bar chart grouping questions by Chapter and Topic.
    - Each row displays: Chapter Title, Topic Name, Questions Count, and an accuracy progress bar with color-coding (Green for >= 75%, Amber for 50-74%, Red for < 50%).
  - **Question-by-Question Review Accordion:**
    - Expandable list of every question attempted.
    - Shows what the student chose vs the correct option.
    - Displays the official conceptual explanation.

---

### File 2: `lib/ai/diagnostic.ts` & `app/api/ai/diagnostic/route.ts`
Implement DeepSeek post-test diagnostic analysis:
- **Method:** `POST`
- **Request Body:** `{ session: QuizSessionSummary }` (from `@/types`).
- **Prompt Logic:**
  ```text
  You are an expert academic diagnostic engine for business students.
  You are given the student's exam scorecard and a breakdown of which topics and questions they got right or wrong.
  
  Identify their cognitive patterns and produce a targeted recovery plan.
  
  You MUST return ONLY valid JSON matching this schema:
  {
    "sessionId": "string",
    "overallScorePercentage": number,
    "readinessSummary": "2-sentence executive summary of their performance.",
    "weakestTopics": [
      {
        "chapterTitle": "string",
        "topicTitle": "string",
        "accuracyRate": number,
        "recommendedFocus": "Specific concept they need to re-read."
      }
    ],
    "targetedPracticePlan": [
      {
        "stepNumber": 1,
        "title": "Action title (e.g. Revise Chapter 2 Mind Map)",
        "description": "Clear instruction on what concept to clarify.",
        "type": "mindmap_review" | "concept_practice" | "quiz_retest"
      },
      {
        "stepNumber": 2,
        "title": "Action title",
        "description": "Clear instruction.",
        "type": "concept_practice"
      },
      {
        "stepNumber": 3,
        "title": "Action title",
        "description": "Clear instruction.",
        "type": "quiz_retest"
      }
    ]
  }
  ```
- **Response:** JSON matching `PostTestEvaluationReport` from `@/types`.

---

### File 3: `components/ai/RecoveryRoadmapView.tsx`
- **Props:**
  ```typescript
  import { PostTestEvaluationReport } from '@/types';

  interface RecoveryRoadmapViewProps {
    report: PostTestEvaluationReport;
    onStartStep: (stepNumber: number, type: string) => void;
  }
  ```
- **Features:**
  - Header: *"AI Personalized Recovery Roadmap"* with `Sparkles` and `Compass` icon.
  - Subtitle: *"Your custom 3-step action plan to eliminate errors identified in your exam."*
  - **3-Step Interactive Timeline:**
    - **Step 1 Card:** Visual revision card with direct CTA button: *"Open Mind Map"*.
    - **Step 2 Card:** Targeted concept practice card with direct CTA button: *"Practice Weak Topic"*.
    - **Step 3 Card:** Targeted re-test card with direct CTA button: *"Take 5-Question Retest"*.
  - Each step card displays: Step badge, title, detailed AI guidance, and an action button that triggers the recommended mode.

---

## 3. Inter-Pod Handshake & Integration Sync Protocol

| Shared Resource | Originating Pod | How Pod 7 Must Integrate |
| :--- | :--- | :--- |
| **OpenRouter Client** | **Pod 1** (`lib/ai/openrouter.ts`) | Call `callOpenRouterJSON<PostTestEvaluationReport>` to generate the diagnostic output. |
| **Exam Session Input** | **Pod 6** (`app/(student)/quiz/test`) | Receives `QuizSessionSummary` prop passed into `<ExamResultsView session={summary} />`. |
| **Roadmap Step 1 Link** | **Pod 3** (`/visual-maps`) | If step type is `mindmap_review`, CTA button navigates to `/visual-maps?chapter=${chapterId}`. |
| **Roadmap Step 2 Link** | **Pod 5** (`/quiz/practice`) | If step type is `concept_practice`, CTA button navigates to `/quiz/practice?topic=${topicId}`. |

---

## 4. Verification & Acceptance Criteria
1. Run `npx tsc --noEmit` — must pass with **0 errors**.
2. Scorecard calculates accuracy percentage and topic accuracy rates accurately.
3. DeepSeek diagnostic endpoint returns a structured `PostTestEvaluationReport`.
4. Recovery Roadmap renders 3 interactive action cards with functional navigation triggers.
