# NPA-T DTH-EXP:2 — Object Stage Roles

**Status: CERTIFIED**

Date: 2026-09-18.

Stop. Do not start DTH-EXP:3.

## Status

**NPA-T DTH-EXP:2 — CERTIFIED**

## Architecture inspected

DTH-EXP:1 Theatre Foundation, DTH:1–12, NEX-MVP:3/4 catalog/Stage IDs, DIR:1, MO/Object catalog, NMI projection (consumed), VAI:1–8, existing Stage presentation roles. Canonical identity originates in NEX-MVP:4 / MO catalog IDs and is copied into DTH:1 executives. Labels are not identity.

## Object → Actor resolution

`resolveDthExpTheatreActor`: Canonical Object → Theatre Actor reference → temporary visual role. Actor is not a business Object (`isTheatreActorNotBusinessObject: true`).

## Visual-role model

Reuses DTH-EXP:1 roles (`bubble`, `bar`, `flow-node`, `impact-node`, `cause-node`, `risk-marker`, `time-point`, `execution-marker`, `outcome-marker`). `visualRoleIsPermanent: false`. No `object.visualType` write.

## Transition model

`describeDthExpVisualRoleTransition` records presentation delta (role, position, size, emphasis, visibility, grouping, attention). `animationImplemented: false`. Canonical Object / KPI / Evidence / VAI / Decision / Execution / Outcome preserved as true.

## Identity guarantees

Canonical ID survives flow-node → bubble → cause-node. Same-kind actors remain distinct by ID. `labelIsIdentityAuthority: false`. Missing/blank IDs fail with no invented actor.

## Authority boundaries

Stage = NEX-MVP:3/4. Director = DIR:1. VAI roles independent of Theatre visual roles. Scene attention is presentation-only. No new Object/Stage/scene store.

## Files

Created: Object Stage Role identity/boundary/contract/resolver/transition/tests and `artifacts/dth-exp/DTH-EXP-2/*`.

Modified: DTH-EXP:1 actor/presentation fields, scene projector now uses the resolver, public index exports.

## Tests

DTH-EXP:2 + DTH-EXP:1: **30 pass / 0 fail**. ESLint 0. `npm run typecheck` pass.

## Remaining debt

See `KNOWN-DEBT.md`.
