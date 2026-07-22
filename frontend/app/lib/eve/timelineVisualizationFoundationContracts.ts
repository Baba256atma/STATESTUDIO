import type {
  TimelineVisualizationContractDeclaration,
  TimelineVisualizationContractName,
} from "./timelineVisualizationFoundationTypes.ts";

const contractSeeds = Object.freeze([
  ["TimelineContract", "Timeline Contract", ["identityReference", "axisReference", "layerReferences"]],
  ["TimeAxisContract", "Time Axis Contract", ["scaleIntent", "direction", "rangeReference"]],
  ["TimePointContract", "Time Point Contract", ["valueReference", "axisReference", "precision"]],
  ["TimeRangeContract", "Time Range Contract", ["startReference", "endReference", "inclusivity"]],
  ["TemporalEventContract", "Temporal Event Contract", ["timeReference", "labelReference", "stateReference"]],
  ["TemporalMarkerContract", "Temporal Marker Contract", ["positionReference", "markerIntent"]],
  ["TemporalSegmentContract", "Temporal Segment Contract", ["rangeReference", "sequenceReference"]],
  ["TimelineLayerContract", "Timeline Layer Contract", ["timelineReference", "order", "contentReferences"]],
  ["PlaybackIntentContract", "Playback Intent Contract", ["positionReference", "direction", "rateIntent"]],
  ["PlaybackPositionContract", "Playback Position Contract", ["timePointReference", "state"]],
  ["ScenarioTimelineContract", "Scenario Timeline Contract", ["scenarioReference", "eventReferences"]],
  ["HistoricalTimelineContract", "Historical Timeline Contract", ["historicalReferences", "rangeReference"]],
  ["ForecastTimelineContract", "Forecast Timeline Contract", ["forecastReferences", "rangeReference"]],
  ["DecisionMomentContract", "Decision Moment Contract", ["decisionReference", "timePointReference"]],
  ["TimelineViewContract", "Timeline View Contract", ["timelineReference", "viewportIntent"]],
  ["TimelineOutputContract", "Timeline Output Contract", ["viewReference", "targetReference"]],
  ["TemporalVisualizationPolicyContract", "Temporal Visualization Policy Contract", ["policyIntent", "scope"]],
  ["TemporalExtensionPointContract", "Temporal Extension Point Contract", ["extensionType", "compatibilityReference"]],
] as const satisfies readonly [TimelineVisualizationContractName, string, readonly string[]][]);

export const TimelineVisualizationFoundationContracts:
readonly TimelineVisualizationContractDeclaration[] = Object.freeze(
  contractSeeds.map(([name, canonicalName, fields], index) => Object.freeze({
    id: `EVE-4:1/Contract/${name}`,
    name,
    canonicalName,
    description: `Immutable metadata contract for ${canonicalName}.`,
    fields: Object.freeze(fields),
    deterministicOrder: index + 1,
    runtimeBehavior: "None",
    metadataOnly: true,
    immutable: true,
  })),
);
