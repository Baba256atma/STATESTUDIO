/**
 * DKL-3:6 — Data Understanding Platform Tests.
 *
 * Deterministic coverage for the immutable Platform layer.
 */

import assert from "node:assert/strict";
import test from "node:test";
import { readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import * as platformApi from "./dataUnderstandingPlatform.ts";
import {
  DataUnderstandingPlatform,
  DataUnderstandingPlatformRegistry,
  DataUnderstandingPlatformCompatibility,
  DataUnderstandingPlatformDependencies,
  DataUnderstandingPlatformReadiness,
  DataUnderstandingPlatformSummary,
  DataUnderstandingPlatformVersion,
  DataUnderstandingPlatformIdentity,
} from "./dataUnderstandingPlatform.ts";
import {
  DataUnderstandingFoundation,
  DataUnderstandingFoundationVersion,
} from "./dataUnderstandingFoundation.ts";
import {
  DataUnderstandingRegistry,
  DataUnderstandingRegistryIdentity,
} from "./dataUnderstandingRegistry.ts";
import {
  DataUnderstandingModel,
  DataUnderstandingModelIdentity,
} from "./dataUnderstandingModel.ts";
import {
  DataUnderstandingValidation,
  DataUnderstandingValidationRules,
} from "./dataUnderstandingValidation.ts";
import {
  DataUnderstandingManifest,
  DataUnderstandingManifestIdentity,
} from "./dataUnderstandingManifest.ts";

const HERE = dirname(fileURLToPath(import.meta.url));

const DKL36_FILES = [
  "dataUnderstandingPlatformTypes.ts",
  "dataUnderstandingPlatformRegistry.ts",
  "dataUnderstandingPlatformCompatibility.ts",
  "dataUnderstandingPlatformDependencies.ts",
  "dataUnderstandingPlatformReadiness.ts",
  "dataUnderstandingPlatformSummary.ts",
  "dataUnderstandingPlatform.ts",
  "dataUnderstandingPlatform.test.ts",
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

test("1. exactly eight DKL-3:6 files exist", () => {
  assert.equal(DKL36_FILES.length, 8);
  for (const file of DKL36_FILES) {
    assert.ok(readdirSync(HERE).includes(file), `missing ${file}`);
  }
});

test("2. platform module has exactly eight runtime exports", () => {
  assert.deepEqual(Object.keys(platformApi).sort(), [
    "DataUnderstandingPlatform",
    "DataUnderstandingPlatformCompatibility",
    "DataUnderstandingPlatformDependencies",
    "DataUnderstandingPlatformIdentity",
    "DataUnderstandingPlatformReadiness",
    "DataUnderstandingPlatformRegistry",
    "DataUnderstandingPlatformSummary",
    "DataUnderstandingPlatformVersion",
  ]);
});

test("3. no helper functions among platform public exports", () => {
  for (const [name, value] of Object.entries(platformApi)) {
    assert.notEqual(typeof value, "function", `${name} must not be a function`);
  }
});

test("4. platform identity and version are stable", () => {
  assert.equal(DataUnderstandingPlatformIdentity.platformId, "DKL-3");
  assert.equal(DataUnderstandingPlatformIdentity.sourcePhase, "DKL-3:6");
  assert.equal(DataUnderstandingPlatformIdentity.status, "PlatformComplete");
  assert.equal(DataUnderstandingPlatformIdentity.readiness, "ReadyForCertification");
  assert.equal(DataUnderstandingPlatformVersion, "1.0.0");
  assert.equal(
    DataUnderstandingPlatformIdentity.platformNamespace,
    "nexora.dkl.data-understanding.platform",
  );
});

test("5. platform namespace has exactly five sections", () => {
  assert.deepEqual(Object.keys(DataUnderstandingPlatform.namespace), [
    "foundation",
    "registry",
    "model",
    "validation",
    "manifest",
  ]);
  assert.equal(DataUnderstandingPlatformRegistry.namespaceSectionCount, 5);
  assert.deepEqual([...DataUnderstandingPlatformRegistry.namespaceSections], [
    "foundation",
    "registry",
    "model",
    "validation",
    "manifest",
  ]);
});

test("6. foundation linkage references official public APIs", () => {
  assert.equal(
    DataUnderstandingPlatform.foundation.DataUnderstandingFoundation,
    DataUnderstandingFoundation,
  );
  assert.equal(
    DataUnderstandingPlatform.foundation.DataUnderstandingFoundationVersion,
    DataUnderstandingFoundationVersion,
  );
  assert.equal(typeof DataUnderstandingPlatform.foundation.validateDataUnderstandingFoundationInput, "function");
  assert.equal(Object.keys(DataUnderstandingPlatform.foundation).length, 8);
});

test("7. registry linkage references official public APIs", () => {
  assert.equal(
    DataUnderstandingPlatform.registry.DataUnderstandingRegistry,
    DataUnderstandingRegistry,
  );
  assert.equal(
    DataUnderstandingPlatform.registry.DataUnderstandingRegistryIdentity,
    DataUnderstandingRegistryIdentity,
  );
  assert.equal(Object.keys(DataUnderstandingPlatform.registry).length, 8);
});

test("8. model linkage references official public APIs", () => {
  assert.equal(
    DataUnderstandingPlatform.model.DataUnderstandingModel,
    DataUnderstandingModel,
  );
  assert.equal(
    DataUnderstandingPlatform.model.DataUnderstandingModelIdentity,
    DataUnderstandingModelIdentity,
  );
  assert.equal(Object.keys(DataUnderstandingPlatform.model).length, 8);
});

test("9. validation linkage references official public APIs", () => {
  assert.equal(
    DataUnderstandingPlatform.validation.DataUnderstandingValidation,
    DataUnderstandingValidation,
  );
  assert.equal(
    DataUnderstandingPlatform.validation.DataUnderstandingValidationRules,
    DataUnderstandingValidationRules,
  );
  assert.equal(typeof DataUnderstandingPlatform.validation.validateDataUnderstandingModel, "function");
  assert.equal(Object.keys(DataUnderstandingPlatform.validation).length, 8);
});

test("10. manifest linkage references official public APIs", () => {
  assert.equal(
    DataUnderstandingPlatform.manifest.DataUnderstandingManifest,
    DataUnderstandingManifest,
  );
  assert.equal(
    DataUnderstandingPlatform.manifest.DataUnderstandingManifestIdentity,
    DataUnderstandingManifestIdentity,
  );
  assert.equal(Object.keys(DataUnderstandingPlatform.manifest).length, 8);
});

test("11. dependency correctness — approved only, no future phases", () => {
  assert.equal(DataUnderstandingPlatformDependencies.entryCount, 7);
  assert.equal(DataUnderstandingPlatformDependencies.noFuturePhases, true);
  const phases = DataUnderstandingPlatformDependencies.entries.map((e) => e.phase);
  assert.ok(phases.includes("UI-PIPE-1:3"));
  assert.ok(phases.includes("DKL-2:9"));
  assert.ok(phases.includes("DKL-3:1"));
  assert.ok(phases.includes("DKL-3:2"));
  assert.ok(phases.includes("DKL-3:3"));
  assert.ok(phases.includes("DKL-3:4"));
  assert.ok(phases.includes("DKL-3:5"));
  assert.equal(phases.includes("DKL-3:7"), false);
  assert.equal(phases.includes("DKL-4"), false);
  for (const entry of DataUnderstandingPlatformDependencies.entries) {
    assert.equal(entry.futurePhase, false);
    assert.equal(entry.required, true);
  }
  assert.ok(DataUnderstandingPlatformDependencies.forbidden.includes("DKL-3:7+"));
  assert.ok(DataUnderstandingPlatformDependencies.forbidden.includes("DKL-4"));
});

test("12. compatibility correctness", () => {
  assert.ok(DataUnderstandingPlatformCompatibility.entryCount >= 10);
  assert.equal(DataUnderstandingPlatformCompatibility.runtimeCompatibilityLogic, false);
  const byId = Object.fromEntries(
    DataUnderstandingPlatformCompatibility.entries.map((e) => [e.compatibilityId, e]),
  );
  assert.equal(byId.FoundationCompatibility?.status, "Compatible");
  assert.equal(byId.ForwardCompatibleToCertification?.status, "ForwardCompatible");
  assert.equal(byId.Dkl4CompatibilityReferenceOnly?.status, "Restricted");
  assert.equal(byId.BusinessObjectCompatibilityForbidden?.status, "Forbidden");
});

test("13. readiness correctness", () => {
  assert.equal(DataUnderstandingPlatformReadiness.FoundationComplete, true);
  assert.equal(DataUnderstandingPlatformReadiness.RegistryComplete, true);
  assert.equal(DataUnderstandingPlatformReadiness.ModelComplete, true);
  assert.equal(DataUnderstandingPlatformReadiness.ValidationComplete, true);
  assert.equal(DataUnderstandingPlatformReadiness.ManifestComplete, true);
  assert.equal(DataUnderstandingPlatformReadiness.PlatformComplete, true);
  assert.equal(DataUnderstandingPlatformReadiness.ReadyForCertification, true);
  assert.equal(DataUnderstandingPlatformReadiness.ReadyForFreeze, true);
  assert.equal(DataUnderstandingPlatformReadiness.ReadyForPublicIndex, true);
  assert.equal(DataUnderstandingPlatformReadiness.UnderstandingForbidden, true);
  assert.equal(DataUnderstandingPlatformReadiness.ValidationExecutionForbidden, true);
  assert.equal(DataUnderstandingPlatformReadiness.BusinessObjectCreationForbidden, true);
  assert.equal(DataUnderstandingPlatformReadiness.KnowledgeGraphForbidden, true);
  assert.equal(DataUnderstandingPlatformReadiness.AIFree, true);
  assert.equal(DataUnderstandingPlatformReadiness.EngineFree, true);
});

test("14. summary totals are deterministic", () => {
  const s = DataUnderstandingPlatformSummary;
  assert.equal(s.totalComponents, 6);
  assert.equal(s.totalRegistries, 1);
  assert.equal(s.totalModels, 17);
  assert.equal(s.totalValidationRules, 28);
  assert.equal(s.totalDependencies, 7);
  assert.equal(s.totalPublicApis, 48);
  assert.equal(s.totalReferences, 4);
  assert.equal(s.totalInventories, 1);
  assert.equal(s.totalMetadataObjects, 30);
  assert.equal(s.namespaceSectionCount, 5);
  assert.equal(s.phasesCompleted, 5);
  assert.equal(s.platformId, "DKL-3");
  assert.equal(s.nextPhase, "DKL-3:7");
});

test("15. platform registry completeness and identity consistency", () => {
  assert.equal(DataUnderstandingPlatformRegistry.componentCount, 6);
  assert.equal(DataUnderstandingPlatformRegistry.publicApiCount, 8);
  assert.equal(DataUnderstandingPlatformRegistry.status, "PlatformComplete");
  assert.equal(DataUnderstandingPlatform.identity, DataUnderstandingPlatformIdentity);
  assert.equal(DataUnderstandingPlatform.version, DataUnderstandingPlatformVersion);
  assert.equal(DataUnderstandingPlatform.platformRegistry, DataUnderstandingPlatformRegistry);
  assert.deepEqual(
    [...DataUnderstandingPlatformRegistry.publicApiNames].sort(),
    Object.keys(platformApi).sort(),
  );
});

test("16. all platform objects are deeply frozen / readonly guarantees", () => {
  assert.equal(isDeeplyFrozen(DataUnderstandingPlatformIdentity), true);
  assert.equal(isDeeplyFrozen(DataUnderstandingPlatformRegistry), true);
  assert.equal(isDeeplyFrozen(DataUnderstandingPlatformCompatibility), true);
  assert.equal(isDeeplyFrozen(DataUnderstandingPlatformDependencies), true);
  assert.equal(isDeeplyFrozen(DataUnderstandingPlatformReadiness), true);
  assert.equal(isDeeplyFrozen(DataUnderstandingPlatformSummary), true);
  assert.equal(Object.isFrozen(DataUnderstandingPlatform), true);
  assert.equal(Object.isFrozen(DataUnderstandingPlatform.namespace), true);
  assert.equal(Object.isFrozen(DataUnderstandingPlatform.foundation), true);
  assert.equal(Object.isFrozen(DataUnderstandingPlatform.registry), true);
  assert.equal(Object.isFrozen(DataUnderstandingPlatform.model), true);
  assert.equal(Object.isFrozen(DataUnderstandingPlatform.validation), true);
  assert.equal(Object.isFrozen(DataUnderstandingPlatform.manifest), true);
});

test("17. dependencies limited to approved public APIs", () => {
  for (const file of DKL36_FILES.filter((f) => !f.endsWith(".test.ts"))) {
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

test("18. no runtime behavior: no classes, async, promises, randomness, clock, uuid", () => {
  for (const file of DKL36_FILES.filter((f) => !f.endsWith(".test.ts"))) {
    const text = readFileSync(join(HERE, file), "utf8");
    assert.equal(/\bclass\s+\w+/.test(text), false, file);
    assert.equal(/\basync\s+function\b/.test(text), false, file);
    assert.equal(/\bnew\s+Promise\b/.test(text), false, file);
    assert.equal(/Math\.random|Date\.now|new Date\(|process\.env/.test(text), false, file);
    assert.equal(/\buuid\b|randomUUID/i.test(text), false, file);
  }
});

test("19. metadata-only declarations forbid understanding, BO, KG, AI, Engine, validation execution", () => {
  assert.equal(DataUnderstandingPlatform.metadata.metadataOnly, true);
  assert.equal(DataUnderstandingPlatform.metadata.platformOnly, true);
  assert.equal(DataUnderstandingPlatform.metadata.noNewArchitecture, true);
  assert.equal(DataUnderstandingPlatform.metadata.semanticUnderstandingPerformed, false);
  assert.equal(DataUnderstandingPlatform.metadata.semanticInferencePerformed, false);
  assert.equal(DataUnderstandingPlatform.metadata.candidateGenerationPerformed, false);
  assert.equal(DataUnderstandingPlatform.metadata.validationExecuted, false);
  assert.equal(DataUnderstandingPlatform.metadata.businessObjectsCreated, false);
  assert.equal(DataUnderstandingPlatform.metadata.knowledgeGraphCreated, false);
  assert.equal(DataUnderstandingPlatform.metadata.persistencePerformed, false);
  assert.equal(DataUnderstandingPlatform.metadata.aiExecuted, false);
  assert.equal(DataUnderstandingPlatform.metadata.engineReasoningPerformed, false);
});

test("20. readiness ReadyForCertification and next phase DKL-3:7", () => {
  assert.equal(DataUnderstandingPlatform.readiness.ReadyForCertification, true);
  assert.equal(DataUnderstandingPlatformIdentity.readiness, "ReadyForCertification");
  assert.equal(
    DataUnderstandingPlatform.nextPhase,
    "DKL-3:7 — Data Understanding Certification",
  );
  const a = JSON.stringify(DataUnderstandingPlatformSummary);
  const b = JSON.stringify(DataUnderstandingPlatformSummary);
  assert.equal(a, b);
});
