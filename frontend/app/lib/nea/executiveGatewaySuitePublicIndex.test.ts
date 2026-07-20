/**
 * NEA-8:9 — Executive Gateway Suite Public Index Tests.
 *
 * Deterministic coverage for the sole NEA-8 public release surface.
 * No mocks. No randomness. No network. No databases. No system time.
 */

import assert from "node:assert/strict";
import { readdirSync } from "node:fs";
import { dirname } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import { ExecutiveGatewaySuiteCertificationPlatform } from "./executiveGatewaySuiteCertification.ts";
import { ExecutiveGatewaySuiteFoundationPlatform } from "./executiveGatewaySuiteFoundation.ts";
import { ExecutiveGatewaySuiteFreezePlatform } from "./executiveGatewaySuiteFreeze.ts";
import { ExecutiveGatewaySuiteManifestPlatform } from "./executiveGatewaySuiteManifest.ts";
import { ExecutiveGatewaySuiteModelPlatform } from "./executiveGatewaySuiteModel.ts";
import { ExecutiveGatewaySuitePlatform } from "./executiveGatewaySuitePlatform.ts";
import * as PublicIndexModule from "./executiveGatewaySuitePublicIndex.ts";
import {
  ExecutiveGatewaySuitePlatformPublicFoundation,
  ExecutiveGatewaySuitePublicApiRegistry,
  ExecutiveGatewaySuitePublicCertificationStatus,
  ExecutiveGatewaySuitePublicFreezeStatus,
  ExecutiveGatewaySuitePublicIndexId,
  ExecutiveGatewaySuitePublicIndexName,
  ExecutiveGatewaySuitePublicIndexNamespace,
  ExecutiveGatewaySuitePublicIndexVersion,
  ExecutiveGatewaySuitePublicReleaseStatus,
  getExecutiveGatewaySuitePublicApiCount,
  getExecutiveGatewaySuitePublicReleaseMetadata,
  getExecutiveGatewaySuitePublicSummary,
} from "./executiveGatewaySuitePublicIndex.ts";
import { ExecutiveGatewaySuiteRegistryPlatform } from "./executiveGatewaySuiteRegistry.ts";
import { ExecutiveGatewaySuiteValidationPlatform } from "./executiveGatewaySuiteValidation.ts";

const HERE = dirname(fileURLToPath(import.meta.url));

const NEA89_FILES = Object.freeze([
  "executiveGatewaySuitePublicIndex.ts",
  "executiveGatewaySuitePublicIndex.test.ts",
]);

const REQUIRED_PUBLIC_EXPORTS = Object.freeze([
  "ExecutiveGatewaySuitePlatformPublicFoundation",
  "ExecutiveGatewaySuitePublicApiRegistry",
  "ExecutiveGatewaySuitePublicIndexId",
  "ExecutiveGatewaySuitePublicIndexVersion",
  "ExecutiveGatewaySuitePublicIndexName",
  "ExecutiveGatewaySuitePublicIndexNamespace",
  "ExecutiveGatewaySuitePublicReleaseStatus",
  "ExecutiveGatewaySuitePublicCertificationStatus",
  "ExecutiveGatewaySuitePublicFreezeStatus",
  "getExecutiveGatewaySuitePublicSummary",
  "getExecutiveGatewaySuitePublicApiCount",
  "getExecutiveGatewaySuitePublicReleaseMetadata",
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
  "NEA-8:1",
  "NEA-8:2",
  "NEA-8:3",
  "NEA-8:4",
  "NEA-8:5",
  "NEA-8:6",
  "NEA-8:7",
  "NEA-8:8",
  "NEA-8:9",
] as const);

const assertUnique = (values: readonly string[], label: string): void => {
  assert.equal(new Set(values).size, values.length, `${label} must be unique`);
};

