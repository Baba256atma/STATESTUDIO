# NPA-T — Dashboard and Animatable Object Memoization Contract Assessment

| Field | Value |
|---|---|
| **Task / Decision ID** | `AD-FE-MEMO-01` |
| **Title** | `Dashboard and Animatable Object Memoization Contract Assessment` |
| **Status** | `Accepted` |
| **Authority** | `Bahadoor` |
| **Authority role** | `Nexora Product and Architecture Authority` |
| **Decision date** | `2026-07-29` |
| **Original selected option** | `ExtractStableMemoDependencySignaturesPreserveManualMemoContracts` |
| **Original option status** | `RejectedAfterCyclicLintRemediationConflict` |
| **Revised disposition** | `ParkedPendingComponentOwnershipRedesign` |
| **Revised selected option** | `RetainPReact03ParkingUntilPerFileOwnershipRedesign` |
| **Scope** | `PReact03ExecutiveDashboardAndAnimatableObjectMemoizationOnly` |
| **Owner** | Frontend Component Architecture |
| **Governing decisions** | `AD-FE-LINT-01`, `AD-FE-HOOKS-01`, `AD-FE-HOOKS-02`, `CERT-FE-LINT-01` |
| **Parked cluster** | `P-REACT-03` |
| **Prior disposition** | `ParkedPendingComponentMemoizationContract` → assessment → failed extraction → revised parking |
| **Implementation authorized** | `false` |
| **Production deployment authorized** | `false` |
| **ESLint rule weakening authorized** | `false` |
| **Rule suppression authorized** | `false` |
| **EX/RTC modification authorized** | `false` |
| **EX-2:3 implementation authorized** | `false` |
| **Conflict status** | `CyclicLintRemediationConflict` |
| **Readiness** | `ParkedPendingComponentOwnershipRedesign` |
| **CI status** | `CiStillBlockedByParkedReactCompilerDebt` |

---

## 1. Purpose

Assess the parked `react-hooks/use-memo` findings on `ExecutiveDashboardPanel` and `AnimatableObject`, record the failed signature-extraction attempt, and decide a revised architecture contract that does **not** recreate:

- `react-hooks/preserve-manual-memoization` ×25 on `ExecutiveDashboardPanel`;
- `react-hooks/refs` ×1 on `AnimatableObject`;
- the original `react-hooks/use-memo` ×4.

This revision is diagnostic and decision-only. It does **not** remediate production React code.

---

## 2. History (preserved)

### 2.1 Original Accepted option

```text
ExtractStableMemoDependencySignaturesPreserveManualMemoContracts
```

Intent: keep manual memos; extract complex dependency expressions into simple named locals/signatures.

### 2.2 Attempted implementation

```text
NPA-T — P-REACT-03 Memoization Signature Extraction Remediation
```

Attempted changes (restored; not present in current source):

| File | Attempt |
|---|---|
| `ExecutiveDashboardPanel.tsx` | `memoryEntryIdsSignature`, `highlightedObjectIdsSignature`, `sceneObjectIdsSignature` locals; depend on those scalars |
| `AnimatableObject.tsx` | `const objectMaterial = obj.material`; memo deps `[objectMaterial]` |

### 2.3 Exact A↔B findings

| Metric | Before attempt | After attempt | After restore |
|---|---:|---:|---:|
| `use-memo` (cluster) | 4 | 0 | 4 |
| `preserve-manual-memoization` on EDP | 0 | 25 | 0 |
| `refs` on AnimatableObject | 0 | 1 | 0 |
| Project `refs` | 0 | 1 | 0 |
| Suppressions added | 0 | 0 | 0 |

`preserve-manual-memoization` ×25 spanned **16 unique dependency lines** across multiple `useMemo` sites (not 25 distinct memos). Sample Compiler reason: dependency “may be mutated later” (e.g. `cockpitExecutive`).

`refs` ×1: `holdStableScaleInput(stableExecutiveScaleInputRef, …)` — “Passing a ref to a function may read its value during render” at the scale-hold call site.

### 2.4 Restoration

Both files restored to parked Wave-3 memo shapes. No suppressions. No rule weakening.

### 2.5 Rejection

```text
ExtractStableMemoDependencySignaturesPreserveManualMemoContracts
```

is **rejected for implementation**. Same-file dependency-local extraction must not be retried without a new ownership boundary that also addresses the unlocked secondary rules.

