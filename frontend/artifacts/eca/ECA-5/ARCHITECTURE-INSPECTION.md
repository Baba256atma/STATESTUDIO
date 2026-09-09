# NPA-T ECA:5 — Architecture Inspection

Date: 2026-09-07

## Stop condition

ECA:5 may be certified only when one read-only answer-interpretation and intake judgment binds a manager turn to the active ECA:4 information need (or correctly refuses to bind), distinguishes fact/estimate/opinion/hypothesis/instruction/unknown/refusal, preserves uncertainty and qualifiers, detects conflict without overwrite, never writes business/Stage/Data truth, hands off only to existing canonical authorities, passes focused A–T and sequences, passes seven live `/executive` proofs, and preserves ECA:1–4 plus NXA Level 4, TypeScript, ESLint, build, and `git diff --check`.

## Existing answer / confirmation / provenance authorities

| Concept | Existing authority | Reuse decision |
| --- | --- | --- |
| Working situation | ECA:1 | Required input. |
| Conversational next move | ECA:2 | Referenced; not replaced. |
| Initiative | ECA:3 | Not called by ECA:5. |
| Pending question / information need | ECA:4 session (`lastQuestion`, `lastFingerprint`, `lastNeedId`) | Primary binding target. |
| Speech-act classification | NCA-POST:2 `classifyManagerSpeechAct` | Reuse. Not a second NLU. |
| CSV semantic yes/no/unknown | DATA-UX/NCA `classifyCsvSemanticClarificationUtterance` + DATA-ADV writer | Confirmation binding only; ECA:5 does not write semantics. |
| Mutation Yes | ECA:1 `isEcaMutationConfirmation` + Risk handoff | Handoff flag only. |
| Correction of subject | NCA:2 `CORRECT` / FINAL:6.3 | Conversational context; no silent object rewrite. |
| I don’t know / skip | ECA:4 helpers | Same utterance detectors. |
| Manager observation | NCA-POST:2 `interpretManagerProvidedObservation` | Optional cue; ECA:5 does not promote to Data Reality. |
| Data truth | Data Reality | Compare for conflict; never overwrite. |
| Decision / Execution / Outcome | CC:10 / CC:11 / Decision Theatre | Handoff targets only. |
| Goal | MO:4 Goal context | Interpret Goal-related claims; do not write Goal. |

## Provenance model

Canonical provenance already lives on Data Reality, CSV semantics, Risk proposals, and ECA:1/4 diagnostics. ECA:5 **enriches** intake provenance (who, raw utterance, need fingerprint, estimate vs fact, reported source chain). It does not create `EcaEvidenceStore`.

## Writer boundaries (must remain)

ECA:5 has no Stage, Data, Risk, Goal, Decision, Execution, Outcome, or Learning writer. `HANDOFF_TO_EXISTING_WRITER` names an authority; the orchestrator’s existing legal paths remain the only writers.

## What ECA:5 uniquely adds

Trusted intake: bind answer → type → completeness → confidence → conflict/temporal-update → intake decision → need satisfaction (`SATISFIED` / `PARTIALLY_SATISFIED` / `UNRESOLVED` / `DEFERRED`). Interpretation is not canonical acceptance.

## Why this is not another NLU or Data Reality

NCA/FINAL:6.1 still own meaning. DATA-ADV still owns semantic confirmation and Data truth. ECA:5 consumes those signals plus the ECA:4 pending need and judges whether the answer may enter conversation, remain uncertain, or be offered to an existing writer.

## Dependency direction

ECA:1 → ECA:2 → ECA:3 → ECA:4 → **ECA:5**. ECA:5 does not call ECA:2, ECA:3, or ECA:4. After intake, later turns recompute ECA:1–4 through existing orchestration (acyclic).

## Repository precedence (not invented)

Do not hardcode “manager always wins” or “system always wins.” Conflict is preserved (`PRESERVE_CONFLICT`) until an existing confirmation/update authority accepts a change. Hypothetical/scenario assumptions route conceptually to existing scenario/what-if reasoning and never to Data Reality.
