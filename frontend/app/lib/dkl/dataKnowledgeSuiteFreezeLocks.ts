/**
 * DKL-9:8 — Data Knowledge Suite Freeze Lock.
 *
 * Canonical declarative freeze lock for DKL-9 Data Knowledge Suite.
 * Metadata-only. Not a filesystem, Git, or runtime lock.
 *
 * Ownership: owned exclusively by DKL-9:8.
 */

import { DataKnowledgeSuiteFreezeComponents } from "./dataKnowledgeSuiteFreezeRegistry.ts";
import type { DataKnowledgeSuiteFreezeLockDeclaration } from "./dataKnowledgeSuiteFreezeTypes.ts";

const PROTECTED_CERTIFICATION_EXPORTS = Object.freeze([
  "DataKnowledgeSuiteCertificationId",
  "DataKnowledgeSuiteCertificationVersion",
  "DataKnowledgeSuiteCertificationName",
  "DataKnowledgeSuiteCertificationNamespace",
  "DataKnowledgeSuiteCertificationStatus",
  "DataKnowledgeSuiteCertificationReadiness",
  "DataKnowledgeSuiteCertificationPlatform",
  "getDataKnowledgeSuiteCertificationSummary",
] as const);

const PROTECTED_FREEZE_EXPORTS = Object.freeze([
  "DataKnowledgeSuiteFreezeId",
  "DataKnowledgeSuiteFreezeVersion",
  "DataKnowledgeSuiteFreezeName",
  "DataKnowledgeSuiteFreezeNamespace",
  "DataKnowledgeSuiteFreezeStatus",
  "DataKnowledgeSuiteFreezeReadiness",
  "DataKnowledgeSuiteFreezePlatform",
  "getDataKnowledgeSuiteFreezeSummary",
] as const);

/** Canonical declarative freeze lock. */
export const DataKnowledgeSuiteFreezeLockRecord: DataKnowledgeSuiteFreezeLockDeclaration =
  Object.freeze({
    id: "DKL-9-DATA-KNOWLEDGE-SUITE-LOCKED" as const,
    name: "DKL-9 Data Knowledge Suite Lock",
    scope: "DKL-9" as const,
    version: "1.0.0",
    status: "Frozen" as const,
    locked: true as const,
    certificationResult: "Pass" as const,
    protectedComponents: Object.freeze(
      DataKnowledgeSuiteFreezeComponents.map((item) => item.id),
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

export const DataKnowledgeSuiteFreezeProtectedCertificationExports =
  PROTECTED_CERTIFICATION_EXPORTS;

export const DataKnowledgeSuiteFreezeProtectedFreezeExports =
  PROTECTED_FREEZE_EXPORTS;
