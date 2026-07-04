import {
  DEFAULT_RECOMMENDATION_STATUS,
  DOMAIN_RECOMMENDATION_VERSION,
  MAX_RECOMMENDATION_CONTRACT_ID_LENGTH,
  MAX_RECOMMENDATION_PACKAGE_ID_LENGTH,
  SUPPORTED_RECOMMENDATION_SCOPES,
  SUPPORTED_RECOMMENDATION_STATUSES,
} from "./domainRecommendationConstants.ts";
import {
  DOMAIN_RECOMMENDATION_CONTRACT_VERSION,
  type DomainRecommendationFoundationManifest,
} from "./domainRecommendationTypes.ts";
import { validateDomainRecommendationFoundation } from "./domainRecommendationValidation.ts";

export const DOMAIN_RECOMMENDATION_PUBLIC_APIS = Object.freeze([
  "DomainRecommendationFoundation",
  "createDomainRecommendationRegistry",
  "registerDomainRecommendationPackage",
  "unregisterDomainRecommendationPackage",
  "getDomainRecommendationPackage",
  "listDomainRecommendationPackages",
  "listRecommendationPackagesByDomain",
  "hasDomainRecommendationPackage",
  "freezeDomainRecommendationRegistry",
  "buildDomainRecommendationManifest",
  "validateDomainRecommendationFoundation",
  "validateDomainRecommendationPackage",
  "validateDomainRecommendationRegistration",
  "validateDomainRecommendationRegistry",
] as const);

export function buildDomainRecommendationManifest(
  validation = validateDomainRecommendationFoundation()
): DomainRecommendationFoundationManifest {
  return Object.freeze({
    contractVersion: DOMAIN_RECOMMENDATION_CONTRACT_VERSION,
    version: DOMAIN_RECOMMENDATION_VERSION,
    defaultStatus: DEFAULT_RECOMMENDATION_STATUS,
    maxRecommendationPackageIdLength: MAX_RECOMMENDATION_PACKAGE_ID_LENGTH,
    maxRecommendationContractIdLength: MAX_RECOMMENDATION_CONTRACT_ID_LENGTH,
    supportedScopes: SUPPORTED_RECOMMENDATION_SCOPES,
    supportedStatuses: SUPPORTED_RECOMMENDATION_STATUSES,
    publicApis: DOMAIN_RECOMMENDATION_PUBLIC_APIS,
    validation,
    metadataOnly: true,
    runtimeBehavior: false,
    recommendationEngine: false,
    readyFor: "DOM-7:2 Domain Recommendation Query Layer",
  });
}
