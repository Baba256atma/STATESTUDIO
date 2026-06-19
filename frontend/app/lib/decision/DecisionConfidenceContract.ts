/**
 * D:2:1 — Canonical Decision Confidence contract.
 *
 * Immutable, read-only contracts for executive decision confidence profiles,
 * evidence, uncertainty, and explanations. Supports high, medium, low, and
 * insufficient-evidence confidence levels. No workflow execution, UI rendering,
 * routing, scene, topology, DS, or mutation authority.
 */

export const DECISION_CONFIDENCE_CONTRACT_DIAGNOSTIC = "[DECISION_CONFIDENCE_CONTRACT]" as const;

export const DECISION_CONFIDENCE_READY_DIAGNOSTIC = "[DECISION_CONFIDENCE_READY]" as const;

export const D2_CONTRACT_COMPLETE_TAG = "[D2_CONTRACT_COMPLETE]" as const;

export const DECISION_CONFIDENCE_CONTRACT_VERSION = "1.0.0" as const;

export type DecisionConfidenceLevel = "high" | "medium" | "low" | "insufficient_evidence";

export const DECISION_CONFIDENCE_LEVEL_LABELS = Object.freeze({
  high: "High Confidence",
  medium: "Medium Confidence",
  low: "Low Confidence",
  insufficient_evidence: "Insufficient Evidence",
} as const);

export type DecisionEvidenceItem = Readonly<{
  evidenceId: string;
  label: string;
  sourceId: string;
  strength: number;
  readOnly: true;
  mutation: false;
}>;

export type DecisionEvidenceProfile = Readonly<{
  profileId: string;
  evidenceItems: readonly DecisionEvidenceItem[];
  evidenceCount: number;
  aggregateStrength: number;
  sufficientEvidence: boolean;
  readOnly: true;
  mutation: false;
}>;

export type DecisionUncertaintyFactor = Readonly<{
  factorId: string;
  label: string;
  severity: number;
  category?: string;
  readOnly: true;
  mutation: false;
}>;

export type DecisionUncertaintyProfile = Readonly<{
  profileId: string;
  factors: readonly DecisionUncertaintyFactor[];
  factorCount: number;
  aggregateUncertainty: number;
  evidenceGapCount: number;
  readOnly: true;
  mutation: false;
}>;

export type DecisionConfidenceExplanation = Readonly<{
  explanationId: string;
  confidenceLevel: DecisionConfidenceLevel;
  summary: string;
  evidenceSummary: string;
  uncertaintySummary: string;
  evidenceIds: readonly string[];
  uncertaintyFactorIds: readonly string[];
  readOnly: true;
  mutation: false;
}>;

export type DecisionConfidenceProfile = Readonly<{
  version: typeof DECISION_CONFIDENCE_CONTRACT_VERSION;
  profileId: string;
  generatedAt: string;
  confidenceLevel: DecisionConfidenceLevel;
  confidenceLabel: (typeof DECISION_CONFIDENCE_LEVEL_LABELS)[DecisionConfidenceLevel];
  confidenceScore: number;
  evidence: DecisionEvidenceProfile;
  uncertainty: DecisionUncertaintyProfile;
  explanation: DecisionConfidenceExplanation;
  supportsHighConfidence: true;
  supportsMediumConfidence: true;
  supportsLowConfidence: true;
  supportsInsufficientEvidence: true;
  readOnly: true;
  mutation: false;
  sourceMutation: false;
  sceneMutation: false;
  topologyMutation: false;
  routingMutation: false;
  dsMutation: false;
  diagnostics: readonly [
    typeof DECISION_CONFIDENCE_CONTRACT_DIAGNOSTIC,
    typeof DECISION_CONFIDENCE_READY_DIAGNOSTIC,
  ];
}>;

