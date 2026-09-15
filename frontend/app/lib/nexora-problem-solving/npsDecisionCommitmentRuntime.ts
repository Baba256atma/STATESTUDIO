/**
 * NPA-T NPS:6 runtime adapter. Observes ECA:8 and CC:10 results.
 * Does not write Decisions or start Execution.
 */

import type { EcaExecutiveCommitmentJudgment } from "@/app/lib/nexora-conversation/ecaExecutiveCommitment.ts";
import type { NpsCanonicalFacts } from "./npsProblemSolvingPath.ts";
import type { NpsComparisonRecommendation } from "./npsComparisonRecommendation.ts";
import {
  composeNpsDecisionCommitment,
  type NpsCc10Observation,
  type NpsDecisionCommitment,
} from "./npsDecisionCommitment.ts";

export function composeNpsRuntimeDecisionCommitment(input: {
  readonly pathFacts: NpsCanonicalFacts;
  readonly comparison: NpsComparisonRecommendation;
  readonly eca?: EcaExecutiveCommitmentJudgment | null;
  readonly cc10?: Partial<NpsCc10Observation>;
}): NpsDecisionCommitment {
  return composeNpsDecisionCommitment(input);
}

export function applyNpsDecisionCommitmentToPresentedResponse(input: {
  readonly source: string;
  readonly utterance: string;
  readonly commitment: NpsDecisionCommitment;
  readonly locked?: boolean;
}): string {
  if (input.locked) return input.source;
  const utterance = input.utterance.trim();
  const asksDecided = /did we decide|have we decided|is that (?:the |our )?decision/i.test(utterance);
  const startIt = /^(?:start it|start execution|execute it)\.?$/i.test(utterance);
  const doIt = /^(?:do it|proceed)\.?$/i.test(utterance);
  const prefer = /\bi prefer\b|\bi like that\b|\bleaning toward\b/i.test(utterance);
  const proceed = /\blet'?s proceed|i want to proceed|proceed with it/i.test(utterance);
  if (asksDecided) {
    const answer = input.commitment.approvedDecisionId
      ? `Yes. ${input.commitment.committedOption ?? "That option"} is the approved Decision for ${input.commitment.problemTitle ?? "this Problem"}.`
      : `No. ${input.commitment.nexoraRecommendation ?? "The current option"} is currently the preferred or recommended option, but it has not been approved as the Decision.`;
    if (input.source.toLowerCase().includes("approved as the decision") || input.source.toLowerCase().includes("is the approved decision")) {
      return input.source;
    }
    return `${input.source} ${answer}`.trim();
  }
  if (startIt) {
    const note =
      "That would be an execution step. Check execution readiness next; nothing has started running yet.";
    if (input.source.toLowerCase().includes("execution readiness")) return input.source;
    return `${input.source} ${note}`.trim();
  }
  if (doIt && !input.commitment.approvedDecisionId) {
    const note =
      "That does not approve a Decision or start execution. Say which option to approve, then confirm it.";
    if (input.source.toLowerCase().includes("does not approve a Decision")) return input.source;
    return `${input.source} ${note}`.trim();
  }
  if ((prefer || proceed) && input.commitment.problemId) {
    const facing = input.commitment.managerProjection.text.replace(/\n/g, " ");
    if (input.source.toLowerCase().includes(facing.slice(0, 32).toLowerCase())) return input.source;
    return `${input.source} ${facing}`.trim();
  }
  if (
    /approve this Decision|supplier availability is still unconfirmed/i.test(input.source) === false &&
    (input.commitment.commitmentStatus === "CHALLENGE_REQUIRED" ||
      input.commitment.commitmentStatus === "AWAITING_CONFIRMATION") &&
    /yes\.?$/i.test(utterance) === false
  ) {
    if (proceed) {
      const facing = input.commitment.managerProjection.text.replace(/\n/g, " ");
      return `${input.source} ${facing}`.trim();
    }
  }
  return input.source;
}

export function npsComparedOptionRefs(comparison: NpsComparisonRecommendation): readonly {
  id: string;
  label: string;
}[] {
  return Object.freeze(
    comparison.comparedOptions.map((item) =>
      Object.freeze({ id: item.optionId, label: item.title }),
    ),
  );
}
