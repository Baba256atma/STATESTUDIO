/**
 * KNL-1 — Knowledge Platform contracts.
 */

import { STAGE_GLOBAL_FORBIDDEN_PATTERNS } from "../stage/stageArchitectureContract.ts";
import type { StageManifest } from "../stage/stageArchitectureTypes.ts";
import { validateStageManifest } from "../stage/stageArchitectureGuards.ts";
import {
  KNOWLEDGE_CAPABILITY_KEYS,
  KNOWLEDGE_DOMAIN_KEYS,
  KNOWLEDGE_EXTENSION_POINT_KEYS,
  KNOWLEDGE_FUTURE_DEPENDENCY_RULES,
  KNOWLEDGE_FUTURE_PHASE_KEYS,
  KNOWLEDGE_MUST_NOT_OWN,
  KNOWLEDGE_NAMESPACE_KEYS,
  KNOWLEDGE_PLATFORM_ARCHITECTURE_VERSION,
  KNOWLEDGE_PLATFORM_CONTRACT_VERSION,
  KNOWLEDGE_PLATFORM_ID,
  KNOWLEDGE_PLATFORM_NAME,
  KNOWLEDGE_PLATFORM_PRINCIPLES,
  KNOWLEDGE_PUBLIC_API_REGISTRY,
  KNOWLEDGE_RELEASE_METADATA,
} from "./knowledgeConstants.ts";
import {
  getKnowledgeRegistrySnapshot,
} from "./knowledgeRegistry.ts";
import type {
  KnowledgeCapability,
  KnowledgeDomain,
  KnowledgeEntity,
  KnowledgeExtensionPoint,
  KnowledgeMetadata,
  KnowledgeNamespace,
  KnowledgePackage,
  KnowledgePlatformIdentity,
  KnowledgePlatformManifest,
  KnowledgePlatformValidationReport,
  KnowledgeProvider,
  KnowledgeRegistration,
  KnowledgeSource,
  KnowledgeValidationResult,
} from "./knowledgeTypes.ts";
import {
  validateDependencyDeclarations,
  validateKnowledgeVersionFormat,
  validatePlatformIdentity,
} from "./knowledgeValidation.ts";
import {
  buildKnowledgeFoundation,
  isKnowledgePlatformInitialized,
} from "./knowledgeFoundation.ts";

export const KNOWLEDGE_PLATFORM_IDENTITY: KnowledgePlatformIdentity = Object.freeze({
  layerId: "KNL",
  appId: "KNL",
  title: KNOWLEDGE_PLATFORM_NAME,
  platformId: KNOWLEDGE_PLATFORM_ID,
  version: KNOWLEDGE_PLATFORM_CONTRACT_VERSION,
  readOnly: true as const,
});

export const KNOWLEDGE_PUBLIC_API_RULES = Object.freeze({
  interfaceOnly: true,
  noHiddenState: true,
  noPersistence: true,
  noRetrieval: true,
  noGraph: true,
  noOntology: true,
  noMachineLearning: true,
  noLlm: true,
  noRuntime: true,
  noReact: true,
  metadataOnly: true,
  foundationOnly: true,
  readOnly: true as const,
});

export const KNOWLEDGE_FREEZE_RULES = Object.freeze({
  contractImmutable: true,
  publicInterfacesExtendOnly: true,
  breakingChangesForbidden: true,
  metadataOnly: true,
  noRuntimeIntelligence: true,
  noRetrieval: true,
  noGraph: true,
  noOntology: true,
  noMachineLearning: true,
  foundationOnly: true,
  readOnly: true as const,
});

export const KNOWLEDGE_PLATFORM_FORBIDDEN_PATTERNS = Object.freeze([
  ...STAGE_GLOBAL_FORBIDDEN_PATTERNS,
  "openai",
  "ChatGPT",
  "prompt(",
  "embedding",
  "vectorSearch",
  "neural",
  "machineLearning",
  "semanticSearch",
  "knowledgeGraph",
  "ontologyEngine",
  "retrievalEngine",
  "localStorage",
  "indexedDB",
  "fetch(",
] as const);

export const KNOWLEDGE_PLATFORM_SELF_MANIFEST = Object.freeze({
  stageId: "KNL/1",
  title: "Knowledge Platform Foundation",
  goal: "Metadata-only knowledge platform identity, contracts, registry, validation, and extension points.",
  lifecycle: "build" as const,
  allowedFiles: Object.freeze([
    "frontend/app/lib/knowledge/knowledgeConstants.ts",
    "frontend/app/lib/knowledge/knowledgeTypes.ts",
    "frontend/app/lib/knowledge/knowledgeContracts.ts",
    "frontend/app/lib/knowledge/knowledgeRegistry.ts",
    "frontend/app/lib/knowledge/knowledgeValidation.ts",
    "frontend/app/lib/knowledge/knowledgeFoundation.ts",
    "frontend/app/lib/knowledge/knowledgeFoundation.test.ts",
    "docs/knl-1-knowledge-foundation-report.md",
  ]),
  forbiddenPatterns: KNOWLEDGE_PLATFORM_FORBIDDEN_PATTERNS,
  prerequisites: Object.freeze(["CORE"]),
  runtimePath: "library-only" as const,
  tags: Object.freeze(["[KNL_1]", "[KNOWLEDGE_FOUNDATION]", "[METADATA_ONLY]"]),
} satisfies StageManifest);

