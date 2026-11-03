# Pod 5 Specification: Practice Quiz & Mentor AI Side-Panel

> **Dedicated Branch:** `pod/5-practice-quiz-mentor`  
> **Assigned Lead Developer:** Muskan Fayyaz  
> **Ownership Scope:** `app/(student)/quiz/practice/page.tsx`, `components/ai/MentorSidePanel.tsx`, `app/api/ai/explain/route.ts`  
> **Strict Rule:** Touch ONLY files in `app/(student)/quiz/practice/`, `components/ai/MentorSidePanel.tsx`, and `app/api/ai/explain/`.

---

## 1. Architectural Role
Pod 5 powers the **Mentor AI Side-Panel** and the **Practice Mode**. As described in Ubaid's audio recording, this component acts as a live intelligent chatbot / drawer that students can open while attempting questions (in Practice Mode AND in Screening Mode) to clarify difficult business terminology, decrypt formulas, and ask conceptual doubts.

---

## 2. File Implementation Blueprints

### File 1: `app/api/ai/explain/route.ts`
Implement DeepSeek business terms & concept explainer:
- **Method:** `POST`
- **Request Body (`BusinessTermExplanationRequest` from `@/types`):**
  ```typescript
  {
    term: string;
    contextSentence?: string;
    chapterTitle?: string;
  }
  ```
- **System Prompt:**
  ```text
  You are the Mentor AI — an encouraging, clear, and world-class MBA tutor.
  When a student asks about a business concept, term, or acronym, you explain it so clearly that a beginner grasps it instantly while retaining exam-level precision.
  
  You MUST return ONLY valid JSON matching this schema:
  {
    "term": "string (the clean term name)",
    "definition": "Clear, jargon-free 2-sentence explanation.",
    "plainEnglishAnalogy": "A relatable everyday analogy (e.g. comparing working capital to fuel in a car tank).",
    "examRelevanceTips": "How exam questions usually test this term and common traps to avoid.",
    "relatedConcepts": ["Term 1", "Term 2", "Term 3"]
  }
  ```
- **Response:** JSON matching `BusinessTermExplanationResponse` from `@/types`.

---

### File 2: `components/ai/MentorSidePanel.tsx`
- **Reusability Notice:** This component will be mounted on both `/quiz/practice` (Practice Mode) and `/quiz/screen` (Screening Mode).
- **Props:**
  ```typescript
  interface MentorSidePanelProps {
    isOpen: boolean;
    onToggle: () => void;
    activeQuestionTerms?: string[];
    onSelectTerm?: (term: string) => void;
  }
  ```
- **Features:**
  - Drawer sliding in from the right edge with smooth CSS transition.
  - Header: *"Mentor AI • Concept Assistant"* with close button (`X`).
  - **Quick Concept Chips:**
    - Displays chips for terms in the active question (e.g. `[EBITDA]`, `[Operating Leverage]`).
    - Clicking a chip immediately triggers an AI explanation lookup.
  - **Custom Search / Chat Input Bar:**
    - Input: *"Ask about any term or concept..."* with `Search` / `Sparkles` icon.
    - Allows students to freely ask questions in a chatbot-like fashion.
  - **AI Explanation Card Display:**
    - Section 1: Definition with icon.
    - Section 2: Real-World Analogy in a highlighted amber quote box (`Lightbulb` icon).
    - Section 3: Exam Traps callout (`AlertCircle` icon).
    - Section 4: Related Concept tags.

---

### File 3: `app/(student)/quiz/practice/page.tsx`
- **Features:**
  - Untimed practice player loading questions from `lib/quiz/questions-pool.ts`.
  - Chapter and topic selector filter at top.
  - Question Card:
    - Renders question text.
    - Identifies business terms and renders them as interactive badges or dotted underlines.
    - Option cards (A, B, C, D) with immediate answer reveal on click (Green for correct, Red for chosen incorrect).
    - Explanation accordion expands automatically once answered.
  - Floating Action Button (bottom right):
    - Floating pill badge: *"Ask Mentor AI"* with `Bot` icon that toggles the `MentorSidePanel`.
  - Navigation buttons: `Previous`, `Next Question`, and `Restart Practice`.

---

## 3. Verification & Acceptance Criteria
1. Run `npx tsc --noEmit` — must pass with **0 errors**.
2. Clicking a business term chip or asking a question calls `/api/ai/explain` and renders the structured response cards.
3. Side panel opens and closes cleanly on both desktop and mobile without horizontal body shift.
4. Practice mode handles option selection with immediate feedback without timer pressure.