describe("NEA-8:9 Executive Gateway Suite Public Index", () => {
  it("creates exactly two Public Index files and twelve public exports", () => {
    assert.equal(NEA89_FILES.length, 2);
    const present = readdirSync(HERE);
    for (const file of NEA89_FILES) {
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
      ExecutiveGatewaySuitePublicIndexId,
      "NEA-8:9/ExecutiveGatewaySuitePublicIndex",
    );
    assert.equal(ExecutiveGatewaySuitePublicIndexVersion, "1.0.0");
    assert.equal(
      ExecutiveGatewaySuitePublicIndexName,
      "Executive Gateway Suite Public Index",
    );
    assert.equal(
      ExecutiveGatewaySuitePublicIndexNamespace,
      "nexora.nea.executive-gateway-suite.public-index",
    );
    assert.equal(ExecutiveGatewaySuitePublicReleaseStatus, "Released");
    assert.equal(ExecutiveGatewaySuitePublicCertificationStatus, "Certified");
    assert.equal(ExecutiveGatewaySuitePublicFreezeStatus, "Frozen");

    const meta = ExecutiveGatewaySuitePlatformPublicFoundation.publicIndex;
    assert.equal(meta.stabilityStatus, "Stable");
    assert.equal(meta.architectureStatus, "Complete");
    assert.equal(meta.architectureVersion, "NEA-8.0.0");
    assert.equal(meta.consumerReadiness, "ReadyForConsumer");
    assert.equal(meta.nextPhaseReadiness, "NEA-8 Complete");
    assert.equal(
      meta.solePublicEntryPoint,
      "executiveGatewaySuitePublicIndex.ts",
    );
  });

  it("consumes Freeze as sole dependency", () => {
    const deps =
      ExecutiveGatewaySuitePlatformPublicFoundation.dependencyDeclarations;
    assert.equal(
      deps.directPreviousPhaseModule,
      "executiveGatewaySuiteFreeze.ts",
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
    const publicNs = ExecutiveGatewaySuitePlatformPublicFoundation;
    const keys = Object.keys(publicNs);
    assert.deepEqual(keys.slice(0, 9), [...NAMESPACE_SECTIONS]);
    assert.equal(NAMESPACE_SECTIONS.length, 9);

    assert.equal(publicNs.freeze, ExecutiveGatewaySuiteFreezePlatform);
    assert.equal(
      publicNs.certification,
      ExecutiveGatewaySuiteFreezePlatform.certification,
    );
    assert.equal(
      publicNs.platform,
      ExecutiveGatewaySuiteFreezePlatform.certification.platform,
    );
    assert.equal(
      publicNs.manifest,
      ExecutiveGatewaySuiteFreezePlatform.certification.platform.namespace
        .manifest,
    );
    assert.equal(
      publicNs.validation,
      ExecutiveGatewaySuiteFreezePlatform.certification.platform.namespace
        .validation,
    );
    assert.equal(
      publicNs.model,
      ExecutiveGatewaySuiteFreezePlatform.certification.platform.namespace.model,
    );
    assert.equal(
      publicNs.registry,
      ExecutiveGatewaySuiteFreezePlatform.certification.platform.namespace
        .registry,
    );
    assert.equal(
      publicNs.foundation,
      ExecutiveGatewaySuiteFreezePlatform.certification.platform.namespace
        .foundation,
    );

    assert.equal(
      publicNs.certification,
      ExecutiveGatewaySuiteCertificationPlatform,
    );
    assert.equal(publicNs.platform, ExecutiveGatewaySuitePlatform);
    assert.equal(publicNs.manifest, ExecutiveGatewaySuiteManifestPlatform);
    assert.equal(publicNs.validation, ExecutiveGatewaySuiteValidationPlatform);
    assert.equal(publicNs.model, ExecutiveGatewaySuiteModelPlatform);
    assert.equal(publicNs.registry, ExecutiveGatewaySuiteRegistryPlatform);
    assert.equal(publicNs.foundation, ExecutiveGatewaySuiteFoundationPlatform);

    assert.equal(
      publicNs.publicIndex.publicIndexId,
      ExecutiveGatewaySuitePublicIndexId,
    );
    assert.equal(Object.isFrozen(publicNs), true);
    assert.equal(Object.isFrozen(publicNs.publicIndex), true);
  });

  it("derives Public API Registry from Freeze-reachable registries without duplicates", () => {
    assert.equal(ExecutiveGatewaySuitePublicApiRegistry.length, 76);
    assert.equal(getExecutiveGatewaySuitePublicApiCount(), 76);
    assertUnique(
      ExecutiveGatewaySuitePublicApiRegistry.map((item) => item.id),
      "public api ids",
    );
    assertUnique(
      ExecutiveGatewaySuitePublicApiRegistry.map(
        (item) => `${item.phase}:${item.exportName}`,
      ),
      "phase+export pairs",
    );

    const byPhase = Object.fromEntries(
      PHASE_ORDER.map((phase) => [
        phase,
        ExecutiveGatewaySuitePublicApiRegistry.filter(
          (item) => item.phase === phase,
        ),
      ]),
    );
    assert.equal(byPhase["NEA-8:1"].length, 8);
    assert.equal(byPhase["NEA-8:2"].length, 8);
    assert.equal(byPhase["NEA-8:3"].length, 8);
    assert.equal(byPhase["NEA-8:4"].length, 8);
    assert.equal(byPhase["NEA-8:5"].length, 8);
    assert.equal(byPhase["NEA-8:6"].length, 8);
    assert.equal(byPhase["NEA-8:7"].length, 8);
    assert.equal(byPhase["NEA-8:8"].length, 8);
    assert.equal(byPhase["NEA-8:9"].length, 12);

    assert.ok(
      ExecutiveGatewaySuitePublicApiRegistry.every(
        (item) => item.status === "Released",
      ),
    );
    assert.ok(
      ExecutiveGatewaySuitePublicApiRegistry.every(
        (item) => item.certificationStatus === "Certified",
      ),
    );
    assert.ok(
      ExecutiveGatewaySuitePublicApiRegistry.every(
        (item) => item.freezeStatus === "Frozen",
      ),
    );
  });

  it("preserves Freeze-reachable upstream apiRegistries and suite inventories", () => {
    const publicNs = ExecutiveGatewaySuitePlatformPublicFoundation;
    assert.equal(
      publicNs.foundation.apiRegistry,
      ExecutiveGatewaySuiteFoundationPlatform.apiRegistry,
    );
    assert.equal(
      publicNs.registry.apiRegistry,
      ExecutiveGatewaySuiteRegistryPlatform.apiRegistry,
    );
    assert.equal(
      publicNs.model.apiRegistry,
      ExecutiveGatewaySuiteModelPlatform.apiRegistry,
    );
    assert.equal(
      publicNs.validation.apiRegistry,
      ExecutiveGatewaySuiteValidationPlatform.apiRegistry,
    );
    assert.equal(
      publicNs.manifest.apiRegistry,
      ExecutiveGatewaySuiteManifestPlatform.apiRegistry,
    );
    assert.equal(
      publicNs.platform.apiRegistry,
      ExecutiveGatewaySuitePlatform.apiRegistry,
    );
    assert.equal(
      publicNs.certification.apiRegistry,
      ExecutiveGatewaySuiteCertificationPlatform.apiRegistry,
    );
    assert.equal(
      publicNs.freeze.apiRegistry,
      ExecutiveGatewaySuiteFreezePlatform.apiRegistry,
    );
    assert.equal(publicNs.platform.namespace.suiteComponentCount, 7);
    assert.equal(
      publicNs.platform.namespace.suiteComponents,
      ExecutiveGatewaySuiteFreezePlatform.registry.suiteComponents,
    );
    assert.equal(publicNs.platform.metadata.publicApiInventoryTotal, 532);
    assert.equal(publicNs.platform.metadata.totalArchitectureCount, 820);
    assert.equal(publicNs.platform.metadata.inventoryEntryCount, 20);
    assert.equal(publicNs.platform.metadata.composedPhaseCount, 6);
    assert.equal(publicNs.platform.metadata.architectureVersion, "NEA-8.0.0");
    assert.equal(
      publicNs.foundation,
      publicNs.registry.foundationPlatform,
    );
    assert.equal(publicNs.registry, publicNs.model.registryPlatform);
    assert.equal(publicNs.model, publicNs.validation.modelPlatform);
    assert.equal(publicNs.validation, publicNs.manifest.validationPlatform);
  });

  it("derives deterministic consumer summary from canonical Freeze references", () => {
    const summaryA = getExecutiveGatewaySuitePublicSummary();
    const summaryB = getExecutiveGatewaySuitePublicSummary();
    const freezeSummary = ExecutiveGatewaySuiteFreezePlatform.summary;
    assert.deepEqual(summaryA, summaryB);
    assert.equal(Object.isFrozen(summaryA), true);
    assert.equal(summaryA.publicIndexId, ExecutiveGatewaySuitePublicIndexId);
    assert.equal(summaryA.releaseStatus, "Released");
    assert.equal(summaryA.certificationStatus, "Certified");
    assert.equal(summaryA.freezeStatus, "Frozen");
    assert.equal(summaryA.stabilityStatus, "Stable");
    assert.equal(summaryA.consumerReadiness, "ReadyForConsumer");
    assert.equal(summaryA.architectureVersion, "NEA-8.0.0");
    assert.equal(summaryA.publicNamespaceSectionCount, 9);
    assert.equal(summaryA.publicExportCount, 12);
    assert.equal(summaryA.nea89ExportCount, 12);
    assert.equal(summaryA.publicApiRegistryCount, 76);
    assert.equal(summaryA.upstreamPhaseApiCount, 64);
    assert.equal(summaryA.foundationApiCount, 8);
    assert.equal(summaryA.freezeApiCount, 8);
    assert.equal(summaryA.publicIndexApiCount, 12);
    assert.equal(summaryA.suiteComponentCount, 7);
    assert.equal(summaryA.inventoryEntryCount, 20);
    assert.equal(summaryA.publicApiInventoryTotal, 532);
    assert.equal(summaryA.totalArchitectureCount, 820);
    assert.equal(summaryA.composedPhaseCount, 6);
    assert.equal(summaryA.runtimeBehavior, false);
    assert.equal(
      summaryA.canonicalConsumerEntryPoint,
      "executiveGatewaySuitePublicIndex.ts",
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
    const meta = getExecutiveGatewaySuitePublicReleaseMetadata();
    assert.equal(Object.isFrozen(meta), true);
    assert.equal(meta.releaseStatus, "Released");
    assert.equal(meta.certificationStatus, "Certified");
    assert.equal(meta.freezeStatus, "Frozen");
    assert.equal(meta.stabilityStatus, "Stable");
    assert.equal(meta.consumerReadiness, "ReadyForConsumer");
    assert.equal(
      meta.canonicalEntryPoint,
      "executiveGatewaySuitePublicIndex.ts",
    );
    assert.equal(meta.directImportPolicy, "PublicIndexOnly");
    assert.equal(meta.publicApiCount, 76);
    assert.equal(meta.phaseCount, 9);
    assert.equal(meta.namespaceSectionCount, 9);
    assert.equal(meta.suiteComponentCount, 7);
    assert.equal(meta.inventoryEntryCount, 20);
    assert.equal(meta.publicApiInventoryTotal, 532);
    assert.equal(meta.totalArchitectureCount, 820);
    assert.equal(meta.guaranteeCount, 17);
    assert.equal(meta.runtimeBehavior, false);
    assert.equal(meta.implementsRuntimeGateway, false);
    assert.equal(meta.implementsRuntimeConnectors, false);
    assert.equal(meta.implementsRuntimeSessions, false);
    assert.equal(meta.implementsRuntimeRouting, false);
    assert.equal(meta.implementsRuntimeSecurity, false);
    assert.equal(meta.implementsRuntimeMessageNormalization, false);
    assert.equal(meta.implementsRuntimeIntakeOrchestration, false);
    assert.equal(meta.invokesDkl, false);
    assert.equal(meta.invokesExecutiveEngine, false);
    assert.equal(meta.invokesAssistant, false);

    const publicNs = ExecutiveGatewaySuitePlatformPublicFoundation;
    assert.equal(publicNs.runtimeBehavior, false);
    assert.equal(publicNs.implementsRuntimeGateway, false);
    assert.equal(publicNs.implementsRuntimeConnectors, false);
    assert.equal(publicNs.implementsRuntimeSessions, false);
    assert.equal(publicNs.implementsRuntimeRouting, false);
    assert.equal(publicNs.implementsRuntimeSecurity, false);
    assert.equal(publicNs.implementsRuntimeMessageNormalization, false);
    assert.equal(publicNs.implementsRuntimeIntakeOrchestration, false);
    assert.equal(publicNs.serviceExecution, false);
    assert.equal(publicNs.networkingBehavior, false);
    assert.equal(publicNs.persistenceBehavior, false);
    assert.equal(publicNs.aiBehavior, false);
    assert.equal(publicNs.invokesDkl, false);
    assert.equal(publicNs.invokesExecutiveEngine, false);
    assert.equal(publicNs.invokesAssistant, false);
    assert.equal(publicNs.rebuildsInventories, false);
    assert.equal(publicNs.recertifies, false);
    assert.equal(publicNs.refreezes, false);
  });
});
