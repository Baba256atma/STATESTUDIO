/** ASSISTANT-5:9 — Sole public consumer entry for Workspace Orchestration. */
import { AssistantWorkspaceOrchestrationFreeze } from "./assistantWorkspaceOrchestrationFreeze.ts";

const freeze = AssistantWorkspaceOrchestrationFreeze;

const namespaceSectionOrder = Object.freeze([
  "Identity",
  "Metadata",
  "Namespace",
  "Version",
  "Status",
  "Readiness",
  "Public API Registry",
  "Consumer Entry",
  "Freeze Reference",
] as const);

const publicExportNames = Object.freeze([
  "assistantWorkspaceOrchestrationPublicIndexIdentity",
  "assistantWorkspaceOrchestrationPublicIndexMetadata",
  "assistantWorkspaceOrchestrationPublicIndexNamespace",
  "assistantWorkspaceOrchestrationPublicIndexVersion",
  "assistantWorkspaceOrchestrationPublicIndexStatus",
  "assistantWorkspaceOrchestrationPublicIndexReadiness",
  "assistantWorkspaceOrchestrationPublicApiRegistry",
  "assistantWorkspaceOrchestrationPublicApiCount",
  "assistantWorkspaceOrchestrationPublicExports",
  "assistantWorkspaceOrchestrationPublicCompatibility",
  "assistantWorkspaceOrchestrationConsumerEntry",
  "assistantWorkspaceOrchestrationFreezeReference",
] as const);

const constants = Object.freeze({
  canonicalIdentifier: "ASSISTANT-5:9/WorkspaceOrchestrationPublicIndex",
  namespace: "nexora.assistant.workspace-orchestration.public-index",
  version: "1.0.0",
  releaseStatus: Object.freeze({
    release: "Released",
    certification: "Certified",
    freeze: "Frozen",
    stability: "Stable",
  }),
  readiness: "ReadyForConsumer",
  namespaceSectionCount: namespaceSectionOrder.length,
  publicExportCount: publicExportNames.length,
} as const);

export const assistantWorkspaceOrchestrationFreezeReference = freeze;

export const assistantWorkspaceOrchestrationPublicIndexIdentity =
  Object.freeze({
    id: constants.canonicalIdentifier,
    name: "Assistant Workspace Orchestration Public Index",
    phaseId: "ASSISTANT-5:9",
    namespace: constants.namespace,
    version: constants.version,
    release: constants.releaseStatus.release,
    certification: constants.releaseStatus.certification,
    freeze: constants.releaseStatus.freeze,
    stability: constants.releaseStatus.stability,
    readiness: constants.readiness,
    sourceFreeze: freeze.identity.id,
    lockIdentifier: freeze.lock.lockIdentifier,
    metadataOnly: true,
    immutable: true,
  } as const);

export const assistantWorkspaceOrchestrationPublicIndexVersion =
  constants.version;

export const assistantWorkspaceOrchestrationPublicIndexStatus = Object.freeze({
  release: constants.releaseStatus.release,
  certification: constants.releaseStatus.certification,
  freeze: constants.releaseStatus.freeze,
  stability: constants.releaseStatus.stability,
} as const);

export const assistantWorkspaceOrchestrationPublicIndexReadiness =
  constants.readiness;

export const assistantWorkspaceOrchestrationPublicApiRegistry = Object.freeze(
  freeze.publicApiSurface.map((exportName, index) => Object.freeze({
    apiIdentifier:
      `ASSISTANT-5:9/Api/${String(index + 1).padStart(2, "0")}`,
    exportName,
    namespace: freeze.identity.namespace,
    sourcePhase: freeze.identity.id,
    version: freeze.identity.version,
    status: freeze.status,
    readiness: freeze.readiness,
    order: index + 1,
    executable: false,
    metadataOnly: true,
    immutable: true,
  })),
);

export const assistantWorkspaceOrchestrationPublicApiCount =
  assistantWorkspaceOrchestrationPublicApiRegistry.length;

export const assistantWorkspaceOrchestrationPublicExports = publicExportNames;

export const assistantWorkspaceOrchestrationPublicCompatibility =
  freeze.compatibility;

export const assistantWorkspaceOrchestrationConsumerEntry = Object.freeze({
  file: "assistantWorkspaceOrchestrationPublicIndex.ts",
  declaration: "Sole supported Workspace Orchestration consumer entry",
  dependency: "assistantWorkspaceOrchestrationFreeze.ts",
  dependencyPhase: "ASSISTANT-5:8 Workspace Orchestration Freeze",
  directArchitecturalImportsPermitted: false,
  prohibitedDirectImports: Object.freeze([
    "ASSISTANT-5:1 Workspace Orchestration Foundation",
    "ASSISTANT-5:2 Workspace Orchestration Registry",
    "ASSISTANT-5:3 Workspace Orchestration Model",
    "ASSISTANT-5:4 Workspace Orchestration Validation",
    "ASSISTANT-5:5 Workspace Orchestration Manifest",
    "ASSISTANT-5:6 Workspace Orchestration Platform",
    "ASSISTANT-5:7 Workspace Orchestration Certification",
    "ASSISTANT-5:8 Workspace Orchestration Freeze",
  ]),
  stablePublicSurface: true,
  metadataOnly: true,
  immutable: true,
} as const);

export const assistantWorkspaceOrchestrationPublicIndexMetadata =
  Object.freeze({
    canonicalIdentity: assistantWorkspaceOrchestrationPublicIndexIdentity.id,
    namespace: constants.namespace,
    version: constants.version,
    releaseStatus: assistantWorkspaceOrchestrationPublicIndexStatus,
    readiness: assistantWorkspaceOrchestrationPublicIndexReadiness,
    publicExportCount: constants.publicExportCount,
    publicApiCount: assistantWorkspaceOrchestrationPublicApiCount,
    freezeReference: freeze.identity.id,
    consumerEntry: assistantWorkspaceOrchestrationConsumerEntry.file,
    namespaceSectionCount: constants.namespaceSectionCount,
    lockIdentifier: freeze.lock.lockIdentifier,
    constants,
    metadataOnly: true,
    immutable: true,
  } as const);

export const assistantWorkspaceOrchestrationPublicIndexNamespace =
  Object.freeze([
    Object.freeze({
      section: "Identity",
      order: 1,
      value: assistantWorkspaceOrchestrationPublicIndexIdentity,
    }),
    Object.freeze({
      section: "Metadata",
      order: 2,
      value: assistantWorkspaceOrchestrationPublicIndexMetadata,
    }),
    Object.freeze({
      section: "Namespace",
      order: 3,
      value: namespaceSectionOrder,
    }),
    Object.freeze({
      section: "Version",
      order: 4,
      value: assistantWorkspaceOrchestrationPublicIndexVersion,
    }),
    Object.freeze({
      section: "Status",
      order: 5,
      value: assistantWorkspaceOrchestrationPublicIndexStatus,
    }),
    Object.freeze({
      section: "Readiness",
      order: 6,
      value: assistantWorkspaceOrchestrationPublicIndexReadiness,
    }),
    Object.freeze({
      section: "Public API Registry",
      order: 7,
      value: assistantWorkspaceOrchestrationPublicApiRegistry,
    }),
    Object.freeze({
      section: "Consumer Entry",
      order: 8,
      value: assistantWorkspaceOrchestrationConsumerEntry,
    }),
    Object.freeze({
      section: "Freeze Reference",
      order: 9,
      value: assistantWorkspaceOrchestrationFreezeReference,
    }),
  ] as const);