---

## 3. Preconditions at revised decision (verified)

| Metric | Value |
|---|---|
| Errors / warnings / total / files | `21` / `288` / `309` / `64` |
| Finding-key hash entering revision (prior session) | `56b84e3250c8b97bd758eb20b3bd5847c8f9280840ea13d2437885999b5b3b1b` |
| Finding-key hash after decision verification (dual-run identical; absolute path + message composition) | `06b7158f291973df4dfe9fa8b1c4d150c1076f4dbeb51dd76f4e602729385d4a` |
| `use-memo` | `4` (EDP ×3, AnimatableObject ×1) |
| `preserve-manual-memoization` | `1` (P-REACT-01 `usePropagationBridge` only) |
| `refs` | `0` |
| `no-explicit-any` / `no-unused-vars` | `0` / `0` |
| TypeScript | zero diagnostics |
| Scene | 296 pass / 0 fail |
| Build | exit 0 |
| EX/RTC lint | 0 |
| Readiness entering this revision | `ParkedPendingRevisedMemoizationArchitectureOption` |

---

## 4. Exact conflict reconstruction

### 4.1 ExecutiveDashboardPanel — three `use-memo` findings (one memo)

All three findings are **complex dependency expressions** on a single memo:

`decisionTraceInputSignature` (current lines ~433–459).

| Finding line | Dependency expression | Capture / meaning |
|---|---|---|
| ~449 | `memoryEntries.map((entry) => entry.id).join("\|")` | Memory entry ID projection |
| ~452 | `(props.objectSelection?.highlighted_objects ?? []).join("\|")` | Highlighted object ID projection |
| ~456 | `props.sceneJson?.scene?.objects?.map(...id...).join("\|")` | Scene object ID projection |

**Memoized expression:**  
`buildExecutiveDecisionTraceInputSignature(extractExecutiveDecisionTraceSignatureInput({ responseData, canonicalRecommendation, memoryEntries, sceneJson, objectSelection, activeMode }))`

**Complete callback capture set (body):**  
`props.responseData`, `canonicalRecommendation`, `memoryEntries`, `props.sceneJson` (via readers), `props.objectSelection` (via readers), `props.activeMode`.

**Other deps (already simple paths):**  
`canonicalRecommendation?.id`, `?.primary?.action`, `?.confidence?.score`, `props.activeMode`, `props.objectSelection?.selected_object_id`, scenario/risk scalars, fragility level/score.

**Identity consumers:**

- `getExecutiveDecisionTraceCache(decisionTraceInputSignature)`
- `decisionTrace` memo keyed solely by `decisionTraceInputSignature`
- Downstream dashboard models that consume `decisionTrace`

**Cache invalidation requirements:**  
Correctness-critical. Signature must change iff business inputs that feed `ExecutiveDecisionTraceSignatureInput` change (IDs, mode, risk, fragility, memory entry IDs, visible object IDs, etc.). Must not thrash on new object identities with identical semantic content.

**Why `use-memo` became clean after extraction:**  
Complex expressions became simple identifiers (`memoryEntryIdsSignature`, etc.), satisfying Compiler simple-expression rules.

**Why `preserve-manual-memoization` ×25 appeared:**  
Clearing the blocking `use-memo` diagnostics allowed React Compiler analysis to continue across the panel’s large manual-memo graph (**~30 `React.useMemo` sites**). The Compiler then reported that many existing manual memos could not be preserved because object-shaped dependencies “may be mutated later.” Messages are **repeated capture/dependency diagnostics** across ~16 unique lines, not 25 independent memo contracts.

**Classification:**  
`CorrectnessAndCacheIdentity` for the signature/trace pair. Many sibling memos are heavy derived models; their retention vs Compiler ownership is unresolved and is the cascade root.

### 4.2 AnimatableObject — one `use-memo` finding

**Current memo (line ~535–539):**

```ts
const material = useMemo<MaterialLike>(() => {
  const resolved = obj.material;
  if (resolved && typeof resolved === "object") return resolved as MaterialLike;
  return { color: "#cccccc", opacity: 0.9 };
}, [(obj as SceneObject & { material?: unknown })?.material]);
```

**Current material access:** `obj.material` in body; complex cast expression in deps.

**`holdStableScaleInput` ownership:**  
Module helper reads/writes `ref.current` during render to hold scale hysteresis (`stableExecutiveScaleInputRef`). Call site ~901–906. This is render-time ref mutation by design today.

