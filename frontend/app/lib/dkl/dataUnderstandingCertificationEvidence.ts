/**
 * DKL-3:7 — Data Understanding Certification Evidence.
 *
 * Immutable certification evidence catalog derived from prior-phase public
 * identities and readiness declarations. Metadata only. No calculations.
 *
 * Ownership: owned exclusively by DKL-3:7.
 */

import {
  DataUnderstandingFoundation,
  DataUnderstandingFoundationVersion,
  DataUnderstandingOwnership,
  DataUnderstandingBoundaries,
} from "./dataUnderstandingFoundation.ts";
import {
  DataUnderstandingRegistry,
  DataUnderstandingRegistryVersion,
} from "./dataUnderstandingRegistry.ts";
import {
  DataUnderstandingModel,
  DataUnderstandingModelVersion,
} from "./dataUnderstandingModel.ts";
import {
  DataUnderstandingValidation,
  DataUnderstandingValidationRules,
  DataUnderstandingValidationVersion,
} from "./dataUnderstandingValidation.ts";
import {
  DataUnderstandingManifest,
  DataUnderstandingManifestVersion,
} from "./dataUnderstandingManifest.ts";
import {
  DataUnderstandingPlatform,
  DataUnderstandingPlatformVersion,
  DataUnderstandingPlatformDependencies,
} from "./dataUnderstandingPlatform.ts";
import { PipelineUnderstandingPlatform } from "../pipeline/pipelineUnderstandingPlatform.ts";
import {
  DataSourceKnowledgeRegistryPublicIndexVersion,
} from "./dataSourceKnowledgeRegistryPublicIndex.ts";
import type { CertificationEvidenceItem } from "./dataUnderstandingCertificationTypes.ts";

const item = (
  evidenceId: string,
  category: string,
  description: string,
  sourcePhase: string,
  sourceReference: string,
  limitations: string,
): CertificationEvidenceItem =>
  Object.freeze({
    evidenceId,
    category,
    description,
    sourcePhase,
    sourceReference,
    certified: true as const,
    limitations,
  });

