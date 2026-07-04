export const DOMAIN_FOUNDATION_CONTRACT_VERSION = "DOM-1" as const;

export type DomainId = string;

export type DomainCategory =
  | "manufacturing"
  | "healthcare"
  | "banking"
  | "retail"
  | "logistics"
  | "construction"
  | "energy"
  | "education"
  | "other";

export type DomainStatus = "draft" | "registered" | "active" | "deprecated" | "archived";

export type DomainVersion = Readonly<{
  major: number;
  minor: number;
  patch: number;
  label?: string;
}>;

export type DomainCapability = Readonly<{
  id: string;
  name: string;
  description: string;
  enabled: boolean;
}>;

export type DomainDependency = Readonly<{
  domainId: DomainId;
  minVersion: DomainVersion;
  optional: boolean;
}>;

export type DomainMetadata = Readonly<{
  displayName: string;
  description: string;
  category: DomainCategory;
  tags: readonly string[];
}>;

export type DomainManifest = Readonly<{
  domainId: DomainId;
  name: string;
  version: DomainVersion;
  metadata: DomainMetadata;
  capabilities: readonly DomainCapability[];
  dependencies: readonly DomainDependency[];
  status: DomainStatus;
}>;

export type DomainPackage = Readonly<{
  contractVersion: typeof DOMAIN_FOUNDATION_CONTRACT_VERSION;
  manifest: DomainManifest;
}>;

export type RegisteredDomain = Readonly<{
  package: DomainPackage;
  registrationOrder: number;
}>;

export type DomainRegistryIndexes = Readonly<{
  byId: Readonly<Record<DomainId, RegisteredDomain>>;
  byName: Readonly<Record<string, RegisteredDomain>>;
}>;

export type DomainRegistry = Readonly<{
  contractVersion: typeof DOMAIN_FOUNDATION_CONTRACT_VERSION;
  registryId: string;
  frozen: boolean;
  domains: readonly RegisteredDomain[];
  indexes: DomainRegistryIndexes;
}>;

export type DomainValidationIssue = Readonly<{
  code: string;
  field: string;
  message: string;
  severity: "error";
}>;

export type DomainValidationResult = Readonly<{
  valid: boolean;
  issues: readonly DomainValidationIssue[];
}>;

export type DomainRegistryMutationResult = Readonly<{
  success: boolean;
  registry: DomainRegistry;
  domain: RegisteredDomain | null;
  validation: DomainValidationResult;
}>;

export type DomainFoundationPlatform = Readonly<{
  platformId: string;
  platformName: string;
  version: string;
  releaseStage: "foundation";
  description: string;
  layerIdentity: "DOM";
  architecturalRole: string;
}>;

export type DomainFoundationManifest = Readonly<{
  platform: DomainFoundationPlatform;
  supportedCategories: readonly DomainCategory[];
  defaultStatus: DomainStatus;
  maxDomainIdLength: number;
  publicApis: readonly string[];
  validation: DomainValidationResult;
  metadataOnly: true;
  runtimeBehavior: false;
  readyFor: "DOM-2 Domain Registry Platform";
}>;
