/**
 * NEX-EXP:8 — execution planning, readiness, and commitment-to-action projection.
 * CC:11 Canonical Execution Runtime is the only execution writer.
 */

import type {
  NexoraMVPObjectInteractionCatalog,
  NexoraMVPObjectInteractionState,
} from "@/app/lib/nex-mvp/nexoraMVPObjectInteraction.ts";
import type { NexoraExecutionRuntimeAdapter } from "@/app/lib/conversational-control/executiveExecutionRuntimeAdapter.ts";
import { NEXORA_EXECUTIVE_GOAL_OBJECT_ID } from "./nexoraGoalDiscoveryTypes.ts";
import type { NexoraEntranceSession } from "./nexoraEntranceTypes.ts";
import {
  applyFirstAction,
  applyOwnerToPlan,
  buildExecutionPlan,
  cancelThroughCanonicalRuntime,
  deriveBlockers,
  ensurePlannedExecution,
  isBareExecutionConfirmation,
  isExecutionPlanningUtterance,
  namedOtherScenario,
  planFingerprint,
  removeActionByFragment,
  startThroughCanonicalRuntime,
  summarizePlan,
  toOutcomeMonitoringHandoff,
} from "./nexoraExecutionPlanningResolution.ts";
import {
  getNexoraExecutionPlanningIdentity,
  NEXORA_EXECUTION_PLANNING_BOUNDARY,
  verifyNexoraExecutionPlanning,
  type ExecutionPlanningState,
  type NexoraExecutionPlanningSession,
  type PendingExecutionConfirmation,
} from "./nexoraExecutionPlanningTypes.ts";

export {
  getNexoraExecutionPlanningIdentity,
  NEXORA_EXECUTION_PLANNING_BOUNDARY,
  verifyNexoraExecutionPlanning,
};

const EXECUTION_SLOT = [3.35, -0.2, 0] as const;

export function createNexoraExecutionPlanningSession(): NexoraExecutionPlanningSession {
  return freezePlanningSession({
    state: "NOT_STARTED",
    plan: null,
    pendingConfirmation: null,
    canonicalExecutionId: null,
    canonicalStatus: null,
    askedQuestionKeys: [],
    introduced: false,
    handoff: null,
    lastMutatedReality: null,
    lastInventedOwner: null,
  });
}

export function overlayExecutionOnEntranceCatalog(
  catalog: NexoraMVPObjectInteractionCatalog,
  session: NexoraExecutionPlanningSession | null,
): NexoraMVPObjectInteractionCatalog {
  const id = session?.canonicalExecutionId;
  const plan = session?.plan;
  if (!id || !plan) return catalog;
  if (catalog.objects.some((entry) => entry.id === id)) return catalog;
  const decisionId =
    catalog.objects.find((entry) => entry.id.startsWith("cc10:decision:"))?.id ??
    null;
  const goalId =
    catalog.objects.find((entry) => entry.id.startsWith("goal-"))?.id ??
    NEXORA_EXECUTIVE_GOAL_OBJECT_ID;
  const started =
    session.canonicalStatus === "in-progress" ||
    session.canonicalStatus === "blocked" ||
    session.canonicalStatus === "at-risk";
  return Object.freeze({
    ...catalog,
    objects: Object.freeze([
      ...catalog.objects,
      Object.freeze({
        id,
        label: plan.objective,
        kind: "object" as const,
        position: EXECUTION_SLOT,
        status: "stable" as const,
        attention: started ? ("elevated" as const) : ("normal" as const),
      }),
    ]),
    relationships: Object.freeze([
      ...catalog.relationships,
      ...(decisionId
        ? [
            Object.freeze({
              id: `rel-decision-execution-${id}`,
              sourceId: decisionId,
              targetId: id,
            }),
          ]
        : []),
      Object.freeze({
        id: `rel-goal-execution-${id}`,
        sourceId: goalId,
        targetId: id,
      }),
    ]),
    contextSubjects: Object.freeze([
      ...catalog.contextSubjects,
      Object.freeze({
        id,
        label: "Execution",
        kind: "execution" as const,
        status: "stable" as const,
        attention: started ? ("elevated" as const) : ("normal" as const),
      }),
    ]),
  });
}

