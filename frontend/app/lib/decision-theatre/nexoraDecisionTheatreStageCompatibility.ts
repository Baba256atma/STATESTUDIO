/**
 * DTH:1 — Existing Stage compatibility adapter.
 *
 * Projects the authoritative Stage scene into the Decision Theatre contract.
 * Removable only when Stage natively implements the same contract.
 * Not a parallel Stage, Director, or Runtime.
 */

import type { NexoraDirectorPlan } from "@/app/lib/director/nexoraSemanticPresentationDirector.ts";
import type { NexoraExecutiveContextSnapshot } from "@/app/lib/conversational-control/executiveContextSnapshot.ts";
import {
  deriveNexoraMVPStageInteractionPresentation,
  getDefaultNexoraMVPObjectInteractionCatalog,
  type NexoraMVPObjectInteractionCatalog,
  type NexoraMVPObjectInteractionState,
  type NexoraMVPStageInteractionPresentation,
} from "@/app/lib/nex-mvp/nexoraMVPObjectInteraction.ts";
import type { NexoraMVPStageObjectPresentation } from "@/app/lib/nex-mvp/nexora3DExecutiveStage.ts";
import { EXECUTIVE_QUEUE_CATEGORY_LABELS } from "@/app/lib/spatial-presentation/executiveStageQueueFoundation.ts";
import { buildNexoraDecisionTheatreAdvisorReadableContext } from "./nexoraDecisionTheatreAdvisorContext.ts";
import {
  NEXORA_DECISION_THEATRE_AUTHORITY_LAYERS,
  NEXORA_DECISION_THEATRE_RESERVED_CAPABILITIES,
  NEXORA_DECISION_THEATRE_SUPPORTED_CAPABILITIES,
  nexoraDecisionTheatreCompatibilityAdapterIdentity,
  nexoraDecisionTheatreFoundationIdentity,
  nexoraDecisionTheatreFoundationNamespace,
  nexoraDecisionTheatreFoundationVersion,
  type NexoraDecisionTheatreExecutiveObject,
  type NexoraDecisionTheatreFoundation,
  type NexoraDecisionTheatreObjectVisibility,
  type NexoraDecisionTheatreRelationship,
  type NexoraDecisionTheatreReservedCapability,
} from "./nexoraDecisionTheatreContract.ts";
import { projectNexoraDecisionTheatreIconicObjects } from "./nexoraDecisionTheatreIconicProjection.ts";
import type { NexoraDecisionTheatreIconicAuthoritativeSource } from "./nexoraDecisionTheatreIconicProjection.ts";
import { projectNexoraDecisionTheatreVisualGrammar } from "./nexoraDecisionTheatreVisualProjection.ts";
import { projectNexoraDecisionTheatreAtmosphere } from "./nexoraDecisionTheatreAtmosphereResolver.ts";
import { emptyNexoraDecisionTheatreSceneSemanticInput } from "./nexoraDecisionTheatreSceneSemanticInput.ts";
import type { NexoraDecisionTheatreSceneSemanticInput } from "./nexoraDecisionTheatreSceneSemanticInput.ts";
import { resolveNexoraDecisionTheatreSceneIntent } from "./nexoraDecisionTheatreSceneIntentResolver.ts";
import { composeNexoraDecisionTheatreSceneScript } from "./nexoraDecisionTheatreSceneScriptComposer.ts";
import { projectNexoraDecisionTheatreObjectInvestigation } from "./nexoraDecisionTheatreObjectInvestigationComposer.ts";
import { projectNexoraDecisionTheatreDecisionComparison } from "./nexoraDecisionTheatreDecisionComparisonComposer.ts";
import { projectNexoraDecisionTheatreDecisionCommitment } from "./nexoraDecisionTheatreDecisionCommitmentComposer.ts";
import { projectNexoraDecisionTheatreExecutionReadiness } from "./nexoraDecisionTheatreExecutionReadinessComposer.ts";
import { projectNexoraDecisionTheatreLiveExecution } from "./nexoraDecisionTheatreLiveExecutionComposer.ts";
import { projectNexoraDecisionTheatreOutcomeObservation } from "./nexoraDecisionTheatreOutcomeObservationComposer.ts";
import { projectNexoraDecisionTheatreLearningReassessment } from "./nexoraDecisionTheatreLearningReassessmentComposer.ts";
import {
  nexoraDecisionTheatreVisualLanguageIdentity,
  nexoraDecisionTheatreVisualLanguageVersion,
  resolveCanonicalExecutiveObjectType,
} from "./nexoraDecisionTheatreVisualFamily.ts";

