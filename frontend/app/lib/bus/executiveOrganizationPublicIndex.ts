export {
  EXECUTIVE_ORGANIZATION,
  EXECUTIVE_ORGANIZATION_CONTRACT_REGISTRY,
  EXECUTIVE_ORGANIZATION_HIERARCHY,
  EXECUTIVE_ORGANIZATION_PLATFORM_DESCRIPTION,
  EXECUTIVE_ORGANIZATION_PLATFORM_ID,
  EXECUTIVE_ORGANIZATION_PLATFORM_NAME,
  EXECUTIVE_ORGANIZATION_PLATFORM_NAMESPACE,
  EXECUTIVE_ORGANIZATION_PLATFORM_VERSION,
  EXECUTIVE_ORGANIZATION_PUBLIC_APIS,
  EXECUTIVE_ORGANIZATION_STATUSES,
  EXECUTIVE_ORGANIZATION_UNIT,
  EXECUTIVE_ORGANIZATION_UNIT_TYPES,
  EXECUTIVE_OWNERSHIP,
  EXECUTIVE_OWNERSHIP_TYPES,
  EXECUTIVE_POSITION,
  EXECUTIVE_REPORTING_RELATIONSHIP,
  EXECUTIVE_REPORTING_RELATIONSHIP_TYPES,
  EXECUTIVE_RESPONSIBILITY,
  EXECUTIVE_RESPONSIBILITY_CATEGORIES,
  EXECUTIVE_ROLE,
  ExecutiveOrganizationContractFoundation,
  ExecutiveOrganizationContractTypes,
  ExecutiveOrganizationContracts,
  ExecutiveOrganizationPublicFoundation,
  EXECUTIVE_ORGANIZATION_VALIDATION_RESULT as EXECUTIVE_ORGANIZATION_CONTRACT_VALIDATION_RESULT,
} from "./executiveOrganizationIndex.ts";
export type * from "./executiveOrganizationTypes.ts";
export type { ExecutiveOrganizationPublicTypes } from "./executiveOrganizationIndex.ts";
export * from "./executiveOrganizationRegistryIndex.ts";
export * from "./executiveOrganizationModelIndex.ts";
export * from "./executiveOrganizationValidationIndex.ts";
export * from "./executiveOrganizationManifestIndex.ts";
export * from "./executiveOrganizationPlatformIndex.ts";
export * from "./executiveOrganizationCertificationIndex.ts";
export * from "./executiveOrganizationPlatformFreezeIndex.ts";

import * as contracts from "./executiveOrganizationIndex.ts";
import * as registry from "./executiveOrganizationRegistryIndex.ts";
import * as model from "./executiveOrganizationModelIndex.ts";
import * as validation from "./executiveOrganizationValidationIndex.ts";
import * as manifest from "./executiveOrganizationManifestIndex.ts";
import * as platform from "./executiveOrganizationPlatformIndex.ts";
import * as certification from "./executiveOrganizationCertificationIndex.ts";
import * as freeze from "./executiveOrganizationPlatformFreezeIndex.ts";
import {
  EXECUTIVE_ORGANIZATION_PLATFORM_DESCRIPTION,
  EXECUTIVE_ORGANIZATION_PLATFORM_ID,
  EXECUTIVE_ORGANIZATION_PLATFORM_NAME,
  EXECUTIVE_ORGANIZATION_PLATFORM_NAMESPACE,
  EXECUTIVE_ORGANIZATION_PLATFORM_VERSION,
} from "./executiveOrganizationIndex.ts";
import {
  EXECUTIVE_ORGANIZATION_CERTIFICATION_STATUS,
} from "./executiveOrganizationCertificationIndex.ts";
import {
  EXECUTIVE_ORGANIZATION_FREEZE_STATUS,
  EXECUTIVE_ORGANIZATION_RELEASE_STATUS,
} from "./executiveOrganizationPlatformFreezeIndex.ts";

export const EXECUTIVE_ORGANIZATION_PUBLIC_API_ID =
  "executive-organization-public-api-registry" as const;

