import assert from "node:assert/strict";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";

import {
  commitPreparedCsvRealDataImport,
  listCsvPublishedKpiObservations,
  listCsvRealDataImports,
  resetCsvRealDataImportStoreForTests,
} from "../data-reality/csvRealDataImportStore.ts";
import { prepareCsvRealDataImport, updateCsvColumnMapping } from "../data-reality/csvRealDataVerticalSlice.ts";
import { projectNexoraLlmManagementContext } from "../conversational-control/nexoraLlmManagementContext.ts";
import { projectAdvisorDataContext } from "../manager-object/nexoraAdvisorDataContext.ts";
import { createHostedWorkspace } from "./hostedWorkspaceCommands.ts";
import { authorizeNexoraWorkspace } from "./authorizeNexoraWorkspace.ts";
import { applyHostedManagerSnapshot } from "./hostedManagerDataClient.ts";
import { ownershipShaped, postPending } from "./hostedManagerDataHttp.ts";
import {
  HOSTED_CSV_MAX_BYTES,
  acceptHostedPendingCsv,
  createHostedPendingCsv,
  discardHostedPendingCsv,
  hostedDatabaseContainsText,
  hostedPendingRawPresent,
  readHostedManagerDataSnapshot,
  readHostedPendingCsv,
  removeHostedDataSource,
  validateHostedCsvText,
} from "./hostedManagerData.ts";
import {
  closeHostedWorkspaceDatabaseForTests,
  failHostedWorkspaceDatabaseForTests,
  hostedWorkspaceDatabase,
  openHostedWorkspaceDatabaseForTests,
} from "./hostedWorkspaceStore.ts";

function llmContext(workspaceId: string): string {
  return JSON.stringify(
    projectNexoraLlmManagementContext({
      workspaceId,
      utterance: "What changed?",
      resolvedSubjectId: null,
      subjectLabel: null,
      subjectKind: null,
      subjectEpistemic: null,
      referentId: null,
      referentProvenance: null,
    }),
  );
}

const userA = Object.freeze({ userId: "dev:user_a" });
const userB = Object.freeze({ userId: "dev:user_b" });
const RAW = "RAW-SENTINEL-NOT-ACCEPTED";

function companyCsv(value: number): string {
  return `Date,Warehouse Used Capacity,Raw Note,Warehouse Total Capacity\n2026-01-01,1000,${RAW},2000\n2026-02-01,${value},${RAW},5000\n`;
}

/** Match a stored data value. Generated ids can contain the same digits and are not data. */
function containsDataValue(value: unknown, needle: string): boolean {
  const token = new RegExp(`(^|[^A-Za-z0-9])${needle}([^A-Za-z0-9]|$)`);
  const walk = (entry: unknown): boolean => {
    if (typeof entry === "number") return String(entry) === needle;
    if (typeof entry === "string") {
      if (/^(ws_|imp_|obs_|src_|rdi2:)/.test(entry)) return false;
      return token.test(entry);
    }
    if (Array.isArray(entry)) return entry.some((item) => walk(item));
    if (entry && typeof entry === "object") return Object.values(entry).some((item) => walk(item));
    return false;
  };
  return walk(value);
}

async function workspace(principal: { userId: string }, name: string, kind: "BUSINESS" | "PROJECT") {
  const created = await createHostedWorkspace({ principal, name, kind });
  assert.equal(created.ok, true);
  if (!created.ok) throw new Error("workspace");
  return created.value;
}

