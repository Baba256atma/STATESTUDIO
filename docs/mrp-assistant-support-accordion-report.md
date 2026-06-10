# MRP:11:2:5 — Assistant Support Panel Accordion Report

## Scope

Implemented a single-open executive accordion for the Assistant support panels:

- Suggested Questions
- Guidance
- Scenario
- Decision
- Actions

## Architecture

Canonical runtime state now lives in `assistantAccordionState`:

```ts
{
  openPanelId:
    | "suggestions"
    | "guidance"
    | "scenario"
    | "decision"
    | "actions"
    | null
}
```

`null` means all support panels are collapsed. The old panel visibility API is retained as a compatibility layer and derives booleans from `openPanelId`, so multiple expanded panels cannot be represented.

## Files

- `frontend/app/lib/assistant/assistantSupportAccordionContract.ts`
- `frontend/app/lib/assistant/assistantSupportAccordionRuntime.ts`
- `frontend/app/components/main-right-panel/assistant/AssistantSupportAccordion.tsx`
- `frontend/app/lib/assistant/assistantPanelDockRuntime.ts`
- `frontend/app/components/main-right-panel/assistant/AssistantDockedSupportPanel.tsx`
- `frontend/app/components/main-right-panel/assistant/AssistantPanelIconDock.tsx`
- `frontend/app/components/main-right-panel/assistant/AssistantPanelCollapseButton.tsx`
- `frontend/app/components/main-right-panel/assistant/AssistantSupportPanelDock.tsx`
- `frontend/app/components/main-right-panel/MrpChatFirstAssistantSurface.tsx`

## Behavior

- Fresh Assistant runtime opens Suggested Questions by default.
- Opening any support panel collapses the currently open panel.
- Collapsing the current panel sets `openPanelId` to `null`.
- The icon dock remains visible for collapsed available panels.
- Clicking a dock icon opens that panel and collapses all others.
- Runtime state persists across Dashboard / Assistant tab switches, object selection, scenario selection, and dashboard mode changes because it is module-scoped and not tied to those props.
- Page reload resets to the default Suggested Questions state.

## Scroll Compatibility

Expanded panels keep their own `overflowY: auto` scroll containers. Collapsed panels set their scroll containers to `maxHeight: 0`, `opacity: 0`, `pointerEvents: none`, and `overflowY: hidden`.

Portal hosts remain mounted inside their support panel wrappers, preventing scenario and decision content regeneration during accordion switches.

## Runtime Trace

Accordion transitions log in development:

```text
[AssistantSupportAccordion]
openPanel=suggestions
action=open

[AssistantSupportAccordion]
openPanel=null
action=collapse_all

[AssistantSupportAccordion]
openPanel=decision
action=switch_from_scenario
```

## Acceptance Validation

- Test 1: Fresh Assistant open expands Suggested Questions only.
- Test 2: Opening Scenario collapses Suggested Questions.
- Test 3: Opening Decision collapses Scenario.
- Test 4: Collapsing Decision leaves all panels collapsed.
- Test 5: Suggested Questions icon restores that panel only.
- Test 6: Runtime state is independent of Dashboard / Assistant tab props.
- Test 7: Runtime state is independent of object selection props.
- Test 8: Active panel scroll behavior remains contained.
- Test 9: Runtime uses `useSyncExternalStore` subscriptions without render loops.
- Test 10: Existing null-safe overflow observer behavior is preserved.

