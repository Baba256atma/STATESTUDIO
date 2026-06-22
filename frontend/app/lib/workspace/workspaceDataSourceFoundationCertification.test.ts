import assert from "node:assert/strict";
import test from "node:test";

import {
  NWB95_CERTIFICATION_TAG,
  WORKSPACE_DATA_SOURCE_FOUNDATION_CERTIFICATION_TAGS,
  WORKSPACE_DATA_SOURCE_FOUNDATION_COMPLETE_DIAGNOSTIC,
} from "./workspaceDataSourceFoundationCertificationContract.ts";
import { runWorkspaceDataSourceFoundationCertification } from "./workspaceDataSourceFoundationCertification.ts";

test("exports NW-B:9-5 workspace data source foundation certification tags and diagnostic", () => {
  assert.equal(NWB95_CERTIFICATION_TAG, "[NWB95]");
  assert.equal(
    WORKSPACE_DATA_SOURCE_FOUNDATION_COMPLETE_DIAGNOSTIC,
    "[WorkspaceDataSourceFoundation] Certification Complete"
  );
  assert.deepEqual(WORKSPACE_DATA_SOURCE_FOUNDATION_CERTIFICATION_TAGS, [
    "[NWB95]",
    "[DATA_SOURCE_FOUNDATION_CERTIFIED]",
    "[WORKSPACE_DATA_PLATFORM_READY]",
    "[DS1_READY]",
    "[NW_B9_COMPLETE]",
  ]);
});

test("NW-B:9-5 workspace data source foundation certification passes gates A through K", async () => {
  const result = await runWorkspaceDataSourceFoundationCertification({
    buildPassed: true,
    testsPassed: true,
  });

  assert.equal(result.tag, "[NWB95]");
  assert.equal(result.version, "NW-B:9-5");
  assert.equal(result.certified, true);
  assert.equal(result.result, "PASS");
  assert.equal(result.gates.length, 11);
  assert.equal(result.gates.every((entry) => entry.status === "PASS"), true);
  assert.equal(result.scenarios.length, 7);
  assert.equal(result.scenarios.every((entry) => entry.status === "PASS"), true);
  assert.equal(result.diagnostics.includes(WORKSPACE_DATA_SOURCE_FOUNDATION_COMPLETE_DIAGNOSTIC), true);
  assert.equal(Object.isFrozen(result), true);
  assert.equal(Object.isFrozen(result.gates), true);
  assert.equal(Object.isFrozen(result.scenarios), true);
});

test("NW-B:9-5 workspace data source foundation certification exposes required validation gates", async () => {
  const result = await runWorkspaceDataSourceFoundationCertification();
  const gateNames = result.gates.map((entry) => entry.name);

  assert.equal(gateNames.includes("Registry Created"), true);
  assert.equal(gateNames.includes("CSV Upload Works"), true);
  assert.equal(gateNames.includes("Metadata Captured"), true);
  assert.equal(gateNames.includes("Data Source Panel Works"), true);
  assert.equal(gateNames.includes("Remove Works"), true);
  assert.equal(gateNames.includes("Workspace Isolation Works"), true);
  assert.equal(gateNames.includes("Ownership Works"), true);
  assert.equal(gateNames.includes("Workspace Switching Works"), true);
  assert.equal(gateNames.includes("No Runtime Errors"), true);
  assert.equal(gateNames.includes("No Hydration Errors"), true);
  assert.equal(gateNames.includes("Build Passes"), true);
});

test("NW-B:9-5 workspace data source foundation certification exposes required scenarios", async () => {
  const result = await runWorkspaceDataSourceFoundationCertification();
  const scenarioIds = result.scenarios.map((entry) => entry.id);

  assert.deepEqual(scenarioIds, [
    "one_workspace_zero_csv",
    "one_workspace_one_csv",
    "one_workspace_multiple_csv",
    "multiple_workspaces",
    "workspace_switching",
    "csv_remove",
    "invalid_csv_upload",
  ]);
});

test("NW-B:9-5 workspace data source foundation certification fails when build verification fails", async () => {
  const result = await runWorkspaceDataSourceFoundationCertification({
    buildPassed: false,
    testsPassed: true,
  });

  assert.equal(result.certified, false);
  assert.equal(result.result, "FAIL");
  assert.equal(result.gates.find((entry) => entry.id === "K")?.status, "FAIL");
});
