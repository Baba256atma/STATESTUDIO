/** ASSISTANT-4:9 — Sole public consumer entry for Executive Guidance. */
import { AssistantExecutiveGuidanceFreeze } from "./assistantExecutiveGuidanceFreeze.ts";

const freeze = AssistantExecutiveGuidanceFreeze;

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
  "assistantExecutiveGuidancePublicIndexIdentity",
  "assistantExecutiveGuidancePublicIndexMetadata",
  "assistantExecutiveGuidancePublicIndexNamespace",
  "assistantExecutiveGuidancePublicIndexVersion",
  "assistantExecutiveGuidancePublicIndexStatus",
  "assistantExecutiveGuidancePublicIndexReadiness",
  "assistantExecutiveGuidancePublicApiRegistry",
  "assistantExecutiveGuidancePublicApiCount",
  "assistantExecutiveGuidancePublicExports",
  "assistantExecutiveGuidancePublicCompatibility",
  "assistantExecutiveGuidanceConsumerEntry",
  "assistantExecutiveGuidanceFreezeReference",
] as const);

const constants = Object.freeze({
  canonicalIdentifier: "ASSISTANT-4:9/ExecutiveGuidancePublicIndex",
  namespace: "nexora.assistant.executive-guidance.public-index",
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

export const assistantExecutiveGuidanceFreezeReference = freeze;

export const assistantExecutiveGuidancePublicIndexIdentity = Object.freeze({
  id: constants.canonicalIdentifier,
  name: "Assistant Executive Guidance Public Index",
  phaseId: "ASSISTANT-4:9",
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

export const assistantExecutiveGuidancePublicIndexVersion = constants.version;

export const assistantExecutiveGuidancePublicIndexStatus = Object.freeze({
  release: constants.releaseStatus.release,
  certification: constants.releaseStatus.certification,
  freeze: constants.releaseStatus.freeze,
  stability: constants.releaseStatus.stability,
} as const);

export const assistantExecutiveGuidancePublicIndexReadiness =
  constants.readiness;

export const assistantExecutiveGuidancePublicApiRegistry = Object.freeze(
  freeze.publicApiSurface.map((exportName, index) => Object.freeze({
    apiIdentifier:
      `ASSISTANT-4:9/Api/${String(index + 1).padStart(2, "0")}`,
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

export const assistantExecutiveGuidancePublicApiCount =
  assistantExecutiveGuidancePublicApiRegistry.length;

export const assistantExecutiveGuidancePublicExports = publicExportNames;

export const assistantExecutiveGuidancePublicCompatibility =
  freeze.compatibility;

export const assistantExecutiveGuidanceConsumerEntry = Object.freeze({
  file: "assistantExecutiveGuidancePublicIndex.ts",
  declaration: "Sole supported Executive Guidance consumer entry",
  dependency: "assistantExecutiveGuidanceFreeze.ts",
  dependencyPhase: "ASSISTANT-4:8 Executive Guidance Freeze",
  directArchitecturalImportsPermitted: false,
  prohibitedDirectImports: Object.freeze([
    "ASSISTANT-4:1 Executive Guidance Foundation",
    "ASSISTANT-4:2 Executive Guidance Registry",
    "ASSISTANT-4:3 Executive Guidance Model",
    "ASSISTANT-4:4 Executive Guidance Validation",
    "ASSISTANT-4:5 Executive Guidance Manifest",
    "ASSISTANT-4:6 Executive Guidance Platform",
    "ASSISTANT-4:7 Executive Guidance Certification",
    "ASSISTANT-4:8 Executive Guidance Freeze",
  ]),
  stablePublicSurface: true,
  metadataOnly: true,
  immutable: true,
} as const);

export const assistantExecutiveGuidancePublicIndexMetadata = Object.freeze({
  canonicalIdentity: assistantExecutiveGuidancePublicIndexIdentity.id,
  namespace: constants.namespace,
  version: constants.version,
  releaseStatus: assistantExecutiveGuidancePublicIndexStatus,
  readiness: assistantExecutiveGuidancePublicIndexReadiness,
  publicExportCount: constants.publicExportCount,
  publicApiCount: assistantExecutiveGuidancePublicApiCount,
  freezeReference: freeze.identity.id,
  consumerEntry: assistantExecutiveGuidanceConsumerEntry.file,
  namespaceSectionCount: constants.namespaceSectionCount,
  lockIdentifier: freeze.lock.lockIdentifier,
  constants,
  metadataOnly: true,
  immutable: true,
} as const);

export const assistantExecutiveGuidancePublicIndexNamespace = Object.freeze([
  Object.freeze({
    section: "Identity",
    order: 1,
    value: assistantExecutiveGuidancePublicIndexIdentity,
  }),
  Object.freeze({
    section: "Metadata",
    order: 2,
    value: assistantExecutiveGuidancePublicIndexMetadata,
  }),
  Object.freeze({
    section: "Namespace",
    order: 3,
    value: namespaceSectionOrder,
  }),
  Object.freeze({
    section: "Version",
    order: 4,
    value: assistantExecutiveGuidancePublicIndexVersion,
  }),
  Object.freeze({
    section: "Status",
    order: 5,
    value: assistantExecutiveGuidancePublicIndexStatus,
  }),
  Object.freeze({
    section: "Readiness",
    order: 6,
    value: assistantExecutiveGuidancePublicIndexReadiness,
  }),
  Object.freeze({
    section: "Public API Registry",
    order: 7,
    value: assistantExecutiveGuidancePublicApiRegistry,
  }),
  Object.freeze({
    section: "Consumer Entry",
    order: 8,
    value: assistantExecutiveGuidanceConsumerEntry,
  }),
  Object.freeze({
    section: "Freeze Reference",
    order: 9,
    value: assistantExecutiveGuidanceFreezeReference,
  }),
] as const);
