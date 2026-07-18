/**
 * DKL-8:6 — Knowledge Governance Platform Readiness.
 *
 * Platform-stage readiness and public API registry declarations.
 *
 * Ownership: owned exclusively by DKL-8:6.
 */

import type { KnowledgeGovernancePlatformPublicApiDeclaration } from "./knowledgeGovernancePlatformTypes.ts";

export const KnowledgeGovernancePlatformReadinessValue =
  "ReadyForCertification" as const;

export const KnowledgeGovernancePlatformArchitectureStatus =
  "CompleteThroughPlatform" as const;

const api = (
  exportName: string,
  description: string,
  order: number,
): KnowledgeGovernancePlatformPublicApiDeclaration =>
  Object.freeze({
    apiId: `DKL-8:6/PublicApi/${exportName}`,
    exportName,
    description,
    runtimeService: false as const,
    mutableCollection: false as const,
    deterministicOrder: order,
  });

/** Exactly eight public API declarations for DKL-8:6. */
export const KnowledgeGovernancePlatformPublicApis: readonly KnowledgeGovernancePlatformPublicApiDeclaration[] =
  Object.freeze([
    api("KnowledgeGovernancePlatformId", "Platform identity constant.", 1),
    api("KnowledgeGovernancePlatformVersion", "Platform version constant.", 2),
    api("KnowledgeGovernancePlatformName", "Platform name constant.", 3),
    api(
      "KnowledgeGovernancePlatformNamespace",
      "Platform namespace constant.",
      4,
    ),
    api("KnowledgeGovernancePlatformStatus", "Platform status constant.", 5),
    api(
      "KnowledgeGovernancePlatformReadiness",
      "Platform readiness constant.",
      6,
    ),
    api(
      "KnowledgeGovernancePlatform",
      "Canonical Platform aggregate.",
      7,
    ),
    api(
      "getKnowledgeGovernancePlatformSummary",
      "Deterministic frozen Platform summary helper.",
      8,
    ),
  ]);
