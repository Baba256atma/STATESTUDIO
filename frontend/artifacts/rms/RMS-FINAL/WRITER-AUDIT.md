# Writer audit

| Store | Writer |
| --- | --- |
| Ground Truth | Operator via RMS:2 apply/pause; RMS:6 schedule step; RMS:10 modeled actions through Operator current-tick apply |
| Observable Data | Operator observation |
| Data Reality | Operator publication through RDI handoff |
| Manager authority | RMS:9 atomic handoff |
| Conversation | CC:5 only |
| Stage | CC:5 runtime state |
| Decision / Execution | CC:10 / CC:11 only; RMS auto-approve/start are false |
| Experiment branches | RMS:10 clone + branch-local session |

WATCH does not write CC:5 or republish. Observer writeAttempted is false. No RMS Learning/Outcome writers exist.
