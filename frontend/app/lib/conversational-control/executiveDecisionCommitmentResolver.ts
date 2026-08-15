/**
 * CC:10 — Pure Decision Commitment resolver.
 *
 * Does not mutate Runtime/Stage. Returns a planned/applied Decision session
 * update for the orchestrator to accept.
 */

import type { NexoraExecutiveContextSnapshot } from "./executiveContextSnapshot.ts";
import type { NexoraExecutiveScenarioSession } from "./executiveScenarioResolver.ts";
import type { NexoraExecutiveScenario } from "./executiveScenarioDefinition.ts";
import type { NexoraExecutiveScenarioEvaluation } from "./executiveScenarioEvaluation.ts";
import {
  EXECUTIVE_DECISION_REASON,
  type NexoraDecisionCommitmentStatus,
  type ExecutiveDecisionReasonCode,
} from "./executiveDecisionCommitment.ts";
import {
  buildDeterministicCandidateId,
  buildDeterministicDecisionId,
  type NexoraDecisionCandidate,
  type NexoraDecisionRationale,
  type NexoraExecutiveDecision,
} from "./executiveDecisionCandidate.ts";
import {
  resolveNexoraDecisionCommitmentPolicy,
  type NexoraDecisionCommitmentStrength,
} from "./executiveDecisionCommitmentPolicy.ts";
import {
  buildPendingDecisionConfirmation,
  isPendingDecisionConfirmationStale,
} from "./executiveDecisionConfirmation.ts";
import {
  applyNexoraExecutiveDecisionTransition,
  createEmptyNexoraExecutiveDecisionSession,
  findDecisionById,
  findDecisionByScenarioId,
  setPendingDecisionConfirmation,
  type NexoraExecutiveDecisionSession,
} from "./executiveDecisionAuthority.ts";
import type { NexoraDecisionRuntimeAdapter } from "./executiveDecisionRuntimeAdapter.ts";
import { createNexoraCanonicalDecisionRuntime } from "./executiveDecisionRuntimeAdapter.ts";
import type { NexoraDecisionTransitionAction } from "./executiveDecisionTransition.ts";

export type NexoraDecisionCommitmentAction =
  | NexoraDecisionTransitionAction
  | "confirm"
  | "cancel"
  | "preference";

export type NexoraDecisionCommitmentResolverInput = {
  readonly action: NexoraDecisionCommitmentAction;
  readonly strength: NexoraDecisionCommitmentStrength;
  readonly executiveContext: NexoraExecutiveContextSnapshot;
  /** Session metadata only (pending confirmation + provenance). */
  readonly decisionSession?: NexoraExecutiveDecisionSession | null;
  /** Canonical Decision product authority — required for mutations. */
  readonly decisionRuntime?: NexoraDecisionRuntimeAdapter | null;
  readonly scenarioSession?: NexoraExecutiveScenarioSession | null;
  readonly targetHintRaw?: string | null;
  readonly primarySubjectId?: string | null;
  readonly commandId?: string;
  readonly utterance?: string;
  readonly hasCompoundExecutionRequest?: boolean;
  /** Deterministic committedAt from test/Runtime clock. */
  readonly committedAt?: string;
  /** Last CC:8 recommendation title (optional). */
  readonly lastRecommendationTitle?: string | null;
};

export type NexoraDecisionCommitmentResult = {
  readonly status: NexoraDecisionCommitmentStatus;
  readonly candidate: NexoraDecisionCandidate | null;
  readonly decision: NexoraExecutiveDecision | null;
  readonly requestedTransition: NexoraDecisionTransitionAction | null;
  readonly requiresConfirmation: boolean;
  readonly clarificationPrompt: string | null;
  readonly summary: string;
  readonly nextSession: NexoraExecutiveDecisionSession;
  readonly executionDeferred: boolean;
  readonly reasons: readonly ExecutiveDecisionReasonCode[];
  readonly evidenceFingerprint: string | null;
  readonly scenarioFingerprint: string | null;
  readonly trace: {
    readonly action: NexoraDecisionCommitmentAction;
    readonly reasons: readonly string[];
  };
};

function freezeResult(
  result: NexoraDecisionCommitmentResult,
): NexoraDecisionCommitmentResult {
  return Object.freeze({
    ...result,
    reasons: Object.freeze([...result.reasons]),
    trace: Object.freeze({
      action: result.trace.action,
      reasons: Object.freeze([...result.trace.reasons]),
    }),
  });
}

