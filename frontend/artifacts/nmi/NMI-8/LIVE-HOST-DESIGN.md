# NPA-T NMI:8 — Live Host Design

Composer, not authority.

`hostNmiLiveManagementIntelligence` in `nmiLivePipeline.ts` reads:

1. `NexoraMVPObjectInteractionCatalog.contextSubjects` → NMI nodes
2. MO:1 registered Goal when its associated Problem is in the catalog
3. STAGE-PROD:1 Queue entries → NMI:5 Attention
4. focused/selected Stage ID → NMI:6/7 anchor

It composes NMI:1 `composeNmiUnifiedManagementModel`, then certified NMI:2–7 modules.

`NexoraExecutiveShell` holds the live result in `useMemo` and:

- passes `nmiAdvisorBundle` into `executeNexoraConversationalExperience`
- passes `nmiManagementMap` / overlay nodes into Stage / Queue overlay

No duplicate store. No canonical writers.
