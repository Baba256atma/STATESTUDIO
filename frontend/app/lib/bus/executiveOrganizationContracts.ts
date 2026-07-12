import type {
  ExecutiveOrganization,
  ExecutiveOrganizationContractRegistry,
  ExecutiveOrganizationHierarchy,
  ExecutiveOrganizationPlatformDescription,
  ExecutiveOrganizationPlatformId,
  ExecutiveOrganizationPlatformName,
  ExecutiveOrganizationPlatformNamespace,
  ExecutiveOrganizationPlatformVersion,
  ExecutiveOwnership,
  ExecutiveReportingRelationship,
  ExecutiveResponsibility,
  ExecutiveRole,
  ExecutivePosition,
  OrganizationStatus,
  OrganizationUnit,
  OrganizationUnitType,
  OwnerType,
  ReportingRelationshipType,
  OrganizationValidationResult,
  ExecutiveResponsibilityCategory,
} from "./executiveOrganizationTypes.ts";

export const EXECUTIVE_ORGANIZATION_PLATFORM_ID: ExecutiveOrganizationPlatformId = "BUS-30";

export const EXECUTIVE_ORGANIZATION_PLATFORM_NAME: ExecutiveOrganizationPlatformName =
  "Executive Organization Intelligence Platform";

export const EXECUTIVE_ORGANIZATION_PLATFORM_VERSION: ExecutiveOrganizationPlatformVersion = "1.0.0";

export const EXECUTIVE_ORGANIZATION_PLATFORM_NAMESPACE: ExecutiveOrganizationPlatformNamespace =
  "nexora.bus.executive-organization";

export const EXECUTIVE_ORGANIZATION_PLATFORM_DESCRIPTION: ExecutiveOrganizationPlatformDescription =
  "Canonical metadata-only contract foundation for executive organization intelligence.";

export const EXECUTIVE_ORGANIZATION_STATUSES: readonly OrganizationStatus[] = Object.freeze([
  "Draft",
  "Active",
  "Archived",
  "Frozen",
] as const);

export const EXECUTIVE_ORGANIZATION_UNIT_TYPES: readonly OrganizationUnitType[] = Object.freeze([
  "Executive",
  "BusinessUnit",
  "Division",
  "Department",
  "Team",
  "Committee",
  "Program",
  "Office",
  "Region",
  "Branch",
  "SharedService",
  "CenterOfExcellence",
] as const);

export const EXECUTIVE_REPORTING_RELATIONSHIP_TYPES: readonly ReportingRelationshipType[] =
  Object.freeze([
    "Direct",
    "Matrix",
    "Functional",
    "Advisory",
    "Temporary",
    "Delegated",
  ] as const);

export const EXECUTIVE_OWNERSHIP_TYPES: readonly OwnerType[] = Object.freeze([
  "Organization",
  "BusinessUnit",
  "Department",
  "Division",
  "Team",
  "Position",
  "Executive",
  "Committee",
] as const);

export const EXECUTIVE_RESPONSIBILITY_CATEGORIES: readonly ExecutiveResponsibilityCategory[] =
  Object.freeze([
    "Strategy",
    "Finance",
    "Revenue",
    "Operations",
    "People",
    "Risk",
    "Compliance",
    "Portfolio",
    "Technology",
    "Customer",
    "Innovation",
    "Governance",
  ] as const);

const defaultMetadata = () =>
  Object.freeze({
    version: EXECUTIVE_ORGANIZATION_PLATFORM_VERSION,
    tags: Object.freeze(["organization", "metadata-only"]),
    labels: Object.freeze(["bus-30", "foundation"]),
    metadataOnly: true,
    immutable: true,
  } as const);

export const EXECUTIVE_ORGANIZATION: ExecutiveOrganization = Object.freeze({
  organizationId: "organization-enterprise",
  organizationCode: "ORG-ENTERPRISE",
  organizationName: "Enterprise Organization",
  organizationDescription: "Canonical top-level executive organization metadata contract.",
  organizationStatus: "Active",
  organizationMetadata: defaultMetadata(),
  metadataOnly: true,
  immutable: true,
});

