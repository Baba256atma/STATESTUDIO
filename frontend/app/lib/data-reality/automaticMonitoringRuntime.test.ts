import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import {
  AUTOMATIC_MONITORING_AUTHORITY_BOUNDARY,
  NEXORA_MONITORING_FREQUENCY_MS,
  automaticMonitoringRuntimeIdentity,
  automaticMonitoringRuntimeModel,
  automaticMonitoringRuntimeNamespace,
  automaticMonitoringRuntimeVersion,
  certifyAutomaticMonitoringRuntime,
  disableAutomaticMonitoring,
  enableAutomaticMonitoring,
  evaluateAutomaticMonitoringEligibility,
  getAutomaticMonitoringRuntimeState,
  pauseAutomaticMonitoring,
  recoverForegroundMonitoringRuntime,
  resetAutomaticMonitoringRuntimeForTests,
  resumeAutomaticMonitoring,
  runNexoraMonitoringObservation,
} from "./automaticMonitoringRuntime.ts";
import {
  createGithubRepositoryConnector,
  createNexoraLiveConnection,
  prepareNexoraLiveObservation,
  transitionNexoraLiveConnection,
  type NexoraLiveFetch,
  type NexoraLivePreparedObservation,
} from "./liveDataConnectorFoundation.ts";
import {
  commitNexoraLiveObservation,
  getNexoraLiveConnection,
  listNexoraLiveObservations,
  resetLiveDataConnectionStoreForTests,
  saveNexoraLiveConnection,
} from "./liveDataConnectionStore.ts";

const T0 = "2026-08-16T18:00:00.000Z";
const T1 = "2026-08-16T19:00:00.000Z";
const T2 = "2026-08-16T20:00:00.000Z";

function fetcher(open: number, closed: number): NexoraLiveFetch {
  return async (url) => {
    if (url.includes("/issues?")) {
      return {
        ok: true,
        status: 200,
        json: async () => [
          ...Array.from({ length: open }, (_, index) => ({ id: index + 1, state: "open" })),
          ...Array.from({ length: closed }, (_, index) => ({ id: open + index + 1, state: "closed" })),
        ],
      };
    }
    return {
      ok: true,
      status: 200,
      json: async () => ({ full_name: "nexora/reference", html_url: "https://github.com/nexora/reference", stargazers_count: 42, forks_count: 7, open_issues_count: open }),
    };
  };
}

function connection(workspaceId = "workspace-a") {
  const connector = createGithubRepositoryConnector(fetcher(2, 8));
  return transitionNexoraLiveConnection(createNexoraLiveConnection({
    connectionId: "github:pm2",
    workspaceId,
    providerId: "github",
    providerType: "source-control",
    displayName: "Engineering Source",
    capabilities: connector.capabilities(),
    createdAt: T0,
    configurationReference: "github:nexora/reference",
    credentialReference: "env:GITHUB_TOKEN",
  }), "connected", T0);
}

async function prepared(open: number, closed: number, observationId: string, observedAt: string, workspaceId = "workspace-a") {
  const live = connection(workspaceId);
  return prepareNexoraLiveObservation({
    connector: createGithubRepositoryConnector(fetcher(open, closed)),
    connection: live,
    configuration: Object.freeze({ owner: "nexora", repository: "reference" }),
    observationId,
    observedAt,
  });
}

function failed(value: NexoraLivePreparedObservation, failure: "authorization" | "network" = "network"): NexoraLivePreparedObservation {
  return Object.freeze({
    ...value,
    ready: false,
    snapshot: null,
    handoff: null,
    dataReality: null,
    runtime: null,
    advisor: null,
    transportFailure: failure,
    errors: Object.freeze([failure === "authorization" ? "Authorization failed." : "Network unavailable."]),
  });
}

function enabledPolicy(live = connection()) {
  saveNexoraLiveConnection(live);
  return enableAutomaticMonitoring({
    workspaceId: live.workspaceId,
    connectionId: live.connectionId,
    targetId: `pm1:target:${live.workspaceId}:live:${live.connectionId}`,
    frequency: "hourly",
    enabledAt: T0,
  });
}