export function resolveKnowledgeMetadataExample(timestamp: string): KnowledgeMetadata {
  return Object.freeze({
    metadataId: "knowledge-metadata-example-001",
    metadataVersion: KNOWLEDGE_PLATFORM_CONTRACT_VERSION,
    owner: "knowledge-platform-foundation",
    extensions: Object.freeze({}),
    createdAt: timestamp,
    readOnly: true as const,
  });
}

export function resolveKnowledgeDomainExample(timestamp: string): KnowledgeDomain {
  return Object.freeze({
    domainId: "knowledge-domain-example-001",
    domainKey: "structural",
    label: "Structural Knowledge Domain",
    description: "Example structural knowledge domain contract.",
    version: KNOWLEDGE_PLATFORM_CONTRACT_VERSION,
    metadata: resolveKnowledgeMetadataExample(timestamp),
    readOnly: true as const,
  });
}

export function resolveKnowledgePackageExample(timestamp: string): KnowledgePackage {
  return Object.freeze({
    packageId: "knowledge-package-example-001",
    namespaceId: "knowledge-namespace-knowledge-foundation",
    label: "Knowledge Package Example",
    description: "Example knowledge package contract.",
    version: KNOWLEDGE_PLATFORM_CONTRACT_VERSION,
    metadata: resolveKnowledgeMetadataExample(timestamp),
    readOnly: true as const,
  });
}

export function resolveKnowledgeSourceExample(timestamp: string): KnowledgeSource {
  return Object.freeze({
    sourceId: "knowledge-source-example-001",
    providerId: "knowledge-provider-example-001",
    label: "Knowledge Source Example",
    description: "Example knowledge source contract.",
    version: KNOWLEDGE_PLATFORM_CONTRACT_VERSION,
    metadata: resolveKnowledgeMetadataExample(timestamp),
    readOnly: true as const,
  });
}

export function resolveKnowledgeEntityExample(timestamp: string): KnowledgeEntity {
  return Object.freeze({
    entityId: "knowledge-entity-example-001",
    namespaceId: "knowledge-namespace-knowledge-foundation",
    domainKey: "reference",
    label: "Knowledge Entity Example",
    description: "Example knowledge entity contract.",
    version: KNOWLEDGE_PLATFORM_CONTRACT_VERSION,
    metadata: resolveKnowledgeMetadataExample(timestamp),
    readOnly: true as const,
  });
}

export function resolveKnowledgeProviderExample(timestamp: string): KnowledgeProvider {
  return Object.freeze({
    providerId: "knowledge-provider-example-001",
    namespaceId: "knowledge-namespace-knowledge-foundation",
    label: "Knowledge Provider Example",
    description: "Example knowledge provider contract.",
    version: KNOWLEDGE_PLATFORM_CONTRACT_VERSION,
    metadata: resolveKnowledgeMetadataExample(timestamp),
    readOnly: true as const,
  });
}

export function resolveKnowledgeCapabilityExample(timestamp: string): KnowledgeCapability {
  return Object.freeze({
    capabilityId: "knowledge-capability-example-001",
    capabilityKey: "platform_identity",
    label: "Platform Identity",
    description: "Example knowledge capability contract.",
    version: KNOWLEDGE_PLATFORM_CONTRACT_VERSION,
    metadata: resolveKnowledgeMetadataExample(timestamp),
    readOnly: true as const,
  });
}

export function resolveKnowledgeNamespaceExample(timestamp: string): KnowledgeNamespace {
  return Object.freeze({
    namespaceId: "knowledge-namespace-example-001",
    namespaceKey: "knowledge-foundation",
    label: "Knowledge Foundation Namespace",
    description: "Example knowledge namespace contract.",
    version: KNOWLEDGE_PLATFORM_CONTRACT_VERSION,
    metadata: resolveKnowledgeMetadataExample(timestamp),
    readOnly: true as const,
  });
}

export function resolveKnowledgeExtensionPointExample(timestamp: string): KnowledgeExtensionPoint {
  return Object.freeze({
    extensionPointId: "knowledge-extension-example-001",
    extensionPointKey: "business_ontology",
    label: "Business Ontology",
    description: "Reserved extension point example.",
    phaseKey: "business_ontology",
    version: KNOWLEDGE_PLATFORM_CONTRACT_VERSION,
    metadata: resolveKnowledgeMetadataExample(timestamp),
    readOnly: true as const,
  });
}

