export {
  DEFAULT_DOMAIN_REGULATION_STATUS,
  DOMAIN_REGULATION_VERSION,
  MAX_DOMAIN_CONTROL_ID_LENGTH,
  MAX_DOMAIN_EVIDENCE_ID_LENGTH,
  MAX_DOMAIN_OBLIGATION_ID_LENGTH,
  MAX_DOMAIN_REGULATION_ID_LENGTH,
  MAX_DOMAIN_REGULATION_PACKAGE_ID_LENGTH,
  SUPPORTED_DOMAIN_JURISDICTION_SCOPES,
  SUPPORTED_DOMAIN_REGULATION_SCOPES,
  SUPPORTED_DOMAIN_REGULATION_STATUSES,
} from "./domainRegulationConstants.ts";
export type {
  DomainControlId,
  DomainControlMetadata,
  DomainEvidenceId,
  DomainEvidenceMetadata,
  DomainJurisdictionScope,
  DomainObligationId,
  DomainObligationMetadata,
  DomainRegulationDefinition,
  DomainRegulationFoundationManifest,
  DomainRegulationId,
  DomainRegulationPackage,
  DomainRegulationPackageId,
  DomainRegulationReference,
  DomainRegulationRegistry,
  DomainRegulationRegistryIndexes,
  DomainRegulationRegistryMutationResult,
  DomainRegulationScope,
  DomainRegulationStatus,
  DomainRegulationValidationIssue,
  DomainRegulationValidationResult,
  RegisteredDomainRegulationPackage,
} from "./domainRegulationTypes.ts";
export { DOMAIN_REGULATION_CONTRACT_VERSION } from "./domainRegulationTypes.ts";
export {
  createDomainRegulationRegistry,
  freezeDomainRegulationRegistry,
  getDomainRegulationPackage,
  hasDomainRegulationPackage,
  listDomainRegulationPackages,
  listRegulationPackagesByDomain,
  registerDomainRegulationPackage,
  unregisterDomainRegulationPackage,
} from "./domainRegulationRegistry.ts";
export {
  domainRegulationValidationResult,
  isValidDomainControlId,
  isValidDomainEvidenceId,
  isValidDomainJurisdictionScope,
  isValidDomainObligationId,
  isValidDomainRegulationId,
  isValidDomainRegulationPackageId,
  isValidDomainRegulationScope,
  isValidDomainRegulationStatus,
  validateDomainRegulationFoundation,
  validateDomainRegulationPackage,
  validateDomainRegulationRegistration,
  validateDomainRegulationRegistry,
} from "./domainRegulationValidation.ts";
export { DOMAIN_REGULATION_PUBLIC_APIS, buildDomainRegulationManifest } from "./domainRegulationManifest.ts";

import { buildDomainRegulationManifest } from "./domainRegulationManifest.ts";
import {
  createDomainRegulationRegistry,
  freezeDomainRegulationRegistry,
  getDomainRegulationPackage,
  hasDomainRegulationPackage,
  listDomainRegulationPackages,
  listRegulationPackagesByDomain,
  registerDomainRegulationPackage,
  unregisterDomainRegulationPackage,
} from "./domainRegulationRegistry.ts";
import {
  validateDomainRegulationFoundation,
  validateDomainRegulationPackage,
  validateDomainRegulationRegistry,
} from "./domainRegulationValidation.ts";

export const DomainRegulationFoundation = Object.freeze({
  createDomainRegulationRegistry,
  registerDomainRegulationPackage,
  unregisterDomainRegulationPackage,
  getDomainRegulationPackage,
  listDomainRegulationPackages,
  listRegulationPackagesByDomain,
  hasDomainRegulationPackage,
  freezeDomainRegulationRegistry,
  buildDomainRegulationManifest,
  validateDomainRegulationFoundation,
  validateDomainRegulationPackage,
  validateDomainRegulationRegistry,
});