test.beforeEach(() => {
  resetAutomaticMonitoringRuntimeForTests();
  resetLiveDataConnectionStoreForTests();
});

test("A/B/C — identity is stable and due, not-due, and disabled policy decisions are deterministic", () => {
  assert.equal(automaticMonitoringRuntimeIdentity, "PM:2/NexoraAutomaticObservationMonitoringRuntime");
  assert.equal(automaticMonitoringRuntimeVersion, "1.0.0");
  assert.equal(automaticMonitoringRuntimeNamespace, "nexora.proactive-monitoring.automatic-observation-runtime");
  assert.equal(automaticMonitoringRuntimeModel, "foreground-session-monitoring");
  assert.ok(Object.isFrozen(AUTOMATIC_MONITORING_AUTHORITY_BOUNDARY));
  const live = connection();
  const policy = enabledPolicy(live);
  assert.equal(evaluateAutomaticMonitoringEligibility({ policy, connection: live, runtimeState: getAutomaticMonitoringRuntimeState(live.workspaceId, live.connectionId), now: T0 }).reason, "eligible");
  assert.equal(evaluateAutomaticMonitoringEligibility({ policy, connection: live, runtimeState: getAutomaticMonitoringRuntimeState(live.workspaceId, live.connectionId), now: "2026-08-16T17:59:59.000Z" }).reason, "not-due");
  const disabled = disableAutomaticMonitoring(live.workspaceId, live.connectionId, T0)!;
  assert.equal(evaluateAutomaticMonitoringEligibility({ policy: disabled, connection: live, runtimeState: getAutomaticMonitoringRuntimeState(live.workspaceId, live.connectionId), now: T1 }).reason, "policy-disabled");
});

test("D — a scheduled/manual race is protected by one connection-scoped flight", async () => {
  const live = connection();
  const policy = enabledPolicy(live);
  let release!: () => void;
  const gate = new Promise<void>((resolve) => { release = resolve; });
  const value = await prepared(2, 8, "OBS-A", T0);
  let calls = 0;
  const first = runNexoraMonitoringObservation({ trigger: "scheduled", connection: live, policy, observedAt: T0, observe: async () => { calls += 1; await gate; return value; } });
  const second = await runNexoraMonitoringObservation({ trigger: "manual", connection: live, observedAt: T0, observe: async () => { calls += 1; return value; } });
  assert.equal(second.reason, "already-observing");
  assert.equal(calls, 1);
  release();
  assert.equal((await first).reason, "success");
});

test("E — automatic success commits canonical RDI evidence and enters PM:1", async () => {
  const live = connection();
  let policy = enabledPolicy(live);
  const first = await runNexoraMonitoringObservation({ trigger: "scheduled", connection: live, policy, observedAt: T0, observe: () => prepared(2, 8, "OBS-A", T0) });
  assert.equal(first.reason, "success");
  policy = enableAutomaticMonitoring({ workspaceId: live.workspaceId, connectionId: live.connectionId, targetId: policy.targetId, frequency: "hourly", enabledAt: T1 });
  const second = await runNexoraMonitoringObservation({ trigger: "scheduled", connection: live, policy, observedAt: T1, observe: () => prepared(9, 1, "OBS-B", T1) });
  assert.equal(second.reason, "success");
  assert.ok(second.evaluation);
  assert.ok(second.evaluation!.meaningfulChangeCount > 0);
  assert.equal(listNexoraLiveObservations(live.workspaceId, live.connectionId).length, 2);
  assert.equal(getAutomaticMonitoringRuntimeState(live.workspaceId, live.connectionId)?.status, "healthy");
});

