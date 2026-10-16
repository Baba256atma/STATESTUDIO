import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { beforeEach, afterEach, test } from "node:test";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";

import { appendCollaborationInput, type CollaborationStorage } from "../collaboration/collaborationStore.ts";
import type { CollaborationInput } from "../collaboration/collaborationTypes.ts";
import { EXECUTIVE_OPERATIONS_DEMO_DATASET_ID } from "../data-reality/demo/executiveOperationsDemoDataset.ts";
import { resolveNexoraMVPDataRealityAwareStageExperience } from "../nex-mvp/nexoraMVPDataRealityAwareStageExperience.ts";
import {
  containNexoraMVPFlowDomainForManagerWorkspace,
  createInitialNexoraMVPFlowDomainState,
} from "../nex-mvp/nexoraMVPExecutiveFlow.ts";
import { createInitialNexoraMVPFlowDecisionRecords } from "../nex-mvp/nexoraMVPExecutiveFlowFixtures.ts";
import { bootstrapCanonicalDecisionsFromFlowFixtures } from "../conversational-control/executiveDecisionStatusProjection.ts";
import { createEmptyNexoraMVPObjectInteractionCatalog } from "../nex-mvp/nexoraMVPObjectInteraction.ts";
import { NexoraManagerWorkspaceControl } from "../../executive/nex-mvp/NexoraManagerWorkspaceControl.tsx";
import { isRealManagerWorkspaceId } from "./liveManagerDataWorkspaceGuard.ts";
import {
  assessManagerWorkspaceCreation,
  createManagerWorkspaceFromEntry,
  projectManagerWorkspaceEntries,
  selectManagerWorkspaceEntry,
} from "./managerWorkspaceEntry.ts";
import { readLiveExecutiveDataWorkspaceId } from "./managerWorkspaceIdentity.ts";
import {
  DEMO_WORKSPACE_ID,
  LEGACY_WORKFLOW_WORKSPACE_IDENTIFIERS,
} from "./workspaceRegistryContract.ts";
import {
  MANAGER_WORKSPACE_REGISTRY_STORAGE_KEY,
  getActiveWorkspaceId,
  getWorkspaceRegistrySnapshot,
  recoverWorkspaceRegistryFromStorage,
  resetWorkspaceRegistryForTests,
} from "./workspaceRegistryStore.ts";

const FIXTURE_LABELS = [
  "Margin Pressure",
  "Capacity Gap",
  "Pricing Response",
  "Demand Surge",
  "Capacity Expansion Plan",
  "Approve Repricing",
  "Expand Capacity",
  "Pricing Rollout",
  "Capacity Expansion",
];

class MemoryStorage implements CollaborationStorage {
  readonly values = new Map<string, string>();
  getItem(key: string) {
    return this.values.get(key) ?? null;
  }
  setItem(key: string, value: string) {
    this.values.set(key, value);
  }
  removeItem(key: string) {
    this.values.delete(key);
  }
}

function installStorage() {
  const data = new Map<string, string>();
  const storage = {
    getItem: (key: string) => data.get(key) ?? null,
    setItem: (key: string, value: string) => {
      data.set(key, value);
    },
    removeItem: (key: string) => {
      data.delete(key);
    },
  };
  Object.defineProperty(globalThis, "localStorage", { configurable: true, value: storage });
  Object.defineProperty(globalThis, "window", {
    configurable: true,
    value: { localStorage: storage, dispatchEvent() {} },
  });
  return storage;
}

function removeStorage() {
  delete (globalThis as { localStorage?: unknown }).localStorage;
  delete (globalThis as { window?: unknown }).window;
}

beforeEach(() => {
  resetWorkspaceRegistryForTests();
});

afterEach(() => {
  resetWorkspaceRegistryForTests();
  removeStorage();
});

test("projects real companies and projects apart from Nexora Demo and workflow modes", () => {
  const company = createManagerWorkspaceFromEntry({ name: "BAHA Doors", kind: "BUSINESS" });
  const project = createManagerWorkspaceFromEntry({ name: "Factory Expansion", kind: "PROJECT" });
  assert.ok(company);
  assert.ok(project);
  const view = projectManagerWorkspaceEntries(getWorkspaceRegistrySnapshot());
  assert.deepEqual(
    view.real.map((entry) => entry.identityLabel),
    ["BAHA Doors · Business", "Factory Expansion · Project"],
  );
  assert.equal(view.demo?.identityLabel, "Nexora Demo · Demo");
  assert.equal(view.demo?.role, "demo");
  assert.equal(view.active.identityLabel, "Factory Expansion · Project");
  const listed = [...view.real, view.demo].map((entry) => entry?.workspaceId);
  for (const mode of LEGACY_WORKFLOW_WORKSPACE_IDENTIFIERS) {
    assert.equal(listed.includes(mode), false);
  }
  assert.equal(view.real.some((entry) => entry.role === "demo"), false);
});

