# Nexora Action Routing

## 1. Core Rule

All actions must be classified before routing:

- `command`
- `processing`

Command actions change right-panel intent. Processing actions open center execution.

## 2. Routing Table

| Action class | Destination | Rule |
| --- | --- | --- |
| SCN command | Right Panel | Switch Scene / Objects / Focus. |
| SIM command | Right Panel | Switch War Room / Timeline / Advice. |
| RSK command | Right Panel | Switch Explanation / Conflict / Risk Flow. |
| Processing action | Center Component | Open simulation / compare / timeline / replay / analysis. |

## 3. Examples

- `Focus` -> Right Panel.
- `Objects` -> Right Panel.
- `Risk Flow` -> Right Panel.
- `War Room` -> Right Panel.
- `Advice` -> Right Panel.
- `Simulate mitigation` -> Center simulation.
- `Compare options` -> Center compare.
- `Open full timeline` -> Center timeline.
- `Trace propagation` -> Center timeline or analysis.
- `Execute replay` -> Center replay/analysis.

## 4. Explicit User Intent Rule

- Explicit tab click must override stale focus state.
- Explicit left-nav click must override fallback or auto-sync.
- Object click may open Focus.
- Empty scene click restores Scene.
- Automatic sync must not overwrite fresh explicit user intent.

## 5. Action Ownership

Routing should pass through the canonical action path and panel controller.

Use:
- Canonical action normalization.
- Action router.
- Panel controller.
- Right panel router/state machine.
- Center execution authority for processing.

Avoid scattered component-level routing decisions.

## 6. Anti-Patterns

Avoid:
- Direct panel open from random components without controller.
- Heavy processing inside Right Panel.
- Duplicate routing logic in panel components.
- Data-less panel opens.
- Processing actions that route to right-panel `simulate` or `compare`.
- Auto-sync that fights explicit clicks.

## 7. Developer Reminder

Relevant files:

- `frontend/app/screens/HomeScreen.tsx`
- `frontend/app/lib/actions/actionRouter.ts`
- `frontend/app/lib/actions/actionNormalizer.ts`
- `frontend/app/components/right-panel/RightPanelHost.tsx`
- `frontend/app/lib/ui/right-panel/panelController.ts`
- `frontend/app/lib/ui/right-panel/rightPanelRouter.ts`
- `frontend/app/lib/ui/right-panel/panelStateMachine.ts`

Before adding a CTA, decide whether it is `command` or `processing`.
