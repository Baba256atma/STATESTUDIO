/** WS-4:6 — Canonical Platform surface for Certification. */
import { DecisionWorkspaceManifest } from "./decisionWorkspaceManifest.ts";
import { DecisionWorkspacePlatformCapabilities } from "./decisionWorkspacePlatformCapabilities.ts";
import { DecisionWorkspacePlatformCompatibility } from "./decisionWorkspacePlatformCompatibility.ts";
import { DecisionWorkspacePlatformComposition } from "./decisionWorkspacePlatformComposition.ts";
import { DecisionWorkspacePlatformExtensions } from "./decisionWorkspacePlatformExtensions.ts";
import { DecisionWorkspacePlatformGuarantees } from "./decisionWorkspacePlatformGuarantees.ts";
import { DecisionWorkspacePlatformIdentity } from "./decisionWorkspacePlatformIdentity.ts";

export const DecisionWorkspacePlatform = Object.freeze({
  identity: DecisionWorkspacePlatformIdentity,
  manifest: DecisionWorkspaceManifest,
  composition: DecisionWorkspacePlatformComposition,
  capabilities: DecisionWorkspacePlatformCapabilities,
  guarantees: DecisionWorkspacePlatformGuarantees,
  compatibility: DecisionWorkspacePlatformCompatibility,
  extensions: DecisionWorkspacePlatformExtensions,
  summary: Object.freeze({
    platformStatus: "Complete",
    manifestStatus: "Complete",
    guaranteeStatus: "Satisfied",
    compatibilityStatus: "Compatible",
    extensionStatus: "Extensible",
    readiness: "ReadyForCertification",
    compositionEntryCount: Object.keys(
      DecisionWorkspacePlatformComposition,
    ).length,
    capabilityCount: DecisionWorkspacePlatformCapabilities.length,
    guaranteeCount: DecisionWorkspacePlatformGuarantees.length,
    compatibilityCount: DecisionWorkspacePlatformCompatibility.length,
    extensionCount: DecisionWorkspacePlatformExtensions.length,
    publicApiCount:
      DecisionWorkspacePlatformComposition.publicApiInventory.length,
  }),
  status: "Platform",
  readiness: "ReadyForCertification",
  upstreamDependencies: Object.freeze([
    "WS-4:5 Decision Workspace Manifest",
  ]),
  publicApiSurface: Object.freeze(["DecisionWorkspacePlatform"]),
  metadataOnly: true,
  immutable: true,
  deterministic: true,
  runtime: false,
  decisionExecution: false,
  workflowExecution: false,
  businessLogic: false,
  persistence: false,
  networking: false,
  rendering: false,
  aiBehavior: false,
  ui: false,
  orchestration: false,
} as const);
