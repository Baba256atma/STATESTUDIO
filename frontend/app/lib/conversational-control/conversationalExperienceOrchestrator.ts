/**
 * CC:5 — Thin conversational experience orchestrator.
 *
 * Certified order:
 *   CC:1 Intent → CC:2 Subject (← CC:7 projection) → CC:6 Experience →
 *   CC:3 Command → CC:4 Runtime → CC:7 Context Update → CC:5 feedback
 *
 * Not a new Runtime authority. Production Runtime entry: applyNexoraMVPConversationalCommand.
 */

import { resolveNexoraConversationalIntent } from "./conversationalIntentResolver.ts";
import { resolveNexoraExecutiveConversationalContext } from "./conversationalContextResolver.ts";
import { mapNexoraConversationalCommand } from "./conversationalCommandMapper.ts";
import { resolveNexoraConversationalExperienceContext } from "./conversationalExperienceContextResolver.ts";
import { buildNexoraConversationalExperienceResponse } from "./conversationalExperienceResponse.ts";
import {
  type NexoraConversationalExperienceResult,
  type NexoraConversationalExperienceStatus,
  type NexoraConversationalAdvisorGrounding,
  type NexoraConversationalMessage,
  type NexoraConversationalExperienceTrace,
} from "./conversationalExperience.ts";
import type {
  NexoraActiveStageContextSnapshot,
  NexoraConversationContextSnapshot,
  NexoraConversationalSubjectKind,
  NexoraConversationalSubjectRecord,
} from "./conversationalContext.ts";
import type { NexoraMVPObjectInteractionState } from "@/app/lib/nex-mvp/nexoraMVPObjectInteraction.ts";
import type { NexoraMVPObjectInteractionCatalog } from "@/app/lib/nex-mvp/nexoraMVPObjectInteraction.ts";
import type { NexoraMVPWorkspaceKind } from "@/app/lib/nex-mvp/nexoraMVPApplicationFoundation.ts";
import { isNexoraMVPWorkspaceKind } from "@/app/lib/nex-mvp/nexoraMVPApplicationFoundation.ts";
import { applyNexoraMVPConversationalCommand } from "@/app/lib/nex-mvp/nexoraMVPConversationalRuntimeBridge.ts";
import type { NexoraConversationalExperienceContextResolution } from "./conversationalExperienceContext.ts";
import type { NexoraRegisteredExecutiveExperience } from "./conversationalExperienceRegistry.ts";
import {
  createEmptyNexoraExecutiveContextSnapshot,
  freezeExecutiveContextReference,
  freezeExecutiveContextSnapshot,
  type NexoraExecutiveContextSnapshot,
  type NexoraExecutiveContextUpdateResult,
} from "./executiveContextSnapshot.ts";
import { updateNexoraExecutiveContext } from "./executiveContextUpdater.ts";
import { toNexoraConversationContextSnapshot } from "./executiveContextProjection.ts";
import {
  buildPresentedSetFromCatalogLinks,
  buildPresentedSetFromCollectionState,
} from "@/app/lib/nex-mvp/nexoraMVPExecutiveContextAwareness.ts";
import { projectNexoraMVPExecutiveRecommendationEvidence } from "@/app/lib/nex-mvp/nexoraMVPExecutiveRecommendation.ts";
import { resolveNexoraExecutiveRecommendation } from "./executiveRecommendationResolver.ts";
import type { NexoraExecutiveRecommendationResult } from "./executiveRecommendation.ts";
import type { NexoraExecutiveEvidenceFact } from "./executiveRecommendation.ts";
import { getDefaultNexoraMVPObjectInteractionCatalog } from "@/app/lib/nex-mvp/nexoraMVPObjectInteraction.ts";
import {
  createEmptyNexoraExecutiveScenarioSession,
  resolveNexoraExecutiveScenarioConversation,
  type NexoraExecutiveScenarioConversationResult,
  type NexoraExecutiveScenarioSession,
} from "./executiveScenarioResolver.ts";
import {
  projectNexoraMVPExecutiveScenarioBaseline,
  relatedSubjectIdsForPrimary,
} from "@/app/lib/nex-mvp/nexoraMVPExecutiveScenarioConversation.ts";
import type { NexoraScenarioIntervention } from "./executiveScenarioDefinition.ts";
import type { NexoraScenarioAssumption } from "./executiveScenarioDefinition.ts";
import {
  resolveNexoraExecutiveDecisionCommitment,
  type NexoraDecisionCommitmentResult,
} from "./executiveDecisionCommitmentResolver.ts";
import {
  createEmptyNexoraExecutiveDecisionSession,
  setPendingDecisionConfirmation,
  type NexoraExecutiveDecisionSession,
} from "./executiveDecisionAuthority.ts";
import type { NexoraDecisionRuntimeAdapter } from "./executiveDecisionRuntimeAdapter.ts";
import { createNexoraCanonicalDecisionRuntime } from "./executiveDecisionRuntimeAdapter.ts";
import {
  createNexoraPendingTurnExpectation,
  resolveBareNexoraSubjectReference,
  resolveNexoraPendingTurnAnswer,
  type NexoraPendingTurnExpectation,
  type NexoraPendingTurnResolution,
} from "./conversationalTurnExpectation.ts";
import {
  resolveNexoraConversationalActionInvocation,
} from "./conversationalActionDescriptor.ts";


export type NexoraConversationalExperienceInput = {
  readonly utterance: string;
  /** Legacy/compat projection. Prefer executiveContext (CC:7). */
  readonly conversationContext?: NexoraConversationContextSnapshot;
  /** CC:7 structured executive context. */
  readonly executiveContext?: NexoraExecutiveContextSnapshot | null;
  readonly activeStageContext?: NexoraActiveStageContextSnapshot | null;
  readonly allowActiveStageContext?: boolean;
  readonly executiveSubjects: readonly NexoraConversationalSubjectRecord[];
  readonly runtimeState: NexoraMVPObjectInteractionState;
  readonly catalog?: NexoraMVPObjectInteractionCatalog;
  readonly lastAppliedCommandId?: string | null;
  readonly availableExperiences?: readonly NexoraRegisteredExecutiveExperience[];
  /** Deterministic message id seed (tests). */
  readonly messageIdSeed?: string;
  /** CC:9 session-only scenario drafts. */
  readonly scenarioSession?: import("./executiveScenarioResolver.ts").NexoraExecutiveScenarioSession | null;
  /** CC:10 session metadata (pending confirmation + provenance). */
  readonly decisionSession?: NexoraExecutiveDecisionSession | null;
  /** CC:10R canonical Decision Runtime adapter (product truth). */
  readonly decisionRuntime?: NexoraDecisionRuntimeAdapter | null;
  /** Deterministic clock for Decision committedAt (tests/Runtime). */
  readonly decisionCommittedAt?: string;
  /** Read-only projection of the existing UX:3 Advisor narrative. */
  readonly advisorGrounding?: NexoraConversationalAdvisorGrounding | null;
  /** UX:4-FIX2 short-lived dialogue expectation. */
  readonly pendingTurnExpectation?: NexoraPendingTurnExpectation | null;
};

function freezeMessage(
  message: NexoraConversationalMessage,
): NexoraConversationalMessage {
  return Object.freeze({ ...message });
}

function deriveMessageIds(seed: string | undefined): {
  readonly managerId: string;
  readonly nexoraId: string;
} {
  const base = seed ?? `cc5-${Date.now()}`;
  return Object.freeze({
    managerId: `${base}-manager`,
    nexoraId: `${base}-nexora`,
  });
}

function asWorkspaceKind(
  value: string | null | undefined,
): NexoraMVPWorkspaceKind | null {
  if (value && isNexoraMVPWorkspaceKind(value)) return value;
  return null;
}

function isRecommendationCommandKind(kind: string | null | undefined): boolean {
  return (
    kind === "request-recommendation" ||
    kind === "request-explanation" ||
    kind === "request-prioritization"
  );
}

