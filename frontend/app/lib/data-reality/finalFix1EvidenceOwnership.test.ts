import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { beforeEach, test } from "node:test";
import { fileURLToPath } from "node:url";

import { projectNexoraLlmManagementContext } from "../conversational-control/nexoraLlmManagementContext.ts";
import { resetActiveDemo } from "../demo-profile/demoProfileReset.ts";
import {
  openManufacturingDemo,
  openProjectDemo,
  resetDemoProfileForTests,
} from "../demo-profile/demoProfileStore.ts";
import { createManagerWorkspace, readLiveExecutiveDataWorkspaceId } from "../workspace/managerWorkspaceIdentity.ts";
import { DEMO_WORKSPACE_ID, LEGACY_WORKFLOW_WORKSPACE_IDENTIFIERS } from "../workspace/workspaceRegistryContract.ts";
import { resetWorkspaceRegistryForTests, setActiveWorkspace } from "../workspace/workspaceRegistryStore.ts";
import {
  commitPreparedCsvRealDataImport,
  listCsvPublishedKpiObservations,
  listCsvRealDataImports,
  resetCsvRealDataImportStoreForTests,
} from "./csvRealDataImportStore.ts";
import { prepareCsvRealDataImport } from "./csvRealDataVerticalSlice.ts";
import {
  getNextProactiveAdvisorBrief,
  hydrateProactiveAdvisorRecoverySnapshot,
  resetProactiveAdvisorDeliveryForTests,
  type NexoraProactiveAdvisorBrief,
} from "./proactiveAdvisorDelivery.ts";
import { projectPublishedKpiObservedDirection } from "./publishedKpiObservedDirection.ts";

const EXPERIMENT_TEXT = "Date,Production Used Capacity,Production Total Capacity\n2026-08-31,500000,1000\n";
const MANAGER_TEXT = "Date,Production Used Capacity,Production Total Capacity\n2026-08-31,980,1000\n";
const ADVISOR_SOURCE = fileURLToPath(new URL("../../executive/nex-mvp/NexoraAdvisorInsightRegion.tsx", import.meta.url));
const ORCHESTRATOR_SOURCE = fileURLToPath(new URL("../conversational-control/conversationalExperienceOrchestrator.ts", import.meta.url));

beforeEach(() => {
  resetWorkspaceRegistryForTests();
  resetCsvRealDataImportStoreForTests();
  resetDemoProfileForTests();
  resetProactiveAdvisorDeliveryForTests();
});

function commitCsv(workspaceId: string, fileName: string, importId: string, csvText: string, importedAt: string) {
  const prepared = prepareCsvRealDataImport({
    workspaceId,
    fileName,
    fileSize: csvText.length,
    csvText,
    importId,
    importedAt,
  });
  assert.equal(prepared.ready, true, prepared.errors.join("; "));
  const committed = commitPreparedCsvRealDataImport({
    prepared,
    expectedWorkspaceId: workspaceId,
    mode: "new",
    committedAt: importedAt,
  });
  assert.equal(committed.committed, true, committed.reason);
  return committed.current!;
}

function experimentOnDemo() {
  return commitCsv(
    DEMO_WORKSPACE_ID,
    "experiment-kpi.csv",
    `demo-profile:manufacturing:${DEMO_WORKSPACE_ID}:experiment-kpi.csv`,
    EXPERIMENT_TEXT,
    "2026-10-14T00:00:00.000Z",
  );
}

function managerKpi(name: string, kind: "BUSINESS" | "PROJECT") {
  const workspace = createManagerWorkspace({ name, kind });
  assert.ok(workspace);
  const committed = commitCsv(
    workspace.workspaceId,
    `${kind.toLowerCase()}-kpi.csv`,
    `${kind}:${workspace.workspaceId}:kpi`,
    MANAGER_TEXT,
    "2026-08-31T00:00:00.000Z",
  );
  const observation = listCsvPublishedKpiObservations().find((entry) => entry.importId === committed.importId);
  assert.ok(observation);
  return { workspace, observation };
}

function capacityDirection() {
  const current = listCsvPublishedKpiObservations().find((entry) => entry.kpiId === "kpi.production.capacity-utilization");
  assert.ok(current);
  return projectPublishedKpiObservedDirection({
    kpiId: current.kpiId,
    subjectId: current.nexoraObjectId,
  });
}

function deliveredBrief(workspaceId: string, headline: string): NexoraProactiveAdvisorBrief {
  return {
    workspaceId,
    briefId: `brief:${workspaceId}`,
    deliveryFingerprint: `fp:${workspaceId}:${headline}`,
    status: "delivered",
    priority: "urgent",
    headline,
    summary: headline,
    createdAt: "2026-08-20T15:34:37.420Z",
    currentFacts: Object.freeze([headline]),
  } as NexoraProactiveAdvisorBrief;
}

