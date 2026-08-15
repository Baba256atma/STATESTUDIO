/**
 * P0:4 — Executive State Resolution focused unit tests.
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

import type {
  NexoraExecutiveStateRule,
  NexoraKPIResult,
} from "./dataRealityContracts.ts";
import {
  resolveDatasetExecutiveReality,
} from "./dataRealityFoundation.ts";
import {
  EXECUTIVE_STATE_RESOLUTION_BOUNDARY,
  executiveStateResolutionIdentity,
  executiveStateResolutionVersion,
  getExecutiveStateResolutionIdentity,
  matchesExecutiveStateBand,
  resolveKPIExecutiveState,
  resolveObjectExecutiveStates,
} from "./executiveStateResolution.ts";
import {
  getExecutiveOperationsDemoDataset,
  getExecutiveOperationsPressureDataset,
} from "./demo/executiveOperationsDemoDataset.ts";
import { getExecutiveOperationsKpiDefinitions } from "./demo/executiveOperationsKPIDefinitions.ts";
import { getExecutiveOperationsResolvedObjectBindings } from "./demo/executiveOperationsObjectBindings.ts";
import {
  EXECUTIVE_OPERATIONS_EXECUTIVE_STATE_RULES,
  countExecutiveOperationsExecutiveStateRules,
  getExecutiveOperationsExecutiveStateRules,
} from "./demo/executiveOperationsExecutiveStateRules.ts";

const here = dirname(fileURLToPath(import.meta.url));

function demoPipeline(dataset = getExecutiveOperationsDemoDataset()) {
  return resolveDatasetExecutiveReality(dataset, {
    bindings: getExecutiveOperationsResolvedObjectBindings(),
    definitions: getExecutiveOperationsKpiDefinitions(),
    rules: getExecutiveOperationsExecutiveStateRules(),
  });
}

function objectState(
  result: ReturnType<typeof demoPipeline>,
  objectKey: string,
) {
  return result.objectStates.find((entry) => entry.objectKey === objectKey);
}

function syntheticKpi(
  partial: Partial<NexoraKPIResult> &
    Pick<NexoraKPIResult, "kpiId" | "objectKey" | "value">,
): NexoraKPIResult {
  return Object.freeze({
    nexoraObjectId:
      partial.nexoraObjectId ??
      `nexora.executive-operations.object.${partial.objectKey}`,
    unit: partial.unit ?? "%",
    calculatedAt: partial.calculatedAt ?? "2026-08-10T00:00:00.000Z",
    ...partial,
  });
}

function resolveValue(
  rule: NexoraExecutiveStateRule,
  value: number,
) {
  return resolveKPIExecutiveState(
    syntheticKpi({
      kpiId: rule.kpiId,
      objectKey: rule.objectKey,
      value,
    }),
    [rule],
  );
}

test("P0:4 identity and boundary", () => {
  const identity = getExecutiveStateResolutionIdentity();
  assert.equal(
    executiveStateResolutionIdentity,
    "P0:4/NexoraExecutiveStateResolution",
  );
  assert.equal(identity.id, "P0:4/NexoraExecutiveStateResolution");
  assert.equal(executiveStateResolutionVersion, "1.0.0");
  assert.equal(EXECUTIVE_STATE_RESOLUTION_BOUNDARY.ownsRuntimeMapping, false);
  assert.equal(
    EXECUTIVE_STATE_RESOLUTION_BOUNDARY.ownsRexAttentionMapping,
    false,
  );
  assert.equal(
    EXECUTIVE_STATE_RESOLUTION_BOUNDARY.ownsDriAttentionMapping,
    false,
  );
  assert.equal(EXECUTIVE_STATE_RESOLUTION_BOUNDARY.ownsAdvisorNarrative, false);
  assert.equal(
    EXECUTIVE_STATE_RESOLUTION_BOUNDARY.fabricatesStateWithoutKpi,
    false,
  );
});

test("Test 1 — State Rule Registry has exactly five rules", () => {
  const rules = getExecutiveOperationsExecutiveStateRules();
  assert.equal(countExecutiveOperationsExecutiveStateRules(), 5);
  assert.equal(rules.length, 5);
  assert.deepEqual(
    rules.map((rule) => rule.id),
    [
      "revenue-growth-state-rule",
      "production-capacity-state-rule",
      "warehouse-utilization-state-rule",
      "shipping-ontime-state-rule",
      "customer-satisfaction-state-rule",
    ],
  );
});

test("Test 2 — Revenue Dataset A → normal", () => {
  const result = demoPipeline(getExecutiveOperationsDemoDataset());
  assert.equal(result.status, "resolved");
  const revenue = objectState(result, "revenue");
  assert.ok(revenue);
  assert.equal(revenue!.state, "normal");
  assert.ok(revenue!.reasons[0]!.value > 3);
  assert.equal(
    revenue!.nexoraObjectId,
    "nexora.executive-operations.object.revenue",
  );
});

test("Test 3 — Revenue Dataset B → attention", () => {
  const result = demoPipeline(getExecutiveOperationsPressureDataset());
  const revenue = objectState(result, "revenue");
  assert.ok(revenue);
  assert.equal(revenue!.state, "attention");
  assert.ok(revenue!.reasons[0]!.value >= 0);
  assert.ok(revenue!.reasons[0]!.value < 3);
});

test("Test 4 — Production Dataset A → attention", () => {
  const result = demoPipeline(getExecutiveOperationsDemoDataset());
  const production = objectState(result, "production");
  assert.ok(production);
  assert.equal(production!.state, "attention");
  assert.equal(production!.reasons[0]!.value, 87);
});

test("Test 5 — Production Dataset B → critical", () => {
  const result = demoPipeline(getExecutiveOperationsPressureDataset());
  const production = objectState(result, "production");
  assert.ok(production);
  assert.equal(production!.state, "critical");
  assert.equal(production!.reasons[0]!.value, 96);
});

test("Test 6 — Warehouse A/B", () => {
  const a = objectState(demoPipeline(getExecutiveOperationsDemoDataset()), "warehouse");
  const b = objectState(
    demoPipeline(getExecutiveOperationsPressureDataset()),
    "warehouse",
  );
  assert.equal(a!.state, "attention");
  assert.equal(b!.state, "critical");
});

test("Test 7 — Shipping A/B", () => {
  const a = objectState(demoPipeline(getExecutiveOperationsDemoDataset()), "shipping");
  const b = objectState(
    demoPipeline(getExecutiveOperationsPressureDataset()),
    "shipping",
  );
  assert.equal(a!.state, "attention");
  assert.equal(a!.reasons[0]!.value, 91);
  assert.equal(b!.state, "critical");
  assert.equal(b!.reasons[0]!.value, 82);
});

test("Test 8 — Customer A/B", () => {
  const a = objectState(demoPipeline(getExecutiveOperationsDemoDataset()), "customer");
  const b = objectState(
    demoPipeline(getExecutiveOperationsPressureDataset()),
    "customer",
  );
  assert.equal(a!.state, "attention");
  assert.ok(a!.reasons[0]!.value < 85);
  assert.equal(b!.state, "critical");
  assert.equal(b!.reasons[0]!.value, 72);
});

test("Test 9 — Cost receives no fabricated state", () => {
  const a = demoPipeline(getExecutiveOperationsDemoDataset());
  const b = demoPipeline(getExecutiveOperationsPressureDataset());
  assert.equal(objectState(a, "cost"), undefined);
  assert.equal(objectState(b, "cost"), undefined);
  assert.equal(
    a.objectStates.some((entry) => entry.objectKey === "cost"),
    false,
  );
  assert.equal(a.boundFacts.some((fact) => fact.objectKey === "cost"), true);
});

test("Test 10 — Explicit threshold boundaries", () => {
  const rules = getExecutiveOperationsExecutiveStateRules();
  const production = rules.find((r) => r.id === "production-capacity-state-rule")!;
  const shipping = rules.find((r) => r.id === "shipping-ontime-state-rule")!;
  const customer = rules.find((r) => r.id === "customer-satisfaction-state-rule")!;
  const revenue = rules.find((r) => r.id === "revenue-growth-state-rule")!;

  assert.equal(resolveValue(production, 84.999).reason!.state, "normal");
  assert.equal(resolveValue(production, 85).reason!.state, "attention");
  assert.equal(resolveValue(production, 94.999).reason!.state, "attention");
  assert.equal(resolveValue(production, 95).reason!.state, "critical");

  assert.equal(resolveValue(shipping, 95).reason!.state, "normal");
  assert.equal(resolveValue(shipping, 94.999).reason!.state, "attention");
  assert.equal(resolveValue(shipping, 85).reason!.state, "attention");
  assert.equal(resolveValue(shipping, 84.999).reason!.state, "critical");

  assert.equal(resolveValue(customer, 85).reason!.state, "normal");
  assert.equal(resolveValue(customer, 84.00000000000001).reason!.state, "attention");
  assert.equal(resolveValue(customer, 75).reason!.state, "attention");
  assert.equal(resolveValue(customer, 74.999).reason!.state, "critical");

  assert.equal(resolveValue(revenue, 3).reason!.state, "normal");
  assert.equal(resolveValue(revenue, 2.999).reason!.state, "attention");
  assert.equal(resolveValue(revenue, 0).reason!.state, "attention");
  assert.equal(resolveValue(revenue, -0.001).reason!.state, "critical");

  // Band helper inclusivity contract.
  assert.equal(
    matchesExecutiveStateBand(85, { state: "attention", minInclusive: 85, maxExclusive: 95 }),
    true,
  );
  assert.equal(
    matchesExecutiveStateBand(95, { state: "attention", minInclusive: 85, maxExclusive: 95 }),
    false,
  );
});

test("Test 11 — Unknown rule produces explicit issue", () => {
  const result = resolveKPIExecutiveState(
    syntheticKpi({
      kpiId: "kpi.unknown",
      objectKey: "production",
      value: 50,
    }),
    getExecutiveOperationsExecutiveStateRules(),
  );
  assert.equal(result.status, "invalid");
  assert.equal(result.reason, null);
  assert.ok(result.issues.some((issue) => issue.code === "UNKNOWN_STATE_RULE"));
});

test("Test 12 — Non-finite KPI rejected", () => {
  const result = resolveKPIExecutiveState(
    syntheticKpi({
      kpiId: "kpi.production.capacity-utilization",
      objectKey: "production",
      value: Number.NaN,
    }),
    getExecutiveOperationsExecutiveStateRules(),
  );
  assert.equal(result.status, "invalid");
  assert.ok(
    result.issues.some((issue) => issue.code === "NON_FINITE_KPI_VALUE"),
  );
});

test("Test 13 — Shipping KPI cannot use Production rule", () => {
  const productionRule = getExecutiveOperationsExecutiveStateRules().find(
    (rule) => rule.id === "production-capacity-state-rule",
  )!;
  const result = resolveKPIExecutiveState(
    syntheticKpi({
      kpiId: "kpi.shipping.on-time-rate",
      objectKey: "shipping",
      value: 91,
    }),
    [productionRule],
  );
  assert.equal(result.status, "invalid");
  assert.ok(result.issues.some((issue) => issue.code === "UNKNOWN_STATE_RULE"));

  const mismatched = resolveKPIExecutiveState(
    syntheticKpi({
      kpiId: "kpi.production.capacity-utilization",
      objectKey: "shipping",
      value: 91,
    }),
    [productionRule],
  );
  assert.equal(mismatched.status, "invalid");
  assert.ok(
    mismatched.issues.some((issue) => issue.code === "KPI_RULE_MISMATCH"),
  );
});

test("Test 14 — Multi-KPI severity aggregation", () => {
  const rules: readonly NexoraExecutiveStateRule[] = Object.freeze([
    Object.freeze({
      id: "agg-a",
      kpiId: "kpi.agg.a",
      objectKey: "production",
      kpiName: "Agg A",
      worseWhen: "higher" as const,
      bands: Object.freeze([
        Object.freeze({ state: "normal" as const, maxExclusive: 50 }),
        Object.freeze({
          state: "attention" as const,
          minInclusive: 50,
          maxExclusive: 80,
        }),
        Object.freeze({ state: "critical" as const, minInclusive: 80 }),
      ]),
    }),
    Object.freeze({
      id: "agg-b",
      kpiId: "kpi.agg.b",
      objectKey: "production",
      kpiName: "Agg B",
      worseWhen: "higher" as const,
      bands: Object.freeze([
        Object.freeze({ state: "normal" as const, maxExclusive: 50 }),
        Object.freeze({
          state: "attention" as const,
          minInclusive: 50,
          maxExclusive: 80,
        }),
        Object.freeze({ state: "critical" as const, minInclusive: 80 }),
      ]),
    }),
  ]);

  const normalPlusAttention = resolveObjectExecutiveStates(
    [
      syntheticKpi({ kpiId: "kpi.agg.a", objectKey: "production", value: 10 }),
      syntheticKpi({ kpiId: "kpi.agg.b", objectKey: "production", value: 60 }),
    ],
    rules,
  );
  assert.equal(normalPlusAttention.status, "resolved");
  assert.equal(normalPlusAttention.objectStates[0]!.state, "attention");
  assert.equal(normalPlusAttention.objectStates[0]!.reasons.length, 2);

  const attentionPlusCritical = resolveObjectExecutiveStates(
    [
      syntheticKpi({ kpiId: "kpi.agg.a", objectKey: "production", value: 60 }),
      syntheticKpi({ kpiId: "kpi.agg.b", objectKey: "production", value: 90 }),
    ],
    rules,
  );
  assert.equal(attentionPlusCritical.objectStates[0]!.state, "critical");
});

test("Test 15 — Dataset A/B use the exact same rule registry", () => {
  const rules = getExecutiveOperationsExecutiveStateRules();
  assert.equal(rules, EXECUTIVE_OPERATIONS_EXECUTIVE_STATE_RULES);
  const a = resolveDatasetExecutiveReality(getExecutiveOperationsDemoDataset(), {
    bindings: getExecutiveOperationsResolvedObjectBindings(),
    definitions: getExecutiveOperationsKpiDefinitions(),
    rules,
  });
  const b = resolveDatasetExecutiveReality(
    getExecutiveOperationsPressureDataset(),
    {
      bindings: getExecutiveOperationsResolvedObjectBindings(),
      definitions: getExecutiveOperationsKpiDefinitions(),
      rules,
    },
  );
  assert.equal(a.status, "resolved");
  assert.equal(b.status, "resolved");
  assert.deepEqual(
    a.objectStates.map((s) => s.reasons[0]!.ruleId).sort(),
    b.objectStates.map((s) => s.reasons[0]!.ruleId).sort(),
  );
});

test("Test 16 — Snapshot A/B differ in facts/KPIs/states with stable identities", () => {
  const a = demoPipeline(getExecutiveOperationsDemoDataset());
  const b = demoPipeline(getExecutiveOperationsPressureDataset());

  assert.notDeepEqual(a.snapshot.facts, b.snapshot.facts);
  assert.notDeepEqual(a.snapshot.kpis, b.snapshot.kpis);
  assert.notDeepEqual(a.snapshot.objectStates, b.snapshot.objectStates);

  assert.deepEqual(
    a.snapshot.objectStates.map((s) => `${s.objectKey}:${s.nexoraObjectId}`).sort(),
    b.snapshot.objectStates.map((s) => `${s.objectKey}:${s.nexoraObjectId}`).sort(),
  );
  assert.notEqual(
    objectState(a, "production")!.state,
    objectState(b, "production")!.state,
  );
  assert.equal(a.snapshot.createdAt, getExecutiveOperationsDemoDataset().capturedAt);
  assert.equal(
    b.snapshot.createdAt,
    getExecutiveOperationsPressureDataset().capturedAt,
  );
});

test("Test 17 — Determinism", () => {
  const kpis = demoPipeline().kpis;
  const rules = getExecutiveOperationsExecutiveStateRules();
  const first = resolveObjectExecutiveStates(kpis, rules);
  const second = resolveObjectExecutiveStates(kpis, rules);
  assert.deepEqual(first, second);
});

test("Test 18 — Immutability", () => {
  const reality = demoPipeline();
  const kpisJson = JSON.stringify(reality.kpis);
  const rulesJson = JSON.stringify(getExecutiveOperationsExecutiveStateRules());
  const result = resolveObjectExecutiveStates(
    reality.kpis,
    getExecutiveOperationsExecutiveStateRules(),
  );
  assert.equal(result.status, "resolved");
  assert.equal(JSON.stringify(reality.kpis), kpisJson);
  assert.equal(
    JSON.stringify(getExecutiveOperationsExecutiveStateRules()),
    rulesJson,
  );
});

test("Test 19 — No presentation dependency", () => {
  const sources = [
    join(here, "executiveStateResolution.ts"),
    join(here, "demo/executiveOperationsExecutiveStateRules.ts"),
  ];
  const forbidden = [
    /from\s+["']react["']/,
    /from\s+["']three["']/,
    /from\s+["']@react-three\//,
    /nexoraMVPStageFixtures/,
    /nexora3DExecutiveStage/,
    /executive\/nex-mvp\/stage/,
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

test("Test 20 — No Runtime / REX / DRI mapping", () => {
  const source = readFileSync(join(here, "executiveStateResolution.ts"), "utf8");
  assert.equal(/from\s+["'][^"']*\/rex\//.test(source), false);
  assert.equal(/from\s+["'][^"']*\/dri\//.test(source), false);
  assert.equal(/from\s+["'][^"']*\/ex-dri\//.test(source), false);
  assert.equal(/from\s+["'][^"']*\/nex-ci\//.test(source), false);
  assert.equal(/from\s+["'][^"']*\/nex-mvp\//.test(source), false);
  assert.equal(source.includes("stable | watch | risk"), false);
  assert.equal(source.includes('"Green"'), false);
  assert.equal(source.includes('"Yellow"'), false);
  assert.equal(source.includes('"Red"'), false);
  assert.equal(/elevated|important/.test(source), false);
  assert.equal(EXECUTIVE_STATE_RESOLUTION_BOUNDARY.ownsRuntimeMapping, false);
  assert.equal(
    EXECUTIVE_STATE_RESOLUTION_BOUNDARY.ownsNolStatusProjection,
    false,
  );
});
