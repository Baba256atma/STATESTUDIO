/**
 * Conversational Control public surface
 * (CC:1 Intent → CC:2 Subject ← CC:7 projection → CC:6 Experience →
 *  CC:3 Command → CC:4 Runtime → CC:8 Recommendation? → CC:7 Context Update →
 *  CC:5 Feedback).
 *
 * MVP Runtime apply: @/app/lib/nex-mvp/nexoraMVPConversationalRuntimeBridge
 * Experience UI: NexoraConversationalExperience in Advisor.
 * Production Runtime entry: applyNexoraMVPConversationalCommand
 * Debug-only: nexora-cc4-dispatch event
 */

export {
  conversationalIntentFoundationIdentity,
  conversationalIntentFoundationVersion,
  conversationalIntentFoundationNamespace,
  conversationalIntentFoundationPhase,
  conversationalIntentFoundationArchitecturalRole,
  getConversationalIntentFoundationIdentity,
  CONVERSATIONAL_INTENT_BOUNDARY,
  NEXORA_CONVERSATIONAL_INTENT_KINDS,
  NEXORA_CONVERSATIONAL_EXECUTION_CLASSES,
  NEXORA_CONVERSATIONAL_INTENT_SOURCES,
  EXECUTION_CLASS_BY_INTENT_KIND,
  CONVERSATIONAL_INTENT_REASON,
  type ConversationalIntentFoundationIdentity,
  type NexoraConversationalIntentKind,
  type NexoraConversationalExecutionClass,
  type NexoraConversationalIntentSource,
  type NexoraConversationalTargetHint,
  type NexoraConversationalIntent,
  type NexoraConversationalIntentInput,
  type NexoraConversationalIntentTrace,
  type NexoraConversationalIntentResolution,
  type ConversationalIntentReasonCode,
} from "./conversationalIntent.ts";

export {
  normalizeNexoraConversationalUtterance,
  isAmbiguousConversationalReference,
  stripConversationalArticles,
} from "./conversationalIntentNormalization.ts";

export {
  resolveNexoraConversationalIntent,
  resolveNexoraConversationalIntentOnly,
} from "./conversationalIntentResolver.ts";

export {
  conversationalContextResolutionIdentity,
  conversationalContextResolutionVersion,
  conversationalContextResolutionNamespace,
  conversationalContextResolutionPhase,
  conversationalContextResolutionArchitecturalRole,
  getConversationalContextResolutionIdentity,
  CONVERSATIONAL_CONTEXT_BOUNDARY,
  CONVERSATIONAL_CONTEXT_PRECEDENCE,
  CONVERSATIONAL_CONTEXT_REASON,
  NEXORA_CONVERSATIONAL_SUBJECT_KINDS,
  NEXORA_CONVERSATIONAL_RESOLUTION_STATUSES,
  NEXORA_CONVERSATIONAL_RESOLUTION_SOURCES,
  type ConversationalContextResolutionIdentity,
  type NexoraConversationalSubjectKind,
  type NexoraConversationalResolutionStatus,
  type NexoraConversationalResolutionSource,
  type NexoraConversationalResolvedSubject,
  type NexoraConversationContextSnapshot,
  type NexoraActiveStageContextSnapshot,
  type NexoraConversationalSubjectRecord,
  type NexoraResolvedConversationalContext,
  type NexoraConversationalContextTrace,
  type NexoraConversationalContextResolution,
  type NexoraExecutiveConversationalContextInput,
  type ConversationalContextReasonCode,
} from "./conversationalContext.ts";

export {
  resolveNexoraExecutiveConversationalContext,
} from "./conversationalContextResolver.ts";

export {
  freezeConversationalSubjectRecord,
  buildNexoraConversationalSubjectMatchIndex,
  normalizeConversationalMatchKey,
  findCanonicalSubjectMatchesForHint,
  projectNexoraConversationalSubjectsFromCatalog,
  projectDefaultNexoraMvpConversationalSubjects,
  type NexoraConversationalSubjectMatchIndex,
  type NexoraConversationalSubjectProjectionSource,
} from "./conversationalSubjectRegistry.ts";

export {
  conversationalCommandMappingIdentity,
  conversationalCommandMappingVersion,
  conversationalCommandMappingNamespace,
  conversationalCommandMappingPhase,
  conversationalCommandMappingArchitecturalRole,
  getConversationalCommandMappingIdentity,
  CONVERSATIONAL_COMMAND_BOUNDARY,
  NEXORA_CONVERSATIONAL_COMMAND_KINDS,
  NEXORA_COMMAND_MAPPING_STATUSES,
  CONVERSATIONAL_COMMAND_REASON,
  type ConversationalCommandMappingIdentity,
  type NexoraConversationalCommandKind,
  type NexoraCommandMappingStatus,
  type NexoraConversationalCommand,
  type NexoraConversationalCommandTrace,
  type NexoraConversationalCommandMappingResult,
  type NexoraConversationalCommandMappingInput,
  type ConversationalCommandReasonCode,
} from "./conversationalCommand.ts";

