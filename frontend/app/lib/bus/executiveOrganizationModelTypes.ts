import type {
  AuthorityLevel,
  DecisionScope,
  ExecutiveOrganizationMetadata,
  ExecutiveOrganizationPlatformDescription,
  ExecutiveOrganizationPlatformId,
  ExecutiveOrganizationPlatformNamespace,
  ExecutiveOrganizationPlatformVersion,
  ExecutiveOwnershipMetadata,
  ExecutivePositionMetadata,
  ExecutiveReportingRelationshipMetadata,
  ExecutiveResponsibilityCategory,
  ExecutiveResponsibilityMetadata,
  ExecutiveRoleMetadata,
  HierarchyStatus,
  OrganizationDescription,
  OrganizationId,
  OrganizationName,
  OrganizationStatus,
  OrganizationUnitId,
  OrganizationUnitMetadata,
  OrganizationUnitName,
  OrganizationUnitType,
  OwnerType,
  PositionCode,
  PositionId,
  PositionStatus,
  RelationshipId,
  ReportingRelationshipType,
  ResponsibilityId,
  RoleId,
} from "./executiveOrganizationIndex.ts";

export type ExecutiveOrganizationModelStatus = "Published" | "Frozen" | "Archived";

export type ExecutiveOrganizationPlatformModelMetadata = Readonly<{
  readonly modelLayer: "BUS-30:3";
  readonly createdBy: "BUS-30:3";
  readonly metadataOnly: true;
  readonly immutable: true;
}>;

export type ExecutiveOrganizationPlatformModel = Readonly<{
  readonly platformId: ExecutiveOrganizationPlatformId;
  readonly platformNamespace: ExecutiveOrganizationPlatformNamespace;
  readonly platformVersion: ExecutiveOrganizationPlatformVersion;
  readonly platformStatus: ExecutiveOrganizationModelStatus;
  readonly platformDescription: ExecutiveOrganizationPlatformDescription;
  readonly platformMetadata: ExecutiveOrganizationPlatformModelMetadata;
  readonly metadataOnly: true;
  readonly immutable: true;
}>;

export type ExecutiveOrganizationModel = Readonly<{
  readonly modelId: "executive-organization-model";
  readonly organizationId: OrganizationId;
  readonly organizationCode: `ORG-${string}`;
  readonly organizationName: OrganizationName;
  readonly organizationDescription: OrganizationDescription;
  readonly organizationStatus: OrganizationStatus;
  readonly organizationMetadata: ExecutiveOrganizationMetadata;
  readonly metadataOnly: true;
  readonly immutable: true;
}>;

export type ExecutiveOrganizationUnitModel = Readonly<{
  readonly unitId: OrganizationUnitId;
  readonly unitCode: `ORG-UNIT-${string}`;
  readonly unitName: OrganizationUnitName;
  readonly unitType: OrganizationUnitType;
  readonly parentUnitId: OrganizationUnitId | null;
  readonly parentOrganizationId: OrganizationId;
  readonly description: string;
  readonly metadata: OrganizationUnitMetadata;
  readonly metadataOnly: true;
  readonly immutable: true;
}>;

export type ExecutiveRoleModel = Readonly<{
  readonly roleId: RoleId;
  readonly roleName: string;
  readonly roleTitle: string;
  readonly authorityLevel: AuthorityLevel;
  readonly decisionScope: DecisionScope;
  readonly responsibilitySummary: string;
  readonly metadata: ExecutiveRoleMetadata;
  readonly metadataOnly: true;
  readonly immutable: true;
}>;

export type ExecutivePositionModel = Readonly<{
  readonly positionId: PositionId;
  readonly positionCode: PositionCode;
  readonly positionTitle: string;
  readonly reportsToPositionId: PositionId | null;
  readonly roleId: RoleId;
  readonly status: PositionStatus;
  readonly metadata: ExecutivePositionMetadata;
  readonly metadataOnly: true;
  readonly immutable: true;
}>;

export type ExecutiveReportingModel = Readonly<{
  readonly relationshipId: RelationshipId;
  readonly sourcePositionId: PositionId;
  readonly targetPositionId: PositionId;
  readonly relationshipType: ReportingRelationshipType;
  readonly description: string;
  readonly metadata: ExecutiveReportingRelationshipMetadata;
  readonly metadataOnly: true;
  readonly immutable: true;
}>;

export type ExecutiveOwnershipModel = Readonly<{
  readonly ownershipId: `organization-ownership-${string}`;
  readonly ownerType: OwnerType;
  readonly ownerId: string;
  readonly businessCapability: string;
  readonly responsibilityArea: string;
  readonly metadata: ExecutiveOwnershipMetadata;
  readonly metadataOnly: true;
  readonly immutable: true;
}>;

export type ExecutiveResponsibilityModel = Readonly<{
  readonly responsibilityId: ResponsibilityId;
  readonly responsibilityName: string;
  readonly category: ExecutiveResponsibilityCategory;
  readonly description: string;
  readonly metadata: ExecutiveResponsibilityMetadata;
  readonly metadataOnly: true;
  readonly immutable: true;
}>;

export type ExecutiveHierarchyModel = Readonly<{
  readonly hierarchyId: `organization-hierarchy-${string}`;
  readonly rootOrganizationId: OrganizationId;
  readonly hierarchyVersion: ExecutiveOrganizationPlatformVersion;
  readonly hierarchyStatus: HierarchyStatus;
  readonly metadata: Readonly<{
    readonly version: ExecutiveOrganizationPlatformVersion;
    readonly tags: readonly string[];
    readonly labels: readonly string[];
    readonly metadataOnly: true;
    readonly immutable: true;
  }>;
  readonly metadataOnly: true;
  readonly immutable: true;
}>;

export type ExecutiveOrganizationModelMetadata = Readonly<{
  readonly modelId: "executive-organization-model-foundation";
  readonly modelVersion: "1.0.0";
  readonly modelNamespace: "nexora.bus.executive-organization.model";
  readonly modelStatus: ExecutiveOrganizationModelStatus;
  readonly modelDescription: string;
  readonly modelDependencies: readonly string[];
  readonly modelConsumers: readonly string[];
  readonly modelCompatibility: readonly string[];
  readonly metadataOnly: true;
  readonly immutable: true;
}>;

export type ExecutiveOrganizationModelBundle = Readonly<{
  readonly organization: ExecutiveOrganizationModel;
  readonly units: readonly ExecutiveOrganizationUnitModel[];
  readonly roles: readonly ExecutiveRoleModel[];
  readonly positions: readonly ExecutivePositionModel[];
  readonly reporting: readonly ExecutiveReportingModel[];
  readonly ownership: readonly ExecutiveOwnershipModel[];
  readonly responsibilities: readonly ExecutiveResponsibilityModel[];
  readonly hierarchy: readonly ExecutiveHierarchyModel[];
  readonly metadata: ExecutiveOrganizationModelMetadata;
  readonly metadataOnly: true;
  readonly immutable: true;
}>;
