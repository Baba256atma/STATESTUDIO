export type {
  DomainKpiCompatibilityEntry,
  DomainKpiExtensionPolicy,
  DomainKpiFreezeResult,
  DomainKpiFreezeStatus,
  DomainKpiPhaseRegistryEntry,
  DomainKpiPlatformFreezeManifest,
  DomainKpiPlatformIdentity,
  DomainKpiPublicApiEntry,
  DomainKpiReleaseMetadata,
} from "./domainKpiPlatformFreezeTypes.ts";
export {
  DOMAIN_KPI_EXTENSION_POLICY,
  DOMAIN_KPI_PHASE_REGISTRY,
  DOMAIN_KPI_PLATFORM_IDENTITY,
  DOMAIN_KPI_PUBLIC_API_REGISTRY,
  DOMAIN_KPI_RELEASE_METADATA,
  listDomainKpiPlatformPhases,
  listDomainKpiPlatformPublicApis,
} from "./domainKpiPlatformFreezeRegistry.ts";
export {
  DOMAIN_KPI_COMPATIBILITY_MATRIX,
  getDomainKpiPlatformCompatibilityMatrix,
  isDomainKpiCompatibilityMatrixValid,
} from "./domainKpiPlatformCompatibility.ts";
export {
  buildDomainKpiPlatformFreezeManifest,
  isDomainKpiPlatformFreezeManifestValid,
} from "./domainKpiPlatformFreezeManifest.ts";
export {
  getDomainKpiPlatformFreezeState,
  runDomainKpiPlatformFreeze,
} from "./domainKpiPlatformFreezeRunner.ts";

import {
  getDomainKpiPlatformCompatibilityMatrix,
  isDomainKpiCompatibilityMatrixValid,
} from "./domainKpiPlatformCompatibility.ts";
import {
  buildDomainKpiPlatformFreezeManifest,
  isDomainKpiPlatformFreezeManifestValid,
} from "./domainKpiPlatformFreezeManifest.ts";
import {
  getDomainKpiPlatformFreezeState,
  runDomainKpiPlatformFreeze,
} from "./domainKpiPlatformFreezeRunner.ts";
import {
  listDomainKpiPlatformPhases,
  listDomainKpiPlatformPublicApis,
} from "./domainKpiPlatformFreezeRegistry.ts";

export const DomainKpiPlatformFreeze = Object.freeze({
  buildDomainKpiPlatformFreezeManifest,
  isDomainKpiPlatformFreezeManifestValid,
  runDomainKpiPlatformFreeze,
  getDomainKpiPlatformFreezeState,
  getDomainKpiPlatformCompatibilityMatrix,
  isDomainKpiCompatibilityMatrixValid,
  listDomainKpiPlatformPhases,
  listDomainKpiPlatformPublicApis,
});
