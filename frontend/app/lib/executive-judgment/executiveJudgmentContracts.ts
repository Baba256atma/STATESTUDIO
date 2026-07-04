import type {
  ExecutiveJudgment,
  ExecutiveJudgmentAssumption,
  ExecutiveJudgmentCandidate,
  ExecutiveJudgmentConfidence,
  ExecutiveJudgmentConstraint,
  ExecutiveJudgmentContext,
  ExecutiveJudgmentEvidence,
  ExecutiveJudgmentExplanation,
  ExecutiveJudgmentMetadata,
  ExecutiveJudgmentOpportunity,
  ExecutiveJudgmentOption,
  ExecutiveJudgmentOutcome,
  ExecutiveJudgmentPriority,
  ExecutiveJudgmentRisk,
  ExecutiveJudgmentTradeoff,
} from "./executiveJudgmentTypes.ts";

export type ExecutiveJudgmentContract = ExecutiveJudgment;
export type ExecutiveJudgmentContextContract = ExecutiveJudgmentContext;
export type ExecutiveJudgmentOptionContract = ExecutiveJudgmentOption;
export type ExecutiveJudgmentCandidateContract = ExecutiveJudgmentCandidate;
export type ExecutiveJudgmentEvidenceContract = ExecutiveJudgmentEvidence;
export type ExecutiveJudgmentConstraintContract = ExecutiveJudgmentConstraint;
export type ExecutiveJudgmentAssumptionContract = ExecutiveJudgmentAssumption;
export type ExecutiveJudgmentTradeoffContract = ExecutiveJudgmentTradeoff;
export type ExecutiveJudgmentRiskContract = ExecutiveJudgmentRisk;
export type ExecutiveJudgmentOpportunityContract = ExecutiveJudgmentOpportunity;
export type ExecutiveJudgmentPriorityContract = ExecutiveJudgmentPriority;
export type ExecutiveJudgmentOutcomeContract = ExecutiveJudgmentOutcome;
export type ExecutiveJudgmentConfidenceContract = ExecutiveJudgmentConfidence;
export type ExecutiveJudgmentExplanationContract = ExecutiveJudgmentExplanation;
export type ExecutiveJudgmentMetadataContract = ExecutiveJudgmentMetadata;

export type ExecutiveJudgmentContractCatalog = Readonly<{
  readonly platformId: "APP-JUDGE";
  readonly version: "APP-JUDGE-1";
  readonly contracts: readonly string[];
  readonly metadataOnly: true;
  readonly runtimeBehavior: false;
}>;

export const EXECUTIVE_JUDGMENT_CONTRACT_CATALOG: ExecutiveJudgmentContractCatalog = Object.freeze({
  platformId: "APP-JUDGE",
  version: "APP-JUDGE-1",
  contracts: Object.freeze([
    "ExecutiveJudgment",
    "ExecutiveJudgmentContext",
    "ExecutiveJudgmentCandidate",
    "ExecutiveJudgmentOption",
    "ExecutiveJudgmentEvidence",
    "ExecutiveJudgmentConstraint",
    "ExecutiveJudgmentAssumption",
    "ExecutiveJudgmentTradeoff",
    "ExecutiveJudgmentRisk",
    "ExecutiveJudgmentOpportunity",
    "ExecutiveJudgmentPriority",
    "ExecutiveJudgmentOutcome",
    "ExecutiveJudgmentConfidence",
    "ExecutiveJudgmentExplanation",
    "ExecutiveJudgmentMetadata",
  ] as const),
  metadataOnly: true,
  runtimeBehavior: false,
});