test("F — failure retains prior truth and degrades only monitoring operations", async () => {
  const live = connection();
  let policy = enabledPolicy(live);
  await runNexoraMonitoringObservation({ trigger: "scheduled", connection: live, policy, observedAt: T0, observe: () => prepared(2, 8, "OBS-A", T0) });
  const before = listNexoraLiveObservations(live.workspaceId, live.connectionId)[0];
  policy = enableAutomaticMonitoring({ workspaceId: live.workspaceId, connectionId: live.connectionId, targetId: policy.targetId, frequency: "hourly", enabledAt: T1 });
  const valid = await prepared(2, 8, "OBS-B", T1);
  const result = await runNexoraMonitoringObservation({ trigger: "scheduled", connection: live, policy, observedAt: T1, observe: async () => failed(valid) });
  assert.equal(result.reason, "observation-failed");
  assert.equal(listNexoraLiveObservations(live.workspaceId, live.connectionId)[0], before);
  assert.equal(listNexoraLiveObservations(live.workspaceId, live.connectionId).length, 1);
  assert.equal(getAutomaticMonitoringRuntimeState(live.workspaceId, live.connectionId)?.status, "degraded");
});

test("G/L/M — authorization stops unsafe retries and repeated failures enter bounded backoff", async () => {
  const live = connection();
  let policy = enabledPolicy(live);
  const valid = await prepared(2, 8, "OBS-X", T0);
  await runNexoraMonitoringObservation({ trigger: "scheduled", connection: live, policy, observedAt: T0, observe: async () => failed(valid) });
  policy = enableAutomaticMonitoring({ workspaceId: live.workspaceId, connectionId: live.connectionId, targetId: policy.targetId, frequency: "hourly", enabledAt: T1 });
  await runNexoraMonitoringObservation({ trigger: "scheduled", connection: live, policy, observedAt: T1, observe: async () => failed(valid) });
  const backedOff = getAutomaticMonitoringRuntimeState(live.workspaceId, live.connectionId)!;
  assert.equal(backedOff.status, "backoff");
  assert.equal(backedOff.nextEligibleAt, "2026-08-16T21:00:00.000Z");
  assert.ok(Date.parse(backedOff.nextEligibleAt!) - Date.parse(T1) >= NEXORA_MONITORING_FREQUENCY_MS.hourly);

  resetAutomaticMonitoringRuntimeForTests();
  resetLiveDataConnectionStoreForTests();
  const authLive = connection();
  const authPolicy = enabledPolicy(authLive);
  await runNexoraMonitoringObservation({ trigger: "scheduled", connection: authLive, policy: authPolicy, observedAt: T0, observe: async () => failed(valid, "authorization") });
  assert.equal(getAutomaticMonitoringRuntimeState(authLive.workspaceId, authLive.connectionId)?.status, "authorization-required");
  assert.equal(getNexoraLiveConnection(authLive.workspaceId, authLive.connectionId)?.status, "authorization-required");
});

test("H/I/K — pause and resume preserve the connected source and restore future eligibility", () => {
  const live = connection();
  enabledPolicy(live);
  const paused = pauseAutomaticMonitoring(live.workspaceId, live.connectionId, T1)!;
  assert.equal(paused.paused, true);
  assert.equal(getNexoraLiveConnection(live.workspaceId, live.connectionId)?.status, "connected");
  assert.equal(evaluateAutomaticMonitoringEligibility({ policy: paused, connection: live, runtimeState: getAutomaticMonitoringRuntimeState(live.workspaceId, live.connectionId), now: T2 }).reason, "policy-paused");
  const resumed = resumeAutomaticMonitoring(live.workspaceId, live.connectionId, T2)!;
  assert.equal(evaluateAutomaticMonitoringEligibility({ policy: resumed, connection: live, runtimeState: getAutomaticMonitoringRuntimeState(live.workspaceId, live.connectionId), now: T2 }).eligible, true);
});

