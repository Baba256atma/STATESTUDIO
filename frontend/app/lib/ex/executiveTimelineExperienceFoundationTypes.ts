/** EX-3:1 closed metadata-only Foundation types. */

export type ExecutiveTimelineExperienceFoundationLifecycleState =
  | "Draft"
  | "Defined"
  | "Reviewed"
  | "Foundation"
  | "ReadyForRegistry";

export type ExecutiveTimelineExperienceFoundationCapabilityId =
  | "TimelineNavigation"
  | "TimelineSynchronization"
  | "TimelinePlayback"
  | "ExecutiveStateVisualization"
  | "WorkspaceTransitionAwareness"
  | "JournalCoordination"
  | "HistoricalInspection"
  | "FutureScenarioPositioning";

export type ExecutiveTimelineExperienceFoundationNonCapabilityId =
  | "RtcExecution"
  | "ScenarioSimulation"
  | "AiReasoning"
  | "DecisionGeneration"
  | "DataPersistence"
  | "ExternalProviders"
  | "Networking"
  | "Telemetry"
  | "Randomness"
  | "Clocks"
  | "RenderingLogic"
  | "AnimationImplementation";

export type ExecutiveTimelineExperienceFoundationMissionConceptId =
  | "Past"
  | "Present"
  | "Future"
  | "TimeNavigation"
  | "ExecutiveEvents"
  | "WorkspaceTransitions"
  | "JournalSynchronization"
  | "DecisionHistory";

export interface ExecutiveTimelineExperienceFoundationCapability {
  readonly capabilityId: `EX-3:1/Capability/${ExecutiveTimelineExperienceFoundationCapabilityId}`;
  readonly name: ExecutiveTimelineExperienceFoundationCapabilityId;
  readonly order: number;
  readonly statement: string;
  readonly declarativeOnly: true;
  readonly executable: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface ExecutiveTimelineExperienceFoundationNonCapability {
  readonly nonCapabilityId: `EX-3:1/NonCapability/${ExecutiveTimelineExperienceFoundationNonCapabilityId}`;
  readonly name: ExecutiveTimelineExperienceFoundationNonCapabilityId;
  readonly order: number;
  readonly statement: string;
  readonly prohibited: true;
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface ExecutiveTimelineExperienceFoundationContract {
  readonly contractId: `EX-3:1/Contract/${string}`;
  readonly order: number;
  readonly subject: string;
  readonly metadataOnly: true;
  readonly descriptiveOnly: true;
  readonly runtimeEffects: false;
  readonly authorityCreation: false;
  readonly registryAuthorized: false;
  readonly immutable: true;
}

export interface ExecutiveTimelineExperienceFoundationSummary {
  readonly identity: "EX-3:1/ExecutiveTimelineExperienceFoundation";
  readonly namespace: "nexora.ex.executive.timeline.experience.foundation";
  readonly version: "1.0.0";
  readonly architecturalLayer: "Executive Experience (EX)";
  readonly module: "Executive Timeline Experience";
  readonly status: "Foundation";
  readonly readiness: "ReadyForRegistry";
  readonly previousPhase: null;
  readonly nextPhase: "EX-3:2 — Executive Timeline Experience Registry";
  readonly capabilityCount: 8;
  readonly nonCapabilityCount: 12;
  readonly contractCount: 8;
  readonly missionConceptCount: 8;
  readonly lifecycleStateCount: 5;
  readonly logicalDependencyCount: 2;
  readonly metadataOnly: true;
  readonly deterministic: true;
  readonly sideEffectFree: true;
  readonly registryCreated: false;
  readonly registryAuthorized: false;
}
