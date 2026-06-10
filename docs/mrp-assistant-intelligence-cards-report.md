# MRP:11:2:7 Assistant Intelligence Cards Report

## Summary

Added a compact Assistant intelligence card strip above the chat conversation. The surface is optional, capped at four cards, horizontally scroll-safe, and does not add a store, router, dashboard mode, assistant engine, or scene state.

## Card Hierarchy

Priority is derived in `assistantIntelligenceCardsRuntime.ts`:

1. Risk Signal becomes primary when the selected object or workspace impact is `high` or `critical`.
2. Executive Insight is primary for normal selected-object context and the default overview state.
3. Scenario rises when an active scenario or scenario conflict is present.
4. Recommendation stays available as the compact next-action card.

Visible card cap: `ASSISTANT_INTELLIGENCE_CARD_LIMIT = 4`.

## Runtime Inputs

Cards derive from:

- selected object id, label, type, and status
- active scenario id and label
- dashboard mode and dashboard context
- decision recommendation summary
- assistant context summary
- workspace recommendation context, including object signal, object impact, and scenario conflict

No canonical state moved into the Assistant. The cards are a pure projection of existing HomeScreen runtime inputs.

## Click-Action Routing

- Explain: sends the card prompt through the existing Assistant question handler.
- Analyze: reuses `launchAssistantActionCard` with `OPEN_ANALYZE`.
- Compare: reuses `launchAssistantActionCard` with `OPEN_COMPARE`.
- Simulate: reuses `OPEN_SCENARIO`; if no object target exists, falls back to the existing dashboard `setDashboardMode` scenario route.
- Open Dashboard: uses the existing MRP tab switch handler.

No new dashboard modes or routers were introduced.

## Object-Aware Behavior

No selected object shows executive overview cards. Selecting an object updates summaries and routes toward object-aware analysis. Risk objects prioritize the Risk Signal card. Active scenario context updates the Scenario card label and readiness badge.

## Assistant Boundary Validation

The Assistant remains chat-first:

- Cards render between `AssistantChatHeader` and `AssistantConversationArea`.
- The card strip has fixed compact sizing and horizontal overflow.
- Conversation and input remain flex-primary and are not remounted by card updates.
- No subscription, external store, or persistence mechanism was added.

## Runtime Traces

Added signature-gated dev trace:

```text
[AssistantIntelligenceCards]
selectedObject=node-1
scenario=null
cardCount=4
primaryCard=executive_insight
```

## Validation

Targeted runtime test:

```text
node --test app/lib/assistant/assistantIntelligenceCardsRuntime.test.ts
pass: 5
fail: 0
```

Build:

```text
npm run build
pass
```

Only existing `baseline-browser-mapping` age warnings appeared during build.
