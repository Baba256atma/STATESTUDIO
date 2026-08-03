/**
 * Phase B — Executive Signal domain types.
 */

import type { Exs1ObjectId } from "../exs1Types";
import type { ExecutiveModeId } from "../shell/executiveCockpitTypes";
import type { ExecutiveRuntimeEventType } from "../runtime/ExecutiveRuntimeEvents";

export type ExecutiveSignalType =
  | "Information"
  | "Observation"
  | "Opportunity"
  | "Warning"
  | "Critical"
  | "Decision Required";

export type ExecutiveSignalSeverity = "Low" | "Medium" | "High" | "Critical";

export type ExecutiveSignalLifecycle =
  | "New"
  | "Acknowledged"
  | "In Review"
  | "Resolved"
  | "Archived";

export type ExecutiveChangeRecord = {
  readonly changeId: string;
  readonly eventType: ExecutiveRuntimeEventType;
  readonly at: number;
  readonly fromValue: string | null;
  readonly toValue: string | null;
  readonly summary: string;
};

export type ExecutiveContextAnalysis = {
  readonly workspace: ExecutiveModeId;
  readonly goal: string;
  readonly packId: string | null;
  readonly packTitle: string;
  readonly timelineLens: string;
  readonly timelinePosition: number;
  readonly domainNames: readonly string[];
  readonly selectedObjectId: Exs1ObjectId | null;
};

export type ExecutiveRelationshipAnalysis = {
  readonly affectedObjectIds: readonly Exs1ObjectId[];
  readonly relatedObjectIds: readonly Exs1ObjectId[];
  readonly relatedDomainNames: readonly string[];
  readonly relatedKpiNames: readonly string[];
  readonly relatedDecisionIds: readonly string[];
};

export type ExecutiveSignal = {
  readonly signalId: string;
  readonly type: ExecutiveSignalType;
  readonly severity: ExecutiveSignalSeverity;
  readonly sourceEvent: ExecutiveRuntimeEventType;
  readonly sourceSummary: string;
  readonly relatedObjectIds: readonly Exs1ObjectId[];
  readonly relatedPackId: string | null;
  readonly relatedPackTitle: string;
  readonly relatedTimeline: string;
  readonly summary: string;
  readonly suggestedWorkspace: ExecutiveModeId;
  readonly suggestedAction: string;
  readonly timestamp: number;
  readonly lifecycle: ExecutiveSignalLifecycle;
  readonly unread: boolean;
  readonly domainNames: readonly string[];
  readonly changeId: string;
};

export type ExecutiveRecommendationContext = {
  readonly signalId: string | null;
  readonly type: ExecutiveSignalType | "Idle";
  readonly severity: ExecutiveSignalSeverity | "Low";
  readonly focusObjectId: Exs1ObjectId | null;
  readonly focusObjectLabel: string | null;
  readonly domainNames: readonly string[];
  readonly workspace: ExecutiveModeId;
  readonly packTitle: string;
  readonly relatedDecisionId: string | null;
  readonly relatedDecisionName: string | null;
  readonly suggestedWorkspace: ExecutiveModeId;
  readonly suggestedAction: string;
  readonly why: string;
  readonly impact: string;
  readonly nextStep: string;
};

export type IntelligenceJournalEntry = {
  readonly id: string;
  readonly signalId: string;
  readonly summary: string;
  readonly reason: string;
  readonly objects: string;
  readonly context: string;
  readonly recommendation: string;
  readonly createdDate: string;
};

export type IntelligenceFilter =
  | "All"
  | "Warnings"
  | "Critical"
  | "Decision Required"
  | "Resolved"
  | "My Attention";

export type IntelligenceSection =
  | "Signals"
  | "Attention"
  | "Recommendations"
  | "History";
