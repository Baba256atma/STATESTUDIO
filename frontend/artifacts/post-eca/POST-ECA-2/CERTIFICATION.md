# NPA-T POST-ECA:2 — Live Stage Awareness & Advisor Visual-State Integration

**Status: CERTIFIED**

Certification date: 2026-09-08  
Runtime: `http://127.0.0.1:61411/executive` (isolated `?reset=1` journeys). Production `next start` after Level 4 build. Port 61411 was verified free before use.

ECA:1 was **not** redesigned. ECA:13 was **not** started. POST-ECA:2-FIX1 was **not** created. No second Stage store, Director, Theatre, conversation-context engine, or correction engine.

## Verdict

**NPA-T POST-ECA:2 — Live Stage Awareness & Advisor Visual-State Integration: CERTIFIED**

**NEXORA EXECUTIVE CONVERSATION ARCHITECTURE — ECA:1–12 remains CERTIFIED.**  
**ECA:4-POST1 remains CERTIFIED.**

## Root cause

Advisor Stage membership was projected only from `focusedSubject` ∪ `collectionContext.objectIds`. Overview has neither, while Stage disclosure still renders Watch-role actors (`Capacity`, `Customer` as **Capacity Watch** / **Customer Watch**). `composeWorkspaceReply` then emitted “The Stage does not currently show any executive objects.” Focus worked because focus ids were in that incomplete set. Hypothesis confirmed: rendered Stage composition was disconnected from ECA:1 / Advisor.

## Fix (read-only integration)

- `projectAuthoritativeStageContext` reads `deriveNexoraMVPStageInteractionPresentation` (same occupancy as the shell, including guided-entrance `current-catalog`).
- Visible actors = `spatialRole !== "hidden"` and `disclosureState !== "hidden"`. Watch labels reuse spatial role, not hardcoded names.
- Overview STAGE_META answers from that projection. Focus + other visibles are both reported.
- ECA:1 consumes the same `visible` list as `STAGE_CANDIDATE` (including ordinals). Focus-based conversation is unchanged.
- ECA:5 binds Stage corrections to **Stage visibility**, never subject `You`. Runtime confirm/disagree; no Stage mutation.
- ECA:6 treats Stage inspection as a side question; `Continue the investigation` resumes.
- Visibility is not importance, priority, causality, or proximity-as-relationship.

## Live runtime (authoritative names)

Overview: Capacity Watch and Customer Watch (`obj-capacity`, `obj-customer`), focus none.  
Focus Risk: Risk focused; Capacity Watch, Customer Watch, and Delivery also visible.

## Certification matrix

| Item | Result |
| --- | --- |
| Exact Overview failure reproduced | PASS |
| Exact Focus success reproduced | PASS |
| Root cause identified | PASS |
| Stage presentation authority identified | PASS |
| Director authority preserved | PASS |
| Existing projection reused | PASS |
| Second Stage store = 0 | PASS |
| Overview awareness | PASS |
| Focus awareness | PASS |
| Visible actor awareness | PASS |
| Empty-focus/nonempty-Stage | PASS |
| Focused-object/multi-visible | PASS |
| Queue isolation | PASS |
| Collection isolation | PASS |
| Current-subject isolation | PASS |
| Object-family awareness | PASS |
| Data Object awareness | PASS (membership uses Stage presentation families, not executive-only) |
| Iconic/presentation actor awareness | PASS (Watch-role actors reported) |
| Stage correction binding | PASS |
| "You" misbinding = 0 | PASS |
| Runtime-confirmed correction | PASS |
| Runtime-disagreement safety | PASS |
| Pronoun continuity | PASS |
| Visible actor follow-up | PASS |
| Presentation-reason safety | PASS |
| Visibility ≠ importance | PASS |
| Visibility ≠ priority | PASS |
| Visibility ≠ causality | PASS |
| Proximity ≠ relationship | PASS |
| Back/Forward | PASS |
| Refresh | PASS |
| Side-question continuity | PASS |
| Read question Stage mutation = 0 | PASS |
| Direct business writes = 0 | PASS |
| Focused A–T | PASS |
| Sequences 1–8 | PASS (1,5 unit; 2–4,6–8 covered by A–T + live 1–7) |
| Live Runtime 1–7 | PASS 7/7 |
| ECA:1–12 regressions | PASS |
| ECA:4-POST1 regression | PASS (included in `eca*.test.ts`) |
| NCA/NXA regressions | PASS (L4 omnibus + POST:3 + FIX4) |
| Stage regressions | PASS (L4 omnibus) |
| Director regressions | PASS (L4 DIR inventory + semantic director) |
| DTH regressions | PASS (L4 omnibus / live smoke) |
| Data regressions | PASS (L4 omnibus) |
| Conversation suite | PASS **452/452** (was 433/433; POST-ECA:2 added 19 tests, 0 regressions) |
| NXA funnel | PASS L1–L3; L4 **7/7 PASS** |
| TypeScript | PASS |
| ESLint | PASS (existing `csvImportStoreVersion` warning unchanged) |
| Production build | PASS (L4 `l4-build`) |
| git diff --check | PASS on POST-ECA:2 files; L4 `l4-diff-check` PASS |
| Blocking failures = 0 | PASS |

## Certification barriers

| Barrier | Result |
| --- | --- |
| Focused A–T | ALL PASS |
| Sequences 1–8 | ALL PASS |
| Live Runtime 1–7 | 7/7 PASS |
| Visible actors → false empty answer | 0 |
| Collection → Stage substitution | 0 |
| Queue → Stage substitution | 0 |
| Focus-null → empty-Stage inference | 0 |
| Focus → only-visible-object inference | 0 |
| Stage correction → "You" binding | 0 |
| Lost visible-actor references | 0 |
| Visibility → importance/priority/causality | 0 |
| Proximity → relationship | 0 |
| Read-only Stage questions → mutations | 0 |
| Direct business writes | 0 |
| Second Stage store / Director / Theatre / ECA:1 / correction engine | 0 |
| ECA:1–12 / ECA:4-POST1 / NCA/NXA / Stage / Director / DTH regressions | 0 |

## Authorities not changed

Director presentation writes. DTH scene direction. Canonical Queue/collection membership. ECA:1 identity. ECA:4 / POST1. ECA:5 engine (binding only). ECA:6 engine (side-question/resume cues only).
