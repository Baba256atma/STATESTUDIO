# MRP:12:7 — Assistant Support Dock Restoration + Executive Side Utilities Recovery

**Phase:** MRP:12:7  
**Verdict:** PASS — executive support dock restored; chat-first architecture preserved  
**Date:** 2026-06-07

---

## 1. Problem

After MRP:12:5/MRP:12:6, the right-side Assistant Support Dock (utility icons + contextual panels) was removed during footer cleanup. Chat, suggested questions, and the Executive Command Dock remained operational, but executive utility discoverability regressed.

---

## 2. Restored Architecture

### Layout Contract

```
Assistant Surface
┌─────────────────────┐
│ Chat Messages       │
│                     │
│ [Support Panel]     │     💡 Insight
│ (when open)         │     📘 Scenario
│                     │     📊 Analytics
│                     │     ⚖ Governance
│                     │     ⚡ Actions
├─────────────────────┤
│ Chat Input          │
├─────────────────────┤
│ Suggested Questions │
├─────────────────────┤
│ Command Dock        │
└─────────────────────┘
```

### Utility Panels

| Icon | Panel | Content |
| --- | --- | --- |
| 💡 | Insight | Executive observations, context summary |
| 📘 | Scenario | Active scenario host + suggestions |
| 📊 | Analytics | Metrics/trends host or analysis summary |
| ⚖ | Governance | Risk/policy/runtime guidance |
| ⚡ | Actions | Recommended next actions |

### Single-Open Accordion

Only one support panel may be open at a time. Opening a new panel closes the previous panel.

---

## 3. Files

| File | Role |
| --- | --- |
| `assistant/AssistantSupportIconDock.tsx` | Right-rail utility icon dock (5 buttons) |
| `assistant/AssistantSupportPanelDock.tsx` | Contextual support panel content |
| `assistant/AssistantDockedSupportPanel.tsx` | Per-panel accordion wrapper |
| `assistant/AssistantPanelCollapseButton.tsx` | Panel collapse control |
| `assistant/AssistantSupportAccordion.tsx` | Chat + dock row + footer stack |
| `lib/assistant/assistantPanelDockContract.ts` | Panel IDs, labels, icons |
| `lib/assistant/assistantSupportAccordionContract.ts` | Single-open accordion contract |
| `lib/assistant/assistantSupportAccordionRuntime.ts` | Accordion state + MRP127 traces |
| `lib/assistant/mrp127RuntimeDiagnostics.ts` | Required runtime evidence logs |
| `lib/assistant/mrp127RuntimeDiagnostics.test.ts` | Vitest coverage for diagnostics |
| `MainRightPanelShell.tsx` | Governance/analytics summary props |
| `MrpChatFirstAssistantSurface.tsx` | Chat-first surface wiring |
| `HomeScreen.tsx` | Context/governance/analytics data feed |

---

## 4. Chat-First Protection

| Rule | Status |
| --- | --- |
| Chat remains primary surface | PASS |
| Support dock is secondary | PASS |
| Footer suggested questions preserved | PASS |
| Executive Command Dock preserved | PASS |
| No RightPanelHost restoration | PASS |
| No legacy dashboard/object panel hosts | PASS |
| No routing writes to selectedObjectId / dashboardMode / activeTab | PASS |

---

## 5. Runtime Evidence

Captured from automated test runs (`node --test`, `vitest`):

```
[MRP127Runtime]
AssistantSupportDock mounted

[MRP127Runtime]
SupportPanel opened
panel=Insight

[MRP127Runtime]
SupportPanel switched
Insight -> Scenario

[MRP127Runtime]
Accordion contract passed
openPanels=1
```

Additional accordion traces confirm single-open behavior:

```
[AssistantSupportAccordion]
openPanel=scenario
action=switch_from_insight

[AssistantPanelDockSnapshot]
stable=true
openPanelId=scenario
listenerCount=0
```

Stability gate after restoration:

```
[NexoraAssistantStabilityGate]
overall=pass
component=Accordion status=pass
component=SuggestedQuestions status=pass
```

---

## 6. Validation

| Check | Result |
| --- | --- |
| All 5 utility icons restored | PASS |
| Dock visible in Assistant layout | PASS |
| Single-open accordion | PASS (35/35 node tests) |
| MRP127 diagnostics | PASS (3/3 vitest) |
| TypeScript build | PASS (`npm run build`) |
| No legacy panel hosts | PASS |

---

## 7. Panel ID Migration

Legacy MRP:12:5 category IDs were replaced with executive utility IDs:

| Legacy | MRP:12:7 |
| --- | --- |
| suggestions | *(footer-only, not a dock panel)* |
| guidance | insight |
| scenario | scenario |
| decision | analytics |
| actions | actions |
| — | governance *(new)* |

---

## 8. Verdict

**MRP:12:7 = PASS**

Executive Support Dock restored on the Assistant tab with chat-first layout, single-open accordion, isolated runtime state, and required `[MRP127Runtime]` evidence captured.