export function shouldNexoraExecutionPlanningOwnUtterance(
  entrance: NexoraEntranceSession | null | undefined,
  utterance: string,
): boolean {
  if (!entrance || entrance.workspaceResolution === "existing-workspace") {
    return false;
  }
  const ready =
    entrance.decisionExperience?.state === "READY_FOR_EXECUTION_PLANNING";
  if (!ready && !entrance.executionPlanning?.introduced) return false;
  const normalized = utterance.toLowerCase().replace(/[.!?]+$/g, "");
  if (isIdentityReserved(normalized)) return false;
  if (isManagerObjectUtterance(normalized)) return false;
  const pending = Boolean(entrance.executionPlanning?.pendingConfirmation);
  if (pending && isBareExecutionConfirmation(normalized)) return true;
  if (/^why$/.test(normalized)) {
    return Boolean(entrance.executionPlanning?.introduced);
  }
  if (isExecutionPlanningUtterance(normalized)) return true;
  return false;
}

export type NexoraExecutionPlanningTurnResult = {
  readonly session: NexoraExecutionPlanningSession;
  readonly response: string;
  readonly ownsResponse: boolean;
  readonly shouldCommitRuntime: boolean;
  readonly nextRuntimeState: NexoraMVPObjectInteractionState;
  readonly catalog: NexoraMVPObjectInteractionCatalog;
};

