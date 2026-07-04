export type {
  DomainKpiDiff,
  DomainKpiDiffEntry,
  DomainKpiDiffType,
  DomainKpiFilter,
  DomainKpiLookupResult,
  DomainKpiQuery,
  DomainKpiReferenceField,
  DomainKpiReferenceLookupResult,
  DomainKpiReferencePredicate,
  DomainKpiSnapshot,
  DomainKpiSnapshotEntry,
  DomainKpiSortDirection,
  DomainKpiSortKey,
} from "./domainKpiQueryTypes.ts";
export {
  filterDomainKpiPackages,
  findKpiPackageContainingKpi,
  findKpiPackagesByDomain,
  findKpiPackagesByScope,
  findKpiPackagesByStatus,
  queryDomainKpiPackages,
  sortDomainKpiPackages,
} from "./domainKpiQuery.ts";
export {
  findDomainKpi,
  findKpisByAggregationType,
  findKpisByDirection,
  findKpisByDomain,
  findKpisByScope,
  findKpisByStatus,
  findKpisByUnitType,
} from "./domainKpiLookup.ts";
export {
  buildDomainKpiReferenceLookup,
  findKpisReferencingOntologyAttribute,
  findKpisReferencingOntologyEntity,
  findKpisReferencingOntologyRelationship,
  findKpisReferencingVocabularyTerm,
} from "./domainKpiReferenceInspection.ts";
export {
  buildDomainKpiSnapshot,
  compareDomainKpiSnapshots,
  diffDomainKpiSnapshots,
  validateDomainKpiSnapshot,
} from "./domainKpiSnapshot.ts";

import {
  findDomainKpi,
  findKpisByAggregationType,
  findKpisByDirection,
  findKpisByDomain,
  findKpisByScope,
  findKpisByStatus,
  findKpisByUnitType,
} from "./domainKpiLookup.ts";
import {
  filterDomainKpiPackages,
  findKpiPackageContainingKpi,
  findKpiPackagesByDomain,
  findKpiPackagesByScope,
  findKpiPackagesByStatus,
  queryDomainKpiPackages,
  sortDomainKpiPackages,
} from "./domainKpiQuery.ts";
import {
  buildDomainKpiReferenceLookup,
  findKpisReferencingOntologyAttribute,
  findKpisReferencingOntologyEntity,
  findKpisReferencingOntologyRelationship,
  findKpisReferencingVocabularyTerm,
} from "./domainKpiReferenceInspection.ts";
import {
  buildDomainKpiSnapshot,
  compareDomainKpiSnapshots,
  diffDomainKpiSnapshots,
  validateDomainKpiSnapshot,
} from "./domainKpiSnapshot.ts";

export const DomainKpiQueryLayer = Object.freeze({
  queryDomainKpiPackages,
  filterDomainKpiPackages,
  sortDomainKpiPackages,
  findKpiPackagesByDomain,
  findKpiPackagesByScope,
  findKpiPackagesByStatus,
  findKpiPackageContainingKpi,
  findDomainKpi,
  findKpisByDomain,
  findKpisByScope,
  findKpisByStatus,
  findKpisByUnitType,
  findKpisByAggregationType,
  findKpisByDirection,
  findKpisReferencingVocabularyTerm,
  findKpisReferencingOntologyEntity,
  findKpisReferencingOntologyAttribute,
  findKpisReferencingOntologyRelationship,
  buildDomainKpiReferenceLookup,
  buildDomainKpiSnapshot,
  validateDomainKpiSnapshot,
  compareDomainKpiSnapshots,
  diffDomainKpiSnapshots,
});