export type NexoraDecisionTheatreProjectionInput = Readonly<{
  stageState: NexoraMVPObjectInteractionState;
  catalog?: NexoraMVPObjectInteractionCatalog;
  directorPlan?: NexoraDirectorPlan | null;
  executiveContext?: NexoraExecutiveContextSnapshot | null;
  managerQuestion?: string | null;
  managerInteractionRef?: string | null;
  requestedTheatreCapability?: NexoraDecisionTheatreReservedCapability | null;
  iconicAuthoritativeSources?: readonly NexoraDecisionTheatreIconicAuthoritativeSource[] | null;
  visualGrammarInput?: import("./nexoraDecisionTheatreVisualProjection.ts").NexoraDecisionTheatreVisualGrammarInput | null;
  atmosphereAuthority?: import("./nexoraDecisionTheatreAtmosphereResolver.ts").NexoraDecisionTheatreAtmosphereAuthority | null;
  sceneSemanticInput?: NexoraDecisionTheatreSceneSemanticInput | null;
  investigationLevel?: import("./nexoraDecisionTheatreObjectInvestigation.ts").NexoraDecisionTheatreInvestigationLevel | null;
  comparisonLevel?: import("./nexoraDecisionTheatreDecisionComparison.ts").NexoraDecisionTheatreComparisonLevel | null;
  ncaActiveComparison?: import("./nexoraDecisionTheatreDecisionComparisonComposer.ts").NexoraDecisionTheatreActiveComparisonMembership | null;
  comparisonAuthority?: import("./nexoraDecisionTheatreDecisionComparisonComposer.ts").NexoraDecisionTheatreComparisonAuthority | null;
  decisionReviewOpen?: boolean | null;
  proposedCandidateId?: string | null;
  authoritativeDecisions?: readonly import("./nexoraDecisionTheatreDecisionCommitmentComposer.ts").NexoraDecisionTheatreAuthoritativeDecision[] | null;
  executionStarted?: boolean | null;
  pendingDecisionConfirmation?: boolean | null;
  authoritativeExecutions?: readonly import("./nexoraDecisionTheatreExecutionReadinessComposer.ts").NexoraDecisionTheatreAuthoritativeExecution[] | null;
  authoritativeOutcomeObservations?: readonly import("./nexoraDecisionTheatreOutcomeObservationComposer.ts").NexoraDecisionTheatreAuthoritativeOutcomeObservation[] | null;
  authoritativeAssumptions?: readonly import("./nexoraDecisionTheatreLearningReassessmentComposer.ts").NexoraDecisionTheatreAuthoritativeAssumption[] | null;
  executionRuntimeAvailable?: boolean | null;
}>;

const RESERVED_REQUEST_PATTERNS: readonly (readonly [RegExp, NexoraDecisionTheatreReservedCapability])[] =
  Object.freeze([
    [/\btheatre replay\b|\breplay the (stage|scene|theatre)\b/i, "nexo-time-and-theatre-replay"],
    [/\bnexo\s*time\b/i, "nexo-time-and-theatre-replay"],
    [/\bnexo\s*lens\b/i, "nexo-lens-library"],
    [/\bnexo\s*select\b/i, "nexo-select-scenario-theatre"],
    [/\bnexo\s*compare\b|\bdecision arena\b/i, "nexo-compare-decision-arena"],
  ]);

export function resolveReservedTheatreRequest(
  utterance: string | null | undefined,
): NexoraDecisionTheatreReservedCapability | null {
  const text = utterance?.trim() ?? "";
  if (!text) return null;
  for (const [pattern, capability] of RESERVED_REQUEST_PATTERNS) {
    if (pattern.test(text)) return capability;
  }
  return null;
}

