import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import test from "node:test";
import { ProblemWorkspaceFreeze } from "./problemWorkspaceFreeze.ts";

const files = [
  "problemWorkspaceFreeze.test.ts",
  "problemWorkspaceFreeze.ts",
  "problemWorkspaceFreezeCompatibility.ts",
  "problemWorkspaceFreezeGuarantees.ts",
  "problemWorkspaceFreezeIdentity.ts",
  "problemWorkspaceFreezeLock.ts",
  "problemWorkspaceFreezePublicApi.ts",
  "problemWorkspaceFrozenBaselines.ts",
];

test("WS-6:8 consists of exactly eight Freeze artifacts", () => {
  assert.deepEqual(
    readdirSync(new URL(".", import.meta.url))
      .filter((file) => files.includes(file))
      .sort(),
    files,
  );
});

test("WS-6:8 publishes its canonical immutable lock", () => {
  const freeze = ProblemWorkspaceFreeze;
  assert.equal(freeze.identity.id, "WS-6:8/ProblemWorkspaceFreeze");
  assert.equal(freeze.identity.namespace, "nexora.workspace.problem.freeze");
  assert.equal(freeze.identity.version, "1.0.0");
  assert.equal(freeze.lock.id, "WS-6-PROBLEM-WORKSPACE-LOCKED");
  assert.equal(freeze.lock.status, "Locked");
  assert.equal(freeze.lock.mutationAllowed, false);
  assert.equal(Object.isFrozen(freeze), true);
});

test("WS-6:8 freezes eight baselines and the complete architecture chain", () => {
  const freeze = ProblemWorkspaceFreeze;
  assert.equal(freeze.baselines.length, 8);
  assert.deepEqual(freeze.metadata.architectureChain, [
    "Foundation",
    "Registry",
    "Model",
    "Validation",
    "Manifest",
    "Platform",
    "Certification",
    "Freeze",
  ]);
  assert.equal(
    freeze.baselines[6].source,
    freeze.certification,
  );
});

test("WS-6:8 publishes deterministic compatibility, guarantees, and APIs", () => {
  const freeze = ProblemWorkspaceFreeze;
  assert.equal(freeze.compatibility.length, 8);
  assert.equal(freeze.guarantees.length, 8);
  assert.equal(freeze.publicApi.length, 8);
  assert.equal(new Set(freeze.publicApi.map(({ id }) => id)).size, 8);
  assert.deepEqual(
    freeze.publicApi.map(({ order }) => order),
    freeze.publicApi.map((_, index) => index + 1),
  );
  assert.equal(freeze.readiness, "ReadyForPublicIndex");
});

test("WS-6:8 consumes Certification only and contains no runtime", () => {
  const freeze = ProblemWorkspaceFreeze;
  const source = readFileSync(
    new URL("./problemWorkspaceFreeze.ts", import.meta.url),
    "utf8",
  );
  assert.equal(source.includes("./problemWorkspacePlatform"), false);
  assert.equal(source.includes("./problemWorkspaceManifest"), false);
  assert.deepEqual(freeze.upstreamDependencies, [
    "WS-6:7 Problem Workspace Certification",
  ]);
  assert.equal(freeze.runtime, false);
  assert.equal(freeze.validationExecution, false);
  assert.equal(freeze.businessLogic, false);
});
