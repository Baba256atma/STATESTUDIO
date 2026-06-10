# MRP:11:2:5-FIX — Assistant Panel Dock Snapshot Fix Report

## Unsafe Snapshot Function

The unsafe path was:

```ts
useAssistantPanelVisibility
  -> getAssistantPanelVisibility()
  -> deriveAssistantPanelVisibilityFromAccordion(...)
```

`getAssistantPanelVisibility()` returned a newly allocated object on every call.

## Old Unstable Pattern

```ts
export function getAssistantPanelVisibility(): AssistantPanelVisibility {
  return deriveAssistantPanelVisibilityFromAccordion(getAssistantSupportAccordionState());
}
```

Even when `openPanelId` did not change, React received a new snapshot reference. That violated the `useSyncExternalStore` contract and could trigger:

```text
The result of getSnapshot should be cached to avoid an infinite loop
```

## Cached Snapshot Strategy

The canonical store remains:

```ts
type AssistantAccordionState = {
  openPanelId:
    | "suggestions"
    | "guidance"
    | "scenario"
    | "decision"
    | "actions"
    | null;
};
```

The derived panel visibility object is now cached in the accordion runtime:

```ts
let cachedAssistantPanelVisibility =
  deriveAssistantPanelVisibilityFromAccordion(assistantAccordionState);
```

`getAssistantPanelVisibility()` now returns that cached reference directly. The cache is replaced only inside explicit accordion state updates and test resets.

## Component Safety

Active UI consumers now derive visibility from the primitive `openPanelId`:

- `AssistantDockedSupportPanel`
- `AssistantPanelIconDock`

The boolean visibility snapshot remains only as a compatibility API for older callers.

## Runtime Trace

State commits emit:

```text
[AssistantPanelDockSnapshot]
stable=true
openPanelId=suggestions
listenerCount=X
```

## Runtime Validation

- Fresh Assistant default snapshot is stable.
- Repeated `getAssistantPanelVisibility()` calls return the same reference when state has not changed.
- Opening another panel replaces the cached snapshot once.
- Collapse / expand behavior still follows the single-open accordion rule.
- Dashboard / Assistant switching and object selection do not recreate the store.

## Build Result

Validated with:

```bash
node --test app/lib/assistant/assistantPanelDock.test.ts
node --test app/lib/assistant/assistantSuggestionsVisibility.test.ts
npm run build
```