**Exact render-time ref access after `objectMaterial` extraction:**  
Not that `objectMaterial` itself touched a ref. After `use-memo` cleared, Compiler reported:

```text
Cannot access refs during render
holdStableScaleInput(stableExecutiveScaleInputRef, ...)
Passing a ref to a function may read its value during render
```

**Why refs appeared only after extraction:**  
Analysis-order / compilation-skip coupling: parked `use-memo` prevented deeper Compiler analysis of the same component; clearing it exposed the latent `holdStableScaleInput` render-time ref contract.

**Material identity impact:**  
Material normalization affects visual appearance (color/opacity/emissive). Scale hold affects executive uniform scale. They are separate contracts; fixing material deps alone is insufficient if clearing `use-memo` always exposes scale-ref analysis.

**Child boundary feasibility:**  
A parent/child can pass a normalized `MaterialLike` (or frozen visual material props) as a simple value and remove the material memo from `AnimatableObject`. That does **not** by itself remove `holdStableScaleInput` render-time ref access; scale stability needs its own ownership redesign (e.g. layout-effect hold, pure hysteresis without ref writes during render, or Compiler-approved pattern).

---

## 5. Candidate-option evaluation

### Option A — Component-boundary normalization

| File | Fit | Verdict |
|---|---|---|
| EDP | Isolating decision-trace into a child/hook with scalar props can clear the three `use-memo` deps **on that boundary**, but does not address the panel’s remaining ~30 manual memos that become `preserve-manual-memoization` once Compiler analysis proceeds | Insufficient alone |
| AnimatableObject | Parent-normalized material prop is viable for the material memo; must be paired with scale-hold redesign | Insufficient alone |

Compiler compatibility: good for the isolated boundary; remount risk if keys change; behavioral preservation requires identity tests.

### Option B — Upstream canonical signature ownership

Domain already has `ExecutiveDecisionTraceSignatureInput` / `buildExecutiveDecisionTraceInputSignature`. Moving projection to the producer (HomeScreen / panel data adapter) so EDP receives a **prebuilt string signature** (and/or already-extracted scalar fields) is architecturally correct.

However: even with a scalar `decisionTraceInputSignature` prop, unlocking Compiler analysis still surfaces `preserve-manual-memoization` on sibling memos unless those memos are also redesigned or removed with proof.

Verdict: **necessary direction for EDP trace identity**, not sufficient alone for cluster clearance.

### Option C — Remove performance-only manual memoization

| Memo | Performance-only? | Removable now? |
|---|---|---|
| `decisionTraceInputSignature` / `decisionTrace` cache | No — correctness/cache identity | **No** |
| Many sibling EDP `useMemo`s | Possibly | Not without per-memo evidence |
| AnimatableObject material memo | Possibly visual-stability; not proven | **No** without Scene proof |

Verdict: not selectable for correctness-critical identity; may be part of a later evidence-driven memo reduction program.

### Option D — Dedicated memo-owning hook

Extracting `useDecisionTraceInputSignature(...)` with scalar inputs relocates the same conflict unless:

1. inputs are already scalars from upstream, and  
2. the parent’s remaining memo graph is in Compiler-safe form, and  
3. AnimatableObject scale-hold is redesigned.

Verdict: useful packaging, not a complete ownership solution.

### Option E — Maintain formal parking

Keep `P-REACT-03` parked until a **per-file ownership redesign** can eliminate `use-memo`, `preserve-manual-memoization`, and `refs` together without behavior change.

Verdict: **selected** — only option that currently meets the “do not recreate A↔B” criterion with evidence.

---

## 6. Revised decision

Selected revised option:

```text
RetainPReact03ParkingUntilPerFileOwnershipRedesign
```

Disposition:

```text
ParkedPendingComponentOwnershipRedesign
```

### 6.1 Per-file future direction (not authorized for implementation in this task)

**ExecutiveDashboardPanel**

1. Upstream (Option B): producers supply canonical scalar signature inputs / prebuilt `decisionTraceInputSignature`.
2. Boundary (Option A/D): decision-trace resolution lives in a narrow hook/child that accepts only scalars + frozen signature.
3. Memo-graph program (Option C where proven): reduce or rewrite sibling manual memos so clearing `use-memo` does not create `preserve-manual-memoization` ×N.

**AnimatableObject**

