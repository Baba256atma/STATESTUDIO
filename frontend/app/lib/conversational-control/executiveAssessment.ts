/**
 * CC:8 — Executive assessment contracts (pre-recommendation).
 */

import type { NexoraExecutiveEvidenceReference } from "./executiveRecommendation.ts";

export type NexoraExecutiveAssessmentIssue = {
  readonly issueId: string;
  readonly subjectId: string;
  readonly summary: string;
  readonly severity: "normal" | "elevated" | "important" | "critical";
  readonly evidenceRefs: readonly NexoraExecutiveEvidenceReference[];
};

export type NexoraExecutiveAssessmentOpportunity = {
  readonly opportunityId: string;
  readonly subjectId: string;
  readonly summary: string;
  readonly evidenceRefs: readonly NexoraExecutiveEvidenceReference[];
};

export type NexoraExecutiveConstraint = {
  readonly constraintId: string;
  readonly subjectId: string;
  readonly summary: string;
  readonly linkedGoalId: string | null;
  readonly evidenceRefs: readonly NexoraExecutiveEvidenceReference[];
};

export type NexoraExecutiveConflict = {
  readonly conflictId: string;
  readonly summary: string;
  readonly subjectIds: readonly string[];
  readonly evidenceRefs: readonly NexoraExecutiveEvidenceReference[];
};

export type NexoraExecutivePrioritySignal = {
  readonly signalId: string;
  readonly subjectId: string;
  readonly rank: number;
  readonly code: string;
  readonly evidenceRefs: readonly NexoraExecutiveEvidenceReference[];
};

export type NexoraExecutiveAssessment = {
  readonly primarySubjectId: string | null;
  readonly issues: readonly NexoraExecutiveAssessmentIssue[];
  readonly opportunities: readonly NexoraExecutiveAssessmentOpportunity[];
  readonly constraints: readonly NexoraExecutiveConstraint[];
  readonly conflicts: readonly NexoraExecutiveConflict[];
  readonly uncertainties: readonly import("./executiveRecommendation.ts").NexoraExecutiveUncertainty[];
  readonly prioritySignals: readonly NexoraExecutivePrioritySignal[];
};
