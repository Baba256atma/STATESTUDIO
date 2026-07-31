# AD-R3F-02 — Scene Runtime Mutation Ownership and React Compiler Contract

| Field | Value |
|---|---|
| **Decision ID** | `AD-R3F-02` |
| **Status** | `Accepted` |
| **Authority** | `Bahadoor` |
| **Authority role** | `Nexora Product and Architecture Authority` |
| **Decision date** | `2026-07-30` |
| **Scope** | `SceneCanvasOrbitControlsAndSceneApplyMutationOwnershipOnly` |
| **Selected option** | `ContinueParkingPendingSceneMutationOwnershipEvidence` |
| **Implementation authorized** | `false` |
| **Production deployment authorized** | `false` |
| **Preserves** | `AD-R3F-01`, `AD-SCENE-01`, `AD-FE-LINT-01`, `AD-FE-PROP-02` |

## Decision

P-REACT-02 remains parked. This record narrows the missing architecture
questions left by AD-R3F-01; it does not supersede that decision and does not
authorize production remediation.

The 14 errors do not represent one interchangeable mutation pattern. They span
an R3F-owned Scene, caller-owned registrar refs, an R3F-created OrbitControls
instance passed through a prop ref, hook-owned provenance refs that are merged
with caller overrides, and a caller-owned Type-C callback bridge. Moving all of
them to effects or cloning them would not establish ownership. Existing tests
do not prove the Strict Mode, identity, disposal, transaction, and rollback
criteria required to select an implementation.

## Governing baseline

The deterministic full-project baseline is:

- 21 errors, 288 warnings, 64 affected files
- P-REACT-02: 14 errors
  - `SceneCanvas`: 7 `react-hooks/immutability`, 1 `react-hooks/purity`
  - `ExecutiveOrbitControls`: 1 `react-hooks/immutability`
  - `useSceneApplyController`: 5 `react-hooks/immutability`
- project `react-hooks/refs`: 0
- project `react-hooks/rules-of-hooks`: 0
- `@typescript-eslint/no-explicit-any`: 0
- unused-variable findings: 0

The four P-REACT-01 findings remain parked under AD-FE-PROP-02. AD-SCENE-01
remains Accepted and unchanged.

## Exact 14-finding inventory

| # | Stable location | Mutated value and owner | Timing / consumer | Coverage and conflict |
|---:|---|---|---|---|
| 1 | `SceneCanvas.tsx:461`, `immutability` | `scene.fog`; R3F renderer owns the Scene returned by `useThree` | Effect assigns Fog; cleanup assigns `null`; renderer consumes it | Scene suites cover broad output, not fog identity, replacement, remount, or competing fog owners |
| 2 | `SceneCanvas.tsx:580`, `immutability` | `refSetter.current`; caller owns prop ref | Effect publishes selection setter; caller invokes it | No registrar mount/cleanup/consumer-change test; prior prop-ref mutation A↔B risk |
| 3 | `SceneCanvas.tsx:606`, `immutability` | `selectedIdRefLocal.current`; caller owns prop ref | Effect mirrors external-store selection; frame/event readers consume it | Selection behavior is broadly tested, but registrar identity/remount is not |
| 4 | `SceneCanvas.tsx:616`, `immutability` | `overridesRefLocal.current`; caller owns prop ref | Effect mirrors override-store snapshot; Scene readers consume it | No snapshot publication ordering test |
| 5 | `SceneCanvas.tsx:620`, `immutability` | `setOverrideRefLocal.current`; caller owns prop ref | Effect publishes store command; callers invoke it | No consumer-change or stale-command cleanup test |
| 6 | `SceneCanvas.tsx:624`, `immutability` | `clearAllOverridesRefLocal.current`; caller owns prop ref | Effect publishes store command | No bridge cleanup/remount test |
| 7 | `SceneCanvas.tsx:628`, `immutability` | `pruneOverridesRefLocal.current`; caller owns prop ref | Effect publishes store command | No bridge cleanup/remount test |
| 8 | `SceneCanvas.tsx:2770`, `purity` | result of global `performance.now()` stored in a component-owned ref initializer | Impure global clock read during render; diagnostics/camera authority consume timestamp | Re-render and Strict Mode double-render can create different values; no clock injection/double-construction test |
| 9 | `ExecutiveOrbitControls.tsx:132`, `immutability` | `controls.minDistance`, `maxDistance`, `minZoom`, `maxZoom`; R3F/Drei constructs controls, caller passes handle | Effect configures external controls, then target and `update`; frame loop also calls `update` | Runtime config helpers are tested; controls identity, effect order, remount, and camera target ordering are not |
| 10 | `useSceneApplyController.ts:615`, `immutability` | caller-owned `writeSourceOverrideRef.current` branch | Event/callback transaction after guards, before state commit | Scene-write behavior is broadly covered; override ownership and rollback are not |
| 11 | `useSceneApplyController.ts:615`, `immutability` | hook-owned `lastSceneWriteSourceRefOwned.current` branch after the ref was passed through hook/memo APIs | Same callback transaction | Compiler treats the borrowed/escaped value as immutable; no provenance transaction test |
| 12 | `useSceneApplyController.ts:616`, `immutability` | caller-owned `writeAtOverrideRef.current` branch | Same callback transaction, clock-stamped immediately after source | No atomicity/failure test |
| 13 | `useSceneApplyController.ts:616`, `immutability` | hook-owned `lastSceneWriteAtRefOwned.current` branch after escape | Same callback transaction | No atomicity/failure test |
| 14 | `useSceneApplyController.ts:673`, `immutability` | caller-owned `typeCBridgeRef.current` | Effect publishes callback; cleanup conditionally clears it | Type-C integration exists, but no Strict Mode duplicate-registration/stale-bridge test |

