# AD-FE-AO-01 — AnimatableObject Material and Scale-Hold Ownership

| Field | Value |
|---|---|
| **Decision ID** | `AD-FE-AO-01` |
| **Title** | `AnimatableObject Material and Scale-Hold Ownership` |
| **Status** | `ParkedPendingRuntimeOwnershipEvidence` |
| **Authority** | `Bahadoor` |
| **Authority role** | `Nexora Product and Architecture Authority` |
| **Decision date** | `2026-07-29` |
| **Scope** | `AnimatableObject only` |
| **Selected material option** | None accepted; Option A is the preferred candidate for later proof |
| **Selected scale option** | `Option F — Continue parking` |
| **Disposition** | `AnimatableObjectParkedPendingRuntimeOwnershipEvidence` |
| **Implementation authorization** | `false` — later task only after reopening and acceptance |
| **Deployment authorization** | `false` |
| **Governing authority** | `AD-FE-MEMO-01`, `AD-FE-LINT-01`, `CERT-FE-LINT-01`, P-REACT-03 `CyclicLintRemediationConflict` |

---

## 1. Decision

No implementation architecture is Accepted by this record.

Material normalization and scale stabilization have different owners and must not be combined merely because clearing the material `react-hooks/use-memo` diagnostic exposes the latent scale `react-hooks/refs` diagnostic.

Option A, parent/controller-normalized material input, is the best material direction. It is not selected for implementation until a companion scale design proves all required invariants. The scale contract has previous-value and reset semantics that current tests do not directly specify. Options C, D, and E cannot yet guarantee identical current-render output, animation continuity, and remount behavior. Option B does not solve the scale ownership issue. Therefore the binding disposition is:

```text
AnimatableObjectParkedPendingRuntimeOwnershipEvidence
```

P-REACT-03 remains:

```text
PReact03ParkedPendingComponentOwnershipRedesign
CyclicLintRemediationConflict
```

No production or test implementation is authorized.

---

## 2. Preconditions and authority reconciliation

The current source and governing records establish:

| Check | Result |
|---|---|
| P-REACT-03 status | `PReact03ParkedPendingComponentOwnershipRedesign` |
| Implementation authorization | `false` |
| ESLint | `21` errors / `288` warnings / `309` total / `64` files |
| AnimatableObject `use-memo` | exactly `1` |
| Project `refs` | `0` |
| `no-explicit-any` / `no-unused-vars` | `0` / `0` |
| TypeScript | zero diagnostics with the governing 8 GB Node heap |
| Scene | `296` pass / `0` fail |
| Build | exit `0` when Google Fonts are reachable |
| New suppression | none |
| AnimatableObject posture | restored parked form |
| Prior failed extraction | `const objectMaterial = obj.material` cleared `use-memo` and exposed `refs` at `holdStableScaleInput(...)`; restored |

Verification-environment conflicts are not source conflicts:

- literal default-heap `npm run typecheck` exhausted the approximately 4 GB Node heap (exit `134`); the governing `NODE_OPTIONS=--max-old-space-size=8192` run completed with zero diagnostics;
- a sandboxed build could not fetch Geist fonts from Google; the same required build completed with network access.

Neither failure changes the lint or architecture disposition.

---

## 3. Current ownership reconstruction

### 3.1 Object and material

`SceneRenderer` reads `sceneJson.scene.objects`, builds a render signature that includes `object.material`, and produces `stableObjects`. `SceneObjectInstances` maps those objects by stable ID and provides each `obj` to a keyed `AnimatableObject`.

`SceneObject` is an open domain-data record (`[key: string]: unknown`); it does not type `material`. At runtime `AnimatableObject` accepts `obj.material` only when it is a non-null object and casts it to the local structural `MaterialLike`:

```text
color?: string
opacity?: number
emissive?: string
emissiveIntensity?: number
size?: number
```

Otherwise it creates the default visual descriptor `{ color: "#cccccc", opacity: 0.9 }`.

This value is not a `THREE.Material`. It is a plain visual descriptor consumed by color calculation, opacity/emissive derivation, point size, debug material signatures, and declarative R3F material props. AnimatableObject neither creates nor disposes an incoming GPU material. Declarative JSX/R3F remains the GPU resource owner; this record does not change that ownership.

Material can change while the semantic object ID remains stable:

- `buildSceneObjectRenderSignature` includes `material`, so a changed descriptor can cause `stableObjects` recomputation;
- `areAnimatableObjectPropsEqual` compares a JSON material signature even when object references differ;
- `SceneObjectInstances` keys by stable ID, so same-ID material replacement rerenders without intentionally remounting the object;
- a replaced stable ID changes the keyed instance and therefore legitimately changes mount ownership.

