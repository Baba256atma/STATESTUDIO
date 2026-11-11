import assert from "node:assert/strict";
import { beforeEach, test } from "node:test";

import { openManufacturingDemo, openProjectDemo, resetDemoProfileForTests } from "../demo-profile/demoProfileStore.ts";
import { resetActiveDemo } from "../demo-profile/demoProfileReset.ts";
import { createManagerWorkspace } from "../workspace/managerWorkspaceIdentity.ts";
import { DEMO_WORKSPACE_ID } from "../workspace/workspaceRegistryContract.ts";
import { resetWorkspaceRegistryForTests } from "../workspace/workspaceRegistryStore.ts";
import { resetAutomaticMonitoringRuntimeForTests } from "./automaticMonitoringRuntime.ts";
import {
  hydrateDurableMonitoringSnapshot,
  mergeDurableMonitoringSnapshots,
  persistDurableMonitoringRuntime,
  type NexoraDurableMonitoringStorage,
} from "./durableMonitoringRuntime.ts";
import {
  createGithubRepositoryConnector,
  createNexoraLiveConnection,
  prepareNexoraLiveObservation,
  transitionNexoraLiveConnection,
  type NexoraLiveFetch,
} from "./liveDataConnectorFoundation.ts";
import {
  commitNexoraLiveObservation,
  exportNexoraLiveDataRecoverySnapshot,
  listNexoraLiveObservationDeletions,
  listNexoraLiveObservations,
  removeWorkspaceLiveObservation,
  resetLiveDataConnectionStoreForTests,
  saveNexoraLiveConnection,
} from "./liveDataConnectionStore.ts";

const T0 = "2026-08-16T18:00:00.000Z";
const T1 = "2026-08-16T19:00:00.000Z";

function storage(): NexoraDurableMonitoringStorage {
  const data = new Map<string, string>();
  return {
    getItem(key) { return data.get(key) ?? null; },
    setItem(key, value) { data.set(key, value); },
    removeItem(key) { data.delete(key); },
  };
}

function fetcher(): NexoraLiveFetch {
  return async (url) => url.includes("/issues?")
    ? { ok: true, status: 200, json: async () => [{ id: 1, state: "open" }] }
    : { ok: true, status: 200, json: async () => ({ full_name: "nexora/reference", html_url: "https://github.com/nexora/reference", stargazers_count: 1, forks_count: 1, open_issues_count: 1 }) };
}

function connection(workspaceId: string, connectionId: string) {
  const connector = createGithubRepositoryConnector(fetcher());
  return transitionNexoraLiveConnection(createNexoraLiveConnection({
    connectionId,
    workspaceId,
    providerId: "github",
    providerType: "source-control",
    displayName: "Engineering Source",
    capabilities: connector.capabilities(),
    createdAt: T0,
    configurationReference: "github:nexora/reference",
  }), "connected", T0);
}

async function commitObservation(workspaceId: string, observationId: string, connectionId: string) {
  const live = connection(workspaceId, connectionId);
  saveNexoraLiveConnection(live);
  const prepared = await prepareNexoraLiveObservation({
    connector: createGithubRepositoryConnector(fetcher()),
    connection: live,
    configuration: Object.freeze({ owner: "nexora", repository: "reference" }),
    observationId,
    observedAt: T1,
  });
  const committed = commitNexoraLiveObservation({ connection: live, prepared, committedAt: T1 });
  assert.equal(committed.committed, true, committed.reason);
  return committed.observation!;
}

function ids(snapshot: { observations: readonly { observationId: string }[] }) {
  return snapshot.observations.map((entry) => entry.observationId).sort();
}

beforeEach(() => {
  resetWorkspaceRegistryForTests();
  resetDemoProfileForTests();
  resetLiveDataConnectionStoreForTests();
  resetAutomaticMonitoringRuntimeForTests();
});

