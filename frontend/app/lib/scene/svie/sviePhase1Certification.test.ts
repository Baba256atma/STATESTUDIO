import test from "node:test";
import assert from "node:assert/strict";

import {
  SVIE_PHASE1_CERTIFICATION_TAG,
  SVIE_PHASE1_FORBIDDEN_CONSOLE_PATTERNS,
} from "./sviePhase1CertificationContract.ts";
import {
  resetSviePhase1CertificationForTests,
  runSviePhase1Certification,
} from "./sviePhase1Certification.ts";

test.beforeEach(() => {
  resetSviePhase1CertificationForTests();
});

test("runSviePhase1Certification passes all gates and validation checks", () => {
  const result = runSviePhase1Certification({ force: true });

  assert.equal(result.tag, SVIE_PHASE1_CERTIFICATION_TAG);
  assert.equal(result.certified, true);
  assert.ok(result.finalStatus === "PASS" || result.finalStatus === "PASS WITH WARNINGS");

  for (const gate of result.gates) {
    assert.notEqual(gate.status, "FAIL", `${gate.id} ${gate.name}: ${gate.detail}`);
  }

  for (const check of result.validationChecks) {
    assert.equal(check.status, "PASS", `${check.id}: ${check.detail}`);
  }

  assert.equal(result.consoleAudit.status, "PASS");
  assert.equal(result.consoleAudit.violations.length, 0);
});

test("SVIE phase 1 certification caches result until forced", () => {
  const first = runSviePhase1Certification({ force: true });
  const second = runSviePhase1Certification();
  assert.equal(first, second);
});

test("SVIE phase 1 console audit monitors forbidden patterns", () => {
  assert.ok(SVIE_PHASE1_FORBIDDEN_CONSOLE_PATTERNS.includes("[AdvisoryRouteMismatch]"));
  assert.ok(SVIE_PHASE1_FORBIDDEN_CONSOLE_PATTERNS.includes("[Nexora][TopologyPositionMismatch]"));
});

test("SVIE phase 1 exposes gates A through H", () => {
  const result = runSviePhase1Certification({ force: true });
  assert.deepEqual(
    result.gates.map((gate) => gate.id),
    ["A", "B", "C", "D", "E", "F", "G", "H"]
  );
});