export type DecisionConfidenceContract = Readonly<{
  version: typeof DECISION_CONFIDENCE_CONTRACT_VERSION;
  evidenceContract: "DecisionEvidenceProfile";
  uncertaintyContract: "DecisionUncertaintyProfile";
  explanationContract: "DecisionConfidenceExplanation";
  profileContract: "DecisionConfidenceProfile";
  supportsHighConfidence: true;
  supportsMediumConfidence: true;
  supportsLowConfidence: true;
  supportsInsufficientEvidence: true;
  readOnly: true;
  mutation: false;
  diagnostics: readonly [
    typeof DECISION_CONFIDENCE_CONTRACT_DIAGNOSTIC,
    typeof DECISION_CONFIDENCE_READY_DIAGNOSTIC,
  ];
}>;

export const DECISION_CONFIDENCE_DIAGNOSTICS = Object.freeze([
  DECISION_CONFIDENCE_CONTRACT_DIAGNOSTIC,
  DECISION_CONFIDENCE_READY_DIAGNOSTIC,
] as const);

export const DECISION_CONFIDENCE_CONTRACT: DecisionConfidenceContract = Object.freeze({
  version: DECISION_CONFIDENCE_CONTRACT_VERSION,
  evidenceContract: "DecisionEvidenceProfile",
  uncertaintyContract: "DecisionUncertaintyProfile",
  explanationContract: "DecisionConfidenceExplanation",
  profileContract: "DecisionConfidenceProfile",
  supportsHighConfidence: true,
  supportsMediumConfidence: true,
  supportsLowConfidence: true,
  supportsInsufficientEvidence: true,
  readOnly: true,
  mutation: false,
  diagnostics: DECISION_CONFIDENCE_DIAGNOSTICS,
});

function clampScore(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.max(0, Math.min(100, Math.round(value)));
}

export function resolveDecisionConfidenceLabel(
  level: DecisionConfidenceLevel
): (typeof DECISION_CONFIDENCE_LEVEL_LABELS)[DecisionConfidenceLevel] {
  return DECISION_CONFIDENCE_LEVEL_LABELS[level];
}

export function resolveDecisionConfidenceLevel(input: {
  confidenceScore: number;
  evidenceCount: number;
  sufficientEvidence: boolean;
}): DecisionConfidenceLevel {
  if (input.evidenceCount <= 0 || !input.sufficientEvidence) {
    return "insufficient_evidence";
  }

  const score = clampScore(input.confidenceScore);
  if (score >= 75) return "high";
  if (score >= 45) return "medium";
  return "low";
}

export function buildDecisionEvidenceItem(
  input: Omit<DecisionEvidenceItem, "strength" | "readOnly" | "mutation"> & {
    strength: number;
  }
): DecisionEvidenceItem {
  return Object.freeze({
    ...input,
    strength: clampScore(input.strength),
    readOnly: true as const,
    mutation: false as const,
  });
}

export function buildDecisionEvidenceProfile(input: {
  profileId: string;
  evidenceItems: readonly DecisionEvidenceItem[];
  sufficientEvidence?: boolean;
}): DecisionEvidenceProfile {
  const evidenceItems = Object.freeze(
    input.evidenceItems.map((item) => buildDecisionEvidenceItem(item))
  );
  const evidenceCount = evidenceItems.length;
  const aggregateStrength =
    evidenceCount === 0
      ? 0
      : clampScore(
          evidenceItems.reduce((sum, item) => sum + item.strength, 0) / evidenceCount
        );
  const sufficientEvidence =
    input.sufficientEvidence ?? (evidenceCount >= 2 && aggregateStrength >= 45);

  return Object.freeze({
    profileId: input.profileId,
    evidenceItems,
    evidenceCount,
    aggregateStrength,
    sufficientEvidence,
    readOnly: true as const,
    mutation: false as const,
  });
}

export function buildDecisionUncertaintyFactor(
  input: Omit<DecisionUncertaintyFactor, "severity" | "readOnly" | "mutation"> & {
    severity: number;
  }
): DecisionUncertaintyFactor {
  return Object.freeze({
    ...input,
    severity: clampScore(input.severity),
    readOnly: true as const,
    mutation: false as const,
  });
}

