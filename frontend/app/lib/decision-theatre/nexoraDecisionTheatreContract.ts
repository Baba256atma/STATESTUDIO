/**
 * DTH:1 — Decision Theatre capability contract.
 *
 * Renderer-neutral, immutable description of the Theatre projection layer.
 * Not a source of business, decision, execution, evidence, outcome, or learning truth.
 */

export const nexoraDecisionTheatreFoundationIdentity =
  "DTH:1/DecisionTheatreFoundation" as const;
export const nexoraDecisionTheatreFoundationVersion = "1.0.0" as const;
export const nexoraDecisionTheatreFoundationNamespace =
  "nexora.decision-theatre.foundation" as const;
export const nexoraDecisionTheatreCompatibilityAdapterIdentity =
  "DTH:1/ExistingStageCompatibilityAdapter" as const;

export const NEXORA_DECISION_THEATRE_ROLES = Object.freeze({
  stage: "visual environment where the active decision situation is presented",
  executiveObjects: "real managerial entities appearing as actors on Stage",
  director: "composes authoritative executive context for presentation",
  advisor: "explains the visible scene and guides the manager",
  runtime: "supplies authoritative state and business truth",
  nexoGraph: "visual language of Decision Theatre",
  nexoTime: "future temporal and replay experience",
  manager: "final decision-maker",
} as const);

export const NEXORA_DECISION_THEATRE_SUPPORTED_CAPABILITIES = Object.freeze([
  "existing-stage-projection",
  "executive-object-actors",
  "executive-versus-iconic-object-language",
  "focus-selection-separation",
  "semantic-relationship-projection",
  "visibility-preservation",
  "presentation-level-preservation",
  "attention-preservation",
  "related-one-hop-disclosure",
  "collection-presentation",
  "navigation-identity-preservation",
  "advisor-readable-summary",
  "developer-diagnostics",
  "nexo-graph-visual-grammar",
  "war-room-atmosphere",
  "scene-intent",
  "scene-script",
  "object-investigation",
  "decision-comparison",
  "decision-commitment",
  "execution-readiness",
  "live-execution",
  "outcome-observation",
  "learning-reassessment",
] as const);

export const NEXORA_DECISION_THEATRE_RESERVED_CAPABILITIES = Object.freeze([
  "visual-behavior-engine",
  "object-investigation-cards-and-charts",
  "nexo-lens-library",
  "nexo-select-scenario-theatre",
  "nexo-compare-decision-arena",
  "nexo-time-and-theatre-replay",
  "theatre-aware-advisor-suggestions",
] as const);

export type NexoraDecisionTheatreSupportedCapability =
  (typeof NEXORA_DECISION_THEATRE_SUPPORTED_CAPABILITIES)[number];
export type NexoraDecisionTheatreReservedCapability =
  (typeof NEXORA_DECISION_THEATRE_RESERVED_CAPABILITIES)[number];

export const NEXORA_DECISION_THEATRE_AUTHORITY_LAYERS = Object.freeze({
  runtimeTruth: "Runtime authorities remain the source of business truth",
  semanticMeaning: "Existing semantic relationships and collection membership",
  directorPresentation: "DIR:1 presentation decisions; never business facts",
  rendererState: "Existing Stage renderer state; Theatre does not render",
  advisorExplanation: "Read-only scene summary for later Advisor consumption",
  managerInteraction: "Click and conversation references; not a second intent store",
} as const);

export type NexoraDecisionTheatreObjectVisibility =
  | "visible-primary"
  | "visible-related"
  | "background-discoverable"
  | "collapsed-thread"
  | "hidden";

export type NexoraDecisionTheatreExecutiveObject = Readonly<{
  visualFamily: "EXECUTIVE_OBJECT";
  id: string;
  label: string;
  kind: string;
  canonicalObjectType: import("./nexoraDecisionTheatreVisualFamily.ts").NexoraDecisionTheatreCanonicalObjectType;
  authoritativeSource: "NEX-MVP:4/catalog";
  lifecycleStatus: string | null;
  visibility: NexoraDecisionTheatreObjectVisibility;
  focused: boolean;
  selected: boolean;
  attention: string;
  presentationRole: string;
  presentationLevel: string;
  presenceReason: string;
  semanticRelationshipIds: readonly string[];
  evidenceRef: string | null;
  provenanceRef: string | null;
  advisorIdentity: string;
  stageNavigationEligible: true;
  collectionEligible: boolean;
  rendererPresentationIdentity: string;
}>;

