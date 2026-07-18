/**
 * DKL-1:4 — Validation Manifest.
 *
 * Builds the canonical frozen validation rule registry (in canonical domain
 * order) and the immutable validation manifest describing it.
 * Metadata only — no runtime behavior.
 */

import { DataKnowledgeFoundationFoundationValidation } from "./dataKnowledgeFoundationFoundationValidation.ts";
import { DataKnowledgeFoundationModelValidation } from "./dataKnowledgeFoundationModelValidation.ts";
import { DataKnowledgeFoundationOwnershipValidation } from "./dataKnowledgeFoundationOwnershipValidation.ts";
import { DataKnowledgeFoundationPublicApiValidation } from "./dataKnowledgeFoundationPublicApiValidation.ts";
import { DataKnowledgeFoundationRegistryValidation } from "./dataKnowledgeFoundationRegistryValidation.ts";
import type {
  ValidationManifestDescriptor,
  ValidationRuleDescriptor,
} from "./dataKnowledgeFoundationValidationTypes.ts";

export const DataKnowledgeFoundationValidationRules: readonly ValidationRuleDescriptor[] =
  Object.freeze([
    ...DataKnowledgeFoundationFoundationValidation.rules,
    ...DataKnowledgeFoundationRegistryValidation.rules,
    ...DataKnowledgeFoundationModelValidation.rules,
    ...DataKnowledgeFoundationOwnershipValidation.rules,
    ...DataKnowledgeFoundationPublicApiValidation.rules,
  ]);

const severityInventory = Object.freeze({
  ERROR: DataKnowledgeFoundationValidationRules.filter((rule) => rule.severity === "ERROR").length,
  WARNING: DataKnowledgeFoundationValidationRules.filter((rule) => rule.severity === "WARNING").length,
  INFO: DataKnowledgeFoundationValidationRules.filter((rule) => rule.severity === "INFO").length,
});

export const DataKnowledgeFoundationValidationManifest = Object.freeze({
  validationId: "DKL-1:4",
  name: "Data Knowledge Foundation Validation",
  namespace: "nexora.dkl.foundation.validation",
  version: "1.0.0",
  sourcePhases: Object.freeze(["DKL-1:1", "DKL-1:2", "DKL-1:3"] as const),
  validationDomains: Object.freeze([
    "foundation",
    "registry",
    "model",
    "ownership",
    "public-api",
  ] as const),
  ruleCount: DataKnowledgeFoundationValidationRules.length,
  ruleIds: Object.freeze(DataKnowledgeFoundationValidationRules.map((rule) => rule.id)),
  severityInventory,
  compatibility: Object.freeze({
    foundationCompatible: true,
    registryCompatible: true,
    modelCompatible: true,
    metadataOnly: true,
    runtimeFree: true,
    deterministic: true,
    ownershipProtected: true,
    publicApiStable: true,
  }),
  validationStatus: "VALIDATED",
  stability: "Stable",
  readiness: "ReadyForManifest",
  metadataOnly: true,
  immutable: true,
  deterministic: true,
} as const satisfies ValidationManifestDescriptor);
