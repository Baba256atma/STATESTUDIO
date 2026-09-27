# NPA-T ORG:3 — Information Hierarchy & Visibility

## Stop condition

One immutable four-level presentation contract maps the certified ORG:2 regions, preserves canonical identity/state, consumes existing relevance decisions, and introduces no ORG:4+ behavior.

## Visibility levels

| Level | Treatment | Meaning |
| --- | --- | --- |
| `PRIMARY` | visible-dominant | Current authority-selected management focus and essential Stage content. |
| `SUPPORTING` | visible-subordinate | Context that explains the focus without competing with it. |
| `DEFERRED` | collapsed-until-requested | Useful context retained by canonical identity but hidden until requested. |
| `DEEP_DETAIL` | detail-workspace-only | CSV, mappings, provenance, connections, and configuration. |

These are presentation classifications. They do not alter Object, Data, Decision, Execution, Queue, or workflow state.

## Region mapping

| Region | Default | Permitted treatment |
| --- | --- | --- |
| Left Management | `SUPPORTING` | `PRIMARY` Attention when already selected by its authority; otherwise supporting/deferred navigation and orientation. Never deep detail. |
| Center Stage | `PRIMARY` | Primary management situation plus only authority-selected supporting/deferred actors. Never deep detail. |
| Right Context | `SUPPORTING` | Supporting Advisor/context and deferred expansion. |
| Detail Workspace | `DEEP_DETAIL` | Deep operational and technical work only. |

## Authority boundary

DIR:1, DTH/DTH-EXP, NMI, Queue/Attention, Stage, Advisor, RDI/Data Reality, and the existing CSV lifecycle continue deciding relevance, admission, and canonical state. ORG:3 only maps an already-selected classification to display treatment. It has no score, rank, priority calculation, registry, store, runtime, or mutation path.

## Deferred

ORG:4 placement/card/saved-scene work, ORG:5 Right Context synchronization, ORG:6 Detail Workspace UX, ORG:7 history/control, and ORG:8 responsive/full integration remain untouched.

## Verification

- Focused ORG:3 tests: 6 passed, 0 failed, 0 skipped.
- Owning ORG:2 seam regression: 6 passed, 0 failed, 0 skipped.
- Targeted ESLint: 0 errors and 0 warnings.
- `git diff --check`: passed.
- No broad funnel, repository-wide typecheck, production build, or browser journey was run; the change is an additive local presentation contract and the mission explicitly reserves those checks for shared production-contract changes.

## Verdict

CERTIFIED — information hierarchy and visibility reuse existing Nexora authorities without creating new prioritization or truth
