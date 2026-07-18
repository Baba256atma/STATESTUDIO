/**
 * DKL-4:8 — Knowledge Modeling Freeze Components.
 *
 * Frozen component-reference registry for the seven certified architecture
 * phases. Included by canonical reference only. Freeze does not re-own them.
 *
 * Ownership: owned exclusively by DKL-4:8.
 */

import { KnowledgeModelingCertification } from "./knowledgeModelingCertification.ts";
import type { FreezeComponentEntry } from "./knowledgeModelingFreezeTypes.ts";

const CERT = KnowledgeModelingCertification;
const PLATFORM = CERT.certifiedPlatform;

const component = (
  id: string,
  name: string,
  phase: string,
  version: string,
  namespace: string,
  sourcePublicEntryPoint: string,
  ownership: string,
  dependencyOrder: number,
): FreezeComponentEntry =>
  Object.freeze({
    id,
    name,
    phase,
    version,
    namespace,
    sourcePublicEntryPoint,
    certificationStatus: "Certified" as const,
    freezeStatus: "Frozen" as const,
    ownership,
    compatibilityStatus: "Frozen" as const,
    extensionStatus: "AdditiveOnly" as const,
    publicApiCount: 8 as const,
    dependencyOrder,
    includedByReference: true as const,
    protectedFromReOwnership: true as const,
    protectedFromBreakingChange: true as const,
    metadataOnly: true as const,
    immutable: true as const,
  });

const COMPONENTS: readonly FreezeComponentEntry[] = Object.freeze([
  component(
    "DKL-4:1/Foundation",
    "Knowledge Modeling Foundation",
    "DKL-4:1",
    PLATFORM.foundation.version,
    PLATFORM.foundation.identity.foundationNamespace,
    "knowledgeModelingFoundation.ts",
    PLATFORM.foundation.identity.owner,
    1,
  ),
  component(
    "DKL-4:2/Registry",
    "Knowledge Modeling Registry",
    "DKL-4:2",
    PLATFORM.registry.version,
    PLATFORM.registry.namespace,
    "knowledgeModelingRegistry.ts",
    PLATFORM.registry.identity.owner,
    2,
  ),
  component(
    "DKL-4:3/Model",
    "Knowledge Modeling Model",
    "DKL-4:3",
    PLATFORM.model.version,
    PLATFORM.model.namespace,
    "knowledgeModelingModel.ts",
    PLATFORM.model.identity.owner,
    3,
  ),
  component(
    "DKL-4:4/Validation",
    "Knowledge Modeling Validation",
    "DKL-4:4",
    PLATFORM.validation.version,
    PLATFORM.validation.namespace,
    "knowledgeModelingValidation.ts",
    PLATFORM.validation.identity.owner,
    4,
  ),
  component(
    "DKL-4:5/Manifest",
    "Knowledge Modeling Manifest",
    "DKL-4:5",
    PLATFORM.manifest.version,
    PLATFORM.manifest.namespace,
    "knowledgeModelingManifest.ts",
    PLATFORM.manifest.identity.owner,
    5,
  ),
  component(
    "DKL-4:6/Platform",
    "Knowledge Modeling Platform",
    "DKL-4:6",
    PLATFORM.version,
    PLATFORM.namespace,
    "knowledgeModelingPlatform.ts",
    PLATFORM.identity.owner,
    6,
  ),
  component(
    "DKL-4:7/Certification",
    "Knowledge Modeling Certification",
    "DKL-4:7",
    CERT.version,
    CERT.namespace,
    "knowledgeModelingCertification.ts",
    CERT.identity.owner,
    7,
  ),
]);

/** Canonical frozen component-reference registry. */
export const KnowledgeModelingFreezeComponents = Object.freeze({
  componentsId: "DKL-4:8/FreezeComponents",
  sourcePhase: "DKL-4:8" as const,
  owner: "DKL-4 Knowledge Modeling Freeze",
  components: COMPONENTS,
  componentCount: COMPONENTS.length as 7,
  phases: Object.freeze(COMPONENTS.map((c) => c.phase)),
  publicEntryPoints: Object.freeze(COMPONENTS.map((c) => c.sourcePublicEntryPoint)),
  dependencyOrder: Object.freeze([
    "Foundation",
    "Registry",
    "Model",
    "Validation",
    "Manifest",
    "Platform",
    "Certification",
  ] as const),
  includedByReferenceOnly: true,
  noComponentCopied: true,
  noComponentReOwned: true,
  protectedFromBreakingChange: true,
  metadataOnly: true,
  immutable: true,
  deterministic: true,
});
