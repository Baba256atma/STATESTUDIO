/**
 * DKL-8:9 — Knowledge Governance Public Index Tests.
 *
 * Deterministic coverage for the sole DKL-8 public release surface.
 * No mocks. No randomness. No network. No databases.
 */

import assert from "node:assert/strict";
import { readdirSync } from "node:fs";
import { dirname } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import { KnowledgeGovernanceFoundationPlatform } from "./knowledgeGovernanceFoundation.ts";
import { KnowledgeGovernanceFreezePlatform } from "./knowledgeGovernanceFreeze.ts";
import { KnowledgeGovernanceCertificationPlatform } from "./knowledgeGovernanceCertification.ts";
import { KnowledgeGovernanceManifestPlatform } from "./knowledgeGovernanceManifest.ts";
import { KnowledgeGovernanceModelPlatform } from "./knowledgeGovernanceModel.ts";
import { KnowledgeGovernancePlatform } from "./knowledgeGovernancePlatform.ts";
import * as PublicIndexModule from "./knowledgeGovernancePublicIndex.ts";
import {
  getKnowledgeGovernancePublicApiCount,
  getKnowledgeGovernancePublicReleaseMetadata,
  getKnowledgeGovernancePublicSummary,
  KnowledgeGovernancePlatformPublicFoundation,
  KnowledgeGovernancePublicApiRegistry,
  KnowledgeGovernancePublicCertificationStatus,
  KnowledgeGovernancePublicFreezeStatus,
  KnowledgeGovernancePublicIndexId,
  KnowledgeGovernancePublicIndexName,
  KnowledgeGovernancePublicIndexNamespace,
  KnowledgeGovernancePublicIndexVersion,
  KnowledgeGovernancePublicReleaseStatus,
} from "./knowledgeGovernancePublicIndex.ts";
import { KnowledgeGovernanceRegistryPlatform } from "./knowledgeGovernanceRegistry.ts";
import { KnowledgeGovernanceValidationPlatform } from "./knowledgeGovernanceValidation.ts";

const HERE = dirname(fileURLToPath(import.meta.url));

const DKL89_FILES = Object.freeze([
  "knowledgeGovernancePublicIndex.ts",
  "knowledgeGovernancePublicIndex.test.ts",
]);

const REQUIRED_PUBLIC_EXPORTS = Object.freeze([
  "KnowledgeGovernancePlatformPublicFoundation",
  "KnowledgeGovernancePublicApiRegistry",
  "KnowledgeGovernancePublicIndexId",
  "KnowledgeGovernancePublicIndexVersion",
  "KnowledgeGovernancePublicIndexName",
  "KnowledgeGovernancePublicIndexNamespace",
  "KnowledgeGovernancePublicReleaseStatus",
  "KnowledgeGovernancePublicCertificationStatus",
  "KnowledgeGovernancePublicFreezeStatus",
  "getKnowledgeGovernancePublicSummary",
  "getKnowledgeGovernancePublicApiCount",
  "getKnowledgeGovernancePublicReleaseMetadata",
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
  "DKL-8:1",
  "DKL-8:2",
  "DKL-8:3",
  "DKL-8:4",
  "DKL-8:5",
  "DKL-8:6",
  "DKL-8:7",
  "DKL-8:8",
  "DKL-8:9",
] as const);

const assertUnique = (values: readonly string[], label: string): void => {
  assert.equal(new Set(values).size, values.length, `${label} must be unique`);
};

