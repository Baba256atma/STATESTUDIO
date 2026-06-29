/**
 * APP-7:1 — Business Timeline registry.
 */

import {
  BUSINESS_TIMELINE_CATEGORY_KEYS,
  BUSINESS_TIMELINE_DEFAULT_LIMITS,
  BUSINESS_TIMELINE_IMPORTANCE_KEYS,
  BUSINESS_TIMELINE_STATUS_KEYS,
} from "./businessTimelineConstants.ts";
import type {
  BusinessCategoryRegistration,
  BusinessEventTypeRecord,
  BusinessEventTypeRegistration,
  BusinessFutureExtensionRegistration,
  BusinessImportanceRegistration,
  BusinessMetadataExtensionRegistration,
  BusinessPlatformResult,
  BusinessStatusRegistration,
  BusinessTimelineId,
  BusinessTimelineRegistration,
  BusinessTimelineRegistrationInput,
  BusinessTimelineRegistrySnapshot,
} from "./businessTimelineTypes.ts";
import {
  validateBusinessEventTypeRegistration,
  validateBusinessTimelineRegistration,
  validateMetadataExtensionRegistration,
} from "./businessTimelineValidation.ts";

export const BUSINESS_TIMELINE_REGISTRY_VERSION = "APP-7/1-REGISTRY-1" as const;

const timelineRegistry = new Map<BusinessTimelineId, BusinessTimelineRegistration>();
const eventTypeRegistry = new Map<string, BusinessEventTypeRecord>();
const categoryRegistry = new Map<string, BusinessCategoryRegistration>();
const statusRegistry = new Map<string, BusinessStatusRegistration>();
const importanceRegistry = new Map<string, BusinessImportanceRegistration>();
const metadataExtensionRegistry = new Map<string, BusinessMetadataExtensionRegistration>();
const futureExtensionRegistry = new Map<string, BusinessFutureExtensionRegistration>();

function createResult<T>(success: boolean, reason: string, data: T | null): BusinessPlatformResult<T> {
  return Object.freeze({ success, reason, data, readOnly: true as const });
}

export function resetBusinessTimelineRegistryForTests(): void {
  timelineRegistry.clear();
  eventTypeRegistry.clear();
  categoryRegistry.clear();
  statusRegistry.clear();
  importanceRegistry.clear();
  metadataExtensionRegistry.clear();
  futureExtensionRegistry.clear();
}

export function registerBusinessTimeline(
  input: BusinessTimelineRegistrationInput,
  registeredAt: string = new Date(0).toISOString()
): BusinessPlatformResult<BusinessTimelineRegistration> {
  const validation = validateBusinessTimelineRegistration(input);
  if (!validation.valid) {
    return createResult(false, validation.issues.map((entry) => entry.message).join("; "), null);
  }
  if (timelineRegistry.has(input.timelineId)) {
    return createResult(false, `Business timeline already registered: ${input.timelineId}.`, null);
  }
  if (timelineRegistry.size >= BUSINESS_TIMELINE_DEFAULT_LIMITS.maxRegisteredTimelines) {
    return createResult(false, "Business timeline registry limit reached.", null);
  }
  const entry = Object.freeze({
    timelineId: input.timelineId,
    workspaceId: input.workspaceId,
    label: input.label.trim(),
    description: input.description.trim(),
    registeredAt,
    readOnly: true as const,
  });
  timelineRegistry.set(entry.timelineId, entry);
  return createResult(true, "Business timeline registered.", entry);
}

export function registerBusinessEventType(
  input: BusinessEventTypeRegistration,
  registeredAt: string = new Date(0).toISOString()
): BusinessPlatformResult<BusinessEventTypeRecord> {
  const validation = validateBusinessEventTypeRegistration(input);
  if (!validation.valid) {
    return createResult(false, validation.issues.map((entry) => entry.message).join("; "), null);
  }
  if (eventTypeRegistry.has(input.typeId)) {
    return createResult(false, `Business event type already registered: ${input.typeId}.`, null);
  }
  if (eventTypeRegistry.size >= BUSINESS_TIMELINE_DEFAULT_LIMITS.maxRegisteredEventTypes) {
    return createResult(false, "Business event type registry limit reached.", null);
  }
  const entry = Object.freeze({
    typeId: input.typeId,
    label: input.label.trim(),
    description: input.description.trim(),
    supportedCategories: Object.freeze([...input.supportedCategories]),
    supportedStatuses: Object.freeze([...input.supportedStatuses]),
    supportedImportanceLevels: Object.freeze([...input.supportedImportanceLevels]),
    metadata: Object.freeze({ ...(input.metadata ?? Object.freeze({})) }),
    registeredAt,
    readOnly: true as const,
  });
  eventTypeRegistry.set(entry.typeId, entry);
  return createResult(true, "Business event type registered.", entry);
}

