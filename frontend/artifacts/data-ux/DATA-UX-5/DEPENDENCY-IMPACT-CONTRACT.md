# DATA-UX:5 Dependency Impact Contract

Deterministic. Not LLM-owned.

Dependencies = Executive Source Intelligence `affectedObjects` for the committed source, compared with other committed peers in the same workspace.

Classes:

- `NO_EXECUTIVE_IMPACT` — no affected objects, or source is not active so current dataset is unchanged
- `SHARED_SUPPORT_REMAINS` — inactive source; peers still map the same objects
- `DEPENDENT_DATA_BECOMES_UNAVAILABLE` — this source is active; shell will stop using its dataset

Historical provenance is always retained as a non-supplying reference.

No visual proximity. No filename inference. No Decision/Execution/Outcome mutation.
