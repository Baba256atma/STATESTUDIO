import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import test from "node:test";
import { TimelineWorkspaceCertification } from "./timelineWorkspaceCertification.ts";

const files = [
  "timelineWorkspaceCertification.test.ts",
  "timelineWorkspaceCertification.ts",
  "timelineWorkspaceCertificationCompliance.ts",
  "timelineWorkspaceCertificationCriteria.ts",
  "timelineWorkspaceCertificationGates.ts",
  "timelineWorkspaceCertificationGuarantees.ts",
  "timelineWorkspaceCertificationIdentity.ts",
  "timelineWorkspaceCertificationOutcomes.ts",
];

test("WS-10:7 consists of exactly eight Certification artifacts", () => {
  assert.deepEqual(
    readdirSync(new URL(".", import.meta.url))
      .filter((file) => files.includes(file)).sort(),
    files,
  );
});

test("WS-10:7 publishes canonical Certification identity", () => {
  const certification = TimelineWorkspaceCertification;
  assert.equal(
    certification.identity.id,
    "WS-10:7/TimelineWorkspaceCertification",
  );
  assert.equal(
    certification.identity.namespace,
    "nexora.workspace.timeline.certification",
  );
  assert.equal(certification.status, "ReadyForFreeze");
  assert.equal(Object.isFrozen(certification), true);
});

test("WS-10:7 declares exactly 18 criteria and 16 gates", () => {
  const certification = TimelineWorkspaceCertification;
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

test("WS-10:7 outcomes, guarantees, and compliance are complete", () => {
  const certification = TimelineWorkspaceCertification;
  assert.deepEqual(
    certification.outcomes.map(({ name }) => name),
    ["Certified", "CertifiedWithWarnings", "NotCertified", "Blocked"],
  );
  assert.equal(certification.guarantees.length, 6);
  assert.equal(certification.compliance.length, 19);
  assert.equal(certification.compliance.every(({ present }) => !present), true);
});

test("WS-10:7 consumes Platform only and contains no runtime", () => {
  const certification = TimelineWorkspaceCertification;
  const source = readFileSync(
    new URL("./timelineWorkspaceCertification.ts", import.meta.url),
    "utf8",
  );
  assert.equal(source.includes("./timelineWorkspaceManifest"), false);
  assert.equal(source.includes("./timelineWorkspaceValidation"), false);
  assert.deepEqual(certification.upstreamDependencies, [
    "WS-10:6 Timeline Workspace Platform",
  ]);
  assert.equal(certification.runtime, false);
  assert.equal(certification.timelinePlayback, false);
  assert.equal(certification.businessLogic, false);
});
