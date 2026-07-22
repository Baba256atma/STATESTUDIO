export type TimelineVisualizationContractName =
  | "TimelineContract" | "TimeAxisContract" | "TimePointContract"
  | "TimeRangeContract" | "TemporalEventContract" | "TemporalMarkerContract"
  | "TemporalSegmentContract" | "TimelineLayerContract" | "PlaybackIntentContract"
  | "PlaybackPositionContract" | "ScenarioTimelineContract"
  | "HistoricalTimelineContract" | "ForecastTimelineContract"
  | "DecisionMomentContract" | "TimelineViewContract" | "TimelineOutputContract"
  | "TemporalVisualizationPolicyContract" | "TemporalExtensionPointContract";

export type TimelineVisualizationLifecycleState =
  | "Declared" | "Designed" | "Approved" | "Frozen" | "Released";

export interface TimelineVisualizationContractDeclaration {
  readonly id: `EVE-4:1/Contract/${TimelineVisualizationContractName}`;
  readonly name: TimelineVisualizationContractName;
  readonly canonicalName: string;
  readonly description: string;
  readonly fields: readonly string[];
  readonly deterministicOrder: number;
  readonly runtimeBehavior: "None";
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface TimelineVisualizationBoundaryDeclaration {
  readonly id: `EVE-4:1/Boundary/${string}`;
  readonly name: string;
  readonly description: string;
  readonly ownership: "Excluded";
  readonly deterministicOrder: number;
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface TimelineVisualizationCapabilityDeclaration {
  readonly id: `EVE-4:1/Capability/${string}`;
  readonly name: string;
  readonly description: string;
  readonly deterministicOrder: number;
  readonly executionProvided: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}
