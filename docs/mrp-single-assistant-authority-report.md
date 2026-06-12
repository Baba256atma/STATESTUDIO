# MRP:12:6 — Global Footer Chat Removal + Single Assistant Authority

**Phase:** MRP:12:6  
**Verdict:** PASS — footer chat removed; Assistant is sole conversational authority  
**Date:** 2026-06-07

---

## 1. Architecture Before / After

### Before

```
MRP → Assistant → Chat
Footer → Global Chat Input + Send
```

Duplicate conversational entry points split user attention and consumed workspace height.

### After

```
MRP → Assistant → Chat (sole authority)
Footer → REMOVED (Type-C clean mode)
```

All focus/chat routing redirects to the Assistant tab input.

---

## 2. Footer Component Inventory

| Component | Path | Action |
| --- | --- | --- |
| `BottomCommandDock` | `components/layout/nexora/BottomCommandDock.tsx` | **Not rendered** in Type-C clean mode |
| `#nexora-status-strip` footer host | `NexoraShell.tsx` | **Hidden** when no status strip + no bottom dock |
| `#nexora-bottom-command-dock` | `BottomCommandDock.tsx` | **Not mounted** when `shouldShowExecutiveBottomCommandDock()` is false |
| `nexora:focus-bottom-command-dock` | Legacy event | **Redirected** to `nexora:focus-assistant-chat` |

### Intentionally Preserved

| Item | Reason |
| --- | --- |
| `BottomCommandDock.tsx` source | Legacy non-Type-C layouts may still use it |
| `AssistantMessageInput` | MRP Assistant chat input (authority owner) |
| `nexora:submit-chat` listener | HomeScreen chat pipeline for non-footer sources |

---

## 3. Presentation Gate

`shouldShowExecutiveBottomCommandDock()` in `executiveWorkspacePresentation.ts`:

- Returns **false** when MRP right assistant is active (`shouldShowExecutiveRightAssistantPanel()`)
- Returns **false** when legacy left command panel is active
- Returns **true** only for legacy layouts without dedicated assistant panels

Type-C `/type-c`: footer dock **hidden**.

---

## 4. Focus Routing Migration

| Legacy event | New authority path |
| --- | --- |
| `nexora:focus-bottom-command-dock` | Redirected → `nexora:focus-assistant-chat` |
| `nexora:focus-assistant-chat` | Switch to Assistant tab, expand MRP, optional prefilled text |
| `nexora:focus-assistant-input` | Focus `AssistantMessageInput` textarea |

Updated call sites: `HomeScreen` war room / quick action handlers, `NexoraShell` executive verb `"ask"`.

---

## 5. Runtime Trace Evidence

Required logs (dev / non-production):

```
[NexoraAssistantAuthority]
footerChat=removed

[NexoraAssistantAuthority]
assistantChat=active

[NexoraAssistantAuthority]
singleAuthority=true
```

Runtime audit on assistant surface mount:

```
[NexoraAssistantAuthority]
footerChatMounted=false
assistantChatMounted=true
singleConversationalAuthority=true
```

---

## 6. Assistant Ownership Validation

| Surface | Owner | Status |
| --- | --- | --- |
| Chat input | `AssistantMessageInput` in MRP Assistant tab | **ACTIVE** |
| Suggested questions | `AssistantFooterActions` | **ACTIVE** |
| Insight cards | `ExecutiveAssistantPanel` chat-first stack | **ACTIVE** |
| Command dock | `AssistantCommandDock` | **ACTIVE** |
| Footer global chat | `BottomCommandDock` | **REMOVED** (Type-C) |

---

## 7. QA Validation

| # | Criterion | Result |
| --- | --- | --- |
| 1 | Assistant chat still works | **PASS** |
| 2 | Suggested questions still work | **PASS** |
| 3 | Insight cards still work | **PASS** |
| 4 | Command dock still works | **PASS** |
| 5 | No footer chat visible | **PASS** |
| 6 | No hydration mismatch | **PASS** |
| 7 | No runtime loop | **PASS** |
| 8 | No orphaned state writes | **PASS** |
| 9 | No runtime errors | **PASS** |

---

## 8. Build Validation

| Command | Result |
| --- | --- |
| `npm run build` (frontend) | **PASS** |
| `vitest run app/lib/ui/assistantAuthorityDiagnostics.test.ts` | **PASS** |
| `vitest run app/lib/ui/executiveWorkspacePresentation.test.ts` | **PASS** |

---

## 9. Acceptance Criteria

| Criterion | Status |
| --- | --- |
| Global footer chat completely removed (Type-C) | **PASS** |
| Assistant is only conversational interface | **PASS** |
| Additional vertical space recovered | **PASS** |
| No duplicated chat systems | **PASS** |
| Build passes | **PASS** |
| No runtime errors | **PASS** |

---

## 10. Manual Verification Checklist

On `/type-c`:

1. Confirm no footer input with supplier-delay placeholder and Send button.
2. Open **Assistant** tab — chat input, suggestions, insight cards, command dock present.
3. Trigger quick action / war room copilot prompt — Assistant tab focuses with prefilled text.
4. Dev console shows `[NexoraAssistantAuthority] singleAuthority=true` and audit `footerChatMounted=false`.
