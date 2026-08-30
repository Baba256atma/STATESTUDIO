/**
 * DTH:5 — Structured canonical inputs for Scene Intent.
 * Assembled from already-resolved authorities. Not a second NLU.
 */

import type { CanonicalManagerCommunicativeIntent, CanonicalManagerOperation, CanonicalManagerQuestionType } from "@/app/lib/manager-object/canonicalManagerMeaning.ts";
import type { NexoraSemanticScope, PrimaryResponseOwner } from "@/app/lib/manager-object/nexoraNcaPost3SemanticScopeMultiEntityCanonicalCollectionWorkspaceIntelligence.ts";
import type { ExecutiveComparisonCriterion } from "@/app/lib/manager-object/nexoraNcaPost4CollectionComparison.ts";
import type { JourneyPhase, JourneyState } from "@/app/lib/manager-object/managerObjectJourneyTypes.ts";
import type { NexoraDecisionTheatreReservedCapability } from "./nexoraDecisionTheatreContract.ts";
import type { NexoraDecisionTheatreSceneScript } from "./nexoraDecisionTheatreSceneScript.ts";

export const nexoraDecisionTheatreSceneSemanticInputIdentity =
  "DTH:5/SceneSemanticInput" as const;

export type NexoraDecisionTheatreResolvedParticipant = Readonly<{
  id: string;
  kind: string | null;
  label: string | null;
  authority: "catalog";
}>;

export type NexoraDecisionTheatreSceneDeixis = Readonly<{
  pronoun: "it" | "them" | "none";
  resolvedIds: readonly string[];
}>;

export type NexoraDecisionTheatreSceneSemanticInput = Readonly<{
  identity: typeof nexoraDecisionTheatreSceneSemanticInputIdentity;
  managerQuestionRef: string | null;
  canonicalSemanticResultRef: string;
  activeExecutiveContextRef: string | null;
  conversationIntentKind: string | null;
  canonicalOperation: CanonicalManagerOperation | null;
  communicativeIntent: CanonicalManagerCommunicativeIntent | null;
  questionType: CanonicalManagerQuestionType | null;
  semanticScope: NexoraSemanticScope | null;
  primaryResponseOwner: PrimaryResponseOwner | null;
  journeyState: JourneyState | null;
  journeyPhase: JourneyPhase | null;
  namedSubject: NexoraDecisionTheatreResolvedParticipant | null;
  focalExecutiveObject: NexoraDecisionTheatreResolvedParticipant | null;
  activeCollection: Readonly<{
    kind: string;
    memberIds: readonly string[];
  }> | null;
  requestedCollection: Readonly<{
    kind: string;
    memberIds: readonly string[];
  }> | null;
  comparison: Readonly<{
    active: boolean;
    memberIds: readonly string[];
    criterion: ExecutiveComparisonCriterion | null;
    criterionAmbiguous: boolean;
    criterionResolution: ExecutiveComparisonCriterion | null;
  }> | null;
  deixis: NexoraDecisionTheatreSceneDeixis;
  pendingClarification: Readonly<{
    present: boolean;
    reason: string | null;
    awaiting: string | null;
  }> | null;
  explicitCorrection: boolean;
  explicitNamedEntityAndAction: boolean;
  explicitCollectionRequest: boolean;
  stageOrientationRequest: boolean;
  knowledgeDefinitionRequest: boolean;
  observationNotScenario: boolean;
  unknownEntityNamed: boolean;
  contextSufficient: boolean;
  unsupportedRequest: boolean;
  reservedCapability: NexoraDecisionTheatreReservedCapability | null;
  causalitySupported: boolean;
  impactScaleEvidenceSufficient: boolean;
  navigationRestore: "back" | "forward" | "escape" | "overview" | "refresh" | null;
  lastValidSceneScriptId: string | null;
  lastValidSceneIntentId: string | null;
  lastValidSceneScript: NexoraDecisionTheatreSceneScript | null;
}>;

const EMPTY_DEIXIS: NexoraDecisionTheatreSceneDeixis = Object.freeze({
  pronoun: "none",
  resolvedIds: Object.freeze([] as string[]),
});

export function emptyNexoraDecisionTheatreSceneSemanticInput(
  extra?: Partial<NexoraDecisionTheatreSceneSemanticInput>,
): NexoraDecisionTheatreSceneSemanticInput {
  return Object.freeze({
    identity: nexoraDecisionTheatreSceneSemanticInputIdentity,
    managerQuestionRef: extra?.managerQuestionRef ?? null,
    canonicalSemanticResultRef: extra?.canonicalSemanticResultRef ?? "none",
    activeExecutiveContextRef: extra?.activeExecutiveContextRef ?? null,
    conversationIntentKind: extra?.conversationIntentKind ?? null,
    canonicalOperation: extra?.canonicalOperation ?? null,
    communicativeIntent: extra?.communicativeIntent ?? null,
    questionType: extra?.questionType ?? null,
    semanticScope: extra?.semanticScope ?? null,
    primaryResponseOwner: extra?.primaryResponseOwner ?? null,
    journeyState: extra?.journeyState ?? null,
    journeyPhase: extra?.journeyPhase ?? null,
    namedSubject: extra?.namedSubject ?? null,
    focalExecutiveObject: extra?.focalExecutiveObject ?? null,
    activeCollection: extra?.activeCollection ?? null,
    requestedCollection: extra?.requestedCollection ?? null,
    comparison: extra?.comparison ?? null,
    deixis: extra?.deixis ?? EMPTY_DEIXIS,
    pendingClarification: extra?.pendingClarification ?? null,
    explicitCorrection: extra?.explicitCorrection === true,
    explicitNamedEntityAndAction: extra?.explicitNamedEntityAndAction === true,
    explicitCollectionRequest: extra?.explicitCollectionRequest === true,
    stageOrientationRequest: extra?.stageOrientationRequest === true,
    knowledgeDefinitionRequest: extra?.knowledgeDefinitionRequest === true,
    observationNotScenario: extra?.observationNotScenario === true,
    unknownEntityNamed: extra?.unknownEntityNamed === true,
    contextSufficient: extra?.contextSufficient !== false,
    unsupportedRequest: extra?.unsupportedRequest === true,
    reservedCapability: extra?.reservedCapability ?? null,
    causalitySupported: extra?.causalitySupported === true,
    impactScaleEvidenceSufficient: extra?.impactScaleEvidenceSufficient === true,
    navigationRestore: extra?.navigationRestore ?? null,
    lastValidSceneScriptId: extra?.lastValidSceneScriptId ?? extra?.lastValidSceneScript?.scriptId ?? null,
    lastValidSceneIntentId: extra?.lastValidSceneIntentId ?? extra?.lastValidSceneScript?.sceneIntentId ?? null,
    lastValidSceneScript: extra?.lastValidSceneScript ?? null,
  });
}
