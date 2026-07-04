import {
  compareDomainVersions,
  isValidDomainId,
  isValidDomainVersion,
  type DomainRegistry,
} from "./domainFoundationIndex.ts";
import type { DomainVocabularyRegistry } from "./domainVocabularyIndex.ts";
import {
  MAX_ATTRIBUTE_ID_LENGTH,
  MAX_CONSTRAINT_ID_LENGTH,
  MAX_ENTITY_TYPE_ID_LENGTH,
  MAX_ONTOLOGY_ID_LENGTH,
  MAX_RELATIONSHIP_TYPE_ID_LENGTH,
  SUPPORTED_ONTOLOGY_SCOPES,
} from "./domainOntologyConstants.ts";
import {
  DOMAIN_ONTOLOGY_CONTRACT_VERSION,
  type DomainAttributeId,
  type DomainConstraintId,
  type DomainEntityTypeId,
  type DomainOntologyId,
  type DomainOntologyPackage,
  type DomainOntologyRegistry,
  type DomainOntologyScope,
  type DomainOntologyStatus,
  type DomainOntologyValidationIssue,
  type DomainOntologyValidationResult,
  type DomainRelationshipTypeId,
} from "./domainOntologyTypes.ts";

function issue(code: string, field: string, message: string): DomainOntologyValidationIssue {
  return Object.freeze({ code, field, message, severity: "error" });
}

export function domainOntologyValidationResult(
  issues: readonly DomainOntologyValidationIssue[]
): DomainOntologyValidationResult {
  return Object.freeze({
    valid: issues.length === 0,
    issues: Object.freeze([...issues]),
  });
}

const ONTOLOGY_STATUSES: readonly DomainOntologyStatus[] = Object.freeze([
  "draft",
  "active",
  "deprecated",
  "archived",
]);

function isLowerIdentifier(value: string, maxLength: number): boolean {
  if (typeof value !== "string") return false;
  const trimmed = value.trim();
  return trimmed.length > 0 && trimmed.length <= maxLength && /^[a-z][a-z0-9._:-]*$/.test(trimmed);
}

export function isValidOntologyId(ontologyId: DomainOntologyId): boolean {
  return isLowerIdentifier(ontologyId, MAX_ONTOLOGY_ID_LENGTH);
}

export function isValidEntityTypeId(entityTypeId: DomainEntityTypeId): boolean {
  return isLowerIdentifier(entityTypeId, MAX_ENTITY_TYPE_ID_LENGTH);
}

export function isValidRelationshipTypeId(relationshipTypeId: DomainRelationshipTypeId): boolean {
  return isLowerIdentifier(relationshipTypeId, MAX_RELATIONSHIP_TYPE_ID_LENGTH);
}

export function isValidAttributeId(attributeId: DomainAttributeId): boolean {
  return isLowerIdentifier(attributeId, MAX_ATTRIBUTE_ID_LENGTH);
}

export function isValidConstraintId(constraintId: DomainConstraintId): boolean {
  return isLowerIdentifier(constraintId, MAX_CONSTRAINT_ID_LENGTH);
}

export function isValidOntologyStatus(status: DomainOntologyStatus): boolean {
  return ONTOLOGY_STATUSES.includes(status);
}

export function isValidOntologyScope(scope: DomainOntologyScope): boolean {
  return SUPPORTED_ONTOLOGY_SCOPES.includes(scope);
}

function duplicateIssues(values: readonly string[], code: string, field: string, message: string) {
  return new Set(values).size === values.length ? [] : [issue(code, field, message)];
}

function validateDomainReference(
  ontologyPackage: DomainOntologyPackage,
  domainRegistry?: DomainRegistry
): readonly DomainOntologyValidationIssue[] {
  const issues: DomainOntologyValidationIssue[] = [];
  if (!isValidDomainId(ontologyPackage.domainId)) {
    issues.push(issue("invalid_domain_reference", "domainId", "Domain reference must be a valid domain id."));
  }
  if (domainRegistry && !domainRegistry.indexes.byId[ontologyPackage.domainId]) {
    issues.push(
      issue("missing_domain_reference", "domainId", `Domain reference is not registered: ${ontologyPackage.domainId}.`)
    );
  }
  return issues;
}

