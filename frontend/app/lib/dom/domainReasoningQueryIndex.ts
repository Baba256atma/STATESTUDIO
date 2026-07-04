export type {
  DomainReasoningAssumptionLookupResult,
  DomainReasoningDiff,
  DomainReasoningDiffEntry,
  DomainReasoningDiffType,
  DomainReasoningEvidenceRequirementLookupResult,
  DomainReasoningFilter,
  DomainReasoningInputLookupResult,
  DomainReasoningLookupResult,
  DomainReasoningMetadataLookup,
  DomainReasoningOutputLookupResult,
  DomainReasoningQuery,
  DomainReasoningReferenceLookupResult,
  DomainReasoningSnapshot,
  DomainReasoningSnapshotEntry,
  DomainReasoningSortDirection,
  DomainReasoningSortKey,
} from "./domainReasoningQueryTypes.ts";
export {
  filterDomainReasoningPackages,
  findReasoningPackageContainingContract,
  findReasoningPackagesByDomain,
  findReasoningPackagesByScope,
  findReasoningPackagesByStatus,
  queryDomainReasoningPackages,
  sortDomainReasoningPackages,
} from "./domainReasoningQuery.ts";
export {
  findDomainReasoningContract,
  findReasoningAssumptions,
  findReasoningConfidenceMetadata,
  findReasoningEvidenceRequirements,
  findReasoningInputs,
  findReasoningOutputs,
  findReasoningTraceMetadata,
  findReasoningUncertaintyMetadata,
} from "./domainReasoningLookup.ts";
export {
  buildDomainReasoningReferenceLookup,
  findReasoningReferencingKpi,
  findReasoningReferencingOntologyAttribute,
  findReasoningReferencingOntologyEntity,
  findReasoningReferencingRegulation,
  findReasoningReferencingVocabularyTerm,
} from "./domainReasoningReferenceInspection.ts";
export {
  buildDomainReasoningSnapshot,
  compareDomainReasoningSnapshots,
  diffDomainReasoningSnapshots,
  validateDomainReasoningSnapshot,
} from "./domainReasoningSnapshot.ts";

import {
  findDomainReasoningContract,
  findReasoningAssumptions,
  findReasoningConfidenceMetadata,
  findReasoningEvidenceRequirements,
  findReasoningInputs,
  findReasoningOutputs,
  findReasoningTraceMetadata,
  findReasoningUncertaintyMetadata,
} from "./domainReasoningLookup.ts";
import {
  filterDomainReasoningPackages,
  findReasoningPackageContainingContract,
  findReasoningPackagesByDomain,
  findReasoningPackagesByScope,
  findReasoningPackagesByStatus,
  queryDomainReasoningPackages,
  sortDomainReasoningPackages,
} from "./domainReasoningQuery.ts";
import {
  buildDomainReasoningReferenceLookup,
  findReasoningReferencingKpi,
  findReasoningReferencingOntologyAttribute,
  findReasoningReferencingOntologyEntity,
  findReasoningReferencingRegulation,
  findReasoningReferencingVocabularyTerm,
} from "./domainReasoningReferenceInspection.ts";
import {
  buildDomainReasoningSnapshot,
  compareDomainReasoningSnapshots,
  diffDomainReasoningSnapshots,
  validateDomainReasoningSnapshot,
} from "./domainReasoningSnapshot.ts";

export const DomainReasoningQueryLayer = Object.freeze({
  queryDomainReasoningPackages,
  filterDomainReasoningPackages,
  sortDomainReasoningPackages,
  findReasoningPackagesByDomain,
  findReasoningPackagesByScope,
  findReasoningPackagesByStatus,
  findReasoningPackageContainingContract,
  findDomainReasoningContract,
  findReasoningInputs,
  findReasoningOutputs,
  findReasoningAssumptions,
  findReasoningEvidenceRequirements,
  findReasoningConfidenceMetadata,
  findReasoningUncertaintyMetadata,
  findReasoningTraceMetadata,
  findReasoningReferencingVocabularyTerm,
  findReasoningReferencingOntologyEntity,
  findReasoningReferencingOntologyAttribute,
  findReasoningReferencingKpi,
  findReasoningReferencingRegulation,
  buildDomainReasoningReferenceLookup,
  buildDomainReasoningSnapshot,
  validateDomainReasoningSnapshot,
  compareDomainReasoningSnapshots,
  diffDomainReasoningSnapshots,
});
