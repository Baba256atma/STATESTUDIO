export {
  DEFAULT_DOMAIN_KPI_STATUS,
  DOMAIN_KPI_VERSION,
  MAX_DOMAIN_KPI_ID_LENGTH,
  MAX_DOMAIN_KPI_PACKAGE_ID_LENGTH,
  SUPPORTED_DOMAIN_KPI_AGGREGATION_TYPES,
  SUPPORTED_DOMAIN_KPI_DIRECTIONS,
  SUPPORTED_DOMAIN_KPI_SCOPES,
  SUPPORTED_DOMAIN_KPI_UNIT_TYPES,
} from "./domainKpiConstants.ts";
export type {
  DomainKpiAggregationMetadata,
  DomainKpiAggregationType,
  DomainKpiDefinition,
  DomainKpiDirection,
  DomainKpiFoundationManifest,
  DomainKpiId,
  DomainKpiMeasurementIntent,
  DomainKpiPackage,
  DomainKpiPackageId,
  DomainKpiReference,
  DomainKpiRegistry,
  DomainKpiRegistryIndexes,
  DomainKpiRegistryMutationResult,
  DomainKpiScope,
  DomainKpiStatus,
  DomainKpiUnitMetadata,
  DomainKpiUnitType,
  DomainKpiValidationIssue,
  DomainKpiValidationResult,
  RegisteredDomainKpiPackage,
} from "./domainKpiTypes.ts";
export { DOMAIN_KPI_CONTRACT_VERSION } from "./domainKpiTypes.ts";
export {
  createDomainKpiRegistry,
  freezeDomainKpiRegistry,
  getDomainKpiPackage,
  hasDomainKpiPackage,
  listDomainKpiPackages,
  listKpiPackagesByDomain,
  registerDomainKpiPackage,
  unregisterDomainKpiPackage,
} from "./domainKpiRegistry.ts";
export {
  domainKpiValidationResult,
  isValidDomainKpiAggregationType,
  isValidDomainKpiDirection,
  isValidDomainKpiId,
  isValidDomainKpiPackageId,
  isValidDomainKpiScope,
  isValidDomainKpiStatus,
  isValidDomainKpiUnitType,
  validateDomainKpiFoundation,
  validateDomainKpiPackage,
  validateDomainKpiRegistration,
  validateDomainKpiRegistry,
} from "./domainKpiValidation.ts";
export { DOMAIN_KPI_PUBLIC_APIS, buildDomainKpiManifest } from "./domainKpiManifest.ts";

import { buildDomainKpiManifest } from "./domainKpiManifest.ts";
import {
  createDomainKpiRegistry,
  freezeDomainKpiRegistry,
  getDomainKpiPackage,
  hasDomainKpiPackage,
  listDomainKpiPackages,
  listKpiPackagesByDomain,
  registerDomainKpiPackage,
  unregisterDomainKpiPackage,
} from "./domainKpiRegistry.ts";
import {
  validateDomainKpiFoundation,
  validateDomainKpiPackage,
  validateDomainKpiRegistry,
} from "./domainKpiValidation.ts";

export const DomainKpiFoundation = Object.freeze({
  createDomainKpiRegistry,
  registerDomainKpiPackage,
  unregisterDomainKpiPackage,
  getDomainKpiPackage,
  listDomainKpiPackages,
  listKpiPackagesByDomain,
  hasDomainKpiPackage,
  freezeDomainKpiRegistry,
  buildDomainKpiManifest,
  validateDomainKpiFoundation,
  validateDomainKpiPackage,
  validateDomainKpiRegistry,
});