function isScenarioCommandKind(kind: string | null | undefined): boolean {
  return (
    kind === "define-scenario" ||
    kind === "modify-scenario" ||
    kind === "evaluate-scenario" ||
    kind === "compare-scenarios" ||
    kind === "explain-scenario" ||
    kind === "open-scenario" ||
    kind === "defer-decision-commitment"
  );
}

function isDecisionCommitmentCommandKind(
  kind: string | null | undefined,
): boolean {
  return (
    kind === "commit-decision" ||
    kind === "approve-decision" ||
    kind === "reject-decision" ||
    kind === "defer-decision" ||
    kind === "reconsider-decision" ||
    kind === "confirm-decision-commitment" ||
    kind === "cancel-decision-commitment" ||
    kind === "prefer-option"
  );
}

function unmodeledSubjectId(raw: string | null | undefined): string {
  const slug = (raw ?? "unknown")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  return `unmodeled:${slug || "unknown"}`;
}

function withUnknownImpactIfNeeded(
  facts: readonly NexoraExecutiveEvidenceFact[],
  utterance: string,
  primarySubjectId: string | null,
): readonly NexoraExecutiveEvidenceFact[] {
  if (!primarySubjectId) return facts;
  if (!/^should\s+we\s+(?:increase|expand|change|address)\b/i.test(utterance.trim())) {
    return facts;
  }
  const existing = facts.find((f) => f.subjectId === primarySubjectId);
  const injected: NexoraExecutiveEvidenceFact = Object.freeze({
    evidenceId: `fact:${primarySubjectId}:unknown-impact`,
    subjectId: primarySubjectId,
    subjectLabel: existing?.subjectLabel,
    attention: existing?.attention,
    status: existing?.status ?? "unresolved",
    factKey: "unknown-impact",
    factValue: true,
    freshness: existing?.freshness ?? "unknown",
    source: Object.freeze({
      sourceKind: "runtime" as const,
      sourceId: primarySubjectId,
      subjectId: primarySubjectId,
      factKey: "unknown-impact",
    }),
  });
  return Object.freeze([...facts, injected]);
}

function resolveRecommendationForTurn(input: {
  readonly utterance: string;
  readonly intentKind: string;
  readonly primarySubjectId: string | null;
  readonly executiveContext: NexoraExecutiveContextSnapshot;
  readonly catalog?: NexoraMVPObjectInteractionCatalog;
}): NexoraExecutiveRecommendationResult {
  const catalog =
    input.catalog ?? getDefaultNexoraMVPObjectInteractionCatalog();
  const primarySubjectId =
    input.primarySubjectId ??
    input.executiveContext.currentSubject?.subjectId ??
    input.executiveContext.currentDecision?.subjectId ??
    input.executiveContext.currentProblem?.subjectId ??
    input.executiveContext.currentGoal?.subjectId ??
    input.executiveContext.currentScenario?.subjectId ??
    input.executiveContext.currentExecution?.subjectId ??
    null;
  const projected = projectNexoraMVPExecutiveRecommendationEvidence({
    catalog,
    executiveContext: input.executiveContext,
    primarySubjectId,
  });
  const facts = withUnknownImpactIfNeeded(
    projected.facts,
    input.utterance,
    primarySubjectId,
  );
  const requestKind =
    input.intentKind === "explain" ||
    input.intentKind === "situation" ||
    input.intentKind === "evidence" ||
    input.intentKind === "change" ||
    input.intentKind === "risk" ||
    input.intentKind === "decision-status" ||
    input.intentKind === "execution-status"
      ? ("explain" as const)
      : input.intentKind === "prioritize"
        ? ("prioritize" as const)
        : ("recommend" as const);
  return resolveNexoraExecutiveRecommendation({
    executiveContext: input.executiveContext,
    primarySubjectId,
    evidence: Object.freeze({
      ...projected,
      facts,
    }),
    requestKind,
  });
}

function resolveScenarioForTurn(input: {
  readonly intent: import("./conversationalIntent.ts").NexoraConversationalIntent;
  readonly primarySubjectId: string | null;
  readonly executiveContext: NexoraExecutiveContextSnapshot;
  readonly catalog?: NexoraMVPObjectInteractionCatalog;
  readonly scenarioSession?: NexoraExecutiveScenarioSession | null;
}): NexoraExecutiveScenarioConversationResult {
  const catalog =
    input.catalog ?? getDefaultNexoraMVPObjectInteractionCatalog();
  const baseline = projectNexoraMVPExecutiveScenarioBaseline({
    catalog,
    executiveContext: input.executiveContext,
  });
  const payload = input.intent.scenarioPayload ?? null;
  const hintRaw =
    input.intent.targetHints.find((h) => h.role === "primary")?.raw ?? null;
  const session =
    input.scenarioSession ??
    createEmptyNexoraExecutiveScenarioSession({
      baselineAttentionBySubject: baseline.attentionBySubject,
    });
  const active = session.activeScenarioId
    ? session.scenariosById[session.activeScenarioId] ?? null
    : null;
  const activeInterventionSubject =
    active?.interventions[0]?.subjectId ??
    active?.subjectIds.find((id) => !id.startsWith("cc9:")) ??
    null;

  const primarySubjectId =
    input.primarySubjectId ??
    (input.executiveContext.currentSubject?.subjectId?.startsWith("cc9:")
      ? null
      : input.executiveContext.currentSubject?.subjectId) ??
    activeInterventionSubject ??
    (hintRaw ? unmodeledSubjectId(hintRaw) : null);

  const interventionSubjectId = primarySubjectId;
  let interventions: readonly NexoraScenarioIntervention[] | undefined;
  let assumptions: readonly NexoraScenarioAssumption[] | undefined;

  if (
    payload?.operation === "intervention" ||
    payload?.operation === "modify"
  ) {
    if (interventionSubjectId && payload.actionKind) {
      interventions = Object.freeze([
        Object.freeze({
          subjectId: interventionSubjectId,
          actionKind: payload.actionKind,
          value: payload.value,
          unit: payload.unit,
        }),
      ]);
    } else if (interventionSubjectId) {
      interventions = Object.freeze([
        Object.freeze({
          subjectId: interventionSubjectId,
          actionKind: "unsupported",
        }),
      ]);
    }
  }

  if (payload?.operation === "add-assumption") {
    const assumptionSubject =
      input.primarySubjectId ??
      (payload.assumptionSubjectRaw
        ? // Prefer resolved id when present; else unmodeled.
          unmodeledSubjectId(payload.assumptionSubjectRaw)
        : null);
    if (assumptionSubject && payload.actionKind) {
      assumptions = Object.freeze([
        Object.freeze({
          key: `assume:${assumptionSubject}:${payload.actionKind}:${payload.value ?? ""}`,
          subjectId: assumptionSubject,
          operator: payload.actionKind,
          value: payload.value,
          unit: payload.unit,
        }),
      ]);
    }
  }

  const operation =
    payload?.operation === "commitment-attempt"
      ? ("commitment-attempt" as const)
      : payload?.operation === "compare"
        ? ("compare" as const)
        : payload?.operation === "downside"
          ? ("downside" as const)
          : payload?.operation === "explain-preference"
            ? ("explain" as const)
            : payload?.operation === "open-ordinal"
              ? ("open-candidate" as const)
              : payload?.operation === "modify"
                ? ("modify" as const)
                : payload?.operation === "add-assumption"
                  ? ("add-assumption" as const)
                  : payload?.operation === "do-nothing"
                    ? ("define-do-nothing" as const)
                    : ("define-intervention" as const);

  const horizon =
    payload?.horizonAmount != null && payload.horizonUnit
      ? Object.freeze({
          amount: payload.horizonAmount,
          unit: payload.horizonUnit,
        })
      : null;

  return resolveNexoraExecutiveScenarioConversation({
    executiveContext: input.executiveContext,
    operation,
    primarySubjectId,
    interventions,
    assumptions,
    horizon,
    requireHorizon: operation === "define-do-nothing",
    candidateOrdinal: payload?.ordinal ?? null,
    session,
    baselineAttentionBySubject: baseline.attentionBySubject,
    relatedSubjectIds: relatedSubjectIdsForPrimary({
      catalog,
      primarySubjectId,
    }),
    recommendationId: input.executiveContext.lastRecommendationId,
  });
}

