import type { CanonicalExecutiveJudgmentOutput } from "./executiveJudgmentSynthesizer.ts";
import { validateExecutiveJudgment, type ExecutiveJudgmentValidation } from "./executiveJudgmentValidation.ts";

export type ExecutiveJudgmentSnapshot = Readonly<{
  judgmentId: string;
  judgmentPosture: string;
  judgmentReadiness: string;
  judgmentDirection: string;
  supportedAlternativeCount: number;
  blockedAlternativeCount: number;
  uncertainAlternativeCount: number;
  evidenceCount: number;
  constraintCount: number;
  tradeoffCount: number;
  balanceCount: number;
  validation: ExecutiveJudgmentValidation;
  fingerprint: string;
  immutable: true;
  deterministic: true;
  metadataOnly: true;
}>;

function stableHash(value: string): string {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0).toString(16).padStart(8, "0");
}

export function buildExecutiveJudgmentSnapshot(judgment: CanonicalExecutiveJudgmentOutput): ExecutiveJudgmentSnapshot {
  const validation = validateExecutiveJudgment(judgment);
  const base = Object.freeze({
    judgmentId: judgment.judgmentId,
    judgmentPosture: judgment.judgmentPosture,
    judgmentReadiness: judgment.judgmentReadiness,
    judgmentDirection: judgment.judgmentDirection,
    supportedAlternativeCount: judgment.supportedAlternatives.length,
    blockedAlternativeCount: judgment.blockedAlternatives.length,
    uncertainAlternativeCount: judgment.uncertainAlternatives.length,
    evidenceCount: judgment.evidenceBasis.length,
    constraintCount: judgment.constraintBasis.length,
    tradeoffCount: judgment.tradeoffBasis.length,
    balanceCount: judgment.riskOpportunityBasis.length,
    validation,
    immutable: true as const,
    deterministic: true as const,
    metadataOnly: true as const,
  });
  const fingerprint = stableHash([
    base.judgmentId,
    base.judgmentPosture,
    base.judgmentReadiness,
    base.judgmentDirection,
    base.supportedAlternativeCount,
    base.blockedAlternativeCount,
    base.uncertainAlternativeCount,
    base.evidenceCount,
    base.constraintCount,
    base.tradeoffCount,
    base.balanceCount,
    base.validation.valid,
    base.immutable,
    base.deterministic,
    base.metadataOnly,
  ].join("||"));

  return Object.freeze({ ...base, fingerprint });
}
