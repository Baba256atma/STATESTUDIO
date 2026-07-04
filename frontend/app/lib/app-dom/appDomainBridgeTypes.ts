export type AppDomainBridgeStatus = "ready" | "incompatible";

export type AppDomainPlatformInfo = Readonly<{
  platformId: string;
  platformName: string;
  layerId: "DOM";
  version: string;
  releaseStage: string;
  metadataOnly: boolean;
  runtimeBehavior: boolean;
}>;

export type AppDomainCapability = Readonly<{
  capabilityId: string;
  name: string;
  sourcePlatform: string;
  category: "foundation" | "platform-freeze" | "certification" | "dom-freeze";
  metadataOnly: true;
}>;

export type AppDomainCompatibilityResult = Readonly<{
  compatible: boolean;
  expectedPlatformId: string;
  actualPlatformId: string;
  expectedVersion: string;
  actualVersion: string;
  diagnostics: readonly string[];
}>;

export type AppDomainRegistrySnapshot = Readonly<{
  platformCount: number;
  phaseCount: number;
  publicApiCount: number;
  platforms: readonly Readonly<{
    platformId: string;
    platformName: string;
    publicFacade: string;
    certification: string;
    metadataOnly: boolean;
  }>[];
  phases: readonly Readonly<{
    phaseId: string;
    title: string;
    status: string;
    order: number;
    metadataOnly: boolean;
  }>[];
}>;

export type AppDomainBridgeValidation = Readonly<{
  valid: boolean;
  issues: readonly Readonly<{
    code: string;
    message: string;
  }>[];
}>;

export type AppDomainConsumerResult<T> = Readonly<{
  success: boolean;
  value: T;
  validation: AppDomainBridgeValidation;
}>;

export type AppDomainBridgeState = Readonly<{
  bridgeId: "app-dom-bridge";
  appLayerId: "APP";
  consumedLayerId: "DOM";
  status: AppDomainBridgeStatus;
  platformInfo: AppDomainPlatformInfo;
  compatibility: AppDomainCompatibilityResult;
  capabilities: readonly AppDomainCapability[];
  registrySnapshot: AppDomainRegistrySnapshot;
  immutable: true;
  metadataOnly: true;
}>;

export interface AppDomainBridge {
  readonly bridgeId: "app-dom-bridge";
  readonly state: AppDomainBridgeState;
}

export type AppDomainBridgeManifest = Readonly<{
  bridgeId: "app-dom-bridge";
  bridgeName: "APP to DOM Domain Expertise Consumer Bridge";
  consumedPlatform: AppDomainPlatformInfo;
  compatibility: AppDomainCompatibilityResult;
  capabilities: readonly AppDomainCapability[];
  registrySnapshot: AppDomainRegistrySnapshot;
  consumerMetadata: Readonly<{
    appLayerId: "APP";
    consumedLayerId: "DOM";
    supportedPlatformVersion: "DOM-8";
    supportedApiVersion: "APP-DOM-1";
    metadataOnly: true;
  }>;
  fingerprint: string;
  immutable: true;
  deterministic: true;
  metadataOnly: true;
}>;
