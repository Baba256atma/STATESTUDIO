/**
 * DKL-8:6 — Knowledge Governance Platform Guarantees.
 *
 * Exactly eighteen immutable Platform guarantees.
 * Count-bearing statements derive from Manifest inventory.
 *
 * Ownership: owned exclusively by DKL-8:6.
 */

import { KnowledgeGovernanceManifestPlatform } from "./knowledgeGovernanceManifest.ts";
import type { KnowledgeGovernancePlatformGuarantee } from "./knowledgeGovernancePlatformTypes.ts";

const manifest = KnowledgeGovernanceManifestPlatform;

const guarantee = (
  order: number,
  statement: string,
): KnowledgeGovernancePlatformGuarantee =>
  Object.freeze({
    guaranteeId: `DKL-8:6/Guarantee/${String(order).padStart(2, "0")}`,
    statement,
    status: true as const,
    deterministicOrder: order,
  });

/** Exactly eighteen Platform guarantees. */
export const KnowledgeGovernancePlatformGuarantees: readonly KnowledgeGovernancePlatformGuarantee[] =
  Object.freeze([
    guarantee(1, "Platform consumes only Manifest directly."),
    guarantee(2, "Validation is reached only through Manifest."),
    guarantee(3, "Model is reached only through Validation."),
    guarantee(4, "Registry is reached only through Model."),
    guarantee(5, "Foundation is reached only through Registry."),
    guarantee(6, "DKL-7 is reached only through Foundation."),
    guarantee(7, "All previous phases remain preserved by canonical reference."),
    guarantee(
      8,
      `Manifest inventory total remains ${manifest.inventory.totalEntryCount}.`,
    ),
    guarantee(
      9,
      `Registry entry count remains ${manifest.inventory.registryEntryCount}.`,
    ),
    guarantee(
      10,
      `Model kind count remains ${manifest.inventory.modelKindCount}.`,
    ),
    guarantee(
      11,
      `Validation rule count remains ${manifest.inventory.validationRuleCount}.`,
    ),
    guarantee(12, "Knowledge Governance remains metadata-only."),
    guarantee(13, "No runtime behaviour is introduced by Platform."),
    guarantee(14, "No duplicate inventories are reconstructed."),
    guarantee(15, "No backward dependencies are introduced."),
    guarantee(16, "Platform is the single public integration surface for DKL-8."),
    guarantee(17, "Platform is compatible with the future Certification phase."),
    guarantee(18, "Platform is ready for Certification."),
  ]);
