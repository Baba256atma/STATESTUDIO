# DATA-UX:2 Data Rail Contract

## State and actions

- Open/closed state is the existing shell Explorer state (`activeNav === "Data"`), not a new store.
- The Stage Data control invokes the same shell toggle used by left navigation.
- Open, close, and Escape do not call Stage selection, overview, journey, Goal, Problem, Evidence, Scenario, Decision, or execution actions.
- Source selection is local presentation selection only.
- Import and activation use existing supported callbacks and canonical stores.

## Source projection

`projectCsvDataRailSource` accepts a canonical committed CSV, existing source intelligence, and active flag. It exposes a frozen presentation containing:

- canonical source ID;
- stable DATA-UX:1 Data Object ID;
- authoritative file label and CSV type;
- manager-facing status derived from canonical executive source state;
- update label derived from canonical `committedAt`;
- active usage;
- Data Object validation and understanding diagnostics.

It contains no confidence percentage, inferred relationship, causal claim, or Evidence claim.

## Empty and multiple-source behavior

- With no CSV commits, the Rail says `No CSV sources yet` even when a real connected source exists.
- Every CSV commit is listed independently; no merge relationship is implied.
- Source and Data Object identities remain workspace-qualified and stable.

## Update/remove boundary

- `Update source` reuses the existing import flow and store replace mode.
- A differently named file is refused with guidance to use Add Data, preventing an update action from creating unrelated source truth.
- Existing active-source removal refusal is preserved.
- Final dependency-aware removal is deferred to DATA-UX:5.

## Diagnostics

The shell and Rail expose separate data attributes for Rail open state, selected source ID, selected DATA_OBJECT ID, source state, active state, validation/understanding state, and import action (`new` or `replace`). These identifiers are not rendered as manager copy.

