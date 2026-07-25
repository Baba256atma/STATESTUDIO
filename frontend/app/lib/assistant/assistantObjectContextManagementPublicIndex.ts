/** ASSISTANT-6:9 — Sole public consumer entry for Object & Context Management. */
import { AssistantObjectContextManagementFreeze } from "./assistantObjectContextManagementFreeze.ts";

const freeze = AssistantObjectContextManagementFreeze;

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
  "assistantObjectContextManagementPublicIndexIdentity",
  "assistantObjectContextManagementPublicIndexMetadata",
  "assistantObjectContextManagementPublicIndexNamespace",
  "assistantObjectContextManagementPublicIndexVersion",
  "assistantObjectContextManagementPublicIndexStatus",
  "assistantObjectContextManagementPublicIndexReadiness",
  "assistantObjectContextManagementPublicApiRegistry",
  "assistantObjectContextManagementPublicApiCount",
  "assistantObjectContextManagementPublicExports",
  "assistantObjectContextManagementPublicCompatibility",
  "assistantObjectContextManagementConsumerEntry",
  "assistantObjectContextManagementFreezeReference",
] as const);

const constants = Object.freeze({
  canonicalIdentifier: "ASSISTANT-6:9/ObjectContextManagementPublicIndex",
  namespace: "nexora.assistant.object-context-management.public-index",
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

export const assistantObjectContextManagementFreezeReference = freeze;

export const assistantObjectContextManagementPublicIndexIdentity =
  Object.freeze({
    id: constants.canonicalIdentifier,
    name: "Assistant Object & Context Management Public Index",
    phaseId: "ASSISTANT-6:9",
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

export const assistantObjectContextManagementPublicIndexVersion =
  constants.version;

export const assistantObjectContextManagementPublicIndexStatus =
  Object.freeze({
    release: constants.releaseStatus.release,
    certification: constants.releaseStatus.certification,
    freeze: constants.releaseStatus.freeze,
    stability: constants.releaseStatus.stability,
  } as const);

export const assistantObjectContextManagementPublicIndexReadiness =
  constants.readiness;

export const assistantObjectContextManagementPublicApiRegistry =
  Object.freeze(
    freeze.publicApiSurface.map((exportName, index) => Object.freeze({
      apiIdentifier:
        `ASSISTANT-6:9/Api/${String(index + 1).padStart(2, "0")}`,
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

export const assistantObjectContextManagementPublicApiCount =
  assistantObjectContextManagementPublicApiRegistry.length;

export const assistantObjectContextManagementPublicExports =
  publicExportNames;

export const assistantObjectContextManagementPublicCompatibility =
  freeze.compatibility;

export const assistantObjectContextManagementConsumerEntry = Object.freeze({
  file: "assistantObjectContextManagementPublicIndex.ts",
  declaration:
    "Sole supported Object & Context Management consumer entry",
  dependency: "assistantObjectContextManagementFreeze.ts",
  dependencyPhase: "ASSISTANT-6:8 Object & Context Management Freeze",
  directArchitecturalImportsPermitted: false,
  prohibitedDirectImports: Object.freeze([
    "ASSISTANT-6:1 Object & Context Management Foundation",
    "ASSISTANT-6:2 Object & Context Management Registry",
    "ASSISTANT-6:3 Object & Context Management Model",
    "ASSISTANT-6:4 Object & Context Management Validation",
    "ASSISTANT-6:5 Object & Context Management Manifest",
    "ASSISTANT-6:6 Object & Context Management Platform",
    "ASSISTANT-6:7 Object & Context Management Certification",
    "ASSISTANT-6:8 Object & Context Management Freeze",
  ]),
  stablePublicSurface: true,
  metadataOnly: true,
  immutable: true,
} as const);

export const assistantObjectContextManagementPublicIndexMetadata =
  Object.freeze({
    canonicalIdentity:
      assistantObjectContextManagementPublicIndexIdentity.id,
    namespace: constants.namespace,
    version: constants.version,
    releaseStatus: assistantObjectContextManagementPublicIndexStatus,
    readiness: assistantObjectContextManagementPublicIndexReadiness,
    publicExportCount: constants.publicExportCount,
    publicApiCount: assistantObjectContextManagementPublicApiCount,
    freezeReference: freeze.identity.id,
    consumerEntry: assistantObjectContextManagementConsumerEntry.file,
    namespaceSectionCount: constants.namespaceSectionCount,
    lockIdentifier: freeze.lock.lockIdentifier,
    constants,
    metadataOnly: true,
    immutable: true,
  } as const);

export const assistantObjectContextManagementPublicIndexNamespace =
  Object.freeze([
    Object.freeze({
      section: "Identity",
      order: 1,
      value: assistantObjectContextManagementPublicIndexIdentity,
    }),
    Object.freeze({
      section: "Metadata",
      order: 2,
      value: assistantObjectContextManagementPublicIndexMetadata,
    }),
    Object.freeze({
      section: "Namespace",
      order: 3,
      value: namespaceSectionOrder,
    }),
    Object.freeze({
      section: "Version",
      order: 4,
      value: assistantObjectContextManagementPublicIndexVersion,
    }),
    Object.freeze({
      section: "Status",
      order: 5,
      value: assistantObjectContextManagementPublicIndexStatus,
    }),
    Object.freeze({
      section: "Readiness",
      order: 6,
      value: assistantObjectContextManagementPublicIndexReadiness,
    }),
    Object.freeze({
      section: "Public API Registry",
      order: 7,
      value: assistantObjectContextManagementPublicApiRegistry,
    }),
    Object.freeze({
      section: "Consumer Entry",
      order: 8,
      value: assistantObjectContextManagementConsumerEntry,
    }),
    Object.freeze({
      section: "Freeze Reference",
      order: 9,
      value: assistantObjectContextManagementFreezeReference,
    }),
  ] as const);
