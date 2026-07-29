# AD-FE-LINT-01 — Disposition of Isolated React Hooks and Compiler Remediation Conflicts

| Field | Value |
|---|---|
| **Decision ID** | `AD-FE-LINT-01` |
| **Title** | `Disposition of Isolated React Hooks and Compiler Remediation Conflicts` |
| **Status** | `Accepted` |
| **Authority** | `Bahadoor` |
| **Authority role** | `Nexora Product and Architecture Authority` |
| **Decision date** | `2026-07-29` |
| **Selected option** | `ParkIsolatedReactCompilerConflictsAndProceedWithIndependentTypingRemediation` |
| **Scope** | `IsolatedHooksDebtDispositionAndWave3SequencingOnly` |
| **Readiness** | `ReadyForExplicitAnyWave3WithinAuthorizedBoundary` |
| **Decision authority source** | `ESLint Wave 2B: Deferred React Hooks and Compiler Contract Remediation` |
| **Related Accepted decisions** | `AD-FE-HOOKS-01`, `AD-R3F-01`, `AD-CHAT-01`, `AD-FE-SHELL-01`, `AD-FE-HOOKS-02`, `AD-FE-MEMO-01` |
| **Wave 2B status at decision** | `EslintWave2BCompletedWithIsolatedConflicts` |
| **Implementation authorized** | Explicit-any Wave 3 within §6 boundary only; parked React remediation not authorized |
| **Production deployment authorized** | `false` |
| **Merge while lint errors remain authorized** | `false` |
| **EX/RTC modification authorized** | `false` |
| **EX-2:3 implementation authorized** | `false` |
| **ESLint rule weakening authorized** | `false` |
| **Rule suppression authorized** | `false` |

---

## 1. Purpose

Record the Accepted disposition of React Hooks/Compiler findings that could not be safely corrected in Wave 2B without recreating A↔B lint cycles (`CyclicLintRemediationConflict`).

This decision does **not** remediate production or test code, hide findings, weaken ESLint, authorize release/deployment, implement EX-2:3, or implement Wave 3.

---

## 2. Canonical decision

Selected option:

```text
ParkIsolatedReactCompilerConflictsAndProceedWithIndependentTypingRemediation
```

Accepted position:

- Wave 2B completed all React corrections that could be safely implemented under `AD-FE-HOOKS-01`, `AD-R3F-01`, `AD-CHAT-01`, `AD-FE-SHELL-01`, and `AD-FE-HOOKS-02`.
- The remaining identified React findings listed in §4 are formally parked as isolated technical debt.
- Parked does **not** mean resolved, passed, waived, accepted as correct, or excluded from lint.
- Existing ESLint findings must remain visible.
- No rule may be disabled or downgraded.
- CI remains blocked until all error-level findings are actually corrected.
- Isolated React debt may not be used to justify production release or deployment.
- Independent `no-explicit-any` remediation may proceed because its ownership and rule surface are separable from the parked React clusters.
- Any Wave 3 change touching a parked cluster must preserve restored behavior and must not attempt React Compiler remediation without reopening this decision.

### Baseline at decision (diagnostic authority)

| Metric | Value |
|---|---|
| Errors | `1568` |
| Warnings | `443` |
| Total findings | `2011` |
| Affected files | `288` |
| Finding-key hash | `9a366d9505a3d942adbd85032094a0664309a3a8a423776acffe23e36b0f0a2c` |
| `rules-of-hooks` | `0` |
| `refs` | `0` |
| `exhaustive-deps` | `288` |
| `preserve-manual-memoization` | `1` |
| `set-state-in-effect` | `2` |
| `immutability` | `13` |
| `use-memo` | `4` |
| `purity` | `1` |
| `globals` | `0` |
| `no-explicit-any` | `1538` |
| `no-unused-vars` | `154` |

---

## 3. Exact parked clusters

### P-REACT-01 — usePropagationBridge

