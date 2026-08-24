# MVP-OUT:1-R1 Runtime Chain

Coordinator: `coordinateNexoraOutcomeLearningRuntime`  
Seam: `integrateNexoraOutcomeLearningRuntime` (unchanged CORE projectors)  
Snapshot: `NexoraOutcomeLearningRuntimeSnapshot` (read model only)

```
Decision Runtime (CC:10 via NEX-MVP:8)
      ↓ PARTIAL/MISSING expected metric
Execution (NEX-MVP:8; CC:11 MISSING)
      ↓ PARTIAL (no live timestamps)
Expected Outcome (canonical only when metric/target exists)
      ↓ MISSING on live uncommitted Decision
Observation Window (CORE-OUT:1A; live = timing-incomplete)
      ↓ MISSING live post-decision Actual
Data Reality (current KPI remains Reality)
      ↓ PARTIAL / MISSING auto-capture
CORE-OUT:1A
      ↓ CONNECTED (projector)
CORE-OUT:1
      ↓ CONNECTED (projector)
CORE-OUT:2
      ↓ TEST-ONLY APP-4 promotion
APP-4
      ↓ CONNECTED retrieval when memories exist
EXI:5
      ↓ CONNECTED
Advisor / Conversation
```

Live `/executive` honest terminal:

- Decision = live (`ctx-decision-capacity` under-review)
- Execution = live (`ctx-execution-capacity` planned)
- Expected Outcome with comparable metric = **MISSING** (not invented)
- Actual Outcome = pending
- Learning = 0
- APP-4 promotion = none
