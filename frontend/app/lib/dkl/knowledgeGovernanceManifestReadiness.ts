/**
 * DKL-8:5 — Knowledge Governance Manifest Readiness.
 *
 * Manifest-stage readiness and public API declarations.
 *
 * Ownership: owned exclusively by DKL-8:5.
 */

import type { KnowledgeGovernanceManifestPublicApiDeclaration } from "./knowledgeGovernanceManifestTypes.ts";

export const KnowledgeGovernanceManifestReadinessValue =
  "ReadyForPlatform" as const;

export const KnowledgeGovernanceManifestArchitectureStatus =
  "CompleteThroughManifest" as const;

const api = (
  exportName: string,
  description: string,
  order: number,
): KnowledgeGovernanceManifestPublicApiDeclaration =>
  Object.freeze({
    apiId: `DKL-8:5/PublicApi/${exportName}`,
    exportName,
    description,
    runtimeService: false as const,
    mutableCollection: false as const,
    deterministicOrder: order,
  });

/** Exactly eight public API declarations for DKL-8:5. */
export const KnowledgeGovernanceManifestPublicApis: readonly KnowledgeGovernanceManifestPublicApiDeclaration[] =
  Object.freeze([
    api(
      "KnowledgeGovernanceManifestId",
      "Manifest identity constant.",
      1,
    ),
    api(
      "KnowledgeGovernanceManifestVersion",
      "Manifest version constant.",
      2,
    ),
    api("KnowledgeGovernanceManifestName", "Manifest name constant.", 3),
    api(
      "KnowledgeGovernanceManifestNamespace",
      "Manifest namespace constant.",
      4,
    ),
    api(
      "KnowledgeGovernanceManifestStatus",
      "Manifest status constant.",
      5,
    ),
    api(
      "KnowledgeGovernanceManifestReadiness",
      "Manifest readiness constant.",
      6,
    ),
    api(
      "KnowledgeGovernanceManifestPlatform",
      "Canonical Manifest platform aggregate.",
      7,
    ),
    api(
      "getKnowledgeGovernanceManifestSummary",
      "Deterministic frozen Manifest summary helper.",
      8,
    ),
  ]);
