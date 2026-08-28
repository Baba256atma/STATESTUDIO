# Live Stage / Advisor evidence

URL: `http://localhost:3000/executive`  
Server: existing `node` PID 62339 (not started or stopped by this task)  
Machine: `live-stage.json`  
Screenshots: `live-diagnosed.png`, `live-investigation.png`

## Diagnosed sequence

| Turn | Advisor | Stage |
| --- | --- | --- |
| show me problems | Current Problems: Capacity Gap, Margin Pressure. | collection / problem / 2 / focus none |
| which one of prolems is important? | Important in which sense—urgency, financial impact, risk exposure, evidence strength, or which to investigate first? | unchanged |
| urgency | I don’t have enough comparable urgency evidence for Capacity Gap and Margin Pressure to select one. You can ask me to compare them on another explicit criterion, such as risk exposure or evidence strength. | unchanged, no preferred focus |

`prolems` still uncorrected; comparison still bound.

## Explicit investigation control

`which should we investigate first?` used INVESTIGATION_PRIORITY. Live selected Margin Pressure on that criterion only (learning/reversibility), Stage stayed Problems. That is not overall importance. Default catalog has enough investigation-priority signal for a criterion-specific result; urgency remains insufficient.

Page errors: **0**. Stage was not PREPARING.
