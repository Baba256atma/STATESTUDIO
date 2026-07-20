/**
 * NEA-7:9 — Intake Orchestration Public Index Tests.
 *
 * Deterministic coverage for the sole NEA-7 public release surface.
 * No mocks. No randomness. No network. No databases. No system time.
 */

import assert from "node:assert/strict";
import { readdirSync } from "node:fs";
import { dirname } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import { IntakeOrchestrationCertificationPlatform } from "./intakeOrchestrationCertification.ts";
import { IntakeOrchestrationFoundationPlatform } from "./intakeOrchestrationFoundation.ts";
import { IntakeOrchestrationFreezePlatform } from "./intakeOrchestrationFreeze.ts";
import { IntakeOrchestrationManifestPlatform } from "./intakeOrchestrationManifest.ts";
import { IntakeOrchestrationModelPlatform } from "./intakeOrchestrationModel.ts";
import { IntakeOrchestrationPlatform } from "./intakeOrchestrationPlatform.ts";
import * as PublicIndexModule from "./intakeOrchestrationPublicIndex.ts";
import {
  IntakeOrchestrationPlatformPublicFoundation,
  IntakeOrchestrationPublicApiRegistry,
  IntakeOrchestrationPublicCertificationStatus,
  IntakeOrchestrationPublicFreezeStatus,
  IntakeOrchestrationPublicIndexId,
  IntakeOrchestrationPublicIndexName,
  IntakeOrchestrationPublicIndexNamespace,
  IntakeOrchestrationPublicIndexVersion,
  IntakeOrchestrationPublicReleaseStatus,
  getIntakeOrchestrationPublicApiCount,
  getIntakeOrchestrationPublicReleaseMetadata,
  getIntakeOrchestrationPublicSummary,
} from "./intakeOrchestrationPublicIndex.ts";
import { IntakeOrchestrationRegistryPlatform } from "./intakeOrchestrationRegistry.ts";
import { IntakeOrchestrationValidationPlatform } from "./intakeOrchestrationValidation.ts";

const HERE = dirname(fileURLToPath(import.meta.url));

const NEA79_FILES = Object.freeze([
  "intakeOrchestrationPublicIndex.ts",
  "intakeOrchestrationPublicIndex.test.ts",
]);

const REQUIRED_PUBLIC_EXPORTS = Object.freeze([
  "IntakeOrchestrationPlatformPublicFoundation",
  "IntakeOrchestrationPublicApiRegistry",
  "IntakeOrchestrationPublicIndexId",
  "IntakeOrchestrationPublicIndexVersion",
  "IntakeOrchestrationPublicIndexName",
  "IntakeOrchestrationPublicIndexNamespace",
  "IntakeOrchestrationPublicReleaseStatus",
  "IntakeOrchestrationPublicCertificationStatus",
  "IntakeOrchestrationPublicFreezeStatus",
  "getIntakeOrchestrationPublicSummary",
  "getIntakeOrchestrationPublicApiCount",
  "getIntakeOrchestrationPublicReleaseMetadata",
] as const);

const NAMESPACE_SECTIONS = Object.freeze([
  "foundation",
  "registry",
  "model",
  "validation",
  "manifest",
  "platform",
  "certification",
  "freeze",
  "publicIndex",
] as const);

const PHASE_ORDER = Object.freeze([
  "NEA-7:1",
  "NEA-7:2",
  "NEA-7:3",
  "NEA-7:4",
  "NEA-7:5",
  "NEA-7:6",
  "NEA-7:7",
  "NEA-7:8",
  "NEA-7:9",
] as const);

const assertUnique = (values: readonly string[], label: string): void => {
  assert.equal(new Set(values).size, values.length, `${label} must be unique`);
};

