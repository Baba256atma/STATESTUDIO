/**
 * APP-2:11 — Executive Scenario Assistant view types.
 * Conversational projection models — no UI or chat runtime artifacts.
 */

import type {
  ScenarioIntelligenceScenarioId,
  ScenarioIntelligenceWorkspaceId,
} from "./scenarioIntelligenceTypes.ts";
import type { ExecutiveRecommendationPortfolio } from "./executiveRecommendationResult.ts";
import type { ExecutiveScenarioAssistantDiagnostic } from "./executiveScenarioAssistantDiagnostics.ts";
import type { ExecutiveScenarioAssistantFollowUpTopic } from "./executiveScenarioAssistantTopics.ts";
import type { ExecutiveScenarioWorkspaceView } from "./executiveScenarioWorkspaceView.ts";

export const EXECUTIVE_SCENARIO_ASSISTANT_ADAPTER_VERSION = "APP-2/11" as const;

export type ExecutiveScenarioAssistantStatus = "ready" | "partial" | "unavailable";

export type ExecutiveScenarioAssistantExplanationSectionKind =
  | "executive_situation"
  | "executive_priority"
  | "dependencies"
  | "conflicts"
  | "opportunities"
  | "risks"
  | "kpis"
  | "recommendation_overview";

export type ExecutiveScenarioAssistantEvidenceSource =
  | "summary"
  | "recommendation_portfolio"
  | "priority"
  | "dependency_graph"
  | "conflict_graph"
  | "opportunity_graph";

export type ExecutiveScenarioAssistantExplanationSection = Readonly<{
  sectionId: string;
  kind: ExecutiveScenarioAssistantExplanationSectionKind;
  title: string;
  content: string;
  readOnly: true;
}>;

export type ExecutiveScenarioAssistantEvidenceReference = Readonly<{
  evidenceRefId: string;
  source: ExecutiveScenarioAssistantEvidenceSource;
  sourceRef: string;
  summary: string;
  readOnly: true;
}>;

export type ExecutiveScenarioAssistantConversationContext = Readonly<{
  workspaceId: ScenarioIntelligenceWorkspaceId;
  scenarioId: ScenarioIntelligenceScenarioId | null;
  packageId: string | null;
  packageVersion: string | null;
  workspaceAdapterVersion: string | null;
  selectionState: string;
  refreshState: string;
  readOnly: true;
}>;

export type ExecutiveScenarioAssistantView = Readonly<{
  workspaceId: ScenarioIntelligenceWorkspaceId;
  scenarioId: ScenarioIntelligenceScenarioId | null;
  assistantStatus: ExecutiveScenarioAssistantStatus;
  adapterVersion: typeof EXECUTIVE_SCENARIO_ASSISTANT_ADAPTER_VERSION;
  conversationContext: ExecutiveScenarioAssistantConversationContext;
  executiveHeadline: string;
  executiveSituation: string;
  recommendationPortfolio: ExecutiveRecommendationPortfolio | null;
  explanationSections: readonly ExecutiveScenarioAssistantExplanationSection[];
  followUpTopics: readonly ExecutiveScenarioAssistantFollowUpTopic[];
  evidenceReferences: readonly ExecutiveScenarioAssistantEvidenceReference[];
  diagnostics: readonly ExecutiveScenarioAssistantDiagnostic[];
  generatedAt: string;
  readOnly: true;
}>;

export type ExecutiveScenarioAssistantAdapterRequest = Readonly<{
  workspaceView: ExecutiveScenarioWorkspaceView;
  generatedAt: string;
  workspaceId?: ScenarioIntelligenceWorkspaceId;
}>;

export const EXECUTIVE_SCENARIO_ASSISTANT_EXPLANATION_SECTION_KINDS = Object.freeze([
  "executive_situation",
  "executive_priority",
  "dependencies",
  "conflicts",
  "opportunities",
  "risks",
  "kpis",
  "recommendation_overview",
] as const satisfies readonly ExecutiveScenarioAssistantExplanationSectionKind[]);

export function createExecutiveScenarioAssistantExplanationSection(
  input: Omit<ExecutiveScenarioAssistantExplanationSection, "readOnly">
): ExecutiveScenarioAssistantExplanationSection {
  return Object.freeze({ ...input, readOnly: true as const });
}

export function createExecutiveScenarioAssistantEvidenceReference(
  input: Omit<ExecutiveScenarioAssistantEvidenceReference, "readOnly">
): ExecutiveScenarioAssistantEvidenceReference {
  return Object.freeze({ ...input, readOnly: true as const });
}

export function createExecutiveScenarioAssistantConversationContext(
  input: Omit<ExecutiveScenarioAssistantConversationContext, "readOnly">
): ExecutiveScenarioAssistantConversationContext {
  return Object.freeze({ ...input, readOnly: true as const });
}

export function createExecutiveScenarioAssistantView(
  input: Omit<ExecutiveScenarioAssistantView, "readOnly">
): ExecutiveScenarioAssistantView {
  return Object.freeze({
    ...input,
    readOnly: true as const,
  });
}

export function createUnavailableExecutiveScenarioAssistantView(
  workspaceId: ScenarioIntelligenceWorkspaceId,
  generatedAt: string,
  diagnostics: readonly ExecutiveScenarioAssistantDiagnostic[]
): ExecutiveScenarioAssistantView {
  return createExecutiveScenarioAssistantView({
    workspaceId,
    scenarioId: null,
    assistantStatus: "unavailable",
    adapterVersion: EXECUTIVE_SCENARIO_ASSISTANT_ADAPTER_VERSION,
    conversationContext: createExecutiveScenarioAssistantConversationContext({
      workspaceId,
      scenarioId: null,
      packageId: null,
      packageVersion: null,
      workspaceAdapterVersion: null,
      selectionState: "unavailable",
      refreshState: "unavailable",
    }),
    executiveHeadline: "Executive intelligence unavailable.",
    executiveSituation: "Workspace view is not available for assistant projection.",
    recommendationPortfolio: null,
    explanationSections: Object.freeze([]),
    followUpTopics: Object.freeze([]),
    evidenceReferences: Object.freeze([]),
    diagnostics,
    generatedAt,
  });
}
