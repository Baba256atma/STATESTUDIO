/**
 * APP-2:11 — Executive Scenario Assistant follow-up topics and events.
 * Topic and event definitions only — no dialogue engine.
 */

export const EXECUTIVE_SCENARIO_ASSISTANT_TOPICS_VERSION = "APP-2/11" as const;

export type ExecutiveScenarioAssistantFollowUpTopicId =
  | "explain_recommendation"
  | "explain_priority"
  | "show_dependencies"
  | "explain_conflicts"
  | "explain_opportunities"
  | "show_evidence"
  | "compare_recommendations"
  | "show_assumptions"
  | "show_constraints";

export type ExecutiveScenarioAssistantFollowUpTopic = Readonly<{
  topicId: ExecutiveScenarioAssistantFollowUpTopicId;
  label: string;
  description: string;
  readOnly: true;
}>;

export type ExecutiveScenarioAssistantEventName =
  | "AssistantViewCreated"
  | "ConversationContextUpdated"
  | "RecommendationExplained"
  | "FollowUpRequested"
  | "EvidenceOpened"
  | "ScenarioChanged";

export type ExecutiveScenarioAssistantEvent = Readonly<{
  eventName: ExecutiveScenarioAssistantEventName;
  workspaceId: string;
  scenarioId: string | null;
  timestamp: string;
  readOnly: true;
}>;

export const EXECUTIVE_SCENARIO_ASSISTANT_FOLLOW_UP_TOPIC_DEFINITIONS = Object.freeze([
  Object.freeze({
    topicId: "explain_recommendation" as const,
    label: "Explain this recommendation",
    description: "Request explanation of a specific recommendation option from the certified portfolio.",
  }),
  Object.freeze({
    topicId: "explain_priority" as const,
    label: "Why is this high priority?",
    description: "Request explanation of executive priority based on certified summary evidence.",
  }),
  Object.freeze({
    topicId: "show_dependencies" as const,
    label: "Show dependency details",
    description: "Request dependency summary from certified executive intelligence.",
  }),
  Object.freeze({
    topicId: "explain_conflicts" as const,
    label: "Explain conflicts",
    description: "Request conflict summary from certified executive intelligence.",
  }),
  Object.freeze({
    topicId: "explain_opportunities" as const,
    label: "Explain opportunities",
    description: "Request opportunity summary from certified executive intelligence.",
  }),
  Object.freeze({
    topicId: "show_evidence" as const,
    label: "Show supporting evidence",
    description: "Request evidence references supporting the executive projection.",
  }),
  Object.freeze({
    topicId: "compare_recommendations" as const,
    label: "Compare recommendation options",
    description: "Request comparison of options within the certified recommendation portfolio.",
  }),
  Object.freeze({
    topicId: "show_assumptions" as const,
    label: "Show assumptions",
    description: "Request assumptions declared in the recommendation portfolio.",
  }),
  Object.freeze({
    topicId: "show_constraints" as const,
    label: "Show constraints",
    description: "Request constraints declared in the recommendation portfolio.",
  }),
] as const satisfies readonly Omit<ExecutiveScenarioAssistantFollowUpTopic, "readOnly">[]);

export const EXECUTIVE_SCENARIO_ASSISTANT_EVENT_NAMES = Object.freeze([
  "AssistantViewCreated",
  "ConversationContextUpdated",
  "RecommendationExplained",
  "FollowUpRequested",
  "EvidenceOpened",
  "ScenarioChanged",
] as const satisfies readonly ExecutiveScenarioAssistantEventName[]);

export function createExecutiveScenarioAssistantFollowUpTopic(
  input: Omit<ExecutiveScenarioAssistantFollowUpTopic, "readOnly">
): ExecutiveScenarioAssistantFollowUpTopic {
  return Object.freeze({ ...input, readOnly: true as const });
}

export function createExecutiveScenarioAssistantEvent(
  input: Omit<ExecutiveScenarioAssistantEvent, "readOnly">
): ExecutiveScenarioAssistantEvent {
  return Object.freeze({ ...input, readOnly: true as const });
}

export function buildExecutiveScenarioAssistantFollowUpTopics(
  options: Readonly<{
    hasSummary: boolean;
    hasPortfolio: boolean;
    hasRecommendations: boolean;
    hasAssumptions: boolean;
    hasConstraints: boolean;
  }>
): readonly ExecutiveScenarioAssistantFollowUpTopic[] {
  const topics: ExecutiveScenarioAssistantFollowUpTopic[] = [];

  for (const definition of EXECUTIVE_SCENARIO_ASSISTANT_FOLLOW_UP_TOPIC_DEFINITIONS) {
    const include =
      (definition.topicId === "explain_recommendation" && options.hasRecommendations) ||
      (definition.topicId === "explain_priority" && options.hasSummary) ||
      (definition.topicId === "show_dependencies" && options.hasSummary) ||
      (definition.topicId === "explain_conflicts" && options.hasSummary) ||
      (definition.topicId === "explain_opportunities" && options.hasSummary) ||
      (definition.topicId === "show_evidence" && options.hasSummary) ||
      (definition.topicId === "compare_recommendations" && options.hasRecommendations) ||
      (definition.topicId === "show_assumptions" && options.hasAssumptions) ||
      (definition.topicId === "show_constraints" && options.hasConstraints);

    if (include) {
      topics.push(createExecutiveScenarioAssistantFollowUpTopic(definition));
    }
  }

  return Object.freeze(topics);
}

export function describeExecutiveScenarioAssistantEvent(
  eventName: ExecutiveScenarioAssistantEventName
): string {
  switch (eventName) {
    case "AssistantViewCreated":
      return "ExecutiveScenarioAssistantView created from workspace view.";
    case "ConversationContextUpdated":
      return "Assistant conversation context updated from workspace projection.";
    case "RecommendationExplained":
      return "Recommendation explanation requested from certified portfolio.";
    case "FollowUpRequested":
      return "Follow-up topic selected for assistant conversation.";
    case "EvidenceOpened":
      return "Evidence reference opened from assistant projection.";
    case "ScenarioChanged":
      return "Active scenario changed in assistant conversation context.";
    default:
      return "Unknown assistant integration event.";
  }
}
