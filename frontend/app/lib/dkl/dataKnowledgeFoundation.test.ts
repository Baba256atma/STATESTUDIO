import assert from "node:assert/strict";
import test from "node:test";

import * as publicApi from "./dataKnowledgeFoundation.ts";
import {
  DataKnowledgeFoundation,
  DataKnowledgeFoundationContracts,
  DataKnowledgeFoundationDependencies,
  DataKnowledgeFoundationIdentity,
  DataKnowledgeFoundationOwnership,
  getDataKnowledgeFoundation,
  getDataKnowledgeFoundationSummary,
} from "./dataKnowledgeFoundation.ts";

const EXPECTED_PUBLIC_API = [
  "DataKnowledgeFoundation",
  "DataKnowledgeFoundationContracts",
  "DataKnowledgeFoundationDependencies",
  "DataKnowledgeFoundationIdentity",
  "DataKnowledgeFoundationOwnership",
  "getDataKnowledgeFoundation",
  "getDataKnowledgeFoundationSummary",
];

test("exports exactly seven public APIs", () => {
  assert.equal(Object.keys(publicApi).length, 7);
  assert.deepEqual(Object.keys(publicApi).sort(), [...EXPECTED_PUBLIC_API].sort());
});

test("public API surface matches published metadata", () => {
  assert.deepEqual([...DataKnowledgeFoundation.metadata.publicApiSurface].sort(), [...EXPECTED_PUBLIC_API].sort());
});

test("public API contains no runtime service verbs", () => {
  const runtimeLike = Object.keys(publicApi).some((key) =>
    /parse|store|query|fetch|render|execute|ingest|connect|async|network|database/i.test(key)
  );
  assert.equal(runtimeLike, false);
});

test("all public metadata exists on the foundation", () => {
  assert.ok(DataKnowledgeFoundation.identity);
  assert.ok(DataKnowledgeFoundation.ownership);
  assert.ok(DataKnowledgeFoundation.dependencies);
  assert.ok(DataKnowledgeFoundation.contracts);
  assert.ok(DataKnowledgeFoundation.boundaries);
  assert.ok(DataKnowledgeFoundation.metadata);
});

test("every exported object is deeply frozen", () => {
  assert.equal(Object.isFrozen(DataKnowledgeFoundation), true);
  assert.equal(Object.isFrozen(DataKnowledgeFoundationIdentity), true);
  assert.equal(Object.isFrozen(DataKnowledgeFoundationOwnership), true);
  assert.equal(Object.isFrozen(DataKnowledgeFoundationDependencies), true);
  assert.equal(Object.isFrozen(DataKnowledgeFoundationContracts), true);

  assert.equal(Object.isFrozen(DataKnowledgeFoundation.metadata), true);
  assert.equal(Object.isFrozen(DataKnowledgeFoundation.metadata.position), true);
  assert.equal(Object.isFrozen(DataKnowledgeFoundation.metadata.publicApiSurface), true);
  assert.equal(Object.isFrozen(DataKnowledgeFoundation.metadata.releaseMetadata), true);

  assert.equal(Object.isFrozen(DataKnowledgeFoundationOwnership.owns), true);
  assert.equal(Object.isFrozen(DataKnowledgeFoundationOwnership.neverOwns), true);
  assert.equal(Object.isFrozen(DataKnowledgeFoundationDependencies.allowed), true);
  assert.equal(Object.isFrozen(DataKnowledgeFoundationDependencies.future), true);
  assert.equal(Object.isFrozen(DataKnowledgeFoundationDependencies.forbidden), true);

  assert.equal(Object.isFrozen(DataKnowledgeFoundationContracts.contracts), true);
  assert.equal(DataKnowledgeFoundationContracts.contracts.every(Object.isFrozen), true);
  assert.equal(Object.isFrozen(DataKnowledgeFoundationContracts.boundaries), true);
  assert.equal(Object.isFrozen(DataKnowledgeFoundationContracts.responsibilities), true);
  assert.equal(Object.isFrozen(DataKnowledgeFoundationContracts.extensionPolicy), true);
});

test("mutation attempts on frozen foundation are rejected", () => {
  assert.throws(() => {
    // @ts-expect-error runtime immutability guard
    DataKnowledgeFoundation.metadataOnly = false;
  }, TypeError);
  assert.throws(() => {
    // @ts-expect-error runtime immutability guard
    DataKnowledgeFoundationIdentity.version = "9.9.9";
  }, TypeError);
});

test("identity metadata is immutable and correct", () => {
  assert.equal(DataKnowledgeFoundationIdentity.platformName, "Nexora Data Knowledge Layer");
  assert.equal(DataKnowledgeFoundationIdentity.namespace, "nexora.dkl.foundation");
  assert.equal(DataKnowledgeFoundationIdentity.layerId, "DKL");
  assert.equal(DataKnowledgeFoundationIdentity.phaseId, "DKL-1:1");
  assert.equal(DataKnowledgeFoundationIdentity.version, "1.0.0");
  assert.equal(DataKnowledgeFoundationIdentity.stability, "Stable");
  assert.equal(DataKnowledgeFoundationIdentity.releaseStatus, "Certified");
  assert.equal(DataKnowledgeFoundationIdentity.metadataOnly, true);
});

