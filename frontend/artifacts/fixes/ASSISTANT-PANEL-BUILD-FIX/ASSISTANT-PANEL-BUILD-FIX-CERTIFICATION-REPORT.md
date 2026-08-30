# ASSISTANT-PANEL-BUILD-FIX — Certification Report

**Identity:** NPA-T ASSISTANT-PANEL-BUILD-FIX  
**Date:** 2026-08-29  
**Next.js:** 16.0.10 (Turbopack)  
**DTH:5:** not started

## Original error

```
Export ASSISTANT_PANEL_OVERFLOW_SIZE_BY_PANEL doesn't exist in target module
./app/lib/assistant/assistantPanelOverflowTokens.ts:8:1
import {
  ASSISTANT_PANEL_OVERFLOW_SIZE_BY_PANEL,
  type AssistantPanelOverflowSizeTier,
} from "./assistantPanelOverflowContract";
The module has no exports at all.
```

Reported in **Client Component Browser** and **Client Component SSR**. Affected graph: overflow tokens → docked support panel → support panel dock → support accordion → chat-first assistant surface → MainRightPanelShell → HomeScreen / NexoraManagerWorkspaceShell → `/type-c`.

## Reproduction evidence

| Item | Result |
|---|---|
| Git status (task files) | Overflow contract/tokens/tests modified by this fix; unrelated worktree left in place |
| Authoritative command | `cd frontend && NODE_OPTIONS=--max-old-space-size=8192 npm run build` |
| First reproduction (pre-edit source) | EXIT **0**. Turbopack compiled. The named export **existed** in `assistantPanelOverflowContract.ts`. |
| Post-fix production build | EXIT **0** — `artifacts/fixes/ASSISTANT-PANEL-BUILD-FIX/production-build.log` |
| Stale dev server? | The overlay wording matches `next dev` Client/SSR, not a missing line in current source. Production `next build` on this tree never reported the missing export. |

The error referenced a real consumer (`assistantPanelOverflowTokens.ts`) and a real target path. It did **not** mean the constant was absent from source.

## First technical divergence

`assistantPanelOverflowContract.ts` **did** export a runtime `const ASSISTANT_PANEL_OVERFLOW_SIZE_BY_PANEL` (`Object.freeze`, value export, not `export type`). `AssistantPanelOverflowSizeTier` is a type. No rename. File not emptied. Path casing matches. One mapping in the repository (`rg` only hits this contract + tests/tokens).

The first graph defect: the overflow **semantic leaf** imported `AssistantPanelDockId` from `assistantPanelDockContract.ts`.

Dock contract is a recovered module (`ASSISTANT_PANEL_DOCK_CONTRACT_RECOVERED_DIAGNOSTIC`) and is value-imported by client UI (`AssistantDockedSupportPanel`, icon dock, hooks). Turbopack’s “module has no exports at all” while source still has `export const` is the incomplete-evaluation symptom: overflow contract evaluation was tied to the dock/client chunk.

This is **category C** (circular / incomplete module evaluation), not A (missing export) or cache-only.

`.next` was **not** deleted as the fix. The source graph was corrected so a clean compile succeeds because the leaf no longer waits on dock evaluation.

## Root cause

Overflow sizing truth lived in the overflow contract, but that contract had a (type) import edge to the dock contract. In the Turbopack client/SSR graph that edge is not a free type-erasure; it attaches the mapping leaf to the dock/UI evaluation set. When that set is incomplete (HMR, recovered/empty dock history, client boundary), Turbopack presents overflow as exportless and tokens cannot bind `ASSISTANT_PANEL_OVERFLOW_SIZE_BY_PANEL`.

Mixed `import { VALUE, type TYPE }` in tokens was a secondary hazard; it is now split into a value import and `import type`.

## Actual module graph (after fix)

```
assistantSupportAccordionContract.ts   (panel-id leaf; types + order + default state)
        ^ import type
assistantPanelOverflowContract.ts      (size-tier type + canonical panel→tier map + detect/trace)
        ^ value + import type
assistantPanelOverflowTokens.ts        (px heights, scroll CSS; import type DockId for public params)
        ^
AssistantPanelScrollContainer / AssistantDockedSupportPanel (consume tokens)

assistantPanelDockContract.ts          (DockId alias of accordion ids, visibility, icons)
        ^
dock runtime / useAssistantPanelDock / icon dock
```

**No cycle:** overflow contract does not import tokens, runtime, components, or dock.

**Not a directed ESM cycle through dock after the fix.** The previous diamond was:

```
OverflowContract → DockContract
Tokens → OverflowContract
Tokens → DockContract
DockedSupportPanel → Tokens + DockContract
```

That diamond plus Turbopack client evaluation made overflow look exportless. Breaking Overflow→Dock removes overflow from the dock evaluation SCC.

No assistant barrel/index exists. HUD/safe-zone contracts are not on this leaf.

## Canonical ownership

| Concern | Owner |
|---|---|
| Panel identity union | `assistantSupportAccordionContract` (`AssistantSupportAccordionPanelId`) |
| Dock alias, icons, visibility booleans | `assistantPanelDockContract` (`AssistantPanelDockId` = accordion id) |
| Semantic size tier + panel→tier map | `assistantPanelOverflowContract` — **only mapping** |
| Pixel max-height / scroll CSS | `assistantPanelOverflowTokens` (derives; does not own tiers) |
| Overflow observation | `assistantPanelOverflowRuntime` |
| UI | components consume tokens |

