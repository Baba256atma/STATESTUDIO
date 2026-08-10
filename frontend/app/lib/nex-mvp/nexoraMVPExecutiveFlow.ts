/**
 * NEX-MVP:8 — Executive Flow Integration coordinator.
 *
 * Thin product-level composition over existing MVP Stage / interaction /
 * presentation / intelligence surfaces. Declares upstream surface identities.
 * Does not import private engines or Node-bound certification indexes.
 * Does not invent a workflow/runtime engine.
 */

import type {
  NexoraMVPPresentationState,
  NexoraMVPWorkspaceKind,
} from "@/app/lib/nex-mvp/nexoraMVPApplicationFoundation";
import type { NexoraMVPInteractionSubject } from "@/app/lib/nex-mvp/nexoraMVPObjectInteraction";
import {
  NEXORA_MVP_CONTEXT_SUBJECT_FIXTURES,
} from "@/app/lib/nex-mvp/nexoraMVPObjectInteractionFixtures";
import type { NexoraMVPPresentationAvailableAction } from "@/app/lib/nex-mvp/nexoraMVPPresentationState";
import { NEXORA_MVP_STAGE_OBJECT_FIXTURES } from "@/app/lib/nex-mvp/nexoraMVPStageFixtures";
import {
  createInitialNexoraMVPFlowDecisionRecords,
  createInitialNexoraMVPFlowExecutionRecords,
  getNexoraMVPFlowEdgeFixtures,
  NEXORA_MVP_FLOW_JOURNAL_SEED,
  NEXORA_MVP_FLOW_TIMELINE_SEED,
  type NexoraMVPFlowDecisionRecord,
  type NexoraMVPFlowDecisionStatus,
  type NexoraMVPFlowExecutionRecord,
  type NexoraMVPFlowJournalPackFixture,
  type NexoraMVPFlowTimelineEventFixture,
} from "@/app/lib/nex-mvp/nexoraMVPExecutiveFlowFixtures";

// ─── Identity ───────────────────────────────────────────────────────────────

export const nexoraMVPExecutiveFlowIntegrationIdentity =
  "NEX-MVP:8/NexoraExecutiveFlowIntegration" as const;

export const nexoraMVPExecutiveFlowIntegrationVersion = "1.8.0" as const;

export const nexoraMVPExecutiveFlowIntegrationNamespace =
  "nexora.mvp.executive-flow-integration" as const;

export const nexoraMVPExecutiveFlowIntegrationPhase =
  "ExecutiveFlowIntegration" as const;

export const nexoraMVPExecutiveFlowIntegrationArchitecturalRole =
  "MVPEndToEndExecutiveJourneyCoordinator" as const;

export const nexoraMVPExecutiveFlowIntegrationReadiness =
  "ReadyForMVPCertificationAndRelease" as const;

export const NEXORA_MVP_FLOW_UPSTREAM_SURFACES = Object.freeze({
  nexMvp7: "NEX-MVP:7/NexoraAdvisorInsightExperience" as const,
  nexMvp6: "NEX-MVP:6/NexoraPresentationStates" as const,
  nexMvp5: "NEX-MVP:5/NexoraWorkspaceDialSceneState" as const,
  nexMvp4: "NEX-MVP:4/NexoraObjectInteraction" as const,
  nexCiPublicIndex:
    "NEX-CI:9/ExecutiveCockpitIntegrationPublicIndex" as const,
  rexWorkspace:
    "REX-2/RuntimeExecutiveWorkspaceExperience" as const,
});

export type NexoraMVPExecutiveFlowIntegrationIdentity = {
  readonly id: typeof nexoraMVPExecutiveFlowIntegrationIdentity;
  readonly version: typeof nexoraMVPExecutiveFlowIntegrationVersion;
  readonly namespace: typeof nexoraMVPExecutiveFlowIntegrationNamespace;
  readonly phase: typeof nexoraMVPExecutiveFlowIntegrationPhase;
  readonly architecturalRole: typeof nexoraMVPExecutiveFlowIntegrationArchitecturalRole;
};

const IDENTITY: NexoraMVPExecutiveFlowIntegrationIdentity = Object.freeze({
  id: nexoraMVPExecutiveFlowIntegrationIdentity,
  version: nexoraMVPExecutiveFlowIntegrationVersion,
  namespace: nexoraMVPExecutiveFlowIntegrationNamespace,
  phase: nexoraMVPExecutiveFlowIntegrationPhase,
  architecturalRole: nexoraMVPExecutiveFlowIntegrationArchitecturalRole,
});

export function getNexoraMVPExecutiveFlowIntegrationIdentity(): NexoraMVPExecutiveFlowIntegrationIdentity {
  return IDENTITY;
}

