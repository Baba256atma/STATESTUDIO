export type {
  DomainOntologyCompatibilityEntry,
  DomainOntologyExtensionPolicy,
  DomainOntologyFreezeResult,
  DomainOntologyFreezeStatus,
  DomainOntologyPhaseRegistryEntry,
  DomainOntologyPlatformFreezeManifest,
  DomainOntologyPlatformIdentity,
  DomainOntologyPublicApiEntry,
  DomainOntologyReleaseMetadata,
} from "./domainOntologyPlatformFreezeTypes.ts";
export {
  DOMAIN_ONTOLOGY_EXTENSION_POLICY,
  DOMAIN_ONTOLOGY_PHASE_REGISTRY,
  DOMAIN_ONTOLOGY_PLATFORM_IDENTITY,
  DOMAIN_ONTOLOGY_PUBLIC_API_REGISTRY,
  DOMAIN_ONTOLOGY_RELEASE_METADATA,
  listDomainOntologyPlatformPhases,
  listDomainOntologyPlatformPublicApis,
} from "./domainOntologyPlatformFreezeRegistry.ts";
export {
  DOMAIN_ONTOLOGY_COMPATIBILITY_MATRIX,
  getDomainOntologyPlatformCompatibilityMatrix,
  isDomainOntologyCompatibilityMatrixValid,
} from "./domainOntologyPlatformCompatibility.ts";
export {
  buildDomainOntologyPlatformFreezeManifest,
  isDomainOntologyPlatformFreezeManifestValid,
} from "./domainOntologyPlatformFreezeManifest.ts";
export {
  getDomainOntologyPlatformFreezeState,
  runDomainOntologyPlatformFreeze,
} from "./domainOntologyPlatformFreezeRunner.ts";

import {
  getDomainOntologyPlatformCompatibilityMatrix,
  isDomainOntologyCompatibilityMatrixValid,
} from "./domainOntologyPlatformCompatibility.ts";
import {
  buildDomainOntologyPlatformFreezeManifest,
  isDomainOntologyPlatformFreezeManifestValid,
} from "./domainOntologyPlatformFreezeManifest.ts";
import {
  getDomainOntologyPlatformFreezeState,
  runDomainOntologyPlatformFreeze,
} from "./domainOntologyPlatformFreezeRunner.ts";
import {
  listDomainOntologyPlatformPhases,
  listDomainOntologyPlatformPublicApis,
} from "./domainOntologyPlatformFreezeRegistry.ts";

export const DomainOntologyPlatformFreeze = Object.freeze({
  buildDomainOntologyPlatformFreezeManifest,
  isDomainOntologyPlatformFreezeManifestValid,
  runDomainOntologyPlatformFreeze,
  getDomainOntologyPlatformFreezeState,
  getDomainOntologyPlatformCompatibilityMatrix,
  isDomainOntologyCompatibilityMatrixValid,
  listDomainOntologyPlatformPhases,
  listDomainOntologyPlatformPublicApis,
});