function scenarioRevisionMap(
  session: NexoraExecutiveScenarioSession | null | undefined,
): Readonly<Record<string, number>> {
  if (!session) return Object.freeze({});
  const out: Record<string, number> = {};
  for (const scenario of Object.values(session.scenariosById)) {
    out[scenario.scenarioId] = scenario.revision;
  }
  return Object.freeze(out);
}

function resolveOrdinalLetter(raw: string): number | null {
  const m = raw.trim().toLowerCase().match(/^(?:scenario\s+)?([a-c])$/);
  if (!m) return null;
  return m[1]!.charCodeAt(0) - "a".charCodeAt(0);
}

function resolveScenarioFromHint(
  session: NexoraExecutiveScenarioSession | null | undefined,
  hint: string | null | undefined,
  context: NexoraExecutiveContextSnapshot,
): NexoraExecutiveScenario | null {
  if (!session) return null;
  const raw = (hint ?? "").trim().toLowerCase();

  if (
    !raw ||
    raw === "this" ||
    raw === "that" ||
    raw === "it" ||
    raw === "the preferred scenario" ||
    raw === "preferred scenario" ||
    raw === "your recommendation" ||
    raw === "the recommendation"
  ) {
    // Fall through to context / preference / active.
  } else {
    const ordinal = resolveOrdinalLetter(raw);
    if (ordinal != null) {
      const id = session.candidateScenarioIds[ordinal];
      if (id) return session.scenariosById[id] ?? null;
    }
    for (const scenario of Object.values(session.scenariosById)) {
      if (scenario.name.toLowerCase() === raw) return scenario;
      if (scenario.scenarioId.toLowerCase() === raw) return scenario;
      if (scenario.name.toLowerCase().includes(raw)) return scenario;
    }
  }

  if (
    raw === "the preferred scenario" ||
    raw === "preferred scenario" ||
    raw.includes("preferred")
  ) {
    const preferred = session.lastComparison?.preferredScenarioId;
    if (preferred) return session.scenariosById[preferred] ?? null;
  }

  if (context.currentScenario?.subjectId) {
    const fromCtx =
      session.scenariosById[context.currentScenario.subjectId] ?? null;
    if (fromCtx) return fromCtx;
  }

  if (session.activeScenarioId) {
    return session.scenariosById[session.activeScenarioId] ?? null;
  }

  return null;
}

function evaluationFor(
  session: NexoraExecutiveScenarioSession | null | undefined,
  scenarioId: string | undefined,
): NexoraExecutiveScenarioEvaluation | null {
  if (!session || !scenarioId) return null;
  return session.evaluationsById[scenarioId] ?? null;
}

function uncertaintyRefsFromEvaluation(
  evaluation: NexoraExecutiveScenarioEvaluation | null,
): readonly string[] {
  if (!evaluation) return Object.freeze([]);
  return Object.freeze(
    evaluation.uncertainties.map(
      (u) => u.kind || u.description || "unknown",
    ),
  );
}

function fingerprintScenario(
  scenario: NexoraExecutiveScenario | null,
  evaluation: NexoraExecutiveScenarioEvaluation | null,
): string | null {
  if (!scenario) return null;
  return [
    scenario.scenarioId,
    `rev:${scenario.revision}`,
    `status:${scenario.status}`,
    evaluation ? `eval:${evaluation.scenarioId}` : "eval:none",
    evaluation
      ? `unk:${evaluation.uncertainties.map((u) => u.kind || u.description).join(",")}`
      : "",
  ].join("|");
}

function fingerprintEvidence(
  candidate: NexoraDecisionCandidate | null,
): string | null {
  if (!candidate) return null;
  return candidate.evidenceRefs
    .map((e) => `${e.sourceKind}:${e.sourceId}:${e.factKey ?? ""}`)
    .join("|");
}

