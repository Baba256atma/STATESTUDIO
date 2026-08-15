/**
 * CC:10R — Canonical Decision Runtime port + in-memory authority.
 *
 * Product Decision truth (identity, status, lock) lives here.
 * EXS1 ExecutiveRuntimeStore can be adapted behind the same port.
 */

import type {
  NexoraDecisionRationale,
  NexoraExecutiveDecision,
} from "./executiveDecisionCandidate.ts";
import {
  isDecisionTransitionAllowed,
  resolveTargetStatusForAction,
  type NexoraDecisionTransitionAction,
  type NexoraExecutiveDecisionStatus,
} from "./executiveDecisionTransition.ts";

export type NexoraCanonicalDecisionRecord = NexoraExecutiveDecision;

export type NexoraDecisionRuntimeTransitionInput = {
  readonly decisionId: string;
  readonly action: NexoraDecisionTransitionAction;
  readonly title: string;
  readonly subjectIds?: readonly string[];
  readonly scenarioId?: string;
  readonly scenarioRevision?: number;
  readonly recommendationId?: string;
  readonly rationale?: NexoraDecisionRationale;
  readonly evidenceRefs?: NexoraExecutiveDecision["evidenceRefs"];
  readonly uncertaintyRefs?: readonly string[];
  readonly workspaceId?: string | null;
  readonly modelId?: string | null;
  readonly candidateId?: string;
  readonly committedAt?: string;
};

export type NexoraDecisionRuntimeTransitionResult = {
  readonly status:
    | "applied"
    | "already-committed"
    | "transition-not-allowed"
    | "failed";
  readonly decision: NexoraCanonicalDecisionRecord | null;
  readonly reasons: readonly string[];
};

/**
 * Narrow adapter — no embedded second Decision database.
 * Implementations write the live canonical authority only.
 */
export type NexoraDecisionRuntimeAdapter = {
  readonly authorityId: string;
  getDecision(decisionId: string): NexoraCanonicalDecisionRecord | null;
  findDecisionByScenarioId(
    scenarioId: string,
  ): NexoraCanonicalDecisionRecord | null;
  listDecisions(): readonly NexoraCanonicalDecisionRecord[];
  transitionDecision(
    input: NexoraDecisionRuntimeTransitionInput,
  ): NexoraDecisionRuntimeTransitionResult;
};

export type NexoraCanonicalDecisionRuntimeState = {
  readonly decisionsById: Readonly<
    Record<string, NexoraCanonicalDecisionRecord>
  >;
  readonly currentDecisionId: string | null;
};

export type NexoraCanonicalDecisionRuntime = {
  readonly getState: () => NexoraCanonicalDecisionRuntimeState;
  readonly subscribe: (listener: () => void) => () => void;
  readonly adapter: NexoraDecisionRuntimeAdapter;
};

function withLock(status: NexoraExecutiveDecisionStatus): boolean {
  return status === "Approved";
}

