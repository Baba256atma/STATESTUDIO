# DATA-UX:4 Identity and Update Proof

Date: 2026-08-31

## Contract

Identity is derived only from workspace + RDI `sourceContextId`.

Filename replacement (`delivery-july.csv` → `delivery-august.csv` with `mode: "replace"`) keeps:

- the same `sourceContextId`
- the same DATA_OBJECT id
- the same Stage participant id when still visible

Presentation (`label`, snapshot refs, understanding counts) updates from the new committed import.

## Automated proof

`nexoraDecisionTheatreDataObjectStageProjection.test.ts`:

- replacement keeps `second.id === first.id`
- Stage projection of the new object with the original visible id yields one participant whose label is the new filename
- store `importId` is the replacement import
- duplicate visible IDs collapse (`duplicateCount`)

## Stage membership

Re-showing after Remove from Stage uses the same logical id. No ghost participant is created because visibility is a list of canonical DATA_OBJECT ids, not a cloned Stage entity.
