/**
 * KNL-14 — Knowledge Platform Certification validation.
 */

import {
  CERTIFICATION_DEPENDENCY_KEYS,
  KNL_PHASE_CERTIFICATION_TARGETS,
  KNOWLEDGE_PLATFORM_CERTIFICATION_CONTRACT_VERSION,
  KNOWLEDGE_PLATFORM_CERTIFICATION_GOVERNANCE_DEPENDENCY,
  KNOWLEDGE_PLATFORM_CERTIFICATION_MANDATORY_METADATA_FIELDS,
  KNOWLEDGE_PLATFORM_CERTIFICATION_NAMESPACE,
  KNOWLEDGE_PLATFORM_CERTIFICATION_NAMESPACE_PATTERN,
  KNOWLEDGE_PLATFORM_CERTIFICATION_VERSION_PATTERN,
} from "./knowledgePlatformCertificationCatalog.ts";
import type {
  CertificationMetadata,
  KnowledgePlatformCertificationIssue,
  KnowledgePlatformCertificationValidationResult,
} from "./knowledgePlatformCertificationTypes.ts";
import { validateKnowledgeGovernancePlatform } from "./knowledgeGovernanceContracts.ts";
import { isKnowledgeGovernancePlatformInitialized } from "./knowledgeGovernanceRegistry.ts";

function issue(code: string, message: string, field?: string): KnowledgePlatformCertificationIssue {
  return Object.freeze({ code, message, field, readOnly: true as const });
}

function result(issues: KnowledgePlatformCertificationIssue[]): KnowledgePlatformCertificationValidationResult {
  return Object.freeze({ valid: issues.length === 0, issues: Object.freeze(issues), readOnly: true as const });
}

export function hasDuplicateProfileIds(ids: readonly string[]): boolean {
  return new Set(ids).size !== ids.length;
}

export function hasDuplicateGateKeys(keys: readonly string[]): boolean {
  return new Set(keys).size !== keys.length;
}

export function validateKnowledgePlatformCertificationVersionFormat(
  version: string
): KnowledgePlatformCertificationValidationResult {
  if (!KNOWLEDGE_PLATFORM_CERTIFICATION_VERSION_PATTERN.test(version)) {
    return result([issue("invalid_version", "Version must match KNL/N format.", "version")]);
  }
  return result([]);
}

export function validateKnowledgePlatformCertificationNamespaceFormat(
  namespace: string
): KnowledgePlatformCertificationValidationResult {
  if (!KNOWLEDGE_PLATFORM_CERTIFICATION_NAMESPACE_PATTERN.test(namespace)) {
    return result([issue("invalid_namespace", "Certification namespace format is invalid.", "namespace")]);
  }
  return result([]);
}

export function validateCertificationMetadataRecord(metadata: CertificationMetadata): KnowledgePlatformCertificationValidationResult {
  const issues: KnowledgePlatformCertificationIssue[] = [];
  for (const field of KNOWLEDGE_PLATFORM_CERTIFICATION_MANDATORY_METADATA_FIELDS) {
    if (!(field in metadata) || metadata[field as keyof CertificationMetadata] === undefined) {
      issues.push(issue("missing_metadata", `metadata.${field} is required.`, field));
    }
  }
  const namespaceValidation = validateKnowledgePlatformCertificationNamespaceFormat(metadata.namespace);
  if (!namespaceValidation.valid) issues.push(...namespaceValidation.issues);
  const versionValidation = validateKnowledgePlatformCertificationVersionFormat(metadata.metadataVersion);
  if (!versionValidation.valid) issues.push(...versionValidation.issues);
  return result(issues);
}

export function validatePhasePlatformReference(
  phaseKey: string,
  platformId: string
): KnowledgePlatformCertificationValidationResult {
  const target = KNL_PHASE_CERTIFICATION_TARGETS.find((entry) => entry.key === phaseKey);
  if (!target) {
    return result([issue("invalid_phase", "Invalid certification phase key.", "phaseKey")]);
  }
  if (platformId !== target.platformId) {
    return result([
      issue("invalid_platform_reference", `Platform id must be ${target.platformId} for ${phaseKey}.`, "platformId"),
    ]);
  }
  return result([]);
}

export function validatePhaseVersionReference(
  phaseKey: string,
  phaseId: string
): KnowledgePlatformCertificationValidationResult {
  const target = KNL_PHASE_CERTIFICATION_TARGETS.find((entry) => entry.key === phaseKey);
  if (!target) {
    return result([issue("invalid_phase", "Invalid certification phase key.", "phaseKey")]);
  }
  if (phaseId !== target.phaseId) {
    return result([
      issue("invalid_version_reference", `Phase id must be ${target.phaseId} for ${phaseKey}.`, "phaseId"),
    ]);
  }
  return result([]);
}

export function validateCertificationDependencyReference(
  dependencyKey: string
): KnowledgePlatformCertificationValidationResult {
  if (!(CERTIFICATION_DEPENDENCY_KEYS as readonly string[]).includes(dependencyKey)) {
    return result([issue("invalid_dependency_reference", `Invalid dependency reference: ${dependencyKey}.`, "dependencyKey")]);
  }
  return result([]);
}

export function validateKnowledgePlatformCertificationDependencyDeclarations(): KnowledgePlatformCertificationValidationResult {
  const issues: KnowledgePlatformCertificationIssue[] = [];
  if (KNOWLEDGE_PLATFORM_CERTIFICATION_GOVERNANCE_DEPENDENCY !== "KNL/13") {
    issues.push(issue("invalid_dependency", "Platform certification must depend on KNL/13."));
  }
  return result(issues);
}

export function validateKnowledgeGovernancePlatformDependency(timestamp: string): KnowledgePlatformCertificationValidationResult {
  const issues: KnowledgePlatformCertificationIssue[] = [];
  if (!isKnowledgeGovernancePlatformInitialized()) {
    issues.push(issue("governance_not_initialized", "KNL/13 Knowledge Governance Platform is not initialized."));
  }
  const report = validateKnowledgeGovernancePlatform(timestamp);
  if (!report.valid) {
    for (const entry of report.issues) issues.push(issue("governance_invalid", entry.message));
  }
  return result(issues);
}

export function validateKnowledgePlatformCertificationContractVersion(): KnowledgePlatformCertificationValidationResult {
  return validateKnowledgePlatformCertificationVersionFormat(KNOWLEDGE_PLATFORM_CERTIFICATION_CONTRACT_VERSION);
}

export function validateKnowledgePlatformCertificationCoreNamespace(): KnowledgePlatformCertificationValidationResult {
  return validateKnowledgePlatformCertificationNamespaceFormat(KNOWLEDGE_PLATFORM_CERTIFICATION_NAMESPACE);
}
