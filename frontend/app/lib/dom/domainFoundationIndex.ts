export {
  DOM_ARCHITECTURAL_ROLE,
  DOM_DESCRIPTION,
  DOM_FOUNDATION_PLATFORM,
  DOM_LAYER_IDENTITY,
  DOM_PLATFORM_ID,
  DOM_PLATFORM_NAME,
  DOM_RELEASE_STAGE,
  DOM_VERSION,
  DEFAULT_DOMAIN_STATUS,
  MAX_DOMAIN_ID_LENGTH,
  SUPPORTED_DOMAIN_CATEGORIES,
} from "./domainFoundationConstants.ts";
export type {
  DomainCapability,
  DomainCategory,
  DomainDependency,
  DomainFoundationManifest,
  DomainFoundationPlatform,
  DomainId,
  DomainManifest,
  DomainMetadata,
  DomainPackage,
  DomainRegistry,
  DomainRegistryIndexes,
  DomainRegistryMutationResult,
  DomainStatus,
  DomainValidationIssue,
  DomainValidationResult,
  DomainVersion,
  RegisteredDomain,
} from "./domainFoundationTypes.ts";
export { DOMAIN_FOUNDATION_CONTRACT_VERSION } from "./domainFoundationTypes.ts";
export {
  createDomainRegistry,
  freezeDomainRegistry,
  getDomain,
  hasDomain,
  listDomains,
  registerDomain,
  unregisterDomain,
} from "./domainFoundationRegistry.ts";
export {
  compareDomainVersions,
  domainValidationResult,
  isValidDomainId,
  isValidDomainVersion,
  validateDomainFoundation,
  validateDomainPackage,
  validateDomainRegistration,
  validateDomainRegistry,
} from "./domainFoundationValidation.ts";
export { DOMAIN_FOUNDATION_PUBLIC_APIS, buildDomainFoundationManifest } from "./domainFoundationManifest.ts";

import { buildDomainFoundationManifest } from "./domainFoundationManifest.ts";
import {
  createDomainRegistry,
  freezeDomainRegistry,
  getDomain,
  hasDomain,
  listDomains,
  registerDomain,
  unregisterDomain,
} from "./domainFoundationRegistry.ts";
import { validateDomainFoundation, validateDomainPackage, validateDomainRegistry } from "./domainFoundationValidation.ts";

export const DomainFoundation = Object.freeze({
  createDomainRegistry,
  registerDomain,
  unregisterDomain,
  getDomain,
  listDomains,
  hasDomain,
  freezeDomainRegistry,
  buildDomainFoundationManifest,
  validateDomainFoundation,
  validateDomainPackage,
  validateDomainRegistry,
});
