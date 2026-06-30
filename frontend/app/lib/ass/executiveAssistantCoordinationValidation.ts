/**
 * ASS-8 — Executive Assistant Coordination Manifest validation.
 */

import {
  ASS_CERTIFIED_PHASE_DEPENDENCIES,
  ASS_CERTIFIED_PHASE_KEYS,
  ASS_CERTIFIED_PHASE_MANDATORY_FIELDS,
  ASS_COMPATIBILITY_MATRIX_MANDATORY_FIELDS,
  ASS_COORDINATION_COMPATIBLE_VERSIONS,
  ASS_COORDINATION_IDENTITY_MANDATORY_FIELDS,
  ASS_COORDINATION_MUST_NOT_OWN,
  ASS_COORDINATION_PRINCIPLES,
  ASS_COORDINATION_REGISTRY_KEYS,
  ASS_COORDINATION_VERSION,
  ASS_PHASE_MANIFEST_REFERENCES,
  ASS_PHASE_REFERENCE_KEYS,
  ASS_PHASE_REFERENCE_MANDATORY_FIELDS,
  ASS_PHASE_REFERENCE_PHASE_MAP,
  ASS_PLATFORM_COORDINATION_MANIFEST_MANDATORY_FIELDS,
} from "./executiveAssistantCoordinationContracts.ts";
import type {
  ExecutiveAssistantCoordinationManifest,
  ExecutiveAssistantCoordinationRegistryBundle,
  ExecutiveAssistantCoordinationValidationIssue,
  ExecutiveAssistantCoordinationValidationReport,
} from "./executiveAssistantCoordinationTypes.ts";
import { getExecutiveAssistantCompatibilityMatrix } from "./executiveAssistantCoordinationRegistry.ts";

function issue(code: string, message: string, field?: string): ExecutiveAssistantCoordinationValidationIssue {
  return Object.freeze({ code, message, field, readOnly: true as const });
}

function report(issues: ExecutiveAssistantCoordinationValidationIssue[]): ExecutiveAssistantCoordinationValidationReport {
  return Object.freeze({ valid: issues.length === 0, issues: Object.freeze(issues), readOnly: true as const });
}

export function validateCertifiedAssPhasesRegistered(
  registry: ExecutiveAssistantCoordinationRegistryBundle
): ExecutiveAssistantCoordinationValidationReport {
  const issues: ExecutiveAssistantCoordinationValidationIssue[] = [];
  const registered = new Set(registry.certifiedAssPhaseRegistry.map((entry) => entry.phaseKey));
  for (const phaseKey of ASS_CERTIFIED_PHASE_KEYS) {
    if (!registered.has(phaseKey)) {
      issues.push(issue("missing_phase", `Missing certified phase: ${phaseKey}.`));
    }
  }
  if (registry.certifiedPhaseCount !== ASS_CERTIFIED_PHASE_KEYS.length) {
    issues.push(issue("phase_count_mismatch", "Certified phase registry count mismatch."));
  }
  return report(issues);
}

export function validateDependencyOrderValid(
  registry: ExecutiveAssistantCoordinationRegistryBundle
): ExecutiveAssistantCoordinationValidationReport {
  const issues: ExecutiveAssistantCoordinationValidationIssue[] = [];
  for (const phase of registry.certifiedAssPhaseRegistry) {
    const expected = ASS_CERTIFIED_PHASE_DEPENDENCIES[phase.phaseKey as keyof typeof ASS_CERTIFIED_PHASE_DEPENDENCIES];
    if (phase.dependencyKey !== expected) {
      issues.push(issue("dependency_mismatch", `Phase ${phase.phaseKey} dependency mismatch.`));
    }
    if (expected && !registry.certifiedAssPhaseRegistry.some((entry) => entry.phaseKey === expected)) {
      issues.push(issue("missing_dependency", `Phase ${phase.phaseKey} missing dependency ${expected}.`));
    }
  }
  for (let index = 1; index < ASS_CERTIFIED_PHASE_KEYS.length; index += 1) {
    const current = ASS_CERTIFIED_PHASE_KEYS[index];
    const previous = ASS_CERTIFIED_PHASE_KEYS[index - 1];
    const currentPhase = registry.certifiedAssPhaseRegistry.find((entry) => entry.phaseKey === current);
    if (currentPhase?.dependencyKey !== previous) {
      issues.push(issue("invalid_dependency_order", `Phase ${current} must depend on ${previous}.`));
    }
  }
  return report(issues);
}

