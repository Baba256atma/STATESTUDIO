import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import test from "node:test";
import { WarRoomWorkspaceCertification } from "./warRoomWorkspaceCertification.ts";

const files = [
  "warRoomWorkspaceCertification.test.ts",
  "warRoomWorkspaceCertification.ts",
  "warRoomWorkspaceCertificationCompliance.ts",
  "warRoomWorkspaceCertificationCriteria.ts",
  "warRoomWorkspaceCertificationGates.ts",
  "warRoomWorkspaceCertificationGuarantees.ts",
  "warRoomWorkspaceCertificationIdentity.ts",
  "warRoomWorkspaceCertificationOutcomes.ts",
];

test("WS-8:7 consists of exactly eight Certification artifacts", () => {
  assert.deepEqual(
    readdirSync(new URL(".", import.meta.url))
      .filter((file) => files.includes(file)).sort(),
    files,
  );
});

test("WS-8:7 publishes canonical Certification identity", () => {
  const certification = WarRoomWorkspaceCertification;
  assert.equal(
    certification.identity.id, "WS-8:7/WarRoomWorkspaceCertification",
  );
  assert.equal(
    certification.identity.namespace,
    "nexora.workspace.war-room.certification",
  );
  assert.equal(certification.status, "ReadyForFreeze");
  assert.equal(Object.isFrozen(certification), true);
});

test("WS-8:7 declares exactly 18 criteria and 16 gates", () => {
  const certification = WarRoomWorkspaceCertification;
  assert.equal(certification.criteria.length, 18);
  assert.equal(certification.gates.length, 16);
  assert.equal(
    certification.criteria.every(
      ({ declaredState }) => declaredState === "Satisfied",
    ), true,
  );
  assert.equal(
    certification.gates.every(
      ({ declaredState }) => declaredState === "Passed",
    ), true,
  );
});

test("WS-8:7 outcomes, guarantees, and compliance are complete", () => {
  const certification = WarRoomWorkspaceCertification;
  assert.deepEqual(
    certification.outcomes.map(({ name }) => name),
    ["Certified", "CertifiedWithWarnings", "NotCertified", "Blocked"],
  );
  assert.equal(certification.guarantees.length, 6);
  assert.equal(certification.compliance.length, 18);
  assert.equal(certification.compliance.every(({ present }) => !present), true);
});

test("WS-8:7 consumes Platform only and contains no runtime", () => {
  const certification = WarRoomWorkspaceCertification;
  const source = readFileSync(
    new URL("./warRoomWorkspaceCertification.ts", import.meta.url), "utf8",
  );
  assert.equal(source.includes("./warRoomWorkspaceManifest"), false);
  assert.equal(source.includes("./warRoomWorkspaceValidation"), false);
  assert.deepEqual(certification.upstreamDependencies, [
    "WS-8:6 War Room Workspace Platform",
  ]);
  assert.equal(certification.runtime, false);
  assert.equal(certification.liveMonitoring, false);
  assert.equal(certification.businessLogic, false);
});
