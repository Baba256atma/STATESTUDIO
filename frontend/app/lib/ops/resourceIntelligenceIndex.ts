export {
  AIResourceContract,
  CriticalResourceContract,
  DedicatedResourceContract,
  DigitalResourceContract,
  ExternalResourceContract,
  FinancialResourceContract,
  HumanResourceContract,
  InfrastructureResourceContract,
  OptionalResourceContract,
  PhysicalResourceContract,
  ResourceIntelligenceContracts,
  ResourceIntelligencePublicApis,
  SharedResourceContract,
  SoftwareResourceContract,
} from "./resourceIntelligenceContracts.ts";

export {
  ExecutiveResourceIntelligenceFoundation,
} from "./resourceIntelligenceFoundation.ts";

export {
  ResourceIntelligenceArchitecturalLevel,
  ResourceIntelligenceIdentity,
  ResourceIntelligencePlatformDescription,
  ResourceIntelligencePlatformId,
  ResourceIntelligencePlatformName,
  ResourceIntelligencePlatformNamespace,
  ResourceIntelligencePlatformStatus,
  ResourceIntelligencePlatformVersion,
} from "./resourceIntelligenceIdentity.ts";

export {
  buildResourceIntelligenceManifest,
} from "./resourceIntelligenceManifest.ts";

export {
  ResourceIntelligenceRegistry,
} from "./resourceIntelligenceRegistry.ts";

export {
  validateResourceIntelligenceFoundation,
} from "./resourceIntelligenceValidation.ts";

export type {
  FoundationMetadata,
  ManifestMetadata,
  PlatformMetadata,
  PublicApiMetadata,
  ResourceAvailability,
  ResourceCapability,
  ResourceCapacity,
  ResourceCategory,
  ResourceClassification,
  ResourceCost,
  ResourceDescriptor,
  ResourceIdentity,
  ResourceLocation,
  ResourceMetadata,
  ResourceOwnership,
  ResourceSkill,
  ValidationMetadata,
} from "./resourceIntelligenceTypes.ts";
