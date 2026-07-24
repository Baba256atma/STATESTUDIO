import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import test from "node:test";
import { ProblemWorkspaceRegistry } from "./problemWorkspaceRegistry.ts";

const files = [
  "problemWorkspaceAnalysisDomainRegistry.ts",
  "problemWorkspaceCapabilityRegistry.ts",
  "problemWorkspaceEvidenceRegistry.ts",
  "problemWorkspaceGovernanceRegistry.ts",
  "problemWorkspaceIdentityRegistry.ts",
  "problemWorkspaceRegistry.test.ts",
  "problemWorkspaceRegistry.ts",
  "problemWorkspaceTaxonomyRegistry.ts",
];

test("WS-6:2 consists of exactly eight Registry artifacts", () => {
  assert.deepEqual(
    readdirSync(new URL(".", import.meta.url))
      .filter((file) => files.includes(file))
      .sort(),
    files,
  );
});

test("WS-6:2 publishes complete canonical registries", () => {
  const registry = ProblemWorkspaceRegistry;
  assert.equal(registry.identity.id, "WS-6:2/ProblemWorkspaceRegistry");
  assert.equal(registry.identity.namespace, "nexora.workspace.problem.registry");
  assert.equal(registry.identity.version, "1.0.0");
  assert.equal(registry.readiness, "ReadyForModel");
  assert.deepEqual(
    [
      registry.taxonomy.categories.length,
      registry.taxonomy.severities.length,
      registry.taxonomy.statuses.length,
      registry.evidence.evidenceTypes.length,
      registry.evidence.constraintTypes.length,
      registry.evidence.assumptionTypes.length,
      registry.analysisDomains.impactDomains.length,
      registry.analysisDomains.rootCauseDomains.length,
    ],
    [15, 6, 8, 12, 10, 6, 12, 10],
  );
});

test("WS-6:2 identifiers are globally unique and immutable", () => {
  const registry = ProblemWorkspaceRegistry;
  const records = [
    registry.taxonomy.categories,
    registry.taxonomy.severities,
    registry.taxonomy.statuses,
    registry.evidence.evidenceTypes,
    registry.evidence.constraintTypes,
    registry.evidence.assumptionTypes,
    registry.analysisDomains.impactDomains,
    registry.analysisDomains.rootCauseDomains,
    registry.capabilities,
    registry.responsibilities,
    registry.lifecycle,
    registry.contracts,
    registry.boundaries,
  ].flat();
  assert.equal(new Set(records.map(({ id }) => id)).size, records.length);
  assert.equal(new Set(records.map(({ key }) => key)).size, records.length);
  assert.equal(records.every(Object.isFrozen), true);
});

test("WS-6:2 consumes only Foundation and contains no runtime", () => {
  const registry = ProblemWorkspaceRegistry;
  const source = readFileSync(
    new URL("./problemWorkspaceRegistry.ts", import.meta.url),
    "utf8",
  );
  assert.equal(source.includes("problemWorkspaceModel"), false);
  assert.deepEqual(registry.upstreamDependencies, [
    "WS-6:1 Problem Workspace Foundation",
  ]);
  assert.equal(registry.runtime, false);
  assert.equal(registry.reasoning, false);
  assert.equal(registry.persistence, false);
  assert.equal(registry.businessLogic, false);
});
