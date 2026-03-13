# Nexora MVP Launch Blockers

This document reflects the real current Nexora codebase as of March 12, 2026.

Scope reviewed:
- Frontend entry and domain flow
- `DomainSelectionScreen`
- `NexoraShell`
- `HomeScreen`
- Domain selection and domain experience registries
- Business / DevOps / Finance domain packs
- Demo loading path
- Shared prompt -> scene -> risk -> advice flow
- Backend `/chat` path in `backend/main.py`

This is a launch-readiness blocker analysis, not a refactor plan and not a feature roadmap.

## Current Launch Readiness

Status:
- Ready after 4 critical or high-impact blockers are fixed

Why:
- The product architecture is far enough along for MVP.
- The launch domains exist and are wired.
- The biggest remaining risks are not missing features. They are backend domain fidelity, orchestration fragility, and the lack of a clean quality gate.

## Top Blockers

## Blocker 1. Backend `/chat` mode collapses launch domains into business mode

Severity:
- Critical

Description:
- The frontend sends `mode: activeMode` from the active domain experience, but the backend `/chat` route currently only accepts `"business"` or `"spirit"` and falls back to `"business"` for everything else.

User impact:
- DevOps and Finance can look domain-aware in the frontend while still being processed through a business-oriented backend path.
- This weakens trust in the "one engine, multiple domain experiences" story during demos and real usage.

Technical root cause:
- In [backend/main.py](/Users/bahadoors/Documents/StateStudio/backend/main.py), the `/chat` handler sets:
  `mode = payload.mode if payload.mode in {"business", "spirit"} else "business"`

Files likely affected:
- [backend/main.py](/Users/bahadoors/Documents/StateStudio/backend/main.py)
- [frontend/app/screens/HomeScreen.tsx](/Users/bahadoors/Documents/StateStudio/frontend/app/screens/HomeScreen.tsx)

Fix strategy:
- Expand backend mode handling to accept the real launch domains: `business`, `devops`, `finance`.
- Preserve fallback safety, but do not silently coerce launch-domain requests to `business`.
- Ensure the backend response echoes the resolved active mode clearly.

Implementation approach:
- Introduce a small backend mode-normalization helper.
- Replace the current hardcoded two-mode gate.
- Verify end-to-end payload handling from `HomeScreen` request builder through `/chat` response packaging.

Complexity:
- Small to medium

## Blocker 2. Backend inference, KPI logic, and layout semantics are still business-centric

Severity:
- Critical

Description:
- Several early backend helper layers still use business-specific vocabulary and KPI assumptions such as supplier, delivery, inventory, demand, and risk.
- That creates a mismatch between the real DevOps / Finance domain demos and the backend reasoning path.

User impact:
- DevOps prompts can be interpreted through business-oriented object zones or KPI logic.
- Finance prompts can lose domain-specific meaning or feel less credible under live prompting.
- This directly threatens demo quality and domain trust.

Technical root cause:
- In [backend/main.py](/Users/bahadoors/Documents/StateStudio/backend/main.py), `_semantic_zone_for_object(...)` and `_kpi_step(...)` are largely business-shaped.
- The rules use terms like `supplier`, `delivery`, `inventory`, `customer`, `cash`, and hardcoded inventory/delivery/risk KPI behavior.

Files likely affected:
- [backend/main.py](/Users/bahadoors/Documents/StateStudio/backend/main.py)
- [frontend/app/lib/domain/domainScenarioKpiMapping.ts](/Users/bahadoors/Documents/StateStudio/frontend/app/lib/domain/domainScenarioKpiMapping.ts)
- [frontend/app/lib/domain/domainScannerMapping.ts](/Users/bahadoors/Documents/StateStudio/frontend/app/lib/domain/domainScannerMapping.ts)

Fix strategy:
- Make these backend helpers domain-aware for the three launch domains.
- Do not rebuild the backend. Add thin domain-conditional semantics aligned to Business, DevOps, and Finance.

Implementation approach:
- Introduce domain-aware object-zone and KPI-step routing.
- Preserve current Business behavior.
- Add DevOps-safe interpretations for dependency, latency, queue, worker, uptime, and error patterns.
- Add Finance-safe interpretations for liquidity, exposure, leverage, volatility, credit, and capital patterns.

Complexity:
- Medium

## Blocker 3. `HomeScreen.tsx` is acting as an oversized orchestration hub

Severity:
- High

Description:
- `HomeScreen.tsx` now owns a very large amount of runtime orchestration: prompt handling, scene updates, demo loading, right-panel wiring, memory, replay, domain experience wiring, product mode context, and multiple optional intelligence surfaces.

User impact:
- The MVP can still work, but this concentration increases regression risk right before launch.
- Small changes to prompt flow, domain switching, or panel behavior are harder to validate confidently.

Technical root cause:
- Shared orchestration has accumulated in one file instead of being stabilized into a few narrow helpers.
- The file has heavy `any` usage and broad state mutation responsibilities.

Files likely affected:
- [frontend/app/screens/HomeScreen.tsx](/Users/bahadoors/Documents/StateStudio/frontend/app/screens/HomeScreen.tsx)
- [frontend/app/screens/homeScreenUtils.ts](/Users/bahadoors/Documents/StateStudio/frontend/app/screens/homeScreenUtils.ts)
- [frontend/app/lib/demo/domainDemoRegistry.ts](/Users/bahadoors/Documents/StateStudio/frontend/app/lib/demo/domainDemoRegistry.ts)

Fix strategy:
- Do not rewrite `HomeScreen` before MVP.
- Extract only the most failure-prone seams into small helpers: chat payload building, backend response normalization, and demo loading/reset behavior.