test("profile reset deletions survive snapshot merge, hydration, stale replay, and a later observation", async () => {
  const company = createManagerWorkspace({ name: "Clean Company", kind: "BUSINESS" });
  const expansion = createManagerWorkspace({ name: "Factory Expansion", kind: "PROJECT" });
  assert.ok(company && expansion);
  await commitObservation(DEMO_WORKSPACE_ID, "OBS-LEGACY", "github:legacy");
  await commitObservation(company.workspaceId, "OBS-COMPANY", "github:company");
  await commitObservation(expansion.workspaceId, "OBS-EXPANSION", "github:expansion");
  openManufacturingDemo();
  const manufacturing = await commitObservation(DEMO_WORKSPACE_ID, "OBS-M", "github:profile");
  assert.equal(manufacturing.demoProfileId, "manufacturing");
  openProjectDemo();
  const project = await commitObservation(DEMO_WORKSPACE_ID, "OBS-P", "github:profile");
  assert.equal(project.demoProfileId, "project");
  const foreign = commitNexoraLiveObservation({
    connection: connection(DEMO_WORKSPACE_ID, "github:profile"),
    prepared: { ...project, observationId: "OBS-M", observedAt: T1 },
    committedAt: T1,
  });
  assert.equal(foreign.reason, "profile_mismatch");
  const prior = persistDurableMonitoringRuntime(storage(), T1);
  assert.deepEqual(ids(prior.liveData), ["OBS-COMPANY", "OBS-EXPANSION", "OBS-LEGACY", "OBS-M", "OBS-P"]);

  openManufacturingDemo();
  assert.equal(resetActiveDemo().status, "reset");
  const current = persistDurableMonitoringRuntime(storage(), "2026-08-16T20:00:00.000Z");
  assert.equal(current.liveData.observations.some((entry) => entry.observationId === "OBS-M"), false);
  assert.equal(current.liveData.observations.some((entry) => entry.observationId === "OBS-P"), true);
  assert.equal(current.liveData.observations.some((entry) => entry.observationId === "OBS-LEGACY"), true);
  assert.equal(current.liveData.observations.some((entry) => entry.observationId === "OBS-COMPANY"), true);
  assert.equal(current.liveData.observations.some((entry) => entry.observationId === "OBS-EXPANSION"), true);
  assert.equal(current.observationDeletions.some((entry) => entry.observationId === "OBS-M" && entry.demoProfileId === "manufacturing"), true);

  const merged = mergeDurableMonitoringSnapshots(prior, current);
  assert.equal(merged.liveData.observations.some((entry) => entry.observationId === "OBS-M"), false);
  assert.deepEqual(ids(merged.liveData), ["OBS-COMPANY", "OBS-EXPANSION", "OBS-LEGACY", "OBS-P"]);
  const staleReplay = mergeDurableMonitoringSnapshots(merged, prior);
  assert.equal(staleReplay.liveData.observations.some((entry) => entry.observationId === "OBS-M"), false);
  assert.equal(staleReplay.observationDeletions.some((entry) => entry.observationId === "OBS-M"), true);

  resetLiveDataConnectionStoreForTests();
  hydrateDurableMonitoringSnapshot(staleReplay, "2026-08-16T21:00:00.000Z");
  assert.deepEqual(listNexoraLiveObservations(DEMO_WORKSPACE_ID, "github:profile").map((entry) => entry.observationId), []);
  openProjectDemo();
  assert.deepEqual(listNexoraLiveObservations(DEMO_WORKSPACE_ID, "github:profile").map((entry) => entry.observationId), ["OBS-P"]);
  const recovered = persistDurableMonitoringRuntime(storage(), "2026-08-16T21:00:00.000Z");
  const refreshed = mergeDurableMonitoringSnapshots(staleReplay, recovered);
  resetLiveDataConnectionStoreForTests();
  hydrateDurableMonitoringSnapshot(refreshed, "2026-08-16T22:00:00.000Z");
  openManufacturingDemo();
  assert.deepEqual(listNexoraLiveObservations(DEMO_WORKSPACE_ID, "github:profile").map((entry) => entry.observationId), []);

  const again = await commitObservation(DEMO_WORKSPACE_ID, "OBS-M2", "github:profile");
  assert.equal(again.demoProfileId, "manufacturing");
  assert.equal(again.observationId, "OBS-M2");
  const replay = commitNexoraLiveObservation({
    connection: connection(DEMO_WORKSPACE_ID, "github:profile"),
    prepared: { ...again, observationId: "OBS-M", observedAt: T1 },
    committedAt: T1,
  });
  assert.equal(replay.reason, "removed_observation");
  const withNew = mergeDurableMonitoringSnapshots(refreshed, persistDurableMonitoringRuntime(storage(), "2026-08-16T22:00:00.000Z"));
  assert.equal(withNew.liveData.observations.some((entry) => entry.observationId === "OBS-M2"), true);
  assert.equal(withNew.liveData.observations.some((entry) => entry.observationId === "OBS-M"), false);

  const deletionCount = listNexoraLiveObservationDeletions().length;
  assert.equal(resetActiveDemo().status, "reset");
  assert.deepEqual(listNexoraLiveObservations(DEMO_WORKSPACE_ID, "github:profile"), []);
  assert.equal(listNexoraLiveObservationDeletions().some((entry) => entry.observationId === "OBS-M"), true);
  assert.equal(listNexoraLiveObservationDeletions().length >= deletionCount, true);
  openProjectDemo();
  assert.equal(listNexoraLiveObservations(DEMO_WORKSPACE_ID, "github:profile")[0]?.observationId, "OBS-P");
  assert.equal(listNexoraLiveObservations(company.workspaceId, "github:company")[0]?.observationId, "OBS-COMPANY");
  assert.equal(listNexoraLiveObservations(expansion.workspaceId, "github:expansion")[0]?.observationId, "OBS-EXPANSION");
});