None of these 14 mutations occurs inside `useFrame`. Finding 9 configures an
external runtime in an effect and additionally has a legal frame-owned
`controls.update()` path which is not itself the reported error. Findings
10–13 occur in the event/callback apply transaction. Finding 8 is the only
render-time operation in the error cluster.

## Scene ownership map

| Value class | Creator / owner | Authorized mutator and phase | Reader / disposal / remount |
|---|---|---|---|
| React component props | Parent component | Owner supplies new values; child must not mutate | Child render/effects read; React controls replacement |
| React state | Declaring component/store | State dispatcher/event/reducer | Subscribers; mount lifecycle owns reset |
| Component-local refs | Declaring hook/component | Owning lifecycle, event, or frame boundary | Closures/frame callbacks; discarded on remount |
| Borrowed refs | Parent/caller | Currently child effects/callbacks mutate, but authority is implicit | Cross-component consumers; cleanup contracts incomplete |
| Three.js `Object3D` / Scene | R3F reconciler unless explicitly constructed elsewhere | R3F declarative props or explicit owned adapter in commit/frame/event phase | Renderer/frame loop; reconciler/provider owns root lifetime |
| Materials and geometry | JSX/R3F, component lifecycle factory, or static module fixture per AD-R3F-01 | Frame/effect/event only when mutable | Renderer; explicit owner disposes exactly once |
| Camera | R3F Canvas/runtime | Camera authority writers in layout/frame/event ordering | Renderer and controls; Canvas owns lifetime |
| OrbitControls | Drei/R3F instance, exposed through ref | Config effect and frame update today | Camera/input runtime; Drei owns disposal |
| Selection | selection external store | store commands | registrars mirror into borrowed refs; remount contract missing |
| Transform/overrides | override store and scene runtime | store commands and frame/event transforms | Scene renderers; preservation is tested only indirectly |
| Scene-apply state | HomeScreen owns `sceneJson`; hook owns orchestration/dedupe | `applySceneChangeSafe` callback | HomeScreen and downstream consumers |
| Frame-loop state | R3F scheduler plus local runtime refs | `useFrame` callback | renderer; stops on unmount |
| External stores | store modules | defined store commands | hooks subscribe; store lifetime may exceed component |
| Runtime registries/bridges | caller/module owner | registration lifecycle must be explicit | downstream callers; duplicate/stale ownership not proved |
| Disposable resources | explicit resource creator | that same owner only | cleanup must be idempotent across Strict Mode replay |

Concurrent-render exposure exists whenever a render or abandoned tree mutates a
shared object. The current cluster mostly mutates after commit, but ownership is
still borrowed and therefore cannot be inferred safely by the Compiler.

## SceneCanvas assessment

### Fog

`SceneFogSync` performs commit-time external-runtime synchronization. It creates
a `THREE.Fog` in an effect, assigns it to the R3F-owned Scene, and clears the
Scene slot on cleanup. It does not mutate a React prop and is not a render-time
mutation. However, cleanup always writes `null`, so replacement/overlap could
clear another owner's later fog. There is no identity-checked restoration or
single-owner contract.

### Registrars

`SetterRegistrar` and `FullRegistrar` are callback/snapshot publication
adapters. They mutate refs received as props in effects. The values are not
Three.js resources. The missing questions are caller/child authority,
conditional cleanup, stale consumer behavior, and whether snapshots should use
a formal external-store subscription rather than ref projection.