describe("NEA-7:9 Intake Orchestration Public Index", () => {
  it("creates exactly two Public Index files and twelve public exports", () => {
    assert.equal(NEA79_FILES.length, 2);
    const present = readdirSync(HERE);
    for (const file of NEA79_FILES) {
      assert.ok(present.includes(file), `missing ${file}`);
    }
    assert.deepEqual(
      Object.keys(PublicIndexModule).sort(),
      [...REQUIRED_PUBLIC_EXPORTS].sort(),
    );
    assert.equal(Object.keys(PublicIndexModule).length, 12);
  });

  it("has exact identity and Released/Certified/Frozen/Stable/ReadyForConsumer metadata", () => {
    assert.equal(
      IntakeOrchestrationPublicIndexId,
      "NEA-7:9/IntakeOrchestrationPublicIndex",
    );
    assert.equal(IntakeOrchestrationPublicIndexVersion, "1.0.0");
    assert.equal(
      IntakeOrchestrationPublicIndexName,
      "Intake Orchestration Public Index",
    );
    assert.equal(
      IntakeOrchestrationPublicIndexNamespace,
      "nexora.nea.intake-orchestration.public-index",
    );
    assert.equal(IntakeOrchestrationPublicReleaseStatus, "Released");
    assert.equal(IntakeOrchestrationPublicCertificationStatus, "Certified");
    assert.equal(IntakeOrchestrationPublicFreezeStatus, "Frozen");

    const meta = IntakeOrchestrationPlatformPublicFoundation.publicIndex;
    assert.equal(meta.stabilityStatus, "Stable");
    assert.equal(meta.architectureStatus, "Complete");
    assert.equal(meta.architectureVersion, "NEA-7.0.0");
    assert.equal(meta.consumerReadiness, "ReadyForConsumer");
    assert.equal(meta.nextPhaseReadiness, "NEA-7 Complete");
    assert.equal(
      meta.solePublicEntryPoint,
      "intakeOrchestrationPublicIndex.ts",
    );
  });

  it("consumes Freeze as sole dependency", () => {
    const deps =
      IntakeOrchestrationPlatformPublicFoundation.dependencyDeclarations;
    assert.equal(
      deps.directPreviousPhaseModule,
      "intakeOrchestrationFreeze.ts",
    );
    assert.equal(deps.freezeOnly, true);
    assert.equal(deps.certificationDirectImport, false);
    assert.equal(deps.platformDirectImport, false);
    assert.equal(deps.manifestDirectImport, false);
    assert.equal(deps.validationDirectImport, false);
    assert.equal(deps.modelDirectImport, false);
    assert.equal(deps.registryDirectImport, false);
    assert.equal(deps.foundationDirectImport, false);
    assert.equal(deps.earlierNeaStageDirectImport, false);
    assert.equal(deps.duplicatesFreezeMetadata, false);
    assert.equal(deps.duplicatesCertificationMetadata, false);
    assert.equal(deps.reconstructsUpstream, false);
  });

  it("publishes a nine-section namespace with exact order and reference equality", () => {
    const publicNs = IntakeOrchestrationPlatformPublicFoundation;
    const keys = Object.keys(publicNs);
    assert.deepEqual(keys.slice(0, 9), [...NAMESPACE_SECTIONS]);
    assert.equal(NAMESPACE_SECTIONS.length, 9);

    assert.equal(publicNs.freeze, IntakeOrchestrationFreezePlatform);
    assert.equal(
      publicNs.certification,
      IntakeOrchestrationFreezePlatform.certification,
    );
    assert.equal(
      publicNs.platform,
      IntakeOrchestrationFreezePlatform.certification.platform,
    );
    assert.equal(
      publicNs.manifest,
      IntakeOrchestrationFreezePlatform.certification.platform.namespace
        .manifest,
    );
    assert.equal(
      publicNs.validation,
      IntakeOrchestrationFreezePlatform.certification.platform.namespace
        .validation,
    );
    assert.equal(
      publicNs.model,
      IntakeOrchestrationFreezePlatform.certification.platform.namespace.model,
    );
    assert.equal(
      publicNs.registry,
      IntakeOrchestrationFreezePlatform.certification.platform.namespace
        .registry,
    );
    assert.equal(
      publicNs.foundation,
      IntakeOrchestrationFreezePlatform.certification.platform.namespace
        .foundation,
    );

    assert.equal(
      publicNs.certification,
      IntakeOrchestrationCertificationPlatform,
    );
    assert.equal(publicNs.platform, IntakeOrchestrationPlatform);
    assert.equal(publicNs.manifest, IntakeOrchestrationManifestPlatform);
    assert.equal(publicNs.validation, IntakeOrchestrationValidationPlatform);
    assert.equal(publicNs.model, IntakeOrchestrationModelPlatform);
    assert.equal(publicNs.registry, IntakeOrchestrationRegistryPlatform);
    assert.equal(publicNs.foundation, IntakeOrchestrationFoundationPlatform);

    assert.equal(
      publicNs.publicIndex.publicIndexId,
      IntakeOrchestrationPublicIndexId,
    );
    assert.equal(Object.isFrozen(publicNs), true);
    assert.equal(Object.isFrozen(publicNs.publicIndex), true);
  });

  it("derives Public API Registry from Freeze-reachable registries without duplicates", () => {
    assert.equal(IntakeOrchestrationPublicApiRegistry.length, 76);
    assert.equal(getIntakeOrchestrationPublicApiCount(), 76);
    assertUnique(
      IntakeOrchestrationPublicApiRegistry.map((item) => item.id),
      "public api ids",
    );
    assertUnique(
      IntakeOrchestrationPublicApiRegistry.map(
        (item) => `${item.phase}:${item.exportName}`,
      ),
      "phase+export pairs",
    );

    const byPhase = Object.fromEntries(
      PHASE_ORDER.map((phase) => [
        phase,
        IntakeOrchestrationPublicApiRegistry.filter(
          (item) => item.phase === phase,
        ),
      ]),
    );
    assert.equal(byPhase["NEA-7:1"].length, 8);
    assert.equal(byPhase["NEA-7:2"].length, 8);
    assert.equal(byPhase["NEA-7:3"].length, 8);
    assert.equal(byPhase["NEA-7:4"].length, 8);
    assert.equal(byPhase["NEA-7:5"].length, 8);
    assert.equal(byPhase["NEA-7:6"].length, 8);
    assert.equal(byPhase["NEA-7:7"].length, 8);
    assert.equal(byPhase["NEA-7:8"].length, 8);
    assert.equal(byPhase["NEA-7:9"].length, 12);

    assert.ok(
      IntakeOrchestrationPublicApiRegistry.every(
        (item) => item.status === "Released",
      ),
    );
    assert.ok(
      IntakeOrchestrationPublicApiRegistry.every(
        (item) => item.certificationStatus === "Certified",
      ),
    );
    assert.ok(
      IntakeOrchestrationPublicApiRegistry.every(
        (item) => item.freezeStatus === "Frozen",
      ),
    );
  });

  it("preserves Freeze-reachable upstream apiRegistries and domain collections", () => {
    const publicNs = IntakeOrchestrationPlatformPublicFoundation;
    assert.equal(
      publicNs.foundation.apiRegistry,
      IntakeOrchestrationFoundationPlatform.apiRegistry,
    );
    assert.equal(
      publicNs.registry.apiRegistry,
      IntakeOrchestrationRegistryPlatform.apiRegistry,
    );
    assert.equal(
      publicNs.model.apiRegistry,
      IntakeOrchestrationModelPlatform.apiRegistry,
    );
    assert.equal(
      publicNs.validation.apiRegistry,
      IntakeOrchestrationValidationPlatform.apiRegistry,
    );
    assert.equal(
      publicNs.manifest.apiRegistry,
      IntakeOrchestrationManifestPlatform.apiRegistry,
    );
    assert.equal(
      publicNs.platform.apiRegistry,
      IntakeOrchestrationPlatform.apiRegistry,
    );
    assert.equal(
      publicNs.certification.apiRegistry,
      IntakeOrchestrationCertificationPlatform.apiRegistry,
    );
    assert.equal(
      publicNs.freeze.apiRegistry,
      IntakeOrchestrationFreezePlatform.apiRegistry,
    );
    assert.equal(publicNs.registry.collections.intakeIdentityCount, 8);
    assert.equal(publicNs.registry.collections.referenceTypeCount, 10);
    assert.equal(publicNs.model.domainModels.modelCount, 20);
    assert.equal(
      publicNs.foundation.contracts.canonicalExecutiveIntakePackageCount,
      1,
    );
    assert.equal(
      publicNs.registry.collections.intakeIdentities,
      IntakeOrchestrationFreezePlatform.registry.intakeIdentities,
    );
    assert.equal(
      publicNs.registry.collections.referenceTypes,
      IntakeOrchestrationFreezePlatform.registry.referenceTypes,
    );
    assert.ok(
      publicNs.model.domainModels.models.some(
        (item) => item.modelKind === "IntakeIdentity",
      ),
    );
    assert.ok(
      publicNs.model.domainModels.models.some(
        (item) => item.modelKind === "ExecutiveIntakePackage",
      ),
    );
  });

  it("derives deterministic consumer summary from canonical Freeze references", () => {
    const summaryA = getIntakeOrchestrationPublicSummary();
    const summaryB = getIntakeOrchestrationPublicSummary();
    const freezeSummary = IntakeOrchestrationFreezePlatform.summary;
    assert.deepEqual(summaryA, summaryB);
    assert.equal(Object.isFrozen(summaryA), true);
    assert.equal(summaryA.publicIndexId, IntakeOrchestrationPublicIndexId);
    assert.equal(summaryA.releaseStatus, "Released");
    assert.equal(summaryA.certificationStatus, "Certified");
    assert.equal(summaryA.freezeStatus, "Frozen");
    assert.equal(summaryA.stabilityStatus, "Stable");
    assert.equal(summaryA.consumerReadiness, "ReadyForConsumer");
    assert.equal(summaryA.architectureVersion, "NEA-7.0.0");
    assert.equal(summaryA.publicNamespaceSectionCount, 9);
    assert.equal(summaryA.publicExportCount, 12);
    assert.equal(summaryA.nea79ExportCount, 12);
    assert.equal(summaryA.publicApiRegistryCount, 76);
    assert.equal(summaryA.upstreamPhaseApiCount, 64);
    assert.equal(summaryA.foundationApiCount, 8);
    assert.equal(summaryA.freezeApiCount, 8);
    assert.equal(summaryA.publicIndexApiCount, 12);
    assert.equal(summaryA.intakeIdentityCount, 8);
    assert.equal(summaryA.referenceTypeCount, 10);
    assert.equal(summaryA.domainModelCount, 20);
    assert.equal(summaryA.canonicalExecutiveIntakePackageCount, 1);
    assert.equal(summaryA.inventoryEntryCount, 20);
    assert.equal(summaryA.totalArchitectureCount, 323);
    assert.equal(summaryA.composedPhaseCount, 6);
    assert.equal(summaryA.runtimeBehavior, false);
    assert.equal(
      summaryA.canonicalConsumerEntryPoint,
      "intakeOrchestrationPublicIndex.ts",
    );
    assert.equal(
      summaryA.certificationOutcome,
      freezeSummary.certificationOutcome,
    );
    assert.equal(summaryA.lockCount, freezeSummary.lockCount);
    assert.equal(summaryA.compatibilityCount, freezeSummary.compatibilityCount);
    assert.equal(summaryA.frozenComponentCount, freezeSummary.componentCount);
    assert.equal(summaryA.releaseGuaranteeCount, 17);
  });

  it("exposes release metadata and forbids runtime behavior", () => {
    const meta = getIntakeOrchestrationPublicReleaseMetadata();
    assert.equal(Object.isFrozen(meta), true);
    assert.equal(meta.releaseStatus, "Released");
    assert.equal(meta.certificationStatus, "Certified");
    assert.equal(meta.freezeStatus, "Frozen");
    assert.equal(meta.stabilityStatus, "Stable");
    assert.equal(meta.consumerReadiness, "ReadyForConsumer");
    assert.equal(
      meta.canonicalEntryPoint,
      "intakeOrchestrationPublicIndex.ts",
    );
    assert.equal(meta.directImportPolicy, "PublicIndexOnly");
    assert.equal(meta.publicApiCount, 76);
    assert.equal(meta.phaseCount, 9);
    assert.equal(meta.namespaceSectionCount, 9);
    assert.equal(meta.intakeIdentityCount, 8);
    assert.equal(meta.referenceTypeCount, 10);
    assert.equal(meta.inventoryEntryCount, 20);
    assert.equal(meta.totalArchitectureCount, 323);
    assert.equal(meta.guaranteeCount, 17);
    assert.equal(meta.runtimeBehavior, false);
    assert.equal(meta.runtimeOrchestration, false);
    assert.equal(meta.assemblesRuntimePackage, false);
    assert.equal(meta.executesDKLHandoff, false);
    assert.equal(meta.invokesDKL, false);

    const publicNs = IntakeOrchestrationPlatformPublicFoundation;
    assert.equal(publicNs.runtimeBehavior, false);
    assert.equal(publicNs.runtimeOrchestration, false);
    assert.equal(publicNs.assemblesRuntimePackage, false);
    assert.equal(publicNs.executesDKLHandoff, false);
    assert.equal(publicNs.invokesDKL, false);
    assert.equal(publicNs.serviceExecution, false);
    assert.equal(publicNs.implementsRuntimeOrchestration, false);
    assert.equal(publicNs.normalizesMessages, false);
    assert.equal(publicNs.interpretsBusinessMeaning, false);
    assert.equal(publicNs.implementsRouting, false);
    assert.equal(publicNs.networkingBehavior, false);
    assert.equal(publicNs.persistenceBehavior, false);
    assert.equal(publicNs.aiBehavior, false);
    assert.equal(publicNs.routingBehavior, false);
    assert.equal(publicNs.rebuildsInventories, false);
    assert.equal(publicNs.recertifies, false);
    assert.equal(publicNs.refreezes, false);
  });
});
