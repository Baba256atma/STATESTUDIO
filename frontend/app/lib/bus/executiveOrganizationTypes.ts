export type ExecutiveOrganizationPlatformId = "BUS-30";

export type ExecutiveOrganizationPlatformVersion = "1.0.0";

export type ExecutiveOrganizationPlatformNamespace = "nexora.bus.executive-organization";

export type ExecutiveOrganizationPlatformName = "Executive Organization Intelligence Platform";

export type ExecutiveOrganizationPlatformDescription =
  "Canonical metadata-only contract foundation for executive organization intelligence.";

export type OrganizationStatus = "Draft" | "Active" | "Archived" | "Frozen";

export type OrganizationUnitType =
  | "Executive"
  | "BusinessUnit"
  | "Division"
  | "Department"
  | "Team"
  | "Committee"
  | "Program"
  | "Office"
  | "Region"
  | "Branch"
  | "SharedService"
  | "CenterOfExcellence";

export type AuthorityLevel = "Advisory" | "Operational" | "Strategic" | "Executive";

export type DecisionScope =
  | "Enterprise"
  | "BusinessUnit"
  | "Division"
  | "Department"
  | "Team"
  | "Program"
  | "Committee";

export type PositionStatus = "Open" | "Active" | "Interim" | "Archived";

export type ReportingRelationshipType =
  | "Direct"
  | "Matrix"
  | "Functional"
  | "Advisory"
  | "Temporary"
  | "Delegated";

export type OwnerType =
  | "Organization"
  | "BusinessUnit"
  | "Department"
  | "Division"
  | "Team"
  | "Position"
  | "Executive"
  | "Committee";

export type ExecutiveResponsibilityCategory =
  | "Strategy"
  | "Finance"
  | "Revenue"
  | "Operations"
  | "People"
  | "Risk"
  | "Compliance"
  | "Portfolio"
  | "Technology"
  | "Customer"
  | "Innovation"
  | "Governance";

export type HierarchyStatus = "Draft" | "Active" | "Frozen" | "Archived";

export type OrganizationValidationSeverity = "Error" | "Warning";

export type OrganizationId = `organization-${string}`;

export type OrganizationCode = `ORG-${string}`;

export type OrganizationName = string;

export type OrganizationDescription = string;

export type OrganizationUnitId = `organization-unit-${string}`;

export type OrganizationUnitCode = `ORG-UNIT-${string}`;

export type OrganizationUnitName = string;

export type RoleId = `executive-role-${string}`;

export type PositionId = `executive-position-${string}`;

export type PositionCode = `EXEC-POS-${string}`;

export type RelationshipId = `reporting-relationship-${string}`;

export type OwnershipId = `organization-ownership-${string}`;

export type ResponsibilityId = `executive-responsibility-${string}`;

export type HierarchyId = `organization-hierarchy-${string}`;

export type ExecutiveOrganizationMetadata = Readonly<{
  readonly version: ExecutiveOrganizationPlatformVersion;
  readonly tags: readonly string[];
  readonly labels: readonly string[];
  readonly metadataOnly: true;
  readonly immutable: true;
}>;

export type OrganizationUnitMetadata = Readonly<{
  readonly version: ExecutiveOrganizationPlatformVersion;
  readonly tags: readonly string[];
  readonly labels: readonly string[];
  readonly metadataOnly: true;
  readonly immutable: true;
}>;

export type ExecutiveRoleMetadata = Readonly<{
  readonly version: ExecutiveOrganizationPlatformVersion;
  readonly tags: readonly string[];
  readonly labels: readonly string[];
  readonly metadataOnly: true;
  readonly immutable: true;
}>;

export type ExecutivePositionMetadata = Readonly<{
  readonly version: ExecutiveOrganizationPlatformVersion;
  readonly tags: readonly string[];
  readonly labels: readonly string[];
  readonly metadataOnly: true;
  readonly immutable: true;
}>;

export type ExecutiveReportingRelationshipMetadata = Readonly<{
  readonly version: ExecutiveOrganizationPlatformVersion;
  readonly tags: readonly string[];
  readonly labels: readonly string[];
  readonly metadataOnly: true;
  readonly immutable: true;
}>;

export type ExecutiveOwnershipMetadata = Readonly<{
  readonly version: ExecutiveOrganizationPlatformVersion;
  readonly tags: readonly string[];
  readonly labels: readonly string[];
  readonly metadataOnly: true;
  readonly immutable: true;
}>;

export type ExecutiveResponsibilityMetadata = Readonly<{
  readonly version: ExecutiveOrganizationPlatformVersion;
  readonly tags: readonly string[];
  readonly labels: readonly string[];
  readonly metadataOnly: true;
  readonly immutable: true;
}>;

export type ExecutiveOrganizationHierarchyMetadata = Readonly<{
  readonly version: ExecutiveOrganizationPlatformVersion;
  readonly tags: readonly string[];
  readonly labels: readonly string[];
  readonly metadataOnly: true;
  readonly immutable: true;
}>;