export function registerBusinessCategory(
  input: BusinessCategoryRegistration
): BusinessPlatformResult<BusinessCategoryRegistration> {
  if (!input.categoryId || !input.label.trim()) {
    return createResult(false, "categoryId and label are required.", null);
  }
  if (categoryRegistry.has(input.categoryId)) {
    return createResult(false, `Business category already registered: ${input.categoryId}.`, null);
  }
  const entry = Object.freeze({ ...input });
  categoryRegistry.set(entry.categoryId, entry);
  return createResult(true, "Business category registered.", entry);
}

export function registerBusinessStatusType(
  input: BusinessStatusRegistration
): BusinessPlatformResult<BusinessStatusRegistration> {
  if (!input.statusId || !input.label.trim()) {
    return createResult(false, "statusId and label are required.", null);
  }
  if (statusRegistry.has(input.statusId)) {
    return createResult(false, `Business status already registered: ${input.statusId}.`, null);
  }
  const entry = Object.freeze({ ...input });
  statusRegistry.set(entry.statusId, entry);
  return createResult(true, "Business status registered.", entry);
}

export function registerBusinessImportanceLevel(
  input: BusinessImportanceRegistration
): BusinessPlatformResult<BusinessImportanceRegistration> {
  if (!input.importanceId || !input.label.trim()) {
    return createResult(false, "importanceId and label are required.", null);
  }
  if (importanceRegistry.has(input.importanceId)) {
    return createResult(false, `Business importance already registered: ${input.importanceId}.`, null);
  }
  const entry = Object.freeze({ ...input });
  importanceRegistry.set(entry.importanceId, entry);
  return createResult(true, "Business importance registered.", entry);
}

export function registerMetadataExtension(
  input: BusinessMetadataExtensionRegistration
): BusinessPlatformResult<BusinessMetadataExtensionRegistration> {
  const validation = validateMetadataExtensionRegistration(input);
  if (!validation.valid) {
    return createResult(false, validation.issues.map((entry) => entry.message).join("; "), null);
  }
  if (metadataExtensionRegistry.has(input.extensionId)) {
    return createResult(false, `Metadata extension already registered: ${input.extensionId}.`, null);
  }
  const entry = Object.freeze({ ...input });
  metadataExtensionRegistry.set(entry.extensionId, entry);
  return createResult(true, "Metadata extension registered.", entry);
}

export function registerFutureExtension(
  input: BusinessFutureExtensionRegistration
): BusinessPlatformResult<BusinessFutureExtensionRegistration> {
  if (!input.extensionId.trim() || !input.phaseKey.trim()) {
    return createResult(false, "extensionId and phaseKey are required.", null);
  }
  if (futureExtensionRegistry.has(input.extensionId)) {
    return createResult(false, `Future extension already registered: ${input.extensionId}.`, null);
  }
  const entry = Object.freeze({ ...input });
  futureExtensionRegistry.set(entry.extensionId, entry);
  return createResult(true, "Future extension registered.", entry);
}

export function getBusinessTimeline(timelineId: BusinessTimelineId): BusinessTimelineRegistration | null {
  return timelineRegistry.get(timelineId) ?? null;
}

export function listBusinessTimelineIds(): readonly BusinessTimelineId[] {
  return Object.freeze([...timelineRegistry.keys()].sort((left, right) => left.localeCompare(right)));
}

