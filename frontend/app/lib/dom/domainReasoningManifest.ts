import {
  DEFAULT_REASONING_STATUS,
  DOMAIN_REASONING_VERSION,
  MAX_REASONING_CONTRACT_ID_LENGTH,
  MAX_REASONING_PACKAGE_ID_LENGTH,
  SUPPORTED_REASONING_SCOPES,
  SUPPORTED_REASONING_STATUSES,
} from "./domainReasoningConstants.ts";
import {
  DOMAIN_REASONING_CONTRACT_VERSION,
  type DomainReasoningFoundationManifest,
} from "./domainReasoningTypes.ts";
import { validateDomainReasoningFoundation } from "./domainReasoningValidation.ts";

export const DOMAIN_REASONING_PUBLIC_APIS = Object.freeze([
  "DomainReasoningFoundation",
  "createDomainReasoningRegistry",
  "registerDomainReasoningPackage",
  "unregisterDomainReasoningPackage",
  "getDomainReasoningPackage",
  "listDomainReasoningPackages",
  "listReasoningPackagesByDomain",
  "hasDomainReasoningPackage",
  "freezeDomainReasoningRegistry",
  "buildDomainReasoningManifest",
  "validateDomainReasoningFoundation",
  "validateDomainReasoningPackage",
  "validateDomainReasoningRegistration",
  "validateDomainReasoningRegistry",
] as const);

export function buildDomainReasoningManifest(
  validation = validateDomainReasoningFoundation()
): DomainReasoningFoundationManifest {
  return Object.freeze({
    contractVersion: DOMAIN_REASONING_CONTRACT_VERSION,
    version: DOMAIN_REASONING_VERSION,
    defaultStatus: DEFAULT_REASONING_STATUS,
    maxReasoningPackageIdLength: MAX_REASONING_PACKAGE_ID_LENGTH,
    maxReasoningContractIdLength: MAX_REASONING_CONTRACT_ID_LENGTH,
    supportedScopes: SUPPORTED_REASONING_SCOPES,
    supportedStatuses: SUPPORTED_REASONING_STATUSES,
    publicApis: DOMAIN_REASONING_PUBLIC_APIS,
    validation,
    metadataOnly: true,
    runtimeBehavior: false,
    reasoningEngine: false,
    readyFor: "DOM-6:2 Domain Reasoning Query Layer",
  });
}
