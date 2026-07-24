/** WS-5:9 — Sole consumer entry for the frozen Scenario Workspace architecture. */
import { ScenarioWorkspaceFreeze } from "./scenarioWorkspaceFreeze.ts";

export const scenarioWorkspacePublicIndexIdentity = Object.freeze({
  id: "WS-5:9/ScenarioWorkspacePublicIndex",
  name: "Scenario Workspace Public Index",
  layer: "Workspace Layer (WS)",
  phase: "WS-5:9",
  namespace: "nexora.workspace.scenario.public-index",
  version: "1.0.0",
  release: "Released",
  certification: "Certified",
  freeze: "Frozen",
  stability: "Stable",
  readiness: "ReadyForConsumer",
  metadataOnly: true,
  immutable: true,
} as const);

export const scenarioWorkspacePublicApiRegistry =
  ScenarioWorkspaceFreeze.publicApi;

export const scenarioWorkspacePublicApiCount =
  scenarioWorkspacePublicApiRegistry.length;

const publicExportNames = Object.freeze([
  "scenarioWorkspacePublicIndexIdentity",
  "scenarioWorkspacePublicNamespace",
  "scenarioWorkspacePublicApiRegistry",
  "scenarioWorkspacePublicApiCount",
  "scenarioWorkspacePublicExportCount",
  "scenarioWorkspacePublicNamespaceCount",
  "scenarioWorkspaceConsumerEntry",
  "scenarioWorkspaceReleaseStatus",
  "scenarioWorkspaceCompatibility",
  "scenarioWorkspaceReadiness",
  "scenarioWorkspaceFreezeReference",
  "scenarioWorkspacePublicIndex",
] as const);

export const scenarioWorkspacePublicExportCount = publicExportNames.length;

export const scenarioWorkspaceConsumerEntry = Object.freeze({
  file: "scenarioWorkspacePublicIndex.ts",
  declaration: "Sole supported Scenario Workspace consumer entry",
  dependency: "scenarioWorkspaceFreeze.ts",
  dependencyPhase: "WS-5:8 Scenario Workspace Freeze",
  directEarlierPhaseImportsPermitted: false,
  metadataOnly: true,
  immutable: true,
} as const);

export const scenarioWorkspaceReleaseStatus = Object.freeze({
  release: "Released",
  certification: "Certified",
  freeze: "Frozen",
  stability: "Stable",
  readiness: "ReadyForConsumer",
} as const);

export const scenarioWorkspaceCompatibility =
  ScenarioWorkspaceFreeze.compatibility;

export const scenarioWorkspaceReadiness = "ReadyForConsumer" as const;

export const scenarioWorkspaceFreezeReference = ScenarioWorkspaceFreeze;

export const scenarioWorkspacePublicNamespace = Object.freeze([
  Object.freeze({
    section: "Identity",
    value: scenarioWorkspacePublicIndexIdentity,
  }),
  Object.freeze({
    section: "Platform",
    value: ScenarioWorkspaceFreeze.inventory.sourceChain.platform,
  }),
  Object.freeze({
    section: "Workspace",
    value: ScenarioWorkspaceFreeze.inventory.workspaceIdentity,
  }),
  Object.freeze({
    section: "Metadata",
    value: ScenarioWorkspaceFreeze.inventory,
  }),
  Object.freeze({
    section: "Public API",
    value: scenarioWorkspacePublicApiRegistry,
  }),
  Object.freeze({
    section: "Consumer",
    value: scenarioWorkspaceConsumerEntry,
  }),
  Object.freeze({
    section: "Release",
    value: scenarioWorkspaceReleaseStatus,
  }),
  Object.freeze({
    section: "Compatibility",
    value: scenarioWorkspaceCompatibility,
  }),
  Object.freeze({
    section: "Readiness",
    value: scenarioWorkspaceReadiness,
  }),
] as const);

export const scenarioWorkspacePublicNamespaceCount =
  scenarioWorkspacePublicNamespace.length;

export const scenarioWorkspacePublicIndex = Object.freeze({
  identity: scenarioWorkspacePublicIndexIdentity,
  namespace: scenarioWorkspacePublicNamespace,
  publicApiRegistry: scenarioWorkspacePublicApiRegistry,
  publicApiCount: scenarioWorkspacePublicApiCount,
  publicExportCount: scenarioWorkspacePublicExportCount,
  publicNamespaceCount: scenarioWorkspacePublicNamespaceCount,
  consumerEntry: scenarioWorkspaceConsumerEntry,
  releaseStatus: scenarioWorkspaceReleaseStatus,
  compatibility: scenarioWorkspaceCompatibility,
  readiness: scenarioWorkspaceReadiness,
  freezeReference: scenarioWorkspaceFreezeReference,
  publicExports: publicExportNames,
  soleDependency: "scenarioWorkspaceFreeze.ts",
  immutable: true,
  deterministic: true,
  metadataOnly: true,
  runtime: false,
  simulationEngine: false,
  predictionEngine: false,
  scenarioExecution: false,
  businessLogic: false,
  persistence: false,
  ui: false,
  networking: false,
  aiBehavior: false,
} as const);
