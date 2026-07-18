/**
 * DKL-7:9 — Knowledge Services Public Index Tests.
 *
 * Deterministic coverage for the sole DKL-7 public release surface.
 * No mocks. No randomness. No network. No databases. No source inspection.
 */

import assert from "node:assert/strict";
import { readdirSync } from "node:fs";
import { dirname } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import {
  KnowledgeServicesCertification,
  KnowledgeServicesCertificationId,
} from "./knowledgeServicesCertification.ts";
import { KnowledgeServicesFoundation } from "./knowledgeServicesFoundation.ts";
import {
  KnowledgeServicesFreeze,
  KnowledgeServicesFreezeId,
  KnowledgeServicesFreezeLock,
} from "./knowledgeServicesFreeze.ts";
import { KnowledgeServicesManifest } from "./knowledgeServicesManifest.ts";
import { KnowledgeServicesModel } from "./knowledgeServicesModel.ts";
import { KnowledgeServicesPlatform } from "./knowledgeServicesPlatform.ts";
import * as PublicIndexModule from "./knowledgeServicesPublicIndex.ts";
import {
  getKnowledgeServicesPublicApiCount,
  getKnowledgeServicesPublicReleaseMetadata,
  getKnowledgeServicesPublicSummary,
  KnowledgeServicesPlatformPublicFoundation,
  KnowledgeServicesPublicApiRegistry,
  KnowledgeServicesPublicCertificationStatus,
  KnowledgeServicesPublicFreezeStatus,
  KnowledgeServicesPublicIndexId,
  KnowledgeServicesPublicIndexName,
  KnowledgeServicesPublicIndexNamespace,
  KnowledgeServicesPublicIndexVersion,
  KnowledgeServicesPublicReleaseStatus,
} from "./knowledgeServicesPublicIndex.ts";
import { KnowledgeServicesRegistry } from "./knowledgeServicesRegistry.ts";
import { KnowledgeServicesValidation } from "./knowledgeServicesValidation.ts";

const HERE = dirname(fileURLToPath(import.meta.url));

const DKL79_FILES = Object.freeze([
  "knowledgeServicesPublicIndex.ts",
  "knowledgeServicesPublicIndex.test.ts",
]);

const REQUIRED_PUBLIC_EXPORTS = Object.freeze([
  "KnowledgeServicesPlatformPublicFoundation",
  "KnowledgeServicesPublicApiRegistry",
  "KnowledgeServicesPublicIndexId",
  "KnowledgeServicesPublicIndexVersion",
  "KnowledgeServicesPublicIndexName",
  "KnowledgeServicesPublicIndexNamespace",
  "KnowledgeServicesPublicReleaseStatus",
  "KnowledgeServicesPublicCertificationStatus",
  "KnowledgeServicesPublicFreezeStatus",
  "getKnowledgeServicesPublicSummary",
  "getKnowledgeServicesPublicApiCount",
  "getKnowledgeServicesPublicReleaseMetadata",
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
  "DKL-7:1",
  "DKL-7:2",
  "DKL-7:3",
  "DKL-7:4",
  "DKL-7:5",
  "DKL-7:6",
  "DKL-7:7",
  "DKL-7:8",
  "DKL-7:9",
] as const);

const assertUnique = (values: readonly string[], label: string): void => {
  assert.equal(new Set(values).size, values.length, `${label} must be unique`);
};

