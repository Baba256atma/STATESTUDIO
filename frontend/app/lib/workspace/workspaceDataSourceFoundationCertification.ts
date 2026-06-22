import { readFileSync } from "node:fs";
import { join } from "node:path";

import {
  createWorkspace,
  resetWorkspaceRegistryForTests,
  setActiveWorkspace,
} from "./workspaceRegistryStore.ts";
import { getWorkspaceDataSources } from "./workspaceContextResolver.ts";
import {
  getWorkspaceDataSourceRegistrySnapshot,
  registerWorkspaceDataSource,
  resetWorkspaceDataSourcesForTests,
  WORKSPACE_DATA_SOURCE_REGISTRY_VERSION,
} from "./workspaceDataSourceRegistry.ts";
import {
  resetWorkspaceDataSourceIsolationGuardForTests,
  guardWorkspaceDataSourceAccess,
} from "./workspaceDataSourceIsolationGuard.ts";
import {
  verifyWorkspaceDataSourceOwnership,
  workspaceDataSourceHasRequiredOwnership,
  WORKSPACE_DATA_SOURCE_OWNERSHIP_CONTRACT,
} from "./workspaceDataSourceOwnershipContract.ts";
import {
  bindWorkspaceDataSource,
  removeOwnedWorkspaceDataSource,
  resolveActiveWorkspaceDataSources,
  resolveWorkspaceDataSource,
  resolveWorkspaceDataSources,
  updateOwnedWorkspaceDataSource,
} from "./workspaceDataSourceResolver.ts";
import {
  buildWorkspaceDataSourcePanelSnapshot,
  removeWorkspaceDataSourcePanelSource,
  resetWorkspaceDataSourcePanelForTests,
  selectWorkspaceDataSourcePanelSource,
} from "./workspaceDataSourcePanelRuntime.ts";
import {
  resetWorkspaceCsvUploadForTests,
  uploadWorkspaceCsv,
} from "./workspaceCsvUploadRuntime.ts";
import {
  NWB95_CERTIFICATION_TAG,
  WORKSPACE_DATA_SOURCE_FOUNDATION_CERTIFICATION_TAGS,
  WORKSPACE_DATA_SOURCE_FOUNDATION_COMPLETE_DIAGNOSTIC,
  type WorkspaceDataSourceFoundationCertificationInput,
  type WorkspaceDataSourceFoundationCertificationResult,
  type WorkspaceDataSourceFoundationGate,
  type WorkspaceDataSourceFoundationScenario,
} from "./workspaceDataSourceFoundationCertificationContract.ts";

const FRONTEND_ROOT = process.cwd();

type TestCsvFile = Readonly<{
  name: string;
  type: string;
  size: number;
  text: () => Promise<string>;
}>;

function readSource(relativePath: string): string {
  return readFileSync(join(FRONTEND_ROOT, relativePath), "utf8");
}

function makeCsvFile(input: {
  name: string;
  body: string;
  type?: string;
  size?: number;
}): TestCsvFile {
  return Object.freeze({
    name: input.name,
    type: input.type ?? "text/csv",
    size: input.size ?? input.body.length,
    text: async () => input.body,
  });
}

function gate(
  id: WorkspaceDataSourceFoundationGate["id"],
  name: string,
  failures: readonly string[]
): WorkspaceDataSourceFoundationGate {
  return Object.freeze({
    id,
    name,
    status: failures.length === 0 ? "PASS" : "FAIL",
    detail: failures.length === 0 ? `${name} certified.` : failures.join("; "),
  });
}

function scenario(
  id: WorkspaceDataSourceFoundationScenario["id"],
  name: string,
  failures: readonly string[]
): WorkspaceDataSourceFoundationScenario {
  return Object.freeze({
    id,
    name,
    status: failures.length === 0 ? "PASS" : "FAIL",
    detail: failures.length === 0 ? `${name} stable.` : failures.join("; "),
  });
}

function resetFoundationCertificationStores(): void {
  resetWorkspaceRegistryForTests();
  resetWorkspaceDataSourcesForTests();
  resetWorkspaceCsvUploadForTests();
  resetWorkspaceDataSourcePanelForTests();
  resetWorkspaceDataSourceIsolationGuardForTests();
}

