# BCA:3 relationship registry

Frozen `BUSINESS_PROJECT_RELATIONSHIP_REGISTRY` in `businessProjectRelationshipRegistry.ts`.

Exact canonical BCA:2 names only. No substring matching. No CAUSES entries. No default DEPENDS_ON pairs (Procurement–Budget is RELEVANT_TO).

Capacity→Throughput uses `POTENTIALLY_CONSTRAINS`, not a current-state constraint.

Capacity–Resource Availability is HYBRID-only and may cross sources only when BCA:1 context is HYBRID.

Extending the registry does not require a resolver branch.
