import {
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
  EXECUTIVE_OWNERSHIP_TYPES,
  EXECUTIVE_OWNERSHIP,
  EXECUTIVE_POSITION,
  EXECUTIVE_REPORTING_RELATIONSHIP,
  EXECUTIVE_REPORTING_RELATIONSHIP_TYPES,
  EXECUTIVE_RESPONSIBILITY_CATEGORIES,
  EXECUTIVE_RESPONSIBILITY,
  EXECUTIVE_ROLE,
} from "./executiveOrganizationIndex.ts";
import type {
  ExecutiveHierarchyRegistry,
  ExecutiveOrganizationPlatformRegistry,
  ExecutiveOrganizationRegistry,
  ExecutiveOrganizationRegistryBundle,
  ExecutiveOrganizationRegistryMetadata,
  ExecutiveOrganizationUnitRegistry,
  ExecutiveOwnershipRegistry,
  ExecutivePositionRegistry,
  ExecutiveReportingRegistry,
  ExecutiveResponsibilityRegistry,
  ExecutiveRoleRegistry,
  RegistryValidationMetadata,
  RegistryValidationSummary,
} from "./executiveOrganizationRegistryTypes.ts";

const createRegistryMetadata = (description: string): ExecutiveOrganizationRegistryMetadata =>
  Object.freeze({
    registryVersion: "1.0.0",
    registryNamespace: "nexora.bus.executive-organization.registry",
    registryStatus: "Published",
    registryDescription: description,
    registryCreatedBy: "BUS-30:2",
    registryConsumers: Object.freeze([
      "BUS-30:3 Organization Model",
      "APP Executive Intelligence",
      "LAY Executive Layer",
    ]),
    registryDependencies: Object.freeze([
      "BUS-30:1 Executive Organization Intelligence Contracts",
    ]),
    registryCompatibility: Object.freeze([
      "metadata-only",
      "public-api-only",
      "deterministic",
      "immutable",
    ]),
    metadataOnly: true,
    immutable: true,
  });

export const EXECUTIVE_ORGANIZATION_PLATFORM_REGISTRY: ExecutiveOrganizationPlatformRegistry =
  Object.freeze({
    platformId: EXECUTIVE_ORGANIZATION_PLATFORM_ID,
    platformName: EXECUTIVE_ORGANIZATION_PLATFORM_NAME,
    platformNamespace: EXECUTIVE_ORGANIZATION_PLATFORM_NAMESPACE,
    platformVersion: EXECUTIVE_ORGANIZATION_PLATFORM_VERSION,
    platformDescription: EXECUTIVE_ORGANIZATION_PLATFORM_DESCRIPTION,
    platformStatus: "Published",
    platformMetadata: Object.freeze({
      createdBy: "BUS-30:2",
      consumers: Object.freeze([
        "BUS-30:3 Organization Model",
        "APP Executive Intelligence",
        "LAY Executive Layer",
      ]),
      dependencies: Object.freeze([
        "BUS-30:1 Executive Organization Intelligence Contracts",
      ]),
      compatibility: Object.freeze([
        "metadata-only",
        "public-api-only",
        "deterministic",
        "immutable",
      ]),
      metadataOnly: true,
      immutable: true,
    }),
    metadataOnly: true,
    immutable: true,
  });

export const EXECUTIVE_ORGANIZATION_REGISTRY: ExecutiveOrganizationRegistry = Object.freeze({
  organizationRegistryId: "executive-organization-registry",
  organizations: Object.freeze([EXECUTIVE_ORGANIZATION]),
  metadata: createRegistryMetadata("Canonical registry for executive organization entries."),
  metadataOnly: true,
  immutable: true,
});

export const EXECUTIVE_ORGANIZATION_UNIT_REGISTRY: ExecutiveOrganizationUnitRegistry = Object.freeze({
  unitRegistryId: "executive-organization-unit-registry",
  units: Object.freeze([
    Object.freeze({
      ...EXECUTIVE_ORGANIZATION_UNIT,
      parentOrganizationId: EXECUTIVE_ORGANIZATION.organizationId,
    }),
  ]),
  metadata: createRegistryMetadata("Canonical registry for organization unit entries."),
  metadataOnly: true,
  immutable: true,
});

export const EXECUTIVE_ROLE_REGISTRY: ExecutiveRoleRegistry = Object.freeze({
  roleRegistryId: "executive-role-registry",
  roles: Object.freeze([EXECUTIVE_ROLE]),
  metadata: createRegistryMetadata("Canonical registry for executive role entries."),
  metadataOnly: true,
  immutable: true,
});

export const EXECUTIVE_POSITION_REGISTRY: ExecutivePositionRegistry = Object.freeze({
  positionRegistryId: "executive-position-registry",
  positions: Object.freeze([EXECUTIVE_POSITION]),
  metadata: createRegistryMetadata("Canonical registry for executive position entries."),
  metadataOnly: true,
  immutable: true,
});

export const EXECUTIVE_REPORTING_REGISTRY: ExecutiveReportingRegistry = Object.freeze({
  reportingRegistryId: "executive-reporting-registry",
  relationships: Object.freeze([EXECUTIVE_REPORTING_RELATIONSHIP]),
  metadata: createRegistryMetadata("Canonical registry for executive reporting relationship entries."),
  metadataOnly: true,
  immutable: true,
});

