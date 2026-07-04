export type {
  DomainRecommendationCompatibilityEntry,
  DomainRecommendationExtensionPolicy,
  DomainRecommendationFreezeResult,
  DomainRecommendationFreezeStatus,
  DomainRecommendationPhaseRegistryEntry,
  DomainRecommendationPlatformFreezeManifest,
  DomainRecommendationPlatformIdentity,
  DomainRecommendationPublicApiEntry,
  DomainRecommendationReleaseMetadata,
} from "./domainRecommendationPlatformFreezeTypes.ts";
export {
  DOMAIN_RECOMMENDATION_EXTENSION_POLICY,
  DOMAIN_RECOMMENDATION_PHASE_REGISTRY,
  DOMAIN_RECOMMENDATION_PLATFORM_IDENTITY,
  DOMAIN_RECOMMENDATION_PUBLIC_API_REGISTRY,
  DOMAIN_RECOMMENDATION_RELEASE_METADATA,
  listDomainRecommendationPlatformPhases,
  listDomainRecommendationPlatformPublicApis,
} from "./domainRecommendationPlatformFreezeRegistry.ts";
export {
  DOMAIN_RECOMMENDATION_COMPATIBILITY_MATRIX,
  getDomainRecommendationPlatformCompatibilityMatrix,
  isDomainRecommendationCompatibilityMatrixValid,
} from "./domainRecommendationPlatformCompatibility.ts";
export {
  buildDomainRecommendationPlatformFreezeManifest,
  isDomainRecommendationPlatformFreezeManifestValid,
} from "./domainRecommendationPlatformFreezeManifest.ts";
export {
  getDomainRecommendationPlatformFreezeState,
  runDomainRecommendationPlatformFreeze,
} from "./domainRecommendationPlatformFreezeRunner.ts";

import {
  getDomainRecommendationPlatformCompatibilityMatrix,
  isDomainRecommendationCompatibilityMatrixValid,
} from "./domainRecommendationPlatformCompatibility.ts";
import {
  buildDomainRecommendationPlatformFreezeManifest,
  isDomainRecommendationPlatformFreezeManifestValid,
} from "./domainRecommendationPlatformFreezeManifest.ts";
import {
  getDomainRecommendationPlatformFreezeState,
  runDomainRecommendationPlatformFreeze,
} from "./domainRecommendationPlatformFreezeRunner.ts";
import {
  listDomainRecommendationPlatformPhases,
  listDomainRecommendationPlatformPublicApis,
} from "./domainRecommendationPlatformFreezeRegistry.ts";

export const DomainRecommendationPlatformFreeze = Object.freeze({
  buildDomainRecommendationPlatformFreezeManifest,
  isDomainRecommendationPlatformFreezeManifestValid,
  runDomainRecommendationPlatformFreeze,
  getDomainRecommendationPlatformFreezeState,
  getDomainRecommendationPlatformCompatibilityMatrix,
  isDomainRecommendationCompatibilityMatrixValid,
  listDomainRecommendationPlatformPhases,
  listDomainRecommendationPlatformPublicApis,
});
