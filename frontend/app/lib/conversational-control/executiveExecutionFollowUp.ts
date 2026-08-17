/** CC:11 — Execution Follow-up authority. */

import type { NexoraDecisionRuntimeAdapter } from "./executiveDecisionRuntimeAdapter.ts";
import type { NexoraExecutionRuntimeAdapter, NexoraCanonicalExecution } from "./executiveExecutionRuntimeAdapter.ts";
import type { NexoraExecutionTransitionAction } from "./executiveExecutionPolicy.ts";

export const executiveExecutionFollowUpIdentity = "CC:11/ExecutionFollowUp" as const;
export const executiveExecutionFollowUpVersion = "1.0.0" as const;
export const executiveExecutionFollowUpNamespace = "nexora.conversational-control.execution-follow-up" as const;
export const executiveExecutionFollowUpArchitecturalRole = "ExecutiveExecutionFollowUpAuthority" as const;

export const EXECUTIVE_EXECUTION_FOLLOW_UP_BOUNDARY = Object.freeze({
  canonicalExecutionWriter: false as const,
  delegatesMutationsToCanonicalRuntime: true as const,
  mutatesDecision: false as const,
  mutatesStage: false as const,
  movesCamera: false as const,
  mutatesTopology: false as const,
  createsTasks: false as const,
  assignsOwners: false as const,
  createsDeadlines: false as const,
  externalSideEffects: false as const,
});

export type NexoraExecutionHandoff = {
  readonly decisionId: string;
  readonly requestedAction: "create-execution" | "start-execution" | "track-execution" | "review-execution";
  readonly source: "conversation";
};

export type NexoraExecutionFollowUpRequest = {
  readonly action: Parameters<typeof resolveNexoraExecutiveExecutionFollowUp>[0]["action"];
  readonly transitionAction?: NexoraExecutionTransitionAction;
  readonly targetHint: string | null;
  readonly requiresContext: boolean;
};

