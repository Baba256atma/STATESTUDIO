/**
 * B.49 — Operator workflow closure verdict (deterministic; no persistence, no analytics layer).
 */

import { loadExecutionOutcomeForRun } from "../execution/nexoraExecutionStore.ts";
import { loadNexoraFeedback } from "../feedback/nexoraFeedback.ts";
import type { NexoraDomainActionItem } from "../domain/nexoraDomainActionExtraction.ts";
import type { NexoraPipelineStatusUi } from "../../screens/nexoraPipelineStatus.ts";

/** Fired when HomeScreen mirrors pipeline + audit run id into `__NEXORA_DEBUG__` (dev / non-prod). */
export const NEXORA_WORKFLOW_DEBUG_UPDATED = "nexora:workflow_debug_updated" as const;

export type NexoraWorkflowClosureStatus = "completed" | "incomplete" | "needs_follow_up";

export type NexoraWorkflowClosure = {
  status: NexoraWorkflowClosureStatus;
  summary: string;
  missingSteps: string[];
};

export type NexoraWorkflowClosureInput = {
  hasAnalysis: boolean;
  hasDecision: boolean;
  hasOutcome: boolean;
  hasNextAction: boolean;
  hasFeedback?: boolean;
};

function isPipelineLike(x: unknown): x is NexoraPipelineStatusUi {
  if (!x || typeof x !== "object") return false;
  const s = (x as NexoraPipelineStatusUi).status;
  return s === "idle" || s === "processing" || s === "ready" || s === "error";
}

function pipelineDecisionPresent(ps: NexoraPipelineStatusUi): boolean {
  return Boolean(ps.decisionPosture || ps.decisionTradeoff || ps.decisionNextMove);
}

/**
 * Derives B.49 inputs from existing client state: B.3 pipeline HUD (`__NEXORA_DEBUG__.lastPipelineStatus`),
 * B.19/B.15 run id (`__NEXORA_DEBUG__.lastAuditRunId`), B.20 store, B.32 feedback, B.44 action items.
 */
export function buildNexoraWorkflowClosureInputFromBrowser(args: {
  domainActionItems: readonly NexoraDomainActionItem[];
}): NexoraWorkflowClosureInput {
  const w = typeof window !== "undefined" ? window : undefined;
  const dbg = (w as Window & { __NEXORA_DEBUG__?: Record<string, unknown> } | undefined)?.__NEXORA_DEBUG__;
  const psRaw = dbg?.lastPipelineStatus;
  const ps = isPipelineLike(psRaw) ? psRaw : null;
  const runId = typeof dbg?.lastAuditRunId === "string" ? dbg.lastAuditRunId.trim() : "";

  const hasAnalysis = ps?.status === "ready";
  const hasDecision = ps?.status === "ready" && pipelineDecisionPresent(ps);
  const hasOutcome = Boolean(runId && loadExecutionOutcomeForRun(runId));
  const hasNextAction = args.domainActionItems.some((a) => Boolean(a.title?.trim()));
  const hasFeedback =
    runId.length > 0 ? loadNexoraFeedback().some((r) => r.runId === runId) : false;

  return {
    hasAnalysis,
    hasDecision,
    hasOutcome,
    hasNextAction,
    hasFeedback,
  };
}

export function evaluateWorkflowClosure(input: NexoraWorkflowClosureInput): NexoraWorkflowClosure {
  if (!input.hasAnalysis || !input.hasDecision) {
    const missingSteps: string[] = [];
    if (!input.hasAnalysis) missingSteps.push("analysis");
    if (!input.hasDecision) missingSteps.push("decision");
    let summary: string;
    if (!input.hasAnalysis) {
      summary = "Workflow incomplete. Analysis has not been completed.";
    } else {
      summary = "Workflow incomplete. A decision has not been formed yet.";
    }
    return { status: "incomplete", summary, missingSteps: dedupeSteps(missingSteps) };
  }

  if (!input.hasOutcome || !input.hasNextAction) {
    let summary: string;
    if (!input.hasOutcome && !input.hasNextAction) {
      summary = "Session needs follow-up. Outcome has not been recorded yet. Next action is not clear yet.";
    } else if (!input.hasOutcome) {
      summary = "Session needs follow-up. Outcome has not been recorded yet.";
    } else {
      summary = "Session needs follow-up. Next action is not clear yet.";
    }
    const missingSteps: string[] = [];
    if (!input.hasOutcome) missingSteps.push("outcome");
    if (!input.hasNextAction) missingSteps.push("next_action");
    return { status: "needs_follow_up", summary, missingSteps: dedupeSteps(missingSteps) };
  }

  const completed: NexoraWorkflowClosure = {
    status: "completed",
    summary: "Workflow completed. The session has reached a usable conclusion.",
    missingSteps: [],
  };
  if (input.hasFeedback === false) {
    completed.missingSteps = ["feedback"];
  }
  return completed;
}

function dedupeSteps(steps: string[]): string[] {
  return [...new Set(steps)];
}

export function formatWorkflowClosure(closure: NexoraWorkflowClosure): string {
  const label =
    closure.status === "needs_follow_up"
      ? "Needs follow-up"
      : closure.status === "incomplete"
        ? "Incomplete"
        : "Completed";
  const lines = [`Nexora Workflow Status:`, label, "", closure.summary];
  if (closure.missingSteps.length) {
    lines.push("", `Missing: ${closure.missingSteps.join(", ")}`);
  }
  return lines.join("\n");
}

let lastB49Sig: string | null = null;

export function emitWorkflowClosureEvaluatedDev(closure: NexoraWorkflowClosure): void {
  if (process.env.NODE_ENV === "production") return;
  const sig = `${closure.status}|${closure.missingSteps.join(",")}|${closure.summary}`;
  if (sig === lastB49Sig) return;
  lastB49Sig = sig;
  globalThis.console?.debug?.("[Nexora][B49] workflow_closure_evaluated", {
    status: closure.status,
    missingSteps: closure.missingSteps,
  });
}

export function syncWorkflowClosureDebug(closure: NexoraWorkflowClosure): void {
  if (typeof window === "undefined" || process.env.NODE_ENV === "production") return;
  const win = window as Window & { __NEXORA_DEBUG__?: Record<string, unknown> };
  win.__NEXORA_DEBUG__ = { ...(win.__NEXORA_DEBUG__ ?? {}) };
  win.__NEXORA_DEBUG__.workflowClosure = { ...closure };
}
