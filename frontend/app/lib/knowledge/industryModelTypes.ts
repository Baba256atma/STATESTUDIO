/**
 * KNL-5 — Industry Models domain types.
 */

import type {
  INDUSTRY_CAPABILITY_KEYS,
  INDUSTRY_CATEGORY_KEYS,
  INDUSTRY_EXTENSION_POINT_KEYS,
  INDUSTRY_MODELS_CONTRACT_VERSION,
  INDUSTRY_MODELS_NAMESPACE,
  INDUSTRY_NAMESPACE_KEYS,
  INDUSTRY_SECTOR_KEYS,
  INDUSTRY_TEMPLATE_TYPE_KEYS,
} from "./industryModelCatalog.ts";

export type IndustryIdentifier = string;
export type IndustrySectorKey = (typeof INDUSTRY_SECTOR_KEYS)[number];
export type IndustryCategoryKey = (typeof INDUSTRY_CATEGORY_KEYS)[number];
export type IndustryCapabilityKey = (typeof INDUSTRY_CAPABILITY_KEYS)[number];
export type IndustryTemplateTypeKey = (typeof INDUSTRY_TEMPLATE_TYPE_KEYS)[number];
export type IndustryNamespaceKey = (typeof INDUSTRY_NAMESPACE_KEYS)[number];
export type IndustryExtensionPointKey = (typeof INDUSTRY_EXTENSION_POINT_KEYS)[number];
export type IndustryVersion = typeof INDUSTRY_MODELS_CONTRACT_VERSION | string;

export type IndustryMetadata = Readonly<{
  metadataId: IndustryIdentifier;
  metadataVersion: typeof INDUSTRY_MODELS_CONTRACT_VERSION;
  namespace: typeof INDUSTRY_MODELS_NAMESPACE | string;
  owner: string;
  extensions: Readonly<Record<string, string>>;
  createdAt: string;
  readOnly: true;
}>;

export type IndustryNamespace = Readonly<{
  namespaceId: IndustryIdentifier;
  namespaceKey: IndustryNamespaceKey;
  label: string;
  description: string;
  version: typeof INDUSTRY_MODELS_CONTRACT_VERSION;
  metadata: IndustryMetadata;
  readOnly: true;
}>;

export type BusinessSector = Readonly<{
  sectorId: IndustryIdentifier;
  sectorKey: IndustrySectorKey;
  label: string;
  description: string;
  version: typeof INDUSTRY_MODELS_CONTRACT_VERSION;
  metadata: IndustryMetadata;
  readOnly: true;
}>;

export type IndustryCategory = Readonly<{
  categoryId: IndustryIdentifier;
  categoryKey: IndustryCategoryKey;
  label: string;
  description: string;
  version: typeof INDUSTRY_MODELS_CONTRACT_VERSION;
  metadata: IndustryMetadata;
  readOnly: true;
}>;

export type IndustryCapability = Readonly<{
  capabilityId: IndustryIdentifier;
  capabilityKey: IndustryCapabilityKey;
  label: string;
  description: string;
  version: typeof INDUSTRY_MODELS_CONTRACT_VERSION;
  metadata: IndustryMetadata;
  readOnly: true;
}>;

export type IndustryProfile = Readonly<{
  profileId: IndustryIdentifier;
  modelId: IndustryIdentifier;
  label: string;
  description: string;
  sectorKey: IndustrySectorKey;
  version: typeof INDUSTRY_MODELS_CONTRACT_VERSION;
  metadata: IndustryMetadata;
  readOnly: true;
}>;

export type IndustryProcessTemplate = Readonly<{
  templateId: IndustryIdentifier;
  modelId: IndustryIdentifier;
  label: string;
  description: string;
  version: typeof INDUSTRY_MODELS_CONTRACT_VERSION;
  metadata: IndustryMetadata;
  readOnly: true;
}>;

export type IndustryKpiTemplate = Readonly<{
  templateId: IndustryIdentifier;
  modelId: IndustryIdentifier;
  label: string;
  description: string;
  version: typeof INDUSTRY_MODELS_CONTRACT_VERSION;
  metadata: IndustryMetadata;
  readOnly: true;
}>;

export type IndustryRiskTemplate = Readonly<{
  templateId: IndustryIdentifier;
  modelId: IndustryIdentifier;
  label: string;
  description: string;
  version: typeof INDUSTRY_MODELS_CONTRACT_VERSION;
  metadata: IndustryMetadata;
  readOnly: true;
}>;

export type IndustryResourceTemplate = Readonly<{
  templateId: IndustryIdentifier;
  modelId: IndustryIdentifier;
  label: string;
  description: string;
  version: typeof INDUSTRY_MODELS_CONTRACT_VERSION;
  metadata: IndustryMetadata;
  readOnly: true;
}>;

export type IndustryRelationshipTemplate = Readonly<{
  templateId: IndustryIdentifier;
  modelId: IndustryIdentifier;
  label: string;
  description: string;
  version: typeof INDUSTRY_MODELS_CONTRACT_VERSION;
  metadata: IndustryMetadata;
  readOnly: true;
}>;

