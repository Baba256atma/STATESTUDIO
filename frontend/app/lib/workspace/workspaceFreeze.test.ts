import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import test from "node:test";
import { WorkspaceFreeze } from "./workspaceFreeze.ts";
const files = ["workspaceFreeze.test.ts", "workspaceFreeze.ts", "workspaceFreezeBaselines.ts",
  "workspaceFreezeCompatibility.ts", "workspaceFreezeExtensions.ts", "workspaceFreezeLocks.ts",
  "workspaceFreezeReadiness.ts", "workspaceFreezeTypes.ts"];
test("WS-1:8 has exactly eight Freeze artifacts", () => {
  assert.deepEqual(readdirSync(new URL(".", import.meta.url)).filter((file) => files.includes(file)).sort(), files);
});
test("WS-1:8 locks the certified baseline", () => {
  assert.equal(WorkspaceFreeze.identity.id, "WS-1:8/WorkspaceFreeze");
  assert.equal(WorkspaceFreeze.canonicalLockId, "WS-1-WORKSPACE-FOUNDATION-LOCKED");
  assert.equal(WorkspaceFreeze.locks.length, 27);
  assert.equal(new Set(WorkspaceFreeze.locks.map(({ id }) => id)).size, 27);
  assert.equal(WorkspaceFreeze.locks.every(({ lockStatus }) => lockStatus === "Locked"), true);
  assert.equal(WorkspaceFreeze.certification.certificationStatus, "Certified");
  assert.equal(WorkspaceFreeze.readiness.status, "ReadyForPublicIndex");
});
test("WS-1:8 consumes only Certification and contains no runtime", () => {
  const source = readFileSync(new URL("./workspaceFreeze.ts", import.meta.url), "utf8");
  assert.equal(source.includes("./workspacePlatform"), false);
  assert.equal(WorkspaceFreeze.upstreamDependencies.length, 1);
  assert.equal(WorkspaceFreeze.runtime, false);
});
