import {
  EXECUTIVE_ORGANIZATION_CONTRACT_REGISTRY,
  EXECUTIVE_ORGANIZATION_PLATFORM_DESCRIPTION,
  EXECUTIVE_ORGANIZATION_PLATFORM_ID,
  EXECUTIVE_ORGANIZATION_PLATFORM_NAMESPACE,
  EXECUTIVE_ORGANIZATION_PLATFORM_VERSION,
} from "./executiveOrganizationIndex.ts";
import {
  EXECUTIVE_HIERARCHY_REGISTRY,
  EXECUTIVE_ORGANIZATION_PLATFORM_REGISTRY,
  EXECUTIVE_ORGANIZATION_REGISTRY,
  EXECUTIVE_ORGANIZATION_REGISTRY_PUBLIC_APIS,
  EXECUTIVE_ORGANIZATION_UNIT_REGISTRY,
  EXECUTIVE_OWNERSHIP_REGISTRY,
  EXECUTIVE_POSITION_REGISTRY,
  EXECUTIVE_REPORTING_REGISTRY,
  EXECUTIVE_RESPONSIBILITY_REGISTRY,
  EXECUTIVE_ROLE_REGISTRY,
} from "./executiveOrganizationRegistryIndex.ts";
import type {
  ExecutiveHierarchyModel,
  ExecutiveOrganizationModel,
  ExecutiveOrganizationModelBundle,
  ExecutiveOrganizationModelMetadata,
  ExecutiveOrganizationModelStatus,
  ExecutiveOrganizationPlatformModel,
  ExecutiveRoleModel,
  ExecutiveOwnershipModel,
  ExecutivePositionModel,
  ExecutiveReportingModel,
  ExecutiveResponsibilityModel,
  ExecutiveOrganizationUnitModel,
} from "./executiveOrganizationModelTypes.ts";

export const EXECUTIVE_ORGANIZATION_MODEL_ID = "executive-organization-model-foundation" as const;

export const EXECUTIVE_ORGANIZATION_MODEL_VERSION = "1.0.0" as const;

export const EXECUTIVE_ORGANIZATION_MODEL_NAMESPACE =
  "nexora.bus.executive-organization.model" as const;

export const EXECUTIVE_ORGANIZATION_MODEL_STATUS: ExecutiveOrganizationModelStatus = "Published";

export const EXECUTIVE_ORGANIZATION_MODEL_DESCRIPTION =
  "Canonical metadata-only structural model for executive organization intelligence." as const;

export const EXECUTIVE_ORGANIZATION_PLATFORM_MODEL: ExecutiveOrganizationPlatformModel =
  Object.freeze({
    platformId: EXECUTIVE_ORGANIZATION_PLATFORM_ID,
    platformNamespace: EXECUTIVE_ORGANIZATION_PLATFORM_NAMESPACE,
    platformVersion: EXECUTIVE_ORGANIZATION_PLATFORM_VERSION,
    platformStatus: EXECUTIVE_ORGANIZATION_MODEL_STATUS,
    platformDescription: EXECUTIVE_ORGANIZATION_PLATFORM_DESCRIPTION,
    platformMetadata: Object.freeze({
      modelLayer: "BUS-30:3",
      createdBy: "BUS-30:3",
      metadataOnly: true,
      immutable: true,
    }),
    metadataOnly: true,
    immutable: true,
  });

export const EXECUTIVE_ORGANIZATION_MODEL: ExecutiveOrganizationModel = Object.freeze({
  modelId: "executive-organization-model",
  organizationId: EXECUTIVE_ORGANIZATION_REGISTRY.organizations[0].organizationId,
  organizationCode: EXECUTIVE_ORGANIZATION_REGISTRY.organizations[0].organizationCode,
  organizationName: EXECUTIVE_ORGANIZATION_REGISTRY.organizations[0].organizationName,
  organizationDescription: EXECUTIVE_ORGANIZATION_REGISTRY.organizations[0].organizationDescription,
  organizationStatus: EXECUTIVE_ORGANIZATION_REGISTRY.organizations[0].organizationStatus,
  organizationMetadata: EXECUTIVE_ORGANIZATION_REGISTRY.organizations[0].organizationMetadata,
  metadataOnly: true,
  immutable: true,
});

