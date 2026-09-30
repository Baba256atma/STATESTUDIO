# Explicit switch dual-path trace

```
Switch to inventory.
        │
        ├─ canonical conversation path
        │   → CC:1 intent
        │       PRE: switch-workspace (soft experience alias)     DIVERGES_HERE
        │       POST: focus + inventory hint                      CORRECT
        │   → canonical meaning FOCUS Inventory                   CORRECT (after `switch to` cue)
        │   → 6.3 pending TYPE_AMBIGUITY
        │       PRE: capture as resume/unknown                    DIVERGES_HERE (long session)
        │       POST: explicit named switch = new complete request CORRECT
        │   → candidates: Inventory EXPLICIT_CURRENT_TURN
        │   → referent / CC:5 executive subject                   CORRECT after repair
        │
        └─ presentation path
            → FIX7 topicSwitchCue + NXA:5-FIX4 explicit presentation  CORRECT (unchanged)
            → Director FOCUS obj-inventory                            CORRECT
            → Stage obj-inventory                                     CORRECT / DOWNSTREAM of presentation
```

Earliest disagreement: CC:1 conversational kind (`switch-workspace` vs `focus`). Presentation never used CC:1 workspace classification.

Do not set `referent = NXA5.presentationTarget`. Do not write Stage back into conversation.
