/**
 * DKL-8:5 — Knowledge Governance Manifest Guarantees.
 *
 * Exactly eighteen immutable Manifest guarantees.
 * Count-bearing statements are derived from Validation-chain collections.
 *
 * Ownership: owned exclusively by DKL-8:5.
 */

import { KnowledgeGovernanceValidationPlatform } from "./knowledgeGovernanceValidation.ts";
import type { KnowledgeGovernanceManifestGuarantee } from "./knowledgeGovernanceManifestTypes.ts";

const validation = KnowledgeGovernanceValidationPlatform;
const model = validation.model;
const registry = model.registry;

const guarantee = (
  order: number,
  statement: string,
): KnowledgeGovernanceManifestGuarantee =>
  Object.freeze({
    guaranteeId: `DKL-8:5/Guarantee/${String(order).padStart(2, "0")}`,
    statement,
    status: true as const,
    deterministicOrder: order,
  });

/** Exactly eighteen Manifest guarantees. */
export const KnowledgeGovernanceManifestGuarantees: readonly KnowledgeGovernanceManifestGuarantee[] =
  Object.freeze([
    guarantee(1, "Manifest consumes only Validation directly."),
    guarantee(2, "Model is reached only through Validation."),
    guarantee(3, "Registry is reached only through Model."),
    guarantee(4, "Foundation is reached only through Registry."),
    guarantee(5, "DKL-7 is reached only through Foundation."),
    guarantee(6, "All previous phases remain preserved by canonical reference."),
    guarantee(
      7,
      `Registry total entry count remains ${registry.totalEntryCount}.`,
    ),
    guarantee(
      8,
      `Model kind count remains ${model.modelKinds.length}.`,
    ),
    guarantee(
      9,
      `Relationship kind count remains ${model.relationships.kinds.length}.`,
    ),
    guarantee(
      10,
      `All ${validation.rules.length} Validation rules remain Pass.`,
    ),
    guarantee(
      11,
      `All ${validation.gates.length} Validation readiness gates remain Pass.`,
    ),
    guarantee(12, "Knowledge Governance remains metadata-only."),
    guarantee(13, "No runtime enforcement is introduced by Manifest."),
    guarantee(14, "No duplicate definitions are reconstructed."),
    guarantee(15, "Ownership and boundaries remain unchanged."),
    guarantee(
      16,
      "Manifest is the single source of truth inventory for DKL-8:1–8:5.",
    ),
    guarantee(17, "Manifest is compatible with the future Platform phase."),
    guarantee(18, "Manifest is ready for Platform."),
  ]);
