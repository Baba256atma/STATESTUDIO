# AD-FE-EDP-01 — ExecutiveDashboardPanel Decision-Trace Memo-Graph Ownership

| Field | Value |
|---|---|
| **Decision ID** | `AD-FE-EDP-01` |
| **Title** | `ExecutiveDashboardPanel Decision-Trace Memo-Graph Ownership` |
| **Status** | `ParkedPendingMemoGraphOwnershipEvidence` |
| **Authority** | `Bahadoor` |
| **Authority role** | `Nexora Product and Architecture Authority` |
| **Decision date** | `2026-07-29` |
| **Scope** | `ExecutiveDashboardPanel decision-trace memo graph only` |
| **Selected option** | `Option F — Continued parking` |
| **Disposition** | `ExecutiveDashboardPanelParkedPendingMemoGraphOwnershipEvidence` |
| **Implementation authorization** | `false` — later task only after reopening and acceptance |
| **Deployment authorization** | `false` |
| **Governing authority** | `AD-FE-MEMO-01`, `AD-FE-LINT-01`, `CERT-FE-LINT-01`, `AD-FE-AO-01`, P-REACT-03 `CyclicLintRemediationConflict` |

---

## 1. Decision

No implementation architecture is Accepted by this record.

The decision-trace domain already owns the canonical signature algorithm, trace resolver, and cache. `ExecutiveDashboardPanel` nevertheless reconstructs trace inputs and owns the React memo that calls those domain functions. Moving only that trace-specific work upstream or into a child would remove the three complex dependency expressions, but it would also allow React Compiler analysis to continue through the panel's other 28 manual memos. The prior experiment then produced 25 `react-hooks/preserve-manual-memoization` messages across 16 unique dependency lines.

There is no retained per-line diagnostic artifact that proves which complete set of sibling memos must be redesigned. Reproducing the failed same-component extraction is expressly prohibited. Consequently, Options A and E are credible directions but cannot guarantee the acceptance criteria from current evidence.

The binding disposition is:

```text
ExecutiveDashboardPanelParkedPendingMemoGraphOwnershipEvidence
```

P-REACT-03 remains:

```text
PReact03ParkedPendingComponentOwnershipRedesign
CyclicLintRemediationConflict
```

No production or test implementation is authorized.

---

## 2. Preconditions and restored posture

| Check | Result |
|---|---|
| ESLint | `21` errors / `288` warnings / `309` total / `64` files |
| ExecutiveDashboardPanel `use-memo` | exactly `3` |
| AnimatableObject `use-memo` | exactly `1`; formally parked by `AD-FE-AO-01` |
| Project `refs` | `0` |
| `no-explicit-any` / `no-unused-vars` | `0` / `0` |
| TypeScript | zero diagnostics with the governing 8 GB Node heap |
| Scene | `296` pass / `0` fail |
| Build | exit `0` when Google Fonts are reachable |
| EX / RTC lint | `0` / `0` |
| New suppression | none |
| ExecutiveDashboardPanel | fully restored; no local source diff |
| Prior extraction | recorded by `AD-FE-MEMO-01`: three `use-memo` findings cleared, then 25 `preserve-manual-memoization` messages appeared across 16 unique dependency lines; restored |
| `AD-FE-AO-01` | documentation-only; implementation remains unauthorized |

Environmental classification:

- literal default-heap TypeScript can exhaust the approximately 4 GB Node heap; governing verification uses `NODE_OPTIONS="--max-old-space-size=8192"`;
- a sandboxed Next.js build can fail while fetching Geist from Google Fonts; only a disclosed network-enabled build is counted as a successful build;
- neither environmental condition is a source regression.

---

## 3. Exact component memo inventory

The component contains **30 `React.useMemo` calls** and **zero `useCallback` calls**. The table records every memo in source order.