One mapping. `actions` → `small` → 144px. Other supported panels → `medium` → 192px. `compact` (128px) remains a valid derived tier with no panel assigned (no silent fallback).

## Why this fix is authoritative

- Restores the intended leaf: semantic map does not depend on dock presentation.
- Reuses accordion panel ids (already the identity authority); does not invent a second id union or a second size map.
- Keeps the runtime constant as a value export; types stay `import type`.
- Does not add `"use client"` to the contract, disable Turbopack, duplicate constants, or move the contract into a component.

## Files inspected

Overflow contract/tokens/runtime/tests; dock contract/runtime/hook/tests; accordion contract/runtime; MRP 12.7/12.8 diagnostics; `MrpChatFirstAssistantSurface`; docked/scroll/accordion/icon-dock components; `MainRightPanelShell`; `HomeScreen`; `NexoraManagerWorkspaceShell`; `/type-c`; no HUD imports of overflow.

## Files changed (this task)

| Class | Path |
|---|---|
| Root-cause source | `app/lib/assistant/assistantPanelOverflowContract.ts` |
| Type/value import hygiene | `app/lib/assistant/assistantPanelOverflowTokens.ts` |
| Tests | `app/lib/assistant/assistantPanelOverflow.test.ts`, `assistantPanelOverflowContract.test.ts` (new) |
| Certification | `frontend/artifacts/fixes/ASSISTANT-PANEL-BUILD-FIX/` |

Unrelated DTH/HUD/assistant worktree changes were not overwritten.

## Focused tests

`tsx --test` overflow + dock + freeze: **44/44 pass**  
`vitest` mrp127/mrp128: **7/7 pass**

Coverage: runtime export, TypeScript tier type, complete panel map vs accordion order and dock keys, no unsupported ids, derived heights, `Object.freeze` immutability, static/dynamic import identity, no dock/tokens/component imports from overflow contract, no contract→tokens cycle, existing overflow/dock/accordion/visibility tests unchanged in strength.

## Regression

| Suite | Result |
|---|---|
| `npm run test:scene` | EXIT 0 — Vitest 31 files; node 296/296 |
| DTH:1–4 `nexoraDecisionTheatre*.test.ts` | EXIT 0 — 45/45 |
| `npm test` (executive) | EXIT 0 — 81/81 |
| manager-object + conversational-control + DIR semantic | EXIT 0 — 904/904 |
| `npm run nxa:funnel -- --level 1` | EXIT 0 |

HUD/safe-zone sources were not modified; scene suite includes those contracts.

## Static / build gates

| Gate | Result |
|---|---|
| TypeScript `npm run typecheck` | EXIT 0 |
| Production Build | EXIT 0 — compiled 15.1s; no missing export; no exportless overflow module; `/type-c` and `/executive` in route table |
| ESLint (task files) | EXIT 0 |
| `git diff --check` (task files) | EXIT 0 |

Turbopack production compile did not report Client/SSR graph divergence or hydration module errors for this export.

## Fresh runtime proof

- Command: `npx next start -p 3016` (this task; not 3014/3015 leftovers, not `next dev`)
- URLs: `http://localhost:3016/type-c`, `http://localhost:3016/executive`
- Evidence: `live-browser.json`, `live-type-c.png`, `live-executive.png`, `live-assistant-panel.mjs`

### /type-c

- HTTP 200. Main right panel present. Assistant surface, accordion, icon dock present.
- Insight expand: max-height **192px** (medium). Actions expand: max-height **144px** (small). Analytics (persisted open) overflow flag `true` with 192px bound.
- Collapse of insight leaves no expanded docked panel.
- `/type-c` **dashboard load** (before Assistant tab): **no page errors**.

### /executive

- Stage and Advisor present. DTH:4 atmosphere **`none`** / overlay `none` (no fabricated authority).
- Click-to-center: `obj-revenue`. Stage step-back → none; step-forward → `obj-revenue`.
- Executive page: **no page errors, no console errors, no hydration errors, no missing-export.**

### Console classification

| Class | Notes |
|---|---|
| Missing export / exportless / hydration | **None** |
| CORS / `127.0.0.1:8000` | Environmental (backend not part of this cert); same class as other live runs without API |
| React minified **#185** on Type-C **Assistant tab click** | Pre-existing MRP tab-activation update-depth. Reproduced with dashboard→Assistant **without** mutating overflow DOM. **Not** the Turbopack missing-export. Mapping still applied (192/144). Not introduced by the overflow↔dock leaf break. **Not DTH:5.** |

## Remaining known failures

- **Not this defect:** Turbopack `ASSISTANT_PANEL_OVERFLOW_SIZE_BY_PANEL` / exportless overflow contract — **closed**.
- Type-C Assistant tab React #185: recorded, pre-existing relative to this graph fix; out of scope for a second size authority or DTH work. Dashboard `/type-c` load and `/executive` are clean.
- Local API CORS: environmental.

## Final verdict

**ASSISTANT-PANEL-BUILD-FIX = CERTIFIED**

The first real cause was an overflow-contract → dock-contract graph edge (exportless evaluation), not a deleted constant. Canonical overflow-size mapping remains one frozen object in the overflow contract. Production build exits 0. DTH:4 atmosphere policy unchanged.

Do not begin DTH:5.