/** Minimal deterministic CC:11 vocabulary; lexical hints are never canonical IDs. */
export function resolveNexoraExecutionFollowUpRequest(utterance: string): NexoraExecutionFollowUpRequest | null {
  const text = utterance.trim().toLowerCase().replace(/[?.!]+$/, "");
  const target = (pattern: RegExp) => text.match(pattern)?.[1]?.trim() || null;
  if (/^(?:start|begin)(?: execution| implementation)?(?: for)?(?: this decision| it)?$/.test(text)) return Object.freeze({ action: "start", targetHint: null, requiresContext: true });
  const startTarget = target(/^(?:start|begin)(?: execution| implementation)?(?: for)? (.+)$/);
  if (startTarget) return Object.freeze({ action: "start", targetHint: startTarget, requiresContext: false });
  if (/^(?:create (?:an? )?(?:execution|implementation) plan|track)(?: this decision| it)?$/.test(text)) return Object.freeze({ action: text.startsWith("track") ? "track" : "create", targetHint: null, requiresContext: true });
  if (/^(?:how is (?:it|this) going|are we on track|what needs my attention)$/.test(text)) return Object.freeze({ action: "review", targetHint: null, requiresContext: true });
  if (/^(?:how far along are we|what(?:'s| is) the progress|show progress)$/.test(text)) return Object.freeze({ action: "progress", targetHint: null, requiresContext: true });
  if (/^what(?:'s| is) blocking (?:this|it)|^show blockers$/.test(text)) return Object.freeze({ action: "blockers", targetHint: null, requiresContext: true });
  if (/^who owns (?:this|it)$/.test(text)) return Object.freeze({ action: "owner", targetHint: null, requiresContext: true });
  if (/^(?:what(?:'s| is) the next milestone|show milestones)$/.test(text)) return Object.freeze({ action: "milestones", targetHint: null, requiresContext: true });
  if (/^(?:are we late|is (?:this|it) late)$/.test(text)) return Object.freeze({ action: "deadline", targetHint: null, requiresContext: true });
  if (/^why are we doing (?:this|it)$/.test(text)) return Object.freeze({ action: "why", targetHint: null, requiresContext: true });
  if (/^(?:mark (?:this|it) blocked)$/.test(text)) return Object.freeze({ action: "transition", transitionAction: "block", targetHint: null, requiresContext: true });
  if (/^(?:resume|resume (?:this|it))$/.test(text)) return Object.freeze({ action: "transition", transitionAction: "resume", targetHint: null, requiresContext: true });
  if (/^mark (?:this|it) complete$/.test(text)) return Object.freeze({ action: "transition", transitionAction: "complete", targetHint: null, requiresContext: true });
  if (/^cancel execution$/.test(text)) return Object.freeze({ action: "transition", transitionAction: "cancel", targetHint: null, requiresContext: true });
  return null;
}

export type NexoraExecutionAssessment = {
  readonly executionId: string;
  readonly status: NexoraCanonicalExecution["status"];
  readonly progress: number | null;
  readonly blockers: NexoraCanonicalExecution["blockers"];
  readonly risks: NexoraCanonicalExecution["risks"];
  readonly overdueItems: readonly string[];
  readonly nextMilestones: NexoraCanonicalExecution["milestones"];
  readonly attentionLevel: "normal" | "watch" | "critical";
  readonly uncertainties: readonly string[];
};

export type NexoraExecutiveExecutionFollowUpResult = {
  readonly executionId: string | null;
  readonly status: "available" | "not-found" | "insufficient-data" | "blocked" | "unsupported" | "confirmation-required";
  readonly assessment?: NexoraExecutionAssessment;
  readonly decisionRationale?: string;
  readonly handoff?: "CC:8" | "CC:9" | "CC:10";
  readonly reasons: readonly string[];
};

function assess(execution: NexoraCanonicalExecution, asOf?: string): NexoraExecutionAssessment {
  const uncertainties: string[] = [];
  if (execution.progress == null) uncertainties.push("execution-progress-unknown");
  if (execution.ownerIds.length === 0) uncertainties.push("execution-owner-missing");
  const overdueItems = asOf
    ? execution.milestones
        .filter((m) => m.deadline != null && m.completed !== true && m.deadline < asOf)
        .map((m) => m.milestoneId)
    : [];
  const attentionLevel = execution.status === "blocked" ? "critical" : execution.status === "at-risk" || execution.risks.length > 0 ? "watch" : "normal";
  return Object.freeze({ executionId: execution.executionId, status: execution.status, progress: execution.progress ?? null,
    blockers: execution.blockers, risks: execution.risks, overdueItems: Object.freeze(overdueItems),
    nextMilestones: Object.freeze(execution.milestones.filter((m) => m.completed !== true)), attentionLevel,
    uncertainties: Object.freeze(uncertainties) });
}

export function resolveNexoraExecutiveExecutionFollowUp(input: {
  readonly action: "create" | "start" | "track" | "review" | "status" | "progress" | "blockers" | "owner" | "milestones" | "deadline" | "why" | "recommend" | "scenario" | "reconsider" | "transition";
  readonly decisionId?: string | null;
  readonly executionId?: string | null;
  readonly transitionAction?: NexoraExecutionTransitionAction;
  readonly confirmed?: boolean;
  /** Trusted deterministic comparison clock supplied by Runtime. */
  readonly asOf?: string;
  readonly executionRuntime: NexoraExecutionRuntimeAdapter;
  readonly decisionRuntime: NexoraDecisionRuntimeAdapter;
}): NexoraExecutiveExecutionFollowUpResult {
  if (input.action === "reconsider") return Object.freeze({ executionId: input.executionId ?? null, status: "available", handoff: "CC:10", reasons: Object.freeze(["execution-decision-reconsideration-handoff"]) });
  if (input.action === "scenario") return Object.freeze({ executionId: input.executionId ?? null, status: "available", handoff: "CC:9", reasons: Object.freeze(["execution-recovery-scenario-handoff"]) });
  if (input.action === "recommend") return Object.freeze({ executionId: input.executionId ?? null, status: "available", handoff: "CC:8", reasons: Object.freeze(["execution-recommendation-handoff"]) });

  let execution = input.executionId ? input.executionRuntime.getExecution(input.executionId) : null;
  if (!execution && input.decisionId) execution = input.executionRuntime.findExecutionByDecisionId(input.decisionId);
  if (!execution && (input.action === "create" || input.action === "start" || input.action === "track")) {
    if (!input.decisionId) return Object.freeze({ executionId: null, status: "insufficient-data", reasons: Object.freeze(["execution-target-clarification-required"]) });
    const created = input.executionRuntime.createExecution({ decisionId: input.decisionId });
    if (!created.execution) return Object.freeze({ executionId: null, status: created.status === "not-eligible" ? "blocked" : "not-found", reasons: created.reasons });
    execution = created.execution;
    if (input.action === "start" && execution.status === "planned") {
      const ready = input.executionRuntime.transitionExecution({ executionId: execution.executionId, action: "prepare" });
      if (!ready.execution) return Object.freeze({ executionId: execution.executionId, status: "blocked", reasons: ready.reasons });
      const started = input.executionRuntime.transitionExecution({ executionId: execution.executionId, action: "start" });
      execution = started.execution;
    }
  }
  if (!execution) return Object.freeze({ executionId: null, status: "not-found", reasons: Object.freeze(["execution-not-found"]) });

  if (input.action === "transition") {
    if (!input.transitionAction) return Object.freeze({ executionId: execution.executionId, status: "unsupported", reasons: Object.freeze(["execution-transition-unsupported"]) });
    if ((input.transitionAction === "complete" || input.transitionAction === "cancel") && input.confirmed !== true) return Object.freeze({ executionId: execution.executionId, status: "confirmation-required", reasons: Object.freeze(["execution-confirmation-required"]) });
    const transitioned = input.executionRuntime.transitionExecution({ executionId: execution.executionId, action: input.transitionAction });
    if (transitioned.status === "transition-not-allowed") return Object.freeze({ executionId: execution.executionId, status: "blocked", assessment: assess(execution, input.asOf), reasons: transitioned.reasons });
    execution = transitioned.execution ?? execution;
  }
  if (input.action === "why") {
    const decision = input.decisionRuntime.getDecision(execution.decisionId);
    if (!decision) return Object.freeze({ executionId: execution.executionId, status: "insufficient-data", reasons: Object.freeze(["execution-decision-link-invalid"]) });
    return Object.freeze({ executionId: execution.executionId, status: "available", assessment: assess(execution, input.asOf), decisionRationale: decision.rationale?.summary, reasons: Object.freeze(["execution-decision-readback", "execution-decision-link-preserved"]) });
  }
  const assessment = assess(execution, input.asOf);
  const reasons = ["execution-followup-generated"];
  if (input.action === "progress" && assessment.progress == null) reasons.push("execution-progress-unknown");
  if (input.action === "owner") reasons.push(execution.ownerIds.length ? "execution-owner-resolved" : "execution-owner-missing");
  if (input.action === "deadline" && !execution.milestones.some((m) => m.deadline)) reasons.push("execution-deadline-missing");
  return Object.freeze({ executionId: execution.executionId, status: "available", assessment, reasons: Object.freeze(reasons) });
}
