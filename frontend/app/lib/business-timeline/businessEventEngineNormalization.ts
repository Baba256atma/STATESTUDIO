/**
 * APP-7:2 — Business Event normalization.
 */

import { BUSINESS_TIMELINE_PLATFORM_CONTRACT_VERSION } from "./businessTimelineConstants.ts";
import {
  BUSINESS_EVENT_ENGINE_LIMITS,
  type CreateBusinessEventInput,
  type NormalizedBusinessEventInput,
} from "./businessEventEngineTypes.ts";

function trim(value: string): string {
  return value.trim();
}

function normalizeTags(tags: readonly string[] | undefined): readonly string[] {
  if (!tags?.length) {
    return Object.freeze([]);
  }
  const normalized = tags
    .map((tag) => trim(tag).slice(0, BUSINESS_EVENT_ENGINE_LIMITS.maxTagLength))
    .filter((tag) => tag.length > 0)
    .slice(0, BUSINESS_EVENT_ENGINE_LIMITS.maxTagsPerEvent);
  return Object.freeze([...new Set(normalized)]);
}

function normalizeMetadata(extensions: Readonly<Record<string, string>> | undefined): NormalizedBusinessEventInput["metadata"] {
  const normalized: Record<string, string> = {};
  if (!extensions) {
    return Object.freeze({
      metadataVersion: BUSINESS_TIMELINE_PLATFORM_CONTRACT_VERSION,
      extensions: Object.freeze({}),
      readOnly: true as const,
    });
  }
  let count = 0;
  for (const [rawKey, rawValue] of Object.entries(extensions)) {
    if (count >= BUSINESS_EVENT_ENGINE_LIMITS.maxMetadataKeys) {
      break;
    }
    const key = trim(rawKey);
    const value = trim(String(rawValue)).slice(0, BUSINESS_EVENT_ENGINE_LIMITS.maxMetadataValueLength);
    if (key.length === 0 || value.length === 0) {
      continue;
    }
    normalized[key] = value;
    count += 1;
  }
  return Object.freeze({
    metadataVersion: BUSINESS_TIMELINE_PLATFORM_CONTRACT_VERSION,
    extensions: Object.freeze(normalized),
    readOnly: true as const,
  });
}

export function normalizeBusinessEvent(input: CreateBusinessEventInput): NormalizedBusinessEventInput {
  return Object.freeze({
    id: input.id ? trim(input.id) : undefined,
    workspaceId: trim(input.workspaceId),
    title: trim(input.title).slice(0, BUSINESS_EVENT_ENGINE_LIMITS.maxTitleLength),
    description: trim(input.description).slice(0, BUSINESS_EVENT_ENGINE_LIMITS.maxDescriptionLength),
    category: input.category,
    type: input.type,
    importance: input.importance,
    status: input.status,
    source: input.source,
    createdAt: trim(input.createdAt),
    occurredAt: trim(input.occurredAt),
    createdBy: trim(input.createdBy).slice(0, BUSINESS_EVENT_ENGINE_LIMITS.maxCreatedByLength),
    tags: normalizeTags(input.tags),
    metadata: normalizeMetadata(input.metadata),
  });
}

export const BusinessEventEngineNormalization = Object.freeze({
  normalizeBusinessEvent,
});
