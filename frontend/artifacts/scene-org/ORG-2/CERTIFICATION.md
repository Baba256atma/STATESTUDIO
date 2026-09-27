# NPA-T ORG:2 — Scene Architecture & Existing Authority Integration

Status: **CERTIFIED**

## Stop condition

One typed four-region production contract; identity-only cross-region handoffs; existing Stage, Advisor, NMI, Queue, Director, Theatre, Object, Data Reality, CSV, Decision, Execution, and manager-workflow authorities preserved; no ORG:3+ behavior.

## Result

`NPA-T ORG:2/SceneArchitectureExistingAuthorityIntegration` defines:

1. Left Management Region — projection/navigation only.
2. Center Stage — existing Stage authority remains primary.
3. Right Context Region — existing Advisor/context consumer.
4. Detail Workspace — identity-only reservation for ORG:6.

Production `/executive` exposes all four boundaries while retaining the existing shell components and runtime callbacks. The wrappers use `display: contents`; ORG:2 makes no visual placement or density change.

## Proof

- Contract/matrix duplicate-authority flags are all `false`.
- Detail reference contains only `canonicalId`, `kind`, and `owner`.
- Live `/executive` exposed exactly four region markers, all `ownsTruth=false`; the Detail marker was reservation-only and hidden.
- Existing Stage and Advisor remained rendered; live browser logs contained zero warnings/errors.
- `Show scenarios` continued through CC:5 to the existing runtime and Stage presentation.
- Production page/cockpit/shell path does not import `ExecutiveRuntimeProvider`, `ExecutiveModeSelector`, or `createExecutiveRuntimeStore`.

## Verification

- ORG:2 focused/owning regression: 46 passed, 0 failed, 0 skipped.
- Required NXA Level 1 funnel: passed; 1/1 required tasks passed with no running or uninspected work.
- Repository TypeScript check: passed.
- Production Next.js build: passed with an 8 GB Node heap allowance; the default 4 GB heap was insufficient for repository-wide TypeScript analysis.
- Targeted ESLint: 0 errors. The production shell retains 12 pre-existing warnings (11 dormant ECA imports and one existing hook-dependency warning); the new ORG:2 files have no lint findings.

## Deferred

- ORG:3 hierarchy/visibility.
- ORG:4 final placement, NMI/Attention positioning, card rules, saved views.
- ORG:5 Right Context synchronization/behavior.
- ORG:6 visible Detail Workspace UX.
- ORG:7 activity/history and broader natural-language control.
- ORG:8 focus/density/responsive/full runtime integration.

No later phase was started.
