# AD-R3F-01 — Static Geometry and Material Resource Lifecycle Policy

| Field | Value |
|---|---|
| **Decision ID** | `AD-R3F-01` |
| **Title** | `Static Geometry and Material Resource Lifecycle Policy` |
| **Status** | `Accepted` |
| **Authority** | `Bahadoor` |
| **Authority role** | `Nexora Product and Architecture Authority` |
| **Decision date** | `2026-07-28` |
| **Selected option** | `LifecycleOwnedResourceWithFrameBoundMutation` |
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

Record the Accepted architecture decision that governs React Three Fiber and Three.js resource creation, mutation, and disposal for deferred ESLint Wave 2 Hooks/Compiler remediation.

This decision does **not** remediate production or test code, change ESLint configuration, authorize EX-2:3, or begin explicit-any Wave 3.

---

## 2. Canonical decision

React Three Fiber and Three.js resources must have explicit creation, mutation, and disposal ownership.

Selected option:

```text
LifecycleOwnedResourceWithFrameBoundMutation
```

### Static geometry

Deterministic geometry that does not vary per component instance may use:

- immutable module-level fixtures; or
- a Compiler-legal lazy factory with stable component lifecycle ownership.

Static geometry must not be initialized by reading or writing `ref.current` during render.

Clock, randomness, viewport state, or runtime data must not silently enter static geometry generation.

### Mutable materials

For custom mutable materials such as `FireObject`:

- resource creation must use a stable lifecycle-owned initializer;
- render-time `ref.current` initialization is prohibited;
- uniform mutation must occur in `useFrame`, an effect, or an authorized event boundary;
- cleanup must dispose resources exactly once when ownership ends;
- Strict Mode mount/unmount behavior must not leak GPU resources;
- material identity must remain stable throughout one mounted lifecycle;
- declarative JSX material ownership is preferred where it preserves the shader contract;
- otherwise use a dedicated material-owner component or lifecycle-owned factory.

---

## 3. FireObject selected direction

Wave 2B may implement:

- a dedicated material-owner boundary;
- stable lazy material creation;
- `useFrame`-owned uniform mutation;
- explicit cleanup/disposal;
- focused Strict Mode and remount verification.

It must not alternate between `refs` and `immutability` fixes. If either rule reappears after the selected implementation, stop and report `CyclicLintRemediationConflict`.

`FireObject` remains in its restored pre-remediation state until Wave 2B executes this contract.

### PsychStars and PsychNebula

Use immutable static geometry fixtures or an equivalent Compiler-legal lazy factory. Preserve existing static-geometry semantics and visual output.

---

## 4. Relationship to other decisions

- `AD-FE-HOOKS-01` governs general ref and render-state ownership.
- `AD-R3F-01` specializes resource ownership for Three.js/R3F and overrides only that narrow domain.
- No decision weakens another.
- Existing MRP, routing, Scene, EX, RTC, and TypeScript authorities remain unchanged.

---

## 5. Authorized follow-up

Recommended next task:

```text
NPA-T — ESLint Wave 2B: Deferred React Hooks and Compiler Contract Remediation
```

### Required evidence (Wave 2B)

- stable material identity;
- no render-time ref access;
- no mutation during render;
- no resource leak;
- correct cleanup;
- unchanged visual behavior;
- no new `immutability`, `purity`, or ref findings.

---

## 6. Explicit non-authorizations

This decision does **not** authorize:

- Production or test behavior changes in this decision task
- Alternating `refs` ↔ `immutability` local edits without this contract
- ESLint rule disable, downgrade, override, ignore, or suppression
- Silent introduction of clock/randomness into static geometry
- EX or RTC modification
- EX-2:3 implementation
- Explicit-any Wave 3
- Deployment

---

## 7. Implementation posture

| Item | Value |
|---|---|
| Production changes in this decision task | None |
| Test changes in this decision task | None |
| ESLint configuration changes in this decision task | None |
| Remediation authorized | Yes (later Wave 2B only) |
| Readiness after this record | `ReadyForWave2BDeferredReactHooksRemediation` |
