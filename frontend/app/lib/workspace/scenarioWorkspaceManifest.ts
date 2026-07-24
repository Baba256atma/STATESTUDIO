/** WS-5:5 — Canonical Manifest surface for Platform. */
import { ScenarioWorkspaceManifestGuarantees } from "./scenarioWorkspaceManifestGuarantees.ts";
import { ScenarioWorkspaceManifestIdentity } from "./scenarioWorkspaceManifestIdentity.ts";
import { ScenarioWorkspaceManifestInventory } from "./scenarioWorkspaceManifestInventory.ts";
import { ScenarioWorkspaceManifestPublicApi } from "./scenarioWorkspaceManifestPublicApi.ts";
import {
  ScenarioWorkspaceManifestReadiness,
  ScenarioWorkspaceManifestReadinessGates,
} from "./scenarioWorkspaceManifestReadiness.ts";
import { ScenarioWorkspaceManifestSources } from "./scenarioWorkspaceManifestSources.ts";
import { ScenarioWorkspaceValidation } from "./scenarioWorkspaceValidation.ts";

export const ScenarioWorkspaceManifest = Object.freeze({
  identity: ScenarioWorkspaceManifestIdentity,
  validation: ScenarioWorkspaceValidation,
  sources: ScenarioWorkspaceManifestSources,
  inventory: ScenarioWorkspaceManifestInventory,
  guarantees: ScenarioWorkspaceManifestGuarantees,
  readinessGates: ScenarioWorkspaceManifestReadinessGates,
  summary: ScenarioWorkspaceManifestReadiness,
  publicApi: ScenarioWorkspaceManifestPublicApi,
  status: "Manifest",
  readiness: "ReadyForPlatform",
  upstreamDependencies: Object.freeze([
    "WS-5:4 Scenario Workspace Validation",
  ]),
  publicApiSurface: Object.freeze(["ScenarioWorkspaceManifest"]),
  canonicalInventoryRuleSatisfied: true,
  metadataOnly: true,
  immutable: true,
  deterministic: true,
  runtime: false,
  simulationEngine: false,
  predictionEngine: false,
  businessLogic: false,
  persistence: false,
  networking: false,
  ui: false,
  aiBehavior: false,
  orchestration: false,
} as const);
