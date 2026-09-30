# SIM-TEST:5-FIX3 — root cause

## Family A — Stale 6.3 pending + TYPE_AMBIGUITY (T26–T28, T12–T16 streak)

- Symptom: three consecutive `clarification-required` turns; Observer REPEATED_CLARIFICATION.
- First divergence: 6.3 asked “problem or KPI?” for Outcome questions while Delivery was current; pending then swallowed counterfactuals / what-about / go-back.
- Earliest owner: FINAL:6.3 gate + pending completion (`nexoraMvpFinal63ClarificationGate.ts`, `nexoraMvpFinal63ClarificationResolver.ts`).
- Why safety failed: TYPE_AMBIGUITY ignored established subject; FOCUS+pending treated all non-show FOCUS as answers to the old question; `what about` did not abandon pending.
- Repair: skip TYPE_AMBIGUITY when continuity already has a subject/thread; abandon pending on unmatched `what about` and re-evaluate the gate; named FOCUS to a different id completes the old pending.

## Family B — Named return “delivery issue” vs Object Delivery (T14/T16)

- Symptom: “Go back to the delivery issue” → empty “Which one do you want me to show?”
- First divergence: 6.2 previous-referent required a historical pool hit; after Decision became current, Delivery was not in the pool. `issue` expectedKind is problem, Delivery is object.
- Earliest owner: FINAL:6.2 (`conversationContinuityResolver.ts`) catalog fallback for unique name tokens. Canonical catalog, not a new registry.
- Repair: if historical unique match fails, unique catalog name match (problem wording may match object). Supplier/Resource/Schedule still unmatched → UNRESOLVED / 4-FIX1.

## Family C — Execute request never reached CC:11 (project T11)

- Symptom: “Put the decision into action.” → “Do you mean Delivery?”
- First divergence: `resolveNexoraExecutionFollowUpRequest` did not classify the utterance; 6.3 early-returned before CC:11.
- Earliest owner: CC:11 request matcher + CC:5 skip of 6.3 when start-handoff + Approved Decision + deictic/context or already-active Execution.
- Why not CC:11 writer: CC:11 already starts exactly one Execution for an Approved Decision. It never received the turn.
- Repair: existing CC:11 vocabulary extended with put-decision-into-action / execute; CC:5 `clarificationOwnedByExecutionHandoff`. Named `Start the supplier recovery plan` still requires context unless Execution is already active.

## Family D — Observer already-active Execution (T31)

- Production after C: already-active text is legitimate; Decision/Execution counts stay 1.
- Observer counted `clarificationRequired` streaks including that ack.
- Repair: Observer does not increment repeated-clarification when response acknowledges in-progress Execution.

CC:10, Advisor, NMI, MLEVEL, Stage, Operator/Data, Outcome/Learning: unchanged as owners.
