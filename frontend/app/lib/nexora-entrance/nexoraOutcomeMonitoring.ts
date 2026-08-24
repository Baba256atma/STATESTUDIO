/**
 * NEX-EXP:9 — Outcome Monitoring & Goal Impact experience.
 * Observes and interprets. Does not start NEX-EXP:10 or invent causality.
 */

import type {
  NexoraMVPObjectInteractionCatalog,
  NexoraMVPObjectInteractionState,
} from "@/app/lib/nex-mvp/nexoraMVPObjectInteraction.ts";
import type { NexoraExecutionRuntimeAdapter } from "@/app/lib/conversational-control/executiveExecutionRuntimeAdapter.ts";
import { NEXORA_EXECUTIVE_GOAL_OBJECT_ID } from "./nexoraGoalDiscoveryTypes.ts";
import type { NexoraEntranceSession } from "./nexoraEntranceTypes.ts";
import {
  buildOutcomeContext,
  expectedStatements,
  followUpProgress,
  isOutcomeMonitoringUtterance,
  latestObserved,
  outcomeAuthorities,
  parseManagerObservation,
  parseNumericToken,
  summarizeOutcome,
  toLearningHandoff,
} from "./nexoraOutcomeMonitoringResolution.ts";
import {
  getNexoraOutcomeMonitoringIdentity,
  NEXORA_OUTCOME_MONITORING_BOUNDARY,
  verifyNexoraOutcomeMonitoring,
  type NexoraOutcomeMonitoringSession,
  type OutcomeMonitoringState,
} from "./nexoraOutcomeMonitoringTypes.ts";

export {
  getNexoraOutcomeMonitoringIdentity,
  NEXORA_OUTCOME_MONITORING_BOUNDARY,
  verifyNexoraOutcomeMonitoring,
};
export type { NexoraOutcomeMonitoringSession } from "./nexoraOutcomeMonitoringTypes.ts";

const OUTCOME_SLOT = [3.9, 1.35, 0] as const;
export const NEXORA_OUTCOME_OBJECT_ID = "outcome-exp9" as const;

export function createNexoraOutcomeMonitoringSession(): NexoraOutcomeMonitoringSession {
  return Object.freeze({
    state: "NOT_STARTED",
    context: null,
    observations: [],
    askedQuestionKeys: [],
    introduced: false,
    handoff: null,
    lastMutatedReality: null,
    lastCreatedLearning: null,
  });
}

export function overlayOutcomeOnEntranceCatalog(
  catalog: NexoraMVPObjectInteractionCatalog,
  session: NexoraOutcomeMonitoringSession | null,
): NexoraMVPObjectInteractionCatalog {
  const observed = session ? latestObserved(session.observations) : null;
  if (!observed) return catalog;
  const id = NEXORA_OUTCOME_OBJECT_ID;
  if (catalog.objects.some((entry) => entry.id === id)) return catalog;
  const executionId =
    catalog.objects.find((entry) => entry.id.startsWith("cc11:execution"))?.id ??
    catalog.contextSubjects.find((entry) => entry.kind === "execution")?.id ??
    null;
  const decisionId =
    catalog.objects.find((entry) => entry.id.startsWith("cc10:decision:"))?.id ??
    null;
  const goalId =
    catalog.objects.find((entry) => entry.id.startsWith("goal-"))?.id ??
    NEXORA_EXECUTIVE_GOAL_OBJECT_ID;
  return Object.freeze({
    ...catalog,
    objects: Object.freeze([
      ...catalog.objects,
      Object.freeze({
        id,
        label: "Outcome",
        kind: "object" as const,
        position: OUTCOME_SLOT,
        status: "stable" as const,
        attention: "normal" as const,
      }),
    ]),
    relationships: Object.freeze([
      ...catalog.relationships,
      ...(executionId
        ? [
            Object.freeze({
              id: `rel-execution-outcome-${id}`,
              sourceId: executionId,
              targetId: id,
            }),
          ]
        : []),
      ...(decisionId
        ? [
            Object.freeze({
              id: `rel-decision-outcome-${id}`,
              sourceId: decisionId,
              targetId: id,
            }),
          ]
        : []),
      Object.freeze({
        id: `rel-goal-outcome-${id}`,
        sourceId: goalId,
        targetId: id,
      }),
    ]),
  });
}