export type NexoraDecisionTheatreRelationship = Readonly<{
  id: string;
  sourceId: string;
  targetId: string;
  semanticRelation: string | null;
  impliesCausality: false;
  candidateMeansConfirmed: false;
}>;

export type NexoraDecisionTheatreCapabilitySupport = Readonly<{
  supported: readonly NexoraDecisionTheatreSupportedCapability[];
  unsupported: readonly NexoraDecisionTheatreReservedCapability[];
  requestedUnsupported: NexoraDecisionTheatreReservedCapability | null;
}>;

export type NexoraDecisionTheatreRuntimeAuthorityRefs = Readonly<{
  objectInteraction: "NEX-MVP:4/NexoraObjectInteraction";
  stagePresentation: "NEX-MVP:3/Nexora3DExecutiveStage";
  director: "DIR:1/SemanticPresentationDirectorStageIntentFoundation";
  conversationalExperience: "CC:5/ConversationalExperienceOrchestrator";
  rexStageFoundationIdentity: "REX-2:1/RuntimeExecutiveStageExperienceFoundation";
  decisionCommitment: "CC:10";
  executionCommitment: "CC:11";
}>;

export type NexoraDecisionTheatreAdvisorReadableIconicContext = Readonly<{
  ownerLabel: string;
  meaning: string;
  authoritativeSource: string;
  value: string | null;
  unit: string | null;
  epistemicStatus: string;
  confidenceOrLimitation: string;
  whyVisible: string;
  mustNotInterpretAs: readonly string[];
}>;

export type NexoraDecisionTheatreAdvisorReadableContext = Readonly<{
  whatIsOnStage: string;
  focusedObject: string | null;
  selectedObject: string | null;
  visibleObjectLabels: readonly string[];
  whyPresent: readonly string[];
  relationshipsShown: readonly string[];
  presentationLevel: string;
  unavailable: readonly string[];
  supportedCapabilities: readonly string[];
  iconicObjects: readonly NexoraDecisionTheatreAdvisorReadableIconicContext[];
  visualExplanations: readonly NexoraDecisionTheatreAdvisorVisualExplanation[];
  atmosphere: Readonly<{
    meaning: string;
    supportedBy: string;
    remainsUnknown: string;
    doNotInfer: string;
  }>;
  scene: import("./nexoraDecisionTheatreSceneScript.ts").NexoraDecisionTheatreAdvisorSceneSummary;
  investigation: import("./nexoraDecisionTheatreObjectInvestigation.ts").NexoraDecisionTheatreAdvisorInvestigationSummary | null;
  comparison: import("./nexoraDecisionTheatreDecisionComparison.ts").NexoraDecisionTheatreAdvisorComparisonSummary | null;
  commitment: import("./nexoraDecisionTheatreDecisionCommitment.ts").NexoraDecisionTheatreAdvisorCommitmentSummary | null;
  executionReadiness: import("./nexoraDecisionTheatreExecutionReadiness.ts").NexoraDecisionTheatreAdvisorExecutionReadinessSummary | null;
  liveExecution: import("./nexoraDecisionTheatreLiveExecution.ts").NexoraDecisionTheatreAdvisorLiveExecutionSummary | null;
  outcomeObservation: import("./nexoraDecisionTheatreOutcomeObservation.ts").NexoraDecisionTheatreAdvisorOutcomeObservationSummary | null;
  learningReassessment: import("./nexoraDecisionTheatreLearningReassessment.ts").NexoraDecisionTheatreAdvisorLearningSummary | null;
}>;

export type NexoraDecisionTheatreAdvisorVisualExplanation = Readonly<{
  subject: string;
  appearance: string;
  meaning: string;
  supportedBy: string;
  remainsUnknown: string;
  doNotInfer: string;
}>;

