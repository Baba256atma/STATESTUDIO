import type {
  AppDomainBridgeValidation,
  AppDomainCapability,
  AppDomainPlatformInfo,
  AppDomainRegistrySnapshot,
} from "./appDomainBridgeIndex.ts";

export type AppDomainCapabilityMap = Readonly<{
  totalCapabilities: number;
  bySourcePlatform: Readonly<Record<string, readonly AppDomainCapability[]>>;
  byCategory: Readonly<Record<string, readonly AppDomainCapability[]>>;
  capabilities: readonly AppDomainCapability[];
  metadataOnly: true;
}>;

export type AppDomainRegistryMap = Readonly<{
  platformCount: number;
  phaseCount: number;
  publicApiCount: number;
  platformIds: readonly string[];
  phaseIds: readonly string[];
  registry: AppDomainRegistrySnapshot;
  metadataOnly: true;
}>;

export type AppDomainPackageMap = Readonly<{
  totalPackages: number;
  packages: readonly Readonly<{
    packageId: string;
    packageName: string;
    sourceFacade: string;
    certification: string;
    metadataOnly: boolean;
  }>[];
  metadataOnly: true;
}>;

export type AppDomainPlatformMap = Readonly<{
  platformInfo: AppDomainPlatformInfo;
  compatible: boolean;
  releaseStage: string;
  metadataOnly: boolean;
  runtimeBehavior: boolean;
}>;

export type AppDomainConsumerSnapshot = Readonly<{
  platformMap: AppDomainPlatformMap;
  capabilityMap: AppDomainCapabilityMap;
  registryMap: AppDomainRegistryMap;
  packageMap: AppDomainPackageMap;
  immutable: true;
  metadataOnly: true;
}>;

export type AppDomainMappingValidation = Readonly<{
  valid: boolean;
  issues: readonly Readonly<{
    code: string;
    message: string;
  }>[];
}>;

export type AppDomainMappingResult<T> = Readonly<{
  success: boolean;
  value: T;
  bridgeValidation: AppDomainBridgeValidation;
  mappingValidation: AppDomainMappingValidation;
}>;

export type AppDomainMapping = Readonly<{
  mappingId: "app-dom-mapping";
  bridgeId: "app-dom-bridge";
  snapshot: AppDomainConsumerSnapshot;
  validation: AppDomainMappingValidation;
  immutable: true;
  metadataOnly: true;
}>;

export type AppDomainMappingManifest = Readonly<{
  mappingId: "app-dom-mapping";
  phaseId: "APP-DOM-2";
  bridgeVersion: "APP-DOM-1";
  consumedDomVersion: string;
  supportedAppVersion: "APP-DOM-2";
  capabilitiesMapped: number;
  registryMapped: boolean;
  packageCount: number;
  fingerprint: string;
  immutable: true;
  deterministic: true;
  metadataOnly: true;
}>;
