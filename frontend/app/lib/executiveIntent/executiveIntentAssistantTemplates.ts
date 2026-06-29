/**
 * APP-3:12 — Executive Intent assistant response templates.
 * Deterministic presentation templates — no AI or prompt generation.
 */

import type { ExecutiveIntentReasoning } from "./executiveIntentReasoningTypes.ts";
import type {
  AssistantClarificationQuestionType,
  AssistantIntentSection,
  AssistantIntentSectionKey,
  AssistantIntentStatus,
} from "./executiveIntentAssistantTypes.ts";

export const EXECUTIVE_INTENT_ASSISTANT_TEMPLATES_VERSION = "APP-3/12-TEMPLATES-1" as const;

export const CLARIFICATION_QUESTION_TEMPLATES: Readonly<
  Record<AssistantClarificationQuestionType, string>
> = Object.freeze({
  deadline: "What deadline should this objective have?",
  target_value: "What target value do you want?",
  business_unit_owner: "Which business unit owns this objective?",
  department_responsible: "Which department is responsible?",
  constraint_clarification: "What constraints should apply to this objective?",
  classification_clarification: "How would you classify this objective more specifically?",
  general_unknown: "Can you provide more detail about this objective?",
});

export const ASSISTANT_SECTION_TITLES: Readonly<Record<AssistantIntentSectionKey, string>> =
  Object.freeze({
    overview: "Overview",
    intent: "Intent",
    state: "Current State",
    classification: "Classification",
    confidence: "Confidence",
    conflicts: "Conflicts",
    dependencies: "Dependencies",
    evolution: "Evolution",
    known_information: "Known Information",
    unknown_information: "Unknown Information",
    highlights: "Highlights",
    issues: "Open Issues",
    questions: "Clarification Questions",
    diagnostics: "Diagnostics",
  });

export function mapReasoningStatusToAssistantStatus(
  readinessState: ExecutiveIntentReasoning["readinessAssessment"]["state"] | null
): AssistantIntentStatus {
  switch (readinessState) {
    case "ready":
      return "ready";
    case "needs_clarification":
      return "needs_clarification";
    case "blocked":
      return "blocked";
    case "archived":
      return "archived";
    case "incomplete":
    case "not_ready":
      return "incomplete";
    default:
      return "unknown";
  }
}

export function templateOverviewSummary(reasoning: ExecutiveIntentReasoning): string {
  return `Executive intent "${reasoning.summary.intentLabel}" is currently ${reasoning.readinessAssessment.state.replace(/_/g, " ")} with ${reasoning.summary.confidenceLevel ?? "unknown"} understanding confidence.`;
}

export function templateNoIntentSummary(): string {
  return "No executive intent reasoning is available to present.";
}

export function templateIntentExplanation(reasoning: ExecutiveIntentReasoning): string {
  const section = reasoning.sections.find((entry) => entry.sectionKey === "intent_summary");
  return section?.content ?? reasoning.summary.intentLabel;
}

export function templateStateExplanation(reasoning: ExecutiveIntentReasoning): string {
  const section = reasoning.sections.find((entry) => entry.sectionKey === "current_state");
  return section?.content ?? reasoning.readinessAssessment.headline;
}

export function templateClassificationExplanation(reasoning: ExecutiveIntentReasoning): string {
  const primary = reasoning.sections.find((entry) => entry.sectionKey === "primary_classification");
  const secondary = reasoning.sections.find(
    (entry) => entry.sectionKey === "secondary_classifications"
  );
  if (!primary?.available) return "Classification is not available.";
  return secondary?.content
    ? `Primary: ${primary.content}. Secondary: ${secondary.content}.`
    : `Primary: ${primary.content}.`;
}

export function templateConfidenceExplanation(reasoning: ExecutiveIntentReasoning): string {
  const section = reasoning.sections.find((entry) => entry.sectionKey === "confidence_summary");
  return section?.content ?? "Confidence summary is unavailable.";
}

export function templateConflictExplanation(reasoning: ExecutiveIntentReasoning): string {
  const section = reasoning.sections.find((entry) => entry.sectionKey === "conflict_summary");
  if (!reasoning.flags.hasConflicts) return "No conflicts were reported in the reasoning model.";
  return section?.content ?? "Conflicts are present.";
}

export function templateDependencyExplanation(reasoning: ExecutiveIntentReasoning): string {
  const section = reasoning.sections.find((entry) => entry.sectionKey === "dependency_summary");
  if (!reasoning.flags.hasDependencies) return "No dependencies were reported in the reasoning model.";
  return section?.content ?? "Dependencies are present.";
}

export function templateEvolutionExplanation(reasoning: ExecutiveIntentReasoning): string {
  const section = reasoning.sections.find((entry) => entry.sectionKey === "evolution_summary");
  if (!reasoning.flags.hasEvolutionHistory) {
    return "No evolution history was included in the reasoning model.";
  }
  return section?.content ?? "Evolution history is present.";
}

export function templateKnownInformation(reasoning: ExecutiveIntentReasoning): string {
  const section = reasoning.sections.find((entry) => entry.sectionKey === "known_information");
  return section?.content ?? "No known information recorded.";
}

export function templateUnknownInformation(reasoning: ExecutiveIntentReasoning): string {
  const section = reasoning.sections.find((entry) => entry.sectionKey === "unknown_information");
  return section?.content ?? "No unknown information recorded.";
}

export function templateHighlights(reasoning: ExecutiveIntentReasoning): readonly string[] {
  return Object.freeze(reasoning.highlights.items.map((item) => `${item.label}: ${item.description}`));
}

export function templateOpenIssues(reasoning: ExecutiveIntentReasoning): readonly string[] {
  return Object.freeze(reasoning.issues.map((issue) => `${issue.label}: ${issue.description}`));
}

export function templateDiagnosticsBody(reasoning: ExecutiveIntentReasoning): string {
  return reasoning.diagnostics.map((entry) => `${entry.code}: ${entry.message}`).join("; ");
}

export function buildSectionFromTemplate(input: Readonly<{
  sectionKey: AssistantIntentSectionKey;
  body: string;
  available: boolean;
  sectionId: string;
}>): AssistantIntentSection {
  return Object.freeze({
    sectionId: input.sectionId,
    sectionKey: input.sectionKey,
    title: ASSISTANT_SECTION_TITLES[input.sectionKey],
    body: input.body,
    available: input.available,
    readOnly: true as const,
  });
}
