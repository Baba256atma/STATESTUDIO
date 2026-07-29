# ESLint Suppression Audit, Final Remaining Diagnostics Remediation, and CI Gate Certification

| Field | Value |
|---|---|
| **Record ID** | `CERT-FE-LINT-01` |
| **Title** | `ESLint Suppression Audit and CI Gate Certification` |
| **Status** | `Accepted` |
| **Authority** | `Bahadoor` |
| **Authority role** | `Nexora Product and Architecture Authority` |
| **Decision date** | `2026-07-29` |
| **Governing decisions** | `AD-FE-LINT-01`, `AD-FE-HOOKS-01`, `AD-FE-HOOKS-02`, `AD-CHAT-01`, `AD-FE-SHELL-01`, `AD-R3F-01` |
| **Wave 3 posture** | `EslintWave3ExplicitAnyContractsComplete` |
| **CI status** | `CiStillBlockedByParkedReactCompilerDebt` |
| **Product release authorized** | `false` |
| **Deployment authorized** | `false` |
| **Hosted CI claimed** | `false` |
| **EX-2:3 posture** | `AllowMetadataOnlyEx23WithLintBlockerRecorded` |
| **New rule suppressions authorized** | `false` |
| **ESLint rule weakening authorized** | `false` |

---

## 1. Purpose

Record the post–Wave-3 suppression audit, remediable-diagnostics completion, retained legacy suppressions, parked React Compiler error inventory, and CI gate certification outcome.

---

## 2. Baseline at task start (post–Wave 3)

| Metric | Value |
|---|---|
| Errors | `30` |
| Warnings | `442` |
| Total | `472` |
| Affected files | `129` |
| Finding-key hash | `0621f102f0f8999c65bfe54bf7fe1994796f16e529f2ae23f90e4388d1b0fb12` |
| `no-explicit-any` | `0` |
| `no-unused-vars` | `154` |
| `exhaustive-deps` | `287` |

---

## 3. Suppression audit inventory

### 3.1 Production ESLint suppressions (pre-audit)

| Location | Rule | Disposition |
|---|---|---|
| `app/screens/hooks/chat/useChatPipelineController.ts` (file-level) | `no-explicit-any`, `no-unused-vars` | **Removed** — typed under Wave-final remediation; disable cleared |
| `app/components/panels/RiskExplanationPanel.tsx` | `exhaustive-deps` | **RetainedJustified** — intentional stable `explanationKey` covers analysis/scene/response inputs |
| `app/lib/ui/useExecutiveWorkspaceLayout.ts` | `exhaustive-deps` | **RetainedJustified** — once-per-mount layout init log |
| `app/screens/HomeScreen.tsx` | `exhaustive-deps` | **RetainedJustified** — QA:5 once-only shell composition marker (ref-guarded); HomeScreen deps remain parked under `AD-FE-LINT-01` P-REACT-04 |
| `app/screens/hooks/right-panel/useRightPanelController.ts` | `immutability` | **RetainedJustified** — O3:6 Type-C bridge assigns HomeScreen-owned `MutableRefObject.current`; runtime bridge contract |

### 3.2 Test `@ts-expect-error` probes

Twenty-five intentional immutability/override probes under `app/lib/dkl/**`, `app/lib/ex/**`, and `app/lib/dom/domListenerLifecycle.test.ts`.

Disposition: **RetainedTestProbe** — negative/immutability tests; not production suppressions; not CI-waived product debt.

### 3.3 Configuration

`frontend/eslint.config.mjs` ignores only build artifacts and temporary emit (`.next`, `out`, `build`, `next-env.d.ts`, `.tmp-em`). No product-source broad ignores. No rule downgrades.

### 3.4 Suppression policy going forward

- New `eslint-disable` / `@ts-ignore` / `@ts-expect-error` in production code: **not authorized** without a new Accepted architecture decision.
- Retained production next-line disables above are legacy justified exceptions and must reopen if the owning surface is remodeled.
- Removing a retained disable requires proving equivalent lint-clean behavior without parked-contract violation.

---

## 4. Remediable diagnostics completed

### 4.1 Non-parked error-level findings (9 → 0)

| Rule | Surfaces | Result |
|---|---|---|
| `react/no-unescaped-entities` | HomeScreen, WorkspaceModalHost | Fixed |
| `@typescript-eslint/prefer-as-const` | executiveFinancePlatformFreezeManifest | Fixed |
| `@next/next/no-assign-module-variable` | EIL model/registry tests | Fixed |
| `@typescript-eslint/no-non-null-asserted-optional-chain` | llmTokenMeter.test | Fixed |
| `@typescript-eslint/no-empty-object-type` | executionMonitoringValidationTypes | Fixed |

