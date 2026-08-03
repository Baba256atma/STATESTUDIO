/**
 * Sprint 5 — Advisor domain types.
 */

import type { Exs1ObjectId } from "../exs1Types";
import type {
  ExecutiveModeId,
  ExecutiveNavId,
  ExecutiveTimelineLens,
} from "../shell/executiveCockpitTypes";

export type AdvisorConversationMode =
  | "Explain"
  | "Guide"
  | "Recommend"
  | "Summarize"
  | "Review"
  | "Prepare Decision";

export type AdvisorSuggestionKind =
  | "Recommendation"
  | "Question"
  | "Observation"
  | "Warning"
  | "Opportunity"
  | "Risk";

export type AdvisorProposalKind =
  | "Create Scenario"
  | "Approve Decision"
  | "Start Execution"
  | "Take Snapshot"
  | "Open Data Mapping"
  | "Focus Object"
  | "Open Journal"
  | "Open Objects"
  | "Open Model"
  | "Highlight Pack"
  | "Focus Timeline";

export type AdvisorProposalStatus = "pending" | "accepted" | "dismissed";

export type AdvisorReferenceKind =
  | "object"
  | "pack"
  | "timeline"
  | "scenario"
  | "decision"
  | "explorer";

export type AdvisorSuggestion = {
  readonly id: string;
  readonly kind: AdvisorSuggestionKind;
  readonly title: string;
  readonly body: string;
};

export type AdvisorProposal = {
  readonly id: string;
  readonly kind: AdvisorProposalKind;
  readonly title: string;
  readonly body: string;
  readonly status: AdvisorProposalStatus;
  readonly objectId?: Exs1ObjectId;
  readonly packId?: string;
  readonly scenarioId?: string;
  readonly decisionId?: string;
  readonly nav?: ExecutiveNavId;
  readonly lens?: ExecutiveTimelineLens;
};

export type AdvisorReference = {
  readonly id: string;
  readonly kind: AdvisorReferenceKind;
  readonly label: string;
  readonly objectId?: Exs1ObjectId;
  readonly packId?: string;
  readonly scenarioId?: string;
  readonly decisionId?: string;
  readonly nav?: ExecutiveNavId;
  readonly lens?: ExecutiveTimelineLens;
};

export type ExecutiveAdvisorContext = {
  readonly mode: ExecutiveModeId;
  readonly packId: string | null;
  readonly packTitle: string;
  readonly timelineLens: ExecutiveTimelineLens;
  readonly timelinePosition: number;
  readonly selectedObjectId: Exs1ObjectId | null;
  readonly selectedObjectLabel: string | null;
  readonly selectedObjectIds: readonly Exs1ObjectId[];
  readonly selectedObjectLabels?: readonly string[];
  readonly highlightedFieldTechnical?: string | null;
  readonly highlightedFieldDisplayName?: string | null;
  readonly scenarioId: string | null;
  readonly scenarioName: string | null;
  readonly decisionId: string | null;
  readonly decisionName: string | null;
  readonly decisionStatus: string | null;
  readonly executionStatus: string;
  readonly executionProgress: number;
  readonly blockedTaskNames: readonly string[];
  readonly monitoringHealth: string;
  readonly monitoringSummary: string;
  readonly alertTitles: readonly string[];
  readonly dataSourceId: string | null;
  readonly dataSourceName: string | null;
  readonly dataActive: boolean;
  readonly explorerNav: ExecutiveNavId;
  readonly explorerVisible: boolean;
  readonly goal: string;
};

export type AdvisorEngineResult = {
  readonly conversationMode: AdvisorConversationMode;
  readonly templateId: string;
  readonly assistTitle: string;
  readonly assistBody: string;
  readonly assistGuidance: string;
  readonly packPerspective: string;
  readonly accent: string;
  readonly suggestionCards: readonly string[];
  readonly suggestions: readonly AdvisorSuggestion[];
  readonly proposals: readonly AdvisorProposal[];
  readonly references: readonly AdvisorReference[];
  readonly insightTitle: string;
  readonly insightBody: string;
  readonly insightGuidance: string;
  readonly insightCards: readonly string[];
  readonly explanation: string;
};

export type AdvisorSessionMessage = {
  readonly id: string;
  readonly role: "advisor" | "manager";
  readonly text: string;
  readonly at: number;
};

export type AdvisorInspectorSnapshot = {
  readonly conversationMode: AdvisorConversationMode;
  readonly mode: ExecutiveModeId;
  readonly packTitle: string;
  readonly lastProposal: string | null;
  readonly pendingCount: number;
  readonly lastAdvisorEvent: string | null;
};
