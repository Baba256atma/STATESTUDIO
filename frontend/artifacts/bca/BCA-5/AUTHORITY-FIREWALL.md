# BCA:5 authority firewall

BCA:5 is advisory manager-context intelligence. It is not RBAC, authentication, approval workflow, or CC:10R.

## Always true on the projection

- `permissionsKnown: false`
- `decisionAuthorityKnown: false`
- `permissions: null`
- `decisionAuthorities: null`
- `roleBasedAuthorityInferenceRejected: true`
- `recommendationGenerated: false`
- `mostImportantClaimed: false`
- `expertise: UNKNOWN` unless a future existing expertise authority is plumbed (not inferred from title)

## Rejected inferences (always recorded)

- role does not establish permission
- role does not establish decision authority
- role relevance is not importance
- role relevance is not a recommendation
- interest does not establish role
- session interest does not mutate durable role
- decision context is not a Nexora Decision

Additional: conversation interest does not establish a finance role when the stable family is UNKNOWN.

## Must not be derived from role

CFO → approve financial Decisions. CEO → unrestricted authority. Project Manager → commit project Decisions. Operations Manager → start Execution.

If an existing CC:10R/permission layer later supplies facts, BCA may *reference* them read-only. It must not invent them from `roleFamily`.