test("manufacturing reset drops the removed experiment KPI and selects the baseline", () => {
  const business = managerKpi("BAHA Doors", "BUSINESS");
  const project = managerKpi("Factory Expansion", "PROJECT");
  const managerBefore = listCsvPublishedKpiObservations().filter((entry) => entry.workspaceId !== DEMO_WORKSPACE_ID);
  openManufacturingDemo();
  const baseline = listCsvPublishedKpiObservations().find(
    (entry) => entry.sourceContextId === "csv:demo_workspace:manufacturing-production-csv",
  );
  assert.equal(baseline?.value, 98);
  experimentOnDemo();
  const beforeReset = projectPublishedKpiObservedDirection({
    kpiId: "kpi.production.capacity-utilization",
    subjectId: "nexora.executive-operations.object.production",
  });
  assert.equal(beforeReset.currentValue, 50000);
  assert.equal(beforeReset.currentSourceContextId, "csv:demo_workspace:experiment-kpi-csv");

  const first = resetActiveDemo();
  assert.equal(first.status, "reset");
  assert.equal(listCsvRealDataImports(DEMO_WORKSPACE_ID).some((entry) => entry.prepared.fileName === "experiment-kpi.csv"), false);
  const stale = listCsvPublishedKpiObservations().filter((entry) => entry.value === 50000 || entry.sourceContextId.includes("experiment-kpi"));
  assert.deepEqual(stale, []);
  const afterFirst = capacityDirection();
  assert.notEqual(afterFirst.currentValue, 50000);
  assert.notEqual(afterFirst.currentSourceContextId, "csv:demo_workspace:experiment-kpi-csv");
  assert.equal(afterFirst.currentValue, 98);

  const second = resetActiveDemo();
  assert.equal(second.status, "reset");
  const afterSecond = listCsvPublishedKpiObservations().filter(
    (entry) => entry.kpiId === "kpi.production.capacity-utilization" && entry.workspaceId === DEMO_WORKSPACE_ID,
  );
  assert.equal(afterSecond.length, 1);
  assert.equal(afterSecond[0]?.value, 98);
  assert.deepEqual(
    listCsvPublishedKpiObservations().filter((entry) => entry.workspaceId !== DEMO_WORKSPACE_ID),
    managerBefore,
  );
  assert.equal(listCsvPublishedKpiObservations().some((entry) => entry.importId === business.observation.importId), true);
  assert.equal(listCsvPublishedKpiObservations().some((entry) => entry.importId === project.observation.importId), true);
});

test("project reset removes an experimental demo KPI without inventing a project KPI", () => {
  openProjectDemo();
  experimentOnDemo();
  assert.equal(listCsvPublishedKpiObservations().some((entry) => entry.value === 50000), true);
  const first = resetActiveDemo();
  assert.equal(first.status, "reset");
  assert.equal(first.profileId, "project");
  assert.equal(listCsvRealDataImports(DEMO_WORKSPACE_ID).some((entry) => entry.prepared.fileName === "experiment-kpi.csv"), false);
  assert.equal(listCsvPublishedKpiObservations().some((entry) => entry.value === 50000), false);
  const second = resetActiveDemo();
  assert.equal(second.status, "reset");
  assert.equal(listCsvPublishedKpiObservations().some((entry) => entry.value === 50000), false);
  assert.deepEqual(
    listCsvRealDataImports(DEMO_WORKSPACE_ID).map((entry) => entry.prepared.fileName).sort(),
    ["progress.csv", "resources.csv", "schedule.csv"],
  );
});

