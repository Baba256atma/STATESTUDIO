# AD-FE-PROP-02 — usePropagationBridge Lifecycle Ownership Reopening

- **Status:** Accepted
- **Authority:** Bahadoor
- **Authority role:** Nexora Product and Architecture Authority
- **Decision date:** 2026-07-30
- **Scope:** `UsePropagationBridgeLifecycleOwnershipOnly`
- **Selected option:** `ContinueParkingPendingLifecycleEvidence`
- **Implementation authorized:** `false`
- **Supersedes:** nothing
- **Preserves:** AD-FE-PROP-01 and AD-FE-LINT-01

## Decision

P-REACT-01 remains parked. This reopening does not authorize changes to
`usePropagationBridge`, its clients, its consumers, ESLint configuration, or
suppressions.

The current implementation does not provide enough evidence to select a safe
ownership model. In particular, the module-global overlay cache, the hook-local
request guards, and the client module's second global deduplication layer have
different lifetimes and no common ordering authority. Concurrent consumers,
remounts, retries, and Strict Mode-like replay are therefore not specified
deterministically.

No characterization tests are added by this decision. There is no existing
hook lifecycle harness or reset/injection seam for the two module-global
lifetimes. Adding tests against those globals now would either be
order-dependent or silently define cache, deduplication, retry, and remount
semantics that this decision is specifically assessing.

## Verified baseline

Two full ESLint JSON runs before this document change were identical:

- 21 errors, 288 warnings, 309 findings, 64 affected files
- deterministic normalized finding hash:
  `f56bc84588da48f3e8ada9ca53de2b83c4a7ead3393220cef086e56b678aeef7`
- `react-hooks/preserve-manual-memoization`: 1
- `react-hooks/set-state-in-effect`: 2
- P-REACT-01 `react-hooks/exhaustive-deps`: 1 warning
- project `react-hooks/refs`: 0
- project `react-hooks/rules-of-hooks`: 0
- `@typescript-eslint/no-explicit-any`: 0
- unused-variable findings: 0

The document-only change cannot affect the lint graph. Governing TypeScript,
Scene suites, build, propagation-domain tests, and EX/RTC focused lint are
re-run as verification for this decision.

## Exact hook inventory

### Public inputs

`sceneJson`, optional `loops`, `selectedObjectId`,
`scannerPrimaryObjectId`, `scenarioTrigger`, `manualActionObjectId`,
`propagationPayload`, `previewEnabled` (default `true`), `maxDepth` (default
`2`), and `decay` (default `0.74`).

### Public outputs

The hook publishes the selected propagation overlay (and compatibility alias),
scenario overlay package, resolved source id, propagation mode, loading and
error state, refresh and clear commands, manual source setter, and trigger
resolution. `useSceneOverlayRuntime` is the active consumer. The
`usePropagationOverlay` compatibility wrapper currently has no discovered
callsite.

### Internal React state

- manual source id
- backend overlay and its request key
- scenario-action payload and its request key
- loading and error
- refresh nonce

### Instance-local refs

- active request key
- last attempt signature
- last semantic signature
- last bridge signature
- last resolved bridge signature
- request-in-flight boolean

### Memoized render values

- scene semantic signature
- trigger resolution and active trigger
- normalized embedded scenario payload
- scene signature and request key
- backend-support flag
- preview overlay
- selected propagation overlay
- scenario overlay package

### Callbacks

- `clearPropagation` and `setPropagationSource` have mount-stable identities.
- `refreshPropagation` is stable only while `requestKey` is stable.

### Effects

1. A reset/adoption effect projects current inputs, embedded payloads, and
   compatibility checks into React state.
2. An async request effect performs semantic/bridge deduplication, cache
   adoption, request start, result acceptance, error publication, and local
   cleanup.
3. A development diagnostic effect publishes resolved-bridge diagnostics.

### Non-React mutable owners

- `usePropagationBridge.ts` owns a module-global `Map` named
  `propagationCache`.
- `propagationClient.ts` separately owns module-global
  `propagationInFlightRef` and `lastPropagationSignatureRef`.
- trigger diagnostic deduplication also has module lifetime.

There is no cache size limit, expiry, workspace/user namespace, invalidation
policy beyond refresh of the current key, server-request scope, or test reset
contract.

## Exact P-REACT-01 findings

1. `preserve-manual-memoization`, line 156: the
   `embeddedScenarioPayload` memo callback reads `activeTrigger`, while the
   manual list names narrower properties
   `[activeTrigger?.kind, activeTrigger?.scenario_action?.payload,
   propagationPayload]`. The compiler infers `activeTrigger`.
2. `set-state-in-effect`, line 185: the reset/adoption effect begins a
   synchronous group of state resets when no resolved source exists.
3. `set-state-in-effect`, line 278: the request effect synchronously adopts a
   value read from the mutable module-global cache.