function buildCandidateFromScenario(input: {
  readonly scenario: NexoraExecutiveScenario;
  readonly evaluation: NexoraExecutiveScenarioEvaluation | null;
  readonly recommendationId?: string | null;
}): NexoraDecisionCandidate {
  const uncertaintyRefs = uncertaintyRefsFromEvaluation(input.evaluation);
  const status: NexoraDecisionCandidate["status"] =
    input.scenario.status === "unsupported" ||
    input.scenario.status === "invalid"
      ? "invalid"
      : "valid";
  return Object.freeze({
    candidateId: buildDeterministicCandidateId({
      source: "scenario",
      key: input.scenario.scenarioId,
    }),
    subjectId: input.scenario.subjectIds[0],
    scenarioId: input.scenario.scenarioId,
    recommendationId: input.recommendationId ?? undefined,
    title: input.scenario.name,
    source: "scenario" as const,
    evidenceRefs: Object.freeze(
      (input.evaluation?.evidenceRefs ?? []).map((e) => Object.freeze({ ...e })),
    ),
    uncertaintyRefs,
    status,
    scenarioStatus: input.scenario.status,
    scenarioRevision: input.scenario.revision,
  });
}

function buildCandidateFromRecommendation(input: {
  readonly recommendationId: string;
  readonly title: string;
  readonly subjectId?: string | null;
}): NexoraDecisionCandidate {
  return Object.freeze({
    candidateId: buildDeterministicCandidateId({
      source: "recommendation",
      key: input.recommendationId,
    }),
    subjectId: input.subjectId ?? undefined,
    recommendationId: input.recommendationId,
    title: input.title,
    source: "recommendation" as const,
    evidenceRefs: Object.freeze([]),
    uncertaintyRefs: Object.freeze([]),
    status: "valid" as const,
  });
}

function buildRationale(
  candidate: NexoraDecisionCandidate,
  context: NexoraExecutiveContextSnapshot,
): NexoraDecisionRationale {
  return Object.freeze({
    summary: `Manager committed to ${candidate.title}.`,
    goalIds: Object.freeze(
      context.currentGoal ? [context.currentGoal.subjectId] : [],
    ),
    problemIds: Object.freeze(
      context.currentProblem ? [context.currentProblem.subjectId] : [],
    ),
    recommendationId: candidate.recommendationId,
    scenarioId: candidate.scenarioId,
    evidenceRefs: candidate.evidenceRefs,
    uncertaintyRefs: candidate.uncertaintyRefs,
  });
}

function resolveCandidate(
  input: NexoraDecisionCommitmentResolverInput,
  runtime: NexoraDecisionRuntimeAdapter,
): {
  readonly candidate: NexoraDecisionCandidate | null;
  readonly ambiguous: boolean;
  readonly reasons: string[];
} {
  const session = input.scenarioSession ?? null;
  const hint = (input.targetHintRaw ?? "").trim().toLowerCase();
  const reasons: string[] = [];

  // Recommendation handoff
  if (
    hint === "your recommendation" ||
    hint === "the recommendation" ||
    hint === "recommendation"
  ) {
    const recId = input.executiveContext.lastRecommendationId;
    if (!recId) {
      return {
        candidate: null,
        ambiguous: true,
        reasons: ["missing-recommendation"],
      };
    }
    reasons.push("recommendation-handoff");
    return {
      candidate: buildCandidateFromRecommendation({
        recommendationId: recId,
        title: input.lastRecommendationTitle ?? "Recommended option",
        subjectId:
          input.primarySubjectId ??
          input.executiveContext.currentSubject?.subjectId,
      }),
      ambiguous: false,
      reasons,
    };
  }

  // Preferred scenario
  if (hint.includes("preferred") && session?.lastComparison?.preferredScenarioId) {
    const scenario =
      session.scenariosById[session.lastComparison.preferredScenarioId] ?? null;
    if (scenario) {
      reasons.push("scenario-preference-handoff");
      return {
        candidate: buildCandidateFromScenario({
          scenario,
          evaluation: evaluationFor(session, scenario.scenarioId),
          recommendationId: input.executiveContext.lastRecommendationId,
        }),
        ambiguous: false,
        reasons,
      };
    }
  }

  const scenario = resolveScenarioFromHint(
    session,
    input.targetHintRaw,
    input.executiveContext,
  );

  if (scenario) {
    reasons.push("scenario-candidate");
    return {
      candidate: buildCandidateFromScenario({
        scenario,
        evaluation: evaluationFor(session, scenario.scenarioId),
        recommendationId: input.executiveContext.lastRecommendationId,
      }),
      ambiguous: false,
      reasons,
    };
  }

  // Existing decision in context / runtime
  if (
    input.executiveContext.currentDecision?.subjectId &&
    (!hint || hint === "this" || hint === "it" || hint === "that")
  ) {
    const decisionId = input.executiveContext.currentDecision.subjectId;
    const existing = findDecisionById(runtime, decisionId);
    if (existing) {
      reasons.push("existing-decision");
      return {
        candidate: Object.freeze({
          candidateId: buildDeterministicCandidateId({
            source: "existing-decision",
            key: existing.decisionId,
          }),
          decisionId: existing.decisionId,
          subjectId: existing.subjectIds[0],
          scenarioId: existing.scenarioId,
          recommendationId: existing.recommendationId,
          title: existing.title,
          source: "existing-decision" as const,
          evidenceRefs: existing.evidenceRefs,
          uncertaintyRefs: existing.uncertaintyRefs,
          status: "valid" as const,
          scenarioRevision: existing.scenarioRevision ?? null,
        }),
        ambiguous: false,
        reasons,
      };
    }
  }

  // Ambiguous "do it" / empty hint with multiple candidates
  const candidates = session?.candidateScenarioIds ?? [];
  if (
    (!hint || hint === "it" || hint === "this" || hint === "that") &&
    candidates.length > 1 &&
    !session?.activeScenarioId &&
    !input.executiveContext.currentScenario
  ) {
    return {
      candidate: null,
      ambiguous: true,
      reasons: ["multiple-candidates"],
    };
  }

  if (
    (!hint || hint === "it") &&
    candidates.length === 1 &&
    session
  ) {
    const only = session.scenariosById[candidates[0]!] ?? null;
    if (only) {
      reasons.push("single-trustworthy-candidate");
      return {
        candidate: buildCandidateFromScenario({
          scenario: only,
          evaluation: evaluationFor(session, only.scenarioId),
          recommendationId: input.executiveContext.lastRecommendationId,
        }),
        ambiguous: false,
        reasons,
      };
    }
  }

  return {
    candidate: null,
    ambiguous: true,
    reasons: ["unresolved-candidate"],
  };
}

