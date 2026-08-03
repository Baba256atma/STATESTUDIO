# Architecture Overview

Nexora Executive Platform layers (Beta):

```
Enterprise Connectors
        ↓
Metadata (meaning)
        ↓
Executive Runtime (single source of truth)
        ↓
Runtime Intelligence → Signals
        ↓
Advisor (explain / recommend / propose)
        ↓
Simulation (isolated Future State)
        ↓
Decision → Execution → Monitoring
        ↓
Journal (audit packs)
```

## Preserve rules

- Runtime owns Mode, Pack, Timeline, Selection, experience slices, event log  
- Metadata never invents Runtime IDs  
- Simulation never mutates Runtime business state  
- Advisor never executes without Manager Approval  
- Connectors publish into Runtime via defined actions/events  

## Cockpit

Director (Stage) + Explorer + Advisor + Timeline + Status Bar.  
Overlays (Data, Simulation) are siblings of Stage — they do not replace Runtime.
