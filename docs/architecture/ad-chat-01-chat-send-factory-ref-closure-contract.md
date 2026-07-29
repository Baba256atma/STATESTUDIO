# AD-CHAT-01 — Chat Send Factory Ref-Closure Contract

| Field | Value |
|---|---|
| **Decision ID** | `AD-CHAT-01` |
| **Title** | `Chat Send Factory Ref-Closure Contract` |
| **Status** | `Accepted` |
| **Authority** | `Bahadoor` |
| **Authority role** | `Nexora Product and Architecture Authority` |
| **Decision date** | `2026-07-28` |
| **Selected option** | `StableCallbackWithCommitSynchronizedLatestDependencies` |
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

Record the Accepted architecture decision that governs chat send callback identity and latest-dependency ownership for deferred ESLint Wave 2 Hooks/Compiler remediation of `useChatPipelineController`.

This decision does **not** remediate production or test code, change ESLint configuration, authorize EX-2:3, or begin explicit-any Wave 3.

---

## 2. Canonical decision

The chat send function must have stable consumer identity while using current committed dependencies.

Selected option:

```text
StableCallbackWithCommitSynchronizedLatestDependencies
```

Authorized contract:

- expose a stable callback;
- synchronize the latest dependency bundle after commit through an effect or layout effect;
- read the current dependency bundle only inside the event callback;
- preserve cancellation, run identity, retry, lock, bridge, and message semantics;
- use functional state updates where they correctly remove stale closures;
- keep the dependency bundle explicit and typed.

Must not:

- read or write refs during render;
- include a broad unstable `input` object merely to satisfy lint;
- suppress ref or memoization findings;
- recreate `sendText` on every render without proving consumer safety;
- permit duplicate sends;
- weaken abort or idempotency behavior;
- invent an unsupported React event API.

If commit-synchronized latest dependencies cannot preserve the current contract, stop and require a reducer/controller-service boundary rather than alternating fixes.

`useChatPipelineController` remains in its restored pre-remediation state until Wave 2B executes this contract.

---

## 3. Relationship to other decisions

- `AD-FE-HOOKS-01` governs general ref and render-state ownership.
- `AD-CHAT-01` specializes stable event callback ownership for chat and overrides only that narrow domain.
- `AD-FE-HOOKS-02` governs broader exhaustive-deps remediation and must not force unstable `input` into the send callback.
- No decision weakens another.
- Existing MRP, routing, Scene, EX, RTC, and TypeScript authorities remain unchanged.

---

## 4. Authorized follow-up

Recommended next task:

```text
NPA-T — ESLint Wave 2B: Deferred React Hooks and Compiler Contract Remediation
```

### Required evidence (Wave 2B)

- stable callback identity;
- current dependency behavior after commit;
- no stale closure;
- empty-send handling;
- duplicate-send prevention;
- abort and retry correctness;
- no new ref, memoization, or exhaustive-deps findings.

---

## 5. Explicit non-authorizations

This decision does **not** authorize:

- Production or test behavior changes in this decision task
- Alternating `refs` ↔ `preserve-manual-memoization` local edits without this contract
- Broad `input` dependency insertion to silence lint
- ESLint rule disable, downgrade, override, ignore, or suppression
- Unsupported React event APIs
- EX or RTC modification
- EX-2:3 implementation
- Explicit-any Wave 3
- Deployment

---

## 6. Implementation posture

| Item | Value |
|---|---|
| Production changes in this decision task | None |
| Test changes in this decision task | None |
| ESLint configuration changes in this decision task | None |
| Remediation authorized | Yes (later Wave 2B only) |
| Readiness after this record | `ReadyForWave2BDeferredReactHooksRemediation` |