export const EXECUTIVE_OWNERSHIP_REGISTRY: ExecutiveOwnershipRegistry = Object.freeze({
  ownershipRegistryId: "executive-ownership-registry",
  ownershipEntries: Object.freeze([EXECUTIVE_OWNERSHIP]),
  metadata: createRegistryMetadata("Canonical registry for executive ownership entries."),
  metadataOnly: true,
  immutable: true,
});

export const EXECUTIVE_RESPONSIBILITY_REGISTRY: ExecutiveResponsibilityRegistry = Object.freeze({
  responsibilityRegistryId: "executive-responsibility-registry",
  responsibilities: Object.freeze([EXECUTIVE_RESPONSIBILITY]),
  metadata: createRegistryMetadata("Canonical registry for executive responsibility entries."),
  metadataOnly: true,
  immutable: true,
});

export const EXECUTIVE_HIERARCHY_REGISTRY: ExecutiveHierarchyRegistry = Object.freeze({
  hierarchyRegistryId: "executive-hierarchy-registry",
  hierarchies: Object.freeze([EXECUTIVE_ORGANIZATION_HIERARCHY]),
  metadata: createRegistryMetadata("Canonical registry for executive organization hierarchy entries."),
  metadataOnly: true,
  immutable: true,
});

export const EXECUTIVE_ORGANIZATION_REGISTRY_VALIDATION_SUMMARY: RegistryValidationSummary =
  Object.freeze({
    organizationCount: EXECUTIVE_ORGANIZATION_REGISTRY.organizations.length,
    unitCount: EXECUTIVE_ORGANIZATION_UNIT_REGISTRY.units.length,
    roleCount: EXECUTIVE_ROLE_REGISTRY.roles.length,
    positionCount: EXECUTIVE_POSITION_REGISTRY.positions.length,
    relationshipCount: EXECUTIVE_REPORTING_REGISTRY.relationships.length,
    ownershipCount: EXECUTIVE_OWNERSHIP_REGISTRY.ownershipEntries.length,
    responsibilityCount: EXECUTIVE_RESPONSIBILITY_REGISTRY.responsibilities.length,
    hierarchyCount: EXECUTIVE_HIERARCHY_REGISTRY.hierarchies.length,
    metadataOnly: true,
    immutable: true,
  });

export const EXECUTIVE_ORGANIZATION_REGISTRY_VALIDATION: RegistryValidationMetadata =
  Object.freeze({
    validationId: "executive-organization-registry-validation",
    validationStatus: "PASS",
    summary: EXECUTIVE_ORGANIZATION_REGISTRY_VALIDATION_SUMMARY,
    metadataOnly: true,
    immutable: true,
  });

export const EXECUTIVE_ORGANIZATION_REGISTRY_PUBLIC_APIS = Object.freeze([
  "EXECUTIVE_ORGANIZATION_PLATFORM_REGISTRY",
  "EXECUTIVE_ORGANIZATION_REGISTRY",
  "EXECUTIVE_ORGANIZATION_UNIT_REGISTRY",
  "EXECUTIVE_ROLE_REGISTRY",
  "EXECUTIVE_POSITION_REGISTRY",
  "EXECUTIVE_REPORTING_REGISTRY",
  "EXECUTIVE_OWNERSHIP_REGISTRY",
  "EXECUTIVE_RESPONSIBILITY_REGISTRY",
  "EXECUTIVE_HIERARCHY_REGISTRY",
  "EXECUTIVE_ORGANIZATION_REGISTRY_VALIDATION",
  "ExecutiveOrganizationRegistryFoundation",
] as const);

export const ExecutiveOrganizationRegistryFoundation: ExecutiveOrganizationRegistryBundle =
  Object.freeze({
    platformRegistry: EXECUTIVE_ORGANIZATION_PLATFORM_REGISTRY,
    organizationRegistry: EXECUTIVE_ORGANIZATION_REGISTRY,
    unitRegistry: EXECUTIVE_ORGANIZATION_UNIT_REGISTRY,
    roleRegistry: EXECUTIVE_ROLE_REGISTRY,
    positionRegistry: EXECUTIVE_POSITION_REGISTRY,
    reportingRegistry: EXECUTIVE_REPORTING_REGISTRY,
    ownershipRegistry: EXECUTIVE_OWNERSHIP_REGISTRY,
    responsibilityRegistry: EXECUTIVE_RESPONSIBILITY_REGISTRY,
    hierarchyRegistry: EXECUTIVE_HIERARCHY_REGISTRY,
    validationRegistry: EXECUTIVE_ORGANIZATION_REGISTRY_VALIDATION,
    publicApis: EXECUTIVE_ORGANIZATION_REGISTRY_PUBLIC_APIS,
    metadataOnly: true,
    immutable: true,
  });

export const EXECUTIVE_ORGANIZATION_REGISTRY_CONTRACT_COMPATIBILITY = Object.freeze({
  contractRegistryPlatformId: EXECUTIVE_ORGANIZATION_CONTRACT_REGISTRY.platformId,
  contractPublicApiCount: EXECUTIVE_ORGANIZATION_PUBLIC_APIS.length,
  organizationStatuses: EXECUTIVE_ORGANIZATION_STATUSES,
  organizationUnitTypes: EXECUTIVE_ORGANIZATION_UNIT_TYPES,
  reportingRelationshipTypes: EXECUTIVE_REPORTING_RELATIONSHIP_TYPES,
  ownershipTypes: EXECUTIVE_OWNERSHIP_TYPES,
  responsibilityCategories: EXECUTIVE_RESPONSIBILITY_CATEGORIES,
  metadataOnly: true,
  immutable: true,
});
