import { createExecutiveJudgmentContext, type ExecutiveJudgmentContextInput, type NormalizedExecutiveJudgmentContext } from "./executiveJudgmentContextEngine.ts";
import { evaluateExecutiveJudgmentEvidence, type ExecutiveJudgmentEvidenceAssessmentCollection } from "./executiveJudgmentEvidenceEngine.ts";
import { analyzeExecutiveJudgmentConstraints, type ExecutiveJudgmentConstraintAssessmentCollection } from "./executiveJudgmentConstraintEngine.ts";
import { analyzeExecutiveJudgmentTradeoffs, type ExecutiveJudgmentTradeoffAssessmentCollection } from "./executiveJudgmentTradeoffEngine.ts";
import { balanceExecutiveJudgmentRiskOpportunity, type ExecutiveJudgmentRiskOpportunityAssessmentCollection } from "./executiveJudgmentRiskOpportunityEngine.ts";
import { createExecutiveJudgment, type CanonicalExecutiveJudgmentOutput } from "./executiveJudgmentEngine.ts";
import { createExecutiveJudgmentExplanation, type StructuredExecutiveJudgmentExplanation } from "./executiveJudgmentExplanationEngine.ts";
import { buildExecutiveJudgmentPlatformManifest, type ExecutiveJudgmentPlatformManifest } from "./executiveJudgmentPlatformManifest.ts";
import { getExecutiveJudgmentPlatformRegistry } from "./executiveJudgmentPlatformRegistry.ts";

export type ExecutiveJudgmentPlatformResult = Readonly<{
  platformIdentity: Readonly<{ platformId: "APP-JUDGE"; platformName: "Executive Judgment Platform"; platformVersion: "APP-JUDGE-9" }>;
  context: NormalizedExecutiveJudgmentContext;
  evidenceAssessment: ExecutiveJudgmentEvidenceAssessmentCollection;
  constraintAssessment: ExecutiveJudgmentConstraintAssessmentCollection;
  tradeoffAssessment: ExecutiveJudgmentTradeoffAssessmentCollection;
  riskOpportunityBalance: ExecutiveJudgmentRiskOpportunityAssessmentCollection;
  executiveJudgment: CanonicalExecutiveJudgmentOutput;
  judgmentExplanation: StructuredExecutiveJudgmentExplanation;
  validationResult: Readonly<{ valid: boolean; metadataOnly: true }>;
  platformMetadata: Readonly<{ deterministic: true; immutable: true; metadataOnly: true }>;
  executionManifest: ExecutiveJudgmentPlatformManifest;
  pipelineSnapshot: Readonly<{
    phaseOrder: readonly string[];
    outputCount: number;
    fingerprint: string;
    deterministic: true;
  }>;
}>;

function stableHash(value: string): string {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0).toString(16).padStart(8, "0");
}

export function runExecutiveJudgmentPlatform(input: ExecutiveJudgmentContextInput = Object.freeze({})): ExecutiveJudgmentPlatformResult {
  const registry = getExecutiveJudgmentPlatformRegistry();
  const context = createExecutiveJudgmentContext(input);
  const evidenceAssessment = evaluateExecutiveJudgmentEvidence(context);
  const constraintAssessment = analyzeExecutiveJudgmentConstraints(context, evidenceAssessment);
  const tradeoffAssessment = analyzeExecutiveJudgmentTradeoffs(context, evidenceAssessment, constraintAssessment);
  const riskOpportunityBalance = balanceExecutiveJudgmentRiskOpportunity(context, evidenceAssessment, constraintAssessment, tradeoffAssessment);
  const executiveJudgment = createExecutiveJudgment(context, evidenceAssessment, constraintAssessment, tradeoffAssessment, riskOpportunityBalance);
  const judgmentExplanation = createExecutiveJudgmentExplanation(executiveJudgment);
  const executionManifest = buildExecutiveJudgmentPlatformManifest();
  const phaseOrder = registry.certifiedPhases;
  const pipelineSnapshot = Object.freeze({
    phaseOrder,
    outputCount: 7,
    fingerprint: stableHash([
      executionManifest.manifestFingerprint,
      context.baseContext.contextId,
      evidenceAssessment.assessments.length,
      constraintAssessment.assessments.length,
      tradeoffAssessment.assessments.length,
      riskOpportunityBalance.assessments.length,
      executiveJudgment.judgmentId,
      judgmentExplanation.explanationId,
    ].join("||")),
    deterministic: true as const,
  });

  return Object.freeze({
    platformIdentity: Object.freeze({ platformId: registry.platformId, platformName: registry.platformName, platformVersion: registry.platformVersion }),
    context,
    evidenceAssessment,
    constraintAssessment,
    tradeoffAssessment,
    riskOpportunityBalance,
    executiveJudgment,
    judgmentExplanation,
    validationResult: Object.freeze({ valid: true, metadataOnly: true as const }),
    platformMetadata: Object.freeze({ deterministic: true as const, immutable: true as const, metadataOnly: true as const }),
    executionManifest,
    pipelineSnapshot,
  });
}

export const createExecutiveJudgmentPlatform = runExecutiveJudgmentPlatform;
