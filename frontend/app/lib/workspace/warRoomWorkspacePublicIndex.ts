/** WS-8:9 — Sole public consumer entry for War Room Workspace. */
import { WarRoomWorkspaceFreeze } from "./warRoomWorkspaceFreeze.ts";

export const warRoomWorkspacePublicIdentity = Object.freeze({
  id: "WS-8:9/WarRoomWorkspacePublicIndex",
  name: "War Room Workspace Public Index",
  phaseId: "WS-8:9",
  namespace: "nexora.workspace.war-room.public-index",
  version: "1.0.0",
  layer: "Workspace Layer",
  status: "Released",
  certification: "Certified",
  freeze: "Frozen",
  stability: "Stable",
  readiness: "ReadyForConsumer",
  metadataOnly: true,
  immutable: true,
} as const);

export const warRoomWorkspaceFreezeReference = WarRoomWorkspaceFreeze;

export const warRoomWorkspacePlatformReference =
  WarRoomWorkspaceFreeze.certification.platform;

export const warRoomWorkspacePublicVersion =
  warRoomWorkspacePublicIdentity.version;

export const warRoomWorkspacePublicApiRegistry =
  WarRoomWorkspaceFreeze.publicApi;

export const warRoomWorkspacePublicApiCount =
  WarRoomWorkspaceFreeze.publicApi.length;

export const warRoomWorkspaceConsumerEntry = Object.freeze({
  file: "warRoomWorkspacePublicIndex.ts",
  declaration: "Sole supported War Room Workspace consumer entry",
  dependency: "warRoomWorkspaceFreeze.ts",
  dependencyPhase: "WS-8:8 War Room Workspace Freeze",
  directArchitecturalImportsPermitted: false,
  stablePublicSurface: true,
  metadataOnly: true,
  immutable: true,
} as const);

export const warRoomWorkspaceReleaseStatus = Object.freeze({
  release: "Released",
  certification: "Certified",
  freeze: "Frozen",
  stability: "Stable",
  readiness: "ReadyForConsumer",
} as const);

export const warRoomWorkspaceReadiness = "ReadyForConsumer" as const;

export const warRoomWorkspacePublicMetadata = Object.freeze({
  identity: warRoomWorkspacePublicIdentity,
  version: warRoomWorkspacePublicVersion,
  release: warRoomWorkspaceReleaseStatus,
  readiness: warRoomWorkspaceReadiness,
  freezeMetadata: WarRoomWorkspaceFreeze.metadata,
  lock: WarRoomWorkspaceFreeze.lock,
  immutable: true,
  metadataOnly: true,
} as const);

export const warRoomWorkspacePublicNamespace = Object.freeze([
  Object.freeze({ section: "Identity", value: warRoomWorkspacePublicIdentity }),
  Object.freeze({
    section: "Workspace",
    value: WarRoomWorkspaceFreeze.metadata.workspaceIdentity,
  }),
  Object.freeze({
    section: "Foundation",
    value: WarRoomWorkspaceFreeze.baselines[0],
  }),
  Object.freeze({
    section: "Registry",
    value: WarRoomWorkspaceFreeze.baselines[1],
  }),
  Object.freeze({
    section: "Model",
    value: WarRoomWorkspaceFreeze.baselines[2],
  }),
  Object.freeze({
    section: "Validation",
    value: WarRoomWorkspaceFreeze.baselines[3],
  }),
  Object.freeze({
    section: "Platform",
    value: warRoomWorkspacePlatformReference,
  }),
  Object.freeze({
    section: "Release",
    value: warRoomWorkspaceReleaseStatus,
  }),
  Object.freeze({
    section: "Consumer",
    value: warRoomWorkspaceConsumerEntry,
  }),
] as const);

const publicExportNames = Object.freeze([
  "warRoomWorkspacePublicIndex",
  "warRoomWorkspacePublicMetadata",
  "warRoomWorkspacePublicIdentity",
  "warRoomWorkspacePublicNamespace",
  "warRoomWorkspacePublicVersion",
  "warRoomWorkspacePublicApiRegistry",
  "warRoomWorkspacePublicApiCount",
  "warRoomWorkspaceConsumerEntry",
  "warRoomWorkspaceReleaseStatus",
  "warRoomWorkspaceReadiness",
  "warRoomWorkspaceFreezeReference",
  "warRoomWorkspacePlatformReference",
] as const);

export const warRoomWorkspacePublicIndex = Object.freeze({
  identity: warRoomWorkspacePublicIdentity,
  metadata: warRoomWorkspacePublicMetadata,
  namespace: warRoomWorkspacePublicNamespace,
  version: warRoomWorkspacePublicVersion,
  publicApiRegistry: warRoomWorkspacePublicApiRegistry,
  publicApiCount: warRoomWorkspacePublicApiCount,
  consumerEntry: warRoomWorkspaceConsumerEntry,
  releaseStatus: warRoomWorkspaceReleaseStatus,
  readiness: warRoomWorkspaceReadiness,
  freezeReference: warRoomWorkspaceFreezeReference,
  platformReference: warRoomWorkspacePlatformReference,
  publicExports: publicExportNames,
  publicExportCount: publicExportNames.length,
  namespaceCount: warRoomWorkspacePublicNamespace.length,
  soleDependency: "warRoomWorkspaceFreeze.ts",
  soleConsumerEntry: true,
  immutable: true,
  deterministic: true,
  metadataOnly: true,
  runtime: false,
  liveMonitoring: false,
  workflowOrchestration: false,
  aiReasoning: false,
  eventProcessing: false,
  incidentManagement: false,
  persistence: false,
  networking: false,
  rendering: false,
  visualization: false,
  stateManagement: false,
  services: false,
  factories: false,
  businessLogic: false,
} as const);
