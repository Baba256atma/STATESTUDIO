import { TimelineVisualizationRegistryPlatform } from "./timelineVisualizationRegistry.ts";
import type {
  TimelineVisualizationModelDescriptor,
  TimelineVisualizationModelName,
} from "./timelineVisualizationModelTypes.ts";

const descriptorSeeds: readonly [TimelineVisualizationModelName, number, readonly string[]][] =
  Object.freeze([
    ["TimelineModel", 0, ["identityReference", "axisReference", "collectionReferences"]],
    ["TimelineIdentityModel", 0, ["identityType", "canonicalOwner"]],
    ["TimeAxisModel", 1, ["axisType", "rangeReference"]],
    ["TimePointModel", 2, ["pointType", "axisReference"]],
    ["TimeRangeModel", 3, ["rangeType", "startReference", "endReference"]],
    ["TemporalEventModel", 4, ["eventType", "timeReference"]],
    ["TemporalMarkerModel", 5, ["markerType", "positionReference"]],
    ["TemporalSegmentModel", 6, ["segmentType", "rangeReference"]],
    ["TimelineLayerModel", 7, ["layerType", "contentReferences"]],
    ["PlaybackIntentModel", 8, ["intentType", "positionReference"]],
    ["PlaybackPositionModel", 9, ["positionType", "timePointReference"]],
    ["ScenarioTimelineModel", 10, ["scenarioType", "eventReferences"]],
    ["HistoricalTimelineModel", 11, ["historyType", "historicalReferences"]],
    ["ForecastTimelineModel", 12, ["forecastType", "forecastReferences"]],
    ["DecisionMomentModel", 13, ["momentType", "timePointReference"]],
    ["TimelineViewModel", 14, ["viewType", "timelineReference"]],
    ["TimelineOutputModel", 15, ["outputType", "viewReference"]],
    ["TemporalExtensionPointModel", 17, ["extensionType", "compatibilityReference"]],
  ]);

const registry = TimelineVisualizationRegistryPlatform;

export const TimelineVisualizationModelDescriptors:
readonly TimelineVisualizationModelDescriptor[] = Object.freeze(
  descriptorSeeds.map(([canonicalName, categoryIndex, structuralMetadata], index) => {
    const category = registry.catalog[categoryIndex]!;
    return Object.freeze({
      id: `EVE-4:3/Model/${canonicalName}`,
      canonicalName,
      registryReference: category,
      namespace: `nexora.eve.timeline-visualization.model.${canonicalName.toLowerCase()}`,
      version: "1.0.0",
      ownershipReference: registry.metadata.ownership,
      lifecycleReference: registry.foundation.lifecycle,
      capabilityReferences: registry.foundation.capabilities,
      structuralMetadata: Object.freeze(structuralMetadata),
      boundaryReferences: registry.foundation.boundaries,
      compatibilityMetadata: Object.freeze({ registryCompatible: true }),
      extensionMetadata: Object.freeze({ classification: `${category.key}Extension` }),
      deterministicOrder: index + 1,
      stability: "Stable",
      executableBehavior: false,
      metadataOnly: true,
      immutable: true,
    });
  }),
);

const compositionNames = Object.freeze([
  "Timeline root", "Identity", "Time axis", "Time point collection",
  "Time range collection", "Temporal event collection", "Marker collection",
  "Segment collection", "Layer collection", "Playback metadata",
  "Scenario references", "Historical references", "Forecast references",
  "Decision references", "Timeline view", "Timeline output",
] as const);

export const TimelineVisualizationStructuralComposition = Object.freeze(
  compositionNames.map((name, index) => Object.freeze({
    id: `EVE-4:3/Composition/${name.replaceAll(" ", "")}`,
    name,
    modelReference: TimelineVisualizationModelDescriptors[index]!,
    deterministicOrder: index + 1,
    executionProvided: false,
    metadataOnly: true,
    immutable: true,
  })),
);
