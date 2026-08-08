import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import {
  DIRECTOR_RUNTIME_INTEGRATION_RESULT_STATUSES,
  createDirectorRuntimeIntegrationBatchContract,
  createDirectorRuntimeIntegrationBindingContract,
  createDirectorRuntimeIntegrationErrorContract,
  createDirectorRuntimeIntegrationMappingContract,
  createDirectorRuntimeIntegrationResultContract,
  createDirectorRuntimeSnapshotContract,
  createDirectorRuntimeSourceContract,
  createDirectorRuntimeTargetContract,
  directorRuntimeIntegrationContractRegistry,
  directorRuntimeIntegrationContractRegistryCount,
  directorRuntimeIntegrationContractsIdentity,
  directorRuntimeIntegrationContractsMetadata,
  directorRuntimeIntegrationContractsNamespace,
  directorRuntimeIntegrationContractsUpstream,
  directorRuntimeIntegrationContractsVersion,
  getDirectorRuntimeIntegrationContractRegistry,
  isDirectorRuntimeIntegrationBatchContract,
  isDirectorRuntimeIntegrationBindingContract,
  isDirectorRuntimeIntegrationErrorContract,
  isDirectorRuntimeIntegrationMappingContract,
  isDirectorRuntimeIntegrationResultStatus,
  isDirectorRuntimeIntegrationValue,
  isDirectorRuntimeSourceContract,
  isDirectorRuntimeTargetContract,
  verifyDirectorRuntimeIntegrationContracts,
  type DirectorRuntimeIntegrationBindingContract,
  type DirectorRuntimeIntegrationPayload,
} from "./directorRuntimeIntegrationContracts.ts";
import {
  DIRECTOR_RUNTIME_INTEGRATION_SOURCE_KINDS,
  DIRECTOR_RUNTIME_INTEGRATION_STATES,
  DIRECTOR_RUNTIME_INTEGRATION_TARGET_KINDS,
  directorRuntimeIntegrationAuthority,
  directorRuntimeIntegrationDirection,
  directorRuntimeIntegrationFoundationIdentity,
} from "./directorRuntimeIntegrationFoundation.ts";

const sourceText = readFileSync(
  join(
    dirname(fileURLToPath(import.meta.url)),
    "directorRuntimeIntegrationContracts.ts",
  ),
  "utf8",
);

function binding(
  bindingId = "Binding:Original CASE",
): DirectorRuntimeIntegrationBindingContract {
  return {
    bindingId,
    mapping: {
      mappingId: `Mapping:${bindingId}`,
      source: {
        sourceKind: "runtime-object",
        sourceId: `Source:${bindingId}`,
        runtimeRevision: "runtime-r18",
      },
      target: { targetKind: "node", targetId: `Target:${bindingId}` },
    },
    state: "ready",
    direction: "runtime-to-director",
  };
}

function deeplyFrozen(value: unknown, seen = new Set<object>()): boolean {
  if (value === null || typeof value !== "object" || seen.has(value as object)) {
    return true;
  }
  if (!Object.isFrozen(value)) return false;
  seen.add(value as object);
  return Object.values(value as Record<string, unknown>).every((item) =>
    deeplyFrozen(item, seen),
  );
}

