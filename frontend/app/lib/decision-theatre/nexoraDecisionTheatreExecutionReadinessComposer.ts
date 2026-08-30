/**
 * DTH:9 — Execution Readiness composer.
 * Projects CC:10R + CC:11. Does not start Execution.
 */

import type { NexoraDecisionTheatreFoundation } from "./nexoraDecisionTheatreContract.ts";
import {
  nexoraDecisionTheatreExecutionReadinessIdentity,
  nexoraDecisionTheatreExecutionReadinessVersion,
  type NexoraDecisionTheatreExecutionReadiness,
  type NexoraDecisionTheatreExecutionReadinessAction,
  type NexoraDecisionTheatreExecutionReadinessActionAvailability,
  type NexoraDecisionTheatreExecutionReadinessState,
  type NexoraDecisionTheatreReadinessEvidence,
} from "./nexoraDecisionTheatreExecutionReadiness.ts";

export const nexoraDecisionTheatreExecutionReadinessComposerIdentity =
  "DTH:9/ExecutionReadinessComposer" as const;

export type NexoraDecisionTheatreAuthoritativeExecution = Readonly<{
  executionId: string;
  decisionId: string;
  title: string;
  status: string;
  ownerIds: readonly string[];
  blockers: readonly Readonly<{ blockerId: string; label: string }>[];
  risks: readonly Readonly<{ riskId: string; label: string }>[];
  milestones: readonly Readonly<{ milestoneId: string; label: string; deadline?: string }>[];
  progress?: number;
  outcomeId?: string | null;
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
  name: NexoraDecisionTheatreExecutionReadinessAction,
  available: boolean,
  reason: string,
): NexoraDecisionTheatreExecutionReadinessActionAvailability {
  return Object.freeze({ action: name, available, reason });
}

function unknownEvidence(summary: string): NexoraDecisionTheatreReadinessEvidence {
  return Object.freeze({ status: "unknown" as const, summary });
}

function knownEvidence(summary: string): NexoraDecisionTheatreReadinessEvidence {
  return Object.freeze({ status: "known" as const, summary });
}

function startedStatus(status: string | null): boolean {
  return status === "in-progress" || status === "blocked" || status === "at-risk" || status === "completed";
}

