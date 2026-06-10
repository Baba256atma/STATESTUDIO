# MRP:11:2:2 — Assistant Support Panel Icon Dock

## Summary

Moved collapse controls from the global Assistant header into each support panel. Collapsed panels leave a compact right-aligned icon dock; clicking an icon restores only that panel.

## Panels

| Panel | Icon | Runtime key |
|-------|------|-------------|
| Suggested Questions | 💡 | `suggestions` |
| Guidance | 📘 | `guidance` |
| Scenario | 📊 | `scenario` |
| Decision | ⚖️ | `decision` |
| Actions | ⚡ | `actions` |

## Runtime

- `assistantPanelDockContract.ts` — panel ids, defaults, icons
- `assistantPanelDockRuntime.ts` — session-scoped visibility store + trace
- `useAssistantPanelDock.ts` — React subscription hook

Trace format:

```
[AssistantPanelDock]
panel=suggestions
action=collapse
```

## UI

- `AssistantDockedSupportPanel.tsx` — per-panel header + ▼ collapse (200ms CSS)
- `AssistantPanelCollapseButton.tsx` — collapse control
- `AssistantPanelIconDock.tsx` — vertical stacked restore icons
- `AssistantSupportPanelDock.tsx` — all five support panels + stable portal hosts

## Wiring

- `MrpChatFirstAssistantSurface` — chat host + support dock + icon dock row
- Suggested Questions moved from `ExecutiveAssistantPanel` into support dock
- Global `AssistantSuggestionsToggleButton` removed from `AssistantChatHeader`

## Persistence

`assistantPanelVisibility` survives Dashboard ↔ Assistant switches, object/scenario selection, and mode changes via `sessionStorage`. Legacy MRP:11:2:1 suggestions key migrates on first hydrate.

## Acceptance

1. Collapse Suggestions → only 💡 in dock
2. Click 💡 → panel restored
3. Collapse Scenario → only 📊 in dock
4. Dashboard → Assistant preserves state
5. Portal hosts stay mounted (CSS collapse only)
6. Build + unit tests pass