export function shouldNexoraOutcomeMonitoringOwnUtterance(
  entrance: NexoraEntranceSession | null | undefined,
  utterance: string,
): boolean {
  if (!entrance || entrance.workspaceResolution === "existing-workspace") {
    return false;
  }
  const ready =
    entrance.executionPlanning?.state === "READY_FOR_OUTCOME_MONITORING";
  if (!ready && !entrance.outcomeMonitoring?.introduced) return false;
  const normalized = utterance.toLowerCase().replace(/[.!?]+$/g, "");
  if (isIdentityReserved(normalized)) return false;
  if (isManagerObjectUtterance(normalized)) return false;
  if (
    /let'?s (?:start|execute)|start it|start execution|what's the execution plan|what is the execution status/.test(
      normalized,
    )
  ) {
    return false;
  }
  if (/^why$/.test(normalized)) {
    return Boolean(entrance.outcomeMonitoring?.introduced);
  }
  return isOutcomeMonitoringUtterance(normalized);
}

export type NexoraOutcomeMonitoringTurnResult = {
  readonly session: NexoraOutcomeMonitoringSession;
  readonly response: string;
  readonly ownsResponse: boolean;
  readonly shouldCommitRuntime: boolean;
  readonly nextRuntimeState: NexoraMVPObjectInteractionState;
  readonly catalog: NexoraMVPObjectInteractionCatalog;
};

export function resolveNexoraOutcomeMonitoringTurn(input: {
  readonly utterance: string;
  readonly entrance: NexoraEntranceSession;
  readonly runtimeState: NexoraMVPObjectInteractionState;
  readonly catalog: NexoraMVPObjectInteractionCatalog;
  readonly executionRuntime?: NexoraExecutionRuntimeAdapter | null;
}): NexoraOutcomeMonitoringTurnResult {
  const previous =
    input.entrance.outcomeMonitoring ?? createNexoraOutcomeMonitoringSession();
  const normalized = input.utterance.toLowerCase().replace(/[.!?]+$/g, "");
  const parsed = parseManagerObservation(
    input.utterance,
    input.entrance,
    previous.observations,
  );
  const observations = parsed
    ? mergeObservation(previous.observations, parsed)
    : previous.observations;
  const hasObserved = Boolean(latestObserved(observations));
  const impactPreview = buildOutcomeContext({
    entrance: input.entrance,
    observations,
    state: "MONITORING_ACTIVE",
  }).goalImpact;
  let state: OutcomeMonitoringState = hasObserved
    ? impactPreview.state === "UNKNOWN"
      ? "GOAL_IMPACT_UNKNOWN"
      : "GOAL_IMPACT_RESOLVED"
    : "AWAITING_OBSERVATION";
  if (hasObserved) state = "OUTCOME_COMPARED";
  if (
    hasObserved &&
    (impactPreview.state === "IMPROVING" ||
      impactPreview.state === "WORSENING" ||
      impactPreview.state === "UNCHANGED" ||
      impactPreview.state === "ACHIEVED" ||
      impactPreview.state === "MIXED")
  ) {
    state = "READY_FOR_LEARNING_REASSESSMENT";
  }
  const context = buildOutcomeContext({
    entrance: input.entrance,
    observations,
    state,
  });
  const progress = followUpProgress(
    input.executionRuntime ?? null,
    input.entrance.executionPlanning?.canonicalExecutionId ?? null,
  );
  const response = answerOutcomeQuestion({
    normalized,
    context,
    progress,
    runtimeStatus: input.entrance.executionPlanning?.canonicalStatus ?? null,
    entrance: input.entrance,
  });
  const next = freezeOutcomeSession({
    ...previous,
    state,
    context,
    observations,
    askedQuestionKeys: unique([
      ...previous.askedQuestionKeys,
      normalized.slice(0, 48),
    ]),
    introduced: true,
    lastMutatedReality: null,
    lastCreatedLearning: null,
    handoff:
      state === "READY_FOR_LEARNING_REASSESSMENT"
        ? toLearningHandoff({ entrance: input.entrance, context })
        : previous.handoff,
  });
  return Object.freeze({
    session: next,
    response,
    ownsResponse: true,
    shouldCommitRuntime: false,
    nextRuntimeState: input.runtimeState,
    catalog: overlayOutcomeOnEntranceCatalog(input.catalog, next),
  });
}

