import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import test from "node:test";
import { DecisionWorkspaceFreeze } from "./decisionWorkspaceFreeze.ts";

const files = [
  "decisionWorkspaceFreeze.test.ts",
  "decisionWorkspaceFreeze.ts",
  "decisionWorkspaceFreezeCompatibility.ts",
  "decisionWorkspaceFreezeExtensions.ts",
  "decisionWorkspaceFreezeIdentity.ts",
  "decisionWorkspaceFreezeInventory.ts",
  "decisionWorkspaceFreezeLock.ts",
  "decisionWorkspaceFreezePublicApi.ts",
];

test("WS-4:8 consists of exactly eight Freeze artifacts", () => {
  assert.deepEqual(
    readdirSync(new URL(".", import.meta.url))
      .filter((file) => files.includes(file))
      .sort(),
    files,
  );
});

test("WS-4:8 publishes the canonical immutable lock and inventory", () => {
  const freeze = DecisionWorkspaceFreeze;
  assert.equal(freeze.identity.id, "WS-4:8/DecisionWorkspaceFreeze");
  assert.equal(
    freeze.identity.namespace,
    "nexora.workspace.decision.freeze",
  );
  assert.equal(freeze.identity.version, "1.0.0");
  assert.equal(freeze.identity.status, "Frozen");
  assert.equal(freeze.lock.id, "WS-4-DECISION-WORKSPACE-LOCKED");
  assert.equal(freeze.lock.status, "Locked");
  assert.equal(freeze.inventory.source, freeze.certification);
  assert.equal(
    freeze.inventory.sourceChain.platform,
    freeze.certification.platform,
  );
  assert.equal(Object.isFrozen(freeze), true);
});

test("WS-4:8 declarations and API identities are complete and unique", () => {
  const freeze = DecisionWorkspaceFreeze;
  assert.deepEqual(
    [
      freeze.compatibility.length,
      freeze.extensions.length,
      freeze.publicApi.length,
    ],
    [9, 10, 7],
  );
  assert.equal(
    freeze.compatibility.every(({ state }) => state === "Compatible"),
    true,
  );
  assert.equal(
    freeze.extensions.every(({ state }) => state === "Extensible"),
    true,
  );
  assert.equal(new Set(freeze.publicApi.map(({ id }) => id)).size, 7);
  assert.equal(freeze.summary.releaseStatus, "Released");
  assert.equal(freeze.readiness, "ReadyForPublicIndex");
});

test("WS-4:8 preserves deterministic frozen ordering", () => {
  const freeze = DecisionWorkspaceFreeze;
  assert.deepEqual(
    freeze.publicApi.map(({ order }) => order),
    freeze.publicApi.map((_, index) => index + 1),
  );
  assert.equal(freeze.lock.mutationAllowed, false);
  assert.equal(Object.isFrozen(freeze.inventory), true);
});

test("WS-4:8 consumes only Certification and contains no runtime", () => {
  const freeze = DecisionWorkspaceFreeze;
  const source = readFileSync(
    new URL("./decisionWorkspaceFreeze.ts", import.meta.url),
    "utf8",
  );
  assert.equal(source.includes("./decisionWorkspacePlatform"), false);
  assert.equal(source.includes("./decisionWorkspaceManifest"), false);
  assert.deepEqual(freeze.upstreamDependencies, [
    "WS-4:7 Decision Workspace Certification",
  ]);
  assert.equal(freeze.runtime, false);
  assert.equal(freeze.businessLogic, false);
  assert.equal(freeze.persistence, false);
  assert.equal(freeze.ui, false);
});
