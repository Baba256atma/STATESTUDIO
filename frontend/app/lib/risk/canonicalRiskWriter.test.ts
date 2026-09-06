import assert from "node:assert/strict";
import test from "node:test";

import { createWorkspace, resetWorkspaceRegistryForTests } from "../workspace/workspaceRegistryStore.ts";
import { ensureBrowserLocalStorageHarness } from "../test-harness/browserLocalStorageHarness.ts";
import { getWorkspaceRisks, resetWorkspaceRiskStoreForTests } from "./workspaceRiskContract.ts";
import { writeCanonicalRisk, type CanonicalRiskWriteRequest } from "./canonicalRiskWriter.ts";

function setup() {
  ensureBrowserLocalStorageHarness();
  window.localStorage.clear();
  resetWorkspaceRiskStoreForTests();
  resetWorkspaceRegistryForTests();
  return createWorkspace("Canonical Risk Writer").workspaceId;
}

function request(workspaceId: string, overrides: Partial<CanonicalRiskWriteRequest> = {}): CanonicalRiskWriteRequest {
  return {
    operation: "CREATE",
    workspaceId,
    name: "Supplier Delay",
    confirmation: { confirmed: true, source: "MANAGER_CONVERSATION", proposalId: "proposal-1", turnId: "turn-2" },
    provenance: { createdBy: "MANAGER", creationSource: "MANAGER_CONVERSATION", proposalId: "proposal-1", confirmationTurn: "turn-2", evidenceRefs: [] },
    ...overrides,
  };
}

test("A. confirmed valid proposal creates exactly one canonical Risk", () => {
  const workspaceId = setup();
  const result = writeCanonicalRisk(request(workspaceId));
  assert.equal(result.status, "CREATED");
  assert.equal(getWorkspaceRisks(workspaceId).length, 1);
});

test("B. missing or stale confirmation cannot write", () => {
  const workspaceId = setup();
  assert.equal(writeCanonicalRisk(request(workspaceId, { confirmation: null })).status, "REJECTED");
  assert.equal(writeCanonicalRisk(request(workspaceId, { confirmation: { confirmed: true, source: "MANAGER_CONVERSATION", proposalId: "old", turnId: "turn-2" } })).status, "REJECTED");
  assert.equal(getWorkspaceRisks(workspaceId).length, 0);
});

test("C. duplicate canonical identity returns ALREADY_EXISTS", () => {
  const workspaceId = setup();
  const first = writeCanonicalRisk(request(workspaceId));
  const second = writeCanonicalRisk(request(workspaceId, { confirmation: { confirmed: true, source: "MANAGER_CONVERSATION", proposalId: "proposal-2", turnId: "turn-4" }, provenance: { createdBy: "MANAGER", creationSource: "MANAGER_CONVERSATION", proposalId: "proposal-2", confirmationTurn: "turn-4", evidenceRefs: [] } }));
  assert.equal(first.status, "CREATED");
  assert.equal(second.status, "ALREADY_EXISTS");
  assert.equal(getWorkspaceRisks(workspaceId).length, 1);
});

test("D. creation does not fabricate severity, probability, or causality", () => {
  const workspaceId = setup();
  const result = writeCanonicalRisk(request(workspaceId));
  assert.equal(result.risk?.category, "custom");
  assert.equal("severity" in (result.risk ?? {}), false);
  assert.equal("probability" in (result.risk ?? {}), false);
});

test("E. candidate evidence remains provenance input and does not become certainty", () => {
  const workspaceId = setup();
  const result = writeCanonicalRisk(request(workspaceId, { provenance: { createdBy: "MANAGER", creationSource: "MANAGER_CONVERSATION", proposalId: "proposal-1", confirmationTurn: "turn-2", evidenceRefs: ["csv:CAP_AV:LIKELY"] } }));
  assert.equal(result.status, "CREATED");
  assert.equal(result.risk?.source, "ds-6:1-foundation");
});

test("F. update changes only requested fields", () => {
  const workspaceId = setup();
  const created = writeCanonicalRisk(request(workspaceId));
  const updated = writeCanonicalRisk(request(workspaceId, { operation: "UPDATE", riskId: created.riskId, name: "Supplier Delay Updated" }));
  assert.equal(updated.status, "UPDATED");
  assert.equal(updated.risk?.title, "Supplier Delay Updated");
  assert.equal(updated.risk?.description, "");
});

test("G. remove rejects dependent risks until dependencies are reviewed", () => {
  const workspaceId = setup();
  const created = writeCanonicalRisk(request(workspaceId));
  const blocked = writeCanonicalRisk(request(workspaceId, { operation: "REMOVE", riskId: created.riskId, dependencies: ["scenario-1"] }));
  assert.equal(blocked.status, "REJECTED");
  assert.equal(getWorkspaceRisks(workspaceId).length, 1);
  const removed = writeCanonicalRisk(request(workspaceId, { operation: "REMOVE", riskId: created.riskId, dependencies: [] }));
  assert.equal(removed.status, "REMOVED");
});

test("H. RELATE rejects rather than inventing an ontology relationship", () => {
  const workspaceId = setup();
  assert.equal(writeCanonicalRisk(request(workspaceId, { operation: "RELATE", relatedRiskId: "delivery" })).status, "REJECTED");
});
