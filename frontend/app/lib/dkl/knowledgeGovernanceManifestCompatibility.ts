/**
 * DKL-8:5 — Knowledge Governance Manifest Compatibility.
 *
 * Exactly twelve immutable compatibility declarations.
 * Count-bearing statements are derived from Validation-chain collections.
 *
 * Ownership: owned exclusively by DKL-8:5.
 */

import { KnowledgeGovernanceValidationPlatform } from "./knowledgeGovernanceValidation.ts";
import type { KnowledgeGovernanceManifestCompatibilityDeclaration } from "./knowledgeGovernanceManifestTypes.ts";

const validation = KnowledgeGovernanceValidationPlatform;
const model = validation.model;
const registry = model.registry;

const compatibility = (
  order: number,
  statement: string,
  targetPhase: string,
): KnowledgeGovernanceManifestCompatibilityDeclaration =>
  Object.freeze({
    compatibilityId: `DKL-8:5/Compatibility/${String(order).padStart(2, "0")}`,
    statement,
    compatible: true as const,
    targetPhase,
    deterministicOrder: order,
  });

/** Exactly twelve Manifest compatibility declarations. */
export const KnowledgeGovernanceManifestCompatibility: readonly KnowledgeGovernanceManifestCompatibilityDeclaration[] =
  Object.freeze([
    compatibility(
      1,
      "Compatible with completed Foundation vocabulary.",
      "DKL-8:1",
    ),
    compatibility(
      2,
      `Compatible with registered ${registry.totalEntryCount} Registry entries.`,
      "DKL-8:2",
    ),
    compatibility(
      3,
      `Compatible with ${model.modelKinds.length} Model kinds and ${model.relationships.kinds.length} relationship kinds.`,
      "DKL-8:3",
    ),
    compatibility(
      4,
      `Compatible with Validation ${validation.validationOutcome} and ${validation.readiness}.`,
      "DKL-8:4",
    ),
    compatibility(
      5,
      "Compatible with future Platform composition.",
      "DKL-8:6",
    ),
    compatibility(
      6,
      "Compatible with future Certification gates.",
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
      "DKL-8:5",
    ),
    compatibility(
      11,
      "Compatible with non-enforcement governance posture.",
      "DKL-8",
    ),
    compatibility(
      12,
      "Compatible with ReadyForPlatform readiness.",
      "DKL-8:6",
    ),
  ]);