test("advisor proactive evidence uses the canonical live workspace, not the workflow mode", () => {
  const source = readFileSync(ADVISOR_SOURCE, "utf8");
  assert.match(source, /getNextProactiveAdvisorBrief\(\s*readLiveExecutiveDataWorkspaceId\(\)\s*\)/);
  assert.doesNotMatch(source, /getNextProactiveAdvisorBrief\(\s*advisorBridge\.activeWorkspace\s*\)/);
  const orchestrator = readFileSync(ORCHESTRATOR_SOURCE, "utf8");
  assert.match(orchestrator, /workspaceId:\s*readLiveExecutiveDataWorkspaceId\(\)/);

  const companyA = createManagerWorkspace({ name: "Company A", kind: "BUSINESS" });
  const companyB = createManagerWorkspace({ name: "Company B", kind: "BUSINESS" });
  const project = createManagerWorkspace({ name: "Factory Expansion", kind: "PROJECT" });
  assert.ok(companyA && companyB && project);
  hydrateProactiveAdvisorRecoverySnapshot({
    briefs: Object.freeze([
      deliveredBrief("overview", "Customer moved from NORMAL to CRITICAL"),
      deliveredBrief("problem", "Problem workflow brief"),
      deliveredBrief("scenario", "Scenario workflow brief"),
      deliveredBrief("decision", "Decision workflow brief"),
      deliveredBrief("execution", "Execution workflow brief"),
      deliveredBrief(companyA.workspaceId, "Company A owned brief"),
      deliveredBrief(project.workspaceId, "Project owned brief"),
      deliveredBrief(DEMO_WORKSPACE_ID, "Manufacturing demo brief"),
    ]),
  });

  for (const mode of LEGACY_WORKFLOW_WORKSPACE_IDENTIFIERS) {
    setActiveWorkspace(companyA.workspaceId);
    assert.equal(readLiveExecutiveDataWorkspaceId(), companyA.workspaceId);
    const selected = getNextProactiveAdvisorBrief(readLiveExecutiveDataWorkspaceId());
    assert.equal(selected?.headline, "Company A owned brief");
    assert.equal(selected?.workspaceId, companyA.workspaceId);
    assert.notEqual(selected?.workspaceId, mode);
    assert.equal(getNextProactiveAdvisorBrief(mode)?.workspaceId, mode);
  }

  setActiveWorkspace(companyB.workspaceId);
  assert.equal(getNextProactiveAdvisorBrief(readLiveExecutiveDataWorkspaceId()), null);
  assert.equal(getNextProactiveAdvisorBrief("overview")?.headline, "Customer moved from NORMAL to CRITICAL");

  setActiveWorkspace(companyA.workspaceId);
  assert.equal(getNextProactiveAdvisorBrief(readLiveExecutiveDataWorkspaceId())?.headline, "Company A owned brief");

  setActiveWorkspace(project.workspaceId);
  assert.equal(getNextProactiveAdvisorBrief(readLiveExecutiveDataWorkspaceId())?.headline, "Project owned brief");
  assert.notEqual(getNextProactiveAdvisorBrief(readLiveExecutiveDataWorkspaceId())?.workspaceId, companyA.workspaceId);

  openManufacturingDemo();
  assert.equal(readLiveExecutiveDataWorkspaceId(), DEMO_WORKSPACE_ID);
  assert.equal(getNextProactiveAdvisorBrief(readLiveExecutiveDataWorkspaceId())?.headline, "Manufacturing demo brief");
  assert.notEqual(getNextProactiveAdvisorBrief(readLiveExecutiveDataWorkspaceId())?.workspaceId, "overview");
  openProjectDemo();
  assert.equal(readLiveExecutiveDataWorkspaceId(), DEMO_WORKSPACE_ID);
  assert.equal(getNextProactiveAdvisorBrief(readLiveExecutiveDataWorkspaceId())?.workspaceId, DEMO_WORKSPACE_ID);

  const context = projectNexoraLlmManagementContext({
    resolvedSubjectId: null,
    subjectLabel: null,
    subjectKind: null,
    subjectEpistemic: null,
    referentId: null,
    referentProvenance: null,
    utterance: "What changed?",
    workspaceId: readLiveExecutiveDataWorkspaceId(),
  });
  assert.equal(JSON.stringify(context).includes("Customer moved from NORMAL to CRITICAL"), false);
});

test("company, project, and demo evidence stay partitioned across reset", () => {
  const companyA = managerKpi("Company A", "BUSINESS");
  const companyB = createManagerWorkspace({ name: "Company B", kind: "BUSINESS" });
  assert.ok(companyB);
  hydrateProactiveAdvisorRecoverySnapshot({
    briefs: Object.freeze([
      deliveredBrief("overview", "Customer moved from NORMAL to CRITICAL"),
      deliveredBrief(companyA.workspace.workspaceId, "Company A owned brief"),
    ]),
  });
  openManufacturingDemo();
  experimentOnDemo();
  setActiveWorkspace(companyA.workspace.workspaceId);
  assert.equal(getNextProactiveAdvisorBrief(readLiveExecutiveDataWorkspaceId())?.headline, "Company A owned brief");
  assert.equal(
    listCsvPublishedKpiObservations().some((entry) => entry.workspaceId === companyA.workspace.workspaceId && entry.value === 98),
    true,
  );
  assert.equal(
    listCsvPublishedKpiObservations().filter((entry) => entry.workspaceId === companyB.workspaceId).length,
    0,
  );

  setActiveWorkspace(companyB.workspaceId);
  assert.equal(getNextProactiveAdvisorBrief(readLiveExecutiveDataWorkspaceId()), null);
  assert.equal(listCsvPublishedKpiObservations().some((entry) => entry.workspaceId === companyB.workspaceId), false);

  openManufacturingDemo();
  assert.equal(readLiveExecutiveDataWorkspaceId(), DEMO_WORKSPACE_ID);
  assert.equal(getNextProactiveAdvisorBrief(readLiveExecutiveDataWorkspaceId()), null);
  assert.equal(getNextProactiveAdvisorBrief("overview")?.headline, "Customer moved from NORMAL to CRITICAL");
  const reset = resetActiveDemo();
  assert.equal(reset.status, "reset");
  assert.equal(listCsvPublishedKpiObservations().some((entry) => entry.value === 50000), false);
  assert.equal(
    listCsvPublishedKpiObservations().some((entry) => entry.importId === companyA.observation.importId && entry.value === 98),
    true,
  );
  assert.equal(getNextProactiveAdvisorBrief("overview")?.headline, "Customer moved from NORMAL to CRITICAL");
});
