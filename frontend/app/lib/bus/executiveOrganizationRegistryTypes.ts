import type {
  ExecutiveOrganization,
  ExecutiveOrganizationHierarchy,
  ExecutiveOwnership,
  ExecutivePosition,
  ExecutiveReportingRelationship,
  ExecutiveResponsibility,
  ExecutiveRole,
  OrganizationStatus,
  OrganizationUnit,
} from "./executiveOrganizationTypes.ts";

export type ExecutiveOrganizationRegistryStatus = "Published" | "Frozen" | "Archived";

export type ExecutiveOrganizationPlatformRegistryMetadata = Readonly<{
  readonly createdBy: "BUS-30:2";
  readonly consumers: readonly string[];
  readonly dependencies: readonly string[];
  readonly compatibility: readonly string[];
  readonly metadataOnly: true;
  readonly immutable: true;
}>;

export type ExecutiveOrganizationPlatformRegistry = Readonly<{
  readonly platformId: "BUS-30";
  readonly platformName: "Executive Organization Intelligence Platform";
  readonly platformNamespace: "nexora.bus.executive-organization";
  readonly platformVersion: "1.0.0";
  readonly platformDescription: string;
  readonly platformStatus: ExecutiveOrganizationRegistryStatus;
  readonly platformMetadata: ExecutiveOrganizationPlatformRegistryMetadata;
  readonly metadataOnly: true;
  readonly immutable: true;
}>;

export type ExecutiveOrganizationRegistryMetadata = Readonly<{
  readonly registryVersion: "1.0.0";
  readonly registryNamespace: "nexora.bus.executive-organization.registry";
  readonly registryStatus: ExecutiveOrganizationRegistryStatus;
  readonly registryDescription: string;
  readonly registryCreatedBy: "BUS-30:2";
  readonly registryConsumers: readonly string[];
  readonly registryDependencies: readonly string[];
  readonly registryCompatibility: readonly string[];
  readonly metadataOnly: true;
  readonly immutable: true;
}>;

export type ExecutiveOrganizationRegistry = Readonly<{
  readonly organizationRegistryId: "executive-organization-registry";
  readonly organizations: readonly ExecutiveOrganization[];
  readonly metadata: ExecutiveOrganizationRegistryMetadata;
  readonly metadataOnly: true;
  readonly immutable: true;
}>;

export type ExecutiveOrganizationUnitRegistry = Readonly<{
  readonly unitRegistryId: "executive-organization-unit-registry";
  readonly units: readonly (OrganizationUnit &
    Readonly<{
      readonly parentOrganizationId: ExecutiveOrganization["organizationId"];
    }>)[]; 
  readonly metadata: ExecutiveOrganizationRegistryMetadata;
  readonly metadataOnly: true;
  readonly immutable: true;
}>;

export type ExecutiveRoleRegistry = Readonly<{
  readonly roleRegistryId: "executive-role-registry";
  readonly roles: readonly ExecutiveRole[];
  readonly metadata: ExecutiveOrganizationRegistryMetadata;
  readonly metadataOnly: true;
  readonly immutable: true;
}>;

export type ExecutivePositionRegistry = Readonly<{
  readonly positionRegistryId: "executive-position-registry";
  readonly positions: readonly ExecutivePosition[];
  readonly metadata: ExecutiveOrganizationRegistryMetadata;
  readonly metadataOnly: true;
  readonly immutable: true;
}>;

export type ExecutiveReportingRegistry = Readonly<{
  readonly reportingRegistryId: "executive-reporting-registry";
  readonly relationships: readonly ExecutiveReportingRelationship[];
  readonly metadata: ExecutiveOrganizationRegistryMetadata;
  readonly metadataOnly: true;
  readonly immutable: true;
}>;

export type ExecutiveOwnershipRegistry = Readonly<{
  readonly ownershipRegistryId: "executive-ownership-registry";
  readonly ownershipEntries: readonly ExecutiveOwnership[];
  readonly metadata: ExecutiveOrganizationRegistryMetadata;
  readonly metadataOnly: true;
  readonly immutable: true;
}>;

export type ExecutiveResponsibilityRegistry = Readonly<{
  readonly responsibilityRegistryId: "executive-responsibility-registry";
  readonly responsibilities: readonly ExecutiveResponsibility[];
  readonly metadata: ExecutiveOrganizationRegistryMetadata;
  readonly metadataOnly: true;
  readonly immutable: true;
}>;

export type ExecutiveHierarchyRegistry = Readonly<{
  readonly hierarchyRegistryId: "executive-hierarchy-registry";
  readonly hierarchies: readonly ExecutiveOrganizationHierarchy[];
  readonly metadata: ExecutiveOrganizationRegistryMetadata;
  readonly metadataOnly: true;
  readonly immutable: true;
}>;

export type RegistryValidationStatus = "PASS" | "FAIL";

export type RegistryValidationSummary = Readonly<{
  readonly organizationCount: number;
  readonly unitCount: number;
  readonly roleCount: number;
  readonly positionCount: number;
  readonly relationshipCount: number;
  readonly ownershipCount: number;
  readonly responsibilityCount: number;
  readonly hierarchyCount: number;
  readonly metadataOnly: true;
  readonly immutable: true;
}>;

export type RegistryValidationMetadata = Readonly<{
  readonly validationId: "executive-organization-registry-validation";
  readonly validationStatus: RegistryValidationStatus;
  readonly summary: RegistryValidationSummary;
  readonly metadataOnly: true;
  readonly immutable: true;
}>;

export type ExecutiveOrganizationRegistryBundle = Readonly<{
  readonly platformRegistry: ExecutiveOrganizationPlatformRegistry;
  readonly organizationRegistry: ExecutiveOrganizationRegistry;
  readonly unitRegistry: ExecutiveOrganizationUnitRegistry;
  readonly roleRegistry: ExecutiveRoleRegistry;
  readonly positionRegistry: ExecutivePositionRegistry;
  readonly reportingRegistry: ExecutiveReportingRegistry;
  readonly ownershipRegistry: ExecutiveOwnershipRegistry;
  readonly responsibilityRegistry: ExecutiveResponsibilityRegistry;
  readonly hierarchyRegistry: ExecutiveHierarchyRegistry;
  readonly validationRegistry: RegistryValidationMetadata;
  readonly publicApis: readonly string[];
  readonly metadataOnly: true;
  readonly immutable: true;
}>;