| # | Memo | Direct source/normalization | Derived dependencies | Primary consumer / identity role | Classification |
|---:|---|---|---|---|---|
| 1 | `hasDashboardData` | Presence of Scene, response, recommendation, result, cockpit, advice, propagation, memory | none | Empty/data rendering branch and canonical recommendation fallback | Render correctness |
| 2 | `canonicalRecommendation` | Prop, response readers, or recommendation builder | `hasDashboardData`, `cockpitExecutive`, `strategicAdvice`, response fields | Nearly every downstream decision model and JSX | Correctness-critical canonical model |
| 3 | `decisionBrief` | Fragility, impact, advice, cockpit, recommendation, response | `canonicalRecommendation` | Summary, risk, recommendation and impact JSX | Correctness; heavy guarded computation |
| 4 | `compareModel` | Recommendation, result, response, advice | `canonicalRecommendation` | Compare cards, trade-offs, future divergence | Correctness; heavy guarded computation |
| 5 | `nexoraB18SimulateBlock` | Prop | signature field | Simulation JSX | Stable prop projection |
| 6 | `scenarioTree` | Response, result, advice, memory | `canonicalRecommendation` | Recommended/alternative futures and scenario JSX | Correctness; heavy guarded computation |
| 7 | `confidenceModel` | Recommendation, response/Scene, result | `canonicalRecommendation` | Confidence card and calibration | Correctness |
| 8 | `memoryEntries` | Memory prop or new empty array | none | Canonical collection for most learning/governance models | Identity normalization |
| 9 | `recentMemory` | Slice of `memoryEntries` | `memoryEntries` | Memory preview JSX | Performance/identity for child list |
| 10 | `executionIntent` | Recommendation, response, result | `canonicalRecommendation` | Action bar, collaboration, policy, governance, approval | Correctness-critical execution identity |
| 11 | `decisionTraceInputSignature` | Trace signature extraction over response, recommendation, memory, Scene, selection, mode | canonical scalar fields plus three complex ID projections | Cache key for `decisionTrace` | Correctness-critical cache identity; source of three `use-memo` findings |
| 12 | `decisionTrace` | Domain cache lookup and trace resolver | `decisionTraceInputSignature` | Confidence card trace summary | Correctness-critical cache result |
| 13 | `calibration` | Recommendation, confidence, outcome assessment, memory | `canonicalRecommendation`, `confidenceModel`, `memoryEntries` | Confidence card and `metaDecision` | Correctness |
| 14 | `observedAssessment` | Recommendation, response, result, memory | canonical models/collections | Outcome feedback and JSX | Correctness |
| 15 | `outcomeFeedback` | Recommendation, assessment, first memory, response | `observedAssessment`, canonical inputs | Outcome JSX and feedback calibration | Correctness |
| 16 | `feedbackCalibration` | Recommendation, feedback, prior memory score | `outcomeFeedback`, canonical inputs | Outcome JSX | Correctness |
| 17 | `patternIntelligence` | Memory and recommendation | canonical inputs | Pattern JSX | Derived domain model |
| 18 | `strategicLearning` | Memory and recommendation | canonical inputs | Learning JSX | Derived domain model |
| 19 | `metaDecision` | Response reasoning/simulation/comparison, recommendation, calibration, memory | `calibration`, canonical inputs | Meta-decision JSX and governance | Correctness |
| 20 | `defaultCognitiveStyle` | Mode, view, response, recommendation | `canonicalRecommendation` | Cognitive-style JSX | Derived view model |
| 21 | `teamDecision` | Response, recommendation, result, memory | canonical inputs | Team JSX, collaboration, governance | Correctness |
| 22 | `collaborationEnvelope` | Workspace/project/decision IDs | `executionIntent`, recommendation ID | Collaboration model | Store-loaded identity envelope |
| 23 | `collaborationState` | Recommendation, intent, response, result, memory, envelope, team | multiple derived models | Collaboration JSX | Correctness |
| 24 | `decisionCouncil` | Response, recommendation, result, memory, collaboration inputs | canonical inputs/envelope | Council JSX | Correctness |
| 25 | `orgMemoryEntries` | Store-loaded scoped memory merged/deduped with current memory | workspace and `memoryEntries` | `orgMemory` | Store collection identity |
| 26 | `orgMemory` | Organizational memory builder | recommendation and `orgMemoryEntries` | Org-memory JSX and governance | Correctness |
| 27 | `policy` | Recommendation, intent, result, response, memory | canonical inputs | Policy JSX, governance, approval, action bar | Correctness |
| 28 | `governance` | Recommendation, intent, result, response, memory, org/team/meta/policy | broad derived graph | Governance JSX, approval lookup/model, action bar | Correctness-critical authorization model |
| 29 | `approvalEnvelope` | Workspace/project/governance/decision IDs | governance and intent/recommendation IDs | Approval workflow | Store-loaded identity envelope |
| 30 | `approvalWorkflow` | Recommendation, intent, governance, result, response, memory, envelope, policy | broad derived graph | Approval JSX and action bar | Correctness-critical workflow |

The exact AST-backed count is 30, consistent with the governing assessment's “~30” wording. There are no callbacks.

### 3.1 Ordered dependency graph

