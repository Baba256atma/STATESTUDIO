import { TimelineVisualizationRegistryPlatform } from "./timelineVisualizationRegistry.ts";
import type {
  TimelineVisualizationModelName,
  TimelineVisualizationModelRelationship,
} from "./timelineVisualizationModelTypes.ts";

const relationshipSeeds: readonly [TimelineVisualizationModelName,
  TimelineVisualizationModelName, string][] = Object.freeze([
  ["TimelineModel", "TimelineIdentityModel", "identityReference"],
  ["TimelineModel", "TimeAxisModel", "axisReference"],
  ["TimelineModel", "TimePointModel", "timePointReferences"],
  ["TimelineModel", "TimeRangeModel", "timeRangeReferences"],
  ["TimelineModel", "TemporalEventModel", "eventReferences"],
  ["TimelineModel", "TemporalMarkerModel", "markerReferences"],
  ["TimelineModel", "TemporalSegmentModel", "segmentReferences"],
  ["TimelineModel", "TimelineLayerModel", "layerReferences"],
  ["TimelineModel", "PlaybackIntentModel", "playbackIntentReference"],
  ["PlaybackIntentModel", "PlaybackPositionModel", "positionReference"],
  ["TimelineModel", "ScenarioTimelineModel", "scenarioReferences"],
  ["TimelineModel", "HistoricalTimelineModel", "historicalReferences"],
  ["TimelineModel", "ForecastTimelineModel", "forecastReferences"],
  ["TimelineModel", "DecisionMomentModel", "decisionReferences"],
  ["TimelineModel", "TimelineViewModel", "viewReference"],
  ["TimelineModel", "TimelineOutputModel", "outputReference"],
]);

export const TimelineVisualizationModelRelationships:
readonly TimelineVisualizationModelRelationship[] = Object.freeze(
  relationshipSeeds.map(([sourceModel, targetModel, referenceField], index) => Object.freeze({
    id: `EVE-4:3/Relationship/${sourceModel}-${targetModel}`,
    sourceModel,
    targetModel,
    referenceField,
    registryReference: TimelineVisualizationRegistryPlatform.metadata.id,
    deterministicOrder: index + 1,
    schedulingProvided: false,
    playbackExecutionProvided: false,
    inferenceProvided: false,
    metadataOnly: true,
    immutable: true,
  })),
);
