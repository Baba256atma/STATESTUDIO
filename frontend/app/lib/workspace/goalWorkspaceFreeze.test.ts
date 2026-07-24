import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import test from "node:test";
import { GoalWorkspaceFreeze } from "./goalWorkspaceFreeze.ts";
const files = ["goalWorkspaceFreeze.test.ts", "goalWorkspaceFreeze.ts",
  "goalWorkspaceFreezeCompatibility.ts", "goalWorkspaceFreezeExtensions.ts",
  "goalWorkspaceFreezeIdentity.ts", "goalWorkspaceFreezeInventory.ts",
  "goalWorkspaceFreezeLock.ts", "goalWorkspaceFreezePublicApi.ts"];
test("WS-3:8 consists of exactly eight Freeze artifacts", () => {
  assert.deepEqual(readdirSync(new URL(".", import.meta.url))
    .filter((file) => files.includes(file)).sort(), files);
});
test("WS-3:8 publishes the canonical immutable lock and inventory", () => {
  const freeze = GoalWorkspaceFreeze;
  assert.equal(freeze.identity.id, "WS-3:8/GoalWorkspaceFreeze");
  assert.equal(freeze.lock.id, "WS-3-GOAL-WORKSPACE-LOCKED");
  assert.equal(freeze.lock.status, "Locked");
  assert.equal(freeze.inventory.source, freeze.certification);
  assert.equal(freeze.inventory.sourceChain.platform, freeze.certification.platform);
  assert.equal(Object.isFrozen(freeze), true);
});
test("WS-3:8 declarations and API identities are complete and unique", () => {
  const freeze = GoalWorkspaceFreeze;
  assert.deepEqual([freeze.compatibility.length, freeze.extensions.length,
    freeze.publicApi.length], [9, 10, 7]);
  assert.equal(freeze.compatibility.every(({ state }) => state === "Compatible"), true);
  assert.equal(freeze.extensions.every(({ state }) => state === "Extensible"), true);
  assert.equal(new Set(freeze.publicApi.map(({ id }) => id)).size, 7);
  assert.equal(freeze.summary.releaseStatus, "Released");
  assert.equal(freeze.readiness, "ReadyForPublicIndex");
});
test("WS-3:8 consumes only Certification and contains no runtime", () => {
  const source = readFileSync(new URL("./goalWorkspaceFreeze.ts", import.meta.url), "utf8");
  assert.equal(source.includes("./goalWorkspacePlatform"), false);
  assert.deepEqual(GoalWorkspaceFreeze.upstreamDependencies,
    ["WS-3:7 Goal Workspace Certification"]);
  assert.equal(GoalWorkspaceFreeze.runtime, false);
  assert.equal(GoalWorkspaceFreeze.ui, false);
});
