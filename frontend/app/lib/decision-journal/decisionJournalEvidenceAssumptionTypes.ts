/**
 * APP-8:5 — Decision Journal Evidence + Assumption domain types.
 * Read-only reasoning-quality metadata over APP-8:3 query and APP-8:4 reflection inputs.
 */

import type { DecisionJournalEngineEntry } from "./decisionJournalEngineTypes.ts";
import type {
  DecisionJournalValidationIssue,
  DecisionJournalValidationResult,
  DecisionWorkspaceId,
} from "./decisionJournalTypes.ts";

export const DECISION_JOURNAL_EVIDENCE_ASSUMPTION_CONTRACT_VERSION = "APP-8/5" as const;
export const DECISION_JOURNAL_EVIDENCE_ASSUMPTION_ARCHITECTURE_VERSION =
  "APP-8/5-journal-evidence-assumption-arch" as const;

export const DECISION_JOURNAL_EVIDENCE_ASSUMPTION_TAGS = Object.freeze([
  "[APP8_5]",
  "[DECISION_JOURNAL_EVIDENCE_ASSUMPTION]",
  "[READ_ONLY]",
  "[REASONING_QUALITY]",
  "[NO_AI]",
  "[NO_PERSISTENCE]",
  "[NO_VISUALIZATION]",
  "[ARCHITECTURE_SAFE]",
] as const);

export const DECISION_JOURNAL_EVIDENCE_STRENGTH_VALUES = Object.freeze([
  "none",
  "weak",
  "moderate",
  "strong",
  "very_strong",
] as const);

export const DECISION_JOURNAL_ASSUMPTION_COVERAGE_VALUES = Object.freeze([
  "none",
  "low",
  "medium",
  "high",
  "excessive",
] as const);

export const DECISION_JOURNAL_QUALITY_FLAG_TYPES = Object.freeze([
  "no-evidence",
  "weak-evidence",
  "high-confidence-weak-evidence",
  "many-assumptions",
  "no-assumptions",
  "unsupported-assumption",
  "risk-without-evidence",
  "assumption-risk-overlap",
  "evidence-balanced",
  "evidence-strong",
] as const);

export const DECISION_JOURNAL_EVIDENCE_ASSUMPTION_FORBIDDEN_PATTERNS = Object.freeze([
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

export type DecisionJournalEvidenceStrength = (typeof DECISION_JOURNAL_EVIDENCE_STRENGTH_VALUES)[number];
export type DecisionJournalAssumptionCoverage = (typeof DECISION_JOURNAL_ASSUMPTION_COVERAGE_VALUES)[number];
export type DecisionJournalQualityFlagType = (typeof DECISION_JOURNAL_QUALITY_FLAG_TYPES)[number];

export type DecisionJournalQualityFlag = Readonly<{
  type: DecisionJournalQualityFlagType;
  entryId: string;
  title: string;
  description: string;
  confidence: number;
  metadata: Readonly<Record<string, string>>;
  readOnly: true;
}>;

export type DecisionJournalEvidenceModel = Readonly<{
  workspaceId: DecisionWorkspaceId;
  entryId: string;
  evidenceCount: number;
  evidenceReferences: readonly string[];
  evidenceStrength: DecisionJournalEvidenceStrength;
  evidenceCoverage: number;
  unsupportedFields: readonly string[];
  confidenceEvidenceAlignment: number;
  riskEvidenceAlignment: number;
  flags: readonly DecisionJournalQualityFlag[];
  confidence: number;
  metadata: Readonly<Record<string, string>>;
  readOnly: true;
}>;

export type DecisionJournalAssumptionModel = Readonly<{
  workspaceId: DecisionWorkspaceId;
  entryId: string;
  assumptionCount: number;
  assumptions: readonly string[];
  assumptionCoverage: DecisionJournalAssumptionCoverage;
  repeatedAssumptions: readonly string[];
  unsupportedAssumptions: readonly string[];
  assumptionRiskOverlap: readonly string[];
  flags: readonly DecisionJournalQualityFlag[];
  confidence: number;
  metadata: Readonly<Record<string, string>>;
  readOnly: true;
}>;

export type DecisionJournalEvidenceAssumptionMetadata = Readonly<{
  qualityVersion: typeof DECISION_JOURNAL_EVIDENCE_ASSUMPTION_CONTRACT_VERSION;
  queryContractVersion: string;
  reflectionContractVersion: string;
  includedArchived: boolean;
  readOnly: true;
}>;

export type DecisionJournalEvidenceAssumptionModel = Readonly<{
  workspaceId: DecisionWorkspaceId;
  entryCount: number;
  generatedAt: string;
  evidenceModels: readonly DecisionJournalEvidenceModel[];
  assumptionModels: readonly DecisionJournalAssumptionModel[];
  qualityFlags: readonly DecisionJournalQualityFlag[];
  metadata: DecisionJournalEvidenceAssumptionMetadata;
  contractVersion: typeof DECISION_JOURNAL_EVIDENCE_ASSUMPTION_CONTRACT_VERSION;
  readOnly: true;
}>;

export type BuildDecisionJournalEvidenceAssumptionInput = Readonly<{
  workspaceId: DecisionWorkspaceId;
  generatedAt?: string;
  includeArchived?: boolean;
}>;

export type DecisionJournalEvidenceAssumptionEngineState = Readonly<{
  engineId: "decision-journal-evidence-assumption-engine";
  contractVersion: typeof DECISION_JOURNAL_EVIDENCE_ASSUMPTION_CONTRACT_VERSION;
  initialized: boolean;
  timestamp: string;
  readOnly: true;
}>;

export type DecisionJournalEvidenceAssumptionResponse = Readonly<{
  success: boolean;
  reason: string;
  data: DecisionJournalEvidenceAssumptionModel | null;
  readOnly: true;
}>;

export type DecisionJournalEvidenceAssumptionCertificationCheck = Readonly<{
  id: string;
  title: string;
  passed: boolean;
  evidence: string;
  readOnly: true;
}>;

export type DecisionJournalEvidenceAssumptionCertificationResult = Readonly<{
  certified: boolean;
  status: "PASS" | "FAIL";
  summary: string;
  checks: readonly DecisionJournalEvidenceAssumptionCertificationCheck[];
  score: number;
  readOnly: true;
}>;

export type { DecisionJournalEngineEntry, DecisionJournalValidationIssue, DecisionJournalValidationResult };

export function evidenceAssumptionSuccess(
  reason: string,
  data: DecisionJournalEvidenceAssumptionModel
): DecisionJournalEvidenceAssumptionResponse {
  return Object.freeze({ success: true, reason, data, readOnly: true as const });
}

export function evidenceAssumptionFailure(reason: string): DecisionJournalEvidenceAssumptionResponse {
  return Object.freeze({ success: false, reason, data: null, readOnly: true as const });
}