function applyTransitionToRecord(
  existing: NexoraCanonicalDecisionRecord | null,
  input: NexoraDecisionRuntimeTransitionInput,
): NexoraDecisionRuntimeTransitionResult {
  const action = input.action;
  const targetStatus = resolveTargetStatusForAction(
    action,
    existing?.status ?? null,
  );

  if (
    existing &&
    existing.status === targetStatus &&
    (action === "approve" || action === "reject")
  ) {
    return Object.freeze({
      status: "already-committed" as const,
      decision: existing,
      reasons: Object.freeze(["already-at-target"]),
    });
  }

  const gate = isDecisionTransitionAllowed({
    currentStatus: existing?.status ?? null,
    locked: existing?.locked ?? false,
    action,
    targetStatus,
  });

  if (!gate.allowed) {
    return Object.freeze({
      status: "transition-not-allowed" as const,
      decision: existing,
      reasons: Object.freeze([gate.reason]),
    });
  }

  const decision: NexoraCanonicalDecisionRecord = Object.freeze({
    decisionId: input.decisionId,
    title: existing?.title ?? input.title,
    status: targetStatus,
    locked: withLock(targetStatus),
    subjectIds: Object.freeze([
      ...(input.subjectIds ?? existing?.subjectIds ?? []),
    ]),
    scenarioId: input.scenarioId ?? existing?.scenarioId,
    scenarioRevision: input.scenarioRevision ?? existing?.scenarioRevision,
    recommendationId: input.recommendationId ?? existing?.recommendationId,
    rationale: input.rationale ?? existing?.rationale,
    evidenceRefs: Object.freeze([
      ...(input.evidenceRefs ?? existing?.evidenceRefs ?? []),
    ]),
    uncertaintyRefs: Object.freeze([
      ...(input.uncertaintyRefs ?? existing?.uncertaintyRefs ?? []),
    ]),
    committedBy: "manager" as const,
    committedAt:
      targetStatus === "Approved" || targetStatus === "Rejected"
        ? input.committedAt ?? existing?.committedAt
        : existing?.committedAt,
    source: "conversation" as const,
    workspaceId: input.workspaceId ?? existing?.workspaceId ?? null,
    modelId: input.modelId ?? existing?.modelId ?? null,
    candidateId: input.candidateId ?? existing?.candidateId,
  });

  return Object.freeze({
    status: "applied" as const,
    decision,
    reasons: Object.freeze([gate.reason, `status:${targetStatus}`]),
  });
}

/**
 * Create the canonical in-memory Decision Runtime for nex-mvp / tests.
 * Client hosts should create once (useRef) — never during SSR as a shared singleton.
 */
