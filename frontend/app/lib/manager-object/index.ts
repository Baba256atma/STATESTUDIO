export {
  managerObjectInteractionFoundationIdentity,
  managerObjectInteractionFoundationVersion,
  getManagerObjectInteractionFoundationIdentity,
  MANAGER_OBJECT_INTERACTION_BOUNDARY,
  MANAGER_OBJECT_INTENTS,
  MANAGER_OBJECT_KINDS,
  MANAGER_OBJECT_SUPPORT_STATUSES,
  MANAGER_OBJECT_AUTHORITY,
  type ManagerObjectIntent,
  type ManagerObjectKind,
  type ManagerObjectSupportStatus,
} from "./managerObjectInteractionFoundation.ts";

export {
  createEmptyManagerObjectSession,
  activateManagerObjectFromClick,
  resolveManagerObjectActivation,
  projectActiveObjectIdFromStage,
  type ManagerObjectSession,
} from "./managerObjectActive.ts";

export {
  collectManagerObjectContext,
  type ManagerObjectContext,
} from "./managerObjectContext.ts";

export {
  resolveManagerObjectIntent,
  findMentionedManagerObjectId,
  stripManagerObjectSignificanceQualifier,
} from "./managerObjectIntent.ts";

export {
  projectManagerObjectConversationalSubjects,
  MANAGER_OBJECT_REGISTERED_GOAL,
} from "./managerObjectCatalog.ts";

export {
  composeExecutiveObjectExplanation,
  resolveExplanationLens,
  verifyGenericExplainEngine,
  getGenericExplainEngineIdentity,
  GENERIC_EXPLAIN_ENGINE_BOUNDARY,
  genericExplainEngineIdentity,
} from "./managerObjectExplainEngine.ts";

export type {
  ExecutiveObjectExplanation,
  ExplanationDepth,
  ExplanationFocus,
  ExplanationEpistemicStatus,
} from "./managerObjectExplainTypes.ts";

export {
  buildManagerObjectExplainHandoffRequest,
  previewManagerObjectExplanation,
  MANAGER_OBJECT_EXPLAIN_HANDOFF_VERSION,
} from "./managerObjectExplainHandoff.ts";

export {
  composeExecutiveObjectExploration,
  resolveExplorationFollowUpTarget,
  verifyObjectGuidedExploration,
  getObjectGuidedExplorationIdentity,
  OBJECT_GUIDED_EXPLORATION_BOUNDARY,
  objectGuidedExplorationIdentity,
} from "./managerObjectExplorationEngine.ts";

export type {
  ExecutiveObjectExploration,
  ExecutiveExplorationPath,
  ManagerObjectExplorationAnchor,
} from "./managerObjectExplorationTypes.ts";

export {
  resolveManagerObjectTurn,
  verifyManagerObjectInteractionFoundation,
  type ManagerObjectTurn,
} from "./managerObjectInteraction.ts";

export {
  composeExecutiveGoalNavigation,
  verifyGoalDirectedNavigation,
  getGoalDirectedNavigationIdentity,
  GOAL_DIRECTED_NAVIGATION_BOUNDARY,
  goalDirectedNavigationIdentity,
} from "./managerObjectGoalNavigationEngine.ts";

export type {
  ExecutiveGoalContext,
  ExecutiveGoalNavigation,
} from "./managerObjectGoalTypes.ts";

export {
  resolveExecutiveGoalContext,
  parseExplicitGoalTitle,
} from "./managerObjectGoalContext.ts";

export {
  composeExecutiveJourneyIntelligence,
  verifyExecutiveJourneyIntelligence,
  getExecutiveJourneyIntelligenceIdentity,
  EXECUTIVE_JOURNEY_INTELLIGENCE_BOUNDARY,
  executiveJourneyIntelligenceIdentity,
} from "./managerObjectJourneyEngine.ts";

export type {
  ExecutiveJourneyIntelligence,
  JourneyPhase,
  JourneyState,
} from "./managerObjectJourneyTypes.ts";

