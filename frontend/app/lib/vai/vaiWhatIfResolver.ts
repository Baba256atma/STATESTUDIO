/**
 * NPA-A VAI:7 — session-scoped what-if overlay and calculation ladder.
 * Does not write Data Reality, Scenario, Decision, Execution, Outcome, or Evidence.
 */

import type { VaiAdvisorBundle } from "./vaiAdvisorContract.ts";
import type { VaiVariable } from "./vaiContract.ts";
import { vaiWhatIfIdentity } from "./vaiWhatIfIdentity.ts";
import {
  VAI_WHAT_IF_BOUNDARY,
  type VaiTrustedQuantitativeModel,
  type VaiWhatIfAssumption,
  type VaiWhatIfExperiment,
  type VaiWhatIfResultClass,
  type VaiWhatIfScenarioProposal,
  type VaiWhatIfSession,
  type VaiWhatIfVariableView,
} from "./vaiWhatIfContract.ts";

export type VaiWhatIfChange = {
  readonly variableId: string;
  readonly operator: VaiWhatIfAssumption["operator"];
  readonly value?: number | null;
};

export function emptyVaiWhatIfSession(analysisContextId = ""): VaiWhatIfSession {
  return Object.freeze({
    analysisContextId,
    experimentsById: Object.freeze({}),
    activeExperimentId: null,
  });
}

export function createVaiWhatIfExperiment(input: {
  readonly bundle: VaiAdvisorBundle | null;
  readonly experimentId: string;
  readonly changes: readonly VaiWhatIfChange[];
  readonly models?: readonly VaiTrustedQuantitativeModel[];
  readonly requestedScope?: { readonly businessContext?: string | null };
  readonly session?: VaiWhatIfSession | null;
  readonly createdFromRequest?: string | null;
}): { readonly experiment: VaiWhatIfExperiment | null; readonly session: VaiWhatIfSession } {
  if (!input.bundle) {
    return { experiment: null, session: input.session ?? emptyVaiWhatIfSession() };
  }
  const experiment = buildExperiment(
    input.bundle,
    input.experimentId,
    input.changes,
    input.models ?? [],
    input.requestedScope ?? null,
    input.createdFromRequest ?? null,
  );
  const prior = input.session ?? emptyVaiWhatIfSession(input.bundle.analysisContextId);
  if (prior.analysisContextId && prior.analysisContextId !== input.bundle.analysisContextId) {
    return {
      experiment,
      session: Object.freeze({
        analysisContextId: input.bundle.analysisContextId,
        experimentsById: Object.freeze({ [experiment.experimentId]: experiment }),
        activeExperimentId: experiment.experimentId,
      }),
    };
  }
  return {
    experiment,
    session: Object.freeze({
      analysisContextId: input.bundle.analysisContextId,
      experimentsById: Object.freeze({
        ...prior.experimentsById,
        [experiment.experimentId]: experiment,
      }),
      activeExperimentId: experiment.experimentId,
    }),
  };
}

export function discardVaiWhatIfExperiment(session: VaiWhatIfSession | null): VaiWhatIfSession {
  if (!session) return emptyVaiWhatIfSession();
  return Object.freeze({
    analysisContextId: session.analysisContextId,
    experimentsById: Object.freeze({}),
    activeExperimentId: null,
  });
}

export function compareVaiWhatIfExperiments(session: VaiWhatIfSession): {
  readonly experimentIds: readonly string[];
  readonly winnerSelected: false;
  readonly viewsByExperiment: Readonly<Record<string, readonly VaiWhatIfVariableView[]>>;
} {
  const ids = Object.keys(session.experimentsById).sort();
  return Object.freeze({
    experimentIds: Object.freeze(ids),
    winnerSelected: false,
    viewsByExperiment: Object.freeze(
      Object.fromEntries(ids.map((id) => [id, session.experimentsById[id]!.views])),
    ),
  });
}

export function proposeVaiWhatIfAsScenario(experiment: VaiWhatIfExperiment | null): VaiWhatIfScenarioProposal | null {
  if (!experiment) return null;
  return Object.freeze({
    writesScenario: false,
    requiresExistingScenarioAuthority: true,
    requiresExplicitManagerConfirmation: true,
    authority: "CC:9",
    assumptions: experiment.assumptions,
    baseline: Object.freeze(experiment.views.map((view) => Object.freeze({ variableId: view.variableId, value: view.baselineValue }))),
    knownCalculations: Object.freeze(
      experiment.views.filter((view) => view.resultClass === "DETERMINISTIC_CALCULATION" || view.resultClass === "MODEL_ESTIMATE"),
    ),
    unknowns: Object.freeze(experiment.views.filter((view) => view.experimentValue == null).map((view) => view.displayName)),
    evidenceBasis: Object.freeze(experiment.modelIdsUsed),
    uncertainty: experiment.uncertainty,
  });
}

