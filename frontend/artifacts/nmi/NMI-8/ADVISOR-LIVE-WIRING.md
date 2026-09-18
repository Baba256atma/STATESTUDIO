# NPA-T NMI:8 — Advisor Live Wiring

`NexoraExecutiveShell` passes `nmiAdvisorBundle: nmiLiveRef.current.advisorBundle` into `executeNexoraConversationalExperience`.

No manual test-only injection is required in the real host.

CC:5 remains conversational authority. NMI:7 overlay still applies after VAI when the utterance matches NMI intents.
