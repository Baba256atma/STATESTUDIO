import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import test from "node:test";
import { ExecutiveHomeWorkspaceFreeze } from "./executiveHomeWorkspaceFreeze.ts";

const files = ["executiveHomeWorkspaceFreeze.test.ts", "executiveHomeWorkspaceFreeze.ts",
  "executiveHomeWorkspaceFreezeBaselines.ts",
  "executiveHomeWorkspaceFreezeCompatibility.ts",
  "executiveHomeWorkspaceFreezeExtensions.ts", "executiveHomeWorkspaceFreezeLocks.ts",
  "executiveHomeWorkspaceFreezeReadiness.ts", "executiveHomeWorkspaceFreezeTypes.ts"];

test("WS-2:8 consists of exactly eight Freeze artifacts", () => {
  assert.deepEqual(readdirSync(new URL(".", import.meta.url))
    .filter((file) => files.includes(file)).sort(), files);
});

test("WS-2:8 has the canonical lock and complete active locks", () => {
  const freeze = ExecutiveHomeWorkspaceFreeze;
  assert.equal(freeze.identity.id, "WS-2:8/ExecutiveHomeWorkspaceFreeze");
  assert.equal(freeze.canonicalLockId, "WS-2-EXECUTIVE-HOME-WORKSPACE-LOCKED");
  assert.equal(freeze.locks.length, 27);
  assert.equal(new Set(freeze.locks.map(({ id }) => id)).size, 27);
  assert.equal(freeze.locks.every(({ lockStatus }) => lockStatus === "Locked"), true);
});

test("WS-2:8 preserves certified baselines and derived inventory", () => {
  const freeze = ExecutiveHomeWorkspaceFreeze;
  assert.equal(freeze.baselines.source, freeze.certification);
  assert.equal(freeze.inventory, freeze.certification.inventory);
  assert.equal(freeze.baselines.platform, freeze.certification.platform);
  assert.equal(freeze.certification.certificationStatus, "Certified");
  assert.equal(freeze.freezeStatus, "Frozen");
  assert.equal(freeze.mutationPolicy.length, 8);
  assert.equal(freeze.readiness.status, "ReadyForPublicIndex");
});

test("WS-2:8 consumes only Certification and contains no runtime", () => {
  const freeze = ExecutiveHomeWorkspaceFreeze;
  const source = readFileSync(new URL("./executiveHomeWorkspaceFreeze.ts", import.meta.url), "utf8");
  assert.equal(source.includes("./executiveHomeWorkspacePlatform"), false);
  assert.deepEqual(freeze.upstreamDependencies,
    ["WS-2:7 Executive Home Workspace Certification"]);
  assert.equal(freeze.runtime, false);
  assert.equal(freeze.ui, false);
});