function validateVocabularyReference(
  ontologyPackage: DomainOntologyPackage,
  vocabularyRegistry?: DomainVocabularyRegistry
): readonly DomainOntologyValidationIssue[] {
  if (!ontologyPackage.vocabularyId || !vocabularyRegistry) return [];
  const vocabulary = vocabularyRegistry.indexes.byId[ontologyPackage.vocabularyId] ?? null;
  if (!vocabulary) {
    return [
      issue(
        "missing_vocabulary_reference",
        "vocabularyId",
        `Vocabulary reference is not registered: ${ontologyPackage.vocabularyId}.`
      ),
    ];
  }
  if (vocabulary.package.domainId !== ontologyPackage.domainId) {
    return [
      issue(
        "incompatible_vocabulary_reference",
        "vocabularyId",
        "Vocabulary reference must belong to the same domain as the ontology package."
      ),
    ];
  }
  return [];
}

function validateEndpointIntegrity(ontologyPackage: DomainOntologyPackage): readonly DomainOntologyValidationIssue[] {
  const entityIds = new Set(ontologyPackage.entityTypes.map((entity) => entity.entityTypeId));
  const issues: DomainOntologyValidationIssue[] = [];
  for (const relationship of ontologyPackage.relationshipTypes) {
    if (!entityIds.has(relationship.sourceEntityTypeId)) {
      issues.push(
        issue("missing_relationship_source", "relationshipTypes.sourceEntityTypeId", "Relationship source entity must exist.")
      );
    }
    if (!entityIds.has(relationship.targetEntityTypeId)) {
      issues.push(
        issue("missing_relationship_target", "relationshipTypes.targetEntityTypeId", "Relationship target entity must exist.")
      );
    }
  }
  return issues;
}

function validateAttributeOwners(ontologyPackage: DomainOntologyPackage): readonly DomainOntologyValidationIssue[] {
  const entityIds = new Set(ontologyPackage.entityTypes.map((entity) => entity.entityTypeId));
  return ontologyPackage.attributes
    .filter((attribute) => !entityIds.has(attribute.ownerEntityTypeId))
    .map(() =>
      issue("missing_attribute_owner", "attributes.ownerEntityTypeId", "Attribute owner entity must exist.")
    );
}

function validateConstraintTargets(ontologyPackage: DomainOntologyPackage): readonly DomainOntologyValidationIssue[] {
  const entityIds = new Set(ontologyPackage.entityTypes.map((entity) => entity.entityTypeId));
  const relationshipIds = new Set(
    ontologyPackage.relationshipTypes.map((relationship) => relationship.relationshipTypeId)
  );
  const attributeIds = new Set(ontologyPackage.attributes.map((attribute) => attribute.attributeId));
  const issues: DomainOntologyValidationIssue[] = [];

  for (const constraint of ontologyPackage.constraints) {
    const targetExists =
      (constraint.targetType === "entity" && entityIds.has(constraint.targetId)) ||
      (constraint.targetType === "relationship" && relationshipIds.has(constraint.targetId)) ||
      (constraint.targetType === "attribute" && attributeIds.has(constraint.targetId));
    if (!targetExists) {
      issues.push(
        issue("missing_constraint_target", "constraints.targetId", "Constraint target must exist in ontology metadata.")
      );
    }
  }

  return issues;
}