test("creates a Company through the manager workspace authority and selects it", () => {
  const created = createManagerWorkspaceFromEntry({ name: "  BAHA Doors  ", kind: "BUSINESS" });
  assert.ok(created);
  assert.equal(created.kind, "BUSINESS");
  assert.equal(created.name, "BAHA Doors");
  assert.equal(getActiveWorkspaceId(), created.workspaceId);
  assert.equal(isLegacyId(created.workspaceId), false);
  assert.equal(readLiveExecutiveDataWorkspaceId(), created.workspaceId);
});

test("creates a Project through the manager workspace authority and selects it", () => {
  const created = createManagerWorkspaceFromEntry({ name: "Factory Expansion", kind: "PROJECT" });
  assert.ok(created);
  assert.equal(created.kind, "PROJECT");
  assert.equal(getActiveWorkspaceId(), created.workspaceId);
  assert.equal(projectManagerWorkspaceEntries(getWorkspaceRegistrySnapshot()).active.typeLabel, "Project");
});

test("refuses an empty name or an unknown type without changing the registry", () => {
  assert.equal(assessManagerWorkspaceCreation({ name: "   ", kind: "BUSINESS" }).ok, false);
  assert.equal(assessManagerWorkspaceCreation({ name: "BAHA Doors", kind: "DEPARTMENT" }).ok, false);
  assert.equal(createManagerWorkspaceFromEntry({ name: "", kind: "BUSINESS" }), null);
  assert.equal(createManagerWorkspaceFromEntry({ name: "BAHA Doors", kind: "overview" }), null);
  assert.equal(getActiveWorkspaceId(), DEMO_WORKSPACE_ID);
  assert.equal(getWorkspaceRegistrySnapshot().workspaceOrder.length, 1);
});

test("switches through the canonical selection path and preserves the registry as authority", () => {
  const company = createManagerWorkspaceFromEntry({ name: "BAHA Doors", kind: "BUSINESS" });
  const project = createManagerWorkspaceFromEntry({ name: "Factory Expansion", kind: "PROJECT" });
  assert.ok(company && project);
  assert.equal(selectManagerWorkspaceEntry(company.workspaceId), true);
  assert.equal(getActiveWorkspaceId(), company.workspaceId);
  assert.equal(selectManagerWorkspaceEntry(project.workspaceId), true);
  assert.equal(getActiveWorkspaceId(), project.workspaceId);
  assert.equal(selectManagerWorkspaceEntry("decision"), false);
  assert.equal(getActiveWorkspaceId(), project.workspaceId);
  assert.equal(selectManagerWorkspaceEntry("missing_workspace"), false);
  assert.equal(getActiveWorkspaceId(), project.workspaceId);
  assert.equal(readLiveExecutiveDataWorkspaceId(), project.workspaceId);
});

test("shows the active Company or Project label from the registry", () => {
  createManagerWorkspaceFromEntry({ name: "BAHA Doors", kind: "BUSINESS" });
  const html = renderToStaticMarkup(React.createElement(NexoraManagerWorkspaceControl));
  assert.match(html, /BAHA Doors · Business/);
  assert.match(html, /data-manager-workspace-role="business"/);
  assert.doesNotMatch(html, /Overview|Problem|Scenario|Decision|Execution/);
});

test("distinguishes Nexora Demo from a Company or Project", () => {
  const view = projectManagerWorkspaceEntries(getWorkspaceRegistrySnapshot());
  assert.equal(view.hasRealWorkspace, false);
  assert.equal(view.active.identityLabel, "Nexora Demo · Demo");
  assert.equal(view.active.role, "demo");
  assert.notEqual(view.active.typeLabel, "Business");
  assert.notEqual(view.active.typeLabel, "Project");
  const html = renderToStaticMarkup(React.createElement(NexoraManagerWorkspaceControl));
  assert.match(html, /Try Nexora/);
});