export const NEXORA_MVP_FLOW_BOUNDARY = Object.freeze({
  architecturalRole: nexoraMVPExecutiveFlowIntegrationArchitecturalRole,
  ownsWorkflowEngine: false as const,
  inventsScenarioEngine: false as const,
  inventsDecisionEngine: false as const,
  inventsExecutionEngine: false as const,
  inventsTimelineEngine: false as const,
  inventsJournalEngine: false as const,
  importsPrivateUpstreamImplementation: false as const,
  uiSafe: true as const,
  fixturesReplaceable: true as const,
});

// ─── Domain fixture state (authoritative for MVP demo path) ─────────────────

export type NexoraMVPFlowDomainState = {
  readonly decisions: readonly NexoraMVPFlowDecisionRecord[];
  readonly executions: readonly NexoraMVPFlowExecutionRecord[];
  readonly timelineEvents: readonly NexoraMVPFlowTimelineEventFixture[];
  readonly journalPacks: readonly NexoraMVPFlowJournalPackFixture[];
  readonly pendingActionId: string | null;
  readonly lastError: string | null;
  readonly lastActionMessage: string | null;
};

export function createInitialNexoraMVPFlowDomainState(): NexoraMVPFlowDomainState {
  return Object.freeze({
    decisions: createInitialNexoraMVPFlowDecisionRecords(),
    executions: createInitialNexoraMVPFlowExecutionRecords(),
    timelineEvents: NEXORA_MVP_FLOW_TIMELINE_SEED,
    journalPacks: NEXORA_MVP_FLOW_JOURNAL_SEED,
    pendingActionId: null,
    lastError: null,
    lastActionMessage: null,
  });
}

// ─── Flow context & chain ───────────────────────────────────────────────────

export type NexoraMVPFlowChainLink = {
  readonly id: string;
  readonly label: string;
  readonly kind: "object" | "problem" | "scenario" | "decision" | "execution";
};

export type NexoraMVPExecutiveFlowChain = {
  readonly object: NexoraMVPFlowChainLink | null;
  readonly problem: NexoraMVPFlowChainLink | null;
  readonly scenario: NexoraMVPFlowChainLink | null;
  readonly decision: NexoraMVPFlowChainLink | null;
  readonly execution: NexoraMVPFlowChainLink | null;
  readonly links: readonly NexoraMVPFlowChainLink[];
  readonly summaryLine: string;
};

export type NexoraMVPExecutiveFlowContext = {
  readonly workspace: NexoraMVPWorkspaceKind;
  readonly presentationState: NexoraMVPPresentationState;
  readonly focusedSubject: NexoraMVPInteractionSubject | null;
  readonly selectedSubject: NexoraMVPInteractionSubject | null;
  readonly sourceObject: NexoraMVPFlowChainLink | null;
  readonly problem: NexoraMVPFlowChainLink | null;
  readonly scenario: NexoraMVPFlowChainLink | null;
  readonly decision: NexoraMVPFlowChainLink | null;
  readonly execution: NexoraMVPFlowChainLink | null;
  readonly chain: NexoraMVPExecutiveFlowChain;
  readonly linkedScenarios: readonly NexoraMVPFlowChainLink[];
  readonly linkedDecisions: readonly NexoraMVPFlowChainLink[];
  readonly linkedExecutions: readonly NexoraMVPFlowChainLink[];
};

export type NexoraMVPTimelinePackView = {
  readonly id: string;
  readonly title: string;
  readonly risk: "warning" | "risk" | "success";
  readonly subjectId: string;
  readonly kind: NexoraMVPFlowTimelineEventFixture["kind"];
  readonly occurredAt: string;
};

export type NexoraMVPJournalEntryView = {
  readonly id: string;
  readonly packKind: NexoraMVPFlowJournalPackFixture["packKind"];
  readonly title: string;
  readonly subjectId: string;
  readonly summary: string;
  readonly occurredAt: string;
  readonly relatedObjectIds: readonly string[];
};

export type NexoraMVPFlowActionKind =
  | "approve-decision"
  | "reject-decision"
  | "start-execution"
  | "pause-execution"
  | "resume-execution"
  | "complete-execution";

export type NexoraMVPFlowDomainActionRequest = {
  readonly actionId: string;
  readonly subjectId: string;
  readonly kind: NexoraMVPFlowActionKind;
};

export type NexoraMVPFlowDomainActionResult =
  | {
      readonly ok: true;
      readonly state: NexoraMVPFlowDomainState;
      readonly message: string;
    }
  | {
      readonly ok: false;
      readonly state: NexoraMVPFlowDomainState;
      readonly reason:
        | "pending"
        | "unavailable"
        | "invalid-subject"
        | "invalid-transition"
        | "duplicate";
      readonly message: string;
    };

