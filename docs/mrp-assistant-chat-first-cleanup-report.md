# MRP:11:1 — Assistant Chat-First Cleanup Report

**Date:** 2026-06-08  
**Scope:** Reorganize Type-C MRP Assistant tab into chat-first layout; preserve scenario/decision data in collapsible support panels.

---

## 1. Previous assistant layout problem

The Assistant tab stacked **four full-height panels** vertically:

```
MainRightPanelAssistantStackHosts
├── ExecutiveAssistantPanel (header + guidance + messages + questions + input)
├── ExecutiveScenarioSuggestionsPanel (Alternatives / Impact / Risk)
└── ExecutiveScenarioComparisonPanel (Decision Evaluation + actions)
```

Result: Assistant felt like a **second dashboard** — guidance, executive questions, scenario cards, and decision blocks competed for attention. Chat input was buried below large scenario/decision surfaces.

---

## 2. New chat-first hierarchy

```
MrpChatFirstAssistantSurface
├── Section A — AssistantChatHeader (Nexora AI, status, context, collapse)
├── Section B — AssistantConversationArea (messages + empty state)
├── Section D — AssistantSuggestedQuestionsStrip (3–5 compact chips)
├── Section C — AssistantMessageInput (pinned bottom, Send)
└── Section E — AssistantSupportAccordion (collapsed by default)
    ├── Guidance (context summary text)
    ├── Scenario (portal → ExecutiveScenarioSuggestionsPanel)
    ├── Decision (portal → ExecutiveScenarioComparisonPanel)
    └── Actions (DEFAULT_EXECUTIVE_ASSISTANT_ACTION_CARDS)
```

**UX rule enforced:** Assistant tab = chat-first. Dashboard tab = panels/workspaces (unchanged).

---

## 3. Panels moved into support accordion

| Former inline block | New location | Default state |
|---------------------|--------------|---------------|
| Guidance banner in ExecutiveAssistantPanel | Accordion → **Guidance** | Collapsed |
| ExecutiveScenarioSuggestionsPanel stack | Accordion → **Scenario** | Collapsed |
| ExecutiveScenarioComparisonPanel stack | Accordion → **Decision** | Collapsed |
| Action card hints | Accordion → **Actions** | Collapsed |

Only **one** accordion section open at a time.

---

## 4. Suggested questions behavior

**Type-C questions** (`MRP_CHAT_FIRST_QUESTION_SUGGESTIONS`):

- Where is margin pressure constraining delivery?
- What should leadership stabilize first?
- Which bottleneck breaks customer commitments next?
- What scenario should I compare?
- Explain the current decision state.

**Click behavior:** `handleExecutiveAssistantQuestionSelect` → sets input + calls existing `sendText()` (no new chat backend).

---

## 5. Dashboard boundary validation

| Check | Result |
|-------|--------|
| `DashboardRuntimePanel` modified | **No** |
| `ExecutiveDashboardHomeSurface` modified | **No** |
| Dashboard tab content | Unchanged — Dashboard Home still visible |
| `RightPanelHost` legacy | Still suppressed in overview |
| Assistant tab remounts dashboard | **No** — separate tabpanel only |

---

## 6. Runtime validation (Playwright `/type-c`)

**Assistant tab:**

```json
{
  "chatFirst": true,
  "conversation": true,
  "input": true,
  "suggested": true,
  "accordion": true
}
```

Screenshot: `frontend/.tmp/mrp11-assistant-evidence/assistant-chat-first.png`

**Dashboard tab:** unchanged — `ExecutiveDashboardHomeSurface` visible (MRP:10:12 path).

---

## 7. Files changed

| File | Change |
|------|--------|
| `components/main-right-panel/MrpChatFirstAssistantSurface.tsx` | **NEW** — chat-first shell |
| `components/main-right-panel/assistant/AssistantChatHeader.tsx` | **NEW** |
| `components/main-right-panel/assistant/AssistantConversationArea.tsx` | **NEW** |
| `components/main-right-panel/assistant/AssistantMessageInput.tsx` | **NEW** |
| `components/main-right-panel/assistant/AssistantSuggestedQuestionsStrip.tsx` | **NEW** |
| `components/main-right-panel/assistant/AssistantSupportAccordion.tsx` | **NEW** |
| `components/assistant/ExecutiveAssistantPanel.tsx` | `layout="chat-first"` variant |
| `components/main-right-panel/MainRightPanelShell.tsx` | Uses `MrpChatFirstAssistantSurface` |
| `screens/HomeScreen.tsx` | Chat-first props, question send handler, guidance to accordion |
| `lib/ui/executiveAssistantPanelTypes.ts` | `MRP_CHAT_FIRST_QUESTION_SUGGESTIONS` |

---

## 8. Build result

```
npm run build — PASS
```

---

## Definition of Done

| Criterion | Status |
|-----------|--------|
| Assistant no longer crowded | ✅ Chat-first layout |
| Chat input primary / visible without scroll | ✅ Pinned input strip |
| Suggested questions usable (send on click) | ✅ |
| Scenario/Decision preserved in support accordion | ✅ |
| Dashboard/MRP boundaries correct | ✅ |
| Build passes | ✅ |
