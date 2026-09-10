# MRA:3-FIX1 — Root Cause Analysis

Date: 2026-09-10

MRA:3 remained NOT CERTIFIED. This repair traces the blocking S1s to shared ownership mistakes, not four unrelated bugs.

## Shared architecture

Manager speech is resolved through one chain:

utterance → CC:1 intent → 6.2 continuity referent → NCA:2 dialogue subject → POST:3 collection members → Manager-Object activation → fixture explanation.

Failures appeared when a later layer (Stage leftover focus, last collection member, NLU `objectReference` on `it`) outranked the layer that had already committed the manager’s referent.

## MRA-3-002 / C1 `explain it` after first Problem

| Field | Value |
| --- | --- |
| Failure | After `go back to the first problem` (spoken Capacity Gap), `explain it` explained Margin Pressure |
| First divergent layer | NCA:2 ordinal did not bind when `lastCollection` used `Current Problems:` colon form only; `Current Problems are …` was ignored. Return-to-topic then restored Margin. MO `explain it` used leftover collection/Stage subject. |
| Related | Continuity treated leftover NLU names as EXPLICIT on pronouns; MO treated `it` as named when overlay copied Margin into `targetHints`. |

## MRA-3-003 / C1 second Scenario

| Field | Value |
| --- | --- |
| Failure | `explain the second one` after compare spoke the first Stage-visible Scenario |
| First divergent layer | ECA ordinal pool preferred Stage unique-visible / leftover explicit over POST:3 `lastCollection.memberIds` |

## MRA-3-004 / mutation

| Field | Value |
| --- | --- |
| Failure | `yes` after topic change committed unnamed ADD Risk |
| First divergent layer | `forget that for now` was not cancellation; SHOW did not drop `pendingEcaProposal`; deictic ADD used type name “Risk” |

## MRA-3-005 / 006 / 007 leaks

| Field | Value |
| --- | --- |
| Failure | `ECA:10`, `cc9:scenario:…`, `INSUFFICIENT_REALITY` in manager copy |
| First divergent layer | ECA notes appended after NCA:6; attention `label` and clarification option ids spoken raw; leak regex treated WATCH as internal (also mangled Capacity Watch) |

## Overview / Stage watches after Problems SHOW

| Field | Value |
| --- | --- |
| Failure | `stageMode` overview with Capacity Watch / Customer Watch still presented after Problems SHOW |
| First divergent layer | FIX4 `projectAuthoritativeStageContext` mixed `spatialRole: watch` with collection members |

Watch actors are valid Overview projection actors. They are not business collection members. After SHOW, they were stale Overview actors surviving in the same visible set.

## MRA-3-008 Stage click vs `explain it`

| Field | Value |
| --- | --- |
| Failure | Synthetic click Margin Pressure; Advisor still explained Capacity Gap |
| First divergent layer | Pronoun MO activation preferred conversation/NCA over incoming Stage focus when the previous turn had named Capacity Gap (`hasNamedHint` leftover) |

## MRA-3-001 (not closed)

`look at capcity` still focuses the Capacity KPI. Prefix/typo recovery is still KPI-first. Classified remaining C1 name-match, not the pronoun/ordinal cluster above.

## Playwright Overview control

See `PLAYWRIGHT-CLASSIFICATION.md`. Not the same defect as Stage actor lifecycle.
