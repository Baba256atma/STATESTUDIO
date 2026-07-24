import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import test from "node:test";
import { DecisionWorkspaceV7Certification } from "./decisionWorkspaceV7Certification.ts";

const files = [
  "decisionWorkspaceV7Certification.test.ts",
  "decisionWorkspaceV7Certification.ts",
  "decisionWorkspaceV7CertificationCompliance.ts",
  "decisionWorkspaceV7CertificationCriteria.ts",
  "decisionWorkspaceV7CertificationGates.ts",
  "decisionWorkspaceV7CertificationGuarantees.ts",
  "decisionWorkspaceV7CertificationIdentity.ts",
  "decisionWorkspaceV7CertificationOutcomes.ts",
];

test("WS-7:7 consists of exactly eight collision-safe Certification artifacts", () => {
  assert.deepEqual(
    readdirSync(new URL(".", import.meta.url))
      .filter((file) => files.includes(file))
      .sort(),
    files,
  );
});

test("WS-7:7 publishes canonical Certification identity", () => {
  const certification = DecisionWorkspaceV7Certification;
  assert.equal(
    certification.identity.id,
    "WS-7:7/DecisionWorkspaceCertification",
  );
  assert.equal(
    certification.identity.namespace,
    "nexora.workspace.decision.certification",
  );
  assert.equal(certification.identity.version, "1.0.0");
  assert.equal(certification.status, "ReadyForFreeze");
  assert.equal(Object.isFrozen(certification), true);
});

test("WS-7:7 declares exactly 18 criteria and 16 gates", () => {
  const certification = DecisionWorkspaceV7Certification;
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

test("WS-7:7 outcomes, guarantees, and compliance are complete", () => {
  const certification = DecisionWorkspaceV7Certification;
  assert.deepEqual(
    certification.outcomes.map(({ name }) => name),
    ["Certified", "CertifiedWithWarnings", "NotCertified", "Blocked"],
  );
  assert.equal(certification.guarantees.length, 6);
  assert.equal(certification.compliance.length, 15);
  assert.equal(certification.compliance.every(({ present }) => !present), true);
  assert.equal(certification.certificationOutcome, "Certified");
});

test("WS-7:7 consumes Platform only and contains no runtime", () => {
  const certification = DecisionWorkspaceV7Certification;
  const source = readFileSync(
    new URL("./decisionWorkspaceV7Certification.ts", import.meta.url),
    "utf8",
  );
  assert.equal(source.includes("./decisionWorkspaceV7Manifest"), false);
  assert.equal(source.includes("./decisionWorkspaceV7Validation"), false);
  assert.deepEqual(certification.upstreamDependencies, [
    "WS-7:6 Decision Workspace Platform",
  ]);
  assert.equal(certification.dependencyVerification.state, "Verified");
  assert.equal(certification.runtime, false);
  assert.equal(certification.certificationEngine, false);
  assert.equal(certification.businessLogic, false);
});