export const EXECUTIVE_ORGANIZATION_UNIT_MODELS: readonly ExecutiveOrganizationUnitModel[] =
  Object.freeze(
    EXECUTIVE_ORGANIZATION_UNIT_REGISTRY.units.map((unit) =>
      Object.freeze({
        unitId: unit.organizationUnitId,
        unitCode: unit.organizationUnitCode,
        unitName: unit.organizationUnitName,
        unitType: unit.organizationUnitType,
        parentUnitId: null,
        parentOrganizationId: unit.parentOrganizationId,
        description: unit.organizationUnitDescription,
        metadata: unit.organizationUnitMetadata,
        metadataOnly: true,
        immutable: true,
      }),
    ),
  );

export const EXECUTIVE_ROLE_MODELS: readonly ExecutiveRoleModel[] = Object.freeze(
  EXECUTIVE_ROLE_REGISTRY.roles.map((role) =>
    Object.freeze({
      roleId: role.roleId,
      roleName: role.roleName,
      roleTitle: role.roleTitle,
      authorityLevel: role.authorityLevel,
      decisionScope: role.decisionScope,
      responsibilitySummary: role.responsibilitySummary,
      metadata: role.metadata,
      metadataOnly: true,
      immutable: true,
    }),
  ),
);

export const EXECUTIVE_POSITION_MODELS: readonly ExecutivePositionModel[] = Object.freeze(
  EXECUTIVE_POSITION_REGISTRY.positions.map((position) =>
    Object.freeze({
      positionId: position.positionId,
      positionCode: position.positionCode,
      positionTitle: position.positionTitle,
      reportsToPositionId: position.reportsToPositionId,
      roleId: EXECUTIVE_ROLE_MODELS[0].roleId,
      status: position.positionStatus,
      metadata: position.metadata,
      metadataOnly: true,
      immutable: true,
    }),
  ),
);

export const EXECUTIVE_REPORTING_MODELS: readonly ExecutiveReportingModel[] = Object.freeze(
  EXECUTIVE_REPORTING_REGISTRY.relationships.map((relationship) =>
    Object.freeze({
      relationshipId: relationship.relationshipId,
      sourcePositionId: relationship.sourcePositionId,
      targetPositionId: relationship.targetPositionId,
      relationshipType: relationship.relationshipType,
      description: relationship.description,
      metadata: relationship.metadata,
      metadataOnly: true,
      immutable: true,
    }),
  ),
);

export const EXECUTIVE_OWNERSHIP_MODELS: readonly ExecutiveOwnershipModel[] = Object.freeze(
  EXECUTIVE_OWNERSHIP_REGISTRY.ownershipEntries.map((ownership) =>
    Object.freeze({
      ownershipId: ownership.ownershipId,
      ownerType: ownership.ownerType,
      ownerId: ownership.ownerId,
      businessCapability: ownership.businessCapability,
      responsibilityArea: ownership.responsibilityArea,
      metadata: ownership.metadata,
      metadataOnly: true,
      immutable: true,
    }),
  ),
);

export const EXECUTIVE_RESPONSIBILITY_MODELS: readonly ExecutiveResponsibilityModel[] = Object.freeze(
  EXECUTIVE_RESPONSIBILITY_REGISTRY.responsibilities.map((responsibility) =>
    Object.freeze({
      responsibilityId: responsibility.responsibilityId,
      responsibilityName: responsibility.responsibilityName,
      category: responsibility.category,
      description: responsibility.description,
      metadata: responsibility.metadata,
      metadataOnly: true,
      immutable: true,
    }),
  ),
);

