/**
 * DKL-3:5 — Data Understanding Manifest Tests.
 *
 * Deterministic coverage for the immutable Manifest layer.
 */

import assert from "node:assert/strict";
import test from "node:test";
import { readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import * as manifestApi from "./dataUnderstandingManifest.ts";
import {
  DataUnderstandingManifest,
  DataUnderstandingManifestInventory,
  DataUnderstandingManifestDependencies,
  DataUnderstandingManifestCompatibility,
  DataUnderstandingManifestReadiness,
  DataUnderstandingManifestSummary,
  DataUnderstandingManifestVersion,
  DataUnderstandingManifestIdentity,
} from "./dataUnderstandingManifest.ts";
import {
  DataUnderstandingContracts,
  DataUnderstandingLifecycle,
} from "./dataUnderstandingFoundation.ts";
import {
  DataUnderstandingEvidenceRegistry,
  DataUnderstandingRegistry,
  DataUnderstandingSubjectRegistry,
} from "./dataUnderstandingRegistry.ts";
import {
  DataUnderstandingModel,
  DataUnderstandingRelationshipModel,
} from "./dataUnderstandingModel.ts";
import {
  DataUnderstandingValidation,
  DataUnderstandingValidationRules,
} from "./dataUnderstandingValidation.ts";

const HERE = dirname(fileURLToPath(import.meta.url));

const DKL35_FILES = [
  "dataUnderstandingManifestTypes.ts",
  "dataUnderstandingManifestInventory.ts",
  "dataUnderstandingManifestDependencies.ts",
  "dataUnderstandingManifestCompatibility.ts",
  "dataUnderstandingManifestReadiness.ts",
  "dataUnderstandingManifestSummary.ts",
  "dataUnderstandingManifest.ts",
  "dataUnderstandingManifest.test.ts",
];

const isDeeplyFrozen = (value: unknown): boolean => {
  if (value === null || typeof value !== "object") {
    return true;
  }
  if (!Object.isFrozen(value)) {
    return false;
  }
  for (const nested of Object.values(value as Record<string, unknown>)) {
    if (!isDeeplyFrozen(nested)) {
      return false;
    }
  }
  return true;
};

test("1. exactly eight DKL-3:5 files exist", () => {
  assert.equal(DKL35_FILES.length, 8);
  for (const file of DKL35_FILES) {
    assert.ok(readdirSync(HERE).includes(file), `missing ${file}`);
  }
});

test("2. manifest module has exactly eight runtime exports", () => {
  assert.deepEqual(Object.keys(manifestApi).sort(), [
    "DataUnderstandingManifest",
    "DataUnderstandingManifestCompatibility",
    "DataUnderstandingManifestDependencies",
    "DataUnderstandingManifestIdentity",
    "DataUnderstandingManifestInventory",
    "DataUnderstandingManifestReadiness",
    "DataUnderstandingManifestSummary",
    "DataUnderstandingManifestVersion",
  ]);
});

test("3. no helper functions exported", () => {
  for (const [name, value] of Object.entries(manifestApi)) {
    assert.notEqual(typeof value, "function", `${name} must not be a function`);
  }
});

test("4. manifest identity and version are stable", () => {
  assert.equal(
    DataUnderstandingManifestIdentity.manifestId,
    "DKL-3:5/DataUnderstandingManifest",
  );
  assert.equal(DataUnderstandingManifestIdentity.sourcePhase, "DKL-3:5");
  assert.equal(DataUnderstandingManifestIdentity.status, "ManifestComplete");
  assert.equal(DataUnderstandingManifestIdentity.readiness, "ReadyForPlatform");
  assert.equal(DataUnderstandingManifestVersion, "1.0.0");
  assert.equal(DataUnderstandingManifest.version, "1.0.0");
  assert.equal(
    DataUnderstandingManifestIdentity.manifestNamespace,
    "nexora.dkl.data-understanding.manifest",
  );
});

test("5. foundation inventory is complete", () => {
  const f = DataUnderstandingManifestInventory.foundation;
  assert.equal(f.sourcePhase, "DKL-3:1");
  assert.equal(f.status, "FoundationComplete");
  assert.equal(f.readiness, "ReadyForRegistry");
  assert.deepEqual(f.subjectKinds, [...DataUnderstandingContracts.subjectKinds]);
  assert.deepEqual(f.candidateTypes, [...DataUnderstandingContracts.candidateTypes]);
  assert.deepEqual(f.lifecycleStates, [...DataUnderstandingLifecycle.states]);
});

test("6. registry inventory is complete", () => {
  const r = DataUnderstandingManifestInventory.registry;
  assert.equal(r.sourcePhase, "DKL-3:2");
  assert.equal(r.status, "RegistryComplete");
  assert.equal(r.readiness, "ReadyForModel");
  assert.equal(r.subjectCount, DataUnderstandingSubjectRegistry.entryCount);
  assert.equal(r.evidenceCategoryCount, DataUnderstandingEvidenceRegistry.entryCount);
  assert.equal(r.publicApiCount, DataUnderstandingRegistry.publicApis.entryCount);
});

test("7. model inventory is complete", () => {
  const m = DataUnderstandingManifestInventory.model;
  assert.equal(m.sourcePhase, "DKL-3:3");
  assert.equal(m.status, "ModelComplete");
  assert.equal(m.readiness, "ReadyForValidation");
  assert.equal(m.modelKindCount, DataUnderstandingModel.modelKindCount);
  assert.equal(
    m.relationshipKindCount,
    DataUnderstandingRelationshipModel.relationshipKindCount,
  );
});

test("8. validation inventory is complete", () => {
  const v = DataUnderstandingManifestInventory.validation;
  assert.equal(v.sourcePhase, "DKL-3:4");
  assert.equal(v.status, "ValidationComplete");
  assert.equal(v.readiness, "ReadyForManifest");
  assert.equal(v.ruleCount, DataUnderstandingValidationRules.length);
  assert.equal(v.publicApiCount, DataUnderstandingValidation.publicApiNames.length);
});

test("9. dependency inventory contains only approved upstreams and no future phases", () => {
  assert.equal(DataUnderstandingManifestDependencies.entryCount, 6);
  assert.equal(DataUnderstandingManifestDependencies.noFuturePhases, true);
  const phases = DataUnderstandingManifestDependencies.entries.map((e) => e.phase);
  assert.ok(phases.includes("DKL-2:9"));
  assert.ok(phases.includes("UI-PIPE-1:3"));
  assert.ok(phases.includes("DKL-3:1"));
  assert.ok(phases.includes("DKL-3:2"));
  assert.ok(phases.includes("DKL-3:3"));
  assert.ok(phases.includes("DKL-3:4"));
  assert.equal(phases.includes("DKL-3:6"), false);
  assert.equal(phases.includes("DKL-4"), false);
  for (const entry of DataUnderstandingManifestDependencies.entries) {
    assert.equal(entry.futurePhase, false);
    assert.equal(entry.required, true);
  }
  assert.ok(DataUnderstandingManifestDependencies.forbidden.includes("DKL-3:6+"));
  assert.ok(DataUnderstandingManifestDependencies.forbidden.includes("DKL-4"));
});

test("10. compatibility inventory is complete", () => {
  assert.ok(DataUnderstandingManifestCompatibility.entryCount >= 10);
  assert.equal(DataUnderstandingManifestCompatibility.runtimeCompatibilityLogic, false);
  const byId = Object.fromEntries(
    DataUnderstandingManifestCompatibility.entries.map((e) => [e.compatibilityId, e]),
  );
  assert.equal(byId.ForwardCompatibleToPlatform?.status, "ForwardCompatible");
  assert.equal(byId.BusinessObjectCompatibilityForbidden?.status, "Forbidden");
  assert.equal(byId.VersionCompatibility?.status, "Compatible");
});

test("11. ownership and boundary inventories are present", () => {
  assert.ok(DataUnderstandingManifestInventory.ownership.owns.length >= 11);
  assert.ok(DataUnderstandingManifestInventory.ownership.doesNotOwn.length >= 15);
  assert.equal(DataUnderstandingManifestInventory.boundaries.createsBusinessObjects, false);
  assert.equal(DataUnderstandingManifestInventory.boundaries.createsKnowledgeGraph, false);
  assert.equal(DataUnderstandingManifestInventory.boundaries.persistsDataset, false);
  assert.equal(DataUnderstandingManifestInventory.boundaries.executesAiModels, false);
  assert.equal(DataUnderstandingManifestInventory.boundaries.executesEngineReasoning, false);
});

test("12. readiness inventory reports ManifestComplete and ReadyForPlatform", () => {
  assert.equal(DataUnderstandingManifestReadiness.FoundationComplete, true);
  assert.equal(DataUnderstandingManifestReadiness.RegistryComplete, true);
  assert.equal(DataUnderstandingManifestReadiness.ModelComplete, true);
  assert.equal(DataUnderstandingManifestReadiness.ValidationComplete, true);
  assert.equal(DataUnderstandingManifestReadiness.ManifestComplete, true);
  assert.equal(DataUnderstandingManifestReadiness.ReadyForPlatform, true);
  assert.equal(DataUnderstandingManifestReadiness.ReadyForCertification, true);
  assert.equal(DataUnderstandingManifestReadiness.ReadyForFreeze, true);
  assert.equal(DataUnderstandingManifestReadiness.ReadyForPublicIndex, true);
  assert.equal(DataUnderstandingManifestReadiness.UnderstandingForbidden, true);
  assert.equal(DataUnderstandingManifestReadiness.ValidationExecutionForbidden, true);
  assert.equal(DataUnderstandingManifestReadiness.AIFree, true);
  assert.equal(DataUnderstandingManifestReadiness.EngineFree, true);
});

test("13. summary counts are deterministic and consistent", () => {
  const s = DataUnderstandingManifestSummary;
  assert.equal(s.totalSubjects, 7);
  assert.equal(s.totalCandidateTypes, 12);
  assert.equal(s.totalEvidenceCategories, 15);
  assert.equal(s.totalRelationshipTypes, 6);
  assert.equal(s.totalValidationRules, 28);
  assert.equal(s.totalPublicApis, 40);
  assert.equal(s.totalDependencies, 6);
  assert.equal(s.totalModels, 17);
  assert.equal(s.totalRegistries, 1);
  assert.equal(s.totalComponents, 5);
  assert.equal(s.totalReferences, 4);
  assert.equal(s.totalPhasesCompleted, 4);
  assert.equal(s.platformId, "DKL-3");
  assert.equal(s.nextPhase, "DKL-3:6");
  assert.equal(DataUnderstandingManifest.counts.subjectCount, s.totalSubjects);
  assert.equal(DataUnderstandingManifest.counts.validationRuleCount, s.totalValidationRules);
  assert.equal(DataUnderstandingManifest.counts.publicApiCount, 40);
});

test("14. public API inventory lists eight exports per phase including manifest", () => {
  const apis = DataUnderstandingManifestInventory.publicApis;
  assert.equal(apis.foundation.length, 8);
  assert.equal(apis.registry.length, 8);
  assert.equal(apis.model.length, 8);
  assert.equal(apis.validation.length, 8);
  assert.equal(apis.manifest.length, 8);
  assert.deepEqual([...apis.manifest].sort(), Object.keys(manifestApi).sort());
});

test("15. all manifest objects are deeply frozen", () => {
  assert.equal(isDeeplyFrozen(DataUnderstandingManifest), true);
  assert.equal(isDeeplyFrozen(DataUnderstandingManifestInventory), true);
  assert.equal(isDeeplyFrozen(DataUnderstandingManifestDependencies), true);
  assert.equal(isDeeplyFrozen(DataUnderstandingManifestCompatibility), true);
  assert.equal(isDeeplyFrozen(DataUnderstandingManifestReadiness), true);
  assert.equal(isDeeplyFrozen(DataUnderstandingManifestSummary), true);
  assert.equal(isDeeplyFrozen(DataUnderstandingManifestIdentity), true);
});

test("16. dependencies limited to approved public APIs", () => {
  for (const file of DKL35_FILES.filter((f) => !f.endsWith(".test.ts"))) {
    const text = readFileSync(join(HERE, file), "utf8");
    const imports = [...text.matchAll(/from\s+["']([^"']+)["']/g)].map((m) => m[1]!);
    for (const spec of imports) {
      const allowed =
        spec.includes("dataUnderstanding") ||
        /dataSourceKnowledgeRegistryPublicIndex\.ts$/.test(spec) ||
        /pipelineUnderstandingPlatform\.ts$/.test(spec);
      assert.ok(allowed, `${file} imports forbidden module: ${spec}`);
    }
    assert.equal(/from\s+["'][^"']*dkl-4/i.test(text), false, file);
    assert.equal(/from\s+["'][^"']*\/engine\//i.test(text), false, file);
    assert.equal(/from\s+["'][^"']*\/persistence/i.test(text), false, file);
  }
});

test("17. no runtime behavior: no classes, async, promises, randomness, clock, uuid", () => {
  for (const file of DKL35_FILES.filter((f) => !f.endsWith(".test.ts"))) {
    const text = readFileSync(join(HERE, file), "utf8");
    assert.equal(/\bclass\s+\w+/.test(text), false, file);
    assert.equal(/\basync\s+function\b/.test(text), false, file);
    assert.equal(/\bnew\s+Promise\b/.test(text), false, file);
    assert.equal(/Math\.random|Date\.now|new Date\(|process\.env/.test(text), false, file);
    assert.equal(/\buuid\b|randomUUID/i.test(text), false, file);
  }
});

test("18. metadata-only declarations forbid understanding, validation execution, BO, KG, AI, Engine", () => {
  assert.equal(DataUnderstandingManifest.metadata.metadataOnly, true);
  assert.equal(DataUnderstandingManifest.metadata.manifestOnly, true);
  assert.equal(DataUnderstandingManifest.metadata.semanticUnderstandingPerformed, false);
  assert.equal(DataUnderstandingManifest.metadata.validationExecuted, false);
  assert.equal(DataUnderstandingManifest.metadata.businessObjectsCreated, false);
  assert.equal(DataUnderstandingManifest.metadata.knowledgeGraphCreated, false);
  assert.equal(DataUnderstandingManifest.metadata.persistencePerformed, false);
  assert.equal(DataUnderstandingManifest.metadata.aiExecuted, false);
  assert.equal(DataUnderstandingManifest.metadata.engineReasoningPerformed, false);
});

test("19. repeated manifest access is deterministic", () => {
  const a = JSON.stringify(DataUnderstandingManifestSummary);
  const b = JSON.stringify(DataUnderstandingManifestSummary);
  assert.equal(a, b);
  assert.equal(DataUnderstandingManifest.inventory, DataUnderstandingManifestInventory);
  assert.equal(DataUnderstandingManifest.summary, DataUnderstandingManifestSummary);
  assert.equal(DataUnderstandingManifest.identity, DataUnderstandingManifestIdentity);
});

test("20. readiness ReadyForPlatform and next phase DKL-3:6", () => {
  assert.equal(DataUnderstandingManifest.readiness.ReadyForPlatform, true);
  assert.equal(DataUnderstandingManifestIdentity.readiness, "ReadyForPlatform");
  assert.equal(
    DataUnderstandingManifest.nextPhase,
    "DKL-3:6 — Data Understanding Platform",
  );
});
