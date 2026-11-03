# Pod 6 Specification: Main Examination Engine & Strict Exam Controls

> **Dedicated Branch:** `pod/6-testing-exam-engine`  
> **Assigned Lead Developer:** Ubaid Raza  
> **Ownership Scope:** `app/(student)/quiz/test/page.tsx`, `components/quiz/QuestionPalette.tsx`, `components/quiz/Timer.tsx`, `components/quiz/ProgressBar.tsx`  
> **Strict Rule:** Touch ONLY files in `app/(student)/quiz/test/` and `components/quiz/QuestionPalette.tsx`, `Timer.tsx`, `ProgressBar.tsx`. Do NOT touch `components/ai/` or `app/api/`.

---

## 1. Architectural Role
Pod 6 powers the **Main Examination (Testing Quiz)**. This is the real battle-test where students are evaluated under strict, timed exam conditions. There are no AI side panels, no instant hints, and no second chances during the test.

---

## 2. File Implementation Blueprints

### File 1: `components/quiz/Timer.tsx`
- **Props:**
  ```typescript
  interface TimerProps {
    initialSeconds: number; // e.g. 1200 (20 minutes)
    onExpire: () => void;
    isPaused?: boolean;
  }
  ```
- **Features:**
  - Formats remaining time as `MM:SS`.
  - Icon: `Clock`.
  - Normal state: Dark slate / neutral badge.
  - Warning state (< 5 minutes): Yellow pulse ring.
  - Critical state (< 1 minute): Bright red with flashing border.
  - When time reaches `00:00`, automatically fires `onExpire()` to auto-submit the exam.

---

### File 2: `components/quiz/QuestionPalette.tsx`
- **Props:**
  ```typescript
  interface QuestionPaletteProps {
    totalQuestions: number;
    currentIndex: number;
    answeredIndices: Set<number>;
    flaggedIndices: Set<number>;
    onSelectQuestion: (index: number) => void;
  }
  ```
- **Features:**
  - Clean grid of numbered tiles (e.g. 1 to 20).
  - Status color coding:
    - **Current Question:** Indigo ring + bold text.
    - **Answered:** Solid Emerald green background.
    - **Flagged for Review:** Amber yellow badge with bookmark icon.
    - **Unanswered:** Light gray / slate border.
  - Legend indicator at bottom: `[• Answered] [• Flagged] [• Unanswered]`.
  - Clicking any number jumps directly to that question.

---

### File 3: `components/quiz/ProgressBar.tsx`
- **Props:**
  ```typescript
  interface ProgressBarProps {
    current: number;
    total: number;
  }
  ```
- **Features:**
  - Smooth animated percentage bar.
  - Label: `Question ${current + 1} of ${total} (${Math.round(((current + 1) / total) * 100)}%)`.

---

### File 4: `app/(student)/quiz/test/page.tsx`
- **Features:**
  - Exam session lifecycle:
    1. **Pre-Exam Confirmation Screen:**
       - Verifies readiness flag from memory (`latestReadinessAssessment?.isReadyForMainTest`). If false, displays a warning that screening is recommended, with a "Proceed Anyway" confirmation.
       - Warning: *"Strict Timed Exam. 20 Questions • 20 Minutes • No AI side panel allowed."*
       - "Start Examination Now" button.
    2. **Active Exam View:**
       - Sticky Header: Timer + Progress Bar + "Submit Exam" button.
       - Center Column: Current MCQ card with option radio buttons.
       - Action row: `Previous`, `Next`, and `Flag for Review` toggle button (`Bookmark` icon).
       - Right Sidebar (or drawer on mobile): `QuestionPalette`.
    3. **Submit Confirmation Modal:**
       - Triggered by "Submit Exam" or timer expiry.
       - Summary dialog: Shows total answered (e.g. 18/20), flagged for review (2/20), and unanswered (0/20).
       - Buttons: "Return to Exam" or "Confirm Final Submission".
    4. **Post-Submission Handler:**
       - Calculates `TopicResult` array and `QuizSessionSummary` matching `@/types`.
       - Stores session via `recordQuizSession(summary)` from `lib/storage/student-memory.ts`.
       - Renders Pod 7's `<ExamResultsView session={summary} />` or redirects to results view.

---

## 3. Inter-Pod Handshake & Integration Sync Protocol

| Shared Resource | Originating Pod | How Pod 6 Must Integrate |
| :--- | :--- | :--- |
| **Questions Pool** | **Pod 1** (`lib/quiz/questions-pool.ts`) | Call `getQuestionsForTest(20, weakTopics)` to populate exam questions. |
| **Readiness Check** | **Pod 1 / Pod 4** (`lib/storage/student-memory.ts`) | Check `getStudentProfile().memory.latestReadinessAssessment?.isReadyForMainTest` on mount. |
| **Session Recording** | **Pod 1** (`lib/storage/student-memory.ts`) | Call `recordQuizSession(summary)` immediately upon exam submission. |
| **Results Handshake** | **Pod 7** (`components/quiz/ExamResultsView.tsx`) | Pass the generated `QuizSessionSummary` to `<ExamResultsView session={summary} />` upon completion. |

---

## 4. Verification & Acceptance Criteria
1. Run `npx tsc --noEmit` — must pass with **0 errors**.
2. Timer counts down continuously every second and triggers `onExpire` at `00:00`.
3. QuestionPalette updates instantly when an answer is selected or flagged.
4. Final submission properly constructs a complete `QuizSessionSummary` object with topic breakdown.
