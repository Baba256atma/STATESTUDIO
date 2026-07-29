# AD-FE-HOOKS-01 — React Ref Access and Stability Cache Policy

| Field | Value |
|---|---|
| **Decision ID** | `AD-FE-HOOKS-01` |
| **Title** | `React Ref Access and Stability Cache Policy` |
| **Status** | `Accepted` |
| **Authority** | `Bahadoor` |
| **Authority role** | `Nexora Product and Architecture Authority` |
| **Decision date** | `2026-07-28` |
| **Selected option** | `ControllerOwnedStateWithComponentBoundaryDecomposition` |
| **Scope** | `FrontendReactOwnershipAndEslintRemediationContractsOnly` |
| **Readiness** | `ReadyForWave2BDeferredReactHooksRemediation` |
| **Decision authority source** | `ESLint Wave 2A: Deferred React Hooks and Compiler Architecture Assessment` |
| **Implementation authorized** | Later Wave 2B remediation task only |
| **Production deployment authorized** | `false` |
| **EX/RTC modification authorized** | `false` |
| **EX-2:3 implementation authorized** | `false` |
| **ESLint rule weakening authorized** | `false` |

---

## 1. Purpose

Record the Accepted architecture decision that governs React ref access and render-driving stability caches for deferred ESLint Wave 2 Hooks/Compiler remediation.

This decision does **not** remediate production or test code, change ESLint configuration, authorize EX-2:3, or begin explicit-any Wave 3.

---

## 2. Canonical decision

React refs are permitted only for imperative, non-render-driving values such as:

- DOM handles;
- timers;
- animation-frame handles;
- external mutable resources;
- event-only deduplication state;
- values read from effects or event callbacks.

Refs must not serve as hidden render state or be read/written during render to select visible UI.

Render-driving values must be owned by:

- React state;
- reducers;
- immutable render inputs;
- controller-hook state;
- explicitly derived render values.

Selected option:

```text
ControllerOwnedStateWithComponentBoundaryDecomposition
```

---

## 3. RightPanelHost contract

`RightPanelHost` remains a legacy isolated host and must not become the primary MRP host.

Existing MRP, routing, Scene, EX, RTC, and TypeScript authorities remain unchanged. This decision does not elevate the legacy host and does not alter navigation authority.

Authorized later remediation (Wave 2B):

- extract `useRightPanelHostController`;
- separate render-driving state from imperative refs;
- move development diagnostics and prop-diff probes to effect-owned behavior;
- preserve the previous-valid-view and anti-flash behavior through explicit controller state;
- decompose payload builders and Scene rendering boundaries;
- preserve MRP legacy isolation.

Must not:

- convert every ref blindly to state;
- add suppressions;
- elevate the legacy host;
- weaken panel stability;
- introduce render/effect loops;
- change navigation authority.

---

## 4. Visual/debug contract

Debug prop-diff data must be:

- effect-owned;
- development-gated where appropriate;
- excluded from render-state ownership unless it affects visible output.

Surfaces such as `ObjectInfoHudOverlay` diagnostic prop-diff probes follow this contract under Wave 2B.

---

## 5. Relationship to other decisions

- `AD-FE-HOOKS-01` governs general ref and render-state ownership.
- `AD-R3F-01` specializes resource ownership for Three.js/R3F.
- `AD-CHAT-01` specializes stable event callback ownership for chat.
- `AD-FE-SHELL-01` specializes hydration and navigation ownership.
- `AD-FE-HOOKS-02` governs effect and dependency remediation.
- Specialized decisions override only their narrow domain.
- No decision weakens another.

---

## 6. Authorized follow-up

Recommended next task:

```text
NPA-T — ESLint Wave 2B: Deferred React Hooks and Compiler Contract Remediation
```

Wave 2B may implement only the accepted contracts in bounded partitions. Wave 2B must not remediate `no-explicit-any`.

### Required evidence (Wave 2B)

- stable panel selection;
- previous-valid-view hold;
- analyze-route behavior;
- no panel flash;
- no duplicate transitions;
- legacy isolation;
- zero new non-targeted lint findings.

---

## 7. Explicit non-authorizations

This decision does **not** authorize:

- Production or test behavior changes in this decision task
- ESLint rule disable, downgrade, override, ignore, or suppression
- Dependency changes
- CI changes
- MRP or route authority changes
- EX or RTC modification
- EX-2:3 implementation
- Explicit-any Wave 3
- Deployment
- Blind conversion of every ref to state
- Elevating `RightPanelHost` to primary MRP host

---

## 8. Implementation posture

| Item | Value |
|---|---|
| Production changes in this decision task | None |
| Test changes in this decision task | None |
| ESLint configuration changes in this decision task | None |
| Remediation authorized | Yes (later Wave 2B only) |
| Readiness after this record | `ReadyForWave2BDeferredReactHooksRemediation` |
