/**
 * KNL-15 — Knowledge Platform Freeze validation.
 */

import {
  COMPATIBILITY_CONSUMER_KEYS,
  FREEZE_DEPENDENCY_KEYS,
  KNOWLEDGE_PLATFORM_FREEZE_CERTIFICATION_DEPENDENCY,
  KNOWLEDGE_PLATFORM_FREEZE_CONTRACT_VERSION,
  KNOWLEDGE_PLATFORM_FREEZE_MANDATORY_METADATA_FIELDS,
  KNOWLEDGE_PLATFORM_FREEZE_NAMESPACE,
  KNOWLEDGE_PLATFORM_FREEZE_NAMESPACE_PATTERN,
  KNOWLEDGE_PLATFORM_FREEZE_VERSION_PATTERN,
  KNOWLEDGE_PLATFORM_RELEASE_TAG_PATTERN,
  KNL_FROZEN_PHASE_KEYS,
} from "./knowledgePlatformFreezeCatalog.ts";
import { isCompatibilityMatrixComplete } from "./knowledgePlatformFreezeCompatibility.ts";
import { isFreezeManifestComplete } from "./knowledgePlatformFreezeManifest.ts";
import type {
  CompatibilityMatrix,
  FreezeManifest,
  FreezeMetadata,
  FreezeValidationIssue,
  FreezeValidationResult,
} from "./knowledgePlatformFreezeTypes.ts";
import { validateKnowledgePlatformCertification } from "./knowledgePlatformCertificationContracts.ts";
import { getKnowledgePlatformCertificationReport } from "./knowledgePlatformCertificationRunner.ts";

function issue(code: string, message: string, field?: string): FreezeValidationIssue {
  return Object.freeze({ code, message, field, readOnly: true as const });
}

function result(partial: Omit<FreezeValidationResult, "readOnly">): FreezeValidationResult {
  return Object.freeze({ ...partial, readOnly: true as const });
}

export function validateKnowledgePlatformFreezeVersionFormat(version: string): FreezeValidationResult {
  if (!KNOWLEDGE_PLATFORM_FREEZE_VERSION_PATTERN.test(version)) {
    return result({
      valid: false,
      certificationPassed: false,
      phasesComplete: false,
      manifestComplete: false,
      compatibilityComplete: false,
      releaseMetadataComplete: false,
      issues: Object.freeze([issue("invalid_version", "Version must match KNL/N format.", "version")]),
    });
  }
  return result({
    valid: true,
    certificationPassed: true,
    phasesComplete: true,
    manifestComplete: true,
    compatibilityComplete: true,
    releaseMetadataComplete: true,
    issues: Object.freeze([]),
  });
}

export function validateKnowledgePlatformFreezeNamespaceFormat(namespace: string): FreezeValidationResult {
  if (!KNOWLEDGE_PLATFORM_FREEZE_NAMESPACE_PATTERN.test(namespace)) {
    return result({
      valid: false,
      certificationPassed: false,
      phasesComplete: false,
      manifestComplete: false,
      compatibilityComplete: false,
      releaseMetadataComplete: false,
      issues: Object.freeze([issue("invalid_namespace", "Freeze namespace format is invalid.", "namespace")]),
    });
  }
  return result({
    valid: true,
    certificationPassed: true,
    phasesComplete: true,
    manifestComplete: true,
    compatibilityComplete: true,
    releaseMetadataComplete: true,
    issues: Object.freeze([]),
  });
}

export function validateReleaseTagFormat(releaseTag: string): FreezeValidationResult {
  if (!KNOWLEDGE_PLATFORM_RELEASE_TAG_PATTERN.test(releaseTag)) {
    return result({
      valid: false,
      certificationPassed: false,
      phasesComplete: false,
      manifestComplete: false,
      compatibilityComplete: false,
      releaseMetadataComplete: false,
      issues: Object.freeze([issue("invalid_release_tag", "Release tag format is invalid.", "releaseTag")]),
    });
  }
  return result({
    valid: true,
    certificationPassed: true,
    phasesComplete: true,
    manifestComplete: true,
    compatibilityComplete: true,
    releaseMetadataComplete: true,
    issues: Object.freeze([]),
  });
}

