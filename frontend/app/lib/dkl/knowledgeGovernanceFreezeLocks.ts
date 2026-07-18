/**
 * DKL-8:8 — Knowledge Governance Freeze Lock.
 *
 * Canonical declarative freeze lock for DKL-8 Knowledge Governance.
 * Metadata-only. Not a filesystem, Git, or runtime lock.
 *
 * Ownership: owned exclusively by DKL-8:8.
 */

import { KnowledgeGovernanceFreezeComponents } from "./knowledgeGovernanceFreezeRegistry.ts";
import type { KnowledgeGovernanceFreezeLockDeclaration } from "./knowledgeGovernanceFreezeTypes.ts";

const PROTECTED_CERTIFICATION_EXPORTS = Object.freeze([
  "KnowledgeGovernanceCertificationId",
  "KnowledgeGovernanceCertificationVersion",
  "KnowledgeGovernanceCertificationName",
  "KnowledgeGovernanceCertificationNamespace",
  "KnowledgeGovernanceCertificationStatus",
  "KnowledgeGovernanceCertificationReadiness",
  "KnowledgeGovernanceCertificationPlatform",
  "getKnowledgeGovernanceCertificationSummary",
] as const);

const PROTECTED_FREEZE_EXPORTS = Object.freeze([
  "KnowledgeGovernanceFreezeId",
  "KnowledgeGovernanceFreezeVersion",
  "KnowledgeGovernanceFreezeName",
  "KnowledgeGovernanceFreezeNamespace",
  "KnowledgeGovernanceFreezeStatus",
  "KnowledgeGovernanceFreezeReadiness",
  "KnowledgeGovernanceFreezePlatform",
  "getKnowledgeGovernanceFreezeSummary",
] as const);

/** Canonical declarative freeze lock. */
export const KnowledgeGovernanceFreezeLockRecord: KnowledgeGovernanceFreezeLockDeclaration =
  Object.freeze({
    id: "DKL-8-KNOWLEDGE-GOVERNANCE-LOCKED" as const,
    name: "DKL-8 Knowledge Governance Lock",
    scope: "DKL-8" as const,
    version: "1.0.0",
    status: "Frozen" as const,
    locked: true as const,
    certificationResult: "Pass" as const,
    protectedComponents: Object.freeze(
      KnowledgeGovernanceFreezeComponents.map((item) => item.id),
    ),
    protectedPublicSurface: Object.freeze([
      ...PROTECTED_CERTIFICATION_EXPORTS,
      ...PROTECTED_FREEZE_EXPORTS,
    ]),
    protectedInventory: true as const,
    breakingChangePolicy: "MajorVersionRequired" as const,
    extensionPolicy: "AdditiveOnly" as const,
    readiness: "ReadyForPublicIndex" as const,
    metadataOnly: true as const,
    declarativeOnly: true as const,
  });

export const KnowledgeGovernanceFreezeProtectedCertificationExports =
  PROTECTED_CERTIFICATION_EXPORTS;

export const KnowledgeGovernanceFreezeProtectedFreezeExports =
  PROTECTED_FREEZE_EXPORTS;