export type NexoraDecisionTheatreFoundation = Readonly<{
  identity: typeof nexoraDecisionTheatreFoundationIdentity;
  version: typeof nexoraDecisionTheatreFoundationVersion;
  namespace: typeof nexoraDecisionTheatreFoundationNamespace;
  lifecycle: "foundation";
  theatreSceneIdentity: string;
  activeExecutiveContext: Readonly<{
    workspace: string;
    currentSubjectId: string | null;
    presentedSetKind: string | null;
  }>;
  activeStageSceneIdentity: string;
  primaryExecutiveObjectId: string | null;
  selectedExecutiveObjectId: string | null;
  visibleExecutiveObjects: readonly NexoraDecisionTheatreExecutiveObject[];
  hiddenExecutiveObjectIds: readonly string[];
  iconicObjects: readonly import("./nexoraDecisionTheatreIconicProjection.ts").NexoraDecisionTheatreIconicObject[];
  visualLanguage: Readonly<{
    identity: "DTH:2/ExecutiveAndIconicObjectLanguage";
    version: "1.0.0";
    iconicProjectionIdentity: string;
  }>;
  visualGrammar: import("./nexoraDecisionTheatreVisualProjection.ts").NexoraDecisionTheatreVisualGrammarProjection;
  warRoomAtmosphere: import("./nexoraDecisionTheatreAtmosphere.ts").NexoraDecisionTheatreAtmosphereProjection;
  sceneIntent: import("./nexoraDecisionTheatreSceneIntent.ts").NexoraDecisionTheatreSceneIntent;
  sceneScript: import("./nexoraDecisionTheatreSceneScript.ts").NexoraDecisionTheatreSceneScript;
  objectInvestigation: import("./nexoraDecisionTheatreObjectInvestigation.ts").NexoraDecisionTheatreObjectInvestigation | null;
  decisionComparison: import("./nexoraDecisionTheatreDecisionComparison.ts").NexoraDecisionTheatreDecisionComparison | null;
  decisionCommitment: import("./nexoraDecisionTheatreDecisionCommitment.ts").NexoraDecisionTheatreDecisionCommitment | null;
  executionReadiness: import("./nexoraDecisionTheatreExecutionReadiness.ts").NexoraDecisionTheatreExecutionReadiness | null;
  liveExecution: import("./nexoraDecisionTheatreLiveExecution.ts").NexoraDecisionTheatreLiveExecution | null;
  outcomeObservation: import("./nexoraDecisionTheatreOutcomeObservation.ts").NexoraDecisionTheatreOutcomeObservation | null;
  learningReassessment: import("./nexoraDecisionTheatreLearningReassessment.ts").NexoraDecisionTheatreLearningReassessment | null;
  relationships: readonly NexoraDecisionTheatreRelationship[];
  focusDistinctFromSelection: boolean;
  presentationLevel: string;
  attentionByObjectId: Readonly<Record<string, string>>;
  managerQuestionRef: string | null;
  managerInteractionRef: string | null;
  sceneProvenance: Readonly<{
    stageAuthority: "NEX-MVP:3/Nexora3DExecutiveStage";
    interactionAuthority: "NEX-MVP:4/NexoraObjectInteraction";
    directorAuthority: "DIR:1/SemanticPresentationDirectorStageIntentFoundation";
    compatibilityAdapter: typeof nexoraDecisionTheatreCompatibilityAdapterIdentity;
    adapterIsParallelAuthority: false;
    adapterRemovableWhen: "existing Stage natively implements this contract";
    snapshotsRewritten: false;
    navigationHistoryDuplicated: false;
  }>;
  runtimeAuthorityRefs: NexoraDecisionTheatreRuntimeAuthorityRefs;
  directorProjection: Readonly<{
    authority: "DIR:1/SemanticPresentationDirectorStageIntentFoundation";
    intent: string | null;
    stageEffect: string | null;
    mutationRequired: boolean;
    businessMutationAllowed: false;
    createdBusinessFacts: false;
  }> | null;
  advisorReadable: NexoraDecisionTheatreAdvisorReadableContext;
  capabilities: NexoraDecisionTheatreCapabilitySupport;
  authorityLayers: typeof NEXORA_DECISION_THEATRE_AUTHORITY_LAYERS;
  visualFoundation: Readonly<{
    stageIsFixed2D: true;
    objectsMayKeepLocal3D: true;
    decorativeAnimationIntroduced: false;
    inventedImportanceUrgencyCausalityOrConfidence: false;
  }>;
  writes: Readonly<{
    decisionState: false;
    executionState: false;
    outcome: false;
    learning: false;
    evidence: false;
    canonicalObjects: false;
    queueMembership: false;
    navigationTrail: false;
    topology: false;
  }>;
}>;
