/** WS-7:9 — Sole public consumer entry for WS-7 Decision Workspace. */
import { DecisionWorkspaceV7Freeze } from "./decisionWorkspaceV7Freeze.ts";

export const decisionWorkspacePublicIdentity = Object.freeze({
  id: "WS-7:9/DecisionWorkspacePublicIndex",
  name: "Decision Workspace Public Index",
  phaseId: "WS-7:9",
  namespace: "nexora.workspace.decision.public-index",
  version: "1.0.0",
  layer: "Workspace Layer",
  status: "Released",
  certification: "Certified",
  freeze: "Frozen",
  stability: "Stable",
  readiness: "ReadyForConsumer",
  metadataOnly: true,
  immutable: true,
} as const);

export const decisionWorkspaceFreezeReference = DecisionWorkspaceV7Freeze;

export const decisionWorkspacePlatformReference =
  DecisionWorkspaceV7Freeze.certification.platform;

export const decisionWorkspacePublicVersion =
  decisionWorkspacePublicIdentity.version;

export const decisionWorkspacePublicApiRegistry =
  DecisionWorkspaceV7Freeze.publicApi;

export const decisionWorkspacePublicApiCount =
  DecisionWorkspaceV7Freeze.publicApi.length;

export const decisionWorkspaceConsumerEntry = Object.freeze({
  file: "decisionWorkspaceV7PublicIndex.ts",
  canonicalConsumerEntry: "decisionWorkspacePublicIndex.ts",
  declaration: "Sole supported WS-7 Decision Workspace consumer entry",
  dependency: "decisionWorkspaceV7Freeze.ts",
  dependencyPhase: "WS-7:8 Decision Workspace Freeze",
  collisionSafeForExistingWs4: true,
  directArchitecturalImportsPermitted: false,
  stablePublicSurface: true,
  metadataOnly: true,
  immutable: true,
} as const);

export const decisionWorkspaceReleaseStatus = Object.freeze({
  release: "Released",
  certification: "Certified",
  freeze: "Frozen",
  stability: "Stable",
  readiness: "ReadyForConsumer",
} as const);

export const decisionWorkspaceReadiness = "ReadyForConsumer" as const;

export const decisionWorkspacePublicMetadata = Object.freeze({
  identity: decisionWorkspacePublicIdentity,
  version: decisionWorkspacePublicVersion,
  release: decisionWorkspaceReleaseStatus,
  readiness: decisionWorkspaceReadiness,
  freezeMetadata: DecisionWorkspaceV7Freeze.metadata,
  lock: DecisionWorkspaceV7Freeze.lock,
  immutable: true,
  metadataOnly: true,
} as const);

export const decisionWorkspacePublicNamespace = Object.freeze([
  Object.freeze({
    section: "Identity",
    value: decisionWorkspacePublicIdentity,
  }),
  Object.freeze({
    section: "Workspace",
    value: DecisionWorkspaceV7Freeze.metadata.workspaceIdentity,
  }),
  Object.freeze({
    section: "Foundation",
    value: DecisionWorkspaceV7Freeze.baselines[0],
  }),
  Object.freeze({
    section: "Registry",
    value: DecisionWorkspaceV7Freeze.baselines[1],
  }),
  Object.freeze({
    section: "Model",
    value: DecisionWorkspaceV7Freeze.baselines[2],
  }),
  Object.freeze({
    section: "Validation",
    value: DecisionWorkspaceV7Freeze.baselines[3],
  }),
  Object.freeze({
    section: "Platform",
    value: decisionWorkspacePlatformReference,
  }),
  Object.freeze({
    section: "Release",
    value: decisionWorkspaceReleaseStatus,
  }),
  Object.freeze({
    section: "Consumer",
    value: decisionWorkspaceConsumerEntry,
  }),
] as const);

const publicExportNames = Object.freeze([
  "decisionWorkspacePublicIndex",
  "decisionWorkspacePublicMetadata",
  "decisionWorkspacePublicIdentity",
  "decisionWorkspacePublicNamespace",
  "decisionWorkspacePublicVersion",
  "decisionWorkspacePublicApiRegistry",
  "decisionWorkspacePublicApiCount",
  "decisionWorkspaceConsumerEntry",
  "decisionWorkspaceReleaseStatus",
  "decisionWorkspaceReadiness",
  "decisionWorkspaceFreezeReference",
  "decisionWorkspacePlatformReference",
] as const);

export const decisionWorkspacePublicIndex = Object.freeze({
  identity: decisionWorkspacePublicIdentity,
  metadata: decisionWorkspacePublicMetadata,
  namespace: decisionWorkspacePublicNamespace,
  version: decisionWorkspacePublicVersion,
  publicApiRegistry: decisionWorkspacePublicApiRegistry,
  publicApiCount: decisionWorkspacePublicApiCount,
  consumerEntry: decisionWorkspaceConsumerEntry,
  releaseStatus: decisionWorkspaceReleaseStatus,
  readiness: decisionWorkspaceReadiness,
  freezeReference: decisionWorkspaceFreezeReference,
  platformReference: decisionWorkspacePlatformReference,
  publicExports: publicExportNames,
  publicExportCount: publicExportNames.length,
  namespaceCount: decisionWorkspacePublicNamespace.length,
  soleDependency: "decisionWorkspaceV7Freeze.ts",
  soleConsumerEntry: true,
  immutable: true,
  deterministic: true,
  metadataOnly: true,
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