function subjectLabel(id: string): string {
  const object = NEXORA_MVP_STAGE_OBJECT_FIXTURES.find((entry) => entry.id === id);
  if (object) return object.label;
  const context = NEXORA_MVP_CONTEXT_SUBJECT_FIXTURES.find(
    (entry) => entry.id === id,
  );
  if (context) return context.label;
  return id;
}

function subjectKind(
  id: string,
): NexoraMVPFlowChainLink["kind"] | null {
  if (NEXORA_MVP_STAGE_OBJECT_FIXTURES.some((entry) => entry.id === id)) {
    return "object";
  }
  const context = NEXORA_MVP_CONTEXT_SUBJECT_FIXTURES.find(
    (entry) => entry.id === id,
  );
  return context?.kind ?? null;
}

function asLink(id: string | null | undefined): NexoraMVPFlowChainLink | null {
  if (id == null) return null;
  const kind = subjectKind(id);
  if (kind == null) return null;
  return Object.freeze({
    id,
    label: subjectLabel(id),
    kind,
  });
}

function outgoing(fromId: string): readonly string[] {
  return getNexoraMVPFlowEdgeFixtures()
    .filter((edge) => edge.fromId === fromId)
    .map((edge) => edge.toId);
}

function incoming(toId: string): readonly string[] {
  return getNexoraMVPFlowEdgeFixtures()
    .filter((edge) => edge.toId === toId)
    .map((edge) => edge.fromId);
}

function firstOfKind(
  ids: readonly string[],
  kind: NexoraMVPFlowChainLink["kind"],
): NexoraMVPFlowChainLink | null {
  for (const id of ids) {
    const link = asLink(id);
    if (link?.kind === kind) return link;
  }
  return null;
}

function allOfKind(
  ids: readonly string[],
  kind: NexoraMVPFlowChainLink["kind"],
): readonly NexoraMVPFlowChainLink[] {
  return Object.freeze(
    ids
      .map((id) => asLink(id))
      .filter((link): link is NexoraMVPFlowChainLink => link?.kind === kind),
  );
}

function walkUpstream(
  startId: string,
  kind: NexoraMVPFlowChainLink["kind"],
): NexoraMVPFlowChainLink | null {
  const visited = new Set<string>();
  const queue = [startId];
  while (queue.length > 0) {
    const current = queue.shift()!;
    if (visited.has(current)) continue;
    visited.add(current);
    const link = asLink(current);
    if (link?.kind === kind) return link;
    for (const parent of incoming(current)) {
      queue.push(parent);
    }
  }
  return null;
}

function walkDownstream(
  startId: string,
  kind: NexoraMVPFlowChainLink["kind"],
): NexoraMVPFlowChainLink | null {
  const visited = new Set<string>();
  const queue = [startId];
  while (queue.length > 0) {
    const current = queue.shift()!;
    if (visited.has(current)) continue;
    visited.add(current);
    const link = asLink(current);
    if (link?.kind === kind && current !== startId) return link;
    for (const child of outgoing(current)) {
      queue.push(child);
    }
  }
  return null;
}

/**
 * Derive a read-only flow chain for orientation. Incomplete chains are valid.
 */
export function deriveNexoraMVPExecutiveFlowChain(input: {
  readonly focusedSubjectId: string | null;
  readonly selectedSubjectId?: string | null;
  readonly preferredScenarioId?: string | null;
  readonly preferredDecisionId?: string | null;
  readonly preferredExecutionId?: string | null;
}): NexoraMVPExecutiveFlowChain {
  const anchor =
    input.focusedSubjectId ?? input.selectedSubjectId ?? null;
  if (anchor == null) {
    return Object.freeze({
      object: null,
      problem: null,
      scenario: null,
      decision: null,
      execution: null,
      links: Object.freeze([]),
      summaryLine: "Overview",
    });
  }

  const kind = subjectKind(anchor);
  const problem =
    (kind === "problem" ? asLink(anchor) : null) ??
    walkUpstream(anchor, "problem") ??
    walkDownstream(anchor, "problem");
  const scenario =
    (input.preferredScenarioId
      ? asLink(input.preferredScenarioId)
      : null) ??
    (kind === "scenario" ? asLink(anchor) : null) ??
    walkUpstream(anchor, "scenario") ??
    walkDownstream(anchor, "scenario");
  const decision =
    (input.preferredDecisionId
      ? asLink(input.preferredDecisionId)
      : null) ??
    (kind === "decision" ? asLink(anchor) : null) ??
    walkUpstream(anchor, "decision") ??
    walkDownstream(anchor, "decision");
  const execution =
    (input.preferredExecutionId
      ? asLink(input.preferredExecutionId)
      : null) ??
    (kind === "execution" ? asLink(anchor) : null) ??
    walkDownstream(anchor, "execution") ??
    walkUpstream(anchor, "execution");
  const object =
    (kind === "object" ? asLink(anchor) : null) ??
    walkUpstream(anchor, "object") ??
    walkDownstream(anchor, "object") ??
    (problem != null ? firstOfKind(incoming(problem.id), "object") : null);

  const links = Object.freeze(
    [object, problem, scenario, decision, execution].filter(
      (entry): entry is NexoraMVPFlowChainLink => entry != null,
    ),
  );

  return Object.freeze({
    object,
    problem,
    scenario,
    decision,
    execution,
    links,
    summaryLine:
      links.length === 0
        ? "Overview"
        : links.map((entry) => entry.label).join(" → "),
  });
}

