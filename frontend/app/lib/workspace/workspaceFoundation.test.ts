import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import test from "node:test";

import { WorkspaceFoundation } from "./workspaceFoundation.ts";

test("WS-1:1 consists of exactly eight Foundation files", () => {
  const files = readdirSync(new URL(".", import.meta.url))
    .filter((name) => name.startsWith("workspaceFoundation"));
  assert.deepEqual(files.sort(), [
    "workspaceFoundation.test.ts",
    "workspaceFoundation.ts",
    "workspaceFoundationBoundaries.ts",
    "workspaceFoundationCapabilities.ts",
    "workspaceFoundationContracts.ts",
    "workspaceFoundationLifecycle.ts",
    "workspaceFoundationResponsibilities.ts",
    "workspaceFoundationTypes.ts",
  ]);
});

test("WS-1:1 publishes the canonical immutable Foundation", () => {
  assert.deepEqual(WorkspaceFoundation.identity, {
    id: "WS-1:1/WorkspaceFoundation",
    name: "Workspace Foundation",
    layer: "Workspace",
    phase: "1:1",
    version: "1.0.0",
    status: "ReadyForRegistry",
  });
  assert.equal(WorkspaceFoundation.contracts.length, 17);
  assert.equal(WorkspaceFoundation.capabilities.length, 15);
  assert.equal(WorkspaceFoundation.responsibilities.length, 12);
  assert.equal(WorkspaceFoundation.lifecycle.length, 9);
  assert.equal(WorkspaceFoundation.categories.length, 11);
  assert.equal(WorkspaceFoundation.terminology.length, 18);
  assert.equal(Object.isFrozen(WorkspaceFoundation), true);
  assert.equal(Object.isFrozen(WorkspaceFoundation.contracts), true);
});

test("WS-1:1 exposes one deterministic Registry-facing surface", () => {
  assert.deepEqual(WorkspaceFoundation.publicApiSurface, ["WorkspaceFoundation"]);
  assert.equal(WorkspaceFoundation.nextPhase, "WS-1:2 — Workspace Registry");
  assert.equal(WorkspaceFoundation.metadataOnly, true);
  assert.equal(WorkspaceFoundation.immutable, true);
  assert.equal(WorkspaceFoundation.deterministic, true);
});

test("WS-1:1 contains no prohibited behavior or imports", () => {
  const source = readFileSync(
    new URL("./workspaceFoundation.ts", import.meta.url),
    "utf8",
  );
  const imports = source.match(/^import .* from .*;$/gm) ?? [];
  assert.equal(imports.every((value) => value.includes("./workspaceFoundation")), true);
  assert.equal(WorkspaceFoundation.runtimeExecution, false);
  assert.equal(WorkspaceFoundation.uiImplementation, false);
  assert.equal(WorkspaceFoundation.rendering, false);
  assert.equal(WorkspaceFoundation.navigationLogic, false);
  assert.equal(WorkspaceFoundation.stateManagement, false);
  assert.equal(WorkspaceFoundation.orchestration, false);
  assert.equal(WorkspaceFoundation.artificialIntelligenceExecution, false);
  assert.equal(WorkspaceFoundation.boundaries.every(({ implemented }) => implemented === false), true);
});
