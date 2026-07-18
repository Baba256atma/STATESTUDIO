/**
 * DKL-5:7 — Knowledge Validation Certification Tests.
 *
 * Deterministic coverage for canonical DKL-5 Certification.
 */

import assert from "node:assert/strict";
import test from "node:test";
import { readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import * as certificationApi from "./knowledgeValidationCertification.ts";
import {
  KnowledgeValidationCertification,
  KnowledgeValidationCertificationIdentity,
  KnowledgeValidationCertificationVersion,
  KnowledgeValidationCertificationNamespace,
  KnowledgeValidationCertificationGates,
  KnowledgeValidationCertificationEvidence,
  runKnowledgeValidationCertification,
  getKnowledgeValidationCertificationSummary,
} from "./knowledgeValidationCertification.ts";
import { KnowledgeValidationPlatform } from "./knowledgeValidationPlatform.ts";

const HERE = dirname(fileURLToPath(import.meta.url));

const DKL57_FILES = [
  "knowledgeValidationCertificationTypes.ts",
  "knowledgeValidationCertificationGates.ts",
  "knowledgeValidationCertificationCompatibility.ts",
  "knowledgeValidationCertificationRegression.ts",
  "knowledgeValidationCertificationReadiness.ts",
  "knowledgeValidationCertification.ts",
  "knowledgeValidationCertification.test.ts",
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

test("1. DKL-5:7 certification files exist", () => {
  for (const file of DKL57_FILES) {
    assert.ok(readdirSync(HERE).includes(file), `missing ${file}`);
  }
});

test("2. exactly eight public exports", () => {
  assert.deepEqual(Object.keys(certificationApi).sort(), [
    "KnowledgeValidationCertification",
    "KnowledgeValidationCertificationEvidence",
    "KnowledgeValidationCertificationGates",
    "KnowledgeValidationCertificationIdentity",
    "KnowledgeValidationCertificationNamespace",
    "KnowledgeValidationCertificationVersion",
    "getKnowledgeValidationCertificationSummary",
    "runKnowledgeValidationCertification",
  ]);
});

test("3. identity, version, namespace", () => {
  assert.equal(
    KnowledgeValidationCertificationIdentity.certificationId,
    "DKL-5:7/KnowledgeValidationCertification",
  );
  assert.equal(KnowledgeValidationCertificationIdentity.phase, "DKL-5:7");
  assert.equal(KnowledgeValidationCertificationIdentity.status, "Certified");
  assert.equal(
    KnowledgeValidationCertificationIdentity.readiness,
    "ReadyForFreeze",
  );
  assert.equal(KnowledgeValidationCertificationVersion, "1.0.0");
  assert.equal(
    KnowledgeValidationCertificationNamespace,
    "nexora.dkl.knowledge-validation.certification",
  );
});

test("4. dependency only on knowledgeValidationPlatform.ts", () => {
  for (const file of DKL57_FILES.filter((f) => !f.endsWith(".test.ts"))) {
    const text = readFileSync(join(HERE, file), "utf8");
    const imports = [...text.matchAll(/from\s+["']([^"']+)["']/g)].map(
      (match) => match[1]!,
    );
    for (const spec of imports) {
      if (spec.includes("knowledgeValidation") && !spec.includes("Certification")) {
        assert.ok(
          spec.endsWith("knowledgeValidationPlatform.ts"),
          `${file} forbidden: ${spec}`,
        );
      }
      assert.equal(/knowledgeModeling/i.test(spec), false, `${file}: ${spec}`);
      assert.equal(
        /knowledgeValidationFoundation\.ts|knowledgeValidationRegistry\.ts|knowledgeValidationModel\.ts|knowledgeValidationValidation\.ts|knowledgeValidationManifest\.ts/.test(
          spec,
        ),
        false,
        `${file}: direct prior-phase import ${spec}`,
      );
    }
  }
});

test("5. categories, unique gate IDs, one category per gate", () => {
  assert.equal(KnowledgeValidationCertification.categories.length, 24);
  assert.equal(KnowledgeValidationCertificationGates.length, 85);
  const ids = KnowledgeValidationCertificationGates.map((gate) => gate.id);
  assert.equal(new Set(ids).size, ids.length);
  for (const gate of KnowledgeValidationCertificationGates) {
    assert.ok(
      KnowledgeValidationCertification.categories.includes(gate.category),
      gate.id,
    );
    assert.equal(gate.mandatory, true);
    assert.equal(gate.deterministic, true);
    assert.equal(gate.runtimeDataRequired, false);
  }
  assert.deepEqual(
    [...KnowledgeValidationCertification.categories],
    KnowledgeValidationCertification.result.categoryResults.map(
      (result) => result.category,
    ),
  );
});

test("6. every mandatory gate has evidence; ordering deterministic", () => {
  assert.equal(
    KnowledgeValidationCertificationEvidence.recordCount,
    KnowledgeValidationCertificationGates.length,
  );
  for (const gate of KnowledgeValidationCertificationGates) {
    const evidence = KnowledgeValidationCertificationEvidence.records.find(
      (record) => record.gateId === gate.id,
    );
    assert.ok(evidence, gate.id);
    assert.equal(evidence!.runtimeDataUsed, false);
    assert.equal(evidence!.deterministic, true);
  }
  assert.deepEqual(
    KnowledgeValidationCertificationGates.map((gate) => gate.id),
    KnowledgeValidationCertification.result.gateResults.map(
      (result) => result.gateId,
    ),
  );
});

test("7. platform, sections, components, and phase status gates pass", () => {
  const byId = Object.fromEntries(
    KnowledgeValidationCertification.result.gateResults.map((result) => [
      result.gateId,
      result,
    ]),
  );
  for (const id of [
    "KV-CERT-001",
    "KV-CERT-004",
    "KV-CERT-005",
    "KV-CERT-006",
    "KV-CERT-007",
    "KV-CERT-008",
    "KV-CERT-009",
    "KV-CERT-010",
    "KV-CERT-011",
    "KV-CERT-012",
    "KV-CERT-013",
    "KV-CERT-014",
    "KV-CERT-015",
    "KV-CERT-016",
    "KV-CERT-017",
    "KV-CERT-018",
    "KV-CERT-019",
    "KV-CERT-020",
    "KV-CERT-021",
    "KV-CERT-022",
    "KV-CERT-023",
    "KV-CERT-024",
    "KV-CERT-025",
    "KV-CERT-026",
    "KV-CERT-027",
    "KV-CERT-028",
    "KV-CERT-029",
  ]) {
    assert.equal(byId[id]!.result, "Pass", id);
  }
  assert.equal(
    KnowledgeValidationCertification.certifiedPlatform,
    KnowledgeValidationPlatform,
  );
});

test("8. inventory, validation, evidence, and protection counts", () => {
  const byId = Object.fromEntries(
    KnowledgeValidationCertification.result.gateResults.map((result) => [
      result.gateId,
      result,
    ]),
  );
  for (const id of [
    "KV-CERT-030",
    "KV-CERT-031",
    "KV-CERT-032",
    "KV-CERT-033",
    "KV-CERT-034",
    "KV-CERT-035",
    "KV-CERT-036",
    "KV-CERT-037",
    "KV-CERT-038",
    "KV-CERT-039",
    "KV-CERT-040",
    "KV-CERT-041",
    "KV-CERT-042",
    "KV-CERT-043",
    "KV-CERT-044",
    "KV-CERT-045",
    "KV-CERT-046",
    "KV-CERT-047",
  ]) {
    assert.equal(byId[id]!.result, "Pass", id);
  }
});

test("9. evidence, explainability, consumer readiness, executive usability", () => {
  const byId = Object.fromEntries(
    KnowledgeValidationCertification.result.gateResults.map((result) => [
      result.gateId,
      result,
    ]),
  );
  for (const id of [
    "KV-CERT-063",
    "KV-CERT-064",
    "KV-CERT-065",
    "KV-CERT-066",
    "KV-CERT-067",
  ]) {
    assert.equal(byId[id]!.result, "Pass", id);
  }
});

test("10. ownership, dependency, compatibility, extension, immutability", () => {
  const byId = Object.fromEntries(
    KnowledgeValidationCertification.result.gateResults.map((result) => [
      result.gateId,
      result,
    ]),
  );
  for (const id of [
    "KV-CERT-048",
    "KV-CERT-049",
    "KV-CERT-050",
    "KV-CERT-051",
    "KV-CERT-052",
    "KV-CERT-053",
    "KV-CERT-054",
    "KV-CERT-055",
    "KV-CERT-056",
    "KV-CERT-057",
    "KV-CERT-058",
    "KV-CERT-059",
    "KV-CERT-060",
    "KV-CERT-061",
    "KV-CERT-062",
  ]) {
    assert.equal(byId[id]!.result, "Pass", id);
  }
});

test("11. prohibition gates pass", () => {
  const byId = Object.fromEntries(
    KnowledgeValidationCertification.result.gateResults.map((result) => [
      result.gateId,
      result,
    ]),
  );
  for (const id of [
    "KV-CERT-068",
    "KV-CERT-069",
    "KV-CERT-070",
    "KV-CERT-071",
    "KV-CERT-072",
    "KV-CERT-073",
    "KV-CERT-074",
    "KV-CERT-075",
    "KV-CERT-076",
    "KV-CERT-077",
    "KV-CERT-078",
    "KV-CERT-079",
    "KV-CERT-080",
    "KV-CERT-081",
    "KV-CERT-082",
    "KV-CERT-083",
    "KV-CERT-084",
    "KV-CERT-085",
  ]) {
    assert.equal(byId[id]!.result, "Pass", id);
  }
});

test("12. regression complete; overall Certified; ReadyForFreeze", () => {
  const result = KnowledgeValidationCertification.result;
  assert.equal(result.status, "Certified");
  assert.equal(result.readiness, "ReadyForFreeze");
  assert.equal(result.allMandatoryGatesPass, true);
  assert.equal(result.allRegressionChecksPass, true);
  assert.equal(result.failCount, 0);
  assert.equal(result.passCount, 85);
  assert.equal(result.mandatoryGateCount, 85);
  assert.equal(result.regressionCheckCount, 30);
  assert.equal(result.regressionPassCount, 30);
  assert.equal(result.readyForFreeze, true);
  assert.equal(
    KnowledgeValidationCertification.freezeReadiness.status,
    "ReadyForFreeze",
  );
  assert.equal(KnowledgeValidationCertification.regression.declarationCount, 30);
});

test("13. runner and summary deterministic; outputs frozen", () => {
  assert.deepEqual(
    runKnowledgeValidationCertification(),
    runKnowledgeValidationCertification(),
  );
  assert.deepEqual(
    getKnowledgeValidationCertificationSummary(),
    getKnowledgeValidationCertificationSummary(),
  );
  assert.equal(runKnowledgeValidationCertification.length, 0);
  assert.equal(getKnowledgeValidationCertificationSummary.length, 0);
  assert.equal(Object.isFrozen(KnowledgeValidationCertification), true);
  assert.equal(isDeeplyFrozen(KnowledgeValidationCertificationGates), true);
  assert.equal(isDeeplyFrozen(KnowledgeValidationCertificationEvidence), true);
  assert.equal(isDeeplyFrozen(runKnowledgeValidationCertification()), true);
  const summary = getKnowledgeValidationCertificationSummary();
  assert.equal(summary.status, "Certified");
  assert.equal(summary.readyForFreeze, true);
  assert.equal(summary.categoryCount, 24);
  assert.equal(summary.evidenceCount, 85);
});

test("14. no forbidden patterns in certification sources", () => {
  for (const file of DKL57_FILES.filter((f) => !f.endsWith(".test.ts"))) {
    const text = readFileSync(join(HERE, file), "utf8");
    assert.equal(/\bclass\s+\w+/.test(text), false, file);
    assert.equal(
      /Date\.now|new Date\(|Math\.random|process\.env/.test(text),
      false,
      file,
    );
    assert.equal(
      /\breadFileSync\b|\breaddirSync\b|\bfetch\s*\(/.test(text),
      false,
      file,
    );
    assert.equal(
      /\bfunction\s+(calculateTrust|calculateScore|cleanse|remediate)\b/i.test(
        text,
      ),
      false,
      file,
    );
  }
});
