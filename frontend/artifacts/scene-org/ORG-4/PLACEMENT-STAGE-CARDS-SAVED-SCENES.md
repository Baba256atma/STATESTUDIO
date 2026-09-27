# NPA-T ORG:4 — Workspace Placement & Stage Card Rules

## Stop condition

The certified ORG:2 regions expose explicit placement responsibilities; normal authority-admitted cards use a 0–3 presentation cap without re-ranking; Theatre compositions remain intact; Saved Scenes contain references and view preferences only and resolve live content on reopen.

## Placement

| Surface | Region | Rule |
| --- | --- | --- |
| NMI / management navigation | Left Management | Existing projection/navigation only. |
| Attention | Left Management | Existing Queue/Attention truth; no rebuilt membership. |
| Active management scene | Center Stage | Existing NEX-MVP/STAGE-PROD host. |
| Advisor/context | Right Context | Existing contextual surface. |
| Raw CSV, provenance, mappings, connections/configuration | Detail Workspace | Never permanent Left navigation or Stage content. |

The existing `Data` navigation item remains a capability entry point, not a permanent raw-file list or data authority.

## Stage cards and Theatre exception

For `NORMAL_MANAGEMENT_CARDS`, the presentation projector shows the first 0–3 references in the order already supplied by DIR/DTH/Stage and marks overflow deferred. It does not score, rank, or admit content.

For `THEATRE_COMPOSITION`, every authority-admitted participant remains visible. Comparison, flow, bubble, time/timeline, causal, execution, outcome, and other DTH/DTH-EXP compositions are not card-counted or truncated.

## My Scenes

Kinds: `TEMPORARY`, `SAVED`, `DEFAULT_MANAGER`.

A Saved Scene contains its identity/name, scene intent type, canonical references, layout preferences, and region visibility preferences. It contains no Object state, KPI values, evidence, CSV contents, Decision/Execution state, Data Reality, or NMI state. No persistence store or natural-language routing is introduced.

Reopen calls a canonical resolver for every reference, so current live content—not a saved business snapshot—is returned.

## Deferred

ORG:5 Right Context synchronization, ORG:6 Detail Workspace implementation, ORG:7 activity/history and Save/Open natural-language commands, and ORG:8 responsive/full integration remain untouched.

## Verification

- Focused ORG:4 tests: 9 passed, 0 failed, 0 skipped.
- ORG:2–4 contract regression: 21 passed, 0 failed, 0 skipped.
- Affected shell/Stage owning regression: 65 passed, 0 failed, 0 skipped.
- Repository TypeScript check: passed. This broader check was required because the NMI relocation removed obsolete props from the shared Stage component boundary.
- Targeted ESLint: 0 errors; 12 pre-existing shell warnings remain outside ORG:4.
- Focused live `/executive` check: NMI/Attention is contained by Left Management and not Center Stage; Stage remains in Center; four region markers remain; no horizontal overflow or browser warnings/errors.
- `git diff --check`: passed.

## Verdict

CERTIFIED — workspace placement, Stage presentation rules, and Saved Scene references reuse existing Nexora authorities