function freezeTree<T>(value: T): T {
  if (value == null || typeof value !== "object") return value;
  if (Array.isArray(value)) {
    for (const item of value) freezeTree(item);
    return Object.freeze(value) as T;
  }
  for (const nested of Object.values(value as Record<string, unknown>)) {
    freezeTree(nested);
  }
  return Object.freeze(value);
}

function reconstructSceneSemanticFromStage(
  input: NexoraDecisionTheatreProjectionInput,
): NexoraDecisionTheatreSceneSemanticInput {
  const committed = (input.authoritativeDecisions ?? []).some((item) => item.status === "Approved");
  const started = input.executionStarted === true;
  const decision = (input.authoritativeDecisions ?? []).find((item) => item.status === "Approved");
  const relatedExecution =
    decision == null
      ? null
      : (input.authoritativeExecutions ?? []).find((item) => item.decisionId === decision.decisionId) ?? null;
  const relatedOutcome =
    relatedExecution == null
      ? null
      : (input.authoritativeOutcomeObservations ?? []).find((item) => item.executionId === relatedExecution.executionId) ??
        null;
  const outcomeRelevant = relatedOutcome != null || relatedExecution?.status === "completed";
  const overlayJourney = committed
    ? outcomeRelevant
      ? ("AWAITING_OUTCOME" as const)
      : started
        ? ("EXECUTING" as const)
        : ("AWAITING_DECISION" as const)
    : null;
  const overlaySubject =
    decision == null
      ? null
      : outcomeRelevant
        ? Object.freeze({
            id: relatedOutcome?.observationId ?? `outcome-pending:${relatedExecution?.executionId ?? decision.decisionId}`,
            kind: "outcome" as const,
            label: relatedOutcome?.measure ?? "Outcome",
            authority: "catalog" as const,
          })
        : started
        ? Object.freeze({
            id: relatedExecution?.executionId ?? decision.decisionId,
            kind: "execution" as const,
            label: relatedExecution?.title ?? decision.title,
            authority: "catalog" as const,
          })
        : Object.freeze({
            id: decision.decisionId,
            kind: "decision" as const,
            label: decision.title,
            authority: "catalog" as const,
          });
  if (input.sceneSemanticInput != null) {
    if (overlayJourney == null || input.sceneSemanticInput.explicitCollectionRequest) {
      return input.sceneSemanticInput;
    }
    return emptyNexoraDecisionTheatreSceneSemanticInput({
      ...input.sceneSemanticInput,
      journeyState: overlayJourney,
      journeyPhase: outcomeRelevant ? ("OUTCOME" as const) : input.sceneSemanticInput.journeyPhase,
      canonicalOperation: outcomeRelevant ? "STATUS" : input.sceneSemanticInput.canonicalOperation,
      communicativeIntent: outcomeRelevant ? "ASK_STATUS" : input.sceneSemanticInput.communicativeIntent,
      comparison: input.sceneSemanticInput.comparison
        ? Object.freeze({
            ...input.sceneSemanticInput.comparison,
            active: false,
          })
        : input.sceneSemanticInput.comparison,
      namedSubject: overlaySubject ?? input.sceneSemanticInput.namedSubject,
    });
  }
  const focused = input.stageState.focusedSubject;
  const collection = input.stageState.collectionContext;
  const reserved = input.requestedTheatreCapability ?? resolveReservedTheatreRequest(input.managerQuestion);
  return emptyNexoraDecisionTheatreSceneSemanticInput({
    managerQuestionRef: input.managerInteractionRef ?? null,
    canonicalSemanticResultRef: [
      "stage",
      input.stageState.mode,
      collection?.category ?? "none",
      focused?.id ?? "none",
      input.directorPlan?.intent ?? "none",
    ].join(":"),
    activeExecutiveContextRef: input.executiveContext?.currentSubject?.subjectId ?? focused?.id ?? null,
    journeyState: overlayJourney,
    journeyPhase: outcomeRelevant ? ("OUTCOME" as const) : null,
    canonicalOperation: outcomeRelevant ? "STATUS" : null,
    communicativeIntent: outcomeRelevant ? "ASK_STATUS" : null,
    namedSubject: overlaySubject,
    focalExecutiveObject:
      focused != null
        ? Object.freeze({
            id: focused.id,
            kind: focused.kind ?? null,
            label: focused.label ?? null,
            authority: "catalog" as const,
          })
        : null,
    activeCollection:
      collection != null
        ? Object.freeze({
            kind: String(collection.category),
            memberIds: Object.freeze(collection.objectIds.slice()),
          })
        : null,
    unsupportedRequest: reserved != null,
    reservedCapability: reserved,
  });
}

