export {
  DEFAULT_REASONING_STATUS,
  DOMAIN_REASONING_VERSION,
  MAX_REASONING_CONTRACT_ID_LENGTH,
  MAX_REASONING_PACKAGE_ID_LENGTH,
  SUPPORTED_REASONING_SCOPES,
  SUPPORTED_REASONING_STATUSES,
} from "./domainReasoningConstants.ts";
export type {
  DomainReasoningAssumption,
  DomainReasoningAssumptionId,
  DomainReasoningConfidenceMetadata,
  DomainReasoningContract,
  DomainReasoningContractId,
  DomainReasoningEvidenceRequirement,
  DomainReasoningEvidenceRequirementId,
  DomainReasoningFoundationManifest,
  DomainReasoningInput,
  DomainReasoningInputId,
  DomainReasoningOutput,
  DomainReasoningOutputId,
  DomainReasoningPackage,
  DomainReasoningPackageId,
  DomainReasoningReference,
  DomainReasoningRegistry,
  DomainReasoningRegistryIndexes,
  DomainReasoningRegistryMutationResult,
  DomainReasoningScope,
  DomainReasoningStatus,
  DomainReasoningTraceMetadata,
  DomainReasoningUncertaintyMetadata,
  DomainReasoningValidationIssue,
  DomainReasoningValidationResult,
  RegisteredDomainReasoningPackage,
} from "./domainReasoningTypes.ts";
export { DOMAIN_REASONING_CONTRACT_VERSION } from "./domainReasoningTypes.ts";
export {
  createDomainReasoningRegistry,
  freezeDomainReasoningRegistry,
  getDomainReasoningPackage,
  hasDomainReasoningPackage,
  listDomainReasoningPackages,
  listReasoningPackagesByDomain,
  registerDomainReasoningPackage,
  unregisterDomainReasoningPackage,
} from "./domainReasoningRegistry.ts";
export {
  domainReasoningValidationResult,
  isValidDomainReasoningContractId,
  isValidDomainReasoningPackageId,
  isValidDomainReasoningScope,
  isValidDomainReasoningStatus,
  validateDomainReasoningFoundation,
  validateDomainReasoningPackage,
  validateDomainReasoningRegistration,
  validateDomainReasoningRegistry,
} from "./domainReasoningValidation.ts";
export { DOMAIN_REASONING_PUBLIC_APIS, buildDomainReasoningManifest } from "./domainReasoningManifest.ts";

import { buildDomainReasoningManifest } from "./domainReasoningManifest.ts";
import {
  createDomainReasoningRegistry,
  freezeDomainReasoningRegistry,
  getDomainReasoningPackage,
  hasDomainReasoningPackage,
  listDomainReasoningPackages,
  listReasoningPackagesByDomain,
  registerDomainReasoningPackage,
  unregisterDomainReasoningPackage,
} from "./domainReasoningRegistry.ts";
import {
  validateDomainReasoningFoundation,
  validateDomainReasoningPackage,
  validateDomainReasoningRegistry,
} from "./domainReasoningValidation.ts";

export const DomainReasoningFoundation = Object.freeze({
  createDomainReasoningRegistry,
  registerDomainReasoningPackage,
  unregisterDomainReasoningPackage,
  getDomainReasoningPackage,
  listDomainReasoningPackages,
  listReasoningPackagesByDomain,
  hasDomainReasoningPackage,
  freezeDomainReasoningRegistry,
  buildDomainReasoningManifest,
  validateDomainReasoningFoundation,
  validateDomainReasoningPackage,
  validateDomainReasoningRegistry,
});
