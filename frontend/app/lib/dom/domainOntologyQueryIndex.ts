export type {
  DomainAttributeLookupResult,
  DomainConstraintLookupResult,
  DomainEntityLookupResult,
  DomainOntologyDiff,
  DomainOntologyDiffEntry,
  DomainOntologyDiffType,
  DomainOntologyFilter,
  DomainOntologyQuery,
  DomainOntologySnapshot,
  DomainOntologySnapshotEntry,
  DomainOntologySortDirection,
  DomainOntologySortKey,
  DomainOntologyTraversalResult,
  DomainRelationshipLookupResult,
} from "./domainOntologyQueryTypes.ts";
export {
  filterDomainOntologies,
  findOntologiesByDomain,
  findOntologiesByScope,
  findOntologiesByStatus,
  findOntologyContainingEntityType,
  findOntologyContainingRelationshipType,
  queryDomainOntologies,
  sortDomainOntologies,
} from "./domainOntologyQuery.ts";
export {
  findAttributesByOwner,
  findConstraintsByTarget,
  findDomainAttribute,
  findDomainConstraint,
  findDomainEntityType,
  findDomainRelationshipType,
} from "./domainOntologyLookup.ts";
export {
  buildOntologyTraversalResult,
  findConnectedEntityTypes,
  findIncomingRelationshipTypes,
  findOutgoingRelationshipTypes,
} from "./domainOntologyTraversal.ts";
export {
  buildDomainOntologySnapshot,
  compareDomainOntologySnapshots,
  diffDomainOntologySnapshots,
  validateDomainOntologySnapshot,
} from "./domainOntologySnapshot.ts";

import {
  findAttributesByOwner,
  findConstraintsByTarget,
  findDomainAttribute,
  findDomainConstraint,
  findDomainEntityType,
  findDomainRelationshipType,
} from "./domainOntologyLookup.ts";
import {
  filterDomainOntologies,
  findOntologiesByDomain,
  findOntologiesByScope,
  findOntologiesByStatus,
  findOntologyContainingEntityType,
  findOntologyContainingRelationshipType,
  queryDomainOntologies,
  sortDomainOntologies,
} from "./domainOntologyQuery.ts";
import {
  buildDomainOntologySnapshot,
  compareDomainOntologySnapshots,
  diffDomainOntologySnapshots,
  validateDomainOntologySnapshot,
} from "./domainOntologySnapshot.ts";
import {
  buildOntologyTraversalResult,
  findConnectedEntityTypes,
  findIncomingRelationshipTypes,
  findOutgoingRelationshipTypes,
} from "./domainOntologyTraversal.ts";

export const DomainOntologyQueryLayer = Object.freeze({
  queryDomainOntologies,
  filterDomainOntologies,
  sortDomainOntologies,
  findOntologiesByDomain,
  findOntologiesByScope,
  findOntologiesByStatus,
  findOntologyContainingEntityType,
  findOntologyContainingRelationshipType,
  findDomainEntityType,
  findDomainRelationshipType,
  findDomainAttribute,
  findDomainConstraint,
  findAttributesByOwner,
  findConstraintsByTarget,
  findOutgoingRelationshipTypes,
  findIncomingRelationshipTypes,
  findConnectedEntityTypes,
  buildOntologyTraversalResult,
  buildDomainOntologySnapshot,
  validateDomainOntologySnapshot,
  compareDomainOntologySnapshots,
  diffDomainOntologySnapshots,
});
