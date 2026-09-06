import type {
  BusinessProjectContext,
  BusinessProjectContextConfidence,
  BusinessProjectContextKind,
  BusinessProjectSourceRef,
  ContextConfirmationState,
  ContextRelationshipKind,
} from "./businessProjectContextContract.ts";

export const businessProjectConceptIntelligenceIdentity = "BCA:2/BusinessProjectConceptIntelligence" as const;

export const BUSINESS_PROJECT_CONCEPT_BOUNDARY = Object.freeze({
  consumesBca1Context: true as const,
  consumesEstablishedSemantics: true as const,
  resolvesFieldMeaning: false as const,
  ownsGeneralConceptKnowledge: true as const,
  ownsOrganizationMeaning: false as const,
  establishesCurrentReality: false as const,
  createsObjects: false as const,
  createsGoals: false as const,
  createsKpis: false as const,
  createsProblemsOrRisks: false as const,
  createsCausalEdges: false as const,
  mutatesStage: false as const,
  mutatesDecision: false as const,
  persistsState: false as const,
  usesLlm: false as const,
});

export const BUSINESS_CONCEPT_FAMILIES = Object.freeze(["STRATEGY", "FINANCE", "OPERATIONS", "SALES", "MARKETING", "CUSTOMER", "SUPPLY_CHAIN", "PROCUREMENT", "PRODUCTION", "QUALITY", "PEOPLE", "SERVICE"] as const);
export const PROJECT_CONCEPT_FAMILIES = Object.freeze(["SCOPE", "SCHEDULE", "COST", "QUALITY", "RESOURCE", "RISK", "PROCUREMENT", "STAKEHOLDER", "DELIVERABLE", "MILESTONE", "DEPENDENCY"] as const);
export type BusinessProjectConceptFamily = (typeof BUSINESS_CONCEPT_FAMILIES)[number] | (typeof PROJECT_CONCEPT_FAMILIES)[number] | string;
export type BusinessProjectConceptState = "KNOWN" | "PARTIALLY_UNDERSTOOD" | "MULTI_CONTEXT" | "AMBIGUOUS" | "UNKNOWN";
export type ConceptKnowledgeScope = "GENERAL" | "ORGANIZATION_SPECIFIC";
export type ConceptRealityState = "NOT_ESTABLISHED";
export type ConceptContextAspect = "GENERAL" | "CURRENT_OPERATIONS" | "PLANNED_PROJECT";

export type ConceptFamilyRelevance = Readonly<{
  family: BusinessProjectConceptFamily;
  contextKind: Exclude<BusinessProjectContextKind, "UNKNOWN" | "HYBRID">;
  rank: "PRIMARY" | "ADDITIONAL";
  aspect: ConceptContextAspect;
}>;

export type ConceptAssociation = Readonly<{
  targetConcept: string;
  kind: Extract<ContextRelationshipKind, "RELEVANT_TO" | "ASSOCIATED_WITH" | "MEASURE_OF" | "POTENTIALLY_RELATED_TO">;
  causal: false;
}>;

export type BusinessProjectConceptDefinition = Readonly<{
  registryId: string;
  canonicalName: string;
  aliases: readonly string[];
  generalMeaning: string;
  contextKinds: readonly Exclude<BusinessProjectContextKind, "UNKNOWN">[];
  familyRelevance: readonly ConceptFamilyRelevance[];
  safeAssociations: readonly ConceptAssociation[];
  rejectedConclusions: readonly string[];
}>;

export type EstablishedSemanticMeaning = Readonly<{
  semanticId: string;
  meaning: string | null;
  state: "AUTHORITATIVE" | "MANAGER_CONFIRMED" | "LIKELY" | "AMBIGUOUS" | "UNKNOWN";
  candidates?: readonly string[];
  sourceRefs: readonly BusinessProjectSourceRef[];
}>;

export type OrganizationSpecificConceptMeaning = Readonly<{
  meaning: string;
  confirmationState: "MANAGER_CONFIRMED";
  sourceRef: BusinessProjectSourceRef;
}>;

export type BusinessProjectConcept = Readonly<{
  authority: typeof businessProjectConceptIntelligenceIdentity;
  conceptId: string;
  canonicalMeaning: string | null;
  contextKind: BusinessProjectContextKind;
  state: BusinessProjectConceptState;
  conceptFamilies: readonly BusinessProjectConceptFamily[];
  domainRelevance: readonly ConceptFamilyRelevance[];
  generalMeaning: string | null;
  organizationSpecificMeaning: OrganizationSpecificConceptMeaning | null;
  knowledgeScopes: readonly ConceptKnowledgeScope[];
  evidence: readonly string[];
  provenance: readonly BusinessProjectSourceRef[];
  confidence: BusinessProjectContextConfidence;
  confirmationState: ContextConfirmationState;
  sourceRefs: readonly BusinessProjectSourceRef[];
  ambiguity: Readonly<{ upstreamState: EstablishedSemanticMeaning["state"]; candidates: readonly string[]; preserved: boolean }>;
  contextualAssociations: readonly ConceptAssociation[];
  currentReality: ConceptRealityState;
  executiveObjectId: null;
  rejectedInferences: readonly string[];
}>;

export type ResolveBusinessProjectConceptInput = Readonly<{
  semantic: EstablishedSemanticMeaning;
  context: BusinessProjectContext;
  organizationSpecificMeaning?: OrganizationSpecificConceptMeaning | null;
}>;

export type BusinessProjectConceptDiagnostics = Readonly<{
  conceptId: string;
  recognizedConcept: string | null;
  recognitionBasis: readonly string[];
  semanticAuthority: readonly string[];
  families: readonly string[];
  knowledgeScopes: readonly ConceptKnowledgeScope[];
  evidenceTrace: readonly string[];
  ambiguity: BusinessProjectConcept["ambiguity"];
  rejectedInferences: readonly string[];
  causalInference: "NONE";
  mutatesAuthorities: false;
}>;
