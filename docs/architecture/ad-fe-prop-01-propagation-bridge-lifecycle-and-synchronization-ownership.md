# AD-FE-PROP-01 — Propagation Bridge Lifecycle and Synchronization Ownership

| Field | Value |
|---|---|
| **Decision ID** | `AD-FE-PROP-01` |
| **Title** | `Propagation Bridge Lifecycle and Synchronization Ownership` |
| **Status** | `ParkedPendingLifecycleOwnershipEvidence` |
| **Authority** | `Bahadoor` |
| **Authority role** | `Nexora Product and Architecture Authority` |
| **Decision date** | `2026-07-29` |
| **Scope** | `usePropagationBridge only` |
| **Selected option** | `Option F — Continue parking` |
| **Disposition** | `UsePropagationBridgeParkedPendingLifecycleOwnershipEvidence` |
| **Implementation authorization** | `false` — later task only after reopening and acceptance |
| **Deployment authorization** | `false` |
| **Governing authority** | `AD-FE-LINT-01`, `CERT-FE-LINT-01`, completed Wave 2B conflict evidence |

---

## 1. Decision

No implementation option is Accepted by this record.

`usePropagationBridge` is not currently a subscription hook. It combines:

- render-time trigger and signature derivation;
- embedded payload normalization;
- module-cache lookup;
- effect-driven state reset/adoption;
- asynchronous HTTP request ownership;
- per-instance duplicate/stale-result guards;
- module-global cache and lower-level global request dedupe;
- preview derivation;
- stable public event callbacks.

Options A–E each address part of this system, but no current test or authority proves a replacement that preserves instance isolation, request ordering, cache semantics, Strict Mode-like remount behavior, callback identity, and the exact preview/backend transition. The existing external-store authority governs overlay **visibility**, not propagation request state; reusing it would invent a new store contract.

The binding disposition is:

```text
UsePropagationBridgeParkedPendingLifecycleOwnershipEvidence
```

P-REACT-01 remains `ParkedPendingPropagationLifecycleArchitecture`. No production or test implementation is authorized.

---

## 2. Preconditions and reported mismatch

| Check | Result |
|---|---|
| ESLint | `21` errors / `288` warnings / `309` total / `64` files |
| Required bridge errors | `preserve-manual-memoization` ×1; `set-state-in-effect` ×2 |
| Additional existing bridge warning | `exhaustive-deps` ×1 at the asynchronous request effect |
| Project `refs` | `0` |
| `no-explicit-any` / `no-unused-vars` | `0` / `0` |
| P-REACT-02 | parked and unchanged |
| P-REACT-03 | parked under documentation-only `AD-FE-AO-01` and `AD-FE-EDP-01` |
| TypeScript | zero diagnostics with the governing 8 GB Node heap |
| Scene | `296` pass / `0` fail |
| Build | exit `0` when Google Fonts are reachable |
| EX / RTC lint | `0` / `0` |
| New suppression | none |

The request's statement that `usePropagationBridge` has “exactly 3 findings” is true only for its error-level findings. The file has **4 total lint findings** because an existing `react-hooks/exhaustive-deps` warning is also present. This warning is part of the 288-warning project baseline and is not a new source regression.

Any later implementation must preserve the project warning baseline at minimum and should clear the existing bridge warning as part of a fully proven lifecycle contract; it must not claim the file is lint-clean while that warning remains.

Environmental classification:

- default-heap TypeScript can exhaust the approximately 4 GB Node heap;
- governing verification uses `NODE_OPTIONS="--max-old-space-size=8192"`;
- sandboxed builds can fail while fetching Geist from Google Fonts;
- only disclosed network-enabled builds are counted as successful;
- neither environmental condition is a source regression.

---

## 3. Public contract and consumers

### 3.1 Inputs

