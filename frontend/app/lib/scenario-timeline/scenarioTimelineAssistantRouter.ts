/**
 * APP-5:7 — Scenario Timeline Assistant question router.
 */

import {
  SCENARIO_TIMELINE_ASSISTANT_INTEGRATION_CONTRACT_VERSION,
  SCENARIO_TIMELINE_ASSISTANT_QUESTION_KEYS,
} from "./scenarioTimelineAssistantConstants.ts";
import { buildScenarioTimelineAssistantContext } from "./scenarioTimelineAssistantContext.ts";
import { buildScenarioTimelineExplanation } from "./scenarioTimelineAssistantExplanation.ts";
import { describeWhatChanged, buildScenarioTimelineHistoryExplanation } from "./scenarioTimelineAssistantHistory.ts";
import { buildScenarioTimelineStatusExplanation } from "./scenarioTimelineAssistantSummary.ts";
import type {
  ScenarioTimelineAssistantAnswer,
  ScenarioTimelineAssistantContext,
  ScenarioTimelineAssistantIntegrationInput,
  ScenarioTimelineAssistantIntegrationResult,
  ScenarioTimelineAssistantQuestionKey,
} from "./scenarioTimelineAssistantTypes.ts";

const QUESTION_LABELS: Record<ScenarioTimelineAssistantQuestionKey, string> = {
  what_happened: "What happened?",
  what_changed: "What changed?",
  current_stage: "What is the current stage?",
  milestones: "What milestones exist?",
  events_occurred: "What events occurred?",
  recent_activity: "What happened recently?",
  progress: "How far has the scenario progressed?",
  completed_stages: "Which stages are completed?",
  remaining_stages: "Which stages remain?",
  scenario_history: "What is the scenario history?",
  timeline_summary: "What is the timeline summary?",
  latest_event: "What is the latest event?",
  blocking_progress: "What is blocking progress?",
  history_duration: "How long has the scenario existed?",
};

function resolveQuestionKey(question: string): ScenarioTimelineAssistantQuestionKey | null {
  const normalized = question.trim().toLowerCase();
  const direct = SCENARIO_TIMELINE_ASSISTANT_QUESTION_KEYS.find((key) => key === normalized);
  if (direct) {
    return direct;
  }
  const labelMatch = (Object.entries(QUESTION_LABELS) as [ScenarioTimelineAssistantQuestionKey, string][]).find(
    ([, label]) => label.toLowerCase() === normalized
  );
  return labelMatch?.[0] ?? null;
}

function formatStageList(stages: readonly string[]): string {
  if (stages.length === 0) {
    return "none";
  }
  return stages.join(", ");
}

function answerFromContext(
  questionKey: ScenarioTimelineAssistantQuestionKey,
  context: ScenarioTimelineAssistantContext,
  input: ScenarioTimelineAssistantIntegrationInput
): string {
  switch (questionKey) {
    case "what_happened":
      return context.timelineSummary;
    case "what_changed":
      return describeWhatChanged(context.recentChanges);
    case "current_stage":
      return context.currentStage ?? "No current stage is recorded.";
    case "milestones":
      return context.milestones.length === 0
        ? "No milestones are recorded."
        : context.milestones.map((entry) => `${entry.title} (${entry.stage ?? "unknown"})`).join("; ");
    case "events_occurred":
      return context.timelineHistory.length === 0
        ? "No timeline events are recorded."
        : context.timelineHistory.map((event) => `${event.title} [${event.stage}]`).join("; ");
    case "recent_activity": {
      const recent = context.timelineHistory.slice(-3);
      return recent.length === 0
        ? "No recent timeline activity."
        : recent.map((event) => `${event.timestamp}: ${event.title}`).join("; ");
    }
    case "progress":
      return context.progress === null
        ? "Progress is unavailable."
        : `${context.progress}% complete at stage ${context.currentStage ?? "unknown"}.`;
    case "completed_stages":
      return `Completed stages: ${formatStageList(context.completedStages)}.`;
    case "remaining_stages":
      return `Remaining stages: ${formatStageList(context.remainingStages)}.`;
    case "scenario_history":
      return buildScenarioTimelineHistoryExplanation({
        scenarioId: input.scenarioId,
        events: context.timelineHistory,
        duration: context.historyDuration,
      });
    case "timeline_summary":
      return context.timelineSummary;
    case "latest_event": {
      const latest = context.timelineHistory.at(-1);
      return latest
        ? `Latest event: ${latest.title} at ${latest.timestamp} (${latest.stage}).`
        : "No latest event is recorded.";
    }
    case "blocking_progress":
      return context.status === "blocked"
        ? buildScenarioTimelineStatusExplanation({
            scenarioId: input.scenarioId,
            status: context.status,
            currentStage: context.currentStage,
            progress: context.progress,
            isBlocked: true,
          })
        : "Nothing is blocking timeline progress according to current status.";
    case "history_duration":
      return context.historyDuration === null
        ? "Timeline duration is unavailable."
        : `Scenario timeline spans ${Math.round(context.historyDuration / 1000)} seconds.`;
    default:
      return context.timelineSummary;
  }
}

export function answerScenarioTimelineQuestion(input: {
  scenarioId: string;
  workspaceId: string;
  question?: string;
  questionKey?: ScenarioTimelineAssistantQuestionKey;
  metadata?: Readonly<Record<string, string>>;
}): ScenarioTimelineAssistantIntegrationResult<ScenarioTimelineAssistantAnswer> {
  const integrationInput = Object.freeze({
    scenarioId: input.scenarioId,
    workspaceId: input.workspaceId,
    metadata: input.metadata,
  });

  const contextResult = buildScenarioTimelineAssistantContext(integrationInput);
  if (!contextResult.success || !contextResult.data) {
    return Object.freeze({
      success: false,
      reason: contextResult.reason,
      data: null,
      readOnly: true as const,
    });
  }

  const questionKey = input.questionKey ?? (input.question ? resolveQuestionKey(input.question) : null);
  if (!questionKey) {
    return Object.freeze({
      success: false,
      reason: `Unsupported timeline question. Supported keys: ${SCENARIO_TIMELINE_ASSISTANT_QUESTION_KEYS.join(", ")}.`,
      data: null,
      readOnly: true as const,
    });
  }

  const context = contextResult.data;
  const answer = Object.freeze({
    questionKey,
    question: QUESTION_LABELS[questionKey],
    answer: answerFromContext(questionKey, context, integrationInput),
    context,
    readOnly: true as const,
  });

  return Object.freeze({
    success: true,
    reason: "Scenario timeline question answered.",
    data: answer,
    readOnly: true as const,
  });
}

export function listScenarioTimelineAssistantQuestions(): readonly ScenarioTimelineAssistantQuestionKey[] {
  return SCENARIO_TIMELINE_ASSISTANT_QUESTION_KEYS;
}

export const ScenarioTimelineAssistantRouter = Object.freeze({
  answerScenarioTimelineQuestion,
  listScenarioTimelineAssistantQuestions,
  contractVersion: SCENARIO_TIMELINE_ASSISTANT_INTEGRATION_CONTRACT_VERSION,
});
