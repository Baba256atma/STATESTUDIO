/**
 * APP-10:3 — Similarity Engine immutable registry.
 */

import { SIMILARITY_ENGINE_CONTRACT_VERSION, SIMILARITY_ENGINE_LIMITS } from "./similarityEngineConstants.ts";
import type {
  SimilarityEngineResult,
  SimilarityRegistrySnapshot,
  SimilarityResult,
  SimilarityResultId,
  SimilarityWorkspaceId,
} from "./similarityEngineTypes.ts";
import { validateSimilarityResult } from "./similarityEngineValidation.ts";

const similarityRegistry = new Map<SimilarityResultId, SimilarityResult>();
const workspaceIndex = new Map<SimilarityWorkspaceId, Set<SimilarityResultId>>();

function indexResult(result: SimilarityResult): void {
  const ids = workspaceIndex.get(result.workspaceId) ?? new Set<SimilarityResultId>();
  ids.add(result.similarityResultId);
  workspaceIndex.set(result.workspaceId, ids);
}

function unindexResult(result: SimilarityResult): void {
  const ids = workspaceIndex.get(result.workspaceId);
  if (!ids) {
    return;
  }
  ids.delete(result.similarityResultId);
  if (ids.size === 0) {
    workspaceIndex.delete(result.workspaceId);
  }
}

export function clearSimilarityRegistryForTests(): void {
  similarityRegistry.clear();
  workspaceIndex.clear();
}

export function similarityResultExists(similarityResultId: SimilarityResultId): boolean {
  return similarityRegistry.has(similarityResultId);
}

export function registerSimilarityResult(result: SimilarityResult): SimilarityEngineResult<SimilarityResult> {
  const validation = validateSimilarityResult(result);
  if (!validation.valid) {
    return Object.freeze({
      success: false,
      reason: validation.issues.map((entry) => entry.message).join("; "),
      data: null,
      error: validation.issues[0] ?? null,
      readOnly: true as const,
    });
  }
  if (similarityRegistry.has(result.similarityResultId)) {
    return Object.freeze({
      success: false,
      reason: `Duplicate similarity result id: ${result.similarityResultId}.`,
      data: null,
      error: Object.freeze({
        code: "duplicate_result",
        message: "Duplicate similarity result id.",
        field: "similarityResultId",
        readOnly: true as const,
      }),
      readOnly: true as const,
    });
  }
  if (similarityRegistry.size >= SIMILARITY_ENGINE_LIMITS.maxRegisteredResults) {
    return Object.freeze({
      success: false,
      reason: "Similarity registry is full.",
      data: null,
      error: Object.freeze({
        code: "registry_full",
        message: "Similarity registry is full.",
        readOnly: true as const,
      }),
      readOnly: true as const,
    });
  }
  similarityRegistry.set(result.similarityResultId, result);
  indexResult(result);
  return Object.freeze({
    success: true,
    reason: "Similarity result registered.",
    data: result,
    error: null,
    readOnly: true as const,
  });
}

export function getSimilarityResult(similarityResultId: SimilarityResultId): SimilarityResult | null {
  return similarityRegistry.get(similarityResultId) ?? null;
}

export function getSimilarityResults(workspaceId?: SimilarityWorkspaceId): readonly SimilarityResult[] {
  if (!workspaceId) {
    return Object.freeze(
      [...similarityRegistry.values()].sort((left, right) => left.similarityResultId.localeCompare(right.similarityResultId))
    );
  }
  const ids = workspaceIndex.get(workspaceId);
  if (!ids) {
    return Object.freeze([]);
  }
  return Object.freeze(
    [...ids]
      .map((id) => similarityRegistry.get(id))
      .filter((entry): entry is SimilarityResult => entry !== undefined)
      .sort((left, right) => left.similarityResultId.localeCompare(right.similarityResultId))
  );
}

export function getSimilarityRegistrySnapshot(): SimilarityRegistrySnapshot {
  return Object.freeze({
    registryVersion: SIMILARITY_ENGINE_CONTRACT_VERSION,
    resultCount: similarityRegistry.size,
    resultIds: Object.freeze([...similarityRegistry.keys()].sort()),
    readOnly: true as const,
  });
}

export const SimilarityEngineRegistry = Object.freeze({
  clearSimilarityRegistryForTests,
  similarityResultExists,
  registerSimilarityResult,
  getSimilarityResult,
  getSimilarityResults,
  getSimilarityRegistrySnapshot,
});