export function validateDomainOntologyPackage(
  ontologyPackage: DomainOntologyPackage,
  domainRegistry?: DomainRegistry,
  vocabularyRegistry?: DomainVocabularyRegistry
): DomainOntologyValidationResult {
  const issues: DomainOntologyValidationIssue[] = [];

  if (ontologyPackage.contractVersion !== DOMAIN_ONTOLOGY_CONTRACT_VERSION) {
    issues.push(issue("invalid_contract_version", "contractVersion", "Ontology package contract version must be DOM-3:1."));
  }
  if (!isValidOntologyId(ontologyPackage.ontologyId)) {
    issues.push(issue("invalid_ontology_id", "ontologyId", "Ontology id must be a valid lowercase identifier."));
  }
  issues.push(...validateDomainReference(ontologyPackage, domainRegistry));
  issues.push(...validateVocabularyReference(ontologyPackage, vocabularyRegistry));
  if (typeof ontologyPackage.name !== "string" || ontologyPackage.name.trim().length === 0) {
    issues.push(issue("invalid_ontology_name", "name", "Ontology name must be a non-empty string."));
  }
  if (typeof ontologyPackage.description !== "string" || ontologyPackage.description.trim().length === 0) {
    issues.push(issue("invalid_ontology_description", "description", "Ontology description must be non-empty."));
  }
  if (!isValidDomainVersion(ontologyPackage.version)) {
    issues.push(issue("invalid_ontology_version", "version", "Ontology version must use non-negative integer values."));
  }
  if (!isValidOntologyScope(ontologyPackage.scope)) {
    issues.push(issue("invalid_ontology_scope", "scope", "Ontology scope is not supported."));
  }
  if (!isValidOntologyStatus(ontologyPackage.status)) {
    issues.push(issue("invalid_ontology_status", "status", "Ontology status is not supported."));
  }

  const entityIds = ontologyPackage.entityTypes.map((entry) => entry.entityTypeId);
  const relationshipIds = ontologyPackage.relationshipTypes.map((entry) => entry.relationshipTypeId);
  const attributeIds = ontologyPackage.attributes.map((entry) => entry.attributeId);
  const constraintIds = ontologyPackage.constraints.map((entry) => entry.constraintId);

  issues.push(...duplicateIssues(entityIds, "duplicate_entity_type_id", "entityTypes", "Entity type ids must be unique."));
  issues.push(
    ...duplicateIssues(
      relationshipIds,
      "duplicate_relationship_type_id",
      "relationshipTypes",
      "Relationship type ids must be unique."
    )
  );
  issues.push(...duplicateIssues(attributeIds, "duplicate_attribute_id", "attributes", "Attribute ids must be unique."));
  issues.push(...duplicateIssues(constraintIds, "duplicate_constraint_id", "constraints", "Constraint ids must be unique."));

  for (const entity of ontologyPackage.entityTypes) {
    if (!isValidEntityTypeId(entity.entityTypeId)) {
      issues.push(issue("invalid_entity_type_id", "entityTypes.entityTypeId", "Entity type id must be valid."));
    }
    if (!isValidOntologyScope(entity.scope)) {
      issues.push(issue("invalid_entity_scope", "entityTypes.scope", "Entity scope is not supported."));
    }
    if (!isValidOntologyStatus(entity.status)) {
      issues.push(issue("invalid_entity_status", "entityTypes.status", "Entity status is not supported."));
    }
  }

  for (const relationship of ontologyPackage.relationshipTypes) {
    if (!isValidRelationshipTypeId(relationship.relationshipTypeId)) {
      issues.push(
        issue("invalid_relationship_type_id", "relationshipTypes.relationshipTypeId", "Relationship type id must be valid.")
      );
    }
    if (!isValidOntologyScope(relationship.scope)) {
      issues.push(issue("invalid_relationship_scope", "relationshipTypes.scope", "Relationship scope is not supported."));
    }
    if (!isValidOntologyStatus(relationship.status)) {
      issues.push(issue("invalid_relationship_status", "relationshipTypes.status", "Relationship status is not supported."));
    }
  }

  for (const attribute of ontologyPackage.attributes) {
    if (!isValidAttributeId(attribute.attributeId)) {
      issues.push(issue("invalid_attribute_id", "attributes.attributeId", "Attribute id must be valid."));
    }
    if (!isValidOntologyScope(attribute.scope)) {
      issues.push(issue("invalid_attribute_scope", "attributes.scope", "Attribute scope is not supported."));
    }
    if (!isValidOntologyStatus(attribute.status)) {
      issues.push(issue("invalid_attribute_status", "attributes.status", "Attribute status is not supported."));
    }
  }

  for (const constraint of ontologyPackage.constraints) {
    if (!isValidConstraintId(constraint.constraintId)) {
      issues.push(issue("invalid_constraint_id", "constraints.constraintId", "Constraint id must be valid."));
    }
    if (!isValidOntologyScope(constraint.scope)) {
      issues.push(issue("invalid_constraint_scope", "constraints.scope", "Constraint scope is not supported."));
    }
    if (!isValidOntologyStatus(constraint.status)) {
      issues.push(issue("invalid_constraint_status", "constraints.status", "Constraint status is not supported."));
    }
  }

  issues.push(...validateEndpointIntegrity(ontologyPackage));
  issues.push(...validateAttributeOwners(ontologyPackage));
  issues.push(...validateConstraintTargets(ontologyPackage));

  return domainOntologyValidationResult(issues);
}

