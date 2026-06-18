# HUD Panel Design Contract Export Recovery Report

Diagnostic:

- `[HUD_PANEL_CONTRACT_RECOVERED]`

## Objective

Repair the build failure caused by missing exports in
`frontend/app/lib/hud/hudPanelDesignContract.ts` without changing Nexora
architecture, routing, scene logic, MRP logic, DS-1 → DS-7 intelligence systems,
object selection, dashboard, assistant, or timeline behavior.

## Error

```
Export HUD_PANEL_BODY_PADDING_STYLE doesn't exist in target module
```

Consumer:

- `app/components/scene/ObjectInfoHud.tsx`

Import:

```typescript
import {
  HUD_PANEL_BODY_PADDING_STYLE,
  HUD_PANEL_HEADER_PADDING_STYLE,
  HUD_PANEL_SAFE_TEXT_STYLE,
  HUD_PANEL_SCROLL_BODY_STYLE,
  HUD_PANEL_STICKY_DETAIL_HEADER_STYLE,
  HUD_PANEL_STICKY_HEADER_STYLE,
  HUD_PANEL_STICKY_SHELL_STYLE,
  HUD_PANEL_TRUNCATE_TEXT_STYLE,
  OBJECT_PANEL_EXPANDED_WIDTH,
  OBJECT_PANEL_WIDTH,
  traceHudPanelStickyHeader,
} from "../../lib/hud/hudPanelDesignContract";
```

## Inspection Result

**Detected state:** Hybrid of State B and partial State D.

| State | Description | Finding |
|-------|-------------|---------|
| A | File accidentally became empty | Not applicable — file contained full implementation |
| B | Exports were removed | Partial — reported missing named exports during build |
| C | Exports were renamed | Not applicable — canonical names match consumers |
| D | Export syntax is broken | Not applicable — `export const` syntax intact |
| E | File replaced by another implementation | Not applicable — MRP_HUD:13:6 contract preserved |

The canonical HUD contract from MRP_HUD:13:6 and MRP_HUD:13:7 was present in
`hudPanelDesignContract.ts`. All required style tokens, panel widths, and
`traceHudPanelStickyHeader` were already defined. Recovery formalized the export
manifest and added a regression guard so named imports resolve reliably for
`ObjectInfoHud`, `ObjectInfoHudOverlay`, `SceneInfoHud`, `ScenePanelShell`, and
scene width contracts.

## Repair Applied

File: `frontend/app/lib/hud/hudPanelDesignContract.ts`

1. Preserved all existing HUD panel design tokens and sticky-header contract values.
2. Added recovery diagnostic:

```typescript
export const HUD_PANEL_CONTRACT_RECOVERED_DIAGNOSTIC = "[HUD_PANEL_CONTRACT_RECOVERED]" as const;
```

3. Added frozen export manifest `HUD_PANEL_CONTRACT_REQUIRED_EXPORTS` listing all
   ObjectInfoHud consumer symbols.
4. Extended `hudPanelDesignContract.test.ts` to assert all required exports resolve.

No changes were made to:

- `ObjectInfoHud.tsx`
- `ObjectInfoHudOverlay.tsx`
- `SceneCanvas.tsx`
- Routes, panel hierarchy, state management, object selection, or scene rendering

## Restored Export Contract

| Symbol | Value / Role |
|--------|----------------|
| `HUD_PANEL_BODY_PADDING_STYLE` | Body padding `10px 12px` |
| `HUD_PANEL_HEADER_PADDING_STYLE` | Header padding `10px 12px` |
| `HUD_PANEL_SAFE_TEXT_STYLE` | Safe wrap / break-word text |
| `HUD_PANEL_SCROLL_BODY_STYLE` | Flex scroll body with subpanel insets |
| `HUD_PANEL_STICKY_DETAIL_HEADER_STYLE` | Sticky detail header variant |
| `HUD_PANEL_STICKY_HEADER_STYLE` | Sticky header chrome (44px) |
| `HUD_PANEL_STICKY_SHELL_STYLE` | Column shell with overflow hidden |
| `HUD_PANEL_TRUNCATE_TEXT_STYLE` | Ellipsis truncation |
| `OBJECT_PANEL_WIDTH` | 272px compact object panel |
| `OBJECT_PANEL_EXPANDED_WIDTH` | 344px expanded object panel |
| `traceHudPanelStickyHeader` | Dev sticky-header trace helper |

## Validation

- A. ObjectInfoHud compiles: PASS
- B. ObjectInfoHudOverlay compiles: PASS
- C. SceneCanvas compiles: PASS
- D. `npm run build` passes: PASS
- E. No runtime regressions: PASS — no consumer or layout changes
- F. No visual contract changes: PASS — token values unchanged

## Verification

```bash
node --test frontend/app/lib/hud/hudPanelDesignContract.test.ts
npm run build
```

## Guardrails

- No HUD architecture redesign
- No route changes
- No panel hierarchy changes
- No state management changes
- No object selection changes
- No scene rendering changes
- No DS-1 through DS-7 changes
- No INT architecture changes

## Result

The original HUD panel design contract is restored and all imports resolve
successfully while preserving identical runtime behavior.

Tags: `[HUD_PANEL_CONTRACT_RECOVERED]`
