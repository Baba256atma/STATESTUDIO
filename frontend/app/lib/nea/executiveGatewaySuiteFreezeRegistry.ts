/**
 * NEA-8:8 — Executive Gateway Suite Freeze Registry.
 *
 * Immutable registry of certified components preserved by Certification
 * reference only. No reconstruction. No duplicated upstream metadata.
 *
 * Ownership: owned exclusively by NEA-8:8.
 */

import {
  ExecutiveGatewaySuiteCertificationId,
  ExecutiveGatewaySuiteCertificationPlatform,
  ExecutiveGatewaySuiteCertificationVersion,
} from "./executiveGatewaySuiteCertification.ts";
import type { ExecutiveGatewaySuiteFreezeComponent } from "./executiveGatewaySuiteFreezeTypes.ts";

const certification = ExecutiveGatewaySuiteCertificationPlatform;
const platform = certification.platform;
const ns = platform.namespace;

const component = (
  order: number,
  key: string,
  name: string,
  phase: string,
  version: string,
  status: string,
  sourceReference: string,
): ExecutiveGatewaySuiteFreezeComponent =>
  Object.freeze({
    componentId: `NEA-8:8/Component/${key}`,
    componentName: name,
    phase,
    version,
    status,
    sourceReference,
    frozen: true as const,
    certified: true as const,
    reconstructsUpstream: false as const,
    duplicatesArchitecture: false as const,
    metadataOnly: true as const,
    immutable: true as const,
    deterministicOrder: order,
  });

/**
 * Exactly seven frozen certified components in canonical phase order.
 * Identity fields are derived through Certification → Platform namespace.
 */
export const ExecutiveGatewaySuiteFreezeComponents: readonly ExecutiveGatewaySuiteFreezeComponent[] =
  Object.freeze([
    component(
      1,
      "Foundation",
      "Executive Gateway Suite Foundation",
      "NEA-8:1",
      ns.foundation.identity.foundationVersion,
      ns.foundation.identity.status,
      "Freeze.certification.platform.namespace.foundation",
    ),
    component(
      2,
      "Registry",
      "Executive Gateway Suite Registry",
      "NEA-8:2",
      ns.registry.identity.registryVersion,
      ns.registry.identity.status,
      "Freeze.certification.platform.namespace.registry",
    ),
    component(
      3,
      "Model",
      "Executive Gateway Suite Model",
      "NEA-8:3",
      ns.model.identity.modelVersion,
      ns.model.identity.status,
      "Freeze.certification.platform.namespace.model",
    ),
    component(
      4,
      "Validation",
      "Executive Gateway Suite Validation",
      "NEA-8:4",
      ns.validation.identity.validationVersion,
      ns.validation.identity.status,
      "Freeze.certification.platform.namespace.validation",
    ),
    component(
      5,
      "Manifest",
      "Executive Gateway Suite Manifest",
      "NEA-8:5",
      ns.manifest.identity.manifestVersion,
      ns.manifest.identity.status,
      "Freeze.certification.platform.namespace.manifest",
    ),
    component(
      6,
      "Platform",
      "Executive Gateway Suite Platform",
      "NEA-8:6",
      platform.identity.platformVersion,
      platform.status,
      "Freeze.certification.platform",
    ),
    component(
      7,
      "Certification",
      "Executive Gateway Suite Certification",
      "NEA-8:7",
      certification.identity.certificationVersion,
      certification.status,
      "Freeze.certification",
    ),
  ]);

/** Chain IDs preserved exclusively through Certification references. */
export const ExecutiveGatewaySuiteFreezeChainIds = Object.freeze({
  foundationId: ns.foundation.identity.foundationId,
  registryId: ns.registry.identity.registryId,
  modelId: ns.model.identity.modelId,
  validationId: ns.validation.identity.validationId,
  manifestId: ns.manifest.identity.manifestId,
  platformId: platform.identity.platformId,
  certificationId: ExecutiveGatewaySuiteCertificationId,
  freezeId: "NEA-8:8/ExecutiveGatewaySuiteFreeze" as const,
  suiteComponentCount: ns.suiteComponentCount,
  preservedByReference: true as const,
});

/**
 * Certified platform reference — Certification aggregate only.
 * Do not reconstruct Platform or Certification.
 */
export const ExecutiveGatewaySuiteFreezeCertifiedPlatformReference =
  Object.freeze({
    referenceId: "NEA-8:8/CertifiedPlatformReference",
    sourcePhase: "NEA-8:8" as const,
    certificationId: ExecutiveGatewaySuiteCertificationId,
    certificationVersion: ExecutiveGatewaySuiteCertificationVersion,
    certification: ExecutiveGatewaySuiteCertificationPlatform,
    platform: certification.platform,
    reconstructsCertification: false as const,
    reconstructsPlatform: false as const,
    duplicatesCertificationMetadata: false as const,
    duplicatesPlatformMetadata: false as const,
    preservedByReference: true as const,
    metadataOnly: true as const,
    immutable: true as const,
  });

/**
 * Freeze registry entries describing frozen release metadata.
 * Values derived exclusively from Certification.
 */
export const ExecutiveGatewaySuiteFreezeRegistryEntries = Object.freeze({
  frozenPlatform: Object.freeze({
    entryId: "NEA-8:8/Registry/FrozenPlatform",
    platformId: platform.identity.platformId,
    platformVersion: platform.identity.platformVersion,
    platformNamespace: platform.identity.platformNamespace,
    status: platform.status,
  }),
  certificationOutcome: Object.freeze({
    entryId: "NEA-8:8/Registry/CertificationOutcome",
    outcome: certification.metadata.certificationOutcome,
    certificationId: ExecutiveGatewaySuiteCertificationId,
  }),
  releaseState: Object.freeze({
    entryId: "NEA-8:8/Registry/ReleaseState",
    state: "Frozen" as const,
    readiness: "ReadyForPublicIndex" as const,
  }),
  version: Object.freeze({
    entryId: "NEA-8:8/Registry/Version",
    freezeVersion: "1.0.0" as const,
    architectureVersion: certification.metadata.architectureVersion,
  }),
  inventoryVersion: Object.freeze({
    entryId: "NEA-8:8/Registry/InventoryVersion",
    inventoryVersion: "1.0.0" as const,
    publicApiInventoryTotal: certification.metadata.publicApiInventoryTotal,
    totalArchitectureCount: certification.metadata.totalArchitectureCount,
  }),
  compatibilityVersion: Object.freeze({
    entryId: "NEA-8:8/Registry/CompatibilityVersion",
    compatibilityVersion: "1.0.0" as const,
  }),
});

/** Canonical immutable freeze registry catalog. */
export const ExecutiveGatewaySuiteFreezeRegistryCatalog = Object.freeze({
  catalogId: "NEA-8:8/FreezeRegistryCatalog",
  sourcePhase: "NEA-8:8" as const,
  components: ExecutiveGatewaySuiteFreezeComponents,
  componentCount: ExecutiveGatewaySuiteFreezeComponents.length,
  chainIds: ExecutiveGatewaySuiteFreezeChainIds,
  entries: ExecutiveGatewaySuiteFreezeRegistryEntries,
  certifiedPlatformReference:
    ExecutiveGatewaySuiteFreezeCertifiedPlatformReference,
  suiteComponentCount: ns.suiteComponentCount,
  suiteComponents: ns.suiteComponents,
  componentIdentities: ns.registry.collections.componentIdentities,
  reconstructsUpstream: false as const,
  duplicatesArchitecture: false as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});
