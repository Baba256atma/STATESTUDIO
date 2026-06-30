/**
 * KNL-2 — Business Ontology domain types.
 */

import type {
  BUSINESS_ONTOLOGY_CAPABILITY_KEYS,
  BUSINESS_ONTOLOGY_CATEGORY_KEYS,
  BUSINESS_ONTOLOGY_CONTRACT_VERSION,
  BUSINESS_ONTOLOGY_NAMESPACE,
  BUSINESS_ENTITY_TYPE_KEYS,
  BUSINESS_RELATIONSHIP_TYPE_KEYS,
} from "./businessOntologyCatalog.ts";

export type BusinessEntityTypeKey = (typeof BUSINESS_ENTITY_TYPE_KEYS)[number];
export type BusinessRelationshipTypeKey = (typeof BUSINESS_RELATIONSHIP_TYPE_KEYS)[number];
export type BusinessOntologyCategoryKey = (typeof BUSINESS_ONTOLOGY_CATEGORY_KEYS)[number];
export type BusinessOntologyCapabilityKey = (typeof BUSINESS_ONTOLOGY_CAPABILITY_KEYS)[number];
export type BusinessOntologyIdentifier = string;
export type BusinessOntologyVersion = typeof BUSINESS_ONTOLOGY_CONTRACT_VERSION | string;

export type BusinessMetadata = Readonly<{
  metadataId: BusinessOntologyIdentifier;
  metadataVersion: typeof BUSINESS_ONTOLOGY_CONTRACT_VERSION;
  namespace: typeof BUSINESS_ONTOLOGY_NAMESPACE;
  owner: string;
  extensions: Readonly<Record<string, string>>;
  createdAt: string;
  readOnly: true;
}>;

export type BusinessDomain = Readonly<{
  domainId: BusinessOntologyIdentifier;
  label: string;
  description: string;
  version: typeof BUSINESS_ONTOLOGY_CONTRACT_VERSION;
  metadata: BusinessMetadata;
  readOnly: true;
}>;

export type BusinessEntity = Readonly<{
  entityId: BusinessOntologyIdentifier;
  entityType: BusinessEntityTypeKey;
  name: string;
  label: string;
  description: string;
  categoryKey: BusinessOntologyCategoryKey;
  version: typeof BUSINESS_ONTOLOGY_CONTRACT_VERSION;
  metadata: BusinessMetadata;
  readOnly: true;
}>;

export type BusinessObject = Readonly<{
  objectId: BusinessOntologyIdentifier;
  entityId: BusinessOntologyIdentifier;
  label: string;
  description: string;
  version: typeof BUSINESS_ONTOLOGY_CONTRACT_VERSION;
  metadata: BusinessMetadata;
  readOnly: true;
}>;

export type BusinessProcess = Readonly<{
  processId: BusinessOntologyIdentifier;
  label: string;
  description: string;
  version: typeof BUSINESS_ONTOLOGY_CONTRACT_VERSION;
  metadata: BusinessMetadata;
  readOnly: true;
}>;

export type BusinessFunction = Readonly<{
  functionId: BusinessOntologyIdentifier;
  label: string;
  description: string;
  version: typeof BUSINESS_ONTOLOGY_CONTRACT_VERSION;
  metadata: BusinessMetadata;
  readOnly: true;
}>;

export type BusinessCapability = Readonly<{
  capabilityId: BusinessOntologyIdentifier;
  capabilityKey: BusinessOntologyCapabilityKey;
  label: string;
  description: string;
  version: typeof BUSINESS_ONTOLOGY_CONTRACT_VERSION;
  metadata: BusinessMetadata;
  readOnly: true;
}>;

export type BusinessGoal = Readonly<{
  goalId: BusinessOntologyIdentifier;
  label: string;
  description: string;
  version: typeof BUSINESS_ONTOLOGY_CONTRACT_VERSION;
  metadata: BusinessMetadata;
  readOnly: true;
}>;

export type BusinessKpi = Readonly<{
  kpiId: BusinessOntologyIdentifier;
  label: string;
  description: string;
  version: typeof BUSINESS_ONTOLOGY_CONTRACT_VERSION;
  metadata: BusinessMetadata;
  readOnly: true;
}>;