describe("DKL-8:9 Knowledge Governance Public Index", () => {
  it("creates exactly two Public Index files and twelve public exports", () => {
    assert.equal(DKL89_FILES.length, 2);
    const present = readdirSync(HERE);
    for (const file of DKL89_FILES) {
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
      KnowledgeGovernancePublicIndexId,
      "DKL-8:9/KnowledgeGovernancePublicIndex",
    );
    assert.equal(KnowledgeGovernancePublicIndexVersion, "1.0.0");
    assert.equal(
      KnowledgeGovernancePublicIndexName,
      "Knowledge Governance Public Index",
    );
    assert.equal(
      KnowledgeGovernancePublicIndexNamespace,
      "nexora.dkl.knowledge-governance.public-index",
    );
    assert.equal(KnowledgeGovernancePublicReleaseStatus, "Released");
    assert.equal(KnowledgeGovernancePublicCertificationStatus, "Certified");
    assert.equal(KnowledgeGovernancePublicFreezeStatus, "Frozen");

    const meta = KnowledgeGovernancePlatformPublicFoundation.publicIndex;
    assert.equal(meta.stabilityStatus, "Stable");
    assert.equal(meta.architectureStatus, "Complete");
    assert.equal(meta.consumerReadiness, "ReadyForConsumer");
    assert.equal(meta.nextPhaseReadiness, "ReadyForDKL9");
  });

  it("consumes Freeze as sole dependency", () => {
    const deps =
      KnowledgeGovernancePlatformPublicFoundation.dependencyDeclarations;
    assert.equal(
      deps.directPreviousPhaseModule,
      "knowledgeGovernanceFreeze.ts",
    );
    assert.equal(deps.freezeOnly, true);
    assert.equal(deps.certificationDirectImport, false);
    assert.equal(deps.platformDirectImport, false);
    assert.equal(deps.manifestDirectImport, false);
    assert.equal(deps.validationDirectImport, false);
    assert.equal(deps.modelDirectImport, false);
    assert.equal(deps.registryDirectImport, false);
    assert.equal(deps.foundationDirectImport, false);
    assert.equal(deps.dkl7DirectImport, false);
    assert.equal(deps.dkl9DirectImport, false);
  });

  it("publishes a nine-section namespace with exact order and reference equality", () => {
    const ns = KnowledgeGovernancePlatformPublicFoundation;
    const keys = Object.keys(ns);
    assert.deepEqual(keys.slice(0, 9), [...NAMESPACE_SECTIONS]);
    assert.equal(NAMESPACE_SECTIONS.length, 9);

    assert.equal(ns.freeze, KnowledgeGovernanceFreezePlatform);
    assert.equal(
      ns.certification,
      KnowledgeGovernanceFreezePlatform.certification,
    );
    assert.equal(ns.platform, KnowledgeGovernanceFreezePlatform.platform);
    assert.equal(ns.manifest, KnowledgeGovernanceFreezePlatform.manifest);
    assert.equal(ns.validation, KnowledgeGovernanceFreezePlatform.validation);
    assert.equal(ns.model, KnowledgeGovernanceFreezePlatform.model);
    assert.equal(ns.registry, KnowledgeGovernanceFreezePlatform.registry);
    assert.equal(ns.foundation, KnowledgeGovernanceFreezePlatform.foundation);

    assert.equal(ns.freeze, KnowledgeGovernanceFreezePlatform);
    assert.equal(ns.certification, KnowledgeGovernanceCertificationPlatform);
    assert.equal(ns.platform, KnowledgeGovernancePlatform);
    assert.equal(ns.manifest, KnowledgeGovernanceManifestPlatform);
    assert.equal(ns.validation, KnowledgeGovernanceValidationPlatform);
    assert.equal(ns.model, KnowledgeGovernanceModelPlatform);
    assert.equal(ns.registry, KnowledgeGovernanceRegistryPlatform);
    assert.equal(ns.foundation, KnowledgeGovernanceFoundationPlatform);

    assert.equal(
      ns.publicIndex.publicIndexId,
      KnowledgeGovernancePublicIndexId,
    );
    assert.equal(Object.isFrozen(ns), true);
    assert.equal(Object.isFrozen(ns.publicIndex), true);
  });

  it("satisfies Canonical Inventory Rule through Freeze-derived counts", () => {
    const summary = getKnowledgeGovernancePublicSummary();
    const freeze = KnowledgeGovernanceFreezePlatform;
    const upstream = freeze.inventory.upstreamCertificationInventory;

    assert.equal(summary.registryEntryCount, upstream.registryEntryCount);
    assert.equal(summary.modelKindCount, upstream.modelKindCount);
    assert.equal(
      summary.relationshipKindCount,
      upstream.relationshipKindCount,
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
    const ns = KnowledgeGovernancePlatformPublicFoundation;
    assert.equal(
      ns.foundation.apiRegistry,
      KnowledgeGovernanceFoundationPlatform.apiRegistry,
    );
    assert.equal(
      ns.registry.apiRegistry,
      KnowledgeGovernanceRegistryPlatform.apiRegistry,
    );
    assert.equal(
      ns.model.apiRegistry,
      KnowledgeGovernanceModelPlatform.apiRegistry,
    );
    assert.equal(
      ns.validation.apiRegistry,
      KnowledgeGovernanceValidationPlatform.apiRegistry,
    );
    assert.equal(
      ns.manifest.apiRegistry,
      KnowledgeGovernanceManifestPlatform.apiRegistry,
    );
    assert.equal(
      ns.manifest.apiRegistry,
      KnowledgeGovernanceManifestPlatform.publicApi,
    );
    assert.equal(
      ns.platform.apiRegistry,
      KnowledgeGovernancePlatform.apiRegistry,
    );
    assert.equal(
      ns.certification.apiRegistry,
      KnowledgeGovernanceCertificationPlatform.apiRegistry,
    );
    assert.equal(
      ns.freeze.apiRegistry,
      KnowledgeGovernanceFreezePlatform.apiRegistry,
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
      KnowledgeGovernanceFoundationPlatform.apiRegistry.length +
      KnowledgeGovernanceRegistryPlatform.apiRegistry.length +
      KnowledgeGovernanceModelPlatform.apiRegistry.length +
      KnowledgeGovernanceValidationPlatform.apiRegistry.length +
      KnowledgeGovernanceManifestPlatform.apiRegistry.length +
      KnowledgeGovernancePlatform.apiRegistry.length +
      KnowledgeGovernanceCertificationPlatform.apiRegistry.length +
      KnowledgeGovernanceFreezePlatform.apiRegistry.length +
      REQUIRED_PUBLIC_EXPORTS.length;

    assert.equal(KnowledgeGovernancePublicApiRegistry.length, expectedCount);
    assert.equal(expectedCount, 76);
    assert.equal(getKnowledgeGovernancePublicApiCount(), expectedCount);
    assert.equal(Object.isFrozen(KnowledgeGovernancePublicApiRegistry), true);
    assertUnique(
      KnowledgeGovernancePublicApiRegistry.map((item) => item.id),
      "API IDs",
    );
    assertUnique(
      KnowledgeGovernancePublicApiRegistry.map(
        (item) => `${item.phase}:${item.exportName}`,
      ),
      "phase export pairs",
    );

    for (const item of KnowledgeGovernancePublicApiRegistry) {
      assert.ok((PHASE_ORDER as readonly string[]).includes(item.phase));
      assert.equal(item.status, "Released");
      assert.equal(item.certificationStatus, "Certified");
      assert.equal(item.freezeStatus, "Frozen");
      assert.equal(item.stability, "Stable");
      assert.equal(item.public, true);
    }

    const byPhase = new Map<string, number>();
    for (const item of KnowledgeGovernancePublicApiRegistry) {
      byPhase.set(item.phase, (byPhase.get(item.phase) ?? 0) + 1);
    }
    for (const phase of PHASE_ORDER.slice(0, 8)) {
      assert.equal(byPhase.get(phase), 8, `${phase} must expose 8 APIs`);
    }
    assert.equal(byPhase.get("DKL-8:9"), 12);

    assert.deepEqual(
      KnowledgeGovernancePublicApiRegistry.filter(
        (item) => item.phase === "DKL-8:9",
      ).map((item) => item.exportName),
      [...REQUIRED_PUBLIC_EXPORTS],
    );
  });

  it("returns deterministic summary and release metadata", () => {
    const summaryA = getKnowledgeGovernancePublicSummary();
    const summaryB = getKnowledgeGovernancePublicSummary();
    assert.deepEqual(summaryA, summaryB);
    assert.equal(Object.isFrozen(summaryA), true);
    assert.equal(summaryA.releaseStatus, "Released");
    assert.equal(summaryA.certificationStatus, "Certified");
    assert.equal(summaryA.freezeStatus, "Frozen");
    assert.equal(summaryA.consumerReadiness, "ReadyForConsumer");
    assert.equal(summaryA.nextPhaseReadiness, "ReadyForDKL9");
    assert.equal(summaryA.publicApiRegistryCount, 76);
    assert.equal(summaryA.dkl89ExportCount, 12);
    assert.equal(summaryA.publicNamespaceSectionCount, 9);

    const metaA = getKnowledgeGovernancePublicReleaseMetadata();
    const metaB = getKnowledgeGovernancePublicReleaseMetadata();
    assert.deepEqual(metaA, metaB);
    assert.equal(Object.isFrozen(metaA), true);
    assert.equal(metaA.releaseStatus, "Released");
    assert.equal(metaA.certificationStatus, "Certified");
    assert.equal(metaA.freezeStatus, "Frozen");
    assert.equal(metaA.stabilityStatus, "Stable");
    assert.equal(metaA.consumerReadiness, "ReadyForConsumer");
    assert.equal(metaA.nextPhaseReadiness, "ReadyForDKL9");
    assert.equal(metaA.publicApiCount, 76);
    assert.equal(
      metaA.canonicalEntryPoint,
      "knowledgeGovernancePublicIndex.ts",
    );
  });

  it("is immutable and ready for DKL-9", () => {
    assert.equal(Object.isFrozen(KnowledgeGovernancePublicApiRegistry), true);
    assert.equal(
      Object.isFrozen(KnowledgeGovernancePlatformPublicFoundation),
      true,
    );
    assert.equal(
      Object.isFrozen(
        KnowledgeGovernancePlatformPublicFoundation.publicIndex,
      ),
      true,
    );
    assert.equal(
      KnowledgeGovernancePlatformPublicFoundation.publicIndex
        .nextPhaseReadiness,
      "ReadyForDKL9",
    );
    assert.equal(
      getKnowledgeGovernancePublicReleaseMetadata().nextPhaseReadiness,
      "ReadyForDKL9",
    );
  });
});
