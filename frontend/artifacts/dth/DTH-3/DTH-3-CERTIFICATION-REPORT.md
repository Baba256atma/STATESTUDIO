# DTH:3 Certification Report

Nexora Decision Theatre NexoGraph Visual Grammar on the certified DTH:1 and DTH:2 `/executive` foundation.

## Verdict

**DTH:3 = CERTIFIED**

No DTH:3-owned failure remains. DTH:4 was not started.

## Zero-failure prerequisite (scene naming)

See `SCENE-NAMING-PREREQUISITE.md`.

Before DTH:3 implementation, `npm run test:scene` failed in `objectNaming.test.ts` (`sparse`/`critical` vs canonical name-density `comfortable`/`balanced`/`compact`, and compact `showSelectedOnly` not enforced). The owning name-density contract was completed; obsolete composition-tier names were not restored on production. After the fix, `npm run test:scene` is **PASS**.

## Architecture

See `ARCHITECTURE-INSPECTION.md`.

Runtime → Theatre projection → NexoGraph semantic directives → renderer tokens → Stage → Advisor-readable explanation. Director and renderer do not create business meaning.

## Reused authorities

DTH:1 foundation, DTH:2 Executive/Iconic language, existing status/attention/focus/selection/layout, DIR:1, NEX-MVP Stage.

## Created files

- `app/lib/decision-theatre/nexoraDecisionTheatreVisualGrammar.ts`
- `app/lib/decision-theatre/nexoraDecisionTheatreChannelOwnership.ts`
- `app/lib/decision-theatre/nexoraDecisionTheatreSemanticPalette.ts`
- `app/lib/decision-theatre/nexoraDecisionTheatreRendererTokens.ts`
- `app/lib/decision-theatre/nexoraDecisionTheatreRelationshipGrammar.ts`
- `app/lib/decision-theatre/nexoraDecisionTheatreVisualClaimLedger.ts`
- `app/lib/decision-theatre/nexoraDecisionTheatreVisualProjection.ts`
- `app/lib/decision-theatre/nexoraDecisionTheatreVisualGrammarFixtures.ts`
- `app/lib/decision-theatre/nexoraDecisionTheatreVisualGrammar.test.ts`
- `artifacts/dth/DTH-3/*`

## Modified files

Theatre contract (NexoGraph moved to supported), Stage compatibility, Advisor context, diagnostics, invariants, Director boundary, public index, DTH:1 tests, Executive shell, Stage mount, 3D Stage host, Iconic satellites, object-name density (prerequisite).

## NexoGraph grammar contract

Version `1.0.0`, identity `DTH:3/NexoGraphVisualGrammar`. Directives are renderer-neutral: participant id, family, channel, semantic token, source, provenance, limitation, visual token, explanation ref, fallback, conflict, accessibility equivalent. No dependency on display name, CSS class, fixture id, screen coordinates, or raw hex in Director logic.

## Visual channel ownership

| Channel | Means | Must not mean |
|---|---|---|
| Form / icon | Identity (Executive type or Iconic role) | Status, urgency, confidence |
| Color | Current supported managerial state | Type, decoration, importance, cost, confidence %, relationship strength |
| Size | Comparable relative impact only | Urgency, cost, popularity, confidence, selection, canonical importance, business value |
| Distance | Contextual relevance (existing layout unless a supported directive applies) | Causality, risk probability, priority, duration, hierarchy |
| Opacity | Contextual de-emphasis; still present | Deleted, invalid, resolved, unimportant, low confidence, inactive |
| Halo | Supported attention | Focus, selection, critical status, recommendation, approval, execution readiness |
| Line pattern | Relationship support (established / candidate / unknown) | Causality, falsehood |
| Line weight | Comparable evidence strength | Mention count, proximity, status, Director preference |
| Direction | Supported dependency or flow | Causality unless the causal layer supports it |
| Motion | Real transition only; live is `motion-none` | Decorative life |
| Iconography | Iconic role identity | Status |

## Semantic state palette

Maps existing runtime status. Manager labels avoid internal `WATCH`.

| Token | Inputs | Manager meaning |
|---|---|---|
| state-neutral | missing/unknown/none | No distinctive state |
| state-stable | stable | On track |
| state-attention-required | watch | Attention required |
| state-critical | risk | Critical |
| state-positive-movement | improving | Improving |
| state-uncertain | unresolved/uncertain | Uncertain |
| state-unavailable | missing | Unavailable |

