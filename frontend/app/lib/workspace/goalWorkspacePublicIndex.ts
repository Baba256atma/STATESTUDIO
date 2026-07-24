/** WS-3:9 — Sole consumer entry for the frozen Goal Workspace architecture. */
import { GoalWorkspaceFreeze } from "./goalWorkspaceFreeze.ts";

export const goalWorkspacePublicIndexIdentity = Object.freeze({
  id: "WS-3:9/GoalWorkspacePublicIndex",
  name: "Goal Workspace Public Index",
  layer: "Workspace Layer (WS)",
  phase: "WS-3:9",
  namespace: "nexora.workspace.goal.public-index",
  version: "1.0.0",
  release: "Released",
  certification: "Certified",
  freeze: "Frozen",
  stability: "Stable",
  readiness: "ReadyForConsumer",
  metadataOnly: true,
  immutable: true,
} as const);

export const goalWorkspacePublicApiRegistry = GoalWorkspaceFreeze.publicApi;

export const goalWorkspacePublicApiCount =
  goalWorkspacePublicApiRegistry.length;

const publicExportNames = Object.freeze([
  "goalWorkspacePublicIndexIdentity",
  "goalWorkspacePublicNamespace",
  "goalWorkspacePublicApiRegistry",
  "goalWorkspacePublicApiCount",
  "goalWorkspacePublicExportCount",
  "goalWorkspacePublicNamespaceCount",
  "goalWorkspaceConsumerEntry",
  "goalWorkspaceReleaseStatus",
  "goalWorkspaceCompatibility",
  "goalWorkspaceReadiness",
  "goalWorkspaceFreezeReference",
  "goalWorkspacePublicIndex",
] as const);

export const goalWorkspacePublicExportCount = publicExportNames.length;

export const goalWorkspaceConsumerEntry = Object.freeze({
  file: "goalWorkspacePublicIndex.ts",
  declaration: "Sole supported Goal Workspace consumer entry",
  dependency: "goalWorkspaceFreeze.ts",
  dependencyPhase: "WS-3:8 Goal Workspace Freeze",
  directEarlierPhaseImportsPermitted: false,
  metadataOnly: true,
  immutable: true,
} as const);

export const goalWorkspaceReleaseStatus = Object.freeze({
  release: "Released",
  certification: "Certified",
  freeze: "Frozen",
  stability: "Stable",
  readiness: "ReadyForConsumer",
} as const);

export const goalWorkspaceCompatibility =
  GoalWorkspaceFreeze.compatibility;

export const goalWorkspaceReadiness = "ReadyForConsumer" as const;

export const goalWorkspaceFreezeReference = GoalWorkspaceFreeze;

export const goalWorkspacePublicNamespace = Object.freeze([
  Object.freeze({
    section: "Identity",
    value: goalWorkspacePublicIndexIdentity,
  }),
  Object.freeze({
    section: "Platform",
    value: GoalWorkspaceFreeze.inventory.sourceChain.platform,
  }),
  Object.freeze({
    section: "Workspace",
    value: GoalWorkspaceFreeze.inventory.workspaceIdentity,
  }),
  Object.freeze({
    section: "Metadata",
    value: GoalWorkspaceFreeze.inventory,
  }),
  Object.freeze({
    section: "Public API",
    value: goalWorkspacePublicApiRegistry,
  }),
  Object.freeze({
    section: "Consumer",
    value: goalWorkspaceConsumerEntry,
  }),
  Object.freeze({
    section: "Release",
    value: goalWorkspaceReleaseStatus,
  }),
  Object.freeze({
    section: "Compatibility",
    value: goalWorkspaceCompatibility,
  }),
  Object.freeze({
    section: "Readiness",
    value: goalWorkspaceReadiness,
  }),
] as const);

export const goalWorkspacePublicNamespaceCount =
  goalWorkspacePublicNamespace.length;

export const goalWorkspacePublicIndex = Object.freeze({
  identity: goalWorkspacePublicIndexIdentity,
  namespace: goalWorkspacePublicNamespace,
  publicApiRegistry: goalWorkspacePublicApiRegistry,
  publicApiCount: goalWorkspacePublicApiCount,
  publicExportCount: goalWorkspacePublicExportCount,
  publicNamespaceCount: goalWorkspacePublicNamespaceCount,
  consumerEntry: goalWorkspaceConsumerEntry,
  releaseStatus: goalWorkspaceReleaseStatus,
  compatibility: goalWorkspaceCompatibility,
  readiness: goalWorkspaceReadiness,
  freezeReference: goalWorkspaceFreezeReference,
  publicExports: publicExportNames,
  soleDependency: "goalWorkspaceFreeze.ts",
  immutable: true,
  deterministic: true,
  metadataOnly: true,
  runtime: false,
  businessLogic: false,
  persistence: false,
  ui: false,
  networking: false,
  aiBehavior: false,
} as const);
