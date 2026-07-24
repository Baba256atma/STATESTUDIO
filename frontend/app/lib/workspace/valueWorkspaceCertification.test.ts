import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import test from "node:test";
import { ValueWorkspaceCertification } from "./valueWorkspaceCertification.ts";

const files = [
  "valueWorkspaceCertification.test.ts",
  "valueWorkspaceCertification.ts",
  "valueWorkspaceCertificationCompliance.ts",
  "valueWorkspaceCertificationCriteria.ts",
  "valueWorkspaceCertificationGates.ts",
  "valueWorkspaceCertificationGuarantees.ts",
  "valueWorkspaceCertificationIdentity.ts",
  "valueWorkspaceCertificationOutcomes.ts",
];

test("WS-9:7 consists of exactly eight Certification artifacts", () => {
  assert.deepEqual(
    readdirSync(new URL(".", import.meta.url))
      .filter((file) => files.includes(file)).sort(),
    files,
  );
});

test("WS-9:7 publishes canonical Certification identity", () => {
  const certification = ValueWorkspaceCertification;
  assert.equal(
    certification.identity.id,
    "WS-9:7/ValueWorkspaceCertification",
  );
  assert.equal(
    certification.identity.namespace,
    "nexora.workspace.value.certification",
  );
  assert.equal(certification.status, "ReadyForFreeze");
  assert.equal(Object.isFrozen(certification), true);
});

test("WS-9:7 declares exactly 18 criteria and 16 gates", () => {
  const certification = ValueWorkspaceCertification;
  assert.equal(certification.criteria.length, 18);
  assert.equal(certification.gates.length, 16);
  assert.equal(
    certification.criteria.every(
      ({ declaredState }) => declaredState === "Satisfied",
    ),
    true,
  );
  assert.equal(
    certification.gates.every(
      ({ declaredState }) => declaredState === "Passed",
    ),
    true,
  );
});

test("WS-9:7 outcomes, guarantees, and compliance are complete", () => {
  const certification = ValueWorkspaceCertification;
  assert.deepEqual(
    certification.outcomes.map(({ name }) => name),
    ["Certified", "CertifiedWithWarnings", "NotCertified", "Blocked"],
  );
  assert.equal(certification.guarantees.length, 6);
  assert.equal(certification.compliance.length, 19);
  assert.equal(certification.compliance.every(({ present }) => !present), true);
});

test("WS-9:7 consumes Platform only and contains no runtime", () => {
  const certification = ValueWorkspaceCertification;
  const source = readFileSync(
    new URL("./valueWorkspaceCertification.ts", import.meta.url),
    "utf8",
  );
  assert.equal(source.includes("./valueWorkspaceManifest"), false);
  assert.equal(source.includes("./valueWorkspaceValidation"), false);
  assert.deepEqual(certification.upstreamDependencies, [
    "WS-9:6 Value Workspace Platform",
  ]);
  assert.equal(certification.runtime, false);
  assert.equal(certification.roiCalculation, false);
  assert.equal(certification.businessLogic, false);
});