export type BusinessRisk = Readonly<{
  riskId: BusinessOntologyIdentifier;
  label: string;
  description: string;
  version: typeof BUSINESS_ONTOLOGY_CONTRACT_VERSION;
  metadata: BusinessMetadata;
  readOnly: true;
}>;

export type BusinessResource = Readonly<{
  resourceId: BusinessOntologyIdentifier;
  label: string;
  description: string;
  version: typeof BUSINESS_ONTOLOGY_CONTRACT_VERSION;
  metadata: BusinessMetadata;
  readOnly: true;
}>;

export type BusinessStakeholder = Readonly<{
  stakeholderId: BusinessOntologyIdentifier;
  label: string;
  description: string;
  version: typeof BUSINESS_ONTOLOGY_CONTRACT_VERSION;
  metadata: BusinessMetadata;
  readOnly: true;
}>;

export type BusinessPolicy = Readonly<{
  policyId: BusinessOntologyIdentifier;
  label: string;
  description: string;
  version: typeof BUSINESS_ONTOLOGY_CONTRACT_VERSION;
  metadata: BusinessMetadata;
  readOnly: true;
}>;

export type BusinessRule = Readonly<{
  ruleId: BusinessOntologyIdentifier;
  label: string;
  description: string;
  version: typeof BUSINESS_ONTOLOGY_CONTRACT_VERSION;
  metadata: BusinessMetadata;
  readOnly: true;
}>;

export type BusinessEvent = Readonly<{
  eventId: BusinessOntologyIdentifier;
  label: string;
  description: string;
  version: typeof BUSINESS_ONTOLOGY_CONTRACT_VERSION;
  metadata: BusinessMetadata;
  readOnly: true;
}>;

export type BusinessScenario = Readonly<{
  scenarioId: BusinessOntologyIdentifier;
  label: string;
  description: string;
  version: typeof BUSINESS_ONTOLOGY_CONTRACT_VERSION;
  metadata: BusinessMetadata;
  readOnly: true;
}>;

export type BusinessDecision = Readonly<{
  decisionId: BusinessOntologyIdentifier;
  label: string;
  description: string;
  version: typeof BUSINESS_ONTOLOGY_CONTRACT_VERSION;
  metadata: BusinessMetadata;
  readOnly: true;
}>;

export type BusinessRelationship = Readonly<{
  relationshipId: BusinessOntologyIdentifier;
  relationshipType: BusinessRelationshipTypeKey;
  sourceEntityId: BusinessOntologyIdentifier;
  targetEntityId: BusinessOntologyIdentifier;
  label: string;
  description: string;
  version: typeof BUSINESS_ONTOLOGY_CONTRACT_VERSION;
  metadata: BusinessMetadata;
  readOnly: true;
}>;

export type BusinessDependency = Readonly<{
  dependencyId: BusinessOntologyIdentifier;
  sourceEntityId: BusinessOntologyIdentifier;
  targetEntityId: BusinessOntologyIdentifier;
  label: string;
  description: string;
  version: typeof BUSINESS_ONTOLOGY_CONTRACT_VERSION;
  metadata: BusinessMetadata;
  readOnly: true;
}>;

export type BusinessConstraint = Readonly<{
  constraintId: BusinessOntologyIdentifier;
  label: string;
  description: string;
  version: typeof BUSINESS_ONTOLOGY_CONTRACT_VERSION;
  metadata: BusinessMetadata;
  readOnly: true;
}>;

export type BusinessOpportunity = Readonly<{
  opportunityId: BusinessOntologyIdentifier;
  label: string;
  description: string;
  version: typeof BUSINESS_ONTOLOGY_CONTRACT_VERSION;
  metadata: BusinessMetadata;
  readOnly: true;
}>;

export type BusinessOntologyCategory = Readonly<{
  categoryId: BusinessOntologyIdentifier;
  categoryKey: BusinessOntologyCategoryKey;
  label: string;
  description: string;
  version: typeof BUSINESS_ONTOLOGY_CONTRACT_VERSION;
  metadata: BusinessMetadata;
  readOnly: true;
}>;

