import type { DomainId } from "./domainFoundationIndex.ts";
import type {
  DomainEntityTypeId,
  DomainOntologyRegistry,
  DomainOntologyScope,
  DomainOntologyStatus,
  DomainRelationshipTypeId,
  RegisteredDomainOntology,
} from "./domainOntologyIndex.ts";
import type {
  DomainOntologyFilter,
  DomainOntologyQuery,
  DomainOntologySortDirection,
  DomainOntologySortKey,
} from "./domainOntologyQueryTypes.ts";

function directionMultiplier(direction: DomainOntologySortDirection): number {
  return direction === "desc" ? -1 : 1;
}

function compareOntologies(
  left: RegisteredDomainOntology,
  right: RegisteredDomainOntology,
  sortKey: DomainOntologySortKey
): number {
  if (sortKey === "domainId") {
    const byDomain = left.package.domainId.localeCompare(right.package.domainId);
    if (byDomain !== 0) return byDomain;
    return left.package.ontologyId.localeCompare(right.package.ontologyId);
  }
  if (sortKey === "registrationOrder") {
    const byOrder = left.registrationOrder - right.registrationOrder;
    if (byOrder !== 0) return byOrder;
    return left.package.ontologyId.localeCompare(right.package.ontologyId);
  }
  return left.package.ontologyId.localeCompare(right.package.ontologyId);
}

function ontologyMatchesFilter(ontology: RegisteredDomainOntology, filter: DomainOntologyFilter): boolean {
  if (filter.domainId !== undefined && ontology.package.domainId !== filter.domainId) return false;
  if (filter.scope !== undefined && ontology.package.scope !== filter.scope) return false;
  if (filter.status !== undefined && ontology.package.status !== filter.status) return false;
  if (
    filter.entityTypeId !== undefined &&
    !ontology.package.entityTypes.some((entry) => entry.entityTypeId === filter.entityTypeId)
  ) {
    return false;
  }
  if (
    filter.relationshipTypeId !== undefined &&
    !ontology.package.relationshipTypes.some((entry) => entry.relationshipTypeId === filter.relationshipTypeId)
  ) {
    return false;
  }
  return true;
}

export function sortDomainOntologies(
  ontologies: readonly RegisteredDomainOntology[],
  sortKey: DomainOntologySortKey = "registrationOrder",
  direction: DomainOntologySortDirection = "asc"
): readonly RegisteredDomainOntology[] {
  const multiplier = directionMultiplier(direction);
  return Object.freeze(
    [...ontologies].sort((left, right) => compareOntologies(left, right, sortKey) * multiplier)
  );
}

export function filterDomainOntologies(
  registry: DomainOntologyRegistry,
  filter: DomainOntologyFilter
): readonly RegisteredDomainOntology[] {
  return Object.freeze(registry.ontologies.filter((ontology) => ontologyMatchesFilter(ontology, filter)));
}

export function queryDomainOntologies(
  registry: DomainOntologyRegistry,
  query: DomainOntologyQuery = Object.freeze({})
): readonly RegisteredDomainOntology[] {
  const filtered = query.filter ? filterDomainOntologies(registry, query.filter) : registry.ontologies;
  return sortDomainOntologies(filtered, query.sortKey, query.direction);
}

export function findOntologiesByDomain(
  registry: DomainOntologyRegistry,
  domainId: DomainId
): readonly RegisteredDomainOntology[] {
  return queryDomainOntologies(registry, {
    filter: Object.freeze({ domainId }),
    sortKey: "registrationOrder",
  });
}

export function findOntologiesByScope(
  registry: DomainOntologyRegistry,
  scope: DomainOntologyScope
): readonly RegisteredDomainOntology[] {
  return queryDomainOntologies(registry, {
    filter: Object.freeze({ scope }),
    sortKey: "registrationOrder",
  });
}

export function findOntologiesByStatus(
  registry: DomainOntologyRegistry,
  status: DomainOntologyStatus
): readonly RegisteredDomainOntology[] {
  return queryDomainOntologies(registry, {
    filter: Object.freeze({ status }),
    sortKey: "registrationOrder",
  });
}

export function findOntologyContainingEntityType(
  registry: DomainOntologyRegistry,
  entityTypeId: DomainEntityTypeId
): RegisteredDomainOntology | null {
  return (
    registry.ontologies.find((ontology) =>
      ontology.package.entityTypes.some((entry) => entry.entityTypeId === entityTypeId)
    ) ?? null
  );
}

export function findOntologyContainingRelationshipType(
  registry: DomainOntologyRegistry,
  relationshipTypeId: DomainRelationshipTypeId
): RegisteredDomainOntology | null {
  return (
    registry.ontologies.find((ontology) =>
      ontology.package.relationshipTypes.some((entry) => entry.relationshipTypeId === relationshipTypeId)
    ) ?? null
  );
}
