# Pod 2 Specification: Student Dashboard & Progress Center

> **Dedicated Branch:** `pod/2-student-dashboard`  
> **Assigned Lead Developer:** Laiba Imran  
> **Ownership Scope:** `app/(student)/dashboard/page.tsx`, `components/dashboard/RevisionCard.tsx`, `components/dashboard/ReadinessBanner.tsx`, `components/dashboard/QuickStatCard.tsx`  
> **Strict Rule:** Touch ONLY files in `app/(student)/dashboard/` and `components/dashboard/`. Do NOT touch `lib/ai/` or `app/api/`.

---

## 1. Architectural Role
Pod 2 is the learner's primary gateway. It welcomes the student, visualizes their progress metrics, provides direct links to chapter mind maps for revision, and displays whether they are qualified to unlock the Main Examination.

---

## 2. File Implementation Blueprints

### File 1: `components/dashboard/QuickStatCard.tsx`
- **Props:**
  ```typescript
  interface QuickStatCardProps {
    title: string;
    value: string | number;
    subtitle?: string;
    icon: React.ComponentType<{ className?: string }>;
    accentColor: 'indigo' | 'emerald' | 'amber' | 'rose';
  }
  ```
- **Features:** Clean Tailwind card with subtle hover scale, display icon in rounded container, large stat number, and trend indicator.

---

### File 2: `components/dashboard/RevisionCard.tsx`
- **Props:**
  ```typescript
  interface RevisionCardProps {
    chapterId: string;
    title: string;
    description: string;
    topicCount: number;
    masteryPercentage?: number;
    onExploreMindMap: (chapterId: string) => void;
  }
  ```
- **Features:**
  - Displays chapter title and description.
  - Progress bar representing chapter mastery (0% to 100%).
  - Button with Lucide icon `Network` / `GitBranch`: "Explore Mind Map" navigating to `/visual-maps?chapter=${chapterId}`.

---

### File 3: `components/dashboard/ReadinessBanner.tsx`
- **Props:**
  ```typescript
  import { ReadinessAssessment } from '@/types';

  interface ReadinessBannerProps {
    assessment?: ReadinessAssessment;
    onStartScreening: () => void;
    onEnterExam: () => void;
  }
  ```
- **Features:**
  - **State A (Main Test Ready - `isReadyForMainTest === true`):**
    - Vibrant emerald card with celebratory icon (`Sparkles` or `Trophy`).
    - Title: "Main Exam Unlocked!"
    - Readiness Score: `assessment.readinessScore}% Concept Mastery`.
    - CTA: "Enter Main Examination" button with pulse ring animation.
  - **State B (Not Ready / Needs Screening):**
    - Amber/Navy card with `ShieldAlert` or `BookOpen` icon.
    - Title: "Pre-Exam Screening Required".
    - AI Mentor Note: Displays `assessment?.mentorNote` or default *"Complete the Socratic Screening Quiz to validate your reasoning before attempting the final exam."*
    - CTA: "Take Screening Quiz" button leading to `/quiz/screen`.

---

### File 4: `app/(student)/dashboard/page.tsx`
- **Page Layout:**
  1. **Hero Header:**
     - Student greeting: *"Welcome back, Scholar"* with enrolled course badge (*"Business Administration & Management"*).
  2. **Top Readiness Banner:** Mounts `<ReadinessBanner />` at the very top.
  3. **4-Card Metric Grid:**
     - Total Quizzes Completed (`BookCheck` icon)
     - Overall Accuracy Rate (`TrendingUp` icon)
     - Mastered Topics Count (`CheckCircle2` icon)
     - Areas Needing Focus (`AlertTriangle` icon)
  4. **Revision & Mind Maps Section:**
     - Section Header: *"Revise Chapters with Visual Mind Maps"*
     - Grid of 4 `<RevisionCard />` items for Chapters 1 through 4.
  5. **Quick Launchers:**
     - Card 1: **"Socratic Screening Quiz"** (Evaluate reasoning & unlock test).
     - Card 2: **"Practice Mode"** (Untimed questions with active AI Mentor side panel).
     - Card 3: **"Main Examination"** (Strict timed exam conditions).
  6. **Recent Quiz History Table:**
     - Displays past attempts with Date, Mode (`Practice`, `Screening`, `Test`), Score %, and Review link.

---

## 3. Inter-Pod Handshake & Integration Sync Protocol

To ensure seamless integration upon merging:

| Shared Resource | Originating Pod | How Pod 2 Must Integrate |
| :--- | :--- | :--- |
| **Student Memory** | **Pod 1** (`lib/storage/student-memory.ts`) | Call `getStudentProfile()` inside `useEffect` to populate stats, recent quiz history, and `latestReadinessAssessment`. |
| **Chapter Metadata** | **Pod 1** (`lib/quiz/questions-pool.ts`) | Import `CHAPTERS_METADATA` to dynamically render the 4 revision cards. |
| **Screening Link** | **Pod 4** (`/quiz/screen`) | "Take Screening Quiz" button navigates to `/quiz/screen`. |
| **Mind Map Link** | **Pod 3** (`/visual-maps`) | Revision cards navigate to `/visual-maps?chapter=${chapterId}`. |
| **Exam Link** | **Pod 6** (`/quiz/test`) | "Enter Main Examination" navigates to `/quiz/test` (disabled if `isReadyForMainTest !== true`). |

### Safe Mock Fallback (For isolated branch development):
If `lib/storage/student-memory.ts` is not yet merged into your branch, define a local fallback:
```typescript
const mockProfile = {
  name: "Business Scholar",
  memory: {
    totalQuizzesTaken: 3,
    overallAccuracyRate: 78,
    masteredTopics: ["SWOT", "Five Forces"],
    troubleTopics: ["Working Capital"],
    latestReadinessAssessment: {
      isReadyForMainTest: false,
      readinessScore: 65,
      mentorNote: "Complete 2 more screening questions to unlock the main exam."
    }
  },
  quizHistory: []
};
```

---

## 4. Verification & Acceptance Criteria
1. Run `npx tsc --noEmit` — must pass with **0 errors**.
2. Renders gracefully on both desktop (1080p) and mobile screens (Tailwind responsive grid).
3. Connects to `lib/storage/student-memory.ts` via `getStudentProfile()` inside `useEffect` (SSR-safe).
4. If no history exists, displays clean empty-state defaults without crashing.
