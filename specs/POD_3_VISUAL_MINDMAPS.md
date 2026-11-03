# Pod 3 Specification: Visual Mind Maps & Chapter Flowcharts

> **Dedicated Branch:** `pod/3-visual-mindmaps`  
> **Assigned Lead Developer:** Ameena  
> **Ownership Scope:** `app/(student)/visual-maps/page.tsx`, `components/visual/MindMapViewer.tsx`, `components/visual/ChapterFlowchart.tsx`, `lib/visual/mindmap-data.ts`  
> **Strict Rule:** Touch ONLY files in `app/(student)/visual-maps/`, `components/visual/`, and `lib/visual/`.

---

## 1. Architectural Role
Pod 3 powers the first phase of the user journey (**Revise**). Instead of forcing students to read dense textbook paragraphs, it provides an interactive visual hierarchy of chapters, topics, business terminology, and operational flowcharts.

---

## 2. File Implementation Blueprints

### File 1: `lib/visual/mindmap-data.ts`
Export structured visual data representing the curriculum:
```typescript
export interface MindMapNode {
  id: string;
  label: string;
  category: 'chapter' | 'topic' | 'term' | 'principle';
  description: string;
  keyTakeaway: string;
  examTip?: string;
  children?: MindMapNode[];
}

export interface ChapterFlowStep {
  stepNumber: number;
  title: string;
  description: string;
  decisionRule?: string;
  outcomeSuccess: string;
  outcomeFailure: string;
}

export const MINDMAP_CHAPTERS: { [chapterId: string]: MindMapNode } = {
  "ch-1": {
    id: "ch-1-root",
    label: "Strategic Management",
    category: "chapter",
    description: "Formulation and implementation of major goals and initiatives taken by top management.",
    keyTakeaway: "Competitive advantage stems from unique resource allocation and market positioning.",
    children: [
      {
        id: "top-swot",
        label: "SWOT & External Scanning",
        category: "topic",
        description: "Aligning internal strengths/weaknesses with external market threats/opportunities.",
        keyTakeaway: "Match strengths to opportunities while mitigating vulnerabilities.",
        children: [
          {
            id: "term-core-competency",
            label: "Core Competency",
            category: "term",
            description: "A harmonized combination of multiple resources and skills that distinguish a firm in the marketplace.",
            keyTakeaway: "Must be rare, valuable, difficult to imitate, and non-substitutable (VRIN framework).",
            examTip: "Often tested through scenarios asking why a temporary advantage eroded."
          }
        ]
      },
      {
        id: "top-five-forces",
        label: "Porter's Five Forces",
        category: "topic",
        description: "Framework to analyze industry structure and determine market attractiveness.",
        keyTakeaway: "The collective strength of the 5 forces determines the profit potential of an industry.",
        children: [
          {
            id: "term-switching-costs",
            label: "Switching Costs",
            category: "term",
            description: "The fixed costs buyers face when changing suppliers or software.",
            keyTakeaway: "High switching costs reduce buyer power and increase customer retention.",
            examTip: "Exam questions often link switching costs to customer lock-in strategies."
          }
        ]
      }
    ]
  },
  "ch-2": {
    id: "ch-2-root",
    label: "Financial Analysis & Working Capital",
    category: "chapter",
    description: "Measuring firm liquidity, profitability, and operational financial health.",
    keyTakeaway: "Cash flow timing dictates solvency more urgently than paper profitability.",
    children: []
  },
  "ch-3": {
    id: "ch-3-root",
    label: "Marketing Dynamics & Positioning",
    category: "chapter",
    description: "Market segmentation, customer lifetime value, and brand equity.",
    keyTakeaway: "Value proposition must align with targeted customer pain points.",
    children: []
  },
  "ch-4": {
    id: "ch-4-root",
    label: "Operations & Supply Chain",
    category: "chapter",
    description: "Lean manufacturing, inventory management, and bottleneck theory.",
    keyTakeaway: "System throughput is governed solely by the primary constraint.",
    children: []
  }
};
```

---

### File 2: `components/visual/MindMapViewer.tsx`
- **Features:**
  - Interactive SVG or responsive flex-tree nodes representing the hierarchy.
  - Smooth hover states with glowing node accents.
  - Expand/Collapse toggle for each branch.
  - **Node Inspector Modal / Side Sheet:**
    - When any node is clicked, opens a clean detail card showing:
      - Node Label & Category Badge (`Topic`, `Business Term`, `Strategic Principle`).
      - Plain-English Conceptual Definition.
      - Key Exam Takeaway.
      - "Exam Trap" tip (common mistakes students make on this term).
  - Zoom in / Zoom out / Reset controls.

---

### File 3: `components/visual/ChapterFlowchart.tsx`
- **Features:**
  - Sequential horizontal/vertical workflow representing multi-stage business decisions (e.g. *Capital Budgeting Decision Flowchart* or *Product Launch Lifecycle*).
  - Clear directional connectors (`ArrowRight` / `ArrowDown`).
  - Decision diamonds with Yes/No branches.
  - Step details expand on hover or click.

---

### File 4: `app/(student)/visual-maps/page.tsx`
- **Page Layout:**
  - Header: *"Visual Concept Maps & Chapter Architecture"*
  - Subtitle: *"Explore concepts and business jargon visually before testing your reasoning."*
  - Chapter Navigation Bar: Pill buttons for Chapter 1, Chapter 2, Chapter 3, and Chapter 4.
  - URL Query Sync: Reads `?chapter=ch-1` from URL so revision links from Dashboard open the exact chapter selected.
  - View Toggle: `Mind Map View` vs `Process Flowchart View`.
  - Main Canvas Area: Hosts `MindMapViewer` or `ChapterFlowchart`.
  - Floating Action Bar:
    - "Test What You Learned" -> direct CTA button leading to `/quiz/screen` or `/quiz/practice`.

---

## 3. Inter-Pod Handshake & Integration Sync Protocol

| Shared Resource | Originating Pod | How Pod 3 Must Integrate |
| :--- | :--- | :--- |
| **KSOR Term Definitions** | **Pod 1** (`lib/ksor/content-store.ts`) | Synchronize node terms with `KSOR_GLOSSARY` so vocabulary is identical between Mind Maps and quizzes. |
| **Dashboard Navigation** | **Pod 2** (`app/(student)/dashboard`) | Read `useSearchParams().get('chapter')` to auto-select the chapter requested by the dashboard. |
| **Screening CTA** | **Pod 4** (`/quiz/screen`) | "Test Your Reasoning" button directs to `/quiz/screen`. |

---

## 4. Verification & Acceptance Criteria
1. Run `npx tsc --noEmit` — must pass with **0 errors**.
2. Switching chapter tabs immediately renders that chapter's mind map without lag.
3. Clicking any node opens the detail inspector displaying the description, key takeaway, and exam tip.
4. Mobile layout stacks nodes cleanly without breaking the viewport or horizontal scroll overflow.
