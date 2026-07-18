/**
 * DKL-5:5 — Knowledge Validation Manifest Readiness.
 *
 * Deterministic readiness gates for Platform composition. Pure metadata checks
 * over approved public phase exports. No execution, no side effects.
 *
 * Ownership: owned exclusively by DKL-5:5.
 */

import { KnowledgeValidationFoundation } from "./knowledgeValidationFoundation.ts";
import { KnowledgeValidationRegistry } from "./knowledgeValidationRegistry.ts";
import { KnowledgeValidationModel } from "./knowledgeValidationModel.ts";
import { KnowledgeValidationValidation } from "./knowledgeValidationValidation.ts";
import { KnowledgeValidationManifestInventory } from "./knowledgeValidationManifestInventory.ts";
import { KnowledgeValidationManifestDependencies } from "./knowledgeValidationManifestDependencies.ts";
import type {
  ManifestReadinessDescriptor,
  ManifestReadinessGate,
} from "./knowledgeValidationManifestTypes.ts";

const gate = (
  gateId: string,
  description: string,
  passed: boolean,
): ManifestReadinessGate =>
  Object.freeze({ gateId, description, passed });

const inventory = KnowledgeValidationManifestInventory;

const countsConsistent =
  inventory.foundation.validationTargetCount ===
    inventory.registry.targetEntryCount &&
  inventory.foundation.validationDimensionCount ===
    inventory.registry.dimensionEntryCount &&
  inventory.foundation.qualitySignalCount ===
    inventory.registry.qualitySignalEntryCount &&
  inventory.foundation.outcomeCount === inventory.registry.outcomeEntryCount &&
  inventory.foundation.severityCount === inventory.registry.severityEntryCount &&
  inventory.model.canonicalModelCount === 30 &&
  inventory.model.modelRelationshipCount === 14 &&
  inventory.validation.ruleCount === inventory.validation.ruleResultCount;

const GATES: readonly ManifestReadinessGate[] = Object.freeze([
  gate(
    "gate-foundation-complete",
    "Foundation is FoundationComplete.",
    KnowledgeValidationFoundation.identity.status === "FoundationComplete",
  ),
  gate(
    "gate-foundation-ready-for-registry",
    "Foundation is ReadyForRegistry.",
    KnowledgeValidationFoundation.identity.readiness === "ReadyForRegistry",
  ),
  gate(
    "gate-registry-complete",
    "Registry is RegistryComplete.",
    KnowledgeValidationRegistry.identity.status === "RegistryComplete",
  ),
  gate(
    "gate-registry-ready-for-model",
    "Registry is ReadyForModel.",
    KnowledgeValidationRegistry.identity.readiness === "ReadyForModel",
  ),
  gate(
    "gate-model-complete",
    "Model is ModelComplete.",
    KnowledgeValidationModel.identity.status === "ModelComplete",
  ),
  gate(
    "gate-model-ready-for-validation",
    "Model is ReadyForValidation.",
    KnowledgeValidationModel.identity.readiness === "ReadyForValidation",
  ),
  gate(
    "gate-validation-complete",
    "Validation is ValidationComplete.",
    KnowledgeValidationValidation.identity.status === "ValidationComplete",
  ),
  gate(
    "gate-validation-overall-pass",
    "Validation overall result is Pass.",
    KnowledgeValidationValidation.result.overallStatus === "Pass",
  ),
  gate(
    "gate-validation-ready-for-manifest",
    "Validation is ReadyForManifest.",
    KnowledgeValidationValidation.identity.readiness === "ReadyForManifest",
  ),
  gate(
    "gate-inventories-exist",
    "All required inventories exist.",
    inventory.foundation !== undefined &&
      inventory.registry !== undefined &&
      inventory.model !== undefined &&
      inventory.validation !== undefined &&
      inventory.sectionOrder.length === 12,
  ),
  gate(
    "gate-counts-consistent",
    "All counts are internally consistent.",
    countsConsistent,
  ),
  gate(
    "gate-no-ownership-conflicts",
    "Ownership conflicts are absent.",
    inventory.ownershipSummary.noDuplicateArchitecturalOwnership === true &&
      inventory.ownershipSummary.noOwnershipTransfer === true,
  ),
  gate(
    "gate-no-dependency-violations",
    "Dependency violations are absent.",
    KnowledgeValidationManifestDependencies.publicEntryPointOnly === true &&
      KnowledgeValidationManifestDependencies.noInternalPriorPhaseImports ===
        true &&
      KnowledgeValidationManifestDependencies.noDirectDkl4Dependency === true &&
      KnowledgeValidationManifestDependencies.noFuturePhases === true &&
      KnowledgeValidationManifestDependencies.noCircularDependencies === true,
  ),
  gate(
    "gate-runtime-prohibitions-active",
    "Runtime prohibitions remain active.",
    inventory.boundarySummary.runtimeValidationForbidden === true &&
      inventory.boundarySummary.scoringForbidden === true &&
      inventory.boundarySummary.trustCalculationForbidden === true &&
      inventory.boundarySummary.cleansingForbidden === true &&
      inventory.boundarySummary.remediationForbidden === true &&
      inventory.boundarySummary.persistenceForbidden === true &&
      inventory.boundarySummary.aiForbidden === true,
  ),
  gate(
    "gate-manifest-metadata-frozen",
    "Manifest inventory metadata is frozen.",
    Object.isFrozen(inventory) &&
      Object.isFrozen(KnowledgeValidationManifestDependencies),
  ),
]);

const passedGateCount = GATES.filter((entry) => entry.passed).length;
const allGatesPass = passedGateCount === GATES.length;

/** Canonical immutable Manifest readiness descriptor for DKL-5. */
export const KnowledgeValidationManifestReadiness: ManifestReadinessDescriptor =
  Object.freeze({
    readinessId: "DKL-5:5/ManifestReadiness",
    gates: GATES,
    gateCount: GATES.length,
    passedGateCount,
    allGatesPass,
    readiness: allGatesPass
      ? ("ReadyForPlatform" as const)
      : ("NotReady" as const),
    metadataOnly: true as const,
    immutable: true as const,
    deterministic: true as const,
  });
