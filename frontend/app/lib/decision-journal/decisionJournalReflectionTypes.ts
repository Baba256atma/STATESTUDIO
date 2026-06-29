/**
 * APP-8:4 — Decision Journal Reflection domain types.
 * Read-only reflection metadata over APP-8:3 query results.
 */

import type { DecisionJournalEngineEntry } from "./decisionJournalEngineTypes.ts";
import type {
  DecisionJournalValidationIssue,
  DecisionJournalValidationResult,
  DecisionWorkspaceId,
} from "./decisionJournalTypes.ts";

export const DECISION_JOURNAL_REFLECTION_CONTRACT_VERSION = "APP-8/4" as const;
export const DECISION_JOURNAL_REFLECTION_ARCHITECTURE_VERSION = "APP-8/4-journal-reflection-arch" as const;

export const DECISION_JOURNAL_REFLECTION_TAGS = Object.freeze([
  "[APP8_4]",
  "[DECISION_JOURNAL_REFLECTION]",
  "[READ_ONLY]",
  "[STRUCTURAL_INSIGHT]",
  "[NO_AI]",
  "[NO_PERSISTENCE]",
  "[NO_VISUALIZATION]",
  "[ARCHITECTURE_SAFE]",
] as const);

export const DECISION_JOURNAL_INSIGHT_TYPES = Object.freeze([
  "repeated-assumption",
  "repeated-risk",
  "low-evidence",
  "high-confidence-low-evidence",
  "many-alternatives",
  "no-alternatives",
  "unreviewed-entry",
  "repeated-constraint",
  "repeated-tradeoff",
  "confidence-pattern",
  "unknown",
] as const);

export const DECISION_JOURNAL_INSIGHT_SEVERITY_LEVELS = Object.freeze([
  "low",
  "medium",
  "high",
  "critical",
] as const);

export const DECISION_JOURNAL_REFLECTION_FORBIDDEN_PATTERNS = Object.freeze([
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
  "recommend",
  "predict(",
] as const);

export type DecisionJournalInsightType = (typeof DECISION_JOURNAL_INSIGHT_TYPES)[number];
export type DecisionJournalInsightSeverity = (typeof DECISION_JOURNAL_INSIGHT_SEVERITY_LEVELS)[number];

export type DecisionJournalPatternSummary = Readonly<{
  pattern: string;
  normalizedKey: string;
  occurrenceCount: number;
  entryIds: readonly string[];
  readOnly: true;
}>;

export type DecisionJournalInsightItem = Readonly<{
  id: string;
  workspaceId: DecisionWorkspaceId;
  type: DecisionJournalInsightType;
  title: string;
  description: string;
  entryIds: readonly string[];
  severity: DecisionJournalInsightSeverity;
  confidence: number;
  metadata: Readonly<Record<string, string>>;
  readOnly: true;
}>;

export type DecisionJournalEvidenceSummary = Readonly<{
  totalReferences: number;
  entriesWithNoEvidence: number;
  entriesWithEvidence: number;
  averageReferencesPerEntry: number;
  readOnly: true;
}>;

export type DecisionJournalAlternativeSummary = Readonly<{
  totalAlternatives: number;
  entriesWithNone: number;
  entriesWithMany: number;
  averageAlternativesPerEntry: number;
  readOnly: true;
}>;

export type DecisionJournalConfidenceReflectionSummary = Readonly<{
  distribution: Readonly<Record<string, number>>;
  dominantLevel: string | null;
  averageScore: number;
  readOnly: true;
}>;

export type DecisionJournalTradeoffSummary = Readonly<{
  totalTradeoffs: number;
  repeatedPatterns: readonly DecisionJournalPatternSummary[];
  readOnly: true;
}>;

export type DecisionJournalConstraintSummary = Readonly<{
  totalConstraints: number;
  repeatedPatterns: readonly DecisionJournalPatternSummary[];
  readOnly: true;
}>;

export type DecisionJournalReviewSummary = Readonly<{
  unreviewedCount: number;
  reviewedCount: number;
  draftWithoutReviewers: number;
  activeWithoutReviewers: number;
  readOnly: true;
}>;

export type DecisionJournalReflectionMetadata = Readonly<{
  reflectionVersion: typeof DECISION_JOURNAL_REFLECTION_CONTRACT_VERSION;
  queryContractVersion: string;
  includedArchived: boolean;
  readOnly: true;
}>;

export type DecisionJournalReflectionModel = Readonly<{
  workspaceId: DecisionWorkspaceId;
  entryCount: number;
  generatedAt: string;
  insightItems: readonly DecisionJournalInsightItem[];
  assumptionPatterns: readonly DecisionJournalPatternSummary[];
  riskPatterns: readonly DecisionJournalPatternSummary[];
  evidenceSummary: DecisionJournalEvidenceSummary;
  alternativeSummary: DecisionJournalAlternativeSummary;
  confidenceSummary: DecisionJournalConfidenceReflectionSummary;
  tradeoffSummary: DecisionJournalTradeoffSummary;
  constraintSummary: DecisionJournalConstraintSummary;
  reviewSummary: DecisionJournalReviewSummary;
  metadata: DecisionJournalReflectionMetadata;
  contractVersion: typeof DECISION_JOURNAL_REFLECTION_CONTRACT_VERSION;
  readOnly: true;
}>;

export type BuildDecisionJournalReflectionInput = Readonly<{
  workspaceId: DecisionWorkspaceId;
  generatedAt?: string;
  includeArchived?: boolean;
}>;

export type DecisionJournalReflectionEngineState = Readonly<{
  engineId: "decision-journal-reflection-engine";
  contractVersion: typeof DECISION_JOURNAL_REFLECTION_CONTRACT_VERSION;
  initialized: boolean;
  timestamp: string;
  readOnly: true;
}>;

export type DecisionJournalReflectionResponse = Readonly<{
  success: boolean;
  reason: string;
  data: DecisionJournalReflectionModel | null;
  readOnly: true;
}>;

export type DecisionJournalReflectionCertificationCheck = Readonly<{
  id: string;
  title: string;
  passed: boolean;
  evidence: string;
  readOnly: true;
}>;

export type DecisionJournalReflectionCertificationResult = Readonly<{
  certified: boolean;
  status: "PASS" | "FAIL";
  summary: string;
  checks: readonly DecisionJournalReflectionCertificationCheck[];
  score: number;
  readOnly: true;
}>;

export type { DecisionJournalEngineEntry, DecisionJournalValidationIssue, DecisionJournalValidationResult };

export function reflectionSuccess(
  reason: string,
  data: DecisionJournalReflectionModel
): DecisionJournalReflectionResponse {
  return Object.freeze({ success: true, reason, data, readOnly: true as const });
}

export function reflectionFailure(reason: string): DecisionJournalReflectionResponse {
  return Object.freeze({ success: false, reason, data: null, readOnly: true as const });
}