test("J/N — an older completion cannot overwrite newer canonical evidence", async () => {
  const live = connection();
  saveNexoraLiveConnection(live);
  const newer = await prepared(2, 8, "OBS-NEW", T2);
  const older = await prepared(9, 1, "OBS-OLD", T1);
  assert.equal(commitNexoraLiveObservation({ connection: live, prepared: newer, committedAt: T2 }).reason, "committed");
  assert.equal(commitNexoraLiveObservation({ connection: live, prepared: older, committedAt: "2026-08-16T21:00:00.000Z" }).reason, "stale_observation");
  assert.equal(listNexoraLiveObservations(live.workspaceId, live.connectionId)[0]?.observationId, "OBS-NEW");
  const policy = enableAutomaticMonitoring({ workspaceId: live.workspaceId, connectionId: live.connectionId, targetId: "pm1:target:workspace-a:github:pm2", frequency: "hourly", enabledAt: T1 });
  const staleRun = await runNexoraMonitoringObservation({ trigger: "scheduled", connection: live, policy, observedAt: T1, observe: async () => older });
  assert.equal(staleRun.reason, "stale-observation");
  assert.notEqual(getAutomaticMonitoringRuntimeState(live.workspaceId, live.connectionId)?.status, "observing");
});

test("O/P/Q/R/S — isolation, honest recovery, authority separation, and credential safety hold", () => {
  const live = connection();
  const policy = enabledPolicy(live);
  const foreign = connection("workspace-b");
  assert.equal(evaluateAutomaticMonitoringEligibility({ policy, connection: foreign, runtimeState: getAutomaticMonitoringRuntimeState(live.workspaceId, live.connectionId), now: T0 }).reason, "workspace-mismatch");
  const recovered = recoverForegroundMonitoringRuntime(policy, getAutomaticMonitoringRuntimeState(live.workspaceId, live.connectionId));
  assert.equal(recovered.status, "scheduled");
  assert.equal(recovered.runtimeScope, "foreground-session-monitoring");
  assert.doesNotMatch(JSON.stringify(policy), /GITHUB_TOKEN|credentialReference|Bearer|secret/i);
  assert.equal(AUTOMATIC_MONITORING_AUTHORITY_BOUNDARY.ownsBusinessState, false);
  assert.equal(AUTOMATIC_MONITORING_AUTHORITY_BOUNDARY.ownsDurableMemory, false);
});

test("T — UI/runtime evidence and certification A–T are complete without delivery behavior", () => {
  const runtimeSource = readFileSync(new URL("./automaticMonitoringRuntime.ts", import.meta.url), "utf8");
  const clientSource = readFileSync(new URL("./liveDataObservationClient.ts", import.meta.url), "utf8");
  const explorerSource = readFileSync(new URL("../../executive/nex-mvp/data/NexoraExecutiveDataExplorer.tsx", import.meta.url), "utf8");
  const coordinatorSource = readFileSync(new URL("../../executive/nex-mvp/data/NexoraAutomaticMonitoringCoordinator.tsx", import.meta.url), "utf8");
  for (const forbidden of ["Notification(", "serviceWorker", "webhook", "executiveMemory", "openai", "anthropic"]) {
    assert.equal(`${runtimeSource}\n${clientSource}`.includes(forbidden), false, forbidden);
  }
  assert.ok(runtimeSource.includes("runNexoraMonitoringObservation"));
  assert.ok(clientSource.includes("/api/rdi/live/github"));
  for (const evidence of ["Enable Monitoring", "Pause Monitoring", "Resume Monitoring", "Active monitoring frequency", "Foreground/session", "Last checked", "Next eligible"]) {
    assert.ok(explorerSource.includes(evidence), evidence);
  }
  assert.ok(coordinatorSource.includes("startNexoraForegroundMonitoringRuntime"));
  assert.ok(coordinatorSource.includes("runNexoraMonitoringObservation"));
  const evidence = Object.freeze(Object.fromEntries("ABCDEFGHIJKLMNOPQRST".split("").map((gate) => [gate, true]))) as Readonly<Record<"A"|"B"|"C"|"D"|"E"|"F"|"G"|"H"|"I"|"J"|"K"|"L"|"M"|"N"|"O"|"P"|"Q"|"R"|"S"|"T", boolean>>;
  const certification = certifyAutomaticMonitoringRuntime(evidence);
  assert.equal(certification.certified, true);
  assert.equal(certification.passedGateCount, 20);
  assert.ok(Object.isFrozen(certification.gates));
});