1. Material (Option A): normalize material at Scene composition parent; pass simple `material` / visual props.
2. Scale hold: separate ownership decision to eliminate render-time `holdStableScaleInput` ref read/write (required companion to any `use-memo` clearance that unlocks refs analysis).

Files must **not** be forced onto one identical pattern.

### 6.2 Explicitly rejected for retry

- Same-file `ExtractStableMemoDependencySignaturesPreserveManualMemoContracts`
- Suppressions / rule weakening
- Ref-driven render state as a lint workaround (`AD-FE-HOOKS-01`)
- Removing correctness-critical decision-trace memoization without product evidence

### 6.3 Implementation authorization

| Item | Value |
|---|---|
| Implementation authorized by this revision | `false` |
| Production React edits authorized | `false` |
| CI lint-gate clean claimed | `false` |
| Parked findings remain visible | `true` |
| Product release / deployment authorized | `false` |

---

## 7. Required tests for any later implementation

### ExecutiveDashboardPanel

- unchanged dashboard output for fixture props;
- unchanged memory / highlight / Scene selection semantics;
- stable decision-trace identity for unchanged semantic inputs with new object identities;
- invalidation when memory IDs, highlighted IDs, scene object IDs, fragility, or mode change;
- no extra render loop / navigation / panel behavior change;
- after any `use-memo` clearance: **zero** new `preserve-manual-memoization` on this file.

### AnimatableObject

- unchanged scale and animation;
- stable material defaults and updates;
- unchanged Scene/R3F ownership and disposal;
- **zero** render-time ref access diagnostics;
- no remount/visual regression;
- `npm run test:scene` green.

### Rollback boundaries

- Independent per-file checkpoints.
- If `use-memo` clears but `preserve-manual-memoization` or `refs` appears: stop, restore that file’s batch, record `CyclicLintRemediationConflict`, do not reverse-edit in the same task.

---

## 8. Anti-loop policy

Unchanged and binding:

1. stop immediately on A↔B rule exchange;
2. restore that file’s batch;
3. retain last clean checkpoint;
4. record `CyclicLintRemediationConflict`;
5. do not try a reverse edit in the same task.

---

## 9. Relationship to other decisions

- `AD-FE-LINT-01`: `P-REACT-03` remains parked; this revision does not weaken parking.
- `AD-FE-HOOKS-02`: memo retention still requires correctness/identity justification.
- `AD-FE-HOOKS-01`: forbids ref workarounds for render state.
- `AD-R3F-01`: material/scale redesign must not invent conflicting dispose/mutate policy.
- `CERT-FE-LINT-01`: CI remains `CiStillBlockedByParkedReactCompilerDebt`.

---

## 10. Reopening triggers

`AD-FE-MEMO-01` must reopen if:

- a later redesign proves Options A/B/C/D can jointly clear all three rule families with evidence;
- React / eslint-plugin-react-hooks / Compiler upgrades change analysis order or rules;
- decision-trace cache semantics or Scene material/scale ownership change by product decision;
- parked finding counts increase or new rules appear on these surfaces;
- suppressions are proposed (not authorized).

---

## 11. Final P-REACT-03 status

```text
PReact03ParkedPendingComponentOwnershipRedesign
CyclicLintRemediationConflict
CiStillBlockedByParkedReactCompilerDebt
```

Recommended next tasks (architecture first; not this remediation):

```text
NPA-T — ExecutiveDashboardPanel Memo-Graph Ownership Redesign Decision
NPA-T — AnimatableObject Material and Scale-Hold Ownership Redesign Decision
```

Do not implement those redesigns in this decision task.

---

## 12. Decision-task verification (docs-only; 2026-07-29)

| Check | Result |
|---|---|
| Production React edits | none |
| Suppressions / ESLint config | unchanged |
| Dual `npm run lint` | `21` / `288` / `309` / `64`; A≡B |
| Dual JSON finding-key hash | `06b7158f291973df4dfe9fa8b1c4d150c1076f4dbeb51dd76f4e602729385d4a` identical |
| `use-memo` / `refs` / project `pmm` on P-REACT-03 files | `4` / `0` / `0` |
| TypeScript | zero diagnostics (`NODE_OPTIONS=--max-old-space-size=8192`) |
| Scene | 296 pass / 0 fail |
| Build | exit 0 |
| EX / RTC lint | 0 / 0 |
| Hosted CI | not executed |
