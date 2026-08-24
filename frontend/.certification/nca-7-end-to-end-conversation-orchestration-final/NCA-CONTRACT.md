# NCA:7 — End-to-End Conversation Orchestration Contract

Identity: `NCA:7/EndToEndConversationOrchestrationFinalCertification`  
Version: `1.0.0`  
Namespace: `nexora.nca.end-to-end-conversation-orchestration-final-certification`

NCA:7 is the final NCA architecture phase. It does not create a seventh conversation engine. It inspects, integrates, orchestrates, resolves collisions, and certifies that NCA:1–6 produce one manager-facing Nexora.

## Logical stack

Manager turn → NCA:1 Understand → NCA:2 Dialogue state → NCA:3 Ask if needed → NCA:4 Advise if justified → NCA:5 Speak or remain silent → NCA:6 Adapt presentation → existing Nexora authorities → one response.

These are logical responsibilities, not six sequential writers. `composeNca7TurnResult` records the turn contract after NCA:6 has already composed the presented text.

## One-turn contract

`NexoraConversationTurnResult` records interpretation, dialogue, sufficiency, advisory, initiative, communication, authority owner, manager-facing text, and mutation effects. It reuses NCA:1–6 and CC/MO/EXP outputs. It does not duplicate business stores.

## One-response principle

Layers compose. They do not concatenate. NCA:3 ask blocks NCA:4 advice. NCA:4 does not hijack EXPLAIN. Moderate NCA:5 does not overlay a manager request. NCA:6 never changes meaning.

## Diagnostic trace

`diagnosticTrace` is certification evidence only. It is not shown in the manager UI.
