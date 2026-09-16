/**
 * NPA-T VAI:3 — developer diagnostics for evidence and causal safety.
 */

import type { VaiAnalyticalRelationship } from "./vaiCausalContract.ts";

export type VaiCausalDiagnostic = {
  readonly analysisContext: string;
  readonly source: string;
  readonly target: string;
  readonly evidenceReferences: readonly string[];
  readonly semanticCertainty: string;
  readonly relationshipStatus: string;
  readonly associationStatus: string;
  readonly directionStatus: string;
  readonly causalStatus: string;
  readonly managerAssertion: string | null;
  readonly unresolvedConfounders: readonly string[];
  readonly moderatorsConsidered: readonly string[];
  readonly alternativeExplanations: readonly string[];
  readonly contradictoryEvidence: boolean;
  readonly reasonCodes: readonly string[];
  readonly safeStatementClass: string;
  readonly causalAssertion: false;
};

export function formatVaiCausalDiagnostics(relationship: VaiAnalyticalRelationship): VaiCausalDiagnostic {
  return Object.freeze({
    analysisContext: relationship.analysisContextId,
    source: relationship.sourceVariableId,
    target: relationship.targetRef,
    evidenceReferences: relationship.evidenceRefs,
    semanticCertainty: relationship.semanticCertainty,
    relationshipStatus: relationship.relationshipStatus,
    associationStatus: relationship.associationStatus,
    directionStatus: relationship.directionStatus,
    causalStatus: relationship.causalStatus,
    managerAssertion: relationship.managerAssertion?.sourceRef ?? null,
    unresolvedConfounders: relationship.unresolvedConfounders,
    moderatorsConsidered: relationship.moderatorsConsidered,
    alternativeExplanations: relationship.alternativeExplanations,
    contradictoryEvidence: relationship.conflictingEvidence,
    reasonCodes: relationship.reasonCodes,
    safeStatementClass: relationship.safeStatementClass,
    causalAssertion: false,
  });
}
