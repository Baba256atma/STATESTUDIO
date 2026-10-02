# SIM-TEST:10-R1 findings

Measurement only. No production repair.

## Central result

Population: Decisions = 0, Executions = 0, CORE-OUT captures = 0, NPS established Outcomes = 0, durable Learning = 0.

OUT-LIVE:1 capture still works when Execution is established outside this utterance path.

## First missing boundary

`Go with B.` → clarification (“Capacity Gap or Capacity?”) / confirmation, then `Start it.` → “Which approved Decision do you want to start?”

Owner: CC:5 / CC:10. Not CORE-OUT:1/1A/2. Not NPS writer.

## Safety that held

- Ground Truth leaks = 0
- Premature success claims = 0
- NPS writesOutcome = false
- Invented durable Learning = 0
- Wrong-thread Capacity Execution on FIX1 blocker = 0
- Production digest unchanged

## Detector note

ASK_CAUSE reply that **rejects** causal proof triggered the “caused” regex. Observer/test false positive.

## Not repaired

- Decision commitment / Execution start
- CORE-OUT evaluation at population scale (not reached)
- CORE-OUT:2 Learning at population scale (not reached)
- Full FIX1/FIX2/8-FIX1 file failures (same-root current subject)
