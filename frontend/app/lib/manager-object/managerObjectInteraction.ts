/**
 * MO:1 — Manager–Object interaction turn.
 * Coordinates active object, context, intent, guidance, and Explain handoff.
 */

import type { NexoraConversationalIntentKind } from "@/app/lib/conversational-control/conversationalIntent.ts";
import type { NexoraConversationalSubjectRecord } from "@/app/lib/conversational-control/conversationalContext.ts";
import type { NexoraMVPObjectInteractionCatalog } from "@/app/lib/nex-mvp/nexoraMVPObjectInteraction.ts";
import { getDefaultNexoraMVPObjectInteractionCatalog } from "@/app/lib/nex-mvp/nexoraMVPObjectInteraction.ts";
import {
  activateManagerObjectFromClick,
  createEmptyManagerObjectSession,
  freezeManagerObjectSession,
  resolveManagerObjectActivation,
  type ManagerObjectSession,
} from "./managerObjectActive.ts";
import { collectManagerObjectContext } from "./managerObjectContext.ts";
import {
  buildManagerObjectExplainHandoffRequest,
  previewManagerObjectExplanation,
  type ManagerObjectExplainHandoffRequest,
  type ManagerObjectExplainHandoffResponse,
} from "./managerObjectExplainHandoff.ts";
import { deriveManagerObjectGuidance } from "./managerObjectGuidance.ts";
import {
  getManagerObjectInteractionFoundationIdentity,
  MANAGER_OBJECT_INTERACTION_BOUNDARY,
  type ManagerObjectIntent,
} from "./managerObjectInteractionFoundation.ts";
import { resolveManagerObjectIntent } from "./managerObjectIntent.ts";
import { projectManagerObjectConversationalSubjects } from "./managerObjectCatalog.ts";
import { composeExecutiveObjectExplanation } from "./managerObjectExplainEngine.ts";
import type { ExecutiveObjectExplanation } from "./managerObjectExplainTypes.ts";
import {
  composeExecutiveObjectExploration,
  resolveExplorationFollowUpTarget,
} from "./managerObjectExplorationEngine.ts";
import type { ExecutiveObjectExploration } from "./managerObjectExplorationTypes.ts";
import { composeExecutiveGoalNavigation } from "./managerObjectGoalNavigationEngine.ts";
import type { ExecutiveGoalNavigation } from "./managerObjectGoalTypes.ts";
import { resolveExecutiveGoalContext } from "./managerObjectGoalContext.ts";
import {
  composeExecutiveJourneyIntelligence,
  type ExecutiveJourneyRuntimeFacts,
} from "./managerObjectJourneyEngine.ts";
import type { ExecutiveJourneyIntelligence } from "./managerObjectJourneyTypes.ts";
import {
  composeExecutiveAttentionIntelligence,
  isExecutiveAttentionUtterance,
  type ExecutiveAttentionFacts,
} from "./managerObjectAttentionEngine.ts";
import type { ExecutiveAttentionIntelligence } from "./managerObjectAttentionTypes.ts";

export type ManagerObjectTurn = {
  readonly session: ManagerObjectSession;
  readonly activeObjectId: string | null;
  readonly intent: ManagerObjectIntent;
  readonly usesActiveObject: boolean;
  readonly context: ReturnType<typeof collectManagerObjectContext>;
  readonly guidance: ReturnType<typeof deriveManagerObjectGuidance>;
  readonly explainRequest: ManagerObjectExplainHandoffRequest;
  readonly explainPreview: ManagerObjectExplainHandoffResponse;
  readonly explanation: ExecutiveObjectExplanation;
  readonly exploration: ExecutiveObjectExploration;
  readonly navigation: ExecutiveGoalNavigation;
  readonly journey: ExecutiveJourneyIntelligence;
  readonly attention: ExecutiveAttentionIntelligence;
};

