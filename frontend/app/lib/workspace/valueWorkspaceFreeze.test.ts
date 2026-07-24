import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import test from "node:test";
import { ValueWorkspaceFreeze } from "./valueWorkspaceFreeze.ts";

const files = [
  "valueWorkspaceFreeze.test.ts",
  "valueWorkspaceFreeze.ts",
  "valueWorkspaceFreezeCompatibility.ts",
  "valueWorkspaceFreezeGuarantees.ts",
  "valueWorkspaceFreezeIdentity.ts",
  "valueWorkspaceFreezeLock.ts",
  "valueWorkspaceFreezePublicApi.ts",
  "valueWorkspaceFrozenBaselines.ts",
];

test("WS-9:8 consists of exactly eight Freeze artifacts", () => {
  assert.deepEqual(
    readdirSync(new URL(".", import.meta.url))
      .filter((file) => files.includes(file)).sort(),
    files,
  );
});

test("WS-9:8 publishes its canonical immutable lock", () => {
  const freeze = ValueWorkspaceFreeze;
  assert.equal(freeze.identity.id, "WS-9:8/ValueWorkspaceFreeze");
  assert.equal(freeze.identity.namespace, "nexora.workspace.value.freeze");
  assert.equal(freeze.lock.id, "WS-9-VALUE-WORKSPACE-LOCKED");
  assert.equal(freeze.lock.mutationAllowed, false);
  assert.equal(Object.isFrozen(freeze), true);
});

test("WS-9:8 freezes exactly eight baselines and complete chain", () => {
  const freeze = ValueWorkspaceFreeze;
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
  assert.equal(freeze.baselines[6].source, freeze.certification);
});

test("WS-9:8 publishes deterministic compatibility, guarantees, and APIs", () => {
  const freeze = ValueWorkspaceFreeze;
  assert.deepEqual(
    [
      freeze.compatibility.length,
      freeze.guarantees.length,
      freeze.publicApi.length,
    ],
    [9, 8, 8],
  );
  assert.equal(new Set(freeze.publicApi.map(({ id }) => id)).size, 8);
  assert.equal(freeze.release, "Released");
  assert.equal(freeze.certificationStatus, "Certified");
  assert.equal(freeze.freezeStatus, "Frozen");
  assert.equal(freeze.stability, "Stable");
  assert.equal(freeze.readiness, "ReadyForPublicIndex");
});

test("WS-9:8 consumes Certification only and contains no runtime", () => {
  const freeze = ValueWorkspaceFreeze;
  const source = readFileSync(
    new URL("./valueWorkspaceFreeze.ts", import.meta.url),
    "utf8",
  );
  assert.equal(source.includes("./valueWorkspacePlatform"), false);
  assert.equal(source.includes("./valueWorkspaceManifest"), false);
  assert.deepEqual(freeze.upstreamDependencies, [
    "WS-9:7 Value Workspace Certification",
  ]);
  assert.equal(freeze.runtime, false);
  assert.equal(freeze.roiCalculation, false);
  assert.equal(freeze.businessLogic, false);
});
