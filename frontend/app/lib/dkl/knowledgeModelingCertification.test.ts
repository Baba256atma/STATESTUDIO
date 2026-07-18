/**
 * DKL-4:7 — Knowledge Modeling Certification Tests.
 *
 * Deterministic coverage for the immutable Knowledge Modeling Certification.
 */

import assert from "node:assert/strict";
import test from "node:test";
import { readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import * as certificationApi from "./knowledgeModelingCertification.ts";
import {
  KnowledgeModelingCertification,
  KnowledgeModelingCertificationIdentity,
  KnowledgeModelingCertificationVersion,
  KnowledgeModelingCertificationNamespace,
  KnowledgeModelingCertificationGates,
  KnowledgeModelingCertificationEvidence,
  runKnowledgeModelingCertification,
  getKnowledgeModelingCertificationSummary,
} from "./knowledgeModelingCertification.ts";
import { KNOWLEDGE_MODELING_CERTIFICATION_CATEGORIES } from "./knowledgeModelingCertificationGates.ts";
import { KnowledgeModelingPlatform } from "./knowledgeModelingPlatform.ts";

const HERE = dirname(fileURLToPath(import.meta.url));

const DKL47_FILES = [
  "knowledgeModelingCertificationTypes.ts",
  "knowledgeModelingCertificationGates.ts",
  "knowledgeModelingCertificationCompatibility.ts",
  "knowledgeModelingCertificationRegression.ts",
  "knowledgeModelingCertificationReadiness.ts",
  "knowledgeModelingCertification.ts",
  "knowledgeModelingCertification.test.ts",
];

test("1. certification files exist", () => {
  for (const file of DKL47_FILES) {
    assert.ok(readdirSync(HERE).includes(file), `missing ${file}`);
  }
});

test("2. exactly eight intentional public exports", () => {
  assert.deepEqual(Object.keys(certificationApi).sort(), [
    "KnowledgeModelingCertification",
    "KnowledgeModelingCertificationEvidence",
    "KnowledgeModelingCertificationGates",
    "KnowledgeModelingCertificationIdentity",
    "KnowledgeModelingCertificationNamespace",
    "KnowledgeModelingCertificationVersion",
    "getKnowledgeModelingCertificationSummary",
    "runKnowledgeModelingCertification",
  ]);
});

test("3. certification identity, version, namespace, status, readiness", () => {
  assert.equal(
    KnowledgeModelingCertificationIdentity.certificationId,
    "DKL-4:7/KnowledgeModelingCertification",
  );
  assert.equal(KnowledgeModelingCertificationIdentity.sourcePhase, "DKL-4:7");
  assert.equal(KnowledgeModelingCertificationIdentity.status, "Certified");
  assert.equal(
    KnowledgeModelingCertificationIdentity.readiness,
    "ReadyForFreeze",
  );
  assert.equal(KnowledgeModelingCertificationVersion, "1.0.0");
  assert.equal(
    KnowledgeModelingCertificationNamespace,
    "nexora.dkl.knowledge-modeling.certification",
  );
});

test("4. certification categories exist and gate IDs are unique", () => {
  assert.equal(KNOWLEDGE_MODELING_CERTIFICATION_CATEGORIES.length, 16);
  assert.equal(KnowledgeModelingCertificationGates.length, 50);
  const ids = KnowledgeModelingCertificationGates.map((g) => g.id);
  assert.equal(new Set(ids).size, ids.length);
  for (const gate of KnowledgeModelingCertificationGates) {
    assert.ok(
      KNOWLEDGE_MODELING_CERTIFICATION_CATEGORIES.includes(gate.category),
      `${gate.id} has invalid category ${gate.category}`,
    );
    assert.equal(gate.mandatory, true);
    assert.equal(gate.deterministic, true);
  }
});

test("5. every mandatory gate has evidence and deterministic ordering", () => {
  const result = runKnowledgeModelingCertification();
  assert.equal(result.evidence.length, 50);
  assert.equal(result.mandatoryGateCount, 50);
  assert.deepEqual(
    KnowledgeModelingCertificationGates.map((g) => g.id),
    result.gateResults.map((g) => g.gateId),
  );
  assert.deepEqual(
    [...KNOWLEDGE_MODELING_CERTIFICATION_CATEGORIES],
    result.categoryResults.map((c) => c.category),
  );
  for (const gate of result.gateResults) {
    const evidence = result.evidence.find((e) => e.gateId === gate.gateId);
    assert.ok(evidence, `missing evidence for ${gate.gateId}`);
    assert.equal(evidence.evidenceId, `EV-${gate.gateId}`);
  }
});

test("6. platform identity, readiness, and section gates pass", () => {
  const result = runKnowledgeModelingCertification();
  const byId = Object.fromEntries(result.gateResults.map((g) => [g.gateId, g]));
  assert.equal(byId["KM-CERT-001"]?.result, "Pass");
  assert.equal(byId["KM-CERT-004"]?.result, "Pass");
  assert.equal(byId["KM-CERT-005"]?.result, "Pass");
  assert.equal(byId["KM-CERT-006"]?.result, "Pass");
  assert.equal(byId["KM-CERT-012"]?.result, "Pass");
  assert.equal(byId["KM-CERT-013"]?.result, "Pass");
});

test("7. canonical section-reference and component gates pass", () => {
  const result = runKnowledgeModelingCertification();
  const byId = Object.fromEntries(result.gateResults.map((g) => [g.gateId, g]));
  for (const id of [
    "KM-CERT-007",
    "KM-CERT-008",
    "KM-CERT-009",
    "KM-CERT-010",
    "KM-CERT-011",
    "KM-CERT-014",
    "KM-CERT-015",
  ]) {
    assert.equal(byId[id]?.result, "Pass", `${id} failed`);
  }
  assert.equal(
    KnowledgeModelingPlatform.foundation,
    KnowledgeModelingPlatform.sections.foundation,
  );
});

test("8. validation and manifest certification gates pass", () => {
  const result = runKnowledgeModelingCertification();
  const byId = Object.fromEntries(result.gateResults.map((g) => [g.gateId, g]));
  for (const id of [
    "KM-CERT-016",
    "KM-CERT-017",
    "KM-CERT-018",
    "KM-CERT-019",
    "KM-CERT-020",
  ]) {
    assert.equal(byId[id]?.result, "Pass", `${id} failed`);
  }
});

test("9. lifecycle progression gates pass", () => {
  const result = runKnowledgeModelingCertification();
  const byId = Object.fromEntries(result.gateResults.map((g) => [g.gateId, g]));
  for (const id of [
    "KM-CERT-021",
    "KM-CERT-022",
    "KM-CERT-023",
    "KM-CERT-024",
    "KM-CERT-025",
    "KM-CERT-026",
  ]) {
    assert.equal(byId[id]?.result, "Pass", `${id} failed`);
  }
});

test("10. ownership, dependency, compatibility, and extension gates pass", () => {
  const result = runKnowledgeModelingCertification();
  const byId = Object.fromEntries(result.gateResults.map((g) => [g.gateId, g]));
  for (const id of [
    "KM-CERT-028",
    "KM-CERT-029",
    "KM-CERT-030",
    "KM-CERT-031",
    "KM-CERT-032",
    "KM-CERT-033",
    "KM-CERT-034",
    "KM-CERT-035",
    "KM-CERT-036",
  ]) {
    assert.equal(byId[id]?.result, "Pass", `${id} failed`);
  }
  assert.ok(KnowledgeModelingCertification.compatibility.entryCount >= 10);
  assert.equal(
    KnowledgeModelingCertification.regression.declarationCount,
    15,
  );
});

test("11. immutability, determinism, and runtime-prohibition gates pass", () => {
  const result = runKnowledgeModelingCertification();
  const byId = Object.fromEntries(result.gateResults.map((g) => [g.gateId, g]));
  for (const id of [
    "KM-CERT-037",
    "KM-CERT-038",
    "KM-CERT-039",
    "KM-CERT-040",
    "KM-CERT-041",
    "KM-CERT-042",
    "KM-CERT-043",
    "KM-CERT-044",
    "KM-CERT-045",
    "KM-CERT-046",
    "KM-CERT-047",
    "KM-CERT-048",
    "KM-CERT-049",
  ]) {
    assert.equal(byId[id]?.result, "Pass", `${id} failed`);
  }
});

test("12. regression checks pass and result counts are accurate", () => {
  const result = runKnowledgeModelingCertification();
  assert.equal(result.regressionCheckCount, 15);
  assert.equal(result.regressionPassCount, 15);
  assert.equal(result.allRegressionChecksPass, true);
  assert.equal(result.passCount, 50);
  assert.equal(result.failCount, 0);
  assert.equal(result.allMandatoryGatesPass, true);
  assert.equal(result.status, "Certified");
  assert.equal(result.readyForFreeze, true);
  assert.equal(result.readiness, "ReadyForFreeze");
});

test("13. overall certified and freeze readiness", () => {
  assert.equal(KnowledgeModelingCertification.result.status, "Certified");
  assert.equal(KnowledgeModelingCertification.result.failCount, 0);
  assert.equal(KnowledgeModelingCertification.freezeReadiness.readyForFreeze, true);
  assert.equal(
    KnowledgeModelingCertification.freezeReadiness.status,
    "ReadyForFreeze",
  );
  assert.equal(byIdGate050(), "Pass");
  function byIdGate050() {
    return KnowledgeModelingCertification.result.gateResults.find(
      (g) => g.gateId === "KM-CERT-050",
    )?.result;
  }
});

test("14. certification result and evidence are frozen; helpers deterministic", () => {
  const r1 = runKnowledgeModelingCertification();
  const r2 = runKnowledgeModelingCertification();
  const s1 = getKnowledgeModelingCertificationSummary();
  const s2 = getKnowledgeModelingCertificationSummary();
  assert.deepEqual(r1.gateResults, r2.gateResults);
  assert.deepEqual(s1, s2);
  assert.equal(Object.isFrozen(r1), true);
  assert.equal(Object.isFrozen(s1), true);
  assert.equal(Object.isFrozen(KnowledgeModelingCertification), true);
  assert.equal(Object.isFrozen(KnowledgeModelingCertificationEvidence), true);
  assert.equal(Object.isFrozen(KnowledgeModelingCertificationEvidence.records), true);
  assert.equal(s1.allMandatoryGatesPass, true);
  assert.equal(s1.readyForFreeze, true);
});

test("15. no source scanning in certification implementation", () => {
  const text = readFileSync(
    join(HERE, "knowledgeModelingCertification.ts"),
    "utf8",
  );
  assert.equal(text.includes("readdirSync"), false);
  assert.equal(text.includes("readFileSync"), false);
  assert.equal(text.includes("fs"), false);
  assert.equal(/Date\.now|Math\.random|process\.env/.test(text), false);
});

test("16. certification sources import only knowledgeModelingPlatform.ts", () => {
  const sources = [
    "knowledgeModelingCertification.ts",
    "knowledgeModelingCertificationCompatibility.ts",
    "knowledgeModelingCertificationRegression.ts",
    "knowledgeModelingCertificationReadiness.ts",
    "knowledgeModelingCertificationGates.ts",
  ];
  for (const file of sources) {
    const text = readFileSync(join(HERE, file), "utf8");
    const imports = [...text.matchAll(/from\s+"(\.\/[^"]+)"/g)].map((m) => m[1]);
    for (const imp of imports) {
      const allowed =
        imp === "./knowledgeModelingPlatform.ts" ||
        imp.startsWith("./knowledgeModelingCertification");
      assert.ok(allowed, `${file} imports disallowed module ${imp}`);
    }
    assert.equal(
      /from\s+"\.\/knowledgeModeling(Foundation|Registry|Model|Validation|Manifest)/.test(
        text,
      ),
      false,
      `${file} must not import DKL-4:1–4:5 directly`,
    );
    assert.equal(
      /from\s+"\.\/dataUnderstanding/.test(text),
      false,
      `${file} must not import DKL-3`,
    );
    assert.equal(
      /knowledgeModelingFreeze|knowledgeModelingPublicIndex/.test(text),
      false,
      `${file} must not import future phases`,
    );
  }
});