export function resolveNexoraExecutionPlanningTurn(input: {
  readonly utterance: string;
  readonly entrance: NexoraEntranceSession;
  readonly runtimeState: NexoraMVPObjectInteractionState;
  readonly catalog: NexoraMVPObjectInteractionCatalog;
  readonly executionRuntime?: NexoraExecutionRuntimeAdapter | null;
}): NexoraExecutionPlanningTurnResult {
  const previous =
    input.entrance.executionPlanning ?? createNexoraExecutionPlanningSession();
  const normalized = input.utterance.toLowerCase().replace(/[.!?]+$/g, "");
  let plan = previous.plan ?? buildExecutionPlan(input.entrance);
  let pending = previous.pendingConfirmation;
  let canonicalId = previous.canonicalExecutionId;
  let canonicalStatus = previous.canonicalStatus;
  let state: ExecutionPlanningState =
    previous.state === "NOT_STARTED"
      ? plan?.status === "PLAN_READY"
        ? "PLAN_READY"
        : "PLANNING"
      : previous.state;
  let response = "";

  if (plan && !canonicalId && plan.decisionId) {
    const ensured = ensurePlannedExecution({
      adapter: input.executionRuntime ?? null,
      decisionId: plan.decisionId,
      title: plan.objective,
    });
    canonicalId = ensured.executionId;
    canonicalStatus = ensured.status;
  }

  const fingerprint = planFingerprint(plan);
  if (pending && pending.fingerprint !== fingerprint) {
    pending = null;
    response =
      "The execution plan changed. Confirmation was paused. Review the updated plan before starting.";
  } else if (
    namedOtherScenario(input.entrance, input.utterance) &&
    /change the plan|switch to|instead/.test(normalized)
  ) {
    const other = namedOtherScenario(input.entrance, input.utterance);
    pending = null;
    response = `${other} is outside the committed Decision scope. Route back to Scenario/Decision review before treating it as execution of the current Decision.`;
  } else if (/i like (?:this |the )?plan/.test(normalized)) {
    pending = null;
    state = plan?.readiness === "READY" ? "PLAN_READY" : "PLAN_PARTIAL";
    response =
      "Plan review noted. That is not execution start. Execution has not started.";
  } else if (/did execution start/.test(normalized)) {
    response =
      canonicalStatus === "in-progress"
        ? "Yes. Execution is in progress. Observed outcome remains UNKNOWN."
        : "No. A plan is not a started execution.";
  } else if (/does this mean the goal is achieved/.test(normalized)) {
    response =
      "No. Execution complete is not Goal achieved. Expected impact stays PREDICTED until observed.";
  } else if (/who owns/.test(normalized)) {
    response = plan?.owners[0]
      ? `Current execution owner: ${plan.owners[0]}.`
      : "No execution owner is currently assigned.";
  } else if (/^why$/.test(normalized) || /what is blocking|what(?:'s| is) blocking/.test(normalized)) {
    const blockers = deriveBlockers(plan?.unknowns ?? []);
    const listed = plan?.owners.length
      ? blockers.filter((entry) => entry.kind !== "MISSING_OWNER")
      : blockers;
    response =
      /^why$/.test(normalized) && listed.length === 0
        ? `Readiness is ${plan?.readiness ?? "UNKNOWN"}. Plan, readiness, and start remain separate. Execution has not auto-started.`
        : listed.length
          ? `Execution blockers (not business Problems): ${listed.map((entry) => entry.reason).join(" ")}`
          : "No execution blocker is currently recorded.";
  } else if (
    /are we ready to start|can we start|why aren'?t we ready/.test(normalized)
  ) {
    response =
      plan?.readiness === "READY"
        ? "Yes. The required start conditions are satisfied, but execution still requires your explicit confirmation."
        : `Not yet. Readiness is ${plan?.readiness ?? "UNKNOWN"}. ${plan?.owners.length ? "" : "No execution owner is currently assigned. "}Remaining unknowns stay UNKNOWN.`;
  } else if (/what happens next/.test(normalized)) {
    response =
      canonicalStatus === "in-progress"
        ? "Execution is ACTIVE in the canonical runtime. Ready for outcome monitoring. Observed outcome remains UNKNOWN."
        : plan
          ? "We move into execution planning. Next is to define actions, owners, dependencies, and start conditions for the committed Decision. Execution has not started."
          : "A committed Decision is required before execution planning.";
  } else if (/execution plan|what exactly needs to happen/.test(normalized)) {
    state = plan?.readiness === "READY" ? "PLAN_READY" : "PLANNING";
    response = plan
      ? summarizePlan(plan)
      : "No committed Decision is available to plan from.";
  } else if (/what comes first/.test(normalized)) {
    const first = plan?.actions.filter((entry) => entry.sequence === 1) ?? [];
    response = first.length
      ? `First (can run in parallel unless a dependency exists): ${first.map((entry) => entry.title).join("; ")}.`
      : "No sequenced first action is recorded.";
  } else if (/what can happen in parallel/.test(normalized)) {
    const first =
      plan?.actions.filter(
        (entry) => entry.sequence === 1 && entry.dependsOn.length === 0,
      ) ?? [];
    response =
      first.length > 1
        ? `These can proceed in parallel: ${first.map((entry) => entry.title).join("; ")}.`
        : "No forced linear checklist. Only evidenced dependencies serialize work.";
  } else if (/what assumptions remain/.test(normalized)) {
    response = plan?.assumptions.length
      ? `Unvalidated assumptions remain UNKNOWN: ${plan.assumptions.join("; ")}.`
      : "No unvalidated assumptions are recorded.";
  } else if (/what constraints matter/.test(normalized)) {
    response = plan?.constraints.length
      ? `Constraints carried forward: ${plan.constraints.join("; ")}.`
      : "No additional constraints were recorded on the committed path.";
  } else if (/what will tell us execution is progressing/.test(normalized)) {
    response =
      "Progress signals: action status, canonical execution state, and milestones. No fake percent complete.";
  } else if (
    /assign (.+) as owner/.test(normalized) ||
    /the (?:operational )?owner is (.+)/.test(normalized)
  ) {
    const owner =
      normalized.match(/assign (.+) as owner/)?.[1] ??
      normalized.match(/the (?:operational )?owner is (.+)/)?.[1] ??
      "";
    const identityName =
      input.entrance.identity.managerName?.toLowerCase() ?? "";
    if (identityName && owner.toLowerCase() === identityName) {
      response =
        "The manager is not auto-assigned as execution owner. Name a distinct operational owner, or leave ownership unknown.";
    } else if (plan) {
      plan = applyOwnerToPlan(plan, owner);
      state = plan.readiness === "READY" ? "PLAN_READY" : "PLAN_PARTIAL";
      response = `Operational owner recorded: ${owner}. This is plan context, not execution start.`;
    }
  } else if (
    /make (.+) first/.test(normalized) &&
    canonicalStatus !== "in-progress"
  ) {
    const fragment = normalized.match(/make (.+) first/)?.[1] ?? "";
    if (plan) {
      plan = applyFirstAction(plan, fragment);
      response = `Plan revision applied before start: ${fragment} is first. Execution has not started.`;
    }
  } else if (
    /^remove (.+)/.test(normalized) &&
    canonicalStatus !== "in-progress"
  ) {
    const fragment = normalized.match(/^remove (.+)/)?.[1] ?? "";
    if (plan) {
      plan = removeActionByFragment(plan, fragment);
      response =
        "Removed matching planned action if present. Canonical execution was not rewritten.";
    }
  } else if (/change the plan/.test(normalized)) {
    response =
      canonicalStatus === "in-progress"
        ? "Execution is ACTIVE. Plan revision is distinct from rewriting canonical execution truth. Say what to change, or route a new Decision if the scope changed."
        : "Plan is not started. Say which action to make first or remove. A materially different path must go back to Decision.";
  } else if (/pause execution/.test(normalized)) {
    response =
      "Pause is not a supported canonical execution action. Cancel is available with confirmation if execution is ACTIVE.";
  } else if (/cancel execution/.test(normalized)) {
    if (canonicalStatus !== "in-progress" && canonicalStatus !== "blocked") {
      response = "Nothing is ACTIVE to cancel.";
    } else {
      pending = Object.freeze({
        action: "cancel",
        executionId: canonicalId,
        fingerprint,
      }) satisfies PendingExecutionConfirmation;
      state = "AWAITING_EXECUTION_CONFIRMATION";
      response = "You’re about to cancel this execution. Confirm?";
    }
  } else if (pending && isBareExecutionConfirmation(normalized)) {
    const awaiting = pending;
    if (awaiting.action === "start") {
      const started = startThroughCanonicalRuntime({
        adapter: input.executionRuntime ?? null,
        decisionId: plan?.decisionId ?? null,
        title: plan?.objective ?? "Committed execution",
      });
      pending = null;
      if (started.reason === "missing-canonical-runtime") {
        response =
          "Execution start is not available right now. Nexora will not pretend work has begun.";
      } else if (started.status === "in-progress") {
        canonicalId = started.executionId;
        canonicalStatus = started.status;
        state = "READY_FOR_OUTCOME_MONITORING";
        if (plan) {
          plan = Object.freeze({
            ...plan,
            committed: true,
            started: true,
            status: "EXECUTION_ACTIVE" as const,
          });
        }
        response = `Execution started. Status: in-progress. Observed outcome remains UNKNOWN. Expected impact stays PREDICTED.`;
      } else {
        response = `Execution did not start (${started.reason}).`;
      }
    } else {
      const cancelled = cancelThroughCanonicalRuntime({
        adapter: input.executionRuntime ?? null,
        executionId: awaiting.executionId,
      });
      pending = null;
      canonicalStatus = cancelled.status;
      response =
        cancelled.status === "cancelled"
          ? "Execution cancelled."
          : `Cancel was not applied (${cancelled.reason}).`;
    }
  } else if (!pending && isBareExecutionConfirmation(normalized)) {
    response =
      "Nothing is awaiting execution confirmation. Nexora will not guess a start.";
  } else if (
    /let'?s (?:start|execute)|start it|start execution|start the plan/.test(
      normalized,
    )
  ) {
    if (!plan) {
      response = "No execution plan is available.";
    } else {
      pending = Object.freeze({
        action: "start",
        executionId: canonicalId,
        fingerprint,
      });
      state = "AWAITING_EXECUTION_CONFIRMATION";
      const decisionTitle =
        input.entrance.decisionExperience?.canonicalRecord?.title ??
        "the committed Decision";
      response = `You’re about to start the approved execution plan for ${decisionTitle}. Owner: ${plan.owners[0] ?? "not yet assigned"}. Confirm?`;
    }
  } else if (/what is the execution status/.test(normalized)) {
    response = canonicalStatus
      ? `Execution status: ${canonicalStatus}. Plan readiness: ${plan?.readiness ?? "UNKNOWN"}. Goal achievement is not implied.`
      : "Execution is not started. Plan may exist as PLAN_READY or PLAN_PARTIAL.";
  } else {
    response = plan
      ? summarizePlan(plan)
      : "Committed Decision is required before execution planning.";
  }

  if (canonicalStatus === "in-progress") {
    state = "READY_FOR_OUTCOME_MONITORING";
  }
  const next = freezePlanningSession({
    ...previous,
    state,
    plan,
    pendingConfirmation: pending,
    canonicalExecutionId: canonicalId,
    canonicalStatus,
    askedQuestionKeys: unique([
      ...previous.askedQuestionKeys,
      normalized.slice(0, 48),
    ]),
    introduced: true,
    lastMutatedReality: null,
    lastInventedOwner: null,
    handoff:
      canonicalStatus === "in-progress"
        ? toOutcomeMonitoringHandoff({
            entrance: input.entrance,
            plan,
            runtimeStatus: canonicalStatus,
          })
        : previous.handoff,
  });
  return Object.freeze({
    session: next,
    response,
    ownsResponse: true,
    shouldCommitRuntime: false,
    nextRuntimeState: input.runtimeState,
    catalog: overlayExecutionOnEntranceCatalog(input.catalog, next),
  });
}

function freezePlanningSession(
  session: NexoraExecutionPlanningSession,
): NexoraExecutionPlanningSession {
  return Object.freeze({
    ...session,
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
    /^show execution/.test(normalized)
  );
}

function isIdentityReserved(normalized: string): boolean {
  return (
    /what do you know about me/.test(normalized) || normalized === "who are you"
  );
}

export function executionPlanningUsesExistingAuthorities(): boolean {
  return (
    NEXORA_EXECUTION_PLANNING_BOUNDARY.startsNexExp9 === false &&
    NEXORA_EXECUTION_PLANNING_BOUNDARY.parallelExecutionRuntime === false &&
    NEXORA_EXECUTION_PLANNING_BOUNDARY.autoStartsOnDecision === false &&
    getNexoraExecutionPlanningIdentity().id ===
      "NEX-EXP:8/ExecutionPlanningCommitmentToAction"
  );
}
