/**
 * DKL-6:9 — Knowledge Repository Public Index Tests.
 *
 * Deterministic coverage for the immutable Knowledge Repository Public Index.
 * No mocks. No randomness. No network. No filesystem IO for API discovery.
 * No source scanning. No module reflection.
 */

import assert from "node:assert/strict";
import { readdirSync } from "node:fs";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, it } from "node:test";
import * as PublicIndexModule from "./knowledgeRepositoryPublicIndex.ts";
import {
  getKnowledgeRepositoryPublicApiCount,
  getKnowledgeRepositoryPublicReleaseMetadata,
  getKnowledgeRepositoryPublicSummary,
  KnowledgeRepositoryPlatformPublicFoundation,
  KnowledgeRepositoryPublicApiRegistry,
  KnowledgeRepositoryPublicCertificationStatus,
  KnowledgeRepositoryPublicFreezeStatus,
  KnowledgeRepositoryPublicIndexId,
  KnowledgeRepositoryPublicIndexName,
  KnowledgeRepositoryPublicIndexNamespace,
  KnowledgeRepositoryPublicIndexVersion,
  KnowledgeRepositoryPublicReleaseStatus,
} from "./knowledgeRepositoryPublicIndex.ts";
import {
  KnowledgeRepositoryFreeze,
  KnowledgeRepositoryFreezeId,
} from "./knowledgeRepositoryFreeze.ts";

const REQUIRED_PUBLIC_EXPORTS = Object.freeze([
  "KnowledgeRepositoryPlatformPublicFoundation",
  "KnowledgeRepositoryPublicApiRegistry",
  "KnowledgeRepositoryPublicIndexId",
  "KnowledgeRepositoryPublicIndexVersion",
  "KnowledgeRepositoryPublicIndexName",
  "KnowledgeRepositoryPublicIndexNamespace",
  "KnowledgeRepositoryPublicReleaseStatus",
  "KnowledgeRepositoryPublicCertificationStatus",
  "KnowledgeRepositoryPublicFreezeStatus",
  "getKnowledgeRepositoryPublicSummary",
  "getKnowledgeRepositoryPublicApiCount",
  "getKnowledgeRepositoryPublicReleaseMetadata",
] as const);

