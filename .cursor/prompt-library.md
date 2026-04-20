This file contains reusable ONE-SHOT prompts for Cursor.
All prompts are designed to:
	•	preserve Nexora architecture
	•	produce minimal safe patches
	•	avoid regressions

⸻

🧠 1. DEBUG — Root Cause Analysis

👉 Use when: something is broken or unstable

@HomeScreen.tsx
@RightPanelHost.tsx
@rightPanelRouter.ts

Explain the root cause of the issue BEFORE fixing.

Constraints:
	•	Do NOT modify code yet
	•	Trace full flow: Intent → Router → Panel → Render
	•	Use debug rules from .cursor/debug.md

Output:
	•	Root cause
	•	Affected layer (Chat / Panel / Scene / Backend)
	•	Exact failure point

⸻

🔧 2. PANEL BUG FIX — Flash / Disappear

👉 Use when: panel flashes or disappears

@HomeScreen.tsx
@RightPanelHost.tsx
@rightPanelRouter.ts

👉 ONE-SHOT Fix

Goal:
Fix panel flash / disappearance after CTA or chat action

Constraints:
	•	DO NOT break panel routing architecture
	•	RightPanelHost must remain final authority
	•	DO NOT create new panel paths
	•	Follow .cursor/patterns.md and .cursor/anti-patterns.md

Fix:
	•	ensure stable panel persistence after state update
	•	prevent post-success context invalidation
	•	preserve resolved panel view

Add:
	•	debug traces: [Nexora][PanelFlow][Fix]

Definition of Done:
	•	panel does not disappear
	•	correct panel remains visible
	•	no flicker

⸻

🎛 3. PANEL ROUTING FIX

👉 Use when: wrong panel opens

@rightPanelRouter.ts
@RightPanelHost.tsx

Goal:
Fix incorrect panel routing resolution

Constraints:
	•	Do NOT introduce new routing system
	•	Maintain canonical view mapping

Tasks:
	•	validate intent → view mapping
	•	ensure fallback is safe and non-empty
	•	align router output with RightPanelHost expectations

Definition of Done:
	•	correct panel opens for each intent
	•	no empty panel

⸻

🌐 4. SCENE REACTION FIX

👉 Use when: objects behave wrong or reset

@SceneRenderer.tsx
@unifiedReaction.ts
@reactionPolicy.ts

Goal:
Fix incorrect scene reactions without resetting full scene

Constraints:
	•	NEVER overwrite full scene_json unless force flag exists
	•	Preserve object continuity

Tasks:
	•	trace reaction pipeline:
normalize → policy → execution
	•	fix incorrect object updates
	•	ensure highlight/dim behavior is stable

Definition of Done:
	•	objects react smoothly
	•	no sudden reset
	•	correct object is highlighted

⸻

⚠️ 5. SCENE OVERWRITE PROTECTION

👉 Use when: scene resets unexpectedly

@unifiedReaction.ts
@actionExecutionLayer.ts

Goal:
Prevent unintended full scene overwrite

Tasks:
	•	detect where scene_json is replaced
	•	enforce guard:
only allow overwrite if force_scene_update = true

Definition of Done:
	•	scene remains stable
	•	partial updates only

⸻

🔗 6. BACKEND → FRONTEND CONTRACT FIX

👉 Use when: panel gets empty or broken data

@panelDataContract.ts
@adviceAdapter.ts
@scanner_output.py

Goal:
Fix mismatch between backend response and frontend schema

Constraints:
	•	DO NOT break Zod schema
	•	DO NOT remove fields silently

Tasks:
	•	align backend output → canonical format
	•	ensure frontend adapter normalizes correctly

Definition of Done:
	•	panel renders valid data
	•	no schema errors

⸻

🧪 7. ARCHITECTURE REVIEW (SAFE)

👉 Use before refactor or big change

@HomeScreen.tsx

Review this file against:
	•	.cursor/patterns.md
	•	.cursor/anti-patterns.md

Output:
	•	architecture risks
	•	anti-pattern violations
	•	stability concerns

DO NOT modify code.

⸻

⚙️ 8. MINIMAL PATCH MODE

👉 Use when: you want safe changes only

Apply a minimal patch.

Constraints:
	•	smallest possible change
	•	no refactor
	•	no new abstractions
	•	preserve all contracts

Output:
	•	patch only
	•	short explanation

⸻

🔍 9. TRACE FLOW DEBUG

👉 Use when: you don’t understand system behavior

Trace full execution flow for this action:

From:
User input / CTA

Through:
	•	Intent detection
	•	Router
	•	Panel resolution
	•	Scene reaction

Output:
	•	step-by-step trace
	•	where it breaks

⸻

🚀 10. CTA ACTION FIX

👉 Use when: buttons like “Simulate” or “Compare” fail

