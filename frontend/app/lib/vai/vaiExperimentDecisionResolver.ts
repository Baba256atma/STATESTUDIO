/**
 * NPA-A VAI:8 — single Experiment → CC:9 Scenario handoff.
 * Does not write Decision, Execution, Outcome, Learning, or Data Reality.
 */

import {
  createEmptyNexoraExecutiveContextSnapshot,
  freezeExecutiveContextReference,
  type NexoraExecutiveContextSnapshot,
} from "@/app/lib/conversational-control/executiveContextSnapshot.ts";
import {
  createEmptyNexoraExecutiveScenarioSession,
  resolveNexoraExecutiveScenarioConversation,
  type NexoraExecutiveScenarioSession,
} from "@/app/lib/conversational-control/executiveScenarioResolver.ts";
import type { NexoraScenarioAssumption } from "@/app/lib/conversational-control/executiveScenarioDefinition.ts";
import { vaiExperimentDecisionIdentity } from "./vaiExperimentDecisionIdentity.ts";
import {
  VAI_8_BOUNDARY,
  type Vai8ConfirmationState,
  type Vai8PresentationState,
  type Vai8PromotionSession,
  type Vai8ProvenanceChain,
  type VaiExperimentScenarioProposal,
} from "./vaiExperimentDecisionContract.ts";
import type { VaiWhatIfExperiment } from "./vaiWhatIfContract.ts";
import { proposeVaiWhatIfAsScenario } from "./vaiWhatIfResolver.ts";

export type Vai8HandoffResult = {
  readonly identity: typeof vaiExperimentDecisionIdentity;
  readonly apply: boolean;
  readonly response: string | null;
  readonly proposal: VaiExperimentScenarioProposal | null;
  readonly session: Vai8PromotionSession;
  readonly scenarioSession: NexoraExecutiveScenarioSession | null;
  readonly provenance: Vai8ProvenanceChain;
  readonly recommendationIssued: false;
  readonly winnerSelected: false;
  readonly decisionApproved: false;
  readonly executionStarted: false;
  readonly outcomeWritten: false;
  readonly learningWritten: false;
  readonly dataRealityWritten: false;
  readonly coefficientsUpdated: false;
  readonly npsReplaced: false;
  readonly canonicalWriter: "CC:9" | null;
};

const LEAK = /\b(?:VAI:[1-9]|CC:\d+|CORE-INT:3|canonical writer|proposal contract|resolver|authority)\b/i;

export function emptyVai8PromotionSession(analysisContextId = ""): Vai8PromotionSession {
  return Object.freeze({
    analysisContextId,
    pendingProposal: null,
    confirmationState: "NONE",
    canonicalScenarioId: null,
    presentationState: "EXPERIMENT",
    promotedByExperimentId: Object.freeze({}),
    lastFailure: null,
  });
}

export function isExplicitVai8PromotionIntent(utterance: string): boolean {
  const text = utterance.trim().toLowerCase();
  return /make this a scenario|save this option for comparison|turn this experiment into a scenario|propose this as a scenario/.test(text);
}

export function isVai8Confirmation(utterance: string): boolean {
  return /^(yes|yep|confirm|create it|create the scenario|do it)\.?$/i.test(utterance.trim());
}

