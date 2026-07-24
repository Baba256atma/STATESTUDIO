/** WS-5:2 — Canonical Scenario Workspace Registry surface for Model. */
import { ScenarioWorkspaceCapabilityRegistry } from "./scenarioWorkspaceCapabilityRegistry.ts";
import { ScenarioWorkspaceContractRegistry } from "./scenarioWorkspaceContractRegistry.ts";
import { ScenarioWorkspaceFoundation } from "./scenarioWorkspaceFoundation.ts";
import { ScenarioWorkspaceIdentityRegistry } from "./scenarioWorkspaceIdentityRegistry.ts";
import { ScenarioWorkspaceLifecycleRegistry } from "./scenarioWorkspaceLifecycleRegistry.ts";
import { ScenarioWorkspaceResponsibilityRegistry } from "./scenarioWorkspaceResponsibilityRegistry.ts";
import { ScenarioWorkspaceScenarioTypeRegistry } from "./scenarioWorkspaceScenarioTypeRegistry.ts";

const boundaries = Object.freeze(
  ScenarioWorkspaceFoundation.boundaries.map((source, index) => Object.freeze({
    id: `WS-5:2/Boundary/${String(index + 1).padStart(2, "0")}`,
    key: `boundary-${String(index + 1).padStart(2, "0")}`,
    name: `${source.prohibitedConcern} Boundary`,
    description: `Registers ${source.prohibitedConcern} as outside the Scenario Workspace.`,
    registryCategory: "Boundary",
    source,
    sourcePhase: "WS-5:1",
    version: "1.0.0",
    stability: "Stable",
    ownership: "Scenario Workspace",
    metadataOnly: true,
    immutable: true,
  })),
);

export const ScenarioWorkspaceRegistry = Object.freeze({
  identity: ScenarioWorkspaceIdentityRegistry,
  foundation: ScenarioWorkspaceFoundation,
  responsibilities: ScenarioWorkspaceResponsibilityRegistry,
  capabilities: ScenarioWorkspaceCapabilityRegistry,
  scenarioTypes: ScenarioWorkspaceScenarioTypeRegistry,
  lifecycle: ScenarioWorkspaceLifecycleRegistry,
  contracts: ScenarioWorkspaceContractRegistry,
  boundaries,
  inventory: Object.freeze({
    responsibilityCount: ScenarioWorkspaceResponsibilityRegistry.length,
    capabilityCount: ScenarioWorkspaceCapabilityRegistry.length,
    scenarioTypeCount: ScenarioWorkspaceScenarioTypeRegistry.length,
    lifecycleCount: ScenarioWorkspaceLifecycleRegistry.length,
    contractCount: ScenarioWorkspaceContractRegistry.length,
    boundaryCount: boundaries.length,
    collectionCount: 6,
    derivedFromFoundation: true,
  }),
  rules: Object.freeze([
    "Unique Canonical Identifiers",
    "Deterministic Ordering",
    "Duplicate Registration Prevention",
    "Immutable Lookup Metadata",
    "Preserve Canonical Foundation Identities",
    "Metadata Only",
    "Implementation Independent",
  ]),
  readiness: "ReadyForModel",
  nextPhase: "WS-5:3 — Scenario Workspace Model",
  upstreamDependencies: Object.freeze([
    "WS-5:1 Scenario Workspace Foundation",
  ]),
  publicApiSurface: Object.freeze(["ScenarioWorkspaceRegistry"]),
  metadataOnly: true,
  immutable: true,
  deterministic: true,
  runtime: false,
  simulationEngine: false,
  predictionEngine: false,
  businessLogic: false,
  persistence: false,
  ui: false,
  orchestration: false,
  aiBehavior: false,
} as const);