### Purity

`cameraMountedAtMsRef` calls global `performance.now()` as an argument to
`useRef` during render. Every render evaluates the argument even though only
the first committed ref value is retained. Repeated render can therefore
observe a different clock result, and Strict Mode-like double construction can
choose a different diagnostic origin. It constructs no Three.js object, but it
is still non-idempotent render work. Moving the timestamp to commit is likely
possible, but its zero/unmounted semantics and every diagnostic consumer have
not been characterized.

## ExecutiveOrbitControls assessment

R3F owns the camera. Drei creates and disposes the OrbitControls instance;
`SceneCanvas` owns the handle ref and passes it into
`ExecutiveOrbitControls`. The component's effect configures limits, conditionally
sets the target according to camera authority, marks a programmatic update, and
calls `update`. `useFrame` continues ordered updates during rendering.

The mutation is required by the imperative controls contract and occurs after
commit, not during render. The error arises because the controls value is
reached through a prop-owned ref. An owned lifecycle adapter could encapsulate
configuration, but moving it must preserve synchronous ordering relative to
visual-bounds camera authority, target setting, damping, initial paint, and the
first frame. Existing tests do not prove that ordering or controls identity.

## useSceneApplyController assessment

The four provenance findings are two assignments reported against both possible
owners: optional caller override refs and hook-local refs that have escaped
through `resolvedRefs`. They occur together inside `applySceneChangeSafe` after
all duplicate/destructive guards and immediately before hydration/stability
marks, `sceneJsonRef.current`, and the React state update.

The fifth finding publishes `applySceneChangeSafe` into a caller-owned Type-C
bridge in an effect and conditionally clears it on cleanup.

These values require stable identity for current consumers. Blind cloning would
break bridge and provenance identity and add allocation without making the
scene update transactional. The current apply sequence has no rollback: once
diagnostics/provenance/startup markers are written, a later exceptional path
cannot restore the prior bundle. The common path is synchronous and ordered,
but no test injects failure between steps. A controller method may own the
transaction, but only after shell state, provenance, bridge registration, and
failure semantics are defined together.

## Current Scene lifecycle

1. **Render:** React selects JSX resources and computes configuration. No shared
   mutation is authorized; the current clock read violates purity.
2. **Resource construction:** R3F/Drei or lifecycle/static resource owners
   construct objects under AD-R3F-01.
3. **Commit:** React attaches R3F instances and refs.
4. **Layout synchronization:** camera/bounds paths perform pre-paint updates
   through stable runtime handles.
5. **Registration:** effects publish selection, override, Type-C, invalidation,
   and controls handles.
6. **Frame start:** R3F owns frame scheduling.
7. **Frame mutation:** `useFrame` owns animation and controls updates.
8. **User interaction:** event handlers update controls, selection, and commands.
9. **Controller apply:** scene guards run, then provenance/startup/ref/state
   writes occur in a fixed synchronous sequence.
10. **Camera/control update:** camera authority gates target writes; controls
    update follows configuration and each frame.
11. **Selection/transform:** external stores and scene state publish changes;
    registrars mirror selected values/commands.
12. **Replacement:** effects rerun; resource and registration handoff rules are
    not fully characterized.
13. **Unmount:** R3F/Drei dispose their resources; effects run cleanup where
    present. Several registrar effects install no neutral cleanup.
14. **Strict Mode-like remount:** local refs/resources restart while module
    registries and external stores survive. Duplicate registration, fog
    replacement, disposal, and bridge gaps are not directly tested.

## Characterization evidence and gaps

The 180-test Scene Vitest suite and 296-test Scene node suite cover broad Scene
contracts, toolbar/HUD governance, navigation, camera helpers, selection,
transforms, runtime audits, and AD-R3F-01 material behavior. They do not mount
this complete ownership cluster with controllable R3F/Drei lifecycles.

No new characterization tests are added here. The current design has no narrow
test seam that can inject Scene, controls, frame scheduling, external-store
registrars, apply failures, and disposal ownership without either mocking away
the disputed behavior or defining a new adapter contract.

Missing direct evidence:

- Strict Mode-like double construction and remount for this cluster
- Scene/fog, controls, material, and geometry identity across rerender
- no duplicate registration and no stale registrar commands
- no double disposal or foreign-resource cleanup
- camera/config/first-frame ordering
- transactional controller ordering and injected failure/rollback
- selection and transform preservation across ownership migration
- Type-C bridge cleanup/remount

The canonical toolbar/HUD and Scene audit remain governed by existing tests and
AD-SCENE-01; this decision changes neither.

## AD-R3F-01 adequacy