export function deriveNexoraMVPExecutiveFlowContext(input: {
  readonly workspace: NexoraMVPWorkspaceKind;
  readonly presentationState: NexoraMVPPresentationState;
  readonly focusedSubject: NexoraMVPInteractionSubject | null;
  readonly selectedSubject: NexoraMVPInteractionSubject | null;
}): NexoraMVPExecutiveFlowContext {
  const focusedId = input.focusedSubject?.id ?? null;
  const chain = deriveNexoraMVPExecutiveFlowChain({
    focusedSubjectId: focusedId,
    selectedSubjectId: input.selectedSubject?.id ?? null,
  });

  const anchor = focusedId ?? input.selectedSubject?.id ?? null;
  const downstream = anchor ? outgoing(anchor) : [];
  const fromProblem = chain.problem ? outgoing(chain.problem.id) : [];

  return Object.freeze({
    workspace: input.workspace,
    presentationState: input.presentationState,
    focusedSubject: input.focusedSubject,
    selectedSubject: input.selectedSubject,
    sourceObject: chain.object,
    problem: chain.problem,
    scenario: chain.scenario,
    decision: chain.decision,
    execution: chain.execution,
    chain,
    linkedScenarios: Object.freeze(
      uniqueLinks([
        ...allOfKind(downstream, "scenario"),
        ...allOfKind(fromProblem, "scenario"),
      ]),
    ),
    linkedDecisions: Object.freeze(
      uniqueLinks([
        ...allOfKind(downstream, "decision"),
        ...(chain.scenario
          ? allOfKind(outgoing(chain.scenario.id), "decision")
          : []),
      ]),
    ),
    linkedExecutions: Object.freeze(
      uniqueLinks([
        ...allOfKind(downstream, "execution"),
        ...(chain.decision
          ? allOfKind(outgoing(chain.decision.id), "execution")
          : []),
      ]),
    ),
  });
}

function uniqueLinks(
  links: readonly NexoraMVPFlowChainLink[],
): readonly NexoraMVPFlowChainLink[] {
  const seen = new Set<string>();
  const result: NexoraMVPFlowChainLink[] = [];
  for (const link of links) {
    if (seen.has(link.id)) continue;
    seen.add(link.id);
    result.push(link);
  }
  return Object.freeze(result);
}

/**
 * Recommended workspace for a subject kind — advisory only; does not force.
 */
export function recommendNexoraMVPWorkspaceForSubjectKind(
  kind: string | null | undefined,
): NexoraMVPWorkspaceKind | null {
  switch (kind) {
    case "problem":
      return "problem";
    case "scenario":
      return "scenario";
    case "decision":
      return "decision";
    case "execution":
      return "execution";
    default:
      return null;
  }
}

/**
 * Presentation fallback when Operation unsupported.
 */
export function resolveNexoraMVPFlowPresentationFallback(input: {
  readonly requested: NexoraMVPPresentationState;
  readonly supportsReport: boolean;
  readonly supportsOperation: boolean;
}): NexoraMVPPresentationState {
  if (input.requested === "operation" && !input.supportsOperation) {
    if (input.supportsReport) return "report";
    return "minimum";
  }
  if (input.requested === "report" && !input.supportsReport) {
    return "minimum";
  }
  return input.requested;
}

export function mapNexoraMVPTimelinePacks(
  state: NexoraMVPFlowDomainState,
): readonly NexoraMVPTimelinePackView[] {
  const ordered = [...state.timelineEvents].sort((a, b) =>
    a.occurredAt.localeCompare(b.occurredAt),
  );
  return Object.freeze(
    ordered.map((event) =>
      Object.freeze({
        id: event.id,
        title: event.label,
        risk: event.risk,
        subjectId: event.subjectId,
        kind: event.kind,
        occurredAt: event.occurredAt,
      }),
    ),
  );
}

