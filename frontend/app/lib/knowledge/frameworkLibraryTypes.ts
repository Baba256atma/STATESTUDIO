/**
 * KNL-6 — Framework Library domain types.
 */

import type {
  FRAMEWORK_CAPABILITY_KEYS,
  FRAMEWORK_CATEGORY_KEYS,
  FRAMEWORK_EXTENSION_POINT_KEYS,
  FRAMEWORK_KEYS,
  FRAMEWORK_LIBRARY_CONTRACT_VERSION,
  FRAMEWORK_LIBRARY_NAMESPACE,
  FRAMEWORK_NAMESPACE_KEYS,
} from "./frameworkLibraryCatalog.ts";

export type FrameworkIdentifier = string;
export type FrameworkKey = (typeof FRAMEWORK_KEYS)[number];
export type FrameworkCategoryKey = (typeof FRAMEWORK_CATEGORY_KEYS)[number];
export type FrameworkCapabilityKey = (typeof FRAMEWORK_CAPABILITY_KEYS)[number];
export type FrameworkNamespaceKey = (typeof FRAMEWORK_NAMESPACE_KEYS)[number];
export type FrameworkExtensionPointKey = (typeof FRAMEWORK_EXTENSION_POINT_KEYS)[number];
export type FrameworkVersion = typeof FRAMEWORK_LIBRARY_CONTRACT_VERSION | string;

export type FrameworkMetadata = Readonly<{
  metadataId: FrameworkIdentifier;
  metadataVersion: typeof FRAMEWORK_LIBRARY_CONTRACT_VERSION;
  namespace: typeof FRAMEWORK_LIBRARY_NAMESPACE | string;
  owner: string;
  extensions: Readonly<Record<string, string>>;
  createdAt: string;
  readOnly: true;
}>;

export type FrameworkNamespace = Readonly<{
  namespaceId: FrameworkIdentifier;
  namespaceKey: FrameworkNamespaceKey;
  label: string;
  description: string;
  version: typeof FRAMEWORK_LIBRARY_CONTRACT_VERSION;
  metadata: FrameworkMetadata;
  readOnly: true;
}>;

export type FrameworkCategory = Readonly<{
  categoryId: FrameworkIdentifier;
  categoryKey: FrameworkCategoryKey;
  label: string;
  description: string;
  version: typeof FRAMEWORK_LIBRARY_CONTRACT_VERSION;
  metadata: FrameworkMetadata;
  readOnly: true;
}>;

export type FrameworkCapability = Readonly<{
  capabilityId: FrameworkIdentifier;
  capabilityKey: FrameworkCapabilityKey;
  label: string;
  description: string;
  version: typeof FRAMEWORK_LIBRARY_CONTRACT_VERSION;
  metadata: FrameworkMetadata;
  readOnly: true;
}>;

export type FrameworkDimension = Readonly<{
  dimensionId: FrameworkIdentifier;
  frameworkId: FrameworkIdentifier;
  label: string;
  description: string;
  version: typeof FRAMEWORK_LIBRARY_CONTRACT_VERSION;
  metadata: FrameworkMetadata;
  readOnly: true;
}>;

export type FrameworkComponent = Readonly<{
  componentId: FrameworkIdentifier;
  frameworkId: FrameworkIdentifier;
  label: string;
  description: string;
  version: typeof FRAMEWORK_LIBRARY_CONTRACT_VERSION;
  metadata: FrameworkMetadata;
  readOnly: true;
}>;

export type FrameworkStep = Readonly<{
  stepId: FrameworkIdentifier;
  frameworkId: FrameworkIdentifier;
  label: string;
  description: string;
  version: typeof FRAMEWORK_LIBRARY_CONTRACT_VERSION;
  metadata: FrameworkMetadata;
  readOnly: true;
}>;

export type FrameworkPhase = Readonly<{
  phaseId: FrameworkIdentifier;
  frameworkId: FrameworkIdentifier;
  label: string;
  description: string;
  version: typeof FRAMEWORK_LIBRARY_CONTRACT_VERSION;
  metadata: FrameworkMetadata;
  readOnly: true;
}>;

export type FrameworkInput = Readonly<{
  inputId: FrameworkIdentifier;
  frameworkId: FrameworkIdentifier;
  label: string;
  description: string;
  version: typeof FRAMEWORK_LIBRARY_CONTRACT_VERSION;
  metadata: FrameworkMetadata;
  readOnly: true;
}>;

export type FrameworkOutput = Readonly<{
  outputId: FrameworkIdentifier;
  frameworkId: FrameworkIdentifier;
  label: string;
  description: string;
  version: typeof FRAMEWORK_LIBRARY_CONTRACT_VERSION;
  metadata: FrameworkMetadata;
  readOnly: true;
}>;

export type FrameworkKpi = Readonly<{
  kpiId: FrameworkIdentifier;
  frameworkId: FrameworkIdentifier;
  label: string;
  description: string;
  version: typeof FRAMEWORK_LIBRARY_CONTRACT_VERSION;
  metadata: FrameworkMetadata;
  readOnly: true;
}>;

export type FrameworkRisk = Readonly<{
  riskId: FrameworkIdentifier;
  frameworkId: FrameworkIdentifier;
  label: string;
  description: string;
  version: typeof FRAMEWORK_LIBRARY_CONTRACT_VERSION;
  metadata: FrameworkMetadata;
  readOnly: true;
}>;

