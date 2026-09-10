# MRA:3-FIX1 — Stage Lifecycle Evidence

Watch actors (Capacity Watch, Risk Watch, …) are Overview projection actors (`spatialRole: watch`). Problem members are business collection members. They must not occupy the same Advisor-visible set accidentally.

## Isolated journey (CC:5)

From `runtime-turns.json` J1-orientation:

1. Overview: visible Capacity Watch, Risk Watch.
2. `show me problems`: `shouldCommitRuntime` true; visible Capacity Gap, Margin Pressure; no watches.
3. `whats on stage`: “The Stage is currently showing 2 Problems: Capacity Gap, Margin Pressure.” Matches projection.
4. Overview reset in NAV: watches return; Problems are not listed as leftover collection members.

Unit: `MRA:3-FIX1 Overview collection Stage lifecycle stays internally consistent`.

## Agreement invariant

For collection SHOW: `snapshot.mode === "collection"`, visible members = POST:3/canonical collection ids, Advisor membership copy names those members.

For Overview: no leftover `spatialRole === "collection"` members; watches remain legitimate Overview actors.

Live `/executive` audit: `live-audit.json` (page errors 0). Queue row vs SHOW still depends on shell commit of `collectionContext`; Advisor read model follows `projectAuthoritativeStageContext` of the committed runtime.
