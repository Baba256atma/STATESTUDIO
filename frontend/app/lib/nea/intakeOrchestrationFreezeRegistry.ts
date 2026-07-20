/**
 * NEA-7:8 — Intake Orchestration Freeze Registry.
 *
 * Immutable registry of certified components preserved by Certification
 * reference only. No reconstruction. No duplicated upstream metadata.
 *
 * Ownership: owned exclusively by NEA-7:8.
 */

import {
  IntakeOrchestrationCertificationId,
  IntakeOrchestrationCertificationPlatform,
  IntakeOrchestrationCertificationVersion,
} from "./intakeOrchestrationCertification.ts";
import type { IntakeOrchestrationFreezeComponent } from "./intakeOrchestrationFreezeTypes.ts";

const certification = IntakeOrchestrationCertificationPlatform;
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
): IntakeOrchestrationFreezeComponent =>
  Object.freeze({
    componentId: `NEA-7:8/Component/${key}`,
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
export const IntakeOrchestrationFreezeComponents: readonly IntakeOrchestrationFreezeComponent[] =
  Object.freeze([
    component(
      1,
      "Foundation",
      "Intake Orchestration Foundation",
      "NEA-7:1",
      ns.foundation.identity.foundationVersion,
      ns.foundation.identity.status,
      "Freeze.certification.platform.namespace.foundation",
    ),
    component(
      2,
      "Registry",
      "Intake Orchestration Registry",
      "NEA-7:2",
      ns.registry.identity.registryVersion,
      ns.registry.identity.status,
      "Freeze.certification.platform.namespace.registry",
    ),
    component(
      3,
      "Model",
      "Intake Orchestration Model",
      "NEA-7:3",
      ns.model.identity.modelVersion,
      ns.model.identity.status,
      "Freeze.certification.platform.namespace.model",
    ),
    component(
      4,
      "Validation",
      "Intake Orchestration Validation",
      "NEA-7:4",
      ns.validation.identity.validationVersion,
      ns.validation.identity.status,
      "Freeze.certification.platform.namespace.validation",
    ),
    component(
      5,
      "Manifest",
      "Intake Orchestration Manifest",
      "NEA-7:5",
      ns.manifest.identity.manifestVersion,
      ns.manifest.identity.status,
      "Freeze.certification.platform.namespace.manifest",
    ),
    component(
      6,
      "Platform",
      "Intake Orchestration Platform",
      "NEA-7:6",
      platform.identity.platformVersion,
      platform.status,
      "Freeze.certification.platform",
    ),
    component(
      7,
      "Certification",
      "Intake Orchestration Certification",
      "NEA-7:7",
      certification.identity.certificationVersion,
      certification.status,
      "Freeze.certification",
    ),
  ]);

/** Chain IDs preserved exclusively through Certification references. */
export const IntakeOrchestrationFreezeChainIds = Object.freeze({
  foundationId: ns.foundation.identity.foundationId,
  registryId: ns.registry.identity.registryId,
  modelId: ns.model.identity.modelId,
  validationId: ns.validation.identity.validationId,
  manifestId: ns.manifest.identity.manifestId,
  platformId: platform.identity.platformId,
  certificationId: IntakeOrchestrationCertificationId,
  freezeId: "NEA-7:8/IntakeOrchestrationFreeze" as const,
  intakeIdentityCount: ns.registry.collections.intakeIdentityCount,
  referenceTypeCount: ns.registry.collections.referenceTypeCount,
  canonicalExecutiveIntakePackageCount:
    ns.foundation.contracts.canonicalExecutiveIntakePackageCount,
  preservedByReference: true as const,
});

/**
 * Certified platform reference — Certification aggregate only.
 * Do not reconstruct Platform or Certification.
 */
export const IntakeOrchestrationFreezeCertifiedPlatformReference =
  Object.freeze({
    referenceId: "NEA-7:8/CertifiedPlatformReference",
    sourcePhase: "NEA-7:8" as const,
    certificationId: IntakeOrchestrationCertificationId,
    certificationVersion: IntakeOrchestrationCertificationVersion,
    certification: IntakeOrchestrationCertificationPlatform,
    platform: certification.platform,
    reconstructsCertification: false as const,
    reconstructsPlatform: false as const,
    duplicatesCertificationMetadata: false as const,
    duplicatesPlatformMetadata: false as const,
    preservedByReference: true as const,
    metadataOnly: true as const,
    immutable: true as const,
  });

/** Canonical immutable freeze registry catalog. */
export const IntakeOrchestrationFreezeRegistryCatalog = Object.freeze({
  catalogId: "NEA-7:8/FreezeRegistryCatalog",
  sourcePhase: "NEA-7:8" as const,
  components: IntakeOrchestrationFreezeComponents,
  componentCount: IntakeOrchestrationFreezeComponents.length,
  chainIds: IntakeOrchestrationFreezeChainIds,
  certifiedPlatformReference:
    IntakeOrchestrationFreezeCertifiedPlatformReference,
  intakeIdentityCount: ns.registry.collections.intakeIdentityCount,
  referenceTypeCount: ns.registry.collections.referenceTypeCount,
  canonicalExecutiveIntakePackageCount:
    ns.foundation.contracts.canonicalExecutiveIntakePackageCount,
  intakeIdentities: ns.registry.collections.intakeIdentities,
  referenceTypes: ns.registry.collections.referenceTypes,
  canonicalExecutiveIntakePackageContracts:
    ns.foundation.contracts.canonicalExecutiveIntakePackageContracts,
  reconstructsUpstream: false as const,
  duplicatesArchitecture: false as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});