### 4.2 Warning remediations

| Rule | Result |
|---|---|
| `@typescript-eslint/no-unused-vars` | Cleared outside parked HomeScreen first, then HomeScreen unused locals/imports cleared without changing effect deps (`154` → `0`) |
| Chat pipeline hidden `any`/`unused` | File-level disable removed; file lint-clean |

### 4.3 Explicit non-goals (still parked under `AD-FE-LINT-01`)

Do **not** remediate in this certification task:

- P-REACT-01 `usePropagationBridge` (`preserve-manual-memoization` ×1, `set-state-in-effect` ×2)
- P-REACT-02 SceneCanvas / OrbitControls / `useSceneApplyController` (immutability/purity)
- P-REACT-03 ExecutiveDashboardPanel / AnimatableObject (`use-memo`)
- P-REACT-04 HomeScreen (`exhaustive-deps` ×90)

---

## 5. Remaining CI-blocking errors (parked)

Exact parked error inventory retained as visible lint failures:

| Cluster | Rule | Count |
|---|---|---:|
| SceneCanvas | `immutability` | 7 |
| SceneCanvas | `purity` | 1 |
| useSceneApplyController | `immutability` | 5 |
| ExecutiveOrbitControls | `immutability` | 1 |
| ExecutiveDashboardPanel | `use-memo` | 3 |
| AnimatableObject | `use-memo` | 1 |
| usePropagationBridge | `preserve-manual-memoization` | 1 |
| usePropagationBridge | `set-state-in-effect` | 2 |
| **Total parked errors** | | **21** |

These remain **visible**, **not suppressed**, **not waived**, and **block CI** until specialized parked-cluster architecture tasks reopen `AD-FE-LINT-01` and remediate safely.

---

## 6. Final verified metrics (dual ESLint)

| Metric | Value |
|---|---|
| Errors | `21` (all parked; zero remediable errors remaining) |
| Warnings | `288` (`exhaustive-deps` 287 + `no-img-element` 1) |
| Total | `309` |
| Affected files | `64` |
| Finding-key hash (A=B) | `b34e74e7b0abd117ad491ff09fa19e8704f9fea30e9f85283f4dffc987108091` |
| `no-explicit-any` | `0` |
| `no-unused-vars` | `0` |
| TypeScript | `0` diagnostics |
| Scene | `296` pass / `0` fail |
| Build | exit `0` |
| EX/RTC lint | `0` |
| Production file-level `eslint-disable` | `0` |
| Production next-line disables retained | `4` (justified; see §3.1) |

## 7. CI gate certification

| Gate | Result |
|---|---|
| TypeScript | clean |
| Scene runtime | clean |
| Build | clean |
| ESLint (error-level) | failed — 21 parked React Compiler/Hooks errors |
| Hosted CI | not claimed |
| Product release | not authorized |
| Deployment | not authorized |
| Parked debt accepted for production | `false` |
| Remediable diagnostics complete | `true` |
| Suppression audit complete | `true` |

Certified statuses:

```text
RemediableEslintDiagnosticsComplete
EslintSuppressionAuditComplete
CiStillBlockedByParkedReactCompilerDebt
AllowMetadataOnlyEx23WithLintBlockerRecorded
```

Full CI lint-gate clean (`CiLintGateClean`) is **not** certified while parked errors remain.

---

## 8. Recommended next tasks

1. `NPA-T — usePropagationBridge Lifecycle and Synchronization Architecture Decision`
2. `NPA-T — Scene Runtime Mutation Ownership and React Compiler Architecture Decision`
3. `AD-FE-MEMO-01` — original signature-extraction option rejected after `CyclicLintRemediationConflict`; P-REACT-03 remains `ParkedPendingComponentOwnershipRedesign` (`docs/architecture/npa-t-dashboard-and-animatable-object-memoization-contract-assessment.md`). Next: `NPA-T — ExecutiveDashboardPanel Memo-Graph Ownership Redesign Decision` and `NPA-T — AnimatableObject Material and Scale-Hold Ownership Redesign Decision` (architecture only; implementation not authorized)
4. `NPA-T — HomeScreen Effect Ownership and Dependency Decomposition Program`

After those Accepted remediations clear the 21 parked errors (and remaining exhaustive-deps warnings as policy allows), re-run CI gate certification for `CiLintGateClean`.
