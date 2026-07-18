/**
 * DKL-8:7 — Knowledge Governance Certification Compatibility.
 *
 * Compatibility and guarantee declarations for Certification readiness.
 * Count-bearing statements derive from Platform inventory.
 *
 * Ownership: owned exclusively by DKL-8:7.
 */

import { KnowledgeGovernancePlatform } from "./knowledgeGovernancePlatform.ts";

const platform = KnowledgeGovernancePlatform;

const compatibility = (
  order: number,
  statement: string,
  targetPhase: string,
) =>
  Object.freeze({
    compatibilityId: `DKL-8:7/Compatibility/${String(order).padStart(2, "0")}`,
    statement,
    compatible: true as const,
    targetPhase,
    metadataOnly: true as const,
    immutable: true as const,
    deterministic: true as const,
    forwardCompatible: true as const,
    boundarySafe: true as const,
    referencePreserving: true as const,
    deterministicOrder: order,
  });

const guarantee = (order: number, statement: string) =>
  Object.freeze({
    guaranteeId: `DKL-8:7/Guarantee/${String(order).padStart(2, "0")}`,
    statement,
    status: true as const,
    deterministicOrder: order,
  });

/** Exactly twelve Certification compatibility declarations. */
export const KnowledgeGovernanceCertificationCompatibility = Object.freeze([
  compatibility(1, "Compatible with certified Platform surface.", "DKL-8:6"),
  compatibility(
    2,
    `Compatible with Manifest total ${platform.inventory.manifestTotalEntryCount}.`,
    "DKL-8:5",
  ),
  compatibility(
    3,
    `Compatible with ${platform.inventory.validationRuleCount} Validation rules.`,
    "DKL-8:4",
  ),
  compatibility(
    4,
    `Compatible with ${platform.inventory.modelKindCount} Model kinds.`,
    "DKL-8:3",
  ),
  compatibility(
    5,
    `Compatible with ${platform.inventory.registryEntryCount} Registry entries.`,
    "DKL-8:2",
  ),
  compatibility(6, "Compatible with Foundation vocabulary.", "DKL-8:1"),
  compatibility(
    7,
    "Compatible with DKL-7 Public Index reference chain.",
    "DKL-7:9",
  ),
  compatibility(8, "Compatible with future Freeze lock.", "DKL-8:8"),
  compatibility(9, "Compatible with future Public Index release.", "DKL-8:9"),
  compatibility(
    10,
    "Compatible with immutable metadata-only certification.",
    "DKL-8:7",
  ),
  compatibility(
    11,
    "Compatible with non-enforcement governance posture.",
    "DKL-8",
  ),
  compatibility(12, "Compatible with ReadyForFreeze readiness.", "DKL-8:8"),
]);

/** Exactly twelve Certification guarantees. */
export const KnowledgeGovernanceCertificationGuarantees = Object.freeze([
  guarantee(1, "Certification consumes only Platform directly."),
  guarantee(2, "Manifest is reached only through Platform."),
  guarantee(3, "Validation is reached only through Manifest."),
  guarantee(4, "Model is reached only through Validation."),
  guarantee(5, "Registry is reached only through Model."),
  guarantee(6, "Foundation is reached only through Registry."),
  guarantee(7, "All Platform references remain canonical."),
  guarantee(
    8,
    `Platform inventory total remains ${platform.inventory.totalEntryCount}.`,
  ),
  guarantee(9, "Canonical Inventory Rule remains certified."),
  guarantee(10, "No Platform metadata is modified by Certification."),
  guarantee(11, "Certification is compatible with Freeze."),
  guarantee(12, "Certification is ready for Freeze."),
]);
