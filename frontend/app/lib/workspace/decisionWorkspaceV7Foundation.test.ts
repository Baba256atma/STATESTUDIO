import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import test from "node:test";
import { DecisionWorkspaceV7Foundation } from "./decisionWorkspaceV7Foundation.ts";

const files = [
  "decisionWorkspaceV7Boundaries.ts",
  "decisionWorkspaceV7Capabilities.ts",
  "decisionWorkspaceV7Contracts.ts",
  "decisionWorkspaceV7Foundation.test.ts",
  "decisionWorkspaceV7Foundation.ts",
  "decisionWorkspaceV7Identity.ts",
  "decisionWorkspaceV7Lifecycle.ts",
  "decisionWorkspaceV7Terminology.ts",
];

test("WS-7:1 consists of exactly eight collision-safe Foundation artifacts", () => {
  assert.deepEqual(
    readdirSync(new URL(".", import.meta.url))
      .filter((file) => files.includes(file))
      .sort(),
    files,
  );
});

test("WS-7:1 publishes complete immutable Foundation metadata", () => {
  const foundation = DecisionWorkspaceV7Foundation;
  assert.equal(foundation.identity.id, "WS-7:1/DecisionWorkspaceFoundation");
  assert.equal(foundation.identity.phaseId, "WS-7:1");
  assert.equal(
    foundation.identity.namespace,
    "nexora.workspace.decision.foundation",
  );
  assert.equal(foundation.identity.version, "1.0.0");
  assert.equal(foundation.status, "ReadyForRegistry");
  assert.deepEqual(
    [
      foundation.contracts.length,
      foundation.capabilities.length,
      foundation.responsibilities.length,
      foundation.lifecycle.length,
      foundation.boundaries.length,
    ],
    [12, 11, 12, 8, 12],
  );
  assert.equal(Object.isFrozen(foundation), true);
});

test("WS-7:1 identities are unique and lifecycle order is deterministic", () => {
  const foundation = DecisionWorkspaceV7Foundation;
  const records = [
    ...foundation.contracts,
    ...foundation.capabilities,
    ...foundation.responsibilities,
    ...foundation.boundaries,
  ];
  assert.equal(new Set(records.map(({ id }) => id)).size, records.length);
  assert.equal(records.every(Object.isFrozen), true);
  assert.deepEqual(foundation.lifecycle, [
    "Declared",
    "Identified",
    "Defined",
    "Structured",
    "Compared",
    "Evaluated",
    "ReadyForValidation",
    "Archived",
  ]);
});

test("WS-7:1 has no upstream or prohibited dependency", () => {
  const source = readFileSync(
    new URL("./decisionWorkspaceV7Foundation.ts", import.meta.url),
    "utf8",
  );
  const imports = source.match(/^import .* from .*;$/gm) ?? [];
  assert.equal(
    imports.every((value) => value.includes("./decisionWorkspaceV7")),
    true,
  );
  assert.equal(DecisionWorkspaceV7Foundation.upstreamDependencies.length, 0);
});

test("WS-7:1 implements no prohibited behavior", () => {
  const foundation = DecisionWorkspaceV7Foundation;
  assert.equal(
    foundation.boundaries.every(({ implemented }) => !implemented),
    true,
  );
  assert.equal(foundation.runtime, false);
  assert.equal(foundation.aiReasoning, false);
  assert.equal(foundation.decisionExecution, false);
  assert.equal(foundation.persistence, false);
  assert.equal(foundation.ui, false);
  assert.equal(foundation.businessLogic, false);
});