export type IndustryTemplate = Readonly<{
  templateId: IndustryIdentifier;
  modelId: IndustryIdentifier;
  templateType: IndustryTemplateTypeKey;
  label: string;
  description: string;
  sectorKey: IndustrySectorKey;
  ontologyEntityId: string | null;
  vocabularyTermId: string | null;
  graphNodeId: string | null;
  version: typeof INDUSTRY_MODELS_CONTRACT_VERSION;
  metadata: IndustryMetadata;
  readOnly: true;
}>;

export type IndustryModel = Readonly<{
  modelId: IndustryIdentifier;
  sectorKey: IndustrySectorKey;
  categoryKey: IndustryCategoryKey;
  label: string;
  description: string;
  profileId: IndustryIdentifier | null;
  ontologyEntityId: string | null;
  vocabularyTermId: string | null;
  graphNodeId: string | null;
  version: typeof INDUSTRY_MODELS_CONTRACT_VERSION;
  metadata: IndustryMetadata;
  readOnly: true;
}>;

export type IndustryExtensionPoint = Readonly<{
  extensionPointId: IndustryIdentifier;
  extensionPointKey: IndustryExtensionPointKey;
  label: string;
  description: string;
  version: typeof INDUSTRY_MODELS_CONTRACT_VERSION;
  metadata: IndustryMetadata;
  readOnly: true;
}>;

export type IndustryManifest = Readonly<{
  platformId: typeof import("./industryModelCatalog.ts").INDUSTRY_MODELS_ID;
  platformName: typeof import("./industryModelCatalog.ts").INDUSTRY_MODELS_NAME;
  namespace: typeof INDUSTRY_MODELS_NAMESPACE;
  contractVersion: typeof INDUSTRY_MODELS_CONTRACT_VERSION;
  architectureVersion: typeof import("./industryModelCatalog.ts").INDUSTRY_MODELS_ARCHITECTURE_VERSION;
  foundationDependency: "KNL/1";
  ontologyDependency: "KNL/2";
  vocabularyDependency: "KNL/3";
  graphDependency: "KNL/4";
  supportedSectors: readonly IndustrySectorKey[];
  supportedCategories: readonly IndustryCategoryKey[];
  supportedTemplateTypes: readonly IndustryTemplateTypeKey[];
  supportedCapabilities: readonly IndustryCapabilityKey[];
  publicApis: readonly string[];
  principles: readonly string[];
  mustNotOwn: readonly string[];
  governanceRules: readonly Readonly<{ ruleId: string; description: string; enforced: true }>[];
  futurePhases: readonly string[];
  generatedAt: string;
  readOnly: true;
}>;

export type IndustryValidationIssue = Readonly<{
  code: string;
  message: string;
  field?: string;
  readOnly: true;
}>;

export type IndustryValidationResult = Readonly<{
  valid: boolean;
  issues: readonly IndustryValidationIssue[];
  readOnly: true;
}>;

export type IndustryResult<T> = Readonly<{
  success: boolean;
  reason: string;
  data: T | null;
  readOnly: true;
}>;

export type IndustryModelRegistrationInput = Readonly<{
  modelId: IndustryIdentifier;
  sectorKey: IndustrySectorKey;
  categoryKey: IndustryCategoryKey;
  label: string;
  description: string;
  ontologyEntityId?: string;
  vocabularyTermId?: string;
  graphNodeId?: string;
}>;

export type IndustryTemplateRegistrationInput = Readonly<{
  templateId: IndustryIdentifier;
  modelId: IndustryIdentifier;
  templateType: IndustryTemplateTypeKey;
  label: string;
  description: string;
  sectorKey: IndustrySectorKey;
  ontologyEntityId?: string;
  vocabularyTermId?: string;
  graphNodeId?: string;
}>;

export type IndustryCategoryRegistrationInput = Readonly<{
  categoryId: IndustryIdentifier;
  categoryKey: IndustryCategoryKey;
  label: string;
  description: string;
}>;

export type IndustrySnapshot = Readonly<{
  platformVersion: typeof INDUSTRY_MODELS_CONTRACT_VERSION;
  modelCount: number;
  templateCount: number;
  categoryCount: number;
  sectorCount: number;
  capabilityCount: number;
  namespaceCount: number;
  readOnly: true;
}>;

export type IndustryModelsState = Readonly<{
  platformId: typeof import("./industryModelCatalog.ts").INDUSTRY_MODELS_ID;
  contractVersion: typeof INDUSTRY_MODELS_CONTRACT_VERSION;
  foundationDependency: "KNL/1";
  ontologyDependency: "KNL/2";
  vocabularyDependency: "KNL/3";
  graphDependency: "KNL/4";
  initialized: boolean;
  modelCount: number;
  templateCount: number;
  sectorCount: number;
  timestamp: string;
  readOnly: true;
}>;

export type IndustryValidationReport = Readonly<{
  valid: boolean;
  foundationValid: boolean;
  ontologyValid: boolean;
  vocabularyValid: boolean;
  graphValid: boolean;
  platformInitialized: boolean;
  registryValid: boolean;
  identityValid: boolean;
  issues: readonly IndustryValidationIssue[];
  readOnly: true;
}>;
