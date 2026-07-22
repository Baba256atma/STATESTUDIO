export type TimelineVisualizationModelName =
  | "TimelineModel" | "TimelineIdentityModel" | "TimeAxisModel" | "TimePointModel"
  | "TimeRangeModel" | "TemporalEventModel" | "TemporalMarkerModel"
  | "TemporalSegmentModel" | "TimelineLayerModel" | "PlaybackIntentModel"
  | "PlaybackPositionModel" | "ScenarioTimelineModel" | "HistoricalTimelineModel"
  | "ForecastTimelineModel" | "DecisionMomentModel" | "TimelineViewModel"
  | "TimelineOutputModel" | "TemporalExtensionPointModel";

export interface TimelineVisualizationModelDescriptor {
  readonly id: `EVE-4:3/Model/${TimelineVisualizationModelName}`;
  readonly canonicalName: TimelineVisualizationModelName;
  readonly registryReference: unknown;
  readonly namespace: `nexora.eve.timeline-visualization.model.${string}`;
  readonly version: "1.0.0";
  readonly ownershipReference: unknown;
  readonly lifecycleReference: unknown;
  readonly capabilityReferences: readonly unknown[];
  readonly structuralMetadata: readonly string[];
  readonly boundaryReferences: readonly unknown[];
  readonly compatibilityMetadata: Readonly<{ registryCompatible: true }>;
  readonly extensionMetadata: Readonly<{ classification: string }>;
  readonly deterministicOrder: number;
  readonly stability: "Stable";
  readonly executableBehavior: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface TimelineVisualizationModelRelationship {
  readonly id: `EVE-4:3/Relationship/${string}`;
  readonly sourceModel: TimelineVisualizationModelName;
  readonly targetModel: TimelineVisualizationModelName;
  readonly referenceField: string;
  readonly registryReference: "EVE-4:2/TimelineVisualizationRegistry";
  readonly deterministicOrder: number;
  readonly schedulingProvided: false;
  readonly playbackExecutionProvided: false;
  readonly inferenceProvided: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}