test("switching from demo to a real workspace contains product fixtures", () => {
  const demo = resolveNexoraMVPDataRealityAwareStageExperience();
  assert.equal(demo.runtimeState.datasetIdentity.datasetId, EXECUTIVE_OPERATIONS_DEMO_DATASET_ID);
  assert.match(JSON.stringify(demo.catalog), /Capacity Gap/);
  const company = createManagerWorkspaceFromEntry({ name: "BAHA Doors", kind: "BUSINESS" });
  assert.ok(company);
  assert.equal(selectManagerWorkspaceEntry(DEMO_WORKSPACE_ID), true);
  assert.equal(isRealManagerWorkspaceId(readLiveExecutiveDataWorkspaceId()), false);
  assert.equal(selectManagerWorkspaceEntry(company.workspaceId), true);
  assert.equal(readLiveExecutiveDataWorkspaceId(), company.workspaceId);
  assert.equal(isRealManagerWorkspaceId(company.workspaceId), true);
  const clean = resolveNexoraMVPDataRealityAwareStageExperience({
    baseCatalog: createEmptyNexoraMVPObjectInteractionCatalog(),
    suppressUnownedDemoDataset: true,
  });
  const contained = containNexoraMVPFlowDomainForManagerWorkspace(createInitialNexoraMVPFlowDomainState(), {
    workspaceId: company.workspaceId,
    decisions: bootstrapCanonicalDecisionsFromFlowFixtures(createInitialNexoraMVPFlowDecisionRecords()),
    executions: [],
  });
  const text = JSON.stringify({ catalog: clean.catalog, flow: contained });
  for (const label of FIXTURE_LABELS) assert.equal(text.includes(label), false);
  assert.equal(selectManagerWorkspaceEntry(DEMO_WORKSPACE_ID), true);
  assert.equal(isRealManagerWorkspaceId(readLiveExecutiveDataWorkspaceId()), false);
});

test("a selected workspace cannot receive another workspace's collaboration", () => {
  const company = createManagerWorkspaceFromEntry({ name: "BAHA Doors", kind: "BUSINESS" });
  const project = createManagerWorkspaceFromEntry({ name: "Factory Expansion", kind: "PROJECT" });
  assert.ok(company && project);
  assert.equal(selectManagerWorkspaceEntry(company.workspaceId), true);
  const storage = new MemoryStorage();
  const input: CollaborationInput = {
    id: "note-1",
    timestamp: 1,
    user_id: "ada",
    user_label: "Ada",
    role: "manager",
    kind: "concern",
    summary: "Factory note",
  };
  const rejected = appendCollaborationInput({
    workspaceId: project.workspaceId,
    sourceWorkspaceId: company.workspaceId,
    input,
    storage,
  });
  assert.equal(rejected.inputs.length, 0);
  assert.equal(selectManagerWorkspaceEntry(project.workspaceId), true);
  const accepted = appendCollaborationInput({
    workspaceId: project.workspaceId,
    sourceWorkspaceId: project.workspaceId,
    input,
    storage,
  });
  assert.equal(accepted.inputs.length, 1);
});

test("created workspaces survive the existing registry recovery", () => {
  installStorage();
  const created = createManagerWorkspaceFromEntry({ name: "BAHA Doors", kind: "BUSINESS" });
  assert.ok(created);
  const saved = (globalThis as { localStorage: Storage }).localStorage.getItem(
    MANAGER_WORKSPACE_REGISTRY_STORAGE_KEY,
  );
  assert.ok(saved);
  resetWorkspaceRegistryForTests();
  assert.equal(getActiveWorkspaceId(), DEMO_WORKSPACE_ID);
  (globalThis as { localStorage: Storage }).localStorage.setItem(
    MANAGER_WORKSPACE_REGISTRY_STORAGE_KEY,
    saved,
  );
  recoverWorkspaceRegistryFromStorage();
  const view = projectManagerWorkspaceEntries(getWorkspaceRegistrySnapshot());
  assert.equal(view.active.identityLabel, "BAHA Doors · Business");
  assert.equal(getActiveWorkspaceId(), created.workspaceId);
});

test("the executive control is a client of the registry", () => {
  const source = readFileSync(
    new URL("../../executive/nex-mvp/NexoraManagerWorkspaceControl.tsx", import.meta.url),
    "utf8",
  );
  assert.match(source, /createManagerWorkspaceFromEntry/);
  assert.match(source, /selectManagerWorkspaceEntry/);
  assert.match(source, /projectManagerWorkspaceEntries/);
  assert.match(source, /getWorkspaceRegistrySnapshot/);
  assert.doesNotMatch(source, /useState\([^\n]*activeWorkspace/);
  assert.doesNotMatch(source, /setActiveWorkspace|createWorkspace\(/);
  for (const mode of ["Overview", "Problem", "Scenario", "Decision", "Execution"]) {
    assert.equal(source.includes(`"${mode}"`), false);
  }
});

function isLegacyId(workspaceId: string): boolean {
  return (LEGACY_WORKFLOW_WORKSPACE_IDENTIFIERS as readonly string[]).includes(workspaceId);
}
