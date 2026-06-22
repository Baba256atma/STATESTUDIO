import assert from "node:assert/strict";

import type { Workspace } from "./workspaceRegistryContract.ts";
import {
  approveCandidateObject,
  syncApprovalStatesForDataSource,
} from "./workspaceObjectApprovalRuntime.ts";
import { createWorkspaceObjectsFromApprovedCandidates } from "./workspaceObjectCreationPipeline.ts";
import {
  discoverCandidateObjects,
} from "./workspaceCandidateObjectDiscoveryEngine.ts";
import {
  classifyDataSourceColumns,
} from "./workspaceColumnClassificationEngine.ts";
import { importWorkspaceDataSource } from "./workspaceDataSourceResolver.ts";
import {
  discoverAndSaveWorkspaceDataSourceSchema,
} from "./workspaceDataSourceSchemaResolver.ts";

const DATA_SOURCE_ID = "wds_entities";

export function approveAndCreateViaPanel(
  workspace: Workspace,
  objectNames: readonly string[]
): void {
  importWorkspaceDataSource({
    workspaceId: workspace.workspaceId,
    dataSourceId: DATA_SOURCE_ID,
    name: "entities",
    type: "csv",
    status: "connected",
    metadata: Object.freeze({
      fileName: "entities.csv",
      csvText:
        "customer_id,customer_name,customer_status,customer_region,supplier_id,supplier_name,supplier_region,product_id,product_name,product_category\n1,Acme,active,East,10,Global Supply,West,100,Widget,Hardware\n",
    }),
  });
  const schema = discoverAndSaveWorkspaceDataSourceSchema({
    workspaceId: workspace.workspaceId,
    dataSourceId: DATA_SOURCE_ID,
    fileName: "entities.csv",
    csvText:
      "customer_id,customer_name,customer_status,customer_region,supplier_id,supplier_name,supplier_region,product_id,product_name,product_category\n1,Acme,active,East,10,Global Supply,West,100,Widget,Hardware\n",
  });
  assert.equal(schema.success, true, schema.reason);
  assert.equal(classifyDataSourceColumns(workspace.workspaceId, DATA_SOURCE_ID).success, true);
  assert.equal(discoverCandidateObjects(workspace.workspaceId, DATA_SOURCE_ID).success, true);
  syncApprovalStatesForDataSource(workspace.workspaceId, DATA_SOURCE_ID);

  for (const objectName of objectNames) {
    const candidate = syncApprovalStatesForDataSource(workspace.workspaceId, DATA_SOURCE_ID).find(
      (entry) => entry.objectName === objectName
    );
    assert.ok(candidate, objectName);
    approveCandidateObject(workspace.workspaceId, DATA_SOURCE_ID, candidate.candidateId);
  }

  createWorkspaceObjectsFromApprovedCandidates(workspace.workspaceId, DATA_SOURCE_ID);
}
