# NPA-T NMI:6 — Stage / Director authority map

```
NMI:1–5  "What management context is relevant?"
        ↓  NmiStageProjection (read bundle)
handoffNmiStageProjectionToExistingStage
        ↓
selectNexoraMVPInteractionSubject   (existing Stage writer)
        ↓
DIRECTOR-1:1 / DRI                  "What scene best communicates it?"
        ↓
Stage render                        "Render the scene."
```

| Concept | Owner |
| --- | --- |
| Canonical subject identity | Selected NMI/Queue/Map ID; Stage `focusedSubject` / `selectedSubject` |
| Management context bundle | NMI:6 `NmiStageProjection` |
| Scene composition, coordinates, charts, animation | Director / existing Stage presentation |
| Queue collection / CENTER | STAGE-PROD:1 |
| Conversational referent | NCA / CC:5 / ECA (unchanged) |

NMI must not own: coordinates, layout, visual hierarchy, chart selection, animation, scene geometry, DTH scene intent.
