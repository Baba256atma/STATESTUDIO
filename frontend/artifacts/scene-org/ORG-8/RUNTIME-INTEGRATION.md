# NPA-T ORG:8 — Focus/Density + Full MVP Runtime Integration

## Stop condition

The existing NMI/Attention projection is closed by default; compact navigation is Hm → NMI → Dt → Jn → More; NMI toggling changes presentation only; journeys A–E preserve canonical Stage, Right, Detail, Activity, and Saved Scene continuity at desktop width; no horizontal overflow or duplicate authority remains; focused ORG:8, ORG:2–8, owner regressions, typecheck, and production build pass.

## First divergent layer

The production shell composed `NexoraExecutiveQueueOverlay` unconditionally beside Stage and exposed no compact navigation control for it. The NMI model, projection composer, queue content, selection handlers, Stage, and Right context were already authoritative and correct. The repair is therefore confined to presentation composition and its contract tests.

## Production behavior

- Compact Left Navigation now orders Home, NMI, Data, Journal, and More.
- NMI is closed by default and uses `aria-pressed` plus shell observability to expose its presentation state.
- Opening NMI shows the existing `NexoraExecutiveQueueOverlay`; closing it hides only that presentation while retaining its existing Attention/Map mode state.
- Existing Attention, Management Map, Problems, Scenarios, Decisions, Executions, and Recent Changes content is retained.
- Normal Stage density remains 0–3 cards and Theatre remains exempt.

## Authority boundaries

NMI was not added to `ExecutiveNavId` and does not enter the navigation runtime. The shell continues to host `hostNmiLiveManagementIntelligence` and `composeNmiStageProjection`; Stage receives the canonical projection anchor and contains no NMI map/composition authority. Advisor, conversation, collection, referent, Detail, Activity, Saved Scene, Decision, Execution, Data Reality, evidence, and memory authorities are unchanged.

## Live journeys

- A — NMI → Stage → Right: Capacity Gap resolved to `ctx-problem-capacity` in shell, Center, and Right; closing NMI preserved all three IDs.
- B — Advisor → Collection: `Show scenarios` cleared the stale subject and presented the Scenarios collection in Stage and Right.
- C — Detail: Capacity resolved to `obj-capacity`; Detail opened on and closed from the same ID without changing Stage or Right.
- D — Activity: `Show history` opened the recorded projection; selecting Approve Repricing resolved `ctx-decision-reprice` in shell, Center, and Right without replay.
- E — Saved Scene: Capacity Review stored one reference-only scene; after focusing Risk, opening it restored live `obj-capacity` across shell, Center, and Right.

## Responsive and focus evidence

At the browser's 1352 × 792 desktop viewport, the densest observed workspace state (Activity, NMI, and Right open) reported `scrollWidth === innerWidth` and `scrollHeight === innerHeight`. NMI and Right collapse each preserved canonical Stage focus. After switching NMI to Management Map, collapse retained `data-nmi-mode="map"`, and reopen restored Management Map pressed without horizontal overflow. The Browser control skill made the live manager journeys and rendered overflow checks possible against an isolated current-code development server rather than stale local bundle state.

## Verification

- Focused ORG:8/placement/shell proofs: 37 passed, 0 failed.
- ORG:2–8 integration suite: 54 passed, 0 failed.
- Shell, flow, and NMI owner regressions: 60 passed, 0 failed.
- Repository typecheck: passed with an 8 GB Node heap.
- Production build: passed with an 8 GB Node heap. The restricted first attempt failed only because `next/font` could not reach Google Fonts; the approved network rerun compiled, typechecked, generated all 14 static pages, and finalized successfully.
- Live browser: journeys A–E passed; no visible application alert or overflow was observed.

## Test correction

An older NMI test expected `nmiManagementMap` and `composeNmiStageProjection` inside `Nexora3DExecutiveStage`. The live implementation correctly owns composition in the shell. The assertion now positively verifies shell composition with `nmiLive.map` and negatively verifies that Stage does not own either NMI seam.

## Deferred

The `baseline-browser-mapping` freshness warning remains dependency-maintenance debt. Narrow/mobile product behavior and ORG:FINAL are outside ORG:8 and were not started.

## Verdict

CERTIFIED — SCENE-ORG runtime integration preserves existing authorities and provides focused, manager-controlled workspace density
