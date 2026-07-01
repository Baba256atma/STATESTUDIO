export type ExecutiveBrainReleaseStage = "foundation";

export type ExecutiveBrainLayerIdentity = "LAY";

export type ExecutiveBrainPhaseId =
  | "LAY-1"
  | "LAY-2"
  | "LAY-3"
  | "LAY-4"
  | "LAY-5"
  | "LAY-6"
  | "LAY-7"
  | "LAY-8"
  | "LAY-9"
  | "LAY-10"
  | "LAY-11"
  | "LAY-12";

export type ExecutiveBrainCapabilityId =
  | "reasoning"
  | "judgment"
  | "planning"
  | "coaching"
  | "thoughtPartner"
  | "visualReasoning"
  | "communication"
  | "negotiation"
  | "creativity"
  | "learning";

export type ExecutiveBrainPlatform = Readonly<{
  platformId: string;
  platformName: string;
  version: string;
  releaseStage: ExecutiveBrainReleaseStage;
  description: string;
  layerIdentity: ExecutiveBrainLayerIdentity;
  architecturalRole: string;
}>;

export type ExecutiveBrainPhaseDefinition = Readonly<{
  id: ExecutiveBrainPhaseId;
  name: string;
  order: number;
  status: "current" | "future";
}>;

export type ExecutiveBrainCapability = Readonly<{
  id: ExecutiveBrainCapabilityId;
  name: string;
  description: string;
  futureOwnerPhase: ExecutiveBrainPhaseId;
}>;

export type ExecutiveBrainEngineDefinition = Readonly<{
  id: string;
  name: string;
  capabilityId: ExecutiveBrainCapabilityId;
  futureOwnerPhase: ExecutiveBrainPhaseId;
  implemented: false;
}>;

export type ExecutiveBrainExtensionDefinition = Readonly<{
  id: string;
  name: string;
  futureOwnerPhase: ExecutiveBrainPhaseId;
  enabled: false;
}>;

export type ExecutiveBrainRegistry = Readonly<{
  platform: ExecutiveBrainPlatform;
  phases: readonly ExecutiveBrainPhaseDefinition[];
  capabilities: readonly ExecutiveBrainCapability[];
  engines: readonly ExecutiveBrainEngineDefinition[];
  extensions: readonly ExecutiveBrainExtensionDefinition[];
}>;

export type ExecutiveBrainConfiguration = Readonly<{
  enabled: true;
  strictMode: true;
  diagnostics: false;
  validation: true;
  debug: false;
  runtimeIntelligence: false;
}>;

export type ExecutiveBrainValidationIssue = Readonly<{
  code: string;
  field: string;
  message: string;
  severity: "error";
}>;

export type ExecutiveBrainValidationResult = Readonly<{
  valid: boolean;
  issues: readonly ExecutiveBrainValidationIssue[];
}>;

export type ExecutiveBrainManifest = Readonly<{
  platform: ExecutiveBrainPlatform;
  registry: ExecutiveBrainRegistry;
  configuration: ExecutiveBrainConfiguration;
  publicApis: readonly string[];
  validation: ExecutiveBrainValidationResult;
  metadataOnly: true;
  runtimeIntelligence: false;
  readyFor: "LAY-2 Executive Reasoning Engine";
}>;
