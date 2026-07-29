# AD-SCENE-01 — Establish TOP_CENTER as the Canonical Executive Scene Toolbar Zone

| Field | Value |
|---|---|
| **Decision ID** | `AD-SCENE-01` |
| **Title** | `Establish TOP_CENTER as the Canonical Executive Scene Toolbar Zone` |
| **Status** | `Accepted` |
| **Authority** | `Bahadoor` |
| **Authority role** | `Nexora Product and Architecture Authority` |
| **Decision date** | `2026-07-28` |
| **Selected option** | `A — Canonical TOP_CENTER` |
| **Scope** | `ExecutiveSceneToolbarCanonicalZoneOnly` |
| **Readiness** | `ReadyForSceneToolbarCanonicalZoneAlignment` |

---

## 1. Purpose

Record the Accepted architecture decision that establishes `TOP_CENTER` as the sole canonical zone for the executive Scene toolbar (`executiveSceneToolbar`).

This decision resolves the architecture-authority conflict required for `SCENE-FAIL-02` through `SCENE-FAIL-05`. It does **not** implement alignment, change production code, change tests, or authorize EX-2:3.

---

## 2. Canonical decision

```text
executiveSceneToolbar.zone = TOP_CENTER
executiveSceneToolbar.top = EXECUTIVE_SCENE_HUD_GRID.topMargin
```

`EXECUTIVE_SCENE_HUD_GRID.topMargin` remains `12`.

The toolbar participates in the E2:21/E2:57 unified top-row placement model.

---

## 3. Authority ordering

Exact authority order for the toolbar zone:

1. `AD-SCENE-01`
2. E2:57 unified top-row/grid authority
3. E2:21 Scene Navigation placement
4. E2:56 registry/governance metadata

E2:56 is superseded only for:

```text
executiveSceneToolbar.zone
```

E2:56 remains unchanged and authoritative for every other field and HUD component.

---

## 4. Rationale

- Runtime placement already uses `TOP_CENTER`.
- Scene Navigation’s corrected test confirms the E2:57 unified top baseline.
- Existing peer tests confirm top margin `12`.
- Registry `RIGHT_TOP` conflicts with runtime placement.
- `RIGHT_TOP` groups toolbar, object information and status into the same audit zone.
- This mismatch causes `SCENE-FAIL-02`, `SCENE-FAIL-03`, `SCENE-FAIL-04` and `SCENE-FAIL-05`.
- Aligning registry metadata to current accepted runtime placement is safer than moving runtime back to the older right-top model.
- This decision formalizes existing visual placement; it does not authorize a new visual redesign.

---

## 5. Rejected alternatives

| Alternative | Disposition |
|---|---|
| `RIGHT_TOP` canonical | Rejected |
| Dual/context-dependent zones | Rejected |
| Deferral | Rejected |

Reasons:

- `RIGHT_TOP` conflicts with E2:21/E2:57.
- Dual zones make governance and collision audits nondeterministic.
- Deferral leaves Scene runtime certification blocked.

---

## 6. Authorized follow-up

A later implementation task is authorized to align:

- `CANONICAL_HUD_ANCHORS.executiveSceneToolbar`
- `SCENE_HUD_REGISTRY`
- Derived toolbar registry/governance descriptors
- Collision-layout inputs
- Layout-audit expectations
- Governance-anchor expectations
- Exact affected tests

Authorized canonical value:

```text
TOP_CENTER
```

The follow-up must recalculate collisions from actual geometry. It must not hardcode zero or suppress real collisions.

Recommended next task:

```text
NPA-T — Scene Toolbar Canonical Zone Alignment and Collision Audit Correction
```

---

## 7. Explicit non-authorizations

This decision does **not** authorize:

- Changes to other HUD anchors
- Changes to object-info or status zones
- Changes to top margin `12`
- New layout tokens
- Collision suppression
- Responsive redesign
- Route or navigation redesign
- EX or RTC changes
- Deployment
- EX-2:3 implementation

---

## 8. Separate unresolved Scene failures (out of scope)

This decision resolves only the architecture authority needed for `SCENE-FAIL-02` through `SCENE-FAIL-05`.

Out of scope:

- `SCENE-FAIL-01` — stale object-naming assertion
- `SCENE-FAIL-06` — browser-storage test harness
- `SCENE-FAIL-07` — stale object-panel assertion
- `SCENE-FAIL-08` — Node ESM test environment/import resolution

The four dependent Scene failures (`SCENE-FAIL-02` through `SCENE-FAIL-05`) may remain until the authorized alignment task is executed.

---

## 9. Implementation posture

| Item | Value |
|---|---|
| Production changes in this decision task | None |
| Test changes in this decision task | None |
| Alignment authorized | Yes (later task only) |
| Collision hardcoding / suppression | Forbidden |
| Readiness after this record | `ReadyForSceneToolbarCanonicalZoneAlignment` |
