/**
 * APP-5:1 — Scenario Timeline type registry.
 * Metadata registration only — no timeline execution or persistence.
 */

import { SCENARIO_TIMELINE_DEFAULT_LIMITS, SCENARIO_TIMELINE_LIFECYCLE_STAGE_KEYS } from "./scenarioTimelinePlatformConstants.ts";
import type {
  ScenarioTimelinePlatformResult,
  ScenarioTimelineRegistrySnapshot,
  ScenarioTimelineType,
  ScenarioTimelineTypeId,
  ScenarioTimelineTypeRegistration,
} from "./scenarioTimelinePlatformTypes.ts";
import { validateTimelineTypeRegistration } from "./scenarioTimelinePlatformValidation.ts";

export const SCENARIO_TIMELINE_REGISTRY_VERSION = "APP-5/1-REGISTRY-1" as const;

const registry = new Map<ScenarioTimelineTypeId, ScenarioTimelineType>();

function createResult<T>(success: boolean, reason: string, data: T | null): ScenarioTimelinePlatformResult<T> {
  return Object.freeze({ success, reason, data, readOnly: true as const });
}

function freezeTimelineType(entry: ScenarioTimelineType): ScenarioTimelineType {
  return Object.freeze({
    ...entry,
    supportedLifecycleStages: Object.freeze([...entry.supportedLifecycleStages]),
    supportedEventTypes: Object.freeze([...entry.supportedEventTypes]),
    metadata: Object.freeze({ ...entry.metadata }),
    readOnly: true as const,
  });
}

export function resetScenarioTimelineRegistryForTests(): void {
  registry.clear();
}

export function registerTimelineType(
  input: ScenarioTimelineTypeRegistration,
  registeredAt: string = new Date(0).toISOString()
): ScenarioTimelinePlatformResult<ScenarioTimelineType> {
  const validation = validateTimelineTypeRegistration(input);
  if (!validation.valid) {
    return createResult(false, validation.issues.map((entry) => entry.message).join("; "), null);
  }
  if (registry.has(input.typeId)) {
    return createResult(false, `Timeline type already registered: ${input.typeId}.`, null);
  }
  if (registry.size >= SCENARIO_TIMELINE_DEFAULT_LIMITS.maxRegisteredTimelineTypes) {
    return createResult(false, "Timeline type registry limit reached.", null);
  }

  const timelineType = freezeTimelineType(
    Object.freeze({
      typeId: input.typeId,
      label: input.label.trim(),
      description: input.description.trim(),
      supportedLifecycleStages: Object.freeze([...input.supportedLifecycleStages]),
      supportedEventTypes: Object.freeze([...input.supportedEventTypes]),
      metadata: Object.freeze({ ...(input.metadata ?? Object.freeze({})) }),
      registeredAt,
      readOnly: true as const,
    })
  );
  registry.set(timelineType.typeId, timelineType);
  return createResult(true, "Timeline type registered.", timelineType);
}

export function getTimelineType(typeId: ScenarioTimelineTypeId): ScenarioTimelineType | null {
  return registry.get(typeId) ?? null;
}

export function getTimelineRegistry(): readonly ScenarioTimelineType[] {
  return Object.freeze(
    [...registry.values()]
      .sort((left, right) => left.typeId.localeCompare(right.typeId))
      .map((entry) => freezeTimelineType(entry))
  );
}

export function isTimelineTypeRegistered(typeId: ScenarioTimelineTypeId): boolean {
  return registry.has(typeId);
}

export function listTimelineTypeIds(): readonly ScenarioTimelineTypeId[] {
  return Object.freeze([...registry.keys()].sort((left, right) => left.localeCompare(right)));
}

export function getTimelineRegistrySnapshot(): ScenarioTimelineRegistrySnapshot {
  return Object.freeze({
    registryVersion: SCENARIO_TIMELINE_REGISTRY_VERSION,
    timelineTypeCount: registry.size,
    timelineTypeIds: listTimelineTypeIds(),
    readOnly: true as const,
  });
}

export function getTimelineRegistryMetadata(): Readonly<{
  registryVersion: typeof SCENARIO_TIMELINE_REGISTRY_VERSION;
  timelineTypeCount: number;
  supportedLifecycleStages: typeof SCENARIO_TIMELINE_LIFECYCLE_STAGE_KEYS;
}> {
  return Object.freeze({
    registryVersion: SCENARIO_TIMELINE_REGISTRY_VERSION,
    timelineTypeCount: registry.size,
    supportedLifecycleStages: SCENARIO_TIMELINE_LIFECYCLE_STAGE_KEYS,
  });
}

export const ScenarioTimelinePlatformRegistry = Object.freeze({
  registerTimelineType,
  getTimelineType,
  getTimelineRegistry,
  isTimelineTypeRegistered,
  listTimelineTypeIds,
  getTimelineRegistrySnapshot,
  getTimelineRegistryMetadata,
  resetScenarioTimelineRegistryForTests,
  version: SCENARIO_TIMELINE_REGISTRY_VERSION,
});
