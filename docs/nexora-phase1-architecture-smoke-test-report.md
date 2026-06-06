# Nexora Phase 1 Architecture Smoke Test Report

Date: 2026-06-06

Result: PASS WITH WARNINGS

Scope: Phase 1 Panel Architecture Foundation validation for Nexora Type-C MVP.

## 1. Build Status

Status: PASS

Command:

```bash
npm run build
```

Result:

- Next production build completed successfully.
- TypeScript completed successfully.
- Static routes generated successfully, including `/type-c`.
- Existing warning only: `baseline-browser-mapping` package data is over two months old.

## 2. Left Nav Status

Status: PASS WITH WARNINGS

Static contract:

- `CANONICAL_NEXORA_LEFT_NAV_ITEMS` contains the seven required modes:
  Sources, Dashboard, Scenario, Risk, War Room, Timeline, Settings.
- Left Nav legacy values map through `nexoraLeftNavContract.ts`.

Runtime smoke:

- `/type-c` loaded with `#nexora-leftnav`, `#nexora-shell`, `#nexora-stage`, and `#nexora-right-panel-root` mounted.
- Initial server-rendered HTML included all seven canonical Left Nav entries.
- Browser interaction confirmed the workspace, scene, and MRP root stayed mounted during available nav clicks.

Warning:

- In the hydrated browser pass, only a subset of Left Nav buttons was directly discoverable in the visible left nav DOM under the tested viewport. This appears related to compact/overflow or runtime presentation state, but should be checked before Phase 2 if all seven modes must remain directly visible at all times.

## 3. MRP Status

Status: PASS WITH WARNINGS

Static contract:

- `MainRightPanelTab` is exactly:
  `dashboard | assistant`.
- `MAIN_RIGHT_PANEL_TABS` is exactly:
  `dashboard`, `assistant`.
- `nexoraRoutingContract.ts` and `mainRightPanelContract.ts` prevent third-tab routing at the contract layer.

Runtime findings:

- `#nexora-right-panel-root` remained mounted.
- No runtime console evidence showed dynamic MRP tab creation.

Warning:

- Legacy right-rail compatibility buttons such as `Scene`, `Objects`, and `Focus` remain visible in runtime. They are documented as compatibility surfaces, but they still look like tabs/subtabs and remain a Phase 2 migration risk.

## 4. Scene Panel Status

Status: PASS WITH WARNINGS

Static contract:

- `ScenePanelState = "expanded" | "collapsed"`.
- Object Catalog entry is canonically owned by Scene Panel.

Runtime findings:

- Scene HUD/Scene Panel surface mounted.
- Scene remained mounted during nav smoke.

Warning:

- Browser click on the Scene Info collapse control timed out because the HUD intercept/positioning made the control hard to click in headless mode. The control exists in DOM with title `Collapse scene info`; manual QA should confirm collapse/expand ergonomics.

## 5. Object Panel Status

Status: PASS WITH WARNINGS

Static contract:

- `ObjectPanelState = "hidden" | "empty" | "selected"`.
- Current selected-object authority is `HomeScreen.selectedObjectIdState`.
- Object actions route through Dashboard Context and must not create MRP tabs.

Runtime findings:

- `data-nx="object-panel-shell"` mounted.
- Runtime object panel state observed as `hidden` in the tested default layout.
- No new MRP tabs were observed during nav smoke.

Warning:

- Object selection interaction was not completed in this automated pass because scene object picking is canvas-driven and needs a more specific Playwright hit-target script or manual QA step.

## 6. Timeline Status

Status: PASS

Static contract:

- `TimelineState = "hidden" | "collapsed" | "expanded"`.
- Timeline is scene-native and not an MRP tab.
- Timeline request resolves to Dashboard Context `timeline` plus scene runtime activation.

Runtime findings:

- Scene-native Timeline HUD/bottom workspace selectors were mounted.
- No separate page route or MRP timeline tab was created during smoke.

## 7. Routing Status

Status: PASS WITH WARNINGS

Static contract:

- `NexoraRouteRequest` exists.
- Left Nav, Scene Panel, Object Panel, Timeline, Assistant, and System sources are modeled.
- Invalid route requests fall back through Dashboard/overview.
- Legacy routes map through Dashboard Context.

Runtime findings:

- Nav smoke kept shell, scene, and MRP mounted.
- No fatal route loops or tab creation were observed.

Warning:

- Legacy route compatibility remains substantial in `rightPanelRouter.ts`, `RightPanelHost.tsx`, and `HomeScreen.tsx`. This is expected from Phase 1 but should be reduced in Phase 2.

## 8. State Ownership Status

Status: PASS WITH WARNINGS

Static contract:

- `NexoraWorkspaceState` exists with stable defaults:
  Dashboard left nav, Dashboard MRP tab, overview context, expanded Scene Panel, empty Object Panel, no selected object, collapsed Timeline, closed Object Catalog.
- Intent reducer validates state updates.

Known mirrors/duplicates:

- `HomeScreen.rightPanelState`: legacy compatibility view/context holder.
- `HomeScreen.selectedObjectIdState`: current selected-object authority.
- `HomeScreen.scenePanelCollapsed`: Scene Panel presentation mirror.
- `HomeScreen.objectPanelCollapsed`: Object Panel presentation mirror.
- `HomeScreen.objectCatalogOpen`: Object Catalog presentation mirror.
- `NexoraShell.scenePanelCollapsed` and `NexoraShell.objectPanelCollapsed`: shell presentation mirrors.
- `rightPanelRouter` legacy tab/shell-section state: compatibility only.

Warning:

- The canonical state contract exists, but the runtime is not fully migrated to a single store yet. This is acceptable for Phase 1 if treated as a migration boundary, not a final implementation state.

## 9. Hydration Status

Status: PASS

Runtime browser console:

- No `Hydration failed` errors.
- No text mismatch errors.
- No client/server mismatch errors.

Observed informational hydration logs:

- `SceneInfoHydration`
- `TimelineTimestampStable`
- `OrientationHydration`
- `HUDHydration`
- `BottomCommandDockPlaceholderStable`

Observed warning:

- `[Nexora][SceneHydration][Allowed]` for demo scene object hydration. This appears intentionally allowed and not a React hydration failure.

## 10. Loop Safety Status

Status: PASS

Runtime browser console:

- No `Maximum update depth exceeded`.
- No `Too many re-renders`.
- No page errors.
- No fatal React runtime errors.

## 11. Console Audit

Critical:

- None observed.

High:

- None observed.

Medium:

- Legacy visible right-rail compatibility buttons remain and may be mistaken for canonical MRP tabs.
- Hydrated left nav discoverability differed from server-rendered canonical HTML in the tested runtime pass.

Low:

- `[Nexora][SceneHydration][Allowed]` warning for demo hydration.
- `baseline-browser-mapping` age warning during build.

Brake logs:

- No brake logs emitted during runtime smoke.

## 12. Legacy Risk Audit

Legacy risks identified:

- `rightPanelRouter.ts` still contains broad legacy view/tab mapping.
- `RightPanelHost.tsx` still renders legacy view cases.
- `HomeScreen.tsx` still owns compatibility state and legacy event routing.
- Visible runtime controls still include non-canonical right-rail surfaces.
- `ArchitectureFreeze` brake tag was not found; all requested panel-specific brake systems exist except this optional/example tag.

## Final Gate

PASS WITH WARNINGS

Phase 1 is stable enough to proceed into Phase 2 if Phase 2 treats the remaining legacy right-rail/tab surfaces and partial state migration as explicit cleanup targets.
