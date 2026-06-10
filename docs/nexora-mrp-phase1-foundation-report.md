# MRP:1:1 — Main Right Panel Foundation Report

## 1. Files inspected

| File | Role |
|------|------|
| `frontend/app/components/right-panel/RightPanelHost.tsx` | Legacy compatibility renderer; redirects all views to dashboard runtime |
| `frontend/app/lib/ui/right-panel/rightPanelRouter.ts` | Legacy canonical routes and portal host id |
| `frontend/app/lib/ui/mainRightPanelContract.ts` | Existing two-tab contract (`dashboard` \| `assistant`) + dashboard contexts |
| `frontend/app/lib/ui/mainRightPanelRuntimeEnforcement.ts` | Runtime brake redirecting legacy surfaces to dashboard |
| `frontend/app/lib/workspace/nexoraWorkspaceStateContract.ts` | Canonical workspace state including `activeMRPTab` |
| `frontend/app/lib/dashboard/useNexoraWorkspaceState.ts` | Reducer hook used by HomeScreen |
| `frontend/app/components/NexoraShell.tsx` | Right rail shell, `#nexora-right-panel-root` portal host |
| `frontend/app/screens/HomeScreen.tsx` | Portals panel content, owns workspace state + RightPanelHost |

**Not found (named in prompt):** `executiveNavigationBridge.ts`, `executivePlaneNavigationResolver.ts` — no files with those exact names in the repo.

## 2. Legacy code isolated

- **`RightPanelHost`** remains mounted only inside the Dashboard tab via `legacyDashboardHost`. It is not removed.
- **`mainRightPanelLegacyIsolation.ts`** documents legacy right-panel views as compatibility inputs only.
- **`mainRightPanelRuntimeEnforcement.ts`** unchanged — still redirects deprecated `rightPanelState.view` values to dashboard before render.
- **NexoraShell inspector sub-tabs** unchanged; MRP tab bar lives inside the portaled shell to avoid shell/router churn.
- **Scene-native Object Panel, Timeline, Scene Panel, Top Bar** untouched.

## 3. New MRP contract created

| Artifact | Purpose |
|----------|---------|
| `mainRightPanelStateContract.ts` | Presentation state, tab transition brakes, dashboard mode labels |
| `MainRightPanelShell.tsx` | Stable two-tab container; panes stay mounted (`display` toggle) |
| `MainRightPanelDashboardPlaceholder.tsx` | Safe dashboard placeholder + reserved mode chips |
| `MainRightPanelAssistantPlaceholder.tsx` | Safe assistant/consultant placeholder |
| `mainRightPanelLegacyIsolation.ts` | Legacy surface inventory and ownership map |

**State authority:** `NexoraWorkspaceState.activeMRPTab` + `dashboardContext` (via `useNexoraWorkspaceState` in HomeScreen).

**Tab switching:** `dispatchNexoraWorkspaceState({ type: "setMRPTab", tab })` — does not write scene selection or topology.

**Dev logs:** `[Nexora][MRP][TabChange]`, `[MRP][Brake]`, existing `[Nexora][MRP]` runtime log.

## 4. Intentionally not implemented

- Analyze / Compare / Scenario / War Room / Focus dashboard modes (routing UI only as placeholder chips)
- Object Panel → Dashboard mode action routing
- Full Nexora Assistant chat wiring
- NexoraShell header tab replacement
- Removal of `RightPanelHost` or legacy router modules
- New business logic engines

## 5. Warnings and follow-up

1. **Dual tab chrome:** NexoraShell may still show legacy inspector sub-tabs above the portaled MRP shell. Follow-up: hide or sync shell sub-tabs when `MainRightPanelShell` is active.
2. **Dashboard tab content:** Dashboard tab still renders legacy `RightPanelHost` below the placeholder strip for backward compatibility. Follow-up: collapse placeholder once dashboard modes replace legacy panels.
3. **Assistant isolation:** Executive assistant rail (`ExecutiveAssistantPanel`) is separate from MRP Assistant tab — follow-up: consolidate or document which assistant surface is canonical.
4. **Left nav → dashboard context:** Still routes through legacy panel authority in places; follow-up: route through `setDashboardContext` only.

## Verification

- `npx vitest run app/lib/ui/mainRightPanelStateContract.test.ts app/lib/scene/sceneHudZoneContract.test.ts`
- `npm run build`
- Manual `/type-c`: MRP shows Dashboard + Assistant tabs; default Dashboard; Assistant switches without scene/object/timeline regression; Object Panel remains scene-native left of MRP.