export function mapNexoraMVPJournalEntries(
  state: NexoraMVPFlowDomainState,
): readonly NexoraMVPJournalEntryView[] {
  const ordered = [...state.journalPacks].sort((a, b) =>
    b.occurredAt.localeCompare(a.occurredAt),
  );
  return Object.freeze(
    ordered.map((pack) =>
      Object.freeze({
        id: pack.id,
        packKind: pack.packKind,
        title: pack.title,
        subjectId: pack.subjectId,
        summary: pack.summary,
        occurredAt: pack.occurredAt,
        relatedObjectIds: pack.relatedObjectIds,
      }),
    ),
  );
}

export function resolveNexoraMVPTimelinePackSubjectId(
  state: NexoraMVPFlowDomainState,
  packId: string | null,
): string | null {
  if (packId == null) return null;
  return (
    state.timelineEvents.find((event) => event.id === packId)?.subjectId ??
    state.journalPacks.find((pack) => pack.id === packId)?.subjectId ??
    null
  );
}

function decisionOf(
  state: NexoraMVPFlowDomainState,
  id: string,
): NexoraMVPFlowDecisionRecord | null {
  return state.decisions.find((entry) => entry.id === id) ?? null;
}

function executionOf(
  state: NexoraMVPFlowDomainState,
  id: string,
): NexoraMVPFlowExecutionRecord | null {
  return state.executions.find((entry) => entry.id === id) ?? null;
}

export function getNexoraMVPFlowDecisionStatus(
  state: NexoraMVPFlowDomainState,
  decisionId: string,
): NexoraMVPFlowDecisionStatus | null {
  return decisionOf(state, decisionId)?.status ?? null;
}

/**
 * Overlay presentation actions with authoritative flow-domain availability.
 */
export function resolveNexoraMVPFlowPresentationActions(
  base: readonly NexoraMVPPresentationAvailableAction[],
  state: NexoraMVPFlowDomainState,
  subjectId: string | null,
): readonly NexoraMVPPresentationAvailableAction[] {
  return Object.freeze(
    base.map((action) => {
      if (action.id.includes("approve") && subjectId != null) {
        const decision = decisionOf(state, subjectId);
        if (decision == null) {
          return Object.freeze({
            ...action,
            available: false,
            disabledReason: "No decision record for current subject.",
          });
        }
        const available = decision.status === "under-review";
        return Object.freeze({
          ...action,
          available,
          disabledReason: available
            ? undefined
            : `Decision is ${decision.status}; approve unavailable.`,
        });
      }
      if (action.id.includes("reject") && subjectId != null) {
        const decision = decisionOf(state, subjectId);
        const available = decision?.status === "under-review";
        return Object.freeze({
          ...action,
          available: Boolean(available),
          disabledReason: available
            ? undefined
            : "Reject available only while under review.",
        });
      }
      if (action.id.includes("pause") && subjectId != null) {
        const execution = executionOf(state, subjectId);
        const available = execution?.status === "in-progress";
        return Object.freeze({
          ...action,
          available: Boolean(available),
          disabledReason: available
            ? undefined
            : "Pause available only while in progress.",
        });
      }
      if (action.id.includes("resume") && subjectId != null) {
        const execution = executionOf(state, subjectId);
        const available = execution?.status === "paused";
        return Object.freeze({
          ...action,
          available: Boolean(available),
          disabledReason: available
            ? undefined
            : "Resume available only while paused.",
        });
      }
      if (action.id.includes("start-exec") && subjectId != null) {
        const execution = executionOf(state, subjectId);
        const decisionId = execution?.sourceDecisionId;
        const decision = decisionId ? decisionOf(state, decisionId) : null;
        const available =
          execution?.status === "planned" && decision?.status === "approved";
        return Object.freeze({
          ...action,
          available: Boolean(available),
          disabledReason: available
            ? undefined
            : "Start requires an approved Decision and planned Execution.",
        });
      }
      return action;
    }),
  );
}

export function classifyNexoraMVPFlowDomainAction(
  action: NexoraMVPPresentationAvailableAction,
  focusedSubjectId: string | null,
): NexoraMVPFlowDomainActionRequest | null {
  if (!action.available) return null;
  const subjectId = focusedSubjectId ?? action.targetSubjectId ?? "";
  if (action.id.includes("approve")) {
    return Object.freeze({
      actionId: action.id,
      subjectId,
      kind: "approve-decision",
    });
  }
  if (action.id.includes("reject")) {
    return Object.freeze({
      actionId: action.id,
      subjectId,
      kind: "reject-decision",
    });
  }
  if (action.id.includes("pause")) {
    return Object.freeze({
      actionId: action.id,
      subjectId,
      kind: "pause-execution",
    });
  }
  if (action.id.includes("resume")) {
    return Object.freeze({
      actionId: action.id,
      subjectId,
      kind: "resume-execution",
    });
  }
  if (action.id.includes("start-exec")) {
    return Object.freeze({
      actionId: action.id,
      subjectId,
      kind: "start-execution",
    });
  }
  if (action.id.includes("complete-exec") || action.id.endsWith("-complete")) {
    return Object.freeze({
      actionId: action.id,
      subjectId,
      kind: "complete-execution",
    });
  }
  return null;
}

