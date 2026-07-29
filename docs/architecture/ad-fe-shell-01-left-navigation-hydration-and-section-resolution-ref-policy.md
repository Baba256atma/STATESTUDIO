# AD-FE-SHELL-01 — Left-Navigation Hydration and Section Resolution Ref Policy

| Field | Value |
|---|---|
| **Decision ID** | `AD-FE-SHELL-01` |
| **Title** | `Left-Navigation Hydration and Section Resolution Ref Policy` |
| **Status** | `Accepted` |
| **Authority** | `Bahadoor` |
| **Authority role** | `Nexora Product and Architecture Authority` |
| **Decision date** | `2026-07-28` |
| **Selected option** | `ExplicitHydrationStateWithOneWaySectionResolution` |
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

Record the Accepted architecture decision that governs shell left-navigation hydration, section resolution, and DOM measurement ownership for deferred ESLint Wave 2 Hooks/Compiler remediation.

This decision does **not** remediate production or test code, change ESLint configuration, authorize EX-2:3, or begin explicit-any Wave 3.

---

## 2. Canonical decision

Shell navigation and hydration must use an explicit, one-way ownership model.

Selected option:

```text
ExplicitHydrationStateWithOneWaySectionResolution
```

Rules:

- route/navigation authority remains with the established routing owner;
- compatibility left-navigation must not become route authority;
- hydration seeds and resolved sections that affect rendering must use explicit state or reducer ownership;
- DOM measurement belongs to effects/layout effects;
- refs remain limited to imperative handles and event-only state;
- upstream view and local section synchronization must have one declared direction per transition;
- bidirectional effect ping-pong is prohibited.

---

## 3. NexoraShell

Wave 2B may extract a focused shell-navigation controller if needed. It must preserve:

- hydration;
- focus behavior;
- section selection;
- compatibility navigation;
- route ownership.

`NexoraShell` remains a compatibility surface and must not absorb route authority from the established routing owner.

---

## 4. PsychLayout

Separate:

- psych-store lifecycle ownership;
- DOM measurement ownership;
- render state.

`clientWidth` or equivalent DOM measurement must not occur during render.

---

## 5. Relationship to other decisions

- `AD-FE-HOOKS-01` governs general ref and render-state ownership.
- `AD-FE-SHELL-01` specializes hydration and navigation ownership and overrides only that narrow domain.
- `AD-FE-HOOKS-02` governs broader exhaustive-deps remediation for shell effects after ownership is explicit.
- No decision weakens another.
- Existing MRP, routing, Scene, EX, RTC, and TypeScript authorities remain unchanged.

---

## 6. Authorized follow-up

Recommended next task:

```text
NPA-T — ESLint Wave 2B: Deferred React Hooks and Compiler Contract Remediation
```

### Required evidence (Wave 2B)

- deterministic hydration;
- no section/view ping-pong;
- preserved focus/navigation;
- responsive measurement correctness;
- no render-time ref access;
- no additional render loops.

---

## 7. Explicit non-authorizations

This decision does **not** authorize:

- Production or test behavior changes in this decision task
- Making compatibility left-navigation into route authority
- Bidirectional section ↔ upstream view effect ping-pong
- DOM measurement during render
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
