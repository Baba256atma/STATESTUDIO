/** ASSISTANT-1:9 — Sole public consumer entry for Assistant Conversation. */
import { AssistantConversationFreeze } from "./assistantConversationFreeze.ts";

const freeze = AssistantConversationFreeze;

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
  "assistantConversationPublicIndexIdentity",
  "assistantConversationPublicIndexMetadata",
  "assistantConversationPublicIndexNamespace",
  "assistantConversationPublicIndexVersion",
  "assistantConversationPublicIndexStatus",
  "assistantConversationPublicIndexReadiness",
  "assistantConversationPublicApiRegistry",
  "assistantConversationPublicApiCount",
  "assistantConversationPublicExports",
  "assistantConversationPublicCompatibility",
  "assistantConversationConsumerEntry",
  "assistantConversationFreezeReference",
] as const);

const constants = Object.freeze({
  canonicalIdentifier: "ASSISTANT-1:9/ConversationPublicIndex",
  namespace: "nexora.assistant.conversation.public-index",
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

export const assistantConversationFreezeReference = freeze;

export const assistantConversationPublicIndexIdentity = Object.freeze({
  id: constants.canonicalIdentifier,
  name: "Assistant Conversation Public Index",
  phaseId: "ASSISTANT-1:9",
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

export const assistantConversationPublicIndexVersion = constants.version;

export const assistantConversationPublicIndexStatus = Object.freeze({
  release: constants.releaseStatus.release,
  certification: constants.releaseStatus.certification,
  freeze: constants.releaseStatus.freeze,
  stability: constants.releaseStatus.stability,
} as const);

export const assistantConversationPublicIndexReadiness = constants.readiness;

export const assistantConversationPublicApiRegistry = Object.freeze(
  freeze.publicApiSurface.map((exportName, index) => Object.freeze({
    apiIdentifier:
      `ASSISTANT-1:9/Api/${String(index + 1).padStart(2, "0")}`,
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

export const assistantConversationPublicApiCount =
  assistantConversationPublicApiRegistry.length;

export const assistantConversationPublicExports = publicExportNames;

export const assistantConversationPublicCompatibility = freeze.compatibility;

export const assistantConversationConsumerEntry = Object.freeze({
  file: "assistantConversationPublicIndex.ts",
  declaration: "Sole supported Assistant Conversation consumer entry",
  dependency: "assistantConversationFreeze.ts",
  dependencyPhase: "ASSISTANT-1:8 Conversation Freeze",
  directArchitecturalImportsPermitted: false,
  prohibitedDirectImports: Object.freeze([
    "ASSISTANT-1:1 Conversation Foundation",
    "ASSISTANT-1:2 Conversation Registry",
    "ASSISTANT-1:3 Conversation Model",
    "ASSISTANT-1:4 Conversation Validation",
    "ASSISTANT-1:5 Conversation Manifest",
    "ASSISTANT-1:6 Conversation Platform",
    "ASSISTANT-1:7 Conversation Certification",
    "ASSISTANT-1:8 Conversation Freeze",
  ]),
  stablePublicSurface: true,
  metadataOnly: true,
  immutable: true,
} as const);

export const assistantConversationPublicIndexMetadata = Object.freeze({
  canonicalIdentity: assistantConversationPublicIndexIdentity.id,
  namespace: constants.namespace,
  version: constants.version,
  releaseStatus: assistantConversationPublicIndexStatus,
  readiness: assistantConversationPublicIndexReadiness,
  publicExportCount: constants.publicExportCount,
  publicApiCount: assistantConversationPublicApiCount,
  freezeReference: freeze.identity.id,
  consumerEntry: assistantConversationConsumerEntry.file,
  namespaceSectionCount: constants.namespaceSectionCount,
  lockIdentifier: freeze.lock.lockIdentifier,
  constants,
  metadataOnly: true,
  immutable: true,
} as const);

export const assistantConversationPublicIndexNamespace = Object.freeze([
  Object.freeze({
    section: "Identity",
    order: 1,
    value: assistantConversationPublicIndexIdentity,
  }),
  Object.freeze({
    section: "Metadata",
    order: 2,
    value: assistantConversationPublicIndexMetadata,
  }),
  Object.freeze({
    section: "Namespace",
    order: 3,
    value: namespaceSectionOrder,
  }),
  Object.freeze({
    section: "Version",
    order: 4,
    value: assistantConversationPublicIndexVersion,
  }),
  Object.freeze({
    section: "Status",
    order: 5,
    value: assistantConversationPublicIndexStatus,
  }),
  Object.freeze({
    section: "Readiness",
    order: 6,
    value: assistantConversationPublicIndexReadiness,
  }),
  Object.freeze({
    section: "Public API Registry",
    order: 7,
    value: assistantConversationPublicApiRegistry,
  }),
  Object.freeze({
    section: "Consumer Entry",
    order: 8,
    value: assistantConversationConsumerEntry,
  }),
  Object.freeze({
    section: "Freeze Reference",
    order: 9,
    value: assistantConversationFreezeReference,
  }),
] as const);
