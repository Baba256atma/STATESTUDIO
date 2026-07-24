/** WS-8:6 — Canonical War Room Workspace Platform surface. */
import { WarRoomWorkspaceManifest } from "./warRoomWorkspaceManifest.ts";
import { WarRoomWorkspacePlatformBoundaries } from "./warRoomWorkspacePlatformBoundaries.ts";
import { WarRoomWorkspacePlatformCompatibility } from "./warRoomWorkspacePlatformCompatibility.ts";
import { WarRoomWorkspacePlatformComposition } from "./warRoomWorkspacePlatformComposition.ts";
import { WarRoomWorkspacePlatformGuarantees } from "./warRoomWorkspacePlatformGuarantees.ts";
import { WarRoomWorkspacePlatformIdentity } from "./warRoomWorkspacePlatformIdentity.ts";
import {
  WarRoomWorkspacePlatformCapabilitySummary,
  WarRoomWorkspacePlatformDependencySummary,
} from "./warRoomWorkspacePlatformSummaries.ts";

export const WarRoomWorkspacePlatform = Object.freeze({
  identity: WarRoomWorkspacePlatformIdentity,
  manifest: WarRoomWorkspaceManifest,
  composition: WarRoomWorkspacePlatformComposition,
  guarantees: WarRoomWorkspacePlatformGuarantees,
  compatibility: WarRoomWorkspacePlatformCompatibility,
  capabilitySummary: WarRoomWorkspacePlatformCapabilitySummary,
  dependencySummary: WarRoomWorkspacePlatformDependencySummary,
  boundaries: WarRoomWorkspacePlatformBoundaries,
  publications: Object.freeze({
    namespace: WarRoomWorkspacePlatformIdentity.namespace,
    version: WarRoomWorkspacePlatformIdentity.version,
    layer: WarRoomWorkspacePlatformIdentity.layer,
    status: WarRoomWorkspacePlatformIdentity.status,
    readiness: WarRoomWorkspacePlatformIdentity.readiness,
    workspaceIdentity: WarRoomWorkspacePlatformComposition.workspaceIdentity,
    canonicalPhaseIdentity:
      WarRoomWorkspacePlatformComposition.canonicalPhaseIdentity,
    canonicalDependencyChain:
      WarRoomWorkspacePlatformComposition.canonicalDependencyChain,
  }),
  upstreamDependencies: Object.freeze([
    "WS-8:5 War Room Workspace Manifest",
  ]),
  publicApiSurface: Object.freeze(["WarRoomWorkspacePlatform"]),
  status: "ReadyForCertification",
  readiness: "ReadyForCertification",
  metadataOnly: true,
  immutable: true,
  deterministic: true,
  executableComposition: false,
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
