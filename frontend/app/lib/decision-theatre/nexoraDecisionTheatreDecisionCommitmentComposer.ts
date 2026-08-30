/**
 * DTH:8 — Decision Commitment composer.
 * Projects a read-only review from DTH:7 + CC:10R. Does not commit.
 */

import type { NexoraDecisionTheatreFoundation } from "./nexoraDecisionTheatreContract.ts";
import {
  nexoraDecisionTheatreDecisionCommitmentIdentity,
  nexoraDecisionTheatreDecisionCommitmentVersion,
  type NexoraDecisionTheatreCommitmentAction,
  type NexoraDecisionTheatreCommitmentActionAvailability,
  type NexoraDecisionTheatreCommitmentState,
  type NexoraDecisionTheatreDecisionCommitment,
} from "./nexoraDecisionTheatreDecisionCommitment.ts";

export const nexoraDecisionTheatreDecisionCommitmentComposerIdentity =
  "DTH:8/DecisionCommitmentComposer" as const;

export type NexoraDecisionTheatreAuthoritativeDecision = Readonly<{
  decisionId: string;
  title: string;
  status: string;
  scenarioId: string | null;
  committedBy: string | null;
}>;

function freezeTree<T>(value: T): T {
  if (value == null || typeof value !== "object") return value;
  if (Array.isArray(value)) {
    for (const item of value) freezeTree(item);
    return Object.freeze(value) as T;
  }
  for (const nested of Object.values(value as Record<string, unknown>)) {
    freezeTree(nested);
  }
  return Object.freeze(value);
}

function action(
  name: NexoraDecisionTheatreCommitmentAction,
  available: boolean,
  reason: string,
): NexoraDecisionTheatreCommitmentActionAvailability {
  return Object.freeze({ action: name, available, reason });
}

