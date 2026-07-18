/**
 * DKL-3:4 — Data Understanding Validation Tests.
 *
 * Deterministic coverage for the immutable validation layer.
 */

import assert from "node:assert/strict";
import test from "node:test";
import { readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import * as validationApi from "./dataUnderstandingValidation.ts";
import {
  DataUnderstandingValidation,
  DataUnderstandingValidationRules,
  DataUnderstandingValidationOwnership,
  DataUnderstandingValidationBoundaries,
  DataUnderstandingValidationManifest,
  DataUnderstandingValidationReport,
  DataUnderstandingValidationVersion,
  validateDataUnderstandingModel,
} from "./dataUnderstandingValidation.ts";
import { DataUnderstandingModel } from "./dataUnderstandingModel.ts";
import type { DataUnderstandingModelValidationView } from "./dataUnderstandingValidationTypes.ts";

const HERE = dirname(fileURLToPath(import.meta.url));

const DKL34_FILES = [
  "dataUnderstandingValidationTypes.ts",
  "dataUnderstandingValidationRules.ts",
  "dataUnderstandingValidationOwnership.ts",
  "dataUnderstandingValidationBoundaries.ts",
  "dataUnderstandingValidationManifest.ts",
  "dataUnderstandingValidationReport.ts",
  "dataUnderstandingValidation.ts",
  "dataUnderstandingValidation.test.ts",
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

const canonicalInput = (): DataUnderstandingModelValidationView =>
  DataUnderstandingModel as unknown as DataUnderstandingModelValidationView;

const withOverride = (
  override: DataUnderstandingModelValidationView,
): DataUnderstandingModelValidationView =>
  Object.freeze({
    ...(DataUnderstandingModel as unknown as DataUnderstandingModelValidationView),
    ...override,
  });

test("1. exactly eight DKL-3:4 files exist", () => {
  assert.equal(DKL34_FILES.length, 8);
  for (const file of DKL34_FILES) {
    assert.ok(readdirSync(HERE).includes(file), `missing ${file}`);
  }
});

test("2. validation module has exactly eight runtime exports", () => {
  assert.deepEqual(Object.keys(validationApi).sort(), [
    "DataUnderstandingValidation",
    "DataUnderstandingValidationBoundaries",
    "DataUnderstandingValidationManifest",
    "DataUnderstandingValidationOwnership",
    "DataUnderstandingValidationReport",
    "DataUnderstandingValidationRules",
    "DataUnderstandingValidationVersion",
    "validateDataUnderstandingModel",
  ]);
});

test("3. only one validation function is exported", () => {
  const functions = Object.entries(validationApi).filter(([, v]) => typeof v === "function");
  assert.equal(functions.length, 1);
  assert.equal(functions[0]?.[0], "validateDataUnderstandingModel");
});

test("4. validation identity is stable", () => {
  assert.equal(
    DataUnderstandingValidation.identity.validationId,
    "DKL-3:4/DataUnderstandingValidation",
  );
  assert.equal(DataUnderstandingValidation.identity.sourcePhase, "DKL-3:4");
  assert.equal(DataUnderstandingValidation.identity.status, "ValidationComplete");
  assert.equal(DataUnderstandingValidation.identity.readiness, "ReadyForManifest");
  assert.equal(DataUnderstandingValidationVersion, "1.0.0");
});

test("5. validation rules catalog is complete and unique", () => {
  assert.ok(DataUnderstandingValidationRules.length >= 24);
  const ids = DataUnderstandingValidationRules.map((r) => r.ruleId);
  assert.equal(new Set(ids).size, ids.length);
  assert.equal(DataUnderstandingValidationManifest.ruleCount, DataUnderstandingValidationRules.length);
});

test("6. canonical model passes foundation/registry/model validation", () => {
  const result = validateDataUnderstandingModel(canonicalInput());
  assert.equal(result.valid, true);
  assert.equal(result.status, "Valid");
  assert.equal(result.readiness, "ReadyForManifest");
  assert.equal(result.counts.fail, 0);
  assert.equal(result.ruleResults.length, DataUnderstandingValidationRules.length);
  assert.equal(result.ruleResults.every((r) => r.status === "PASS"), true);
});

test("7. missing model fails without throwing", () => {
  assert.doesNotThrow(() => {
    const result = validateDataUnderstandingModel(null);
    assert.equal(result.valid, false);
    assert.ok(result.issues.some((i) => i.code === "ModelPresent"));
  });
});

test("8. foundation and registry reference failures are detected", () => {
  const foundationFail = validateDataUnderstandingModel(
    withOverride({
      foundationReference: Object.freeze({
        foundationId: "wrong",
        sourcePhase: "DKL-3:1",
        readiness: "ReadyForRegistry",
      }),
    }),
  );
  assert.equal(foundationFail.valid, false);
  assert.ok(foundationFail.issues.some((i) => i.code === "FoundationIdentityAligned"));

  const registryFail = validateDataUnderstandingModel(
    withOverride({
      registryReference: Object.freeze({
        registryId: "wrong",
        sourcePhase: "DKL-3:2",
        readiness: "ReadyForModel",
      }),
    }),
  );
  assert.equal(registryFail.valid, false);
  assert.ok(registryFail.issues.some((i) => i.code === "RegistryIdentityAligned"));
});

test("9. candidate Business Object allowance fails validation", () => {
  const result = validateDataUnderstandingModel(
    withOverride({
      candidate: Object.freeze({
        ...DataUnderstandingModel.candidate,
        forbiddenContents: Object.freeze(["Entity"]),
        boundaries: Object.freeze({
          ...DataUnderstandingModel.candidate.boundaries,
          businessObjectForbidden: false,
        }),
        registry: Object.freeze({
          ...DataUnderstandingModel.candidate.registry,
          candidatesAreNotBusinessObjects: false,
        }),
      }),
    }),
  );
  assert.equal(result.valid, false);
  assert.ok(result.issues.some((i) => i.code === "CandidatesNotBusinessObjects"));
});

test("10. evidence without limitations fails validation", () => {
  const result = validateDataUnderstandingModel(
    withOverride({
      evidence: Object.freeze({
        ...DataUnderstandingModel.evidence,
        limitationsRequired: false,
        runtimeCalculationForbidden: false,
      }),
    }),
  );
  assert.equal(result.valid, false);
  assert.ok(result.issues.some((i) => i.code === "EvidenceLimitationsRequired"));
});

test("11. ownership and boundary validation", () => {
  assert.ok(DataUnderstandingValidationOwnership.owns.length >= 11);
  assert.ok(DataUnderstandingValidationOwnership.doesNotOwn.length >= 15);
  const owns = new Set(
    DataUnderstandingValidationOwnership.owns.map((s) => s.toLowerCase()),
  );
  for (const item of DataUnderstandingValidationOwnership.doesNotOwn) {
    assert.equal(owns.has(item.toLowerCase()), false, item);
  }
  assert.equal(DataUnderstandingValidationBoundaries.mutatesInput, false);
  assert.equal(DataUnderstandingValidationBoundaries.repairsModels, false);
  assert.equal(DataUnderstandingValidationBoundaries.createsBusinessObjects, false);
  assert.equal(DataUnderstandingValidationBoundaries.createsKnowledgeGraph, false);
  assert.equal(DataUnderstandingValidationBoundaries.persistsData, false);
  assert.equal(DataUnderstandingValidationBoundaries.executesAiModels, false);
  assert.equal(DataUnderstandingValidationBoundaries.executesEngineReasoning, false);

  const boundaryFail = validateDataUnderstandingModel(
    withOverride({
      boundaries: Object.freeze({
        ...DataUnderstandingModel.boundaries,
        createsBusinessObjects: true,
      }),
    }),
  );
  assert.equal(boundaryFail.valid, false);
  assert.ok(boundaryFail.issues.some((i) => i.code === "BoundaryCompliant"));
});

test("12. dependency and reference validation", () => {
  const depFail = validateDataUnderstandingModel(
    withOverride({
      dependencies: Object.freeze({
        dkl31Foundation: Object.freeze({ readyForRegistry: false }),
        dkl32Registry: Object.freeze({ readyForModel: true }),
        pipelineUnderstandingPlatform: Object.freeze({ readyForDKL3Intake: true }),
      }),
    }),
  );
  assert.equal(depFail.valid, false);
  assert.ok(depFail.issues.some((i) => i.code === "DependencyCompliant"));

  const pipelineFail = validateDataUnderstandingModel(
    withOverride({
      pipelineReference: Object.freeze({
        targetPlatform: "DKL-4",
        readiness: "ReadyForDKL3Intake",
        previewOnlyRequired: true,
        contractValidRequired: true,
      }),
    }),
  );
  assert.equal(pipelineFail.valid, false);
  assert.ok(pipelineFail.issues.some((i) => i.code === "PipelineReferenceValid"));
});

test("13. validation never mutates input", () => {
  const input = canonicalInput();
  const before = JSON.stringify(input);
  validateDataUnderstandingModel(input);
  assert.equal(JSON.stringify(input), before);
  assert.equal(
    validateDataUnderstandingModel(input).metadata.inputMutated,
    false,
  );
  assert.equal(
    validateDataUnderstandingModel(input).metadata.modelsRepaired,
    false,
  );
});

test("14. validation results are deeply frozen and deterministic", () => {
  const a = validateDataUnderstandingModel(canonicalInput());
  const b = validateDataUnderstandingModel(canonicalInput());
  assert.equal(isDeeplyFrozen(a), true);
  assert.deepEqual(a, b);
});

test("15. validation report and summary structure", () => {
  const result = validateDataUnderstandingModel(canonicalInput());
  assert.equal(DataUnderstandingValidationReport.producesRepairedModels, false);
  assert.equal(DataUnderstandingValidationReport.producesGeneratedModels, false);
  assert.equal(DataUnderstandingValidationReport.sectionCount, 9);
  assert.equal(result.summary.nextPhase, "DKL-3:5");
  assert.equal(result.summary.valid, true);
  assert.match(result.summary.message, /Ready for DKL-3:5/);
  assert.equal(result.metadata.understandingPerformed, false);
  assert.equal(result.metadata.semanticInferencePerformed, false);
  assert.equal(result.metadata.businessObjectsCreated, false);
  assert.equal(result.metadata.knowledgeGraphCreated, false);
  assert.equal(result.metadata.persistencePerformed, false);
  assert.equal(result.metadata.aiExecuted, false);
  assert.equal(result.metadata.engineReasoningPerformed, false);
});

test("16. dependencies limited to approved public APIs", () => {
  for (const file of DKL34_FILES.filter((f) => !f.endsWith(".test.ts"))) {
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

test("17. no runtime understanding behavior: no classes, async, promises, randomness, clock, uuid", () => {
  for (const file of DKL34_FILES.filter((f) => !f.endsWith(".test.ts"))) {
    const text = readFileSync(join(HERE, file), "utf8");
    assert.equal(/\bclass\s+\w+/.test(text), false, file);
    assert.equal(/\basync\s+function\b/.test(text), false, file);
    assert.equal(/\bnew\s+Promise\b/.test(text), false, file);
    assert.equal(/Math\.random|Date\.now|new Date\(|process\.env/.test(text), false, file);
    assert.equal(/\buuid\b|randomUUID/i.test(text), false, file);
  }
});

test("18. aggregates are deeply frozen", () => {
  assert.equal(isDeeplyFrozen(DataUnderstandingValidation), true);
  assert.equal(isDeeplyFrozen(DataUnderstandingValidationRules), true);
  assert.equal(isDeeplyFrozen(DataUnderstandingValidationOwnership), true);
  assert.equal(isDeeplyFrozen(DataUnderstandingValidationBoundaries), true);
  assert.equal(isDeeplyFrozen(DataUnderstandingValidationManifest), true);
  assert.equal(isDeeplyFrozen(DataUnderstandingValidationReport), true);
});

test("19. processing policy and lifecycle failures are detected", () => {
  const policyFail = validateDataUnderstandingModel(
    withOverride({
      processingPolicy: Object.freeze({
        policies: Object.freeze({
          ...DataUnderstandingModel.processingPolicy.policies,
          allowPersistence: true,
        }),
      }),
    }),
  );
  assert.equal(policyFail.valid, false);
  assert.ok(policyFail.issues.some((i) => i.code === "ProcessingPolicyValid"));

  const lifecycleFail = validateDataUnderstandingModel(
    withOverride({
      lifecycle: Object.freeze({
        allowedStates: Object.freeze(["Received"]),
        stateCount: 1,
      }),
    }),
  );
  assert.equal(lifecycleFail.valid, false);
  assert.ok(lifecycleFail.issues.some((i) => i.code === "LifecycleStatesValid"));
});

test("20. readiness reports ReadyForManifest and next phase DKL-3:5", () => {
  assert.equal(DataUnderstandingValidation.readiness.ReadyForManifest, true);
  assert.equal(DataUnderstandingValidationManifest.readiness, "ReadyForManifest");
  assert.equal(DataUnderstandingValidationManifest.nextPhase, "DKL-3:5");
  assert.equal(
    DataUnderstandingValidation.nextPhase,
    "DKL-3:5 — Data Understanding Manifest",
  );
  assert.equal(DataUnderstandingValidation.readiness.UnderstandingForbidden, true);
  assert.equal(DataUnderstandingValidation.readiness.BusinessObjectCreationForbidden, true);
  assert.equal(DataUnderstandingValidation.readiness.KnowledgeGraphForbidden, true);
  assert.equal(DataUnderstandingValidation.readiness.AIFree, true);
  assert.equal(DataUnderstandingValidation.readiness.EngineFree, true);
});
