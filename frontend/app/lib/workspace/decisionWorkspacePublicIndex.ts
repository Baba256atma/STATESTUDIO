/** WS-4:9 — Sole consumer entry for the frozen Decision Workspace architecture. */
import { DecisionWorkspaceFreeze } from "./decisionWorkspaceFreeze.ts";

export const decisionWorkspacePublicIndexIdentity = Object.freeze({
  id: "WS-4:9/DecisionWorkspacePublicIndex",
  name: "Decision Workspace Public Index",
  layer: "Workspace Layer (WS)",
  phase: "WS-4:9",
  namespace: "nexora.workspace.decision.public-index",
  version: "1.0.0",
  release: "Released",
  certification: "Certified",
  freeze: "Frozen",
  stability: "Stable",
  readiness: "ReadyForConsumer",
  metadataOnly: true,
  immutable: true,
} as const);

export const decisionWorkspacePublicApiRegistry =
  DecisionWorkspaceFreeze.publicApi;

export const decisionWorkspacePublicApiCount =
  decisionWorkspacePublicApiRegistry.length;

const publicExportNames = Object.freeze([
  "decisionWorkspacePublicIndexIdentity",
  "decisionWorkspacePublicNamespace",
  "decisionWorkspacePublicApiRegistry",
  "decisionWorkspacePublicApiCount",
  "decisionWorkspacePublicExportCount",
  "decisionWorkspacePublicNamespaceCount",
  "decisionWorkspaceConsumerEntry",
  "decisionWorkspaceReleaseStatus",
  "decisionWorkspaceCompatibility",
  "decisionWorkspaceReadiness",
  "decisionWorkspaceFreezeReference",
  "decisionWorkspacePublicIndex",
] as const);

export const decisionWorkspacePublicExportCount = publicExportNames.length;

export const decisionWorkspaceConsumerEntry = Object.freeze({
  file: "decisionWorkspacePublicIndex.ts",
  declaration: "Sole supported Decision Workspace consumer entry",
  dependency: "decisionWorkspaceFreeze.ts",
  dependencyPhase: "WS-4:8 Decision Workspace Freeze",
  directEarlierPhaseImportsPermitted: false,
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

export const decisionWorkspaceCompatibility =
  DecisionWorkspaceFreeze.compatibility;

export const decisionWorkspaceReadiness = "ReadyForConsumer" as const;

export const decisionWorkspaceFreezeReference = DecisionWorkspaceFreeze;

export const decisionWorkspacePublicNamespace = Object.freeze([
  Object.freeze({
    section: "Identity",
    value: decisionWorkspacePublicIndexIdentity,
  }),
  Object.freeze({
    section: "Platform",
    value: DecisionWorkspaceFreeze.inventory.sourceChain.platform,
  }),
  Object.freeze({
    section: "Workspace",
    value: DecisionWorkspaceFreeze.inventory.workspaceIdentity,
  }),
  Object.freeze({
    section: "Metadata",
    value: DecisionWorkspaceFreeze.inventory,
  }),
  Object.freeze({
    section: "Public API",
    value: decisionWorkspacePublicApiRegistry,
  }),
  Object.freeze({
    section: "Consumer",
    value: decisionWorkspaceConsumerEntry,
  }),
  Object.freeze({
    section: "Release",
    value: decisionWorkspaceReleaseStatus,
  }),
  Object.freeze({
    section: "Compatibility",
    value: decisionWorkspaceCompatibility,
  }),
  Object.freeze({
    section: "Readiness",
    value: decisionWorkspaceReadiness,
  }),
] as const);

export const decisionWorkspacePublicNamespaceCount =
  decisionWorkspacePublicNamespace.length;

export const decisionWorkspacePublicIndex = Object.freeze({
  identity: decisionWorkspacePublicIndexIdentity,
  namespace: decisionWorkspacePublicNamespace,
  publicApiRegistry: decisionWorkspacePublicApiRegistry,
  publicApiCount: decisionWorkspacePublicApiCount,
  publicExportCount: decisionWorkspacePublicExportCount,
  publicNamespaceCount: decisionWorkspacePublicNamespaceCount,
  consumerEntry: decisionWorkspaceConsumerEntry,
  releaseStatus: decisionWorkspaceReleaseStatus,
  compatibility: decisionWorkspaceCompatibility,
  readiness: decisionWorkspaceReadiness,
  freezeReference: decisionWorkspaceFreezeReference,
  publicExports: publicExportNames,
  soleDependency: "decisionWorkspaceFreeze.ts",
  immutable: true,
  deterministic: true,
  metadataOnly: true,
  runtime: false,
  decisionExecution: false,
  decisionCreation: false,
  decisionEditing: false,
  businessLogic: false,
  persistence: false,
  ui: false,
  networking: false,
  aiBehavior: false,
} as const);