const ENTRIES: readonly CertificationEvidenceItem[] = Object.freeze([
  item(
    "EV-FOUNDATION-IDENTITY",
    "Foundation",
    `Foundation identity ${DataUnderstandingFoundation.identity.foundationId}`,
    "DKL-3:1",
    DataUnderstandingFoundation.identity.foundationId,
    "Identity evidence only; not runtime foundation execution.",
  ),
  item(
    "EV-FOUNDATION-READY",
    "Foundation",
    `Foundation readiness ReadyForRegistry=${String(DataUnderstandingFoundation.readiness.ReadyForRegistry)}`,
    "DKL-3:1",
    `version:${DataUnderstandingFoundationVersion}`,
    "Readiness flag evidence only.",
  ),
  item(
    "EV-FOUNDATION-EXPORTS",
    "PublicApi",
    "Foundation publishes exactly eight public APIs.",
    "DKL-3:1",
    "dataUnderstandingFoundation.ts",
    "Export-count evidence only.",
  ),
  item(
    "EV-REGISTRY-IDENTITY",
    "Registry",
    `Registry identity ${DataUnderstandingRegistry.identity.registryId}`,
    "DKL-3:2",
    DataUnderstandingRegistry.identity.registryId,
    "Identity evidence only.",
  ),
  item(
    "EV-REGISTRY-READY",
    "Registry",
    `Registry readiness ReadyForModel=${String(DataUnderstandingRegistry.readiness.ReadyForModel)}`,
    "DKL-3:2",
    `version:${DataUnderstandingRegistryVersion}`,
    "Readiness flag evidence only.",
  ),
  item(
    "EV-REGISTRY-EXPORTS",
    "PublicApi",
    "Registry publishes exactly eight public APIs.",
    "DKL-3:2",
    "dataUnderstandingRegistry.ts",
    "Export-count evidence only.",
  ),
  item(
    "EV-MODEL-IDENTITY",
    "Model",
    `Model identity ${DataUnderstandingModel.identity.modelId}`,
    "DKL-3:3",
    DataUnderstandingModel.identity.modelId,
    "Identity evidence only.",
  ),
  item(
    "EV-MODEL-READY",
    "Model",
    `Model readiness ReadyForValidation=${String(DataUnderstandingModel.readiness.ReadyForValidation)}`,
    "DKL-3:3",
    `version:${DataUnderstandingModelVersion}`,
    "Readiness flag evidence only.",
  ),
  item(
    "EV-MODEL-EXPORTS",
    "PublicApi",
    "Model publishes exactly eight public APIs.",
    "DKL-3:3",
    "dataUnderstandingModel.ts",
    "Export-count evidence only.",
  ),
  item(
    "EV-VALIDATION-IDENTITY",
    "Validation",
    `Validation identity ${DataUnderstandingValidation.identity.validationId}`,
    "DKL-3:4",
    DataUnderstandingValidation.identity.validationId,
    "Identity evidence only; certification does not re-run validation.",
  ),
  item(
    "EV-VALIDATION-RULES",
    "Validation",
    `Validation rule count=${DataUnderstandingValidationRules.length}`,
    "DKL-3:4",
    `version:${DataUnderstandingValidationVersion}`,
    "Rule-catalog count evidence only.",
  ),
  item(
    "EV-VALIDATION-EXPORTS",
    "PublicApi",
    "Validation publishes exactly eight public APIs.",
    "DKL-3:4",
    "dataUnderstandingValidation.ts",
    "Export-count evidence only.",
  ),
  item(
    "EV-MANIFEST-IDENTITY",
    "Manifest",
    `Manifest identity ${DataUnderstandingManifest.identity.manifestId}`,
    "DKL-3:5",
    DataUnderstandingManifest.identity.manifestId,
    "Identity evidence only.",
  ),
  item(
    "EV-MANIFEST-READY",
    "Manifest",
    `Manifest readiness ReadyForPlatform=${String(DataUnderstandingManifest.readiness.ReadyForPlatform)}`,
    "DKL-3:5",
    `version:${DataUnderstandingManifestVersion}`,
    "Readiness flag evidence only.",
  ),
  item(
    "EV-MANIFEST-EXPORTS",
    "PublicApi",
    "Manifest publishes exactly eight public APIs.",
    "DKL-3:5",
    "dataUnderstandingManifest.ts",
    "Export-count evidence only.",
  ),
  item(
    "EV-PLATFORM-IDENTITY",
    "Platform",
    `Platform identity phase ${DataUnderstandingPlatform.identity.sourcePhase}`,
    "DKL-3:6",
    DataUnderstandingPlatform.identity.platformNamespace,
    "Identity evidence only.",
  ),
  item(
    "EV-PLATFORM-NAMESPACE",
    "Platform",
    "Platform namespace contains foundation, registry, model, validation, manifest.",
    "DKL-3:6",
    `version:${DataUnderstandingPlatformVersion}`,
    "Namespace-structure evidence only.",
  ),
  item(
    "EV-PLATFORM-EXPORTS",
    "PublicApi",
    "Platform publishes exactly eight public APIs.",
    "DKL-3:6",
    "dataUnderstandingPlatform.ts",
    "Export-count evidence only.",
  ),
  item(
    "EV-PLATFORM-DEPENDENCIES",
    "Dependency",
    `Platform dependency count=${DataUnderstandingPlatformDependencies.entryCount}`,
    "DKL-3:6",
    "DataUnderstandingPlatformDependencies",
    "Dependency-inventory evidence only.",
  ),
  item(
    "EV-NO-FUTURE-PHASES",
    "Dependency",
    `noFuturePhases=${String(DataUnderstandingPlatformDependencies.noFuturePhases)}`,
    "DKL-3:6",
    "DataUnderstandingPlatformDependencies.noFuturePhases",
    "Absence-of-future-phase evidence only.",
  ),
  item(
    "EV-PLATFORM-COMPATIBILITY",
    "Compatibility",
    "Platform compatibility forbids Business Objects and restricts DKL-4.",
    "DKL-3:6",
    "DataUnderstandingPlatformCompatibility",
    "Compatibility-declaration evidence only.",
  ),
  item(
    "EV-CERT-COMPATIBILITY",
    "Compatibility",
    "Certification compatibility forbids BO and Knowledge Graph claims.",
    "DKL-3:7",
    "DataUnderstandingCertificationCompatibility",
    "Compatibility-declaration evidence only.",
  ),
  item(
    "EV-OWNERSHIP",
    "Ownership",
    `Ownership owns=${DataUnderstandingOwnership.owns.length} doesNotOwn=${DataUnderstandingOwnership.doesNotOwn.length}`,
    "DKL-3:1",
    "DataUnderstandingOwnership",
    "Ownership-declaration evidence only.",
  ),
  item(
    "EV-BOUNDARIES",
    "Boundary",
    `createsBusinessObjects=${String(DataUnderstandingBoundaries.createsBusinessObjects)} createsKnowledgeGraph=${String(DataUnderstandingBoundaries.createsKnowledgeGraph)}`,
    "DKL-3:1",
    "DataUnderstandingBoundaries",
    "Boundary-declaration evidence only.",
  ),
  item(
    "EV-PUBLIC-API-COUNTS",
    "PublicApi",
    "Six completed phases × eight APIs = forty-eight public APIs through Platform.",
    "DKL-3:6",
    "DataUnderstandingPlatformSummary.totalPublicApis",
    "Aggregate export-count evidence only.",
  ),
  item(
    "EV-DETERMINISTIC",
    "Determinism",
    "All DKL-3 phases declare deterministic metadata-only surfaces.",
    "DKL-3:1",
    "deterministic:true",
    "Declaration evidence only; not a runtime proof harness.",
  ),
  item(
    "EV-IMMUTABLE",
    "Immutability",
    "All DKL-3 public aggregates declare immutable:true and are frozen.",
    "DKL-3:1",
    "immutable:true",
    "Declaration evidence only; not a mutation fuzzer.",
  ),
  item(
    "EV-PLATFORM-READY",
    "Readiness",
    `Platform ReadyForCertification=${String(DataUnderstandingPlatform.readiness.ReadyForCertification)}`,
    "DKL-3:6",
    "DataUnderstandingPlatformReadiness",
    "Readiness flag evidence only.",
  ),
  item(
    "EV-CERT-READY",
    "Readiness",
    "Certification declares ReadyForFreeze after all gates PASS.",
    "DKL-3:7",
    "ReadyForFreeze",
    "Certification readiness declaration only.",
  ),
  item(
    "EV-PIPELINE-READY",
    "Dependency",
    `Pipeline ReadyForDKL3Intake=${String(PipelineUnderstandingPlatform.readiness.ReadyForDKL3Intake)}`,
    "UI-PIPE-1:3",
    "pipelineUnderstandingPlatform.ts",
    "Upstream readiness evidence only.",
  ),
  item(
    "EV-DKL2-VERSION",
    "Dependency",
    `DKL-2 Public Index version=${DataSourceKnowledgeRegistryPublicIndexVersion}`,
    "DKL-2:9",
    "dataSourceKnowledgeRegistryPublicIndex.ts",
    "Upstream version evidence only.",
  ),
]);

/** Canonical immutable certification evidence catalog. */
export const DataUnderstandingCertificationEvidence = Object.freeze({
  evidenceId: "DKL-3:7/CertificationEvidence",
  sourcePhase: "DKL-3:7",
  entries: ENTRIES,
  entryCount: ENTRIES.length,
  allCertified: true,
  limitationsRequired: true,
  runtimeCalculationForbidden: true,
  metadataOnly: true,
  immutable: true,
  deterministic: true,
});
