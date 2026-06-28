/**
 * PHASE-2 / DS1:3 — Business Knowledge Layer types.
 * Semantic vocabulary shapes only — no AI, calculations, or runtime logic.
 */

export type BusinessKnowledgeWorkspaceId = string;

export type BusinessKnowledgeConceptType =
  | "business_domain"
  | "department"
  | "business_function"
  | "process"
  | "activity"
  | "kpi_definition"
  | "risk_definition"
  | "resource"
  | "stakeholder"
  | "business_entity"
  | "business_term"
  | "business_rule";

export type BusinessKnowledgeCategory =
  | "organization"
  | "operations"
  | "performance"
  | "governance"
  | "vocabulary"
  | "custom";

export type BusinessKnowledgeLifecycleState =
  | "draft"
  | "defined"
  | "reviewed"
  | "published"
  | "deprecated"
  | "archived";

export type BusinessKnowledgeRelationshipType =
  | "contains"
  | "part_of"
  | "measures"
  | "applies_to"
  | "defines"
  | "owned_by"
  | "references"
  | "related_to"
  | "custom";

export type BusinessKnowledgeSecurityClassification =
  | "public"
  | "internal"
  | "confidential"
  | "restricted";

export type BusinessKnowledgeSecurityProfile = Readonly<{
  classification: BusinessKnowledgeSecurityClassification;
  crossWorkspaceAccess: false;
}>;

export type BusinessKnowledgeExtensionPoint = Readonly<{
  vocabularyProfileId?: string | null;
  futureExtension?: Readonly<Record<string, unknown>>;
}>;

export type BusinessKnowledgeBindings = Readonly<{
  businessDataSourceIds?: readonly string[];
  adapterLinkIds?: readonly string[];
  primaryBusinessDomain?: string | null;
}>;

export type BusinessKnowledgeMetadata = Readonly<{
  owner?: string | null;
  tags?: readonly string[];
  synonyms?: readonly string[];
  relatedTerms?: readonly string[];
  definitionSource?: string | null;
  effectiveFrom?: string | null;
  effectiveTo?: string | null;
  extension?: BusinessKnowledgeExtensionPoint;
}>;

export type BusinessKnowledgeArtifactRecord = Readonly<{
  contractVersion: string;
  knowledgeArtifactId: string;
  workspaceId: BusinessKnowledgeWorkspaceId;
  conceptType: BusinessKnowledgeConceptType;
  knowledgeCategory: BusinessKnowledgeCategory;
  displayName: string;
  description: string;
  lifecycleState: BusinessKnowledgeLifecycleState;
  metadata: BusinessKnowledgeMetadata;
  bindings: BusinessKnowledgeBindings;
  securityProfile: BusinessKnowledgeSecurityProfile;
  createdAt: string;
  updatedAt: string;
  source: "phase-2-business-knowledge-layer";
}>;

export type BusinessKnowledgeRelationshipRecord = Readonly<{
  relationshipId: string;
  workspaceId: BusinessKnowledgeWorkspaceId;
  fromArtifactId: string;
  toArtifactId: string;
  relationshipType: BusinessKnowledgeRelationshipType;
  createdAt: string;
}>;

export type BusinessKnowledgeOwnershipContract = Readonly<{
  knowledgeArtifactId: string;
  workspaceId: BusinessKnowledgeWorkspaceId;
  isolationPolicy: "workspace-exclusive";
}>;

export type BusinessKnowledgeValidationIssue = Readonly<{
  code: string;
  message: string;
}>;

export type BusinessKnowledgeValidationResult = Readonly<{
  valid: boolean;
  issues: readonly BusinessKnowledgeValidationIssue[];
}>;

export type BusinessKnowledgeScoreDimensions = Readonly<{
  architecture: number;
  maintainability: number;
  regressionSafety: number;
  scalability: number;
  certificationReadiness: number;
}>;

export type BusinessKnowledgeScoreReport = Readonly<{
  contractVersion: string;
  dimensions: BusinessKnowledgeScoreDimensions;
  overall: number;
  meetsMinimum: boolean;
  generatedAt: string;
}>;

export type BusinessKnowledgeCertificationCheck = Readonly<{
  id: string;
  title: string;
  passed: boolean;
  evidence: string;
}>;

export type BusinessKnowledgeCertificationResult = Readonly<{
  contractVersion: string;
  certified: boolean;
  checks: readonly BusinessKnowledgeCertificationCheck[];
  scoreReport: BusinessKnowledgeScoreReport;
  summary: string;
  generatedAt: string;
  tags: readonly string[];
}>;

export type BusinessKnowledgeEventType =
  | "DraftCreated"
  | "DefinitionUpdated"
  | "Published"
  | "Deprecated"
  | "Archived"
  | "RelationshipAdded"
  | "RelationshipRemoved"
  | "CertificationStarted"
  | "CertificationPassed"
  | "CertificationFailed";

export type BusinessKnowledgeEvent = Readonly<{
  type: BusinessKnowledgeEventType;
  knowledgeArtifactId: string | null;
  workspaceId: BusinessKnowledgeWorkspaceId | null;
  timestamp: string;
}>;

export type BusinessKnowledgeDiagnosticEntry = Readonly<{
  knowledgeArtifactId: string | null;
  workspaceId: BusinessKnowledgeWorkspaceId | null;
  event: BusinessKnowledgeEventType;
  message: string;
  generatedAt: string;
}>;
