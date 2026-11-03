# Mentor AI — 7 Independent Verticals & Developer Assignments

> **Deadline:** Thursday 6:00 PM  
> **Rule:** Exactly 1 developer per branch. Zero dependencies during development. Each vertical is fully decoupled.

---

## The 7 Dedicated Feature Branches & Spec Links

| Pod # | Dedicated Branch | Assigned Lead Developer | Complete Scope | Spec Link |
| :---: | :--- | :--- | :--- | :--- |
| **Pod 1** | `pod/1-core-engine` | **Roman Ayub** | DeepSeek OpenRouter Client, KSOR Content Store, AgentFactory MCP Client (`https://agentfactory.panaversity.org/`), Curated Question Bank, LocalStorage Engine | [POD_1_CORE_ENGINE.md](file:///D:/Mentor%20Ai/mentor-ai/specs/POD_1_CORE_ENGINE.md) |
| **Pod 2** | `pod/2-student-dashboard` | **Laiba Imran** | Student Dashboard Hub, Revision Cards, Readiness Gauge | [POD_2_STUDENT_DASHBOARD.md](file:///D:/Mentor%20Ai/mentor-ai/specs/POD_2_STUDENT_DASHBOARD.md) |
| **Pod 3** | `pod/3-visual-mindmaps` | **Ameena** | Visual Mind Maps, Interactive Tree Viewer, Chapter Flowcharts | [POD_3_VISUAL_MINDMAPS.md](file:///D:/Mentor%20Ai/mentor-ai/specs/POD_3_VISUAL_MINDMAPS.md) |
| **Pod 4** | `pod/4-socratic-screening` | **Alisha Zehra** | Socratic Screening Page, Reasoning Dialogue Modal, Screening API | [POD_4_SOCRATIC_SCREENING.md](file:///D:/Mentor%20Ai/mentor-ai/specs/POD_4_SOCRATIC_SCREENING.md) |
| **Pod 5** | `pod/5-practice-quiz-mentor` | **Muskan Fayyaz** | Practice Quiz Mode, Mentor AI Side Panel, Terms Explainer API | [POD_5_PRACTICE_MENTOR.md](file:///D:/Mentor%20Ai/mentor-ai/specs/POD_5_PRACTICE_MENTOR.md) |
| **Pod 6** | `pod/6-testing-exam-engine` | **Ubaid Raza** | Strict Timed Main Exam Page, Question Palette, Timer, Progress Bar | [POD_6_TESTING_EXAM.md](file:///D:/Mentor%20Ai/mentor-ai/specs/POD_6_TESTING_EXAM.md) |
| **Pod 7** | `pod/7-diagnostic-recovery` | **Shanzay Fatima** | Exam Scorecard View, DeepSeek Topic Diagnostic API, Recovery Roadmap | [POD_7_DIAGNOSTIC_RECOVERY.md](file:///D:/Mentor%20Ai/mentor-ai/specs/POD_7_DIAGNOSTIC_RECOVERY.md) |

---

## How to Execute Your Task:
1. Checkout your assigned branch from `main`:
   ```bash
   git checkout -b pod/<your-pod-name>
   ```
2. Read your spec file in `/specs/POD_<number>_*.md`.
3. Build your assigned files according to the TypeScript types in `/types`.
4. Run `npx tsc --noEmit` and `npm run build` to verify 0 errors.
5. Open a Pull Request targeting `main`.
