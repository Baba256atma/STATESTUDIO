/**
 * BCA:3 — read-only concept relationship interpretation.
 * Reuses BCA:1 confidence/confirmation/source refs. Does not own ESI, DS:4, or causal graphs.
 */
import type { BusinessProjectConcept, ConceptFamilyRelevance, ConceptKnowledgeScope } from "./businessProjectConceptContract.ts";
import type {
  BusinessProjectContext,
  BusinessProjectContextConfidence,
  BusinessProjectContextKind,
  BusinessProjectSourceRef,
  ContextConfirmationState,
} from "./businessProjectContextContract.ts";

export const businessProjectRelationshipIntelligenceIdentity = "BCA:3/BusinessProjectRelationshipIntelligence" as const;

export const BUSINESS_PROJECT_RELATIONSHIP_BOUNDARY = Object.freeze({
  consumesBca1Context: true as const,
  consumesBca2Concepts: true as const,
  ownsRelationshipStore: false as const,
  ownsConceptRegistry: false as const,
  ownsEvidenceModel: false as const,
  ownsConfidenceModel: false as const,
  ownsSemanticResolver: false as const,
  ownsCausalAuthority: false as const,
  ownsDependencyAuthority: false as const,
  createsCausalEdges: false as const,
  createsObjectGraph: false as const,
  mutatesStage: false as const,
  mutatesDecisionTheatre: false as const,
  mutatesDecision: false as const,
  writesManagerConfirmation: false as const,
  persistsState: false as const,
  usesLlm: false as const,
  wiresAdvisor: false as const,
});

/** BCA:1 kinds plus structural/constraint forms. Causal edges are owned by existing causal authority, not BCA. */
export const BUSINESS_PROJECT_RELATIONSHIP_TYPES = Object.freeze([
  "RELEVANT_TO",
  "ASSOCIATED_WITH",
  "POTENTIALLY_RELATED_TO",
  "MEASURE_OF",
  "INDICATOR_OF",
  "BELONGS_TO",
  "PART_OF",
  "SUPPORTS_UNDERSTANDING_OF",
  "POTENTIALLY_CONSTRAINS",
  "DEPENDS_ON",
  "REQUIRES",
  "AFFECTED_BY_CONTEXT",
  "RELATED_THROUGH",
] as const);
export type BusinessProjectRelationshipType = (typeof BUSINESS_PROJECT_RELATIONSHIP_TYPES)[number];

export const BUSINESS_PROJECT_RELATIONSHIP_PRECEDENCE = Object.freeze([
  "MEASURE_OF",
  "INDICATOR_OF",
  "PART_OF",
  "BELONGS_TO",
  "DEPENDS_ON",
  "REQUIRES",
  "POTENTIALLY_CONSTRAINS",
  "RELEVANT_TO",
  "ASSOCIATED_WITH",
  "SUPPORTS_UNDERSTANDING_OF",
  "AFFECTED_BY_CONTEXT",
  "RELATED_THROUGH",
  "POTENTIALLY_RELATED_TO",
] as const);

export type RelationshipDirectionality = "DIRECTED" | "SYMMETRIC" | "CONTEXTUAL" | "UNKNOWN";
export type RelationshipScope = "GENERAL" | "ORGANIZATION" | "PROJECT" | "SOURCE" | "OBJECT" | "GOAL" | "CURRENT_DECISION_CONTEXT";
export type RelationshipCrossSourcePolicy = "NEVER" | "HYBRID_CONTEXT";
export type RelationshipRealityState = "NOT_ESTABLISHED";

export type BusinessProjectConceptRelationship = Readonly<{
  authority: typeof businessProjectRelationshipIntelligenceIdentity;
  relationshipId: string;
  fromConceptId: string;
  toConceptId: string;
  fromCanonicalMeaning: string;
  toCanonicalMeaning: string;
  relationshipType: BusinessProjectRelationshipType;
  kind: BusinessProjectRelationshipType;
  contextKinds: readonly Exclude<BusinessProjectContextKind, "UNKNOWN">[];
  conceptFamilies: readonly string[];
  directionality: RelationshipDirectionality;
  scope: RelationshipScope;
  knowledgeScopes: readonly ConceptKnowledgeScope[];
  evidence: readonly string[];
  provenance: readonly BusinessProjectSourceRef[];
  confidence: BusinessProjectContextConfidence;
  confirmationState: ContextConfirmationState;
  sourceRefs: readonly BusinessProjectSourceRef[];
  ambiguity: Readonly<{ preserved: boolean; note: string | null }>;
  currentRealityEstablished: false;
  causalityEstablished: false;
  currentReality: RelationshipRealityState;
  causal: false;
  suppressedForCurrentContext: boolean;
  rejectedInferences: readonly string[];
  domainRelevance: readonly ConceptFamilyRelevance[];
}>;

export type ManagerConfirmedConceptRelationship = Readonly<{
  fromMeaning: string;
  toMeaning: string;
  relationshipType: BusinessProjectRelationshipType;
  confirmationState: "MANAGER_CONFIRMED";
  sourceRef: BusinessProjectSourceRef;
  scope: "ORGANIZATION";
  stance: "AFFIRMS" | "CONTRARY";
}>;

export type ResolveBusinessProjectRelationshipInput = Readonly<{
  context: BusinessProjectContext;
  concepts: readonly BusinessProjectConcept[];
  managerConfirmedRelationships?: readonly ManagerConfirmedConceptRelationship[];
}>;

export type UnknownConceptPair = Readonly<{
  fromCanonicalMeaning: string;
  toCanonicalMeaning: string;
  state: "UNKNOWN";
  reason: string;
}>;

export type BusinessProjectRelationshipProjection = Readonly<{
  authority: typeof businessProjectRelationshipIntelligenceIdentity;
  contextId: string;
  relationships: readonly BusinessProjectConceptRelationship[];
  unknownPairs: readonly UnknownConceptPair[];
  omitted: readonly string[];
}>;

export type BusinessProjectRelationshipDiagnostics = Readonly<{
  contextId: string;
  comparedConcepts: readonly string[];
  relationshipTrace: readonly string[];
  selectedWhy: readonly string[];
  omitted: readonly string[];
  unknownPairs: readonly string[];
  strongerRelationsPreferred: readonly string[];
  causalityRejected: true;
  dependencyRejectedUnlessConfirmed: true;
  sourceLeakagePrevented: boolean;
  reusedAuthorities: readonly string[];
  causalInference: "NONE";
  mutatesAuthorities: false;
}>;