export const EXECUTIVE_HIERARCHY_MODELS: readonly ExecutiveHierarchyModel[] = Object.freeze(
  EXECUTIVE_HIERARCHY_REGISTRY.hierarchies.map((hierarchy) =>
    Object.freeze({
      hierarchyId: hierarchy.hierarchyId,
      rootOrganizationId: hierarchy.rootOrganizationId,
      hierarchyVersion: hierarchy.hierarchyVersion,
      hierarchyStatus: hierarchy.hierarchyStatus,
      metadata: hierarchy.hierarchyMetadata,
      metadataOnly: true,
      immutable: true,
    }),
  ),
);

export const EXECUTIVE_ORGANIZATION_MODEL_METADATA: ExecutiveOrganizationModelMetadata =
  Object.freeze({
    modelId: EXECUTIVE_ORGANIZATION_MODEL_ID,
    modelVersion: EXECUTIVE_ORGANIZATION_MODEL_VERSION,
    modelNamespace: EXECUTIVE_ORGANIZATION_MODEL_NAMESPACE,
    modelStatus: EXECUTIVE_ORGANIZATION_MODEL_STATUS,
    modelDescription: EXECUTIVE_ORGANIZATION_MODEL_DESCRIPTION,
    modelDependencies: Object.freeze([
      "BUS-30:1 Executive Organization Intelligence Contracts",
      "BUS-30:2 Executive Organization Registry",
    ]),
    modelConsumers: Object.freeze([
      "BUS-30:4 Validation",
      "APP Executive Intelligence",
      "LAY Executive Layer",
    ]),
    modelCompatibility: Object.freeze([
      `contract-platform:${EXECUTIVE_ORGANIZATION_CONTRACT_REGISTRY.platformId}`,
      `registry-platform:${EXECUTIVE_ORGANIZATION_PLATFORM_REGISTRY.platformId}`,
      `registry-public-api-count:${EXECUTIVE_ORGANIZATION_REGISTRY_PUBLIC_APIS.length}`,
      "metadata-only",
      "public-api-only",
      "deterministic",
    ]),
    metadataOnly: true,
    immutable: true,
  });

export const ExecutiveOrganizationModelFoundation: ExecutiveOrganizationModelBundle =
  Object.freeze({
    organization: EXECUTIVE_ORGANIZATION_MODEL,
    units: EXECUTIVE_ORGANIZATION_UNIT_MODELS,
    roles: EXECUTIVE_ROLE_MODELS,
    positions: EXECUTIVE_POSITION_MODELS,
    reporting: EXECUTIVE_REPORTING_MODELS,
    ownership: EXECUTIVE_OWNERSHIP_MODELS,
    responsibilities: EXECUTIVE_RESPONSIBILITY_MODELS,
    hierarchy: EXECUTIVE_HIERARCHY_MODELS,
    metadata: EXECUTIVE_ORGANIZATION_MODEL_METADATA,
    metadataOnly: true,
    immutable: true,
  });

export const EXECUTIVE_ORGANIZATION_MODEL_PUBLIC_APIS = Object.freeze([
  "EXECUTIVE_ORGANIZATION_MODEL_ID",
  "EXECUTIVE_ORGANIZATION_MODEL_VERSION",
  "EXECUTIVE_ORGANIZATION_MODEL_NAMESPACE",
  "EXECUTIVE_ORGANIZATION_MODEL_STATUS",
  "EXECUTIVE_ORGANIZATION_MODEL_DESCRIPTION",
  "EXECUTIVE_ORGANIZATION_PLATFORM_MODEL",
  "EXECUTIVE_ORGANIZATION_MODEL",
  "EXECUTIVE_ORGANIZATION_UNIT_MODELS",
  "EXECUTIVE_ROLE_MODELS",
  "EXECUTIVE_POSITION_MODELS",
  "EXECUTIVE_REPORTING_MODELS",
  "EXECUTIVE_OWNERSHIP_MODELS",
  "EXECUTIVE_RESPONSIBILITY_MODELS",
  "EXECUTIVE_HIERARCHY_MODELS",
  "EXECUTIVE_ORGANIZATION_MODEL_METADATA",
  "ExecutiveOrganizationModelFoundation",
] as const);
