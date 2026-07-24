import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import test from "node:test";
import { ProblemWorkspaceFoundation } from "./problemWorkspaceFoundation.ts";

const files = [
  "problemWorkspaceBoundaries.ts",
  "problemWorkspaceCapabilities.ts",
  "problemWorkspaceContracts.ts",
  "problemWorkspaceFoundation.test.ts",
  "problemWorkspaceFoundation.ts",
  "problemWorkspaceIdentity.ts",
  "problemWorkspaceLifecycle.ts",
  "problemWorkspaceTerminology.ts",
];

test("WS-6:1 consists of exactly eight Foundation artifacts", () => {
  assert.deepEqual(
    readdirSync(new URL(".", import.meta.url))
      .filter((file) => files.includes(file))
      .sort(),
    files,
  );
});

test("WS-6:1 publishes complete immutable Foundation metadata", () => {
  const foundation = ProblemWorkspaceFoundation;
  assert.equal(foundation.identity.id, "WS-6:1/ProblemWorkspaceFoundation");
  assert.equal(foundation.identity.phaseId, "WS-6:1");
  assert.equal(
    foundation.identity.namespace,
    "nexora.workspace.problem.foundation",
  );
  assert.equal(foundation.identity.version, "1.0.0");
  assert.equal(foundation.identity.status, "Foundation");
  assert.equal(foundation.readiness, "ReadyForRegistry");
  assert.deepEqual(
    [
      foundation.contracts.length,
      foundation.capabilities.length,
      foundation.responsibilities.length,
      foundation.terminology.length,
      foundation.lifecycle.length,
      foundation.boundaries.length,
    ],
    [12, 11, 12, 12, 7, 13],
  );
  assert.equal(Object.isFrozen(foundation), true);
});

test("WS-6:1 identities are unique and ordering is deterministic", () => {
  const foundation = ProblemWorkspaceFoundation;
  const records = [
    ...foundation.contracts,
    ...foundation.capabilities,
    ...foundation.responsibilities,
    ...foundation.boundaries,
  ];
  assert.equal(new Set(records.map(({ id }) => id)).size, records.length);
  assert.equal(records.every((record) => Object.isFrozen(record)), true);
  assert.deepEqual(foundation.lifecycle, [
    "Declared",
    "Identified",
    "Defined",
    "Structured",
    "Contextualized",
    "ReadyForValidation",
    "Archived",
  ]);
});

test("WS-6:1 has no Workspace or prohibited dependency", () => {
  const source = readFileSync(
    new URL("./problemWorkspaceFoundation.ts", import.meta.url),
    "utf8",
  );
  const imports = source.match(/^import .* from .*;$/gm) ?? [];
  assert.equal(
    imports.every((value) => value.includes("./problemWorkspace")),
    true,
  );
  assert.equal(ProblemWorkspaceFoundation.upstreamDependencies.length, 0);
});

test("WS-6:1 implements no prohibited behavior", () => {
  const foundation = ProblemWorkspaceFoundation;
  assert.equal(
    foundation.boundaries.every(({ implemented }) => implemented === false),
    true,
  );
  assert.equal(foundation.runtime, false);
  assert.equal(foundation.reasoning, false);
  assert.equal(foundation.aiInference, false);
  assert.equal(foundation.persistence, false);
  assert.equal(foundation.ui, false);
  assert.equal(foundation.businessLogic, false);
});