```text
props / response / Scene / stores
  ├─ presence normalization ──> hasDashboardData
  ├─ record readers ──> responseRecord / fragility / cockpitExecutive / strategicAdvice
  ├─ recommendation normalization ──> canonicalRecommendation
  │    ├─> decisionBrief / compareModel / scenarioTree / confidenceModel
  │    ├─> executionIntent
  │    ├─> calibration ──> metaDecision
  │    ├─> observedAssessment ──> outcomeFeedback ──> feedbackCalibration
  │    ├─> patternIntelligence / strategicLearning / defaultCognitiveStyle
  │    ├─> teamDecision ──> collaborationState
  │    ├─> decisionCouncil
  │    ├─> orgMemory
  │    └─> policy ──> governance ──> approvalWorkflow
  ├─ memory prop ──> memoryEntries
  │    ├─> recentMemory
  │    ├─> trace memory-ID projection
  │    └─> most learning/collaboration/governance models above
  ├─ object selection ──> selected/highlighted-ID projections ─┐
  ├─ Scene objects ──> visible object-ID projection ──────────┤
  └─ response/recommendation/mode scalars ────────────────────┤
                                                               v
             ExecutiveDecisionTraceSignatureInput normalization
                                                               |
                                                               v
                 decisionTraceInputSignature (domain algorithm)
                                                               |
                                                               v
              decisionTrace memo ──> domain cache/resolver
                                                               |
                                                               v
                         ConfidenceCard trace summary
```

### 3.2 Mutation and reconstruction analysis

Reconstructed during render:

- `responseRecord`, `sceneSurface`, response sub-record readers, fragility readers, driver arrays, pressure arrays, simulation arrays, and several display scalars;
- the three ID projections in the trace memo dependency list;
- `readTraceSceneJson(...)` and `readTraceObjectSelection(...)` results, separately reconstructed for signature extraction and trace resolution;
- fallback empty arrays/objects wherever props or store envelopes are absent.

Potentially mutable in current TypeScript contracts:

- `SceneJson`, `LooseRecord`, `CanonicalRecommendation`, `DecisionMemoryEntry[]`, selection arrays, response records, store envelopes, and all builder-returned object models are not deeply readonly;
- many manual memos depend on those object-shaped values or on other object-shaped memo results;
- store loaders return shared envelopes/collections whose mutation discipline is external to this component.

Identity consumers:

- `decisionTraceInputSignature` is the key for the module-level single-entry trace cache;
- `decisionTrace` result identity is returned from that cache for an unchanged signature and rendered into the confidence card;
- execution, policy, governance, and approval identities flow into `DecisionActionBar`;
- the remaining models are consumed directly by JSX and, in several cases, as inputs to later memoized builders.

Only narrow projections such as `hasDashboardData`, `recentMemory`, and `nexoraB18SimulateBlock` might be performance/identity conveniences. The trace signature/cache, recommendation, execution, policy, governance, approval, and derived decision models are correctness-relevant. No broad manual-memo removal is justified by present measurements.

---

## 4. Recorded 25-message cascade

`AD-FE-MEMO-01` is the diagnostic authority for the failed attempt:

- extracting the three complex ID expressions into same-component locals cleared the three ExecutiveDashboardPanel `use-memo` findings;
- React Compiler then emitted 25 `preserve-manual-memoization` messages;
- those messages spanned 16 unique dependency lines across multiple memos;
- the sample reason was that an object-shaped dependency such as `cockpitExecutive` “may be mutated later”;
- restoration returned the file to three `use-memo` findings and zero panel `preserve-manual-memoization` findings.

The 25 messages are **one unlocked ownership cascade**, not evidence of 25 independent defects. The blocking trace memo had prevented deeper analysis of the large sibling memo graph. The exact per-line output was not retained in the repository, so this record does not invent a location list. A future implementation must capture the complete Compiler output at its isolated checkpoint.

---

## 5. Decision-trace ownership

| Concern | Current effective owner | Correct architectural owner |
|---|---|---|
| Memory object-ID signature input | Panel projects `memoryEntries`; domain extractor truncates, validates and normalizes IDs | Decision-trace domain selector/view-model builder |
| Highlighted object-ID input | Panel dependency list joins all highlights, while domain extraction uses selection ID or first highlight | Selection domain supplies canonical selected identity; trace selector consumes it |
| Scene object-ID signature | Panel maps Scene objects; domain builder validates/sorts visible IDs | Scene visibility/registry selector supplies canonical visible IDs; trace selector owns signature inclusion |
| Decision-trace input signature | Panel memo invokes domain functions | `executiveDecisionTraceSignature` domain module |
| Cache invalidation | Signature equality in module-level cache | Decision-trace service/cache |
| Trace model construction | Panel invokes resolver | Decision-trace runtime/service |
| Trace rendering | Panel maps the resolved last-three events into a summary | ExecutiveDashboardPanel or a stable unkeyed trace presentation child |

