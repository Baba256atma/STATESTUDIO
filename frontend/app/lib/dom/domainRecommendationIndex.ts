export {
  DEFAULT_RECOMMENDATION_STATUS,
  DOMAIN_RECOMMENDATION_VERSION,
  MAX_RECOMMENDATION_CONTRACT_ID_LENGTH,
  MAX_RECOMMENDATION_PACKAGE_ID_LENGTH,
  SUPPORTED_RECOMMENDATION_SCOPES,
  SUPPORTED_RECOMMENDATION_STATUSES,
} from "./domainRecommendationConstants.ts";
export type {
  DomainRecommendationAssumption,
  DomainRecommendationAssumptionId,
  DomainRecommendationConfidenceMetadata,
  DomainRecommendationConstraint,
  DomainRecommendationConstraintId,
  DomainRecommendationContract,
  DomainRecommendationContractId,
  DomainRecommendationFoundationManifest,
  DomainRecommendationInput,
  DomainRecommendationInputId,
  DomainRecommendationOutput,
  DomainRecommendationOutputId,
  DomainRecommendationPackage,
  DomainRecommendationPackageId,
  DomainRecommendationRationaleMetadata,
  DomainRecommendationReference,
  DomainRecommendationRegistry,
  DomainRecommendationRegistryIndexes,
  DomainRecommendationRegistryMutationResult,
  DomainRecommendationScope,
  DomainRecommendationStatus,
  DomainRecommendationTraceMetadata,
  DomainRecommendationUncertaintyMetadata,
  DomainRecommendationValidationIssue,
  DomainRecommendationValidationResult,
  RegisteredDomainRecommendationPackage,
} from "./domainRecommendationTypes.ts";
export { DOMAIN_RECOMMENDATION_CONTRACT_VERSION } from "./domainRecommendationTypes.ts";
export {
  createDomainRecommendationRegistry,
  freezeDomainRecommendationRegistry,
  getDomainRecommendationPackage,
  hasDomainRecommendationPackage,
  listDomainRecommendationPackages,
  listRecommendationPackagesByDomain,
  registerDomainRecommendationPackage,
  unregisterDomainRecommendationPackage,
} from "./domainRecommendationRegistry.ts";
export {
  domainRecommendationValidationResult,
  isValidDomainRecommendationContractId,
  isValidDomainRecommendationPackageId,
  isValidDomainRecommendationScope,
  isValidDomainRecommendationStatus,
  validateDomainRecommendationFoundation,
  validateDomainRecommendationPackage,
  validateDomainRecommendationRegistration,
  validateDomainRecommendationRegistry,
} from "./domainRecommendationValidation.ts";
export { DOMAIN_RECOMMENDATION_PUBLIC_APIS, buildDomainRecommendationManifest } from "./domainRecommendationManifest.ts";

import { buildDomainRecommendationManifest } from "./domainRecommendationManifest.ts";
import {
  createDomainRecommendationRegistry,
  freezeDomainRecommendationRegistry,
  getDomainRecommendationPackage,
  hasDomainRecommendationPackage,
  listDomainRecommendationPackages,
  listRecommendationPackagesByDomain,
  registerDomainRecommendationPackage,
  unregisterDomainRecommendationPackage,
} from "./domainRecommendationRegistry.ts";
import {
  validateDomainRecommendationFoundation,
  validateDomainRecommendationPackage,
  validateDomainRecommendationRegistry,
} from "./domainRecommendationValidation.ts";

export const DomainRecommendationFoundation = Object.freeze({
  createDomainRecommendationRegistry,
  registerDomainRecommendationPackage,
  unregisterDomainRecommendationPackage,
  getDomainRecommendationPackage,
  listDomainRecommendationPackages,
  listRecommendationPackagesByDomain,
  hasDomainRecommendationPackage,
  freezeDomainRecommendationRegistry,
  buildDomainRecommendationManifest,
  validateDomainRecommendationFoundation,
  validateDomainRecommendationPackage,
  validateDomainRecommendationRegistry,
});