test("dependency declarations are correct", () => {
  assert.deepEqual(DataKnowledgeFoundationDependencies.allowed, ["CORE", "CORE-TEN", "BUS", "OPS", "NEA"]);
  assert.deepEqual(DataKnowledgeFoundationDependencies.future, ["EXECUTIVE-ENGINE"]);
  assert.deepEqual(DataKnowledgeFoundationDependencies.forbidden, [
    "UI",
    "ADVISOR",
    "SCENE",
    "EXTERNAL-APIS",
    "DATABASE-DRIVERS",
    "HTTP-CLIENTS",
    "AI-MODELS",
  ]);
  for (const forbidden of DataKnowledgeFoundationDependencies.forbidden) {
    assert.equal(DataKnowledgeFoundationDependencies.allowed.includes(forbidden as never), false);
  }
});

test("ownership declarations are correct", () => {
  assert.deepEqual(DataKnowledgeFoundationOwnership.owns, [
    "business-objects",
    "knowledge-objects",
    "knowledge-relationships",
    "knowledge-metadata",
    "knowledge-identity",
  ]);
  assert.deepEqual(DataKnowledgeFoundationOwnership.neverOwns, [
    "communication",
    "decision-logic",
    "visual-components",
    "user-sessions",
  ]);
  for (const owned of DataKnowledgeFoundationOwnership.owns) {
    assert.equal(DataKnowledgeFoundationOwnership.neverOwns.includes(owned as never), false);
  }
});

test("contracts describe responsibilities, boundaries, and extension policy", () => {
  assert.equal(DataKnowledgeFoundationContracts.contracts.length, 7);
  assert.equal(
    new Set(DataKnowledgeFoundationContracts.contracts.map((entry) => entry.id)).size,
    DataKnowledgeFoundationContracts.contracts.length
  );
  assert.equal(DataKnowledgeFoundationContracts.stability, "Stable");
  assert.equal(DataKnowledgeFoundationContracts.extensionPolicy.policy, "additive-only");
  assert.equal(DataKnowledgeFoundationContracts.extensionPolicy.allowsRuntimeBehavior, false);
  assert.equal(DataKnowledgeFoundationContracts.boundaries.includes("No UI rendering"), true);
  assert.equal(DataKnowledgeFoundationContracts.boundaries.includes("No database querying"), true);
  assert.equal(DataKnowledgeFoundationContracts.boundaries.includes("No decision making"), true);
});

test("boundaries on the foundation reference the contract boundaries", () => {
  assert.equal(DataKnowledgeFoundation.boundaries, DataKnowledgeFoundationContracts.boundaries);
});

test("getDataKnowledgeFoundation returns the canonical deterministic reference", () => {
  assert.equal(getDataKnowledgeFoundation(), DataKnowledgeFoundation);
  assert.equal(getDataKnowledgeFoundation(), getDataKnowledgeFoundation());
  assert.deepEqual(getDataKnowledgeFoundation(), getDataKnowledgeFoundation());
});

test("getDataKnowledgeFoundationSummary returns deterministic frozen metadata", () => {
  const first = getDataKnowledgeFoundationSummary();
  const second = getDataKnowledgeFoundationSummary();
  assert.equal(Object.isFrozen(first), true);
  assert.deepEqual(first, second);
  assert.equal(first.platformName, "Nexora Data Knowledge Layer");
  assert.equal(first.layerId, "DKL");
  assert.equal(first.phaseId, "DKL-1:1");
  assert.equal(first.version, "1.0.0");
  assert.equal(first.stability, "Stable");
  assert.equal(first.releaseStatus, "Certified");
  assert.equal(first.ownedResponsibilityCount, 5);
  assert.equal(first.allowedDependencyCount, 5);
  assert.equal(first.forbiddenDependencyCount, 7);
  assert.equal(first.contractCount, 7);
});

test("foundation is metadata-only, immutable, and deterministic", () => {
  assert.equal(DataKnowledgeFoundation.metadataOnly, true);
  assert.equal(DataKnowledgeFoundation.immutable, true);
  assert.equal(DataKnowledgeFoundation.deterministic, true);
  assert.equal(DataKnowledgeFoundation.metadata.foundationStatus, "Certified");
  assert.equal(DataKnowledgeFoundation.metadata.releaseMetadata.nextPhase, "DKL-1:2");
  assert.equal(DataKnowledgeFoundation.metadata.position.upstream, "NEA");
  assert.equal(DataKnowledgeFoundation.metadata.position.downstream, "Executive Engine");
});

test("no runtime behavior exists in the public API surface", () => {
  const functionExports = Object.entries(publicApi).filter(([, value]) => typeof value === "function");
  assert.deepEqual(
    functionExports.map(([key]) => key).sort(),
    ["getDataKnowledgeFoundation", "getDataKnowledgeFoundationSummary"]
  );
  for (const [, fn] of functionExports) {
    assert.equal((fn as (...args: unknown[]) => unknown).length, 0);
  }
});