export function validateDomainOntologyRegistration(
  registry: DomainOntologyRegistry,
  ontologyPackage: DomainOntologyPackage,
  domainRegistry?: DomainRegistry,
  vocabularyRegistry?: DomainVocabularyRegistry
): DomainOntologyValidationResult {
  const issues = [...validateDomainOntologyPackage(ontologyPackage, domainRegistry, vocabularyRegistry).issues];

  if (registry.frozen) {
    issues.push(issue("registry_frozen", "registry", "Ontology registry is frozen and cannot accept mutations."));
  }
  if (registry.indexes.byId[ontologyPackage.ontologyId]) {
    issues.push(issue("duplicate_ontology_id", "ontologyId", `Ontology id already registered: ${ontologyPackage.ontologyId}.`));
  }

  return domainOntologyValidationResult(issues);
}

export function validateDomainOntologyRegistry(registry: DomainOntologyRegistry): DomainOntologyValidationResult {
  const issues: DomainOntologyValidationIssue[] = [];
  const ontologyIds = registry.ontologies.map((entry) => entry.package.ontologyId);

  if (registry.contractVersion !== DOMAIN_ONTOLOGY_CONTRACT_VERSION) {
    issues.push(issue("invalid_registry_contract_version", "contractVersion", "Registry contract version must be DOM-3:1."));
  }
  if (new Set(ontologyIds).size !== ontologyIds.length) {
    issues.push(issue("duplicate_registry_ontology_id", "ontologies", "Registry contains duplicate ontology ids."));
  }
  const orders = registry.ontologies.map((entry) => entry.registrationOrder);
  if (orders.some((order, index) => order !== index)) {
    issues.push(issue("invalid_registration_order", "ontologies", "Registry registration order is inconsistent."));
  }
  for (const entry of registry.ontologies) {
    issues.push(...validateDomainOntologyPackage(entry.package).issues);
  }
  for (const entry of registry.ontologies) {
    const indexed = registry.indexes.byId[entry.package.ontologyId];
    if (!indexed || indexed.registrationOrder !== entry.registrationOrder) {
      issues.push(issue("invalid_registry_index", "indexes.byId", "Registry id index is inconsistent."));
    }
  }

  return domainOntologyValidationResult(issues);
}

export function validateDomainOntologyFoundation(): DomainOntologyValidationResult {
  const versionOrder = compareDomainVersions(
    Object.freeze({ major: 3, minor: 1, patch: 0 }),
    Object.freeze({ major: 3, minor: 1, patch: 0 })
  );
  return domainOntologyValidationResult(versionOrder === 0 ? [] : [issue("invalid_foundation_version", "version", "Foundation version mismatch.")]);
}