| Field | Value |
|---|---|
| **Surface** | `frontend/app/lib/simulation/usePropagationBridge.ts` |
| **Current Hooks findings** | `preserve-manual-memoization` × **1**; `set-state-in-effect` × **2** |
| **Classification** | Coupled subscription/propagation lifecycle; memoization and state-synchronization ownership conflict; attempted correction risks recreating ref-related violations |
| **Disposition** | `ParkedPendingPropagationLifecycleArchitecture` |
| **Owner** | Frontend State and Propagation Architecture |
| **Production release blocker if surface is on the release path** | `true` |
| **Rule suppression authorized** | `false` |

Required future task:

```text
NPA-T — usePropagationBridge Lifecycle and Synchronization Architecture Decision
```

---

### P-REACT-02 — SceneCanvas and Scene control ownership

| Field | Value |
|---|---|
| **Surfaces** | `frontend/app/components/SceneCanvas.tsx`; `frontend/app/components/scene/navigation/ExecutiveOrbitControls.tsx`; `frontend/app/screens/hooks/scene/useSceneApplyController.ts` |
| **Current Hooks findings** | SceneCanvas: `immutability` × **7**, `purity` × **1**; OrbitControls: `immutability` × **1**; useSceneApplyController: `immutability` × **5** |
| **Classification** | Mutable Scene/R3F/controller integration; correct runtime ownership conflicts with current React Compiler expectations; earlier correction recreated `refs`, producing an A↔B cycle (`CyclicLintRemediationConflict`) |
| **Disposition** | `ParkedPendingSceneMutationOwnershipDecision` |
| **Owner** | Scene Runtime and R3F Architecture |
| **Production release blocker for Scene release** | `true` |
| **Rule suppression authorized** | `false` |

Required future task:

```text
NPA-T — Scene Runtime Mutation Ownership and React Compiler Architecture Decision
```

---

### P-REACT-03 — Memoization-only components

| Field | Value |
|---|---|
| **Surfaces** | `frontend/app/components/panels/ExecutiveDashboardPanel.tsx`; `frontend/app/components/scene/AnimatableObject.tsx` |
| **Current Hooks findings** | `use-memo` × **3** (ExecutiveDashboardPanel) + × **1** (AnimatableObject) = **4** total |
| **Classification** | Manual/lifecycle memoization contract requires focused ownership evidence; prior correction attempts caused preserve-manual-memoization / refs regressions |
| **Disposition** | `ParkedPendingComponentOwnershipRedesign` |
| **Owner** | Frontend Component Architecture |
| **Rule suppression authorized** | `false` |
| **Assessment** | `AD-FE-MEMO-01` — original option `ExtractStableMemoDependencySignaturesPreserveManualMemoContracts` rejected after `CyclicLintRemediationConflict`; revised disposition `ParkedPendingComponentOwnershipRedesign`; implementation authorization `false` |
| **Assessment path** | `docs/architecture/npa-t-dashboard-and-animatable-object-memoization-contract-assessment.md` |

Required follow-up architecture tasks (not implementation):

```text
NPA-T — ExecutiveDashboardPanel Memo-Graph Ownership Redesign Decision
NPA-T — AnimatableObject Material and Scale-Hold Ownership Redesign Decision
```

---

### P-REACT-04 — HomeScreen exhaustive-deps

| Field | Value |
|---|---|
| **Surface** | `frontend/app/screens/HomeScreen.tsx` |
| **Current Hooks findings** | `react-hooks/exhaustive-deps` × **90** (exact count at decision baseline) |
| **Classification** | Megafile ownership and unstable-producer debt; bulk dependency insertion risks render loops, identity churn, navigation changes, and stale-closure regressions |
| **Disposition** | `ParkedPendingHomeScreenOwnershipDecomposition` |
| **Owner** | Executive Shell and Home Experience Architecture |
| **Rule suppression authorized** | `false` |

Required future task:

```text
NPA-T — HomeScreen Effect Ownership and Dependency Decomposition Program
```

---

## 4. SceneCanvas explicit-any boundary