function withClearedPending(
  state: NexoraMVPFlowDomainState,
  patch: Partial<NexoraMVPFlowDomainState>,
): NexoraMVPFlowDomainState {
  return Object.freeze({
    ...state,
    pendingActionId: null,
    lastError: null,
    ...patch,
  });
}

/**
 * Apply consequential Decision/Execution action against fixture domain state.
 * Synchronous MVP stand-in for authoritative runtime results.
 */
export function applyNexoraMVPFlowDomainAction(
  state: NexoraMVPFlowDomainState,
  request: NexoraMVPFlowDomainActionRequest,
): NexoraMVPFlowDomainActionResult {
  if (
    state.pendingActionId != null &&
    state.pendingActionId !== request.actionId
  ) {
    return Object.freeze({
      ok: false,
      state,
      reason: "pending",
      message: "Another executive action is already pending.",
    });
  }
  if (!request.subjectId) {
    return Object.freeze({
      ok: false,
      state,
      reason: "invalid-subject",
      message: "Action subject is missing.",
    });
  }

  const now = new Date().toISOString();

  if (
    request.kind === "approve-decision" ||
    request.kind === "reject-decision"
  ) {
    const decision = decisionOf(state, request.subjectId);
    if (decision == null) {
      return Object.freeze({
        ok: false,
        state,
        reason: "invalid-subject",
        message: "No current Decision linked for this action.",
      });
    }
    if (decision.status !== "under-review") {
      return Object.freeze({
        ok: false,
        state,
        reason: "invalid-transition",
        message: `Cannot ${request.kind} while Decision is ${decision.status}.`,
      });
    }

    const nextStatus: NexoraMVPFlowDecisionStatus =
      request.kind === "approve-decision" ? "approved" : "rejected";
    const eventId = `tl-${request.subjectId}-${nextStatus}`;
    const packId = `pack-${request.subjectId}-${nextStatus}`;

    // Prevent duplicate successful history for same transition
    if (state.timelineEvents.some((event) => event.id === eventId)) {
      return Object.freeze({
        ok: false,
        state,
        reason: "duplicate",
        message: "This Decision transition was already recorded.",
      });
    }

    const nextDecisions = Object.freeze(
      state.decisions.map((entry) =>
        entry.id === decision.id
          ? Object.freeze({ ...entry, status: nextStatus })
          : entry,
      ),
    );

    const timelineEvent = Object.freeze({
      id: eventId,
      kind:
        nextStatus === "approved"
          ? ("decision-approved" as const)
          : ("decision-rejected" as const),
      subjectId: decision.id,
      label: `${decision.label} ${nextStatus}`,
      occurredAt: now,
      objectId: decision.objectId ?? undefined,
      risk: nextStatus === "approved" ? ("success" as const) : ("risk" as const),
    });

    const journalPack = Object.freeze({
      id: packId,
      packKind: "decision" as const,
      title: decision.label,
      subjectId: decision.id,
      summary: `Decision ${nextStatus}${
        decision.sourceScenarioId
          ? ` from ${subjectLabel(decision.sourceScenarioId)}`
          : ""
      }.`,
      occurredAt: now,
      relatedObjectIds: Object.freeze(
        decision.objectId ? [decision.objectId] : [],
      ),
      timelineEventId: eventId,
    });

    let nextExecutions = state.executions;
    if (nextStatus === "approved") {
      nextExecutions = Object.freeze(
        state.executions.map((entry) =>
          entry.sourceDecisionId === decision.id && entry.status === "planned"
            ? Object.freeze({
                ...entry,
                status: "planned" as const,
                health: "on-track" as const,
              })
            : entry,
        ),
      );
    }

    const next = withClearedPending(state, {
      decisions: nextDecisions,
      executions: nextExecutions,
      timelineEvents: Object.freeze([...state.timelineEvents, timelineEvent]),
      journalPacks: Object.freeze([...state.journalPacks, journalPack]),
      lastActionMessage: `${decision.label} ${nextStatus}.`,
    });

    return Object.freeze({
      ok: true,
      state: next,
      message: next.lastActionMessage ?? "Decision updated.",
    });
  }

  const execution = executionOf(state, request.subjectId);
  if (execution == null) {
    return Object.freeze({
      ok: false,
      state,
      reason: "invalid-subject",
      message: "No current Execution linked for this action.",
    });
  }

  if (request.kind === "start-execution") {
    const decision = execution.sourceDecisionId
      ? decisionOf(state, execution.sourceDecisionId)
      : null;
    if (execution.status !== "planned" || decision?.status !== "approved") {
      return Object.freeze({
        ok: false,
        state,
        reason: "unavailable",
        message: "Start requires approved Decision and planned Execution.",
      });
    }
    const eventId = `tl-${execution.id}-started`;
    if (state.timelineEvents.some((event) => event.id === eventId)) {
      return Object.freeze({
        ok: false,
        state,
        reason: "duplicate",
        message: "Execution start already recorded.",
      });
    }
    const timelineEvent = Object.freeze({
      id: eventId,
      kind: "execution-started" as const,
      subjectId: execution.id,
      label: `${execution.label} started`,
      occurredAt: now,
      objectId: execution.objectId ?? undefined,
      risk: "success" as const,
    });
    const journalPack = Object.freeze({
      id: `pack-${execution.id}-started`,
      packKind: "execution" as const,
      title: execution.label,
      subjectId: execution.id,
      summary: `Execution started from ${
        decision ? decision.label : "Decision"
      }.`,
      occurredAt: now,
      relatedObjectIds: Object.freeze(
        execution.objectId ? [execution.objectId] : [],
      ),
      timelineEventId: eventId,
    });
    const next = withClearedPending(state, {
      executions: Object.freeze(
        state.executions.map((entry) =>
          entry.id === execution.id
            ? Object.freeze({
                ...entry,
                status: "in-progress" as const,
                health: "on-track" as const,
                progress: entry.progress === "0%" ? "8%" : entry.progress,
              })
            : entry,
        ),
      ),
      timelineEvents: Object.freeze([...state.timelineEvents, timelineEvent]),
      journalPacks: Object.freeze([...state.journalPacks, journalPack]),
      lastActionMessage: `${execution.label} started.`,
    });
    return Object.freeze({ ok: true, state: next, message: next.lastActionMessage! });
  }

  if (request.kind === "pause-execution") {
    if (execution.status !== "in-progress") {
      return Object.freeze({
        ok: false,
        state,
        reason: "invalid-transition",
        message: "Pause available only while in progress.",
      });
    }
    const eventId = `tl-${execution.id}-paused-${state.timelineEvents.length}`;
    const timelineEvent = Object.freeze({
      id: eventId,
      kind: "execution-changed" as const,
      subjectId: execution.id,
      label: `${execution.label} paused`,
      occurredAt: now,
      objectId: execution.objectId ?? undefined,
      risk: "warning" as const,
    });
    const next = withClearedPending(state, {
      executions: Object.freeze(
        state.executions.map((entry) =>
          entry.id === execution.id
            ? Object.freeze({
                ...entry,
                status: "paused" as const,
                health: "at-risk" as const,
              })
            : entry,
        ),
      ),
      timelineEvents: Object.freeze([...state.timelineEvents, timelineEvent]),
      lastActionMessage: `${execution.label} paused.`,
    });
    return Object.freeze({ ok: true, state: next, message: next.lastActionMessage! });
  }

  if (request.kind === "resume-execution") {
    if (execution.status !== "paused") {
      return Object.freeze({
        ok: false,
        state,
        reason: "invalid-transition",
        message: "Resume available only while paused.",
      });
    }
    const next = withClearedPending(state, {
      executions: Object.freeze(
        state.executions.map((entry) =>
          entry.id === execution.id
            ? Object.freeze({
                ...entry,
                status: "in-progress" as const,
                health: "on-track" as const,
              })
            : entry,
        ),
      ),
      lastActionMessage: `${execution.label} resumed.`,
    });
    return Object.freeze({ ok: true, state: next, message: next.lastActionMessage! });
  }

  if (request.kind === "complete-execution") {
    if (execution.status !== "in-progress" && execution.status !== "paused") {
      return Object.freeze({
        ok: false,
        state,
        reason: "invalid-transition",
        message: "Complete available only for active Execution.",
      });
    }
    const eventId = `tl-${execution.id}-complete`;
    if (state.timelineEvents.some((event) => event.id === eventId)) {
      return Object.freeze({
        ok: false,
        state,
        reason: "duplicate",
        message: "Execution completion already recorded.",
      });
    }
    const timelineEvent = Object.freeze({
      id: eventId,
      kind: "execution-completed" as const,
      subjectId: execution.id,
      label: `${execution.label} completed`,
      occurredAt: now,
      objectId: execution.objectId ?? undefined,
      risk: "success" as const,
    });
    const journalPack = Object.freeze({
      id: `pack-${execution.id}-complete`,
      packKind: "execution" as const,
      title: execution.label,
      subjectId: execution.id,
      summary: "Execution completed.",
      occurredAt: now,
      relatedObjectIds: Object.freeze(
        execution.objectId ? [execution.objectId] : [],
      ),
      timelineEventId: eventId,
    });
    const next = withClearedPending(state, {
      executions: Object.freeze(
        state.executions.map((entry) =>
          entry.id === execution.id
            ? Object.freeze({
                ...entry,
                status: "complete" as const,
                health: "complete" as const,
                progress: "100%",
              })
            : entry,
        ),
      ),
      timelineEvents: Object.freeze([...state.timelineEvents, timelineEvent]),
      journalPacks: Object.freeze([...state.journalPacks, journalPack]),
      lastActionMessage: `${execution.label} completed.`,
    });
    return Object.freeze({ ok: true, state: next, message: next.lastActionMessage! });
  }

  return Object.freeze({
    ok: false,
    state,
    reason: "unavailable",
    message: "Unsupported flow action.",
  });
}

