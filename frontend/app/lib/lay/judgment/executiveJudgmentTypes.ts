import type {
  ExecutiveAlternative,
  ExecutiveReasoningResult,
  ExecutiveTradeoff,
} from "../reasoning/executiveReasoningEngine.ts";

export type ExecutiveJudgmentCapabilityId =
  | "alternativeEvaluation"
  | "priorityEvaluation"
  | "tradeoffEvaluation"
  | "riskEvaluation"
  | "opportunityEvaluation"
  | "confidenceEvaluation"
  | "rationaleGeneration";

export type ExecutiveJudgmentLevel = "low" | "moderate" | "high";

export type ExecutiveJudgmentInput = Readonly<{
  sessionId: string;
  reasoning: ExecutiveReasoningResult;
}>;

export type ExecutiveJudgmentSession = Readonly<{
  sessionId: string;
  phase: "LAY-3";
  reasoningSessionId: string;
}>;

export type ExecutiveAlternativeEvaluation = Readonly<{
  alternativeId: string;
  pathLabel: string;
  evidenceCount: number;
  assumptionCount: number;
  constraintCount: number;
  tradeoffCount: number;
  judgment: ExecutiveJudgmentLevel;
  justification: string;
}>;

export type ExecutiveTradeoffJudgment = Readonly<{
  tradeoffId: string;
  left: string;
  right: string;
  tension: string;
  judgment: ExecutiveJudgmentLevel;
  justification: string;
}>;

export type ExecutivePriority = Readonly<{
  id: string;
  subjectId: string;
  order: number;
  basis: string;
  justification: string;
}>;

export type ExecutiveRiskAwareness = Readonly<{
  id: string;
  sourceId: string;
  description: string;
  evidenceReference: string;
}>;

export type ExecutiveOpportunityAwareness = Readonly<{
  id: string;
  sourceId: string;
  description: string;
  evidenceReference: string;
}>;

export type ExecutiveConfidence = Readonly<{
  level: ExecutiveJudgmentLevel;
  reasoningCompleteness: number;
  evidenceCoverage: number;
  assumptionQuality: number;
  constraintConsistency: number;
  justification: string;
}>;

export type ExecutiveRationale = Readonly<{
  rationaleId: string;
  whyThisJudgment: readonly string[];
  evidence: readonly string[];
  assumptions: readonly string[];
  constraints: readonly string[];
  narrative: string;
}>;

export type ExecutiveJudgmentCore = Readonly<{
  alternativeEvaluations: readonly ExecutiveAlternativeEvaluation[];
  tradeoffJudgments: readonly ExecutiveTradeoffJudgment[];
  priorities: readonly ExecutivePriority[];
  risks: readonly ExecutiveRiskAwareness[];
  opportunities: readonly ExecutiveOpportunityAwareness[];
  confidence: ExecutiveConfidence;
}>;

export type ExecutiveJudgmentValidationIssue = Readonly<{
  code: string;
  field: string;
  message: string;
  severity: "error";
}>;

export type ExecutiveJudgmentValidationResult = Readonly<{
  valid: boolean;
  issues: readonly ExecutiveJudgmentValidationIssue[];
}>;

export type ExecutiveJudgmentResult = Readonly<{
  session: ExecutiveJudgmentSession;
  input: ExecutiveJudgmentInput;
  judgment: ExecutiveJudgmentCore;
  rationale: ExecutiveRationale;
  validation: ExecutiveJudgmentValidationResult;
}>;

export type ExecutiveJudgmentEvaluationContext = Readonly<{
  alternatives: readonly ExecutiveAlternative[];
  tradeoffs: readonly ExecutiveTradeoff[];
  evidenceReferences: readonly string[];
  assumptionIds: readonly string[];
  constraintIds: readonly string[];
}>;