export {
  CONVERSATIONAL_FOCUSABLE_SUBJECT_KINDS,
  CONVERSATIONAL_INTENT_COMMAND_RULES,
  findConversationalIntentCommandRule,
  isSubjectKindCompatibleWithCommand,
  isSecondarySubjectKindCompatible,
  type ConversationalCommandTargetRequirement,
  type ConversationalIntentCommandRule,
} from "./conversationalCommandPolicy.ts";

export {
  mapNexoraConversationalCommand,
  deriveNexoraConversationalCommandId,
} from "./conversationalCommandMapper.ts";

export {
  conversationalRuntimeBridgeIdentity,
  conversationalRuntimeBridgeVersion,
  conversationalRuntimeBridgeNamespace,
  conversationalRuntimeBridgePhase,
  conversationalRuntimeBridgeArchitecturalRole,
  getConversationalRuntimeBridgeIdentity,
  CONVERSATIONAL_RUNTIME_BRIDGE_BOUNDARY,
  NEXORA_RUNTIME_CONTROL_SOURCES,
  NEXORA_CONVERSATIONAL_RUNTIME_BRIDGE_STATUSES,
  NEXORA_CONVERSATIONAL_RUNTIME_ACTION_KINDS,
  CONVERSATIONAL_RUNTIME_BRIDGE_REASON,
  type ConversationalRuntimeBridgeIdentity,
  type NexoraRuntimeControlSource,
  type NexoraConversationalRuntimeBridgeStatus,
  type NexoraConversationalRuntimeActionKind,
  type NexoraConversationalRuntimeActionPlan,
  type NexoraConversationalRuntimeBridgeTrace,
  type NexoraConversationalRuntimeBridgeResult,
  type NexoraConversationalRuntimeBridgeInput,
  type ConversationalRuntimeBridgeReasonCode,
} from "./conversationalRuntimeBridge.ts";

export {
  mapConversationalCommandToRuntimeAction,
  type ConversationalCommandSupport,
} from "./conversationalRuntimeActionAdapter.ts";

export {
  dispatchNexoraConversationalCommand,
  planNexoraConversationalRuntimeDispatch,
} from "./conversationalRuntimeDispatch.ts";

export {
  conversationalExperienceIdentity,
  conversationalExperienceVersion,
  conversationalExperienceNamespace,
  conversationalExperiencePhase,
  conversationalExperienceArchitecturalRole,
  getConversationalExperienceIdentity,
  CONVERSATIONAL_EXPERIENCE_BOUNDARY,
  NEXORA_CONVERSATIONAL_EXPERIENCE_STATUSES,
  CONVERSATIONAL_EXPERIENCE_REASON,
  type ConversationalExperienceIdentity,
  type NexoraConversationalExperienceStatus,
  type NexoraConversationalMessageRole,
  type NexoraConversationalMessage,
  type NexoraConversationalExperienceTrace,
  type NexoraConversationalExperienceResult,
} from "./conversationalExperience.ts";

export {
  buildNexoraConversationalExperienceResponse,
} from "./conversationalExperienceResponse.ts";

export {
  executeNexoraConversationalExperience,
  submitExecutiveUtterance,
  type NexoraConversationalExperienceInput,
} from "./conversationalExperienceOrchestrator.ts";

export {
  conversationalExperienceControlIdentity,
  conversationalExperienceControlVersion,
  conversationalExperienceControlNamespace,
  conversationalExperienceControlPhase,
  conversationalExperienceControlArchitecturalRole,
  getConversationalExperienceControlIdentity,
  CONVERSATIONAL_EXPERIENCE_CONTROL_BOUNDARY,
  NEXORA_EXPERIENCE_CONTEXT_REASONS,
  NEXORA_EXPERIENCE_TRANSITION_DECISIONS,
  NEXORA_EXPERIENCE_RESOLUTION_STATUSES,
  CONVERSATIONAL_EXPERIENCE_CONTROL_REASON,
  type ConversationalExperienceControlIdentity,
  type NexoraExperienceContextReason,
  type NexoraExecutiveExperienceContext,
  type NexoraExperienceTransitionDecision,
  type NexoraExperienceResolutionStatus,
  type NexoraExperienceContextChange,
  type NexoraExecutiveExperienceTransitionPlan,
  type NexoraConversationalExperienceContextTrace,
  type NexoraConversationalExperienceContextResolution,
  type ConversationalExperienceControlReasonCode,
} from "./conversationalExperienceContext.ts";

export {
  NEXORA_REGISTERED_EXECUTIVE_EXPERIENCES,
  getNexoraRegisteredExecutiveExperiences,
  findRegisteredExperiencesForHint,
  type NexoraRegisteredExecutiveExperience,
} from "./conversationalExperienceRegistry.ts";

export {
  resolveNexoraConversationalExperienceContext,
  type NexoraConversationalExperienceContextInput,
} from "./conversationalExperienceContextResolver.ts";

