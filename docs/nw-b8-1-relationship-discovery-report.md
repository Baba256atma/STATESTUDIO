# NW-B:8-1 Relationship Discovery Report

Required tags:

[NWB81_RELATIONSHIP_DISCOVERY]
[WORKSPACE_RELATIONSHIPS_CREATED]
[RELATIONSHIP_INTELLIGENCE_FOUNDATION]
[NW_B8_COMPLETE]

## Summary

NW-B:8-1 generates the first deterministic relationship layer between approved workspace objects using domain, situation, goals, and approved object context. Relationships are stored in a workspace-scoped contract, merged into scene JSON for line rendering, surfaced in the MRP discovery strip, and explainable by the assistant.

## Implementation

- Added `workspaceRelationshipDiscoveryContract.ts` with workspace relationship storage, idempotent generation, and scene JSON merge.
- Added `workspaceRelationshipDiscoveryRules.ts` with rule-based pairing templates for finance, manufacturing, supply chain, project management, operations, sales, HR, and technology domains.
- Added `workspaceRelationshipAssistantRuntime.ts` for local assistant explanations.
- Wired HomeScreen auto-discovery after scene creation and MRP object/relationship counts.

## Relationship Contract

Each discovered relationship includes:

- `relationshipId`
- `sourceObjectId`
- `targetObjectId`
- `relationshipType` (`influences`, `depends_on`, `supports`, `constrains`, `feeds`)
- `confidence`
- `reason`

## Example

Finance workspace:

- Revenue → Cash Flow (`influences`)
- Expenses → Cash Flow (`influences`)
- Forecast → Revenue (`feeds`)

Assistant example:

> Revenue influences Cash Flow because incoming revenue contributes directly to available operating cash.

## Diagnostics

Development diagnostics added:

- `[RelationshipDiscovery] Relationships Generated`
- `[RelationshipDiscovery] Relationship Added`
- `[RelationshipDiscovery] Relationship Removed`

## Verification

```bash
cd frontend
node --test app/lib/workspace/workspaceRelationshipDiscoveryContract.test.ts
npm run build
```

## Acceptance Status

PASS:

- Relationships generated from approved workspace objects.
- Relationship contract created and workspace-isolated.
- Scene relationship lines rendered through existing `RelationshipRenderer`.
- MRP shows object and relationship counts.
- Assistant can explain discovered relationships locally.
- No KPI, risk, or scenario generation added.
- Build passes.