The current memo preserves the descriptor reference when valid and preserves one fallback object per mounted memo lifecycle until the material dependency changes. Existing code does not prove that producers mutate the same material object in place; such mutation is incompatible with the JSON/signature-based propagation contract and must not be introduced as a supported replacement mechanism.

### 3.2 Scale input and hold semantics

The pre-normalization scale is render-derived:

```text
preExecutiveUniform =
  clamp(object transform x-scale × override scale × UX scale × global scale, 0.25, 1.35)
```

Selection, focus, hover, dimming, importance, object count, workspace view mode, rounded global scale, rounded override scale, and rounded UX scale form `executiveScaleSignature`.

`holdStableScaleInput` runs during render. It:

1. rounds invalid input to `1`, otherwise to two decimals;
2. reads `stableExecutiveScaleInputRef.current`;
3. writes the rounded value when there is no prior entry or the signature changed;
4. returns the previous value when the signature is unchanged.

The call passes `Number.POSITIVE_INFINITY` as the threshold. Consequently, while the signature is unchanged, all finite magnitude changes are held. This is stronger than ordinary `0.02` hysteresis. It also means raw transform x-scale is deliberately not an independent reset key: object data may change while the previous held scale remains.

The held value feeds `normalizeExecutiveObjectScale`, footprint clamping, group scale, selection hit geometry, labels, overlays, and animation base scale. It therefore affects render output and is not merely an imperative frame cache.

Scale changes originate from multiple owners:

- object/Scene props and render signatures;
- override and UX stores;
- React selection/hover/focus state;
- `useSyncExternalStore` workspace view mode;
- global scale props.

Frame animation consumes the resolved base scale but does not own the held input. Moving stabilization into `useFrame` would change declarative render visibility and current-frame ordering.

On remount, the ref is empty and the first current input becomes the held value. In development Strict Mode-like mount/unmount/remount, the same reset occurs for each mount. A module or parent cache surviving remount would therefore change current behavior.

---

## 4. Option assessment

| Option | Assessment | Disposition |
|---|---|---|
| **A — Parent-normalized material prop** | Correct direction if `SceneRenderer` or a narrow Scene composition adapter validates a readonly `ObjectMaterialVisual` and supplies one stable descriptor per material signature. It can represent same-object material replacement without changing the stable React key and removes the complex dependency from AnimatableObject. It must preserve default identity, update the memo comparator/plan signature, and leave declarative R3F disposal ownership unchanged. It does not solve the exposed scale ref. | Preferred material candidate; not Accepted for implementation |
| **B — Material-owning child boundary** | A stable, unkeyed child could consume canonical scalar material fields, but extraction risks moving a large material/geometry render subtree and offers no advantage over Option A for this plain descriptor. A keyed or conditional child could remount Scene graph nodes. It also leaves the parent scale ref exposed. | Rejected as the primary redesign |
| **C — Explicit scale state/reducer** | The held scale drives render, so React state is conceptually visible. However effect/event synchronization would render once with an old/new mismatch or add a transition render; render-phase state correction risks loops and Compiler findings. Remount initialization and signature changes are not proven frame-equivalent. | Not proven |
| **D — Event/frame-owned scale controller** | Appropriate for purely imperative animation state, but current input spans props, stores, and local React state and is consumed by declarative render calculations. Frame mutation could lag the current render, split label/hit/mesh scale, or survive remount if externally cached. | Not proven |
| **E — Pure deterministic scale derivation** | Impossible from current canonical inputs alone because output depends on the previously accepted value. Removing the hold, adding raw transform scale to the signature, or replacing infinity with finite hysteresis changes behavior for transient/invalid and same-signature changes. | Rejected without a product-approved behavior change |
| **F — Continue parking** | Preserves the restored behavior and the zero-`refs` reported lint baseline while runtime ownership evidence is gathered. | Selected |

---

## 5. Invariants for reopening

A later Accepted design must prove, in one AnimatableObject-only checkpoint:

- AnimatableObject `react-hooks/use-memo`: `1 → 0`;
- project `react-hooks/refs`: remains `0`;
- no new `preserve-manual-memoization`, `exhaustive-deps`, `immutability`, or `purity`;
- no `any`, suppression, rule/configuration weakening, or lint ignore;
- a precisely typed readonly material visual contract;
- stable normalized material identity for unchanged semantic material;
- same-stable-ID material replacement rerenders without remount;
- replaced object/stable ID follows existing keyed lifecycle;
- unchanged held-scale reset, rounding, invalid-input, signature, and previous-value behavior;
- no render-time mutable ref or external mutable cache access;
- unchanged animation, hit proxy, label, overlay, and mesh scale in the same render/frame;
- Strict Mode-like remount resets the hold exactly once per mounted lifecycle;
- no new render/effect loop or transition-frame jitter;
- no Scene graph discontinuity;
- no GPU creation/disposal ownership change.

