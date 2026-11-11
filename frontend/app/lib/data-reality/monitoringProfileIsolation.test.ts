import assert from "node:assert/strict";
import { beforeEach, test } from "node:test";

import { resetDemoProfileForTests, openManufacturingDemo, openProjectDemo, readActiveDemoProfile } from "../demo-profile/demoProfileStore.ts";
import { resetActiveDemo } from "../demo-profile/demoProfileReset.ts";
import { createManagerWorkspace } from "../workspace/managerWorkspaceIdentity.ts";
import { DEMO_WORKSPACE_ID } from "../workspace/workspaceRegistryContract.ts";
import { getActiveWorkspaceId, resetWorkspaceRegistryForTests } from "../workspace/workspaceRegistryStore.ts";
import { enableAutomaticMonitoring, listAutomaticMonitoringPolicies, resetAutomaticMonitoringRuntimeForTests } from "./automaticMonitoringRuntime.ts";
import {
  hydrateDurableMonitoringSnapshot,
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
  hydrateNexoraLiveDataRecoverySnapshot,
  listNexoraLiveObservations,
  removeDemoProfileLiveObservations,
  resetLiveDataConnectionStoreForTests,
  saveNexoraLiveConnection,
} from "./liveDataConnectionStore.ts";

const T0 = "2026-08-16T18:00:00.000Z";
const T1 = "2026-08-16T19:00:00.000Z";
const T2 = "2026-08-16T17:00:00.000Z";

function fetcher(): NexoraLiveFetch {
  return async (url) => {
    if (url.includes("/issues?")) {
      return { ok: true, status: 200, json: async () => [{ id: 1, state: "open" }] };
    }
    return {
      ok: true,
      status: 200,
      json: async () => ({ full_name: "nexora/reference", html_url: "https://github.com/nexora/reference", stargazers_count: 1, forks_count: 1, open_issues_count: 1 }),
    };
  };
}

