/**
 * CC:6 — Resolve conversational situation → registered executive experience.
 * Read-only. Execution remains CC:4 + existing workspace authority.
 */

import type { NexoraMVPPresentationState } from "@/app/lib/nex-mvp/nexoraMVPApplicationFoundation.ts";
import type { NexoraMVPWorkspaceKind } from "@/app/lib/nex-mvp/nexoraMVPApplicationFoundation.ts";
import type { NexoraConversationalIntent } from "./conversationalIntent.ts";
import {
  CONVERSATIONAL_EXPERIENCE_CONTROL_REASON,
  type NexoraConversationalExperienceContextResolution,
  type NexoraConversationalExperienceContextTrace,
  type NexoraExecutiveExperienceContext,
} from "./conversationalExperienceContext.ts";
import {
  findRegisteredExperiencesForHint,
  getNexoraRegisteredExecutiveExperiences,
  type NexoraRegisteredExecutiveExperience,
} from "./conversationalExperienceRegistry.ts";
import { planNexoraExecutiveExperienceTransition } from "./conversationalExperienceTransition.ts";

export type NexoraConversationalExperienceContextInput = {
  readonly intent: NexoraConversationalIntent;
  readonly currentWorkspaceId: NexoraMVPWorkspaceKind | null;
  readonly currentPresentationState?: NexoraMVPPresentationState | null;
  readonly currentModelId?: string | null;
  readonly entrySubjectId?: string | null;
  readonly availableExperiences?: readonly NexoraRegisteredExecutiveExperience[];
  /** Lexical experience/situation hint (from CC:1). */
  readonly experienceHint?: string | null;
};

function freezeContext(
  context: NexoraExecutiveExperienceContext,
): NexoraExecutiveExperienceContext {
  return Object.freeze({ ...context });
}

function emptyContext(
  reason: NexoraExecutiveExperienceContext["reason"],
  confidence: number,
): NexoraExecutiveExperienceContext {
  return freezeContext({
    experienceId: null,
    workspaceId: null,
    modelId: null,
    presentationState: null,
    entrySubjectId: null,
    reason,
    confidence,
  });
}

function currentAsContext(input: NexoraConversationalExperienceContextInput): NexoraExecutiveExperienceContext {
  return freezeContext({
    experienceId: null,
    workspaceId: input.currentWorkspaceId,
    modelId: input.currentModelId ?? null,
    presentationState: input.currentPresentationState ?? null,
    entrySubjectId: input.entrySubjectId ?? null,
    reason: "current-context",
    confidence: 1,
  });
}

function intentRequestsExperience(intent: NexoraConversationalIntent): boolean {
  return (
    intent.kind === "prepare-context" || intent.kind === "switch-workspace"
  );
}

function extractExperienceHint(
  intent: NexoraConversationalIntent,
  override?: string | null,
): string | null {
  if (override && override.trim()) return override.trim();
  const experienceHint = intent.targetHints.find((h) => h.role === "experience");
  if (experienceHint) return experienceHint.raw;
  // prepare/switch: primary hint is the experience phrase
  if (intentRequestsExperience(intent) && intent.targetHints[0]) {
    return intent.targetHints[0].raw;
  }
  return null;
}

/**
 * Primary CC:6 resolver — situation/experience hint → registered context + plan.
 */