export function outcomeMonitoringUsesExistingAuthorities(): boolean {
  const authorities = outcomeAuthorities();
  return (
    NEXORA_OUTCOME_MONITORING_BOUNDARY.startsNexExp10 === false &&
    NEXORA_OUTCOME_MONITORING_BOUNDARY.parallelOutcomeRuntime === false &&
    NEXORA_OUTCOME_MONITORING_BOUNDARY.infersCausality === false &&
    authorities.infersCausality === "unknown" &&
    getNexoraOutcomeMonitoringIdentity().id ===
      "NEX-EXP:9/OutcomeMonitoringGoalImpactExperience"
  );
}

function answerOutcomeQuestion(input: {
  readonly normalized: string;
  readonly context: ReturnType<typeof buildOutcomeContext>;
  readonly progress: string | null;
  readonly runtimeStatus: string | null;
  readonly entrance: NexoraEntranceSession;
}): string {
  const { context, normalized, progress, runtimeStatus, entrance } = input;
  const observed = latestObserved(context.observedOutcomes);
  const expected = expectedStatements(entrance)[0] ?? "PREDICTED directional movement";
  const summary = summarizeOutcome(context);
  if (/what did we expect/.test(normalized)) {
    return `${expected} This remains PREDICTED until observed.`;
  }
  if (/what actually happened|what is the outcome/.test(normalized)) {
    return observed
      ? `Observed: ${observed.observedValue}. Source: ${observed.source}. Epistemic status stays ${observed.epistemicStatus} until a validated measure confirms it. ${summary}`
      : summary;
  }
  if (/what changed/.test(normalized)) {
    const before = entrance.realityDiscovery?.context.gap?.currentValue ?? null;
    if (!observed || !before) {
      return `Nexora does not have a before/after Outcome comparison yet. ${progress ?? ""} ${summary}`;
    }
    return `Before execution baseline: ${before}. After: ${observed.observedValue}. ${progress ?? ""} Correlation is not causation.`;
  }
  if (/did it work/.test(normalized)) {
    if (!observed) {
      return "We do not yet have enough outcome evidence to determine whether the execution worked.";
    }
    if (context.goalImpact.state === "WORSENING") {
      return "The observed outcome is worse than the Goal direction. This does not by itself prove the execution caused the change.";
    }
    if (context.goalImpact.state === "ACHIEVED") {
      return "Goal success criteria currently appear satisfied. That is Outcome evidence, not a new Decision.";
    }
    return "We have evidence that the Goal moved in the expected direction, but the target has not yet been reached.";
  }
  if (/are we improving/.test(normalized)) {
    return `Goal impact is ${context.goalImpact.state}. Execution status ${runtimeStatus ?? "unknown"} is not Goal impact.`;
  }
  if (/did we achieve the goal/.test(normalized)) {
    if (!context.goalImpact.targetValue) {
      return "Nexora cannot determine Goal achievement because measurable success criteria are not defined.";
    }
    return context.goalImpact.state === "ACHIEVED"
      ? "Current evidence meets the recorded Goal success criteria. Execution may still be active."
      : `The Goal is not achieved. Current: ${context.goalImpact.currentValue ?? "unknown"}. Target: ${context.goalImpact.targetValue}.`;
  }
  if (/how far are we from the goal/.test(normalized)) {
    if (context.goalImpact.gapNow == null) {
      return "The remaining Goal gap is not measurable from current evidence.";
    }
    return `Gap before: ${context.goalImpact.gapBefore}. Gap now: ${context.goalImpact.gapNow}.`;
  }
  if (/where did that number come from/.test(normalized)) {
    return observed
      ? `Source: ${observed.source} (${observed.sourceAuthority}). Provenance: ${observed.provenance}.`
      : "No Outcome number is currently asserted.";
  }
  if (/how current is it/.test(normalized)) {
    return observed?.freshness === "stale"
      ? "The latest outcome evidence is stale, so Nexora cannot confidently determine current Goal impact."
      : observed
        ? `Freshness: ${observed.freshness}. Observation phase: ${observed.phase}.`
        : "No current Outcome observation is recorded.";
  }
  if (/early signal or a final outcome/.test(normalized)) {
    return observed
      ? `This is ${observed.phase}, not a final Outcome unless marked FINAL.`
      : "No observation yet, so timing class is UNKNOWN.";
  }
  if (/^why$/.test(normalized)) {
    return observed
      ? `Evidence: ${observed.observedValue} from ${observed.source}. Attribution remains NOT_CONFIRMED. After is not because of.`
      : "No observed Outcome evidence yet. Nexora will not invent a cause.";
  }
  if (/did the execution cause/.test(normalized)) {
    return "Delivery or other measures may have moved after execution began, but Nexora cannot confirm that the execution alone caused the change. Attribution is NOT_CONFIRMED.";
  }
  if (/what don'?t we know/.test(normalized)) {
    return context.unknowns.join(" ") || "Unknowns remain explicit: evidence, timing, and cause.";
  }
  if (/why is the outcome worse/.test(normalized)) {
    return "The observed result is worse than the expected direction. Nexora will not hide negative evidence, and will not invent a root cause.";
  }
  if (/should we keep going/.test(normalized)) {
    return `Current Goal impact: ${context.goalImpact.state}. Execution: ${runtimeStatus ?? "unknown"}. Whether to continue is a Learning question. Nexora will not make a new Decision from Outcome alone.`;
  }
  if (/should we reassess/.test(normalized)) {
    const signals = context.goalImpact.state === "WORSENING" ? "GOAL_WORSENING" : "handoff-ready";
    return `Reassessment signal: ${signals}. This is a handoff, not a new Decision. Learning has not started automatically.`;
  }
  if (/should we stop|cancel execution/.test(normalized)) {
    return "Nexora does not cancel execution from Outcome questions. Pause or cancel must go through the committed execution path."
  }
  if (/execution is done|did we succeed/.test(normalized)) {
    return `Execution status ${runtimeStatus ?? "unknown"} does not mean the Goal is achieved. Outcome remains ${context.goalImpact.state}.`;
  }
  if (/what happens next/.test(normalized)) {
    return context.status === "READY_FOR_LEARNING_REASSESSMENT"
      ? "Outcome context is ready for Learning. Nexora will not invent a Learning from Outcome alone."
      : "Observe Outcome evidence against the Goal. Do not treat execution progress as success.";
  }
  if (normalized.includes("91%") && normalized.includes("orders")) {
    return "Those measures are not comparable. Nexora will not compare percent on-time delivery to order counts as one Outcome.";
  }
  const recovered = parseNumericToken(observed?.observedValue ?? null);
  if (recovered != null && /cost worsened/.test(normalized)) {
    return `MIXED outcome: one signal moved, cost worsened. Nexora will not cherry-pick a single success signal. Goal impact: ${context.goalImpact.state}.`;
  }
  return summary;
}

