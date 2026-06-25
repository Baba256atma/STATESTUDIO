import assert from "node:assert/strict";
import test from "node:test";

import {
  EXECUTIVE_INTELLIGENCE_REGISTRY_TAGS,
  EXECUTIVE_REGISTRY_STORAGE_KEY,
  NEXORA_EXECUTIVE_REGISTRY_LOG_PREFIX,
  RESERVED_EXECUTIVE_INDEX_SEEDS,
  buildExecutiveIndexId,
  getExecutiveIndex,
  getExecutiveIndexes,
  isExecutiveIndexRegistered,
  registerExecutiveIndex,
  resetExecutiveIntelligenceRegistryStoreForTests,
  unregisterExecutiveIndex,
  validateExecutiveIndexCategory,
  validateExecutiveIndexDependencies,
} from "./executiveIntelligenceRegistry.ts";

const PROTECTED_STORAGE_KEYS = Object.freeze([
  "nexora.workspaceScenarios.v1",
  "nexora.workspaceScenarioInsights.v1",
  "nexora.workspaceScenarioSimulations.v1",
  "nexora.workspaceScenarioComparisons.v1",
  "nexora.workspaceKpis.v1",
  "nexora.workspaceObjectives.v1",
  "nexora.workspaceRisks.v1",
  "nexora.workspaceDetectedRisks.v1",
  "nexora.workspaceObjectIntelligenceProfiles.v1",
  "nexora.workspaceRelationships.v1",
  "nexora.workspaceScenes.v1",
]);

function ensureBrowserStorage(): void {
  if (typeof globalThis.window !== "undefined") return;
  const store: Record<string, string> = {};
  (globalThis as typeof globalThis & { window: Window }).window = {
    localStorage: {
      getItem: (key: string) => store[key] ?? null,
      setItem: (key: string, value: string) => {
        store[key] = value;
      },
      removeItem: (key: string) => {
        delete store[key];
      },
      clear: () => {
        for (const key of Object.keys(store)) delete store[key];
      },
    },
  } as unknown as Window;
}

function snapshotProtectedStorage(): Record<string, string | null> {
  return Object.fromEntries(
    PROTECTED_STORAGE_KEYS.map((key) => [key, window.localStorage.getItem(key)])
  );
}

test.beforeEach(() => {
  ensureBrowserStorage();
  window.localStorage.clear();
  resetExecutiveIntelligenceRegistryStoreForTests();
});

test("exports DS-8 executive registry tags and storage key", () => {
  assert.equal(NEXORA_EXECUTIVE_REGISTRY_LOG_PREFIX, "[NexoraExecutiveRegistry]");
  assert.equal(EXECUTIVE_REGISTRY_STORAGE_KEY, "nexora.executiveRegistry.v1");
  assert.ok(EXECUTIVE_INTELLIGENCE_REGISTRY_TAGS.includes("[DS8_EXECUTIVE_REGISTRY]"));
  assert.ok(EXECUTIVE_INTELLIGENCE_REGISTRY_TAGS.includes("[DS_8_COMPLETE]"));
  assert.equal(RESERVED_EXECUTIVE_INDEX_SEEDS.length, 14);
});

test("registers a custom executive index", () => {
  const result = registerExecutiveIndex({
    name: "Custom Executive Signal",
    description: "Custom registry-only index definition.",
    category: "custom",
    ownerPhase: "IDX-2",
    status: "experimental",
    version: "0.1.0",
    dependencies: ["objects", "kpis"],
  });

  assert.equal(result.success, true);
  assert.equal(result.created, true);
  assert.equal(result.index?.category, "custom");
  assert.deepEqual(result.index?.dependencies, ["objects", "kpis"]);
  assert.equal(isExecutiveIndexRegistered(result.index?.indexId ?? ""), true);
});

test("rejects duplicate executive index registration", () => {
  const first = registerExecutiveIndex({
    name: "Portfolio Balance Index",
    description: "First registration.",
    category: "financial",
    ownerPhase: "IDX-2",
    dependencies: ["kpis", "okrs"],
  });
  assert.equal(first.success, true);

  const duplicate = registerExecutiveIndex({
    indexId: first.index?.indexId,
    name: "Portfolio Balance Index",
    description: "Duplicate registration.",
    category: "financial",
    ownerPhase: "IDX-2",
    dependencies: ["kpis", "okrs"],
  });

  assert.equal(duplicate.success, false);
  assert.equal(duplicate.reason, "duplicate_index");
  assert.equal(getExecutiveIndexes().filter((entry) => entry.name === "Portfolio Balance Index").length, 1);
});

test("unregisters an executive index", () => {
  const created = registerExecutiveIndex({
    name: "Temporary Executive Index",
    description: "Temporary index for unregister test.",
    category: "operational",
    ownerPhase: "IDX-2",
    dependencies: ["objects"],
  });
  const indexId = created.index?.indexId ?? "";
  assert.equal(isExecutiveIndexRegistered(indexId), true);

  const removed = unregisterExecutiveIndex(indexId);
  assert.equal(removed.success, true);
  assert.equal(removed.removed, true);
  assert.equal(getExecutiveIndex(indexId), null);
  assert.equal(isExecutiveIndexRegistered(indexId), false);
});

