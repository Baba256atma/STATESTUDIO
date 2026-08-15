/**
 * P0:1 — Data Reality Foundation focused unit tests.
 */

import assert from "node:assert/strict";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

import {
  DATA_REALITY_FOUNDATION_BOUNDARY,
  NEXORA_EXECUTIVE_STATES,
  NEXORA_PRESENTATION_DEPTH_STATES,
  dataRealityFoundationIdentity,
  dataRealityFoundationVersion,
  getDataRealityFoundationIdentity,
  isNexoraExecutiveState,
  isPresentationDepthState,
  isPresentationIndependentKpiDefinition,
  normalizeDatasetToBusinessFacts,
  validateDataRealityDataset,
  validateNexoraKPIDefinitions,
  validateNexoraObjectDataBindings,
  withDatasetRecords,
  withDatasetScenario,
} from "./dataRealityFoundation.ts";

import {
  EXECUTIVE_OPERATIONS_DEMO_DATASET,
  EXECUTIVE_OPERATIONS_KPI_DEFINITIONS,
  EXECUTIVE_OPERATIONS_OBJECT_BINDINGS,
  EXECUTIVE_OPERATIONS_OBJECT_KEYS,
  EXECUTIVE_OPERATIONS_PRESSURE_DATASET_ID,
  countExecutiveOperationsDemoObjects,
  countExecutiveOperationsDemoRecords,
  getExecutiveOperationsDemoDataset,
} from "./demo/executiveOperationsDemoDataset.ts";

import { NEXORA_MVP_PRESENTATION_STATES } from "@/app/lib/nex-mvp/nexoraMVPApplicationFoundation.ts";

const here = dirname(fileURLToPath(import.meta.url));

function collectSourceFiles(dir: string): string[] {
  const out: string[] = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    const st = statSync(full);
    if (st.isDirectory()) {
      out.push(...collectSourceFiles(full));
    } else if (entry.endsWith(".ts") && !entry.endsWith(".test.ts")) {
      out.push(full);
    }
  }
  return out;
}

test("identity and version", () => {
  const identity = getDataRealityFoundationIdentity();
  assert.equal(dataRealityFoundationIdentity, "P0:1/NexoraDataRealityFoundation");
  assert.equal(identity.id, "P0:1/NexoraDataRealityFoundation");
  assert.equal(dataRealityFoundationVersion, "1.0.0");
  assert.equal(identity.version, "1.0.0");
  assert.equal(DATA_REALITY_FOUNDATION_BOUNDARY.ownsStageMutation, false);
  assert.equal(DATA_REALITY_FOUNDATION_BOUNDARY.ownsThreeJs, false);
  assert.equal(DATA_REALITY_FOUNDATION_BOUNDARY.stageMayImportDemoDataset, false);
});

test("Test 1 — Canonical demo dataset is valid", () => {
  const dataset = getExecutiveOperationsDemoDataset();
  const validation = validateDataRealityDataset(dataset);
  assert.equal(validation.ok, true, JSON.stringify(validation.issues));
  assert.equal(dataset.name, "Nexora Executive Operations Demo");
  assert.equal(dataset.scenario, "baseline");
  assert.equal(countExecutiveOperationsDemoObjects(), 6);
  assert.equal(countExecutiveOperationsDemoRecords(), 11);
  assert.deepEqual([...EXECUTIVE_OPERATIONS_OBJECT_KEYS], [
    "revenue",
    "cost",
    "production",
    "warehouse",
    "shipping",
    "customer",
  ]);
});

test("Test 2 — Dataset normalization is deterministic", () => {
  const dataset = getExecutiveOperationsDemoDataset();
  const a = normalizeDatasetToBusinessFacts(dataset);
  const b = normalizeDatasetToBusinessFacts(dataset);
  assert.deepEqual(a, b);
  assert.equal(a.length, dataset.records.length);

  // Normalization sorts by objectKey, metricKey regardless of input order.
  const shuffled = withDatasetRecords(dataset, [
    dataset.records[4]!,
    dataset.records[0]!,
    dataset.records[9]!,
    dataset.records[2]!,
    dataset.records[7]!,
    dataset.records[1]!,
    dataset.records[10]!,
    dataset.records[3]!,
    dataset.records[6]!,
    dataset.records[5]!,
    dataset.records[8]!,
  ]);
  const fromShuffled = normalizeDatasetToBusinessFacts(shuffled);
  assert.deepEqual(fromShuffled, a);
});

