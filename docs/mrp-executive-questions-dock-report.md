# MRP:12:8 — Executive Questions Dock + Suggested Questions Side Panel

**Phase:** MRP:12:8  
**Verdict:** PASS — suggested questions relocated to support dock panel  
**Date:** 2026-06-07

---

## 1. Problem

Suggested Questions were rendered inline below the chat area, consuming conversation space and mixing executive guidance UI with the primary chat surface.

---

## 2. Solution

### Support Dock (6 utilities)

| Icon | Panel |
| --- | --- |
| 💡 | Insight |
| 📘 | Scenario |
| 📊 | Analytics |
| ⚖ | Governance |
| ⚡ | Actions |
| ❓ | Executive Questions |

### Relocation

- **Removed** inline `AssistantSuggestedQuestionsStrip` from the assistant footer
- **Added** `AssistantExecutiveQuestionsPanel` inside the Questions support panel
- Footer now contains **Executive Command Dock only**

### Prompt Injection

Clicking a question calls the existing `handleExecutiveAssistantQuestionSelect` path:

1. `setInput(question)`
2. `sendText(question)`

Assistant responds normally.

---

## 3. Files

| File | Change |
| --- | --- |
| `assistant/AssistantExecutiveQuestionsPanel.tsx` | New Questions panel content |
| `assistant/AssistantFooterActions.tsx` | Removed inline suggested questions |
| `assistant/AssistantSupportPanelDock.tsx` | Added questions panel section |
| `assistant/AssistantSupportAccordion.tsx` | Routes questions to panel dock |
| `lib/assistant/assistantSupportAccordionContract.ts` | Added `questions` panel id |
| `lib/assistant/assistantPanelDockContract.ts` | Added ❓ Executive Questions |
| `lib/assistant/mrp128RuntimeDiagnostics.ts` | Required runtime traces |
| `lib/assistant/mrp128RuntimeDiagnostics.test.ts` | Vitest coverage |

---

## 4. Runtime Evidence

```
[MRP128Runtime]
QuestionsPanel mounted

[MRP128Runtime]
Question injected
question="What scenario should I compare?"

[MRP128Runtime]
SingleOpenContract passed
openPanels=1
```

Accordion switch evidence:

```
[MRP127Runtime]
SupportPanel switched
Insight -> Executive Questions
```

---

## 5. Validation

| Check | Result |
| --- | --- |
| Questions removed from chat surface | PASS |
| ❓ Questions dock icon added | PASS |
| Questions panel opens correctly | PASS |
| Prompt injection wired | PASS |
| Single-open accordion preserved | PASS (37/37 node tests) |
| MRP128 diagnostics | PASS (4/4 vitest) |
| TypeScript build | PASS |
| Stability gate | PASS |

---

## 6. Verdict

**MRP:12:8 = PASS**

Suggested questions relocated to the Executive Questions support panel. Chat surface is cleaner and conversation-focused while preserving click-to-inject behavior and single-open accordion rules.
