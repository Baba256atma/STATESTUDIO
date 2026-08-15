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
  const projected = projectNexoraMVPExecutiveRecommendationEvidence({
    catalog,
    executiveContext: input.executiveContext,
    primarySubjectId: input.primarySubjectId,
  });
  const facts = withUnknownImpactIfNeeded(
    projected.facts,
    input.utterance,
    input.primarySubjectId,
  );
  const requestKind =
    input.intentKind === "explain"
      ? ("explain" as const)
      : input.intentKind === "prioritize"
        ? ("prioritize" as const)
        : ("recommend" as const);
  return resolveNexoraExecutiveRecommendation({
    executiveContext: input.executiveContext,
    primarySubjectId: input.primarySubjectId,
    evidence: Object.freeze({
      ...projected,
      facts,
    }),
    requestKind,
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

    let recommendationResult: NexoraExecutiveRecommendationResult | null = null;
    if (isRecommendation && applied.result.status === "applied") {
      recommendationResult = resolveRecommendationForTurn({
        utterance,
        intentKind: intent.kind,
        primarySubjectId: context.primarySubject?.subjectId ?? null,
        executiveContext: previousExecutiveContext,
        catalog: input.catalog,
      });
    }

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
      recommendationResult,
    });

    const shouldCommitRuntime =
      applied.result.status === "applied" && !isRecommendation;
    return finalize({
      status,
      response,
      intentResult,
      contextResult,
      experienceResult,
      commandResult,
      runtimeResult: applied.result,
      recommendationResult,
      previousExecutiveContext,
      nextRuntimeState: shouldCommitRuntime
        ? applied.nextState
        : input.runtimeState,
      shouldCommitRuntime,
      trustedAdvisorySuccess:
        isRecommendation && applied.result.status === "applied",
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
  readonly previousExecutiveContext: NexoraExecutiveContextSnapshot;
  readonly nextRuntimeState: NexoraMVPObjectInteractionState;
  readonly shouldCommitRuntime: boolean;
  /** Advisory CC:8 success without Runtime mutation. */
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
    // CC:8 advisory turn: record command + recommendation id; do not mutate Runtime focus.
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