export type FrameworkTemplate = Readonly<{
  templateId: FrameworkIdentifier;
  frameworkId: FrameworkIdentifier;
  label: string;
  description: string;
  categoryKey: FrameworkCategoryKey;
  version: typeof FRAMEWORK_LIBRARY_CONTRACT_VERSION;
  metadata: FrameworkMetadata;
  readOnly: true;
}>;

export type Framework = Readonly<{
  frameworkId: FrameworkIdentifier;
  frameworkKey: FrameworkKey;
  canonicalName: string;
  label: string;
  description: string;
  categoryKey: FrameworkCategoryKey;
  ontologyEntityId: string | null;
  vocabularyTermId: string | null;
  industryModelId: string | null;
  version: typeof FRAMEWORK_LIBRARY_CONTRACT_VERSION;
  metadata: FrameworkMetadata;
  readOnly: true;
}>;

export type FrameworkExtensionPoint = Readonly<{
  extensionPointId: FrameworkIdentifier;
  extensionPointKey: FrameworkExtensionPointKey;
  label: string;
  description: string;
  version: typeof FRAMEWORK_LIBRARY_CONTRACT_VERSION;
  metadata: FrameworkMetadata;
  readOnly: true;
}>;

export type FrameworkManifest = Readonly<{
  platformId: typeof import("./frameworkLibraryCatalog.ts").FRAMEWORK_LIBRARY_ID;
  platformName: typeof import("./frameworkLibraryCatalog.ts").FRAMEWORK_LIBRARY_NAME;
  namespace: typeof FRAMEWORK_LIBRARY_NAMESPACE;
  contractVersion: typeof FRAMEWORK_LIBRARY_CONTRACT_VERSION;
  architectureVersion: typeof import("./frameworkLibraryCatalog.ts").FRAMEWORK_LIBRARY_ARCHITECTURE_VERSION;
  foundationDependency: "KNL/1";
  ontologyDependency: "KNL/2";
  vocabularyDependency: "KNL/3";
  graphDependency: "KNL/4";
  industryDependency: "KNL/5";
  supportedFrameworks: readonly FrameworkKey[];
  supportedCategories: readonly FrameworkCategoryKey[];
  supportedCapabilities: readonly FrameworkCapabilityKey[];
  publicApis: readonly string[];
  principles: readonly string[];
  mustNotOwn: readonly string[];
  governanceRules: readonly Readonly<{ ruleId: string; description: string; enforced: true }>[];
  futurePhases: readonly string[];
  generatedAt: string;
  readOnly: true;
}>;

export type FrameworkValidationIssue = Readonly<{
  code: string;
  message: string;
  field?: string;
  readOnly: true;
}>;

export type FrameworkValidationResult = Readonly<{
  valid: boolean;
  issues: readonly FrameworkValidationIssue[];
  readOnly: true;
}>;

export type FrameworkResult<T> = Readonly<{
  success: boolean;
  reason: string;
  data: T | null;
  readOnly: true;
}>;

export type FrameworkRegistrationInput = Readonly<{
  frameworkId: FrameworkIdentifier;
  frameworkKey: FrameworkKey;
  canonicalName: string;
  label: string;
  description: string;
  categoryKey: FrameworkCategoryKey;
  ontologyEntityId?: string;
  vocabularyTermId?: string;
  industryModelId?: string;
}>;

export type FrameworkTemplateRegistrationInput = Readonly<{
  templateId: FrameworkIdentifier;
  frameworkId: FrameworkIdentifier;
  label: string;
  description: string;
  categoryKey: FrameworkCategoryKey;
}>;

export type FrameworkCategoryRegistrationInput = Readonly<{
  categoryId: FrameworkIdentifier;
  categoryKey: FrameworkCategoryKey;
  label: string;
  description: string;
}>;

export type FrameworkComponentRegistrationInput = Readonly<{
  componentId: FrameworkIdentifier;
  frameworkId: FrameworkIdentifier;
  label: string;
  description: string;
}>;

export type FrameworkSnapshot = Readonly<{
  platformVersion: typeof FRAMEWORK_LIBRARY_CONTRACT_VERSION;
  frameworkCount: number;
  templateCount: number;
  categoryCount: number;
  componentCount: number;
  capabilityCount: number;
  namespaceCount: number;
  readOnly: true;
}>;

export type FrameworkLibraryState = Readonly<{
  platformId: typeof import("./frameworkLibraryCatalog.ts").FRAMEWORK_LIBRARY_ID;
  contractVersion: typeof FRAMEWORK_LIBRARY_CONTRACT_VERSION;
  foundationDependency: "KNL/1";
  ontologyDependency: "KNL/2";
  vocabularyDependency: "KNL/3";
  graphDependency: "KNL/4";
  industryDependency: "KNL/5";
  initialized: boolean;
  frameworkCount: number;
  templateCount: number;
  componentCount: number;
  timestamp: string;
  readOnly: true;
}>;

export type FrameworkValidationReport = Readonly<{
  valid: boolean;
  foundationValid: boolean;
  ontologyValid: boolean;
  vocabularyValid: boolean;
  graphValid: boolean;
  industryValid: boolean;
  libraryInitialized: boolean;
  registryValid: boolean;
  identityValid: boolean;
  issues: readonly FrameworkValidationIssue[];
  readOnly: true;
}>;
