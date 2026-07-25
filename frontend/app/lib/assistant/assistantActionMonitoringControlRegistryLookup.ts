/** ASSISTANT-9:2 — Immutable registry lookup metadata maps. */
import {
  AssistantActionMonitoringControlRegistryCollections,
  AssistantActionMonitoringControlRegistryEntries,
} from "./assistantActionMonitoringControlRegistryEntries.ts";
import type {
  AssistantActionMonitoringControlRegistryEntry,
  AssistantActionMonitoringControlRegistryLookupMap,
} from "./assistantActionMonitoringControlRegistryTypes.ts";

const byIdEntries = AssistantActionMonitoringControlRegistryEntries.map(
  (entry) => [entry.id, entry] as const,
);

const byGroupAndNameEntries =
  AssistantActionMonitoringControlRegistryEntries.map(
    (entry) =>
      [`${entry.registryGroup}:${entry.canonicalName}`, entry] as const,
  );

export const AssistantActionMonitoringControlRegistryLookupById:
AssistantActionMonitoringControlRegistryLookupMap = Object.freeze(
  Object.fromEntries(byIdEntries),
);

export const AssistantActionMonitoringControlRegistryLookupByGroupAndName:
AssistantActionMonitoringControlRegistryLookupMap = Object.freeze(
  Object.fromEntries(byGroupAndNameEntries),
);

export const AssistantActionMonitoringControlRegistryLookupByGroup =
  Object.freeze(
    Object.fromEntries(
      Object.entries(AssistantActionMonitoringControlRegistryCollections).map(
        ([groupKey, entries]) => [
          groupKey,
          Object.freeze(
            Object.fromEntries(
              entries.map((entry) => [entry.canonicalName, entry] as const),
            ),
          ),
        ],
      ),
    ),
  );

export const AssistantActionMonitoringControlRegistryLookup = Object.freeze({
  byId: AssistantActionMonitoringControlRegistryLookupById,
  byGroupAndName:
    AssistantActionMonitoringControlRegistryLookupByGroupAndName,
  byGroup: AssistantActionMonitoringControlRegistryLookupByGroup,
  resolveById: (
    id: string,
  ): AssistantActionMonitoringControlRegistryEntry | undefined =>
    AssistantActionMonitoringControlRegistryLookupById[id],
  resolveByGroupAndName: (
    registryGroup: string,
    canonicalName: string,
  ): AssistantActionMonitoringControlRegistryEntry | undefined =>
    AssistantActionMonitoringControlRegistryLookupByGroupAndName[
      `${registryGroup}:${canonicalName}`
    ],
  metadataOnly: true,
  immutable: true,
  executable: false,
} as const);
