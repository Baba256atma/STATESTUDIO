# Runtime Overview

The Executive Runtime Store is the **single source of truth**.

## Owns

- Mode, Timeline lens/position, Pack, Selection  
- Scenario / Decision / Execution / Monitoring / Data slices  
- Event log (`ModeChanged`, `DataUpdated`, `SimulationCompleted`, …)  

## Does not own

- Metadata catalog (Metadata Provider)  
- Intelligence signals (Intelligence Provider)  
- Connector sessions (Connector Provider)  
- Simulation sessions (Simulation Provider)  

Those layers **emit** into Runtime or read Runtime state — they do not fork ownership.

## Inspector

Development Runtime Inspector is gated by `EnableRuntimeInspector`.