export function buildDecisionUncertaintyProfile(input: {
  profileId: string;
  factors: readonly DecisionUncertaintyFactor[];
  evidenceGapCount?: number;
}): DecisionUncertaintyProfile {
  const factors = Object.freeze(
    input.factors.map((factor) => buildDecisionUncertaintyFactor(factor))
  );
  const factorCount = factors.length;
  const aggregateUncertainty =
    factorCount === 0
      ? 0
      : clampScore(factors.reduce((sum, factor) => sum + factor.severity, 0) / factorCount);

  return Object.freeze({
    profileId: input.profileId,
    factors,
    factorCount,
    aggregateUncertainty,
    evidenceGapCount: Math.max(0, input.evidenceGapCount ?? 0),
    readOnly: true as const,
    mutation: false as const,
  });
}

export function buildDecisionConfidenceExplanation(
  input: Omit<
    DecisionConfidenceExplanation,
    "evidenceIds" | "uncertaintyFactorIds" | "readOnly" | "mutation"
  > & {
    evidenceIds: readonly string[];
    uncertaintyFactorIds: readonly string[];
  }
): DecisionConfidenceExplanation {
  return Object.freeze({
    ...input,
    evidenceIds: Object.freeze([...input.evidenceIds]),
    uncertaintyFactorIds: Object.freeze([...input.uncertaintyFactorIds]),
    readOnly: true as const,
    mutation: false as const,
  });
}

export function buildDecisionConfidenceProfile(input: {
  profileId: string;
  generatedAt: string;
  confidenceScore: number;
  evidence: {
    profileId: string;
    evidenceItems: readonly DecisionEvidenceItem[];
    sufficientEvidence?: boolean;
  };
  uncertainty: {
    profileId: string;
    factors: readonly DecisionUncertaintyFactor[];
    evidenceGapCount?: number;
  };
  explanation: Omit<
    DecisionConfidenceExplanation,
    "confidenceLevel" | "evidenceIds" | "uncertaintyFactorIds" | "readOnly" | "mutation"
  > & {
    evidenceIds: readonly string[];
    uncertaintyFactorIds: readonly string[];
  };
}): DecisionConfidenceProfile {
  const evidence = buildDecisionEvidenceProfile(input.evidence);
  const uncertainty = buildDecisionUncertaintyProfile(input.uncertainty);
  const confidenceScore = clampScore(input.confidenceScore);
  const confidenceLevel = resolveDecisionConfidenceLevel({
    confidenceScore,
    evidenceCount: evidence.evidenceCount,
    sufficientEvidence: evidence.sufficientEvidence,
  });

  return Object.freeze({
    version: DECISION_CONFIDENCE_CONTRACT_VERSION,
    profileId: input.profileId,
    generatedAt: input.generatedAt,
    confidenceLevel,
    confidenceLabel: resolveDecisionConfidenceLabel(confidenceLevel),
    confidenceScore,
    evidence,
    uncertainty,
    explanation: buildDecisionConfidenceExplanation({
      ...input.explanation,
      confidenceLevel,
    }),
    supportsHighConfidence: true as const,
    supportsMediumConfidence: true as const,
    supportsLowConfidence: true as const,
    supportsInsufficientEvidence: true as const,
    readOnly: true as const,
    mutation: false as const,
    sourceMutation: false as const,
    sceneMutation: false as const,
    topologyMutation: false as const,
    routingMutation: false as const,
    dsMutation: false as const,
    diagnostics: DECISION_CONFIDENCE_DIAGNOSTICS,
  });
}

export const EMPTY_DECISION_CONFIDENCE_PROFILE: DecisionConfidenceProfile =
  buildDecisionConfidenceProfile({
    profileId: "",
    generatedAt: "",
    confidenceScore: 0,
    evidence: {
      profileId: "",
      evidenceItems: Object.freeze([]),
    },
    uncertainty: {
      profileId: "",
      factors: Object.freeze([]),
      evidenceGapCount: 0,
    },
    explanation: {
      explanationId: "",
      summary: "",
      evidenceSummary: "",
      uncertaintySummary: "",
      evidenceIds: Object.freeze([]),
      uncertaintyFactorIds: Object.freeze([]),
    },
  });
