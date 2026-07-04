import {
  DEFAULT_DOMAIN_KPI_STATUS,
  DOMAIN_KPI_VERSION,
  MAX_DOMAIN_KPI_ID_LENGTH,
  MAX_DOMAIN_KPI_PACKAGE_ID_LENGTH,
  SUPPORTED_DOMAIN_KPI_AGGREGATION_TYPES,
  SUPPORTED_DOMAIN_KPI_DIRECTIONS,
  SUPPORTED_DOMAIN_KPI_SCOPES,
  SUPPORTED_DOMAIN_KPI_UNIT_TYPES,
} from "./domainKpiConstants.ts";
import { DOMAIN_KPI_CONTRACT_VERSION, type DomainKpiFoundationManifest } from "./domainKpiTypes.ts";
import { validateDomainKpiFoundation } from "./domainKpiValidation.ts";

export const DOMAIN_KPI_PUBLIC_APIS = Object.freeze([
  "DomainKpiFoundation",
  "createDomainKpiRegistry",
  "registerDomainKpiPackage",
  "unregisterDomainKpiPackage",
  "getDomainKpiPackage",
  "listDomainKpiPackages",
  "listKpiPackagesByDomain",
  "hasDomainKpiPackage",
  "freezeDomainKpiRegistry",
  "buildDomainKpiManifest",
  "validateDomainKpiFoundation",
  "validateDomainKpiPackage",
  "validateDomainKpiRegistration",
  "validateDomainKpiRegistry",
] as const);

export function buildDomainKpiManifest(
  validation = validateDomainKpiFoundation()
): DomainKpiFoundationManifest {
  return Object.freeze({
    contractVersion: DOMAIN_KPI_CONTRACT_VERSION,
    version: DOMAIN_KPI_VERSION,
    defaultStatus: DEFAULT_DOMAIN_KPI_STATUS,
    maxKpiIdLength: MAX_DOMAIN_KPI_ID_LENGTH,
    maxKpiPackageIdLength: MAX_DOMAIN_KPI_PACKAGE_ID_LENGTH,
    supportedScopes: SUPPORTED_DOMAIN_KPI_SCOPES,
    supportedUnitTypes: SUPPORTED_DOMAIN_KPI_UNIT_TYPES,
    supportedAggregationTypes: SUPPORTED_DOMAIN_KPI_AGGREGATION_TYPES,
    supportedDirections: SUPPORTED_DOMAIN_KPI_DIRECTIONS,
    publicApis: DOMAIN_KPI_PUBLIC_APIS,
    validation,
    metadataOnly: true,
    runtimeBehavior: false,
    readyFor: "DOM-4:2 Domain KPI Query Layer",
  });
}