export function validateFreezeMetadataRecord(metadata: FreezeMetadata): FreezeValidationResult {
  const issues: FreezeValidationIssue[] = [];
  for (const field of KNOWLEDGE_PLATFORM_FREEZE_MANDATORY_METADATA_FIELDS) {
    if (!(field in metadata) || metadata[field as keyof FreezeMetadata] === undefined) {
      issues.push(issue("missing_metadata", `metadata.${field} is required.`, field));
    }
  }
  const namespaceValidation = validateKnowledgePlatformFreezeNamespaceFormat(metadata.namespace);
  if (!namespaceValidation.valid) issues.push(...namespaceValidation.issues);
  const versionValidation = validateKnowledgePlatformFreezeVersionFormat(metadata.metadataVersion);
  if (!versionValidation.valid) issues.push(...versionValidation.issues);
  return result({
    valid: issues.length === 0,
    certificationPassed: issues.length === 0,
    phasesComplete: issues.length === 0,
    manifestComplete: issues.length === 0,
    compatibilityComplete: issues.length === 0,
    releaseMetadataComplete: issues.length === 0,
    issues: Object.freeze(issues),
  });
}

export function validateFreezeDependencyChain(chain: readonly string[]): FreezeValidationResult {
  const issues: FreezeValidationIssue[] = [];
  if (chain.length !== FREEZE_DEPENDENCY_KEYS.length) {
    issues.push(issue("dependency_chain_incomplete", "Dependency chain must contain KNL/1 through KNL/14."));
  }
  for (const dependencyKey of FREEZE_DEPENDENCY_KEYS) {
    if (!chain.includes(dependencyKey)) {
      issues.push(issue("missing_dependency", `Missing dependency: ${dependencyKey}.`, "dependencyChain"));
    }
  }
  return result({
    valid: issues.length === 0,
    certificationPassed: true,
    phasesComplete: issues.length === 0,
    manifestComplete: issues.length === 0,
    compatibilityComplete: true,
    releaseMetadataComplete: true,
    issues: Object.freeze(issues),
  });
}

export function validateFrozenPhasesComplete(manifest: FreezeManifest): FreezeValidationResult {
  const issues: FreezeValidationIssue[] = [];
  if (manifest.certifiedPhases.length !== KNL_FROZEN_PHASE_KEYS.length) {
    issues.push(issue("phases_incomplete", "All certified phases must be present in freeze manifest."));
  }
  for (const phaseKey of KNL_FROZEN_PHASE_KEYS) {
    if (!manifest.certifiedPhases.some((entry) => entry.phaseKey === phaseKey)) {
      issues.push(issue("missing_phase", `Missing frozen phase: ${phaseKey}.`, "certifiedPhases"));
    }
  }
  return result({
    valid: issues.length === 0,
    certificationPassed: true,
    phasesComplete: issues.length === 0,
    manifestComplete: issues.length === 0,
    compatibilityComplete: true,
    releaseMetadataComplete: true,
    issues: Object.freeze(issues),
  });
}

export function validateCompatibilityMatrixComplete(matrix: CompatibilityMatrix): FreezeValidationResult {
  const complete = isCompatibilityMatrixComplete(matrix);
  return result({
    valid: complete,
    certificationPassed: true,
    phasesComplete: true,
    manifestComplete: true,
    compatibilityComplete: complete,
    releaseMetadataComplete: true,
    issues: complete
      ? Object.freeze([])
      : Object.freeze([
          issue(
            "compatibility_incomplete",
            `Compatibility matrix must contain all ${COMPATIBILITY_CONSUMER_KEYS.length} consumer layers.`
          ),
        ]),
  });
}

