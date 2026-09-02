# DATA-UX:5-FIX4 Multi-Pending Intake Contract

Date: 2026-09-01

Pending candidates remain in `csvRealDataImportStore`. No second registry.

## Identity

`candidateId = csvCanonicalSourceContextId(workspace, fileName)`  
= `csv:${workspace}:${normalized-filename}`

Same identity as a committed CSV of that filename.

## Intents

| Manager action | Behavior |
| --- | --- |
| + Add Data | `csvIntake: "new"`. Empty Choose CSV. Does not load any pending or committed source. |
| Click pending row | Resume that `candidateId`. |
| Click committed row | Committed FIX3 detail. |
| Update Source / Update existing source | `csvIntake: "update"`. Not a second library row. |
| Replace File | Mutates only the open candidate. |
| Cancel import | `discardCsvImportCandidate(workspace, candidateId)` only. |
| Use this data | `commitPreparedCsvRealDataImport` then delete that candidate only. |

## Duplicate filenames

- Second **pending** with the same normalized filename: refused. “A pending source with this filename already exists.”
- Add Data of a filename that is already **committed**: “{file} already exists. Update existing source?” Reuses the existing update lifecycle. Does not create a second canonical source.

## Counts

Visible CSV library = committed + new-source pending (not in-progress updates).  
Header: `CSV · n · Ready · committed · Pending · pending · Connected · m`.  
Pending is not Data Reality.

## Durability

Close/reopen Data: all pending remain (in-memory). Page refresh: not supported. No localStorage.
