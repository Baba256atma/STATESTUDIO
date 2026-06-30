/**
 * KNL-14 — Knowledge Platform Certification domain types.
 */

import type {
  CERTIFICATION_DEPENDENCY_KEYS,
  CERTIFICATION_EXTENSION_POINT_KEYS,
  CERTIFICATION_GATE_KEYS,
  CERTIFICATION_NAMESPACE_KEYS,
  CERTIFICATION_SCOPE_KEYS,
  CERTIFICATION_STATUS_KEYS,
  KNL_CERTIFICATION_PHASE_KEYS,
  KNOWLEDGE_PLATFORM_CERTIFICATION_CONTRACT_VERSION,
  KNOWLEDGE_PLATFORM_CERTIFICATION_NAMESPACE,
} from "./knowledgePlatformCertificationCatalog.ts";

export type KnowledgePlatformCertificationIdentifier = string;
export type KnlCertificationPhaseKey = (typeof KNL_CERTIFICATION_PHASE_KEYS)[number];
export type CertificationScopeKey = (typeof CERTIFICATION_SCOPE_KEYS)[number];
export type CertificationStatusKey = (typeof CERTIFICATION_STATUS_KEYS)[number];
export type CertificationGateKey = (typeof CERTIFICATION_GATE_KEYS)[number];
export type CertificationNamespaceKey = (typeof CERTIFICATION_NAMESPACE_KEYS)[number];
export type CertificationDependencyKey = (typeof CERTIFICATION_DEPENDENCY_KEYS)[number];
export type CertificationExtensionPointKey = (typeof CERTIFICATION_EXTENSION_POINT_KEYS)[number];

export type CertificationMetadata = Readonly<{
  metadataId: KnowledgePlatformCertificationIdentifier;
  metadataVersion: typeof KNOWLEDGE_PLATFORM_CERTIFICATION_CONTRACT_VERSION;
  namespace: typeof KNOWLEDGE_PLATFORM_CERTIFICATION_NAMESPACE | string;
  owner: string;
  extensions: Readonly<Record<string, string>>;
  createdAt: string;
  readOnly: true;
}>;

export type CertificationNamespace = Readonly<{
  namespaceId: KnowledgePlatformCertificationIdentifier;
  namespaceKey: CertificationNamespaceKey;
  label: string;
  description: string;
  version: typeof KNOWLEDGE_PLATFORM_CERTIFICATION_CONTRACT_VERSION;
  metadata: CertificationMetadata;
  readOnly: true;
}>;

export type CertificationDependency = Readonly<{
  dependencyId: KnowledgePlatformCertificationIdentifier;
  dependencyKey: CertificationDependencyKey;
  label: string;
  description: string;
  version: typeof KNOWLEDGE_PLATFORM_CERTIFICATION_CONTRACT_VERSION;
  metadata: CertificationMetadata;
  readOnly: true;
}>;

export type CertificationScope = Readonly<{
  scopeId: KnowledgePlatformCertificationIdentifier;
  scopeKey: CertificationScopeKey;
  label: string;
  description: string;
  readOnly: true;
}>;

export type CertificationStatus = Readonly<{
  statusId: KnowledgePlatformCertificationIdentifier;
  statusKey: CertificationStatusKey;
  label: string;
  description: string;
  readOnly: true;
}>;

export type CertificationProfile = Readonly<{
  profileId: KnowledgePlatformCertificationIdentifier;
  phaseKey: KnlCertificationPhaseKey;
  phaseId: string;
  platformId: string;
  label: string;
  description: string;
  status: CertificationStatusKey;
  version: typeof KNOWLEDGE_PLATFORM_CERTIFICATION_CONTRACT_VERSION;
  metadata: CertificationMetadata;
  readOnly: true;
}>;

export type CertificationGate = Readonly<{
  gateId: KnowledgePlatformCertificationIdentifier;
  gateKey: CertificationGateKey;
  title: string;
  passed: boolean;
  evidence: string;
  readOnly: true;
}>;