export function projectNexoraDecisionTheatreDecisionCommitment(input: {
  readonly theatre: NexoraDecisionTheatreFoundation;
  readonly reviewOpen?: boolean | null;
  readonly proposedCandidateId?: string | null;
  readonly authoritativeDecisions?: readonly NexoraDecisionTheatreAuthoritativeDecision[] | null;
  readonly executionStarted?: boolean | null;
  readonly pendingConfirmation?: boolean | null;
}): NexoraDecisionTheatreDecisionCommitment | null {
  const theatre = input.theatre;
  const comparison = theatre.decisionComparison;
  const approved = (input.authoritativeDecisions ?? []).filter((item) => item.status === "Approved");
  const committed = approved[0] ?? null;
  const reviewOpen = input.reviewOpen === true;
  if (!reviewOpen && committed == null) return null;
  if (comparison == null && committed == null) return null;

  const members = comparison?.candidates ?? [];
  const requested =
    input.proposedCandidateId && members.some((item) => item.id === input.proposedCandidateId)
      ? input.proposedCandidateId
      : comparison?.activeCandidateId;
  const fromComparison = members.find((item) => item.id === requested) ?? null;
  const fromCommitted =
    committed == null
      ? null
      : members.find((item) => item.id === committed.scenarioId) ??
        (committed.scenarioId
          ? {
              id: committed.scenarioId,
              label: committed.title,
              kind: "scenario",
              evidence: null,
              assumption: null,
            }
          : null);
  const candidate = fromComparison ?? fromCommitted;
  const candidateSource =
    fromComparison != null
      ? ("comparison-member" as const)
      : committed != null
        ? ("authoritative-decision" as const)
        : ("none" as const);

  let state: NexoraDecisionTheatreCommitmentState = "BLOCKED";
  if (committed != null) state = "COMMITTED";
  else if (candidate == null) state = "BLOCKED";
  else if (input.pendingConfirmation === true) state = "READY_TO_COMMIT";
  else state = "REVIEWING";

  const overwriteBlocked =
    committed != null &&
    candidate != null &&
    committed.scenarioId != null &&
    candidate.id !== committed.scenarioId;

  const evidence =
    candidate && "evidence" in candidate && candidate.evidence && candidate.evidence !== "unavailable" && candidate.evidence !== "unknown"
      ? candidate.evidence
      : "Nexora does not yet have enough evidence to determine this. Choosing it would not make the evidence certain.";
  const assumptions =
    candidate && "assumption" in candidate ? candidate.assumption : null;
  const uncertainty = comparison?.uncertainty ?? "Available support is limited to what the current sources provide.";
  const tradeOffs = comparison?.advisorReadable.tradeOffs ?? "There is not enough comparable information to state a trade-off without inventing one.";
  const recommendationLabel = comparison?.recommendation
    ? members.find((item) => item.id === comparison.recommendation?.candidateId)?.label ?? null
    : null;

  const haveIDecided =
    state === "COMMITTED"
      ? `Yes. ${committed?.title ?? "This Decision"} is the committed Decision. That is not the same as starting work.`
      : "No. You are still reviewing a choice. This is not a Decision until you explicitly approve it.";
  const reviewing =
    state === "COMMITTED"
      ? `${committed?.title ?? "This Decision"} is the committed Decision.`
      : candidate
        ? `You are reviewing ${candidate.label} as a possible Decision. This is not yet committed.`
        : "Select one of the compared options before reviewing a Decision.";
  const why = comparison?.advisorReadable.choice ?? "This choice is being considered from the current comparison.";
  const next =
    state === "COMMITTED"
      ? "The next step is execution planning when you explicitly start it. Work has not started automatically."
      : "If you approve this choice, Nexora will record a Decision. Execution still requires a separate action.";

  const canCommit = state === "REVIEWING" || state === "READY_TO_COMMIT";
  const actions = Object.freeze([
    action("REVIEW_CANDIDATE", comparison != null && state !== "COMMITTED", "Review uses the current comparison candidate."),
    action(
      "CHANGE_CANDIDATE",
      members.length >= 2 && state !== "COMMITTED",
      state === "COMMITTED"
        ? "A committed Decision cannot be replaced by ordinary selection. Use the existing reconsideration path."
        : "Another compared option can be reviewed before commitment.",
    ),
    action("SHOW_DECISION_EVIDENCE", true, "Evidence remains whatever existing sources support."),
    action("SHOW_DECISION_TRADE_OFFS", true, "Trade-offs come from the current comparison."),
    action("SHOW_DECISION_UNCERTAINTY", true, "Uncertainty remains visible after commitment."),
    action("RETURN_TO_COMPARISON", comparison != null && state !== "COMMITTED", "Cancel review to return to the same comparison."),
    action(
      "COMMIT_DECISION",
      canCommit && !overwriteBlocked,
      canCommit
        ? "Approval is sent to the existing Decision confirmation workflow."
        : "Commitment is unavailable until a candidate is under review.",
    ),
    action("CANCEL_DECISION_REVIEW", reviewOpen && state !== "COMMITTED", "Cancel closes review and does not create a Decision."),
    action("VIEW_COMMITTED_DECISION", state === "COMMITTED", state === "COMMITTED" ? "The Decision comes from the existing Decision authority." : "No Decision has been committed."),
    action(
      "PROCEED_TO_EXECUTION",
      false,
      "Execution starts only through the existing Execution workflow. Approving a Decision does not start work.",
    ),
  ]);

  const commitmentId = `dth8-commitment:${theatre.sceneScript.scriptId}:${candidate?.id ?? "none"}:${state}`;
  return freezeTree({
    identity: nexoraDecisionTheatreDecisionCommitmentIdentity,
    version: nexoraDecisionTheatreDecisionCommitmentVersion,
    commitmentId,
    open: true,
    state,
    sceneIntentKind: theatre.sceneIntent.intentKind,
    sceneScriptId: theatre.sceneScript.scriptId,
    comparisonId: comparison?.comparisonId ?? null,
    candidateId: candidate?.id ?? null,
    candidateType: candidate && "kind" in candidate ? String(candidate.kind) : null,
    candidateLabel: candidate?.label ?? null,
    candidateSource,
    focalGoal: comparison?.focalGoal ?? null,
    focalProblem: comparison?.focalProblem ?? null,
    recommendationLabel,
    evidence,
    assumptions,
    uncertainty,
    risks: candidate && "risk" in candidate ? (candidate.risk as string | null) : null,
    tradeOffs,
    expectedConsequence: null,
    readiness: comparison?.readiness ?? null,
    authoritativeDecisionId: committed?.decisionId ?? null,
    executionStarted: input.executionStarted === true,
    comparisonMemberIds: Object.freeze(comparison?.candidateIds ?? []),
    candidateChoices: Object.freeze((comparison?.candidates ?? []).map((item) => Object.freeze({ id: item.id, label: item.label }))),
    suggestedQuestions: Object.freeze(
      [
        "Why this one?",
        "What evidence supports it?",
        "What are the trade-offs?",
        "Have I already made the decision?",
      ].slice(0, 4),
    ),
    actions,
    advisorReadable: Object.freeze({
      reviewing,
      why,
      evidence,
      tradeOffs,
      uncertainty,
      consequence: "Expected consequence is shown only when an existing authority already supports it.",
      next,
      haveIDecided,
      recommendationDistinct: recommendationLabel
        ? `Nexora's recommendation of ${recommendationLabel} is not a manager Decision.`
        : "A recommendation is not a Decision.",
      mustNotInfer: Object.freeze([
        "Reviewing a choice is not a Decision.",
        "A recommendation is not a manager Decision.",
        "A Decision is not Execution.",
        "Missing cost or time is not zero.",
        "An assumption is not a fact.",
        "Commitment does not make uncertain evidence certain.",
      ]),
    }),
    limitations: Object.freeze([
      "Theatre presentation does not create Decisions.",
      "Clicking a candidate does not approve it.",
      overwriteBlocked ? "The committed Decision cannot be silently replaced." : "No Decision exists until explicit approval.",
    ]),
    derivationMetadata: Object.freeze({
      composer: "DTH:8/DecisionCommitmentComposer" as const,
      inventedDecision: false as const,
      clickCommitted: false as const,
      recommendationBecameDecision: false as const,
      startedExecution: false as const,
      unknownFlattenedToZero: false as const,
      assumptionPromoted: false as const,
      silentOverwrite: false as const,
      mutatedStage: false as const,
      timestampUsed: false as const,
      randomUsed: false as const,
    }),
  });
}
