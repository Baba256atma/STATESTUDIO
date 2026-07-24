/** WS-5:8 — Canonical frozen surface for Public Index. */
import { ScenarioWorkspaceCertification } from "./scenarioWorkspaceCertification.ts";
import { ScenarioWorkspaceFreezeCompatibility } from "./scenarioWorkspaceFreezeCompatibility.ts";
import { ScenarioWorkspaceFreezeExtensions } from "./scenarioWorkspaceFreezeExtensions.ts";
import { ScenarioWorkspaceFreezeIdentity } from "./scenarioWorkspaceFreezeIdentity.ts";
import { ScenarioWorkspaceFreezeInventory } from "./scenarioWorkspaceFreezeInventory.ts";
import { ScenarioWorkspaceFreezeLock } from "./scenarioWorkspaceFreezeLock.ts";
import { ScenarioWorkspaceFreezePublicApi } from "./scenarioWorkspaceFreezePublicApi.ts";

export const ScenarioWorkspaceFreeze = Object.freeze({
  identity: ScenarioWorkspaceFreezeIdentity,
  certification: ScenarioWorkspaceCertification,
  inventory: ScenarioWorkspaceFreezeInventory,
  compatibility: ScenarioWorkspaceFreezeCompatibility,
  extensions: ScenarioWorkspaceFreezeExtensions,
  lock: ScenarioWorkspaceFreezeLock,
  publicApi: ScenarioWorkspaceFreezePublicApi,
  summary: Object.freeze({
    freezeStatus: "Frozen",
    certificationStatus: "Certified",
    releaseStatus: "Released",
    architectureLock: ScenarioWorkspaceFreezeLock.id,
    readiness: "ReadyForPublicIndex",
    inventoryEntryCount: Object.keys(
      ScenarioWorkspaceFreezeInventory,
    ).length,
    compatibilityCount: ScenarioWorkspaceFreezeCompatibility.length,
    extensionCount: ScenarioWorkspaceFreezeExtensions.length,
    publicApiCount: ScenarioWorkspaceFreezePublicApi.length,
  }),
  status: "Frozen",
  releaseStatus: "Released",
  readiness: "ReadyForPublicIndex",
  upstreamDependencies: Object.freeze([
    "WS-5:7 Scenario Workspace Certification",
  ]),
  publicApiSurface: Object.freeze(["ScenarioWorkspaceFreeze"]),
  metadataOnly: true,
  immutable: true,
  deterministic: true,
  runtime: false,
  simulationEngine: false,
  predictionEngine: false,
  scenarioExecution: false,
  businessLogic: false,
  persistence: false,
  ui: false,
  networking: false,
  rendering: false,
  aiBehavior: false,
  orchestration: false,
} as const);
