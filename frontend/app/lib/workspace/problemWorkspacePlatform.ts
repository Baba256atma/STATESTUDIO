/** WS-6:6 — Canonical Problem Workspace Platform surface. */
import { ProblemWorkspaceManifest } from "./problemWorkspaceManifest.ts";
import { ProblemWorkspacePlatformBoundaries } from "./problemWorkspacePlatformBoundaries.ts";
import { ProblemWorkspacePlatformCompatibility } from "./problemWorkspacePlatformCompatibility.ts";
import { ProblemWorkspacePlatformComposition } from "./problemWorkspacePlatformComposition.ts";
import { ProblemWorkspacePlatformGuarantees } from "./problemWorkspacePlatformGuarantees.ts";
import { ProblemWorkspacePlatformIdentity } from "./problemWorkspacePlatformIdentity.ts";
import {
  ProblemWorkspacePlatformCapabilitySummary,
  ProblemWorkspacePlatformDependencySummary,
} from "./problemWorkspacePlatformSummaries.ts";

export const ProblemWorkspacePlatform = Object.freeze({
  identity: ProblemWorkspacePlatformIdentity,
  manifest: ProblemWorkspaceManifest,
  composition: ProblemWorkspacePlatformComposition,
  guarantees: ProblemWorkspacePlatformGuarantees,
  compatibility: ProblemWorkspacePlatformCompatibility,
  capabilitySummary: ProblemWorkspacePlatformCapabilitySummary,
  dependencySummary: ProblemWorkspacePlatformDependencySummary,
  boundaries: ProblemWorkspacePlatformBoundaries,
  publications: Object.freeze({
    namespace: ProblemWorkspacePlatformIdentity.namespace,
    version: ProblemWorkspacePlatformIdentity.version,
    layer: ProblemWorkspacePlatformIdentity.layer,
    status: ProblemWorkspacePlatformIdentity.status,
    readiness: ProblemWorkspacePlatformIdentity.readiness,
    workspaceIdentity: ProblemWorkspacePlatformComposition.workspaceIdentity,
    canonicalPhaseIdentity:
      ProblemWorkspacePlatformComposition.canonicalPhaseIdentity,
    canonicalDependencyChain:
      ProblemWorkspacePlatformComposition.canonicalDependencyChain,
  }),
  upstreamDependencies: Object.freeze([
    "WS-6:5 Problem Workspace Manifest",
  ]),
  publicApiSurface: Object.freeze(["ProblemWorkspacePlatform"]),
  status: "ReadyForCertification",
  readiness: "ReadyForCertification",
  metadataOnly: true,
  immutable: true,
  deterministic: true,
  runtime: false,
  aiReasoning: false,
  problemSolving: false,
  rootCauseAnalysis: false,
  orchestration: false,
  workflowExecution: false,
  persistence: false,
  visualization: false,
  networking: false,
  rendering: false,
  stateManagement: false,
  services: false,
  factories: false,
  businessLogic: false,
} as const);
