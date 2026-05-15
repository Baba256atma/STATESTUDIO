export type {
  DomainObjectTemplate,
  DomainPanelVocabulary,
  DomainRelationshipTemplate,
  DomainRiskSignal,
  NexoraDomainDefinition,
  NexoraDomainId,
} from "./domainTypes.ts";

export {
  NEXORA_DOMAIN_REGISTRY,
  getDefaultDomain,
  getDomainDefinition,
  isKnownDomainId,
  listDomainDefinitions,
} from "./domainRegistry.ts";

export {
  findDomainObjectTemplate,
  getDomainObjectTemplates,
  getDomainRiskSignals,
  inferDomainFromText,
  normalizeDomainId,
} from "./domainHelpers.ts";

export type { DomainObjectCatalogItem } from "./domainObjectCatalog.ts";
export {
  buildDomainObjectCatalog,
  getSuggestedVisualForRole,
} from "./domainObjectCatalog.ts";

export type { DomainSelectionState } from "./domainSelection.ts";
export {
  createDefaultDomainSelection,
  resolveDomainSelection,
} from "./domainSelection.ts";

export type { AddObjectMenuItem } from "./domainAddObjectAdapter.ts";
export { getAddObjectMenuItemsForDomain } from "./domainAddObjectAdapter.ts";
export { applyDomainCatalogSelectionToScene } from "./domainCatalogSelection.ts";

export type {
  DomainObjectCreationRequest,
  DomainObjectCreationResult,
} from "./domainObjectCreation.ts";
export { createDomainSceneObject } from "./domainObjectCreation.ts";

export type {
  DomainSceneInsertionRequest,
  DomainSceneInsertionResult,
} from "./domainSceneInsertion.ts";
export { insertDomainObjectIntoScene } from "./domainSceneInsertion.ts";

export type {
  DomainRelationshipGenerationResult,
  DomainRelationshipMatch,
} from "./domainRelationshipEngine.ts";
export { generateDomainRelationships } from "./domainRelationshipEngine.ts";
export type {
  DomainRelationshipMeta,
  DomainRelationshipSemantic,
} from "./domainRelationshipTypes.ts";
export { inferDomainRelationshipMeta } from "./domainRelationshipRules.ts";
export type { EnrichedDomainRelationship } from "./enrichDomainRelationships.ts";
export { enrichDomainRelationships } from "./enrichDomainRelationships.ts";
export { explainDomainRelationship } from "./domainRelationshipExplanation.ts";

export type { DomainEdgeCreationResult } from "./domainEdgeFactory.ts";
export { createDomainEdges } from "./domainEdgeFactory.ts";

export type { DomainGraphInsertionResult } from "./domainGraphInsertion.ts";
export { insertDomainRelationshipsIntoScene } from "./domainGraphInsertion.ts";

export type {
  DomainChatEntity,
  DomainChatIntent,
  DomainChatInterpretation,
} from "./domainChatIntents.ts";
export type { PlannedDomainAction } from "./domainActionPlanner.ts";
export { buildDomainActionPlan } from "./domainActionPlanner.ts";
export { extractDomainEntities } from "./domainEntityExtraction.ts";
export { interpretDomainChatMessage } from "./domainChatInterpreter.ts";
export { summarizeDomainInterpretation } from "./domainInterpretationSummary.ts";

export type {
  DomainRiskSeverity,
  DomainRiskSignalResult,
} from "./domainRiskSignals.ts";
export type { DomainFragilityScore } from "./domainFragilityScoring.ts";
export { calculateObjectFragilityScores } from "./domainFragilityScoring.ts";
export { evaluateDomainRiskSignals } from "./domainRiskEvaluator.ts";
export type { DomainPropagationHint } from "./domainPropagationHints.ts";
export { deriveDomainPropagationHints } from "./domainPropagationHints.ts";
export type {
  DomainPropagationEvent,
  DomainTimelineFrame,
} from "./domainTimelinePropagation.ts";
export { buildDomainPropagationFrames } from "./domainPropagationBuilder.ts";
export { buildPropagationVisualizationState } from "./domainPropagationVisualization.ts";
export { summarizePropagationTimeline } from "./domainTimelineSummary.ts";
export { buildDomainRiskSceneAnnotations } from "./domainRiskSceneAnnotations.ts";
export { summarizeDomainRiskSignals } from "./domainRiskSummary.ts";