function resolveDecisionCommitmentForTurn(input: {
  readonly intent: import("./conversationalIntent.ts").NexoraConversationalIntent;
  readonly primarySubjectId: string | null;
  readonly executiveContext: NexoraExecutiveContextSnapshot;
  readonly scenarioSession?: NexoraExecutiveScenarioSession | null;
  readonly decisionSession?: NexoraExecutiveDecisionSession | null;
  readonly decisionRuntime?: NexoraDecisionRuntimeAdapter | null;
  readonly commandId?: string;
  readonly utterance: string;
  readonly committedAt?: string;
}): NexoraDecisionCommitmentResult {
  const payload = input.intent.decisionCommitmentPayload;
  const action =
    payload?.action ??
    (input.intent.kind === "prefer-option"
      ? ("preference" as const)
      : input.intent.kind === "reject-decision"
        ? ("reject" as const)
        : input.intent.kind === "defer-decision"
          ? ("defer" as const)
          : input.intent.kind === "reconsider-decision"
            ? ("reconsider" as const)
            : input.intent.kind === "confirm-decision-commitment"
              ? ("confirm" as const)
              : input.intent.kind === "cancel-decision-commitment"
                ? ("cancel" as const)
                : ("approve" as const));
  const strength =
    payload?.strength ??
    (action === "preference" ? ("preference" as const) : ("explicit" as const));
  const hintRaw =
    input.intent.targetHints.find((h) => h.role === "primary")?.raw ?? null;

  return resolveNexoraExecutiveDecisionCommitment({
    action,
    strength,
    executiveContext: input.executiveContext,
    decisionSession:
      input.decisionSession ?? createEmptyNexoraExecutiveDecisionSession(),
    decisionRuntime:
      input.decisionRuntime ??
      createNexoraCanonicalDecisionRuntime().adapter,
    scenarioSession: input.scenarioSession ?? null,
    targetHintRaw: hintRaw,
    primarySubjectId: input.primarySubjectId,
    commandId: input.commandId,
    utterance: input.utterance,
    hasCompoundExecutionRequest: payload?.hasCompoundExecutionRequest === true,
    committedAt: input.committedAt,
  });
}

function bootstrapExecutiveContext(input: {
  readonly executiveContext?: NexoraExecutiveContextSnapshot | null;
  readonly conversationContext?: NexoraConversationContextSnapshot | null;
  readonly runtimeState: NexoraMVPObjectInteractionState;
  readonly executiveSubjects: readonly NexoraConversationalSubjectRecord[];
}): NexoraExecutiveContextSnapshot {
  if (input.executiveContext) return input.executiveContext;

  const legacy: NexoraConversationContextSnapshot =
    input.conversationContext ?? Object.freeze({});
  const currentId = legacy.currentSubjectId ?? null;
  const record = currentId
    ? input.executiveSubjects.find((s) => s.subjectId === currentId) ?? null
    : null;

  const previousSubjects = Object.freeze(
    (legacy.previousSubjectIds ?? [])
      .map((id) => {
        const r = input.executiveSubjects.find((s) => s.subjectId === id);
        if (!r) return null;
        return freezeExecutiveContextReference({
          subjectId: r.subjectId,
          subjectKind: r.subjectKind,
          canonicalName: r.canonicalName,
          source: "conversation",
          turnIndex: 0,
        });
      })
      .filter((x): x is NonNullable<typeof x> => x != null),
  );

  const presentedIds = legacy.presentedSubjectIds ?? [];
  return createEmptyNexoraExecutiveContextSnapshot({
    currentSubject: record
      ? freezeExecutiveContextReference({
          subjectId: record.subjectId,
          subjectKind: record.subjectKind,
          canonicalName: record.canonicalName,
          source: "conversation",
          turnIndex: 0,
        })
      : null,
    previousSubjects,
    currentWorkspaceId:
      legacy.currentWorkspaceId ?? input.runtimeState.workspace ?? null,
    currentModelId: legacy.currentModelId ?? null,
    presentedSet:
      presentedIds.length > 0
        ? Object.freeze({
            kind: (legacy.presentedSetKind as "problems") ?? "subjects",
            subjectIds: Object.freeze([...presentedIds]),
            anchorSubjectId: legacy.presentedAnchorSubjectId ?? null,
            turnIndex: 0,
          })
        : null,
    turnIndex: 0,
  });
}

function focusedKind(
  state: NexoraMVPObjectInteractionState,
): NexoraConversationalSubjectKind | null {
  const kind = state.focusedSubject?.kind;
  if (
    kind === "object" ||
    kind === "problem" ||
    kind === "scenario" ||
    kind === "decision" ||
    kind === "execution" ||
    kind === "goal"
  ) {
    return kind;
  }
  return kind ? "unknown" : null;
}

function mapExperienceStatus(input: {
  readonly contextStatus: string;
  readonly experienceDecision?: string | null;
  readonly experienceStatus?: string | null;
  readonly commandStatus: string | null;
  readonly runtimeStatus: string | null;
  readonly intentKind: string;
}): NexoraConversationalExperienceStatus {
  if (input.intentKind === "unknown") return "unsupported";

  if (input.experienceDecision === "clarification-required") {
    return "clarification-required";
  }
  if (
    input.experienceDecision === "unsupported" ||
    input.experienceStatus === "not-found" ||
    input.experienceStatus === "unsupported"
  ) {
    return "not-found";
  }
  if (
    input.experienceStatus === "keep-current" &&
    input.runtimeStatus == null &&
    input.commandStatus == null
  ) {
    return "no-op";
  }

  if (input.contextStatus === "missing-context") return "clarification-required";
  if (input.contextStatus === "ambiguous") return "clarification-required";
  if (input.contextStatus === "not-found") return "not-found";

  if (input.commandStatus === "unsupported-intent") return "unsupported";
  if (input.commandStatus === "missing-target") return "clarification-required";
  if (input.commandStatus === "ambiguous-context") return "clarification-required";
  if (input.commandStatus === "invalid-context") return "not-found";
  if (input.commandStatus === "confirmation-required") {
    return "confirmation-required";
  }

  if (input.runtimeStatus === "unsupported") return "unsupported";
  if (input.runtimeStatus === "confirmation-required") {
    return "confirmation-required";
  }
  if (input.runtimeStatus === "no-op") return "no-op";
  if (input.runtimeStatus === "rejected") return "failed";
  if (input.runtimeStatus === "applied") return "applied";

  if (input.commandStatus === "mapped" && input.runtimeStatus == null) {
    return "failed";
  }

  return "failed";
}

function resolveIntentForTurn(
  managerUtterance: string,
  semanticUtterance: string,
): NexoraConversationalExperienceResult["intentResult"] {
  const resolved = resolveNexoraConversationalIntent({
    utterance: semanticUtterance,
  });
  if (managerUtterance === semanticUtterance) return resolved;
  return Object.freeze({
    intent: Object.freeze({
      ...resolved.intent,
      utterance: managerUtterance,
    }),
    trace: Object.freeze({
      ...resolved.trace,
      utterance: managerUtterance,
    }),
  });
}

function withoutInterruptionSuffix(utterance: string): string {
  return utterance.replace(/\s+instead[.!?]*\s*$/i, "").trim();
}