export function createNexoraCanonicalDecisionRuntime(options?: {
  readonly initialDecisions?: readonly NexoraCanonicalDecisionRecord[];
  readonly authorityId?: string;
}): NexoraCanonicalDecisionRuntime {
  let state: NexoraCanonicalDecisionRuntimeState = Object.freeze({
    decisionsById: Object.freeze(
      Object.fromEntries(
        (options?.initialDecisions ?? []).map((d) => [d.decisionId, d]),
      ),
    ),
    currentDecisionId: options?.initialDecisions?.[0]?.decisionId ?? null,
  });
  const listeners = new Set<() => void>();
  const authorityId =
    options?.authorityId ?? "nexora.canonical-decision-runtime";

  const notify = () => {
    listeners.forEach((listener) => listener());
  };

  const adapter: NexoraDecisionRuntimeAdapter = {
    authorityId,
    getDecision(decisionId) {
      return state.decisionsById[decisionId] ?? null;
    },
    findDecisionByScenarioId(scenarioId) {
      for (const decision of Object.values(state.decisionsById)) {
        if (decision.scenarioId === scenarioId) return decision;
      }
      return null;
    },
    listDecisions() {
      return Object.freeze(Object.values(state.decisionsById));
    },
    transitionDecision(input) {
      const existing = state.decisionsById[input.decisionId] ?? null;
      const result = applyTransitionToRecord(existing, input);
      if (result.status !== "applied" || result.decision == null) {
        return result;
      }
      state = Object.freeze({
        decisionsById: Object.freeze({
          ...state.decisionsById,
          [result.decision.decisionId]: result.decision,
        }),
        currentDecisionId: result.decision.decisionId,
      });
      notify();
      return result;
    },
  };

  return Object.freeze({
    getState: () => state,
    subscribe: (listener: () => void) => {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
    adapter,
  });
}

/**
 * Adapt EXS1 ExecutiveRuntimeStore Decision slice behind the same port.
 * Conversation and UI ApprovalBar then share one product truth.
 */
export function createExecutiveRuntimeStoreDecisionAdapter(store: {
  readonly getState: () => {
    readonly decision: {
      readonly decisions: readonly {
        readonly id: string;
        readonly name: string;
        readonly status:
          | "Draft"
          | "Under Review"
          | "Approved"
          | "Rejected"
          | "Archived";
        readonly locked: boolean;
        readonly scenarioSourceIds: readonly string[];
        readonly createdDate: string;
      }[];
    };
  };
  readonly actions: {
    readonly approveDecision: (id: string) => void;
    readonly rejectDecision: (id: string) => void;
    readonly returnDecisionForAnalysis: (id: string) => void;
    readonly archiveDecision: (id: string) => void;
    readonly setDecisionStatus: (
      id: string,
      status:
        | "Draft"
        | "Under Review"
        | "Approved"
        | "Rejected"
        | "Archived",
    ) => void;
    readonly createManualDecision: (name: string) => void;
  };
}): NexoraDecisionRuntimeAdapter {
  const toCanonical = (d: {
    readonly id: string;
    readonly name: string;
    readonly status:
      | "Draft"
      | "Under Review"
      | "Approved"
      | "Rejected"
      | "Archived";
    readonly locked: boolean;
    readonly scenarioSourceIds: readonly string[];
    readonly createdDate: string;
  }): NexoraCanonicalDecisionRecord =>
    Object.freeze({
      decisionId: d.id,
      title: d.name,
      status: d.status,
      locked: d.locked,
      subjectIds: Object.freeze([] as string[]),
      scenarioId: d.scenarioSourceIds[0],
      evidenceRefs: Object.freeze([]),
      uncertaintyRefs: Object.freeze([]),
      committedBy: "manager" as const,
      committedAt: d.status === "Approved" ? d.createdDate : undefined,
      source: "conversation" as const,
    });

  return {
    authorityId: "exs1.executive-runtime-store",
    getDecision(decisionId) {
      const found = store
        .getState()
        .decision.decisions.find((d) => d.id === decisionId);
      return found ? toCanonical(found) : null;
    },
    findDecisionByScenarioId(scenarioId) {
      const found = store
        .getState()
        .decision.decisions.find((d) =>
          d.scenarioSourceIds.includes(scenarioId),
        );
      return found ? toCanonical(found) : null;
    },
    listDecisions() {
      return Object.freeze(
        store.getState().decision.decisions.map(toCanonical),
      );
    },
    transitionDecision(input) {
      const existing = this.getDecision(input.decisionId);
      const planned = applyTransitionToRecord(existing, input);
      if (
        planned.status === "already-committed" ||
        planned.status === "transition-not-allowed"
      ) {
        return planned;
      }
      if (planned.status !== "applied" || planned.decision == null) {
        return planned;
      }

      // Ensure record exists for create-then-transition.
      if (!existing) {
        store.actions.createManualDecision(input.title);
        const created = store
          .getState()
          .decision.decisions.find((d) => d.name === input.title);
        if (!created) {
          return Object.freeze({
            status: "failed" as const,
            decision: null,
            reasons: Object.freeze(["runtime-create-failed"]),
          });
        }
        // Rename id alignment: EXS1 createManualDecision uses Date.now ids.
        // Prefer operating on the newly created id when input id was synthetic.
        if (created.id !== input.decisionId) {
          // Apply transition against created.id
          return this.transitionDecision({
            ...input,
            decisionId: created.id,
          });
        }
      }

      switch (input.action) {
        case "approve":
          store.actions.approveDecision(input.decisionId);
          break;
        case "reject":
          store.actions.rejectDecision(input.decisionId);
          break;
        case "reconsider":
          store.actions.returnDecisionForAnalysis(input.decisionId);
          break;
        case "archive":
          store.actions.archiveDecision(input.decisionId);
          break;
        case "defer":
        case "create":
          store.actions.setDecisionStatus(
            input.decisionId,
            planned.decision.status,
          );
          break;
        default:
          return Object.freeze({
            status: "failed" as const,
            decision: existing,
            reasons: Object.freeze(["unsupported-action"]),
          });
      }

      const after = this.getDecision(input.decisionId);
      return Object.freeze({
        status: "applied" as const,
        decision: after,
        reasons: planned.reasons,
      });
    },
  };
}