export function verifyVaiWhatIfAnalysis(): { readonly ok: true } {
  if (VAI_WHAT_IF_BOUNDARY.secondScenarioAuthority) throw new Error("VAI:7 must not create a Scenario authority");
  if (VAI_WHAT_IF_BOUNDARY.inventsBaseline) throw new Error("VAI:7 must not invent baselines");
  if (VAI_WHAT_IF_BOUNDARY.treatsUnknownAsZero) throw new Error("VAI:7 must not treat unknown as zero");
  if (VAI_WHAT_IF_BOUNDARY.startsVai8) throw new Error("VAI:7 must not start VAI:8");
  if (VAI_WHAT_IF_BOUNDARY.optimization) throw new Error("VAI:7 must not optimize");
  if (VAI_WHAT_IF_BOUNDARY.modelTraining) throw new Error("VAI:7 must not train models");
  if (VAI_WHAT_IF_BOUNDARY.causalGraphAuthority) throw new Error("VAI:7 must not create a causal graph authority");
  return Object.freeze({ ok: true as const });
}

export function parseWhatIfChanges(utterance: string, variables: readonly VaiVariable[]): VaiWhatIfChange[] {
  const text = utterance.toLowerCase();
  const percent = text.match(/increases?(?: by)? (\d+)\s*%/);
  const setMatch = text.match(/=\s*([\d.]+)/);
  const named = variables.find((item) => {
    const name = item.displayName.toLowerCase();
    const id = item.variableId.replace(/^vai:/, "").toLowerCase();
    return text.includes(name) || text.includes(id) || (name.split(/\s+/)[0] != null && text.includes(name.split(/\s+/)[0]!));
  });
  if (!named) return [];
  if (/hold|held constant|unchanged/.test(text) && named) {
    return [{ variableId: named.variableId, operator: "hold", value: null }];
  }
  if (percent) {
    return [{ variableId: named.variableId, operator: "increase-percent", value: Number(percent[1]) }];
  }
  if (setMatch) {
    return [{ variableId: named.variableId, operator: "set", value: Number(setMatch[1]) }];
  }
  return [];
}

function buildExperiment(
  bundle: VaiAdvisorBundle,
  experimentId: string,
  changes: readonly VaiWhatIfChange[],
  models: readonly VaiTrustedQuantitativeModel[],
  requestedScope: { readonly businessContext?: string | null } | null,
  createdFromRequest: string | null,
): VaiWhatIfExperiment {
  const byId = new Map(bundle.variables.map((item) => [item.variableId, item]));
  const roleById = new Map(bundle.roleResult.items.map((item) => [item.variableId, item]));
  const assumptions = Object.freeze(
    changes.map((change) => assumptionOf(change, byId.get(change.variableId) ?? null)),
  );
  const assumedById = new Map(assumptions.map((item) => [item.variableId, item]));
  const confounders = Object.freeze(
    bundle.roleResult.items.filter((item) => item.primaryRole === "CONFOUNDER").map((item) => item.displayName),
  );
  const moderators = Object.freeze(
    bundle.roleResult.items
      .filter((item) => item.primaryRole === "MODERATOR" || item.candidateRoles.some((candidate) => candidate.role === "MODERATOR"))
      .map((item) => item.displayName),
  );
  const views = Object.freeze(
    bundle.variables.map((variable) =>
      viewOf({
        variable,
        role: roleById.get(variable.variableId)?.primaryRole ?? variable.role,
        assumed: assumedById.get(variable.variableId) ?? null,
        assumptions,
        models,
        requestedScope,
        relationshipCausal: bundle.relationship?.evidenceSupportedCausal === true,
        confounders,
        moderators,
      }),
    ),
  );
  const uncertainty = Object.freeze([
    ...confounders.map((name) => `${name} remains an alternative explanation.`),
    ...moderators.map((name) => `${name} may affect this relationship, but its quantitative effect is not established.`),
    ...views
      .filter((view) =>
        view.resultClass === "UNSUPPORTED_PREDICTION"
        || view.resultClass === "UNKNOWN_BASELINE"
        || view.resultClass === "UNIT_BLOCKED"
        || view.resultClass === "SCOPE_BLOCKED"
        || view.resultClass === "MISSING_INPUT",
      )
      .map((view) => view.reason),
  ]);
  return Object.freeze({
    identity: vaiWhatIfIdentity,
    experimentId,
    analysisContextId: bundle.analysisContextId,
    focalObjectId: bundle.focalObject.id,
    isExecutiveObject: false,
    isScenario: false,
    assumptions,
    views,
    confounders,
    moderators,
    uncertainty,
    createdFrom: "MANAGER_INTERACTION",
    createdFromRequest,
    modelIdsUsed: Object.freeze(
      views
        .filter((view) => view.resultClass === "MODEL_ESTIMATE")
        .map((view) => models.find((model) => model.targetVariableId === view.variableId)?.modelId)
        .filter((id): id is string => Boolean(id)),
    ),
    scenarioCreated: false,
    decisionApproved: false,
    executionStarted: false,
    outcomeWritten: false,
    evidenceWritten: false,
    dataRealityWritten: false,
    winnerSelected: false,
  });
}