export {
  buildNexoraExperienceContextChanges,
  planNexoraExecutiveExperienceTransition,
} from "./conversationalExperienceTransition.ts";

export {
  executiveContextAwarenessIdentity,
  executiveContextAwarenessVersion,
  executiveContextAwarenessNamespace,
  executiveContextAwarenessPhase,
  executiveContextAwarenessArchitecturalRole,
  getExecutiveContextAwarenessIdentity,
  EXECUTIVE_CONTEXT_AWARENESS_BOUNDARY,
  EXECUTIVE_CONTEXT_BOUNDS,
  EXECUTIVE_CONTEXT_REASON,
  type ExecutiveContextAwarenessIdentity,
  type ExecutiveContextReasonCode,
} from "./executiveContextAwareness.ts";

export {
  createEmptyNexoraExecutiveContextSnapshot,
  freezeExecutiveContextSnapshot,
  freezeExecutiveContextReference,
  NEXORA_EXECUTIVE_CONTEXT_REFERENCE_SOURCES,
  NEXORA_PRESENTED_EXECUTIVE_SET_KINDS,
  NEXORA_EXECUTIVE_CONTEXT_CHANGE_KINDS,
  type NexoraExecutiveContextReferenceSource,
  type NexoraExecutiveContextReference,
  type NexoraExecutiveContextCommandReference,
  type NexoraExecutiveContextRuntimeReference,
  type NexoraPresentedExecutiveSetKind,
  type NexoraPresentedExecutiveSet,
  type NexoraExecutiveContextSnapshot,
  type NexoraExecutiveContextChangeKind,
  type NexoraExecutiveContextChange,
  type NexoraExecutiveContextUpdateTrace,
  type NexoraExecutiveContextUpdateResult,
} from "./executiveContextSnapshot.ts";

export {
  updateNexoraExecutiveContext,
  presentedSetKindFromRevealCommand,
  type NexoraExecutiveContextUpdateInput,
} from "./executiveContextUpdater.ts";

export {
  projectExecutiveContextForConversation,
  toNexoraConversationContextSnapshot,
  projectExecutiveContextForAdvisorSummary,
  type NexoraExecutiveConversationContextProjection,
} from "./executiveContextProjection.ts";

export {
  executiveReasoningIdentity,
  executiveReasoningVersion,
  executiveReasoningNamespace,
  executiveReasoningPhase,
  executiveReasoningArchitecturalRole,
  getExecutiveReasoningIdentity,
  EXECUTIVE_REASONING_BOUNDARY,
  EXECUTIVE_REASONING_REASON,
  type ExecutiveReasoningIdentity,
  type ExecutiveReasoningReasonCode,
} from "./executiveReasoning.ts";

export {
  NEXORA_EXECUTIVE_EVIDENCE_SOURCE_KINDS,
  NEXORA_EXECUTIVE_RELATION_SUPPORT_KINDS,
  NEXORA_EXECUTIVE_TRADEOFF_DIMENSIONS,
  NEXORA_EXECUTIVE_RECOMMENDATION_KINDS,
  NEXORA_EXECUTIVE_RECOMMENDATION_STATUSES,
  NEXORA_RECOMMENDATION_STRENGTHS,
  type NexoraExecutiveEvidenceSourceKind,
  type NexoraExecutiveEvidenceReference,
  type NexoraExecutiveRelationSupportKind,
  type NexoraExecutiveEvidenceFact,
  type NexoraExecutiveEvidenceRelationship,
  type NexoraExecutiveReasoningEvidencePack,
  type NexoraExecutiveReason,
  type NexoraExecutiveTradeoffDimension,
  type NexoraExecutiveTradeoff,
  type NexoraExecutiveUncertainty,
  type NexoraExecutiveSuggestedAction,
  type NexoraExecutiveRecommendationKind,
  type NexoraExecutiveRecommendationStatus,
  type NexoraRecommendationStrength,
  type NexoraExecutiveRecommendation,
  type NexoraExecutiveRecommendationResult,
  type NexoraExecutiveRecommendationTrace,
} from "./executiveRecommendation.ts";

export type {
  NexoraExecutiveAssessment,
  NexoraExecutiveAssessmentIssue,
  NexoraExecutiveAssessmentOpportunity,
  NexoraExecutiveConstraint,
  NexoraExecutiveConflict,
  NexoraExecutivePrioritySignal,
} from "./executiveAssessment.ts";

export {
  assembleNexoraExecutiveReasoningEvidence,
  type NexoraExecutiveEvidenceAssemblyInput,
} from "./executiveRecommendationEvidence.ts";

export {
  EXECUTIVE_RECOMMENDATION_PRIORITY_POLICY,
  clampRecommendationConfidence,
  strengthFromConfidence,
  derivePriorityRank,
  hasCanonicalLink,
  relationshipSupportBetween,
  assessmentHasMaterialIssue,
} from "./executiveRecommendationPolicy.ts";

export {
  resolveNexoraExecutiveRecommendation,
  type NexoraExecutiveRecommendationInput,
} from "./executiveRecommendationResolver.ts";