function connection(workspaceId: string, connectionId = "github:profile") {
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

async function commitObservation(workspaceId: string, observationId: string, observedAt: string, connectionId = "github:profile") {
  const live = connection(workspaceId, connectionId);
  saveNexoraLiveConnection(live);
  const prepared = await prepareNexoraLiveObservation({
    connector: createGithubRepositoryConnector(fetcher()),
    connection: live,
    configuration: Object.freeze({ owner: "nexora", repository: "reference" }),
    observationId,
    observedAt,
  });
  const committed = commitNexoraLiveObservation({ connection: live, prepared, committedAt: observedAt });
  assert.equal(committed.committed, true, committed.reason);
  return committed.observation;
}

beforeEach(() => {
  resetWorkspaceRegistryForTests();
  resetDemoProfileForTests();
  resetLiveDataConnectionStoreForTests();
  resetAutomaticMonitoringRuntimeForTests();
});

test("demo observations stay with the profile that created them", async () => {
  openManufacturingDemo();
  const manufacturing = await commitObservation(DEMO_WORKSPACE_ID, "OBS-M", T1);
  assert.equal(manufacturing?.demoProfileId, "manufacturing");
  assert.equal(manufacturing?.observationId, "OBS-M");
  openProjectDemo();
  assert.equal(getActiveWorkspaceId(), DEMO_WORKSPACE_ID);
  assert.equal(readActiveDemoProfile(), "project");
  assert.deepEqual(listNexoraLiveObservations(DEMO_WORKSPACE_ID, "github:profile").map((entry) => entry.observationId), []);
  const project = await commitObservation(DEMO_WORKSPACE_ID, "OBS-P", T2);
  assert.equal(project?.demoProfileId, "project");
  assert.deepEqual(listNexoraLiveObservations(DEMO_WORKSPACE_ID, "github:profile").map((entry) => entry.observationId), ["OBS-P"]);
  const replay = commitNexoraLiveObservation({
    connection: connection(DEMO_WORKSPACE_ID),
    prepared: {
      ...project!,
      observationId: "OBS-M",
      observedAt: T1,
    },
    committedAt: T1,
  });
  assert.equal(replay.committed, false);
  assert.equal(replay.reason, "profile_mismatch");
  assert.equal(replay.observation?.demoProfileId, "manufacturing");
  const stored = exportNexoraLiveDataRecoverySnapshot().observations;
  assert.equal(stored.filter((entry) => entry.observationId === "OBS-M").length, 1);
  openManufacturingDemo();
  assert.deepEqual(
    listNexoraLiveObservations(DEMO_WORKSPACE_ID, "github:profile").map((entry) => entry.demoProfileId),
    ["manufacturing"],
  );
});

test("hydration keeps profile ownership and reset deletes only the active profile", async () => {
  openManufacturingDemo();
  await commitObservation(DEMO_WORKSPACE_ID, "OBS-M", T1);
  openProjectDemo();
  await commitObservation(DEMO_WORKSPACE_ID, "OBS-P", T1);
  const snapshot = exportNexoraLiveDataRecoverySnapshot();
  assert.equal(JSON.parse(JSON.stringify(snapshot)).observations.some((entry: { demoProfileId?: string }) => entry.demoProfileId === "manufacturing"), true);
  const data = new Map<string, string>();
  const storage: NexoraDurableMonitoringStorage = {
    getItem(key) { return data.get(key) ?? null; },
    setItem(key, value) { data.set(key, value); },
    removeItem(key) { data.delete(key); },
  };
  const durable = persistDurableMonitoringRuntime(storage, T1);
  assert.equal(durable.liveData.observations.filter((entry) => entry.demoProfileId === "manufacturing" || entry.demoProfileId === "project").length, 2);
  resetLiveDataConnectionStoreForTests();
  hydrateDurableMonitoringSnapshot(durable, T1);
  openProjectDemo();
  assert.deepEqual(listNexoraLiveObservations(DEMO_WORKSPACE_ID, "github:profile").map((entry) => entry.observationId), ["OBS-P"]);
  resetLiveDataConnectionStoreForTests();
  hydrateNexoraLiveDataRecoverySnapshot(snapshot);
  assert.deepEqual(listNexoraLiveObservations(DEMO_WORKSPACE_ID, "github:profile").map((entry) => entry.observationId), ["OBS-P"]);
  openManufacturingDemo();
  assert.deepEqual(listNexoraLiveObservations(DEMO_WORKSPACE_ID, "github:profile").map((entry) => entry.observationId), ["OBS-M"]);
  assert.deepEqual(removeDemoProfileLiveObservations("manufacturing"), ["OBS-M"]);
  assert.deepEqual(exportNexoraLiveDataRecoverySnapshot().observations.map((entry) => entry.observationId), ["OBS-P"]);
  openProjectDemo();
  assert.equal(resetActiveDemo().status, "reset");
  assert.equal(exportNexoraLiveDataRecoverySnapshot().observations.length, 0);
});

test("legacy demo observations and customer workspaces stay outside profile ownership", async () => {
  const company = createManagerWorkspace({ name: "Clean Company", kind: "BUSINESS" });
  const expansion = createManagerWorkspace({ name: "Factory Expansion", kind: "PROJECT" });
  assert.ok(company && expansion);
  await commitObservation(DEMO_WORKSPACE_ID, "OBS-LEGACY", T0);
  await commitObservation(company.workspaceId, "OBS-COMPANY", T0, "github:company");
  await commitObservation(expansion.workspaceId, "OBS-EXPANSION", T0, "github:expansion");
  const companyPolicy = enableAutomaticMonitoring({
    workspaceId: company.workspaceId,
    connectionId: "github:company",
    targetId: "orders",
    frequency: "daily",
    enabledAt: T0,
  });
  assert.equal(companyPolicy.demoProfileId, undefined);
  assert.equal(listAutomaticMonitoringPolicies(company.workspaceId).length, 1);
  openManufacturingDemo();
  assert.deepEqual(listNexoraLiveObservations(DEMO_WORKSPACE_ID, "github:profile"), []);
  assert.equal(listNexoraLiveObservations(company.workspaceId, "github:company")[0]?.observationId, "OBS-COMPANY");
  assert.equal(listNexoraLiveObservations(company.workspaceId, "github:company")[0]?.demoProfileId, undefined);
  assert.equal(listNexoraLiveObservations(expansion.workspaceId, "github:expansion")[0]?.observationId, "OBS-EXPANSION");
  assert.equal(resetActiveDemo().status, "reset");
  assert.equal(exportNexoraLiveDataRecoverySnapshot().observations.some((entry) => entry.observationId === "OBS-LEGACY"), true);
  assert.equal(exportNexoraLiveDataRecoverySnapshot().observations.some((entry) => entry.observationId === "OBS-COMPANY"), true);
  assert.equal(exportNexoraLiveDataRecoverySnapshot().observations.some((entry) => entry.observationId === "OBS-EXPANSION"), true);
});
