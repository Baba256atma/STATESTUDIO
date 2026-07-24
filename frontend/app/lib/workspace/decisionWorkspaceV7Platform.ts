/** WS-7:6 — Canonical Decision Workspace Platform surface. */
import { DecisionWorkspaceV7Manifest } from "./decisionWorkspaceV7Manifest.ts";
import { DecisionWorkspaceV7PlatformBoundaries } from "./decisionWorkspaceV7PlatformBoundaries.ts";
import { DecisionWorkspaceV7PlatformCompatibility } from "./decisionWorkspaceV7PlatformCompatibility.ts";
import { DecisionWorkspaceV7PlatformComposition } from "./decisionWorkspaceV7PlatformComposition.ts";
import { DecisionWorkspaceV7PlatformGuarantees } from "./decisionWorkspaceV7PlatformGuarantees.ts";
import { DecisionWorkspaceV7PlatformIdentity } from "./decisionWorkspaceV7PlatformIdentity.ts";
import {
  DecisionWorkspaceV7PlatformCapabilitySummary,
  DecisionWorkspaceV7PlatformDependencySummary,
} from "./decisionWorkspaceV7PlatformSummaries.ts";

export const DecisionWorkspaceV7Platform = Object.freeze({
  identity: DecisionWorkspaceV7PlatformIdentity,
  manifest: DecisionWorkspaceV7Manifest,
  composition: DecisionWorkspaceV7PlatformComposition,
  guarantees: DecisionWorkspaceV7PlatformGuarantees,
  compatibility: DecisionWorkspaceV7PlatformCompatibility,
  capabilitySummary: DecisionWorkspaceV7PlatformCapabilitySummary,
  dependencySummary: DecisionWorkspaceV7PlatformDependencySummary,
  boundaries: DecisionWorkspaceV7PlatformBoundaries,
  publications: Object.freeze({
    namespace: DecisionWorkspaceV7PlatformIdentity.namespace,
    version: DecisionWorkspaceV7PlatformIdentity.version,
    layer: DecisionWorkspaceV7PlatformIdentity.layer,
    status: DecisionWorkspaceV7PlatformIdentity.status,
    readiness: DecisionWorkspaceV7PlatformIdentity.readiness,
    workspaceIdentity:
      DecisionWorkspaceV7PlatformComposition.workspaceIdentity,
    canonicalPhaseIdentity:
      DecisionWorkspaceV7PlatformComposition.canonicalPhaseIdentity,
    canonicalDependencyChain:
      DecisionWorkspaceV7PlatformComposition.canonicalDependencyChain,
  }),
  upstreamDependencies: Object.freeze([
    "WS-7:5 Decision Workspace Manifest",
  ]),
  publicApiSurface: Object.freeze(["DecisionWorkspaceV7Platform"]),
  status: "ReadyForCertification",
  readiness: "ReadyForCertification",
  metadataOnly: true,
  immutable: true,
  deterministic: true,
  executableComposition: false,
  runtime: false,
  aiReasoning: false,
  decisionGeneration: false,
  decisionExecution: false,
  optimization: false,
  ranking: false,
  scoring: false,
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
