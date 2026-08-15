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
  type NexoraExecutiveDecisionSession,
} from "./executiveDecisionAuthority.ts";
import type { NexoraDecisionRuntimeAdapter } from "./executiveDecisionRuntimeAdapter.ts";
import { createNexoraCanonicalDecisionRuntime } from "./executiveDecisionRuntimeAdapter.ts";


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
    input.intentKind === "explain"
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

  const legacy = input.conversationContext ?? Object.freeze({});
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
  const previousExecutiveContext = bootstrapExecutiveContext({
    executiveContext: input.executiveContext,
    conversationContext: input.conversationContext,
    runtimeState: input.runtimeState,
    executiveSubjects: input.executiveSubjects,
  });
  const previousContext = toNexoraConversationContextSnapshot(
    previousExecutiveContext,
  );

  try {
    // CC:1
    const intentResult = resolveNexoraConversationalIntent({ utterance });
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

    let recommendationResult: NexoraExecutiveRecommendationResult | null = null;
    let scenarioResult: NexoraExecutiveScenarioConversationResult | null = null;
    let decisionCommitmentResult: NexoraDecisionCommitmentResult | null = null;

    if (isRecommendation && applied.result.status === "applied") {
      recommendationResult = resolveRecommendationForTurn({
        utterance,
        intentKind: intent.kind,
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
        ((isRecommendation || isScenario) &&
          applied.result.status === "applied" &&
          status !== "clarification-required") ||
        trustedDecisionSuccess,
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
    nextDecisionSession: decisionCommitmentResult?.nextSession ?? null,
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
