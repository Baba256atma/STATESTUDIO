/**
 * NPA-A VAI:7 — manager-facing what-if explanation through existing VAI:4 / CC:5 Advisor.
 * Not a second conversational engine.
 */

import { composeVaiAdvisorAnalysis, type VaiAdvisorComposition } from "./vaiAdvisorComposer.ts";
import type { VaiAdvisorBundle } from "./vaiAdvisorContract.ts";
import type { VaiTrustedQuantitativeModel } from "./vaiWhatIfContract.ts";
import type { VaiWhatIfExperiment, VaiWhatIfScenarioProposal, VaiWhatIfSession } from "./vaiWhatIfContract.ts";
import {
  compareVaiWhatIfExperiments,
  createVaiWhatIfExperiment,
  discardVaiWhatIfExperiment,
  emptyVaiWhatIfSession,
  parseWhatIfChanges,
  proposeVaiWhatIfAsScenario,
} from "./vaiWhatIfResolver.ts";

const LEAK = /\b(?:VAI:[1-8]|CC:\d+|CORE-INT:3|causalAssertion|resolver|semantic authority|role registry)\b/i;

export type VaiWhatIfAdvisorResult = {
  readonly apply: boolean;
  readonly response: string | null;
  readonly experiment: VaiWhatIfExperiment | null;
  readonly session: VaiWhatIfSession;
  readonly proposal: VaiWhatIfScenarioProposal | null;
  readonly discarded: boolean;
  readonly winnerSelected: false;
  readonly secondAdvisor: false;
};

