/**
 * DKL-8:6 — Knowledge Governance Platform Compatibility.
 *
 * Exactly twelve immutable compatibility declarations.
 * Count-bearing statements derive from Manifest inventory.
 *
 * Ownership: owned exclusively by DKL-8:6.
 */

import { KnowledgeGovernanceManifestPlatform } from "./knowledgeGovernanceManifest.ts";
import type { KnowledgeGovernancePlatformCompatibilityDeclaration } from "./knowledgeGovernancePlatformTypes.ts";

const manifest = KnowledgeGovernanceManifestPlatform;

const compatibility = (
  order: number,
  statement: string,
  targetPhase: string,
): KnowledgeGovernancePlatformCompatibilityDeclaration =>
  Object.freeze({
    compatibilityId: `DKL-8:6/Compatibility/${String(order).padStart(2, "0")}`,
    statement,
    compatible: true as const,
    targetPhase,
    deterministicOrder: order,
  });

/** Exactly twelve Platform compatibility declarations. */
export const KnowledgeGovernancePlatformCompatibility: readonly KnowledgeGovernancePlatformCompatibilityDeclaration[] =
  Object.freeze([
    compatibility(1, "Compatible with Foundation vocabulary.", "DKL-8:1"),
    compatibility(
      2,
      `Compatible with ${manifest.inventory.registryEntryCount} Registry entries.`,
      "DKL-8:2",
    ),
    compatibility(
      3,
      `Compatible with ${manifest.inventory.modelKindCount} Model kinds.`,
      "DKL-8:3",
    ),
    compatibility(
      4,
      `Compatible with Validation ${manifest.validation.validationOutcome}.`,
      "DKL-8:4",
    ),
    compatibility(
      5,
      `Compatible with Manifest inventory total ${manifest.inventory.totalEntryCount}.`,
      "DKL-8:5",
    ),
    compatibility(
      6,
      "Compatible with future Certification composition.",
      "DKL-8:7",
    ),
    compatibility(7, "Compatible with future Freeze lock.", "DKL-8:8"),
    compatibility(
      8,
      "Compatible with future Public Index release.",
      "DKL-8:9",
    ),
    compatibility(
      9,
      "Compatible with DKL-7 Public Index reference chain.",
      "DKL-7:9",
    ),
    compatibility(
      10,
      "Compatible with immutable metadata-only consumption.",
      "DKL-8:6",
    ),
    compatibility(
      11,
      "Compatible with non-enforcement governance posture.",
      "DKL-8",
    ),
    compatibility(
      12,
      "Compatible with ReadyForCertification readiness.",
      "DKL-8:7",
    ),
  ]);