export type CertificationCheck = Readonly<{
  checkId: KnowledgePlatformCertificationIdentifier;
  phaseKey: KnlCertificationPhaseKey;
  checkType: string;
  passed: boolean;
  message: string;
  readOnly: true;
}>;

export type CertificationEvidence = Readonly<{
  evidenceId: KnowledgePlatformCertificationIdentifier;
  phaseKey: KnlCertificationPhaseKey | "platform";
  label: string;
  value: string;
  readOnly: true;
}>;

export type CertificationResult = Readonly<{
  resultId: KnowledgePlatformCertificationIdentifier;
  phaseKey: KnlCertificationPhaseKey;
  phaseId: string;
  passed: boolean;
  summary: string;
  readOnly: true;
}>;

export type CertificationExtensionPoint = Readonly<{
  extensionPointId: KnowledgePlatformCertificationIdentifier;
  extensionPointKey: CertificationExtensionPointKey;
  label: string;
  description: string;
  version: typeof KNOWLEDGE_PLATFORM_CERTIFICATION_CONTRACT_VERSION;
  metadata: CertificationMetadata;
  readOnly: true;
}>;

export type CertificationManifest = Readonly<{
  platformId: typeof import("./knowledgePlatformCertificationCatalog.ts").KNOWLEDGE_PLATFORM_CERTIFICATION_PLATFORM_ID;
  platformName: typeof import("./knowledgePlatformCertificationCatalog.ts").KNOWLEDGE_PLATFORM_CERTIFICATION_PLATFORM_NAME;
  namespace: typeof KNOWLEDGE_PLATFORM_CERTIFICATION_NAMESPACE;
  contractVersion: typeof KNOWLEDGE_PLATFORM_CERTIFICATION_CONTRACT_VERSION;
  architectureVersion: typeof import("./knowledgePlatformCertificationCatalog.ts").KNOWLEDGE_PLATFORM_CERTIFICATION_ARCHITECTURE_VERSION;
  governanceDependency: "KNL/13";
  certifiedPhases: readonly KnlCertificationPhaseKey[];
  certificationScopes: readonly CertificationScopeKey[];
  certificationGates: readonly CertificationGateKey[];
  publicApis: readonly string[];
  principles: readonly string[];
  mustNotOwn: readonly string[];
  governanceRules: readonly Readonly<{ ruleId: string; description: string; enforced: true }>[];
  futurePhases: readonly string[];
  generatedAt: string;
  readOnly: true;
}>;

export type KnowledgePlatformCertificationIssue = Readonly<{
  code: string;
  message: string;
  field?: string;
  readOnly: true;
}>;

export type KnowledgePlatformCertificationValidationResult = Readonly<{
  valid: boolean;
  issues: readonly KnowledgePlatformCertificationIssue[];
  readOnly: true;
}>;

export type KnowledgePlatformCertificationRunResult = Readonly<{
  success: boolean;
  reason: string;
  passedGates: number;
  totalGates: number;
  passedPhases: number;
  totalPhases: number;
  readOnly: true;
}>;

export type KnowledgePlatformCertificationReport = Readonly<{
  reportId: KnowledgePlatformCertificationIdentifier;
  contractVersion: typeof KNOWLEDGE_PLATFORM_CERTIFICATION_CONTRACT_VERSION;
  valid: boolean;
  passed: boolean;
  passedGates: number;
  totalGates: number;
  passedPhases: number;
  totalPhases: number;
  profiles: readonly CertificationProfile[];
  gates: readonly CertificationGate[];
  checks: readonly CertificationCheck[];
  results: readonly CertificationResult[];
  evidence: readonly CertificationEvidence[];
  issues: readonly KnowledgePlatformCertificationIssue[];
  generatedAt: string;
  readOnly: true;
}>;

export type KnowledgePlatformCertificationPlatformValidationReport = Readonly<{
  valid: boolean;
  governanceValid: boolean;
  platformInitialized: boolean;
  certificationValid: boolean;
  identityValid: boolean;
  issues: readonly KnowledgePlatformCertificationIssue[];
  readOnly: true;
}>;