| Input | Role |
|---|---|
| `sceneJson` | Object/position graph, scanner source, compatibility domain, request payload |
| `loops` | Propagation relations, compatibility domain, request graph/signature |
| `selectedObjectId` | Lower-priority propagation source and semantic highlight |
| `scannerPrimaryObjectId` | Higher-priority scanner source |
| `scenarioTrigger` | Highest-priority scenario action, payload, source and request policy |
| `manualActionObjectId` | Externally supplied manual source |
| `propagationPayload` | Embedded backend/chat propagation or scenario payload |
| `previewEnabled` | Allows preview fallback |
| `maxDepth` / `decay` | Request, preview and cache-key parameters |

The hook also owns `manualSourceId`, set through its public `setPropagationSource` callback. That internal manual source takes precedence over `manualActionObjectId`.

### 3.2 Returned contract

The hook returns:

- `propagationOverlay` and alias `propagationPayload`;
- `scenarioOverlayPackage`;
- `propagationSourceId`;
- `propagationMode`;
- `propagationLoading`;
- `propagationError`;
- `refreshPropagation`;
- `clearPropagation`;
- `setPropagationSource`;
- `triggerResolution`.

`usePropagationOverlay` exposes the overlay plus source/clear callbacks. It has no current call site in the repository but remains a public wrapper. `useSceneOverlayRuntime` is the active consumer through `SceneCanvas`; it merges the propagation overlay with simulation output, resolves Scene overlays, synchronizes the separate overlay registry, and exposes loading/error/mode to Scene diagnostics and rendering.

The returned object itself is reconstructed each render. Callback identities are stable by contract as follows:

- `clearPropagation` and `setPropagationSource` are mount-stable;
- `refreshPropagation` changes when `requestKey` changes;
- overlay/model identities depend on memo inputs and cache/state adoption.

### 3.3 Source and target owners

Source priority is owned by `resolvePropagationTrigger`:

```text
scenario action
  > embedded chat/backend payload
  > scanner primary
  > manual action
  > selected object
  > preview fallback
```

The backend target is `/simulation/propagation` or the scenario-action endpoint. The render target is `useSceneOverlayRuntime`, then `SceneCanvas`/SceneRenderer and overlay components. The overlay registry synchronized by `useSceneOverlayRuntime` is downstream and must not become the request-state owner by accident.

Synchronization is primarily one-way:

```text
React/domain inputs
  -> trigger resolution
  -> embedded payload / cache / HTTP request / preview
  -> bridge-local snapshot
  -> Scene overlay runtime
  -> Scene rendering
```

Public source/refresh/clear callbacks provide the intentional event-driven feedback into bridge-local state.

---

## 4. Exact current lifecycle

```text
mount
  -> initialize local state to null/false and per-instance refs
  -> derive semantic signature, trigger, source, request key and preview during render
  -> after commit:
       effect 1 resets state, adopts embedded payload, or invalidates incompatible state
       effect 2 deduplicates and either adopts module cache or starts an HTTP request
  -> receive:
       promise callback validates cancellation and active request key
  -> update:
       cache valid backend result, set overlay/scenario/loading/error state
  -> propagate:
       choose key-compatible backend overlay, otherwise preview
       build scenario package and return to overlay runtime/Scene
  -> cleanup/unmount:
       mark effect-local request cancelled and clear per-instance in-flight flag
       ignore later promise completion
```

### 4.1 Initialization and update behavior

Initial React state is empty. A preview can be derived in the first render. Embedded or cached backend overlays are adopted synchronously inside effects, causing a post-commit render. Network responses update state from promise callbacks.

The first effect performs three distinct synchronization jobs:

1. when no source exists, clear backend/scenario/loading/error state and the active request key;
2. when a meaningful compatible embedded overlay exists, adopt it and optional scenario payload;
3. otherwise remove incompatible backend/scenario state.

The second effect:

1. skips repeated semantic or bridge signatures;
2. accepts embedded-payload reuse;
3. skips when backend propagation is not required/supported;
4. adopts a compatible module-cache entry;
5. suppresses duplicate attempts and concurrent per-instance requests;
6. starts scenario or propagation HTTP work;
7. accepts only results matching the active request key;
8. caches compatible results and updates state;
9. clears loading or sets error on completion.

