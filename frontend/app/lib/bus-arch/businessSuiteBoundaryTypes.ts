export type BoundaryClassification =
  | "Ownership"
  | "Responsibility"
  | "Exposure"
  | "Consumption"
  | "Isolation"
  | "Extension"
  | "Governance"
  | "Certification";

export type BoundaryOwnership = Readonly<{
  readonly ownershipId: string;
  readonly platformId: string;
  readonly ownedDomain: string;
  readonly owner: string;
  readonly exclusive: boolean;
  readonly metadataOnly: boolean;
  readonly immutable: boolean;
}>;

export type BoundaryResponsibility = Readonly<{
  readonly responsibilityId: string;
  readonly platformId: string;
  readonly responsibility: string;
  readonly classification: BoundaryClassification;
  readonly metadataOnly: boolean;
  readonly immutable: boolean;
}>;

export type BoundaryConsumer = Readonly<{
  readonly consumerId: string;
  readonly platformId: string;
  readonly consumerName: string;
  readonly accessBoundary: "Public API Only";
  readonly metadataOnly: boolean;
  readonly immutable: boolean;
}>;

export type BoundaryExposure = Readonly<{
  readonly exposureId: string;
  readonly platformId: string;
  readonly exposedCapability: string;
  readonly publicApiBoundary: string;
  readonly internalImplementationExposed: false;
  readonly metadataOnly: boolean;
  readonly immutable: boolean;
}>;

export type BoundaryRestriction = Readonly<{
  readonly restrictionId: string;
  readonly platformId: string;
  readonly forbiddenAccess: string;
  readonly reason: string;
  readonly metadataOnly: boolean;
  readonly immutable: boolean;
}>;

export type BoundaryMetadata = Readonly<{
  readonly boundaryId: "BUS-ARCH-2";
  readonly architectureId: "BUS-ARCH";
  readonly version: "1.0.0";
  readonly purpose: string;
  readonly metadataOnly: boolean;
  readonly immutable: boolean;
}>;

export type BusinessPlatformBoundary = Readonly<{
  readonly boundaryId: string;
  readonly platformId: string;
  readonly platformName: string;
  readonly purpose: string;
  readonly ownedDomain: string;
  readonly publicApis: readonly string[];
  readonly allowedConsumers: readonly string[];
  readonly allowedProviders: readonly string[];
  readonly internalScope: string;
  readonly externalScope: string;
  readonly extensionPoints: readonly string[];
  readonly forbiddenDependencies: readonly string[];
  readonly classifications: readonly BoundaryClassification[];
  readonly metadataOnly: boolean;
  readonly immutable: boolean;
}>;

export type BusinessSuiteBoundaryManifest = Readonly<{
  readonly version: "1.0.0";
  readonly architectureId: "BUS-ARCH";
  readonly platformBoundaryCatalog: readonly BusinessPlatformBoundary[];
  readonly ownershipMatrix: readonly BoundaryOwnership[];
  readonly responsibilityMatrix: readonly BoundaryResponsibility[];
  readonly exposureMatrix: readonly BoundaryExposure[];
  readonly consumerMatrix: readonly BoundaryConsumer[];
  readonly restrictionMatrix: readonly BoundaryRestriction[];
  readonly extensionMatrix: readonly BoundaryExposure[];
  readonly categories: readonly BoundaryClassification[];
  readonly metadata: BoundaryMetadata;
  readonly deterministicFingerprint: string;
}>;

export type BusinessSuiteBoundaryValidation = Readonly<{
  readonly valid: boolean;
  readonly errors: readonly string[];
  readonly warnings: readonly string[];
}>;