describe("DRI-1:2 Director Runtime Integration Contracts", () => {
  it("publishes the exact Contracts identity", () => {
    assert.equal(
      directorRuntimeIntegrationContractsIdentity,
      "DRI-1:2/DirectorRuntimeIntegrationContracts",
    );
    assert.equal(directorRuntimeIntegrationContractsVersion, "1.2.0");
    assert.equal(
      directorRuntimeIntegrationContractsNamespace,
      "nexora.dri.runtime.integration.contracts",
    );
    assert.deepEqual(directorRuntimeIntegrationContractsMetadata, {
      identity: "DRI-1:2/DirectorRuntimeIntegrationContracts",
      version: "1.2.0",
      namespace: "nexora.dri.runtime.integration.contracts",
      layer: "DRI",
      phase: "DRI-1",
      stage: "Contracts",
      status: "ContractsReady",
      upstream: "DRI-1:1/DirectorRuntimeIntegrationFoundation",
      direction: "runtime-to-director",
      authority: directorRuntimeIntegrationAuthority,
    });
    assert.equal(verifyDirectorRuntimeIntegrationContracts(), true);
  });

  it("depends only on DRI-1:1 and reuses its vocabulary and authority", () => {
    assert.equal(
      directorRuntimeIntegrationContractsUpstream,
      directorRuntimeIntegrationFoundationIdentity,
    );
    assert.equal(directorRuntimeIntegrationDirection, "runtime-to-director");
    assert.equal(
      directorRuntimeIntegrationContractsMetadata.authority,
      directorRuntimeIntegrationAuthority,
    );
    assert.equal(DIRECTOR_RUNTIME_INTEGRATION_SOURCE_KINDS.length, 9);
    assert.equal(DIRECTOR_RUNTIME_INTEGRATION_TARGET_KINDS.length, 9);
    assert.equal(DIRECTOR_RUNTIME_INTEGRATION_STATES.length, 7);
    const imports = [...sourceText.matchAll(/from\s+["']([^"']+)["']/g)]
      .map((match) => match[1]);
    assert.deepEqual(imports, ["./directorRuntimeIntegrationFoundation.ts"]);
  });

  it("accepts only finite JSON-like deterministic values", () => {
    for (const value of [null, true, false, 0, 71, "warning"]) {
      assert.equal(isDirectorRuntimeIntegrationValue(value), true);
    }
    assert.equal(
      isDirectorRuntimeIntegrationValue({
        status: "warning",
        kpi: 71,
        nested: [null, true, { labels: ["A", "B"] }],
      }),
      true,
    );
    class Unsupported {}
    for (const value of [
      Number.NaN,
      Number.POSITIVE_INFINITY,
      () => undefined,
      new Date(),
      new Map(),
      new Set(),
      Promise.resolve(),
      new Unsupported(),
    ]) {
      assert.equal(isDirectorRuntimeIntegrationValue(value), false);
    }
  });

  it("deep-clones and deep-freezes snapshot payloads without semantic change", () => {
    const payload = {
      status: "warning",
      kpi: 71,
      sequence: ["A", { nested: [true, null] }],
    } satisfies DirectorRuntimeIntegrationPayload;
    const input = {
      source: {
        sourceKind: "runtime-kpi" as const,
        sourceId: " KPI/Case Sensitive ",
        runtimeRevision: "company-state-v7",
      },
      revision: "snapshot-A",
      payload,
    };
    const before = structuredClone(input);
    const snapshot = createDirectorRuntimeSnapshotContract(input);

    assert.deepEqual(input, before);
    assert.deepEqual(snapshot, input);
    assert.notEqual(snapshot.payload, payload);
    assert.equal(deeplyFrozen(snapshot), true);
  });

  it("preserves opaque source, target, and revision identities exactly", () => {
    const sourceInput = {
      sourceKind: "runtime-context" as const,
      sourceId: "  Source/KEEP-Case  ",
      runtimeRevision: "runtime-r18",
    };
    const numericRevisionInput = {
      sourceKind: "runtime-pack" as const,
      sourceId: "pack-42",
      runtimeRevision: 42,
    };
    const targetInput = {
      targetKind: "composition" as const,
      targetId: "  Target/KEEP-Case  ",
    };
    const source = createDirectorRuntimeSourceContract(sourceInput);
    const numericSource = createDirectorRuntimeSourceContract(numericRevisionInput);
    const target = createDirectorRuntimeTargetContract(targetInput);

    assert.deepEqual(source, sourceInput);
    assert.deepEqual(numericSource, numericRevisionInput);
    assert.deepEqual(target, targetInput);
    assert.equal(isDirectorRuntimeSourceContract(source), true);
    assert.equal(isDirectorRuntimeTargetContract(target), true);
    assert.equal(Object.isFrozen(sourceInput), false);
    assert.equal(Object.isFrozen(targetInput), false);
    assert.throws(
      () => createDirectorRuntimeSourceContract({
        ...sourceInput,
        sourceKind: "database" as "runtime-context",
      }),
      TypeError,
    );
    assert.throws(
      () => createDirectorRuntimeTargetContract({
        ...targetInput,
        targetKind: "mesh" as "composition",
      }),
      TypeError,
    );
  });

  it("preserves source-to-mapping-to-target association immutably", () => {
    const input = binding().mapping;
    const before = structuredClone(input);
    const mapping = createDirectorRuntimeIntegrationMappingContract(input);

    assert.deepEqual(input, before);
    assert.deepEqual(mapping, input);
    assert.equal(mapping.source.sourceId, "Source:Binding:Original CASE");
    assert.equal(mapping.target.targetId, "Target:Binding:Original CASE");
    assert.equal(isDirectorRuntimeIntegrationMappingContract(mapping), true);
    assert.equal(deeplyFrozen(mapping), true);
  });

  it("creates strict one-way bindings built on Foundation descriptors", () => {
    const input = binding();
    const before = structuredClone(input);
    const left = createDirectorRuntimeIntegrationBindingContract(input);
    const right = createDirectorRuntimeIntegrationBindingContract(input);

    assert.deepEqual(input, before);
    assert.deepEqual(left, input);
    assert.deepEqual(right, left);
    assert.equal(left.bindingId, "Binding:Original CASE");
    assert.equal(left.state, "ready");
    assert.equal(left.direction, "runtime-to-director");
    assert.equal(isDirectorRuntimeIntegrationBindingContract(left), true);
    assert.equal(deeplyFrozen(left), true);
    assert.throws(
      () => createDirectorRuntimeIntegrationBindingContract({
        ...input,
        direction: "director-to-runtime" as "runtime-to-director",
      }),
      /runtime-to-director/,
    );
  });

  it("preserves caller order in immutable empty and populated batches", () => {
    const bindings = [binding("B1"), binding("B2"), binding("B3")];
    const before = structuredClone(bindings);
    const first = createDirectorRuntimeIntegrationBatchContract({
      batchId: "Batch/KEEP",
      runtimeRevision: "snapshot-A",
      bindings,
    });
    const second = createDirectorRuntimeIntegrationBatchContract({
      batchId: "Batch/KEEP",
      runtimeRevision: "snapshot-A",
      bindings,
    });
    const empty = createDirectorRuntimeIntegrationBatchContract({
      batchId: "empty",
      runtimeRevision: 42,
      bindings: [],
    });

    assert.deepEqual(bindings, before);
    assert.deepEqual(first.bindings.map(({ bindingId }) => bindingId), [
      "B1", "B2", "B3",
    ]);
    assert.deepEqual(first, second);
    assert.deepEqual(empty.bindings, []);
    assert.equal(isDirectorRuntimeIntegrationBatchContract(first), true);
    assert.equal(deeplyFrozen(first), true);
  });

  it("publishes exact result statuses and deterministic result contracts", () => {
    assert.deepEqual(DIRECTOR_RUNTIME_INTEGRATION_RESULT_STATUSES, [
      "accepted", "rejected", "blocked",
    ]);
    for (const status of DIRECTOR_RUNTIME_INTEGRATION_RESULT_STATUSES) {
      assert.equal(isDirectorRuntimeIntegrationResultStatus(status), true);
      assert.deepEqual(
        createDirectorRuntimeIntegrationResultContract({
          bindingId: "binding-1",
          status,
        }),
        { bindingId: "binding-1", status },
      );
    }
    assert.equal(isDirectorRuntimeIntegrationResultStatus("completed"), false);
    assert.throws(
      () => createDirectorRuntimeIntegrationResultContract({
        bindingId: "binding-1",
        status: "completed" as "accepted",
      }),
      TypeError,
    );
  });

  it("creates serializable plain-data errors without native Error state", () => {
    const input = {
      code: "DRI_SOURCE_BLOCKED",
      message: "Source is unavailable",
      sourceId: "source-1",
      targetId: "target-1",
      bindingId: "binding-1",
    };
    const error = createDirectorRuntimeIntegrationErrorContract(input);

    assert.deepEqual(error, input);
    assert.equal(isDirectorRuntimeIntegrationErrorContract(error), true);
    assert.equal(error instanceof Error, false);
    assert.equal("stack" in error, false);
    assert.equal(JSON.parse(JSON.stringify(error)).code, input.code);
    assert.equal(Object.isFrozen(error), true);
  });

  it("publishes ten ordered immutable contract families with dynamic count", () => {
    assert.deepEqual(
      directorRuntimeIntegrationContractRegistry.map(({ family }) => family),
      [
        "Runtime Source", "Runtime Snapshot", "Integration Payload",
        "Director Target", "Integration Mapping", "Integration Binding",
        "Integration Batch", "Integration Result", "Integration Error",
        "Authority",
      ],
    );
    assert.equal(
      directorRuntimeIntegrationContractRegistryCount,
      directorRuntimeIntegrationContractRegistry.length,
    );
    assert.equal(
      getDirectorRuntimeIntegrationContractRegistry(),
      directorRuntimeIntegrationContractRegistry,
    );
    assert.equal(deeplyFrozen(directorRuntimeIntegrationContractRegistry), true);
  });

  it("has no UI, renderer, browser, network, database, or mutable-store dependency", () => {
    assert.doesNotMatch(
      sourceText,
      /\b(?:React|ReactDOM|THREE|window|document|fetch|XMLHttpRequest|WebSocket|localStorage|sessionStorage)\b/,
    );
    assert.doesNotMatch(
      sourceText,
      /from\s+["'][^"']*(?:renderer|database|network|store)[^"']*["']/i,
    );
    assert.doesNotMatch(
      sourceText,
      /\b(?:Math\.random|Date\.now|new Date|randomUUID)\s*\(/,
    );
  });
});