function actionForCommitment(
  action: NexoraDecisionCommitmentAction,
): NexoraDecisionTransitionAction | null {
  if (
    action === "confirm" ||
    action === "cancel" ||
    action === "preference"
  ) {
    return null;
  }
  return action;
}

/**
 * Primary CC:10 API.
 */
export function resolveNexoraExecutiveDecisionCommitment(
  input: NexoraDecisionCommitmentResolverInput,
): NexoraDecisionCommitmentResult {
  const session =
    input.decisionSession ?? createEmptyNexoraExecutiveDecisionSession();
  const runtime =
    input.decisionRuntime ??
    createNexoraCanonicalDecisionRuntime().adapter;
  const commandId = input.commandId ?? "cc10:cmd";
  const executionDeferred = input.hasCompoundExecutionRequest === true;

  // Preference only
  if (input.action === "preference" || input.strength === "preference") {
    return freezeResult({
      status: "preference-only",
      candidate: null,
      decision: null,
      requestedTransition: null,
      requiresConfirmation: false,
      clarificationPrompt: null,
      summary: "Preference noted — no Decision committed.",
      nextSession: session,
      executionDeferred: false,
      reasons: [
        EXECUTIVE_DECISION_REASON.PREFERENCE_ONLY,
        EXECUTIVE_DECISION_REASON.DETERMINISTIC,
      ],
      evidenceFingerprint: null,
      scenarioFingerprint: null,
      trace: {
        action: "preference",
        reasons: ["preference-only"],
      },
    });
  }

  // Cancel pending confirmation
  if (input.action === "cancel") {
    if (session.pendingConfirmation == null) {
      return freezeResult({
        status: "clarification-required",
        candidate: null,
        decision: null,
        requestedTransition: null,
        requiresConfirmation: false,
        clarificationPrompt: null,
        summary: "No pending Decision confirmation to cancel.",
        nextSession: session,
        executionDeferred: false,
        reasons: [EXECUTIVE_DECISION_REASON.DETERMINISTIC],
        evidenceFingerprint: null,
        scenarioFingerprint: null,
        trace: { action: "cancel", reasons: ["nothing-pending"] },
      });
    }
    const cancelled = Object.freeze({
      ...session.pendingConfirmation,
      status: "cancelled" as const,
    });
    return freezeResult({
      status: "applied",
      candidate: null,
      decision: null,
      requestedTransition: null,
      requiresConfirmation: false,
      clarificationPrompt: null,
      summary: "Decision confirmation cancelled.",
      nextSession: setPendingDecisionConfirmation(
        Object.freeze({
          ...session,
          pendingConfirmation: cancelled,
        }),
        null,
      ),
      executionDeferred: false,
      reasons: [
        EXECUTIVE_DECISION_REASON.CONFIRMATION_CANCELLED,
        EXECUTIVE_DECISION_REASON.DETERMINISTIC,
      ],
      evidenceFingerprint: null,
      scenarioFingerprint: null,
      trace: { action: "cancel", reasons: ["confirmation-cancelled"] },
    });
  }

  // Confirm pending
  if (input.action === "confirm") {
    const pending = session.pendingConfirmation;
    if (pending == null || pending.status !== "pending") {
      return freezeResult({
        status: "clarification-required",
        candidate: null,
        decision: null,
        requestedTransition: null,
        requiresConfirmation: false,
        clarificationPrompt: "Which option do you want to commit to?",
        summary: "No pending Decision confirmation.",
        nextSession: session,
        executionDeferred: false,
        reasons: [
          EXECUTIVE_DECISION_REASON.CANDIDATE_AMBIGUOUS,
          EXECUTIVE_DECISION_REASON.DETERMINISTIC,
        ],
        evidenceFingerprint: null,
        scenarioFingerprint: null,
        trace: { action: "confirm", reasons: ["no-pending-confirmation"] },
      });
    }

    if (
      isPendingDecisionConfirmationStale({
        pending,
        workspaceId: input.executiveContext.currentWorkspaceId,
        modelId: input.executiveContext.currentModelId,
        scenarioRevisionById: scenarioRevisionMap(input.scenarioSession),
      })
    ) {
      return freezeResult({
        status: "failed",
        candidate: null,
        decision: null,
        requestedTransition: null,
        requiresConfirmation: false,
        clarificationPrompt: null,
        summary: "That confirmation is no longer valid.",
        nextSession: setPendingDecisionConfirmation(session, null),
        executionDeferred: false,
        reasons: [
          EXECUTIVE_DECISION_REASON.CONFIRMATION_STALE,
          EXECUTIVE_DECISION_REASON.DETERMINISTIC,
        ],
        evidenceFingerprint: null,
        scenarioFingerprint: null,
        trace: { action: "confirm", reasons: ["confirmation-stale"] },
      });
    }

    // Re-resolve candidate by pending id
    const resolved = resolveCandidate(
      {
        ...input,
        action: pending.requestedAction,
        strength: "explicit",
        targetHintRaw:
          pending.scenarioId ??
          input.targetHintRaw ??
          pending.candidateId,
      },
      runtime,
    );
    // Prefer candidate matching pending.candidateId from scenario session
    let candidate = resolved.candidate;
    if (candidate && candidate.candidateId !== pending.candidateId) {
      // Search scenarios for matching candidate id
      const sessionScenarios = input.scenarioSession;
      if (sessionScenarios) {
        for (const scenario of Object.values(sessionScenarios.scenariosById)) {
          const c = buildCandidateFromScenario({
            scenario,
            evaluation: evaluationFor(sessionScenarios, scenario.scenarioId),
            recommendationId: input.executiveContext.lastRecommendationId,
          });
          if (c.candidateId === pending.candidateId) {
            candidate = c;
            break;
          }
        }
      }
    }

    if (!candidate || candidate.candidateId !== pending.candidateId) {
      return freezeResult({
        status: "failed",
        candidate: null,
        decision: null,
        requestedTransition: null,
        requiresConfirmation: false,
        clarificationPrompt: null,
        summary: "That confirmation is no longer valid.",
        nextSession: setPendingDecisionConfirmation(session, null),
        executionDeferred: false,
        reasons: [
          EXECUTIVE_DECISION_REASON.CONFIRMATION_STALE,
          EXECUTIVE_DECISION_REASON.DETERMINISTIC,
        ],
        evidenceFingerprint: null,
        scenarioFingerprint: null,
        trace: { action: "confirm", reasons: ["candidate-mismatch-stale"] },
      });
    }

    return applyCommitment({
      input: {
        ...input,
        action: pending.requestedAction,
        strength: "explicit",
      },
      session: setPendingDecisionConfirmation(session, null),
      runtime,
      candidate,
      transitionAction: pending.requestedAction,
      extraReasons: [
        EXECUTIVE_DECISION_REASON.CONFIRMATION_CONFIRMED,
      ],
      executionDeferred,
      commandId,
    });
  }

  const transitionAction = actionForCommitment(input.action);
  if (transitionAction == null) {
    return freezeResult({
      status: "unsupported",
      candidate: null,
      decision: null,
      requestedTransition: null,
      requiresConfirmation: false,
      clarificationPrompt: null,
      summary: "That Decision action is not supported.",
      nextSession: session,
      executionDeferred: false,
      reasons: [EXECUTIVE_DECISION_REASON.DETERMINISTIC],
      evidenceFingerprint: null,
      scenarioFingerprint: null,
      trace: { action: input.action, reasons: ["unsupported-action"] },
    });
  }

  const resolved = resolveCandidate(input, runtime);
  if (resolved.ambiguous || resolved.candidate == null) {
    return freezeResult({
      status: "clarification-required",
      candidate: null,
      decision: null,
      requestedTransition: transitionAction,
      requiresConfirmation: false,
      clarificationPrompt: "Which option do you want to commit to?",
      summary: "Which option do you want to commit to?",
      nextSession: session,
      executionDeferred: false,
      reasons: [
        EXECUTIVE_DECISION_REASON.CANDIDATE_AMBIGUOUS,
        EXECUTIVE_DECISION_REASON.DETERMINISTIC,
      ],
      evidenceFingerprint: null,
      scenarioFingerprint: null,
      trace: {
        action: input.action,
        reasons: resolved.reasons,
      },
    });
  }

  const candidate = resolved.candidate;

  if (candidate.status === "invalid") {
    const unsupported = candidate.scenarioStatus === "unsupported";
    return freezeResult({
      status: unsupported ? "unsupported" : "invalid-candidate",
      candidate,
      decision: null,
      requestedTransition: transitionAction,
      requiresConfirmation: false,
      clarificationPrompt: unsupported
        ? "That scenario isn't supported for commitment."
        : null,
      summary: unsupported
        ? "That scenario isn't supported for a Decision."
        : "That Decision candidate isn't valid.",
      nextSession: session,
      executionDeferred: false,
      reasons: [
        unsupported
          ? EXECUTIVE_DECISION_REASON.UNSUPPORTED_SCENARIO
          : EXECUTIVE_DECISION_REASON.CANDIDATE_INVALID,
        EXECUTIVE_DECISION_REASON.DETERMINISTIC,
      ],
      evidenceFingerprint: fingerprintEvidence(candidate),
      scenarioFingerprint: candidate.scenarioId
        ? fingerprintScenario(
            input.scenarioSession?.scenariosById[candidate.scenarioId] ?? null,
            evaluationFor(input.scenarioSession, candidate.scenarioId),
          )
        : null,
      trace: {
        action: input.action,
        reasons: resolved.reasons.concat(["invalid-candidate"]),
      },
    });
  }

  const policy = resolveNexoraDecisionCommitmentPolicy({
    strength: input.strength,
    action: transitionAction,
    candidateValid: candidate.status === "valid",
    scenarioStatus: candidate.scenarioStatus,
    hasCompoundExecutionRequest: executionDeferred,
  });

  if (policy.outcome === "commitment-blocked") {
    return freezeResult({
      status: "invalid-candidate",
      candidate,
      decision: null,
      requestedTransition: transitionAction,
      requiresConfirmation: false,
      clarificationPrompt: null,
      summary: "That option can't be committed from its current state.",
      nextSession: session,
      executionDeferred: false,
      reasons: [
        EXECUTIVE_DECISION_REASON.CANDIDATE_INVALID,
        EXECUTIVE_DECISION_REASON.DETERMINISTIC,
      ],
      evidenceFingerprint: fingerprintEvidence(candidate),
      scenarioFingerprint: null,
      trace: {
        action: input.action,
        reasons: [...policy.reasons],
      },
    });
  }

  if (policy.outcome === "confirmation-required") {
    const pending = buildPendingDecisionConfirmation({
      candidateId: candidate.candidateId,
      requestedAction: transitionAction,
      commandId,
      workspaceId: input.executiveContext.currentWorkspaceId,
      modelId: input.executiveContext.currentModelId,
      scenarioId: candidate.scenarioId,
      scenarioRevision: candidate.scenarioRevision,
    });
    return freezeResult({
      status: "confirmation-required",
      candidate: Object.freeze({
        ...candidate,
        status: "confirmation-required" as const,
      }),
      decision: null,
      requestedTransition: transitionAction,
      requiresConfirmation: true,
      clarificationPrompt: `Commit to ${candidate.title}?`,
      summary: `Commit to ${candidate.title}?`,
      nextSession: setPendingDecisionConfirmation(session, pending),
      executionDeferred: false,
      reasons: [
        EXECUTIVE_DECISION_REASON.CONFIRMATION_REQUIRED,
        EXECUTIVE_DECISION_REASON.CANDIDATE_RESOLVED,
        EXECUTIVE_DECISION_REASON.DETERMINISTIC,
      ],
      evidenceFingerprint: fingerprintEvidence(candidate),
      scenarioFingerprint: candidate.scenarioId
        ? fingerprintScenario(
            input.scenarioSession?.scenariosById[candidate.scenarioId] ?? null,
            evaluationFor(input.scenarioSession, candidate.scenarioId),
          )
        : null,
      trace: {
        action: input.action,
        reasons: [...policy.reasons, ...resolved.reasons],
      },
    });
  }

  return applyCommitment({
    input,
    session,
    runtime,
    candidate,
    transitionAction,
    extraReasons: [
      EXECUTIVE_DECISION_REASON.EXPLICIT_COMMITMENT,
      EXECUTIVE_DECISION_REASON.MANAGER_AUTHORITY,
    ],
    executionDeferred,
    commandId,
  });
}

