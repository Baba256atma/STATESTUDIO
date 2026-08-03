# Simulation Guide

Deterministic executive simulation — not forecasting or ML.

## Vertical slice

Baseline → Inventory Shortage → Assumption **Increase Safety Stock** →  
Future Inventory / Cash / Delivery → Impact → Risk → Comparison → Draft Decision Candidate

## Rules

- Captures Baseline Snapshot from Runtime  
- Future State is isolated  
- Emits `SimulationCompleted` only  
- Decision Candidate always starts as **Draft**  
- Timeline is never moved by Simulation  
- Journal creates `[Simulation]` packs  
