/**
 * NPA-A VAI:7 — developer diagnostics for temporary what-if experiments.
 */

import type { VaiWhatIfExperiment } from "./vaiWhatIfContract.ts";
import type { VaiWhatIfScenarioProposal, VaiWhatIfSession } from "./vaiWhatIfContract.ts";
import type { VaiWhatIfTheatreProjection } from "./vaiWhatIfTheatre.ts";

export type VaiWhatIfDiagnostic = {
  readonly experimentId: string | null;
  readonly analysisContext: string | null;
  readonly focalObject: string | null;
  readonly baselineRefs: readonly string[];
  readonly assumptions: readonly string[];
  readonly changedVariables: readonly string[];
  readonly heldControls: readonly string[];
  readonly calculationClassification: readonly string[];
  readonly modelSource: readonly string[];
  readonly evidenceCausalStatus: string | null;
  readonly missingInputs: readonly string[];
  readonly units: readonly string[];
  readonly scope: readonly string[];
  readonly confounders: readonly string[];
  readonly moderators: readonly string[];
  readonly resultStatus: readonly string[];
  readonly uncertainty: readonly string[];
  readonly sceneProjectionState: string;
  readonly scenarioPromotionState: string;
  readonly createdFromRequest: string | null;
};

export function formatVaiWhatIfDiagnostics(input: {
  readonly experiment: VaiWhatIfExperiment | null;
  readonly session?: VaiWhatIfSession | null;
  readonly theatre?: VaiWhatIfTheatreProjection | null;
  readonly proposal?: VaiWhatIfScenarioProposal | null;
  readonly causalStatus?: string | null;
}): VaiWhatIfDiagnostic {
  const experiment = input.experiment;
  return Object.freeze({
    experimentId: experiment?.experimentId ?? null,
    analysisContext: experiment?.analysisContextId ?? input.session?.analysisContextId ?? null,
    focalObject: experiment?.focalObjectId ?? null,
    baselineRefs: Object.freeze(experiment?.views.map((view) => `${view.variableId}:${view.baselineDisplay}`) ?? []),
    assumptions: Object.freeze(experiment?.assumptions.map((item) => `${item.displayName}:${item.operator}:${item.assumedValue}`) ?? []),
    changedVariables: Object.freeze(experiment?.assumptions.filter((item) => !item.heldConstant).map((item) => item.variableId) ?? []),
    heldControls: Object.freeze(experiment?.assumptions.filter((item) => item.heldConstant).map((item) => item.variableId) ?? []),
    calculationClassification: Object.freeze(experiment?.views.map((view) => `${view.variableId}:${view.resultClass}`) ?? []),
    modelSource: Object.freeze(experiment?.modelIdsUsed ?? []),
    evidenceCausalStatus: input.causalStatus ?? null,
    missingInputs: Object.freeze(experiment?.views.filter((view) => view.resultClass === "MISSING_INPUT" || view.resultClass === "UNKNOWN_BASELINE").map((view) => view.variableId) ?? []),
    units: Object.freeze(experiment?.views.filter((view) => view.resultClass === "UNIT_BLOCKED").map((view) => view.variableId) ?? []),
    scope: Object.freeze(experiment?.views.filter((view) => view.resultClass === "SCOPE_BLOCKED").map((view) => view.variableId) ?? []),
    confounders: Object.freeze(experiment?.confounders ?? []),
    moderators: Object.freeze(experiment?.moderators ?? []),
    resultStatus: Object.freeze(experiment?.views.map((view) => `${view.displayName}:${view.experimentDisplay}:${view.resultClass}`) ?? []),
    uncertainty: Object.freeze(experiment?.uncertainty ?? []),
    sceneProjectionState: input.theatre?.apply ? `scene:${input.theatre.sceneId ?? "none"}` : "no-experiment-projection",
    scenarioPromotionState: input.proposal
      ? `proposal-only writesScenario=${input.proposal.writesScenario}`
      : "not-proposed",
    createdFromRequest: experiment?.createdFromRequest ?? null,
  });
}
