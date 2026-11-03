# Pod 4 Specification: Socratic Screening & Readiness Engine

> **Dedicated Branch:** `pod/4-socratic-screening`  
> **Assigned Lead Developer:** Alisha Zehra  
> **Ownership Scope:** `app/api/ai/screen/route.ts`, `app/api/ai/readiness/route.ts`, `components/ai/SocraticReasoningDialog.tsx`, `app/(student)/quiz/screen/page.tsx`, `lib/ai/readiness.ts`  
> **Strict Rule:** Touch ONLY files in `app/api/ai/screen/`, `app/api/ai/readiness/`, `components/ai/Socratic*`, `app/(student)/quiz/screen/`, and `lib/ai/readiness.ts`.

---

## 1. Architectural Role
Pod 4 powers the **Socratic Screening Phase** (as defined in Ubaid's workflow recording). Unlike standard multiple-choice testing that only checks if an answer is right or wrong, this engine demands that students articulate the *reasoning* behind their choice in a dedicated text field. It critiques thinking errors, corrects misconceptions, and calculates a readiness score that unlocks the Main Test.

---

## 2. File Implementation Blueprints

### File 1: `app/api/ai/screen/route.ts`
Implement the DeepSeek-powered reasoning critic:
- **Method:** `POST`
- **Request Body (`ReasoningEvaluationRequest` from `@/types`):**
  ```typescript
  {
    questionId: string;
    questionText: string;
    selectedOptionText: string;
    correctOptionText: string;
    isCorrect: boolean;
    studentReasoning: string;
  }
  ```
- **System Prompt:**
  ```text
  You are an elite Socratic University Professor in Business Administration. 
  Your job is NOT to simply tell the student whether they were right or wrong.
  Your job is to rigorously evaluate their UNDERLYING REASONING.
  
  Evaluate if their thinking was:
  - "sound": Logical, correct application of the business concept.
  - "partially-correct": Right intuition but missing a key condition or slightly flawed premise.
  - "flawed": Guessed blindly, fell for a distractor, or applied the wrong formula/framework.
  
  You MUST return ONLY valid JSON matching this schema:
  {
    "scoreRating": "sound" | "partially-correct" | "flawed",
    "constructiveFeedback": "2-3 sentences evaluating the student's thinking directly.",
    "misconceptionIdentified": "Short statement of the mistake they made (or null if sound).",
    "correctReasoningWalkthrough": "Clear explanation of how a top executive analyzes this problem.",
    "conceptSummary": "1 sentence defining the underlying core principle."
  }
  ```
- **Response:** JSON matching `ReasoningEvaluationResponse` from `@/types`.

---

### File 2: `lib/ai/readiness.ts` & `app/api/ai/readiness/route.ts`
Implement readiness determination:
- **Input:** Array of completed screening attempts with `scoreRating` (`sound`, `partially-correct`, `flawed`).
- **Algorithm (Strict 75% Rule from Audio Spec):**
  1. Score calculation: `sound` = 100%, `partially-correct` = 50%, `flawed` = 0%.
  2. Compute average `readinessScore` (0 to 100).
  3. Condition: If `totalQuestions >= 5` AND `readinessScore >= 75`:
     - `isReadyForMainTest = true`
     - `recommendedAction = 'ready_for_test'`
     - `mentorNote`: *"Outstanding critical reasoning! You achieved >= 75% conceptual mastery and have unlocked the Main Examination."*
  4. Otherwise (readinessScore < 75%):
     - `isReadyForMainTest = false`
     - `recommendedAction = 'revise_chapters'`
     - `mentorNote`: *"Your reasoning readiness is currently below 75%. Review the chapter mind maps and practice key concepts before attempting the final exam."*
- **Response:** Returns `ReadinessAssessment` from `@/types`.

---

### File 3: `components/ai/SocraticReasoningDialog.tsx` & Inline Reasoning Card
- **Design Requirement (Per Ubaid Audio):**
  - Allows both **Inline Reasoning Mode** (text field placed directly beneath the MCQ options on the question card) and Modal Mode.
  - Text field label: *"Explain the reasoning behind your answer selection before submitting:"*
  - Placeholder: *"I selected this because when buyer switching costs are low, supplier pricing power decreases..."*
  - "Submit Answer & Reasoning" button triggers `/api/ai/screen`.
  - Once submitted, reveals the AI evaluation:
    - Rating Badge: `Sound Reasoning (Green)`, `Partially Correct (Amber)`, or `Flawed (Red)`.
    - AI Explanation Box: Details where the student's thinking was accurate or identifying the flaw.
    - Official Concept Summary.

---

### File 4: `app/(student)/quiz/screen/page.tsx`
- **Features:**
  - Screening loop running 5–8 diagnostic MCQs.
  - Mounts the `MentorSidePanel` (from Pod 5) in floating / drawer mode so students can look up business terms during screening.
  - Progress indicator at top: *"Question 3 of 6 • Socratic Diagnostic"*.
  - Inline reasoning text field under each question.
  - On final question completion:
    - Computes readiness score against the **75% threshold**.
    - Saves the `ReadinessAssessment` into `lib/storage/student-memory.ts`.
    - Displays celebratory readiness card with CTA: *"Enter Main Examination"* (if >= 75%) or *"Review Mind Maps"* (if < 75%).

---

## 3. Verification & Acceptance Criteria
1. Run `npx tsc --noEmit` — must pass with **0 errors**.
2. Submitting reasoning calls `/api/ai/screen` and parses the DeepSeek response into `ReasoningEvaluationResponse`.
3. Displays loading indicator while AI generates critique.
4. When readiness is calculated, it updates `student-memory` and directs student properly.
