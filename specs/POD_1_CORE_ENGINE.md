# Pod 1 Specification: Core Engine, KSOR Content Repository & MCP Integration

> **Dedicated Branch:** `pod/1-core-engine`  
> **Assigned Lead Developer:** Roman Ayub  
> **Ownership Scope:** `lib/ai/openrouter.ts`, `lib/ksor/content-store.ts`, `lib/ksor/mcp-client.ts`, `lib/quiz/questions-pool.ts`, `lib/storage/student-memory.ts`  
> **Strict Rule:** Touch ONLY files in `lib/ai/`, `lib/ksor/`, `lib/quiz/`, and `lib/storage/`. Do NOT modify `app/` or `components/`.

---

## 1. Architectural Role
Pod 1 delivers the intelligence, content, and data spine of the entire application:
1. **OpenRouter DeepSeek Client:** Centralized LLM gateway.
2. **KSOR (Knowledge Source & Organization Repository):** Local verified syllabus store for uploading/storing book guides, business concepts, and chapter outlines.
3. **AgentFactory MCP Integration:** Client connecting to `https://agentfactory.panaversity.org/` to query official certification content with graceful fallback to local KSOR data.
4. **Curated Questions Pool:** Verified MCQs with chapter, topic, and difficulty tagging.
5. **Persistent Student Memory:** Client-side persistence engine for student progress, readiness status, and quiz history.

---

## 2. File Implementation Blueprints

### File 1: `lib/ai/openrouter.ts`
- **Exports:**
  ```typescript
  export async function callOpenRouter(
    prompt: string, 
    systemPrompt: string = 'You are an expert exam mentor and professor.',
    model?: string
  ): Promise<string>;

  export async function callOpenRouterJSON<T>(
    prompt: string, 
    systemPrompt: string, 
    model?: string
  ): Promise<T>;
  ```
- **Requirements:**
  - Reads `OPENROUTER_API_KEY` and `OPENROUTER_MODEL` (default: `"deepseek/deepseek-chat"`).
  - Robust regex stripping of ````json ... ```` fences before calling `JSON.parse`.

---

### File 2: `lib/ksor/content-store.ts` (The KSOR Engine)
- **Exports:**
  - `KSOR_CHAPTER_GUIDES: KSORDocument[]` (Curated guides for Chapters 1 to 4).
  - `KSOR_GLOSSARY: KSORConceptTerm[]` (At least 20 core business terms with definitions, analogies, and exam traps).
  - `getKSORGuideByChapter(chapterId: string): KSORDocument | undefined`
  - `lookupKSORTerm(term: string): KSORConceptTerm | undefined`
  - `uploadKSORGuide(doc: KSORDocument): void` (Allows adding/updating guide notes in memory/localStorage).

---

### File 3: `lib/ksor/mcp-client.ts` (Panaversity AgentFactory MCP Integration)
- **Exports:**
  ```typescript
  export async function fetchFromAgentFactoryMCP(
    query: MCPContentQuery
  ): Promise<MCPContentResponse>
  ```
- **Logic:**
  - Target Endpoint: `process.env.PANAVERSITY_MCP_URL || 'https://agentfactory.panaversity.org/'`
  - Sends query payload to the MCP endpoint.
  - **Graceful Fallback:** If the external MCP is unreachable or offline, automatically resolves using the local `lib/ksor/content-store.ts` data, ensuring 100% uptime during exams and grading!

---

### File 4: `lib/quiz/questions-pool.ts`
- **Exports:**
  - `CURATED_QUESTIONS: Question[]` (24–32 curated business MCQs conforming strictly to `@/types`).
  - `getAllQuestions(): Question[]`
  - `getQuestionsByChapter(chapterId: string): Question[]`
  - `getQuestionsForTest(count?: number, weakTopicIds?: string[]): Question[]` (Prioritizes questions from `weakTopicIds`).
  - `CHAPTERS_METADATA`: List of chapters with titles, descriptions, and topic counts.

---

### File 5: `lib/storage/student-memory.ts`
- **Exports:**
  - `getStudentProfile(): StudentProfile` (Reads from `'mentor_ai_student_profile'` with `typeof window !== 'undefined'` guard).
  - `saveStudentProfile(profile: StudentProfile): void`
  - `saveReadinessAssessment(assessment: ReadinessAssessment): void` (Used by Pod 4 to save screening outcome).
  - `recordQuizSession(session: QuizSessionSummary): StudentProfile` (Used by Pod 6 to save completed test scores).
  - `getWeakestTopics(limit?: number): { topicId: string; topicTitle: string; accuracyRate: number }[]`

---

## 3. Strict Inter-Pod Handshake & Integration Sync Rules

To guarantee that all 7 pods merge seamlessly into `main`:

| Handshake | Provider (Pod 1) | Consumer Pod | Integration Rule |
| :--- | :--- | :--- | :--- |
| **Readiness Status** | `saveReadinessAssessment` / `getStudentProfile` | **Pod 2** (Dashboard), **Pod 4** (Screening), **Pod 6** (Exam) | Pod 4 saves readiness; Pod 2 displays the Unlock Badge; Pod 6 verifies readiness before starting the exam. |
| **Exam Record** | `recordQuizSession(session)` | **Pod 6** (Exam), **Pod 7** (Diagnostics) | Pod 6 calls this upon submitting test; Pod 7 reads it to generate the Recovery Roadmap. |
| **MCQ Content** | `getQuestionsForTest()`, `getQuestionsByChapter()` | **Pod 4** (Screening), **Pod 5** (Practice), **Pod 6** (Exam) | All quiz pages must import questions from `lib/quiz/questions-pool.ts` (backed by KSOR / MCP). |
| **Glossary Terms** | `lookupKSORTerm(term)` | **Pod 3** (Mindmaps), **Pod 5** (Mentor Side-Panel) | Side-panel uses KSOR definitions as instant fallback before/alongside DeepSeek explanation. |

---

## 4. Verification & Acceptance Criteria
1. Run `npx tsc --noEmit` — must pass with **0 errors**.
2. Calling `fetchFromAgentFactoryMCP` returns structured content or safely falls back to local KSOR.
3. `recordQuizSession` and `saveReadinessAssessment` properly persist to `localStorage`.
