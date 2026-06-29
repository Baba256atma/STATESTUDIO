/**
 * APP-10:2 — Pattern Extraction Engine immutable registry.
 */

import { PATTERN_EXTRACTION_ENGINE_CONTRACT_VERSION, PATTERN_EXTRACTION_ENGINE_LIMITS } from "./patternExtractionEngineConstants.ts";
import type {
  ExecutivePattern,
  PatternEngineResult,
  PatternId,
  PatternRegistrySnapshot,
  PatternWorkspaceId,
} from "./patternExtractionEngineTypes.ts";
import { validateExecutivePattern } from "./patternExtractionEngineValidation.ts";

const patternRegistry = new Map<PatternId, ExecutivePattern>();
const workspaceIndex = new Map<PatternWorkspaceId, Set<PatternId>>();

function indexPattern(pattern: ExecutivePattern): void {
  const ids = workspaceIndex.get(pattern.workspaceId) ?? new Set<PatternId>();
  ids.add(pattern.patternId);
  workspaceIndex.set(pattern.workspaceId, ids);
}

function unindexPattern(pattern: ExecutivePattern): void {
  const ids = workspaceIndex.get(pattern.workspaceId);
  if (!ids) {
    return;
  }
  ids.delete(pattern.patternId);
  if (ids.size === 0) {
    workspaceIndex.delete(pattern.workspaceId);
  }
}

export function resetPatternExtractionEngineRegistryForTests(): void {
  patternRegistry.clear();
  workspaceIndex.clear();
}

export function patternExists(patternId: PatternId): boolean {
  return patternRegistry.has(patternId);
}

export function registerPattern(pattern: ExecutivePattern): PatternEngineResult<ExecutivePattern> {
  const validation = validateExecutivePattern(pattern);
  if (!validation.valid) {
    return Object.freeze({
      success: false,
      reason: validation.issues.map((entry) => entry.message).join("; "),
      data: null,
      error: Object.freeze({
        code: "validation_failure",
        message: validation.issues.map((entry) => entry.message).join("; "),
        readOnly: true as const,
      }),
      readOnly: true as const,
    });
  }
  if (patternRegistry.has(pattern.patternId)) {
    return Object.freeze({
      success: false,
      reason: `Duplicate pattern id: ${pattern.patternId}.`,
      data: null,
      error: Object.freeze({
        code: "duplicate_pattern",
        message: "Duplicate pattern id.",
        field: "patternId",
        readOnly: true as const,
      }),
      readOnly: true as const,
    });
  }
  if (patternRegistry.size >= PATTERN_EXTRACTION_ENGINE_LIMITS.maxRegisteredPatterns) {
    return Object.freeze({
      success: false,
      reason: "Pattern registry is full.",
      data: null,
      error: Object.freeze({
        code: "registry_full",
        message: "Pattern registry is full.",
        readOnly: true as const,
      }),
      readOnly: true as const,
    });
  }
  patternRegistry.set(pattern.patternId, pattern);
  indexPattern(pattern);
  return Object.freeze({
    success: true,
    reason: "Executive pattern registered.",
    data: pattern,
    error: null,
    readOnly: true as const,
  });
}

export function unregisterPattern(patternId: PatternId): PatternEngineResult<PatternId> {
  const existing = patternRegistry.get(patternId);
  if (!existing) {
    return Object.freeze({
      success: false,
      reason: `Pattern not found: ${patternId}.`,
      data: null,
      error: Object.freeze({
        code: "pattern_not_found",
        message: "Pattern not found.",
        field: "patternId",
        readOnly: true as const,
      }),
      readOnly: true as const,
    });
  }
  patternRegistry.delete(patternId);
  unindexPattern(existing);
  return Object.freeze({
    success: true,
    reason: "Executive pattern unregistered.",
    data: patternId,
    error: null,
    readOnly: true as const,
  });
}

export function getPattern(patternId: PatternId): ExecutivePattern | null {
  return patternRegistry.get(patternId) ?? null;
}

export function getPatterns(workspaceId?: PatternWorkspaceId): readonly ExecutivePattern[] {
  if (!workspaceId) {
    return Object.freeze(
      [...patternRegistry.values()].sort((left, right) => left.patternId.localeCompare(right.patternId))
    );
  }
  const ids = workspaceIndex.get(workspaceId);
  if (!ids) {
    return Object.freeze([]);
  }
  return Object.freeze(
    [...ids]
      .map((id) => patternRegistry.get(id))
      .filter((pattern): pattern is ExecutivePattern => pattern !== undefined)
      .sort((left, right) => left.patternId.localeCompare(right.patternId))
  );
}

export function getPatternRegistrySnapshot(): PatternRegistrySnapshot {
  return Object.freeze({
    registryVersion: PATTERN_EXTRACTION_ENGINE_CONTRACT_VERSION,
    patternCount: patternRegistry.size,
    patternIds: Object.freeze([...patternRegistry.keys()].sort()),
    readOnly: true as const,
  });
}

export const PatternExtractionEngineRegistry = Object.freeze({
  resetPatternExtractionEngineRegistryForTests,
  patternExists,
  registerPattern,
  unregisterPattern,
  getPattern,
  getPatterns,
  getPatternRegistrySnapshot,
});
