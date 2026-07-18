/**
 * DKL-9:9 — Data Knowledge Suite Public Index Tests.
 *
 * Deterministic coverage for the sole DKL-9 public release surface.
 * No mocks. No randomness. No network. No databases.
 */

import assert from "node:assert/strict";
import { readdirSync } from "node:fs";
import { dirname } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import { DataKnowledgeSuiteFoundationPlatform } from "./dataKnowledgeSuiteFoundation.ts";
import { DataKnowledgeSuiteFreezePlatform } from "./dataKnowledgeSuiteFreeze.ts";
import { DataKnowledgeSuiteCertificationPlatform } from "./dataKnowledgeSuiteCertification.ts";
import { DataKnowledgeSuiteManifestPlatform } from "./dataKnowledgeSuiteManifest.ts";
import { DataKnowledgeSuiteModelPlatform } from "./dataKnowledgeSuiteModel.ts";
import { DataKnowledgeSuitePlatform } from "./dataKnowledgeSuitePlatform.ts";
import * as PublicIndexModule from "./dataKnowledgeSuitePublicIndex.ts";
import {
  getDataKnowledgeSuitePublicApiCount,
  getDataKnowledgeSuitePublicReleaseMetadata,
  getDataKnowledgeSuitePublicSummary,
  DataKnowledgeSuitePlatformPublicFoundation,
  DataKnowledgeSuitePublicApiRegistry,
  DataKnowledgeSuitePublicCertificationStatus,
  DataKnowledgeSuitePublicFreezeStatus,
  DataKnowledgeSuitePublicIndexId,
  DataKnowledgeSuitePublicIndexName,
  DataKnowledgeSuitePublicIndexNamespace,
  DataKnowledgeSuitePublicIndexVersion,
  DataKnowledgeSuitePublicReleaseStatus,
} from "./dataKnowledgeSuitePublicIndex.ts";
import { DataKnowledgeSuiteRegistryPlatform } from "./dataKnowledgeSuiteRegistry.ts";
import { DataKnowledgeSuiteValidationPlatform } from "./dataKnowledgeSuiteValidation.ts";

const HERE = dirname(fileURLToPath(import.meta.url));

const DKL99_FILES = Object.freeze([
  "dataKnowledgeSuitePublicIndex.ts",
  "dataKnowledgeSuitePublicIndex.test.ts",
]);

const REQUIRED_PUBLIC_EXPORTS = Object.freeze([
  "DataKnowledgeSuitePlatformPublicFoundation",
  "DataKnowledgeSuitePublicApiRegistry",
  "DataKnowledgeSuitePublicIndexId",
  "DataKnowledgeSuitePublicIndexVersion",
  "DataKnowledgeSuitePublicIndexName",
  "DataKnowledgeSuitePublicIndexNamespace",
  "DataKnowledgeSuitePublicReleaseStatus",
  "DataKnowledgeSuitePublicCertificationStatus",
  "DataKnowledgeSuitePublicFreezeStatus",
  "getDataKnowledgeSuitePublicSummary",
  "getDataKnowledgeSuitePublicApiCount",
  "getDataKnowledgeSuitePublicReleaseMetadata",
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
  "DKL-9:1",
  "DKL-9:2",
  "DKL-9:3",
  "DKL-9:4",
  "DKL-9:5",
  "DKL-9:6",
  "DKL-9:7",
  "DKL-9:8",
  "DKL-9:9",
] as const);

const assertUnique = (values: readonly string[], label: string): void => {
  assert.equal(new Set(values).size, values.length, `${label} must be unique`);
};

