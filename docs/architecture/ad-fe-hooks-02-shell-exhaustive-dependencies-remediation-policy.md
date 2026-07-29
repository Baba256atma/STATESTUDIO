# AD-FE-HOOKS-02 — Shell Exhaustive-Dependencies Remediation Policy

| Field | Value |
|---|---|
| **Decision ID** | `AD-FE-HOOKS-02` |
| **Title** | `Shell Exhaustive-Dependencies Remediation Policy` |
| **Status** | `Accepted` |
| **Authority** | `Bahadoor` |
| **Authority role** | `Nexora Product and Architecture Authority` |
| **Decision date** | `2026-07-28` |
| **Selected option** | `EffectOwnershipClassificationAndStagedDependencyCorrection` |
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

Record the Accepted architecture decision that governs `react-hooks/exhaustive-deps` and related memoization remediation for shell and deferred Hooks/Compiler clusters.

This decision does **not** remediate production or test code, change ESLint configuration, authorize EX-2:3, or begin explicit-any Wave 3.

---

## 2. Canonical decision

`react-hooks/exhaustive-deps` findings must be corrected by effect ownership, not by bulk dependency insertion.

Selected option:

```text
EffectOwnershipClassificationAndStagedDependencyCorrection
```

Every effect must first be classified as:

- external-system synchronization;
- subscription lifecycle;
- DOM synchronization;
- event-driven behavior;
- derived state;
- initialization;
- cleanup;
- compatibility bridge.

Selected rules:

- derived values should be computed during render when safe;
- event-driven work belongs in event handlers;
- functional state updates should remove genuine stale closures;
- unstable objects must not be added wholesale as dependencies;
- callbacks/objects may be stabilized only when identity is part of the contract;
- unrelated lifecycle responsibilities should be split;
- effects must not create network, persistence, telemetry, or authority behavior;
- missing dependencies must not be hidden with refs or suppressions.

---

## 3. HomeScreen

`HomeScreen` must be remediated in bounded ownership partitions based on the existing optimization inventory.

Must not:

- add all 111 dependencies mechanically;
- create one mega-controller;
- destabilize routes, panels, chat, or shared identity;
- combine unrelated effects;
- perform broad megafile refactoring in one batch.

Each batch requires focused ownership tests and an independent rollback boundary.

---

## 4. Memoization

Manual memoization may be retained only when required for:

- correctness;
- subscription stability;
- cache identity;
- child memoization;
- external integration identity.

Performance-only memoization may be removed when tests demonstrate unchanged behavior.

`preserve-manual-memoization` findings follow this retention policy under Wave 2B.

---

## 5. Relationship to other decisions

- `AD-FE-HOOKS-01` governs general ref and render-state ownership.
- `AD-FE-SHELL-01` specializes hydration and navigation ownership before shell dep correction.
- `AD-CHAT-01` specializes chat send identity and forbids broad `input` dependency insertion.
- `AD-FE-HOOKS-02` governs effect and dependency remediation.
- Specialized decisions override only their narrow domain.
- No decision weakens another.
- Existing MRP, routing, Scene, EX, RTC, and TypeScript authorities remain unchanged.

---

## 6. Authorized follow-up

Recommended next task:

```text
NPA-T — ESLint Wave 2B: Deferred React Hooks and Compiler Contract Remediation
```

Wave 2B may implement only the accepted contracts in bounded partitions. Wave 2B must not remediate `no-explicit-any`.

Explicit-any Wave 3 remains blocked until:

- deferred React clusters are resolved; or
- remaining clusters are formally isolated with accepted ownership and no CI-blocking Hooks errors.

### Required evidence (Wave 2B)

- ownership classification recorded per remediated effect batch;
- targeted exhaustive-deps counts decrease without non-targeted rule increases;
- no render loops, subscription churn, or authority side effects;
- focused ownership tests pass;
- independent rollback boundary per batch.

---

## 7. Explicit non-authorizations

This decision does **not** authorize:

- Production or test behavior changes in this decision task
- Mechanical addition of all HomeScreen exhaustive-deps suggestions
- One mega-controller for HomeScreen
- Hiding missing dependencies with refs or suppressions
- ESLint rule disable, downgrade, override, ignore, or suppression
- EX or RTC modification
- EX-2:3 implementation
- Explicit-any Wave 3
- Deployment

---

## 8. Implementation posture

| Item | Value |
|---|---|
| Production changes in this decision task | None |
| Test changes in this decision task | None |
| ESLint configuration changes in this decision task | None |
| Remediation authorized | Yes (later Wave 2B only) |
| Readiness after this record | `ReadyForWave2BDeferredReactHooksRemediation` |