export function validateReleaseMetadataComplete(manifest: FreezeManifest): FreezeValidationResult {
  const issues: FreezeValidationIssue[] = [];
  if (!manifest.releaseMetadata.releaseVersion) {
    issues.push(issue("missing_release_version", "Release version is required.", "releaseVersion"));
  }
  if (!manifest.releaseMetadata.releaseTag) {
    issues.push(issue("missing_release_tag", "Release tag is required.", "releaseTag"));
  }
  if (!manifest.releaseMetadata.releaseDate) {
    issues.push(issue("missing_release_date", "Release date is required.", "releaseDate"));
  }
  if (manifest.releaseMetadata.status !== "released") {
    issues.push(issue("invalid_release_status", "Release status must be released.", "status"));
  }
  const tagValidation = validateReleaseTagFormat(manifest.releaseMetadata.releaseTag);
  if (!tagValidation.valid) issues.push(...tagValidation.issues);
  return result({
    valid: issues.length === 0,
    certificationPassed: true,
    phasesComplete: true,
    manifestComplete: true,
    compatibilityComplete: true,
    releaseMetadataComplete: issues.length === 0,
    issues: Object.freeze(issues),
  });
}

export function validateKnowledgePlatformCertificationPassed(timestamp: string): FreezeValidationResult {
  const certification = validateKnowledgePlatformCertification(timestamp);
  const report = getKnowledgePlatformCertificationReport();
  const passed = certification.valid && report?.passed === true;
  return result({
    valid: passed,
    certificationPassed: passed,
    phasesComplete: passed,
    manifestComplete: passed,
    compatibilityComplete: passed,
    releaseMetadataComplete: passed,
    issues: passed
      ? Object.freeze([])
      : Object.freeze([
          issue("certification_not_passed", "KNL/14 certification must pass before platform freeze."),
        ]),
  });
}

export function validateKnowledgePlatformFreezeManifest(manifest: FreezeManifest): FreezeValidationResult {
  const issues: FreezeValidationIssue[] = [];

  const phasesValidation = validateFrozenPhasesComplete(manifest);
  if (!phasesValidation.valid) issues.push(...phasesValidation.issues);

  const dependencyValidation = validateFreezeDependencyChain(manifest.dependencyChain);
  if (!dependencyValidation.valid) issues.push(...dependencyValidation.issues);

  const compatibilityValidation = validateCompatibilityMatrixComplete(manifest.compatibilityMatrix);
  if (!compatibilityValidation.valid) issues.push(...compatibilityValidation.issues);

  const releaseValidation = validateReleaseMetadataComplete(manifest);
  if (!releaseValidation.valid) issues.push(...releaseValidation.issues);

  if (!isFreezeManifestComplete(manifest)) {
    issues.push(issue("manifest_incomplete", "Freeze manifest is incomplete."));
  }

  return result({
    valid: issues.length === 0,
    certificationPassed: true,
    phasesComplete: phasesValidation.valid,
    manifestComplete: issues.length === 0,
    compatibilityComplete: compatibilityValidation.valid,
    releaseMetadataComplete: releaseValidation.valid,
    issues: Object.freeze(issues),
  });
}

export function validateKnowledgePlatformFreezeDependencyDeclarations(): FreezeValidationResult {
  const issues: FreezeValidationIssue[] = [];
  if (KNOWLEDGE_PLATFORM_FREEZE_CERTIFICATION_DEPENDENCY !== "KNL/14") {
    issues.push(issue("invalid_dependency", "Platform freeze must depend on KNL/14."));
  }
  return result({
    valid: issues.length === 0,
    certificationPassed: true,
    phasesComplete: true,
    manifestComplete: true,
    compatibilityComplete: true,
    releaseMetadataComplete: true,
    issues: Object.freeze(issues),
  });
}

export function validateKnowledgePlatformFreezeContractVersion(): FreezeValidationResult {
  return validateKnowledgePlatformFreezeVersionFormat(KNOWLEDGE_PLATFORM_FREEZE_CONTRACT_VERSION);
}

export function validateKnowledgePlatformFreezeCoreNamespace(): FreezeValidationResult {
  return validateKnowledgePlatformFreezeNamespaceFormat(KNOWLEDGE_PLATFORM_FREEZE_NAMESPACE);
}
