import type { DomainId, DomainVersion } from "./domainFoundationIndex.ts";
import type { DomainVocabularyId } from "./domainVocabularyIndex.ts";

export const DOMAIN_ONTOLOGY_CONTRACT_VERSION = "DOM-3:1" as const;

export type DomainOntologyId = string;
export type DomainEntityTypeId = string;
export type DomainRelationshipTypeId = string;
export type DomainAttributeId = string;
export type DomainConstraintId = string;

export type DomainOntologyStatus = "draft" | "active" | "deprecated" | "archived";

export type DomainOntologyScope = "domain" | "module" | "feature" | "context" | "global";

export type DomainEntityType = Readonly<{
  entityTypeId: DomainEntityTypeId;
  label: string;
  description: string;
  scope: DomainOntologyScope;
  status: DomainOntologyStatus;
}>;

export type DomainRelationshipType = Readonly<{
  relationshipTypeId: DomainRelationshipTypeId;
  label: string;
  description: string;
  sourceEntityTypeId: DomainEntityTypeId;
  targetEntityTypeId: DomainEntityTypeId;
  scope: DomainOntologyScope;
  status: DomainOntologyStatus;
}>;

export type DomainAttributeDefinition = Readonly<{
  attributeId: DomainAttributeId;
  ownerEntityTypeId: DomainEntityTypeId;
  label: string;
  description: string;
  valueType: "string" | "number" | "boolean" | "date" | "enum" | "reference";
  required: boolean;
  scope: DomainOntologyScope;
  status: DomainOntologyStatus;
}>;

export type DomainConstraintDefinition = Readonly<{
  constraintId: DomainConstraintId;
  targetType: "entity" | "relationship" | "attribute";
  targetId: DomainEntityTypeId | DomainRelationshipTypeId | DomainAttributeId;
  label: string;
  description: string;
  severity: "info" | "warning" | "error";
  scope: DomainOntologyScope;
  status: DomainOntologyStatus;
}>;

export type DomainOntologyPackage = Readonly<{
  contractVersion: typeof DOMAIN_ONTOLOGY_CONTRACT_VERSION;
  ontologyId: DomainOntologyId;
  domainId: DomainId;
  vocabularyId?: DomainVocabularyId;
  name: string;
  description: string;
  version: DomainVersion;
  scope: DomainOntologyScope;
  status: DomainOntologyStatus;
  entityTypes: readonly DomainEntityType[];
  relationshipTypes: readonly DomainRelationshipType[];
  attributes: readonly DomainAttributeDefinition[];
  constraints: readonly DomainConstraintDefinition[];
}>;

export type RegisteredDomainOntology = Readonly<{
  package: DomainOntologyPackage;
  registrationOrder: number;
}>;

export type DomainOntologyRegistryIndexes = Readonly<{
  byId: Readonly<Record<DomainOntologyId, RegisteredDomainOntology>>;
  byDomainId: Readonly<Record<DomainId, readonly RegisteredDomainOntology[]>>;
}>;

export type DomainOntologyRegistry = Readonly<{
  contractVersion: typeof DOMAIN_ONTOLOGY_CONTRACT_VERSION;
  registryId: string;
  frozen: boolean;
  ontologies: readonly RegisteredDomainOntology[];
  indexes: DomainOntologyRegistryIndexes;
}>;

export type DomainOntologyValidationIssue = Readonly<{
  code: string;
  field: string;
  message: string;
  severity: "error";
}>;

export type DomainOntologyValidationResult = Readonly<{
  valid: boolean;
  issues: readonly DomainOntologyValidationIssue[];
}>;

export type DomainOntologyRegistryMutationResult = Readonly<{
  success: boolean;
  registry: DomainOntologyRegistry;
  ontology: RegisteredDomainOntology | null;
  validation: DomainOntologyValidationResult;
}>;

export type DomainOntologyFoundationManifest = Readonly<{
  contractVersion: typeof DOMAIN_ONTOLOGY_CONTRACT_VERSION;
  version: typeof import("./domainOntologyConstants.ts").DOMAIN_ONTOLOGY_VERSION;
  defaultStatus: DomainOntologyStatus;
  maxOntologyIdLength: number;
  maxEntityTypeIdLength: number;
  maxRelationshipTypeIdLength: number;
  maxAttributeIdLength: number;
  maxConstraintIdLength: number;
  supportedScopes: readonly DomainOntologyScope[];
  publicApis: readonly string[];
  validation: DomainOntologyValidationResult;
  metadataOnly: true;
  runtimeBehavior: false;
  readyFor: "DOM-3:2 Domain Ontology Query Layer";
}>;