@HomeScreen.tsx
@rightPanelRouter.ts
@RightPanelHost.tsx

Goal:
Fix CTA action → panel execution flow

Tasks:
	•	ensure CTA triggers correct intent
	•	ensure router resolves correct view
	•	ensure panel receives valid data

Definition of Done:
	•	CTA opens correct panel
	•	panel contains data
	•	no blank state

⸻

🧠 Usage Rule

Always:
	•	attach relevant files with @
	•	keep prompt focused on ONE task
	•	prefer ONE-SHOT execution

Never:
	•	mix multiple goals
	•	allow architecture drift
# Nexora Domain-Specific Prompt Packs

These prompts are specialized for Nexora core domains:
- Fragility Scanner
- Scenario Studio
- War Room
- Scene Intelligence
- Panel Continuity

All prompts enforce:
- architecture safety
- minimal patching
- no regression

---

# 🔬 1. FRAGILITY SCANNER — Signal → Object → Scene

👉 Use when: scanner result is wrong or weak

@scanner_orchestrator.py
@fragility_evaluator.py
@mapping/mapper.py
@SceneRenderer.tsx

Goal:
Fix or improve signal → object → scene pipeline

Constraints:
- DO NOT change core scoring logic unless necessary
- Preserve canonical mapping structure
- Keep frontend/backend contract stable

Tasks:
- verify signal extraction
- verify object mapping correctness
- ensure scene_payload matches expected objects
- ensure primary drivers are visible in scene

Definition of Done:
- correct objects highlighted
- drivers visible and consistent
- scene reflects fragility analysis

---

# 🔬 2. SIGNAL → OBJECT MAPPING FIX

👉 Use when: wrong object reacts

@mapping/mapper.py
@mapping/domain/retail_mapping.py

Goal:
Fix incorrect mapping between signals and domain objects

Tasks:
- verify keyword mapping
- check entity extraction alignment
- ensure correct objectId assignment

Constraints:
- DO NOT hardcode temporary fixes
- keep mapping deterministic

Definition of Done:
- correct object triggered for each signal
- no false positives

---

# 🔮 3. SCENARIO STUDIO — Simulation Flow

👉 Use when: simulation doesn’t propagate correctly

@scenario_orchestrator.py
@SceneRenderer.tsx

Goal:
Fix or improve scenario propagation behavior

Tasks:
- validate state transition logic
- ensure propagation affects dependent objects
- ensure scene reflects scenario evolution

Constraints:
- DO NOT fake simulation results
- keep logic consistent with backend

Definition of Done:
- scenario visibly changes system state
- propagation chain is logical

---

# ⚔️ 4. WAR ROOM — Decision Engine Flow

👉 Use when: decisions, compare, or recommendation fail

@HomeScreen.tsx
@rightPanelRouter.ts
@RightPanelHost.tsx

Goal:
Fix decision execution flow (simulate / compare / recommend)

Tasks:
- ensure correct intent generation
- ensure panel receives correct data slice
- ensure no blank executive panel

Constraints:
- DO NOT bypass panel system
- preserve canonical panel flow

Definition of Done:
- decision actions open correct panel
- panel has meaningful data
- no empty states

---

# 🧠 5. SCENE INTELLIGENCE — Object Behavior

👉 Use when: objects feel “dead” or unrealistic

@SceneRenderer.tsx

Goal:
Improve object visual intelligence and responsiveness

Tasks:
- verify highlight/dim logic
- verify role (primary / affected / context)
- ensure smooth transitions (no jump)

Constraints:
- DO NOT introduce heavy animations
- keep motion subtle and meaningful

Definition of Done:
- objects react clearly but smoothly
- user can understand system state visually

---

# 🧩 6. PANEL CONTINUITY — Persistence Fix

👉 Use when: panel disappears or resets

@HomeScreen.tsx
@RightPanelHost.tsx

Goal:
Ensure panel continuity across state updates

Tasks:
- preserve resolved panel view
- prevent post-success invalidation
- stabilize render conditions

Constraints:
- DO NOT create new state paths
- DO NOT override router logic

Definition of Done:
- panel remains stable after action
- no flicker or reset

---

# 🔗 7. BACKEND → SCANNER → PANEL PIPELINE

👉 Use when: data doesn’t flow correctly

@scanner_output.py
@panelDataContract.ts
@adviceAdapter.ts

Goal:
Fix end-to-end data pipeline

Tasks:
- validate backend output structure
- align with frontend Zod schema
- ensure panel receives valid canonical data

Constraints:
- DO NOT break schema
- DO NOT drop fields silently

Definition of Done:
- panel renders correct data
- no schema errors

---

# 🧪 8. FULL SYSTEM TRACE (NEXORA FLOW)

👉 Use when: system behavior unclear

Trace full Nexora execution:

