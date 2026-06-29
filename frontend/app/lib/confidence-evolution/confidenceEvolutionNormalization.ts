/**
 * APP-9:2 — Confidence record normalization.
 */

import { CONFIDENCE_EVOLUTION_PLATFORM_CONTRACT_VERSION } from "./confidenceEvolutionConstants.ts";
import {
  CONFIDENCE_EVOLUTION_ENGINE_LIMITS,
  type CreateConfidenceRecordInput,
  type NormalizedConfidenceRecordInput,
} from "./confidenceEvolutionEngineTypes.ts";

function trim(value: string): string {
  return value.trim();
}

function normalizeStringList(
  values: readonly string[] | undefined,
  maxCount: number
): readonly string[] {
  if (!values?.length) {
    return Object.freeze([]);
  }
  const normalized = values
    .map((value) => trim(value).slice(0, 512))
    .filter((value) => value.length > 0)
    .slice(0, maxCount);
  return Object.freeze([...new Set(normalized)]);
}

function normalizeTags(tags: readonly string[] | undefined): readonly string[] {
  if (!tags?.length) {
    return Object.freeze([]);
  }
  const normalized = tags
    .map((tag) => trim(tag).slice(0, CONFIDENCE_EVOLUTION_ENGINE_LIMITS.maxTagLength))
    .filter((tag) => tag.length > 0)
    .slice(0, CONFIDENCE_EVOLUTION_ENGINE_LIMITS.maxTagsPerRecord);
  return Object.freeze([...new Set(normalized)]);
}

function normalizeMetadata(
  extensions: Readonly<Record<string, string>> | undefined
): NormalizedConfidenceRecordInput["metadata"] {
  const normalized: Record<string, string> = {};
  if (!extensions) {
    return Object.freeze({
      metadataVersion: CONFIDENCE_EVOLUTION_PLATFORM_CONTRACT_VERSION,
      extensions: Object.freeze({}),
      readOnly: true as const,
    });
  }
  let count = 0;
  for (const [rawKey, rawValue] of Object.entries(extensions)) {
    if (count >= CONFIDENCE_EVOLUTION_ENGINE_LIMITS.maxMetadataKeys) {
      break;
    }
    const key = trim(rawKey);
    const value = trim(String(rawValue)).slice(0, CONFIDENCE_EVOLUTION_ENGINE_LIMITS.maxMetadataValueLength);
    if (key.length === 0 || value.length === 0) {
      continue;
    }
    normalized[key] = value;
    count += 1;
  }
  return Object.freeze({
    metadataVersion: CONFIDENCE_EVOLUTION_PLATFORM_CONTRACT_VERSION,
    extensions: Object.freeze(normalized),
    readOnly: true as const,
  });
}

function normalizeScore(score: number): number {
  return score;
}

export function normalizeConfidenceRecord(
  input: CreateConfidenceRecordInput
): NormalizedConfidenceRecordInput {
  const createdAt = trim(input.createdAt);
  const updatedAt = trim(input.updatedAt ?? input.createdAt);
  return Object.freeze({
    id: input.id ? trim(input.id) : undefined,
    workspaceId: trim(input.workspaceId),
    decisionId: input.decisionId ? trim(input.decisionId) : undefined,
    scenarioId: input.scenarioId ? trim(input.scenarioId) : undefined,
    journalEntryId: input.journalEntryId ? trim(input.journalEntryId) : undefined,
    title: trim(input.title).slice(0, CONFIDENCE_EVOLUTION_ENGINE_LIMITS.maxTitleLength),
    confidenceLevel: input.confidenceLevel,
    confidenceScore: normalizeScore(input.confidenceScore),
    source: input.source,
    reason: input.reason,
    notes: trim(input.notes ?? "").slice(0, CONFIDENCE_EVOLUTION_ENGINE_LIMITS.maxNotesLength),
    evidenceReferences: normalizeStringList(
      input.evidenceReferences,
      CONFIDENCE_EVOLUTION_ENGINE_LIMITS.maxEvidenceReferences
    ),
    previousConfidence: input.previousConfidence,
    tags: normalizeTags(input.tags),
    metadata: normalizeMetadata(input.metadata),
    status: input.status ?? "draft",
    createdAt,
    updatedAt,
  });
}

export const ConfidenceEvolutionNormalization = Object.freeze({
  normalizeConfidenceRecord,
});