export function projectNexoraDecisionTheatreExecutionReadiness(input: {
  readonly theatre: NexoraDecisionTheatreFoundation;
  readonly authoritativeExecutions?: readonly NexoraDecisionTheatreAuthoritativeExecution[] | null;
  readonly executionRuntimeAvailable?: boolean | null;
}): NexoraDecisionTheatreExecutionReadiness | null {
  const commitment = input.theatre.decisionCommitment;
  if (commitment?.state !== "COMMITTED" || commitment.authoritativeDecisionId == null) return null;

  const related =
    (input.authoritativeExecutions ?? []).find((item) => item.decisionId === commitment.authoritativeDecisionId) ??
    null;
  const executionStatus = related?.status ?? null;
  const started = startedStatus(executionStatus);
  const cc11Available = input.executionRuntimeAvailable === true;
  const authoritativeBlockers = related?.blockers ?? [];

  let readiness: NexoraDecisionTheatreExecutionReadinessState = "COMMITTED_AWAITING_EXECUTION";
  if (started && executionStatus === "blocked") readiness = "EXECUTION_BLOCKED";
  else if (started) readiness = "EXECUTION_STARTED";
  else if (executionStatus === "ready") readiness = "EXECUTION_READY";
  else if (executionStatus === "blocked") readiness = "EXECUTION_BLOCKED";

  const owner =
    related && related.ownerIds.length > 0
      ? knownEvidence(related.ownerIds.join(", "))
      : unknownEvidence("An owner is not established.");
  const timing =
    related && related.milestones.some((item) => item.deadline)
      ? knownEvidence("Timing comes from the existing execution milestones.")
      : unknownEvidence("Start timing is not established.");
  const resources = unknownEvidence("Required resources are not established.");
  const dependencies = unknownEvidence("Dependencies are not established.");
  const constraints =
    authoritativeBlockers.length > 0
      ? Object.freeze({ status: "blocked" as const, summary: authoritativeBlockers.map((item) => item.label).join("; ") })
      : unknownEvidence("Constraints are not established.");
  const risk =
    related && related.risks.length > 0
      ? knownEvidence(related.risks.map((item) => item.label).join("; "))
      : unknownEvidence("Execution risk is not established.");

  const dimensions = Object.freeze({ owner, timing, resources, dependencies, constraints, risk });
  const unknownDimensions = Object.freeze(
    Object.entries(dimensions)
      .filter(([, value]) => value.status === "unknown")
      .map(([key]) => key),
  );
  const canStart = cc11Available && !started && readiness !== "EXECUTION_BLOCKED";
  const readinessId = `dth9-readiness:${input.theatre.sceneScript.scriptId}:${commitment.authoritativeDecisionId}:${readiness}:${related?.executionId ?? "none"}`;

  return freezeTree({
    identity: nexoraDecisionTheatreExecutionReadinessIdentity,
    version: nexoraDecisionTheatreExecutionReadinessVersion,
    readinessId,
    open: true,
    readiness,
    sceneIntentKind: input.theatre.sceneIntent.intentKind,
    sceneScriptId: input.theatre.sceneScript.scriptId,
    decisionId: commitment.authoritativeDecisionId,
    decisionTitle: commitment.candidateLabel ?? commitment.advisorReadable.reviewing,
    executionId: related?.executionId ?? null,
    executionStatus,
    cc11Available,
    relatedExecutionExists: related != null,
    canRequestExecutionStart: canStart,
    supportedDimensions: dimensions,
    blockers: Object.freeze(
      authoritativeBlockers.map((item) =>
        Object.freeze({ id: item.blockerId, label: item.label, source: "authoritative-execution" as const }),
      ),
    ),
    unknownDimensions,
    comparisonMemberIds: commitment.comparisonMemberIds,
    suggestedQuestions: Object.freeze([
      "Has execution started?",
      "What do we need before we start?",
      "What happens next?",
    ]),
    actions: Object.freeze([
      action("VIEW_COMMITTED_DECISION", true, "The Decision comes from the existing Decision authority."),
      action("SHOW_EXECUTION_READINESS", true, "Readiness is a Theatre presentation of known and unknown conditions."),
      action(
        "SHOW_RELATED_EXECUTION",
        related != null,
        related != null ? "The related Execution comes from the existing Execution authority." : "No related Execution exists yet.",
      ),
      action(
        "SHOW_COMPARISON_HISTORY",
        commitment.comparisonMemberIds.length >= 2,
        "Compared options remain available as history, not as an open choice.",
      ),
      action(
        "REQUEST_START_EXECUTION",
        canStart,
        canStart
          ? "Start is sent to the existing Execution confirmation workflow."
          : cc11Available
            ? "Execution has already started or is blocked by existing Execution authority."
            : "The decision is approved, but execution has not been started yet.",
      ),
    ]),
    advisorReadable: Object.freeze({
      scene: `${commitment.candidateLabel ?? "This Decision"} is the committed Decision. The Theatre is now showing what is needed before execution begins.`,
      hasStarted: started
        ? "Yes. Execution has started."
        : "No. The decision is approved, but execution has not started.",
      whatHappensNext: started
        ? "Execution is underway. Outcome tracking is a later step."
        : "Review what is known and unknown, then start execution only through an explicit start.",
      readiness:
        readiness === "EXECUTION_BLOCKED"
          ? "Existing Execution authority reports a blocker."
          : unknownDimensions.length > 0
            ? "Some readiness details are not established. That is not the same as a blocker."
            : "The Decision is committed.",
      missing: unknownDimensions.length
        ? unknownDimensions.map((item) => `${item} is not established`).join(". ") + "."
        : "No additional readiness details are missing from current sources.",
      startBoundary: canStart
        ? "Starting work requires an explicit start. Viewing this scene does not start execution."
        : "The decision is approved, but execution has not been started yet.",
      mustNotInfer: Object.freeze([
        "A committed Decision is not Execution started.",
        "Unknown readiness is not a blocker.",
        "Clicking the Decision does not start work.",
      ]),
    }),
    limitations: Object.freeze([
      "DTH:9 does not create Execution records.",
      "Missing owner or timing stays unknown unless existing Execution authority supplies it.",
    ]),
    derivationMetadata: Object.freeze({
      composer: "DTH:9/ExecutionReadinessComposer" as const,
      inventedExecution: false as const,
      clickStartedExecution: false as const,
      approvalStartedExecution: false as const,
      unknownPromotedToBlocked: false as const,
      inventedOwnerOrTiming: false as const,
      mutatedStage: false as const,
      timestampUsed: false as const,
      randomUsed: false as const,
    }),
  });
}