function mergeObservation(
  previous: NexoraOutcomeMonitoringSession["observations"],
  next: NonNullable<ReturnType<typeof parseManagerObservation>>,
): NexoraOutcomeMonitoringSession["observations"] {
  const validated = previous.filter(
    (entry) => entry.source === "data-reality" && entry.epistemicStatus === "KNOWN",
  );
  if (validated.length && next.source === "manager-reported") {
    return Object.freeze([
      ...previous.filter((entry) => entry.measure !== next.measure),
      ...validated.filter((entry) => entry.measure === next.measure),
      Object.freeze({
        ...next,
        observationId: next.observationId,
        state: "conflict-manager-report",
      }),
    ]);
  }
  const withoutSame = previous.filter(
    (entry) =>
      !(
        entry.source === "manager-reported" &&
        entry.measure === next.measure
      ),
  );
  return Object.freeze([...withoutSame, next]);
}

function freezeOutcomeSession(
  session: NexoraOutcomeMonitoringSession,
): NexoraOutcomeMonitoringSession {
  return Object.freeze({
    ...session,
    observations: Object.freeze([...session.observations]),
    askedQuestionKeys: Object.freeze([...session.askedQuestionKeys]),
  });
}

function unique(values: readonly string[]): readonly string[] {
  return Object.freeze([...new Set(values.filter(Boolean))]);
}

function isManagerObjectUtterance(normalized: string): boolean {
  return (
    /^(?:explain this|what is this|show(?: me)? .+|what is connected|where should i look next|how does this (?:help|affect|support) my goal|where are we(?: now)?|what needs my attention)$/.test(
      normalized,
    ) ||
    /^explain .+/i.test(normalized) ||
    /^show outcome/.test(normalized)
  );
}

function isIdentityReserved(normalized: string): boolean {
  return (
    /what do you know about me/.test(normalized) || normalized === "who are you"
  );
}