### 4.2 Cleanup and remount

Cleanup does not abort the network request. It sets an effect-local `cancelled` flag and clears the per-instance in-flight ref; late results are ignored. The lower-level client independently owns a module-global in-flight flag and last-request signature.

On remount:

- React state and per-instance refs reset;
- `propagationCache`, trigger-resolution module globals, and client request-dedupe globals survive;
- a cached overlay can be adopted after commit;
- a Strict Mode-like cleanup/restart can encounter a still-running or already-deduped lower-level request and fall back differently unless explicitly characterized.

### 4.3 Multiplicity

The active application path appears to create one bridge through `SceneCanvas -> useSceneOverlayRuntime`. The exported `usePropagationOverlay` wrapper makes multiple intended instances possible, and React remount behavior creates overlapping request lifetimes.

Module-global state is shared across every instance:

- `propagationCache` in the bridge;
- semantic/resolution diagnostics cache in `resolvePropagationTrigger`;
- in-flight and last-request signature in `propagationClient`.

Therefore “one subscription per bridge” is not the current contract. The correct future invariant is one request lifecycle per accepted request key and intended bridge scope, with explicitly defined sharing. Current evidence does not establish whether cache/request dedupe is application-global or Scene-instance-local.

---

## 5. Exact finding reconstruction

### 5.1 `preserve-manual-memoization` ×1

Memoized value:

```text
embeddedScenarioPayload
```

Memo callback:

```text
if activeTrigger.kind is scenario_action:
  normalize activeTrigger.scenario_action.payload
else:
  normalize propagationPayload
```

Full capture set:

- `activeTrigger`;
- `propagationPayload`;
- module function `normalizeScenarioActionResponsePayload`.

Manual dependencies:

```text
activeTrigger?.kind
activeTrigger?.scenario_action?.payload
propagationPayload
```

Compiler inference:

```text
activeTrigger
```

The Compiler reports that the inferred dependency is less specific than the manual property dependencies, so it cannot preserve the current recomputation frequency.

Identity/semantic consumers:

- effect 1 optionally copies it into `scenarioActionPayload`;
- `scenarioOverlayPackage` uses it when no request-key-matched scenario state exists;
- downstream decision-path and Scene overlay construction consume that package.

The normalized payload is correctness-relevant. Strict object identity has not been proven independently contractual, but changing recomputation frequency can change downstream memo identities and effect scheduling. It cannot be classified as performance-only without tests.

### 5.2 `set-state-in-effect` ×1 — reset/adopt/invalidate effect

Representative diagnostic state update:

```text
setBackendOverlay(null)
```

The same synchronous effect branch also updates:

- `backendOverlayKey`;
- `scenarioActionPayload`;
- `scenarioActionKey`;
- `propagationLoading`;
- `propagationError`;
- `activeRequestKeyRef.current`.

Other branches synchronously adopt embedded overlay/scenario state or invalidate incompatible state.

Trigger set:

```text
active trigger kind
current backend/scenario state
embedded overlay/scenario payload
loops
request key
resolved source
Scene
```

Most of this React state mirrors deterministic render inputs plus compatibility/key checks. The embedded payload is externally supplied but already present as a render input; adopting it after commit is not a subscription callback. The current effect creates an additional render and may show preview/old state before adoption. A pure effective-snapshot derivation is plausible, but cleanup, stored async results, and loading/error reset ordering are not yet characterized.

### 5.3 `set-state-in-effect` ×1 — cache-adoption path

Representative diagnostic state update:

```text
setBackendOverlay(cached)
```

The synchronous cache-hit branch also updates key, loading and error state. The cache is a module-global external mutable source, but it has no subscribe/snapshot contract. Reading it during render to avoid the effect would introduce concurrent-render consistency and mutation-visibility questions. Turning it into a store would be a new ownership decision, not a local lint fix.