Input:
User text / CTA

Flow:
- Intent detection
- Mapping
- Scanner / Scenario
- Panel routing
- Scene reaction

Output:
- step-by-step system flow
- exact break point

---

# 🚀 Usage Rule (Critical)

Always:
- attach relevant files with @
- use ONE domain prompt at a time
- combine with automation-playbook if needed

Never:
- mix multiple domains in one prompt
- bypass architecture rule

# Nexora Production Prompt Packs for Real Flows

These prompts are for real production-oriented stabilization work.
They are designed for the most important Nexora execution paths:
- panel stability
- CTA execution
- scene safety
- contract hardening
- demo readiness

All prompts must preserve architecture and avoid uncontrolled refactors.

---

# 1. PANEL STABILITY PASS

👉 Use when:
- panel flashes
- panel disappears
- panel briefly renders then resets
- panel opens but does not persist

@HomeScreen.tsx
@RightPanelHost.tsx
@rightPanelRouter.ts
@panelDataContract.ts

Goal:
Run a production-grade panel stability pass for Nexora.

Instructions:
1. Explain the root cause first.
2. Trace the full flow:
   CTA / chat / scanner → intent → router → resolved panel → RightPanelHost render
3. Identify where panel continuity is lost.
4. Apply the smallest safe patch possible.

Constraints:
- DO NOT break panel routing architecture
- RightPanelHost must remain final render authority
- DO NOT create parallel panel state
- DO NOT introduce large refactors
- Preserve canonical panel contracts

Focus:
- panel continuity
- render stability
- post-success invalidation
- resolved view persistence
- renderable data readiness

Add debug traces where useful:
- [Nexora][PanelFlow]
- [Nexora][PostSuccess]
- [Nexora][Router]

Definition of Done:
- panel no longer flashes
- panel no longer disappears
- resolved panel remains visible after action
- no blank panel in critical flow

---

# 2. CTA EXECUTION PASS

👉 Use when:
- Simulate does nothing
- Compare opens blank panel
- Why this / Explain opens wrong panel
- CTA behavior is inconsistent

@HomeScreen.tsx
@rightPanelRouter.ts
@RightPanelHost.tsx

Goal:
Stabilize CTA execution flow for production-safe behavior.

Instructions:
1. Trace CTA action from button click to panel render.
2. Verify generated action/intention.
3. Verify router output.
4. Verify host receives valid renderable data.
5. Fix only the broken handoff.

Constraints:
- DO NOT bypass canonical panel flow
- DO NOT add a second CTA handling path
- Keep action → intent → router → host flow intact

Focus:
- CTA correctness
- correct panel targeting
- non-empty panel rendering
- repeatable user behavior

Add traces:
- [Nexora][CTA]
- [Nexora][Router]
- [Nexora][PanelFlow]

Definition of Done:
- Simulate opens the right panel
- Compare opens the right panel
- Explain / Why this opens the right panel
- no blank executive panel
- repeated CTA clicks remain stable

---

# 3. SCENE SAFETY PASS

👉 Use when:
- scene resets unexpectedly
- objects vanish
- wrong objects react
- a small action causes full scene replacement

@SceneRenderer.tsx
@unifiedReaction.ts
@reactionNormalizer.ts
@reactionPolicy.ts
@actionExecutionLayer.ts

Goal:
Harden scene safety for production behavior.

Instructions:
1. Trace the scene reaction pipeline.
2. Identify whether full scene replacement is happening incorrectly.
3. Ensure partial object updates are preferred.
4. Preserve object continuity and visual meaning.

Constraints:
- NEVER overwrite full scene_json unless force_scene_update = true
- DO NOT introduce hacky object-specific exceptions
- Keep unified reaction pipeline intact

Focus:
- scene overwrite protection
- smooth object continuity
- logical highlight/dim behavior
- role-aware stability

Add traces:
- [Nexora][Reaction]
- [Nexora][Scene]

Definition of Done:
- no unintended full scene reset
- correct objects react
- objects remain visually continuous
- motion remains subtle and meaningful

---

# 4. CONTRACT HARDENING PASS

👉 Use when:
- panel is blank because data is malformed
- Zod errors appear
- backend response shape drifts
- adapter and panel contracts disagree

@scanner_output.py
@panelDataContract.ts
@adviceAdapter.ts
@buildPanelResolvedData.ts

Goal:
Harden backend → frontend contract for production safety.

Instructions:
1. Trace data from backend output to panel render.
2. Identify shape mismatches, missing fields, or ambiguous fallback behavior.
3. Normalize data at the correct boundary.
4. Preserve canonical contract design.

Constraints:
- DO NOT silently remove fields
- DO NOT weaken schema just to hide bugs
- Keep canonical panel data approach intact

Focus:
- backend/frontend contract safety
- canonical normalization
- renderable panel slices
- fallback discipline