export const EXECUTIVE_ORGANIZATION_UNIT: OrganizationUnit = Object.freeze({
  organizationUnitId: "organization-unit-executive-office",
  organizationUnitCode: "ORG-UNIT-EXECUTIVE-OFFICE",
  organizationUnitName: "Executive Office",
  organizationUnitType: "Executive",
  organizationUnitDescription: "Canonical executive unit metadata contract.",
  organizationUnitMetadata: defaultMetadata(),
  metadataOnly: true,
  immutable: true,
});

export const EXECUTIVE_ROLE: ExecutiveRole = Object.freeze({
  roleId: "executive-role-chief-executive-officer",
  roleName: "ChiefExecutiveOfficer",
  roleTitle: "Chief Executive Officer",
  roleDescription: "Canonical executive leadership role metadata contract.",
  responsibilitySummary: "Owns enterprise-wide executive accountability metadata.",
  authorityLevel: "Executive",
  decisionScope: "Enterprise",
  metadata: defaultMetadata(),
  metadataOnly: true,
  immutable: true,
});

export const EXECUTIVE_POSITION: ExecutivePosition = Object.freeze({
  positionId: "executive-position-chief-executive-officer",
  positionCode: "EXEC-POS-CEO",
  positionTitle: "Chief Executive Officer",
  positionStatus: "Active",
  reportsToPositionId: null,
  metadata: defaultMetadata(),
  metadataOnly: true,
  immutable: true,
});

export const EXECUTIVE_REPORTING_RELATIONSHIP: ExecutiveReportingRelationship = Object.freeze({
  relationshipId: "reporting-relationship-enterprise-root",
  sourcePositionId: "executive-position-chief-executive-officer",
  targetPositionId: "executive-position-chief-executive-officer",
  relationshipType: "Advisory",
  description: "Canonical reporting relationship metadata contract.",
  metadata: defaultMetadata(),
  metadataOnly: true,
  immutable: true,
});

export const EXECUTIVE_OWNERSHIP: ExecutiveOwnership = Object.freeze({
  ownershipId: "organization-ownership-enterprise-strategy",
  ownerType: "Executive",
  ownerId: "executive-position-chief-executive-officer",
  businessCapability: "Enterprise Leadership",
  responsibilityArea: "Strategy",
  metadata: defaultMetadata(),
  metadataOnly: true,
  immutable: true,
});

export const EXECUTIVE_RESPONSIBILITY: ExecutiveResponsibility = Object.freeze({
  responsibilityId: "executive-responsibility-enterprise-strategy",
  responsibilityName: "Enterprise Strategy",
  description: "Canonical executive responsibility metadata contract.",
  category: "Strategy",
  metadata: defaultMetadata(),
  metadataOnly: true,
  immutable: true,
});

export const EXECUTIVE_ORGANIZATION_HIERARCHY: ExecutiveOrganizationHierarchy = Object.freeze({
  hierarchyId: "organization-hierarchy-enterprise-root",
  rootOrganizationId: "organization-enterprise",
  hierarchyVersion: "1.0.0",
  hierarchyStatus: "Active",
  hierarchyMetadata: defaultMetadata(),
  metadataOnly: true,
  immutable: true,
});

export const EXECUTIVE_ORGANIZATION_VALIDATION_RESULT: OrganizationValidationResult = Object.freeze({
  errors: Object.freeze([]),
  warnings: Object.freeze([]),
  summary: Object.freeze({
    valid: true,
    errorCount: 0,
    warningCount: 0,
    metadataOnly: true,
    immutable: true,
  }),
  metadataOnly: true,
  immutable: true,
});