export function resolveKnowledgeRegistrationExample(timestamp: string): KnowledgeRegistration {
  return Object.freeze({
    registrationId: "knowledge-registration-example-001",
    registryType: "domain",
    label: "Domain Registration Example",
    description: "Example knowledge registration contract.",
    version: KNOWLEDGE_PLATFORM_CONTRACT_VERSION,
    registeredAt: timestamp,
    readOnly: true as const,
  });
}

export function getKnowledgeManifest(timestamp: string = new Date(0).toISOString()): KnowledgePlatformManifest {
  return Object.freeze({
    platformId: KNOWLEDGE_PLATFORM_ID,
    platformName: KNOWLEDGE_PLATFORM_NAME,
    layerId: "KNL",
    contractVersion: KNOWLEDGE_PLATFORM_CONTRACT_VERSION,
    architectureVersion: KNOWLEDGE_PLATFORM_ARCHITECTURE_VERSION,
    supportedDomains: KNOWLEDGE_DOMAIN_KEYS,
    supportedCapabilities: KNOWLEDGE_CAPABILITY_KEYS,
    supportedNamespaces: KNOWLEDGE_NAMESPACE_KEYS,
    extensionPoints: KNOWLEDGE_EXTENSION_POINT_KEYS,
    publicApis: KNOWLEDGE_PUBLIC_API_REGISTRY,
    principles: KNOWLEDGE_PLATFORM_PRINCIPLES,
    mustNotOwn: KNOWLEDGE_MUST_NOT_OWN,
    futurePhases: KNOWLEDGE_FUTURE_PHASE_KEYS,
    dependencyRules: Object.freeze(
      KNOWLEDGE_FUTURE_DEPENDENCY_RULES.map((entry) =>
        Object.freeze({ ...entry, readOnly: true as const })
      )
    ),
    generatedAt: timestamp,
    readOnly: true as const,
  });
}

export function validateKnowledgeFoundation(
  timestamp: string = new Date(0).toISOString()
): KnowledgePlatformValidationReport {
  const issues: KnowledgeValidationResult["issues"][number][] = [];

  const identityValidation = validatePlatformIdentity(KNOWLEDGE_PLATFORM_IDENTITY);
  if (!identityValidation.valid) {
    issues.push(...identityValidation.issues);
  }

  const manifestValidation = validateStageManifest(KNOWLEDGE_PLATFORM_SELF_MANIFEST);
  if (!manifestValidation.valid) {
    for (const entry of manifestValidation.issues) {
      issues.push(
        Object.freeze({ code: entry.code, message: entry.message, readOnly: true as const })
      );
    }
  }

  const versionValidation = validateKnowledgeVersionFormat(KNOWLEDGE_PLATFORM_CONTRACT_VERSION);
  if (!versionValidation.valid) {
    issues.push(...versionValidation.issues);
  }

  const dependencyValidation = validateDependencyDeclarations(
    Object.freeze({ "KNL/1": KNOWLEDGE_PLATFORM_CONTRACT_VERSION })
  );
  if (!dependencyValidation.valid) {
    issues.push(...dependencyValidation.issues);
  }

  if (!isKnowledgePlatformInitialized()) {
    buildKnowledgeFoundation(timestamp);
  }

  const snapshot = getKnowledgeRegistrySnapshot();
  if (snapshot.domainCount < KNOWLEDGE_DOMAIN_KEYS.length) {
    issues.push(
      Object.freeze({
        code: "registry_empty",
        message: "Knowledge domain registry must contain seeded defaults.",
        readOnly: true as const,
      })
    );
  }

  return Object.freeze({
    valid: issues.length === 0,
    foundationInitialized: isKnowledgePlatformInitialized(),
    registryValid: snapshot.domainCount > 0 && snapshot.capabilityCount > 0,
    identityValid: identityValidation.valid,
    issues: Object.freeze(issues),
    readOnly: true as const,
  });
}

export const KnowledgePlatformContract = Object.freeze({
  KNOWLEDGE_PLATFORM_IDENTITY,
  KNOWLEDGE_PUBLIC_API_RULES,
  KNOWLEDGE_FREEZE_RULES,
  KNOWLEDGE_PLATFORM_SELF_MANIFEST,
  getKnowledgeManifest,
  validateKnowledgeFoundation,
  resolveKnowledgeDomainExample,
  resolveKnowledgePackageExample,
  resolveKnowledgeProviderExample,
  version: KNOWLEDGE_PLATFORM_CONTRACT_VERSION,
  releaseMetadata: KNOWLEDGE_RELEASE_METADATA,
});