The same effect legitimately owns HTTP synchronization. Promise callbacks are genuine external event boundaries and may update state after commit, subject to stale/cancellation guards.

### 5.4 Existing `exhaustive-deps` ×1

The async request effect captures:

- `activeTrigger?.kind`;
- `activeTrigger.scenario_action`;

but its dependency list includes only other active-trigger projections (`mode_hint` and impacted nodes) plus request and Scene inputs. Mechanically adding the suggested dependencies could change request frequency because `activeTrigger` may be reconstructed and is influenced by module-global semantic caching. The warning must be resolved by ownership/stability proof, not dependency insertion.

---

## 6. Risk reconstruction

| Risk | Current mechanism | Unresolved issue |
|---|---|---|
| Stale result | `cancelled` flag plus `activeRequestKeyRef` equality | Ref is per instance; lower-level dedupe is global |
| Duplicate request | semantic/bridge/attempt refs, in-flight refs, module client dedupe | Multiple layers can suppress valid replacement/remount work |
| Duplicate propagation | bridge signatures and request-key-compatible overlay selection | Module-global trigger cache can share resolution across instances |
| Lost propagation | stale results ignored; incompatible overlays rejected | A globally deduped second caller can receive `null` rather than the first result |
| Ordering | priority resolver, request key, cache then network, last active key wins | No formal same-tick/source-replacement ordering tests |
| Mount flicker | preview first, embedded/cache adoption after effect | Behavior exists but is not explicitly contractual |
| Cleanup | cancellation flag ignores late result | Request is not aborted; cache/client globals outlive hook |
| Stale callback | `useCallback` with functional state or request-key dependency | Consumer identity expectations are not directly tested |

---

## 7. Existing authority inspection

| Authority | What it governs | Sufficiency |
|---|---|---|
| `AD-FE-HOOKS-02` | Classify effects; derive render state where safe; keep genuine external synchronization in effects; event work in handlers; preserve identity only when contractual | Necessary general policy, not a propagation lifecycle |
| `AD-FE-LINT-01` P-REACT-01 | Formal parking and specialized decision requirement | Disposition authority only |
| `CERT-FE-LINT-01` | Exact parked error inventory and no-suppression/CI posture | Verification authority only |
| `overlayRuntime` contract | Stable frozen visibility snapshot, subscribe/unsubscribe, hydration/server snapshot | Sufficient for overlay visibility only; not request/cache/source state |
| `resolvePropagationTrigger` | Trigger priority and route policy | Defines source selection, but uses module-global semantic cache and time |
| `propagationClient` | HTTP request shape and global duplicate/in-flight guards | Defines transport, not React lifecycle or multi-instance scope |

No canonical propagation bridge lifecycle, cache-scope, or request-ordering authority exists. A specialized decision is required. This record supplies the evidence boundary and parking disposition, but does not accept a new lifecycle implementation.

---

## 8. Candidate assessment

