/**
 * NPA-T NPS:8 runtime adapter. Observes ECA:11/12 and CORE-OUT evidence.
 * Does not write Outcome, Learning, Decision, or Execution.
 */

import type { EcaExecutiveLearningClosureJudgment } from "@/app/lib/nexora-conversation/ecaExecutiveLearningClosure.ts";
import type { EcaExecutiveOutcomeJudgment } from "@/app/lib/nexora-conversation/ecaExecutiveOutcome.ts";
import type { EcaOutcomeEvidence } from "@/app/lib/nexora-conversation/ecaExecutiveOutcome.ts";
import type { NpsCanonicalFacts } from "./npsProblemSolvingPath.ts";
import type { NpsDecisionCommitment } from "./npsDecisionCommitment.ts";
import type { NpsExecutionMonitoring } from "./npsExecutionMonitoring.ts";
import {
  composeNpsOutcomeLearning,
  observationFromEcaEvidence,
  type NpsOutcomeLearning,
  type NpsOutcomeObservation,
} from "./npsOutcomeLearning.ts";

export function composeNpsRuntimeOutcomeLearning(input: {
  readonly pathFacts: NpsCanonicalFacts;
  readonly commitment?: NpsDecisionCommitment | null;
  readonly execution?: NpsExecutionMonitoring | null;
  readonly ecaOutcome?: EcaExecutiveOutcomeJudgment | null;
  readonly ecaLearning?: EcaExecutiveLearningClosureJudgment | null;
  readonly evidence?: EcaOutcomeEvidence | null;
  readonly observation?: Partial<NpsOutcomeObservation> | null;
}): NpsOutcomeLearning {
  const handoff = input.execution?.outcomeHandoff;
  return composeNpsOutcomeLearning({
    pathFacts: input.pathFacts,
    commitment: input.commitment,
    ecaOutcome: input.ecaOutcome,
    ecaLearning: input.ecaLearning,
    observation: observationFromEcaEvidence(input.evidence, {
      ...input.observation,
      decisionId: input.observation?.decisionId ?? handoff?.decisionId ?? null,
      executionId: input.observation?.executionId ?? handoff?.executionId ?? null,
      executionStatus: input.observation?.executionStatus ?? handoff?.executionStatus ?? null,
    }),
  });
}

export function applyNpsOutcomeLearningToPresentedResponse(input: {
  readonly source: string;
  readonly utterance: string;
  readonly outcome: NpsOutcomeLearning;
  readonly locked?: boolean;
}): string {
  if (input.locked) return input.source;
  const utterance = input.utterance.trim();
  const didItWork = /\bdid it work\b|\bdid the decision work\b|\bwas it successful\b/i.test(utterance);
  const solved = /\bis (?:capacity gap |the problem |this )?(?:solved|resolved)\b|\bis capacity gap solved\b/i.test(
    utterance,
  );
  const next = /\bwhat should we do now\b/i.test(utterance);
  const caused = /\bcaused the improvement\b|\bdid (?:external capacity|capacity) cause\b/i.test(utterance);
  const facing = input.outcome.managerProjection.text.replace(/\n/g, " ");

  if (didItWork) {
    const completed = /completed/i.test(input.outcome.executionStatus ?? "");
    const answer =
      input.outcome.outcomeStatus === "UNKNOWN" || input.outcome.outcomeStatus === "TOO_EARLY"
        ? completed
          ? "Execution completed, but there is not enough Outcome evidence yet to determine whether it worked."
          : "There is not enough Outcome evidence yet to determine whether it worked."
        : facing;
    if (
      input.source.toLowerCase().includes("not enough outcome evidence") ||
      input.source.toLowerCase().includes("execution is complete, but")
    ) {
      return input.source;
    }
    return `${input.source} ${answer}`.trim();
  }
  if (solved) {
    const answer =
      input.outcome.resolutionStatus === "RESOLVED"
        ? `${input.outcome.problemTitle ?? "The Problem"} is resolved on the current Outcome evidence.`
        : input.outcome.resolutionStatus === "PARTIALLY_RESOLVED" || input.outcome.resolutionStatus === "IMPROVED"
          ? `${input.outcome.problemTitle ?? "The Problem"} improved, but it is not fully resolved.`
          : `${input.outcome.problemTitle ?? "The Problem"} is not solved from Execution completion alone.`;
    if (input.source.toLowerCase().includes("not fully resolved") || input.source.toLowerCase().includes("is resolved on the current")) {
      return input.source;
    }
    return `${input.source} ${answer}`.trim();
  }
  if (next) {
    const answer =
      input.outcome.reassessmentStatus !== "NOT_WARRANTED"
        ? "The next useful step is to reassess the remaining gap before making another Decision."
        : input.outcome.nextStep ?? facing;
    if (input.source.toLowerCase().includes("reassess the remaining gap") || input.source.toLowerCase().includes("does not create a new")) {
      return input.source;
    }
    return `${input.source} ${answer}`.trim();
  }
  if (caused) {
    const answer =
      "The observed change happened during or after the execution period. That does not establish that External Capacity caused the improvement.";
    if (input.source.toLowerCase().includes("doesn’t establish") || input.source.toLowerCase().includes("does not establish")) {
      return input.source;
    }
    return `${input.source} ${answer}`.trim();
  }
  return input.source;
}
