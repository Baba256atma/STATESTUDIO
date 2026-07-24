import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import test from "node:test";
import { ValueWorkspaceFoundation } from "./valueWorkspaceFoundation.ts";

const files = [
  "valueWorkspaceBoundaries.ts",
  "valueWorkspaceCapabilities.ts",
  "valueWorkspaceContracts.ts",
  "valueWorkspaceFoundation.test.ts",
  "valueWorkspaceFoundation.ts",
  "valueWorkspaceIdentity.ts",
  "valueWorkspaceLifecycle.ts",
  "valueWorkspaceTerminology.ts",
];

test("WS-9:1 consists of exactly eight Foundation artifacts", () => {
  assert.deepEqual(
    readdirSync(new URL(".", import.meta.url))
      .filter((file) => files.includes(file)).sort(),
    files,
  );
});

test("WS-9:1 publishes complete immutable Foundation metadata", () => {
  const foundation = ValueWorkspaceFoundation;
  assert.equal(foundation.identity.id, "WS-9:1/ValueWorkspaceFoundation");
  assert.equal(
    foundation.identity.namespace,
    "nexora.workspace.value.foundation",
  );
  assert.equal(foundation.status, "ReadyForRegistry");
  assert.deepEqual(
    [
      foundation.contracts.length,
      foundation.capabilities.length,
      foundation.responsibilities.length,
      foundation.lifecycle.length,
      foundation.boundaries.length,
    ],
    [12, 11, 11, 8, 10],
  );
  assert.equal(Object.isFrozen(foundation), true);
});

test("WS-9:1 identities and lifecycle ordering are deterministic", () => {
  const foundation = ValueWorkspaceFoundation;
  const records = [
    ...foundation.contracts,
    ...foundation.capabilities,
    ...foundation.responsibilities,
    ...foundation.boundaries,
  ];
  assert.equal(new Set(records.map(({ id }) => id)).size, records.length);
  assert.equal(records.every(Object.isFrozen), true);
  assert.deepEqual(foundation.lifecycle, [
    "Declared", "Identified", "Defined", "Structured", "Measured",
    "Reviewed", "ReadyForValidation", "Archived",
  ]);
});

test("WS-9:1 has no upstream or prohibited dependency", () => {
  const source = readFileSync(
    new URL("./valueWorkspaceFoundation.ts", import.meta.url), "utf8",
  );
  const imports = source.match(/^import .* from .*;$/gm) ?? [];
  assert.equal(
    imports.every((value) => value.includes("./valueWorkspace")), true,
  );
  assert.equal(ValueWorkspaceFoundation.upstreamDependencies.length, 0);
});

test("WS-9:1 implements no prohibited behavior", () => {
  const foundation = ValueWorkspaceFoundation;
  assert.equal(
    foundation.boundaries.every(({ implemented }) => !implemented), true,
  );
  assert.equal(foundation.runtime, false);
  assert.equal(foundation.valueCalculation, false);
  assert.equal(foundation.roiCalculation, false);
  assert.equal(foundation.financialAnalysis, false);
  assert.equal(foundation.businessLogic, false);
});