function assumptionOf(change: VaiWhatIfChange, variable: VaiVariable | null): VaiWhatIfAssumption {
  const baseline = numericValue(variable);
  const unit = unitOf(variable);
  const heldConstant = change.operator === "hold";
  let assumedValue: number | null = null;
  if (heldConstant) assumedValue = baseline;
  else if (baseline == null) assumedValue = null;
  else if (change.operator === "increase-percent" && change.value != null) assumedValue = roundMaybe(baseline * (1 + change.value / 100));
  else if (change.operator === "set" && change.value != null) assumedValue = change.value;
  return Object.freeze({
    variableId: change.variableId,
    displayName: variable?.displayName ?? change.variableId,
    operator: change.operator,
    inputValue: change.value ?? null,
    assumedValue,
    unit,
    heldConstant,
  });
}

function viewOf(input: {
  readonly variable: VaiVariable;
  readonly role: string | null;
  readonly assumed: VaiWhatIfAssumption | null;
  readonly assumptions: readonly VaiWhatIfAssumption[];
  readonly models: readonly VaiTrustedQuantitativeModel[];
  readonly requestedScope: { readonly businessContext?: string | null } | null;
  readonly relationshipCausal: boolean;
  readonly confounders: readonly string[];
  readonly moderators: readonly string[];
}): VaiWhatIfVariableView {
  const baseline = numericValue(input.variable);
  const baselineKnown = baseline != null;
  const baselineDisplay = baselineKnown ? formatNumber(baseline) : "Unknown";
  if (input.assumed) {
    if (input.assumed.heldConstant) {
      return view(
        input.variable,
        input.role,
        baseline,
        baselineKnown,
        baseline,
        baselineKnown ? baselineDisplay : "Unknown",
        "ASSUMPTION_ONLY",
        "none",
        "This factor is held constant in the experiment.",
      );
    }
    if (!baselineKnown || input.assumed.assumedValue == null) {
      return view(
        input.variable,
        input.role,
        baseline,
        false,
        null,
        "Unknown",
        "UNKNOWN_BASELINE",
        "none",
        "A baseline value is not available, so Nexora will not invent one.",
      );
    }
    return view(
      input.variable,
      input.role,
      baseline,
      true,
      input.assumed.assumedValue,
      formatNumber(input.assumed.assumedValue),
      "DETERMINISTIC_CALCULATION",
      "supported",
      "The assumed value follows arithmetic from the trusted baseline.",
    );
  }
  const changed = input.assumptions.filter((item) => !item.heldConstant);
  if (changed.length > 1 && (input.role === "OUTCOME" || input.role === "PATH_OF_EFFECT")) {
    return view(
      input.variable,
      input.role,
      baseline,
      baselineKnown,
      null,
      "Unknown",
      "UNSUPPORTED_PREDICTION",
      "none",
      "Combined effects of multiple assumptions are not established.",
    );
  }
  const model = matchingModel(input.variable.variableId, input.assumptions, input.models);
  if (model) {
    const sourceAssumed = input.assumptions.find((item) => item.variableId === model.sourceVariableId);
    if (sourceAssumed?.assumedValue == null || baseline == null) {
      return view(
        input.variable,
        input.role,
        baseline,
        baselineKnown,
        null,
        "Unknown",
        "MISSING_INPUT",
        "none",
        "A required input for the trusted model is missing and is not treated as zero.",
      );
    }
    if (unitMismatch(model, input.variable, sourceAssumed)) {
      return view(
        input.variable,
        input.role,
        baseline,
        baselineKnown,
        null,
        "Unknown",
        "UNIT_BLOCKED",
        "none",
        "Units are not compatible, so the calculation is blocked.",
      );
    }
    if (scopeBlocked(model, input.requestedScope)) {
      return view(
        input.variable,
        input.role,
        baseline,
        baselineKnown,
        null,
        "Unknown",
        "SCOPE_BLOCKED",
        "none",
        "The trusted model is not established for this scope.",
      );
    }
    const sourceBaseline = sourceBaselineOf(sourceAssumed);
    if (sourceBaseline == null) {
      return view(
        input.variable,
        input.role,
        baseline,
        baselineKnown,
        null,
        "Unknown",
        "MISSING_INPUT",
        "none",
        "A required input for the trusted model is missing and is not treated as zero.",
      );
    }
    const estimate = roundMaybe(baseline + model.coefficient * (sourceAssumed.assumedValue - sourceBaseline));
    const display = model.uncertaintyLow != null && model.uncertaintyHigh != null
      ? `${model.uncertaintyLow}–${model.uncertaintyHigh}`
      : formatNumber(estimate);
    return view(
      input.variable,
      input.role,
      baseline,
      true,
      estimate,
      display,
      "MODEL_ESTIMATE",
      "supported",
      `Estimate uses trusted model ${model.modelId}. This is not an observed result.`,
    );
  }
  if (input.relationshipCausal && (input.role === "OUTCOME" || input.role === "PATH_OF_EFFECT")) {
    return view(
      input.variable,
      input.role,
      baseline,
      baselineKnown,
      null,
      "Unknown",
      "UNSUPPORTED_PREDICTION",
      "none",
      "A supported causal relationship does not provide an effect size.",
    );
  }
  if (input.role === "PATH_OF_EFFECT" || input.role === "OUTCOME" || input.role === "MODERATOR") {
    const reason = input.role === "MODERATOR"
      ? `${input.variable.displayName} may affect this relationship, but its quantitative effect is not established.`
      : input.role === "PATH_OF_EFFECT"
        ? "A candidate pathway exists, but Nexora will not propagate numbers without a trusted quantitative relationship."
        : "Nexora does not have a trusted quantitative model for this outcome.";
    return view(input.variable, input.role, baseline, baselineKnown, null, "Unknown", "UNSUPPORTED_PREDICTION", "none", reason);
  }
  return view(
    input.variable,
    input.role,
    baseline,
    baselineKnown,
    baseline,
    baselineDisplay,
    "ASSUMPTION_ONLY",
    "none",
    "No trusted relationship supports calculating a new value for this factor.",
  );
}

