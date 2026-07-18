/**
 * DKL-5:6 — Knowledge Validation Platform Components.
 *
 * Frozen component-reference registry for the five consumed architecture
 * phases. Included by canonical reference only. Platform does not re-own them.
 *
 * Ownership: owned exclusively by DKL-5:6.
 */

import {
  KnowledgeValidationFoundationIdentity,
  KnowledgeValidationFoundationVersion,
} from "./knowledgeValidationFoundation.ts";
import {
  KnowledgeValidationRegistryIdentity,
  KnowledgeValidationRegistryVersion,
  KnowledgeValidationRegistryNamespace,
} from "./knowledgeValidationRegistry.ts";
import {
  KnowledgeValidationModelIdentity,
  KnowledgeValidationModelVersion,
  KnowledgeValidationModelNamespace,
} from "./knowledgeValidationModel.ts";
import {
  KnowledgeValidationValidationIdentity,
  KnowledgeValidationValidationVersion,
  KnowledgeValidationValidationNamespace,
} from "./knowledgeValidationValidation.ts";
import {
  KnowledgeValidationManifestIdentity,
  KnowledgeValidationManifestVersion,
  KnowledgeValidationManifestNamespace,
} from "./knowledgeValidationManifest.ts";
import type { PlatformComponentEntry } from "./knowledgeValidationPlatformTypes.ts";

const component = (
  componentId: string,
  componentName: string,
  phase: string,
  version: string,
  namespace: string,
  status: string,
  readiness: string,
  sourcePublicEntryPoint: string,
  owner: string,
  dependencyOrder: number,
  platformPosition: number,
): PlatformComponentEntry =>
  Object.freeze({
    componentId,
    componentName,
    phase,
    version,
    namespace,
    status,
    readiness,
    sourcePublicEntryPoint,
    owner,
    dependencyOrder,
    platformPosition,
    publicApiCount: 8 as const,
    includedByReference: true as const,
    ownedByPlatform: false as const,
    stability: "Stable" as const,
    compatibility: "Compatible" as const,
    extensionStatus: "AdditiveAllowed" as const,
    runtimeBehavior: false as const,
    metadataOnly: true as const,
    immutable: true as const,
  });

const COMPONENTS: readonly PlatformComponentEntry[] = Object.freeze([
  component(
    "DKL-5:1/Foundation",
    "Knowledge Validation Foundation",
    "DKL-5:1",
    KnowledgeValidationFoundationVersion,
    KnowledgeValidationFoundationIdentity.foundationNamespace,
    KnowledgeValidationFoundationIdentity.status,
    KnowledgeValidationFoundationIdentity.readiness,
    "knowledgeValidationFoundation.ts",
    KnowledgeValidationFoundationIdentity.owner,
    1,
    1,
  ),
  component(
    "DKL-5:2/Registry",
    "Knowledge Validation Registry",
    "DKL-5:2",
    KnowledgeValidationRegistryVersion,
    KnowledgeValidationRegistryNamespace,
    KnowledgeValidationRegistryIdentity.status,
    KnowledgeValidationRegistryIdentity.readiness,
    "knowledgeValidationRegistry.ts",
    KnowledgeValidationRegistryIdentity.owner,
    2,
    2,
  ),
  component(
    "DKL-5:3/Model",
    "Knowledge Validation Model",
    "DKL-5:3",
    KnowledgeValidationModelVersion,
    KnowledgeValidationModelNamespace,
    KnowledgeValidationModelIdentity.status,
    KnowledgeValidationModelIdentity.readiness,
    "knowledgeValidationModel.ts",
    KnowledgeValidationModelIdentity.owner,
    3,
    3,
  ),
  component(
    "DKL-5:4/Validation",
    "Knowledge Validation Validation",
    "DKL-5:4",
    KnowledgeValidationValidationVersion,
    KnowledgeValidationValidationNamespace,
    KnowledgeValidationValidationIdentity.status,
    KnowledgeValidationValidationIdentity.readiness,
    "knowledgeValidationValidation.ts",
    KnowledgeValidationValidationIdentity.owner,
    4,
    4,
  ),
  component(
    "DKL-5:5/Manifest",
    "Knowledge Validation Manifest",
    "DKL-5:5",
    KnowledgeValidationManifestVersion,
    KnowledgeValidationManifestNamespace,
    KnowledgeValidationManifestIdentity.status,
    KnowledgeValidationManifestIdentity.readiness,
    "knowledgeValidationManifest.ts",
    KnowledgeValidationManifestIdentity.owner,
    5,
    5,
  ),
]);

/** Canonical frozen Platform component-reference registry. */
export const KnowledgeValidationPlatformComponents = Object.freeze({
  componentsId: "DKL-5:6/PlatformComponents",
  sourcePhase: "DKL-5:6" as const,
  owner: "DKL-5 Knowledge Validation Platform",
  components: COMPONENTS,
  componentCount: COMPONENTS.length as 5,
  phases: Object.freeze(COMPONENTS.map((entry) => entry.phase)),
  publicEntryPoints: Object.freeze(
    COMPONENTS.map((entry) => entry.sourcePublicEntryPoint),
  ),
  dependencyOrder: Object.freeze([
    "Foundation",
    "Registry",
    "Model",
    "Validation",
    "Manifest",
  ] as const),
  includedByReferenceOnly: true,
  noComponentCopied: true,
  noComponentReOwned: true,
  metadataOnly: true,
  immutable: true,
  deterministic: true,
});
