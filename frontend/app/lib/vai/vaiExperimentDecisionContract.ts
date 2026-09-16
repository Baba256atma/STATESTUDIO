/**
 * NPA-A VAI:8 — EXPERIMENT_SCENARIO_PROPOSAL handoff contract.
 * Not a Scenario Object. Not business truth.
 */

import { vaiExperimentDecisionIdentity } from "./vaiExperimentDecisionIdentity.ts";
import type { VaiWhatIfAssumption, VaiWhatIfExperiment, VaiWhatIfResultClass, VaiWhatIfVariableView } from "./vaiWhatIfContract.ts";

export const VAI_8_CONFIRMATION_STATES = Object.freeze([
  "NONE",
  "PENDING_CONFIRMATION",
  "CONFIRMED",
  "CANCELLED",
  "FAILED",
  "CLARIFY_REFERENT",
] as const);

export type Vai8ConfirmationState = (typeof VAI_8_CONFIRMATION_STATES)[number];

export const VAI_8_PRESENTATION_STATES = Object.freeze([
  "EXPERIMENT",
  "PROPOSED_AS_SCENARIO",
  "CANONICAL_SCENARIO",
] as const);

export type Vai8PresentationState = (typeof VAI_8_PRESENTATION_STATES)[number];

export type Vai8ClassifiedResult = {
  readonly variableId: string;
  readonly displayName: string;
  readonly resultClass: VaiWhatIfResultClass;
  readonly experimentDisplay: string;
  readonly baselineDisplay: string;
  readonly remainsEstimate: boolean;
  readonly remainsUnknown: boolean;
};

export type VaiExperimentScenarioProposal = {
  readonly identity: typeof vaiExperimentDecisionIdentity;
  readonly proposalId: string;
  readonly experimentId: string;
  readonly analysisContextId: string;
  readonly focalObjectId: string;
  readonly isScenarioObject: false;
  readonly writesScenario: false;
  readonly baseline: readonly { readonly variableId: string; readonly value: number | null }[];
  readonly changedVariables: readonly string[];
  readonly assumptions: readonly VaiWhatIfAssumption[];
  readonly controls: readonly VaiWhatIfAssumption[];
  readonly deterministicCalculations: readonly VaiWhatIfVariableView[];
  readonly modelEstimates: readonly VaiWhatIfVariableView[];
  readonly unsupportedOutcomes: readonly VaiWhatIfVariableView[];
  readonly classifiedResults: readonly Vai8ClassifiedResult[];
  readonly evidenceBasis: readonly string[];
  readonly causalLimits: readonly string[];
  readonly confounders: readonly string[];
  readonly uncertainty: readonly string[];
  readonly managerIntent: string;
  readonly provenance: readonly string[];
};

export type Vai8ProvenanceChain = {
  readonly experimentId: string | null;
  readonly proposalId: string | null;
  readonly canonicalScenarioId: string | null;
  readonly baselineRefs: readonly string[];
  readonly writer: "CC:9" | null;
};

export type Vai8PromotionSession = {
  readonly analysisContextId: string;
  readonly pendingProposal: VaiExperimentScenarioProposal | null;
  readonly confirmationState: Vai8ConfirmationState;
  readonly canonicalScenarioId: string | null;
  readonly presentationState: Vai8PresentationState;
  readonly promotedByExperimentId: Readonly<Record<string, string>>;
  readonly lastFailure: string | null;
};

export const VAI_8_BOUNDARY = Object.freeze({
  identity: vaiExperimentDecisionIdentity,
  secondScenarioAuthority: false as const,
  secondNpsEngine: false as const,
  secondRecommendationAuthority: false as const,
  secondDecisionAuthority: false as const,
  secondExecutionAuthority: false as const,
  writesOutcome: false as const,
  writesLearning: false as const,
  writesDataReality: false as const,
  selectsWinner: false as const,
  trainsModels: false as const,
  updatesCoefficients: false as const,
  startsVai9: false as const,
  implicitPromotion: false as const,
});

export type { VaiWhatIfExperiment };
