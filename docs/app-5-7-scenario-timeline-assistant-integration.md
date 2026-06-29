# APP-5:7 — Scenario Timeline Assistant Integration

## Overview

APP-5:7 integrates the Scenario Timeline Platform with the Executive Assistant through the certified **APP-5:6 API Layer only**.

This phase is **not** an AI reasoning engine. It prepares canonical timeline context, summaries, explanations, and structured answer payloads that the Assistant can consume. The Assistant interprets; APP-5:7 provides timeline knowledge.

## Canonical Architecture

```
APP-5:1 → Platform Foundation
APP-5:2 → Event Engine
APP-5:3 → Lifecycle Engine
APP-5:4 → History Engine
APP-5:5 → Query Engine
APP-5:6 → Public API Layer
APP-5:7 → Assistant Integration (this phase)
```

All timeline access for the Executive Assistant must pass through APP-5:7, which in turn consumes only APP-5:6 public APIs.

## Responsibilities

| Component | Purpose |
|---|---|
| Timeline Assistant Adapter | Wraps APP-5:6 public APIs exclusively |
| Timeline Context Builder | Produces immutable assistant context objects |
| Timeline Summary Builder | Narrative summaries from API data |
| Timeline Explanation Builder | Structured explanations (no LLM) |
| Timeline History Builder | History narratives and change records |
| Timeline Milestone Builder | Milestone views for assistant consumption |
| Timeline Status Builder | Lifecycle status and progress explanations |
| Timeline Change Builder | Recent stage transition records |
| Timeline Question Router | Maps supported questions to structured answers |
| Timeline Assistant Registry | In-memory context registration |
| Compatibility Manager | APP-5:1–5:6 contract readiness checks |
| Certification | Architecture boundary and regression validation |

## Public APIs

| API | Purpose |
|---|---|
| `buildScenarioTimelineAssistantContext()` | Full immutable assistant context |
| `buildScenarioTimelineSummary()` | Timeline summary view |
| `buildScenarioTimelineExplanation()` | Topic-based explanation |
| `buildScenarioTimelineHistoryExplanation()` | History narrative |
| `buildScenarioTimelineMilestones()` | Milestone list |
| `buildScenarioTimelineStatus()` | Status, stage, progress |
| `buildScenarioTimelineRecentChanges()` | Recent change records |
| `answerScenarioTimelineQuestion()` | Structured Q&A router |
| `validateScenarioTimelineAssistantContext()` | Context contract validation |
| `certifyScenarioTimelineAssistantIntegration()` | Full certification suite |

## Assistant Context Contract

Immutable context objects include:

- `scenarioId`, `workspaceId`
- `timelineSummary`, `timelineHistory`
- `currentStage`, `progress`, `status`
- `milestones`, `recentChanges`, `importantEvents`
- `historyDuration`, `completedStages`, `remainingStages`
- `warnings`, `diagnostics`, `platformVersion`, `metadata`
- `readOnly: true`

No UI properties, rendering properties, or LLM-specific prompts.

## Supported Questions

- What happened?
- What changed?
- What is the current stage?
- What milestones exist?
- What events occurred?
- What happened recently?
- How far has the scenario progressed?
- Which stages are completed?
- Which stages remain?
- What is the scenario history?
- What is the timeline summary?
- What is the latest event?
- What is blocking progress?
- How long has the scenario existed?

## Architecture Rules

- **Never bypass APP-5:6** — adapter imports only from `scenarioTimelineApiLayer.ts`
- **No direct engine/registry access**
- **No LLM prompting or recommendations**
- **No persistence, REST, GraphQL, UI, or chat state**

## Explicitly Forbidden

- LLM prompting, chat UI, conversation state
- Strategic recommendations or decision generation
- Dashboard, playback, persistence
- REST, GraphQL, notifications

## Certification

```bash
cd frontend && node --test app/lib/scenario-timeline/scenarioTimelineAssistantIntegration.test.ts
cd frontend && node --test app/lib/scenario-timeline/*.test.ts
```

Expected: 22/22 certification checks PASS, 81/81 APP-5 tests PASS.