export function isVaiWhatIfUtterance(utterance: string): boolean {
  const text = utterance.trim().toLowerCase();
  if (!text) return false;
  if (/why can'?t you predict|why can you not predict|why is (otd|that) unknown/.test(text)) return true;
  if (/make this a scenario|propose as a scenario|turn this into a scenario/.test(text)) return true;
  if (/discard (the )?(experiment|what-if)|reset (the )?experiment/.test(text)) return true;
  if (/compare (this |the )?(experiments?|higher staffing|staffing|with the current|current situation)/.test(text)) return true;
  if (/what would happen to (otd|the outcome)|what will otd become/.test(text)) return true;
  if (/explore change/.test(text)) return true;
  if (
    /what if/.test(text) &&
    /staffing|capacity|demand|machine availability|shift length|seasonality|backlog|\botd\b/.test(text)
  ) {
    return true;
  }
  if (/increases?(?: by)? \d+\s*%/.test(text) && /staffing|capacity|demand/.test(text)) return true;
  return false;
}

export function composeVaiWhatIfAdvisor(input: {
  readonly utterance: string;
  readonly bundle: VaiAdvisorBundle | null;
  readonly session?: VaiWhatIfSession | null;
  readonly models?: readonly VaiTrustedQuantitativeModel[];
  readonly requestedScope?: { readonly businessContext?: string | null };
}): VaiWhatIfAdvisorResult {
  const text = input.utterance.trim();
  if (!isVaiWhatIfUtterance(text)) {
    return idle(input.session ?? emptyVaiWhatIfSession());
  }
  if (/discard (the )?(experiment|what-if)|reset (the )?experiment/i.test(text)) {
    return Object.freeze({
      apply: true,
      response: "The temporary experiment is discarded. Current trusted values are unchanged.",
      experiment: null,
      session: discardVaiWhatIfExperiment(input.session ?? null),
      proposal: null,
      discarded: true,
      winnerSelected: false,
      secondAdvisor: false,
    });
  }
  if (!input.bundle) {
    return idle(input.session ?? emptyVaiWhatIfSession());
  }
  if (/make this a scenario|propose as a scenario|turn this into a scenario/i.test(text)) {
    const active = activeExperiment(input.session);
    const proposal = proposeVaiWhatIfAsScenario(active);
    const response = proposal
      ? "This experiment can be proposed as a scenario. Existing scenario confirmation is still required before anything is created."
      : "There is no active experiment to propose as a scenario.";
    return finish(response, active, input.session ?? emptyVaiWhatIfSession(input.bundle.analysisContextId), proposal);
  }
  if (/compare (this |the )?(experiments?|higher staffing|staffing|with the current|current situation)/i.test(text)) {
    const session = input.session ?? emptyVaiWhatIfSession(input.bundle.analysisContextId);
    const comparison = compareVaiWhatIfExperiments(session);
    const lines = comparison.experimentIds.map((id) => {
      const experiment = session.experimentsById[id]!;
      const assumed = experiment.assumptions.map((item) => `${item.displayName} ${item.assumedValue ?? "unknown"}`).join("; ");
      return `${id}: ${assumed}`;
    });
    const response = lines.length
      ? `Baseline remains the current trusted state. ${lines.join(" ")} Nexora is not selecting a preferred experiment.`
      : "There are no experiments to compare yet.";
    return finish(response, activeExperiment(session), session, null);
  }
  const changes = parseWhatIfChanges(text, input.bundle.variables);
  if (
    changes.length === 0 &&
    /why can'?t you predict|why can you not predict|why is (otd|that) unknown|what would happen to (otd|the outcome)|what will otd become/i.test(text)
  ) {
    const active = activeExperiment(input.session);
    const response = whyNoPrediction(active, input.bundle);
    return finish(response, active, input.session ?? emptyVaiWhatIfSession(input.bundle.analysisContextId), null);
  }
  if (changes.length === 0) {
    const next = composeVaiAdvisorAnalysis({
      utterance: "What should I investigate next?",
      bundle: input.bundle,
    });
    return finish(
      "Which factor should this experiment change? A baseline is required before Nexora can assume a new value.",
      null,
      input.session ?? emptyVaiWhatIfSession(input.bundle.analysisContextId),
      null,
      next,
    );
  }
  const created = createVaiWhatIfExperiment({
    bundle: input.bundle,
    experimentId: `exp:${input.bundle.analysisContextId}:${slug(text)}`,
    changes,
    models: input.models,
    requestedScope: input.requestedScope,
    session: input.session,
    createdFromRequest: text,
  });
  const why = /why can'?t you predict|why can you not predict/i.test(text);
  const response = why
    ? whyNoPrediction(created.experiment, input.bundle)
    : explainExperiment(created.experiment, input.bundle);
  return finish(response, created.experiment, created.session, null);
}

export function applyVaiWhatIfToPresentedResponse(input: {
  readonly source: string;
  readonly utterance: string;
  readonly bundle: VaiAdvisorBundle | null;
  readonly session?: VaiWhatIfSession | null;
  readonly models?: readonly VaiTrustedQuantitativeModel[];
  readonly requestedScope?: { readonly businessContext?: string | null };
  readonly locked?: boolean;
}): { readonly source: string; readonly result: VaiWhatIfAdvisorResult } {
  const result = composeVaiWhatIfAdvisor({
    utterance: input.utterance,
    bundle: input.bundle,
    session: input.session,
    models: input.models,
    requestedScope: input.requestedScope,
  });
  if (input.locked || !result.apply || !result.response) {
    return { source: input.source, result };
  }
  return { source: result.response, result };
}

function explainExperiment(experiment: VaiWhatIfExperiment | null, bundle: VaiAdvisorBundle): string {
  if (!experiment) {
    return "Nexora cannot run this experiment without a Variable analysis.";
  }
  const changed = experiment.views.find((view) => experiment.assumptions.some((item) => item.variableId === view.variableId && !item.heldConstant));
  const outcome = experiment.views.find((view) => view.role === "OUTCOME") ?? experiment.views.find((view) => /otd/i.test(view.displayName));
  const assumption = experiment.assumptions.find((item) => !item.heldConstant);
  const percent = assumption?.operator === "increase-percent" && assumption.inputValue != null ? `${assumption.inputValue}%` : null;
  const parts: string[] = [];
  if (changed && assumption) {
    if (changed.resultClass === "UNKNOWN_BASELINE") {
      parts.push(`Current ${changed.displayName.toLowerCase()} is unknown. Nexora will not invent a baseline to calculate an assumed value.`);
    } else {
      parts.push(`Current ${changed.displayName.toLowerCase()} is ${changed.baselineDisplay}.`);
      if (percent) {
        parts.push(`A ${percent} increase gives an assumed ${changed.displayName.toLowerCase()} level of ${changed.experimentDisplay}.`);
      } else {
        parts.push(`The experiment assumes ${changed.displayName.toLowerCase()} is ${changed.experimentDisplay}.`);
      }
    }
  }
  if (outcome) {
    if (outcome.resultClass === "MODEL_ESTIMATE") {
      parts.push(`A trusted model estimates ${outcome.displayName} at ${outcome.experimentDisplay}. This is not an observed result.`);
    } else if (outcome.resultClass === "DETERMINISTIC_CALCULATION") {
      parts.push(`${outcome.displayName} calculates to ${outcome.experimentDisplay} from the trusted baseline.`);
    } else {
      parts.push(`Nexora does not currently have a trusted quantitative model that converts this change into an ${outcome.displayName} prediction, so ${outcome.displayName} remains unknown in this experiment.`);
    }
  }
  const investigation = composeVaiAdvisorAnalysis({
    utterance: "What should I investigate next?",
    bundle,
  });
  if (investigation.investigationSuggestion) {
    parts.push(investigation.investigationSuggestion);
  }
  return parts.join(" ");
}

function whyNoPrediction(experiment: VaiWhatIfExperiment | null, bundle: VaiAdvisorBundle): string {
  const outcome = experiment?.views.find((view) => view.role === "OUTCOME") ?? experiment?.views.find((view) => /otd/i.test(view.displayName));
  const lever = experiment?.assumptions[0]?.displayName ?? "this factor";
  const related = bundle.relationship ? "related to this outcome" : "associated with other factors";
  const target = outcome?.displayName ?? "the outcome";
  return `We have evidence that ${lever.toLowerCase()} is ${related}, but we do not yet have a reliable quantitative relationship showing how this assumed change affects ${target}.`;
}

function finish(
  response: string,
  experiment: VaiWhatIfExperiment | null,
  session: VaiWhatIfSession,
  proposal: VaiWhatIfScenarioProposal | null,
  _advisor?: VaiAdvisorComposition,
): VaiWhatIfAdvisorResult {
  void _advisor;
  if (LEAK.test(response)) {
    throw new Error("VAI:7 manager-facing text leaked architecture terminology");
  }
  return Object.freeze({
    apply: true,
    response,
    experiment,
    session,
    proposal,
    discarded: false,
    winnerSelected: false,
    secondAdvisor: false,
  });
}

function idle(session: VaiWhatIfSession): VaiWhatIfAdvisorResult {
  return Object.freeze({
    apply: false,
    response: null,
    experiment: activeExperiment(session),
    session,
    proposal: null,
    discarded: false,
    winnerSelected: false,
    secondAdvisor: false,
  });
}

function activeExperiment(session: VaiWhatIfSession | null | undefined): VaiWhatIfExperiment | null {
  if (!session?.activeExperimentId) return null;
  return session.experimentsById[session.activeExperimentId] ?? null;
}

function slug(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 48) || "experiment";
}
