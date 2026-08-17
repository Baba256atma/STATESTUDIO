/**
 * CC:11 thin port to the canonical business Execution authority.
 * It is deliberately unrelated to command/LLM execution identifiers.
 */

import type { NexoraDecisionRuntimeAdapter } from "./executiveDecisionRuntimeAdapter.ts";
import {
  assessDecisionExecutionEligibility,
  executionTransitionTarget,
  isExecutionTransitionAllowed,
  type NexoraExecutiveExecutionStatus,
  type NexoraExecutionTransitionAction,
} from "./executiveExecutionPolicy.ts";

export type NexoraExecutionBlocker = { readonly blockerId: string; readonly label: string };
export type NexoraExecutionRisk = { readonly riskId: string; readonly label: string };
export type NexoraExecutionMilestone = {
  readonly milestoneId: string;
  readonly label: string;
  readonly deadline?: string;
  readonly completed?: boolean;
};

export type NexoraCanonicalExecution = {
  readonly executionId: string;
  readonly decisionId: string;
  readonly title: string;
  readonly status: NexoraExecutiveExecutionStatus;
  readonly progress?: number;
  readonly ownerIds: readonly string[];
  readonly blockers: readonly NexoraExecutionBlocker[];
  readonly risks: readonly NexoraExecutionRisk[];
  readonly milestones: readonly NexoraExecutionMilestone[];
  readonly source: string;
  readonly createdFromDecision: true;
  readonly workspaceId: string | null;
  readonly modelId: string | null;
};

export type NexoraExecutionRuntimeResult = {
  readonly status: "created" | "reused" | "applied" | "not-found" | "not-eligible" | "transition-not-allowed" | "scope-mismatch" | "failed";
  readonly execution: NexoraCanonicalExecution | null;
  readonly reasons: readonly string[];
};

export type NexoraExecutionRuntimeAdapter = {
  readonly authorityId: string;
  getExecution(id: string): NexoraCanonicalExecution | null;
  findExecutionByDecisionId(decisionId: string): NexoraCanonicalExecution | null;
  listExecutions(): readonly NexoraCanonicalExecution[];
  createExecution(input: {
    readonly decisionId: string;
    readonly title?: string;
    readonly workspaceId?: string | null;
    readonly modelId?: string | null;
  }): NexoraExecutionRuntimeResult;
  transitionExecution(input: {
    readonly executionId: string;
    readonly action: NexoraExecutionTransitionAction;
  }): NexoraExecutionRuntimeResult;
};

function freezeExecution(record: NexoraCanonicalExecution): NexoraCanonicalExecution {
  return Object.freeze({
    ...record,
    ownerIds: Object.freeze([...record.ownerIds]),
    blockers: Object.freeze(record.blockers.map((item) => Object.freeze({ ...item }))),
    risks: Object.freeze(record.risks.map((item) => Object.freeze({ ...item }))),
    milestones: Object.freeze(record.milestones.map((item) => Object.freeze({ ...item }))),
  });
}

export function createNexoraCanonicalExecutionRuntime(options: {
  readonly decisionRuntime: NexoraDecisionRuntimeAdapter;
  readonly initialExecutions?: readonly NexoraCanonicalExecution[];
  readonly authorityId?: string;
}): NexoraExecutionRuntimeAdapter {
  let records: Readonly<Record<string, NexoraCanonicalExecution>> = Object.freeze(
    Object.fromEntries((options.initialExecutions ?? []).map((e) => [e.executionId, freezeExecution(e)])),
  );

  return Object.freeze({
    authorityId: options.authorityId ?? "nexora.canonical-execution-runtime",
    getExecution: (id: string) => records[id] ?? null,
    findExecutionByDecisionId(decisionId: string) {
      return Object.values(records).find((e) => e.decisionId === decisionId) ?? null;
    },
    listExecutions: () => Object.freeze(Object.values(records)),
    createExecution(input) {
      const decision = options.decisionRuntime.getDecision(input.decisionId);
      if (!decision) return Object.freeze({ status: "not-found" as const, execution: null, reasons: Object.freeze(["execution-canonical-decision-not-found"]) });
      const eligibility = assessDecisionExecutionEligibility(decision.status);
      if (!eligibility.eligible) return Object.freeze({ status: "not-eligible" as const, execution: null, reasons: Object.freeze([eligibility.reason]) });
      if ((input.workspaceId ?? decision.workspaceId ?? null) !== (decision.workspaceId ?? null) ||
          (input.modelId ?? decision.modelId ?? null) !== (decision.modelId ?? null)) {
        return Object.freeze({ status: "scope-mismatch" as const, execution: null, reasons: Object.freeze(["execution-decision-scope-mismatch"]) });
      }
      const existing = Object.values(records).find((e) => e.decisionId === decision.decisionId);
      if (existing) return Object.freeze({ status: "reused" as const, execution: existing, reasons: Object.freeze(["execution-existing-reused", "execution-decision-link-preserved"]) });
      const execution = freezeExecution({
        executionId: `execution-${decision.decisionId}`,
        decisionId: decision.decisionId,
        title: input.title ?? `Implement ${decision.title}`,
        status: "planned",
        ownerIds: Object.freeze([]), blockers: Object.freeze([]), risks: Object.freeze([]), milestones: Object.freeze([]),
        source: "conversation", createdFromDecision: true,
        workspaceId: decision.workspaceId ?? null, modelId: decision.modelId ?? null,
      });
      records = Object.freeze({ ...records, [execution.executionId]: execution });
      return Object.freeze({ status: "created" as const, execution, reasons: Object.freeze(["execution-created", "execution-decision-link-preserved"]) });
    },
    transitionExecution(input) {
      const existing = records[input.executionId] ?? null;
      if (!existing) return Object.freeze({ status: "not-found" as const, execution: null, reasons: Object.freeze(["execution-not-found"]) });
      if (!isExecutionTransitionAllowed(existing.status, input.action)) return Object.freeze({ status: "transition-not-allowed" as const, execution: existing, reasons: Object.freeze(["execution-transition-rejected"]) });
      const target = executionTransitionTarget(input.action);
      if (target === existing.status) return Object.freeze({ status: "reused" as const, execution: existing, reasons: Object.freeze(["execution-existing-reused"]) });
      const next = freezeExecution({ ...existing, status: target });
      records = Object.freeze({ ...records, [next.executionId]: next });
      return Object.freeze({ status: "applied" as const, execution: next, reasons: Object.freeze(["execution-transition-applied", `execution-${target}`]) });
    },
  } satisfies NexoraExecutionRuntimeAdapter);
}