describe("DKL-7:9 Knowledge Services Public Index", () => {
  it("creates exactly two Public Index files and twelve public exports", () => {
    assert.equal(DKL79_FILES.length, 2);
    const present = readdirSync(HERE);
    for (const file of DKL79_FILES) {
      assert.ok(present.includes(file), `missing ${file}`);
    }
    assert.deepEqual(
      Object.keys(PublicIndexModule).sort(),
      [...REQUIRED_PUBLIC_EXPORTS].sort(),
    );
    assert.equal(Object.keys(PublicIndexModule).length, 12);
  });

  it("consumes Freeze only via canonical dependency metadata", () => {
    const deps =
      KnowledgeServicesPlatformPublicFoundation.dependencyDeclarations;
    assert.equal(deps.directPreviousPhaseModule, "knowledgeServicesFreeze.ts");
    assert.equal(deps.freezeOnly, true);
    assert.equal(deps.certificationDirectImport, false);
    assert.equal(deps.platformDirectImport, false);
    assert.equal(deps.manifestDirectImport, false);
    assert.equal(deps.validationDirectImport, false);
    assert.equal(deps.modelDirectImport, false);
    assert.equal(deps.registryDirectImport, false);
    assert.equal(deps.foundationDirectImport, false);
    assert.equal(deps.dkl6DirectImport, false);
  });

  it("has exact identity and Released/Certified/Frozen/Stable metadata", () => {
    assert.equal(
      KnowledgeServicesPublicIndexId,
      "DKL-7:9/KnowledgeServicesPublicIndex",
    );
    assert.equal(KnowledgeServicesPublicIndexVersion, "1.0.0");
    assert.equal(
      KnowledgeServicesPublicIndexName,
      "Knowledge Services Public Index",
    );
    assert.equal(
      KnowledgeServicesPublicIndexNamespace,
      "nexora.dkl.knowledge-services",
    );
    assert.equal(KnowledgeServicesPublicReleaseStatus, "Released");
    assert.equal(KnowledgeServicesPublicCertificationStatus, "Certified");
    assert.equal(KnowledgeServicesPublicFreezeStatus, "Frozen");

    const meta = KnowledgeServicesPlatformPublicFoundation.publicIndex;
    assert.equal(meta.stabilityStatus, "Stable");
    assert.equal(meta.architectureStatus, "Complete");
    assert.equal(meta.consumerReadiness, "ReadyForConsumer");
    assert.equal(meta.nextPhaseReadiness, "ReadyForDKL8");
    assert.equal(meta.releaseGuarantees.length, 18);
    assertUnique(
      meta.releaseGuarantees.map((item) => item.guaranteeId),
      "guarantee IDs",
    );
  });

  it("publishes a nine-section namespace with exact order and reference equality", () => {
    const ns = KnowledgeServicesPlatformPublicFoundation;
    const keys = Object.keys(ns);
    assert.deepEqual(keys.slice(0, 9), [...NAMESPACE_SECTIONS]);
    assert.equal(NAMESPACE_SECTIONS.length, 9);

    assert.equal(ns.freeze, KnowledgeServicesFreeze);
    assert.equal(ns.certification, KnowledgeServicesFreeze.certification);
    assert.equal(
      ns.platform,
      KnowledgeServicesFreeze.certification.platform,
    );
    assert.equal(
      ns.manifest,
      KnowledgeServicesFreeze.certification.platform.manifest,
    );
    assert.equal(
      ns.validation,
      KnowledgeServicesFreeze.certification.platform.manifest.validation,
    );
    assert.equal(
      ns.model,
      KnowledgeServicesFreeze.certification.platform.manifest.validation.model,
    );
    assert.equal(
      ns.registry,
      KnowledgeServicesFreeze.certification.platform.manifest.validation.model
        .registry,
    );
    assert.equal(
      ns.foundation,
      KnowledgeServicesFreeze.certification.platform.manifest.validation.model
        .registry.foundation,
    );

    assert.equal(ns.freeze, KnowledgeServicesFreeze);
    assert.equal(ns.certification, KnowledgeServicesCertification);
    assert.equal(ns.platform, KnowledgeServicesPlatform);
    assert.equal(ns.manifest, KnowledgeServicesManifest);
    assert.equal(ns.validation, KnowledgeServicesValidation);
    assert.equal(ns.model, KnowledgeServicesModel);
    assert.equal(ns.registry, KnowledgeServicesRegistry);
    assert.equal(ns.foundation, KnowledgeServicesFoundation);

    assert.equal(ns.publicIndex.publicIndexId, KnowledgeServicesPublicIndexId);
    assert.equal(Object.isFrozen(ns), true);
    assert.equal(Object.isFrozen(ns.publicIndex), true);
    assert.equal(Object.isFrozen(ns.publicIndex.releaseGuarantees), true);
  });

  it("preserves frozen inventories and architecture through Freeze", () => {
    const ns = KnowledgeServicesPlatformPublicFoundation;
    const { freeze: frozen, platform, manifest, certification } = ns;

    assert.equal(frozen.status, "Frozen");
    assert.equal(frozen.freezeLock, KnowledgeServicesFreezeLock);
    assert.equal(frozen.freezeLock, "DKL-7-KNOWLEDGE-SERVICES-LOCKED");
    assert.equal(frozen.components.length, 8);
    assert.ok(
      frozen.components.every(
        (item) =>
          item.certifiedStatus === "Certified" &&
          item.freezeStatus === "Frozen" &&
          item.protectionStatus === "Protected",
      ),
    );
    assert.equal(frozen.baselines.length, 18);
    assert.ok(
      frozen.baselines.every((item) => item.status === "FrozenAndMatched"),
    );
    assert.equal(frozen.locks.length, 12);
    assert.ok(frozen.locks.every((item) => item.lockStatus === "Locked"));
    assert.equal(frozen.compatibility.length, 18);
    assert.ok(
      frozen.compatibility.every(
        (item) =>
          item.status === "Compatible" && item.freezeStatus === "Frozen",
      ),
    );
    assert.equal(frozen.extensions.length, 8);
    assert.equal(frozen.inventory.totalEntryCount, 121);
    assert.equal(certification.inventory.totalEntryCount, 137);
    assert.equal(platform.inventory.totalEntryCount, 527);
    assert.equal(manifest.inventory.totalEntryCount, 447);
    assert.equal(platform.model.totalInventoryCount, 79);
    assert.equal(platform.validation.passCount, 48);
    assert.equal(platform.validation.failCount, 0);
    assert.equal(platform.inventory.mutationModeCount, 0);
    assert.equal(platform.services.length, 12);
    assert.equal(platform.capabilities.length, 12);
    assert.equal(platform.contracts.length, 11);
  });

  it("registers all approved APIs once with Released/Certified/Frozen/Stable metadata", () => {
    assert.equal(Object.isFrozen(KnowledgeServicesPublicApiRegistry), true);
    assertUnique(
      KnowledgeServicesPublicApiRegistry.map((item) => item.apiId),
      "API IDs",
    );

    const byPhase = new Map<string, string[]>();
    for (const item of KnowledgeServicesPublicApiRegistry) {
      const list = byPhase.get(item.sourcePhase) ?? [];
      list.push(item.exportName);
      byPhase.set(item.sourcePhase, list);

      assert.ok((PHASE_ORDER as readonly string[]).includes(item.sourcePhase));
      assert.ok(item.sourceStage.length > 0);
      assert.equal(item.releaseStatus, "Released");
      assert.equal(item.certificationStatus, "Certified");
      assert.equal(item.freezeStatus, "Frozen");
      assert.equal(item.stabilityStatus, "Stable");
      assert.equal(item.directImportPolicy, "PublicIndexOnly");
      assert.equal(item.executableKnowledgeService, false);
      assert.ok(
        item.runtimeBehaviorClassification === "ImmutableMetadata" ||
          item.runtimeBehaviorClassification === "DeterministicMetadataHelper",
      );
    }

    for (const [phase, names] of byPhase) {
      assertUnique(names, `${phase} export names`);
    }

    const phaseSequence = KnowledgeServicesPublicApiRegistry.map(
      (item) => item.sourcePhase,
    );
    let lastIndex = -1;
    for (const phase of PHASE_ORDER) {
      const first = phaseSequence.indexOf(phase);
      assert.ok(first >= 0, `missing phase ${phase}`);
      assert.ok(first >= lastIndex, `phase order broken at ${phase}`);
      lastIndex = first;
    }

    assert.equal(byPhase.get("DKL-7:1")?.length, 7);
    assert.equal(byPhase.get("DKL-7:2")?.length, 10);
    assert.equal(byPhase.get("DKL-7:3")?.length, 13);
    assert.equal(byPhase.get("DKL-7:4")?.length, 12);
    assert.equal(byPhase.get("DKL-7:5")?.length, 12);
    assert.equal(byPhase.get("DKL-7:6")?.length, 12);
    assert.equal(byPhase.get("DKL-7:7")?.length, 12);
    assert.equal(byPhase.get("DKL-7:8")?.length, 12);
    assert.equal(byPhase.get("DKL-7:9")?.length, 12);
    assert.deepEqual(byPhase.get("DKL-7:9"), [...REQUIRED_PUBLIC_EXPORTS]);

    assert.equal(
      getKnowledgeServicesPublicApiCount(),
      KnowledgeServicesPublicApiRegistry.length,
    );
    assert.equal(KnowledgeServicesPublicApiRegistry.length, 102);
  });

  it("exposes deterministic frozen helpers and consumer policy", () => {
    const summaryA = getKnowledgeServicesPublicSummary();
    const summaryB = getKnowledgeServicesPublicSummary();
    assert.deepEqual(summaryA, summaryB);
    assert.equal(Object.isFrozen(summaryA), true);
    assert.equal(summaryA.publicIndexId, KnowledgeServicesPublicIndexId);
    assert.equal(summaryA.releaseStatus, "Released");
    assert.equal(summaryA.freezeId, KnowledgeServicesFreezeId);
    assert.equal(summaryA.certificationId, KnowledgeServicesCertificationId);
    assert.equal(summaryA.phaseCount, 9);
    assert.equal(summaryA.completedPhaseCount, 9);
    assert.equal(summaryA.publicNamespaceSectionCount, 9);
    assert.equal(
      summaryA.publicApiRegistryCount,
      KnowledgeServicesPublicApiRegistry.length,
    );
    assert.equal(summaryA.dkl79ExportCount, 12);
    assert.equal(summaryA.manifestInventoryCount, 447);
    assert.equal(summaryA.platformInventoryCount, 527);
    assert.equal(summaryA.certificationInventoryCount, 137);
    assert.equal(summaryA.freezeInventoryCount, 121);
    assert.equal(summaryA.modelInventoryCount, 79);
    assert.equal(summaryA.validationPassCount, 48);
    assert.equal(summaryA.validationFailCount, 0);
    assert.equal(summaryA.mutationModeCount, 0);
    assert.equal(
      summaryA.runtimeServiceStatus,
      "NotImplementedByPublicIndex",
    );
    assert.equal(summaryA.releaseGuaranteeCount, 18);
    assert.equal(summaryA.consumerReadiness, "ReadyForConsumer");
    assert.equal(summaryA.nextPhaseReadiness, "ReadyForDKL8");

    const releaseA = getKnowledgeServicesPublicReleaseMetadata();
    const releaseB = getKnowledgeServicesPublicReleaseMetadata();
    assert.deepEqual(releaseA, releaseB);
    assert.equal(Object.isFrozen(releaseA), true);
    assert.equal(releaseA.canonicalEntryPoint, "knowledgeServicesPublicIndex.ts");
    assert.equal(releaseA.directImportPolicy, "PublicIndexOnly");
    assert.equal(releaseA.publicApiCount, KnowledgeServicesPublicApiRegistry.length);
    assert.equal(releaseA.guaranteeCount, 18);
    assert.equal(
      releaseA.runtimeServiceStatus,
      "NotImplementedByPublicIndex",
    );

    const policy =
      KnowledgeServicesPlatformPublicFoundation.consumerImportPolicy;
    assert.equal(
      policy.soleSupportedEntryPoint,
      "knowledgeServicesPublicIndex.ts",
    );
    assert.equal(policy.directImportPolicy, "PublicIndexOnly");
    assert.equal(policy.runtimeServiceOperational, false);
  });

  it("is immutable and free of prohibited runtime behavior", () => {
    const ns = KnowledgeServicesPlatformPublicFoundation;
    assert.equal(ns.runtimeBehavior, false);
    assert.equal(ns.serviceExecution, false);
    assert.equal(ns.repositoryAccess, false);
    assert.equal(ns.searchExecution, false);
    assert.equal(ns.graphTraversal, false);
    assert.equal(ns.aiBehavior, false);
    assert.equal(ns.transportBehavior, false);
    assert.equal(ns.authenticationBehavior, false);
    assert.equal(ns.authorizationBehavior, false);
    assert.equal(ns.mutationBehavior, false);
    assert.equal(Object.isFrozen(KnowledgeServicesPublicApiRegistry), true);
    assert.ok(
      !Object.keys(PublicIndexModule).some((name) =>
        /handler|executor|client|adapter|router|mutex/i.test(name),
      ),
    );
  });
});
