/** WS-9:6 — Canonical Value Workspace Platform surface. */
import { ValueWorkspaceManifest } from "./valueWorkspaceManifest.ts";
import { ValueWorkspacePlatformBoundaries } from "./valueWorkspacePlatformBoundaries.ts";
import { ValueWorkspacePlatformCompatibility } from "./valueWorkspacePlatformCompatibility.ts";
import { ValueWorkspacePlatformComposition } from "./valueWorkspacePlatformComposition.ts";
import { ValueWorkspacePlatformGuarantees } from "./valueWorkspacePlatformGuarantees.ts";
import { ValueWorkspacePlatformIdentity } from "./valueWorkspacePlatformIdentity.ts";
import {
  ValueWorkspacePlatformCapabilitySummary,
  ValueWorkspacePlatformDependencySummary,
} from "./valueWorkspacePlatformSummaries.ts";

export const ValueWorkspacePlatform = Object.freeze({
  identity: ValueWorkspacePlatformIdentity,
  manifest: ValueWorkspaceManifest,
  composition: ValueWorkspacePlatformComposition,
  guarantees: ValueWorkspacePlatformGuarantees,
  compatibility: ValueWorkspacePlatformCompatibility,
  capabilitySummary: ValueWorkspacePlatformCapabilitySummary,
  dependencySummary: ValueWorkspacePlatformDependencySummary,
  boundaries: ValueWorkspacePlatformBoundaries,
  publications: Object.freeze({
    namespace: ValueWorkspacePlatformIdentity.namespace,
    version: ValueWorkspacePlatformIdentity.version,
    layer: ValueWorkspacePlatformIdentity.layer,
    status: ValueWorkspacePlatformIdentity.status,
    readiness: ValueWorkspacePlatformIdentity.readiness,
    workspaceIdentity: ValueWorkspacePlatformComposition.workspaceIdentity,
    canonicalPhaseIdentity:
      ValueWorkspacePlatformComposition.canonicalPhaseIdentity,
    canonicalDependencyChain:
      ValueWorkspacePlatformComposition.canonicalDependencyChain,
  }),
  upstreamDependencies: Object.freeze([
    "WS-9:5 Value Workspace Manifest",
  ]),
  publicApiSurface: Object.freeze(["ValueWorkspacePlatform"]),
  status: "ReadyForCertification",
  readiness: "ReadyForCertification",
  metadataOnly: true,
  immutable: true,
  deterministic: true,
  executableComposition: false,
  runtime: false,
  businessValueCalculation: false,
  roiCalculation: false,
  financialAnalysis: false,
  forecasting: false,
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
