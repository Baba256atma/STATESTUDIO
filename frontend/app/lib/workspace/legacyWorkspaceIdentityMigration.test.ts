/**
 * NPA-T MWI:3 — historical identity classification, migration, and isolation.
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import { BUSINESS_PROJECT_CONTEXT_BOUNDARY } from "../business-context-awareness/businessProjectContextContract.ts";
import { updateNexoraExecutiveContext } from "../conversational-control/executiveContextUpdater.ts";
import { toNexoraConversationContextSnapshot } from "../conversational-control/executiveContextProjection.ts";
import { createEmptyNexoraExecutiveContextSnapshot } from "../conversational-control/executiveContextSnapshot.ts";
import {
  createMemoryCsvDurabilityStorage,
  persistCsvRealDataImportDurability,
  recoverCsvRealDataImportDurability,
} from "../data-reality/csvRealDataImportDurability.ts";
import {
  CSV_MVP_DEMO_COMMITTED_AT,
  CSV_MVP_DEMO_INVENTORY_FILE,
  CSV_MVP_DEMO_INVENTORY_TEXT,
  CSV_MVP_DEMO_PENDING_FILE,
  ensureCsvMvpDemoBootstrap,
} from "../data-reality/csvRealDataMvpDemoBootstrap.ts";
import {
  commitPreparedCsvRealDataImport,
  exportCsvRealDataImportState,
  hydrateCsvRealDataImportState,
  listCsvRealDataImports,
  resetCsvRealDataImportStoreForTests,
  type CsvCommittedImport,
} from "../data-reality/csvRealDataImportStore.ts";
import { prepareCsvRealDataImport } from "../data-reality/csvRealDataVerticalSlice.ts";
import { projectCsvImportAsDecisionTheatreDataObject } from "../decision-theatre/nexoraDecisionTheatreDataObjectProjection.ts";
import {
  listSupportedGroundedLearningForSubject,
  projectGroundedLearningIntelligence,
  resetGroundedLearningForTests,
} from "../executive-intelligence/nexoraGroundedLearningIntelligence.ts";
import { projectLiveOutcomeIntelligence } from "../executive-intelligence/nexoraLiveOutcomeIntelligence.ts";
import { NMI_AUTHORITY_BOUNDARY } from "../nmi/nmiAuthorityBoundary.ts";
import { NMI_FOUNDATION_CONTRACT } from "../nmi/nmiContract.ts";
import {
  applyCsvLegacyIdentityMigration,
  LEGACY_GLOBAL_WORKSPACE_KEY,
  managerLearningWorkspaceId,
  MWI3_HISTORICAL_IDENTITY_DEBT,
  MWI3_MIGRATION_IDENTITY,
  readManagerWorkspaceCsvImports,
} from "./legacyWorkspaceIdentityMigration.ts";
import {
  MANAGER_WORKSPACE_AUTHORITY,
  bindWorkflowMode,
  createManagerWorkspace,
} from "./managerWorkspaceIdentity.ts";
import { DEMO_WORKSPACE_ID } from "./workspaceRegistryContract.ts";
import {
  getActiveWorkspaceId,
  resetWorkspaceRegistryForTests,
} from "./workspaceRegistryStore.ts";

const SHELL = new URL("../../executive/nex-mvp/NexoraExecutiveShell.tsx", import.meta.url);
const ORCHESTRATOR = new URL("../conversational-control/conversationalExperienceOrchestrator.ts", import.meta.url);

test.beforeEach(() => {
  resetWorkspaceRegistryForTests();
  resetCsvRealDataImportStoreForTests();
  resetGroundedLearningForTests();
});

test.afterEach(() => {
  resetWorkspaceRegistryForTests();
  resetCsvRealDataImportStoreForTests();
  resetGroundedLearningForTests();
});

test("I1 I4 I8 — ambiguous history is not assigned to the active manager workspace", () => {
  const ambiguous = commitCsv("overview", "delivery.csv", "mwi3-ambiguous");
  const canonical = commitCsv("workspace-a", "canonical.csv", "mwi3-canonical");
  const baha = createManagerWorkspace({ name: "BAHA Doors", kind: "BUSINESS" });
  const factory = createManagerWorkspace({ name: "Factory Expansion Project", kind: "PROJECT" });
  assert.ok(baha);
  assert.ok(factory);
  const before = exportCsvRealDataImportState();
  const activeBefore = getActiveWorkspaceId();

  const first = applyCsvLegacyIdentityMigration(before, {
    activeWorkspaceId: baha.workspaceId,
    proofs: [{
      sourceContextId: ambiguous.sourceContextId,
      targetWorkspaceId: baha.workspaceId,
      basis: "active-workspace",
    }],
  });
  const conflict = applyCsvLegacyIdentityMigration(before, {
    activeWorkspaceId: baha.workspaceId,
    proofs: [
      {
        sourceContextId: ambiguous.sourceContextId,
        targetWorkspaceId: baha.workspaceId,
        basis: "explicit-source-link",
      },
      {
        sourceContextId: ambiguous.sourceContextId,
        targetWorkspaceId: factory.workspaceId,
        basis: "import-ownership",
      },
    ],
  });
  assert.equal(conflict.changed, false);
  assert.equal(
    conflict.state.committed.find((entry) => entry.importId === ambiguous.importId)?.workspaceId,
    "overview",
  );

  assert.equal(first.identity, MWI3_MIGRATION_IDENTITY);
  assert.equal(first.activeWorkspaceUsedAsEvidence, false);
  assert.equal(first.changed, false);
  assert.equal(getActiveWorkspaceId(), activeBefore);
  const kept = first.state.committed.find((entry) => entry.importId === ambiguous.importId);
  assert.equal(kept, ambiguous);
  assert.equal(kept?.workspaceId, "overview");
  const untouched = first.state.committed.find((entry) => entry.importId === canonical.importId);
  assert.equal(untouched, canonical);
  assert.equal(untouched?.workspaceId, "workspace-a");
  const row = first.records.find((entry) => entry.recordKey === ambiguous.sourceContextId);
  assert.equal(row?.classification, "MANAGER_DATA_AMBIGUOUS");
  assert.equal(row?.disposition, "quarantined");

  hydrateCsvRealDataImportState(first.state);
  assert.equal(readManagerWorkspaceCsvImports(baha.workspaceId).length, 0);
  assert.equal(readManagerWorkspaceCsvImports(factory.workspaceId).length, 0);
  assert.equal(readManagerWorkspaceCsvImports("overview").length, 0);
  assert.equal(readManagerWorkspaceCsvImports(LEGACY_GLOBAL_WORKSPACE_KEY).length, 0);
  assert.equal(listCsvRealDataImports("overview").length, 1);
  assert.equal(listCsvRealDataImports("workspace-a").length, 1);
});

test("I2 I7 I8 — explicit source proof migrates once and a second pass is stable", () => {
  const historical = commitCsv("decision", "capacity.csv", "mwi3-provable");
  const already = commitCsv(DEMO_WORKSPACE_ID, "already-demo.csv", "mwi3-already-demo");
  const baha = createManagerWorkspace({ name: "BAHA Doors", kind: "BUSINESS" });
  const factory = createManagerWorkspace({ name: "Factory Expansion Project", kind: "PROJECT" });
  assert.ok(baha);
  assert.ok(factory);
  const canonical = commitCsv(baha.workspaceId, "baha-live.csv", "mwi3-baha-live");
  const exported = exportCsvRealDataImportState();
  const proof = {
    sourceContextId: historical.sourceContextId,
    targetWorkspaceId: baha.workspaceId,
    basis: "explicit-source-link" as const,
  };

  const first = applyCsvLegacyIdentityMigration(exported, {
    activeWorkspaceId: factory.workspaceId,
    proofs: [proof],
  });
  const moved = first.state.committed.find((entry) => entry.importId === historical.importId);
  assert.ok(moved);
  assert.equal(moved.workspaceId, baha.workspaceId);
  assert.equal(moved.prepared.workspaceId, baha.workspaceId);
  assert.equal(moved.prepared.snapshot?.source.identity.workspaceId, baha.workspaceId);
  assert.equal(moved.prepared.handoff?.workspaceId, baha.workspaceId);
  assert.equal(moved.sourceContextId, historical.sourceContextId);
  assert.equal(moved.importId, historical.importId);
  assert.equal(moved.committedAt, historical.committedAt);
  assert.deepEqual(moved.prepared.parse.records, historical.prepared.parse.records);
  assert.equal(first.state.committed.find((entry) => entry.importId === canonical.importId), canonical);
  assert.equal(first.state.committed.find((entry) => entry.importId === already.importId), already);
  assert.doesNotThrow(() => projectCsvImportAsDecisionTheatreDataObject(moved));
  const evidence = first.records.find((entry) => entry.recordKey === historical.sourceContextId);
  assert.equal(evidence?.classification, "MANAGER_DATA_PROVABLE");
  assert.equal(evidence?.disposition, "migrated-manager");
  assert.equal(evidence?.evidence, "explicit-source-link");
  assert.equal(evidence?.toWorkspaceId, baha.workspaceId);

  const second = applyCsvLegacyIdentityMigration(first.state, {
    activeWorkspaceId: factory.workspaceId,
    proofs: [proof],
  });
  assert.equal(second.changed, false);
  assert.equal(second.records.filter((entry) => entry.disposition === "migrated-manager").length, 0);
  assert.equal(second.records.filter((entry) => entry.disposition === "migrated-demo").length, 0);
  assert.deepEqual(second.state, first.state);
  assert.equal(
    second.state.committed.find((entry) => entry.importId === historical.importId),
    moved,
  );
  assert.equal(
    second.state.committed.filter((entry) => entry.importId === historical.importId).length,
    1,
  );
});

test("I3 I7 — proven demo markers move to demo_workspace and do not follow the active workspace", () => {
  const seeded = ensureCsvMvpDemoBootstrap({ workspaceId: "overview" });
  assert.equal(seeded.refused, false);
  assert.equal(seeded.inventorySeeded, true);
  const namedOnly = commitCsv("overview", CSV_MVP_DEMO_PENDING_FILE, "mwi3-name-is-not-proof");
  const baha = createManagerWorkspace({ name: "BAHA Doors", kind: "BUSINESS" });
  assert.ok(baha);
  const first = applyCsvLegacyIdentityMigration(exportCsvRealDataImportState(), {
    activeWorkspaceId: baha.workspaceId,
  });
  const demo = first.state.committed.find((entry) => entry.importId.startsWith("cei3-mvp-demo:"));
  assert.ok(demo);
  assert.equal(demo.workspaceId, DEMO_WORKSPACE_ID);
  assert.equal(demo.committedAt, CSV_MVP_DEMO_COMMITTED_AT);
  assert.equal(demo.prepared.fileName, CSV_MVP_DEMO_INVENTORY_FILE);
  assert.equal(first.state.committed.find((entry) => entry.importId === namedOnly.importId), namedOnly);
  const demoRow = first.records.find((entry) => entry.recordKey === demo.sourceContextId);
  assert.equal(demoRow?.classification, "DEMO_DATA");
  assert.equal(demoRow?.disposition, "migrated-demo");
  assert.equal(demoRow?.evidence, "cei3-mvp-demo+demo-file+demo-committed-at");

  hydrateCsvRealDataImportState(first.state);
  assert.equal(
    listCsvRealDataImports(baha.workspaceId).some((entry) => entry.prepared.fileName === CSV_MVP_DEMO_INVENTORY_FILE),
    false,
  );
  assert.equal(
    listCsvRealDataImports(DEMO_WORKSPACE_ID).some((entry) => entry.importId === demo.importId),
    true,
  );

  const second = applyCsvLegacyIdentityMigration(first.state, { activeWorkspaceId: baha.workspaceId });
  assert.equal(second.changed, false);
  assert.deepEqual(second.state, first.state);
  assert.equal(second.records.filter((entry) => entry.disposition === "migrated-demo").length, 0);
});

test("I4 I7 — IndexedDB recover migrates once and leaves ambiguous overview records in place", async () => {
  ensureCsvMvpDemoBootstrap({ workspaceId: "overview" });
  const ambiguous = commitCsv("overview", "forecast.csv", "mwi3-forecast");
  const baha = createManagerWorkspace({ name: "BAHA Doors", kind: "BUSINESS" });
  assert.ok(baha);
  const canonical = commitCsv(baha.workspaceId, "baha-forecast.csv", "mwi3-baha-forecast");
  const storage = createMemoryCsvDurabilityStorage();
  assert.equal((await persistCsvRealDataImportDurability(storage, "2026-10-12T00:00:00.000Z")).persisted, true);

  resetCsvRealDataImportStoreForTests();
  const recovered = await recoverCsvRealDataImportDurability(storage);
  assert.equal(recovered.recovered, true);
  assert.equal(listCsvRealDataImports("overview").some((entry) => entry.importId === ambiguous.importId), true);
  assert.equal(listCsvRealDataImports(baha.workspaceId).some((entry) => entry.importId === canonical.importId), true);
  assert.equal(listCsvRealDataImports(baha.workspaceId).some((entry) => entry.importId === ambiguous.importId), false);
  assert.equal(
    listCsvRealDataImports(DEMO_WORKSPACE_ID).some((entry) => entry.importId.startsWith("cei3-mvp-demo:")),
    true,
  );
  assert.equal(readManagerWorkspaceCsvImports(baha.workspaceId).some((entry) => entry.workspaceId === "overview"), false);
  const afterFirst = exportCsvRealDataImportState();

  assert.equal((await persistCsvRealDataImportDurability(storage, "2026-10-12T00:01:00.000Z")).persisted, true);
  resetCsvRealDataImportStoreForTests();
  const again = await recoverCsvRealDataImportDurability(storage);
  assert.equal(again.recovered, true);
  assert.deepEqual(exportCsvRealDataImportState(), afterFirst);
  assert.equal(
    exportCsvRealDataImportState().committed.filter((entry) => entry.importId === ambiguous.importId).length,
    1,
  );
  assert.equal(
    exportCsvRealDataImportState().committed.filter((entry) => entry.importId === canonical.importId).length,
    1,
  );
});

test("failure safety — corrupt records and unknown keys are retained", () => {
  const baha = createManagerWorkspace({ name: "BAHA Doors", kind: "BUSINESS" });
  assert.ok(baha);
  const corrupt = { workspaceId: "overview", sourceContextId: "broken" } as CsvCommittedImport;
  const report = applyCsvLegacyIdentityMigration({
    committed: [corrupt],
    pending: [],
    removed: [],
  }, {
    activeWorkspaceId: baha.workspaceId,
    proofs: [{
      sourceContextId: "broken",
      targetWorkspaceId: baha.workspaceId,
      basis: "explicit-source-link",
    }],
  });
  assert.equal(report.changed, false);
  assert.equal(report.state.committed[0], corrupt);
  assert.equal(report.records[0]?.disposition, "quarantined");
  assert.equal(report.records[0]?.evidence, "corrupt-or-unaligned");
});

test("I5 — conversation manager identity stays put when the dial moves", () => {
  const baha = createManagerWorkspace({ name: "BAHA Doors", kind: "BUSINESS" });
  assert.ok(baha);
  const previous = createEmptyNexoraExecutiveContextSnapshot({
    currentWorkspaceId: "overview",
    managerWorkspaceId: baha.workspaceId,
  });
  const updated = updateNexoraExecutiveContext({
    previousContext: previous,
    trustedSuccess: true,
    runtimeWorkspaceId: "decision",
  });
  assert.equal(updated.nextContext.currentWorkspaceId, "decision");
  assert.equal(updated.nextContext.managerWorkspaceId, baha.workspaceId);
  const projected = toNexoraConversationContextSnapshot(updated.nextContext);
  assert.equal(projected.currentWorkspaceId, "decision");
  assert.equal(projected.managerWorkspaceId, baha.workspaceId);

  const shell = readFileSync(SHELL, "utf8");
  assert.match(shell, /currentWorkspaceId: "overview"/);
  assert.match(shell, /managerWorkspaceId: readLiveExecutiveDataWorkspaceId\(\)/);
  assert.match(shell, /learningWorkspaceId=\{dataWorkspaceId\}/);
  assert.doesNotMatch(shell, /nexora-mvp/);
  const orchestrator = readFileSync(ORCHESTRATOR, "utf8");
  assert.match(orchestrator, /managerLearningWorkspaceId\(args\.previousExecutiveContext\.managerWorkspaceId\)/);
  assert.match(orchestrator, /runtimeWorkspaceId: args\.nextRuntimeState\.workspace/);
});

test("I6 — manager learning stays inside the workspace that produced it", () => {
  const baha = createManagerWorkspace({ name: "BAHA Doors", kind: "BUSINESS" });
  const factory = createManagerWorkspace({ name: "Factory Expansion Project", kind: "PROJECT" });
  assert.ok(baha);
  assert.ok(factory);
  seedLearning(baha.workspaceId, "BAHA capacity held at 80.");
  seedLearning(factory.workspaceId, "Factory capacity moved to 11.");

  const learningA = listSupportedGroundedLearningForSubject({
    workspaceId: baha.workspaceId,
    subjectId: "obj-capacity",
  });
  const learningB = listSupportedGroundedLearningForSubject({
    workspaceId: factory.workspaceId,
    subjectId: "obj-capacity",
  });
  const historical = listSupportedGroundedLearningForSubject({
    workspaceId: LEGACY_GLOBAL_WORKSPACE_KEY,
    subjectId: "obj-capacity",
  });
  assert.ok(learningA.length > 0);
  assert.ok(learningB.length > 0);
  assert.equal(historical.length, 0);
  assert.equal(learningA.some((entry) => learningB.some((other) => other.learningId === entry.learningId)), false);
  assert.equal(learningA.every((entry) => entry.workspaceId === baha.workspaceId), true);
  assert.equal(learningB.every((entry) => entry.workspaceId === factory.workspaceId), true);
  assert.equal(managerLearningWorkspaceId(baha.workspaceId), baha.workspaceId);
  assert.equal(managerLearningWorkspaceId(null), LEGACY_GLOBAL_WORKSPACE_KEY);
  assert.equal(managerLearningWorkspaceId("overview"), LEGACY_GLOBAL_WORKSPACE_KEY);
  assert.equal(managerLearningWorkspaceId("decision"), LEGACY_GLOBAL_WORKSPACE_KEY);
  bindWorkflowMode({ workspaceId: baha.workspaceId, workflowMode: "execution" });
  assert.equal(managerLearningWorkspaceId(baha.workspaceId), baha.workspaceId);
});

test("I9 I10 — migration does not add a workspace authority or replace NMI", () => {
  assert.equal(MANAGER_WORKSPACE_AUTHORITY.parallelWorkspaceStore, false);
  assert.equal(MANAGER_WORKSPACE_AUTHORITY.activeWorkspaceOwner, "workspaceRegistryStore.getActiveWorkspaceId");
  assert.equal(MANAGER_WORKSPACE_AUTHORITY.replacesNmiUnifiedCompanyProject, false);
  assert.equal(NMI_FOUNDATION_CONTRACT.identity, "NPA-T NMI:1/ManagementIntelligenceFoundation");
  assert.equal(NMI_AUTHORITY_BOUNDARY.businessProjectContext, "BCA:1/BusinessProjectContextFoundation");
  assert.equal(BUSINESS_PROJECT_CONTEXT_BOUNDARY.ownsContextInterpretation, true);
  assert.equal(MWI3_HISTORICAL_IDENTITY_DEBT.some((entry) => entry.system === "saved-scene-empty-detail"), true);
  assert.equal(MWI3_HISTORICAL_IDENTITY_DEBT.some((entry) => entry.identity === "default_workspace"), true);
  assert.equal(MWI3_HISTORICAL_IDENTITY_DEBT.some((entry) => entry.system === "monitoring-and-live-connection"), true);
});

function commitCsv(workspaceId: string, fileName: string, importId: string): CsvCommittedImport {
  const prepared = prepareCsvRealDataImport({
    workspaceId,
    fileName,
    fileSize: CSV_MVP_DEMO_INVENTORY_TEXT.length,
    csvText: CSV_MVP_DEMO_INVENTORY_TEXT,
    importId,
    importedAt: "2026-10-12T12:00:00.000Z",
  });
  assert.equal(prepared.ready, true, prepared.errors.join("; "));
  const result = commitPreparedCsvRealDataImport({
    prepared,
    expectedWorkspaceId: workspaceId,
    mode: "new",
    committedAt: "2026-10-12T12:00:01.000Z",
  });
  assert.equal(result.committed, true, result.reason);
  assert.ok(result.current);
  return result.current;
}

function seedLearning(workspaceId: string, statement: string) {
  const assessment = projectLiveOutcomeIntelligence({
    subjectId: "obj-capacity",
    decisionId: `decision-${workspaceId}`,
    executionId: `execution-${workspaceId}`,
    expected: {
      expectationId: `expected-${workspaceId}`,
      statement: "Capacity utilization is expected to maintain.",
      claimKind: "PREDICTION",
      dimension: "capacity-utilization",
      source: "scenario",
      numericTarget: null,
      comparator: null,
      unit: "%",
      expectedDirection: "maintain",
      capturedAt: "2026-01-01T00:00:00.000Z",
      evidenceRefs: Object.freeze([
        { sourceKind: "scenario" as const, sourceId: `ctx-${workspaceId}`, factKey: "expected-effect" },
      ]),
      provenanceRefs: Object.freeze([`test:expected:${workspaceId}`]),
    },
    actuals: [{
      observationId: `obs-${workspaceId}`,
      statement,
      claimKind: "FACT",
      dimension: "capacity-utilization",
      source: "data-reality",
      numericValue: workspaceId.length,
      unit: "%",
      observedDirection: "increase",
      observedAt: "2026-02-01T00:00:00.000Z",
      freshness: "current",
      validationStatus: "validated",
      outcomeLinked: true,
      evidenceRefs: Object.freeze([
        { sourceKind: "data-reality" as const, sourceId: `rdi:${workspaceId}`, factKey: "utilization" },
      ]),
      provenanceRefs: Object.freeze([`test:actual:${workspaceId}`]),
    }],
    baseline: {
      measured: "Capacity utilization at decision time",
      measuredAt: "2026-01-01T00:00:00.000Z",
      source: "data-reality",
      numericValue: 90,
      unit: "%",
      confidence: "medium",
      provenanceRefs: Object.freeze([`test:baseline:${workspaceId}`]),
    },
    window: {
      decisionAt: "2026-01-01T00:00:00.000Z",
      executionAt: "2026-01-15T00:00:00.000Z",
      observedAt: "2026-02-01T00:00:00.000Z",
      timingComplete: true,
    },
  });
  assert.equal(assessment.status, "comparison-ready");
  const learning = projectGroundedLearningIntelligence({
    workspaceId,
    subjectId: "obj-capacity",
    createdAt: "2026-02-01T00:00:00.000Z",
    assessment,
    decisionId: `decision-${workspaceId}`,
    executionId: `execution-${workspaceId}`,
  });
  assert.ok(learning.candidates.some((entry) => entry.promotionEligibility === "promotion-eligible"));
}