| Option | Assessment | Disposition |
|---|---|---|
| **A — External-store subscription contract** | There is a real external HTTP/cache source, but no propagation subscribe/snapshot API. The existing external store is visibility-only. Creating a store would require explicit cache scope, immutable snapshots, server snapshot, request events and listener dedupe; it cannot be inferred from current code. | Not proven; do not invent by local remediation |
| **B — Reducer-owned lifecycle** | A reducer can express `source_changed`, `embedded_adopted`, `cache_hit`, `request_started`, `request_succeeded`, `request_failed`, `cleared` and reject stale keys. Dispatch identity is stable. External requests still need an effect/controller, and synchronous prop/cache reconciliation can still cause post-commit renders unless canonical events exist before render. | Promising state-machine component, insufficient alone |
| **C — Event-owned updates** | Manual source, refresh, clear and promise completion have real event owners. Prop/Scene/source replacement and initial embedded/cache adoption do not originate from one event handler inside this hook. Moving only some transitions risks missed external updates. | Partial fit only |
| **D — Pure derived render state plus external effect** | Embedded payload, compatibility, preview, mode and key-valid selection can largely be derived. Only HTTP synchronization and promise events need effects. However the module cache is mutable without a snapshot contract, and current preview-to-cache/embedded timing plus loading/error reset behavior lacks characterization. | Preferred analysis direction, not proven |
| **E — Dedicated bridge controller** | A per-Scene controller could own snapshot, request ordering, cache scope, stable commands and cleanup, with React consuming an immutable snapshot. It would change ownership materially and could solve multi-instance ambiguity. Without a defined subscription/snapshot or controller lifetime, extraction could merely relocate refs/effects and recreate the conflict. | Preferred reopening candidate when combined with B/D evidence; not Accepted |
| **F — Continue parking** | Preserves the restored behavior and visible findings until lifecycle, cache scope, multiplicity and timing are characterized. | Selected |

---

## 9. Acceptance invariants for reopening

A later Accepted implementation must prove:

- `preserve-manual-memoization`: `1 -> 0`;
- `set-state-in-effect`: `2 -> 0`;
- the existing bridge `exhaustive-deps` warning is cleared or explicitly remains without any new dependency finding; file-clean is the preferred acceptance bar;
- project `refs` remains `0`;
- no new `use-memo`, `immutability`, `purity`, `any`, unused variable, suppression, config change or ignore;
- exactly one request lifecycle for each accepted request key and defined bridge scope;
- deterministic cache sharing and source/target replacement;
- embedded payload, compatible cache, backend response and preview precedence unchanged;
- stable callback identities according to the public contract;
- immutable stable snapshots for unchanged semantic state;
- no lost/duplicated propagation, stale result, update after unmount, flicker regression, render/effect loop or subscription churn;
- deterministic cleanup and Strict Mode-like remount behavior;
- unchanged Scene overlay, decision impact and diagnostic behavior.

---

## 10. Required future tests

1. initial mount with no source returns idle/null and performs no request;
2. initial preview is deterministic when fallback is eligible;
3. initial embedded compatible overlay wins according to the current precedence;
4. compatible cache hit produces the specified first-commit or post-commit snapshot without request;
5. exactly one request for one accepted request key;
6. successful backend update replaces preview and preserves scenario package ordering;
7. rapid source/key updates accept only the newest result;
8. repeated equivalent events neither duplicate nor lose propagation;
9. source replacement resets/adopts state without stale overlay;
10. Scene/target replacement rejects incompatible cache/backend results;
11. refresh invalidates the correct cache key and performs one new request;
12. clear and manual-source callbacks retain contractual identity and ordering;
13. cleanup ignores or aborts late completion and produces no update after unmount;
14. remount defines whether cache is reused and whether a request is restarted;
15. Strict Mode-like mount/cleanup/remount has no duplicate or lost request;
16. two concurrent bridge instances prove the accepted cache/dedupe scope;
17. server/hydration snapshot behavior if an external-store/controller option is selected;
18. unchanged downstream Scene overlays, loading/error/mode and decision-impact output;
19. no additional render or effect loop;
20. isolated lint proves the complete Compiler-rule acceptance set.

---

## 11. Conditional migration and file boundaries

No files are authorized for implementation by this record.

If reopened and a lifecycle option is Accepted, the proposed bounded files are:

- `frontend/app/lib/simulation/usePropagationBridge.ts`;
- one new pure propagation lifecycle reducer/state-machine module, if selected;
- one new controller/snapshot module only if its scope and subscription contract are Accepted;
- `frontend/app/lib/simulation/resolvePropagationTrigger.ts` only for an explicitly accepted purity/instance-scope correction;
- `frontend/app/lib/simulation/propagationClient.ts` only for an explicitly accepted request-coordination/abort contract;
- `frontend/app/lib/simulation/usePropagationOverlay.ts` and `frontend/app/lib/overlay/useSceneOverlayRuntime.ts` only if the public bridge result changes;
- focused propagation lifecycle tests.

