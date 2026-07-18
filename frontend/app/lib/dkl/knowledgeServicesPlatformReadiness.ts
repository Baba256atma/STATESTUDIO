/**
 * DKL-7:6 — Knowledge Services Platform Readiness.
 *
 * Platform readiness, consumer declarations, and public API declarations.
 *
 * Ownership: owned exclusively by DKL-7:6.
 */

import type {
  KnowledgeServicesPlatformConsumerDeclaration,
  KnowledgeServicesPlatformPublicApiDeclaration,
} from "./knowledgeServicesPlatformTypes.ts";

export const KnowledgeServicesPlatformReadiness =
  "ReadyForCertification" as const;

export const KnowledgeServicesPlatformArchitectureStatus =
  "CompleteThroughPlatform" as const;

const consumer = (
  key: string,
  consumerName: string,
  consumerType: string,
  allowedAccessPath: string,
  requiredFutureReleaseSurface: string,
  directImportAuthorization: boolean,
  order: number,
): KnowledgeServicesPlatformConsumerDeclaration =>
  Object.freeze({
    consumerId: `DKL-7:6/Consumer/${key}`,
    consumerName,
    consumerType,
    allowedAccessPath,
    requiredPlatformStatus: "PlatformComplete" as const,
    requiredFutureReleaseSurface,
    directImportAuthorization,
    runtimeAuthorization: "None" as const,
    compatibilityStatus: "Compatible" as const,
    deterministicOrder: order,
  });

/** Exactly four consumer declarations. */
export const KnowledgeServicesPlatformConsumers: readonly KnowledgeServicesPlatformConsumerDeclaration[] =
  Object.freeze([
    consumer(
      "Certification",
      "Future DKL-7 Certification",
      "FuturePhase",
      "Certification → Platform",
      "DKL-7:7/KnowledgeServicesCertification",
      true,
      1,
    ),
    consumer(
      "Freeze",
      "Future DKL-7 Freeze",
      "FuturePhase",
      "Freeze → Certification → Platform",
      "DKL-7:8/KnowledgeServicesFreeze",
      false,
      2,
    ),
    consumer(
      "PublicIndex",
      "Future DKL-7 Public Index",
      "FuturePhase",
      "Public Index → Freeze → Certification → Platform",
      "DKL-7:9/KnowledgeServicesPublicIndex",
      false,
      3,
    ),
    consumer(
      "ApprovedInternalConsumer",
      "Future approved internal consumer through Public Index",
      "FutureConsumer",
      "Approved internal consumer → Public Index → Freeze → … → Platform",
      "DKL-7:9/KnowledgeServicesPublicIndex",
      false,
      4,
    ),
  ]);

const api = (
  exportName: string,
  description: string,
  order: number,
): KnowledgeServicesPlatformPublicApiDeclaration =>
  Object.freeze({
    apiId: `DKL-7:6/PublicApi/${exportName}`,
    exportName,
    description,
    runtimeService: false as const,
    mutableCollection: false as const,
    deterministicOrder: order,
  });

/** Exactly twelve public API declarations. */
export const KnowledgeServicesPlatformPublicApis: readonly KnowledgeServicesPlatformPublicApiDeclaration[] =
  Object.freeze([
    api("KnowledgeServicesPlatform", "Canonical Platform aggregate.", 1),
    api("KnowledgeServicesPlatformId", "Platform identity constant.", 2),
    api("KnowledgeServicesPlatformName", "Platform name constant.", 3),
    api("KnowledgeServicesPlatformVersion", "Platform version constant.", 4),
    api(
      "KnowledgeServicesPlatformNamespace",
      "Platform namespace constant.",
      5,
    ),
    api("KnowledgeServicesPlatformStatus", "Platform status constant.", 6),
    api(
      "KnowledgeServicesPlatformReadiness",
      "Platform readiness constant.",
      7,
    ),
    api(
      "KnowledgeServicesPlatformInventory",
      "Canonical Platform inventory object.",
      8,
    ),
    api(
      "KnowledgeServicesPlatformCompatibility",
      "Compatibility declaration inventory.",
      9,
    ),
    api(
      "KnowledgeServicesPlatformGuarantees",
      "Platform guarantee inventory.",
      10,
    ),
    api(
      "getKnowledgeServicesPlatformSummary",
      "Deterministic frozen Platform summary helper.",
      11,
    ),
    api(
      "getKnowledgeServicesPlatformInventoryCount",
      "Deterministic Platform inventory count helper.",
      12,
    ),
  ]);