/**
 * Begin pending marker (for UI duplicate-submit prevention). Cleared by apply.
 */
export function beginNexoraMVPFlowPendingAction(
  state: NexoraMVPFlowDomainState,
  actionId: string,
): NexoraMVPFlowDomainState {
  if (state.pendingActionId != null) return state;
  return Object.freeze({
    ...state,
    pendingActionId: actionId,
    lastError: null,
  });
}

export function failNexoraMVPFlowPendingAction(
  state: NexoraMVPFlowDomainState,
  message: string,
): NexoraMVPFlowDomainState {
  return Object.freeze({
    ...state,
    pendingActionId: null,
    lastError: message,
    lastActionMessage: null,
  });
}

export function overlayNexoraMVPPresentationStatus(
  essentialStatus: string | null,
  state: NexoraMVPFlowDomainState,
  subjectId: string | null,
): string | null {
  if (subjectId == null) return essentialStatus;
  const decision = decisionOf(state, subjectId);
  if (decision) {
    switch (decision.status) {
      case "under-review":
        return "Under Review";
      case "approved":
        return "Approved";
      case "rejected":
        return "Rejected";
      case "archived":
        return "Archived";
      case "locked":
        return "Locked";
      default:
        return "Draft";
    }
  }
  const execution = executionOf(state, subjectId);
  if (execution) {
    switch (execution.status) {
      case "in-progress":
        return `In Progress · ${execution.progress}`;
      case "paused":
        return `Paused · ${execution.progress}`;
      case "blocked":
        return "Blocked";
      case "complete":
        return "Complete";
      case "cancelled":
        return "Cancelled";
      default:
        return "Planned";
    }
  }
  return essentialStatus;
}

