# CHECKPOINT-1-FIX-5 Relationship Density Preserve Unrelated Lines Report

**Project:** Nexora Type-C  
**Phase:** CHECKPOINT-1-FIX-5  
**Title:** Relationship Density Preserve Unrelated Lines  
**Status:** PASS

**Tags:** `[CHECKPOINT1_FIX5_RELATIONSHIP_DENSITY]` `[UNRELATED_RELATIONSHIPS_VISIBLE]` `[RELATIONSHIP_LINES_PRESERVED_ON_SELECTION]` `[NO_RELATIONSHIP_RENDERER_MUTATION]` `[CHECKPOINT1_FIX5_COMPLETE]`

---

## Problem

In default EXECUTIVE density mode, clicking an object caused unrelated relationship lines to disappear. Only relationships touching the selected object remained visible, making the scene look incomplete.

Root cause: `shouldShowRelationshipInDensityMode()` in `relationshipDensityRuntime.ts` returned `false` for `focusRole === "unrelated"` when `mode === "EXECUTIVE"`.

---

## Fix

Density visibility fix only. Unrelated relationships are no longer hidden in EXECUTIVE mode:

```typescript
if (input.focusRole === "unrelated") {
  return true;
}
```

Highlight/dim styling is unchanged — existing `focusRole` values (`direct_dependency`, `major_risk_route`, `unrelated`, etc.) still drive render-plan emphasis. This change only prevents hiding.

---

## Artifacts

Modified:

- `frontend/app/lib/relationships/executive/relationshipDensityRuntime.ts`
- `frontend/app/lib/relationships/executive/executiveRelationship.test.ts`

Not modified (per safety rules):

- `RelationshipRenderer.tsx`, `RelationshipLine.tsx`, `SceneOverlayRenderer.tsx`
- Object click / selection pipeline, `sceneJson`, topology, MRP, dashboard routing, object panel

---

## Tests

Command:

```bash
cd frontend
npx vitest run app/lib/relationships/executive/executiveRelationship.test.ts
```

Result: **8 tests passed**

Updated expectations:

- Unrelated relationship with `selectedObjectId` → `visible === true` (was `false`)

Added test:

- With `selectedObjectId`, direct dependency and unrelated relationship both visible
- Direct dependency retains `focusRole === "direct_dependency"` for emphasis

Command:

```bash
cd frontend
npm run build
```

Result: **build passed**

---

## Expected Runtime Flow

| State | Behavior |
|-------|----------|
| Before click | All relationship lines visible |
| After object click | All lines remain visible; selected-object network emphasized via `focusRole` |
| Click another object | All lines remain visible; emphasis shifts to new selection |

No scene rewrite, topology update, or renderer architecture change.

---

## Acceptance Criteria

| Criterion | Status |
|-----------|--------|
| Unrelated relationships no longer disappear on object click | PASS |
| All relationship lines remain visible in EXECUTIVE mode | PASS |
| Selected-object relationships still render | PASS |
| Existing density modes do not crash | PASS |
| No scene mutation | PASS |
| No topology mutation | PASS |
| No object click regression | PASS |
| Build passes | PASS |

---

## Manual Verification Checklist

1. Open demo workspace with multiple relationships — all lines visible before selection
2. Click an object — all lines remain visible; selected-object relationships clear
3. Click another object — all lines remain visible
4. No console runtime errors