test("Test 3 — Business facts preserve source dataset identity", () => {
  const dataset = getExecutiveOperationsDemoDataset();
  const facts = normalizeDatasetToBusinessFacts(dataset);
  assert.ok(facts.length > 0);
  for (const fact of facts) {
    assert.equal(fact.sourceDatasetId, dataset.id);
    assert.equal(fact.sourceDatasetId, EXECUTIVE_OPERATIONS_DEMO_DATASET.id);
  }
});

test("Test 4 — Object data bindings reference valid object keys", () => {
  const validation = validateNexoraObjectDataBindings(
    EXECUTIVE_OPERATIONS_OBJECT_BINDINGS,
    EXECUTIVE_OPERATIONS_OBJECT_KEYS,
  );
  assert.equal(validation.ok, true, JSON.stringify(validation.issues));
  assert.equal(
    EXECUTIVE_OPERATIONS_OBJECT_BINDINGS.length,
    EXECUTIVE_OPERATIONS_OBJECT_KEYS.length,
  );
  for (const binding of EXECUTIVE_OPERATIONS_OBJECT_BINDINGS) {
    assert.ok(
      (EXECUTIVE_OPERATIONS_OBJECT_KEYS as readonly string[]).includes(
        binding.objectKey,
      ),
    );
    assert.ok(binding.metricKeys.length > 0);
  }

  const invalid = validateNexoraObjectDataBindings(
    [{ objectKey: "not-a-demo-object", metricKeys: ["x"] }],
    EXECUTIVE_OPERATIONS_OBJECT_KEYS,
  );
  assert.equal(invalid.ok, false);
  assert.ok(
    invalid.issues.some((issue) => issue.code === "UNKNOWN_BINDING_OBJECT_KEY"),
  );
});

test("Test 5 — KPI definitions remain presentation-independent", () => {
  const validation = validateNexoraKPIDefinitions(
    EXECUTIVE_OPERATIONS_KPI_DEFINITIONS,
  );
  assert.equal(validation.ok, true, JSON.stringify(validation.issues));
  for (const definition of EXECUTIVE_OPERATIONS_KPI_DEFINITIONS) {
    assert.equal(isPresentationIndependentKpiDefinition(definition), true);
    assert.equal("color" in definition, false);
    assert.equal("material" in definition, false);
    assert.equal("animation" in definition, false);
    assert.equal("camera" in definition, false);
  }
});

test("Test 6 — Executive state is separate from Minimum/Report/Operation", () => {
  assert.deepEqual([...NEXORA_EXECUTIVE_STATES], [
    "normal",
    "attention",
    "critical",
  ]);
  assert.deepEqual([...NEXORA_PRESENTATION_DEPTH_STATES], [
    "minimum",
    "report",
    "operation",
  ]);
  assert.deepEqual([...NEXORA_MVP_PRESENTATION_STATES], [
    "minimum",
    "report",
    "operation",
  ]);

  for (const state of NEXORA_EXECUTIVE_STATES) {
    assert.equal(isNexoraExecutiveState(state), true);
    assert.equal(isPresentationDepthState(state), false);
  }
  for (const depth of NEXORA_PRESENTATION_DEPTH_STATES) {
    assert.equal(isPresentationDepthState(depth), true);
    assert.equal(isNexoraExecutiveState(depth), false);
  }

  const overlap = NEXORA_EXECUTIVE_STATES.filter((state) =>
    (NEXORA_PRESENTATION_DEPTH_STATES as readonly string[]).includes(state),
  );
  assert.deepEqual(overlap, []);
});