export function getBusinessTimelineRegistry(): Readonly<{
  timelines: readonly BusinessTimelineRegistration[];
  eventTypes: readonly BusinessEventTypeRecord[];
  categories: readonly BusinessCategoryRegistration[];
  statusTypes: readonly BusinessStatusRegistration[];
  importanceLevels: readonly BusinessImportanceRegistration[];
  metadataExtensions: readonly BusinessMetadataExtensionRegistration[];
  futureExtensions: readonly BusinessFutureExtensionRegistration[];
  readOnly: true;
}> {
  return Object.freeze({
    timelines: Object.freeze([...timelineRegistry.values()].sort((a, b) => a.timelineId.localeCompare(b.timelineId))),
    eventTypes: Object.freeze([...eventTypeRegistry.values()].sort((a, b) => a.typeId.localeCompare(b.typeId))),
    categories: Object.freeze([...categoryRegistry.values()].sort((a, b) => a.categoryId.localeCompare(b.categoryId))),
    statusTypes: Object.freeze([...statusRegistry.values()].sort((a, b) => a.statusId.localeCompare(b.statusId))),
    importanceLevels: Object.freeze(
      [...importanceRegistry.values()].sort((a, b) => a.rank - b.rank)
    ),
    metadataExtensions: Object.freeze(
      [...metadataExtensionRegistry.values()].sort((a, b) => a.extensionId.localeCompare(b.extensionId))
    ),
    futureExtensions: Object.freeze(
      [...futureExtensionRegistry.values()].sort((a, b) => a.extensionId.localeCompare(b.extensionId))
    ),
    readOnly: true as const,
  });
}

export function getBusinessTimelineRegistrySnapshot(): BusinessTimelineRegistrySnapshot {
  return Object.freeze({
    registryVersion: BUSINESS_TIMELINE_REGISTRY_VERSION,
    timelineCount: timelineRegistry.size,
    timelineIds: listBusinessTimelineIds(),
    eventTypeCount: eventTypeRegistry.size,
    categoryCount: categoryRegistry.size,
    statusTypeCount: statusRegistry.size,
    importanceTypeCount: importanceRegistry.size,
    metadataExtensionCount: metadataExtensionRegistry.size,
    futureExtensionCount: futureExtensionRegistry.size,
    readOnly: true as const,
  });
}

export function seedDefaultBusinessRegistry(): void {
  if (categoryRegistry.size === 0) {
    for (const categoryId of BUSINESS_TIMELINE_CATEGORY_KEYS) {
      registerBusinessCategory(
        Object.freeze({
          categoryId,
          label: categoryId.replace(/_/g, " "),
          description: `Canonical ${categoryId} business event category.`,
        })
      );
    }
  }
  if (statusRegistry.size === 0) {
    for (const statusId of BUSINESS_TIMELINE_STATUS_KEYS) {
      registerBusinessStatusType(
        Object.freeze({
          statusId,
          label: statusId.replace(/_/g, " "),
          description: `Canonical ${statusId} business event status.`,
          terminal: statusId === "cancelled" || statusId === "archived",
        })
      );
    }
  }
  if (importanceRegistry.size === 0) {
    const ranks: Record<(typeof BUSINESS_TIMELINE_IMPORTANCE_KEYS)[number], number> = {
      low: 1,
      medium: 2,
      high: 3,
      critical: 4,
    };
    for (const importanceId of BUSINESS_TIMELINE_IMPORTANCE_KEYS) {
      registerBusinessImportanceLevel(
        Object.freeze({
          importanceId,
          label: importanceId.replace(/_/g, " "),
          description: `Canonical ${importanceId} business event importance.`,
          rank: ranks[importanceId],
        })
      );
    }
  }
}

export const BusinessTimelineRegistry = Object.freeze({
  registerBusinessTimeline,
  registerBusinessEventType,
  registerBusinessCategory,
  registerBusinessStatusType,
  registerBusinessImportanceLevel,
  registerMetadataExtension,
  registerFutureExtension,
  getBusinessTimeline,
  getBusinessTimelineRegistry,
  getBusinessTimelineRegistrySnapshot,
  listBusinessTimelineIds,
  seedDefaultBusinessRegistry,
  resetBusinessTimelineRegistryForTests,
  version: BUSINESS_TIMELINE_REGISTRY_VERSION,
});