function applyCommitment(args: {
  readonly input: NexoraDecisionCommitmentResolverInput;
  readonly session: NexoraExecutiveDecisionSession;
  readonly runtime: NexoraDecisionRuntimeAdapter;
  readonly candidate: NexoraDecisionCandidate;
  readonly transitionAction: NexoraDecisionTransitionAction;
  readonly extraReasons: readonly ExecutiveDecisionReasonCode[];
  readonly executionDeferred: boolean;
  readonly commandId: string;
}): NexoraDecisionCommitmentResult {
  const { input, candidate, transitionAction, runtime } = args;
  const decisionId =
    candidate.decisionId ??
    (candidate.scenarioId
      ? findDecisionByScenarioId(runtime, candidate.scenarioId)?.decisionId
      : null) ??
    buildDeterministicDecisionId(
      candidate.scenarioId ??
        candidate.recommendationId ??
        candidate.candidateId,
    );

  const existing = runtime.getDecision(decisionId);
  let action = transitionAction;
  if (!existing && action === "create") {
    action = "create";
  } else if (!existing && action === "approve") {
    action = "approve";
  }

  const rationale = buildRationale(candidate, input.executiveContext);
  const applied = applyNexoraExecutiveDecisionTransition({
    runtime,
    session: args.session,
    decisionId,
    action,
    title: candidate.title,
    subjectIds: candidate.subjectId ? [candidate.subjectId] : [],
    scenarioId: candidate.scenarioId,
    scenarioRevision: candidate.scenarioRevision ?? undefined,
    recommendationId: candidate.recommendationId,
    rationale,
    evidenceRefs: candidate.evidenceRefs,
    uncertaintyRefs: candidate.uncertaintyRefs,
    workspaceId: input.executiveContext.currentWorkspaceId,
    modelId: input.executiveContext.currentModelId,
    candidateId: candidate.candidateId,
    committedAt: input.committedAt,
  });

  const scenarioFp = candidate.scenarioId
    ? fingerprintScenario(
        input.scenarioSession?.scenariosById[candidate.scenarioId] ?? null,
        evaluationFor(input.scenarioSession, candidate.scenarioId),
      )
    : null;
  const evidenceFp = fingerprintEvidence(candidate);

  if (applied.status === "already-committed") {
    return freezeResult({
      status: "already-committed",
      candidate,
      decision: applied.decision,
      requestedTransition: transitionAction,
      requiresConfirmation: false,
      clarificationPrompt: null,
      summary: `${candidate.title} is already the current ${applied.decision?.status ?? "committed"} decision.`,
      nextSession: applied.nextSession,
      executionDeferred: args.executionDeferred,
      reasons: [
        EXECUTIVE_DECISION_REASON.ALREADY_COMMITTED,
        EXECUTIVE_DECISION_REASON.DETERMINISTIC,
        ...args.extraReasons,
      ],
      evidenceFingerprint: evidenceFp,
      scenarioFingerprint: scenarioFp,
      trace: {
        action: input.action,
        reasons: [...applied.reasons],
      },
    });
  }

  if (applied.status === "transition-not-allowed") {
    return freezeResult({
      status: "transition-not-allowed",
      candidate,
      decision: applied.decision,
      requestedTransition: transitionAction,
      requiresConfirmation: false,
      clarificationPrompt: null,
      summary: "That decision can't be changed from its current state.",
      nextSession: applied.nextSession,
      executionDeferred: false,
      reasons: [
        EXECUTIVE_DECISION_REASON.TRANSITION_NOT_ALLOWED,
        EXECUTIVE_DECISION_REASON.DETERMINISTIC,
      ],
      evidenceFingerprint: evidenceFp,
      scenarioFingerprint: scenarioFp,
      trace: {
        action: input.action,
        reasons: [...applied.reasons],
      },
    });
  }

  if (applied.status !== "applied" || applied.decision == null) {
    return freezeResult({
      status: "failed",
      candidate,
      decision: null,
      requestedTransition: transitionAction,
      requiresConfirmation: false,
      clarificationPrompt: null,
      summary: "Decision commitment failed.",
      nextSession: args.session,
      executionDeferred: false,
      reasons: [
        EXECUTIVE_DECISION_REASON.RUNTIME_FAILED,
        EXECUTIVE_DECISION_REASON.DETERMINISTIC,
      ],
      evidenceFingerprint: evidenceFp,
      scenarioFingerprint: scenarioFp,
      trace: {
        action: input.action,
        reasons: [...applied.reasons],
      },
    });
  }

  const decision = applied.decision;
  const statusReason =
    decision.status === "Approved"
      ? EXECUTIVE_DECISION_REASON.APPROVED
      : decision.status === "Rejected"
        ? EXECUTIVE_DECISION_REASON.REJECTED
        : decision.status === "Under Review" && transitionAction === "defer"
          ? EXECUTIVE_DECISION_REASON.DEFERRED
          : decision.status === "Under Review" &&
              transitionAction === "reconsider"
            ? EXECUTIVE_DECISION_REASON.RECONSIDERED
            : EXECUTIVE_DECISION_REASON.CREATED;

  const uncertaintyNote =
    candidate.uncertaintyRefs.length > 0
      ? EXECUTIVE_DECISION_REASON.PARTIAL_UNCERTAINTY_PRESERVED
      : null;

  let summary = `${decision.title} is now the ${decision.status} decision.`;
  if (transitionAction === "create") {
    summary = `${decision.title} is now a Draft decision.`;
  } else if (transitionAction === "defer") {
    summary = `${decision.title} is deferred — remains ${decision.status}.`;
  } else if (transitionAction === "reconsider") {
    summary = `${decision.title} is back Under Review.`;
  }
  if (args.executionDeferred) {
    summary = `${summary} Execution was not started.`;
  }

  return freezeResult({
    status: "applied",
    candidate,
    decision,
    requestedTransition: transitionAction,
    requiresConfirmation: false,
    clarificationPrompt: null,
    summary,
    nextSession: applied.nextSession,
    executionDeferred: args.executionDeferred,
    reasons: Object.freeze([
      EXECUTIVE_DECISION_REASON.CANDIDATE_RESOLVED,
      EXECUTIVE_DECISION_REASON.TRANSITION_VALID,
      EXECUTIVE_DECISION_REASON.RUNTIME_APPLIED,
      statusReason,
      ...(uncertaintyNote ? [uncertaintyNote] : []),
      ...(args.executionDeferred
        ? [EXECUTIVE_DECISION_REASON.EXECUTION_DEFERRED]
        : []),
      ...args.extraReasons,
      EXECUTIVE_DECISION_REASON.DETERMINISTIC,
    ]),
    evidenceFingerprint: evidenceFp,
    scenarioFingerprint: scenarioFp,
    trace: {
      action: input.action,
      reasons: [...applied.reasons, `command:${args.commandId}`],
    },
  });
}