export type {
  DomainScenario,
  DomainScenarioActionType,
  DomainScenarioImpact,
  DomainScenarioSeverity,
  DomainScenarioType,
} from "./domainScenarioTypes.ts";
export { generateDomainScenarios } from "./domainScenarioGenerator.ts";
export { deriveDomainScenarios } from "./deriveDomainScenarios.ts";
export { matchDomainScenarioRules } from "./domainScenarioRules.ts";
export type {
  DomainScenarioIntelligencePriority,
  DomainScenarioIntelligenceScore,
} from "./domainScenarioIntelligenceScoring.ts";
export { scoreDomainScenarioIntelligence } from "./domainScenarioIntelligenceScoring.ts";
export {
  buildDomainScenarioExecutiveSummary,
  buildDomainScenarioProbableImpact,
  buildDomainScenarioRecommendedFocus,
  buildDomainScenarioTitle,
} from "./domainScenarioNarratives.ts";
export type { DomainScenarioOverlayState } from "./domainScenarioOverlays.ts";
export { buildDomainScenarioOverlayState } from "./domainScenarioOverlays.ts";
export type { DomainScenarioScore } from "./domainScenarioScoring.ts";
export { scoreDomainScenarios } from "./domainScenarioScoring.ts";
export type { DomainScenarioComparison } from "./domainScenarioComparison.ts";
export { compareDomainScenarios } from "./domainScenarioComparison.ts";
export type {
  DomainExecutiveInsight,
  ExecutiveDecisionPosture,
  ExecutivePriority,
} from "./domainExecutiveIntelligence.ts";
export { buildExecutiveInsights } from "./domainExecutiveSynthesis.ts";
export type { ExecutivePriorityResult } from "./domainExecutivePrioritization.ts";
export { prioritizeExecutiveInsights } from "./domainExecutivePrioritization.ts";
export {
  buildExecutiveRecommendations,
  buildExecutiveScenarioRecommendation,
} from "./domainExecutiveRecommendations.ts";
export { buildExecutiveBriefing } from "./domainExecutiveBriefing.ts";
export { explainExecutiveInsight } from "./domainExecutiveExplainability.ts";
export { deriveScenarioHighlightHints } from "./domainScenarioHighlights.ts";
export type { DomainArchitectureWarning } from "./domainArchitectureAudit.ts";
export { auditDomainArchitecture } from "./domainArchitectureAudit.ts";
export type { DomainValidationResult } from "./domainContractValidation.ts";
export {
  validateDomainEdge,
  validateDomainExecutiveInsight,
  validateDomainObject,
  validateDomainRiskSignal,
  validateDomainScenario,
} from "./domainContractValidation.ts";
export type {
  DomainProjectLoadResult,
  DomainProjectSaveResult,
  DomainProjectSnapshot,
  DomainProjectVersion,
} from "./domainProjectTypes.ts";
export { buildDomainProjectSnapshot } from "./domainProjectSnapshot.ts";
export {
  isDomainProjectSnapshot,
  validateDomainProjectSnapshot,
} from "./domainProjectValidation.ts";
export { restoreDomainProjectScene } from "./domainProjectRestore.ts";
export {
  DOMAIN_PROJECT_STORAGE_KEY,
  clearDomainProjectSnapshot,
  loadDomainProjectSnapshot,
  saveDomainProjectSnapshot,
} from "./domainProjectStorage.ts";
export {
  buildDomainSignature,
  dedupeBySignature,
  domainActionDedupeSignature,
  domainEdgeDedupeSignature,
  domainObjectDedupeSignature,
  domainScenarioDedupeSignature,
  domainSignalDedupeSignature,
} from "./domainDedupe.ts";