export {
  composeExecutiveAttentionIntelligence,
  verifyExecutiveAttentionIntelligence,
  getExecutiveAttentionIntelligenceIdentity,
  EXECUTIVE_ATTENTION_INTELLIGENCE_BOUNDARY,
  executiveAttentionIntelligenceIdentity,
  isExecutiveAttentionUtterance,
} from "./managerObjectAttentionEngine.ts";

export type {
  ExecutiveAttentionIntelligence,
  ExecutiveAttentionItem,
  AttentionLevel,
  InterventionNeed,
} from "./managerObjectAttentionTypes.ts";

export {
  composeExecutiveManagerExperience,
  routeExecutiveManagerLane,
  verifyManagerObjectExperienceIntegration,
  getManagerObjectExperienceIntegrationIdentity,
  MANAGER_OBJECT_EXPERIENCE_BOUNDARY,
  managerObjectExperienceIntegrationIdentity,
} from "./managerObjectExperienceComposer.ts";

export type {
  ExecutiveManagerResponse,
  ExecutiveManagerLane,
} from "./managerObjectExperienceTypes.ts";

export {
  nexoraMvpFinal61NluIdentity,
  getNexoraMvpFinal61NluIdentity,
  verifyNexoraMvpFinal61Nlu,
  interpretManagerTurnMeaning,
  overlayConversationalIntentWithCanonicalMeaning,
  NEXORA_MVP_FINAL61_NLU_BOUNDARY,
} from "./nexoraMvpFinal61NaturalLanguageUnderstanding.ts";

export { interpretCanonicalManagerMeaning } from "./canonicalManagerMeaningInterpreter.ts";
export type { CanonicalManagerMeaning } from "./canonicalManagerMeaning.ts";