The domain extractor reveals a semantic mismatch that must be characterized before migration: the panel's dependency list includes recommendation action/confidence and all highlighted IDs, while `ExecutiveDecisionTraceSignatureInput` serializes recommendation ID and only the selected/first-highlighted ID. Some dependency changes can therefore rerun the memo without changing the cache key. Upstream ownership must use the domain signature contract, not preserve incidental React dependency expressions as a second canonical signature.

Dependency direction must be one-way:

```text
Home/Scene/selection/memory domain data
  -> canonical selectors
  -> immutable decision-trace input/view model
  -> decision-trace service/cache
  -> render-only panel props
```

The decision-trace modules must not import the panel, RightPanelHost, or HomeScreen.

---

## 6. Candidate assessment

| Option | Assessment | Disposition |
|---|---|---|
| **A — Upstream immutable decision-trace view model** | Architecturally correct for canonical ownership. A pure typed builder can accept canonical response/recommendation/memory/selection/Scene inputs and return readonly signature input, signature, and trace result. It improves mutation safety and testability and keeps cache invalidation in the domain. However, moving the panel's two trace memos still exposes its 28 sibling memos; current evidence cannot prove zero cascade. | Preferred domain direction; insufficient alone |
| **B — Dedicated controller hook** | A hook inside or adjacent to the panel relocates React memoization without changing domain ownership. Unless it receives an already canonical immutable view model, it repeats the same object dependencies and Compiler conflict. | Rejected as ownership solution |
| **C — Child memo-owning boundary** | A stable, unkeyed child can isolate trace rendering and avoid remount when passed scalar signature/readonly events. It cannot canonically derive upstream signatures and does not prevent Compiler from analyzing the parent sibling graph after the blocking finding is removed. | Insufficient alone |
| **D — Pure recomputation** | The signature controls a correctness/performance cache, trace resolution is measured against a performance budget, and cached result identity is observable. No measurement proves recomputation cheap or identity-free. | Rejected |
| **E — Upstream view model plus child** | Cleanly separates domain identity from render identity and is the strongest trace-specific target. It still cannot guarantee that clearing the blocker leaves the parent's sibling manual memos preservable. A wider immutable dashboard view-model program would exceed this record's scope and currently lacks ownership evidence. | Preferred reopening candidate; not Accepted |
| **F — Continued parking** | Preserves restored behavior and zero new Compiler findings until the complete cascade and immutable boundaries are characterized. | Selected |

---

## 7. Acceptance invariants for reopening

A later Accepted design must prove at one ExecutiveDashboardPanel-only checkpoint:

- ExecutiveDashboardPanel `react-hooks/use-memo`: `3 → 0`;
- zero new `preserve-manual-memoization`, `refs`, `exhaustive-deps`, `immutability`, or `purity`;
- zero `any`, unused variables, suppression, rule/configuration weakening, or ignore;
- identical trace signature and output for identical canonical inputs;
- stable cached trace identity for an unchanged canonical signature;
- invalidation exactly when canonical scenario, decision, selected object, risk/FRSI, visible IDs, recommendation ID, timeline version, mode, or first-eight memory IDs change;
- no invalidation from unrelated prop/reference churn;
- unchanged memory, highlight/selection, and Scene visibility semantics;
- unchanged recommendation, confidence, governance, approval, and action behavior;
- no render/effect loop, route change, panel change, navigation change, remount, or new cache lifetime;
- no broad object stringification or mutable identity cache.

---

## 8. Required future tests

1. identical canonical inputs with new container identities produce the same `ExecutiveDecisionTraceSignatureInput` and signature;
2. memory ID changes within the first eight invalidate; unrelated memory content and IDs beyond the contract boundary do not;
3. canonical selected object / first-highlight change invalidates according to the domain selection rule;
4. canonical visible Scene object-ID change invalidates, while order-only change does not;
5. recommendation ID, scenario, decision, risk/FRSI, timeline version, and active mode changes invalidate independently;
6. unrelated recommendation action/confidence or broad response object churn does not invalidate unless the canonical signature contract is intentionally revised;
7. resolved last-three trace output matches current fixtures exactly;
8. unchanged signature returns the same cached trace result without additional computation;
9. panel render output and render count remain stable for unchanged canonical input;
10. no effect/render loop, route transition, panel switch, navigation change, or child remount;
11. the complete isolated ESLint output contains zero new Compiler findings;
12. full TypeScript, Scene, build, and visual/panel regression checks remain green.

---

