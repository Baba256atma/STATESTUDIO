/**
 * DKL-7:5 — Knowledge Services Manifest Readiness.
 *
 * Manifest-stage readiness and public API declarations.
 *
 * Ownership: owned exclusively by DKL-7:5.
 */

import type { KnowledgeServicesManifestPublicApiDeclaration } from "./knowledgeServicesManifestTypes.ts";

export const KnowledgeServicesManifestReadiness = "ReadyForPlatform" as const;

export const KnowledgeServicesManifestArchitectureStatus =
  "CompleteThroughManifest" as const;

const api = (
  exportName: string,
  description: string,
  order: number,
): KnowledgeServicesManifestPublicApiDeclaration =>
  Object.freeze({
    apiId: `DKL-7:5/PublicApi/${exportName}`,
    exportName,
    description,
    runtimeService: false as const,
    mutableCollection: false as const,
    deterministicOrder: order,
  });

/** Exactly twelve public API declarations. */
export const KnowledgeServicesManifestPublicApis: readonly KnowledgeServicesManifestPublicApiDeclaration[] =
  Object.freeze([
    api("KnowledgeServicesManifest", "Canonical Manifest aggregate.", 1),
    api("KnowledgeServicesManifestId", "Manifest identity constant.", 2),
    api("KnowledgeServicesManifestName", "Manifest name constant.", 3),
    api("KnowledgeServicesManifestVersion", "Manifest version constant.", 4),
    api(
      "KnowledgeServicesManifestNamespace",
      "Manifest namespace constant.",
      5,
    ),
    api("KnowledgeServicesManifestStatus", "Manifest status constant.", 6),
    api(
      "KnowledgeServicesManifestReadiness",
      "Manifest readiness constant.",
      7,
    ),
    api(
      "KnowledgeServicesManifestInventory",
      "Canonical Manifest inventory object.",
      8,
    ),
    api(
      "KnowledgeServicesManifestCompatibility",
      "Compatibility declaration inventory.",
      9,
    ),
    api(
      "KnowledgeServicesManifestGuarantees",
      "Manifest guarantee inventory.",
      10,
    ),
    api(
      "getKnowledgeServicesManifestSummary",
      "Deterministic frozen Manifest summary helper.",
      11,
    ),
    api(
      "getKnowledgeServicesManifestInventoryCount",
      "Deterministic Manifest inventory count helper.",
      12,
    ),
  ]);
