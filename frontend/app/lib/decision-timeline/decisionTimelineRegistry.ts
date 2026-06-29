/**
 * APP-6:1 — Decision Timeline registry.
 * Metadata registration only — no storage, analytics, or execution.
 */

import {
  DECISION_TIMELINE_CATEGORY_KEYS,
  DECISION_TIMELINE_DEFAULT_LIMITS,
  DECISION_TIMELINE_STATUS_KEYS,
} from "./decisionTimelineConstants.ts";
import type {
  DecisionCategoryRegistration,
  DecisionFutureExtensionRegistration,
  DecisionMetadataExtensionRegistration,
  DecisionPlatformResult,
  DecisionStatusRegistration,
  DecisionTimelineRegistrySnapshot,
  DecisionType,
  DecisionTypeId,
  DecisionTypeRegistration,
} from "./decisionTimelineTypes.ts";
import {
  validateDecisionTypeRegistration,
  validateMetadataExtensionRegistration,
} from "./decisionTimelineValidation.ts";

export const DECISION_TIMELINE_REGISTRY_VERSION = "APP-6/1-REGISTRY-1" as const;

const decisionTypeRegistry = new Map<DecisionTypeId, DecisionType>();
const categoryRegistry = new Map<string, DecisionCategoryRegistration>();
const statusRegistry = new Map<string, DecisionStatusRegistration>();
const metadataExtensionRegistry = new Map<string, DecisionMetadataExtensionRegistration>();
const futureExtensionRegistry = new Map<string, DecisionFutureExtensionRegistration>();

function createResult<T>(success: boolean, reason: string, data: T | null): DecisionPlatformResult<T> {
  return Object.freeze({ success, reason, data, readOnly: true as const });
}

function freezeDecisionType(entry: DecisionType): DecisionType {
  return Object.freeze({
    ...entry,
    supportedStatuses: Object.freeze([...entry.supportedStatuses]),
    supportedCategories: Object.freeze([...entry.supportedCategories]),
    supportedEventTypes: Object.freeze([...entry.supportedEventTypes]),
    metadata: Object.freeze({ ...entry.metadata }),
    readOnly: true as const,
  });
}

export function resetDecisionTimelineRegistryForTests(): void {
  decisionTypeRegistry.clear();
  categoryRegistry.clear();
  statusRegistry.clear();
  metadataExtensionRegistry.clear();
  futureExtensionRegistry.clear();
}

export function registerDecisionType(
  input: DecisionTypeRegistration,
  registeredAt: string = new Date(0).toISOString()
): DecisionPlatformResult<DecisionType> {
  const validation = validateDecisionTypeRegistration(input);
  if (!validation.valid) {
    return createResult(false, validation.issues.map((entry) => entry.message).join("; "), null);
  }
  if (decisionTypeRegistry.has(input.typeId)) {
    return createResult(false, `Decision type already registered: ${input.typeId}.`, null);
  }
  if (decisionTypeRegistry.size >= DECISION_TIMELINE_DEFAULT_LIMITS.maxRegisteredDecisionTypes) {
    return createResult(false, "Decision type registry limit reached.", null);
  }

  const decisionType = freezeDecisionType(
    Object.freeze({
      typeId: input.typeId,
      label: input.label.trim(),
      description: input.description.trim(),
      supportedStatuses: Object.freeze([...input.supportedStatuses]),
      supportedCategories: Object.freeze([...input.supportedCategories]),
      supportedEventTypes: Object.freeze([...input.supportedEventTypes]),
      metadata: Object.freeze({ ...(input.metadata ?? Object.freeze({})) }),
      registeredAt,
      readOnly: true as const,
    })
  );
  decisionTypeRegistry.set(decisionType.typeId, decisionType);
  return createResult(true, "Decision type registered.", decisionType);
}

export function registerDecisionCategory(
  input: DecisionCategoryRegistration
): DecisionPlatformResult<DecisionCategoryRegistration> {
  if (!input.categoryId || !input.label.trim()) {
    return createResult(false, "categoryId and label are required.", null);
  }
  if (categoryRegistry.has(input.categoryId)) {
    return createResult(false, `Decision category already registered: ${input.categoryId}.`, null);
  }
  if (categoryRegistry.size >= DECISION_TIMELINE_DEFAULT_LIMITS.maxRegisteredCategories) {
    return createResult(false, "Decision category registry limit reached.", null);
  }
  const entry = Object.freeze({ ...input });
  categoryRegistry.set(entry.categoryId, entry);
  return createResult(true, "Decision category registered.", entry);
}

