import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import test from "node:test";
import { DecisionWorkspaceV7Freeze } from "./decisionWorkspaceV7Freeze.ts";

const files = [
  "decisionWorkspaceV7Freeze.test.ts",
  "decisionWorkspaceV7Freeze.ts",
  "decisionWorkspaceV7FreezeCompatibility.ts",
  "decisionWorkspaceV7FreezeGuarantees.ts",
  "decisionWorkspaceV7FreezeIdentity.ts",
  "decisionWorkspaceV7FreezeLock.ts",
  "decisionWorkspaceV7FreezePublicApi.ts",
  "decisionWorkspaceV7FrozenBaselines.ts",
];

test("WS-7:8 consists of exactly eight collision-safe Freeze artifacts", () => {
  assert.deepEqual(
    readdirSync(new URL(".", import.meta.url))
      .filter((file) => files.includes(file))
      .sort(),
    files,
  );
});

test("WS-7:8 publishes its canonical immutable lock", () => {
  const freeze = DecisionWorkspaceV7Freeze;
  assert.equal(freeze.identity.id, "WS-7:8/DecisionWorkspaceFreeze");
  assert.equal(
    freeze.identity.namespace,
    "nexora.workspace.decision.freeze",
  );
  assert.equal(freeze.identity.version, "1.0.0");
  assert.equal(freeze.lock.id, "WS-7-DECISION-WORKSPACE-LOCKED");
  assert.equal(freeze.lock.status, "Locked");
  assert.equal(freeze.lock.mutationAllowed, false);
  assert.equal(Object.isFrozen(freeze), true);
});

test("WS-7:8 freezes exactly eight baselines and complete chain", () => {
  const freeze = DecisionWorkspaceV7Freeze;
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

test("WS-7:8 publishes deterministic compatibility, guarantees, and APIs", () => {
  const freeze = DecisionWorkspaceV7Freeze;
  assert.deepEqual(
    [
      freeze.compatibility.length,
      freeze.guarantees.length,
      freeze.publicApi.length,
    ],
    [8, 8, 8],
  );
  assert.equal(new Set(freeze.publicApi.map(({ id }) => id)).size, 8);
  assert.equal(freeze.release, "Released");
  assert.equal(freeze.certificationStatus, "Certified");
  assert.equal(freeze.freezeStatus, "Frozen");
  assert.equal(freeze.stability, "Stable");
  assert.equal(freeze.readiness, "ReadyForPublicIndex");
});

test("WS-7:8 consumes Certification only and contains no runtime", () => {
  const freeze = DecisionWorkspaceV7Freeze;
  const source = readFileSync(
    new URL("./decisionWorkspaceV7Freeze.ts", import.meta.url),
    "utf8",
  );
  assert.equal(source.includes("./decisionWorkspaceV7Platform"), false);
  assert.equal(source.includes("./decisionWorkspaceV7Manifest"), false);
  assert.deepEqual(freeze.upstreamDependencies, [
    "WS-7:7 Decision Workspace Certification",
  ]);
  assert.equal(freeze.runtime, false);
  assert.equal(freeze.decisionExecution, false);
  assert.equal(freeze.businessLogic, false);
});
