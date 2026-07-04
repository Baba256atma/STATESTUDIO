import type {
  ConfidenceLevel,
  ConstraintType,
  DecisionDirection,
  EvidenceStrength,
  JudgmentState,
  JudgmentStatus,
  JudgmentType,
  OutcomeType,
  PriorityLevel,
  TradeoffType,
} from "./executiveJudgmentEnums.ts";

export type ExecutiveJudgmentId = string;
export type ExecutiveJudgmentContextId = string;
export type ExecutiveJudgmentOptionId = string;
export type ExecutiveJudgmentCandidateId = string;
export type ExecutiveJudgmentEvidenceId = string;
export type ExecutiveJudgmentConstraintId = string;
export type ExecutiveJudgmentAssumptionId = string;
export type ExecutiveJudgmentTraceId = string;

export type ExecutiveJudgmentMetadata = Readonly<{
  readonly source: string;
  readonly description: string;
  readonly tags: readonly string[];
  readonly apiVersion: string;
  readonly platformVersion: string;
  readonly metadataOnly: true;
}>;

export type ExecutiveJudgmentEvidence = Readonly<{
  readonly evidenceId: ExecutiveJudgmentEvidenceId;
  readonly label: string;
  readonly description: string;
  readonly strength: EvidenceStrength;
  readonly sourceReference: string;
  readonly metadata: ExecutiveJudgmentMetadata;
}>;

export type ExecutiveJudgmentConstraint = Readonly<{
  readonly constraintId: ExecutiveJudgmentConstraintId;
  readonly label: string;
  readonly description: string;
  readonly constraintType: ConstraintType;
  readonly required: boolean;
  readonly metadata: ExecutiveJudgmentMetadata;
}>;

export type ExecutiveJudgmentAssumption = Readonly<{
  readonly assumptionId: ExecutiveJudgmentAssumptionId;
  readonly label: string;
  readonly description: string;
  readonly evidenceIds: readonly ExecutiveJudgmentEvidenceId[];
  readonly metadata: ExecutiveJudgmentMetadata;
}>;

export type ExecutiveJudgmentTradeoff = Readonly<{
  readonly tradeoffId: string;
  readonly tradeoffType: TradeoffType;
  readonly label: string;
  readonly description: string;
  readonly optionIds: readonly ExecutiveJudgmentOptionId[];
  readonly metadata: ExecutiveJudgmentMetadata;
}>;

export type ExecutiveJudgmentRisk = Readonly<{
  readonly riskId: string;
  readonly label: string;
  readonly description: string;
  readonly evidenceIds: readonly ExecutiveJudgmentEvidenceId[];
  readonly metadata: ExecutiveJudgmentMetadata;
}>;

export type ExecutiveJudgmentOpportunity = Readonly<{
  readonly opportunityId: string;
  readonly label: string;
  readonly description: string;
  readonly evidenceIds: readonly ExecutiveJudgmentEvidenceId[];
  readonly metadata: ExecutiveJudgmentMetadata;
}>;

export type ExecutiveJudgmentPriority = Readonly<{
  readonly priorityId: string;
  readonly label: string;
  readonly description: string;
  readonly priorityLevel: PriorityLevel;
  readonly optionIds: readonly ExecutiveJudgmentOptionId[];
  readonly metadata: ExecutiveJudgmentMetadata;
}>;

export type ExecutiveJudgmentConfidence = Readonly<{
  readonly confidenceId: string;
  readonly level: ConfidenceLevel;
  readonly evidenceIds: readonly ExecutiveJudgmentEvidenceId[];
  readonly assumptionIds: readonly ExecutiveJudgmentAssumptionId[];
  readonly metadata: ExecutiveJudgmentMetadata;
}>;

export type ExecutiveJudgmentExplanation = Readonly<{
  readonly explanationId: string;
  readonly summary: string;
  readonly evidenceIds: readonly ExecutiveJudgmentEvidenceId[];
  readonly constraintIds: readonly ExecutiveJudgmentConstraintId[];
  readonly assumptionIds: readonly ExecutiveJudgmentAssumptionId[];
  readonly metadata: ExecutiveJudgmentMetadata;
}>;

export type ExecutiveJudgmentOption = Readonly<{
  readonly optionId: ExecutiveJudgmentOptionId;
  readonly label: string;
  readonly description: string;
  readonly direction: DecisionDirection;
  readonly evidenceIds: readonly ExecutiveJudgmentEvidenceId[];
  readonly constraintIds: readonly ExecutiveJudgmentConstraintId[];
  readonly metadata: ExecutiveJudgmentMetadata;
}>;

export type ExecutiveJudgmentCandidate = Readonly<{
  readonly candidateId: ExecutiveJudgmentCandidateId;
  readonly label: string;
  readonly description: string;
  readonly optionIds: readonly ExecutiveJudgmentOptionId[];
  readonly tradeoffIds: readonly string[];
  readonly riskIds: readonly string[];
  readonly opportunityIds: readonly string[];
  readonly metadata: ExecutiveJudgmentMetadata;
}>;

export type ExecutiveJudgmentOutcome = Readonly<{
  readonly outcomeId: string;
  readonly outcomeType: OutcomeType;
  readonly direction: DecisionDirection;
  readonly candidateId: ExecutiveJudgmentCandidateId;
  readonly metadata: ExecutiveJudgmentMetadata;
}>;

export type ExecutiveJudgmentContext = Readonly<{
  readonly contextId: ExecutiveJudgmentContextId;
  readonly workspaceId: string;
  readonly executiveContextId: string;
  readonly reasoningPlatformVersion: string;
  readonly scopeTags: readonly string[];
  readonly metadata: ExecutiveJudgmentMetadata;
}>;

export type ExecutiveJudgment = Readonly<{
  readonly judgmentId: ExecutiveJudgmentId;
  readonly judgmentType: JudgmentType;
  readonly status: JudgmentStatus;
  readonly state: JudgmentState;
  readonly context: ExecutiveJudgmentContext;
  readonly options: readonly ExecutiveJudgmentOption[];
  readonly candidates: readonly ExecutiveJudgmentCandidate[];
  readonly evidence: readonly ExecutiveJudgmentEvidence[];
  readonly constraints: readonly ExecutiveJudgmentConstraint[];
  readonly assumptions: readonly ExecutiveJudgmentAssumption[];
  readonly tradeoffs: readonly ExecutiveJudgmentTradeoff[];
  readonly risks: readonly ExecutiveJudgmentRisk[];
  readonly opportunities: readonly ExecutiveJudgmentOpportunity[];
  readonly priorities: readonly ExecutiveJudgmentPriority[];
  readonly outcome: ExecutiveJudgmentOutcome | null;
  readonly confidence: ExecutiveJudgmentConfidence | null;
  readonly explanation: ExecutiveJudgmentExplanation | null;
  readonly metadata: ExecutiveJudgmentMetadata;
}>;