type ExsExecutionPlanView = {
  readonly id: string; readonly decisionId: string; readonly name: string; readonly owner: string;
  readonly status: "Idle" | "Running" | "Paused" | "Completed" | "Cancelled";
  readonly tasks: readonly { readonly id: string; readonly name: string; readonly owner: string; readonly status: string; readonly progress: number; readonly health: string }[];
};

/**
 * Production/UI convergence adapter. It never mirrors the EXS1 plan: every read
 * projects the live store and every mutation delegates to store actions.
 */
export function createExecutiveRuntimeStoreExecutionAdapter(
  store: {
    readonly getState: () => { readonly execution: { readonly plan: ExsExecutionPlanView } };
    readonly actions: {
      readonly startExecution: () => void; readonly pauseExecution: () => void;
      readonly resumeExecution: () => void; readonly completeExecution: () => void;
      readonly cancelExecution: () => void;
    };
  },
  decisionRuntime: NexoraDecisionRuntimeAdapter,
): NexoraExecutionRuntimeAdapter {
  const project = (): NexoraCanonicalExecution => {
    const plan = store.getState().execution.plan;
    const status: NexoraExecutiveExecutionStatus = plan.status === "Running" ? "in-progress" : plan.status === "Paused" ? "blocked" : plan.status === "Completed" ? "completed" : plan.status === "Cancelled" ? "cancelled" : "planned";
    const blockers = plan.tasks.filter((t) => t.status === "Blocked" || t.health === "Blocked").map((t) => ({ blockerId: t.id, label: t.name }));
    const risks = plan.tasks.filter((t) => t.health === "Warning").map((t) => ({ riskId: t.id, label: t.name }));
    const progress = plan.tasks.length ? Math.round(plan.tasks.reduce((sum, t) => sum + t.progress, 0) / plan.tasks.length) : undefined;
    return freezeExecution({ executionId: plan.id, decisionId: plan.decisionId, title: plan.name, status, progress,
      ownerIds: plan.owner ? [plan.owner] : [], blockers, risks, milestones: [], source: "exs1-executive-runtime-store",
      createdFromDecision: true, workspaceId: null, modelId: null });
  };
  const result = (status: NexoraExecutionRuntimeResult["status"], execution: NexoraCanonicalExecution | null, reasons: readonly string[]): NexoraExecutionRuntimeResult => Object.freeze({ status, execution, reasons: Object.freeze([...reasons]) });
  return Object.freeze({
    authorityId: "exs1.executive-runtime-store.execution",
    getExecution: (id: string) => project().executionId === id ? project() : null,
    findExecutionByDecisionId: (id: string) => project().decisionId === id ? project() : null,
    listExecutions: () => Object.freeze([project()]),
    createExecution(input) {
      const decision = decisionRuntime.getDecision(input.decisionId);
      if (!decision) return result("not-found", null, ["execution-canonical-decision-not-found"]);
      if (!assessDecisionExecutionEligibility(decision.status).eligible) return result("not-eligible", null, ["execution-decision-not-approved"]);
      const existing = project();
      return existing.decisionId === input.decisionId
        ? result("reused", existing, ["execution-existing-reused", "execution-decision-link-preserved"])
        : result("failed", null, ["execution-ui-authority-cannot-create-plan"]);
    },
    transitionExecution(input) {
      const current = project();
      if (current.executionId !== input.executionId) return result("not-found", null, ["execution-not-found"]);
      // EXS1's canonical Idle → Running transition has no persisted Ready state.
      const allowedByExsPolicy = input.action === "start" && current.status === "planned";
      if (!allowedByExsPolicy && !isExecutionTransitionAllowed(current.status, input.action)) return result("transition-not-allowed", current, ["execution-transition-rejected"]);
      if (input.action === "start") store.actions.startExecution();
      else if (input.action === "resume") store.actions.resumeExecution();
      else if (input.action === "complete") store.actions.completeExecution();
      else if (input.action === "cancel") store.actions.cancelExecution();
      else if (input.action === "block" || input.action === "mark-at-risk") store.actions.pauseExecution();
      else if (input.action === "prepare") return result("applied", current, ["execution-transition-applied"]);
      return result("applied", project(), ["execution-transition-applied"]);
    },
  });
}