const SECTION_ORDER = Object.freeze([
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

const PHASE_API_COUNTS = Object.freeze([6, 8, 8, 8, 8, 8, 8, 8, 12] as const);

const GUARANTEE_NAMES = Object.freeze([
  "CanonicalPublicIdentity",
  "SolePublicEntryPoint",
  "CanonicalNamespaceComposition",
  "FrozenReferencePreservation",
  "CertifiedRelease",
  "StableAndFrozenRelease",
  "PublicApiCompleteness",
  "PublicApiUniqueness",
  "BackwardCompatibility",
  "AdditiveExtensionsOnly",
  "RuntimeProhibition",
  "ReadyForConsumer",
  "ReadyForDKL7",
] as const);

function assertDeepFrozen(value: unknown, path = "root"): void {
  if (value === null || typeof value !== "object") {
    return;
  }
  assert.ok(Object.isFrozen(value), `${path} must be frozen`);
  for (const [key, child] of Object.entries(value)) {
    assertDeepFrozen(child, `${path}.${key}`);
  }
}

describe("DKL-6:9 Knowledge Repository Public Index", () => {
  it("creates exactly two Public Index files", () => {
    const dir = dirname(fileURLToPath(import.meta.url));
    const files = readdirSync(dir).filter((name) =>
      /^knowledgeRepositoryPublicIndex(\.test)?\.ts$/.test(name),
    );
    assert.deepEqual(files.sort(), [
      "knowledgeRepositoryPublicIndex.test.ts",
      "knowledgeRepositoryPublicIndex.ts",
    ]);
  });

  it("exposes exactly twelve public exports", () => {
    assert.deepEqual(
      Object.keys(PublicIndexModule).sort(),
      [...REQUIRED_PUBLIC_EXPORTS].sort(),
    );
    assert.equal(Object.keys(PublicIndexModule).length, 12);
  });

  it("has canonical Public Index identity", () => {
    assert.equal(
      KnowledgeRepositoryPublicIndexId,
      "DKL-6:9/KnowledgeRepositoryPublicIndex",
    );
    assert.equal(
      KnowledgeRepositoryPlatformPublicFoundation.publicIndex.id,
      KnowledgeRepositoryPublicIndexId,
    );
  });

  it("has version 1.0.0", () => {
    assert.equal(KnowledgeRepositoryPublicIndexVersion, "1.0.0");
    assert.equal(
      KnowledgeRepositoryPlatformPublicFoundation.publicIndex.version,
      "1.0.0",
    );
  });

  it("has correct name", () => {
    assert.equal(
      KnowledgeRepositoryPublicIndexName,
      "Knowledge Repository Public Index",
    );
    assert.equal(
      KnowledgeRepositoryPlatformPublicFoundation.publicIndex.name,
      "Knowledge Repository Public Index",
    );
  });

  it("has correct namespace", () => {
    assert.equal(
      KnowledgeRepositoryPublicIndexNamespace,
      "nexora.dkl.repository.public",
    );
    assert.equal(
      KnowledgeRepositoryPlatformPublicFoundation.publicIndex.namespace,
      "nexora.dkl.repository.public",
    );
  });

  it("has Released release status", () => {
    assert.equal(KnowledgeRepositoryPublicReleaseStatus, "Released");
    assert.equal(
      KnowledgeRepositoryPlatformPublicFoundation.publicIndex.releaseStatus,
      "Released",
    );
  });

  it("has Certified certification status", () => {
    assert.equal(KnowledgeRepositoryPublicCertificationStatus, "Certified");
    assert.equal(
      KnowledgeRepositoryPlatformPublicFoundation.publicIndex
        .certificationStatus,
      "Certified",
    );
  });

  it("has Frozen freeze status", () => {
    assert.equal(KnowledgeRepositoryPublicFreezeStatus, "Frozen");
    assert.equal(
      KnowledgeRepositoryPlatformPublicFoundation.publicIndex.freezeStatus,
      "Frozen",
    );
  });

  it("has StableAndFrozen stability", () => {
    assert.equal(
      KnowledgeRepositoryPlatformPublicFoundation.publicIndex.stability,
      "StableAndFrozen",
    );
  });

  it("has ReadyForConsumer consumer readiness", () => {
    assert.equal(
      KnowledgeRepositoryPlatformPublicFoundation.publicIndex.consumerReadiness,
      "ReadyForConsumer",
    );
  });

  it("has ReadyForDKL7 next-phase readiness", () => {
    assert.equal(
      KnowledgeRepositoryPlatformPublicFoundation.publicIndex.nextPhaseReadiness,
      "ReadyForDKL7",
    );
  });

  it("declares sole entry point knowledgeRepositoryPublicIndex.ts", () => {
    assert.equal(
      KnowledgeRepositoryPlatformPublicFoundation.publicIndex.soleEntryPoint,
      "knowledgeRepositoryPublicIndex.ts",
    );
  });

  it("declares exactly nine ordered namespace sections", () => {
    assert.deepEqual(
      Object.keys(KnowledgeRepositoryPlatformPublicFoundation),
      [...SECTION_ORDER],
    );
    assert.equal(
      Object.keys(KnowledgeRepositoryPlatformPublicFoundation).length,
      9,
    );
  });

  it("preserves canonical references through Freeze", () => {
    const ns = KnowledgeRepositoryPlatformPublicFoundation;
    const platform = KnowledgeRepositoryFreeze.certification.platform;
    assert.equal(ns.foundation, platform.foundation);
    assert.equal(ns.registry, platform.registry);
    assert.equal(ns.model, platform.model);
    assert.equal(ns.validation, platform.validation);
    assert.equal(ns.manifest, platform.manifest);
    assert.equal(ns.platform, platform);
    assert.equal(ns.certification, KnowledgeRepositoryFreeze.certification);
    assert.equal(ns.freeze, KnowledgeRepositoryFreeze);
  });

  it("exposes correct Public Index section metadata", () => {
    const section = KnowledgeRepositoryPlatformPublicFoundation.publicIndex;
    assert.equal(section.releaseStatus, "Released");
    assert.equal(section.certificationStatus, "Certified");
    assert.equal(section.freezeStatus, "Frozen");
    assert.equal(section.stability, "StableAndFrozen");
    assert.equal(section.consumerReadiness, "ReadyForConsumer");
    assert.equal(section.nextPhaseReadiness, "ReadyForDKL7");
    assert.equal(section.soleEntryPoint, "knowledgeRepositoryPublicIndex.ts");
    assert.equal(section.runtimeBehavior, "None");
  });

  it("accepts Freeze as Frozen with DKL-6-LOCKED baseline", () => {
    const acceptance =
      KnowledgeRepositoryPlatformPublicFoundation.publicIndex.freezeAcceptance;
    assert.equal(acceptance.freezeStatus, "Frozen");
    assert.equal(acceptance.certificationStatus, "Certified");
    assert.equal(acceptance.baseline, "DKL-6-LOCKED");
    assert.equal(acceptance.stability, "StableAndFrozen");
    assert.equal(acceptance.freezeReadiness, "ReadyForDKL6PublicIndex");
    assert.equal(acceptance.freezeIdentity, KnowledgeRepositoryFreezeId);
    assert.equal(KnowledgeRepositoryFreeze.result.status, "Frozen");
    assert.equal(KnowledgeRepositoryFreeze.result.baseline, "DKL-6-LOCKED");
    assert.equal(
      KnowledgeRepositoryFreeze.result.stability,
      "StableAndFrozen",
    );
  });

  it("preserves Freeze lock, guarantee, and gate inventories", () => {
    const acceptance =
      KnowledgeRepositoryPlatformPublicFoundation.publicIndex.freezeAcceptance;
    assert.equal(acceptance.frozenComponents, 8);
    assert.equal(acceptance.compatibilityLocks, 14);
    assert.equal(acceptance.dependencyLocks, 21);
    assert.equal(acceptance.coreLocks, 12);
    assert.equal(acceptance.extensionLocks, 8);
    assert.equal(acceptance.boundaryLocks, 18);
    assert.equal(acceptance.regressionLocks, 14);
    assert.equal(acceptance.guarantees, 22);
    assert.equal(acceptance.freezeGates, 16);
    assert.equal(acceptance.passedFreezeGates, 16);
    assert.equal(acceptance.failedFreezeGates, 0);
    assert.equal(acceptance.frozenPublicApisThroughDKL68, 62);
    assert.equal(acceptance.unlockedLocks, 0);
    assert.equal(acceptance.blockingIssues, 0);
    assert.equal(KnowledgeRepositoryFreeze.frozenComponents.length, 8);
    assert.equal(KnowledgeRepositoryFreeze.compatibilityLocks.length, 14);
    assert.equal(KnowledgeRepositoryFreeze.dependencyLocks.length, 21);
    assert.equal(KnowledgeRepositoryFreeze.coreLocks.length, 12);
    assert.equal(KnowledgeRepositoryFreeze.extensionLocks.length, 8);
    assert.equal(KnowledgeRepositoryFreeze.boundaryLocks.length, 18);
    assert.equal(KnowledgeRepositoryFreeze.regressionLocks.length, 14);
    assert.equal(KnowledgeRepositoryFreeze.guarantees.length, 22);
    assert.equal(KnowledgeRepositoryFreeze.gates.length, 16);
    assert.ok(
      KnowledgeRepositoryFreeze.gates.every((gate) => gate.status === "Pass"),
    );
    assert.equal(KnowledgeRepositoryFreeze.result.unlockedCount, 0);
    assert.equal(KnowledgeRepositoryFreeze.result.blockingIssueCount, 0);
  });

  it("registers phase API counts 6,8,8,8,8,8,8,8,12 totaling 74", () => {
    const counts = Object.values(
      KnowledgeRepositoryPublicApiRegistry.phaseCounts,
    );
    assert.deepEqual(counts, [...PHASE_API_COUNTS]);
    assert.equal(KnowledgeRepositoryPublicApiRegistry.entries.length, 74);
    assert.equal(KnowledgeRepositoryPublicApiRegistry.entryCount, 74);
    assert.equal(getKnowledgeRepositoryPublicApiCount(), 74);
  });

  it("ensures Public API IDs and export names are unique", () => {
    const entries = KnowledgeRepositoryPublicApiRegistry.entries;
    const ids = entries.map((entry) => entry.id);
    const names = entries.map((entry) => entry.exportName);
    assert.equal(new Set(ids).size, ids.length);
    assert.equal(new Set(names).size, names.length);
    const byPhase = new Map<string, string[]>();
    for (const entry of entries) {
      const list = byPhase.get(entry.phase) ?? [];
      list.push(entry.exportName);
      byPhase.set(entry.phase, list);
    }
    for (const [phase, exportNames] of byPhase) {
      assert.equal(
        new Set(exportNames).size,
        exportNames.length,
        `duplicate export names in ${phase}`,
      );
    }
  });

  it("marks every Public API entry Released, StableAndFrozen, DKL-6, public, None", () => {
    for (const entry of KnowledgeRepositoryPublicApiRegistry.entries) {
      assert.equal(entry.status, "Released");
      assert.equal(entry.stability, "StableAndFrozen");
      assert.equal(entry.owner, "DKL-6");
      assert.equal(entry.public, true);
      assert.equal(entry.runtimeBehavior, "None");
      assert.ok(entry.phase.startsWith("DKL-6:"));
    }
  });

  it("returns deterministic public summary, API count, and release metadata", () => {
    const summaryA = getKnowledgeRepositoryPublicSummary();
    const summaryB = getKnowledgeRepositoryPublicSummary();
    const metadataA = getKnowledgeRepositoryPublicReleaseMetadata();
    const metadataB = getKnowledgeRepositoryPublicReleaseMetadata();
    assert.deepEqual(summaryA, summaryB);
    assert.deepEqual(metadataA, metadataB);
    assert.equal(
      getKnowledgeRepositoryPublicApiCount(),
      getKnowledgeRepositoryPublicApiCount(),
    );
    assert.equal(summaryA.publicApiCount, 74);
    assert.equal(summaryA.publicNamespaceSectionCount, 9);
    assert.equal(summaryA.releaseStatus, "Released");
    assert.equal(summaryA.certificationStatus, "Certified");
    assert.equal(summaryA.freezeStatus, "Frozen");
    assert.equal(summaryA.stability, "StableAndFrozen");
    assert.equal(summaryA.consumerReadiness, "ReadyForConsumer");
    assert.equal(summaryA.nextPhaseReadiness, "ReadyForDKL7");
    assert.equal(summaryA.soleEntryPoint, "knowledgeRepositoryPublicIndex.ts");
    assert.equal(summaryA.freezeIdentity, KnowledgeRepositoryFreezeId);
    assert.equal(summaryA.freezeBaseline, "DKL-6-LOCKED");
    assert.equal(metadataA.publicApiCount, 74);
    assert.equal(metadataA.baseline, "DKL-6-LOCKED");
    assert.equal(metadataA.runtimeBehavior, "None");
  });

  it("declares exactly thirteen Guaranteed release guarantees", () => {
    const guarantees =
      KnowledgeRepositoryPlatformPublicFoundation.publicIndex.guarantees;
    assert.equal(guarantees.length, 13);
    assert.deepEqual(
      guarantees.map((item) => item.name),
      [...GUARANTEE_NAMES],
    );
    for (const item of guarantees) {
      assert.equal(item.status, "Guaranteed");
      assert.equal(item.owner, "DKL-6");
      assert.equal(item.runtimeBehavior, "None");
    }
  });

  it("deeply freezes public namespace, registry, metadata, and summary", () => {
    assert.ok(Object.isFrozen(KnowledgeRepositoryPlatformPublicFoundation));
    assertDeepFrozen(
      KnowledgeRepositoryPlatformPublicFoundation.publicIndex,
      "publicIndex",
    );
    assert.ok(Object.isFrozen(KnowledgeRepositoryPublicApiRegistry));
    assertDeepFrozen(
      KnowledgeRepositoryPublicApiRegistry.entries,
      "registry.entries",
    );
    assertDeepFrozen(
      getKnowledgeRepositoryPublicReleaseMetadata(),
      "releaseMetadata",
    );
    assertDeepFrozen(getKnowledgeRepositoryPublicSummary(), "summary");
    for (const section of SECTION_ORDER) {
      assert.ok(
        Object.isFrozen(KnowledgeRepositoryPlatformPublicFoundation[section]),
        `${section} must be frozen`,
      );
    }
  });

  it("keeps the canonical Freeze aggregate frozen", () => {
    assert.ok(Object.isFrozen(KnowledgeRepositoryFreeze));
    assert.ok(
      Object.isFrozen(KnowledgeRepositoryPlatformPublicFoundation.freeze),
    );
    assert.equal(
      KnowledgeRepositoryPlatformPublicFoundation.freeze,
      KnowledgeRepositoryFreeze,
    );
  });

  it("introduces no persistence, storage, query, retrieval, or execution runtime", () => {
    const prohibitions = KnowledgeRepositoryFreeze.runtimeProhibitions;
    assert.equal(prohibitions.noPersistence, true);
    assert.equal(prohibitions.noDatabaseCoupling, true);
    assert.equal(prohibitions.noStorageEngineCoupling, true);
    assert.equal(prohibitions.noQueryExecution, true);
    assert.equal(prohibitions.noRetrievalExecution, true);
    assert.equal(prohibitions.noIndexExecution, true);
    assert.equal(prohibitions.noVersionExecution, true);
    assert.equal(prohibitions.noSnapshotExecution, true);
    assert.equal(prohibitions.noHistoryExecution, true);
    assert.equal(prohibitions.noArchiveExecution, true);
    assert.equal(prohibitions.noRetentionExecution, true);
    assert.equal(prohibitions.noRuntimeExecutor, true);
    assert.equal(prohibitions.noAiBehavior, true);
    assert.equal(prohibitions.noEngineReasoning, true);
    assert.equal(prohibitions.noAdvisorOrSceneBehavior, true);
    assert.equal(prohibitions.noUiBehavior, true);
    assert.equal(prohibitions.technologyNeutral, true);
    const haystack = [
      ...KnowledgeRepositoryPlatformPublicFoundation.publicIndex.guarantees.map(
        (item) => item.name,
      ),
      KnowledgeRepositoryPlatformPublicFoundation.publicIndex.soleEntryPoint,
    ]
      .join(" ")
      .toLowerCase();
    for (const token of [
      "elasticsearch",
      "postgresql",
      "neo4j",
      "mongodb",
      "dynamodb",
    ] as const) {
      assert.equal(haystack.includes(token), false, token);
    }
  });

  it("declares consumer import policy with Public Index as sole supported surface", () => {
    const policy =
      KnowledgeRepositoryPlatformPublicFoundation.publicIndex.importPolicy;
    assert.equal(policy.supportedImport, "knowledgeRepositoryPublicIndex.ts");
    assert.equal(
      policy.soleSupportedEntryPoint,
      "knowledgeRepositoryPublicIndex.ts",
    );
    assert.ok(
      policy.unsupportedConsumerImports.includes(
        "knowledgeRepositoryFoundation.ts",
      ),
    );
    assert.ok(
      policy.unsupportedConsumerImports.includes(
        "knowledgeRepositoryFreeze.ts",
      ),
    );
    assert.ok(
      policy.unsupportedConsumerImports.includes("all internal DKL-6 files"),
    );
  });

  it("final release status is Released with ReadyForConsumer and ReadyForDKL7", () => {
    const summary = getKnowledgeRepositoryPublicSummary();
    const metadata = getKnowledgeRepositoryPublicReleaseMetadata();
    assert.equal(summary.releaseStatus, "Released");
    assert.equal(summary.consumerReadiness, "ReadyForConsumer");
    assert.equal(summary.nextPhaseReadiness, "ReadyForDKL7");
    assert.equal(metadata.releaseStatus, "Released");
    assert.equal(metadata.consumerReadiness, "ReadyForConsumer");
    assert.equal(metadata.nextPhaseReadiness, "ReadyForDKL7");
  });
});
