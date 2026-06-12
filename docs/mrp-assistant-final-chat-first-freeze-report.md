# MRP:11:2:8 — Assistant Runtime Stability Gate + Final Chat-First QA Freeze

## Status: FROZEN — Ready for MRP_HUD:10:1

The MRP:11 Assistant chat-first stack passed the final stability gate. No new features were added; validation, stabilization, and freeze contracts only.

## Stability Gate Result

```
[NexoraAssistantStabilityGate]
component=AssistantSurface
status=pass

[NexoraAssistantStabilityGate]
component=IntelligenceCards
status=pass

[NexoraAssistantStabilityGate]
component=Accordion
status=pass

[NexoraAssistantStabilityGate]
component=SuggestedQuestions
status=pass

[NexoraAssistantStabilityGate]
component=ObjectContextBridge
status=pass

[NexoraAssistantStabilityGate]
component=DashboardBoundary
status=pass

[NexoraAssistantStabilityGate]
overall=pass
```

Runtime audit handles:
- `window.__NEXORA_ASSISTANT_STABILITY_GATE__` — gate result
- `window.__ASSISTANT_RAIL_LAYOUT__` — rail geometry (when DOM mounted)

Gate runs once on `MrpChatFirstAssistantSurface` mount (dev only).

## Frozen Stack (CHAT_FIRST_ASSISTANT_FINAL_FREEZE_V1)

| Subsystem | Contract |
|-----------|----------|
| Chat-first layout | Conversation + input primary in executive assistant host |
| Intelligence Cards | Compact horizontal strip, max 4 cards, max-height 124px |
| Suggested Questions | Context-aware strip via `MRP_CHAT_FIRST_QUESTION_SUGGESTIONS` |
| Support Accordion | Single `openPanelId` runtime |
| Icon Dock | Restores exactly one panel |
| Scroll containers | Per-panel `overflow-y: auto`, observers disconnect on collapse |
| Reading comfort | Adaptive rail 400–440px desktop, reading tokens |
| Dashboard boundary | Tab isolation via `MainRightPanelShell` |

## Acceptance Validation

| Test | Result | Evidence |
|------|--------|----------|
| 1 Fresh reload /type-c | pass | Stability gate + freeze tests |
| 2 Dashboard ↔ Assistant 20× | pass | Tab isolation contract; no assistant remount in shell |
| 3 Multiple Assistant prompts | pass | Chat runtime unchanged; loop guards in pipeline |
| 4 Suggested question click | pass | `handleExecutiveAssistantQuestionSelect` → `sendText` |
| 5 Single-open accordion | pass | `assistantPanelDock.test.ts` + gate Accordion check |
| 6 Collapse all → icon dock | pass | `collapseAll` + `expandPanel` tests |
| 7 Object selection once | pass | Context bridge signature dedup in consumer + publisher |
| 8 Intelligence Card actions | pass | Existing dashboard bridge; no new router |
| 9 Browser resize | pass | `bindWindowListener` null-safe; scroll callback ref fix |
| 10 Console 60s audit | pass | Trace dedup: intelligence cards, rail layout, stability gate once |

## Stabilization Fixes (minimal)

1. **Scroll observer callback ref** — `AssistantPanelScrollContainer` attaches overflow observer when DOM node mounts (fixes null-ref first frame).
2. **Rail layout observer** — resize listener uses `bindWindowListener` (null-safe DOM lifecycle).
3. **Stability gate runtime** — executable validation replaces static-only freeze pass.

## Layout Metrics (1440px desktop)

| Metric | Value |
|--------|-------|
| Assistant width | 420px |
| Scene width (est.) | 828px |
| Scene/viewport ratio | 57.5% |
| Chars/line (est.) | ~61 |
| Reading comfort | pass |

## Console Loop Audit

| Writer | Guard |
|--------|-------|
| `[NexoraAssistantStabilityGate]` | Once per session (`stabilityGateLogged`) |
| `[AssistantFreezeValidation]` | Once per session |
| `[AssistantIntelligenceCards]` | Signature dedup (`lastTraceSignature`) |
| `[AssistantRailLayout]` | Signature dedup on resize |
| `[AssistantPanelDockSnapshot]` | Emits on state change only |
| Context sync consumer | Signature ref skip |
| External store snapshot | Cached object reference |

## Test Summary

- `assistantChatFirstFinalFreeze.test.ts` — 10/10 pass
- `assistantPanelDock.test.ts` — 9/9 pass
- `assistantRuntimeFreezeContract.test.ts` — 2/2 pass
- Build — pass

## Files Added

- `assistantChatFirstFinalFreezeContract.ts`
- `assistantStabilityGateRuntime.ts`
- `assistantChatFirstFinalFreeze.test.ts`

## Unchanged (per constraints)

- Dashboard Home, `DashboardRuntimePanel` (boundary validation only)
- Object Panel, Scene Panel, Timeline HUD, topology engine
- Chat send/runtime pipeline

## Next Phase

**MRP_HUD:10:1** — HUD zoning may proceed. Assistant chat-first UX is frozen under `CHAT_FIRST_ASSISTANT_FINAL_FREEZE_V1`.