AD-R3F-01 remains sufficient for explicit resource creation, lifecycle-owned
material identity, frame-bound mutation, and disposal. It remains Accepted.

It does not fully decide:

- mutation of R3F/Drei objects borrowed through hooks or prop refs
- camera/controls configuration and frame ordering
- caller-owned callback/snapshot registrar refs
- controller-owned multi-write transactions
- React prop boundaries for imperative runtime handles
- commit-phase replacement and conditional cleanup
- rollback/failure semantics
- concurrent-render and Strict Mode registration exposure

AD-R3F-02 preserves AD-R3F-01 and records these as a narrow reopening gap.

## Candidate comparison

| Option | Removal potential | Identity/performance and ordering | Compiler / Strict Mode / disposal risk | Scope and rollback |
|---|---|---|---|---|
| A — lifecycle-owned mutable adapters | Could remove all findings if each adapter owns its handles and publications | Preserves imperative identity and frame performance | Low ref risk with command APIs, but replacement/cleanup still unproved | Medium; separable by resource/registrar/controller |
| B — one Scene controller | Could centralize all 14 | Strong transaction authority, but risks over-centralizing R3F frame/camera lifecycle | Large Strict Mode/disposal and dependency surface | High; rollback boundary too broad |
| C — resource-specific ownership | Best fit: fog/resource, registrars, camera/controls, and apply transaction get distinct owners | Preserves specialized identity and ordering | Potentially lowest cross-domain risk; contracts/tests still missing | Medium-high, naturally partitioned |
| D — commit-phase boundary only | Purity may move; most mutations already occur in effects/events | Does not clarify borrowed ownership | Likely retains immutability or trades it for refs/dependencies | Small but incomplete |
| E — immutable replacement | Could avoid some mutation syntax | Recreating Scene/controls/resources risks identity, GPU churn, camera jumps, and disposal errors | High purity/memoization/disposal risk | Broad and expensive |
| F — continue parking | Removes none | Preserves current observable runtime | No new findings or lifecycle risk | Documentation-only; selected |

Option C is the preferred future investigation direction, using
lifecycle-owned adapters within each resource-specific boundary. It is not
Accepted for implementation because the test and ownership criteria are not
yet proved. Option D cannot remove all 14 findings. Option E is incompatible
with current identity/performance assumptions. Option B is unnecessarily
unbounded.

## Reopening conditions

Reopen remediation only when:

1. Scene/fog ownership specifies replacement-safe cleanup.
2. Registrar APIs specify publisher, consumer, neutral value, cleanup, and
   consumer-change behavior without borrowed prop mutation.
3. OrbitControls ownership specifies creation/disposal, config timing, camera
   authority, first-frame order, target/damping/update behavior, and stable
   identity.
4. Scene-apply provenance and bridge registration have one controller-owned
   command/transaction contract with explicit failure behavior.
5. A harness proves double construction/remount, identity, registration,
   disposal, frame timing, apply ordering, selection/transform preservation,
   cleanup, and rollback behavior.
6. A prototype removes all 14 errors without introducing `refs`, `purity`,
   `immutability`, memoization, or dependency errors.
7. Full Scene, TypeScript, build, lint, audit/HUD/navigation, and EX/RTC gates
   remain stable.

## Future implementation partitions

These are checkpoints, not current authorization:

1. **SceneCanvas resource construction and purity** — clock/fog creation and
   replacement contract.
2. **SceneCanvas mutation ownership** — selection/override registrar contract.
3. **ExecutiveOrbitControls ownership** — controls lifecycle adapter and camera
   ordering.
4. **Scene-apply transaction ownership** — provenance plus bridge publication.
5. **Cross-surface integration** — Scene audit, HUD/navigation, selection,
   transforms, Type-C bridge, and remount verification.

Each future checkpoint requires before/after focused lint, focused ownership
tests, both full Scene suites, 8 GB TypeScript, 8 GB build, and an independent
rollback commit or patch. On any A↔B finding exchange, restore the last accepted
checkpoint and stop.

## Binding anti-loop controls

- No production remediation under this decision.
- No render-time refs, broad object cloning, lint suppression, or rule weakening.
- Do not exchange `immutability` for `refs`.
- Do not exchange `purity` for effect/dependency errors.
- Do not combine P-REACT-02 with P-REACT-01, P-REACT-03, HomeScreen, EX, or RTC.

## EX-2 preservation

AD-EX2-14 remains Accepted. EX-2:6 metadata-only authorization remains valid.
No EX or RTC change and no EX-2:6 implementation is authorized. This decision
does not broaden production, release, or deployment authority.
