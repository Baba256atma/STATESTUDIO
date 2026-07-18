/**
 * DKL-4:9 — Knowledge Modeling Public Index Tests.
 *
 * Deterministic coverage for the immutable public release surface.
 */

import assert from "node:assert/strict";
import test from "node:test";
import { readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import * as publicIndexApi from "./knowledgeModelingPublicIndex.ts";
import {
  KnowledgeModelingPlatformPublicFoundation,
  KnowledgeModelingPublicApiRegistry,
  KnowledgeModelingPublicIndexId,
  KnowledgeModelingPublicIndexVersion,
  KnowledgeModelingPublicIndexName,
  KnowledgeModelingPublicIndexNamespace,
  KnowledgeModelingPublicReleaseStatus,
  KnowledgeModelingPublicCertificationStatus,
  KnowledgeModelingPublicFreezeStatus,
  getKnowledgeModelingPublicSummary,
  getKnowledgeModelingPublicApiCount,
  getKnowledgeModelingPublicReleaseMetadata,
} from "./knowledgeModelingPublicIndex.ts";
import { KnowledgeModelingFreeze } from "./knowledgeModelingFreeze.ts";

const HERE = dirname(fileURLToPath(import.meta.url));

const DKL49_FILES = [
  "knowledgeModelingPublicIndex.ts",
  "knowledgeModelingPublicIndex.test.ts",
];

const SECTION_ORDER = [
  "foundation",
  "registry",
  "model",
  "validation",
  "manifest",
  "platform",
  "certification",
  "freeze",
  "publicIndex",
] as const;

const PUBLIC_INDEX_EXPORTS = [
  "KnowledgeModelingPlatformPublicFoundation",
  "KnowledgeModelingPublicApiRegistry",
  "KnowledgeModelingPublicCertificationStatus",
  "KnowledgeModelingPublicFreezeStatus",
  "KnowledgeModelingPublicIndexId",
  "KnowledgeModelingPublicIndexName",
  "KnowledgeModelingPublicIndexNamespace",
  "KnowledgeModelingPublicIndexVersion",
  "KnowledgeModelingPublicReleaseStatus",
  "getKnowledgeModelingPublicApiCount",
  "getKnowledgeModelingPublicReleaseMetadata",
  "getKnowledgeModelingPublicSummary",
] as const;

test("1. exactly two DKL-4:9 files exist", () => {
  assert.equal(DKL49_FILES.length, 2);
  for (const file of DKL49_FILES) {
    assert.ok(readdirSync(HERE).includes(file), `missing ${file}`);
  }
});

test("2. exactly twelve intentional public exports", () => {
  assert.deepEqual(Object.keys(publicIndexApi).sort(), [...PUBLIC_INDEX_EXPORTS]);
  assert.equal(Object.keys(publicIndexApi).length, 12);
});

test("3. public index identity, version, name, namespace, and statuses", () => {
  assert.equal(
    KnowledgeModelingPublicIndexId,
    "DKL-4:9/KnowledgeModelingPublicIndex",
  );
  assert.equal(KnowledgeModelingPublicIndexVersion, "1.0.0");
  assert.equal(
    KnowledgeModelingPublicIndexName,
    "Knowledge Modeling Public Index",
  );
  assert.equal(
    KnowledgeModelingPublicIndexNamespace,
    "nexora.dkl.knowledge-modeling.public",
  );
  assert.equal(KnowledgeModelingPublicReleaseStatus, "Released");
  assert.equal(KnowledgeModelingPublicCertificationStatus, "Certified");
  assert.equal(KnowledgeModelingPublicFreezeStatus, "Frozen");
  assert.equal(
    KnowledgeModelingPlatformPublicFoundation.publicIndex.stability,
    "Stable",
  );
  assert.equal(
    KnowledgeModelingPlatformPublicFoundation.publicIndex.consumerReadiness,
    "ReadyForConsumer",
  );
  assert.equal(
    KnowledgeModelingPlatformPublicFoundation.publicIndex.nextPhaseReadiness,
    "ReadyForDKL5",
  );
});

test("4. exactly nine ordered namespace sections", () => {
  assert.deepEqual(
    Object.keys(KnowledgeModelingPlatformPublicFoundation),
    [...SECTION_ORDER],
  );
  assert.equal(Object.keys(KnowledgeModelingPlatformPublicFoundation).length, 9);
});

test("5. every upstream section is identity-equal to Freeze gateway sources", () => {
  const ns = KnowledgeModelingPlatformPublicFoundation;
  const platform = KnowledgeModelingFreeze.certifiedPlatform;
  assert.equal(ns.foundation, platform.foundation);
  assert.equal(ns.registry, platform.registry);
  assert.equal(ns.model, platform.model);
  assert.equal(ns.validation, platform.validation);
  assert.equal(ns.manifest, platform.manifest);
  assert.equal(ns.platform, platform);
  assert.equal(ns.certification, KnowledgeModelingFreeze.certification);
  assert.equal(ns.freeze, KnowledgeModelingFreeze);
});

test("6. public API registry IDs and export names are unique and ordered", () => {
  const entries = KnowledgeModelingPublicApiRegistry.entries;
  const ids = entries.map((e) => e.id);
  const names = entries.map((e) => e.exportName);
  assert.equal(new Set(ids).size, ids.length);
  assert.equal(new Set(names).size, names.length);
  assert.equal(KnowledgeModelingPublicApiRegistry.uniqueIds, true);
  assert.equal(KnowledgeModelingPublicApiRegistry.uniqueExportNames, true);
  assert.equal(KnowledgeModelingPublicApiRegistry.deterministicOrdering, true);
  assert.deepEqual(
    [...names.slice(0, 8)],
    [
      "KnowledgeModelingFoundation",
      "KnowledgeModelingFoundationVersion",
      "KnowledgeModelingFoundationIdentity",
      "KnowledgeModelingContracts",
      "KnowledgeModelingOwnership",
      "KnowledgeModelingBoundaries",
      "KnowledgeModelingLifecycle",
      "KnowledgeModelingDependencies",
    ],
  );
});

test("7. every registry entry is stable, released, certified, frozen, owned", () => {
  for (const entry of KnowledgeModelingPublicApiRegistry.entries) {
    assert.ok(entry.sourcePhase.startsWith("DKL-4:"), entry.id);
    assert.equal(entry.stability, "Stable");
    assert.equal(entry.releaseStatus, "Released");
    assert.equal(entry.certificationStatus, "Certified");
    assert.equal(entry.freezeStatus, "Frozen");
    assert.equal(entry.visibility, "Public");
    assert.equal(entry.deprecated, false);
    assert.equal(entry.metadataOnly, true);
    assert.equal(entry.runtimeBehavior, "Forbidden");
    assert.equal(entry.publicEntryPoint, "knowledgeModelingPublicIndex.ts");
    assert.ok(entry.owner.length > 0);
  }
});

test("8. DKL-4:9 exports included; internals and tests excluded", () => {
  const names = KnowledgeModelingPublicApiRegistry.exportNames;
  for (const required of PUBLIC_INDEX_EXPORTS) {
    assert.ok(names.includes(required), `missing registry entry ${required}`);
  }
  assert.equal(names.includes("evaluateGateChecks"), false);
  assert.equal(names.includes("CANONICAL_RESULT"), false);
  assert.equal(names.includes("PLATFORM_METADATA"), false);
  assert.ok(KnowledgeModelingPublicApiRegistry.internalOnlyExcluded);
  assert.ok(KnowledgeModelingPublicApiRegistry.testArtifactsExcluded);
  assert.ok(KnowledgeModelingPublicApiRegistry.mutableApisExcluded);
  assert.equal(KnowledgeModelingPublicApiRegistry.entryCount, 76);
  assert.equal(KnowledgeModelingPublicApiRegistry.releasedPhases, 9);
});

test("9. helpers are deterministic and frozen; count matches registry", () => {
  const s1 = getKnowledgeModelingPublicSummary();
  const s2 = getKnowledgeModelingPublicSummary();
  const r1 = getKnowledgeModelingPublicReleaseMetadata();
  const r2 = getKnowledgeModelingPublicReleaseMetadata();
  assert.equal(s1, s2);
  assert.equal(r1, r2);
  assert.equal(Object.isFrozen(s1), true);
  assert.equal(Object.isFrozen(r1), true);
  assert.equal(
    getKnowledgeModelingPublicApiCount(),
    KnowledgeModelingPublicApiRegistry.entryCount,
  );
  assert.equal(s1.publicApiCount, KnowledgeModelingPublicApiRegistry.entryCount);
  assert.equal(s1.releaseStatus, "Released");
  assert.equal(s1.readiness, "ReadyForConsumer");
  assert.equal(s1.nextPhaseReadiness, "ReadyForDKL5");
  assert.equal(s1.sectionCount, 9);
  assert.equal(s1.solePublicEntryPoint, "knowledgeModelingPublicIndex.ts");
  assert.equal(r1.ReadyForConsumer, true);
  assert.equal(r1.ReadyForDKL5, true);
  assert.equal(r1.Released, true);
  assert.equal(r1.Certified, true);
  assert.equal(r1.Frozen, true);
  assert.equal(r1.Stable, true);
});

test("10. public namespace and registry are frozen", () => {
  assert.equal(Object.isFrozen(KnowledgeModelingPlatformPublicFoundation), true);
  assert.equal(Object.isFrozen(KnowledgeModelingPublicApiRegistry), true);
  assert.equal(Object.isFrozen(KnowledgeModelingPublicApiRegistry.entries), true);
  assert.equal(
    Object.isFrozen(KnowledgeModelingPlatformPublicFoundation.publicIndex),
    true,
  );
});

test("11. sole entry-point and forbidden internal consumer imports", () => {
  const section = KnowledgeModelingPlatformPublicFoundation.publicIndex;
  assert.equal(section.soleEntryPointPath, "knowledgeModelingPublicIndex.ts");
  assert.equal(
    section.consumerCompatibility.soleSupportedEntryPoint,
    "knowledgeModelingPublicIndex.ts",
  );
  assert.equal(
    section.consumerCompatibility.directInternalImports,
    "Forbidden",
  );
  assert.equal(
    section.consumerCompatibility.unsupportedInternalImports,
    true,
  );
  assert.ok(section.consumerCompatibility.entries.length >= 8);
});

test("12. release guarantees are complete; no runtime or mutation APIs", () => {
  const g = KnowledgeModelingPlatformPublicFoundation.publicIndex.guarantees;
  assert.equal(g.officiallyReleased, true);
  assert.equal(g.certified, true);
  assert.equal(g.frozen, true);
  assert.equal(g.stable, true);
  assert.equal(g.readyForApprovedConsumers, true);
  assert.equal(g.readyForDKL5, true);
  assert.equal(g.oneSupportedPublicEntryPoint, true);
  assert.equal(g.nineOrderedNamespaceSections, true);
  assert.equal(g.twelveTopLevelPublicExports, true);
  assert.equal(g.noRuntimeKnowledgeObjectCreation, true);
  assert.equal(g.noRuntimeBusinessObjectCreation, true);
  assert.equal(g.noGraphConstructionOrTraversal, true);
  assert.equal(g.noPersistenceOrRepositoryBehavior, true);
  assert.equal(g.noSemanticInferenceOrAi, true);
  assert.equal(g.noExecutiveEngineBehavior, true);
  assert.equal(g.noBreakingMutationApis, true);
  assert.equal(g.noSourceCodeScanning, true);
});

test("13. dependency only on knowledgeModelingFreeze.ts; no source scanning", () => {
  const text = readFileSync(join(HERE, "knowledgeModelingPublicIndex.ts"), "utf8");
  const imports = [...text.matchAll(/from\s+"(\.\/[^"]+)"/g)].map((m) => m[1]);
  assert.deepEqual(imports, ["./knowledgeModelingFreeze.ts", "./knowledgeModelingFreeze.ts"]);
  assert.equal(
    /from\s+"\.\/knowledgeModeling(Foundation|Registry|Model|Validation|Manifest|Platform|Certification)\.ts"/.test(
      text,
    ),
    false,
  );
  assert.equal(/from\s+"\.\/dataUnderstanding/.test(text), false);
  assert.equal(text.includes("readdirSync"), false);
  assert.equal(text.includes("readFileSync"), false);
  assert.equal(/Date\.now|Math\.random|process\.env/.test(text), false);
  assert.equal(/class\s|register\(|unlock\(|Factory|Builder/.test(text), false);
});
