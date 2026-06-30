/**
 * SMM-2 — Domain contract metadata validation (no business or inference logic).
 */

import { SMM_EXTENSION_POINT_KEYS, SMM_PLATFORM_CONTRACT_VERSION } from "./smmPlatformContracts.ts";
import {
  SMM_DOMAIN_COMPATIBLE_VERSIONS,
  SMM_DOMAIN_CONTRACT_VERSION,
  SMM_DOMAIN_FOUNDATION_DEPENDENCY,
  SMM_DOMAIN_MODEL_KEYS,
  SMM_DOMAIN_VERSION_PATTERN,
} from "./sharedMentalModelContracts.ts";
import type {
  SharedMentalModelContractRegistry,
  SharedMentalModelDomainRegistration,
  SharedMentalModelValidationIssue,
  SharedMentalModelValidationReport,
  SharedModelMetadata,
} from "./sharedMentalModelTypes.ts";

function issue(code: string, message: string, field?: string): SharedMentalModelValidationIssue {
  return Object.freeze({ code, message, field, readOnly: true as const });
}

function report(issues: SharedMentalModelValidationIssue[]): SharedMentalModelValidationReport {
  return Object.freeze({ valid: issues.length === 0, issues: Object.freeze(issues), readOnly: true as const });
}

export function validateSharedMentalModelVersionFormat(version: string): boolean {
  return SMM_DOMAIN_VERSION_PATTERN.test(version);
}

export function validateSharedModelMetadata(metadata: SharedModelMetadata): SharedMentalModelValidationReport {
  const issues: SharedMentalModelValidationIssue[] = [];
  if (!metadata.metadataId.trim()) {
    issues.push(issue("missing_metadata_id", "Metadata ID is required.", "metadataId"));
  }
  if (metadata.contractVersion !== SMM_DOMAIN_CONTRACT_VERSION) {
    issues.push(issue("metadata_version_mismatch", "Metadata contract version must be SMM/2.", "contractVersion"));
  }
  if (metadata.foundationVersion !== SMM_DOMAIN_FOUNDATION_DEPENDENCY) {
    issues.push(issue("foundation_version_mismatch", "Metadata foundation version must be SMM/1.", "foundationVersion"));
  }
  if (!metadata.createdAt.trim()) {
    issues.push(issue("missing_created_at", "Created timestamp is required.", "createdAt"));
  }
  return report(issues);
}

export function validateDomainRegistrationCompleteness(
  registration: SharedMentalModelDomainRegistration
): SharedMentalModelValidationReport {
  const issues: SharedMentalModelValidationIssue[] = [];
  if (!registration.domainId.trim()) {
    issues.push(issue("missing_domain_id", "Domain ID is required.", "domainId"));
  }
  if (registration.contractVersion !== SMM_DOMAIN_CONTRACT_VERSION) {
    issues.push(issue("domain_version_mismatch", "Domain contract version must be SMM/2."));
  }
  if (registration.mandatoryFields.length === 0) {
    issues.push(issue("missing_mandatory_fields", "Domain must declare mandatory fields."));
  }
  if (!registration.interfaceOnly) {
    issues.push(issue("not_interface_only", "Domain registration must be interface-only."));
  }
  return report(issues);
}

export function validateDomainIdentityUniqueness(
  registry: SharedMentalModelContractRegistry
): SharedMentalModelValidationReport {
  const domainIds = registry.domainRegistry.map((entry) => entry.domainId);
  const duplicates = domainIds.filter((id, index) => domainIds.indexOf(id) !== index);
  if (duplicates.length > 0) {
    return report([issue("duplicate_domain_id", `Duplicate domain IDs: ${duplicates[0]}`)]);
  }
  const domainKeys = registry.domainRegistry.map((entry) => entry.domainKey);
  if (domainKeys.length !== new Set(domainKeys).size) {
    return report([issue("duplicate_domain_key", "Domain keys must be unique.")]);
  }
  return report([]);
}

export function validateVersionCompatibility(
  registry: SharedMentalModelContractRegistry
): SharedMentalModelValidationReport {
  const issues: SharedMentalModelValidationIssue[] = [];
  for (const entry of registry.versionRegistry) {
    if (!(SMM_DOMAIN_COMPATIBLE_VERSIONS as readonly string[]).includes(entry.foundationVersion)) {
      issues.push(issue("incompatible_foundation", "Version entry foundation is incompatible."));
    }
    if (!(entry.compatibility as readonly string[]).includes(SMM_PLATFORM_CONTRACT_VERSION)) {
      issues.push(issue("missing_smm1_compatibility", "Version entry must declare SMM/1 compatibility."));
    }
  }
  return report(issues);
}

export function validateExtensionCompatibility(
  registry: SharedMentalModelContractRegistry
): SharedMentalModelValidationReport {
  const issues: SharedMentalModelValidationIssue[] = [];
  for (const entry of registry.extensionRegistry) {
    if (!(SMM_EXTENSION_POINT_KEYS as readonly string[]).includes(entry.extensionPointKey)) {
      issues.push(issue("invalid_extension_point", `Unknown extension point: ${entry.extensionPointKey}`));
    }
    if (!entry.compatible) {
      issues.push(issue("extension_incompatible", "Extension registration must be compatible."));
    }
  }
  return report(issues);
}

export function validateRegistryCompleteness(
  registry: SharedMentalModelContractRegistry
): SharedMentalModelValidationReport {
  const issues: SharedMentalModelValidationIssue[] = [];
  if (registry.domainCount !== SMM_DOMAIN_MODEL_KEYS.length) {
    issues.push(issue("incomplete_domain_registry", "Domain registry must include all domain models."));
  }
  if (registry.contractCount !== SMM_DOMAIN_MODEL_KEYS.length) {
    issues.push(issue("incomplete_contract_registry", "Contract registry must include all domain contracts."));
  }
  if (registry.versionCount === 0) {
    issues.push(issue("empty_version_registry", "Version registry must not be empty."));
  }
  if (registry.extensionCount === 0) {
    issues.push(issue("empty_extension_registry", "Extension registry must not be empty."));
  }
  return report(issues);
}

export function validateSharedMentalModelContractRegistry(
  registry: SharedMentalModelContractRegistry
): SharedMentalModelValidationReport {
  const issues: SharedMentalModelValidationIssue[] = [];
  for (const result of [
    validateRegistryCompleteness(registry),
    validateDomainIdentityUniqueness(registry),
    validateVersionCompatibility(registry),
    validateExtensionCompatibility(registry),
  ]) {
    issues.push(...result.issues);
  }
  for (const domain of registry.domainRegistry) {
    const domainValidation = validateDomainRegistrationCompleteness(domain);
    issues.push(...domainValidation.issues);
  }
  return report(issues);
}

export function getDefaultSharedMentalModelCompatibility(): readonly string[] {
  return Object.freeze([...SMM_DOMAIN_COMPATIBLE_VERSIONS, SMM_DOMAIN_CONTRACT_VERSION]);
}
