import type {
  ExecutivePlanningManifestReleaseInventory,
  ExecutivePlanningManifestReleaseStateEntry,
} from "./executivePlanningManifestTypes.ts";

const releaseState = (
  key: string,
  state: ExecutivePlanningManifestReleaseStateEntry["state"],
  description: string,
  order: number,
) => Object.freeze({
  id: `eng-5-manifest-release-state-${key}`,
  state,
  description,
  order,
  metadataOnly: true,
  runtimeFree: true,
} as const satisfies ExecutivePlanningManifestReleaseStateEntry);

export const ExecutivePlanningReleaseStates = Object.freeze([
  releaseState("development", "Development", "Manifest and prior phases are under architectural development.", 1),
  releaseState("ready-for-platform", "ReadyForPlatform", "Manifest is complete and ready for ENG-5:6 Platform aggregation.", 2),
  releaseState("ready-for-certification", "ReadyForCertification", "Platform is eligible for ENG-5:7 certification metadata.", 3),
  releaseState("ready-for-freeze", "ReadyForFreeze", "Certified platform is eligible for ENG-5:8 freeze metadata.", 4),
  releaseState("ready-for-public-index", "ReadyForPublicIndex", "Frozen platform is eligible for ENG-5:9 public index release.", 5),
] as const);

export const ExecutivePlanningReleaseManifest = Object.freeze({
  platformId: "ENG-5",
  version: "1.0.0",
  namespace: "nexora.engine.executive.planning.manifest",
  releaseStatus: "ReadyForPlatform",
  certificationReadiness: "NotReady",
  freezeReadiness: "NotReady",
  publicIndexReadiness: "NotReady",
  currentState: "ReadyForPlatform",
  states: ExecutivePlanningReleaseStates,
  metadataOnly: true,
  runtimeFree: true,
  immutable: true,
  deterministic: true,
} as const satisfies ExecutivePlanningManifestReleaseInventory);
