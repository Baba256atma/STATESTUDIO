import {
  DecisionDirection,
  JudgmentState,
  JudgmentStatus,
  JudgmentType,
  type ExecutiveJudgmentMetadata,
} from "./index.ts";
import type { NormalizedExecutiveJudgmentContext } from "./executiveJudgmentContextEngine.ts";
import type { ExecutiveJudgmentEvidenceAssessmentCollection } from "./executiveJudgmentEvidenceEngine.ts";
import type { ExecutiveJudgmentConstraintAssessmentCollection } from "./executiveJudgmentConstraintEngine.ts";
import type { ExecutiveJudgmentTradeoffAssessmentCollection } from "./executiveJudgmentTradeoffEngine.ts";
import type { ExecutiveJudgmentRiskOpportunityAssessmentCollection } from "./executiveJudgmentRiskOpportunityEngine.ts";
import { normalizeExecutiveJudgment, type ExecutiveJudgmentAlternativeBasis, type NormalizedExecutiveJudgment } from "./executiveJudgmentNormalizer.ts";
import type { ExecutiveJudgmentPosture, ExecutiveJudgmentReadiness } from "./executiveJudgmentRegistry.ts";

export type CanonicalExecutiveJudgmentOutput = Readonly<{
  judgmentId: string;
  judgmentType: typeof JudgmentType.Strategic;
  judgmentState: typeof JudgmentState.Proposed;
  judgmentStatus: typeof JudgmentStatus.Candidate;
  judgmentDirection: typeof DecisionDirection.Proceed | typeof DecisionDirection.Pause | typeof DecisionDirection.Revise;
  judgmentReadiness: ExecutiveJudgmentReadiness;
  judgmentPosture: ExecutiveJudgmentPosture;
  supportedAlternatives: readonly ExecutiveJudgmentAlternativeBasis[];
  blockedAlternatives: readonly ExecutiveJudgmentAlternativeBasis[];
  uncertainAlternatives: readonly ExecutiveJudgmentAlternativeBasis[];
  evidenceBasis: readonly string[];
  constraintBasis: readonly string[];
  tradeoffBasis: readonly string[];
  riskOpportunityBasis: readonly string[];
  assumptionBasis: readonly string[];
  knownGaps: readonly string[];
  blockingFactors: readonly string[];
  decisionBoundaries: readonly string[];
  normalizedJudgment: NormalizedExecutiveJudgment;
  metadata: ExecutiveJudgmentMetadata;
  deterministic: true;
  metadataOnly: true;
}>;

function postureFor(normalized: NormalizedExecutiveJudgment): ExecutiveJudgmentPosture {
  const supported = normalized.alternatives.filter((alternative) => alternative.state === "viable");
  const blocked = normalized.alternatives.filter((alternative) => alternative.state === "blocked");
  if (normalized.knownGaps.includes("missing-alternatives")) return "NO_VALID_ALTERNATIVE";
  if (normalized.knownGaps.length > 1) return "METADATA_INCOMPLETE";
  if (normalized.evidenceIds.length === 0) return "INSUFFICIENT_EVIDENCE";
  if (blocked.length > 0 && supported.length === 0) return "CONSTRAINT_BLOCKED";
  if (normalized.tradeoffIds.length > normalized.alternatives.length) return "TRADEOFF_HEAVY";
  if (normalized.balanceIds.length === 0) return "RISK_OPPORTUNITY_UNBALANCED";
  if (blocked.length > 0) return "READY_WITH_CONSTRAINTS";
  if (supported.length > 0) return "READY_TO_DECIDE";
  return "NEEDS_MORE_CONTEXT";
}

function readinessFor(posture: ExecutiveJudgmentPosture): ExecutiveJudgmentReadiness {
  if (posture === "READY_TO_DECIDE") return "ready";
  if (posture === "READY_WITH_CONSTRAINTS" || posture === "TRADEOFF_HEAVY") return "conditional";
  return "not-ready";
}

function directionFor(readiness: ExecutiveJudgmentReadiness): typeof DecisionDirection.Proceed | typeof DecisionDirection.Pause | typeof DecisionDirection.Revise {
  if (readiness === "ready") return DecisionDirection.Proceed;
  if (readiness === "conditional") return DecisionDirection.Revise;
  return DecisionDirection.Pause;
}

export function synthesizeExecutiveJudgment(
  context: NormalizedExecutiveJudgmentContext,
  evidence: ExecutiveJudgmentEvidenceAssessmentCollection,
  constraints: ExecutiveJudgmentConstraintAssessmentCollection,
  tradeoffs: ExecutiveJudgmentTradeoffAssessmentCollection,
  balances: ExecutiveJudgmentRiskOpportunityAssessmentCollection
): CanonicalExecutiveJudgmentOutput {
  const normalizedJudgment = normalizeExecutiveJudgment(context, evidence, constraints, tradeoffs, balances);
  const judgmentPosture = postureFor(normalizedJudgment);
  const judgmentReadiness = readinessFor(judgmentPosture);
  const supportedAlternatives = Object.freeze(normalizedJudgment.alternatives.filter((alternative) => alternative.state === "viable"));
  const blockedAlternatives = Object.freeze(normalizedJudgment.alternatives.filter((alternative) => alternative.state === "blocked"));
  const uncertainAlternatives = Object.freeze(normalizedJudgment.alternatives.filter((alternative) => alternative.state === "uncertain" || alternative.state === "unsupported"));

  return Object.freeze({
    judgmentId: normalizedJudgment.judgmentId,
    judgmentType: normalizedJudgment.judgmentType,
    judgmentState: normalizedJudgment.state,
    judgmentStatus: normalizedJudgment.status,
    judgmentDirection: directionFor(judgmentReadiness),
    judgmentReadiness,
    judgmentPosture,
    supportedAlternatives,
    blockedAlternatives,
    uncertainAlternatives,
    evidenceBasis: normalizedJudgment.evidenceIds,
    constraintBasis: normalizedJudgment.constraintIds,
    tradeoffBasis: normalizedJudgment.tradeoffIds,
    riskOpportunityBasis: normalizedJudgment.balanceIds,
    assumptionBasis: normalizedJudgment.assumptionIds,
    knownGaps: normalizedJudgment.knownGaps,
    blockingFactors: Object.freeze(blockedAlternatives.flatMap((alternative) => alternative.constraintIds).sort()),
    decisionBoundaries: Object.freeze([...normalizedJudgment.constraintIds, ...normalizedJudgment.tradeoffIds].sort()),
    normalizedJudgment,
    metadata: normalizedJudgment.metadata,
    deterministic: true,
    metadataOnly: true,
  });
}

export const createExecutiveJudgment = synthesizeExecutiveJudgment;
