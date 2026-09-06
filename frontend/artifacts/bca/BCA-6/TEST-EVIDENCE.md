# BCA:6 test evidence

Command: `node --import tsx --test app/lib/business-context-awareness/*.test.ts`

Combined BCA **94/94**. Zero skipped.

| Case | Result |
| --- | --- |
| A Role | ROLE_AMBIGUITY; Operations not auto-chosen |
| B Irrelevant role | roleClarificationNeeded false; can proceed |
| C Hybrid capacity | HYBRID_SCOPE_AMBIGUITY; current vs project candidates |
| D/R No repeat | confirmed scope suppressed |
| E Process | PROCESS_PLACEMENT_AMBIGUITY; no substring guess |
| F Meaning-only | no process question |
| G Correction | existing writer; no BCA write in source |
| H I don’t know | DECLINED; no loop |
| I Org backlog | confirmed placement used; general process still present |
| J Role ≠ permission | BCA:5 flags false; BCA:6 permissionsInferred false |
| K Meaning ≠ reality | currentReality NOT_ESTABLISHED |
| L Relationship ≠ cause | no CAUSES; no causal question |
| M Temporal | TEMPORAL_AMBIGUITY |
| N/O Isolation | source and project do not leak |
| P Perspective | two stable roles; currentRolePerspective PROJECT |
| Q One question | capacity outranks role and process |
| S/T/U | Decision/Execution/Stage/Theatre flags false |
| V Determinism | identical JSON rebuild; frozen |

Semantic/CSV confirmation writer remains covered by existing `csvSemanticUnderstanding` / `csvSemanticClarificationHandoff` / `nexoraNcaCsvSemanticClarification` tests: **25/25**.

## Funnel / TypeScript / lint / build / smoke / diff

- Funnel Levels 1–3 passed (`failed: 0`).
- Funnel Level 4 passed: 7/7 required, 0 failed/skipped/running/uninspected.
- Targeted ESLint: `app/lib/business-context-awareness/**/*.ts` exit 0.
- TypeScript, production build, and executive smoke passed inside Level 4.
- `git diff --check` on BCA:6 paths: clean.
