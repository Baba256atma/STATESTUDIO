# NPA-T DTH-EXP:3A — Scene Recipe System

**Status: CERTIFIED**

Date: 2026-09-18.

Stop. Do not start DTH-EXP:3B.

## Status

**NPA-T DTH-EXP:3A — CERTIFIED**

## Architecture inspected

DTH-EXP:1–2, DTH:1–12, DIR:1, NEX-MVP:3/4, MO catalog, NMI, VAI:1–8, CC:8 Evidence, DTH:5 scene composition. See `ARCHITECTURE-INSPECTION.md`.

## Scene Recipe contract

`DthExpSceneRecipe`: identity, family (GENERIC + reserved NEXO_*), management intent, actor/relationship/Evidence requirements, attention/grouping, analytical bindings as value refs, fallback, composition metadata. `isTheatreScene: false`. `copiesManagementTruth: false`.

## Resolution pipeline

Validate recipe → resolve Objects via DTH-EXP:2 → apply visual roles/attention/grouping → project existing relationships only → attach Evidence refs → bind analytical value refs → return read-only Theatre Scene. No Director recipe selection.

## Actor / relationship / Evidence

Required missing actor/relationship fails with empty scene. Optional gaps omit with limitations. Relationships keep `sourceAuthority`/`sourceRef`. Evidence is CC:8 refs, not copies.

## Analytical binding model

Dimensions (KPI, cost, risk, time, VAI role, evidence strength, execution progress, outcome vs goal) are `valueRef` + authority. `calculatesTruth: false`.

## Safety / fallback

Malformed recipes, missing required actors, unsupported required relationships/Evidence/bindings fail safely. Optional items degrade. Actors are never invented.

## Authority

Stage = NEX-MVP:3/4. Director = DIR:1. VAI roles unchanged. Nexo families reserved, unimplemented. Timeline is a NexoTime technique, not a Theatre system.

## Files

Created: Scene Recipe identity/boundary/contract/resolver/tests and `artifacts/dth-exp/DTH-EXP-3A/*`.

Modified: Theatre Scene `recipeRef`, EXP:1 projector sets `recipeRef: null`, public index exports.

## Tests

DTH-EXP:3A + :2 + :1 — **52 pass / 0 fail**. ESLint 0. Typecheck pass.

## Remaining debt

See `KNOWN-DEBT.md`.