test("hosted manager data is workspace-owned, temporary, and server-authoritative", async () => {
  const directory = await mkdtemp(join(tmpdir(), "nexora-hosted-data-"));
  await openHostedWorkspaceDatabaseForTests(directory);
  resetCsvRealDataImportStoreForTests();
  try {
    const companyA = await workspace(userA, "Company A", "BUSINESS");
    const projectA = await workspace(userA, "Project A", "PROJECT");
    const companyB = await workspace(userB, "Company B", "BUSINESS");
    assert.equal(validateHostedCsvText("x".repeat(HOSTED_CSV_MAX_BYTES + 1)), "csv_too_large");
    assert.equal(validateHostedCsvText(`${"c,".repeat(41).slice(0, -1)}\n${"1,".repeat(41).slice(0, -1)}\n`), "column_limit_exceeded");
    assert.equal(validateHostedCsvText(`Name\n${"a".repeat(2001)}\n`), "field_limit_exceeded");
    assert.equal(validateHostedCsvText(`Name\n${Array.from({ length: 5001 }, (_, index) => index).join("\n")}\n`), "row_limit_exceeded");

    const started = Date.now();
    const pending = await createHostedPendingCsv({
      workspaceId: companyA.workspaceId,
      fileName: "orders.csv",
      csvText: companyCsv(4242),
    });
    assert.equal(await hostedPendingRawPresent(companyA.workspaceId, pending.pendingId), true);
    const ignored = updateCsvColumnMapping(pending.prepared.mapping, 2, null);
    const accepted = await acceptHostedPendingCsv({
      workspaceId: companyA.workspaceId,
      pendingId: pending.pendingId,
      mapping: ignored,
    });
    const elapsed = Date.now() - started;
    assert.ok(elapsed < 5000, `accept ${elapsed}ms`);
    assert.equal(accepted.sources.length, 1);
    assert.equal(await hostedPendingRawPresent(companyA.workspaceId, pending.pendingId), false);
    assert.equal(await hostedDatabaseContainsText(RAW), false);
    assert.equal(await hostedDatabaseContainsText("4242"), true);
    assert.equal(await hostedDatabaseContainsText("1000"), true);
    await assert.rejects(
      () => acceptHostedPendingCsv({ workspaceId: companyA.workspaceId, pendingId: pending.pendingId }),
      /pending_not_found/,
    );
    const duplicate = await createHostedPendingCsv({
      workspaceId: companyA.workspaceId,
      fileName: "orders.csv",
      csvText: companyCsv(4242),
    });
    const replay = await acceptHostedPendingCsv({
      workspaceId: companyA.workspaceId,
      pendingId: duplicate.pendingId,
      mapping: updateCsvColumnMapping(duplicate.prepared.mapping, 2, null),
    });
    assert.equal(replay.sources.length, 1);
    assert.equal(await hostedPendingRawPresent(companyA.workspaceId, duplicate.pendingId), false);
    const anonymous = await postPending(companyA.workspaceId, {
      fileName: "orders.csv",
      csvText: companyCsv(1),
    });
    assert.equal(anonymous.status, 401);
    assert.equal(ownershipShaped({ ownerUserId: userA.userId }), true);
    assert.equal(ownershipShaped({ userId: userA.userId }), true);
    assert.equal(ownershipShaped({ accountId: "acct" }), true);
    assert.equal(ownershipShaped({ fileName: "orders.csv", csvText: "a\n" }), false);
    const again = await readHostedManagerDataSnapshot(companyA.workspaceId);
    assert.equal(again.sources.length, 1);

    const projectPending = await createHostedPendingCsv({
      workspaceId: projectA.workspaceId,
      fileName: "load.csv",
      csvText: companyCsv(77),
    });
    await acceptHostedPendingCsv({
      workspaceId: projectA.workspaceId,
      pendingId: projectPending.pendingId,
      mapping: updateCsvColumnMapping(projectPending.prepared.mapping, 2, null),
    });
    const companyOnly = await readHostedManagerDataSnapshot(companyA.workspaceId);
    const projectOnly = await readHostedManagerDataSnapshot(projectA.workspaceId);
    assert.equal(companyOnly.workspaceId, companyA.workspaceId);
    assert.equal(projectOnly.workspaceId, projectA.workspaceId);
    assert.equal(companyOnly.sources.every((source) => source.workspaceId === companyA.workspaceId), true);
    assert.equal(projectOnly.sources.every((source) => source.workspaceId === projectA.workspaceId), true);
    assert.equal(containsDataValue(companyOnly, "4242"), true);
    assert.equal(containsDataValue(companyOnly, "77"), false);
    assert.equal(containsDataValue(projectOnly, "77"), true);
    assert.equal(containsDataValue(projectOnly, "4242"), false);

    const foreign = await authorizeNexoraWorkspace({ principal: userB, workspaceId: companyA.workspaceId });
    assert.notEqual(foreign.outcome, "AUTHORIZED");
    await assert.rejects(
      () => readHostedPendingCsv(companyB.workspaceId, pending.pendingId),
      /pending_not_found/,
    );
    await assert.rejects(
      () => removeHostedDataSource(companyB.workspaceId, companyOnly.sources[0]!.sourceContextId),
      /source_not_found/,
    );
    assert.equal((await readHostedManagerDataSnapshot(companyA.workspaceId)).sources.length, 1);

    const staleText = "Date,Inventory On Hand\n2026-01-01,999999\n";
    const stalePrepared = prepareCsvRealDataImport({
      workspaceId: companyA.workspaceId as typeof companyA.workspaceId,
      fileName: "stale.csv",
      fileSize: staleText.length,
      csvText: staleText,
      importId: "imp_stale_indexeddb",
      importedAt: "2026-10-15T00:00:00.000Z",
    });
    const staleCommit = commitPreparedCsvRealDataImport({
      prepared: stalePrepared,
      expectedWorkspaceId: companyA.workspaceId,
      mode: "new",
      committedAt: "2026-10-15T00:00:00.000Z",
    });
    assert.equal(staleCommit.committed, true);
    assert.equal(JSON.stringify(listCsvRealDataImports(companyA.workspaceId)).includes("999999"), true);
    applyHostedManagerSnapshot(companyA.workspaceId, [{
      ...companyOnly.sources[0]!,
      dataReality: companyOnly.sources[0]!.dataReality,
    }], "2026-10-15T00:00:00.000Z");
    const stale = listCsvRealDataImports(companyA.workspaceId);
    assert.equal(JSON.stringify(stale).includes("999999"), false);
    applyHostedManagerSnapshot(companyA.workspaceId, companyOnly.sources, "2026-10-15T00:00:00.000Z");
    const advisor = JSON.stringify(projectAdvisorDataContext(companyA.workspaceId));
    const llm = llmContext(companyA.workspaceId);
    assert.equal(advisor.includes("4242") || llm.includes("4242") || JSON.stringify(listCsvRealDataImports(companyA.workspaceId)).includes("4242"), true);
    assert.equal(llm.includes(RAW), false);
    assert.equal(llm.includes("csvText"), false);
    assert.equal(listCsvPublishedKpiObservations().some((entry) => entry.workspaceId === companyA.workspaceId), true);

    await removeHostedDataSource(companyA.workspaceId, companyOnly.sources[0]!.sourceContextId);
    const removed = await readHostedManagerDataSnapshot(companyA.workspaceId);
    assert.equal(removed.sources.length, 0);
    applyHostedManagerSnapshot(companyA.workspaceId, removed.sources, "2026-10-15T00:00:00.000Z");
    assert.equal(listCsvRealDataImports(companyA.workspaceId).length, 0);
    assert.equal(listCsvPublishedKpiObservations().some((entry) => entry.workspaceId === companyA.workspaceId), false);
    const llmAfter = llmContext(companyA.workspaceId);
    assert.equal(llmAfter.includes("4242"), false);

    const discarded = await createHostedPendingCsv({
      workspaceId: companyB.workspaceId,
      fileName: "other.csv",
      csvText: companyCsv(3131),
    });
    await discardHostedPendingCsv(companyB.workspaceId, discarded.pendingId);
    assert.equal(await hostedPendingRawPresent(companyB.workspaceId, discarded.pendingId), false);
    const expiring = await createHostedPendingCsv({
      workspaceId: companyB.workspaceId,
      fileName: "old.csv",
      csvText: companyCsv(3131),
      now: new Date("2026-01-01T00:00:00.000Z"),
    });
    await assert.rejects(
      () => readHostedPendingCsv(companyB.workspaceId, expiring.pendingId, new Date("2026-01-03T00:00:00.000Z")),
      /pending_not_found/,
    );

    await closeHostedWorkspaceDatabaseForTests();
    await openHostedWorkspaceDatabaseForTests(directory);
    const reopened = await readHostedManagerDataSnapshot(projectA.workspaceId);
    assert.equal(reopened.workspaceId, projectA.workspaceId);
    assert.equal(containsDataValue(reopened, "77"), true);
    assert.equal(containsDataValue(reopened, "4242"), false);
    assert.equal(await hostedDatabaseContainsText(RAW), false);

    failHostedWorkspaceDatabaseForTests(true);
    await assert.rejects(
      () => readHostedManagerDataSnapshot(projectA.workspaceId),
      /data_store_unavailable/,
    );
    const db = await hostedWorkspaceDatabase().catch(() => null);
    assert.equal(db, null);
  } finally {
    failHostedWorkspaceDatabaseForTests(false);
    await closeHostedWorkspaceDatabaseForTests();
    await rm(directory, { recursive: true, force: true });
    resetCsvRealDataImportStoreForTests();
  }
});
