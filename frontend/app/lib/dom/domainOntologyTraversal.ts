import type { DomainEntityTypeId, DomainOntologyRegistry } from "./domainOntologyIndex.ts";
import {
  findDomainEntityType,
} from "./domainOntologyLookup.ts";
import type {
  DomainEntityLookupResult,
  DomainOntologyTraversalResult,
  DomainRelationshipLookupResult,
} from "./domainOntologyQueryTypes.ts";

function relationshipResult(
  ontology: DomainRelationshipLookupResult["ontology"],
  relationshipType: DomainRelationshipLookupResult["relationshipType"]
): DomainRelationshipLookupResult {
  return Object.freeze({ found: Boolean(ontology && relationshipType), ontology, relationshipType });
}

export function findOutgoingRelationshipTypes(
  registry: DomainOntologyRegistry,
  entityTypeId: DomainEntityTypeId
): readonly DomainRelationshipLookupResult[] {
  const results: DomainRelationshipLookupResult[] = [];
  for (const ontology of registry.ontologies) {
    for (const relationshipType of ontology.package.relationshipTypes) {
      if (relationshipType.sourceEntityTypeId === entityTypeId) {
        results.push(relationshipResult(ontology, relationshipType));
      }
    }
  }
  return Object.freeze(results);
}

export function findIncomingRelationshipTypes(
  registry: DomainOntologyRegistry,
  entityTypeId: DomainEntityTypeId
): readonly DomainRelationshipLookupResult[] {
  const results: DomainRelationshipLookupResult[] = [];
  for (const ontology of registry.ontologies) {
    for (const relationshipType of ontology.package.relationshipTypes) {
      if (relationshipType.targetEntityTypeId === entityTypeId) {
        results.push(relationshipResult(ontology, relationshipType));
      }
    }
  }
  return Object.freeze(results);
}

export function findConnectedEntityTypes(
  registry: DomainOntologyRegistry,
  entityTypeId: DomainEntityTypeId
): readonly DomainEntityLookupResult[] {
  const connectedIds = new Set<string>();
  for (const result of findOutgoingRelationshipTypes(registry, entityTypeId)) {
    if (result.relationshipType) connectedIds.add(result.relationshipType.targetEntityTypeId);
  }
  for (const result of findIncomingRelationshipTypes(registry, entityTypeId)) {
    if (result.relationshipType) connectedIds.add(result.relationshipType.sourceEntityTypeId);
  }
  connectedIds.delete(entityTypeId);
  return Object.freeze(
    [...connectedIds]
      .sort((left, right) => left.localeCompare(right))
      .map((connectedId) => findDomainEntityType(registry, connectedId))
      .filter((result) => result.found)
  );
}

export function buildOntologyTraversalResult(
  registry: DomainOntologyRegistry,
  entityTypeId: DomainEntityTypeId
): DomainOntologyTraversalResult {
  return Object.freeze({
    entityTypeId,
    entity: findDomainEntityType(registry, entityTypeId),
    outgoingRelationships: findOutgoingRelationshipTypes(registry, entityTypeId),
    incomingRelationships: findIncomingRelationshipTypes(registry, entityTypeId),
    connectedEntities: findConnectedEntityTypes(registry, entityTypeId),
  });
}
