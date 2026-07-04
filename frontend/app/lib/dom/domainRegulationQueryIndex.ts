export type {
  DomainControlLookupResult,
  DomainEvidenceLookupResult,
  DomainObligationLookupResult,
  DomainRegulationDiff,
  DomainRegulationDiffEntry,
  DomainRegulationDiffType,
  DomainRegulationFilter,
  DomainRegulationLookupResult,
  DomainRegulationQuery,
  DomainRegulationReferenceLookupResult,
  DomainRegulationSnapshot,
  DomainRegulationSnapshotEntry,
  DomainRegulationSortDirection,
  DomainRegulationSortKey,
} from "./domainRegulationQueryTypes.ts";
export {
  filterDomainRegulationPackages,
  findRegulationPackageContainingRegulation,
  findRegulationPackagesByDomain,
  findRegulationPackagesByJurisdictionScope,
  findRegulationPackagesByScope,
  findRegulationPackagesByStatus,
  queryDomainRegulationPackages,
  sortDomainRegulationPackages,
} from "./domainRegulationQuery.ts";
export {
  findControlsByObligation,
  findDomainControl,
  findDomainEvidence,
  findDomainObligation,
  findDomainRegulation,
  findEvidenceByControl,
  findObligationsByRegulation,
  findRegulationsByDomain,
} from "./domainRegulationLookup.ts";
export {
  buildDomainRegulationReferenceLookup,
  findRegulationsReferencingKpi,
  findRegulationsReferencingOntologyAttribute,
  findRegulationsReferencingOntologyEntity,
  findRegulationsReferencingVocabularyTerm,
} from "./domainRegulationReferenceInspection.ts";
export {
  buildDomainRegulationSnapshot,
  compareDomainRegulationSnapshots,
  diffDomainRegulationSnapshots,
  validateDomainRegulationSnapshot,
} from "./domainRegulationSnapshot.ts";

import {
  findControlsByObligation,
  findDomainControl,
  findDomainEvidence,
  findDomainObligation,
  findDomainRegulation,
  findEvidenceByControl,
  findObligationsByRegulation,
  findRegulationsByDomain,
} from "./domainRegulationLookup.ts";
import {
  filterDomainRegulationPackages,
  findRegulationPackageContainingRegulation,
  findRegulationPackagesByDomain,
  findRegulationPackagesByJurisdictionScope,
  findRegulationPackagesByScope,
  findRegulationPackagesByStatus,
  queryDomainRegulationPackages,
  sortDomainRegulationPackages,
} from "./domainRegulationQuery.ts";
import {
  buildDomainRegulationReferenceLookup,
  findRegulationsReferencingKpi,
  findRegulationsReferencingOntologyAttribute,
  findRegulationsReferencingOntologyEntity,
  findRegulationsReferencingVocabularyTerm,
} from "./domainRegulationReferenceInspection.ts";
import {
  buildDomainRegulationSnapshot,
  compareDomainRegulationSnapshots,
  diffDomainRegulationSnapshots,
  validateDomainRegulationSnapshot,
} from "./domainRegulationSnapshot.ts";

export const DomainRegulationQueryLayer = Object.freeze({
  queryDomainRegulationPackages,
  filterDomainRegulationPackages,
  sortDomainRegulationPackages,
  findRegulationPackagesByDomain,
  findRegulationPackagesByScope,
  findRegulationPackagesByStatus,
  findRegulationPackagesByJurisdictionScope,
  findRegulationPackageContainingRegulation,
  findDomainRegulation,
  findDomainObligation,
  findDomainControl,
  findDomainEvidence,
  findRegulationsByDomain,
  findObligationsByRegulation,
  findControlsByObligation,
  findEvidenceByControl,
  findRegulationsReferencingVocabularyTerm,
  findRegulationsReferencingOntologyEntity,
  findRegulationsReferencingOntologyAttribute,
  findRegulationsReferencingKpi,
  buildDomainRegulationReferenceLookup,
  buildDomainRegulationSnapshot,
  validateDomainRegulationSnapshot,
  compareDomainRegulationSnapshots,
  diffDomainRegulationSnapshots,
});