Renderer hex lives only in `nexoraDecisionTheatreRendererTokens.ts`. Color is never the only carrier: accessible label + non-color equivalent + Advisor explanation.

## Relationship visual grammar

`resolveNexoraDecisionTheatreRelationshipVisual`: pattern from support state, weight only when comparable, arrows only with explicit direction, causal language always off in DTH:3 (no causal authority layer). Unknown ≠ false. Association ≠ influence ≠ cause.

## Visual claim ledger

Every non-neutral directive has an immutable claim (participant, channel meaning, supporting fact, provenance, limitation, why visible, must-not-infer, Advisor explanation). Read-only presentation metadata. Not an evidence store.

## Safe fallbacks

Missing/incomparable impact → equal size. Missing status → neutral. No halo without attention. No motion. Unknown relationship pattern. Neutral line weight. No fabricated Iconics or zero cost/time.

## Conflict resolution

Focus/selection overlays do not overwrite status tokens. Halo does not replace focus. Critical color does not erase identity form. Iconic remains `size-subordinate`. Canonical Risk stays an Executive Object. Relationship support does not become causal language. Unresolvable cases fall back to neutral and are recorded as conflicts.

## Minimal live application

Stage host: `data-nexograph-*` on mount and object controls. Existing 3D materials and layout are preserved. Live impact sizing remains equal. Live Iconic count is 0. Atmosphere attribute is `none`. Legend is reserved and not shown.

## Advisor-readable visual explanation

`advisorReadable.visualExplanations` answers form, color, size, fade, halo, line, arrow, evidence, unknown, and must-not-infer in manager language. No `NexoGraph`, DTH codes, or `WATCH`. Full “Explain the Visual” UX is out of scope.

## Accessibility

Semantic labels, `accessibilityDescription` on presentations, Iconic `aria-label`, reduced-motion preserves tokens with `motion-none`, no flashing, status not encoded only by opacity, relationships not encoded only by color, magnitude requires comparable criterion plus accessible explanation. Compact legend reserved, not permanently open.

## Diagnostics

Developer trace adds grammar version, directive/claim counts, fallbacks, conflicts, atmosphere `none`. Not shown in manager UI.

## Out of scope (not started)

DTH:4 War Room, environmental coloring, DTH:5 Scene Intent, Scene Script, Visual Behavior Engine, Cards/Charts, NexoLens, NexoRoute, NexoCause, NexoRisk, NexoEvidence view, NexoProgress, NexoOwnership, NexoSelect, NexoCompare, NexoTime, Theatre Replay, Advisor suggested questions, LLM-directed composition.

## Automated tests

| Gate | Result |
|---|---|
| Scene naming / `npm run test:scene` | EXIT 0 — Vitest 180/180, node 296/296 |
| DTH:3 focused | EXIT 0 — 8/8 (proofs 1–30 covered) |
| DTH:1 regression | EXIT 0 — 15/15 |
| DTH:2 regression | EXIT 0 — 15/15 |
| Stage + Director (+ 3D host) | EXIT 0 — 73/73 |
| Manager–Object | EXIT 0 — 563/563 |
| Conversation | EXIT 0 — 336/336 |
| NEX-EXP + Decision/Execution | EXIT 0 — 195/195 |
| `npm test` | EXIT 0 — 81/81 |
| TypeScript | EXIT 0 |
| Production Build | EXIT 0 |
| ESLint | 0 errors, 483 pre-existing warnings (none on DTH:3 files) |
| `git diff --check` | EXIT 0 |

Logs: `gates/`.

## Runtime browser certification

Fresh production runtime: `npx next start -p 3013` → `http://localhost:3013/executive` (not the stale 3012 DTH:2 process).

`live-dth3.mjs` / `live-browser.json` / `live-stage.png`:

- Stage and Advisor load
- Grammar version 1.0.0, supported, legend hidden, atmosphere none
- Executive identity retained; Iconic DOM count 0
- Click-to-center Revenue and Risk
- Back, Forward, Escape, Overview
- Collections via conversation; refresh parity on problems
- Equal size only; no cards/charts/NexoSelect/NexoTime
- No page errors, no DTH-attributed console errors, no hydration errors, no architecture terms in Advisor replies
- Read-only “Explain it” / comparison questions preserve Stage

Live data does not invent positive impact scaling or Iconic Cost/Time. Safe-neutral live behavior is certified.

## Known failures

None remaining for DTH:3. DTH:4 is deferred, not a failure.

## Final certification verdict

**DTH:3 = CERTIFIED**

Do not begin DTH:4.
