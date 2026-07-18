/**
 * DKL-5:4 — Knowledge Validation Validation Tests.
 *
 * Deterministic coverage for architectural validation of DKL-5:1–5:3.
 */

import assert from "node:assert/strict";
import test from "node:test";
import { readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import * as validationApi from "./knowledgeValidationValidation.ts";
import {
  KnowledgeValidationValidation,
  KnowledgeValidationValidationIdentity,
  KnowledgeValidationValidationVersion,
  KnowledgeValidationValidationNamespace,
  KnowledgeValidationValidationRules,
  KnowledgeValidationValidationCategories,
  runKnowledgeValidationValidation,
  getKnowledgeValidationValidationSummary,
} from "./knowledgeValidationValidation.ts";

const HERE = dirname(fileURLToPath(import.meta.url));

const DKL54_FILES = [
  "knowledgeValidationValidationTypes.ts",
  "knowledgeValidationValidationRules.ts",
  "knowledgeValidationFoundationValidation.ts",
  "knowledgeValidationRegistryValidation.ts",
  "knowledgeValidationModelValidation.ts",
  "knowledgeValidationCrossPhaseValidation.ts",
  "knowledgeValidationValidation.ts",
  "knowledgeValidationValidation.test.ts",
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

test("1. DKL-5:4 validation files exist", () => {
  for (const file of DKL54_FILES) {
    assert.ok(readdirSync(HERE).includes(file), `missing ${file}`);
  }
});

test("2. exactly eight public exports", () => {
  assert.deepEqual(Object.keys(validationApi).sort(), [
    "KnowledgeValidationValidation",
    "KnowledgeValidationValidationCategories",
    "KnowledgeValidationValidationIdentity",
    "KnowledgeValidationValidationNamespace",
    "KnowledgeValidationValidationRules",
    "KnowledgeValidationValidationVersion",
    "getKnowledgeValidationValidationSummary",
    "runKnowledgeValidationValidation",
  ]);
});

test("3. identity, version, namespace, status, readiness", () => {
  assert.equal(
    KnowledgeValidationValidationIdentity.validationId,
    "DKL-5:4/KnowledgeValidationValidation",
  );
  assert.equal(KnowledgeValidationValidationIdentity.sourcePhase, "DKL-5:4");
  assert.equal(KnowledgeValidationValidationIdentity.status, "ValidationComplete");
  assert.equal(KnowledgeValidationValidationIdentity.readiness, "ReadyForManifest");
  assert.equal(KnowledgeValidationValidationVersion, "1.0.0");
  assert.equal(
    KnowledgeValidationValidationNamespace,
    "nexora.dkl.knowledge-validation.validation",
  );
  assert.equal(KnowledgeValidationValidation.readiness.ValidationComplete, true);
  assert.equal(KnowledgeValidationValidation.readiness.ReadyForManifest, true);
});

test("4. dependencies only on Foundation, Registry, and Model entry points", () => {
  assert.equal(KnowledgeValidationValidation.dependencies.approvedDependencyCount, 3);
  assert.deepEqual(
    KnowledgeValidationValidation.dependencies.approved.map((d) => d.module),
    [
      "knowledgeValidationFoundation.ts",
      "knowledgeValidationRegistry.ts",
      "knowledgeValidationModel.ts",
    ],
  );

  for (const file of DKL54_FILES.filter((f) => !f.endsWith(".test.ts"))) {
    const text = readFileSync(join(HERE, file), "utf8");
    const imports = [...text.matchAll(/from\s+["']([^"']+)["']/g)].map((m) => m[1]!);
    for (const spec of imports) {
      assert.equal(/knowledgeModeling/i.test(spec), false, `${file}: ${spec}`);
      if (spec.includes("knowledgeValidation") && !spec.includes("Validation")) {
        assert.ok(
          /knowledgeValidationFoundation\.ts$/.test(spec) ||
            /knowledgeValidationRegistry\.ts$/.test(spec) ||
            /knowledgeValidationModel\.ts$/.test(spec),
          `${file} forbidden: ${spec}`,
        );
      }
      assert.equal(
        /knowledgeValidationFoundationTypes|knowledgeValidationContracts|knowledgeValidationRegistryTypes|knowledgeValidationRegistryCatalog|knowledgeValidationModelTypes|knowledgeValidationModelHelpers/.test(
          spec,
        ),
        false,
        `${file}: internal prior-phase import ${spec}`,
      );
    }
  }
});

test("5. categories and unique deterministic rules", () => {
  assert.equal(KnowledgeValidationValidationCategories.length, 27);
  assert.ok(KnowledgeValidationValidationRules.length >= 27);
  const ids = KnowledgeValidationValidationRules.map((rule) => rule.id);
  assert.equal(new Set(ids).size, ids.length);
  assert.deepEqual(
    ids,
    [...ids].sort((a, b) => {
      const order = KnowledgeValidationValidationRules.map((rule) => rule.id);
      return order.indexOf(a) - order.indexOf(b);
    }),
  );

  for (const category of KnowledgeValidationValidationCategories) {
    const scoped = KnowledgeValidationValidationRules.filter(
      (rule) => rule.category === category,
    );
    assert.ok(scoped.length >= 1, `category ${category} has no rules`);
  }

  for (const rule of KnowledgeValidationValidationRules) {
    assert.equal(rule.deterministic, true);
    assert.equal(rule.runtimeDataRequired, false);
    assert.equal(rule.mandatory, true);
    assert.equal(rule.status, "Active");
    assert.ok(KnowledgeValidationValidationCategories.includes(rule.category));
  }
});

test("6. foundation, registry, model, and cross-phase rules pass", () => {
  const result = runKnowledgeValidationValidation();
  assert.equal(result.overallStatus, "Pass");
  assert.equal(result.failures.length, 0);
  assert.equal(result.summary.failCount, 0);
  assert.equal(result.readiness, "ReadyForManifest");
  assert.equal(result.ruleResults.length, KnowledgeValidationValidationRules.length);

  for (const ruleResult of result.ruleResults) {
    assert.equal(ruleResult.status, "Pass", ruleResult.ruleId);
    assert.equal(ruleResult.evidence.runtimeDataUsed, false);
    assert.equal(ruleResult.evidence.immutable, true);
  }

  const byCategory = Object.fromEntries(
    result.categoryResults.map((entry) => [entry.category, entry]),
  );
  assert.equal(byCategory.Foundation?.status, "Pass");
  assert.equal(byCategory.Registry?.status, "Pass");
  assert.equal(byCategory.Model?.status, "Pass");
  assert.equal(byCategory.CrossPhase?.status, "Pass");
  assert.equal(byCategory.Prohibition?.status, "Pass");
});

test("7. vocabulary and model coverage counts", () => {
  const result = runKnowledgeValidationValidation();
  const passed = new Set(
    result.ruleResults.filter((r) => r.status === "Pass").map((r) => r.ruleId),
  );
  for (const id of [
    "KV-VAL-TGT-001",
    "KV-VAL-TGT-002",
    "KV-VAL-DIM-001",
    "KV-VAL-DIM-002",
    "KV-VAL-SIG-001",
    "KV-VAL-SIG-002",
    "KV-VAL-OUT-001",
    "KV-VAL-OUT-002",
    "KV-VAL-SEV-001",
    "KV-VAL-SEV-002",
    "KV-VAL-MDL-001",
    "KV-VAL-MDL-004",
    "KV-VAL-XPH-002",
    "KV-VAL-XPH-003",
    "KV-VAL-PRH-001",
    "KV-VAL-RDY-001",
  ]) {
    assert.ok(passed.has(id), id);
  }
  assert.ok(
    result.ruleResults.find((r) => r.ruleId === "KV-VAL-MDL-001")?.evidence
      .observedDeclaration.includes("modelCount=30"),
  );
  assert.ok(
    result.ruleResults.find((r) => r.ruleId === "KV-VAL-MDL-004")?.evidence
      .observedDeclaration.includes("declarationCount=14"),
  );
});

test("8. summary totals, readiness, frozen results, deterministic helpers", () => {
  const first = runKnowledgeValidationValidation();
  const second = runKnowledgeValidationValidation();
  const summaryA = getKnowledgeValidationValidationSummary();
  const summaryB = getKnowledgeValidationValidationSummary();

  assert.equal(first.ruleResults.length, KnowledgeValidationValidationRules.length);
  assert.equal(first.summary.ruleCount, first.ruleResults.length);
  assert.equal(first.summary.passCount, first.ruleResults.length);
  assert.equal(first.summary.failCount, 0);
  assert.equal(first.summary.overallStatus, "Pass");
  assert.equal(first.summary.readiness, "ReadyForManifest");
  assert.equal(first.summary.categoryCount, 27);
  assert.equal(first.summary.categoryResults.length, 27);
  assert.equal(first.summary.runtimeOrganizationalDataAccepted, false);
  assert.equal(first.summary.sourceScanningUsed, false);
  assert.equal(first.summary.scoringPerformed, false);
  assert.equal(first.summary.trustCalculated, false);

  assert.deepEqual(first.summary, second.summary);
  assert.deepEqual(summaryA, summaryB);
  assert.deepEqual(summaryA, first.summary);
  assert.equal(isDeeplyFrozen(first), true);
  assert.equal(isDeeplyFrozen(summaryA), true);
  assert.equal(KnowledgeValidationValidation.result.overallStatus, "Pass");
  assert.equal(KnowledgeValidationValidation.nextPhase, "DKL-5:5 — Knowledge Validation Manifest");
});

test("9. no classes, timestamps, scoring, or live-data APIs", () => {
  for (const file of DKL54_FILES.filter((f) => !f.endsWith(".test.ts"))) {
    const text = readFileSync(join(HERE, file), "utf8");
    assert.equal(/\bclass\s+\w+/.test(text), false, file);
    assert.equal(/Date\.now|new Date\(|Math\.random|process\.env/.test(text), false, file);
    assert.equal(/readFileSync|fetch\(|fs\.|database/i.test(text), false, file);
    assert.equal(/calculateTrust|calculateScore|remediateLive/i.test(text), false, file);
  }
  assert.equal(
    typeof runKnowledgeValidationValidation === "function" &&
      typeof getKnowledgeValidationValidationSummary === "function",
    true,
  );
  assert.equal(runKnowledgeValidationValidation.length, 0);
  assert.equal(getKnowledgeValidationValidationSummary.length, 0);
});
