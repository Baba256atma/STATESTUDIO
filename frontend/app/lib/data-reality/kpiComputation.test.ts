/**
 * P0:3 — Deterministic KPI Computation focused unit tests.
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

import type { NexoraBoundBusinessFact } from "./dataRealityContracts.ts";
import {
  computeDatasetKPIReality,
  normalizeDatasetToBusinessFacts,
} from "./dataRealityFoundation.ts";
import {
  KPI_COMPUTATION_BOUNDARY,
  computeNexoraKPI,
  computeNexoraKPIs,
  getKpiComputationIdentity,
  kpiComputationIdentity,
  kpiComputationVersion,
} from "./kpiComputation.ts";
import {
  getExecutiveOperationsDemoDataset,
  getExecutiveOperationsPressureDataset,
} from "./demo/executiveOperationsDemoDataset.ts";
import {
  EXECUTIVE_OPERATIONS_KPI_DEFINITIONS,
  countExecutiveOperationsKpiDefinitions,
  getExecutiveOperationsKpiDefinitions,
} from "./demo/executiveOperationsKPIDefinitions.ts";
import { getExecutiveOperationsResolvedObjectBindings } from "./demo/executiveOperationsObjectBindings.ts";
import { bindBusinessFactsToNexoraObjects } from "./objectDataBinding.ts";

const here = dirname(fileURLToPath(import.meta.url));

function bindDemoDataset(dataset = getExecutiveOperationsDemoDataset()) {
  const facts = normalizeDatasetToBusinessFacts(dataset);
  const binding = bindBusinessFactsToNexoraObjects(
    facts,
    getExecutiveOperationsResolvedObjectBindings(),
  );
  assert.equal(binding.status, "bound", JSON.stringify(binding.issues));
  return {
    dataset,
    facts,
    boundFacts: binding.boundFacts,
    definitions: getExecutiveOperationsKpiDefinitions(),
    context: { calculatedAt: dataset.capturedAt },
  };
}

function kpiValue(
  kpis: readonly { readonly kpiId: string; readonly value: number }[],
  kpiId: string,
): number {
  const match = kpis.find((kpi) => kpi.kpiId === kpiId);
  assert.ok(match, `missing kpi ${kpiId}`);
  return match!.value;
}

test("P0:3 identity and boundary", () => {
  const identity = getKpiComputationIdentity();
  assert.equal(kpiComputationIdentity, "P0:3/NexoraKPIComputation");
  assert.equal(identity.id, "P0:3/NexoraKPIComputation");
  assert.equal(kpiComputationVersion, "1.0.0");
  assert.equal(KPI_COMPUTATION_BOUNDARY.ownsExecutiveStateResolution, false);
  assert.equal(KPI_COMPUTATION_BOUNDARY.ownsThresholdRules, false);
  assert.equal(KPI_COMPUTATION_BOUNDARY.fabricatesCostKpi, false);
  assert.equal(KPI_COMPUTATION_BOUNDARY.consumesBoundFactsOnly, true);
});

test("Test 1 — KPI Registry has exactly five meaningful definitions", () => {
  const definitions = getExecutiveOperationsKpiDefinitions();
  assert.equal(countExecutiveOperationsKpiDefinitions(), 5);
  assert.equal(definitions.length, 5);
  assert.deepEqual(
    definitions.map((d) => d.id),
    [
      "kpi.revenue.growth",
      "kpi.production.capacity-utilization",
      "kpi.warehouse.capacity-utilization",
      "kpi.shipping.on-time-rate",
      "kpi.customer.satisfaction-index",
    ],
  );
  assert.equal(
    definitions.some((d) => d.objectKey === "cost"),
    false,
  );
});

test("Test 2 — Revenue Growth from baseline facts", () => {
  const { boundFacts, definitions, context } = bindDemoDataset();
  const definition = definitions.find((d) => d.id === "kpi.revenue.growth")!;
  const result = computeNexoraKPI(definition, boundFacts, context);
  assert.equal(result.status, "computed");
  const expected = ((8_400_000 - 8_080_000) / 8_080_000) * 100;
  assert.equal(result.kpis[0]!.value, expected);
  assert.ok(Math.abs(result.kpis[0]!.value - 3.96) < 0.01);
  assert.equal(
    result.kpis[0]!.nexoraObjectId,
    "nexora.executive-operations.object.revenue",
  );
});

test("Test 3 — Production Utilization = 87%", () => {
  const { boundFacts, definitions, context } = bindDemoDataset();
  const definition = definitions.find(
    (d) => d.id === "kpi.production.capacity-utilization",
  )!;
  const result = computeNexoraKPI(definition, boundFacts, context);
  assert.equal(result.status, "computed");
  assert.equal(result.kpis[0]!.value, (8700 / 10_000) * 100);
  assert.equal(result.kpis[0]!.value, 87);
});

test("Test 4 — Warehouse Utilization ≈ 92.94%", () => {
  const { boundFacts, definitions, context } = bindDemoDataset();
  const definition = definitions.find(
    (d) => d.id === "kpi.warehouse.capacity-utilization",
  )!;
  const result = computeNexoraKPI(definition, boundFacts, context);
  assert.equal(result.status, "computed");
  const expected = (7900 / 8500) * 100;
  assert.equal(result.kpis[0]!.value, expected);
  assert.ok(Math.abs(result.kpis[0]!.value - 92.94) < 0.01);
});

test("Test 5 — Shipping On-Time = 91%", () => {
  const { boundFacts, definitions, context } = bindDemoDataset();
  const definition = definitions.find(
    (d) => d.id === "kpi.shipping.on-time-rate",
  )!;
  const result = computeNexoraKPI(definition, boundFacts, context);
  assert.equal(result.status, "computed");
  assert.equal(result.kpis[0]!.value, 91);
});

test("Test 6 — Customer Satisfaction = 84%", () => {
  const { boundFacts, definitions, context } = bindDemoDataset();
  const definition = definitions.find(
    (d) => d.id === "kpi.customer.satisfaction-index",
  )!;
  const result = computeNexoraKPI(definition, boundFacts, context);
  assert.equal(result.status, "computed");
  assert.equal(result.kpis[0]!.value, (4.2 / 5) * 100);
  assert.ok(Math.abs(result.kpis[0]!.value - 84) < 1e-10);
});

test("Test 7 — Missing required metric", () => {
  const { boundFacts, definitions, context } = bindDemoDataset();
  const withoutTotal = boundFacts.filter(
    (fact) =>
      !(
        fact.objectKey === "production" && fact.metricKey === "totalCapacity"
      ),
  );
  const definition = definitions.find(
    (d) => d.id === "kpi.production.capacity-utilization",
  )!;
  const result = computeNexoraKPI(definition, withoutTotal, context);
  assert.equal(result.status, "invalid");
  assert.equal(result.kpis.length, 0);
  assert.ok(
    result.issues.some((issue) => issue.code === "MISSING_REQUIRED_METRIC"),
  );
});

test("Test 8 — Zero denominator", () => {
  const { boundFacts, definitions, context } = bindDemoDataset();
  const zeroDenom = boundFacts.map((fact) =>
    fact.objectKey === "production" && fact.metricKey === "totalCapacity"
      ? Object.freeze({ ...fact, value: 0 })
      : fact,
  );
  const definition = definitions.find(
    (d) => d.id === "kpi.production.capacity-utilization",
  )!;
  const result = computeNexoraKPI(definition, zeroDenom, context);
  assert.equal(result.status, "invalid");
  assert.equal(result.kpis.length, 0);
  assert.ok(result.issues.some((issue) => issue.code === "ZERO_DENOMINATOR"));
  assert.equal(
    result.kpis.some(
      (kpi) => !Number.isFinite(kpi.value) || Number.isNaN(kpi.value),
    ),
    false,
  );
});

test("Test 9 — Object isolation for shared metric names", () => {
  const { definitions, context } = bindDemoDataset();
  const productionOnly: NexoraBoundBusinessFact[] = [
    Object.freeze({
      objectKey: "production",
      metricKey: "usedCapacity",
      value: 8700,
      unit: "units",
      sourceDatasetId: "test",
      nexoraObjectId: "nexora.executive-operations.object.production",
    }),
    // Warehouse totalCapacity must NOT satisfy production.totalCapacity.
    Object.freeze({
      objectKey: "warehouse",
      metricKey: "totalCapacity",
      value: 8500,
      unit: "units",
      sourceDatasetId: "test",
      nexoraObjectId: "nexora.executive-operations.object.warehouse",
    }),
  ];
  const definition = definitions.find(
    (d) => d.id === "kpi.production.capacity-utilization",
  )!;
  const result = computeNexoraKPI(definition, productionOnly, context);
  assert.equal(result.status, "invalid");
  assert.equal(result.kpis.length, 0);
  assert.ok(
    result.issues.some(
      (issue) =>
        issue.code === "MISSING_REQUIRED_METRIC" &&
        issue.metricKey === "totalCapacity" &&
        issue.objectKey === "production",
    ),
  );
});

test("Test 10 — Duplicate / ambiguous metric facts", () => {
  const { boundFacts, definitions, context } = bindDemoDataset();
  const duplicate: NexoraBoundBusinessFact[] = [
    ...boundFacts,
    Object.freeze({
      objectKey: "production",
      metricKey: "usedCapacity",
      value: 9999,
      unit: "units",
      sourceDatasetId: "test-dup",
      nexoraObjectId: "nexora.executive-operations.object.production",
    }),
  ];
  const definition = definitions.find(
    (d) => d.id === "kpi.production.capacity-utilization",
  )!;
  const result = computeNexoraKPI(definition, duplicate, context);
  assert.equal(result.status, "invalid");
  assert.equal(result.kpis.length, 0);
  assert.ok(
    result.issues.some((issue) => issue.code === "AMBIGUOUS_METRIC_FACT"),
  );
});

test("Test 11 — Dataset A/B same model, different KPI results", () => {
  const bindings = getExecutiveOperationsResolvedObjectBindings();
  const definitions = getExecutiveOperationsKpiDefinitions();
  const baseline = getExecutiveOperationsDemoDataset();
  const pressure = getExecutiveOperationsPressureDataset();

  assert.equal(baseline.familyId, pressure.familyId);
  assert.equal(definitions, EXECUTIVE_OPERATIONS_KPI_DEFINITIONS);

  const resultA = computeDatasetKPIReality(baseline, { bindings, definitions });
  const resultB = computeDatasetKPIReality(pressure, { bindings, definitions });

  assert.equal(resultA.status, "computed");
  assert.equal(resultB.status, "computed");
  assert.equal(resultA.kpis.length, 5);
  assert.equal(resultB.kpis.length, 5);

  // Same object identities and KPI ids.
  assert.deepEqual(
    resultA.kpis.map((k) => `${k.kpiId}:${k.nexoraObjectId}`).sort(),
    resultB.kpis.map((k) => `${k.kpiId}:${k.nexoraObjectId}`).sort(),
  );

  assert.notEqual(
    kpiValue(resultA.kpis, "kpi.revenue.growth"),
    kpiValue(resultB.kpis, "kpi.revenue.growth"),
  );
  assert.equal(kpiValue(resultA.kpis, "kpi.production.capacity-utilization"), 87);
  assert.equal(kpiValue(resultB.kpis, "kpi.production.capacity-utilization"), 96);
  assert.equal(kpiValue(resultA.kpis, "kpi.shipping.on-time-rate"), 91);
  assert.equal(kpiValue(resultB.kpis, "kpi.shipping.on-time-rate"), 82);
  assert.equal(
    kpiValue(resultA.kpis, "kpi.customer.satisfaction-index"),
    (4.2 / 5) * 100,
  );
  assert.equal(
    kpiValue(resultB.kpis, "kpi.customer.satisfaction-index"),
    (3.6 / 5) * 100,
  );
});

test("Test 12 — Determinism with same calculation context", () => {
  const { boundFacts, definitions, context } = bindDemoDataset();
  const a = computeNexoraKPIs(definitions, boundFacts, context);
  const b = computeNexoraKPIs(definitions, boundFacts, context);
  assert.equal(a.status, "computed");
  assert.deepEqual(a, b);
});

test("Test 13 — Immutability of inputs", () => {
  const { dataset, facts, boundFacts, definitions, context } = bindDemoDataset();
  const datasetJson = JSON.stringify(dataset);
  const factsJson = JSON.stringify(facts);
  const boundJson = JSON.stringify(boundFacts);
  const definitionsJson = JSON.stringify(definitions);

  const result = computeNexoraKPIs(definitions, boundFacts, context);
  assert.equal(result.status, "computed");
  assert.equal(JSON.stringify(dataset), datasetJson);
  assert.equal(JSON.stringify(facts), factsJson);
  assert.equal(JSON.stringify(boundFacts), boundJson);
  assert.equal(JSON.stringify(definitions), definitionsJson);
});

test("Test 14 — No presentation dependencies", () => {
  const sources = [
    join(here, "kpiComputation.ts"),
    join(here, "demo/executiveOperationsKPIDefinitions.ts"),
  ];
  const forbidden = [
    /from\s+["']react["']/,
    /from\s+["']three["']/,
    /from\s+["']@react-three\//,
    /nexoraMVPStageFixtures/,
    /nexora3DExecutiveStage/,
    /executive\/nex-mvp\/stage/,
    /runtimeExecutiveStage/,
    /NexoraSceneEnvironment/,
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
});

test("Test 15 — No executive-state resolution", () => {
  const { boundFacts, definitions, context } = bindDemoDataset();
  const result = computeNexoraKPIs(definitions, boundFacts, context);
  assert.equal(result.status, "computed");
  for (const kpi of result.kpis) {
    assert.equal("state" in kpi, false);
    assert.equal("executiveState" in kpi, false);
    assert.equal("attention" in kpi, false);
    assert.equal("severity" in kpi, false);
    assert.equal("color" in kpi, false);
  }

  const source = readFileSync(join(here, "kpiComputation.ts"), "utf8");
  assert.equal(source.includes("NEXORA_EXECUTIVE_STATES"), false);
  assert.equal(/normal\s*\|\s*attention\s*\|\s*critical/.test(source), false);
  assert.equal(/critical\s*=/.test(source), false);
  assert.equal(/attention\s*=/.test(source), false);
  assert.equal(KPI_COMPUTATION_BOUNDARY.ownsThresholdRules, false);
  assert.equal(KPI_COMPUTATION_BOUNDARY.ownsExecutiveStateResolution, false);
});
