/** ASSISTANT-2:9 — Sole public consumer entry for Assistant Executive Memory. */
import { AssistantExecutiveMemoryFreeze } from "./assistantExecutiveMemoryFreeze.ts";

const freeze = AssistantExecutiveMemoryFreeze;

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
  "assistantExecutiveMemoryPublicIndexIdentity",
  "assistantExecutiveMemoryPublicIndexMetadata",
  "assistantExecutiveMemoryPublicIndexNamespace",
  "assistantExecutiveMemoryPublicIndexVersion",
  "assistantExecutiveMemoryPublicIndexStatus",
  "assistantExecutiveMemoryPublicIndexReadiness",
  "assistantExecutiveMemoryPublicApiRegistry",
  "assistantExecutiveMemoryPublicApiCount",
  "assistantExecutiveMemoryPublicExports",
  "assistantExecutiveMemoryPublicCompatibility",
  "assistantExecutiveMemoryConsumerEntry",
  "assistantExecutiveMemoryFreezeReference",
] as const);

const constants = Object.freeze({
  canonicalIdentifier: "ASSISTANT-2:9/ExecutiveMemoryPublicIndex",
  namespace: "nexora.assistant.executive-memory.public-index",
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

export const assistantExecutiveMemoryFreezeReference = freeze;

export const assistantExecutiveMemoryPublicIndexIdentity = Object.freeze({
  id: constants.canonicalIdentifier,
  name: "Assistant Executive Memory Public Index",
  phaseId: "ASSISTANT-2:9",
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

export const assistantExecutiveMemoryPublicIndexVersion = constants.version;

export const assistantExecutiveMemoryPublicIndexStatus = Object.freeze({
  release: constants.releaseStatus.release,
  certification: constants.releaseStatus.certification,
  freeze: constants.releaseStatus.freeze,
  stability: constants.releaseStatus.stability,
} as const);

export const assistantExecutiveMemoryPublicIndexReadiness = constants.readiness;

export const assistantExecutiveMemoryPublicApiRegistry = Object.freeze(
  freeze.publicApiSurface.map((exportName, index) => Object.freeze({
    apiIdentifier:
      `ASSISTANT-2:9/Api/${String(index + 1).padStart(2, "0")}`,
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

export const assistantExecutiveMemoryPublicApiCount =
  assistantExecutiveMemoryPublicApiRegistry.length;

export const assistantExecutiveMemoryPublicExports = publicExportNames;

export const assistantExecutiveMemoryPublicCompatibility = freeze.compatibility;

export const assistantExecutiveMemoryConsumerEntry = Object.freeze({
  file: "assistantExecutiveMemoryPublicIndex.ts",
  declaration: "Sole supported Assistant Executive Memory consumer entry",
  dependency: "assistantExecutiveMemoryFreeze.ts",
  dependencyPhase: "ASSISTANT-2:8 Executive Memory Freeze",
  directArchitecturalImportsPermitted: false,
  prohibitedDirectImports: Object.freeze([
    "ASSISTANT-2:1 Executive Memory Foundation",
    "ASSISTANT-2:2 Executive Memory Registry",
    "ASSISTANT-2:3 Executive Memory Model",
    "ASSISTANT-2:4 Executive Memory Validation",
    "ASSISTANT-2:5 Executive Memory Manifest",
    "ASSISTANT-2:6 Executive Memory Platform",
    "ASSISTANT-2:7 Executive Memory Certification",
    "ASSISTANT-2:8 Executive Memory Freeze",
  ]),
  stablePublicSurface: true,
  metadataOnly: true,
  immutable: true,
} as const);

export const assistantExecutiveMemoryPublicIndexMetadata = Object.freeze({
  canonicalIdentity: assistantExecutiveMemoryPublicIndexIdentity.id,
  namespace: constants.namespace,
  version: constants.version,
  releaseStatus: assistantExecutiveMemoryPublicIndexStatus,
  readiness: assistantExecutiveMemoryPublicIndexReadiness,
  publicExportCount: constants.publicExportCount,
  publicApiCount: assistantExecutiveMemoryPublicApiCount,
  freezeReference: freeze.identity.id,
  consumerEntry: assistantExecutiveMemoryConsumerEntry.file,
  namespaceSectionCount: constants.namespaceSectionCount,
  lockIdentifier: freeze.lock.lockIdentifier,
  constants,
  metadataOnly: true,
  immutable: true,
} as const);

export const assistantExecutiveMemoryPublicIndexNamespace = Object.freeze([
  Object.freeze({
    section: "Identity",
    order: 1,
    value: assistantExecutiveMemoryPublicIndexIdentity,
  }),
  Object.freeze({
    section: "Metadata",
    order: 2,
    value: assistantExecutiveMemoryPublicIndexMetadata,
  }),
  Object.freeze({
    section: "Namespace",
    order: 3,
    value: namespaceSectionOrder,
  }),
  Object.freeze({
    section: "Version",
    order: 4,
    value: assistantExecutiveMemoryPublicIndexVersion,
  }),
  Object.freeze({
    section: "Status",
    order: 5,
    value: assistantExecutiveMemoryPublicIndexStatus,
  }),
  Object.freeze({
    section: "Readiness",
    order: 6,
    value: assistantExecutiveMemoryPublicIndexReadiness,
  }),
  Object.freeze({
    section: "Public API Registry",
    order: 7,
    value: assistantExecutiveMemoryPublicApiRegistry,
  }),
  Object.freeze({
    section: "Consumer Entry",
    order: 8,
    value: assistantExecutiveMemoryConsumerEntry,
  }),
  Object.freeze({
    section: "Freeze Reference",
    order: 9,
    value: assistantExecutiveMemoryFreezeReference,
  }),
] as const);
