/** WS-5:6 — Canonical Platform surface for Certification. */
import { ScenarioWorkspaceManifest } from "./scenarioWorkspaceManifest.ts";
import { ScenarioWorkspacePlatformCapabilities } from "./scenarioWorkspacePlatformCapabilities.ts";
import { ScenarioWorkspacePlatformCompatibility } from "./scenarioWorkspacePlatformCompatibility.ts";
import { ScenarioWorkspacePlatformComposition } from "./scenarioWorkspacePlatformComposition.ts";
import { ScenarioWorkspacePlatformExtensions } from "./scenarioWorkspacePlatformExtensions.ts";
import { ScenarioWorkspacePlatformGuarantees } from "./scenarioWorkspacePlatformGuarantees.ts";
import { ScenarioWorkspacePlatformIdentity } from "./scenarioWorkspacePlatformIdentity.ts";

export const ScenarioWorkspacePlatform = Object.freeze({
  identity: ScenarioWorkspacePlatformIdentity,
  manifest: ScenarioWorkspaceManifest,
  composition: ScenarioWorkspacePlatformComposition,
  capabilities: ScenarioWorkspacePlatformCapabilities,
  guarantees: ScenarioWorkspacePlatformGuarantees,
  compatibility: ScenarioWorkspacePlatformCompatibility,
  extensions: ScenarioWorkspacePlatformExtensions,
  summary: Object.freeze({
    platformStatus: "Complete",
    manifestStatus: "Complete",
    guaranteeStatus: "Satisfied",
    compatibilityStatus: "Compatible",
    extensionStatus: "Extensible",
    readiness: "ReadyForCertification",
    compositionEntryCount: Object.keys(
      ScenarioWorkspacePlatformComposition,
    ).length,
    capabilityCount: ScenarioWorkspacePlatformCapabilities.length,
    guaranteeCount: ScenarioWorkspacePlatformGuarantees.length,
    compatibilityCount: ScenarioWorkspacePlatformCompatibility.length,
    extensionCount: ScenarioWorkspacePlatformExtensions.length,
    publicApiCount:
      ScenarioWorkspacePlatformComposition.publicApiInventory.length,
  }),
  status: "Platform",
  readiness: "ReadyForCertification",
  upstreamDependencies: Object.freeze([
    "WS-5:5 Scenario Workspace Manifest",
  ]),
  publicApiSurface: Object.freeze(["ScenarioWorkspacePlatform"]),
  metadataOnly: true,
  immutable: true,
  deterministic: true,
  runtime: false,
  simulationEngine: false,
  predictionEngine: false,
  scenarioExecution: false,
  businessLogic: false,
  persistence: false,
  networking: false,
  rendering: false,
  aiBehavior: false,
  ui: false,
  orchestration: false,
} as const);
