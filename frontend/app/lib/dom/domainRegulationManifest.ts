import {
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
import {
  DOMAIN_REGULATION_CONTRACT_VERSION,
  type DomainRegulationFoundationManifest,
} from "./domainRegulationTypes.ts";
import { validateDomainRegulationFoundation } from "./domainRegulationValidation.ts";

export const DOMAIN_REGULATION_PUBLIC_APIS = Object.freeze([
  "DomainRegulationFoundation",
  "createDomainRegulationRegistry",
  "registerDomainRegulationPackage",
  "unregisterDomainRegulationPackage",
  "getDomainRegulationPackage",
  "listDomainRegulationPackages",
  "listRegulationPackagesByDomain",
  "hasDomainRegulationPackage",
  "freezeDomainRegulationRegistry",
  "buildDomainRegulationManifest",
  "validateDomainRegulationFoundation",
  "validateDomainRegulationPackage",
  "validateDomainRegulationRegistration",
  "validateDomainRegulationRegistry",
] as const);

export function buildDomainRegulationManifest(
  validation = validateDomainRegulationFoundation()
): DomainRegulationFoundationManifest {
  return Object.freeze({
    contractVersion: DOMAIN_REGULATION_CONTRACT_VERSION,
    version: DOMAIN_REGULATION_VERSION,
    defaultStatus: DEFAULT_DOMAIN_REGULATION_STATUS,
    maxRegulationPackageIdLength: MAX_DOMAIN_REGULATION_PACKAGE_ID_LENGTH,
    maxRegulationIdLength: MAX_DOMAIN_REGULATION_ID_LENGTH,
    maxObligationIdLength: MAX_DOMAIN_OBLIGATION_ID_LENGTH,
    maxControlIdLength: MAX_DOMAIN_CONTROL_ID_LENGTH,
    maxEvidenceIdLength: MAX_DOMAIN_EVIDENCE_ID_LENGTH,
    supportedScopes: SUPPORTED_DOMAIN_REGULATION_SCOPES,
    supportedJurisdictionScopes: SUPPORTED_DOMAIN_JURISDICTION_SCOPES,
    supportedStatuses: SUPPORTED_DOMAIN_REGULATION_STATUSES,
    publicApis: DOMAIN_REGULATION_PUBLIC_APIS,
    validation,
    metadataOnly: true,
    runtimeBehavior: false,
    readyFor: "DOM-5:2 Domain Regulation Query Layer",
  });
}
