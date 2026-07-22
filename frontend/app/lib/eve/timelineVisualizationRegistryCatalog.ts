import { TimelineVisualizationFoundationPlatform } from "./timelineVisualizationFoundation.ts";
import type {
  TimelineVisualizationRegistryCategory,
  TimelineVisualizationRegistryEntry,
} from "./timelineVisualizationRegistryTypes.ts";

const categorySeeds = Object.freeze([
  ["TimelineIdentityTypes", "Timeline Identity Types", ["Master Timeline", "Executive Timeline", "Scenario Timeline", "Historical Timeline", "Forecast Timeline"]],
  ["TimeAxisTypes", "Time Axis Types", ["Absolute", "Relative", "Continuous", "Discrete", "Hybrid"]],
  ["TimePointTypes", "Time Point Types", ["Instant", "Milestone", "Decision Point", "Event Point", "Snapshot"]],
  ["TimeRangeTypes", "Time Range Types", ["Hour", "Day", "Week", "Month", "Quarter", "Year", "Custom Range"]],
  ["TemporalEventTypes", "Temporal Event Types", ["Decision", "Approval", "Risk", "KPI Change", "Milestone", "Alert", "Review", "Simulation Event"]],
  ["TemporalMarkerTypes", "Temporal Marker Types", ["Current", "Baseline", "Forecast", "Historical", "Target", "Deadline"]],
  ["TemporalSegmentTypes", "Temporal Segment Types", ["Interval", "Phase", "Period"]],
  ["TimelineLayerTypes", "Timeline Layer Types", ["Primary", "Reference", "Comparison"]],
  ["PlaybackIntentTypes", "Playback Intent Types", ["Step", "Play", "Pause", "Resume", "Stop", "Replay", "Jump", "Compare"]],
  ["PlaybackPositionTypes", "Playback Position Types", ["Start", "Current", "End"]],
  ["ScenarioTimelineTypes", "Scenario Timeline Types", ["Baseline Scenario", "Alternative Scenario", "Comparison Scenario"]],
  ["HistoricalTimelineTypes", "Historical Timeline Types", ["Recorded History", "Decision History", "Outcome History"]],
  ["ForecastTimelineTypes", "Forecast Timeline Types", ["Near Term", "Medium Term", "Long Term"]],
  ["DecisionMomentTypes", "Decision Moment Types", ["Observation", "Analysis", "Decision", "Approval", "Execution", "Review"]],
  ["TimelineViewTypes", "Timeline View Types", ["Linear", "Layered", "Comparative"]],
  ["TimelineOutputTypes", "Timeline Output Types", ["Scene Reference", "Viewport Reference", "Publication Reference"]],
  ["TemporalPolicyTypes", "Temporal Policy Types", ["Identity", "Ordering", "Compatibility"]],
  ["TemporalExtensionPointTypes", "Temporal Extension Point Types", ["Vocabulary", "Metadata", "Publication"]],
] as const);

const foundation = TimelineVisualizationFoundationPlatform;

export const TimelineVisualizationRegistryCatalog:
readonly TimelineVisualizationRegistryCategory[] = Object.freeze(
  categorySeeds.map(([key, name, vocabulary], categoryIndex) => {
    const contract = foundation.contracts[categoryIndex]!;
    const entries: readonly TimelineVisualizationRegistryEntry[] = Object.freeze(
      vocabulary.map((entryName, entryIndex) => Object.freeze({
        id: `EVE-4:2/Entry/${key}/${entryName.replaceAll(" ", "")}`,
        key: entryName.replaceAll(" ", ""),
        name: entryName,
        description: `Descriptive ${name} vocabulary: ${entryName}.`,
        category: key,
        foundationContractReference: contract,
        ownershipReference: foundation.ownership,
        boundaryReferences: foundation.boundaries,
        lifecycleApplicability: foundation.lifecycle.states,
        capabilityReferences: foundation.capabilities,
        stability: "Stable",
        version: "1.0.0",
        extensionClassification: `${key}Extension`,
        deterministicOrder: entryIndex + 1,
        executable: false,
        metadataOnly: true,
        immutable: true,
      })),
    );
    return Object.freeze({
      id: `EVE-4:2/Category/${key}`,
      key,
      name,
      description: `Canonical registry category for ${name}.`,
      foundationContractReference: contract,
      deterministicOrder: categoryIndex + 1,
      entries,
      extensionEligible: true,
      stability: "Stable",
      metadataOnly: true,
      immutable: true,
    });
  }),
);
