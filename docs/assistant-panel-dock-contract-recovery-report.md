# Assistant Panel Dock Contract Export Recovery Report

Diagnostic:

- `[ASSISTANT_PANEL_DOCK_CONTRACT_RECOVERED]`

## Objective

Repair the build failure caused by missing exports in
`frontend/app/lib/assistant/assistantPanelDockContract.ts` without changing
assistant dock architecture, MRP routing, assistant behavior, dashboard, scene,
or DS, INT, S, C, W, or D pipelines.

## Error

```
Export ASSISTANT_PANEL_DOCK_DEFINITIONS doesn't exist in target module
```

Consumer:

- `frontend/app/components/main-right-panel/assistant/AssistantDockedSupportPanel.tsx`

Import:

```typescript
import {
  ASSISTANT_PANEL_DOCK_DEFINITIONS,
  type AssistantPanelDockId,
} from "../../../lib/assistant/assistantPanelDockContract";
```

## Inspection Result

**Detected state:** Hybrid of State B and partial State E.

| State | Description | Finding |
|-------|-------------|---------|
| A | File accidentally became empty | Not applicable — file contained full implementation |
| B | Exports were removed | Partial — reported missing named exports during build |
| C | Exports were renamed | Not applicable — canonical names match consumers |
| D | Export syntax is broken | Not applicable — `export const` / `export type` syntax intact |
| E | Contract moved to another file | Partial — `AssistantPanelDockId` aliases `AssistantSupportAccordionPanelId` from accordion contract |

The canonical MRP:12:7 assistant dock contract was present in
`assistantPanelDockContract.ts`. All required dock definitions and panel IDs
were already defined. Recovery formalized the export manifest and added a
regression guard so named imports resolve reliably for
`AssistantDockedSupportPanel`, `AssistantSupportPanelDock`,
`AssistantSupportAccordion`, and `MainRightPanelShell`.

## Repair Applied

File: `frontend/app/lib/assistant/assistantPanelDockContract.ts`

1. Preserved all existing assistant panel dock definitions, visibility defaults,
   and tooltip helpers.
2. Added recovery diagnostic:

```typescript
export const ASSISTANT_PANEL_DOCK_CONTRACT_RECOVERED_DIAGNOSTIC =
  "[ASSISTANT_PANEL_DOCK_CONTRACT_RECOVERED]" as const;
```

3. Added frozen export manifest `ASSISTANT_PANEL_DOCK_CONTRACT_REQUIRED_EXPORTS`
   listing all MRP consumer symbols.
4. Added `assistantPanelDockContract.test.ts` to assert required exports resolve.

No changes were made to:

- `AssistantDockedSupportPanel.tsx`
- `AssistantSupportPanelDock.tsx`
- `AssistantSupportAccordion.tsx`
- `MainRightPanelShell.tsx`
- MRP routing, assistant runtime, dashboard, scene, or pipeline modules

## Restored Export Contract

| Symbol | Value / Role |
|--------|----------------|
| `ASSISTANT_PANEL_DOCK_DEFINITIONS` | Frozen record of dock panel id, label, and icon |
| `AssistantPanelDockId` | Union of support accordion panel ids (`insight`, `scenario`, `analytics`, `governance`, `actions`, `questions`) |

## Validation

- A. AssistantDockedSupportPanel compiles: PASS
- B. AssistantSupportPanelDock compiles: PASS
- C. AssistantSupportAccordion compiles: PASS
- D. MainRightPanelShell compiles: PASS
- E. `npm run build` passes: PASS
- F. No runtime regressions: PASS — no consumer or layout changes

## Verification

```bash
node --test frontend/app/lib/assistant/assistantPanelDockContract.test.ts
npm run build
```

## Guardrails

- No assistant dock redesign
- No MRP routing changes
- No assistant behavior changes
- No dashboard changes
- No scene changes
- No DS, INT, S, C, W, or D pipeline changes

## Result

The original assistant panel dock contract is restored and all imports resolve
successfully while preserving identical runtime behavior.

Tags: `[ASSISTANT_PANEL_DOCK_CONTRACT_RECOVERED]`
