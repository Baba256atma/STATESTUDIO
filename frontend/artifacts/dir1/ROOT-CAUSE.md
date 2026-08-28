# DIR:1 Root Cause

POST:3 resolved canonical collection membership and used it to compose Advisor text only. Its result was produced in `finalize`, after CC had already planned/applied Runtime navigation. Collection turns intentionally set `suppressNavigation`, so their authoritative members were discarded before Stage binding.

`show problems` could therefore retain or select a CC `primaryTargetId`; Stage's focus composition then hid all unrelated members. `show scenarios` and `show executions` commonly had no usable primary target and produced no Stage mutation. CC commands and focus application are single-target oriented, although the existing Queue/Stage authority already supports `collectionContext.objectIds` and deterministic collection layout. Menu clicks populate that context through `openNexoraMVPExecutiveQueueCollection`; conversation did not.

POST:3 exposes the required kind, scope, filter, references, and canonical result. DIR:1 now preserves its exact member IDs and applies one presentation plan after semantic resolution. Stage focus no longer overrides an explicit collection request.