export function validateCrossPhaseReferencesValid(
  registry: ExecutiveAssistantCoordinationRegistryBundle
): ExecutiveAssistantCoordinationValidationReport {
  const issues: ExecutiveAssistantCoordinationValidationIssue[] = [];
  const referenceBundles = [
    { key: "conversation_contract_reference", count: registry.conversationContractReferenceCount, entries: registry.conversationContractReferenceRegistry },
    { key: "state_architecture_reference", count: registry.stateArchitectureReferenceCount, entries: registry.stateArchitectureReferenceRegistry },
    { key: "routing_architecture_reference", count: registry.routingArchitectureReferenceCount, entries: registry.routingArchitectureReferenceRegistry },
    { key: "intent_contract_reference", count: registry.intentContractReferenceCount, entries: registry.intentContractReferenceRegistry },
    { key: "response_contract_reference", count: registry.responseContractReferenceCount, entries: registry.responseContractReferenceRegistry },
    { key: "clarification_contract_reference", count: registry.clarificationContractReferenceCount, entries: registry.clarificationContractReferenceRegistry },
  ] as const;
  if (referenceBundles.some((bundle) => bundle.count !== 1)) {
    issues.push(issue("reference_count_invalid", "Phase reference registries must contain exactly one entry each."));
  }
  for (const referenceKey of ASS_PHASE_REFERENCE_KEYS) {
    const expectedPhase = ASS_PHASE_REFERENCE_PHASE_MAP[referenceKey];
    const expectedManifest = ASS_PHASE_MANIFEST_REFERENCES[expectedPhase];
    const bundle = referenceBundles.find((entry) => entry.key === referenceKey);
    const reference = bundle?.entries[0];
    if (!reference) {
      issues.push(issue("missing_reference", `Missing reference for ${referenceKey}.`));
      continue;
    }
    if (reference.phaseKey !== expectedPhase) {
      issues.push(issue("reference_phase_mismatch", `Reference ${referenceKey} phase mismatch.`));
    }
    if (reference.manifestId !== expectedManifest.manifestId) {
      issues.push(issue("reference_manifest_mismatch", `Reference ${referenceKey} manifest mismatch.`));
    }
    if (reference.platformId !== expectedManifest.platformId) {
      issues.push(issue("reference_platform_mismatch", `Reference ${referenceKey} platform mismatch.`));
    }
  }
  return report(issues);
}

export function validateCompatibilityMatrixComplete(
  registry: ExecutiveAssistantCoordinationRegistryBundle
): ExecutiveAssistantCoordinationValidationReport {
  const issues: ExecutiveAssistantCoordinationValidationIssue[] = [];
  const expectedCount = (ASS_CERTIFIED_PHASE_KEYS.length * (ASS_CERTIFIED_PHASE_KEYS.length + 1)) / 2;
  if (registry.compatibilityEntryCount !== expectedCount) {
    issues.push(issue("compatibility_count_mismatch", "Compatibility matrix entry count mismatch."));
  }
  for (const fromPhaseKey of ASS_CERTIFIED_PHASE_KEYS) {
    for (const toPhaseKey of ASS_CERTIFIED_PHASE_KEYS) {
      const fromIndex = ASS_CERTIFIED_PHASE_KEYS.indexOf(fromPhaseKey);
      const toIndex = ASS_CERTIFIED_PHASE_KEYS.indexOf(toPhaseKey);
      if (fromIndex > toIndex) {
        continue;
      }
      const entry = registry.crossPhaseCompatibilityMatrixRegistry.find(
        (candidate) => candidate.fromPhaseKey === fromPhaseKey && candidate.toPhaseKey === toPhaseKey
      );
      if (!entry) {
        issues.push(issue("missing_compatibility", `Missing compatibility entry ${fromPhaseKey} -> ${toPhaseKey}.`));
      } else if (entry.compatible !== true) {
        issues.push(issue("incompatible_entry", `Compatibility entry ${fromPhaseKey} -> ${toPhaseKey} must be compatible.`));
      }
    }
  }
  const matrix = getExecutiveAssistantCompatibilityMatrix();
  if (matrix.length !== registry.compatibilityEntryCount) {
    issues.push(issue("matrix_export_mismatch", "Exported compatibility matrix mismatch."));
  }
  return report(issues);
}