export function resolveManagerObjectTurn(input: {
  readonly utterance?: string | null;
  readonly conversationalKind?: NexoraConversationalIntentKind | "unknown";
  readonly hasNamedTargetHint?: boolean;
  readonly namedSubjectId?: string | null;
  readonly previousSession?: ManagerObjectSession | null;
  readonly stageFocusedId?: string | null;
  readonly conversationSubjectId?: string | null;
  readonly catalog?: NexoraMVPObjectInteractionCatalog;
  readonly subjects?: readonly NexoraConversationalSubjectRecord[];
  readonly activation?: "conversation" | "click";
  readonly clickedObjectId?: string | null;
  readonly managerGoal?: string | null;
  readonly committedDecisionIds?: readonly string[];
  readonly executiveCurrentGoal?: {
    readonly subjectId: string | null;
    readonly canonicalName: string | null;
  } | null;
  readonly journeyFacts?: ExecutiveJourneyRuntimeFacts;
  readonly attentionFacts?: ExecutiveAttentionFacts;
}): ManagerObjectTurn {
  const catalog = input.catalog ?? getDefaultNexoraMVPObjectInteractionCatalog();
  const subjects =
    input.subjects ?? projectManagerObjectConversationalSubjects(catalog);
  const previous = input.previousSession ?? createEmptyManagerObjectSession();
  const followUpTarget = resolveExplorationFollowUpTarget(
    input.utterance ?? "",
    previous.explorationAnchor,
    previous.activeObjectId,
  );
  const namedSubjectId = followUpTarget ?? input.namedSubjectId ?? null;
  const hasNamedTargetHint =
    followUpTarget != null || input.hasNamedTargetHint === true;

  const session =
    input.activation === "click"
      ? activateManagerObjectFromClick(previous, input.clickedObjectId ?? null)
      : resolveManagerObjectActivation({
          previous,
          namedSubjectId,
          deictic: hasNamedTargetHint !== true && !namedSubjectId,
          stageFocusedId: input.stageFocusedId ?? null,
          conversationSubjectId: input.conversationSubjectId ?? null,
        });

  const intentResolution = resolveManagerObjectIntent({
    utterance: input.utterance ?? "",
    conversationalKind: input.conversationalKind ?? "unknown",
    hasNamedTargetHint,
    subjects,
  });

  const context = collectManagerObjectContext(session.activeObjectId, catalog);
  const guidance = deriveManagerObjectGuidance(
    context,
    intentResolution.intent,
  );
  const explainRequest = buildManagerObjectExplainHandoffRequest({
    objectId: session.activeObjectId,
    intent: intentResolution.intent,
    context,
  });
  const explanation = composeExecutiveObjectExplanation({
    request: explainRequest,
    guidance,
    focus: intentResolution.explanationFocus,
    depth: intentResolution.explanationDepth,
    utterance: input.utterance ?? "",
  });
  const explainPreview = previewManagerObjectExplanation(
    explainRequest,
    guidance,
  );

  const goalResolution = resolveExecutiveGoalContext({
    utterance: input.utterance ?? "",
    previousActive: previous.goalContext ?? null,
    previousSecondary: previous.secondaryGoals ?? [],
    executiveCurrentGoal: input.executiveCurrentGoal ??
      (input.managerGoal
        ? { subjectId: null, canonicalName: input.managerGoal }
        : null),
    associatedGoalId: context.associatedGoal.value,
  });
  const managerGoalTitle =
    goalResolution.active.source === "unknown"
      ? input.managerGoal ??
        (context.associatedGoal.value
          ? collectManagerObjectContext(context.associatedGoal.value).identity
              .value
          : null)
      : goalResolution.active.title;

  const exploration = composeExecutiveObjectExploration({
    context,
    explanation,
    intent: intentResolution.intent,
    managerGoal: managerGoalTitle,
    committedDecisionIds: input.committedDecisionIds,
  });
  const navigation = composeExecutiveGoalNavigation({
    context,
    exploration,
    activeGoal: goalResolution.active,
    secondaryGoals: goalResolution.secondary,
  });
  const journey = composeExecutiveJourneyIntelligence({
    context,
    explanation,
    exploration,
    navigation,
    visitedSubjectIds: session.visitedSubjectIds,
    previousSnapshots: previous.journeySnapshots,
    previousBlockerKind: previous.lastJourneyBlockerKind,
    statusQueryRepeat:
      isJourneyStatusUtterance(input.utterance ?? "") &&
      previous.journeyPrompted === true,
    facts: {
      committedDecisionIds: input.committedDecisionIds ??
        input.journeyFacts?.committedDecisionIds,
      rejectedDecisionIds: input.journeyFacts?.rejectedDecisionIds,
      comparedScenarioIds: input.journeyFacts?.comparedScenarioIds,
      executionStates: input.journeyFacts?.executionStates,
      outcomeStates: input.journeyFacts?.outcomeStates,
      learningState: input.journeyFacts?.learningState,
      pendingDecisionConfirmation:
        input.journeyFacts?.pendingDecisionConfirmation,
    },
  });
  const attention = composeExecutiveAttentionIntelligence({
    context,
    explanation,
    exploration,
    navigation,
    journey,
    previousPrimaryId: previous.lastAttentionPrimaryId,
    previousLevel: previous.lastAttentionLevel,
    facts: input.attentionFacts,
  });
  const recommended =
    navigation.recommendedPath?.path ?? exploration.recommendedPaths[0] ?? null;
  const nextSession = freezeManagerObjectSession({
    ...session,
    lastIntent: intentResolution.intent,
    explorationPrompted: intentResolution.intent === "NEXT_ACTION",
    explorationAnchor: recommended
      ? {
          pathId: recommended.pathId,
          kind: recommended.kind,
          targetObjectId: recommended.targetObjectId,
          reason: recommended.reason,
          label: recommended.label,
        }
      : session.explorationAnchor ?? null,
    goalContext: goalResolution.active,
    secondaryGoals: goalResolution.secondary,
    journeySnapshots: journey.history,
    lastJourneyBlockerKind: journey.blocker?.kind ?? null,
    journeyPrompted: isJourneyStatusUtterance(input.utterance ?? ""),
    lastAttentionPrimaryId: attention.primaryAttention?.attentionId ?? null,
    lastAttentionLevel: attention.attentionState,
    attentionPrompted: isExecutiveAttentionUtterance(input.utterance ?? ""),
  });

  return Object.freeze({
    session: nextSession,
    activeObjectId: nextSession.activeObjectId,
    intent: intentResolution.intent,
    usesActiveObject: intentResolution.usesActiveObject,
    context,
    guidance,
    explainRequest,
    explainPreview,
    explanation,
    exploration,
    navigation,
    journey,
    attention,
  });
}

function isJourneyStatusUtterance(utterance: string): boolean {
  const normalized = utterance.toLowerCase().replace(/[?!.,]/g, " ").replace(/\s+/g, " ").trim();
  return /where are we|what have we done|what have we resolved|still unresolved|still open|what is blocking us|why is it blocking|what should happen next|how does this help my goal|how does this affect my goal|where does .+ fit|have we made a decision|has execution started|do we have an outcome|did it move us toward the goal|what did we learn|are we finished/.test(
    normalized,
  );
}

export function verifyManagerObjectInteractionFoundation(): {
  readonly ok: true;
} {
  const identity = getManagerObjectInteractionFoundationIdentity();
  if (identity.id !== "MO:1/ManagerObjectInteractionFoundation") {
    throw new Error("MO:1 identity mismatch");
  }
  if (MANAGER_OBJECT_INTERACTION_BOUNDARY.createsParallelTruth) {
    throw new Error("MO:1 must not create parallel truth");
  }
  if (MANAGER_OBJECT_INTERACTION_BOUNDARY.startsMo2) {
    throw new Error("MO:1 must not start MO:2");
  }
  return Object.freeze({ ok: true as const });
}
