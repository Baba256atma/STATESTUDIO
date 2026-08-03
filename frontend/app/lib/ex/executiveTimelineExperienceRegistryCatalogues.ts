import type {
  ExecutiveTimelineExperienceRegistryCatalogue,
  ExecutiveTimelineExperienceRegistryCatalogueKind,
  ExecutiveTimelineExperienceRegistryEntry,
} from "./executiveTimelineExperienceRegistryTypes.ts";

const entry = (
  kind: ExecutiveTimelineExperienceRegistryCatalogueKind,
  name: string,
  order: number,
  aliases: readonly string[] = [],
): ExecutiveTimelineExperienceRegistryEntry =>
  Object.freeze({
    entryId: `EX-3:2/${kind}/${name}`,
    name,
    order,
    aliases: Object.freeze([...aliases]),
    catalogueKind: kind,
    metadataOnly: true as const,
    immutable: true as const,
  });

const catalogue = (
  kind: ExecutiveTimelineExperienceRegistryCatalogueKind,
  order: number,
  names: readonly string[],
): ExecutiveTimelineExperienceRegistryCatalogue => {
  const entries = Object.freeze(
    names.map((name, index) => entry(kind, name, index + 1)),
  );
  return Object.freeze({
    catalogueId: `EX-3:2/Catalogue/${kind}`,
    kind,
    order,
    entryCount: entries.length,
    entries,
    metadataOnly: true as const,
    immutable: true as const,
    deterministic: true as const,
  });
};

export const ExecutiveTimelineExperienceRegistryEventTypes = catalogue(
  "EventTypes",
  1,
  [
    "WorkspaceChanged",
    "DecisionCreated",
    "ScenarioOpened",
    "JournalOpened",
    "ObjectSelected",
    "ObjectUpdated",
    "AlertRaised",
    "KPIChanged",
    "GoalUpdated",
    "TimelineMoved",
    "PlaybackStarted",
    "PlaybackStopped",
  ],
);

export const ExecutiveTimelineExperienceRegistryNavigationModes = catalogue(
  "NavigationModes",
  2,
  [
    "Past",
    "Present",
    "Future",
    "Live",
    "Replay",
    "Compare",
    "Follow",
    "Manual",
  ],
);

export const ExecutiveTimelineExperienceRegistryMarkerTypes = catalogue(
  "MarkerTypes",
  3,
  [
    "Decision",
    "Event",
    "Alert",
    "Workspace",
    "Goal",
    "Milestone",
    "Pack",
    "Journal",
    "Object",
    "Snapshot",
  ],
);

export const ExecutiveTimelineExperienceRegistryPlaybackStates = catalogue(
  "PlaybackStates",
  4,
  ["Idle", "Playing", "Paused", "Seeking", "Completed", "Disabled"],
);

export const ExecutiveTimelineExperienceRegistrySynchronizationModes = catalogue(
  "SynchronizationModes",
  5,
  [
    "JournalSync",
    "WorkspaceSync",
    "StageSync",
    "ObjectSync",
    "GlobalSync",
    "NoneSync",
  ],
);

export const ExecutiveTimelineExperienceRegistryViewModes = catalogue(
  "ViewModes",
  6,
  [
    "Linear",
    "Curved",
    "Compact",
    "Expanded",
    "Executive",
    "Focus",
    "Overview",
    "Detail",
  ],
);

export const ExecutiveTimelineExperienceRegistryInteractionTypes = catalogue(
  "InteractionTypes",
  7,
  [
    "Click",
    "DoubleClick",
    "Drag",
    "Drop",
    "Scroll",
    "Zoom",
    "Select",
    "Hover",
    "Pin",
    "Inspect",
  ],
);

export const ExecutiveTimelineExperienceRegistryReadinessStates = catalogue(
  "ReadinessStates",
  8,
  ["Draft", "Registry", "Model", "Released", "Archived"],
);

export const ExecutiveTimelineExperienceRegistryCatalogues = Object.freeze([
  ExecutiveTimelineExperienceRegistryEventTypes,
  ExecutiveTimelineExperienceRegistryNavigationModes,
  ExecutiveTimelineExperienceRegistryMarkerTypes,
  ExecutiveTimelineExperienceRegistryPlaybackStates,
  ExecutiveTimelineExperienceRegistrySynchronizationModes,
  ExecutiveTimelineExperienceRegistryViewModes,
  ExecutiveTimelineExperienceRegistryInteractionTypes,
  ExecutiveTimelineExperienceRegistryReadinessStates,
] as const);

export const ExecutiveTimelineExperienceRegistryAllEntries = Object.freeze(
  ExecutiveTimelineExperienceRegistryCatalogues.flatMap(
    (item) => item.entries,
  ),
);

export const lookupExecutiveTimelineExperienceRegistryEntry = (
  value: unknown,
): ExecutiveTimelineExperienceRegistryEntry | null => {
  if (typeof value !== "string" || value.length === 0 || value !== value.trim()) {
    return null;
  }
  for (const candidate of ExecutiveTimelineExperienceRegistryAllEntries) {
    if (candidate.entryId === value || candidate.name === value) {
      return candidate;
    }
    if (candidate.aliases.some((alias) => alias === value)) {
      return candidate;
    }
  }
  return null;
};
