# DATA-UX:5 Source Lifecycle

```
NEW → understood → clarified → validated → ACTIVE
                    ↑
              UPDATE SOURCE (same source id)
ACTIVE → REMOVAL REVIEW → Cancel → ACTIVE
                    ↓ confirm
              INACTIVE + historical reference
                    ↓ later import of same filename identity
              NEW ACTIVE commit (new importId)
              old historical importId remains distinct
```

Update source ≠ remove + import.

Filename-derived RDI identity means a later file with the same normalized name can occupy the same `sourceContextId`. That is existing identity, not silent resurrection of the old snapshot. Semantic confirmations do not transfer (`transfersSemanticConfirmation: false`).