function pendingClarification(
  expectation: NexoraPendingTurnExpectation,
): string {
  if (expectation.expectedAnswerKind === "scenario-selection") {
    return "Which scenario do you mean?";
  }
  if (expectation.expectedAnswerKind === "subject-selection") {
    return "Which subject do you mean?";
  }
  if (expectation.questionKind === "decision-commitment") {
    return "Which option do you want to commit to?";
  }
  return "Could you clarify what you want to review?";
}

function declinedPendingResponse(
  expectation: NexoraPendingTurnExpectation,
): string {
  if (expectation.questionKind === "review-subject") {
    return "Understood. We can stay with the current executive context.";
  }
  if (expectation.questionKind === "show-evidence") {
    return "Understood. I’ll keep the current evidence details closed.";
  }
  if (expectation.questionKind === "compare-scenarios") {
    return "Understood. I won’t open the scenario comparison.";
  }
  return "Understood.";
}

/**
 * Primary CC:5 API — execute one executive utterance through CC:1–7–4.
 */
export function executeNexoraConversationalExperience(
  input: NexoraConversationalExperienceInput,
): NexoraConversationalExperienceResult & {
  readonly nextRuntimeState: NexoraMVPObjectInteractionState;
} {
  const utterance = typeof input.utterance === "string" ? input.utterance : "";
  const ids = deriveMessageIds(input.messageIdSeed);
  const bootstrappedExecutiveContext = bootstrapExecutiveContext({
    executiveContext: input.executiveContext,
    conversationContext: input.conversationContext,
    runtimeState: input.runtimeState,
    executiveSubjects: input.executiveSubjects,
  });
  const previousExecutiveContext = freezeExecutiveContextSnapshot({
    ...bootstrappedExecutiveContext,
    currentRecommendedAction:
      input.advisorGrounding?.primaryAction ??
      bootstrappedExecutiveContext.currentRecommendedAction,
  });
  const previousContext = toNexoraConversationContextSnapshot(
    previousExecutiveContext,
  );

  try {
    // UX:4-FIX2 — explicit intent first, then a structured pending-turn answer,
    // then a unique registered entity reference. Rendered Nexora copy is never parsed.
    const subjectNameById = Object.freeze(
      Object.fromEntries(
        input.executiveSubjects.map((subject) => [
          subject.subjectId,
          subject.canonicalName,
        ]),
      ),
    );
    const subjectKindById = Object.freeze(
      Object.fromEntries(
        input.executiveSubjects.map((subject) => [
          subject.subjectId,
          subject.subjectKind,
        ]),
      ),
    );
    const actionInvocation = resolveNexoraConversationalActionInvocation({
      utterance,
      primaryAction:
        input.advisorGrounding?.primaryAction ??
        previousExecutiveContext.currentRecommendedAction,
      availableActions:
        input.advisorGrounding?.availableActions ??
        (previousExecutiveContext.currentRecommendedAction
          ? [previousExecutiveContext.currentRecommendedAction]
          : []),
      subjectNameById,
      subjectKindById,
    });
    const explicitUtterance =
      actionInvocation.semanticUtterance ??
      withoutInterruptionSuffix(utterance);
    const initialIntentResult = resolveNexoraConversationalIntent({
      utterance: explicitUtterance,
    });
    const decisionExpectation =
      input.decisionSession?.pendingConfirmation &&
      input.decisionSession.pendingConfirmation.status === "pending"
        ? createNexoraPendingTurnExpectation({
            expectationId:
              input.decisionSession.pendingConfirmation.confirmationId,
            questionKind: "decision-commitment",
            expectedAnswerKind: "decision-option",
            subjectId: previousContext.currentSubjectId ?? null,
            optionIds: [
              input.decisionSession.pendingConfirmation.candidateId,
            ],
            sourceCapability: "CC:10",
            consequential: true,
            confirmationLevel: "consequential",
          })
        : null;
    const activeExpectation =
      input.pendingTurnExpectation ??
      previousExecutiveContext.pendingTurnExpectation ??
      decisionExpectation;
    const pendingTurnResolution = resolveNexoraPendingTurnAnswer({
      utterance,
      initialIntentKind: initialIntentResult.intent.kind,
      expectation: activeExpectation,
      subjects: input.executiveSubjects,
    });
    const bareSubject =
      pendingTurnResolution?.semanticUtterance == null &&
      initialIntentResult.intent.kind === "unknown"
        ? resolveBareNexoraSubjectReference({
            utterance,
            subjects: input.executiveSubjects,
          })
        : null;
    const semanticUtterance =
      pendingTurnResolution?.semanticUtterance ??
      (bareSubject?.status === "resolved" && bareSubject.subject
        ? `Focus on ${bareSubject.subject.canonicalName}`
        : explicitUtterance);
    // CC:1
    const intentResult = resolveIntentForTurn(utterance, semanticUtterance);
    const intent = intentResult.intent;

    // CC:2 — subject context from CC:7 projection
    const contextResult = resolveNexoraExecutiveConversationalContext({
      intent,
      targetHints: intent.targetHints,
      conversationContext: previousContext,
      activeStageContext: input.activeStageContext ?? null,
      allowActiveStageContext: input.allowActiveStageContext === true,
      executiveSubjects: input.executiveSubjects,
    });
    const context = contextResult.context;

    if (
      actionInvocation.matchedUtterance &&
      actionInvocation.status !== "resolved"
    ) {
      const status = "clarification-required" as const;
      return finalize({
        status,
        response:
          actionInvocation.status === "ambiguous"
            ? "Which recommended action do you want to review?"
            : "Which item do you mean?",
        intentResult,
        contextResult,
        experienceResult: null,
        commandResult: null,
        runtimeResult: null,
        previousExecutiveContext,
        nextRuntimeState: input.runtimeState,
        shouldCommitRuntime: false,
        pendingTurnResolution,
        nextPendingTurnExpectation: null,
        ids,
        utterance,
        catalog: input.catalog,
        executiveSubjects: input.executiveSubjects,
      });
    }

    if (
      pendingTurnResolution?.status === "declined" &&
      pendingTurnResolution.expectation.questionKind !== "decision-commitment"
    ) {
      const status = "applied" as const;
      return finalize({
        status,
        response: declinedPendingResponse(pendingTurnResolution.expectation),
        intentResult,
        contextResult,
        experienceResult: null,
        commandResult: null,
        runtimeResult: null,
        previousExecutiveContext,
        nextRuntimeState: input.runtimeState,
        shouldCommitRuntime: false,
        trustedAdvisorySuccess: true,
        pendingTurnResolution,
        nextPendingTurnExpectation: null,
        nextDecisionSession: input.decisionSession?.pendingConfirmation
          ? setPendingDecisionConfirmation(input.decisionSession, null)
          : null,
        ids,
        utterance,
        catalog: input.catalog,
        executiveSubjects: input.executiveSubjects,
      });
    }

    if (pendingTurnResolution?.status === "clarification-required") {
      const status = "clarification-required" as const;
      return finalize({
        status,
        response: pendingClarification(pendingTurnResolution.expectation),
        intentResult,
        contextResult,
        experienceResult: null,
        commandResult: null,
        runtimeResult: null,
        previousExecutiveContext,
        nextRuntimeState: input.runtimeState,
        shouldCommitRuntime: false,
        pendingTurnResolution,
        nextPendingTurnExpectation: pendingTurnResolution.expectation,
        ids,
        utterance,
        catalog: input.catalog,
        executiveSubjects: input.executiveSubjects,
      });
    }

    if (
      pendingTurnResolution?.status === "answered" &&
      pendingTurnResolution.expectation.questionKind === "review-subject" &&
      pendingTurnResolution.subjectId != null &&
      input.runtimeState.focusedSubject?.id === pendingTurnResolution.subjectId
    ) {
      const recommendationResult = resolveRecommendationForTurn({
        utterance,
        intentKind: "explain",
        primarySubjectId: pendingTurnResolution.subjectId,
        executiveContext: previousExecutiveContext,
        catalog: input.catalog,
      });
      const status = "applied" as const;
      const response = buildNexoraConversationalExperienceResponse({
        status,
        intent,
        context,
        command: null,
        runtime: null,
        utterance,
        experienceResolution: null,
        recommendationResult,
        advisorGrounding: input.advisorGrounding ?? null,
        pendingTurnResolution,
      });
      return finalize({
        status,
        response,
        intentResult,
        contextResult,
        experienceResult: null,
        commandResult: null,
        runtimeResult: null,
        recommendationResult,
        previousExecutiveContext,
        nextRuntimeState: input.runtimeState,
        shouldCommitRuntime: false,
        trustedAdvisorySuccess: true,
        pendingTurnResolution,
        nextPendingTurnExpectation: null,
        ids,
        utterance,
        catalog: input.catalog,
        executiveSubjects: input.executiveSubjects,
      });
    }

    if (
      bareSubject?.status === "resolved" &&
      bareSubject.subject &&
      input.runtimeState.focusedSubject?.id === bareSubject.subject.subjectId
    ) {
      const status = "no-op" as const;
      return finalize({
        status,
        response: `${bareSubject.subject.canonicalName} is already the current subject. You can ask me to explain the situation, show the evidence, or review the recommendation.`,
        intentResult,
        contextResult,
        experienceResult: null,
        commandResult: null,
        runtimeResult: null,
        previousExecutiveContext,
        nextRuntimeState: input.runtimeState,
        shouldCommitRuntime: false,
        trustedAdvisorySuccess: true,
        pendingTurnResolution,
        nextPendingTurnExpectation: null,
        ids,
        utterance,
        catalog: input.catalog,
        executiveSubjects: input.executiveSubjects,
      });
    }

    // Early exit when subject context blocks (including compound prepare+focus)
    if (
      context.resolutionStatus === "missing-context" ||
      context.resolutionStatus === "ambiguous" ||
      context.resolutionStatus === "not-found"
    ) {
      const status = mapExperienceStatus({
        contextStatus: context.resolutionStatus,
        commandStatus: null,
        runtimeStatus: null,
        intentKind: intent.kind,
      });
      const response = buildNexoraConversationalExperienceResponse({
        status,
        intent,
        context,
        command: null,
        runtime: null,
        utterance,
        experienceResolution: null,
      });
      return finalize({
        status,
        response,
        intentResult,
        contextResult,
        experienceResult: null,
        commandResult: null,
        runtimeResult: null,
        previousExecutiveContext,
        nextRuntimeState: input.runtimeState,
        shouldCommitRuntime: false,
        pendingTurnResolution,
        ...(pendingTurnResolution?.status === "interrupted" &&
        input.decisionSession?.pendingConfirmation
          ? {
              nextDecisionSession: setPendingDecisionConfirmation(
                input.decisionSession,
                null,
              ),
            }
          : {}),
        ids,
        utterance,
        catalog: input.catalog,
        executiveSubjects: input.executiveSubjects,
      });
    }

    // CC:6 — executive experience / workspace resolution (read-only)
    const currentWorkspaceId =
      asWorkspaceKind(input.runtimeState.workspace) ??
      asWorkspaceKind(previousContext.currentWorkspaceId);

    const experienceResult = resolveNexoraConversationalExperienceContext({
      intent,
      currentWorkspaceId,
      currentPresentationState: input.runtimeState.presentationState ?? null,
      currentModelId: previousContext.currentModelId ?? null,
      entrySubjectId: context.primarySubject?.subjectId ?? null,
      availableExperiences: input.availableExperiences,
    });

    // UX:4 — ordinary conversational entry stays inside CC:1/CC:5.
    // It reads CC:8 assessment truth but never maps to or mutates Runtime.
    if (intent.kind === "greet" || intent.kind === "help") {
      const recommendationResult = resolveRecommendationForTurn({
        utterance,
        intentKind: "prioritize",
        primarySubjectId: null,
        executiveContext: previousExecutiveContext,
        catalog: input.catalog,
      });
      const status = "applied" as const;
      const response = buildNexoraConversationalExperienceResponse({
        status,
        intent,
        context,
        command: null,
        runtime: null,
        utterance,
        experienceResolution: experienceResult,
        recommendationResult,
      });
      return finalize({
        status,
        response,
        intentResult,
        contextResult,
        experienceResult,
        commandResult: null,
        runtimeResult: null,
        recommendationResult,
        previousExecutiveContext,
        nextRuntimeState: input.runtimeState,
        shouldCommitRuntime: false,
        pendingTurnResolution,
        ...(pendingTurnResolution?.status === "interrupted" &&
        input.decisionSession?.pendingConfirmation
          ? {
              nextDecisionSession: setPendingDecisionConfirmation(
                input.decisionSession,
                null,
              ),
            }
          : {}),
        ids,
        utterance,
        catalog: input.catalog,
        executiveSubjects: input.executiveSubjects,
      });
    }

    const experienceIntent =
      intent.kind === "prepare-context" || intent.kind === "switch-workspace";

    if (experienceIntent) {
      if (
        experienceResult.decision === "clarification-required" ||
        experienceResult.decision === "unsupported"
      ) {
        const status = mapExperienceStatus({
          contextStatus: context.resolutionStatus,
          experienceDecision: experienceResult.decision,
          experienceStatus: experienceResult.resolutionStatus,
          commandStatus: null,
          runtimeStatus: null,
          intentKind: intent.kind,
        });
        const response = buildNexoraConversationalExperienceResponse({
          status,
          intent,
          context,
          command: null,
          runtime: null,
          utterance,
          experienceResolution: experienceResult,
        });
        return finalize({
          status,
          response,
          intentResult,
          contextResult,
          experienceResult,
          commandResult: null,
          runtimeResult: null,
          previousExecutiveContext,
          nextRuntimeState: input.runtimeState,
          shouldCommitRuntime: false,
          ids,
          utterance,
          catalog: input.catalog,
          executiveSubjects: input.executiveSubjects,
        });
      }

      // Already in target experience — focus subject if requested, else no-op.
      if (experienceResult.decision === "keep-current") {
        if (context.primarySubject?.subjectId) {
          const focusIntent = Object.freeze({
            ...intent,
            kind: "focus" as const,
            requiresTarget: true,
            requiresContext: false,
            executionClass: "navigation" as const,
          });
          const commandResult = mapNexoraConversationalCommand({
            intent: focusIntent,
            context,
          });
          if (commandResult.status !== "mapped" || commandResult.command == null) {
            const status = mapExperienceStatus({
              contextStatus: context.resolutionStatus,
              experienceDecision: experienceResult.decision,
              commandStatus: commandResult.status,
              runtimeStatus: null,
              intentKind: intent.kind,
            });
            const response = buildNexoraConversationalExperienceResponse({
              status,
              intent,
              context,
              command: commandResult.command,
              runtime: null,
              utterance,
              experienceResolution: experienceResult,
            });
            return finalize({
              status,
              response,
              intentResult,
              contextResult,
              experienceResult,
              commandResult,
              runtimeResult: null,
              previousExecutiveContext,
              nextRuntimeState: input.runtimeState,
              shouldCommitRuntime: false,
              ids,
              utterance,
              catalog: input.catalog,
              executiveSubjects: input.executiveSubjects,
            });
          }

          const applied = applyNexoraMVPConversationalCommand({
            command: commandResult.command,
            state: input.runtimeState,
            catalog: input.catalog,
            lastAppliedCommandId: input.lastAppliedCommandId,
          });
          const status = mapExperienceStatus({
            contextStatus: context.resolutionStatus,
            experienceDecision: experienceResult.decision,
            commandStatus: commandResult.status,
            runtimeStatus: applied.result.status,
            intentKind: intent.kind,
          });
          const response = buildNexoraConversationalExperienceResponse({
            status,
            intent,
            context,
            command: commandResult.command,
            runtime: applied.result,
            utterance,
            experienceResolution: experienceResult,
          });
          const shouldCommitRuntime = applied.result.status === "applied";
          return finalize({
            status,
            response,
            intentResult,
            contextResult,
            experienceResult,
            commandResult,
            runtimeResult: applied.result,
            previousExecutiveContext,
            nextRuntimeState: shouldCommitRuntime
              ? applied.nextState
              : input.runtimeState,
            shouldCommitRuntime,
            ids,
            utterance,
            catalog: input.catalog,
            executiveSubjects: input.executiveSubjects,
          });
        }

        const status = "no-op" as const;
        const response = buildNexoraConversationalExperienceResponse({
          status,
          intent,
          context,
          command: null,
          runtime: null,
          utterance,
          experienceResolution: experienceResult,
        });
        return finalize({
          status,
          response,
          intentResult,
          contextResult,
          experienceResult,
          commandResult: null,
          runtimeResult: null,
          previousExecutiveContext,
          nextRuntimeState: input.runtimeState,
          shouldCommitRuntime: false,
          ids,
          utterance,
          catalog: input.catalog,
          executiveSubjects: input.executiveSubjects,
        });
      }

      // transition
      const commandResult = mapNexoraConversationalCommand({
        intent,
        context,
        experienceResolution: {
          decision: experienceResult.decision,
          workspaceId: experienceResult.targetExperienceContext.workspaceId,
          experienceId: experienceResult.targetExperienceContext.experienceId,
          entrySubjectId:
            experienceResult.targetExperienceContext.entrySubjectId,
        },
      });

      if (commandResult.status !== "mapped" || commandResult.command == null) {
        const status = mapExperienceStatus({
          contextStatus: context.resolutionStatus,
          experienceDecision: experienceResult.decision,
          commandStatus: commandResult.status,
          runtimeStatus: null,
          intentKind: intent.kind,
        });
        const response = buildNexoraConversationalExperienceResponse({
          status,
          intent,
          context,
          command: commandResult.command,
          runtime: null,
          utterance,
          experienceResolution: experienceResult,
        });
        return finalize({
          status,
          response,
          intentResult,
          contextResult,
          experienceResult,
          commandResult,
          runtimeResult: null,
          previousExecutiveContext,
          nextRuntimeState: input.runtimeState,
          shouldCommitRuntime: false,
          ids,
          utterance,
          catalog: input.catalog,
          executiveSubjects: input.executiveSubjects,
        });
      }

      const applied = applyNexoraMVPConversationalCommand({
        command: commandResult.command,
        state: input.runtimeState,
        catalog: input.catalog,
        lastAppliedCommandId: input.lastAppliedCommandId,
      });

      const status = mapExperienceStatus({
        contextStatus: context.resolutionStatus,
        experienceDecision: experienceResult.decision,
        commandStatus: commandResult.status,
        runtimeStatus: applied.result.status,
        intentKind: intent.kind,
      });

      const response = buildNexoraConversationalExperienceResponse({
        status,
        intent,
        context,
        command: commandResult.command,
        runtime: applied.result,
        utterance,
        experienceResolution: experienceResult,
      });

      const shouldCommitRuntime = applied.result.status === "applied";
      return finalize({
        status,
        response,
        intentResult,
        contextResult,
        experienceResult,
        commandResult,
        runtimeResult: applied.result,
        previousExecutiveContext,
        nextRuntimeState: shouldCommitRuntime
          ? applied.nextState
          : input.runtimeState,
        shouldCommitRuntime,
        ids,
        utterance,
        catalog: input.catalog,
        executiveSubjects: input.executiveSubjects,
      });
    }

    // Ordinary intents — CC:6 not-required; existing CC:3 → CC:4 path
    const commandResult = mapNexoraConversationalCommand({
      intent,
      context,
    });

    if (commandResult.status !== "mapped" || commandResult.command == null) {
      const status = mapExperienceStatus({
        contextStatus: context.resolutionStatus,
        experienceDecision: experienceResult.decision,
        commandStatus: commandResult.status,
        runtimeStatus: null,
        intentKind: intent.kind,
      });
      const response = buildNexoraConversationalExperienceResponse({
        status,
        intent,
        context,
        command: commandResult.command,
        runtime: null,
        utterance,
        experienceResolution: experienceResult,
      });
      return finalize({
        status,
        response,
        intentResult,
        contextResult,
        experienceResult,
        commandResult,
        runtimeResult: null,
        previousExecutiveContext,
        nextRuntimeState: input.runtimeState,
        shouldCommitRuntime: false,
        ids,
        utterance,
        catalog: input.catalog,
        executiveSubjects: input.executiveSubjects,
      });
    }

    const applied = applyNexoraMVPConversationalCommand({
      command: commandResult.command,
      state: input.runtimeState,
      catalog: input.catalog,
      lastAppliedCommandId: input.lastAppliedCommandId,
    });

    const isRecommendation =
      isRecommendationCommandKind(commandResult.command.kind) ||
      applied.result.runtimeActionKind === "resolve-executive-recommendation";
    const isScenario =
      isScenarioCommandKind(commandResult.command.kind) ||
      applied.result.runtimeActionKind === "resolve-executive-scenario";
    const isDecisionCommitment =
      isDecisionCommitmentCommandKind(commandResult.command.kind) ||
      applied.result.runtimeActionKind ===
        "resolve-executive-decision-commitment";
    const isReviewConfirmation =
      pendingTurnResolution?.status === "answered" &&
      pendingTurnResolution.expectation.questionKind === "review-subject";
    const isSafeActionNavigation =
      intent.kind === "focus" &&
      (actionInvocation.status === "resolved" ||
        /^(?:review|investigate)\b/i.test(utterance.trim()));

    let recommendationResult: NexoraExecutiveRecommendationResult | null = null;
    let scenarioResult: NexoraExecutiveScenarioConversationResult | null = null;
    let decisionCommitmentResult: NexoraDecisionCommitmentResult | null = null;

    if (
      (isRecommendation || isReviewConfirmation || isSafeActionNavigation) &&
      (applied.result.status === "applied" ||
        applied.result.status === "no-op")
    ) {
      recommendationResult = resolveRecommendationForTurn({
        utterance,
        intentKind:
          isReviewConfirmation || isSafeActionNavigation
            ? "explain"
            : intent.kind,
        primarySubjectId: context.primarySubject?.subjectId ?? null,
        executiveContext: previousExecutiveContext,
        catalog: input.catalog,
      });
    }

    if (isScenario && applied.result.status === "applied") {
      scenarioResult = resolveScenarioForTurn({
        intent,
        primarySubjectId: context.primarySubject?.subjectId ?? null,
        executiveContext: previousExecutiveContext,
        catalog: input.catalog,
        scenarioSession: input.scenarioSession ?? null,
      });
    }

    if (isDecisionCommitment && applied.result.status === "applied") {
      decisionCommitmentResult = resolveDecisionCommitmentForTurn({
        intent,
        primarySubjectId: context.primarySubject?.subjectId ?? null,
        executiveContext: previousExecutiveContext,
        scenarioSession: input.scenarioSession ?? null,
        decisionSession: input.decisionSession ?? null,
        decisionRuntime: input.decisionRuntime ?? null,
        commandId: commandResult.command.commandId,
        utterance,
        committedAt: input.decisionCommittedAt,
      });
    }

    const status =
      decisionCommitmentResult?.status === "clarification-required"
        ? ("clarification-required" as const)
        : decisionCommitmentResult?.status === "confirmation-required"
          ? ("confirmation-required" as const)
          : decisionCommitmentResult?.status === "unsupported" ||
              decisionCommitmentResult?.status === "invalid-candidate" ||
              decisionCommitmentResult?.status === "transition-not-allowed"
            ? ("unsupported" as const)
            : decisionCommitmentResult?.status === "failed"
              ? ("failed" as const)
              : scenarioResult?.status === "clarification-required"
                ? ("clarification-required" as const)
                : mapExperienceStatus({
                    contextStatus: context.resolutionStatus,
                    experienceDecision: experienceResult.decision,
                    commandStatus: commandResult.status,
                    runtimeStatus: applied.result.status,
                    intentKind: intent.kind,
                  });

    const response = buildNexoraConversationalExperienceResponse({
      status,
      intent,
      context,
      command: commandResult.command,
      runtime: applied.result,
      utterance,
      experienceResolution: experienceResult,
      recommendationResult,
      scenarioResult,
      decisionCommitmentResult,
      advisorGrounding: input.advisorGrounding ?? null,
      pendingTurnResolution,
      bareSubjectReference:
        bareSubject?.status === "resolved" && bareSubject.subject != null,
      safeActionNavigation: isSafeActionNavigation,
    });

    const shouldCommitRuntime =
      applied.result.status === "applied" &&
      !isRecommendation &&
      !isScenario &&
      !isDecisionCommitment;
    const trustedDecisionSuccess =
      isDecisionCommitment &&
      applied.result.status === "applied" &&
      (decisionCommitmentResult?.status === "applied" ||
        decisionCommitmentResult?.status === "already-committed" ||
        decisionCommitmentResult?.status === "confirmation-required" ||
        decisionCommitmentResult?.status === "preference-only");

    return finalize({
      status,
      response,
      intentResult,
      contextResult,
      experienceResult,
      commandResult,
      runtimeResult: applied.result,
      recommendationResult,
      scenarioResult,
      decisionCommitmentResult,
      previousExecutiveContext,
      nextRuntimeState: shouldCommitRuntime
        ? applied.nextState
        : input.runtimeState,
      shouldCommitRuntime,
      trustedAdvisorySuccess:
        ((isRecommendation ||
          isScenario ||
          isReviewConfirmation ||
          isSafeActionNavigation) &&
          applied.result.status === "applied" &&
          status !== "clarification-required") ||
        trustedDecisionSuccess,
      pendingTurnResolution,
      ...(pendingTurnResolution?.status === "interrupted" &&
      input.decisionSession?.pendingConfirmation
        ? {
            nextDecisionSession: setPendingDecisionConfirmation(
              input.decisionSession,
              null,
            ),
          }
        : {}),
      ids,
      utterance,
      catalog: input.catalog,
      executiveSubjects: input.executiveSubjects,
    });
  } catch {
    const intentResult = resolveNexoraConversationalIntent({ utterance });
    const emptyContext = resolveNexoraExecutiveConversationalContext({
      intent: intentResult.intent,
      executiveSubjects: input.executiveSubjects,
      conversationContext: previousContext,
    });
    const response = "Nexora couldn't complete that command.";
    return finalize({
      status: "failed",
      response,
      intentResult,
      contextResult: emptyContext,
      experienceResult: null,
      commandResult: null,
      runtimeResult: null,
      previousExecutiveContext,
      nextRuntimeState: input.runtimeState,
      shouldCommitRuntime: false,
      ids,
      utterance,
      catalog: input.catalog,
      executiveSubjects: input.executiveSubjects,
    });
  }
}