test("Test 7 — Data Reality contracts contain no Stage/Three.js dependencies", () => {
  const sources = collectSourceFiles(here);
  assert.ok(sources.length >= 3);

  const forbiddenImportPatterns = [
    /from\s+["']three["']/,
    /from\s+["']@react-three\//,
    /from\s+["'][^"']*\/executive\/nex-mvp\/stage\//,
    /from\s+["'][^"']*nexoraMVPStageFixtures/,
    /from\s+["'][^"']*nexora3DExecutiveStage/,
    /from\s+["'][^"']*AnimatableObject/,
  ];

  for (const file of sources) {
    const source = readFileSync(file, "utf8");
    for (const pattern of forbiddenImportPatterns) {
      assert.equal(
        pattern.test(source),
        false,
        `${file} must not import Stage/Three.js (${pattern})`,
      );
    }
    assert.equal(
      /from\s+["']react["']/.test(source),
      false,
      `${file} must not import React`,
    );
  }

  // Low-level Stage rendering must never import Data Reality or demo datasets.
  // Shell composition may consume a nex-mvp bridge (P0:5) — not these mesh files.
  const stageRenderRoot = join(here, "../../executive/nex-mvp/stage");
  const stageRenderFiles = collectSourceFiles(stageRenderRoot);
  for (const file of stageRenderFiles) {
    const source = readFileSync(file, "utf8");
    assert.equal(
      source.includes("executiveOperationsDemoDataset"),
      false,
      `${file} must not import demo dataset`,
    );
    assert.equal(
      source.includes("data-reality"),
      false,
      `${file} must not import data-reality`,
    );
    assert.equal(
      source.includes("nexoraMVPDataRealityStageBridge"),
      false,
      `${file} must not import Data Reality Stage bridge`,
    );
  }
});

test("Test 8 — Changing dataset values yields different facts without mutating original", () => {
  const original = getExecutiveOperationsDemoDataset();
  const originalJson = JSON.stringify(original);
  const originalFacts = normalizeDatasetToBusinessFacts(original);

  const pressureRecords = original.records.map((record) => {
    if (
      record.objectKey === "production" &&
      record.metricKey === "usedCapacity"
    ) {
      return Object.freeze({ ...record, value: 9600 });
    }
    if (
      record.objectKey === "warehouse" &&
      record.metricKey === "usedCapacity"
    ) {
      return Object.freeze({ ...record, value: 8400 });
    }
    if (
      record.objectKey === "shipping" &&
      record.metricKey === "onTimeDeliveries"
    ) {
      return Object.freeze({ ...record, value: 820 });
    }
    return record;
  });

  const pressure = withDatasetScenario(original, {
    id: EXECUTIVE_OPERATIONS_PRESSURE_DATASET_ID,
    scenario: "operational-pressure",
    capturedAt: "2026-08-10T12:00:00.000Z",
    records: pressureRecords,
  });

  assert.equal(JSON.stringify(original), originalJson);
  assert.equal(original.scenario, "baseline");
  assert.equal(pressure.scenario, "operational-pressure");
  assert.equal(pressure.familyId, original.familyId);
  assert.notEqual(pressure.id, original.id);

  const pressureFacts = normalizeDatasetToBusinessFacts(pressure);
  assert.notDeepEqual(pressureFacts, originalFacts);
  assert.equal(
    pressureFacts.find(
      (f) => f.objectKey === "production" && f.metricKey === "usedCapacity",
    )?.value,
    9600,
  );
  assert.equal(
    originalFacts.find(
      (f) => f.objectKey === "production" && f.metricKey === "usedCapacity",
    )?.value,
    8700,
  );
  assert.ok(
    pressureFacts.every((f) => f.sourceDatasetId === pressure.id),
  );
});

test("HOTFIX — foundation does not runtime-import Node-only P1:6 certification", () => {
  const foundationSource = readFileSync(
    join(here, "dataRealityFoundation.ts"),
    "utf8",
  );
  assert.equal(
    /from\s+["']\.\/dataRealityExecutiveAdvisorCertification\.ts["']/.test(
      foundationSource,
    ),
    false,
    "dataRealityFoundation must not import/re-export certification (node:fs)",
  );
  assert.equal(
    /export\s+\{[\s\S]*certifyDataRealityExecutiveAdvisorEndToEnd[\s\S]*\}\s+from/.test(
      foundationSource,
    ),
    false,
  );

  // Client-reachable production modules under data-reality (non-test) must not
  // transitively pull node:fs except the dedicated certification module itself.
  const productionSources = collectSourceFiles(here).filter(
    (path) => !path.endsWith("dataRealityExecutiveAdvisorCertification.ts"),
  );
  for (const path of productionSources) {
    const source = readFileSync(path, "utf8");
    assert.equal(
      /from\s+["']node:fs["']|require\(\s*["']fs["']\s*\)/.test(source),
      false,
      `${path} must remain client-safe (no node:fs)`,
    );
  }
});

test("HOTFIX — certification remains directly importable", async () => {
  const certification = await import(
    "./dataRealityExecutiveAdvisorCertification.ts"
  );
  assert.equal(
    certification.dataRealityExecutiveAdvisorCertificationIdentity,
    "P1:6/DataRealityExecutiveAdvisorEndToEndCertification",
  );
  assert.equal(
    typeof certification.certifyDataRealityExecutiveAdvisorEndToEnd,
    "function",
  );
  assert.ok(certification.DATA_REALITY_EXECUTIVE_ADVISOR_DEFAULT_CERTIFICATION_CONTEXT);
});