---

## 6. Required evidence and future tests

The future implementation task must add focused tests before changing ownership:

1. unchanged object and unchanged material across parent and local rerenders preserves normalized material identity and Scene graph identity;
2. same stable object with a replaced material descriptor updates color, opacity, emissive, intensity, and size without remount;
3. replaced object with the same stable ID follows the comparator contract without remount, while a replaced stable ID remounts only that object;
4. every scale-signature field changes the held value in the same render;
5. raw transform-scale changes with an unchanged signature preserve the previous held value;
6. invalid (`NaN`/infinite) and transient scale inputs retain current rounding/fallback behavior;
7. animation starts from and continues through the same resolved base scale;
8. Strict Mode-like mount/unmount/remount resets the held value without a cross-mount cache;
9. mesh, label, overlay, and selection-hit scale remain synchronized;
10. no render-time ref access and no additional render/effect loop;
11. stable React/R3F object identity across ordinary rerenders;
12. screenshot or deterministic render-state comparison shows no visual regression.

The current Scene suite is broad but does not directly exercise `holdStableScaleInput` or AnimatableObject material replacement. Its green status is regression evidence, not sufficient ownership proof.

---

## 7. Conditional migration order and rollback boundaries

No migration is authorized now. If this record is reopened and an implementation option is Accepted, use this order:

1. add characterization tests for the existing scale hold and material replacement;
2. introduce the readonly material visual type and a pure normalization function without changing consumers;
3. make the Scene composition owner provide a stable normalized value and prove replacement/remount behavior;
4. introduce the separately accepted scale owner and prove same-render/frame behavior;
5. switch AnimatableObject consumers without changing its stable key or R3F subtree shape;
6. remove the material memo and render-time scale ref only after focused tests pass;
7. run the AnimatableObject-only lint checkpoint before any broader verification.

Material and scale are independent rollback boundaries. Any GPU-resource change is a separate unauthorized boundary. No later task may land only the material extraction if it exposes `refs`.

Anti-loop control is binding:

1. if clearing `use-memo` creates `refs` or any other Compiler rule, stop immediately;
2. restore AnimatableObject to its checkpoint;
3. record `CyclicLintRemediationConflict`;
4. do not attempt a reverse correction in the same task;
5. retain formal parking.

---

## 8. Prohibited alternatives

- editing AnimatableObject in this architecture task;
- retrying the prior same-file `objectMaterial` extraction;
- passing the unvalidated `unknown` material through a renamed prop;
- constructing a new default material descriptor on every parent render;
- treating the descriptor as a `THREE.Material` or changing disposal ownership;
- moving only material rendering to a keyed/conditional child;
- replacing the scale ref with a module/global mutable cache;
- reading or writing a ref/cache during render;
- effect-driven scale synchronization without proof of zero intermediate visual state;
- frame-only mesh mutation that desynchronizes other render consumers;
- adding raw transform scale to the signature or changing the infinity threshold without product authorization;
- removing memoization/holding based only on lint;
- suppression, `any`, config weakening, or production/test behavior changes.

---

## 9. Verification record

This record changes documentation only. Production React, tests, ESLint configuration, suppressions, and AnimatableObject remain unchanged.

| Check | Run A | Run B |
|---|---|---|
| `npm run lint` | `21` errors / `288` warnings / `309` total / `64` files | identical |
| Finding-key hash | `8fc4a8ea4c49e0a4fc2b61dd2a022500cfac53bf547b12abdf67571cbce758b3` | identical |
| AnimatableObject `use-memo` | `1` | `1` |
| Project `refs` | `0` | `0` |
| Project `no-explicit-any` / `no-unused-vars` | `0` / `0` | `0` / `0` |
| EX / RTC lint findings | `0` / `0` | `0` / `0` |
| `NODE_OPTIONS="--max-old-space-size=8192" npm run typecheck` | exit `0`, zero diagnostics | exit `0`, zero diagnostics |
| `npm run test:scene` | `296` pass / `0` fail | `296` pass / `0` fail |
| `NODE_OPTIONS="--max-old-space-size=8192" npm run build` | exit `0` | exit `0` |

The two successful build runs used network access for `next/font` Geist downloads. The initial sandboxed build failed only because that network request was unavailable. The literal default-heap typecheck attempt exited `134` from Node heap exhaustion before diagnostics; both governing 8 GB runs were clean.

Final change audit:

- production code changed: no;
- test code changed: no;
- AnimatableObject changed: no;
- ESLint configuration or ignore changed: no;
- suppression added or removed: no;
- architecture documentation added: this record only.
