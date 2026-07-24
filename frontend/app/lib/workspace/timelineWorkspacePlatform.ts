/** WS-10:6 — Canonical Timeline Workspace Platform surface. */
import { TimelineWorkspaceManifest } from "./timelineWorkspaceManifest.ts";
import { TimelineWorkspacePlatformBoundaries } from "./timelineWorkspacePlatformBoundaries.ts";
import { TimelineWorkspacePlatformCompatibility } from "./timelineWorkspacePlatformCompatibility.ts";
import { TimelineWorkspacePlatformComposition } from "./timelineWorkspacePlatformComposition.ts";
import { TimelineWorkspacePlatformGuarantees } from "./timelineWorkspacePlatformGuarantees.ts";
import { TimelineWorkspacePlatformIdentity } from "./timelineWorkspacePlatformIdentity.ts";
import {
  TimelineWorkspacePlatformCapabilitySummary,
  TimelineWorkspacePlatformDependencySummary,
} from "./timelineWorkspacePlatformSummaries.ts";

export const TimelineWorkspacePlatform = Object.freeze({
  identity: TimelineWorkspacePlatformIdentity,
  manifest: TimelineWorkspaceManifest,
  composition: TimelineWorkspacePlatformComposition,
  guarantees: TimelineWorkspacePlatformGuarantees,
  compatibility: TimelineWorkspacePlatformCompatibility,
  capabilitySummary: TimelineWorkspacePlatformCapabilitySummary,
  dependencySummary: TimelineWorkspacePlatformDependencySummary,
  boundaries: TimelineWorkspacePlatformBoundaries,
  publications: Object.freeze({
    namespace: TimelineWorkspacePlatformIdentity.namespace,
    version: TimelineWorkspacePlatformIdentity.version,
    layer: TimelineWorkspacePlatformIdentity.layer,
    status: TimelineWorkspacePlatformIdentity.status,
    readiness: TimelineWorkspacePlatformIdentity.readiness,
    workspaceIdentity: TimelineWorkspacePlatformComposition.workspaceIdentity,
    canonicalPhaseIdentity:
      TimelineWorkspacePlatformComposition.canonicalPhaseIdentity,
    canonicalDependencyChain:
      TimelineWorkspacePlatformComposition.canonicalDependencyChain,
  }),
  upstreamDependencies: Object.freeze([
    "WS-10:5 Timeline Workspace Manifest",
  ]),
  publicApiSurface: Object.freeze(["TimelineWorkspacePlatform"]),
  status: "ReadyForCertification",
  readiness: "ReadyForCertification",
  metadataOnly: true,
  immutable: true,
  deterministic: true,
  executableComposition: false,
  runtime: false,
  timelinePlayback: false,
  historicalRecordExecution: false,
  chronologicalProcessing: false,
  eventExecution: false,
  aiReasoning: false,
  workflowExecution: false,
  persistence: false,
  networking: false,
  rendering: false,
  visualization: false,
  stateManagement: false,
  services: false,
  factories: false,
  businessLogic: false,
} as const);
