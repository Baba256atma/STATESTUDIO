import type {
  DomainAttributeId,
  DomainConstraintId,
  DomainEntityTypeId,
  DomainOntologyRegistry,
  DomainRelationshipTypeId,
  RegisteredDomainOntology,
} from "./domainOntologyIndex.ts";
import type {
  DomainAttributeLookupResult,
  DomainConstraintLookupResult,
  DomainEntityLookupResult,
  DomainRelationshipLookupResult,
} from "./domainOntologyQueryTypes.ts";

function entityResult(
  ontology: RegisteredDomainOntology | null,
  entityType: DomainEntityLookupResult["entityType"]
): DomainEntityLookupResult {
  return Object.freeze({ found: Boolean(ontology && entityType), ontology, entityType });
}

function relationshipResult(
  ontology: RegisteredDomainOntology | null,
  relationshipType: DomainRelationshipLookupResult["relationshipType"]
): DomainRelationshipLookupResult {
  return Object.freeze({ found: Boolean(ontology && relationshipType), ontology, relationshipType });
}

function attributeResult(
  ontology: RegisteredDomainOntology | null,
  attribute: DomainAttributeLookupResult["attribute"]
): DomainAttributeLookupResult {
  return Object.freeze({ found: Boolean(ontology && attribute), ontology, attribute });
}

function constraintResult(
  ontology: RegisteredDomainOntology | null,
  constraint: DomainConstraintLookupResult["constraint"]
): DomainConstraintLookupResult {
  return Object.freeze({ found: Boolean(ontology && constraint), ontology, constraint });
}

export function findDomainEntityType(
  registry: DomainOntologyRegistry,
  entityTypeId: DomainEntityTypeId
): DomainEntityLookupResult {
  for (const ontology of registry.ontologies) {
    const entityType = ontology.package.entityTypes.find((entry) => entry.entityTypeId === entityTypeId) ?? null;
    if (entityType) return entityResult(ontology, entityType);
  }
  return entityResult(null, null);
}

export function findDomainRelationshipType(
  registry: DomainOntologyRegistry,
  relationshipTypeId: DomainRelationshipTypeId
): DomainRelationshipLookupResult {
  for (const ontology of registry.ontologies) {
    const relationshipType =
      ontology.package.relationshipTypes.find((entry) => entry.relationshipTypeId === relationshipTypeId) ?? null;
    if (relationshipType) return relationshipResult(ontology, relationshipType);
  }
  return relationshipResult(null, null);
}

export function findDomainAttribute(
  registry: DomainOntologyRegistry,
  attributeId: DomainAttributeId
): DomainAttributeLookupResult {
  for (const ontology of registry.ontologies) {
    const attribute = ontology.package.attributes.find((entry) => entry.attributeId === attributeId) ?? null;
    if (attribute) return attributeResult(ontology, attribute);
  }
  return attributeResult(null, null);
}

export function findDomainConstraint(
  registry: DomainOntologyRegistry,
  constraintId: DomainConstraintId
): DomainConstraintLookupResult {
  for (const ontology of registry.ontologies) {
    const constraint = ontology.package.constraints.find((entry) => entry.constraintId === constraintId) ?? null;
    if (constraint) return constraintResult(ontology, constraint);
  }
  return constraintResult(null, null);
}

export function findAttributesByOwner(
  registry: DomainOntologyRegistry,
  ownerId: DomainEntityTypeId
): readonly DomainAttributeLookupResult[] {
  const results: DomainAttributeLookupResult[] = [];
  for (const ontology of registry.ontologies) {
    for (const attribute of ontology.package.attributes) {
      if (attribute.ownerEntityTypeId === ownerId) {
        results.push(attributeResult(ontology, attribute));
      }
    }
  }
  return Object.freeze(results);
}

export function findConstraintsByTarget(
  registry: DomainOntologyRegistry,
  targetId: string
): readonly DomainConstraintLookupResult[] {
  const results: DomainConstraintLookupResult[] = [];
  for (const ontology of registry.ontologies) {
    for (const constraint of ontology.package.constraints) {
      if (constraint.targetId === targetId) {
        results.push(constraintResult(ontology, constraint));
      }
    }
  }
  return Object.freeze(results);
}
