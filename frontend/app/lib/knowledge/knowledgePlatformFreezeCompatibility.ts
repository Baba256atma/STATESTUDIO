/**
 * KNL-15 — Knowledge Platform Freeze compatibility matrix.
 */

import {
  COMPATIBILITY_CONSUMER_KEYS,
  COMPATIBILITY_CONSUMER_LABELS,
  COMPATIBILITY_CONSUMER_PLATFORM_MAP,
  COMPATIBILITY_KNL_VERSION,
  KNOWLEDGE_PLATFORM_FREEZE_CONTRACT_VERSION,
  KNOWLEDGE_PLATFORM_RELEASE_VERSION,
} from "./knowledgePlatformFreezeCatalog.ts";
import type { CompatibilityMatrix, CompatibilityMatrixEntry } from "./knowledgePlatformFreezeTypes.ts";

export function buildKnowledgePlatformCompatibilityMatrix(): CompatibilityMatrix {
  const entries: CompatibilityMatrixEntry[] = COMPATIBILITY_CONSUMER_KEYS.map((consumerKey) =>
    Object.freeze({
      entryId: `compatibility-entry-${consumerKey}`,
      consumerKey,
      consumerLabel: COMPATIBILITY_CONSUMER_LABELS[consumerKey],
      knlVersion: COMPATIBILITY_KNL_VERSION,
      platformReference: COMPATIBILITY_CONSUMER_PLATFORM_MAP[consumerKey],
      compatible: true as const,
      readOnly: true as const,
    })
  );

  return Object.freeze({
    matrixId: "knowledge-platform-compatibility-matrix",
    releaseVersion: KNOWLEDGE_PLATFORM_RELEASE_VERSION,
    entries: Object.freeze(entries),
    contractVersion: KNOWLEDGE_PLATFORM_FREEZE_CONTRACT_VERSION,
    readOnly: true as const,
  });
}

export function getKnowledgePlatformCompatibilityMatrix(): CompatibilityMatrix {
  return buildKnowledgePlatformCompatibilityMatrix();
}

export function isCompatibilityMatrixComplete(matrix: CompatibilityMatrix): boolean {
  if (matrix.entries.length !== COMPATIBILITY_CONSUMER_KEYS.length) return false;
  return COMPATIBILITY_CONSUMER_KEYS.every((consumerKey) =>
    matrix.entries.some(
      (entry) =>
        entry.consumerKey === consumerKey &&
        entry.compatible === true &&
        entry.platformReference === COMPATIBILITY_CONSUMER_PLATFORM_MAP[consumerKey]
    )
  );
}

export const KnowledgePlatformFreezeCompatibility = Object.freeze({
  buildKnowledgePlatformCompatibilityMatrix,
  getKnowledgePlatformCompatibilityMatrix,
  isCompatibilityMatrixComplete,
});