describe("DKL-9:9 Data Knowledge Suite Public Index", () => {
  it("creates exactly two Public Index files and twelve public exports", () => {
    assert.equal(DKL99_FILES.length, 2);
    const present = readdirSync(HERE);
    for (const file of DKL99_FILES) {
      assert.ok(present.includes(file), `missing ${file}`);
    }
    assert.deepEqual(
      Object.keys(PublicIndexModule).sort(),
      [...REQUIRED_PUBLIC_EXPORTS].sort(),
    );
    assert.equal(Object.keys(PublicIndexModule).length, 12);
  });

  it("has exact identity and Released/Certified/Frozen/Stable metadata", () => {
    assert.equal(
      DataKnowledgeSuitePublicIndexId,
      "DKL-9:9/DataKnowledgeSuitePublicIndex",
    );
    assert.equal(DataKnowledgeSuitePublicIndexVersion, "1.0.0");
    assert.equal(
      DataKnowledgeSuitePublicIndexName,
      "Data Knowledge Suite Public Index",
    );
    assert.equal(
      DataKnowledgeSuitePublicIndexNamespace,
      "nexora.dkl.data-knowledge-suite.public-index",
    );
    assert.equal(DataKnowledgeSuitePublicReleaseStatus, "Released");
    assert.equal(DataKnowledgeSuitePublicCertificationStatus, "Certified");
    assert.equal(DataKnowledgeSuitePublicFreezeStatus, "Frozen");

    const meta = DataKnowledgeSuitePlatformPublicFoundation.publicIndex;
    assert.equal(meta.stabilityStatus, "Stable");
    assert.equal(meta.architectureStatus, "Complete");
    assert.equal(meta.consumerReadiness, "ReadyForConsumer");
    assert.equal(meta.nextPhaseReadiness, "DKL Layer Complete");
  });

  it("consumes Freeze as sole dependency", () => {
    const deps =
      DataKnowledgeSuitePlatformPublicFoundation.dependencyDeclarations;
    assert.equal(
      deps.directPreviousPhaseModule,
      "dataKnowledgeSuiteFreeze.ts",
    );
    assert.equal(deps.freezeOnly, true);
    assert.equal(deps.certificationDirectImport, false);
    assert.equal(deps.platformDirectImport, false);
    assert.equal(deps.manifestDirectImport, false);
    assert.equal(deps.validationDirectImport, false);
    assert.equal(deps.modelDirectImport, false);
    assert.equal(deps.registryDirectImport, false);
    assert.equal(deps.foundationDirectImport, false);
    assert.equal(deps.dkl1DirectImport, false);
    assert.equal(deps.dkl8DirectImport, false);
    assert.equal(deps.earlierDkl9StageDirectImport, false);
  });

  it("publishes a nine-section namespace with exact order and reference equality", () => {
    const ns = DataKnowledgeSuitePlatformPublicFoundation;
    const keys = Object.keys(ns);
    assert.deepEqual(keys.slice(0, 9), [...NAMESPACE_SECTIONS]);
    assert.equal(NAMESPACE_SECTIONS.length, 9);

    assert.equal(ns.freeze, DataKnowledgeSuiteFreezePlatform);
    assert.equal(
      ns.certification,
      DataKnowledgeSuiteFreezePlatform.certification,
    );
    assert.equal(ns.platform, DataKnowledgeSuiteFreezePlatform.platform);
    assert.equal(ns.manifest, DataKnowledgeSuiteFreezePlatform.manifest);
    assert.equal(ns.validation, DataKnowledgeSuiteFreezePlatform.validation);
    assert.equal(ns.model, DataKnowledgeSuiteFreezePlatform.model);
    assert.equal(ns.registry, DataKnowledgeSuiteFreezePlatform.registry);
    assert.equal(ns.foundation, DataKnowledgeSuiteFreezePlatform.foundation);

    assert.equal(ns.certification, DataKnowledgeSuiteCertificationPlatform);
    assert.equal(ns.platform, DataKnowledgeSuitePlatform);
    assert.equal(ns.manifest, DataKnowledgeSuiteManifestPlatform);
    assert.equal(ns.validation, DataKnowledgeSuiteValidationPlatform);
    assert.equal(ns.model, DataKnowledgeSuiteModelPlatform);
    assert.equal(ns.registry, DataKnowledgeSuiteRegistryPlatform);
    assert.equal(ns.foundation, DataKnowledgeSuiteFoundationPlatform);

    assert.equal(
      ns.publicIndex.publicIndexId,
      DataKnowledgeSuitePublicIndexId,
    );
    assert.equal(Object.isFrozen(ns), true);
    assert.equal(Object.isFrozen(ns.publicIndex), true);
  });

  it("satisfies Canonical Inventory Rule through Freeze-derived counts", () => {
    const summary = getDataKnowledgeSuitePublicSummary();
    const freeze = DataKnowledgeSuiteFreezePlatform;
    const upstream = freeze.inventory.upstreamCertificationInventory;

    assert.equal(summary.capabilityCount, upstream.capabilityCount);
    assert.equal(
      summary.publicApiInventoryTotal,
      upstream.publicApiInventoryTotal,
    );
    assert.equal(summary.modelKindCount, upstream.modelKindCount);
    assert.equal(
      summary.registryTotalEntryCount,
      upstream.registryTotalEntryCount,
    );
    assert.equal(summary.validationRuleCount, upstream.validationRuleCount);
    assert.equal(
      summary.validationCategoryCount,
      upstream.validationCategoryCount,
    );
    assert.equal(summary.validationGateCount, upstream.validationGateCount);
    assert.equal(
      summary.manifestTotalEntryCount,
      upstream.manifestTotalEntryCount,
    );
    assert.equal(
      summary.platformTotalEntryCount,
      upstream.platformTotalEntryCount,
    );
    assert.equal(
      summary.freezeTotalEntryCount,
      freeze.inventory.totalEntryCount,
    );
    assert.equal(
      summary.frozenComponentCount,
      freeze.inventory.frozenComponentCount,
    );
  });

  it("preserves Freeze-reachable upstream apiRegistries by reference", () => {
    const ns = DataKnowledgeSuitePlatformPublicFoundation;
    assert.equal(
      ns.foundation.apiRegistry,
      DataKnowledgeSuiteFoundationPlatform.apiRegistry,
    );
    assert.equal(
      ns.registry.apiRegistry,
      DataKnowledgeSuiteRegistryPlatform.apiRegistry,
    );
    assert.equal(
      ns.model.apiRegistry,
      DataKnowledgeSuiteModelPlatform.apiRegistry,
    );
    assert.equal(
      ns.validation.apiRegistry,
      DataKnowledgeSuiteValidationPlatform.apiRegistry,
    );
    assert.equal(
      ns.manifest.apiRegistry,
      DataKnowledgeSuiteManifestPlatform.apiRegistry,
    );
    assert.equal(
      ns.manifest.apiRegistry,
      DataKnowledgeSuiteManifestPlatform.publicApi,
    );
    assert.equal(ns.platform.apiRegistry, DataKnowledgeSuitePlatform.apiRegistry);
    assert.equal(
      ns.certification.apiRegistry,
      DataKnowledgeSuiteCertificationPlatform.apiRegistry,
    );
    assert.equal(
      ns.freeze.apiRegistry,
      DataKnowledgeSuiteFreezePlatform.apiRegistry,
    );

    assert.equal(ns.foundation.apiRegistry.length, 8);
    assert.equal(ns.registry.apiRegistry.length, 8);
    assert.equal(ns.model.apiRegistry.length, 8);
    assert.equal(ns.validation.apiRegistry.length, 8);
    assert.equal(ns.manifest.apiRegistry.length, 8);
    assert.equal(ns.platform.apiRegistry.length, 8);
    assert.equal(ns.certification.apiRegistry.length, 8);
    assert.equal(ns.freeze.apiRegistry.length, 8);
  });

  it("registers complete released APIs once from Freeze-derived collections", () => {
    const expectedCount =
      DataKnowledgeSuiteFoundationPlatform.apiRegistry.length +
      DataKnowledgeSuiteRegistryPlatform.apiRegistry.length +
      DataKnowledgeSuiteModelPlatform.apiRegistry.length +
      DataKnowledgeSuiteValidationPlatform.apiRegistry.length +
      DataKnowledgeSuiteManifestPlatform.apiRegistry.length +
      DataKnowledgeSuitePlatform.apiRegistry.length +
      DataKnowledgeSuiteCertificationPlatform.apiRegistry.length +
      DataKnowledgeSuiteFreezePlatform.apiRegistry.length +
      REQUIRED_PUBLIC_EXPORTS.length;

    assert.equal(DataKnowledgeSuitePublicApiRegistry.length, expectedCount);
    assert.equal(expectedCount, 76);
    assert.equal(getDataKnowledgeSuitePublicApiCount(), expectedCount);
    assert.equal(Object.isFrozen(DataKnowledgeSuitePublicApiRegistry), true);
    assertUnique(
      DataKnowledgeSuitePublicApiRegistry.map((item) => item.id),
      "API IDs",
    );
    assertUnique(
      DataKnowledgeSuitePublicApiRegistry.map(
        (item) => `${item.phase}:${item.exportName}`,
      ),
      "phase export pairs",
    );

    for (const item of DataKnowledgeSuitePublicApiRegistry) {
      assert.ok((PHASE_ORDER as readonly string[]).includes(item.phase));
      assert.equal(item.status, "Released");
      assert.equal(item.certificationStatus, "Certified");
      assert.equal(item.freezeStatus, "Frozen");
      assert.equal(item.stability, "Stable");
      assert.equal(item.public, true);
    }

    const byPhase = new Map<string, number>();
    for (const item of DataKnowledgeSuitePublicApiRegistry) {
      byPhase.set(item.phase, (byPhase.get(item.phase) ?? 0) + 1);
    }
    for (const phase of PHASE_ORDER.slice(0, 8)) {
      assert.equal(byPhase.get(phase), 8, `${phase} must expose 8 APIs`);
    }
    assert.equal(byPhase.get("DKL-9:9"), 12);

    assert.deepEqual(
      DataKnowledgeSuitePublicApiRegistry.filter(
        (item) => item.phase === "DKL-9:9",
      ).map((item) => item.exportName),
      [...REQUIRED_PUBLIC_EXPORTS],
    );
  });

  it("returns deterministic summary and release metadata", () => {
    const summaryA = getDataKnowledgeSuitePublicSummary();
    const summaryB = getDataKnowledgeSuitePublicSummary();
    assert.deepEqual(summaryA, summaryB);
    assert.equal(Object.isFrozen(summaryA), true);
    assert.equal(summaryA.releaseStatus, "Released");
    assert.equal(summaryA.certificationStatus, "Certified");
    assert.equal(summaryA.freezeStatus, "Frozen");
    assert.equal(summaryA.consumerReadiness, "ReadyForConsumer");
    assert.equal(summaryA.nextPhaseReadiness, "DKL Layer Complete");
    assert.equal(summaryA.publicApiRegistryCount, 76);
    assert.equal(summaryA.dkl99ExportCount, 12);
    assert.equal(summaryA.publicNamespaceSectionCount, 9);

    const metaA = getDataKnowledgeSuitePublicReleaseMetadata();
    const metaB = getDataKnowledgeSuitePublicReleaseMetadata();
    assert.deepEqual(metaA, metaB);
    assert.equal(Object.isFrozen(metaA), true);
    assert.equal(metaA.releaseStatus, "Released");
    assert.equal(metaA.certificationStatus, "Certified");
    assert.equal(metaA.freezeStatus, "Frozen");
    assert.equal(metaA.stabilityStatus, "Stable");
    assert.equal(metaA.consumerReadiness, "ReadyForConsumer");
    assert.equal(metaA.nextPhaseReadiness, "DKL Layer Complete");
    assert.equal(metaA.publicApiCount, 76);
    assert.equal(
      metaA.canonicalEntryPoint,
      "dataKnowledgeSuitePublicIndex.ts",
    );
  });

  it("is immutable and declares DKL Layer Complete", () => {
    assert.equal(Object.isFrozen(DataKnowledgeSuitePublicApiRegistry), true);
    assert.equal(
      Object.isFrozen(DataKnowledgeSuitePlatformPublicFoundation),
      true,
    );
    assert.equal(
      Object.isFrozen(DataKnowledgeSuitePlatformPublicFoundation.publicIndex),
      true,
    );
    assert.equal(
      DataKnowledgeSuitePlatformPublicFoundation.publicIndex
        .nextPhaseReadiness,
      "DKL Layer Complete",
    );
    assert.equal(
      getDataKnowledgeSuitePublicReleaseMetadata().nextPhaseReadiness,
      "DKL Layer Complete",
    );
    assert.equal(
      DataKnowledgeSuitePlatformPublicFoundation.rebuildsInventories,
      false,
    );
    assert.equal(
      DataKnowledgeSuitePlatformPublicFoundation.rebuildsApiRegistries,
      false,
    );
    assert.equal(
      DataKnowledgeSuitePlatformPublicFoundation.recertifies,
      false,
    );
    assert.equal(DataKnowledgeSuitePlatformPublicFoundation.refreezes, false);
    assert.equal(DataKnowledgeSuitePlatformPublicFoundation.runtimeBehavior, false);

    const principle =
      DataKnowledgeSuitePlatformPublicFoundation.publicIndex
        .architecturalPrinciple;
    assert.equal(Object.isFrozen(principle), true);
    assert.equal(Object.isFrozen(principle.principles), true);
    assert.match(principle.ownership, /DKL-9/);
    assert.match(principle.prohibition, /DKL-1 through DKL-8/);
    assert.match(
      principle.access,
      /DataKnowledgeSuiteFreezePlatform/,
    );
    assert.deepEqual(
      [...principle.principles],
      [
        "Sole Public Entry Point",
        "Canonical Reference Preservation",
        "Canonical Inventory Rule",
        "No Reconstruction Rule",
      ],
    );
  });
});
