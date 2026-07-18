/**
 * DKL-5:8 — Knowledge Validation Freeze Components.
 *
 * Frozen component-reference registry for the seven certified architecture
 * phases. Included by canonical reference only. Freeze does not re-own them.
 *
 * Ownership: owned exclusively by DKL-5:8.
 */

import { KnowledgeValidationCertification } from "./knowledgeValidationCertification.ts";
import type { FreezeComponentEntry } from "./knowledgeValidationFreezeTypes.ts";

const CERT = KnowledgeValidationCertification;
const PLATFORM = CERT.certifiedPlatform;

const component = (
  componentId: string,
  componentName: string,
  phase: string,
  version: string,
  namespace: string,
  sourcePublicEntryPoint: string,
  status: string,
  readiness: string,
  owner: string,
  dependencyOrder: number,
): FreezeComponentEntry =>
  Object.freeze({
    componentId,
    componentName,
    phase,
    version,
    namespace,
    sourcePublicEntryPoint,
    status,
    readiness,
    certificationStatus: "Certified" as const,
    freezeStatus: "Frozen" as const,
    owner,
    publicApiCount: 8 as const,
    dependencyOrder,
    includedByReference: true as const,
    ownedByFreeze: false as const,
    protectedFromReOwnership: true as const,
    protectedFromBreakingChange: true as const,
    compatibilityStatus: "Frozen" as const,
    extensionStatus: "AdditiveOnly" as const,
    runtimeBehavior: false as const,
    scoringBehavior: false as const,
    trustCalculationBehavior: false as const,
    cleansingBehavior: false as const,
    remediationBehavior: false as const,
    metadataOnly: true as const,
    immutable: true as const,
  });

const COMPONENTS: readonly FreezeComponentEntry[] = Object.freeze([
  component(
    "DKL-5:1/Foundation",
    "Knowledge Validation Foundation",
    "DKL-5:1",
    PLATFORM.foundation.version,
    PLATFORM.foundation.identity.foundationNamespace,
    "knowledgeValidationFoundation.ts",
    PLATFORM.foundation.identity.status,
    PLATFORM.foundation.identity.readiness,
    PLATFORM.foundation.identity.owner,
    1,
  ),
  component(
    "DKL-5:2/Registry",
    "Knowledge Validation Registry",
    "DKL-5:2",
    PLATFORM.registry.version,
    PLATFORM.registry.namespace,
    "knowledgeValidationRegistry.ts",
    PLATFORM.registry.identity.status,
    PLATFORM.registry.identity.readiness,
    PLATFORM.registry.identity.owner,
    2,
  ),
  component(
    "DKL-5:3/Model",
    "Knowledge Validation Model",
    "DKL-5:3",
    PLATFORM.model.version,
    PLATFORM.model.namespace,
    "knowledgeValidationModel.ts",
    PLATFORM.model.identity.status,
    PLATFORM.model.identity.readiness,
    PLATFORM.model.identity.owner,
    3,
  ),
  component(
    "DKL-5:4/Validation",
    "Knowledge Validation Validation",
    "DKL-5:4",
    PLATFORM.validation.version,
    PLATFORM.validation.namespace,
    "knowledgeValidationValidation.ts",
    PLATFORM.validation.identity.status,
    PLATFORM.validation.identity.readiness,
    PLATFORM.validation.identity.owner,
    4,
  ),
  component(
    "DKL-5:5/Manifest",
    "Knowledge Validation Manifest",
    "DKL-5:5",
    PLATFORM.manifest.version,
    PLATFORM.manifest.namespace,
    "knowledgeValidationManifest.ts",
    PLATFORM.manifest.identity.status,
    PLATFORM.manifest.identity.readiness,
    PLATFORM.manifest.identity.owner,
    5,
  ),
  component(
    "DKL-5:6/Platform",
    "Knowledge Validation Platform",
    "DKL-5:6",
    PLATFORM.version,
    PLATFORM.namespace,
    "knowledgeValidationPlatform.ts",
    PLATFORM.identity.status,
    PLATFORM.identity.readiness,
    PLATFORM.identity.owner,
    6,
  ),
  component(
    "DKL-5:7/Certification",
    "Knowledge Validation Certification",
    "DKL-5:7",
    CERT.version,
    CERT.namespace,
    "knowledgeValidationCertification.ts",
    CERT.identity.status,
    CERT.identity.readiness,
    CERT.identity.owner,
    7,
  ),
]);

/** Canonical frozen component-reference registry. */
export const KnowledgeValidationFreezeComponents = Object.freeze({
  componentsId: "DKL-5:8/FreezeComponents",
  sourcePhase: "DKL-5:8" as const,
  owner: "DKL-5 Knowledge Validation Freeze",
  components: COMPONENTS,
  componentCount: COMPONENTS.length as 7,
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