export type ExecutiveOrganization = Readonly<{
  readonly organizationId: OrganizationId;
  readonly organizationCode: OrganizationCode;
  readonly organizationName: OrganizationName;
  readonly organizationDescription: OrganizationDescription;
  readonly organizationStatus: OrganizationStatus;
  readonly organizationMetadata: ExecutiveOrganizationMetadata;
  readonly metadataOnly: true;
  readonly immutable: true;
}>;

export type OrganizationUnit = Readonly<{
  readonly organizationUnitId: OrganizationUnitId;
  readonly organizationUnitCode: OrganizationUnitCode;
  readonly organizationUnitName: OrganizationUnitName;
  readonly organizationUnitType: OrganizationUnitType;
  readonly organizationUnitDescription: string;
  readonly organizationUnitMetadata: OrganizationUnitMetadata;
  readonly metadataOnly: true;
  readonly immutable: true;
}>;

export type ExecutiveRole = Readonly<{
  readonly roleId: RoleId;
  readonly roleName: string;
  readonly roleTitle: string;
  readonly roleDescription: string;
  readonly responsibilitySummary: string;
  readonly authorityLevel: AuthorityLevel;
  readonly decisionScope: DecisionScope;
  readonly metadata: ExecutiveRoleMetadata;
  readonly metadataOnly: true;
  readonly immutable: true;
}>;

export type ExecutivePosition = Readonly<{
  readonly positionId: PositionId;
  readonly positionCode: PositionCode;
  readonly positionTitle: string;
  readonly positionStatus: PositionStatus;
  readonly reportsToPositionId: PositionId | null;
  readonly metadata: ExecutivePositionMetadata;
  readonly metadataOnly: true;
  readonly immutable: true;
}>;

export type ExecutiveReportingRelationship = Readonly<{
  readonly relationshipId: RelationshipId;
  readonly sourcePositionId: PositionId;
  readonly targetPositionId: PositionId;
  readonly relationshipType: ReportingRelationshipType;
  readonly description: string;
  readonly metadata: ExecutiveReportingRelationshipMetadata;
  readonly metadataOnly: true;
  readonly immutable: true;
}>;

export type ExecutiveOwnership = Readonly<{
  readonly ownershipId: OwnershipId;
  readonly ownerType: OwnerType;
  readonly ownerId: string;
  readonly businessCapability: string;
  readonly responsibilityArea: string;
  readonly metadata: ExecutiveOwnershipMetadata;
  readonly metadataOnly: true;
  readonly immutable: true;
}>;

export type ExecutiveResponsibility = Readonly<{
  readonly responsibilityId: ResponsibilityId;
  readonly responsibilityName: string;
  readonly description: string;
  readonly category: ExecutiveResponsibilityCategory;
  readonly metadata: ExecutiveResponsibilityMetadata;
  readonly metadataOnly: true;
  readonly immutable: true;
}>;

export type ExecutiveOrganizationHierarchy = Readonly<{
  readonly hierarchyId: HierarchyId;
  readonly rootOrganizationId: OrganizationId;
  readonly hierarchyVersion: ExecutiveOrganizationPlatformVersion;
  readonly hierarchyStatus: HierarchyStatus;
  readonly hierarchyMetadata: ExecutiveOrganizationHierarchyMetadata;
  readonly metadataOnly: true;
  readonly immutable: true;
}>;

export type OrganizationValidationError = Readonly<{
  readonly code: `organization-validation-error-${string}`;
  readonly message: string;
  readonly severity: "Error";
  readonly metadataOnly: true;
  readonly immutable: true;
}>;

export type OrganizationValidationWarning = Readonly<{
  readonly code: `organization-validation-warning-${string}`;
  readonly message: string;
  readonly severity: "Warning";
  readonly metadataOnly: true;
  readonly immutable: true;
}>;

export type OrganizationValidationSummary = Readonly<{
  readonly valid: boolean;
  readonly errorCount: number;
  readonly warningCount: number;
  readonly metadataOnly: true;
  readonly immutable: true;
}>;

export type OrganizationValidationResult = Readonly<{
  readonly errors: readonly OrganizationValidationError[];
  readonly warnings: readonly OrganizationValidationWarning[];
  readonly summary: OrganizationValidationSummary;
  readonly metadataOnly: true;
  readonly immutable: true;
}>;

export type ExecutiveOrganizationContractRegistry = Readonly<{
  readonly platformId: ExecutiveOrganizationPlatformId;
  readonly platformName: ExecutiveOrganizationPlatformName;
  readonly platformVersion: ExecutiveOrganizationPlatformVersion;
  readonly platformNamespace: ExecutiveOrganizationPlatformNamespace;
  readonly platformDescription: ExecutiveOrganizationPlatformDescription;
  readonly publicApis: readonly string[];
  readonly unitTypes: readonly OrganizationUnitType[];
  readonly relationshipTypes: readonly ReportingRelationshipType[];
  readonly ownerTypes: readonly OwnerType[];
  readonly responsibilityCategories: readonly ExecutiveResponsibilityCategory[];
  readonly metadataOnly: true;
  readonly immutable: true;
}>;
