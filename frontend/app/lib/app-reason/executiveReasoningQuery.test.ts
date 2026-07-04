import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import {
  EXECUTIVE_REASONING_CONTRACT_VERSION,
  ExecutiveReasoningFoundation,
  createExecutiveReasoningRegistry,
  registerExecutiveReasoningPackage,
  type ExecutiveReasoningPackage,
  type ExecutiveReasoningRegistry,
} from "./executiveReasoningIndex.ts";
import {
  ExecutiveReasoningQueryLayer,
  buildExecutiveReasoningSnapshot,
  buildExecutiveReasoningSummary,
  compareExecutiveReasoningSnapshots,
  diffExecutiveReasoningSnapshots,
  filterExecutiveReasoningPackages,
  findExecutiveReasoningContract,
  findReasoningAssumptions,
  findReasoningConfidenceMetadata,
  findReasoningConstraints,
  findReasoningEvidence,
  findReasoningInputs,
  findReasoningOutputs,
  findReasoningPackageContainingContract,
  findReasoningPackagesByDomain,
  findReasoningPackagesByScope,
  findReasoningPackagesByStatus,
  findReasoningTraceMetadata,
  inspectExecutiveReasoningPackage,
  queryExecutiveReasoningPackages,
  sortExecutiveReasoningPackages,
  validateExecutiveReasoningSnapshot,
} from "./executiveReasoningQueryIndex.ts";

function metadata(tags: readonly string[]) {
  return Object.freeze({
    source: "app-reason-query-test",
    description: "Reasoning query metadata.",
    tags: Object.freeze([...tags]),
    contextPlatformVersion: "APP-CTX-4",
    metadataOnly: true as const,
  });
}

function reasoningPackage(packageId: string, contractId: string, name: string, tags: readonly string[]): ExecutiveReasoningPackage {
  return Object.freeze({
    packageId,
    packageName: name,
    contractVersion: EXECUTIVE_REASONING_CONTRACT_VERSION,
    version: "1.0.0",
    description: "Reasoning query fixture package.",
    contracts: Object.freeze([
      Object.freeze({
        contractId,
        label: "Query Contract",
        description: "Query contract metadata.",
        inputs: Object.freeze([
          Object.freeze({ inputId: "input.context", label: "Input", description: "Input metadata.", required: true, contextSection: "workspace" }),
        ]),
        outputs: Object.freeze([
          Object.freeze({ outputId: "output.context", label: "Output", description: "Output metadata.", metadataOnly: true }),
        ]),
        evidence: Object.freeze([
          Object.freeze({ evidenceId: "evidence.context", label: "Evidence", description: "Evidence metadata.", required: true }),
        ]),
        assumptions: Object.freeze([
          Object.freeze({ assumptionId: "assumption.context", label: "Assumption", description: "Assumption metadata.", uncertaintyImpact: "medium" }),
        ]),
        constraints: Object.freeze([
          Object.freeze({ constraintId: "constraint.context", label: "Constraint", description: "Constraint metadata.", severity: "warning" }),
        ]),
        confidence: Object.freeze({ required: true, evidenceRequired: true, assumptionRequired: true, explanation: "Confidence metadata." }),
        trace: Object.freeze({
          required: true,
          inputIds: Object.freeze(["input.context"]),
          outputIds: Object.freeze(["output.context"]),
          evidenceIds: Object.freeze(["evidence.context"]),
          assumptionIds: Object.freeze(["assumption.context"]),
          constraintIds: Object.freeze(["constraint.context"]),
        }),
        metadata: metadata(tags),
      }),
    ]),
    metadata: metadata(tags),
  });
}

function fixtureRegistry(): ExecutiveReasoningRegistry {
  const first = registerExecutiveReasoningPackage(
    createExecutiveReasoningRegistry(),
    reasoningPackage("reasoning.package.alpha", "reasoning.contract.alpha", "Alpha", ["domain:finance", "scope:workspace", "status:active"])
  ).registry;
  return registerExecutiveReasoningPackage(
    first,
    reasoningPackage("reasoning.package.beta", "reasoning.contract.beta", "Beta", ["domain:operations", "scope:scenario", "status:draft"])
  ).registry;
}

test("queries reasoning packages", () => {
  assert.equal(queryExecutiveReasoningPackages(fixtureRegistry()).length, 2);
});

test("filters reasoning packages", () => {
  assert.equal(filterExecutiveReasoningPackages(fixtureRegistry(), { tag: "status:active" }).length, 1);
});

test("sorts reasoning packages", () => {
  const sorted = sortExecutiveReasoningPackages(queryExecutiveReasoningPackages(fixtureRegistry()), "packageName", "desc");

  assert.equal(sorted[0].package.packageName, "Beta");
});

test("looks up package by query", () => {
  assert.equal(queryExecutiveReasoningPackages(fixtureRegistry(), { packageIds: ["reasoning.package.alpha"] }).length, 1);
});

test("finds package by domain", () => {
  assert.equal(findReasoningPackagesByDomain(fixtureRegistry(), "finance")[0].package.packageId, "reasoning.package.alpha");
});

test("finds package by scope", () => {
  assert.equal(findReasoningPackagesByScope(fixtureRegistry(), "scenario")[0].package.packageId, "reasoning.package.beta");
});

