import assert from "node:assert/strict";
import test from "node:test";

import {
  DS17_CERTIFICATION_TAG,
  WORKSPACE_DATA_SOURCE_CERTIFICATION_TAGS,
  WORKSPACE_DATA_SOURCE_CERTIFICATION_COMPLETE_DIAGNOSTIC,
} from "./workspaceDataSourceCertificationContract.ts";
import { runWorkspaceDataSourceCertification } from "./workspaceDataSourceCertification.ts";

test("exports DS-1:7 certification tags and diagnostic", () => {
  assert.equal(DS17_CERTIFICATION_TAG, "[DS17_CERTIFIED]");
  assert.equal(
    WORKSPACE_DATA_SOURCE_CERTIFICATION_COMPLETE_DIAGNOSTIC,
    "[NexoraDataSourceCertification] Certification Complete"
  );
  assert.deepEqual(WORKSPACE_DATA_SOURCE_CERTIFICATION_TAGS, [
    "[DS17_CERTIFIED]",
    "[DATA_SOURCE_PIPELINE_CERTIFIED]",
    "[WORKSPACE_DATA_INTELLIGENCE_READY]",
    "[DS2_READY]",
    "[DS_1_COMPLETE]",
  ]);
});

test("DS-1:7 certification passes gates A through X", async () => {
  const result = await runWorkspaceDataSourceCertification({
    buildPassed: true,
    testsPassed: true,
  });

  assert.equal(result.tag, "[DS17_CERTIFIED]");
  assert.equal(result.version, "DS-1:7");
  assert.equal(result.certified, true);
  assert.equal(result.result, "PASS");
  assert.equal(result.gates.length, 24);
  assert.equal(result.gates.every((entry) => entry.status === "PASS"), true);
  assert.equal(result.scenarios.length, 10);
  assert.equal(result.scenarios.every((entry) => entry.status === "PASS"), true);
  assert.equal(result.diagnostics.includes(WORKSPACE_DATA_SOURCE_CERTIFICATION_COMPLETE_DIAGNOSTIC), true);
  assert.equal(Object.isFrozen(result), true);
});

test("DS-1:7 certification exposes required validation gates", async () => {
  const result = await runWorkspaceDataSourceCertification();
  const gateNames = result.gates.map((entry) => entry.name);

  assert.equal(gateNames.includes("Schema Discovery Works"), true);
  assert.equal(gateNames.includes("Column Classification Works"), true);
  assert.equal(gateNames.includes("Candidate Object Discovery Works"), true);
  assert.equal(gateNames.includes("Object Approval Panel Works"), true);
  assert.equal(gateNames.includes("Object Creation Pipeline Works"), true);
  assert.equal(gateNames.includes("Workspace Scene Sync Works"), true);
  assert.equal(gateNames.includes("Workspace Isolation Preserved"), true);
  assert.equal(gateNames.includes("Traceability Preserved"), true);
  assert.equal(gateNames.includes("Duplicate Creation Protection"), true);
  assert.equal(gateNames.includes("Duplicate Scene Sync Protection"), true);
  assert.equal(gateNames.includes("No Relationship Creation"), true);
  assert.equal(gateNames.includes("No Topology Creation"), true);
  assert.equal(gateNames.includes("Build Passes"), true);
  assert.equal(gateNames.includes("Workspace Switching Works"), true);
});

test("DS-1:7 certification exposes required scenarios", async () => {
  const result = await runWorkspaceDataSourceCertification();
  const scenarioIds = result.scenarios.map((entry) => entry.id);

  assert.deepEqual(scenarioIds, [
    "single_csv_customer",
    "customer_supplier",
    "multiple_approved_objects",
    "workspace_switch",
    "duplicate_sync_attempt",
    "duplicate_creation_attempt",
    "reload_persistence",
    "scene_selection_after_sync",
    "object_panel_after_sync",
    "empty_workspace",
  ]);
});

test("DS-1:7 certification fails when build verification fails", async () => {
  const result = await runWorkspaceDataSourceCertification({
    buildPassed: false,
    testsPassed: true,
  });

  assert.equal(result.certified, false);
  assert.equal(result.result, "FAIL");
  assert.equal(result.gates.find((entry) => entry.id === "W")?.status, "FAIL");
});

test("DS-1:7 certification certifies end-to-end pipeline flow", async () => {
  const result = await runWorkspaceDataSourceCertification();
  const singleCsv = result.scenarios.find((entry) => entry.id === "single_csv_customer");
  assert.ok(singleCsv);
  assert.equal(singleCsv.status, "PASS");
  assert.match(result.evidence.join(" "), /Single CSV objects\/scene: 1\/1/);
});
