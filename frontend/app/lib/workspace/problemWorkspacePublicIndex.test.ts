import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import test from "node:test";
import * as publicExports from "./problemWorkspacePublicIndex.ts";
import { problemWorkspacePublicIndex } from "./problemWorkspacePublicIndex.ts";

test("WS-6:9 has exactly two artifacts and twelve public exports", () => {
  const files = [
    "problemWorkspacePublicIndex.test.ts",
    "problemWorkspacePublicIndex.ts",
  ];
  assert.deepEqual(
    readdirSync(new URL(".", import.meta.url))
      .filter((file) => files.includes(file))
      .sort(),
    files,
  );
  assert.equal(Object.keys(publicExports).length, 12);
  assert.equal(problemWorkspacePublicIndex.publicExportCount, 12);
});

test("WS-6:9 publishes exactly nine canonical namespace sections", () => {
  assert.deepEqual(
    problemWorkspacePublicIndex.namespace.map(({ section }) => section),
    [
      "Identity",
      "Workspace",
      "Foundation",
      "Registry",
      "Model",
      "Validation",
      "Platform",
      "Release",
      "Consumer",
    ],
  );
  assert.equal(problemWorkspacePublicIndex.namespaceCount, 9);
});

test("WS-6:9 publishes canonical identity and release metadata", () => {
  const index = problemWorkspacePublicIndex;
  assert.equal(index.identity.id, "WS-6:9/ProblemWorkspacePublicIndex");
  assert.equal(
    index.identity.namespace,
    "nexora.workspace.problem.public-index",
  );
  assert.equal(index.identity.version, "1.0.0");
  assert.deepEqual(index.releaseStatus, {
    release: "Released",
    certification: "Certified",
    freeze: "Frozen",
    stability: "Stable",
    readiness: "ReadyForConsumer",
  });
  assert.equal(index.readiness, "ReadyForConsumer");
});

test("WS-6:9 preserves the Freeze API registry and derives its count", () => {
  const index = problemWorkspacePublicIndex;
  assert.equal(index.publicApiRegistry, index.freezeReference.publicApi);
  assert.equal(index.publicApiCount, index.freezeReference.publicApi.length);
  assert.equal(
    new Set(index.publicApiRegistry.map(({ id }) => id)).size,
    index.publicApiRegistry.length,
  );
  assert.equal(Object.isFrozen(index.publicApiRegistry), true);
});

test("WS-6:9 is the immutable sole consumer entry", () => {
  const index = problemWorkspacePublicIndex;
  assert.equal(index.consumerEntry.file, "problemWorkspacePublicIndex.ts");
  assert.equal(index.soleConsumerEntry, true);
  assert.equal(index.platformReference, index.freezeReference.certification.platform);
  assert.equal(new Set(index.publicExports).size, 12);
  assert.equal(Object.isFrozen(index), true);
});

test("WS-6:9 imports only Freeze and contains no runtime", () => {
  const index = problemWorkspacePublicIndex;
  const source = readFileSync(
    new URL("./problemWorkspacePublicIndex.ts", import.meta.url),
    "utf8",
  );
  const imports = source.match(/^import .* from .*;$/gm) ?? [];
  assert.deepEqual(imports, [
    'import { ProblemWorkspaceFreeze } from "./problemWorkspaceFreeze.ts";',
  ]);
  assert.equal(index.soleDependency, "problemWorkspaceFreeze.ts");
  assert.equal(index.runtime, false);
  assert.equal(index.rootCauseAnalysis, false);
  assert.equal(index.businessLogic, false);
});