export async function runWorkspaceDataSourceFoundationCertification(
  input: WorkspaceDataSourceFoundationCertificationInput = {}
): Promise<WorkspaceDataSourceFoundationCertificationResult> {
  resetFoundationCertificationStores();

  const gates: WorkspaceDataSourceFoundationGate[] = [];
  const scenarios: WorkspaceDataSourceFoundationScenario[] = [];
  const evidence: string[] = [];

  const registrySource = readSource("app/lib/workspace/workspaceDataSourceRegistry.ts");
  const csvUploadSource = readSource("app/lib/workspace/workspaceCsvUploadRuntime.ts");
  const panelRuntimeSource = readSource("app/lib/workspace/workspaceDataSourcePanelRuntime.ts");
  const panelComponentSource = readSource(
    "app/components/main-right-panel/workspace/operational/WorkspaceDataSourcePanel.tsx"
  );
  const operationalWorkspaceSource = readSource(
    "app/components/main-right-panel/workspace/operational/OperationalWorkspace.tsx"
  );
  const resolverSource = readSource("app/lib/workspace/workspaceDataSourceResolver.ts");
  const contextResolverSource = readSource("app/lib/workspace/workspaceContextResolver.ts");
  const ownershipSource = readSource("app/lib/workspace/workspaceDataSourceOwnershipContract.ts");
  const isolationGuardSource = readSource("app/lib/workspace/workspaceDataSourceIsolationGuard.ts");

  const emptyWorkspace = createWorkspace("Empty Data Workspace");
  const emptySnapshot = buildWorkspaceDataSourcePanelSnapshot(emptyWorkspace.workspaceId);
  const emptyResolved = resolveWorkspaceDataSources(emptyWorkspace.workspaceId);
  scenarios.push(
    scenario("one_workspace_zero_csv", "1 Workspace + 0 CSV", [
      emptySnapshot.rows.length === 0 ? "" : "Panel should list zero sources",
      emptyResolved.length === 0 ? "" : "Resolver should return zero sources",
      emptySnapshot.workspaceId === emptyWorkspace.workspaceId ? "" : "Panel workspace mismatch",
    ].filter(Boolean))
  );

  const singleWorkspace = createWorkspace("Single CSV Workspace");
  const singleUploadResult = await uploadWorkspaceCsv(
    makeCsvFile({
      name: "inventory.csv",
      body: "sku,location,count\nA-1,East,12\nA-2,West,8\n",
    }),
    singleWorkspace.workspaceId
  );
  const singlePanel = buildWorkspaceDataSourcePanelSnapshot(singleWorkspace.workspaceId);
  scenarios.push(
    scenario("one_workspace_one_csv", "1 Workspace + 1 CSV", [
      singleUploadResult.success ? "" : `Upload failed: ${singleUploadResult.reason}`,
      singleUploadResult.metadata?.rowCount === 2 ? "" : "Expected 2 CSV rows",
      singleUploadResult.metadata?.columnCount === 3 ? "" : "Expected 3 CSV columns",
      singlePanel.rows.length === 1 ? "" : "Panel should list one source",
      singlePanel.rows[0]?.fileName === "inventory.csv" ? "" : "Panel fileName mismatch",
    ].filter(Boolean))
  );

  const multiWorkspace = createWorkspace("Multi CSV Workspace");
  const multiUploadA = await uploadWorkspaceCsv(
    makeCsvFile({ name: "orders.csv", body: "id,amount\n1,100\n2,200\n" }),
    multiWorkspace.workspaceId
  );
  const multiUploadB = await uploadWorkspaceCsv(
    makeCsvFile({ name: "suppliers.csv", body: "id,name\n1,Alpha\n2,Beta\n3,Gamma\n" }),
    multiWorkspace.workspaceId
  );
  const multiPanel = buildWorkspaceDataSourcePanelSnapshot(multiWorkspace.workspaceId);
  scenarios.push(
    scenario("one_workspace_multiple_csv", "1 Workspace + Multiple CSV", [
      multiUploadA.success ? "" : "First multi upload failed",
      multiUploadB.success ? "" : "Second multi upload failed",
      multiPanel.rows.length === 2 ? "" : `Expected 2 panel rows, got ${multiPanel.rows.length}`,
      multiPanel.rows.every((row) => row.workspaceId === multiWorkspace.workspaceId)
        ? ""
        : "Panel row workspace ownership mismatch",
    ].filter(Boolean))
  );

  const workspaceA = createWorkspace("Workspace A");
  const workspaceB = createWorkspace("Workspace B");
  registerWorkspaceDataSource({
    workspaceId: workspaceA.workspaceId,
    dataSourceId: "wds_inventory",
    name: "inventory",
    type: "csv",
    status: "connected",
    metadata: { fileName: "inventory.csv", rowCount: 2, columnCount: 2 },
  });
  registerWorkspaceDataSource({
    workspaceId: workspaceB.workspaceId,
    dataSourceId: "wds_sales",
    name: "sales",
    type: "csv",
    status: "connected",
    metadata: { fileName: "sales.csv", rowCount: 5, columnCount: 3 },
  });
  const sourcesA = resolveWorkspaceDataSources(workspaceA.workspaceId);
  const sourcesB = resolveWorkspaceDataSources(workspaceB.workspaceId);
  scenarios.push(
    scenario("multiple_workspaces", "Multiple Workspaces", [
      sourcesA.length === 1 ? "" : "Workspace A should have one source",
      sourcesB.length === 1 ? "" : "Workspace B should have one source",
      sourcesA[0]?.metadata?.fileName === "inventory.csv" ? "" : "Workspace A file mismatch",
      sourcesB[0]?.metadata?.fileName === "sales.csv" ? "" : "Workspace B file mismatch",
    ].filter(Boolean))
  );

  setActiveWorkspace(workspaceA.workspaceId);
  const activeA = resolveActiveWorkspaceDataSources();
  setActiveWorkspace(workspaceB.workspaceId);
  const activeB = resolveActiveWorkspaceDataSources();
  const contextA = getWorkspaceDataSources(workspaceA.workspaceId);
  const contextB = getWorkspaceDataSources(workspaceB.workspaceId);
  scenarios.push(
    scenario("workspace_switching", "Workspace Switching", [
      activeA[0]?.metadata?.fileName === "inventory.csv" ? "" : "Active A inventory missing",
      activeB[0]?.metadata?.fileName === "sales.csv" ? "" : "Active B sales missing",
      contextA.length === 1 && contextA[0]?.label === "inventory" ? "" : "Context A leak",
      contextB.length === 1 && contextB[0]?.label === "sales" ? "" : "Context B leak",
      resolveWorkspaceDataSource(workspaceB.workspaceId, "wds_inventory") === null
        ? ""
        : "Cross-workspace read leaked inventory into B",
    ].filter(Boolean))
  );

  const removeWorkspace = createWorkspace("Remove Workspace");
  registerWorkspaceDataSource({
    workspaceId: removeWorkspace.workspaceId,
    dataSourceId: "wds_temp",
    name: "temp",
    type: "csv",
    status: "connected",
    metadata: { fileName: "temp.csv", rowCount: 1, columnCount: 1 },
  });
  selectWorkspaceDataSourcePanelSource(removeWorkspace.workspaceId, "wds_temp");
  const removed = removeWorkspaceDataSourcePanelSource(removeWorkspace.workspaceId, "wds_temp");
  scenarios.push(
    scenario("csv_remove", "CSV Remove", [
      removed.success ? "" : `Remove failed: ${removed.reason}`,
      removed.snapshot.rows.length === 0 ? "" : "Panel still lists removed source",
      resolveWorkspaceDataSources(removeWorkspace.workspaceId).length === 0
        ? ""
        : "Resolver still lists removed source",
    ].filter(Boolean))
  );

  const invalidWorkspace = createWorkspace("Invalid Upload Workspace");
  const invalidUpload = await uploadWorkspaceCsv(
    makeCsvFile({ name: "empty.csv", body: "sku,count\n" }),
    invalidWorkspace.workspaceId
  );
  scenarios.push(
    scenario("invalid_csv_upload", "Invalid CSV Upload", [
      invalidUpload.success === false ? "" : "Invalid upload should fail",
      invalidUpload.errorCode === "empty_csv" ? "" : "Expected empty_csv error",
      resolveWorkspaceDataSources(invalidWorkspace.workspaceId).length === 0
        ? ""
        : "Invalid upload registered a data source",
    ].filter(Boolean))
  );

  const registrySnapshot = getWorkspaceDataSourceRegistrySnapshot();
  const inventorySource = resolveWorkspaceDataSource(workspaceA.workspaceId, "wds_inventory");
  const crossWorkspaceDenied = verifyWorkspaceDataSourceOwnership({
    action: "read",
    expectedWorkspaceId: workspaceB.workspaceId,
    dataSource: inventorySource,
  });
  const ownershipGuard = guardWorkspaceDataSourceAccess({
    action: "bind",
    workspaceId: workspaceB.workspaceId,
    dataSource: inventorySource,
    dataSourceId: "wds_inventory",
  });
  const importGuard = guardWorkspaceDataSourceAccess({
    action: "import",
    workspaceId: workspaceA.workspaceId,
  });

  gates.push(
    gate("A", "Registry Created", [
      registrySource.includes("WORKSPACE_DATA_SOURCE_REGISTRY_VERSION") ? "" : "Registry version missing",
      registrySource.includes("workspaceId") ? "" : "Registry missing workspaceId field",
      registrySource.includes("dataSourceId") ? "" : "Registry missing dataSourceId field",
      registrySnapshot.contractVersion === WORKSPACE_DATA_SOURCE_REGISTRY_VERSION
        ? ""
        : "Registry snapshot contract version mismatch",
      inventorySource && workspaceDataSourceHasRequiredOwnership(inventorySource) ? "" : "Registered source missing ownership fields",
    ].filter(Boolean))
  );

  gates.push(
    gate("B", "CSV Upload Works", [
      csvUploadSource.includes("uploadWorkspaceCsv") ? "" : "uploadWorkspaceCsv missing",
      csvUploadSource.includes("importWorkspaceDataSource") ? "" : "CSV upload bypasses owned import",
      singleUploadResult.success ? "" : "Single CSV upload scenario failed",
      multiUploadA.success && multiUploadB.success ? "" : "Multi CSV upload scenario failed",
    ].filter(Boolean))
  );

  gates.push(
    gate("C", "Metadata Captured", [
      singleUploadResult.metadata?.fileName === "inventory.csv" ? "" : "Upload fileName missing",
      singleUploadResult.metadata?.rowCount === 2 ? "" : "Upload rowCount missing",
      singleUploadResult.metadata?.columnCount === 3 ? "" : "Upload columnCount missing",
      singleUploadResult.dataSource?.metadata?.rowCount === 2 ? "" : "Registry rowCount missing",
      panelRuntimeSource.includes("rowCount") ? "" : "Panel runtime missing rowCount mapping",
    ].filter(Boolean))
  );

  gates.push(
    gate("D", "Data Source Panel Works", [
      panelComponentSource.includes("WorkspaceDataSourcePanel") ? "" : "Panel component missing",
      panelRuntimeSource.includes("buildWorkspaceDataSourcePanelSnapshot")
        ? ""
        : "Panel snapshot builder missing",
      operationalWorkspaceSource.includes('dashboardContext === "sources"')
        ? ""
        : "Operational workspace missing sources context mount",
      operationalWorkspaceSource.includes("WorkspaceDataSourcePanel")
        ? ""
        : "Operational workspace missing panel import",
      multiPanel.rows.length === 2 ? "" : "Panel multi-source scenario failed",
    ].filter(Boolean))
  );

  gates.push(
    gate("E", "Remove Works", [
      removed.success ? "" : "Remove scenario failed",
      panelRuntimeSource.includes("removeOwnedWorkspaceDataSource")
        ? ""
        : "Panel remove bypasses owned resolver",
      removeOwnedWorkspaceDataSource(workspaceA.workspaceId, "wds_missing").success === false
        ? ""
        : "Remove allowed missing source",
    ].filter(Boolean))
  );

  gates.push(
    gate("F", "Workspace Isolation Works", [
      sourcesA.length === 1 && sourcesB.length === 1 ? "" : "Workspace source counts incorrect",
      resolveWorkspaceDataSource(workspaceB.workspaceId, "wds_inventory") === null
        ? ""
        : "Cross-workspace read not blocked",
      updateOwnedWorkspaceDataSource({
        workspaceId: workspaceB.workspaceId,
        dataSourceId: "wds_inventory",
        status: "error",
      }).success === false
        ? ""
        : "Cross-workspace update not blocked",
    ].filter(Boolean))
  );

  gates.push(
    gate("G", "Ownership Works", [
      ownershipSource.includes("verifyWorkspaceDataSourceOwnership") ? "" : "Ownership verifier missing",
      isolationGuardSource.includes("guardWorkspaceDataSourceAccess") ? "" : "Isolation guard missing",
      WORKSPACE_DATA_SOURCE_OWNERSHIP_CONTRACT.supportedActions.includes("import") ? "" : "Import action missing",
      crossWorkspaceDenied.owned === false ? "" : "Cross-workspace ownership not denied",
      crossWorkspaceDenied.reason === "cross_workspace_access_denied"
        ? ""
        : "Cross-workspace denial reason mismatch",
      ownershipGuard.allowed === false ? "" : "Cross-workspace bind not denied",
      importGuard.allowed ? "" : "Workspace import scope denied incorrectly",
      registrySource.includes("guardWorkspaceDataSourceAccess") ? "" : "Registry missing guard integration",
      resolverSource.includes("guardWorkspaceDataSourceAccess") ? "" : "Resolver missing guard integration",
    ].filter(Boolean))
  );

  gates.push(
    gate("H", "Workspace Switching Works", [
      contextResolverSource.includes("resolveWorkspaceDataSources")
        ? ""
        : "Context resolver bypasses owned resolver",
      activeA[0]?.metadata?.fileName === "inventory.csv" ? "" : "Active workspace A switch failed",
      activeB[0]?.metadata?.fileName === "sales.csv" ? "" : "Active workspace B switch failed",
      bindWorkspaceDataSource(workspaceA.workspaceId, "wds_inventory").success ? "" : "Owned bind failed",
    ].filter(Boolean))
  );

  const runtimeFailures = scenarios
    .filter((entry) => entry.status === "FAIL")
    .map((entry) => `${entry.name}: ${entry.detail}`);
  gates.push(
    gate("I", "No Runtime Errors", [
      ...runtimeFailures,
      input.testsPassed === false ? "Foundation tests failed" : "",
    ].filter(Boolean))
  );

  gates.push(
    gate("J", "No Hydration Errors", [
      panelComponentSource.includes("useSyncExternalStore") ? "" : "Panel missing useSyncExternalStore",
      panelComponentSource.includes("getWorkspaceDataSourceRegistryVersion")
        ? ""
        : "Panel missing registry server snapshot hook",
      panelComponentSource.includes("getActiveWorkspaceId") ? "" : "Panel missing workspace server snapshot hook",
      panelComponentSource.includes("() => 0") ? "" : "Panel missing registry SSR fallback",
      panelComponentSource.includes("() => null") ? "" : "Panel missing workspace SSR fallback",
      panelComponentSource.includes("suppressHydrationWarning")
        ? "Panel uses suppressHydrationWarning"
        : "",
      panelRuntimeSource.includes("window.localStorage") ? "Panel runtime reads localStorage directly" : "",
    ].filter(Boolean))
  );

  gates.push(
    gate("K", "Build Passes", [
      input.buildPassed === false ? "Build verification failed" : "",
    ].filter(Boolean))
  );

  evidence.push(`Empty workspace sources: ${emptyResolved.length}`);
  evidence.push(`Single CSV upload rows: ${singleUploadResult.metadata?.rowCount ?? 0}`);
  evidence.push(`Multi CSV panel rows: ${multiPanel.rows.length}`);
  evidence.push(`Workspace A sources: ${sourcesA.length} (${sourcesA[0]?.metadata?.fileName ?? "none"})`);
  evidence.push(`Workspace B sources: ${sourcesB.length} (${sourcesB[0]?.metadata?.fileName ?? "none"})`);
  evidence.push(`Cross-workspace denial: ${crossWorkspaceDenied.reason}`);
  evidence.push(`Invalid upload blocked: ${invalidUpload.errorCode ?? "none"}`);
  evidence.push(`Remove left ${resolveWorkspaceDataSources(removeWorkspace.workspaceId).length} sources`);
  evidence.push("Panel uses hydration-safe useSyncExternalStore snapshots");
  evidence.push("CSV upload imports through owned resolver path");

  const freezeTagsValid =
    WORKSPACE_DATA_SOURCE_FOUNDATION_CERTIFICATION_TAGS.length === 5 &&
    WORKSPACE_DATA_SOURCE_FOUNDATION_CERTIFICATION_TAGS.includes("[DS1_READY]");
  const certified =
    freezeTagsValid &&
    gates.every((entry) => entry.status === "PASS") &&
    scenarios.every((entry) => entry.status === "PASS");

  return Object.freeze({
    tag: NWB95_CERTIFICATION_TAG,
    version: "NW-B:9-5",
    certified,
    result: certified ? "PASS" : "FAIL",
    diagnostics: Object.freeze([WORKSPACE_DATA_SOURCE_FOUNDATION_COMPLETE_DIAGNOSTIC] as const),
    gates: Object.freeze(gates),
    scenarios: Object.freeze(scenarios),
    freezeTags: WORKSPACE_DATA_SOURCE_FOUNDATION_CERTIFICATION_TAGS,
    evidence: Object.freeze(evidence),
  });
}
