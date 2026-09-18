# NPA-T NMI:8 — Real Manager Journeys

## Journey A — Problem

Open `/executive` → NMI overlay → Attention or Problems & Risks → Capacity Gap.

Explain it / Where is this in my business? / What is related to it? / Why is this in Attention? / Where are we with this problem? / What is missing?

Result: subject remains Capacity Gap (`ctx-problem-capacity`) on NMI overlay.

## Journey B — Named switch

Explain Margin Pressure → What is related to it?

Result: `ctx-problem-margin`. Capacity Gap does not leak.

## Journey C — Scenario / Decision

NCA may retarget utterances that contain the words “problem” or “decision”. NMI itself, given `ctx-scenario-demand`, reports RELATED/ROADMAP without promoting Scenario to Decision. After NCA selects a Decision, “Is this being executed?” reports Execution status without promotion to Outcome.

## Journey D — Evidence / Causality

Does Capacity cause the delivery problem? → not a confirmed cause.

What evidence do we have? → provenance/unresolved/canonical refs only.

## Journey E — Partial knowledge

Catalog with Goal + Problem, no Decision/KPI: map still renders; roadmap MISSING / UNRESOLVED / NOT_REACHED remain distinct.
