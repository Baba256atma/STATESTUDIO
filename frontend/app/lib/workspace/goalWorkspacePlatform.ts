/** WS-3:6 — Canonical Platform surface for Certification. */
import { GoalWorkspaceManifest } from "./goalWorkspaceManifest.ts";
import { GoalWorkspacePlatformCapabilities } from "./goalWorkspacePlatformCapabilities.ts";
import { GoalWorkspacePlatformCompatibility } from "./goalWorkspacePlatformCompatibility.ts";
import { GoalWorkspacePlatformComposition } from "./goalWorkspacePlatformComposition.ts";
import { GoalWorkspacePlatformExtensions } from "./goalWorkspacePlatformExtensions.ts";
import { GoalWorkspacePlatformGuarantees } from "./goalWorkspacePlatformGuarantees.ts";
import { GoalWorkspacePlatformIdentity } from "./goalWorkspacePlatformIdentity.ts";

export const GoalWorkspacePlatform = Object.freeze({
  identity: GoalWorkspacePlatformIdentity, manifest: GoalWorkspaceManifest,
  composition: GoalWorkspacePlatformComposition,
  capabilities: GoalWorkspacePlatformCapabilities,
  guarantees: GoalWorkspacePlatformGuarantees,
  compatibility: GoalWorkspacePlatformCompatibility,
  extensions: GoalWorkspacePlatformExtensions,
  summary: Object.freeze({
    platformStatus: "Complete", manifestStatus: "Complete",
    guaranteeStatus: "Satisfied", compatibilityStatus: "Compatible",
    extensionStatus: "Extensible", readiness: "ReadyForCertification",
    compositionEntryCount: Object.keys(GoalWorkspacePlatformComposition).length,
    capabilityCount: GoalWorkspacePlatformCapabilities.length,
    guaranteeCount: GoalWorkspacePlatformGuarantees.length,
    compatibilityCount: GoalWorkspacePlatformCompatibility.length,
    extensionCount: GoalWorkspacePlatformExtensions.length,
  }),
  status: "Platform", readiness: "ReadyForCertification",
  upstreamDependencies: Object.freeze(["WS-3:5 Goal Workspace Manifest"]),
  publicApiSurface: Object.freeze(["GoalWorkspacePlatform"]),
  metadataOnly: true, immutable: true, deterministic: true,
  runtime: false, businessLogic: false, persistence: false, networking: false,
  rendering: false, aiBehavior: false, ui: false, orchestration: false,
} as const);