4. `exhaustive-deps`, line 416: the async effect reads scenario-action branches
   through `activeTrigger`, but its dependency list omits
   `activeTrigger?.kind` and `activeTrigger.scenario_action`.

These are coupled symptoms. A narrow dependency edit can change request
frequency. Removing either synchronous effect update can change the visible
preview/backend transition. Replacing reads with refs would recreate the
render/commit ownership risk guarded by AD-FE-LINT-01.

## Current lifecycle reconstruction

| Transition | State/cache/request owner | Ordering, cleanup, and acceptance |
| --- | --- | --- |
| Mount | React instance initializes empty request state; module globals survive | No mount generation exists |
| Input evaluation | Render/memos resolve semantic trigger, source, scene signature, request key, preview | Current render values must be coherent; identities need not all be stable |
| Cache lookup | Async effect reads hook module's global map | Cache hit is synchronously projected into React state |
| Preview selection | Render derives preview from current inputs | Preview is returned until a compatible keyed backend overlay exists |
| Backend start | Hook effect starts scenario or propagation client request | Hook ref records active key and local in-flight state |
| Deduplication | Hook semantic/bridge/attempt refs, then client module globals | No single authority; the client may return `null` after the hook decided to request |
| Pending | Hook state owns loading/error | Current request has no AbortController |
| Completion | Promise callback and module cache | Local `cancelled` plus active-key equality decide acceptance |
| Stale result | Per-effect closure and instance ref | Old result is ignored if cleanup ran or active key differs |
| Failure | Hook callback publishes error; propagation client often converts failures to `null` | Network-like failure can become preview fallback without error publication |
| Input change | New render/effect cleanup | Cleanup marks only that closure cancelled and clears the instance in-flight ref |
| Consumer change | Not modeled separately | Unmount/remount is the only reliable boundary; callback consumers are not registered |
| Unmount | Effect cleanup | Does not abort transport or clear module cache/client globals |
| Remount | New instance state, old module globals | Cache may be reused; client same-signature guard may suppress a request |
| Concurrent same request | Separate hook refs, shared cache and client globals | Race-dependent; client global in-flight/same-signature guard can suppress one instance |
| Concurrent different requests | Separate hook refs, shared client in-flight boolean | One valid request may be suppressed solely because another instance is pending |
| Strict Mode-like replay | New effect closure/instance state, persistent globals | Transport may continue after cleanup while remount is suppressed by global guards |

The hook instance is the result-acceptance authority, but the service module is
also a request-admission authority. Neither owns a shared generation number.
The request transport cannot be cancelled.

## Characterization evidence

Existing propagation-domain tests establish deterministic pure-domain behavior
for propagation building, hints, visualization, operational preview, and
presentation. They do not mount `usePropagationBridge` and do not establish:

- cache miss/hit timing
- identical or different concurrent requests
- same/different request behavior across two hook instances
- slow-old versus new-request completion ordering
- preview-to-backend replacement
- failure after preview
- input or consumer change while pending
- unmount, remount, or Strict Mode-like replay
- callback identity across key changes
- transport cancellation
- absence of publication after unmount

Source inspection proves that a cleaned-up closure refuses its own later state
publication and that active-key mismatch rejects a stale result within one
mounted instance. It does not prove deterministic behavior across instances or
module-lifetime remounts.

## Cache-scope assessment

Current module-global scope is not accepted as the correct scope.

- **Cross-user/workspace:** request keys contain scene content/signature and
  source details but no explicit user/workspace boundary. Isolation is
  implicit, not authoritative.
- **Tests:** no reset or injected cache makes isolation order-dependent.
- **SSR/server requests:** the hook is client-only, but module lifetime still
  lacks an explicit per-application/provider boundary.
- **Development/remount:** hot-module and Strict Mode behavior depend on module
  survival.
- **Memory:** the map is unbounded and has no expiry.
- **Invalidation/retry:** refresh deletes one key, but the lower client
  same-signature guard is not reset, so retry ownership is split.
- **Concurrency:** cache publication is global, while result publication is
  instance-local.

Provider-scoped, external-store-owned, or explicitly injected scope may be
appropriate, but the product boundary and sharing requirements have not been
chosen.

## Request and ordering ownership

A future design must place request-key creation, admission/deduplication,
abort/cancellation, generation ordering, stale rejection, preview/backend
precedence, cache write, retry, status, and publication behind one explicit
lifecycle authority.

The preferred investigation boundary is a dedicated controller/service with an
explicit cache dependency and a thin React subscription adapter. An external
store or provider may own the controller's lifetime. The React hook should own
only render subscription and user commands, not a second competing admission
policy.

## React state and effect classification

