# State mutation audit — NCA:7

| Layer | May mutate | Must not mutate |
| --- | --- | --- |
| NCA:1 | nothing authoritative | Goal, Decision, Execution, Outcome, RDI |
| NCA:2 | session conversation state only | business truth |
| NCA:3 | pending question / sufficiency strategy | Decision, Execution, RDI |
| NCA:4 | last advisory snapshot | Decision, Execution |
| NCA:5 | last initiative snapshot, dismissal keys | Decision, Execution, RDI |
| NCA:6 | last communication snapshot | facts, recommendation, confidence, Decision, Execution |
| NCA:7 | diagnostic turn record only | all authoritative stores |

Conversation state owned by NCA:2/session: active topic, active subject, threads, pending question, last advisory snapshot, last initiative snapshot, last communication snapshot. These are conversational references, not duplicate business stores.

Goal writes, Decision writes, Execution writes, Outcome writes, and RDI writes remain with their canonical authorities.