test("project reset removes only project observations", async () => {
  openManufacturingDemo();
  await commitObservation(DEMO_WORKSPACE_ID, "OBS-M", "github:profile");
  openProjectDemo();
  await commitObservation(DEMO_WORKSPACE_ID, "OBS-P", "github:profile");
  const prior = persistDurableMonitoringRuntime(storage(), T1);
  assert.equal(resetActiveDemo().status, "reset");
  const current = persistDurableMonitoringRuntime(storage(), "2026-08-16T20:00:00.000Z");
  const merged = mergeDurableMonitoringSnapshots(prior, current);
  assert.deepEqual(ids(merged.liveData), ["OBS-M"]);
  assert.equal(merged.observationDeletions[0]?.demoProfileId, "project");
  resetLiveDataConnectionStoreForTests();
  hydrateDurableMonitoringSnapshot(merged, "2026-08-16T21:00:00.000Z");
  assert.deepEqual(listNexoraLiveObservations(DEMO_WORKSPACE_ID, "github:profile"), []);
  openManufacturingDemo();
  assert.equal(listNexoraLiveObservations(DEMO_WORKSPACE_ID, "github:profile")[0]?.observationId, "OBS-M");
  assert.equal(resetActiveDemo().status, "reset");
  assert.equal(exportNexoraLiveDataRecoverySnapshot().observations.some((entry) => entry.observationId === "OBS-M"), false);
  assert.equal(exportNexoraLiveDataRecoverySnapshot().observations.some((entry) => entry.observationId === "OBS-P"), false);
});

test("a business workspace observation tombstone rejects a stale replay and leaves other workspaces", async () => {
  const company = createManagerWorkspace({ name: "Clean Company", kind: "BUSINESS" });
  const expansion = createManagerWorkspace({ name: "Factory Expansion", kind: "PROJECT" });
  assert.ok(company && expansion);
  const kept = await commitObservation(company.workspaceId, "OBS-KEEP", "github:company");
  const removed = await commitObservation(expansion.workspaceId, "OBS-REMOVE", "github:expansion");
  const result = removeWorkspaceLiveObservation({
    workspaceId: expansion.workspaceId,
    connectionId: "github:expansion",
    observationId: removed.observationId,
    removedAt: "2026-08-16T20:00:00.000Z",
  });
  assert.equal(result.removed, true);
  assert.equal(listNexoraLiveObservations(expansion.workspaceId, "github:expansion").length, 0);
  assert.equal(listNexoraLiveObservations(company.workspaceId, "github:company")[0]?.observationId, kept.observationId);
  const tombstone = listNexoraLiveObservationDeletions().find((entry) => entry.observationId === "OBS-REMOVE");
  assert.equal(tombstone?.workspaceId, expansion.workspaceId);
  assert.equal(tombstone?.connectionId, "github:expansion");
  assert.equal(tombstone?.demoProfileId, null);
  const replay = commitNexoraLiveObservation({
    connection: connection(expansion.workspaceId, "github:expansion"),
    prepared: { ...removed, observedAt: "2026-08-16T21:00:00.000Z" },
    committedAt: "2026-08-16T21:00:00.000Z",
  });
  assert.equal(replay.reason, "removed_observation");
  const merged = mergeDurableMonitoringSnapshots(
    persistDurableMonitoringRuntime(storage(), "2026-08-16T20:00:00.000Z"),
    persistDurableMonitoringRuntime(storage(), "2026-08-16T21:00:00.000Z"),
  );
  assert.equal(merged.liveData.observations.some((entry) => entry.observationId === "OBS-REMOVE"), false);
  assert.equal(merged.observationDeletions.some((entry) => entry.observationId === "OBS-REMOVE"), true);
});
