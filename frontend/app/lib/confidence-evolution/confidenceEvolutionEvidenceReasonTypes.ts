/**
 * APP-9:5 — Confidence Evidence + Reason Link domain types.
 * Read-only explanation-link metadata over APP-9:3 query and APP-9:4 trend inputs.
 */

import type { ConfidenceChangeReason, ConfidenceSource } from "./confidenceEvolutionTypes.ts";
import type {
  ConfidenceEvolutionValidationIssue,
  ConfidenceEvolutionValidationResult,
  ConfidenceWorkspaceId,
} from "./confidenceEvolutionTypes.ts";

export const CONFIDENCE_EVOLUTION_EVIDENCE_REASON_CONTRACT_VERSION = "APP-9/5" as const;
export const CONFIDENCE_EVOLUTION_EVIDENCE_REASON_ARCHITECTURE_VERSION =
  "APP-9/5-confidence-evidence-reason-arch" as const;

export const CONFIDENCE_EVOLUTION_EVIDENCE_REASON_TAGS = Object.freeze([
  "[APP9_5]",
  "[CONFIDENCE_EVIDENCE_REASON]",
  "[READ_ONLY]",
  "[EXPLANATION_LINK]",
  "[NO_AI]",
  "[NO_PERSISTENCE]",
  "[NO_VISUALIZATION]",
  "[ARCHITECTURE_SAFE]",
] as const);

export const CONFIDENCE_LINK_TYPES = Object.freeze([
  "reason-link",
  "evidence-link",
  "movement-link",
  "explained-movement",
  "unexplained-movement",
  "large-change",
  "source-link",
  "unknown",
] as const);

export const CONFIDENCE_EXPLANATION_FLAG_TYPES = Object.freeze([
  "has-reason",
  "has-evidence",
  "reason-without-evidence",
  "evidence-without-reason",
  "large-change-explained",
  "large-change-unexplained",
  "movement-supported",
  "movement-unsupported",
  "source-reason-aligned",
  "source-reason-misaligned",
] as const);

export const CONFIDENCE_EVOLUTION_EVIDENCE_REASON_FORBIDDEN_PATTERNS = Object.freeze([
  "decision-timeline/",
  "business-timeline/",
  "decision-journal/",
  "scenario-timeline/",
  "dashboard/",
  "assistant/",
  "components/",
  ".tsx",
  "ConfidenceChart",
  "ConfidenceEditor",
  "localStorage",
  "indexedDB",
  "fetch(",
  "openai",
  "prompt(",
] as const);

export type ConfidenceLinkType = (typeof CONFIDENCE_LINK_TYPES)[number];
export type ConfidenceExplanationFlagType = (typeof CONFIDENCE_EXPLANATION_FLAG_TYPES)[number];

export type ConfidenceEvidenceReasonLink = Readonly<{
  id: string;
  workspaceId: ConfidenceWorkspaceId;
  recordId: string;
  previousRecordId?: string;
  type: ConfidenceLinkType;
  reason: ConfidenceChangeReason | "unknown";
  source: ConfidenceSource | "unknown";
  evidenceReferences: readonly string[];
  delta: number | null;
  explained: boolean;
  confidence: number;
  metadata: Readonly<Record<string, string>>;
  readOnly: true;
}>;

export type ConfidenceExplanationFlag = Readonly<{
  type: ConfidenceExplanationFlagType;
  recordId?: string;
  previousRecordId?: string;
  description: string;
  confidence: number;
  metadata: Readonly<Record<string, string>>;
  readOnly: true;
}>;

export type ConfidenceEvidenceReasonLinkModel = Readonly<{
  workspaceId: ConfidenceWorkspaceId;
  generatedAt: string;
  recordCount: number;
  linkCount: number;
  links: readonly ConfidenceEvidenceReasonLink[];
  flags: readonly ConfidenceExplanationFlag[];
  evidenceCoverage: number;
  reasonDistribution: Readonly<Record<string, number>>;
  sourceDistribution: Readonly<Record<string, number>>;
  explainedMovementCount: number;
  unexplainedMovementCount: number;
  largeMovementCount: number;
  confidence: number;
  metadata: Readonly<Record<string, string>>;
  contractVersion: typeof CONFIDENCE_EVOLUTION_EVIDENCE_REASON_CONTRACT_VERSION;
  readOnly: true;
}>;

export type BuildConfidenceEvidenceReasonLinkInput = Readonly<{
  workspaceId: ConfidenceWorkspaceId;
  generatedAt?: string;
  includeArchived?: boolean;
}>;

export type ConfidenceEvolutionEvidenceReasonEngineState = Readonly<{
  engineId: "confidence-evolution-evidence-reason-engine";
  contractVersion: typeof CONFIDENCE_EVOLUTION_EVIDENCE_REASON_CONTRACT_VERSION;
  initialized: boolean;
  timestamp: string;
  readOnly: true;
}>;

export type ConfidenceEvolutionEvidenceReasonResponse = Readonly<{
  success: boolean;
  reason: string;
  data: ConfidenceEvidenceReasonLinkModel | null;
  readOnly: true;
}>;

export type ConfidenceEvolutionEvidenceReasonCertificationCheck = Readonly<{
  id: string;
  title: string;
  passed: boolean;
  evidence: string;
  readOnly: true;
}>;

export type ConfidenceEvolutionEvidenceReasonCertificationResult = Readonly<{
  certified: boolean;
  status: "PASS" | "FAIL";
  summary: string;
  checks: readonly ConfidenceEvolutionEvidenceReasonCertificationCheck[];
  score: number;
  readOnly: true;
}>;

export type { ConfidenceEvolutionValidationIssue, ConfidenceEvolutionValidationResult };

export function evidenceReasonSuccess(
  reason: string,
  data: ConfidenceEvidenceReasonLinkModel
): ConfidenceEvolutionEvidenceReasonResponse {
  return Object.freeze({ success: true, reason, data, readOnly: true as const });
}

export function evidenceReasonFailure(reason: string): ConfidenceEvolutionEvidenceReasonResponse {
  return Object.freeze({ success: false, reason, data: null, readOnly: true as const });
}