export function verifyNexoraMVPExecutiveFlowIntegration(options?: {
  readonly forceFailure?: boolean;
}): Readonly<{
  readonly ok: boolean;
  readonly identityValid: boolean;
  readonly boundaryValid: boolean;
  readonly chainValid: boolean;
  readonly noEngineDuplicationValid: boolean;
}> {
  if (options?.forceFailure) {
    return Object.freeze({
      ok: false,
      identityValid: false,
      boundaryValid: false,
      chainValid: false,
      noEngineDuplicationValid: false,
    });
  }
  const identity = getNexoraMVPExecutiveFlowIntegrationIdentity();
  const identityValid =
    identity.id === "NEX-MVP:8/NexoraExecutiveFlowIntegration" &&
    identity.version === "1.8.0" &&
    identity.namespace === "nexora.mvp.executive-flow-integration";
  const boundaryValid =
    NEXORA_MVP_FLOW_BOUNDARY.ownsWorkflowEngine === false &&
    NEXORA_MVP_FLOW_BOUNDARY.importsPrivateUpstreamImplementation === false;
  const chain = deriveNexoraMVPExecutiveFlowChain({
    focusedSubjectId: "ctx-decision-reprice",
  });
  const chainValid =
    chain.object?.id === "obj-revenue" &&
    chain.problem?.id === "ctx-problem-margin" &&
    chain.scenario?.id === "ctx-scenario-pricing" &&
    chain.decision?.id === "ctx-decision-reprice" &&
    chain.execution?.id === "ctx-execution-rollout";
  const noEngineDuplicationValid =
    NEXORA_MVP_FLOW_BOUNDARY.inventsDecisionEngine === false &&
    NEXORA_MVP_FLOW_BOUNDARY.inventsTimelineEngine === false;

  return Object.freeze({
    ok:
      identityValid &&
      boundaryValid &&
      chainValid &&
      noEngineDuplicationValid,
    identityValid,
    boundaryValid,
    chainValid,
    noEngineDuplicationValid,
  });
}