function visibilityOf(
  object: NexoraMVPStageObjectPresentation,
): NexoraDecisionTheatreObjectVisibility {
  if (object.disclosureState === "visible-primary") return "visible-primary";
  if (object.disclosureState === "visible-related") return "visible-related";
  if (object.disclosureState === "background-discoverable") return "background-discoverable";
  if (object.disclosureState === "collapsed-thread") return "collapsed-thread";
  if (object.disclosureState === "hidden" || object.spatialRole === "hidden") return "hidden";
  if ((object.opacity ?? 1) <= 0.05) return "hidden";
  if (object.role === "focused") return "visible-primary";
  if (object.role === "related") return "visible-related";
  if (object.role === "unrelated" || object.role === "peripheral") return "background-discoverable";
  return "visible-related";
}

function presenceReason(
  object: NexoraDecisionTheatreExecutiveObject,
  collectionLabel: string | null,
  overview: boolean,
): string {
  if (collectionLabel != null && object.visibility !== "hidden") {
    return "Shown as a member of the current collection";
  }
  if (object.focused) return "Currently focused";
  if (object.visibility === "visible-related") return "Related to the focused object";
  if (object.visibility === "background-discoverable") return "Kept in the background";
  if (object.visibility === "hidden") return "Not currently disclosed";
  if (overview) return "Visible in the current overview";
  return "Present on the current Stage";
}

const COLLECTION_ELIGIBLE = new Set([
  "problem",
  "scenario",
  "decision",
  "execution",
  "goal",
  "risk",
  "opportunity",
]);

function mapObject(
  object: NexoraMVPStageObjectPresentation,
  focusedId: string | null,
  selectedId: string | null,
  presentationLevel: string,
): Omit<NexoraDecisionTheatreExecutiveObject, "presenceReason" | "semanticRelationshipIds"> {
  const visibility = visibilityOf(object);
  const canonicalObjectType = resolveCanonicalExecutiveObjectType({
    id: object.id,
    kind: object.kind,
    label: object.label,
  });
  return {
    visualFamily: "EXECUTIVE_OBJECT",
    id: object.id,
    label: object.label,
    kind: object.kind,
    canonicalObjectType,
    authoritativeSource: "NEX-MVP:4/catalog",
    lifecycleStatus: object.status ?? null,
    visibility,
    focused: object.focused === true || object.id === focusedId,
    selected: object.selected === true || object.id === selectedId,
    attention: object.attention,
    presentationRole: object.role,
    presentationLevel,
    evidenceRef: null,
    provenanceRef: null,
    advisorIdentity: object.label,
    stageNavigationEligible: true,
    collectionEligible: COLLECTION_ELIGIBLE.has(canonicalObjectType) || COLLECTION_ELIGIBLE.has(object.kind),
    rendererPresentationIdentity: object.id,
  };
}