export function registerDecisionStatusType(
  input: DecisionStatusRegistration
): DecisionPlatformResult<DecisionStatusRegistration> {
  if (!input.statusId || !input.label.trim()) {
    return createResult(false, "statusId and label are required.", null);
  }
  if (statusRegistry.has(input.statusId)) {
    return createResult(false, `Decision status already registered: ${input.statusId}.`, null);
  }
  if (statusRegistry.size >= DECISION_TIMELINE_DEFAULT_LIMITS.maxRegisteredStatusTypes) {
    return createResult(false, "Decision status registry limit reached.", null);
  }
  const entry = Object.freeze({ ...input });
  statusRegistry.set(entry.statusId, entry);
  return createResult(true, "Decision status registered.", entry);
}

export function registerMetadataExtension(
  input: DecisionMetadataExtensionRegistration
): DecisionPlatformResult<DecisionMetadataExtensionRegistration> {
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
  input: DecisionFutureExtensionRegistration
): DecisionPlatformResult<DecisionFutureExtensionRegistration> {
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

export function getDecisionType(typeId: DecisionTypeId): DecisionType | null {
  return decisionTypeRegistry.get(typeId) ?? null;
}

export function getDecisionTimelineRegistry(): Readonly<{
  decisionTypes: readonly DecisionType[];
  categories: readonly DecisionCategoryRegistration[];
  statusTypes: readonly DecisionStatusRegistration[];
  metadataExtensions: readonly DecisionMetadataExtensionRegistration[];
  futureExtensions: readonly DecisionFutureExtensionRegistration[];
  readOnly: true;
}> {
  return Object.freeze({
    decisionTypes: Object.freeze(
      [...decisionTypeRegistry.values()]
        .sort((left, right) => left.typeId.localeCompare(right.typeId))
        .map((entry) => freezeDecisionType(entry))
    ),
    categories: Object.freeze(
      [...categoryRegistry.values()].sort((left, right) => left.categoryId.localeCompare(right.categoryId))
    ),
    statusTypes: Object.freeze(
      [...statusRegistry.values()].sort((left, right) => left.statusId.localeCompare(right.statusId))
    ),
    metadataExtensions: Object.freeze(
      [...metadataExtensionRegistry.values()].sort((left, right) =>
        left.extensionId.localeCompare(right.extensionId)
      )
    ),
    futureExtensions: Object.freeze(
      [...futureExtensionRegistry.values()].sort((left, right) => left.extensionId.localeCompare(right.extensionId))
    ),
    readOnly: true as const,
  });
}

export function listDecisionTypeIds(): readonly DecisionTypeId[] {
  return Object.freeze([...decisionTypeRegistry.keys()].sort((left, right) => left.localeCompare(right)));
}

export function getDecisionTimelineRegistrySnapshot(): DecisionTimelineRegistrySnapshot {
  return Object.freeze({
    registryVersion: DECISION_TIMELINE_REGISTRY_VERSION,
    decisionTypeCount: decisionTypeRegistry.size,
    decisionTypeIds: listDecisionTypeIds(),
    categoryCount: categoryRegistry.size,
    statusTypeCount: statusRegistry.size,
    metadataExtensionCount: metadataExtensionRegistry.size,
    futureExtensionCount: futureExtensionRegistry.size,
    readOnly: true as const,
  });
}

export function seedDefaultDecisionRegistry(): void {
  if (categoryRegistry.size === 0) {
    for (const categoryId of DECISION_TIMELINE_CATEGORY_KEYS) {
      registerDecisionCategory(
        Object.freeze({
          categoryId,
          label: categoryId.replace(/_/g, " "),
          description: `Canonical ${categoryId} decision category.`,
        })
      );
    }
  }
  if (statusRegistry.size === 0) {
    for (const statusId of DECISION_TIMELINE_STATUS_KEYS) {
      registerDecisionStatusType(
        Object.freeze({
          statusId,
          label: statusId.replace(/_/g, " "),
          description: `Canonical ${statusId} decision status.`,
          terminal: statusId === "revoked" || statusId === "superseded",
        })
      );
    }
  }
}

export const DecisionTimelineRegistry = Object.freeze({
  registerDecisionType,
  registerDecisionCategory,
  registerDecisionStatusType,
  registerMetadataExtension,
  registerFutureExtension,
  getDecisionType,
  getDecisionTimelineRegistry,
  getDecisionTimelineRegistrySnapshot,
  listDecisionTypeIds,
  seedDefaultDecisionRegistry,
  resetDecisionTimelineRegistryForTests,
  version: DECISION_TIMELINE_REGISTRY_VERSION,
});