export type BusinessOntologyValidationIssue = Readonly<{
  code: string;
  message: string;
  field?: string;
  readOnly: true;
}>;

export type BusinessOntologyValidationResult = Readonly<{
  valid: boolean;
  issues: readonly BusinessOntologyValidationIssue[];
  readOnly: true;
}>;

export type BusinessOntologyResult<T> = Readonly<{
  success: boolean;
  reason: string;
  data: T | null;
  readOnly: true;
}>;

export type BusinessEntityRegistrationInput = Readonly<{
  entityId: BusinessOntologyIdentifier;
  entityType: BusinessEntityTypeKey;
  name: string;
  label: string;
  description: string;
  categoryKey: BusinessOntologyCategoryKey;
}>;

export type BusinessRelationshipRegistrationInput = Readonly<{
  relationshipId: BusinessOntologyIdentifier;
  relationshipType: BusinessRelationshipTypeKey;
  sourceEntityId: BusinessOntologyIdentifier;
  targetEntityId: BusinessOntologyIdentifier;
  label: string;
  description: string;
}>;

export type BusinessCapabilityRegistrationInput = Readonly<{
  capabilityId: BusinessOntologyIdentifier;
  capabilityKey: BusinessOntologyCapabilityKey;
  label: string;
  description: string;
}>;

export type BusinessCategoryRegistrationInput = Readonly<{
  categoryId: BusinessOntologyIdentifier;
  categoryKey: BusinessOntologyCategoryKey;
  label: string;
  description: string;
}>;

export type BusinessMetadataRegistrationInput = Readonly<{
  metadataId: BusinessOntologyIdentifier;
  owner: string;
  extensions?: Readonly<Record<string, string>>;
}>;

export type BusinessOntologySnapshot = Readonly<{
  ontologyVersion: typeof BUSINESS_ONTOLOGY_CONTRACT_VERSION;
  entityCount: number;
  relationshipCount: number;
  capabilityCount: number;
  categoryCount: number;
  metadataCount: number;
  readOnly: true;
}>;

export type BusinessOntologyState = Readonly<{
  ontologyId: typeof import("./businessOntologyCatalog.ts").BUSINESS_ONTOLOGY_ID;
  contractVersion: typeof BUSINESS_ONTOLOGY_CONTRACT_VERSION;
  foundationDependency: "KNL/1";
  initialized: boolean;
  entityCount: number;
  relationshipCount: number;
  capabilityCount: number;
  supportedEntityTypes: readonly BusinessEntityTypeKey[];
  supportedRelationshipTypes: readonly BusinessRelationshipTypeKey[];
  timestamp: string;
  readOnly: true;
}>;

export type BusinessOntologyManifest = Readonly<{
  ontologyId: typeof import("./businessOntologyCatalog.ts").BUSINESS_ONTOLOGY_ID;
  ontologyName: typeof import("./businessOntologyCatalog.ts").BUSINESS_ONTOLOGY_NAME;
  namespace: typeof BUSINESS_ONTOLOGY_NAMESPACE;
  contractVersion: typeof BUSINESS_ONTOLOGY_CONTRACT_VERSION;
  architectureVersion: typeof import("./businessOntologyCatalog.ts").BUSINESS_ONTOLOGY_ARCHITECTURE_VERSION;
  foundationDependency: "KNL/1";
  supportedEntityTypes: readonly BusinessEntityTypeKey[];
  supportedRelationshipTypes: readonly BusinessRelationshipTypeKey[];
  supportedCategories: readonly BusinessOntologyCategoryKey[];
  supportedCapabilities: readonly BusinessOntologyCapabilityKey[];
  publicApis: readonly string[];
  principles: readonly string[];
  mustNotOwn: readonly string[];
  futurePhases: readonly string[];
  generatedAt: string;
  readOnly: true;
}>;

export type BusinessOntologyValidationReport = Readonly<{
  valid: boolean;
  foundationValid: boolean;
  ontologyInitialized: boolean;
  registryValid: boolean;
  identityValid: boolean;
  issues: readonly BusinessOntologyValidationIssue[];
  readOnly: true;
}>;