test("finds package by status", () => {
  assert.equal(findReasoningPackagesByStatus(fixtureRegistry(), "active")[0].package.packageId, "reasoning.package.alpha");
});

test("finds package containing contract", () => {
  assert.equal(findReasoningPackageContainingContract(fixtureRegistry(), "reasoning.contract.beta")?.package.packageId, "reasoning.package.beta");
});

test("finds reasoning contract", () => {
  assert.equal(findExecutiveReasoningContract(fixtureRegistry(), "reasoning.contract.alpha").value?.contractId, "reasoning.contract.alpha");
});

test("finds reasoning inputs", () => {
  assert.equal(findReasoningInputs(fixtureRegistry(), "reasoning.contract.alpha").value?.[0].inputId, "input.context");
});

test("finds reasoning outputs", () => {
  assert.equal(findReasoningOutputs(fixtureRegistry(), "reasoning.contract.alpha").value?.[0].outputId, "output.context");
});

test("finds reasoning evidence", () => {
  assert.equal(findReasoningEvidence(fixtureRegistry(), "reasoning.contract.alpha").value?.[0].evidenceId, "evidence.context");
});

test("finds reasoning assumptions", () => {
  assert.equal(findReasoningAssumptions(fixtureRegistry(), "reasoning.contract.alpha").value?.[0].assumptionId, "assumption.context");
});

test("finds reasoning constraints", () => {
  assert.equal(findReasoningConstraints(fixtureRegistry(), "reasoning.contract.alpha").value?.[0].constraintId, "constraint.context");
});

test("finds confidence metadata", () => {
  assert.equal(findReasoningConfidenceMetadata(fixtureRegistry(), "reasoning.contract.alpha").value?.required, true);
});

test("finds trace metadata", () => {
  assert.deepEqual(findReasoningTraceMetadata(fixtureRegistry(), "reasoning.contract.alpha").value?.inputIds, ["input.context"]);
});

test("inspects reasoning package", () => {
  const pkg = queryExecutiveReasoningPackages(fixtureRegistry())[0].package;
  const inspection = inspectExecutiveReasoningPackage(pkg);

  assert.equal(inspection.valid, true);
  assert.equal(inspection.contractCount, 1);
});

test("generates reasoning summary", () => {
  assert.equal(buildExecutiveReasoningSummary(queryExecutiveReasoningPackages(fixtureRegistry())[0].package).includes("APP-REASON-1"), true);
});

test("builds reasoning snapshot", () => {
  const snapshot = buildExecutiveReasoningSnapshot(fixtureRegistry());

  assert.equal(snapshot.packageCount, 2);
  assert.equal(snapshot.contractCount, 2);
});

test("validates reasoning snapshot", () => {
  assert.equal(validateExecutiveReasoningSnapshot(buildExecutiveReasoningSnapshot(fixtureRegistry())).valid, true);
});

test("compares reasoning snapshots", () => {
  assert.equal(compareExecutiveReasoningSnapshots(buildExecutiveReasoningSnapshot(fixtureRegistry()), buildExecutiveReasoningSnapshot(fixtureRegistry())), true);
});

test("diffs reasoning snapshots", () => {
  const left = buildExecutiveReasoningSnapshot(fixtureRegistry());
  const updated = registerExecutiveReasoningPackage(
    fixtureRegistry(),
    reasoningPackage("reasoning.package.gamma", "reasoning.contract.gamma", "Gamma", ["domain:finance", "scope:workspace", "status:active"])
  ).registry;
  const diff = diffExecutiveReasoningSnapshots(left, buildExecutiveReasoningSnapshot(updated));

  assert.equal(diff.equal, false);
  assert.equal(diff.entries.some((entry) => entry.packageId === "reasoning.package.gamma" && entry.type === "added"), true);
});

test("exports public reasoning query APIs", () => {
  assert.equal(typeof ExecutiveReasoningQueryLayer.queryExecutiveReasoningPackages, "function");
  assert.equal(typeof ExecutiveReasoningQueryLayer.buildExecutiveReasoningSnapshot, "function");
  assert.equal(Object.isFrozen(ExecutiveReasoningQueryLayer), true);
});

test("keeps APP-REASON-1 compatibility", () => {
  assert.equal(ExecutiveReasoningFoundation.validateExecutiveReasoningRegistry(fixtureRegistry()).valid, true);
});

test("keeps APP-CTX compatibility", () => {
  assert.equal(ExecutiveReasoningFoundation.validateExecutiveReasoningFoundation().valid, true);
});

test("has no direct APP-CTX internals or runtime behavior", () => {
  const sources = [
    readFileSync("app/lib/app-reason/executiveReasoningQuery.ts", "utf8"),
    readFileSync("app/lib/app-reason/executiveReasoningInspection.ts", "utf8"),
    readFileSync("app/lib/app-reason/executiveReasoningSnapshot.ts", "utf8"),
  ].join(" ");

  assert.equal(sources.includes("../app-context/"), false);
  assert.equal(sources.includes("../dom/"), false);
  assert.equal(sources.includes("execute"), false);
  assert.equal(sources.includes("infer"), false);
  assert.equal(sources.includes("score"), false);
  assert.equal(sources.includes("rank"), false);
});
