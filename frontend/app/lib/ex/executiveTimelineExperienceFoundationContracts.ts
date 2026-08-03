import type {
  ExecutiveTimelineExperienceFoundationCapability,
  ExecutiveTimelineExperienceFoundationContract,
  ExecutiveTimelineExperienceFoundationMissionConceptId,
  ExecutiveTimelineExperienceFoundationNonCapability,
} from "./executiveTimelineExperienceFoundationTypes.ts";

export const ExecutiveTimelineExperienceFoundationMissionConcepts = Object.freeze([
  "Past",
  "Present",
  "Future",
  "TimeNavigation",
  "ExecutiveEvents",
  "WorkspaceTransitions",
  "JournalSynchronization",
  "DecisionHistory",
] as const satisfies readonly ExecutiveTimelineExperienceFoundationMissionConceptId[]);

export const ExecutiveTimelineExperienceFoundationMission = Object.freeze({
  missionId: "EX-3:1/ExecutiveTimelineExperienceMission" as const,
  statement:
    "The Executive Timeline Experience is the canonical experience responsible for presenting the executive flow of time." as const,
  concepts: ExecutiveTimelineExperienceFoundationMissionConcepts,
  descriptiveOnly: true as const,
  metadataOnly: true as const,
  immutable: true as const,
});

const capability = (
  name:
    | "TimelineNavigation"
    | "TimelineSynchronization"
    | "TimelinePlayback"
    | "ExecutiveStateVisualization"
    | "WorkspaceTransitionAwareness"
    | "JournalCoordination"
    | "HistoricalInspection"
    | "FutureScenarioPositioning",
  order: number,
  statement: string,
): ExecutiveTimelineExperienceFoundationCapability =>
  Object.freeze({
    capabilityId: `EX-3:1/Capability/${name}`,
    name,
    order,
    statement,
    declarativeOnly: true as const,
    executable: false as const,
    metadataOnly: true as const,
    immutable: true as const,
  });

export const ExecutiveTimelineExperienceFoundationCapabilities = Object.freeze([
  capability("TimelineNavigation", 1, "Declare timeline navigation capability."),
  capability(
    "TimelineSynchronization",
    2,
    "Declare timeline synchronization capability.",
  ),
  capability("TimelinePlayback", 3, "Declare timeline playback capability."),
  capability(
    "ExecutiveStateVisualization",
    4,
    "Declare executive state visualization capability.",
  ),
  capability(
    "WorkspaceTransitionAwareness",
    5,
    "Declare workspace transition awareness capability.",
  ),
  capability("JournalCoordination", 6, "Declare journal coordination capability."),
  capability(
    "HistoricalInspection",
    7,
    "Declare historical inspection capability.",
  ),
  capability(
    "FutureScenarioPositioning",
    8,
    "Declare future scenario positioning capability.",
  ),
] as const);

const nonCapability = (
  name:
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
    | "AnimationImplementation",
  order: number,
  statement: string,
): ExecutiveTimelineExperienceFoundationNonCapability =>
  Object.freeze({
    nonCapabilityId: `EX-3:1/NonCapability/${name}`,
    name,
    order,
    statement,
    prohibited: true as const,
    metadataOnly: true as const,
    immutable: true as const,
  });

export const ExecutiveTimelineExperienceFoundationNonCapabilities =
  Object.freeze([
    nonCapability("RtcExecution", 1, "RTC execution is prohibited."),
    nonCapability("ScenarioSimulation", 2, "Scenario simulation is prohibited."),
    nonCapability("AiReasoning", 3, "AI reasoning is prohibited."),
    nonCapability("DecisionGeneration", 4, "Decision generation is prohibited."),
    nonCapability("DataPersistence", 5, "Data persistence is prohibited."),
    nonCapability("ExternalProviders", 6, "External providers are prohibited."),
    nonCapability("Networking", 7, "Networking is prohibited."),
    nonCapability("Telemetry", 8, "Telemetry is prohibited."),
    nonCapability("Randomness", 9, "Randomness is prohibited."),
    nonCapability("Clocks", 10, "Clocks are prohibited."),
    nonCapability("RenderingLogic", 11, "Rendering logic is prohibited."),
    nonCapability(
      "AnimationImplementation",
      12,
      "Animation implementation is prohibited.",
    ),
  ] as const);

export const ExecutiveTimelineExperienceFoundationContracts = Object.freeze(
  ([
    ["Identity", "Foundation publishes the exact canonical Timeline identity."],
    ["Metadata", "Foundation metadata remains immutable and side-effect-free."],
    ["Boundary", "Foundation boundaries prohibit runtime, RTC, and rendering."],
    ["Capability", "Capabilities remain declarative and non-executable."],
    ["Lifecycle", "Lifecycle advances forward-only to ReadyForRegistry."],
    [
      "Dependency",
      "Logical dependencies on Executive Stage and Journal are declared only.",
    ],
    [
      "Readiness",
      "ReadyForRegistry does not authorize EX-3:2 Registry implementation.",
    ],
    [
      "Consumer",
      "Consumers may read Foundation metadata only; mutation is prohibited.",
    ],
  ] as const).map(([name, subject], index) =>
    Object.freeze({
      contractId: `EX-3:1/Contract/${name}`,
      order: index + 1,
      subject,
      metadataOnly: true,
      descriptiveOnly: true,
      runtimeEffects: false,
      authorityCreation: false,
      registryAuthorized: false,
      immutable: true,
    } satisfies ExecutiveTimelineExperienceFoundationContract)),
);
