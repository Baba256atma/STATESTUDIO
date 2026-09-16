/**
 * NPA-A VAI:7 — WHAT_IF_EXPERIMENT contract.
 * Overlay over trusted baseline. Not business truth.
 */

import { vaiWhatIfIdentity } from "./vaiWhatIfIdentity.ts";

export const VAI_WHAT_IF_RESULT_CLASSES = Object.freeze([
  "ASSUMPTION_ONLY",
  "DETERMINISTIC_CALCULATION",
  "MODEL_ESTIMATE",
  "UNSUPPORTED_PREDICTION",
  "UNKNOWN_BASELINE",
  "UNIT_BLOCKED",
  "SCOPE_BLOCKED",
  "MISSING_INPUT",
] as const);

export type VaiWhatIfResultClass = (typeof VAI_WHAT_IF_RESULT_CLASSES)[number];

export type VaiWhatIfAssumption = {
  readonly variableId: string;
  readonly displayName: string;
  readonly operator: "increase-percent" | "set" | "hold";
  readonly inputValue: number | null;
  readonly assumedValue: number | null;
  readonly unit: string | null;
  readonly heldConstant: boolean;
};

export type VaiWhatIfVariableView = {
  readonly variableId: string;
  readonly displayName: string;
  readonly role: string | null;
  readonly baselineValue: number | null;
  readonly baselineKnown: boolean;
  readonly experimentValue: number | null;
  readonly experimentDisplay: string;
  readonly baselineDisplay: string;
  readonly resultClass: VaiWhatIfResultClass;
  readonly visualPropagation: "none" | "supported";
  readonly reason: string;
};

export type VaiTrustedQuantitativeModel = {
  readonly modelId: string;
  readonly sourceVariableId: string;
  readonly targetVariableId: string;
  readonly formula: "LINEAR_DELTA";
  readonly coefficient: number;
  readonly sourceUnit: string;
  readonly targetUnit: string;
  readonly scope: { readonly businessContext?: string | null };
  readonly uncertaintyLow: number | null;
  readonly uncertaintyHigh: number | null;
  readonly provenance: string;
  readonly sourceRef: string;
};

export type VaiWhatIfExperiment = {
  readonly identity: typeof vaiWhatIfIdentity;
  readonly experimentId: string;
  readonly analysisContextId: string;
  readonly focalObjectId: string;
  readonly isExecutiveObject: false;
  readonly isScenario: false;
  readonly assumptions: readonly VaiWhatIfAssumption[];
  readonly views: readonly VaiWhatIfVariableView[];
  readonly confounders: readonly string[];
  readonly moderators: readonly string[];
  readonly uncertainty: readonly string[];
  readonly modelIdsUsed: readonly string[];
  readonly createdFrom: "MANAGER_INTERACTION";
  readonly createdFromRequest: string | null;
  readonly scenarioCreated: false;
  readonly decisionApproved: false;
  readonly executionStarted: false;
  readonly outcomeWritten: false;
  readonly evidenceWritten: false;
  readonly dataRealityWritten: false;
  readonly winnerSelected: false;
};

export type VaiWhatIfSession = {
  readonly analysisContextId: string;
  readonly experimentsById: Readonly<Record<string, VaiWhatIfExperiment>>;
  readonly activeExperimentId: string | null;
};

export type VaiWhatIfScenarioProposal = {
  readonly writesScenario: false;
  readonly requiresExistingScenarioAuthority: true;
  readonly requiresExplicitManagerConfirmation: true;
  readonly authority: "CC:9";
  readonly assumptions: readonly VaiWhatIfAssumption[];
  readonly baseline: readonly { readonly variableId: string; readonly value: number | null }[];
  readonly knownCalculations: readonly VaiWhatIfVariableView[];
  readonly unknowns: readonly string[];
  readonly evidenceBasis: readonly string[];
  readonly uncertainty: readonly string[];
};

export const VAI_WHAT_IF_BOUNDARY = Object.freeze({
  identity: vaiWhatIfIdentity,
  secondScenarioAuthority: false as const,
  secondDecisionAuthority: false as const,
  secondAdvisor: false as const,
  secondDirector: false as const,
  secondStage: false as const,
  causalGraphAuthority: false as const,
  modelTraining: false as const,
  monteCarlo: false as const,
  optimization: false as const,
  inventsBaseline: false as const,
  treatsUnknownAsZero: false as const,
  startsVai8: false as const,
});