`SceneCanvas`, P-REACT-02, P-REACT-03, HomeScreen, EX/RTC and ESLint configuration are not authorized.

Conditional migration order:

1. characterize current first-render, post-effect, cache, embedded payload and network timing;
2. test concurrent instance and Strict Mode-like remount behavior;
3. decide cache/request scope: per instance, per Scene, or application-global;
4. define immutable lifecycle state and ordered events;
5. separate pure effective snapshot derivation from external HTTP synchronization;
6. move manual/refresh/clear changes to explicit events;
7. implement accepted stale-result and cleanup/abort ownership;
8. preserve or deliberately version callback identities;
9. switch the hook within one isolated batch;
10. run the `usePropagationBridge`-only lint checkpoint before broader verification.

Rollback boundaries:

- pure derivation/signature layer;
- reducer/event layer;
- controller or snapshot layer;
- request/cache coordination;
- hook adapter;
- consumer contract.

No batch may combine SceneCanvas or other parked-cluster work.

---

## 12. Anti-loop policy

If correcting state-in-effect introduces `refs`, memoization, dependency, immutability, purity or another Compiler finding:

1. stop immediately;
2. restore the hook batch;
3. record `CyclicLintRemediationConflict`;
4. retain the last clean checkpoint;
5. do not attempt the reverse correction in the same task;
6. retain formal parking.

---

## 13. Prohibited alternatives

- editing `usePropagationBridge` in this architecture task;
- adding refs for latest values, render state or identity;
- adding state/effects as lint workarounds;
- mechanically adding `activeTrigger` dependencies;
- removing scenario payload memoization without identity/output evidence;
- reading a mutable module cache during render without a snapshot contract;
- treating overlay visibility state as propagation request state;
- inventing a global external store without accepted cache/lifetime ownership;
- moving the same refs/effects into a controller;
- changing request priority, cache scope, preview/backend precedence or stale-result policy incidentally;
- adding suppressions, `any`, config changes or ignores;
- modifying P-REACT-02, P-REACT-03, HomeScreen or EX/RTC;
- implementing EX-2:3 or deploying.

---

## 14. Verification record

This record changes documentation only. Production React, tests, ESLint configuration, suppressions and every parked cluster remain unchanged.

| Check | Run A | Run B |
|---|---|---|
| `npm run lint` | `21` errors / `288` warnings / `309` total / `64` files | identical |
| Finding-key hash | `8fc4a8ea4c49e0a4fc2b61dd2a022500cfac53bf547b12abdf67571cbce758b3` | identical |
| Bridge error findings | PMM `1`; state-in-effect `2` | identical |
| Bridge total findings | `4`, including existing exhaustive-deps `1` | identical |
| Project `refs` | `0` | `0` |
| Project `no-explicit-any` / `no-unused-vars` | `0` / `0` | `0` / `0` |
| EX / RTC lint findings | `0` / `0` | `0` / `0` |
| `NODE_OPTIONS="--max-old-space-size=8192" npm run typecheck` | exit `0`, zero diagnostics | exit `0`, zero diagnostics |
| `npm run test:scene` | `296` pass / `0` fail | `296` pass / `0` fail |
| `NODE_OPTIONS="--max-old-space-size=8192" npm run build` | exit `0` | exit `0` |

Both successful builds used network access for `next/font` Geist downloads. Hosted CI was not executed and is not claimed.

Final change audit:

- production code changed: no;
- test code changed: no;
- `usePropagationBridge` changed: no;
- P-REACT-02, P-REACT-03 and HomeScreen changed: no;
- prior `AD-FE-AO-01` and `AD-FE-EDP-01` records changed by this task: no;
- ESLint configuration or ignore changed: no;
- suppression added or removed: no;
- EX-2:3 implemented: no;
- architecture documentation added by this task: this record only.