export function resolveNexoraConversationalExperienceContext(
  input: NexoraConversationalExperienceContextInput,
): NexoraConversationalExperienceContextResolution {
  const from = currentAsContext(input);
  const registry =
    input.availableExperiences ?? getNexoraRegisteredExecutiveExperiences();

  if (!intentRequestsExperience(input.intent)) {
    const reasons = Object.freeze([
      CONVERSATIONAL_EXPERIENCE_CONTROL_REASON.EXPERIENCE_NOT_REQUIRED,
      CONVERSATIONAL_EXPERIENCE_CONTROL_REASON.DETERMINISTIC,
    ]);
    const trace: NexoraConversationalExperienceContextTrace = Object.freeze({
      situationHint: null,
      candidateExperienceIds: Object.freeze([]),
      matchedExperienceId: null,
      currentWorkspaceId: input.currentWorkspaceId,
      decision: "keep-current",
      resolutionStatus: "not-required",
      reasons,
    });
    return Object.freeze({
      targetExperienceContext: from,
      resolutionStatus: "not-required",
      decision: "keep-current",
      plan: planNexoraExecutiveExperienceTransition({
        from,
        to: from,
        decision: "keep-current",
        reasons,
      }),
      reasons,
      trace,
    });
  }

  const hint = extractExperienceHint(input.intent, input.experienceHint);
  if (!hint) {
    const reasons = Object.freeze([
      CONVERSATIONAL_EXPERIENCE_CONTROL_REASON.EXPERIENCE_NOT_FOUND,
      CONVERSATIONAL_EXPERIENCE_CONTROL_REASON.DETERMINISTIC,
    ]);
    return Object.freeze({
      targetExperienceContext: emptyContext("fallback", 0.2),
      resolutionStatus: "not-found",
      decision: "unsupported",
      plan: null,
      reasons,
      trace: Object.freeze({
        situationHint: null,
        candidateExperienceIds: Object.freeze([]),
        matchedExperienceId: null,
        currentWorkspaceId: input.currentWorkspaceId,
        decision: "unsupported" as const,
        resolutionStatus: "not-found" as const,
        reasons,
      }),
    });
  }

  const matches = findRegisteredExperiencesForHint(hint, registry);
  const candidateIds = Object.freeze(matches.map((m) => m.id));

  if (matches.length === 0) {
    const reasons = Object.freeze([
      CONVERSATIONAL_EXPERIENCE_CONTROL_REASON.EXPERIENCE_NOT_FOUND,
      CONVERSATIONAL_EXPERIENCE_CONTROL_REASON.NO_SYNTHESIZED_WORKSPACE,
      CONVERSATIONAL_EXPERIENCE_CONTROL_REASON.REGISTERED_EXPERIENCE_ONLY,
      CONVERSATIONAL_EXPERIENCE_CONTROL_REASON.DETERMINISTIC,
    ]);
    return Object.freeze({
      targetExperienceContext: emptyContext("fallback", 0.2),
      resolutionStatus: "not-found",
      decision: "unsupported",
      plan: null,
      reasons,
      trace: Object.freeze({
        situationHint: hint,
        candidateExperienceIds: candidateIds,
        matchedExperienceId: null,
        currentWorkspaceId: input.currentWorkspaceId,
        decision: "unsupported" as const,
        resolutionStatus: "not-found" as const,
        reasons,
      }),
    });
  }

  if (matches.length > 1) {
    const reasons = Object.freeze([
      CONVERSATIONAL_EXPERIENCE_CONTROL_REASON.MULTIPLE_EXPERIENCE_MATCHES,
      CONVERSATIONAL_EXPERIENCE_CONTROL_REASON.NO_SYNTHESIZED_WORKSPACE,
      CONVERSATIONAL_EXPERIENCE_CONTROL_REASON.DETERMINISTIC,
    ]);
    return Object.freeze({
      targetExperienceContext: emptyContext("fallback", 0.35),
      resolutionStatus: "ambiguous",
      decision: "clarification-required",
      plan: null,
      reasons,
      trace: Object.freeze({
        situationHint: hint,
        candidateExperienceIds: candidateIds,
        matchedExperienceId: null,
        currentWorkspaceId: input.currentWorkspaceId,
        decision: "clarification-required" as const,
        resolutionStatus: "ambiguous" as const,
        reasons,
      }),
    });
  }

  const matched = matches[0]!;
  const reason =
    input.intent.kind === "switch-workspace"
      ? ("explicit-request" as const)
      : ("meeting-context" as const);
  const matchCode =
    input.intent.kind === "switch-workspace"
      ? CONVERSATIONAL_EXPERIENCE_CONTROL_REASON.EXPLICIT_EXPERIENCE_MATCH
      : CONVERSATIONAL_EXPERIENCE_CONTROL_REASON.IMPLICIT_SITUATION_MATCH;

  const to = freezeContext({
    experienceId: matched.id,
    workspaceId: matched.workspaceId,
    modelId: input.currentModelId ?? null,
    presentationState: matched.presentationState,
    entrySubjectId: input.entrySubjectId ?? matched.defaultSubjectId,
    reason,
    confidence: 0.92,
  });

  const workspaceAlready =
    input.currentWorkspaceId != null &&
    input.currentWorkspaceId === matched.workspaceId;

  if (workspaceAlready) {
    const reasons = Object.freeze([
      matchCode,
      CONVERSATIONAL_EXPERIENCE_CONTROL_REASON.CURRENT_EXPERIENCE_SATISFIES,
      CONVERSATIONAL_EXPERIENCE_CONTROL_REASON.REGISTERED_EXPERIENCE_ONLY,
      CONVERSATIONAL_EXPERIENCE_CONTROL_REASON.DETERMINISTIC,
    ]);
    return Object.freeze({
      targetExperienceContext: to,
      resolutionStatus: "keep-current",
      decision: "keep-current",
      plan: planNexoraExecutiveExperienceTransition({
        from,
        to: freezeContext({ ...to, reason: "current-context" }),
        decision: "keep-current",
        reasons,
      }),
      reasons,
      trace: Object.freeze({
        situationHint: hint,
        candidateExperienceIds: candidateIds,
        matchedExperienceId: matched.id,
        currentWorkspaceId: input.currentWorkspaceId,
        decision: "keep-current" as const,
        resolutionStatus: "keep-current" as const,
        reasons,
      }),
    });
  }

  const reasons = Object.freeze([
    matchCode,
    CONVERSATIONAL_EXPERIENCE_CONTROL_REASON.EXPERIENCE_TRANSITION_REQUIRED,
    CONVERSATIONAL_EXPERIENCE_CONTROL_REASON.REGISTERED_EXPERIENCE_ONLY,
    CONVERSATIONAL_EXPERIENCE_CONTROL_REASON.NO_SYNTHESIZED_WORKSPACE,
    CONVERSATIONAL_EXPERIENCE_CONTROL_REASON.DETERMINISTIC,
  ]);

  return Object.freeze({
    targetExperienceContext: to,
    resolutionStatus: "resolved",
    decision: "transition",
    plan: planNexoraExecutiveExperienceTransition({
      from,
      to,
      decision: "transition",
      reasons,
    }),
    reasons,
    trace: Object.freeze({
      situationHint: hint,
      candidateExperienceIds: candidateIds,
      matchedExperienceId: matched.id,
      currentWorkspaceId: input.currentWorkspaceId,
      decision: "transition" as const,
      resolutionStatus: "resolved" as const,
      reasons,
    }),
  });
}