test("looks up executive indexes by id and list", () => {
  registerExecutiveIndex({
    name: "Lookup Index Alpha",
    description: "Lookup test alpha.",
    category: "strategic",
    ownerPhase: "IDX-2",
    dependencies: ["okrs"],
  });
  registerExecutiveIndex({
    name: "Lookup Index Beta",
    description: "Lookup test beta.",
    category: "resource",
    ownerPhase: "IDX-2",
    dependencies: ["objects", "relationships"],
  });

  const alphaId = buildExecutiveIndexId("Lookup Index Alpha");
  const alpha = getExecutiveIndex(alphaId);
  assert.ok(alpha);
  assert.equal(alpha?.name, "Lookup Index Alpha");

  const indexes = getExecutiveIndexes();
  assert.ok(indexes.some((entry) => entry.indexId === alphaId));
  assert.ok(indexes.some((entry) => entry.name === "Lookup Index Beta"));
});

test("validates executive index dependencies", () => {
  assert.equal(validateExecutiveIndexDependencies(["scenarios", "risks", "okrs"]), true);
  assert.equal(validateExecutiveIndexDependencies([]), false);
  assert.equal(validateExecutiveIndexDependencies(["dashboard"]), false);

  const invalid = registerExecutiveIndex({
    name: "Invalid Dependency Index",
    description: "Should fail dependency validation.",
    category: "custom",
    ownerPhase: "IDX-2",
    dependencies: ["dashboard" as "objects"],
  });
  assert.equal(invalid.success, false);
  assert.equal(invalid.reason, "invalid_dependencies");
});

test("validates executive index categories", () => {
  assert.equal(validateExecutiveIndexCategory("scenario"), true);
  assert.equal(validateExecutiveIndexCategory("unknown"), false);

  const invalid = registerExecutiveIndex({
    name: "Invalid Category Index",
    description: "Should fail category validation.",
    category: "unknown" as "custom",
    ownerPhase: "IDX-2",
    dependencies: ["objects"],
  });
  assert.equal(invalid.success, false);
  assert.equal(invalid.reason, "invalid_category");
});

test("persists executive registry and reloads from storage", () => {
  const created = registerExecutiveIndex({
    name: "Persistence Index",
    description: "Persistence validation index.",
    category: "financial",
    ownerPhase: "IDX-2",
    dependencies: ["kpis"],
  });
  assert.equal(created.success, true);

  const raw = window.localStorage.getItem(EXECUTIVE_REGISTRY_STORAGE_KEY);
  assert.ok(raw);
  const indexId = created.index?.indexId ?? "";

  resetExecutiveIntelligenceRegistryStoreForTests();
  window.localStorage.setItem(EXECUTIVE_REGISTRY_STORAGE_KEY, raw!);

  const reloaded = getExecutiveIndex(indexId);
  assert.ok(reloaded);
  assert.equal(reloaded?.name, "Persistence Index");
});

test("seeds reserved future executive indexes on hydrate", () => {
  const indexes = getExecutiveIndexes();
  assert.ok(indexes.length >= RESERVED_EXECUTIVE_INDEX_SEEDS.length);

  const scenarioRisk = getExecutiveIndex(buildExecutiveIndexId("Scenario Risk Score"));
  assert.ok(scenarioRisk);
  assert.equal(scenarioRisk?.category, "scenario");
  assert.equal(scenarioRisk?.status, "reserved");
  assert.deepEqual(scenarioRisk?.dependencies, ["scenarios", "risks", "okrs"]);

  const costPressure = getExecutiveIndex(buildExecutiveIndexId("Cost Pressure Index"));
  assert.ok(costPressure);
  assert.equal(costPressure?.category, "financial");
  assert.equal(costPressure?.status, "reserved");

  const futureIndexes = getExecutiveIndex(buildExecutiveIndexId("Future Executive Indexes"));
  assert.ok(futureIndexes);
  assert.equal(futureIndexes?.ownerPhase, "IDX-1+");
});

test("registry operations do not mutate DS-4 through DS-7 protected storage", () => {
  const before = snapshotProtectedStorage();

  registerExecutiveIndex({
    name: "Isolation Safe Index",
    description: "Ensures downstream intelligence storage remains untouched.",
    category: "operational",
    ownerPhase: "IDX-2",
    dependencies: ["scenarios", "risks", "kpis", "okrs", "objects", "relationships"],
  });

  getExecutiveIndexes();
  unregisterExecutiveIndex(buildExecutiveIndexId("Isolation Safe Index"));

  const after = snapshotProtectedStorage();
  for (const key of PROTECTED_STORAGE_KEYS) {
    assert.equal(after[key], before[key], `Protected storage mutated for ${key}`);
  }
});

test("registry storage is workspace-independent", () => {
  registerExecutiveIndex({
    name: "Global Platform Index",
    description: "Global registry index independent of workspace scope.",
    category: "custom",
    ownerPhase: "IDX-2",
    dependencies: ["objects"],
  });

  const raw = window.localStorage.getItem(EXECUTIVE_REGISTRY_STORAGE_KEY);
  assert.ok(raw);
  assert.doesNotMatch(raw ?? "", /workspaceId/);
});
