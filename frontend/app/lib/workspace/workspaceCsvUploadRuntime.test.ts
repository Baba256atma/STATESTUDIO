import assert from "node:assert/strict";
import test from "node:test";

import {
  createWorkspace,
  resetWorkspaceRegistryForTests,
} from "./workspaceRegistryStore.ts";
import { getWorkspaceDataSources } from "./workspaceContextResolver.ts";
import {
  listWorkspaceDataSources,
  resetWorkspaceDataSourcesForTests,
} from "./workspaceDataSourceRegistry.ts";
import {
  MAX_WORKSPACE_CSV_UPLOAD_BYTES,
  resolveWorkspaceCsvUploadUserMessage,
} from "./workspaceCsvUploadContract.ts";
import {
  parseWorkspaceCsvContent,
  validateWorkspaceCsvFile,
  validateWorkspaceCsvFileSize,
} from "./workspaceCsvUploadValidation.ts";
import {
  getLatestWorkspaceCsvUploadStatus,
  listWorkspaceCsvUploadStatuses,
  resetWorkspaceCsvUploadForTests,
  uploadWorkspaceCsv,
} from "./workspaceCsvUploadRuntime.ts";

type TestCsvFile = Readonly<{
  name: string;
  type: string;
  size: number;
  text: () => Promise<string>;
}>;

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

test.beforeEach(() => {
  resetWorkspaceRegistryForTests();
  resetWorkspaceDataSourcesForTests();
  resetWorkspaceCsvUploadForTests();
});

test("parses CSV metadata with row and column counts", () => {
  const parsed = parseWorkspaceCsvContent("sku,name,count\nA,Widget,10\nB,Gadget,20\n");
  assert.equal(parsed.rowCount, 2);
  assert.equal(parsed.columnCount, 3);
});

test("rejects invalid, empty, corrupted, and oversized CSV files with user-friendly messages", async () => {
  const workspace = createWorkspace("Finance Workspace");

  const invalid = await validateWorkspaceCsvFile(
    makeCsvFile({ name: "briefing.pdf", body: "sku,count\nA,1\n", type: "application/pdf" }),
    workspace.workspaceId
  );
  assert.equal(invalid.valid, false);
  assert.equal(invalid.errorCode, "unsupported_file_type");
  assert.match(invalid.message, /Only \.csv files/i);

  const empty = await validateWorkspaceCsvFile(
    makeCsvFile({ name: "empty.csv", body: "sku,count\n" }),
    workspace.workspaceId
  );
  assert.equal(empty.valid, false);
  assert.equal(empty.errorCode, "empty_csv");
  assert.match(empty.message, /empty/i);

  const corrupted = await validateWorkspaceCsvFile(
    makeCsvFile({ name: "broken.csv", body: 'sku,name\n"A,Missing quote\n' }),
    workspace.workspaceId
  );
  assert.equal(corrupted.valid, false);
  assert.equal(corrupted.errorCode, "invalid_csv");

  const oversized = validateWorkspaceCsvFileSize(
    makeCsvFile({
      name: "large.csv",
      body: "sku,count\nA,1\n",
      size: MAX_WORKSPACE_CSV_UPLOAD_BYTES + 1,
    })
  );
  assert.equal(oversized.valid, false);
  assert.equal(oversized.errorCode, "oversized_csv");
  assert.equal(
    oversized.message,
    resolveWorkspaceCsvUploadUserMessage("oversized_csv")
  );
});

test("uploads valid CSV, captures metadata, and registers workspace data source", async () => {
  const workspace = createWorkspace("Operations Workspace");
  const file = makeCsvFile({
    name: "inventory.csv",
    body: "sku,location,count\nA-1,East,12\nA-2,West,8\n",
  });

  const result = await uploadWorkspaceCsv(file, workspace.workspaceId);

  assert.equal(result.success, true);
  assert.equal(result.status, "success");
  assert.ok(result.metadata);
  assert.equal(result.metadata.fileName, "inventory.csv");
  assert.equal(result.metadata.fileSize, file.size);
  assert.equal(result.metadata.rowCount, 2);
  assert.equal(result.metadata.columnCount, 3);
  assert.equal(result.metadata.workspaceId, workspace.workspaceId);
  assert.ok(result.dataSource);
  assert.equal(result.dataSource.type, "csv");
  assert.equal(result.dataSource.status, "connected");
  assert.equal(result.dataSource.metadata?.rowCount, 2);
  assert.equal(result.dataSource.metadata?.columnCount, 3);

  assert.equal(listWorkspaceDataSources(workspace.workspaceId).length, 1);
  assert.equal(getWorkspaceDataSources(workspace.workspaceId).length, 1);

  const latestStatus = getLatestWorkspaceCsvUploadStatus(workspace.workspaceId);
  assert.equal(latestStatus?.status, "success");
  assert.equal(latestStatus?.dataSourceId, result.dataSource.dataSourceId);
  assert.equal(listWorkspaceCsvUploadStatuses(workspace.workspaceId).length, 3);
});

test("does not register invalid CSV uploads", async () => {
  const workspace = createWorkspace("Guard Workspace");
  const result = await uploadWorkspaceCsv(
    makeCsvFile({ name: "empty.csv", body: "sku,count\n" }),
    workspace.workspaceId
  );

  assert.equal(result.success, false);
  assert.equal(result.status, "failed");
  assert.equal(result.errorCode, "empty_csv");
  assert.equal(listWorkspaceDataSources(workspace.workspaceId).length, 0);
  assert.equal(getLatestWorkspaceCsvUploadStatus(workspace.workspaceId)?.status, "failed");
});

test("keeps CSV uploads isolated by workspace", async () => {
  const workspaceA = createWorkspace("Workspace A");
  const workspaceB = createWorkspace("Workspace B");

  await uploadWorkspaceCsv(
    makeCsvFile({ name: "pipeline.csv", body: "id,value\n1,alpha\n" }),
    workspaceA.workspaceId
  );

  assert.equal(listWorkspaceDataSources(workspaceA.workspaceId).length, 1);
  assert.equal(listWorkspaceDataSources(workspaceB.workspaceId).length, 0);
  assert.equal(getLatestWorkspaceCsvUploadStatus(workspaceB.workspaceId), null);
});