Wave 2B restoration of SceneCanvas after a `CyclicLintRemediationConflict` reintroduced **three** `@typescript-eslint/no-explicit-any` findings relative to the pre-Wave-2B cleaned SceneCanvas typing posture. Project `no-explicit-any` baseline at this decision is **1538** (was 1535 before that restore side effect).

| Field | Value |
|---|---|
| **Classification** | Typing debt, not React Compiler debt |
| **Eligible for Wave 3** | `true` |
| **Wave 3 may correct those three typings** | `true` |
| **Wave 3 must not alter Scene mutation ownership** | `true` |
| **Wave 3 must not retry parked React Compiler correction** | `true` |
| **Scene tests and runtime behavior must remain unchanged** | `true` |

---

## 5. Wave 3 authorization boundary

Authorized next task:

```text
NPA-T — ESLint Wave 3: Explicit-Any Contract and Domain Typing Corrections
```

Wave 3 authorization is limited to:

- replacing explicit `any` with accurate domain types;
- adding type guards and safe `unknown` narrowing;
- correcting generic contracts;
- restoring the three SceneCanvas typings without altering the parked Scene mutation contract;
- preserving runtime behavior.

Wave 3 must **not**:

- remediate parked Hooks/Compiler findings;
- modify effect dependencies merely for lint;
- change ref ownership;
- alter Scene/R3F mutation ownership;
- alter propagation lifecycle;
- decompose HomeScreen;
- change memoization behavior;
- disable lint rules.

---

## 6. Relationship to other decisions

- `AD-FE-HOOKS-01`, `AD-R3F-01`, `AD-CHAT-01`, `AD-FE-SHELL-01`, and `AD-FE-HOOKS-02` remain Accepted and continue to govern any future React remediation.
- `AD-FE-LINT-01` does not weaken those decisions.
- Specialized parked-cluster ADs required by §3 future tasks supersede only their narrow reopen/remediation scope after acceptance.
- Existing MRP, routing, Scene, EX, RTC, and TypeScript authorities remain unchanged.

---

## 7. Reopening triggers

`AD-FE-LINT-01` must reopen if:

- a parked cluster is modified;
- its finding count increases;
- a new rule appears in that cluster;
- a Wave 3 typing correction changes runtime behavior;
- React or `eslint-plugin-react-hooks` is upgraded;
- React Compiler behavior changes;
- the affected surface enters a production release scope;
- tests expose stale closure, render loop, resource leak, duplicate subscription, or mutation defects;
- a safe architecture solution becomes available;
- CI lint policy changes.

---

## 8. Release and CI classification

| Item | Value |
|---|---|
| TypeScript gate | clean |
| Scene runtime gate | clean |
| build gate | clean |
| ESLint gate | failed |
| Hosted CI | not claimed |
| CI status | `CiStillBlockedByLint` |
| Product release authorized | `false` |
| Deployment authorized | `false` |
| Parked debt accepted for production | `false` |
| Wave 3 development authorized | `true` |
| EX-2:3 posture | `AllowMetadataOnlyEx23WithLintBlockerRecorded` |

This decision permits continued remediation work, not merging or release while lint errors remain.

---

## 9. Explicit non-authorizations

This decision does **not** authorize:

- React implementation changes in this decision task
- Tests written to hide findings
- ESLint configuration changes, ignores, overrides, or suppressions
- Disabling or downgrading rules
- Excluding parked files from lint
- CI gate changes or `continue-on-error`
- Scene, HomeScreen, propagation, or memoization contract changes
- EX/RTC modification
- EX-2:3 implementation
- Wave 3 implementation in this decision task
- Deployment

---

## 10. Implementation posture

| Item | Value |
|---|---|
| Production changes in this decision task | None |
| Test changes in this decision task | None |
| ESLint configuration changes in this decision task | None |
| Parked findings remain visible | Yes |
| Wave 3 development authorized after this record | Yes (within §5 boundary) |
| Readiness after this record | `ReadyForExplicitAnyWave3WithinAuthorizedBoundary` |
