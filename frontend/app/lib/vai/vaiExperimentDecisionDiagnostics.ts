/**
 * NPA-A VAI:8 — developer diagnostics for experiment-to-Scenario handoff.
 */

import type { Vai8HandoffResult } from "./vaiExperimentDecisionResolver.ts";

export type Vai8Diagnostic = {
  readonly experimentId: string | null;
  readonly proposalId: string | null;
  readonly canonicalScenarioId: string | null;
  readonly analysisContext: string | null;
  readonly focalObject: string | null;
  readonly managerPromotionIntent: boolean;
  readonly confirmationState: string;
  readonly assumptions: readonly string[];
  readonly calculationClassifications: readonly string[];
  readonly modelEstimates: readonly string[];
  readonly unknownOutcomes: readonly string[];
  readonly evidenceRefs: readonly string[];
  readonly causalLimits: readonly string[];
  readonly confounders: readonly string[];
  readonly scenarioHandoffRoute: string;
  readonly recommendationBoundary: string;
  readonly decisionMutationStatus: string;
  readonly executionMutationStatus: string;
  readonly outcomeMutationStatus: string;
  readonly provenanceChain: readonly string[];
  readonly failureDedupState: string;
};

export function formatVai8Diagnostics(result: Vai8HandoffResult): Vai8Diagnostic {
  const proposal = result.proposal;
  return Object.freeze({
    experimentId: result.provenance.experimentId,
    proposalId: result.provenance.proposalId,
    canonicalScenarioId: result.provenance.canonicalScenarioId,
    analysisContext: proposal?.analysisContextId ?? (result.session.analysisContextId || null),
    focalObject: proposal?.focalObjectId ?? null,
    managerPromotionIntent: result.session.confirmationState !== "NONE",
    confirmationState: result.session.confirmationState,
    assumptions: Object.freeze(proposal?.assumptions.map((item) => `${item.displayName}:${item.operator}:${item.assumedValue}`) ?? []),
    calculationClassifications: Object.freeze(proposal?.classifiedResults.map((item) => `${item.displayName}:${item.resultClass}`) ?? []),
    modelEstimates: Object.freeze(proposal?.modelEstimates.map((item) => `${item.displayName}:${item.experimentDisplay}`) ?? []),
    unknownOutcomes: Object.freeze(proposal?.unsupportedOutcomes.map((item) => item.displayName) ?? []),
    evidenceRefs: Object.freeze(proposal?.evidenceBasis ?? []),
    causalLimits: Object.freeze(proposal?.causalLimits ?? []),
    confounders: Object.freeze(proposal?.confounders ?? []),
    scenarioHandoffRoute: result.canonicalWriter ? "CC:9 Scenario conversation" : "no-canonical-write",
    recommendationBoundary: "existing recommendation authority; VAI does not choose",
    decisionMutationStatus: result.decisionApproved ? "mutated" : "unchanged",
    executionMutationStatus: result.executionStarted ? "mutated" : "unchanged",
    outcomeMutationStatus: result.outcomeWritten ? "mutated" : "unchanged",
    provenanceChain: Object.freeze([
      result.provenance.experimentId ? `experiment:${result.provenance.experimentId}` : "experiment:none",
      result.provenance.proposalId ? `proposal:${result.provenance.proposalId}` : "proposal:none",
      result.provenance.canonicalScenarioId ? `scenario:${result.provenance.canonicalScenarioId}` : "scenario:none",
    ]),
    failureDedupState: result.session.lastFailure ?? (result.session.canonicalScenarioId ? "dedup-or-confirmed" : "none"),
  });
}
