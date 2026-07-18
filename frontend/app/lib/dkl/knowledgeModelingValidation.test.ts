/**
 * DKL-4:4 — Knowledge Modeling Validation Tests.
 */

import assert from "node:assert/strict";
import test from "node:test";
import { readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import * as validationApi from "./knowledgeModelingValidation.ts";
import {
  KnowledgeModelingValidation,
  KnowledgeModelingValidationIdentity,
  KnowledgeModelingValidationVersion,
  KnowledgeModelingValidationNamespace,
  KnowledgeModelingValidationRules,
  KnowledgeModelingValidationOwnership,
  KnowledgeModelingValidationReport,
  validateKnowledgeModelingArchitecture,
} from "./knowledgeModelingValidation.ts";

const HERE = dirname(fileURLToPath(import.meta.url));

const DKL44_FILES = [
  "knowledgeModelingValidationTypes.ts",
  "knowledgeModelingValidationRules.ts",
  "knowledgeModelingValidationOwnership.ts",
  "knowledgeModelingValidationBoundaries.ts",
  "knowledgeModelingValidation.ts",
  "knowledgeModelingValidation.test.ts",
];

test("1. validation files exist", () => {
  for (const file of DKL44_FILES) {
    assert.ok(readdirSync(HERE).includes(file), `missing ${file}`);
  }
});

test("2. exactly eight public exports", () => {
  assert.deepEqual(Object.keys(validationApi).sort(), [
    "KnowledgeModelingValidation",
    "KnowledgeModelingValidationIdentity",
    "KnowledgeModelingValidationNamespace",
    "KnowledgeModelingValidationOwnership",
    "KnowledgeModelingValidationReport",
    "KnowledgeModelingValidationRules",
    "KnowledgeModelingValidationVersion",
    "validateKnowledgeModelingArchitecture",
  ]);
});

test("3. identity and readiness", () => {
  assert.equal(
    KnowledgeModelingValidationIdentity.validationId,
    "DKL-4:4/KnowledgeModelingValidation",
  );
  assert.equal(KnowledgeModelingValidationIdentity.status, "ValidationComplete");
  assert.equal(KnowledgeModelingValidationIdentity.readiness, "ReadyForManifest");
  assert.equal(KnowledgeModelingValidationVersion, "1.0.0");
  assert.equal(
    KnowledgeModelingValidationNamespace,
    "nexora.dkl.knowledge-modeling.validation",
  );
});

test("4. rules catalog and architectural validation pass", () => {
  assert.equal(KnowledgeModelingValidationRules.length, 24);
  assert.equal(KnowledgeModelingValidation.report.categoryCount, 8);
  const result = validateKnowledgeModelingArchitecture();
  assert.equal(result.status, "Validated");
  assert.equal(result.failCount, 0);
  assert.equal(result.passCount, 24);
  assert.equal(result.readiness, "ReadyForManifest");
  assert.equal(result.inputMutated, false);
  assert.equal(result.repaired, false);
  assert.equal(KnowledgeModelingValidationReport.status, "Validated");
  assert.equal(KnowledgeModelingValidation.readiness.ReadyForManifest, true);
});

test("5. public-entry-point-only dependencies", () => {
  for (const file of DKL44_FILES.filter((f) => !f.endsWith(".test.ts"))) {
    const text = readFileSync(join(HERE, file), "utf8");
    const imports = [...text.matchAll(/from\s+["']([^"']+)["']/g)].map((m) => m[1]!);
    for (const spec of imports) {
      assert.equal(/dataUnderstanding/i.test(spec), false, `${file}: ${spec}`);
      if (spec.includes("knowledgeModeling") && !spec.includes("Validation")) {
        assert.ok(
          /knowledgeModelingFoundation\.ts$/.test(spec) ||
            /knowledgeModelingRegistry\.ts$/.test(spec) ||
            /knowledgeModelingModel\.ts$/.test(spec),
          `${file} forbidden: ${spec}`,
        );
      }
    }
  }
});

test("6. ownership and no runtime leakage", () => {
  assert.ok(KnowledgeModelingValidationOwnership.owns.length >= 4);
  assert.ok(
    KnowledgeModelingValidationOwnership.doesNotOwn.includes(
      "Operational payload validation",
    ),
  );
  assert.equal(KnowledgeModelingValidation.nextPhase, "DKL-4:5 — Knowledge Modeling Manifest");
  const text = readFileSync(join(HERE, "knowledgeModelingValidation.ts"), "utf8");
  assert.equal(/\bclass\s+\w+/.test(text), false);
  assert.equal(/Math\.random|Date\.now/.test(text), false);
});