function finalize(args: {
  readonly status: NexoraConversationalExperienceStatus;
  readonly response: string;
  readonly intentResult: NexoraConversationalExperienceResult["intentResult"];
  readonly contextResult: NexoraConversationalExperienceResult["contextResult"];
  readonly experienceResult: NexoraConversationalExperienceContextResolution | null;
  readonly commandResult: NexoraConversationalExperienceResult["commandResult"];
  readonly runtimeResult: NexoraConversationalExperienceResult["runtimeResult"];
  readonly recommendationResult?: NexoraExecutiveRecommendationResult | null;
  readonly scenarioResult?: NexoraExecutiveScenarioConversationResult | null;
  readonly decisionCommitmentResult?: NexoraDecisionCommitmentResult | null;
  readonly pendingTurnResolution?: NexoraPendingTurnResolution | null;
  readonly nextPendingTurnExpectation?: NexoraPendingTurnExpectation | null;
  readonly nextDecisionSession?: NexoraExecutiveDecisionSession | null;
  readonly previousExecutiveContext: NexoraExecutiveContextSnapshot;
  readonly nextRuntimeState: NexoraMVPObjectInteractionState;
  readonly shouldCommitRuntime: boolean;
  /** Advisory CC:8/CC:9/CC:10 success without Stage Runtime mutation. */
  readonly trustedAdvisorySuccess?: boolean;
  readonly ids: { readonly managerId: string; readonly nexoraId: string };
  readonly utterance: string;
  readonly catalog?: NexoraMVPObjectInteractionCatalog;
  readonly executiveSubjects: readonly NexoraConversationalSubjectRecord[];
}): NexoraConversationalExperienceResult & {
  readonly nextRuntimeState: NexoraMVPObjectInteractionState;
} {
  let executiveContextUpdate: NexoraExecutiveContextUpdateResult | null = null;
  let nextExecutiveContext = args.previousExecutiveContext;
  const recommendationResult = args.recommendationResult ?? null;
  const scenarioResult = args.scenarioResult ?? null;
  const decisionCommitmentResult = args.decisionCommitmentResult ?? null;
  const lastRecommendationId =
    recommendationResult?.primaryRecommendation?.recommendationId ?? null;

  if (args.shouldCommitRuntime && args.runtimeResult?.status === "applied") {
    const commandKind = args.commandResult?.command?.kind ?? null;
    const focusedId = args.nextRuntimeState.focusedSubject?.id ?? null;
    const presentedFromLinks =
      args.catalog && focusedId
        ? buildPresentedSetFromCatalogLinks({
            catalog: args.catalog,
            anchorSubjectId: focusedId,
            commandKind,
            turnIndex: args.previousExecutiveContext.turnIndex + 1,
          })
        : null;
    const presentedFromCollection = buildPresentedSetFromCollectionState(
      args.nextRuntimeState,
      args.previousExecutiveContext.turnIndex + 1,
    );
    const workspaceChanged =
      args.previousExecutiveContext.currentWorkspaceId != null &&
      args.previousExecutiveContext.currentWorkspaceId !==
        args.nextRuntimeState.workspace;

    executiveContextUpdate = updateNexoraExecutiveContext({
      previousContext: args.previousExecutiveContext,
      intentResult: args.intentResult,
      resolvedContext: args.contextResult,
      experienceResult: args.experienceResult,
      commandResult: args.commandResult,
      runtimeResult: args.runtimeResult,
      runtimeFocusedSubjectId: focusedId,
      runtimeFocusedSubjectKind: focusedKind(args.nextRuntimeState),
      runtimeFocusedCanonicalName:
        args.nextRuntimeState.focusedSubject?.label ?? null,
      runtimeWorkspaceId: args.nextRuntimeState.workspace,
      presentedSet: presentedFromCollection ?? presentedFromLinks,
      executiveSubjects: args.executiveSubjects,
      trustedSuccess: true,
      syncSource: workspaceChanged ? "workspace-transition" : null,
      lastRecommendationId,
    });
    nextExecutiveContext = executiveContextUpdate.nextContext;
  } else if (args.trustedAdvisorySuccess === true) {
    // CC:8/CC:9/CC:10 advisory/commitment turn: record command + refs.
    const scenarioRef = scenarioResult?.scenario
      ? freezeExecutiveContextReference({
          subjectId: scenarioResult.scenario.scenarioId,
          subjectKind: "scenario",
          canonicalName: scenarioResult.scenario.name,
          source: "conversation",
          turnIndex: args.previousExecutiveContext.turnIndex + 1,
        })
      : null;
    const decisionRef =
      decisionCommitmentResult?.decision &&
      (decisionCommitmentResult.status === "applied" ||
        decisionCommitmentResult.status === "already-committed")
        ? freezeExecutiveContextReference({
            subjectId: decisionCommitmentResult.decision.decisionId,
            subjectKind: "decision",
            canonicalName: decisionCommitmentResult.decision.title,
            source: "conversation",
            turnIndex: args.previousExecutiveContext.turnIndex + 1,
          })
        : null;
    const presentedSet =
      scenarioResult?.nextSession.candidateScenarioIds.length
        ? Object.freeze({
            kind: "scenarios" as const,
            subjectIds: scenarioResult.nextSession.candidateScenarioIds,
            anchorSubjectId: scenarioResult.scenario?.scenarioId ?? null,
            turnIndex: args.previousExecutiveContext.turnIndex + 1,
          })
        : null;

    executiveContextUpdate = updateNexoraExecutiveContext({
      previousContext: args.previousExecutiveContext,
      intentResult: args.intentResult,
      resolvedContext: args.contextResult,
      experienceResult: args.experienceResult,
      commandResult: args.commandResult,
      runtimeResult: args.runtimeResult,
      executiveSubjects: args.executiveSubjects,
      trustedSuccess: true,
      lastRecommendationId,
      presentedSet,
      ...(decisionRef
        ? {
            runtimeFocusedSubjectId: decisionRef.subjectId,
            runtimeFocusedSubjectKind: "decision" as const,
            runtimeFocusedCanonicalName: decisionRef.canonicalName ?? null,
          }
        : scenarioRef
          ? {
              runtimeFocusedSubjectId: scenarioRef.subjectId,
              runtimeFocusedSubjectKind: "scenario" as const,
              runtimeFocusedCanonicalName: scenarioRef.canonicalName ?? null,
            }
          : {}),
    });
    nextExecutiveContext = executiveContextUpdate.nextContext;
  } else {
    executiveContextUpdate = updateNexoraExecutiveContext({
      previousContext: args.previousExecutiveContext,
      intentResult: args.intentResult,
      resolvedContext: args.contextResult,
      experienceResult: args.experienceResult,
      commandResult: args.commandResult,
      runtimeResult: args.runtimeResult,
      trustedSuccess: false,
      executiveSubjects: args.executiveSubjects,
    });
    nextExecutiveContext = executiveContextUpdate.nextContext;
  }

  const derivedPendingTurnExpectation =
    args.nextPendingTurnExpectation !== undefined
      ? args.nextPendingTurnExpectation
      : args.intentResult.intent.kind === "greet"
        ? (() => {
            const attention =
              recommendationResult?.assessment.issues[0] ??
              recommendationResult?.assessment.constraints[0] ??
              null;
            return attention
              ? createNexoraPendingTurnExpectation({
                  expectationId: `${args.ids.nexoraId}-review`,
                  questionKind: "review-subject",
                  expectedAnswerKind: "confirmation",
                  subjectId: attention.subjectId,
                  sourceCapability: "CC:5",
                  confirmationLevel: "review",
                })
              : createNexoraPendingTurnExpectation({
                  expectationId: `${args.ids.nexoraId}-subject`,
                  questionKind: "select-subject",
                  expectedAnswerKind: "subject-selection",
                  optionIds: args.executiveSubjects.map(
                    (subject) => subject.subjectId,
                  ),
                  sourceCapability: "CC:5",
                });
          })()
        : decisionCommitmentResult?.status === "confirmation-required" &&
            decisionCommitmentResult.nextSession.pendingConfirmation
          ? createNexoraPendingTurnExpectation({
              expectationId:
                decisionCommitmentResult.nextSession.pendingConfirmation
                  .confirmationId,
              questionKind: "decision-commitment",
              expectedAnswerKind: "decision-option",
              subjectId:
                args.contextResult.context.primarySubject?.subjectId ?? null,
              optionIds: [
                decisionCommitmentResult.nextSession.pendingConfirmation
                  .candidateId,
              ],
              sourceCapability: "CC:10",
              consequential: true,
              confirmationLevel: "consequential",
            })
          : args.status === "clarification-required" &&
              scenarioResult?.nextSession.candidateScenarioIds.length
            ? createNexoraPendingTurnExpectation({
                expectationId: `${args.ids.nexoraId}-scenario`,
                questionKind: "select-scenario",
                expectedAnswerKind: "scenario-selection",
                subjectId:
                  args.contextResult.context.primarySubject?.subjectId ?? null,
                optionIds: scenarioResult.nextSession.candidateScenarioIds,
                sourceCapability: "CC:9",
              })
            : args.status === "clarification-required"
              ? createNexoraPendingTurnExpectation({
                  expectationId: `${args.ids.nexoraId}-clarification`,
                  questionKind: "select-subject",
                  expectedAnswerKind: "subject-selection",
                  optionIds:
                    args.contextResult.trace.canonicalCandidates.length > 0
                      ? args.contextResult.trace.canonicalCandidates
                      : args.executiveSubjects.map(
                          (subject) => subject.subjectId,
                        ),
                  sourceCapability: "CC:2",
                })
          : null;
  nextExecutiveContext = freezeExecutiveContextSnapshot({
    ...nextExecutiveContext,
    pendingTurnExpectation: derivedPendingTurnExpectation,
  });
  const nextConversationContext =
    toNexoraConversationContextSnapshot(nextExecutiveContext);

  const managerMessage = freezeMessage({
    id: args.ids.managerId,
    role: "manager",
    text: args.utterance.trim(),
    createdAt: undefined,
  });

  const nexoraMessage = freezeMessage({
    id: args.ids.nexoraId,
    role: "nexora",
    text: args.response,
    status: args.status,
    commandId: args.commandResult?.command?.commandId,
  });

  const trace: NexoraConversationalExperienceTrace = Object.freeze({
    utterance: args.utterance,
    intentKind: args.intentResult.intent.kind,
    contextStatus: args.contextResult.context.resolutionStatus,
    primarySubjectId:
      args.contextResult.context.primarySubject?.subjectId ?? null,
    experienceDecision: args.experienceResult?.decision ?? null,
    experienceId:
      args.experienceResult?.targetExperienceContext.experienceId ?? null,
    commandKind: args.commandResult?.command?.kind ?? null,
    runtimeStatus: args.runtimeResult?.status ?? null,
    experienceStatus: args.status,
    responseText: args.response,
    executiveContextTurnIndex: nextExecutiveContext.turnIndex,
    executiveCurrentSubjectId:
      nextExecutiveContext.currentSubject?.subjectId ?? null,
    pendingTurnExpectationKind:
      derivedPendingTurnExpectation?.questionKind ?? null,
    pendingTurnResolutionStatus: args.pendingTurnResolution?.status ?? null,
  });

  return Object.freeze({
    status: args.status,
    response: args.response,
    intentResult: args.intentResult,
    contextResult: args.contextResult,
    experienceResult: args.experienceResult,
    commandResult: args.commandResult,
    runtimeResult: args.runtimeResult,
    recommendationResult,
    scenarioResult,
    decisionCommitmentResult,
    nextScenarioSession: scenarioResult?.nextSession ?? null,
    nextDecisionSession:
      args.nextDecisionSession !== undefined
        ? args.nextDecisionSession
        : (decisionCommitmentResult?.nextSession ?? null),
    nextPendingTurnExpectation: derivedPendingTurnExpectation,
    pendingTurnResolution: args.pendingTurnResolution ?? null,
    nextConversationContext,
    nextExecutiveContext,
    executiveContextUpdate,
    managerMessage,
    nexoraMessage,
    trace,
    shouldCommitRuntime: args.shouldCommitRuntime,
    nextRuntimeState: args.nextRuntimeState,
  });
}

/** Alias matching mission naming. */
export const submitExecutiveUtterance = executeNexoraConversationalExperience;
