/**
 * P0:2 — Dataset → NexoraObject Binding focused unit tests.
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

import {
  normalizeDatasetToBusinessFacts,
  withDatasetScenario,
} from "./dataRealityFoundation.ts";
import {
  OBJECT_DATA_BINDING_BOUNDARY,
  bindBusinessFactToNexoraObject,
  bindBusinessFactsToNexoraObjects,
  getObjectDataBindingIdentity,
  objectDataBindingIdentity,
  objectDataBindingVersion,
  resolveNexoraObjectBinding,
  validateAndResolveObjectDataBindings,
} from "./objectDataBinding.ts";
import {
  EXECUTIVE_OPERATIONS_DEMO_DATASET,
  EXECUTIVE_OPERATIONS_PRESSURE_DATASET_ID,
  getExecutiveOperationsDemoDataset,
} from "./demo/executiveOperationsDemoDataset.ts";
import {
  EXECUTIVE_OPERATIONS_OBJECT_IDENTITY_MAP,
  EXECUTIVE_OPERATIONS_RESOLVED_OBJECT_BINDINGS,
  countExecutiveOperationsOwnedMetrics,
  getExecutiveOperationsResolvedObjectBindings,
  validateExecutiveOperationsObjectBindings,
} from "./demo/executiveOperationsObjectBindings.ts";

const here = dirname(fileURLToPath(import.meta.url));

test("P0:2 identity and boundary", () => {
  const identity = getObjectDataBindingIdentity();
  assert.equal(objectDataBindingIdentity, "P0:2/NexoraObjectDataBinding");
  assert.equal(identity.id, "P0:2/NexoraObjectDataBinding");
  assert.equal(objectDataBindingVersion, "1.0.0");
  assert.equal(OBJECT_DATA_BINDING_BOUNDARY.ownsKpiComputation, false);
  assert.equal(OBJECT_DATA_BINDING_BOUNDARY.ownsStageMutation, false);
  assert.equal(OBJECT_DATA_BINDING_BOUNDARY.consumesNolPublicIndexOnly, true);
  assert.equal(
    OBJECT_DATA_BINDING_BOUNDARY.nolPublicImportPath,
    "@/app/lib/nol/universalNexoraObjectPublicIndex",
  );
  assert.equal(
    OBJECT_DATA_BINDING_BOUNDARY.globalNolObjectRegistryAvailable,
    false,
  );
});

test("Test 1 — Demo binding registry validity", () => {
  const validation = validateExecutiveOperationsObjectBindings();
  assert.equal(validation.ok, true, JSON.stringify(validation.issues));
  assert.equal(validation.resolved.length, 6);
  assert.equal(EXECUTIVE_OPERATIONS_RESOLVED_OBJECT_BINDINGS.length, 6);
});

test("Test 2 — Every demo metric has one owner", () => {
  const dataset = getExecutiveOperationsDemoDataset();
  const facts = normalizeDatasetToBusinessFacts(dataset);
  const bindings = getExecutiveOperationsResolvedObjectBindings();
  const result = bindBusinessFactsToNexoraObjects(facts, bindings);

  assert.equal(result.status, "bound", JSON.stringify(result.issues));
  assert.equal(result.boundFacts.length, dataset.records.length);
  assert.equal(countExecutiveOperationsOwnedMetrics(), 11);

  const owned = new Set<string>();
  for (const binding of bindings) {
    for (const metricKey of binding.metricKeys) {
      const key = `${binding.objectKey}.${metricKey}`;
      assert.equal(owned.has(key), false, `duplicate ownership ${key}`);
      owned.add(key);
    }
  }
  for (const record of dataset.records) {
    assert.ok(owned.has(`${record.objectKey}.${record.metricKey}`));
  }
});

test("Test 3 — Production binding", () => {
  const fact = normalizeDatasetToBusinessFacts(
    getExecutiveOperationsDemoDataset(),
  ).find(
    (entry) =>
      entry.objectKey === "production" && entry.metricKey === "usedCapacity",
  );
  assert.ok(fact);

  const bindings = getExecutiveOperationsResolvedObjectBindings();
  const resolved = resolveNexoraObjectBinding("production", bindings);
  assert.ok(resolved);
  assert.equal(
    resolved.nexoraObjectId,
    "nexora.executive-operations.object.production",
  );

  const result = bindBusinessFactToNexoraObject(fact!, bindings);
  assert.equal(result.status, "bound");
  assert.equal(result.boundFacts.length, 1);
  assert.equal(
    result.boundFacts[0]!.nexoraObjectId,
    "nexora.executive-operations.object.production",
  );
  assert.equal(result.boundFacts[0]!.objectKey, "production");
  assert.equal(result.boundFacts[0]!.metricKey, "usedCapacity");
  assert.equal(result.boundFacts[0]!.value, 8700);
});

test("Test 4 — Unknown object produces deterministic failure", () => {
  const result = bindBusinessFactsToNexoraObjects(
    [
      {
        objectKey: "unknown-plant",
        metricKey: "usedCapacity",
        value: 1,
        sourceDatasetId: EXECUTIVE_OPERATIONS_DEMO_DATASET.id,
      },
    ],
    getExecutiveOperationsResolvedObjectBindings(),
  );
  assert.equal(result.status, "invalid");
  assert.equal(result.boundFacts.length, 0);
  assert.ok(result.issues.some((issue) => issue.code === "UNKNOWN_OBJECT_KEY"));
  assert.ok(
    result.issues.some((issue) => issue.code === "UNBOUND_BUSINESS_FACT"),
  );
});

test("Test 5 — Unknown metric produces deterministic failure", () => {
  const result = bindBusinessFactsToNexoraObjects(
    [
      {
        objectKey: "production",
        metricKey: "mysteryMetric",
        value: 1,
        sourceDatasetId: EXECUTIVE_OPERATIONS_DEMO_DATASET.id,
      },
    ],
    getExecutiveOperationsResolvedObjectBindings(),
  );
  assert.equal(result.status, "invalid");
  assert.equal(result.boundFacts.length, 0);
  assert.ok(result.issues.some((issue) => issue.code === "UNKNOWN_METRIC_KEY"));
  assert.ok(
    result.issues.some((issue) => issue.code === "UNBOUND_BUSINESS_FACT"),
  );
});

test("Test 6 — No duplicate ownership", () => {
  const conflicting = validateAndResolveObjectDataBindings([
    {
      objectKey: "production",
      nexoraObjectId: "nexora.executive-operations.object.production",
      metricKeys: ["usedCapacity", "usedCapacity", "totalCapacity"],
    },
  ]);
  assert.equal(conflicting.ok, false);
  assert.ok(
    conflicting.issues.some(
      (issue) => issue.code === "METRIC_OWNERSHIP_CONFLICT",
    ),
  );

  const duplicateObject = validateAndResolveObjectDataBindings([
    {
      objectKey: "production",
      nexoraObjectId: "nexora.executive-operations.object.production",
      metricKeys: ["usedCapacity", "totalCapacity"],
    },
    {
      objectKey: "production",
      nexoraObjectId: "nexora.executive-operations.object.production-dup",
      metricKeys: ["usedCapacity", "totalCapacity"],
    },
  ]);
  assert.equal(duplicateObject.ok, false);
  assert.ok(
    duplicateObject.issues.some(
      (issue) => issue.code === "DUPLICATE_OBJECT_BINDING",
    ),
  );
});

test("Test 7 — Dataset A/B identity stability", () => {
  const baseline = getExecutiveOperationsDemoDataset();
  const pressureRecords = baseline.records.map((record) => {
    if (
      record.objectKey === "production" &&
      record.metricKey === "usedCapacity"
    ) {
      return Object.freeze({ ...record, value: 9600 });
    }
    return record;
  });
  const pressure = withDatasetScenario(baseline, {
    id: EXECUTIVE_OPERATIONS_PRESSURE_DATASET_ID,
    scenario: "operational-pressure",
    capturedAt: "2026-08-10T12:00:00.000Z",
    records: pressureRecords,
  });

  const bindings = getExecutiveOperationsResolvedObjectBindings();
  const boundA = bindBusinessFactsToNexoraObjects(
    normalizeDatasetToBusinessFacts(baseline),
    bindings,
  );
  const boundB = bindBusinessFactsToNexoraObjects(
    normalizeDatasetToBusinessFacts(pressure),
    bindings,
  );

  assert.equal(boundA.status, "bound");
  assert.equal(boundB.status, "bound");
  assert.equal(baseline.familyId, pressure.familyId);

  const idsA = boundA.boundFacts.map((f) => `${f.objectKey}:${f.nexoraObjectId}:${f.metricKey}`).sort();
  const idsB = boundB.boundFacts.map((f) => `${f.objectKey}:${f.nexoraObjectId}:${f.metricKey}`).sort();
  assert.deepEqual(idsA, idsB);

  const productionA = boundA.boundFacts.find(
    (f) => f.objectKey === "production" && f.metricKey === "usedCapacity",
  );
  const productionB = boundB.boundFacts.find(
    (f) => f.objectKey === "production" && f.metricKey === "usedCapacity",
  );
  assert.equal(productionA!.nexoraObjectId, productionB!.nexoraObjectId);
  assert.notEqual(productionA!.value, productionB!.value);
});

test("Test 8 — Input immutability", () => {
  const facts = normalizeDatasetToBusinessFacts(
    getExecutiveOperationsDemoDataset(),
  );
  const factsJson = JSON.stringify(facts);
  const bindings = getExecutiveOperationsResolvedObjectBindings();
  const bindingsJson = JSON.stringify(bindings);

  const result = bindBusinessFactsToNexoraObjects(facts, bindings);
  assert.equal(result.status, "bound");
  assert.equal(JSON.stringify(facts), factsJson);
  assert.equal(JSON.stringify(bindings), bindingsJson);
  assert.notEqual(result.boundFacts, facts);
});

test("Test 9 — No presentation dependency", () => {
  const sources = [
    join(here, "objectDataBinding.ts"),
    join(here, "demo/executiveOperationsObjectBindings.ts"),
  ];
  const forbidden = [
    /from\s+["']react["']/,
    /from\s+["']three["']/,
    /from\s+["']@react-three\//,
    /nexoraMVPStageFixtures/,
    /nexora3DExecutiveStage/,
    /executive\/nex-mvp\/stage/,
    /AnimatableObject/,
  ];
  for (const file of sources) {
    const source = readFileSync(file, "utf8");
    for (const pattern of forbidden) {
      assert.equal(
        pattern.test(source),
        false,
        `${file} must not import presentation modules (${pattern})`,
      );
    }
  }
  // Ensure binding module uses NOL Public Index only for identity.
  const bindingSource = readFileSync(join(here, "objectDataBinding.ts"), "utf8");
  assert.match(
    bindingSource,
    /universalNexoraObjectPublicIndex/,
  );
  assert.equal(
    /from\s+["'][^"']*\/nol\/foundation\//.test(bindingSource),
    false,
  );
});

test("Test 10 — Canonical ID presence", () => {
  const bindings = getExecutiveOperationsResolvedObjectBindings();
  for (const binding of bindings) {
    assert.ok(binding.nexoraObjectId.trim().length > 0);
    assert.match(
      binding.nexoraObjectId,
      /^nexora\.executive-operations\.object\./,
    );
  }
  for (const entry of EXECUTIVE_OPERATIONS_OBJECT_IDENTITY_MAP) {
    const binding = resolveNexoraObjectBinding(entry.objectKey, bindings);
    assert.ok(binding);
    assert.equal(binding.nexoraObjectId, entry.nexoraObjectId);
  }

  const missingId = validateAndResolveObjectDataBindings([
    {
      objectKey: "production",
      metricKeys: ["usedCapacity", "totalCapacity"],
    },
  ]);
  assert.equal(missingId.ok, false);
  assert.ok(
    missingId.issues.some((issue) => issue.code === "MISSING_NEXORA_OBJECT_ID"),
  );
});
