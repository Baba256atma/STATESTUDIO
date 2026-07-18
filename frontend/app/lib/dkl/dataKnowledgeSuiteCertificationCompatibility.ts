/**
 * DKL-9:7 — Data Knowledge Suite Certification Compatibility.
 *
 * Compatibility and guarantee declarations for Certification readiness.
 * Count-bearing statements derive from Platform inventory.
 *
 * Ownership: owned exclusively by DKL-9:7.
 */

import { DataKnowledgeSuitePlatform } from "./dataKnowledgeSuitePlatform.ts";

const platform = DataKnowledgeSuitePlatform;

const compatibility = (
  order: number,
  statement: string,
  targetPhase: string,
) =>
  Object.freeze({
    compatibilityId: `DKL-9:7/Compatibility/${String(order).padStart(2, "0")}`,
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
    guaranteeId: `DKL-9:7/Guarantee/${String(order).padStart(2, "0")}`,
    statement,
    status: "Satisfied" as const,
    runtimeBehavior: "None" as const,
    deterministicOrder: order,
  });

/** Certification compatibility declarations. */
export const DataKnowledgeSuiteCertificationCompatibility = Object.freeze([
  compatibility(1, "Compatible with certified Platform surface.", "DKL-9:6"),
  compatibility(
    2,
    `Compatible with Manifest total ${platform.inventory.manifestTotalEntryCount}.`,
    "DKL-9:5",
  ),
  compatibility(
    3,
    `Compatible with ${platform.inventory.validationRuleCount} Validation rules.`,
    "DKL-9:4",
  ),
  compatibility(
    4,
    `Compatible with ${platform.inventory.capabilityCount} suite capabilities.`,
    "DKL-9:3",
  ),
  compatibility(5, "Compatible with future Freeze lock.", "DKL-9:8"),
  compatibility(6, "Compatible with future Public Index release.", "DKL-9:9"),
  compatibility(
    7,
    "Compatible with immutable metadata-only consumption.",
    "DKL-9:7",
  ),
  compatibility(
    8,
    "Compatible with ReadyForFreeze readiness.",
    "DKL-9:7",
  ),
]);

/** Certification guarantees. */
export const DataKnowledgeSuiteCertificationGuarantees = Object.freeze([
  guarantee(1, "Certification consumes only Platform directly."),
  guarantee(2, "Canonical references remain preserved through Platform."),
  guarantee(3, "Canonical Inventory Rule remains satisfied."),
  guarantee(
    4,
    `Platform inventory total remains ${platform.inventory.totalEntryCount}.`,
  ),
  guarantee(
    5,
    `Suite public API inventory total remains ${platform.inventory.publicApiInventoryTotal}.`,
  ),
  guarantee(6, "Certification introduces no runtime behaviour."),
  guarantee(7, "Certification does not modify Platform."),
  guarantee(8, "Certification is ready for Freeze."),
]);