function matchingModel(
  targetId: string,
  assumptions: readonly VaiWhatIfAssumption[],
  models: readonly VaiTrustedQuantitativeModel[],
): VaiTrustedQuantitativeModel | null {
  const changed = new Set(assumptions.filter((item) => !item.heldConstant).map((item) => item.variableId));
  const matches = models.filter((model) => model.targetVariableId === targetId && changed.has(model.sourceVariableId));
  return matches.length === 1 ? matches[0]! : null;
}

function scopeBlocked(model: VaiTrustedQuantitativeModel, requestedScope: { readonly businessContext?: string | null } | null): boolean {
  const expected = model.scope.businessContext?.trim();
  const requested = requestedScope?.businessContext?.trim();
  if (!expected || !requested) return false;
  return expected !== requested;
}

function unitMismatch(model: VaiTrustedQuantitativeModel, target: VaiVariable, source: VaiWhatIfAssumption): boolean {
  const targetUnit = unitOf(target);
  if (targetUnit && model.targetUnit && targetUnit !== model.targetUnit) return true;
  if (source.unit && model.sourceUnit && source.unit !== model.sourceUnit) return true;
  return false;
}

function sourceBaselineOf(assumed: VaiWhatIfAssumption): number | null {
  if (assumed.operator === "increase-percent" && assumed.inputValue != null && assumed.assumedValue != null) {
    return roundMaybe(assumed.assumedValue / (1 + assumed.inputValue / 100));
  }
  return assumed.assumedValue;
}

function numericValue(variable: VaiVariable | null): number | null {
  if (!variable || variable.value.kind !== "KNOWN") return null;
  return typeof variable.value.value === "number" && Number.isFinite(variable.value.value) ? variable.value.value : null;
}

function unitOf(variable: VaiVariable | null): string | null {
  if (!variable || variable.unit.kind !== "KNOWN") return null;
  return variable.unit.value;
}

function roundMaybe(value: number): number {
  const rounded = Math.round(value * 1e6) / 1e6;
  return Number.isInteger(rounded) ? rounded : rounded;
}

function formatNumber(value: number): string {
  return Number.isInteger(value) ? String(value) : String(roundMaybe(value));
}

function view(
  variable: VaiVariable,
  role: string | null,
  baselineValue: number | null,
  baselineKnown: boolean,
  experimentValue: number | null,
  experimentDisplay: string,
  resultClass: VaiWhatIfResultClass,
  visualPropagation: "none" | "supported",
  reason: string,
): VaiWhatIfVariableView {
  return Object.freeze({
    variableId: variable.variableId,
    displayName: variable.displayName,
    role,
    baselineValue,
    baselineKnown,
    experimentValue,
    experimentDisplay,
    baselineDisplay: baselineKnown && baselineValue != null ? formatNumber(baselineValue) : "Unknown",
    resultClass,
    visualPropagation,
    reason,
  });
}