export function projectNexoraDecisionTheatreFoundation(
  input: NexoraDecisionTheatreProjectionInput,
): NexoraDecisionTheatreFoundation {
  const catalog = input.catalog ?? getDefaultNexoraMVPObjectInteractionCatalog();
  const presentation: NexoraMVPStageInteractionPresentation =
    deriveNexoraMVPStageInteractionPresentation(input.stageState, catalog, {
      consultExecutiveChangeSessionStore: false,
    });
  const focusedId = presentation.focusedSubjectId;
  const selectedId = presentation.selectedSubjectId;
  const collection = input.stageState.collectionContext ?? null;
  const collectionLabel =
    collection != null
      ? EXECUTIVE_QUEUE_CATEGORY_LABELS[collection.category] ?? collection.category
      : null;
  const overview = presentation.presentationMode === "overview" || input.stageState.mode === "overview";
  const mapped = presentation.scene.objects
    .slice()
    .sort((left, right) => left.id.localeCompare(right.id))
    .map((object) => {
      const base = mapObject(object, focusedId, selectedId, input.stageState.presentationState);
      return {
        ...base,
        presenceReason: presenceReason(
          { ...base, presenceReason: "", semanticRelationshipIds: Object.freeze([]) },
          collectionLabel,
          overview,
        ),
      };
    });
  const hiddenIds = mapped
    .filter((item) => item.visibility === "hidden")
    .map((item) => item.id);
  const relationships: NexoraDecisionTheatreRelationship[] = presentation.scene.connections
    .filter((connection) => connection.visualRole !== "hidden" && (connection.opacity ?? 1) > 0)
    .slice()
    .sort((left, right) => left.id.localeCompare(right.id))
    .map((connection) =>
      Object.freeze({
        id: connection.id,
        sourceId: connection.sourceId,
        targetId: connection.targetId,
        semanticRelation: connection.relation ?? null,
        impliesCausality: false as const,
        candidateMeansConfirmed: false as const,
      }),
    );
  const mappedWithRelationships = mapped.map((item) =>
    Object.freeze({
      ...item,
      semanticRelationshipIds: Object.freeze(
        relationships
          .filter((relationship) => relationship.sourceId === item.id || relationship.targetId === item.id)
          .map((relationship) => relationship.id),
      ),
    }),
  );
  const visible = mappedWithRelationships.filter((item) => item.visibility !== "hidden");
  const catalogExecutiveIds = Object.freeze([
    ...catalog.objects.map((item) => item.id),
    ...catalog.contextSubjects.map((item) => item.id),
  ]);
  const iconicObjects = projectNexoraDecisionTheatreIconicObjects({
    visibleExecutives: visible,
    focusedExecutiveId: focusedId,
    relationships,
    catalogExecutiveIds,
    sources: input.iconicAuthoritativeSources,
  });
  const visualGrammar = projectNexoraDecisionTheatreVisualGrammar({
    executives: visible,
    iconicObjects,
    relationships,
    grammar: input.visualGrammarInput,
  });
  const warRoomAtmosphere = projectNexoraDecisionTheatreAtmosphere({
    ...(input.atmosphereAuthority ?? {}),
    sceneContextRef: input.atmosphereAuthority?.sceneContextRef ?? null,
  });
  const requestedUnsupported =
    input.requestedTheatreCapability ??
    resolveReservedTheatreRequest(input.managerQuestion);
  const sceneSemantic = reconstructSceneSemanticFromStage(input);
  const sceneIntent = resolveNexoraDecisionTheatreSceneIntent(sceneSemantic);
  const sceneScript = composeNexoraDecisionTheatreSceneScript({
    intent: sceneIntent,
    semantic: sceneSemantic,
    executives: visible,
    relationships,
    iconicObjects,
    visualGrammar,
    atmosphere: warRoomAtmosphere,
    presentationLevel: input.stageState.presentationState,
  });
  const attentionByObjectId = Object.freeze(
    Object.fromEntries(mapped.map((item) => [item.id, item.attention])),
  );
  const visibleIds = visible.map((item) => item.id).join(",");
  const theatreSceneIdentity = [
    "dth1",
    presentation.presentationMode ?? input.stageState.mode,
    collection?.category ?? "none",
    focusedId ?? "none",
    selectedId ?? "none",
    input.stageState.presentationState,
    visibleIds,
  ].join(":");
  const advisorReadable = buildNexoraDecisionTheatreAdvisorReadableContext({
    stageMode: presentation.presentationMode ?? input.stageState.mode,
    collectionLabel,
    presentationLevel: input.stageState.presentationState,
    focusedId,
    selectedId,
    objects: mappedWithRelationships,
    relationships,
    requestedUnsupported,
    iconicObjects,
    visualExplanations: visualGrammar.advisorVisualExplanations,
    atmosphereExplanation: Object.freeze({
      meaning: warRoomAtmosphere.advisorExplanation,
      supportedBy: warRoomAtmosphere.activationReason,
      remainsUnknown: warRoomAtmosphere.confidenceOrLimitation,
      doNotInfer: warRoomAtmosphere.prohibitedInferences.join("; "),
    }),
    sceneSummary: sceneScript.advisorReadable,
  });
  const theatreDraft: NexoraDecisionTheatreFoundation = {
    identity: nexoraDecisionTheatreFoundationIdentity,
    version: nexoraDecisionTheatreFoundationVersion,
    namespace: nexoraDecisionTheatreFoundationNamespace,
    lifecycle: "foundation",
    theatreSceneIdentity,
    activeExecutiveContext: Object.freeze({
      workspace: input.stageState.workspace,
      currentSubjectId:
        input.executiveContext?.currentSubject?.subjectId ??
        focusedId,
      presentedSetKind: input.executiveContext?.presentedSet?.kind ?? collection?.category ?? null,
    }),
    activeStageSceneIdentity: theatreSceneIdentity,
    primaryExecutiveObjectId: focusedId,
    selectedExecutiveObjectId: selectedId,
    visibleExecutiveObjects: Object.freeze(visible),
    hiddenExecutiveObjectIds: Object.freeze(hiddenIds),
    iconicObjects,
    visualLanguage: Object.freeze({
      identity: nexoraDecisionTheatreVisualLanguageIdentity,
      version: nexoraDecisionTheatreVisualLanguageVersion,
      iconicProjectionIdentity:
        iconicObjects.length === 0
          ? "none"
          : iconicObjects.map((item) => item.presentationId).join(","),
    }),
    visualGrammar,
    warRoomAtmosphere,
    sceneIntent,
    sceneScript,
    objectInvestigation: null,
    decisionComparison: null,
    decisionCommitment: null,
    executionReadiness: null,
    liveExecution: null,
    outcomeObservation: null,
    learningReassessment: null,
    relationships: Object.freeze(relationships),
    focusDistinctFromSelection: focusedId !== selectedId,
    presentationLevel: input.stageState.presentationState,
    attentionByObjectId,
    managerQuestionRef: input.managerQuestion?.trim() || null,
    managerInteractionRef: input.managerInteractionRef ?? null,
    sceneProvenance: Object.freeze({
      stageAuthority: "NEX-MVP:3/Nexora3DExecutiveStage" as const,
      interactionAuthority: "NEX-MVP:4/NexoraObjectInteraction" as const,
      directorAuthority: "DIR:1/SemanticPresentationDirectorStageIntentFoundation" as const,
      compatibilityAdapter: nexoraDecisionTheatreCompatibilityAdapterIdentity,
      adapterIsParallelAuthority: false as const,
      adapterRemovableWhen: "existing Stage natively implements this contract" as const,
      snapshotsRewritten: false as const,
      navigationHistoryDuplicated: false as const,
    }),
    runtimeAuthorityRefs: Object.freeze({
      objectInteraction: "NEX-MVP:4/NexoraObjectInteraction" as const,
      stagePresentation: "NEX-MVP:3/Nexora3DExecutiveStage" as const,
      director: "DIR:1/SemanticPresentationDirectorStageIntentFoundation" as const,
      conversationalExperience: "CC:5/ConversationalExperienceOrchestrator" as const,
      rexStageFoundationIdentity: "REX-2:1/RuntimeExecutiveStageExperienceFoundation" as const,
      decisionCommitment: "CC:10" as const,
      executionCommitment: "CC:11" as const,
    }),
    directorProjection: input.directorPlan
      ? Object.freeze({
          authority: "DIR:1/SemanticPresentationDirectorStageIntentFoundation" as const,
          intent: input.directorPlan.intent,
          stageEffect: input.directorPlan.stageEffect,
          mutationRequired: input.directorPlan.mutationRequired,
          businessMutationAllowed: false as const,
          createdBusinessFacts: false as const,
        })
      : null,
    advisorReadable,
    capabilities: Object.freeze({
      supported: NEXORA_DECISION_THEATRE_SUPPORTED_CAPABILITIES,
      unsupported: NEXORA_DECISION_THEATRE_RESERVED_CAPABILITIES,
      requestedUnsupported,
    }),
    authorityLayers: NEXORA_DECISION_THEATRE_AUTHORITY_LAYERS,
    visualFoundation: Object.freeze({
      stageIsFixed2D: true as const,
      objectsMayKeepLocal3D: true as const,
      decorativeAnimationIntroduced: false as const,
      inventedImportanceUrgencyCausalityOrConfidence: false as const,
    }),
    writes: Object.freeze({
      decisionState: false as const,
      executionState: false as const,
      outcome: false as const,
      learning: false as const,
      evidence: false as const,
      canonicalObjects: false as const,
      queueMembership: false as const,
      navigationTrail: false as const,
      topology: false as const,
    }),
  };
  const objectInvestigation = projectNexoraDecisionTheatreObjectInvestigation({
    theatre: theatreDraft,
    level: input.investigationLevel,
  });
  const decisionComparison = projectNexoraDecisionTheatreDecisionComparison({
    theatre: { ...theatreDraft, objectInvestigation },
    level: input.comparisonLevel,
    ncaActiveComparison: input.ncaActiveComparison,
    comparisonAuthority: input.comparisonAuthority,
    catalogMembers: Object.freeze([
      ...catalog.objects.map((item) => Object.freeze({ id: item.id, label: item.label, kind: item.kind })),
      ...catalog.contextSubjects.map((item) => Object.freeze({ id: item.id, label: item.label, kind: item.kind })),
    ]),
  });
  const decisionCommitment = projectNexoraDecisionTheatreDecisionCommitment({
    theatre: { ...theatreDraft, objectInvestigation, decisionComparison },
    reviewOpen: input.decisionReviewOpen,
    proposedCandidateId: input.proposedCandidateId,
    authoritativeDecisions: input.authoritativeDecisions,
    executionStarted: input.executionStarted,
    pendingConfirmation: input.pendingDecisionConfirmation,
  });
  const executionReadiness = projectNexoraDecisionTheatreExecutionReadiness({
    theatre: { ...theatreDraft, objectInvestigation, decisionComparison, decisionCommitment },
    authoritativeExecutions: input.authoritativeExecutions,
    executionRuntimeAvailable: input.executionRuntimeAvailable,
  });
  const liveExecution = projectNexoraDecisionTheatreLiveExecution({
    theatre: { ...theatreDraft, objectInvestigation, decisionComparison, decisionCommitment, executionReadiness },
    authoritativeExecutions: input.authoritativeExecutions,
  });
  const outcomeObservation = projectNexoraDecisionTheatreOutcomeObservation({
    theatre: {
      ...theatreDraft,
      objectInvestigation,
      decisionComparison,
      decisionCommitment,
      executionReadiness,
      liveExecution,
    },
    authoritativeExecutions: input.authoritativeExecutions,
    authoritativeOutcomeObservations: input.authoritativeOutcomeObservations,
  });
  const learningReassessment = projectNexoraDecisionTheatreLearningReassessment({
    theatre: {
      ...theatreDraft,
      objectInvestigation,
      decisionComparison,
      decisionCommitment,
      executionReadiness,
      liveExecution,
      outcomeObservation,
    },
    authoritativeOutcomeObservations: input.authoritativeOutcomeObservations,
    authoritativeAssumptions: input.authoritativeAssumptions,
  });
  const advisorReadableWithPresentation = Object.freeze({
    ...advisorReadable,
    investigation: objectInvestigation?.advisorReadable ?? null,
    comparison: decisionComparison?.advisorReadable ?? null,
    commitment: decisionCommitment?.advisorReadable ?? null,
    executionReadiness: executionReadiness?.advisorReadable ?? null,
    liveExecution: liveExecution?.advisorReadable ?? null,
    outcomeObservation: outcomeObservation?.advisorReadable ?? null,
    learningReassessment: learningReassessment?.advisorReadable ?? null,
    whatIsOnStage:
      learningReassessment?.advisorReadable.scene ??
      outcomeObservation?.advisorReadable.scene ??
      liveExecution?.advisorReadable.scene ??
      executionReadiness?.advisorReadable.scene ??
      advisorReadable.whatIsOnStage,
  });
  const theatre: NexoraDecisionTheatreFoundation = {
    ...theatreDraft,
    objectInvestigation,
    decisionComparison,
    decisionCommitment,
    executionReadiness,
    liveExecution,
    outcomeObservation,
    learningReassessment,
    advisorReadable: advisorReadableWithPresentation,
  };
  return freezeTree(theatre);
}