## 9. Conditional migration and authorized-file boundary

No files are authorized for implementation by this record.

If reopened and Option E or a broader proven option is Accepted, the proposed narrow implementation boundary is:

- `frontend/app/lib/decision/trace/executiveDecisionTraceSignature.ts`;
- `frontend/app/lib/decision/trace/executiveDecisionTraceRuntime.ts`;
- `frontend/app/lib/decision/trace/executiveDecisionTraceCache.ts` only if cache API changes are explicitly accepted;
- one new pure decision-trace view-model/selector module under `frontend/app/lib/decision/trace/`;
- `frontend/app/components/panels/ExecutiveDashboardPanel.tsx`;
- the immediate producer boundary (`RightPanelHost.tsx`) only if it is proven to own canonical inputs;
- focused trace and panel tests.

`HomeScreen.tsx` is not authorized merely because it is upstream; its P-REACT-04 ownership remains separately parked. No dashboard mega-controller is authorized.

Conditional sequence:

1. add characterization tests for current signature, selection/highlight, Scene IDs, memory truncation, output, cache identity, and panel render behavior;
2. capture the full isolated 25-message Compiler cascade without landing the prohibited extraction;
3. define deeply readonly canonical selector/view-model contracts in the decision-trace domain;
4. prove dependency direction and cache invalidation in pure tests;
5. prove or separately redesign every sibling memo implicated by the captured cascade;
6. pass immutable view-model output through the immediate producer;
7. optionally introduce a stable, unkeyed trace presentation child;
8. remove panel trace memo ownership only in a single checkpoint;
9. run the ExecutiveDashboardPanel-only lint checkpoint before broader verification.

Rollback boundaries:

- domain selector/view-model;
- immediate producer contract;
- optional child presentation;
- panel memo removal;
- any wider sibling memo-graph redesign.

Each boundary must be independently restorable. Cache lifetime and route/panel ownership are separate boundaries and must not change incidentally.

---

## 10. Anti-loop policy

If clearing the three `use-memo` findings creates any `preserve-manual-memoization`, `refs`, or other Compiler finding:

1. stop immediately;
2. restore the ExecutiveDashboardPanel batch;
3. record `CyclicLintRemediationConflict`;
4. retain the last clean checkpoint;
5. do not attempt the reverse correction in the same task;
6. retain formal parking.

---

## 11. Prohibited alternatives

- editing ExecutiveDashboardPanel in this architecture task;
- retrying the same-component signature-local extraction;
- building complex expressions directly in dependency arrays;
- treating joined ID strings in the render component as canonical domain signatures;
- stringifying broad response, Scene, recommendation, or selection objects;
- using refs, effects, module mutation, or component-local caches as identity workarounds;
- moving the same graph into a hook without changing ownership;
- relying on a child boundary to hide unresolved parent memo ownership;
- removing correctness-critical trace/cache memoization;
- creating a dashboard mega-controller;
- expanding into parked HomeScreen ownership without a separate Accepted decision;
- adding `any`, unused values, suppressions, rule weakening, config changes, or ignores.

---

## 12. Verification record

This record changes documentation only. Production React, tests, ESLint configuration, suppressions, and the restored panel remain unchanged.

| Check | Run A | Run B |
|---|---|---|
| `npm run lint` | `21` errors / `288` warnings / `309` total / `64` files | identical |
| Finding-key hash | `8fc4a8ea4c49e0a4fc2b61dd2a022500cfac53bf547b12abdf67571cbce758b3` | identical |
| ExecutiveDashboardPanel `use-memo` | `3` | `3` |
| AnimatableObject `use-memo` | `1` | `1` |
| Project `refs` | `0` | `0` |
| Project `no-explicit-any` / `no-unused-vars` | `0` / `0` | `0` / `0` |
| EX / RTC lint findings | `0` / `0` | `0` / `0` |
| `NODE_OPTIONS="--max-old-space-size=8192" npm run typecheck` | exit `0`, zero diagnostics | exit `0`, zero diagnostics |
| `npm run test:scene` | `296` pass / `0` fail | `296` pass / `0` fail |
| `NODE_OPTIONS="--max-old-space-size=8192" npm run build` | exit `0` | exit `0` |

The two successful builds used network access for `next/font` Geist downloads. Hosted CI was not executed and is not claimed.

Final change audit:

- production code changed: no;
- test code changed: no;
- ExecutiveDashboardPanel changed: no;
- AnimatableObject or `AD-FE-AO-01` changed by this task: no;
- ESLint configuration or ignore changed: no;
- suppression added or removed: no;
- architecture documentation added by this task: this record only.
