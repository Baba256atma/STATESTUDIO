import { DOM_FOUNDATION_PLATFORM, SUPPORTED_DOMAIN_CATEGORIES, DEFAULT_DOMAIN_STATUS, MAX_DOMAIN_ID_LENGTH } from "./domainFoundationConstants.ts";
import { validateDomainFoundation } from "./domainFoundationValidation.ts";
import type { DomainFoundationManifest } from "./domainFoundationTypes.ts";

export const DOMAIN_FOUNDATION_PUBLIC_APIS = Object.freeze([
  "DomainFoundation",
  "createDomainRegistry",
  "registerDomain",
  "unregisterDomain",
  "getDomain",
  "listDomains",
  "hasDomain",
  "freezeDomainRegistry",
  "buildDomainFoundationManifest",
  "validateDomainFoundation",
  "validateDomainPackage",
  "validateDomainRegistry",
] as const);

export function buildDomainFoundationManifest(
  validation = validateDomainFoundation()
): DomainFoundationManifest {
  return Object.freeze({
    platform: DOM_FOUNDATION_PLATFORM,
    supportedCategories: SUPPORTED_DOMAIN_CATEGORIES,
    defaultStatus: DEFAULT_DOMAIN_STATUS,
    maxDomainIdLength: MAX_DOMAIN_ID_LENGTH,
    publicApis: DOMAIN_FOUNDATION_PUBLIC_APIS,
    validation,
    metadataOnly: true,
    runtimeBehavior: false,
    readyFor: "DOM-2 Domain Registry Platform",
  });
}