export function validateFrozenImmutableCoordinationRecords(
  registry: ExecutiveAssistantCoordinationRegistryBundle
): ExecutiveAssistantCoordinationValidationReport {
  const issues: ExecutiveAssistantCoordinationValidationIssue[] = [];
  const checkMandatory = (
    records: readonly Record<string, unknown>[],
    mandatoryFields: readonly string[],
    label: string
  ) => {
    for (const record of records) {
      if (!Object.isFrozen(record)) {
        issues.push(issue("mutable_record", `${label} record is not frozen.`));
      }
      for (const field of mandatoryFields) {
        if (!(field in record)) {
          issues.push(issue("missing_field", `${label} missing field ${field}.`, field));
        }
      }
    }
  };
  checkMandatory(registry.assistantCoordinationIdentityRegistry, ASS_COORDINATION_IDENTITY_MANDATORY_FIELDS, "Coordination identity");
  checkMandatory(registry.certifiedAssPhaseRegistry, ASS_CERTIFIED_PHASE_MANDATORY_FIELDS, "Certified phase");
  const allReferences = [
    ...registry.conversationContractReferenceRegistry,
    ...registry.stateArchitectureReferenceRegistry,
    ...registry.routingArchitectureReferenceRegistry,
    ...registry.intentContractReferenceRegistry,
    ...registry.responseContractReferenceRegistry,
    ...registry.clarificationContractReferenceRegistry,
  ];
  checkMandatory(allReferences, ASS_PHASE_REFERENCE_MANDATORY_FIELDS, "Phase reference");
  checkMandatory(registry.crossPhaseCompatibilityMatrixRegistry, ASS_COMPATIBILITY_MATRIX_MANDATORY_FIELDS, "Compatibility matrix");
  checkMandatory(registry.platformCoordinationManifestRegistry, ASS_PLATFORM_COORDINATION_MANIFEST_MANDATORY_FIELDS, "Platform coordination manifest");
  return report(issues);
}

export function validateNoCoordinationRuntimeOwnership(): ExecutiveAssistantCoordinationValidationReport {
  const issues: ExecutiveAssistantCoordinationValidationIssue[] = [];
  for (const principle of [
    "coordination_metadata_aggregation_only",
    "no_runtime_coordination_no_assistant_execution",
    "read_only_references_to_certified_phases",
  ] as const) {
    if (!(ASS_COORDINATION_PRINCIPLES as readonly string[]).includes(principle)) {
      issues.push(issue("runtime_principle_missing", `Missing principle: ${principle}.`));
    }
  }
  for (const forbidden of ["runtime_coordination", "assistant_execution", "chat_runtime"] as const) {
    if (!ASS_COORDINATION_MUST_NOT_OWN.includes(forbidden)) {
      issues.push(issue("runtime_boundary_missing", `Must not own ${forbidden}.`));
    }
  }
  return report(issues);
}

export function validateExecutiveAssistantCoordinationManifestRecord(
  manifest: ExecutiveAssistantCoordinationManifest
): ExecutiveAssistantCoordinationValidationReport {
  const issues: ExecutiveAssistantCoordinationValidationIssue[] = [];
  if (manifest.version !== ASS_COORDINATION_VERSION) {
    issues.push(issue("manifest_version_mismatch", "Manifest version must be ASS/8."));
  }
  if (manifest.registryKeys.length !== ASS_COORDINATION_REGISTRY_KEYS.length) {
    issues.push(issue("manifest_registry_keys", "Manifest registry keys are incomplete."));
  }
  for (const version of ASS_COORDINATION_COMPATIBLE_VERSIONS) {
    if (!(manifest.compatibility as readonly string[]).includes(version)) {
      issues.push(issue("manifest_compatibility", `Manifest missing compatibility for ${version}.`));
    }
  }
  if (manifest.certifiedPhaseCount !== ASS_CERTIFIED_PHASE_KEYS.length) {
    issues.push(issue("manifest_phase_count", "Manifest certified phase count mismatch."));
  }
  return report(issues);
}

export function validateExecutiveAssistantCoordinationRegistry(
  registry: ExecutiveAssistantCoordinationRegistryBundle
): ExecutiveAssistantCoordinationValidationReport {
  const issues: ExecutiveAssistantCoordinationValidationIssue[] = [];
  for (const validation of [
    validateCertifiedAssPhasesRegistered(registry),
    validateDependencyOrderValid(registry),
    validateCrossPhaseReferencesValid(registry),
    validateCompatibilityMatrixComplete(registry),
    validateFrozenImmutableCoordinationRecords(registry),
    validateNoCoordinationRuntimeOwnership(),
  ]) {
    issues.push(...validation.issues);
  }
  if (registry.coordinationIdentityCount !== 1) {
    issues.push(issue("identity_count_invalid", "Coordination identity registry must contain one entry."));
  }
  if (registry.platformCoordinationManifestCount !== 1) {
    issues.push(issue("manifest_count_invalid", "Platform coordination manifest registry must contain one entry."));
  }
  return report(issues);
}

export function getDefaultCoordinationCompatibility(): readonly string[] {
  return Object.freeze([...ASS_COORDINATION_COMPATIBLE_VERSIONS, ASS_COORDINATION_VERSION]);
}
