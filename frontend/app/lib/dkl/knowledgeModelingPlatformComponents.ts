/**
 * DKL-4:6 — Knowledge Modeling Platform Components.
 *
 * Frozen component-reference registry for the five consumed architecture
 * phases. Included by canonical reference only. Platform does not re-own them.
 *
 * Ownership: owned exclusively by DKL-4:6.
 */

import {
  KnowledgeModelingFoundationIdentity,
  KnowledgeModelingFoundationVersion,
} from "./knowledgeModelingFoundation.ts";
import {
  KnowledgeModelingRegistryIdentity,
  KnowledgeModelingRegistryVersion,
  KnowledgeModelingRegistryNamespace,
} from "./knowledgeModelingRegistry.ts";
import {
  KnowledgeModelingModelIdentity,
  KnowledgeModelingModelVersion,
  KnowledgeModelingModelNamespace,
} from "./knowledgeModelingModel.ts";
import {
  KnowledgeModelingValidationIdentity,
  KnowledgeModelingValidationVersion,
  KnowledgeModelingValidationNamespace,
} from "./knowledgeModelingValidation.ts";
import {
  KnowledgeModelingManifestIdentity,
  KnowledgeModelingManifestVersion,
  KnowledgeModelingManifestNamespace,
} from "./knowledgeModelingManifest.ts";
import type { PlatformComponentEntry } from "./knowledgeModelingPlatformTypes.ts";

const component = (
  id: string,
  name: string,
  phase: string,
  publicEntryPoint: string,
  version: string,
  namespace: string,
  status: string,
  readiness: string,
  owner: string,
  dependencyOrder: number,
  platformPosition: number,
): PlatformComponentEntry =>
  Object.freeze({
    id,
    name,
    phase,
    publicEntryPoint,
    version,
    namespace,
    status,
    readiness,
    owner,
    dependencyOrder,
    platformPosition,
    stability: "Stable" as const,
    compatibility: "Compatible" as const,
    extensionPolicy: "AdditiveAllowed" as const,
    includedByReference: true as const,
    ownedByPlatform: false as const,
    metadataOnly: true as const,
    immutable: true as const,
  });

const COMPONENTS: readonly PlatformComponentEntry[] = Object.freeze([
  component(
    "DKL-4:1/Foundation",
    "Knowledge Modeling Foundation",
    "DKL-4:1",
    "knowledgeModelingFoundation.ts",
    KnowledgeModelingFoundationVersion,
    KnowledgeModelingFoundationIdentity.foundationNamespace,
    KnowledgeModelingFoundationIdentity.status,
    KnowledgeModelingFoundationIdentity.readiness,
    KnowledgeModelingFoundationIdentity.owner,
    1,
    1,
  ),
  component(
    "DKL-4:2/Registry",
    "Knowledge Modeling Registry",
    "DKL-4:2",
    "knowledgeModelingRegistry.ts",
    KnowledgeModelingRegistryVersion,
    KnowledgeModelingRegistryNamespace,
    KnowledgeModelingRegistryIdentity.status,
    KnowledgeModelingRegistryIdentity.readiness,
    KnowledgeModelingRegistryIdentity.owner,
    2,
    2,
  ),
  component(
    "DKL-4:3/Model",
    "Knowledge Modeling Model",
    "DKL-4:3",
    "knowledgeModelingModel.ts",
    KnowledgeModelingModelVersion,
    KnowledgeModelingModelNamespace,
    KnowledgeModelingModelIdentity.status,
    KnowledgeModelingModelIdentity.readiness,
    KnowledgeModelingModelIdentity.owner,
    3,
    3,
  ),
  component(
    "DKL-4:4/Validation",
    "Knowledge Modeling Validation",
    "DKL-4:4",
    "knowledgeModelingValidation.ts",
    KnowledgeModelingValidationVersion,
    KnowledgeModelingValidationNamespace,
    KnowledgeModelingValidationIdentity.status,
    KnowledgeModelingValidationIdentity.readiness,
    KnowledgeModelingValidationIdentity.owner,
    4,
    4,
  ),
  component(
    "DKL-4:5/Manifest",
    "Knowledge Modeling Manifest",
    "DKL-4:5",
    "knowledgeModelingManifest.ts",
    KnowledgeModelingManifestVersion,
    KnowledgeModelingManifestNamespace,
    KnowledgeModelingManifestIdentity.status,
    KnowledgeModelingManifestIdentity.readiness,
    KnowledgeModelingManifestIdentity.owner,
    5,
    5,
  ),
]);

/** Canonical frozen Platform component-reference registry. */
export const KnowledgeModelingPlatformComponents = Object.freeze({
  componentsId: "DKL-4:6/PlatformComponents",
  sourcePhase: "DKL-4:6" as const,
  owner: "DKL-4 Knowledge Modeling Platform",
  components: COMPONENTS,
  componentCount: COMPONENTS.length as 5,
  phases: Object.freeze(COMPONENTS.map((c) => c.phase)),
  publicEntryPoints: Object.freeze(COMPONENTS.map((c) => c.publicEntryPoint)),
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
