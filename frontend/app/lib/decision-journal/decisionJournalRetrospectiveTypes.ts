/**
 * APP-8:6 — Decision Journal Retrospective domain types.
 * Read-only outcome and retrospective metadata over APP-8:3 query and APP-8:5 quality inputs.
 */

import type { DecisionJournalEngineEntry } from "./decisionJournalEngineTypes.ts";
import type {
  DecisionJournalValidationIssue,
  DecisionJournalValidationResult,
  DecisionWorkspaceId,
} from "./decisionJournalTypes.ts";

export const DECISION_JOURNAL_RETROSPECTIVE_CONTRACT_VERSION = "APP-8/6" as const;
export const DECISION_JOURNAL_RETROSPECTIVE_ARCHITECTURE_VERSION =
  "APP-8/6-journal-retrospective-arch" as const;

export const DECISION_JOURNAL_RETROSPECTIVE_TAGS = Object.freeze([
  "[APP8_6]",
  "[DECISION_JOURNAL_RETROSPECTIVE]",
  "[READ_ONLY]",
  "[OUTCOME_LEARNING]",
  "[NO_AI]",
  "[NO_PERSISTENCE]",
  "[NO_VISUALIZATION]",
  "[ARCHITECTURE_SAFE]",
] as const);

export const DECISION_JOURNAL_OUTCOME_STATUS_VALUES = Object.freeze([
  "not_observed",
  "aligned",
  "partially_aligned",
  "misaligned",
  "exceeded",
  "unknown",
] as const);

export const DECISION_JOURNAL_RETROSPECTIVE_FLAG_TYPES = Object.freeze([
  "no-observed-outcome",
  "outcome-aligned",
  "outcome-misaligned",
  "outcome-exceeded",
  "assumptions-verified",
  "assumptions-invalidated",
  "risk-realized",
  "evidence-reliable",
  "evidence-unreliable",
  "review-incomplete",
  "lessons-missing",
  "lessons-recorded",
] as const);

export const DECISION_JOURNAL_RETROSPECTIVE_FORBIDDEN_PATTERNS = Object.freeze([
  "decision-timeline/",
  "business-timeline/",
  "scenario-timeline/",
  "dashboard/",
  "assistant/",
  "components/",
  ".tsx",
  "JournalEditor",
  "JournalChart",
  "localStorage",
  "indexedDB",
  "fetch(",
  "openai",
  "prompt(",
] as const);

export type DecisionJournalOutcomeStatus = (typeof DECISION_JOURNAL_OUTCOME_STATUS_VALUES)[number];
export type DecisionJournalRetrospectiveFlagType = (typeof DECISION_JOURNAL_RETROSPECTIVE_FLAG_TYPES)[number];

export type DecisionJournalRetrospectiveFlag = Readonly<{
  type: DecisionJournalRetrospectiveFlagType;
  entryId: string;
  title: string;
  description: string;
  confidence: number;
  metadata: Readonly<Record<string, string>>;
  readOnly: true;
}>;

export type DecisionJournalOutcomeEvaluation = Readonly<{
  workspaceId: DecisionWorkspaceId;
  entryId: string;
  expectedOutcome: string;
  observedOutcome: string;
  outcomeStatus: DecisionJournalOutcomeStatus;
  confidence: number;
  metadata: Readonly<Record<string, string>>;
  readOnly: true;
}>;

export type DecisionJournalRetrospectiveModel = Readonly<{
  workspaceId: DecisionWorkspaceId;
  entryId: string;
  expectedOutcome: string;
  observedOutcome: string;
  outcomeStatus: DecisionJournalOutcomeStatus;
  retrospectiveNotes: string;
  lessonsLearned: readonly string[];
  assumptionAccuracy: number;
  riskRealization: number;
  evidenceReliability: number;
  reviewCompleteness: number;
  flags: readonly DecisionJournalRetrospectiveFlag[];
  confidence: number;
  metadata: Readonly<Record<string, string>>;
  readOnly: true;
}>;

export type DecisionJournalRetrospectiveWorkspaceMetadata = Readonly<{
  retrospectiveVersion: typeof DECISION_JOURNAL_RETROSPECTIVE_CONTRACT_VERSION;
  queryContractVersion: string;
  evidenceAssumptionContractVersion: string;
  includedArchived: boolean;
  readOnly: true;
}>;

export type DecisionJournalRetrospectiveWorkspaceModel = Readonly<{
  workspaceId: DecisionWorkspaceId;
  entryCount: number;
  generatedAt: string;
  retrospectives: readonly DecisionJournalRetrospectiveModel[];
  retrospectiveFlags: readonly DecisionJournalRetrospectiveFlag[];
  metadata: DecisionJournalRetrospectiveWorkspaceMetadata;
  contractVersion: typeof DECISION_JOURNAL_RETROSPECTIVE_CONTRACT_VERSION;
  readOnly: true;
}>;

export type BuildDecisionJournalRetrospectiveInput = Readonly<{
  workspaceId: DecisionWorkspaceId;
  generatedAt?: string;
  includeArchived?: boolean;
}>;

export type DecisionJournalRetrospectiveEngineState = Readonly<{
  engineId: "decision-journal-retrospective-engine";
  contractVersion: typeof DECISION_JOURNAL_RETROSPECTIVE_CONTRACT_VERSION;
  initialized: boolean;
  timestamp: string;
  readOnly: true;
}>;

export type DecisionJournalRetrospectiveResponse = Readonly<{
  success: boolean;
  reason: string;
  data: DecisionJournalRetrospectiveWorkspaceModel | null;
  readOnly: true;
}>;

export type DecisionJournalRetrospectiveCertificationCheck = Readonly<{
  id: string;
  title: string;
  passed: boolean;
  evidence: string;
  readOnly: true;
}>;

export type DecisionJournalRetrospectiveCertificationResult = Readonly<{
  certified: boolean;
  status: "PASS" | "FAIL";
  summary: string;
  checks: readonly DecisionJournalRetrospectiveCertificationCheck[];
  score: number;
  readOnly: true;
}>;

export type { DecisionJournalEngineEntry, DecisionJournalValidationIssue, DecisionJournalValidationResult };

export function retrospectiveSuccess(
  reason: string,
  data: DecisionJournalRetrospectiveWorkspaceModel
): DecisionJournalRetrospectiveResponse {
  return Object.freeze({ success: true, reason, data, readOnly: true as const });
}

export function retrospectiveFailure(reason: string): DecisionJournalRetrospectiveResponse {
  return Object.freeze({ success: false, reason, data: null, readOnly: true as const });
}
