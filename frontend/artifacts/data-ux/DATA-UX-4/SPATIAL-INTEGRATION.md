# DATA-UX:4 Spatial Integration

Date: 2026-08-31

## Pipeline

```
RDI / Data Reality
        ↓
canonical DATA_OBJECT projection   (DATA-UX:1)
        ↓
Director-owned Stage projection    (DATA-UX:4)
        ↓
existing R3F Canvas / Scene / Connections
```

There is one Canvas. Data Objects are `NexoraStageDataObject` meshes in `NexoraStageScene`, not a second WebGL surface and not DOM overlays pretending to be spatial objects.

## Identity

- Canonical source ID: RDI `sourceContextId`
- Logical Data Object ID: `data-source:{workspace}:{sourceId}`
- Stage instance ID: `stage:{dataObjectId}` (diagnostic only)

One source → one DATA_OBJECT → one Stage participant when visible. Replacement updates the same IDs.

## Visibility

Manager requests presentation through Data Rail `Show on Stage` (or equivalent Advisor/Data control paths that call the same shell handler). Import does not auto-explode the scene.

Director projection:

- `ORIENT_TO_STAGE` for manager-requested visibility
- Comparison / commitment / consequence intents omit Data Objects unless one is being inspected (`PRESERVE_SCENE`)

DATA_OBJECT does not write positions into Data Reality. The React mesh consumes `presentation.targetPosition` from the Director projection.

## Selection versus Focus

Selecting a Data Object sets presentation selection only. It does not call Manager–Object focus. Selecting a business object clears Data Object selection so deictic `this` returns to the business referent.

## Removal

`Remove from Stage` removes the ID from `stagedDataObjectIds`. It does not call `removeCsvRealDataImport`. Source deletion remains DATA-UX:5 / existing inactive-source management on the Rail.

## Performance

Hex cylinder (6 segments), cached materials, no per-frame React state, no physics, no animated shaders.
