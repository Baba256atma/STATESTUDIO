# NPA-T NMI:FINAL — Architecture

Date: 2026-09-18.

Nexora Management Intelligence (NMI) is a read-oriented composition pipeline. It understands and projects the manager’s Business/Project management structure, relationships, Attention context, and decision journey using existing canonical Nexora authorities.

It is not Object, Data Reality, Gate, causal, Scenario, Decision, Execution, Outcome/Learning, Queue, Stage/Director, Advisor, or simulation authority.

## Composition point

`/executive` `NexoraExecutiveShell` calls `hostNmiLiveManagementIntelligence` with the live catalog, STAGE-PROD:1 Queue entries, and the current focused subject. The host is a composer, not a store.

## Pipeline

Canonical Business/Project state  
→ NMI:1 UnifiedManagementModel  
→ NMI:2 Management Map  
→ NMI:3 Relationship Intelligence  
→ NMI:4 Decision Roadmap  
→ NMI:5 Navigation + Attention  
→ NMI:6 Stage Context Projection  
→ NMI:7 Advisor Integration  
→ NMI:8 Live `/executive` host (existing UI / Stage / Advisor)

There is no NMI:9. DTH-EXP was not started.

## Identity

NMI owns unified management-model contracts, relationship vocabulary, read-model composition, and composition provenance. Canonical IDs remain the IDs of their owning authorities.
