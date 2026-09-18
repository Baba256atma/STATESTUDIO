# NPA-T RMS:8 — Architecture Inspection

Inspection date: 2026-09-17.

Stop: WATCH experience only. Do not start RMS:9.

Inspected RMS:1–7, Scenario Registry/`runRmsScenario`, RMS:4 Manager-visible turns, RMS:5 Observer (private), RMS:6 event traces (hidden), CC:5 `executeNexoraConversationalExperience`, Nexora Stage/Director/Advisor via CC:5 runtime state, `/executive` Executive Shell, Data Reality/RDI handoff.

WATCH reuses one Scenario run and projects manager-visible conversation + Stage subject/workspace references. It does not mount a second Stage/Advisor engine. D7 remains a separate operational graph.
