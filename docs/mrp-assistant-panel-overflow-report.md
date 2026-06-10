# MRP:11:2:3 — Assistant Support Panel Scroll Containers

## Summary

Added executive-grade overflow management to all five Assistant support panels. Each panel now scrolls independently inside a bounded container with thin, low-noise scrollbars.

## Panels + sizing tiers

| Panel | Tier | Max height |
|-------|------|------------|
| Suggested Questions | compact | 128px |
| Guidance | medium | 192px |
| Scenario | medium | 192px |
| Decision | medium | 192px |
| Actions | small | 144px |

Tiers derive from Nexora spacing scale (lg=16).

## Architecture

- `assistantPanelOverflowContract.ts` — tier map, overflow detection, trace format
- `assistantPanelOverflowTokens.ts` — canonical max-heights + scroll container styles
- `assistantPanelOverflowRuntime.ts` — ResizeObserver measurement + dev trace
- `AssistantPanelScrollContainer.tsx` — per-panel scroll wrapper

Trace format:

```
[AssistantPanelOverflow]
panel=guidance
overflow=true
```

## Scroll rules

- `overflow-y: auto` on each panel container
- `overscroll-behavior: contain` prevents body-scroll chaining
- Collapsed panels: `max-height: 0`, `overflow: hidden` — no scrollbar
- Chat conversation scrolling unchanged (separate host)
- Portal hosts for Scenario/Decision remain mounted; outer scroll container bounds height

## Visual

- Thin scrollbar via `scrollbar-width: thin` + `.nx-assistant-panel-scroll` webkit styles in `globals.css`
- 200ms collapse transition preserved from MRP:11:2:2

## Acceptance

1. Long Guidance → scrollbar when content exceeds 192px
2. Long Scenario → scrollbar when content exceeds 192px
3. Scroll Guidance → only Guidance container moves
4. Scroll Scenario → only Scenario container moves
5. Collapse → scrollbar hidden
6. Chat remains functional (unchanged)
7. Input remains visible (chat host flex unchanged)
8. No layout jumping (fixed max-heights)
9. No render loops (overflow runtime writes DOM attrs only)
10. No body-scroll side effects (`overscroll-behavior: contain`)

## Tests

`assistantPanelOverflow.test.ts` — 10 contract/runtime tests