export {
  nexoraMvpFinal62ContinuityIdentity,
  getNexoraMvpFinal62ContinuityIdentity,
  verifyNexoraMvpFinal62Continuity,
  interpretContextualManagerTurn,
  applyContextualMeaningToIntent,
  updateConversationContinuity,
  NEXORA_MVP_FINAL62_CONTINUITY_BOUNDARY,
} from "./nexoraMvpFinal62ConversationContinuity.ts";
export {
  nexoraMvpFinal63ClarificationIdentity,
  getNexoraMvpFinal63ClarificationIdentity,
  verifyNexoraMvpFinal63Clarification,
  interpretClarificationTurn,
  applyResumedMeaningToIntent,
  NEXORA_MVP_FINAL63_CLARIFICATION_BOUNDARY,
  NEXORA_MVP_FINAL63_PRECEDENCE,
} from "./nexoraMvpFinal63SmartClarification.ts";
export {
  nexoraMvpFinal64CommunicationIdentity,
  getNexoraMvpFinal64CommunicationIdentity,
  verifyNexoraMvpFinal64Communication,
  composeTrustedExecutiveCommunication,
  NEXORA_MVP_FINAL64_COMMUNICATION_BOUNDARY,
} from "./nexoraMvpFinal64TrustedCommunication.ts";
export type {
  TrustedExecutiveCommunication,
  TrustedExecutiveClaim,
} from "./nexoraMvpFinal64CommunicationTypes.ts";
export {
  nexoraMvpFinal65GuidanceIdentity,
  getNexoraMvpFinal65GuidanceIdentity,
  verifyNexoraMvpFinal65Guidance,
  resolveGuidanceTurn,
  classifyGuidanceIntent,
  projectNexoraCapabilities,
  NEXORA_MVP_FINAL65_GUIDANCE_BOUNDARY,
} from "./nexoraMvpFinal65Guidance.ts";
export type {
  GuidanceTurnResult,
  GuidanceIntent,
  CapabilityAvailability,
} from "./nexoraMvpFinal65GuidanceTypes.ts";
export {
  nexoraNca1Identity,
  getNexoraNca1Identity,
  verifyNexoraNca1,
  interpretNcaTurn,
  refineOperationForManagerNeed,
  NEXORA_NCA1_BOUNDARY,
  NCA1_REFERENCE_PRECEDENCE,
} from "./nexoraNca1ConversationArchitecture.ts";
export type {
  ManagerConversationTurn,
  ManagerConversationNeed,
  AdvisorBehavior,
} from "./nexoraNca1ConversationTypes.ts";
export {
  nexoraNca2Identity,
  getNexoraNca2Identity,
  verifyNexoraNca2,
  interpretNcaDialogueTurn,
  createEmptyNcaConversationState,
  NEXORA_NCA2_BOUNDARY,
} from "./nexoraNca2ConversationState.ts";
export type {
  NexoraConversationState,
  DialogueMove,
} from "./nexoraNca2ConversationStateTypes.ts";
export {
  nexoraNca3Identity,
  getNexoraNca3Identity,
  verifyNexoraNca3,
  evaluateNca3QuestionStrategy,
  overlayNcaTurnWithQuestionStrategy,
  applyNca3StrategyToResponse,
  NEXORA_NCA3_BOUNDARY,
} from "./nexoraNca3QuestionIntelligence.ts";
export type {
  ExecutiveQuestionStrategy,
  ExecutiveInformationGap,
} from "./nexoraNca3QuestionIntelligenceTypes.ts";
export {
  nexoraNca4Identity,
  getNexoraNca4Identity,
  verifyNexoraNca4,
  evaluateNca4AdvisoryStrategy,
  applyNca4StrategyToResponse,
  NEXORA_NCA4_BOUNDARY,
} from "./nexoraNca4AdvisoryIntelligence.ts";
export type {
  ExecutiveAdvisoryStrategy,
  ExecutiveAdvisoryPosition,
} from "./nexoraNca4AdvisoryIntelligenceTypes.ts";
export {
  nexoraNca5Identity,
  getNexoraNca5Identity,
  verifyNexoraNca5,
  evaluateNca5InitiativeStrategy,
  applyNca5StrategyToResponse,
  createProactiveExecutiveSignal,
  NEXORA_NCA5_BOUNDARY,
} from "./nexoraNca5InitiativeIntelligence.ts";
export type {
  ExecutiveInitiativeStrategy,
  ProactiveExecutiveSignal,
} from "./nexoraNca5InitiativeIntelligenceTypes.ts";
export {
  nexoraNca6Identity,
  getNexoraNca6Identity,
  verifyNexoraNca6,
  evaluateNca6CommunicationStrategy,
  applyNca6StrategyToResponse,
  NEXORA_NCA6_BOUNDARY,
  ADVISOR_TRUST_CONTRACT,
} from "./nexoraNca6CommunicationIntelligence.ts";
export type {
  ExecutiveCommunicationStrategy,
  Nca6ManagerContextInput,
} from "./nexoraNca6CommunicationIntelligenceTypes.ts";
export {
  nexoraNca7Identity,
  getNexoraNca7Identity,
  verifyNexoraNca7,
  composeNca7TurnResult,
  NEXORA_NCA7_BOUNDARY,
  NCA7_CANONICAL_PRECEDENCE_NOTE,
} from "./nexoraNca7EndToEndOrchestration.ts";
export {
  nexoraNcaPost3Identity,
  getNexoraNcaPost3Identity,
  verifyNexoraNcaPost3,
  classifyNexoraSemanticScope,
  composeNexoraSemanticTurn,
  NEXORA_NCA_POST3_BOUNDARY,
} from "./nexoraNcaPost3SemanticScopeMultiEntityCanonicalCollectionWorkspaceIntelligence.ts";
export {
  nexoraNcaPost2Identity,
  getNexoraNcaPost2Identity,
  verifyNexoraNcaPost2,
  classifyManagerSpeechAct,
  interpretManagerProvidedObservation,
  interpretExecutiveCollectionQuery,
  NEXORA_NCA_POST2_BOUNDARY,
} from "./nexoraNcaPost2ManagerAssertionsPendingQuestionPrecedenceCollectionQuery.ts";
export type {
  NexoraConversationTurnResult,
  Nca7ResponseOwner,
} from "./nexoraNca7EndToEndOrchestrationTypes.ts";
export {
  createEmptyConversationContinuity,
  correctConversationSubject,
  repairConversationSubject,
} from "./conversationContinuitySnapshot.ts";
export type {
  ContextualManagerMeaning,
  ConversationContinuitySnapshot,
} from "./contextualManagerMeaning.ts";
