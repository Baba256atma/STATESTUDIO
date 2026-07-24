/**
 * WS-1:9 — Sole supported consumer entry for the frozen Workspace architecture.
 */
import { WorkspaceFreeze } from "./workspaceFreeze.ts";

export const WorkspacePublicIndexIdentity = Object.freeze({
  id: "WS-1:9/WorkspacePublicIndex", name: "Workspace Public Index",
  layer: "Workspace", phase: "1:9", version: "1.0.0",
  namespace: "nexora.workspace.public-index",
} as const);

export const WorkspacePublicIndexStatus = Object.freeze({
  release: "Released", certification: "Certified", freeze: "Frozen",
  stability: "Stable", readiness: "ReadyForConsumer",
} as const);

export const WorkspacePublicIndexNamespace = "nexora.workspace.public-index" as const;
export const WorkspacePublicIndexFoundation = WorkspaceFreeze.baselines.foundation;
export const WorkspacePublicIndexRegistry = WorkspaceFreeze.baselines.registry;
export const WorkspacePublicIndexModel = WorkspaceFreeze.baselines.model;
export const WorkspacePublicIndexValidation = WorkspaceFreeze.baselines.validation;
export const WorkspacePublicIndexManifest = WorkspaceFreeze.baselines.manifest;
export const WorkspacePublicIndexPlatform = WorkspaceFreeze.baselines.platform;
export const WorkspacePublicIndexCertification = WorkspaceFreeze.certification;
export const WorkspacePublicIndexFreeze = WorkspaceFreeze;

const publicIndexExportNames = Object.freeze([
  "WorkspacePublicIndexIdentity", "WorkspacePublicIndexStatus",
  "WorkspacePublicIndexNamespace", "WorkspacePublicIndexFoundation",
  "WorkspacePublicIndexRegistry", "WorkspacePublicIndexModel",
  "WorkspacePublicIndexValidation", "WorkspacePublicIndexManifest",
  "WorkspacePublicIndexPlatform", "WorkspacePublicIndexCertification",
  "WorkspacePublicIndexFreeze", "WorkspacePublicIndex",
] as const);

const publicApiRegistry = Object.freeze([
  ...WorkspaceFreeze.publicApiRegistry,
  ...publicIndexExportNames.map((exportName, index) => Object.freeze({
    id: `WS-1:9/PublicAPI/${String(index + 1).padStart(2, "0")}`,
    exportName, namespaceSection: "Public Index", sourcePhase: "WS-1:9",
    version: "1.0.0", stability: "Stable", consumerVisibility: "Public",
  })),
]);

const publicNamespace = Object.freeze([
  Object.freeze({ section: "Foundation", value: WorkspacePublicIndexFoundation }),
  Object.freeze({ section: "Registry", value: WorkspacePublicIndexRegistry }),
  Object.freeze({ section: "Model", value: WorkspacePublicIndexModel }),
  Object.freeze({ section: "Validation", value: WorkspacePublicIndexValidation }),
  Object.freeze({ section: "Manifest", value: WorkspacePublicIndexManifest }),
  Object.freeze({ section: "Platform", value: WorkspacePublicIndexPlatform }),
  Object.freeze({ section: "Certification", value: WorkspacePublicIndexCertification }),
  Object.freeze({ section: "Freeze", value: WorkspacePublicIndexFreeze }),
  Object.freeze({ section: "Public Index", value: WorkspacePublicIndexIdentity }),
] as const);

export const WorkspacePublicIndex = Object.freeze({
  identity: WorkspacePublicIndexIdentity, status: WorkspacePublicIndexStatus,
  canonicalNamespace: WorkspacePublicIndexNamespace,
  canonicalLockId: WorkspaceFreeze.canonicalLockId,
  publicNamespace, publicApiRegistry, publicApiCount: publicApiRegistry.length,
  soleConsumerEntry: "workspacePublicIndex.ts",
  compatibility: "Backward Compatible",
  releaseDeclaration: "Released · Certified · Frozen · Stable · ReadyForConsumer",
  consumerRules: Object.freeze([
    "Import only from workspacePublicIndex.ts", "Treat Public Index exports as immutable",
    "Respect the frozen version", "Avoid internal WS phase imports",
    "Avoid mutating public metadata", "Use future versions for breaking changes",
    "Use controlled extension mechanisms for additive changes",
  ]),
  soleDependency: "workspaceFreeze.ts", metadataOnly: true, immutable: true,
  runtime: false, ui: false, rendering: false, orchestration: false,
} as const);

