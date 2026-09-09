# NPA-T ECA:3 — Architecture Inspection

Date: 2026-09-07

## Stop condition

ECA:3 may be certified only when one read-only executive initiative judgment consumes certified ECA:1 context, the certified ECA:2 action plan, and existing NCA:5 / NXA:4 / MO:6 initiative primitives; chooses silence or one bounded intervention; never mutates business/Stage state; passes focused A–T and the five multi-turn sequences; passes the seven live `/executive` proofs; and preserves ECA:1/ECA:2 plus NXA Level 4, TypeScript, ESLint, build, and `git diff --check`.

## Existing authorities inspected

| Concept | Existing authority | Reuse decision |
| --- | --- | --- |
| Working situation | ECA:1 `ecaWorkingConversationContext.ts` | Required input. ECA:3 does not resolve references. |
| Conversational next move | ECA:2 `planEcaExecutiveConversationAction` | Referenced when intervening. ECA:3 does not re-plan. Dependency: ECA:1 → ECA:2 → ECA:3 (no cycle). |
| Suggested turns | ECA:2 `suggestedManagerTurns` | Reuse. No second chip/button system. |
| Conversational initiative capability | NCA:5 `evaluateNca5InitiativeStrategy` | Owns “can Nexora take a conversational initiative?” Signals, priority, interruption vs manager turn, dismiss/suppress keys on NCA:2. ECA:3 does not recreate this engine. |
| Initiative entry policy | NXA:4 `evaluateNxa4ProactiveAdvisory` | SPEAK / DEFER / SUPPRESS / ESCALATE over NCA:5 + MO:6 + NXA:3. Consumed as an input, not replaced. |
| Attention vs intervention | MO:6 attention intelligence | Candidate source only. |
| Executive situation | NXA:3 | Goal/focus/change context. |
| Comparison judgment | NXA:5 | Not an initiative engine. Leave it. |
| Advisory reasoning | NCA:4 | Candidate/advisory source only. |
| Stage / Director | NXA:5-FIX4 Stage read model, DIR | Read visibility. No Stage write. |
| Data | ECA:1 `activeDataSource` / DATA-ADV | Unconfirmed semantics cannot produce WARN. |
| Decision / Execution / Outcome | CC:10, CC:11, Theatre intelligence | Named as review targets only. |
| Dismissal session state | NCA:2 `dismissedInitiativeKeys`, `suppressedInitiativeKeys`, `lastInitiativeSnapshot` | Canonical session memory. No new durable store. |
| BUS-21 Strategic Initiative platform | Frozen business-initiative metadata | Different concept. Not reused as Advisor initiative. |

## What NCA:5 already owns

NCA:5 is the conversation-level initiative capability: candidate collection from caller signals, MO:6, NCA:4, and utterance observations; scoring; one winner; manager-turn precedence; SILENT behavior; and session fingerprints for repeat suppression.

## What is genuinely missing

NCA:5/NXA:4 do not consume certified ECA:1 working context or the ECA:2 action plan as the executive NOW→NEXT situation. They therefore cannot answer, as an ECA layer: given this manager’s current request, this working context, this planned next conversational action, and this evidence/lifecycle state, is proactive interruption justified — and if not, why.

Classification: missing executive judgment projection over existing initiative primitives, not an NCA:5 defect and not a missing writer.

## Chosen ECA:3 boundary

Add a pure, deterministic, read-only `EcaExecutiveInitiativeJudgment` next to ECA:2 under `nexora-conversation`. It evaluates supplied/normalized candidates (including a mapped NCA:5 winner when present) against ECA:1/ECA:2, significance, urgency (kept separate), evidence confidence, Stage visibility, and NCA:2 suppression keys. Output: `shouldIntervene`, reason, strength, suppression reason, ECA:2 plan reference, provenance, and frozen no-write boundaries.

## Why this is not a second initiative engine

Candidate generation and conversational initiative capability remain NCA:5. Entry policy remains NXA:4. Attention remains MO:6. ECA:3 only judges whether speaking now helps the executive conversation.

## Dependency direction

ECA:1 (NOW) → ECA:2 (NEXT plan) → ECA:3 (whether to speak). ECA:3 references the ECA:2 plan identity and `nextAction`; it does not call the planner.

## Writer / Stage / Data boundaries

`shouldIntervene` is not an action. ECA:3 has no Risk, Decision, Execution, Outcome, Learning, or Stage writer. Unconfirmed CAP_AV/LIKELY semantics cannot become an authoritative capacity warning.

## Speech vs judgment

ECA:3 does not overlay a second Advisor message. Conversational speech remains NCA:5 / NXA:4 / existing Advisor composition. The judgment is attached to the experience result and shell diagnostics (`data-eca-3-*`) so silence vs intervention is inspectable without competing copy.
