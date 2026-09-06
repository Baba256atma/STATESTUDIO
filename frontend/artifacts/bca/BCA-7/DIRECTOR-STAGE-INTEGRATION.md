# BCA:7 Director / Stage integration

Director remains the Stage projection authority.

BCA:7 `directorContext` is hint-only:

- relevant concept / process ids
- optional clarification subject id

It never:

- adds Objects (`stageContext.objectsAdded` is always empty)
- changes focus (`focusMutatedTo: null`)
- changes Problem/Scenario/Decision/Execution collections

Role relevance ≠ Stage membership. Role relevance ≠ Stage focus.

If Director later consumes these hints, it must still obey existing membership and click-focus authority.
