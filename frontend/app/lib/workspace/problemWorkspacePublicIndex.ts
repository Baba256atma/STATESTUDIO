/** WS-6:9 — Sole public consumer entry for Problem Workspace. */
import { ProblemWorkspaceFreeze } from "./problemWorkspaceFreeze.ts";

export const problemWorkspacePublicIdentity = Object.freeze({
  id: "WS-6:9/ProblemWorkspacePublicIndex",
  name: "Problem Workspace Public Index",
  phaseId: "WS-6:9",
  namespace: "nexora.workspace.problem.public-index",
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

export const problemWorkspaceFreezeReference = ProblemWorkspaceFreeze;

export const problemWorkspacePlatformReference =
  ProblemWorkspaceFreeze.certification.platform;

export const problemWorkspacePublicVersion =
  problemWorkspacePublicIdentity.version;

export const problemWorkspacePublicApiRegistry =
  ProblemWorkspaceFreeze.publicApi;

export const problemWorkspacePublicApiCount =
  ProblemWorkspaceFreeze.publicApi.length;

export const problemWorkspaceConsumerEntry = Object.freeze({
  file: "problemWorkspacePublicIndex.ts",
  declaration: "Sole supported Problem Workspace consumer entry",
  dependency: "problemWorkspaceFreeze.ts",
  dependencyPhase: "WS-6:8 Problem Workspace Freeze",
  directArchitecturalImportsPermitted: false,
  stablePublicSurface: true,
  metadataOnly: true,
  immutable: true,
} as const);

export const problemWorkspaceReleaseStatus = Object.freeze({
  release: "Released",
  certification: "Certified",
  freeze: "Frozen",
  stability: "Stable",
  readiness: "ReadyForConsumer",
} as const);

export const problemWorkspaceReadiness = "ReadyForConsumer" as const;

export const problemWorkspacePublicMetadata = Object.freeze({
  identity: problemWorkspacePublicIdentity,
  version: problemWorkspacePublicVersion,
  release: problemWorkspaceReleaseStatus,
  readiness: problemWorkspaceReadiness,
  freezeMetadata: ProblemWorkspaceFreeze.metadata,
  lock: ProblemWorkspaceFreeze.lock,
  immutable: true,
  metadataOnly: true,
} as const);

export const problemWorkspacePublicNamespace = Object.freeze([
  Object.freeze({
    section: "Identity",
    value: problemWorkspacePublicIdentity,
  }),
  Object.freeze({
    section: "Workspace",
    value: ProblemWorkspaceFreeze.metadata.workspaceIdentity,
  }),
  Object.freeze({
    section: "Foundation",
    value: ProblemWorkspaceFreeze.baselines[0],
  }),
  Object.freeze({
    section: "Registry",
    value: ProblemWorkspaceFreeze.baselines[1],
  }),
  Object.freeze({
    section: "Model",
    value: ProblemWorkspaceFreeze.baselines[2],
  }),
  Object.freeze({
    section: "Validation",
    value: ProblemWorkspaceFreeze.baselines[3],
  }),
  Object.freeze({
    section: "Platform",
    value: problemWorkspacePlatformReference,
  }),
  Object.freeze({
    section: "Release",
    value: problemWorkspaceReleaseStatus,
  }),
  Object.freeze({
    section: "Consumer",
    value: problemWorkspaceConsumerEntry,
  }),
] as const);

const publicExportNames = Object.freeze([
  "problemWorkspacePublicIndex",
  "problemWorkspacePublicMetadata",
  "problemWorkspacePublicIdentity",
  "problemWorkspacePublicNamespace",
  "problemWorkspacePublicVersion",
  "problemWorkspacePublicApiRegistry",
  "problemWorkspacePublicApiCount",
  "problemWorkspaceConsumerEntry",
  "problemWorkspaceReleaseStatus",
  "problemWorkspaceReadiness",
  "problemWorkspaceFreezeReference",
  "problemWorkspacePlatformReference",
] as const);

export const problemWorkspacePublicIndex = Object.freeze({
  identity: problemWorkspacePublicIdentity,
  metadata: problemWorkspacePublicMetadata,
  namespace: problemWorkspacePublicNamespace,
  version: problemWorkspacePublicVersion,
  publicApiRegistry: problemWorkspacePublicApiRegistry,
  publicApiCount: problemWorkspacePublicApiCount,
  consumerEntry: problemWorkspaceConsumerEntry,
  releaseStatus: problemWorkspaceReleaseStatus,
  readiness: problemWorkspaceReadiness,
  freezeReference: problemWorkspaceFreezeReference,
  platformReference: problemWorkspacePlatformReference,
  publicExports: publicExportNames,
  publicExportCount: publicExportNames.length,
  namespaceCount: problemWorkspacePublicNamespace.length,
  soleDependency: "problemWorkspaceFreeze.ts",
  soleConsumerEntry: true,
  immutable: true,
  deterministic: true,
  metadataOnly: true,
  runtime: false,
  aiReasoning: false,
  rootCauseAnalysis: false,
  workflowExecution: false,
  orchestration: false,
  persistence: false,
  networking: false,
  rendering: false,
  visualization: false,
  stateManagement: false,
  services: false,
  factories: false,
  businessLogic: false,
} as const);