| Current item | Classification |
| --- | --- |
| manual source | user-event state |
| backend overlay/key | async lifecycle plus cache projection |
| scenario payload/key | async lifecycle plus embedded-input projection |
| loading/error | async-request lifecycle |
| refresh nonce | user-event retry signal |
| preview/mode/selected output | derived render state |
| reset/adoption effect | avoidable derived-state projection mixed with commit synchronization |
| request effect | async request effect mixed with cache projection and admission |
| diagnostic effect | commit-synchronization effect |
| effect cleanup | cleanup guard only; not transport cancellation |

The first `set-state-in-effect` finding exists because inputs and embedded
results are mirrored into multiple state cells after commit. The second exists
because a mutable external cache is read without a subscription and then
synchronously projected after commit. Removing either projection without a
replacement lifecycle model changes the number and timing of visible renders
and can change preview/backend precedence.

## Memoization assessment

`embeddedScenarioPayload` preserves a normalized value identity while its
listed dependencies are property-level but its callback closes over the
containing `activeTrigger`. Downstream, the identity participates in the
reset/adoption effect and scenario package memoization; correctness depends on
value freshness, while identity stability primarily controls effect and memo
frequency.

There is no evidence that simply deleting the memo preserves request/adoption
timing. Broadening the dependency to `activeTrigger` may increase updates
because trigger resolution can produce a new containing object. A controller
could normalize at its input boundary and publish a stable snapshot, but that
requires the controller and subscription semantics to be selected first.
Commit-synchronized “latest” refs are not authorized: they could recur as the
AD-FE-LINT-01 A↔B exchange between memoization and ref findings.

## Candidate comparison

| Option | Four findings | Concurrency / Strict Mode | Isolation / remount | Risk and boundary |
| --- | --- | --- | --- | --- |
| A — dedicated lifecycle controller | Can remove all four if hook becomes a thin subscriber | Potentially deterministic with abort and generations; not yet proved | Explicit only with chosen controller/cache lifetime | Best investigation path; medium migration, controller can be one rollback unit |
| B — external store | Can remove cache projection and async ownership from effects | `useSyncExternalStore` can provide coherent snapshots; request rules still must be designed | Store lifetime must be provider/request scoped | Higher migration and test surface; low ref risk if formal |
| C — provider-scoped service | Can remove all four through stable service/subscription API | Can dedupe across consumers and survive intended remounts | Strong workspace isolation if provider boundary is authoritative | Requires product/provider placement decision |
| D — hook-local reducer | Can consolidate state transitions, but async effect/dependency ownership remains | Per-instance ordering improves; cross-instance client globals remain unsafe | Does not solve shared cache/client remount behavior | Small rollback, but incomplete; may trade findings |
| E — commit-synchronized latest callback | May silence dependency/memo findings but does not solve cache projection | Global races remain; ref read/write risk is high | Existing module lifetime remains | Small migration, unacceptable A↔B risk |
| F — continue parking | Removes none; baseline remains explicit | Does not claim guarantees absent from evidence | No behavior change | Lowest immediate risk; selected |

Options A–C could avoid new manual-memoization and `refs` findings when built
around immutable snapshots and formal subscription semantics, but none is
accepted until its lifetime and tests are specified. Option D cannot remove all
four findings together. Option E fails the no-new-ref-risk criterion.

## Missing evidence and reopening conditions

Reopen P-REACT-01 only when all of the following exist:

1. An authority decision selects cache sharing/isolation scope and provider or
   service lifetime.
2. Request admission has one owner; the duplicate hook/client dedupe policy is
   removed from the design.
3. The proposed contract includes abort, monotonically ordered generations,
   stale rejection, retry, and cache invalidation.
4. Preview/backend/error precedence is written as a state machine.
5. A deterministic harness can inject/reset cache and transport without
   production-global test coupling.
6. The full characterization matrix covers cache miss/hit, identical and
   different requests, concurrent same/different consumers, stale completion,
   preview/success/failure, input/consumer change, unmount/remount/Strict Mode,
   callback identity, and no stale/post-unmount publication.
7. One prototype proves all four findings disappear together with zero
   `refs`, zero new memoization findings, and no broad dependency insertion.
8. TypeScript, propagation-domain behavior, Scene suites, build, full lint,
   and EX/RTC focused lint remain stable in one bounded rollback unit.

## Binding anti-loop controls

- Do not edit the production hook under this decision.
- Do not add refs, suppressions, broad dependencies, or one-for-one lint trades.
- Do not combine this work with Scene, EDP, AnimatableObject, HomeScreen, EX, or
  RTC changes.
- Any future authorized implementation checkpoints after each ownership
  boundary.
- On an A↔B exchange, restore the last clean checkpoint and stop.

## EX-2 preservation

AD-EX2-14 remains Accepted. EX-2:6 metadata-only authorization remains valid.
This decision changes no EX or RTC file, creates no EX-2:6 implementation, and
does not broaden production, release, or deployment authority.

## Bounded outcome

This record is architecture metadata only. It preserves the observable
production behavior and deterministic lint baseline. The next task must be an
independent architecture assessment, not a P-REACT-01 remediation retry.
