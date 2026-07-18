/**
 * DKL-5:9 — Knowledge Validation Public Index Tests.
 *
 * Deterministic coverage for the immutable public release surface.
 */

import assert from "node:assert/strict";
import test from "node:test";
import { readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import * as publicIndexApi from "./knowledgeValidationPublicIndex.ts";
import {
  KnowledgeValidationPlatformPublicFoundation,
  KnowledgeValidationPublicApiRegistry,
  KnowledgeValidationPublicIndexId,
  KnowledgeValidationPublicIndexVersion,
  KnowledgeValidationPublicIndexName,
  KnowledgeValidationPublicIndexNamespace,
  KnowledgeValidationPublicReleaseStatus,
  KnowledgeValidationPublicCertificationStatus,
  KnowledgeValidationPublicFreezeStatus,
  getKnowledgeValidationPublicSummary,
  getKnowledgeValidationPublicApiCount,
  getKnowledgeValidationPublicReleaseMetadata,
} from "./knowledgeValidationPublicIndex.ts";
import { KnowledgeValidationFreeze } from "./knowledgeValidationFreeze.ts";

const HERE = dirname(fileURLToPath(import.meta.url));

const DKL59_FILES = [
  "knowledgeValidationPublicIndex.ts",
  "knowledgeValidationPublicIndex.test.ts",
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
  "KnowledgeValidationPlatformPublicFoundation",
  "KnowledgeValidationPublicApiRegistry",
  "KnowledgeValidationPublicCertificationStatus",
  "KnowledgeValidationPublicFreezeStatus",
  "KnowledgeValidationPublicIndexId",
  "KnowledgeValidationPublicIndexName",
  "KnowledgeValidationPublicIndexNamespace",
  "KnowledgeValidationPublicIndexVersion",
  "KnowledgeValidationPublicReleaseStatus",
  "getKnowledgeValidationPublicApiCount",
  "getKnowledgeValidationPublicReleaseMetadata",
  "getKnowledgeValidationPublicSummary",
] as const;

test("1. exactly two DKL-5:9 files exist", () => {
  assert.equal(DKL59_FILES.length, 2);
  for (const file of DKL59_FILES) {
    assert.ok(readdirSync(HERE).includes(file), `missing ${file}`);
  }
});

test("2. exactly twelve intentional public exports", () => {
  assert.deepEqual(Object.keys(publicIndexApi).sort(), [...PUBLIC_INDEX_EXPORTS]);
  assert.equal(Object.keys(publicIndexApi).length, 12);
});

test("3. public index identity, version, name, namespace, and statuses", () => {
  assert.equal(
    KnowledgeValidationPublicIndexId,
    "DKL-5:9/KnowledgeValidationPublicIndex",
  );
  assert.equal(KnowledgeValidationPublicIndexVersion, "1.0.0");
  assert.equal(
    KnowledgeValidationPublicIndexName,
    "Knowledge Validation Public Index",
  );
  assert.equal(
    KnowledgeValidationPublicIndexNamespace,
    "nexora.dkl.knowledge-validation.public",
  );
  assert.equal(KnowledgeValidationPublicReleaseStatus, "Released");
  assert.equal(KnowledgeValidationPublicCertificationStatus, "Certified");
  assert.equal(KnowledgeValidationPublicFreezeStatus, "Frozen");
  assert.equal(
    KnowledgeValidationPlatformPublicFoundation.publicIndex.stability,
    "Stable",
  );
  assert.equal(
    KnowledgeValidationPlatformPublicFoundation.publicIndex.consumerReadiness,
    "ReadyForConsumer",
  );
  assert.equal(
    KnowledgeValidationPlatformPublicFoundation.publicIndex.nextPhaseReadiness,
    "ReadyForDKL6",
  );
});

test("4. exactly nine ordered namespace sections", () => {
  assert.deepEqual(
    Object.keys(KnowledgeValidationPlatformPublicFoundation),
    [...SECTION_ORDER],
  );
  assert.equal(
    Object.keys(KnowledgeValidationPlatformPublicFoundation).length,
    9,
  );
});

test("5. every upstream section is identity-equal to Freeze gateway sources", () => {
  const ns = KnowledgeValidationPlatformPublicFoundation;
  const platform = KnowledgeValidationFreeze.certifiedPlatform;
  assert.equal(ns.foundation, platform.foundation);
  assert.equal(ns.registry, platform.registry);
  assert.equal(ns.model, platform.model);
  assert.equal(ns.validation, platform.validation);
  assert.equal(ns.manifest, platform.manifest);
  assert.equal(ns.platform, platform);
  assert.equal(ns.certification, KnowledgeValidationFreeze.certification);
  assert.equal(ns.freeze, KnowledgeValidationFreeze);
});

test("6. public API registry IDs and export names are unique and ordered", () => {
  const entries = KnowledgeValidationPublicApiRegistry.entries;
  const ids = entries.map((entry) => entry.id);
  const names = entries.map((entry) => entry.exportName);
  assert.equal(new Set(ids).size, ids.length);
  assert.equal(new Set(names).size, names.length);
  assert.equal(KnowledgeValidationPublicApiRegistry.uniqueIds, true);
  assert.equal(KnowledgeValidationPublicApiRegistry.uniqueExportNames, true);
  assert.equal(KnowledgeValidationPublicApiRegistry.deterministicOrdering, true);
  assert.deepEqual(
    [...names.slice(0, 8)],
    [
      "KnowledgeValidationFoundation",
      "KnowledgeValidationFoundationIdentity",
      "KnowledgeValidationFoundationVersion",
      "KnowledgeValidationContracts",
      "KnowledgeValidationOwnership",
      "KnowledgeValidationBoundaries",
      "KnowledgeValidationLifecycle",
      "KnowledgeValidationDependencies",
    ],
  );
});

test("7. every registry entry is stable, released, certified, frozen, owned", () => {
  for (const entry of KnowledgeValidationPublicApiRegistry.entries) {
    assert.ok(entry.sourcePhase.startsWith("DKL-5:"), entry.id);
    assert.equal(entry.stability, "Stable");
    assert.equal(entry.releaseStatus, "Released");
    assert.equal(entry.certificationStatus, "Certified");
    assert.equal(entry.freezeStatus, "Frozen");
    assert.equal(entry.visibility, "Public");
    assert.equal(entry.deprecated, false);
    assert.equal(entry.metadataOnly, true);
    assert.equal(entry.runtimeBehavior, false);
    assert.equal(entry.numericScoring, false);
    assert.equal(entry.trustCalculation, false);
    assert.equal(entry.cleansing, false);
    assert.equal(entry.remediation, false);
    assert.equal(entry.publicEntryPoint, "knowledgeValidationPublicIndex.ts");
    assert.ok(entry.owner.length > 0);
  }
});

test("8. DKL-5:9 exports included; internals and tests excluded", () => {
  const names = KnowledgeValidationPublicApiRegistry.exportNames;
  for (const required of PUBLIC_INDEX_EXPORTS) {
    assert.ok(names.includes(required), `missing registry entry ${required}`);
  }
  assert.equal(names.includes("evaluateGateChecks"), false);
  assert.equal(names.includes("CANONICAL_RESULT"), false);
  assert.equal(names.includes("PLATFORM_METADATA"), false);
  assert.ok(KnowledgeValidationPublicApiRegistry.internalOnlyExcluded);
  assert.ok(KnowledgeValidationPublicApiRegistry.testArtifactsExcluded);
  assert.ok(KnowledgeValidationPublicApiRegistry.mutableApisExcluded);
  assert.equal(KnowledgeValidationPublicApiRegistry.entryCount, 76);
  assert.equal(KnowledgeValidationPublicApiRegistry.releasedPhases, 9);
});

test("9. helpers are deterministic and frozen; count matches registry", () => {
  const s1 = getKnowledgeValidationPublicSummary();
  const s2 = getKnowledgeValidationPublicSummary();
  const r1 = getKnowledgeValidationPublicReleaseMetadata();
  const r2 = getKnowledgeValidationPublicReleaseMetadata();
  assert.equal(s1, s2);
  assert.equal(r1, r2);
  assert.equal(Object.isFrozen(s1), true);
  assert.equal(Object.isFrozen(r1), true);
  assert.equal(
    getKnowledgeValidationPublicApiCount(),
    KnowledgeValidationPublicApiRegistry.entryCount,
  );
  assert.equal(s1.publicApiCount, KnowledgeValidationPublicApiRegistry.entryCount);
  assert.equal(s1.releaseStatus, "Released");
  assert.equal(s1.readiness, "ReadyForConsumer");
  assert.equal(s1.nextPhaseReadiness, "ReadyForDKL6");
  assert.equal(s1.sectionCount, 9);
  assert.equal(s1.solePublicEntryPoint, "knowledgeValidationPublicIndex.ts");
  assert.equal(s1.evidenceOriented, true);
  assert.equal(s1.explainabilityActive, true);
  assert.equal(s1.partialUsabilityProtected, true);
  assert.equal(s1.runtimeValidationProhibited, true);
  assert.equal(s1.numericScoringProhibited, true);
  assert.equal(s1.trustCalculationProhibited, true);
  assert.equal(s1.cleansingProhibited, true);
  assert.equal(s1.remediationProhibited, true);
  assert.equal(r1.ReadyForConsumer, true);
  assert.equal(r1.ReadyForDKL6, true);
  assert.equal(r1.Released, true);
  assert.equal(r1.Certified, true);
  assert.equal(r1.Frozen, true);
  assert.equal(r1.Stable, true);
});

test("10. public namespace and registry are frozen", () => {
  assert.equal(
    Object.isFrozen(KnowledgeValidationPlatformPublicFoundation),
    true,
  );
  assert.equal(Object.isFrozen(KnowledgeValidationPublicApiRegistry), true);
  assert.equal(
    Object.isFrozen(KnowledgeValidationPublicApiRegistry.entries),
    true,
  );
  assert.equal(
    Object.isFrozen(KnowledgeValidationPlatformPublicFoundation.publicIndex),
    true,
  );
});

test("11. sole entry-point and forbidden internal consumer imports", () => {
  const section = KnowledgeValidationPlatformPublicFoundation.publicIndex;
  assert.equal(section.soleEntryPointPath, "knowledgeValidationPublicIndex.ts");
  assert.equal(
    section.consumerCompatibility.soleSupportedEntryPoint,
    "knowledgeValidationPublicIndex.ts",
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

test("12. evidence, explainability, suitability, and prohibitions published", () => {
  const section = KnowledgeValidationPlatformPublicFoundation.publicIndex;
  assert.equal(section.evidenceOrientedGuarantee, true);
  assert.equal(section.explainabilityGuarantee, true);
  assert.equal(section.partialUsabilityGuarantee, true);
  assert.equal(section.runtimeValidationProhibition, true);
  assert.equal(section.numericScoringProhibition, true);
  assert.equal(section.trustCalculationProhibition, true);
  assert.equal(section.cleansingProhibition, true);
  assert.equal(section.remediationProhibition, true);
  assert.equal(section.consumerReadinessDeclarations.length, 4);
  assert.equal(section.executiveUsabilityDeclarations.length, 8);
  assert.ok(section.executiveUsabilityDeclarations.includes("ExecutiveAwareness"));
  assert.ok(
    section.executiveUsabilityDeclarations.includes("DecisionCommitment"),
  );
});

test("13. release guarantees are complete; no runtime or mutation APIs", () => {
  const g = KnowledgeValidationPlatformPublicFoundation.publicIndex.guarantees;
  assert.equal(g.officiallyReleased, true);
  assert.equal(g.certified, true);
  assert.equal(g.frozen, true);
  assert.equal(g.stable, true);
  assert.equal(g.readyForApprovedConsumers, true);
  assert.equal(g.readyForDKL6, true);
  assert.equal(g.oneSupportedPublicEntryPoint, true);
  assert.equal(g.nineOrderedNamespaceSections, true);
  assert.equal(g.twelveTopLevelPublicExports, true);
  assert.equal(g.noRuntimeOrganizationalValidation, true);
  assert.equal(g.noNumericScoring, true);
  assert.equal(g.noAutomaticTrustCalculation, true);
  assert.equal(g.noCleansing, true);
  assert.equal(g.noRemediation, true);
  assert.equal(g.noGraphTraversal, true);
  assert.equal(g.noAiOrSemanticInference, true);
  assert.equal(g.noExecutiveEngineBehavior, true);
  assert.equal(g.noMutableRegistrationApis, true);
  assert.equal(g.noSourceCodeScanning, true);
  assert.equal(g.evidenceOrientedGuaranteesActive, true);
  assert.equal(g.explainabilityGuaranteesActive, true);
  assert.equal(g.partialUsabilityProtected, true);
});

test("14. dependency only on knowledgeValidationFreeze.ts; no source scanning", () => {
  const text = readFileSync(
    join(HERE, "knowledgeValidationPublicIndex.ts"),
    "utf8",
  );
  const imports = [...text.matchAll(/from\s+"(\.\/[^"]+)"/g)].map(
    (match) => match[1],
  );
  assert.deepEqual(imports, [
    "./knowledgeValidationFreeze.ts",
    "./knowledgeValidationFreeze.ts",
  ]);
  assert.equal(
    /from\s+"\.\/knowledgeValidation(Foundation|Registry|Model|Validation|Manifest|Platform|Certification)\.ts"/.test(
      text,
    ),
    false,
  );
  assert.equal(/from\s+"\.\/knowledgeModeling/.test(text), false);
  assert.equal(text.includes("readdirSync"), false);
  assert.equal(text.includes("readFileSync"), false);
  assert.equal(/Date\.now|Math\.random|process\.env/.test(text), false);
  assert.equal(/class\s|register\(|unlock\(|Factory|Builder/.test(text), false);
});