Add traces:
- [Nexora][Contract]
- [Nexora][PanelFlow]

Definition of Done:
- panel receives valid canonical data
- no silent blank panel caused by malformed data
- no schema drift
- adapter behavior is predictable

---

# 5. DEMO READINESS PASS

👉 Use when:
- preparing for demo
- preparing for stakeholder review
- checking if a flow is sellable / presentable

@HomeScreen.tsx
@RightPanelHost.tsx
@SceneRenderer.tsx
@rightPanelRouter.ts

Goal:
Review and improve one critical Nexora flow for demo-safe behavior.

Instructions:
1. Evaluate the selected flow from the perspective of a first-time enterprise viewer.
2. Identify anything that breaks the visual story or credibility.
3. Apply only minimal safe stabilizations.
4. Prefer clarity and continuity over extra complexity.

Constraints:
- DO NOT add flashy behavior
- DO NOT add fake data
- DO NOT excuse bugs with comments
- Keep architecture intact

Focus:
- visible system reaction
- stable panel story
- clear CTA result
- confidence-building behavior

Demo-breaking issues:
- blank panel
- disappearing panel
- no visible object reaction
- confusing or contradictory state
- broken CTA outcome

Definition of Done:
- selected flow behaves consistently
- user can understand what happened
- the flow is demo-safe without explanation or apology

---

# 6. PANEL CONTINUITY REVIEW

👉 Use when:
- you are not ready to patch yet
- you want a production review before changing code

@HomeScreen.tsx
@RightPanelHost.tsx
@rightPanelRouter.ts

Review this flow strictly for panel continuity risks.

Output only:
- continuity risks
- likely reset points
- likely invalidation points
- architecture-safe fix recommendations

Do NOT modify code yet.

Evaluate:
- resolved view persistence
- render readiness gating
- post-success invalidation
- fallback ambiguity
- host continuity

---

# 7. CTA FAILURE REVIEW

👉 Use when:
- buttons fail in unclear ways
- user flow is unreliable
- same action works once and fails later

@HomeScreen.tsx
@rightPanelRouter.ts
@RightPanelHost.tsx

Review CTA execution for production risks.

Output only:
- exact failure point
- whether issue is in:
  - action generation
  - intent mapping
  - router resolution
  - panel data readiness
  - host rendering
- smallest safe fix strategy

Do NOT patch yet unless root cause is clear.

---

# 8. SCENE + PANEL CONSISTENCY PASS

👉 Use when:
- panel says one thing but scene shows another
- fragility result is not reflected visually
- system feels inconsistent to the user

@SceneRenderer.tsx
@RightPanelHost.tsx
@scanner_orchestrator.py
@scanner_output.py

Goal:
Ensure panel meaning and scene meaning stay aligned.

Instructions:
1. Compare backend result, panel slice, and scene reaction.
2. Identify semantic mismatches.
3. Fix only the contract/handoff layer that causes inconsistency.

Constraints:
- DO NOT invent new domain logic
- Preserve backend authority where appropriate
- Preserve scene safety rules

Definition of Done:
- panel message and scene behavior agree
- user sees a coherent system response

---

# 9. PRE-MERGE STABILITY GATE

👉 Use when:
- a patch is done
- before accepting a fix
- before claiming Nexora is improved

Review the current patch using:
- .cursor/stability-checklist.md
- .cursor/contract-safety-checklist.md
- .cursor/anti-patterns.md

Output:
- passed checks
- failed checks
- regression risks
- whether this patch is safe to keep

Do not rewrite the patch unless a critical issue is found.

---

# 10. PRODUCTION HOTFIX MODE

👉 Use when:
- the bug is critical
- you need a small safe correction now
- architecture must be preserved

Apply a production hotfix.

Rules:
- smallest safe patch only
- no refactor
- no architecture drift
- no duplicate paths
- no schema weakening to hide root cause

Required output:
1. root cause
2. exact minimal patch
3. regression risks
4. what should be tested immediately after patch

---

# Usage Rule

For production flows:
- use only one prompt pack at a time
- attach only the files relevant to the failure
- prefer diagnose → patch → review sequence
- do not mix panel, scene, and contract fixes in one uncontrolled step

Critical sequence:
1. Diagnose
2. Trace
3. Patch minimally
4. Run stability g
🧠 Universal Senior Prompt Template

Use this template for ALL serious fixes:

@relevant_files

Follow Nexora Senior Engineering Behavior from .cursor/rules.md.

Process:
	1.	Diagnose root cause
	2.	Trace full flow
	3.	Apply minimal safe patch
	4.	Validate against:
	•	stability-checklist
	•	contract-safety-checklist

Constraints:
	•	No architecture changes
	•	No parallel systems
	•	No large refactors

Task: