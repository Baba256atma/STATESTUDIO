/** ASSISTANT-3:9 — Sole public consumer entry for Intent & Dialogue Understanding. */
import { AssistantIntentDialogueFreeze } from "./assistantIntentDialogueFreeze.ts";

const freeze = AssistantIntentDialogueFreeze;

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
  "assistantIntentDialoguePublicIndexIdentity",
  "assistantIntentDialoguePublicIndexMetadata",
  "assistantIntentDialoguePublicIndexNamespace",
  "assistantIntentDialoguePublicIndexVersion",
  "assistantIntentDialoguePublicIndexStatus",
  "assistantIntentDialoguePublicIndexReadiness",
  "assistantIntentDialoguePublicApiRegistry",
  "assistantIntentDialoguePublicApiCount",
  "assistantIntentDialoguePublicExports",
  "assistantIntentDialoguePublicCompatibility",
  "assistantIntentDialogueConsumerEntry",
  "assistantIntentDialogueFreezeReference",
] as const);

const constants = Object.freeze({
  canonicalIdentifier: "ASSISTANT-3:9/IntentDialogueUnderstandingPublicIndex",
  namespace: "nexora.assistant.intent-dialogue.public-index",
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

export const assistantIntentDialogueFreezeReference = freeze;

export const assistantIntentDialoguePublicIndexIdentity = Object.freeze({
  id: constants.canonicalIdentifier,
  name: "Assistant Intent & Dialogue Understanding Public Index",
  phaseId: "ASSISTANT-3:9",
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

export const assistantIntentDialoguePublicIndexVersion = constants.version;

export const assistantIntentDialoguePublicIndexStatus = Object.freeze({
  release: constants.releaseStatus.release,
  certification: constants.releaseStatus.certification,
  freeze: constants.releaseStatus.freeze,
  stability: constants.releaseStatus.stability,
} as const);

export const assistantIntentDialoguePublicIndexReadiness = constants.readiness;

export const assistantIntentDialoguePublicApiRegistry = Object.freeze(
  freeze.publicApiSurface.map((exportName, index) => Object.freeze({
    apiIdentifier:
      `ASSISTANT-3:9/Api/${String(index + 1).padStart(2, "0")}`,
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

export const assistantIntentDialoguePublicApiCount =
  assistantIntentDialoguePublicApiRegistry.length;

export const assistantIntentDialoguePublicExports = publicExportNames;

export const assistantIntentDialoguePublicCompatibility = freeze.compatibility;

export const assistantIntentDialogueConsumerEntry = Object.freeze({
  file: "assistantIntentDialoguePublicIndex.ts",
  declaration:
    "Sole supported Intent & Dialogue Understanding consumer entry",
  dependency: "assistantIntentDialogueFreeze.ts",
  dependencyPhase: "ASSISTANT-3:8 Intent & Dialogue Understanding Freeze",
  directArchitecturalImportsPermitted: false,
  prohibitedDirectImports: Object.freeze([
    "ASSISTANT-3:1 Intent & Dialogue Understanding Foundation",
    "ASSISTANT-3:2 Intent & Dialogue Understanding Registry",
    "ASSISTANT-3:3 Intent & Dialogue Understanding Model",
    "ASSISTANT-3:4 Intent & Dialogue Understanding Validation",
    "ASSISTANT-3:5 Intent & Dialogue Understanding Manifest",
    "ASSISTANT-3:6 Intent & Dialogue Understanding Platform",
    "ASSISTANT-3:7 Intent & Dialogue Understanding Certification",
    "ASSISTANT-3:8 Intent & Dialogue Understanding Freeze",
  ]),
  stablePublicSurface: true,
  metadataOnly: true,
  immutable: true,
} as const);

export const assistantIntentDialoguePublicIndexMetadata = Object.freeze({
  canonicalIdentity: assistantIntentDialoguePublicIndexIdentity.id,
  namespace: constants.namespace,
  version: constants.version,
  releaseStatus: assistantIntentDialoguePublicIndexStatus,
  readiness: assistantIntentDialoguePublicIndexReadiness,
  publicExportCount: constants.publicExportCount,
  publicApiCount: assistantIntentDialoguePublicApiCount,
  freezeReference: freeze.identity.id,
  consumerEntry: assistantIntentDialogueConsumerEntry.file,
  namespaceSectionCount: constants.namespaceSectionCount,
  lockIdentifier: freeze.lock.lockIdentifier,
  constants,
  metadataOnly: true,
  immutable: true,
} as const);

export const assistantIntentDialoguePublicIndexNamespace = Object.freeze([
  Object.freeze({
    section: "Identity",
    order: 1,
    value: assistantIntentDialoguePublicIndexIdentity,
  }),
  Object.freeze({
    section: "Metadata",
    order: 2,
    value: assistantIntentDialoguePublicIndexMetadata,
  }),
  Object.freeze({
    section: "Namespace",
    order: 3,
    value: namespaceSectionOrder,
  }),
  Object.freeze({
    section: "Version",
    order: 4,
    value: assistantIntentDialoguePublicIndexVersion,
  }),
  Object.freeze({
    section: "Status",
    order: 5,
    value: assistantIntentDialoguePublicIndexStatus,
  }),
  Object.freeze({
    section: "Readiness",
    order: 6,
    value: assistantIntentDialoguePublicIndexReadiness,
  }),
  Object.freeze({
    section: "Public API Registry",
    order: 7,
    value: assistantIntentDialoguePublicApiRegistry,
  }),
  Object.freeze({
    section: "Consumer Entry",
    order: 8,
    value: assistantIntentDialogueConsumerEntry,
  }),
  Object.freeze({
    section: "Freeze Reference",
    order: 9,
    value: assistantIntentDialogueFreezeReference,
  }),
] as const);