export const EXECUTIVE_ORGANIZATION_PUBLIC_APIS = Object.freeze([
  "EXECUTIVE_ORGANIZATION_PLATFORM_ID",
  "EXECUTIVE_ORGANIZATION_PLATFORM_NAME",
  "EXECUTIVE_ORGANIZATION_PLATFORM_VERSION",
  "EXECUTIVE_ORGANIZATION_PLATFORM_NAMESPACE",
  "EXECUTIVE_ORGANIZATION_PLATFORM_DESCRIPTION",
  "EXECUTIVE_ORGANIZATION_CONTRACT_REGISTRY",
  "ExecutiveOrganizationContracts",
  "ExecutiveOrganizationContractTypes",
  "ExecutiveOrganizationContractFoundation",
] as const);

export const EXECUTIVE_ORGANIZATION_CONTRACT_REGISTRY: ExecutiveOrganizationContractRegistry =
  Object.freeze({
    platformId: EXECUTIVE_ORGANIZATION_PLATFORM_ID,
    platformName: EXECUTIVE_ORGANIZATION_PLATFORM_NAME,
    platformVersion: EXECUTIVE_ORGANIZATION_PLATFORM_VERSION,
    platformNamespace: EXECUTIVE_ORGANIZATION_PLATFORM_NAMESPACE,
    platformDescription: EXECUTIVE_ORGANIZATION_PLATFORM_DESCRIPTION,
    publicApis: EXECUTIVE_ORGANIZATION_PUBLIC_APIS,
    unitTypes: EXECUTIVE_ORGANIZATION_UNIT_TYPES,
    relationshipTypes: EXECUTIVE_REPORTING_RELATIONSHIP_TYPES,
    ownerTypes: EXECUTIVE_OWNERSHIP_TYPES,
    responsibilityCategories: EXECUTIVE_RESPONSIBILITY_CATEGORIES,
    metadataOnly: true,
    immutable: true,
  });

export const ExecutiveOrganizationContracts = Object.freeze({
  platformId: EXECUTIVE_ORGANIZATION_PLATFORM_ID,
  platformName: EXECUTIVE_ORGANIZATION_PLATFORM_NAME,
  platformVersion: EXECUTIVE_ORGANIZATION_PLATFORM_VERSION,
  platformNamespace: EXECUTIVE_ORGANIZATION_PLATFORM_NAMESPACE,
  platformDescription: EXECUTIVE_ORGANIZATION_PLATFORM_DESCRIPTION,
  metadataOnly: true,
  immutable: true,
});

export const ExecutiveOrganizationContractTypes = Object.freeze({
  organizationStatuses: EXECUTIVE_ORGANIZATION_STATUSES,
  organizationUnitTypes: EXECUTIVE_ORGANIZATION_UNIT_TYPES,
  reportingRelationshipTypes: EXECUTIVE_REPORTING_RELATIONSHIP_TYPES,
  ownershipTypes: EXECUTIVE_OWNERSHIP_TYPES,
  responsibilityCategories: EXECUTIVE_RESPONSIBILITY_CATEGORIES,
  metadataOnly: true,
  immutable: true,
});

export const ExecutiveOrganizationContractFoundation = Object.freeze({
  contracts: ExecutiveOrganizationContracts,
  contractTypes: ExecutiveOrganizationContractTypes,
  contractRegistry: EXECUTIVE_ORGANIZATION_CONTRACT_REGISTRY,
  organization: EXECUTIVE_ORGANIZATION,
  organizationUnit: EXECUTIVE_ORGANIZATION_UNIT,
  executiveRole: EXECUTIVE_ROLE,
  executivePosition: EXECUTIVE_POSITION,
  reportingRelationship: EXECUTIVE_REPORTING_RELATIONSHIP,
  ownership: EXECUTIVE_OWNERSHIP,
  responsibility: EXECUTIVE_RESPONSIBILITY,
  hierarchy: EXECUTIVE_ORGANIZATION_HIERARCHY,
  validation: EXECUTIVE_ORGANIZATION_VALIDATION_RESULT,
  metadataOnly: true,
  immutable: true,
});
