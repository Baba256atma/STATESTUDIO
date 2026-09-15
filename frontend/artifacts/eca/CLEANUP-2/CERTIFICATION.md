# NPA-T CLEANUP-2 — CERTIFIED

## Mission

Repair only the two TypeScript errors that blocked CLEANUP-1 Level 4 certification. Prefer test/harness fixes. Do not redesign product behavior. Do not run full ECA:2 certification or CLEANUP-3.

## Reproduce (pre-repair)

Canonical check:

`NODE_OPTIONS=--max-old-space-size=8192 npm run typecheck`

### Error 1

- File: `app/lib/nexora-conversation/mra3RecertFix4B1Fix1NxaDecisionProjection.runtime.test.ts`
- Line: 75 (pre-repair)
- Code: `approval.executiveSituation.decision.subjectId`
- TS18049: `executiveSituation` is possibly `null` | `undefined`
- Canonical: `ConversationalExperienceResult.executiveSituation?: ExecutiveSituation | null`
- Classification: **A — stale test typing** (missing null narrowing before property access)

### Error 2

- File: `app/lib/nexora-conversation/mra3RecertFix4B2ExecutionProjection.runtime.test.ts`
- Line: 92 (pre-repair)
- Code: `authoritativeDecisions: result.decisionRuntime.adapter.listDecisions()`
- Expected (Theatre): `NexoraDecisionTheatreAuthoritativeDecision` with `scenarioId: string | null`, `committedBy: string | null`
- Actual: `NexoraExecutiveDecision` with optional `scenarioId?` / `committedBy?` (`undefined` allowed)
- Classification: **A/B — stale test/fixture typing** (missing null-normalization map already used elsewhere)

## Repair

### Error 1

Assert presence before access:

```ts
assert.ok(approval.executiveSituation);
assert.equal(approval.executiveSituation.decision.subjectId, decision.decisionId);
```

### Error 2

Map executive decisions into Theatre authoritative shape:

```ts
authoritativeDecisions: result.decisionRuntime.adapter.listDecisions().map((item) => ({
  decisionId: item.decisionId,
  title: item.title,
  status: item.status,
  scenarioId: item.scenarioId ?? null,
  committedBy: item.committedBy ?? null,
})),
```

## Validation

| Gate | Result |
|------|--------|
| TypeScript (`npm run typecheck`, max-old-space 8192) | **0 errors** |
| Affected MRA B1-FIX1 + B2 runtime tests | **7/7 PASS** |
| ECA:2 focused suite (`ecaExecutiveIntentActionPlan.test.ts`) | **22/22 PASS** |
| ECA:2 multi-turn | **4/4 PASS** |
| Unsafe type suppression (`any` / `@ts-ignore` / `@ts-expect-error`) | **NO** |
| Production files changed | **none** |
| New architecture | **NO** |
| New S0/S1 | **0** |
| Authority violations | **0** |

## CLEANUP-1 protections

Production behavior untouched in CLEANUP-2. Reuse CLEANUP-1 evidence:

- Previous L4 product failures: **5/5 PASS**
- NXA omnibus: **1612/1612 PASS**

## Remaining blocker (out of scope)

- L4 artifact trailing whitespace → **PRE-EXISTING / CLEANUP-3**

## Gate

**NPA-T CLEANUP-2 — CERTIFIED**

READY FOR NPA-T CLEANUP-3: **YES**

STOP. Do not start CLEANUP-3 automatically.