export const EXECUTIVE_ORGANIZATION_PUBLIC_API_VERSION = "1.0.0" as const;

export const EXECUTIVE_ORGANIZATION_PUBLIC_API_NAMESPACE =
  "nexora.bus.executive-organization.public-index" as const;

export const EXECUTIVE_ORGANIZATION_PUBLIC_API_STATUS = "PUBLIC" as const;

export const EXECUTIVE_ORGANIZATION_INTELLIGENCE_PUBLIC_METADATA = Object.freeze({
  platformId: EXECUTIVE_ORGANIZATION_PLATFORM_ID,
  platformName: EXECUTIVE_ORGANIZATION_PLATFORM_NAME,
  platformNamespace: EXECUTIVE_ORGANIZATION_PLATFORM_NAMESPACE,
  platformVersion: EXECUTIVE_ORGANIZATION_PLATFORM_VERSION,
  platformStatus: "Published",
  releaseStatus: EXECUTIVE_ORGANIZATION_RELEASE_STATUS,
  certificationStatus: EXECUTIVE_ORGANIZATION_CERTIFICATION_STATUS,
  freezeStatus: EXECUTIVE_ORGANIZATION_FREEZE_STATUS,
  publicApiStatus: EXECUTIVE_ORGANIZATION_PUBLIC_API_STATUS,
  metadata: Object.freeze({
    description:
      "Final canonical public export surface for the Executive Organization Intelligence Platform.",
    createdBy: "BUS-30:9",
    metadataOnly: true,
    immutable: true,
  }),
  metadataOnly: true,
  immutable: true,
} as const);

export const EXECUTIVE_ORGANIZATION_PUBLIC_API_REGISTRY = Object.freeze({
  publicApiId: EXECUTIVE_ORGANIZATION_PUBLIC_API_ID,
  publicApiVersion: EXECUTIVE_ORGANIZATION_PUBLIC_API_VERSION,
  publicApiNamespace: EXECUTIVE_ORGANIZATION_PUBLIC_API_NAMESPACE,
  publicApiStatus: EXECUTIVE_ORGANIZATION_PUBLIC_API_STATUS,
  exportedPhases: Object.freeze([
    "BUS-30:1",
    "BUS-30:2",
    "BUS-30:3",
    "BUS-30:4",
    "BUS-30:5",
    "BUS-30:6",
    "BUS-30:7",
    "BUS-30:8",
  ] as const),
  exportedNamespaces: Object.freeze([
    "executiveOrganizationIndex",
    "executiveOrganizationRegistryIndex",
    "executiveOrganizationModelIndex",
    "executiveOrganizationValidationIndex",
    "executiveOrganizationManifestIndex",
    "executiveOrganizationPlatformIndex",
    "executiveOrganizationCertificationIndex",
    "executiveOrganizationPlatformFreezeIndex",
  ] as const),
  compatibility: Object.freeze([
    "metadata-only",
    "public-api-only",
    "deterministic",
    "immutable",
    `platform:${EXECUTIVE_ORGANIZATION_PLATFORM_NAMESPACE}`,
  ]),
  metadata: Object.freeze({
    description: EXECUTIVE_ORGANIZATION_PLATFORM_DESCRIPTION,
    createdBy: "BUS-30:9",
    metadataOnly: true,
    immutable: true,
  }),
  metadataOnly: true,
  immutable: true,
} as const);

export const ExecutiveOrganizationIntelligencePlatform = Object.freeze({
  contracts: Object.freeze({ ...contracts }),
  registry: Object.freeze({ ...registry }),
  model: Object.freeze({ ...model }),
  validation: Object.freeze({ ...validation }),
  manifest: Object.freeze({ ...manifest }),
  platform: Object.freeze({ ...platform }),
  certification: Object.freeze({ ...certification }),
  freeze: Object.freeze({ ...freeze }),
  metadata: EXECUTIVE_ORGANIZATION_INTELLIGENCE_PUBLIC_METADATA,
  publicApiRegistry: EXECUTIVE_ORGANIZATION_PUBLIC_API_REGISTRY,
  metadataOnly: true,
  immutable: true,
});
