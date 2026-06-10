# MRP:11:2:1 — Assistant Suggestions Toggle Report

**Date:** 2026-06-08  
**Scope:** Collapsible suggested-questions surface with header toggle and session-persisted visibility.

---

## 1. Problem

Suggested Questions remained permanently visible below the conversation area, consuming vertical space and competing with chat history and message composition.

---

## 2. Solution

### Header control

`AssistantChatHeader` now includes `AssistantSuggestionsToggleButton` (top-right, before collapse):

| State | Icon | Tooltip |
|-------|------|---------|
| Expanded | `▾` | Hide Suggestions |
| Collapsed | `▸` | Show Suggestions |

### Collapsible surface

`AssistantSuggestedQuestionsStrip` wraps content in `assistant-suggested-questions-surface`:

- **CSS collapse** via `max-height` + `opacity` (200ms transition)
- Component **stays mounted** — questions preserved, no regeneration
- `aria-hidden` + `pointer-events: none` when collapsed

### Runtime state

| Field | Default | Storage |
|-------|---------|---------|
| `assistantSuggestionsVisible` | `true` | `sessionStorage` key `nexora:assistant-suggestions-visible` |

Module-level store + `useSyncExternalStore` ensures state persists across:

- Dashboard ↔ Assistant tab switches
- Object / scenario selection
- Dashboard mode changes

---

## 3. Files

| File | Purpose |
|------|---------|
| `lib/assistant/assistantSuggestionsVisibilityContract.ts` | Contract + tooltips |
| `lib/assistant/assistantSuggestionsVisibilityRuntime.ts` | Store, persist, trace logs |
| `lib/assistant/useAssistantSuggestionsVisibility.ts` | React hook |
| `components/.../AssistantSuggestionsToggleButton.tsx` | Toggle UI |
| `components/.../AssistantChatHeader.tsx` | Toggle in header |
| `components/.../AssistantSuggestedQuestionsStrip.tsx` | Collapsible surface |
| `components/assistant/ExecutiveAssistantPanel.tsx` | Wired chat-first path |

---

## 4. Runtime trace

```
[AssistantSuggestionsToggle]
visible=false
action=collapse
```

```
[AssistantSuggestionsToggle]
visible=true
action=expand
```

---

## 5. Acceptance tests

| Test | Result |
|------|--------|
| 1 — Assistant opens, suggestions visible | ✅ default `true` |
| 2 — Toggle collapses | ✅ |
| 3 — Toggle expands again | ✅ |
| 4 — Session persistence | ✅ `sessionStorage` |
| 5 — Collapsed preserved on re-set | ✅ |
| 6 — No remount (CSS collapse only) | ✅ |
| 7 — No render loops | ✅ `useSyncExternalStore` |

Run: `node --test app/lib/assistant/assistantSuggestionsVisibility.test.ts`

---

## 6. Boundaries preserved

- Dashboard Home / `DashboardRuntimePanel` — **not modified**
- Object Panel, Scene HUD, Timeline — **not modified**
- Assistant chat runtime / `sendText` — **not modified**

---

## 7. Build

```
npm run build — PASS
```