export function isVai8Cancel(utterance: string): boolean {
  return /^(no|cancel|never mind|don't|do not)\b/i.test(utterance.trim());
}

export function buildVaiExperimentScenarioProposal(
  experiment: VaiWhatIfExperiment,
  managerIntent: string,
): VaiExperimentScenarioProposal {
  const base = proposeVaiWhatIfAsScenario(experiment)!;
  const classified = Object.freeze(
    experiment.views.map((view) =>
      Object.freeze({
        variableId: view.variableId,
        displayName: view.displayName,
        resultClass: view.resultClass,
        experimentDisplay: view.experimentDisplay,
        baselineDisplay: view.baselineDisplay,
        remainsEstimate: view.resultClass === "MODEL_ESTIMATE",
        remainsUnknown:
          view.resultClass === "UNSUPPORTED_PREDICTION"
          || view.resultClass === "UNKNOWN_BASELINE"
          || view.resultClass === "MISSING_INPUT"
          || view.resultClass === "SCOPE_BLOCKED"
          || view.resultClass === "UNIT_BLOCKED"
          || view.experimentValue == null && view.resultClass !== "DETERMINISTIC_CALCULATION",
      }),
    ),
  );
  return Object.freeze({
    identity: vaiExperimentDecisionIdentity,
    proposalId: `vai8:proposal:${experiment.experimentId}`,
    experimentId: experiment.experimentId,
    analysisContextId: experiment.analysisContextId,
    focalObjectId: experiment.focalObjectId,
    isScenarioObject: false,
    writesScenario: false,
    baseline: base.baseline,
    changedVariables: Object.freeze(experiment.assumptions.filter((item) => !item.heldConstant).map((item) => item.variableId)),
    assumptions: experiment.assumptions.filter((item) => !item.heldConstant),
    controls: experiment.assumptions.filter((item) => item.heldConstant),
    deterministicCalculations: Object.freeze(experiment.views.filter((view) => view.resultClass === "DETERMINISTIC_CALCULATION")),
    modelEstimates: Object.freeze(experiment.views.filter((view) => view.resultClass === "MODEL_ESTIMATE")),
    unsupportedOutcomes: Object.freeze(experiment.views.filter((view) => view.resultClass === "UNSUPPORTED_PREDICTION")),
    classifiedResults: classified,
    evidenceBasis: experiment.modelIdsUsed,
    causalLimits: Object.freeze(
      experiment.views
        .filter((view) => /effect size|quantitative/.test(view.reason))
        .map((view) => view.reason),
    ),
    confounders: experiment.confounders,
    uncertainty: experiment.uncertainty,
    managerIntent,
    provenance: Object.freeze([
      `experiment:${experiment.experimentId}`,
      `baseline:${experiment.analysisContextId}`,
      ...experiment.modelIdsUsed.map((id) => `model:${id}`),
    ]),
  });
}

export function resolveVaiExperimentScenarioHandoff(input: {
  readonly utterance: string;
  readonly experiment: VaiWhatIfExperiment | null;
  readonly session?: Vai8PromotionSession | null;
  readonly scenarioSession?: NexoraExecutiveScenarioSession | null;
  readonly executiveContext?: NexoraExecutiveContextSnapshot | null;
  readonly currentReferentId?: string | null;
  readonly inspectOnly?: boolean;
  readonly canonicalWrite?: "succeed" | "fail";
}): Vai8HandoffResult {
  const prior = input.session ?? emptyVai8PromotionSession(input.experiment?.analysisContextId ?? "");
  if (input.inspectOnly) {
    return idle("Inspecting the experiment does not create a Scenario.", prior, input.scenarioSession ?? null, false);
  }
  const text = input.utterance.trim();
  if (isVai8Cancel(text) && prior.confirmationState === "PENDING_CONFIRMATION") {
    const session = Object.freeze({
      ...prior,
      confirmationState: "CANCELLED" as const,
      pendingProposal: prior.pendingProposal,
      presentationState: "EXPERIMENT" as const,
      canonicalScenarioId: null,
      lastFailure: null,
    });
    return finish("The experiment remains a temporary what-if. No Scenario was created.", session, input.scenarioSession ?? null, prior.pendingProposal, true);
  }
  if (isVai8Confirmation(text) && prior.confirmationState === "PENDING_CONFIRMATION" && prior.pendingProposal) {
    return confirm(prior, input);
  }
  if (!isExplicitVai8PromotionIntent(text)) {
    return idle(null, prior, input.scenarioSession ?? null, false);
  }
  if (!input.experiment) {
    return finish(
      "There is no active experiment to prepare as a Scenario.",
      prior,
      input.scenarioSession ?? null,
      null,
      true,
    );
  }
  if (
    input.currentReferentId
    && input.currentReferentId !== input.experiment.focalObjectId
    && !/staffing|experiment|what-if/i.test(text)
  ) {
    const session = Object.freeze({
      ...prior,
      confirmationState: "CLARIFY_REFERENT" as const,
      presentationState: "EXPERIMENT" as const,
    });
    return finish(
      "Which item should become a Scenario — the current subject, or the staffing experiment?",
      session,
      input.scenarioSession ?? null,
      null,
      true,
    );
  }
  const proposal = buildVaiExperimentScenarioProposal(input.experiment, text);
  const already = prior.promotedByExperimentId[proposal.experimentId];
  if (already) {
    const session = Object.freeze({
      ...prior,
      confirmationState: "CONFIRMED" as const,
      canonicalScenarioId: already,
      presentationState: "CANONICAL_SCENARIO" as const,
      pendingProposal: proposal,
    });
    return finish(
      "That experiment is already available as a Scenario. A second copy was not created.",
      session,
      input.scenarioSession ?? null,
      proposal,
      true,
    );
  }
  const changed = proposal.assumptions[0];
  const label = changed
    ? changed.operator === "increase-percent" && changed.inputValue != null
      ? `${changed.displayName} +${changed.inputValue}%`
      : changed.displayName
    : "this experiment";
  const session = Object.freeze({
    analysisContextId: proposal.analysisContextId,
    pendingProposal: proposal,
    confirmationState: "PENDING_CONFIRMATION" as const,
    canonicalScenarioId: null,
    presentationState: "PROPOSED_AS_SCENARIO" as const,
    promotedByExperimentId: prior.promotedByExperimentId,
    lastFailure: null,
  });
  return finish(
    `This is still a what-if experiment. Create a scenario using ${label}? I can prepare it as a Scenario for review; it will not change current business data.`,
    session,
    input.scenarioSession ?? null,
    proposal,
    true,
  );
}

export function applyVai8ToPresentedResponse(input: {
  readonly source: string;
  readonly utterance: string;
  readonly experiment: VaiWhatIfExperiment | null;
  readonly session?: Vai8PromotionSession | null;
  readonly scenarioSession?: NexoraExecutiveScenarioSession | null;
  readonly executiveContext?: NexoraExecutiveContextSnapshot | null;
  readonly currentReferentId?: string | null;
  readonly locked?: boolean;
}): { readonly source: string; readonly result: Vai8HandoffResult } {
  const result = resolveVaiExperimentScenarioHandoff({
    utterance: input.utterance,
    experiment: input.experiment,
    session: input.session,
    scenarioSession: input.scenarioSession,
    executiveContext: input.executiveContext,
    currentReferentId: input.currentReferentId,
  });
  if (!result.apply || !result.response) {
    return { source: input.source, result };
  }
  const promotionTurn =
    isExplicitVai8PromotionIntent(input.utterance)
    || isVai8Confirmation(input.utterance)
    || isVai8Cancel(input.utterance);
  if (input.locked && !promotionTurn) {
    return { source: input.source, result };
  }
  return { source: result.response, result };
}

export function vai8UncertaintyNotes(experiment: VaiWhatIfExperiment | null): readonly string[] {
  if (!experiment) return Object.freeze([]);
  return Object.freeze(
    experiment.views
      .filter((view) => view.resultClass === "UNSUPPORTED_PREDICTION")
      .map((view) => `${view.displayName} impact remains unsupported.`),
  );
}

export function verifyVaiExperimentDecisionIntegration(): { readonly ok: true } {
  if (VAI_8_BOUNDARY.secondScenarioAuthority) throw new Error("VAI:8 must not create a Scenario authority");
  if (VAI_8_BOUNDARY.secondDecisionAuthority) throw new Error("VAI:8 must not create a Decision authority");
  if (VAI_8_BOUNDARY.startsVai9) throw new Error("VAI:8 must not start VAI:9");
  if (VAI_8_BOUNDARY.implicitPromotion) throw new Error("VAI:8 must not implicitly promote");
  if (VAI_8_BOUNDARY.trainsModels) throw new Error("VAI:8 must not train models");
  return Object.freeze({ ok: true as const });
}

function confirm(
  prior: Vai8PromotionSession,
  input: {
    readonly scenarioSession?: NexoraExecutiveScenarioSession | null;
    readonly executiveContext?: NexoraExecutiveContextSnapshot | null;
    readonly canonicalWrite?: "succeed" | "fail";
  },
): Vai8HandoffResult {
  const proposal = prior.pendingProposal!;
  if (input.canonicalWrite === "fail") {
    const session = Object.freeze({
      ...prior,
      confirmationState: "FAILED" as const,
      presentationState: "PROPOSED_AS_SCENARIO" as const,
      lastFailure: "canonical-scenario-write-failed",
    });
    return finish(
      "The Scenario could not be created. The experiment is unchanged, and no Decision or work was started.",
      session,
      input.scenarioSession ?? null,
      proposal,
      true,
    );
  }
  const assumptions = mapAssumptions(proposal);
  const executiveContext = input.executiveContext ?? createEmptyNexoraExecutiveContextSnapshot({
    currentProblem: proposal.focalObjectId
      ? freezeExecutiveContextReference({
          subjectId: proposal.focalObjectId,
          subjectKind: "problem",
          canonicalName: proposal.focalObjectId,
          source: "runtime",
          turnIndex: 1,
        })
      : null,
  });
  const baseSession = input.scenarioSession ?? createEmptyNexoraExecutiveScenarioSession();
  const written = resolveNexoraExecutiveScenarioConversation({
    executiveContext,
    operation: "define-intervention",
    primarySubjectId: proposal.focalObjectId,
    subjectIds: Object.freeze([proposal.focalObjectId]),
    assumptions,
    interventions: Object.freeze([]),
    requireHorizon: false,
    nameHint: nameHintOf(proposal),
    session: baseSession,
  });
  if (!written.scenario || written.status === "clarification-required" || written.status === "invalid") {
    const session = Object.freeze({
      ...prior,
      confirmationState: "FAILED" as const,
      presentationState: "PROPOSED_AS_SCENARIO" as const,
      lastFailure: written.status,
    });
    return finish(
      "The Scenario could not be created. The experiment is unchanged.",
      session,
      baseSession,
      proposal,
      true,
    );
  }
  const session = Object.freeze({
    ...prior,
    confirmationState: "CONFIRMED" as const,
    canonicalScenarioId: written.scenario.scenarioId,
    presentationState: "CANONICAL_SCENARIO" as const,
    pendingProposal: proposal,
    promotedByExperimentId: Object.freeze({
      ...prior.promotedByExperimentId,
      [proposal.experimentId]: written.scenario.scenarioId,
    }),
    lastFailure: null,
  });
  const unknown = proposal.unsupportedOutcomes[0]?.displayName;
  const response = unknown
    ? `The ${nameHintOf(proposal)} experiment is now available as a Scenario for comparison. Its ${unknown} effect is still uncertain.`
    : `The ${nameHintOf(proposal)} experiment is now available as a Scenario for comparison.`;
  return finish(response, session, written.nextSession, proposal, true, "CC:9");
}

function mapAssumptions(proposal: VaiExperimentScenarioProposal): readonly NexoraScenarioAssumption[] {
  return Object.freeze(
    proposal.assumptions.map((item) => {
      const classified = proposal.classifiedResults.find((result) => result.variableId === item.variableId);
      const operator = item.operator === "increase-percent" ? "increase-by" : item.operator === "hold" ? "hold" : "set";
      return Object.freeze({
        key: item.variableId,
        subjectId: proposal.focalObjectId,
        metricKey: item.variableId,
        operator,
        value: item.operator === "increase-percent" ? item.inputValue ?? undefined : item.assumedValue ?? undefined,
        unit: item.operator === "increase-percent" ? "%" : item.unit ?? undefined,
        evidenceSource: classified
          ? `${item.variableId}:${classified.resultClass}:${proposal.experimentId}`
          : `experiment:${proposal.experimentId}`,
      });
    }),
  );
}

function nameHintOf(proposal: VaiExperimentScenarioProposal): string {
  const changed = proposal.assumptions[0];
  if (changed?.operator === "increase-percent" && changed.inputValue != null) {
    return `${changed.displayName} +${changed.inputValue}%`;
  }
  return changed?.displayName ?? "Experiment";
}

function idle(
  response: string | null,
  session: Vai8PromotionSession,
  scenarioSession: NexoraExecutiveScenarioSession | null,
  apply: boolean,
): Vai8HandoffResult {
  return finish(response, session, scenarioSession, session.pendingProposal, apply);
}

function finish(
  response: string | null,
  session: Vai8PromotionSession,
  scenarioSession: NexoraExecutiveScenarioSession | null,
  proposal: VaiExperimentScenarioProposal | null,
  apply: boolean,
  writer: "CC:9" | null = null,
): Vai8HandoffResult {
  if (response && LEAK.test(response)) {
    throw new Error("VAI:8 manager-facing text leaked architecture terminology");
  }
  const presentation = presentationOf(session.confirmationState);
  return Object.freeze({
    identity: vaiExperimentDecisionIdentity,
    apply,
    response,
    proposal,
    session: Object.freeze({ ...session, presentationState: presentation }),
    scenarioSession,
    provenance: Object.freeze({
      experimentId: proposal?.experimentId ?? null,
      proposalId: proposal?.proposalId ?? null,
      canonicalScenarioId: session.canonicalScenarioId,
      baselineRefs: Object.freeze(proposal?.baseline.map((item) => `${item.variableId}:${item.value}`) ?? []),
      writer,
    }),
    recommendationIssued: false,
    winnerSelected: false,
    decisionApproved: false,
    executionStarted: false,
    outcomeWritten: false,
    learningWritten: false,
    dataRealityWritten: false,
    coefficientsUpdated: false,
    npsReplaced: false,
    canonicalWriter: writer,
  });
}

function presentationOf(state: Vai8ConfirmationState): Vai8PresentationState {
  if (state === "CONFIRMED") return "CANONICAL_SCENARIO";
  if (state === "PENDING_CONFIRMATION" || state === "FAILED") return "PROPOSED_AS_SCENARIO";
  return "EXPERIMENT";
}
