import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import test from "node:test";
import { ExecutiveHomeWorkspaceFoundation } from "./executiveHomeWorkspaceFoundation.ts";

const files = ["executiveHomeWorkspace.test.ts", "executiveHomeWorkspaceBoundaries.ts",
  "executiveHomeWorkspaceCapabilities.ts", "executiveHomeWorkspaceContracts.ts",
  "executiveHomeWorkspaceFoundation.ts", "executiveHomeWorkspaceFoundationTypes.ts",
  "executiveHomeWorkspaceLifecycle.ts", "executiveHomeWorkspaceResponsibilities.ts"];

test("WS-2:1 consists of exactly eight Foundation artifacts", () => {
  assert.deepEqual(readdirSync(new URL(".", import.meta.url))
    .filter((file) => files.includes(file)).sort(), files);
});

test("WS-2:1 publishes complete canonical immutable metadata", () => {
  const foundation = ExecutiveHomeWorkspaceFoundation;
  assert.equal(foundation.identity.id, "WS-2:1/ExecutiveHomeWorkspaceFoundation");
  assert.equal(foundation.identity.namespace, "nexora.workspace.executive-home.foundation");
  assert.deepEqual([foundation.contracts.length, foundation.capabilities.length,
    foundation.responsibilities.length, foundation.lifecycle.length,
    foundation.boundaries.length, foundation.categories.length,
    foundation.terminology.length], [17, 15, 12, 9, 28, 10, 17]);
  assert.equal(Object.isFrozen(foundation), true);
  assert.equal(Object.isFrozen(foundation.contracts), true);
});

test("WS-2:1 consumes only the WS-1 Public Index", () => {
  const source = readFileSync(new URL("./executiveHomeWorkspaceFoundation.ts", import.meta.url), "utf8");
  const upstreamImports = (source.match(/^import .* from .*;$/gm) ?? [])
    .filter((value) => value.includes("workspace"));
  assert.deepEqual(upstreamImports, ['import { WorkspacePublicIndex } from "./workspacePublicIndex.ts";']);
  assert.deepEqual(ExecutiveHomeWorkspaceFoundation.upstreamDependencies,
    ["WS-1:9 Workspace Public Index"]);
});

test("WS-2:1 contains no prohibited implementation behavior", () => {
  const foundation = ExecutiveHomeWorkspaceFoundation;
  assert.equal(foundation.runtime, false);
  assert.equal(foundation.ui, false);
  assert.equal(foundation.rendering, false);
  assert.equal(foundation.dashboardImplementation, false);
  assert.equal(foundation.navigationRuntime, false);
  assert.equal(foundation.persistence, false);
  assert.equal(foundation.orchestration, false);
  assert.equal(foundation.aiExecution, false);
  assert.equal(foundation.boundaries.every(({ implemented }) => implemented === false), true);
  assert.equal(foundation.readiness, "ReadyForRegistry");
});