Implementation approach:
- Stabilize the minimum orchestration seams behind typed helpers.
- Reduce direct `any` usage in the prompt -> response -> scene path first.
- Avoid broad UI restructuring.

Complexity:
- Medium

## Blocker 4. Frontend quality gate is currently broken at repo level

Severity:
- High

Description:
- The current frontend lint run fails with a large error backlog, including extensive `no-explicit-any` violations and React Compiler memoization issues.

User impact:
- This is not the same as a user-visible runtime crash, but it lowers shipping confidence and makes last-mile MVP fixes riskier.
- It also weakens release discipline if the team cannot tell whether new changes made the system better or worse.

Technical root cause:
- The current frontend surface carries broad typing debt and compiler/lint debt across core screens and panels.

Evidence:
- `npm run lint -- --quiet` in `frontend/` returns `1093 errors`.

Files likely affected:
- [frontend/app/screens/HomeScreen.tsx](/Users/bahadoors/Documents/StateStudio/frontend/app/screens/HomeScreen.tsx)
- [frontend/app/components/NexoraShell.tsx](/Users/bahadoors/Documents/StateStudio/frontend/app/components/NexoraShell.tsx)
- [frontend/app/components/HUDPanels.tsx](/Users/bahadoors/Documents/StateStudio/frontend/app/components/HUDPanels.tsx)
- [frontend/app/components/ChatHUD.tsx](/Users/bahadoors/Documents/StateStudio/frontend/app/components/ChatHUD.tsx)
- other touched MVP files in `frontend/app/`

Fix strategy:
- Establish a realistic MVP quality gate instead of trying to eliminate all lint debt before launch.
- Fix the launch-critical files first and explicitly defer the rest.

Implementation approach:
- Create a launch-critical lint allowlist or targeted pass covering:
  - `HomeScreen.tsx`
  - `NexoraShell.tsx`
  - domain selection and domain registries
  - domain demos
  - the main prompt flow
- Reduce `any` usage and the most dangerous React Compiler issues in those files.
- Keep the broader backlog post-launch.

Complexity:
- Medium to high

## Blocker 5. The MVP demo path is still too easy to dilute with non-core surfaces

Severity:
- Medium

Description:
- NexoraShell exposes a large set of nav groups and inspector tabs, including replay, memory, opponent, patterns, collaboration, and workspace surfaces.
- These are useful, but the launch MVP story is simpler: prompt -> scene -> fragility / risk -> executive action.

User impact:
- In a customer or investor demo, the presenter can drift into secondary surfaces and weaken the product story.
- New users can lose the main value path if the experience is not guided tightly.

Technical root cause:
- The shell remains broadly capable while the launch story is narrower.
- The current UI can support this, but it needs a clear MVP-safe walkthrough discipline.

Files likely affected:
- [frontend/app/components/NexoraShell.tsx](/Users/bahadoors/Documents/StateStudio/frontend/app/components/NexoraShell.tsx)
- [frontend/app/screens/HomeScreen.tsx](/Users/bahadoors/Documents/StateStudio/frontend/app/screens/HomeScreen.tsx)
- [docs/nexora-demo-script.md](/Users/bahadoors/Documents/StateStudio/docs/nexora-demo-script.md)

Fix strategy:
- Keep the shared shell, but tighten the MVP-safe path.
- Prefer default landing emphasis on scene, risk flow, and executive views for launch demos.

Implementation approach:
- Do not remove advanced sections.
- Add a launch-safe presenter path and, if needed, one lightweight UX nudge toward the core flow.
- Treat this as demo and product-control cleanup, not a redesign.

Complexity:
- Small

## MVP Safe Zone

Do not change before MVP launch:
- Core object / relation / loop system
- Shared scene engine
- Shared risk propagation engine
- Shared domain pack architecture
- Business / DevOps / Finance domain definitions as domain concepts
- The current domain selection architecture
- The shared `/chat` route path

Do not add before MVP launch:
- New major domains
- Full multi-source connector platform
- New heavy enterprise integrations
- Large new cockpit surfaces
- Deep autonomous exploration UI

The pre-launch focus should be stability and domain fidelity, not feature expansion.

## Ordered Fix Plan

## Phase 1. Critical blockers

1. Fix backend mode normalization so `business`, `devops`, and `finance` survive end to end.
2. Make backend inference and KPI/layout helpers domain-aware for the three launch domains.

Goal:
- Ensure the real launch domains are not cosmetically frontend-only.

## Phase 2. High-impact stability fixes

3. Stabilize the most failure-prone `HomeScreen` orchestration seams behind small typed helpers.
4. Create a launch-critical frontend quality gate and reduce the worst lint/compiler issues in the MVP-critical files.

Goal:
- Increase confidence that last-mile fixes will not break the prompt -> scene -> risk -> advice path.

## Phase 3. Demo-safe product cleanup

5. Tighten the MVP-safe navigation and demo path so the core value story stays obvious.

Goal:
- Make the product easier to present and easier to understand.

## Phase 4. Optional improvements

- Broader lint debt cleanup
- Wider backend modularization
- More polished replay / memory presentation
- Preview-domain elevation

Goal:
- Improve maintainability without blocking launch.

## Launch Recommendation

Recommendation:
- Ready after 4 blockers are fixed

Those blockers are:
1. Backend mode collapse to business
2. Business-centric backend inference and KPI semantics
3. Fragile `HomeScreen` orchestration concentration
4. Broken repo-level frontend quality gate

Why not "Ready to ship" yet:
- The frontend domain layer is in decent shape.
- The launch domains exist and the shared-core story is real.
- But the backend still undercuts multi-domain fidelity, and the main frontend flow is too fragile to ship confidently without one stabilization pass.
