import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import {
  acquireDurableMonitoringLease,
  certifyDurableMonitoringRuntime,
  DURABLE_MONITORING_AUTHORITY_BOUNDARY,
  DURABLE_MONITORING_STORAGE_KEY,
  durableMonitoringRuntimeIdentity,
  durableMonitoringRuntimeModel,
  durableMonitoringRuntimeNamespace,
  durableMonitoringRuntimeVersion,
  persistDurableMonitoringRuntime,
  recoverDurableMonitoringRuntime,
  releaseDurableMonitoringLease,
  resolveDurableMonitoringFreshness,
  type NexoraDurableMonitoringStorage,
} from "./durableMonitoringRuntime.ts";
import {
  enableAutomaticMonitoring,
  disableAutomaticMonitoring,
  evaluateAutomaticMonitoringEligibility,
  getAutomaticMonitoringPolicy,
  getAutomaticMonitoringRuntimeState,
  pauseAutomaticMonitoring,
  resumeAutomaticMonitoring,
  resetAutomaticMonitoringRuntimeForTests,
  runNexoraMonitoringObservation,
  updateAutomaticMonitoringFrequency,
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
  getNexoraLiveConnection,
  listNexoraLiveObservations,
  resetLiveDataConnectionStoreForTests,
  saveNexoraLiveConnection,
} from "./liveDataConnectionStore.ts";
import {
  acknowledgeProactiveAdvisorBrief,
  deliverProactiveAdvisorBrief,
  enqueueProactiveAdvisorBrief,
  listProactiveAdvisorBriefs,
  resetProactiveAdvisorDeliveryForTests,
} from "./proactiveAdvisorDelivery.ts";

const T0 = "2026-08-16T18:00:00.000Z";
const T1 = "2026-08-16T19:00:00.000Z";
const T2 = "2026-08-16T20:00:00.000Z";
const T3 = "2026-08-16T21:00:00.000Z";

class FakeStorage implements NexoraDurableMonitoringStorage {
  readonly data = new Map<string, string>();
  getItem(key: string) { return this.data.get(key) ?? null; }
  setItem(key: string, value: string) { this.data.set(key, value); }
  removeItem(key: string) { this.data.delete(key); }
}

function fetcher(open: number, closed: number): NexoraLiveFetch {
  return async (url) => url.includes("/issues?")
    ? Object.freeze({
      ok: true,
      status: 200,
      json: async () => [
        ...Array.from({ length: open }, (_, index) => ({ id: index + 1, state: "open" })),
        ...Array.from({ length: closed }, (_, index) => ({ id: open + index + 1, state: "closed" })),
      ],
    })
    : Object.freeze({
      ok: true,
      status: 200,
      json: async () => ({
        full_name: "nexora/reference",
        html_url: "https://github.com/nexora/reference",
        stargazers_count: 42,
        forks_count: 7,
        open_issues_count: open,
      }),
    });
}

function connection(workspaceId = "workspace-a") {
  const connector = createGithubRepositoryConnector(fetcher(2, 8));
  return transitionNexoraLiveConnection(createNexoraLiveConnection({
    connectionId: `github:pm5:${workspaceId}`,
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

async function prepared(
  open: number,
  closed: number,
  observationId: string,
  observedAt: string,
  workspaceId = "workspace-a",
) {
  const live = connection(workspaceId);
  return prepareNexoraLiveObservation({
    connector: createGithubRepositoryConnector(fetcher(open, closed)),
    connection: live,
    configuration: Object.freeze({ owner: "nexora", repository: "reference" }),
    observationId,
    observedAt,
  });
}

function failed(value: NexoraLivePreparedObservation, failure: "authorization" | "network") {
  return Object.freeze({
    ...value,
    ready: false as const,
    snapshot: null,
    handoff: null,
    dataReality: null,
    runtime: null,
    advisor: null,
    transportFailure: failure,
    errors: Object.freeze([failure === "authorization" ? "Authorization failed." : "Network unavailable."]),
  });
}

function enabled(workspaceId = "workspace-a") {
  const live = connection(workspaceId);
  saveNexoraLiveConnection(live);
  const policy = enableAutomaticMonitoring({
    workspaceId,
    connectionId: live.connectionId,
    targetId: `pm1:target:${workspaceId}:live:${live.connectionId}`,
    frequency: "hourly",
    enabledAt: T0,
  });
  return { live, policy };
}

function resetRuntime() {
  resetAutomaticMonitoringRuntimeForTests();
  resetLiveDataConnectionStoreForTests();
  resetProactiveAdvisorDeliveryForTests();
}

test.beforeEach(resetRuntime);

test("A/B — identity, truthful model, policy identity, frequency, and safe connection metadata survive restart", () => {
  const storage = new FakeStorage();
  const { live, policy } = enabled();
  updateAutomaticMonitoringFrequency(live.workspaceId, live.connectionId, "daily", T1);
  const snapshot = persistDurableMonitoringRuntime(storage, T1);
  assert.equal(durableMonitoringRuntimeIdentity, "PM:5/NexoraDurableMonitoringRuntime");
  assert.equal(durableMonitoringRuntimeVersion, "1.0.0");
  assert.equal(durableMonitoringRuntimeNamespace, "nexora.proactive-monitoring.durable-runtime");
  assert.equal(durableMonitoringRuntimeModel, "durable-policy+foreground-runner");
  assert.equal(DURABLE_MONITORING_AUTHORITY_BOUNDARY.backgroundExecution, false);
  assert.ok(Object.isFrozen(snapshot));
  resetRuntime();
  const report = recoverDurableMonitoringRuntime(storage, T1);
  const recovered = getAutomaticMonitoringPolicy(live.workspaceId, live.connectionId);
  assert.equal(report.recovered, true);
  assert.equal(recovered?.policyId, policy.policyId);
  assert.equal(recovered?.frequency, "daily");
  assert.equal(getNexoraLiveConnection(live.workspaceId, live.connectionId)?.configurationReference, "github:nexora/reference");
  const raw = storage.getItem(DURABLE_MONITORING_STORAGE_KEY)!;
  assert.doesNotMatch(raw, /Bearer\s|"authorization"\s*:|"accessToken"\s*:|"apiSecret"\s*:/i);
  assert.match(raw, /env:GITHUB_TOKEN/);
});

test("C — pause state survives restart and does not become due", () => {
  const storage = new FakeStorage();
  const { live } = enabled();
  pauseAutomaticMonitoring(live.workspaceId, live.connectionId, T1);
  persistDurableMonitoringRuntime(storage, T1);
  resetRuntime();
  recoverDurableMonitoringRuntime(storage, T2);
  const policy = getAutomaticMonitoringPolicy(live.workspaceId, live.connectionId)!;
  assert.equal(policy.paused, true);
  assert.equal(getAutomaticMonitoringRuntimeState(live.workspaceId, live.connectionId)?.status, "paused");
  assert.equal(evaluateAutomaticMonitoringEligibility({ policy, connection: getNexoraLiveConnection(live.workspaceId, live.connectionId), runtimeState: getAutomaticMonitoringRuntimeState(live.workspaceId, live.connectionId), now: T2 }).reason, "policy-paused");
});

test("B/C — disabled and resumed policy lifecycle survives restart", () => {
  const disabledStorage = new FakeStorage();
  const disabled = enabled();
  disableAutomaticMonitoring(disabled.live.workspaceId, disabled.live.connectionId, T1);
  persistDurableMonitoringRuntime(disabledStorage, T1);
  resetRuntime();
  recoverDurableMonitoringRuntime(disabledStorage, T2);
  assert.equal(getAutomaticMonitoringPolicy(disabled.live.workspaceId, disabled.live.connectionId)?.enabled, false);
  assert.equal(getAutomaticMonitoringRuntimeState(disabled.live.workspaceId, disabled.live.connectionId)?.status, "idle");

  const resumedStorage = new FakeStorage();
  const resumed = enabled();
  pauseAutomaticMonitoring(resumed.live.workspaceId, resumed.live.connectionId, T1);
  resumeAutomaticMonitoring(resumed.live.workspaceId, resumed.live.connectionId, T2);
  persistDurableMonitoringRuntime(resumedStorage, T2);
  resetRuntime();
  recoverDurableMonitoringRuntime(resumedStorage, T3);
  assert.equal(getAutomaticMonitoringPolicy(resumed.live.workspaceId, resumed.live.connectionId)?.paused, false);
  assert.equal(getAutomaticMonitoringRuntimeState(resumed.live.workspaceId, resumed.live.connectionId)?.status, "scheduled");
});

test("D/E/F — interrupted flights recover without a ghost job and storage lease permits one owner", () => {
  const storage = new FakeStorage();
  const { policy } = enabled();
  persistDurableMonitoringRuntime(storage, T0);
  const raw = JSON.parse(storage.getItem(DURABLE_MONITORING_STORAGE_KEY)!) as { runtimeStates: Array<{ status: string }> };
  raw.runtimeStates[0]!.status = "observing";
  storage.setItem(DURABLE_MONITORING_STORAGE_KEY, JSON.stringify(raw));
  resetRuntime();
  const report = recoverDurableMonitoringRuntime(storage, T1);
  assert.equal(report.interruptedFlightCount, 1);
  assert.equal(getAutomaticMonitoringRuntimeState("workspace-a", connection().connectionId)?.status, "scheduled");
  assert.equal(getAutomaticMonitoringRuntimeState("workspace-a", connection().connectionId)?.activeFlightId, null);
  const first = acquireDurableMonitoringLease({ storage, policyId: policy.policyId, ownerId: "runner-a", acquiredAt: T1 });
  const second = acquireDurableMonitoringLease({ storage, policyId: policy.policyId, ownerId: "runner-b", acquiredAt: T1 });
  assert.equal(first.acquired, true);
  assert.equal(second.acquired, false);
  assert.equal(releaseDurableMonitoringLease({ storage, policyId: policy.policyId, ownerId: "runner-a" }), true);
  assert.equal(acquireDurableMonitoringLease({ storage, policyId: policy.policyId, ownerId: "runner-b", acquiredAt: T1 }).acquired, true);
});

test("G/H/I/J — canonical observation continuity survives restart and PM:1 compares A with B", async () => {
  const storage = new FakeStorage();
  const { live, policy } = enabled();
  const first = await runNexoraMonitoringObservation({ trigger: "scheduled", connection: live, policy, observedAt: T0, observe: () => prepared(2, 8, "OBS-A", T0) });
  assert.equal(first.reason, "success");
  persistDurableMonitoringRuntime(storage, T0);
  resetRuntime();
  const report = recoverDurableMonitoringRuntime(storage, T1);
  assert.equal(report.observationCount, 1);
  const recoveredLive = getNexoraLiveConnection(live.workspaceId, live.connectionId)!;
  const recoveredPolicy = getAutomaticMonitoringPolicy(live.workspaceId, live.connectionId)!;
  const second = await runNexoraMonitoringObservation({ trigger: "scheduled", connection: recoveredLive, policy: recoveredPolicy, observedAt: T1, observe: () => prepared(9, 1, "OBS-B", T1) });
  assert.equal(second.reason, "success");
  assert.ok(second.evaluation && second.evaluation.meaningfulChangeCount > 0);
  assert.deepEqual(listNexoraLiveObservations(live.workspaceId, live.connectionId).map((entry) => entry.observationId), ["OBS-A", "OBS-B"]);
});

test("K/L/M — delivered and acknowledged PM:4 fingerprints survive; recovery supersedes safely", async () => {
  const storage = new FakeStorage();
  const { live, policy } = enabled();
  await runNexoraMonitoringObservation({ trigger: "scheduled", connection: live, policy, observedAt: T0, observe: () => prepared(2, 8, "OBS-A", T0) });
  const currentPolicy = getAutomaticMonitoringPolicy(live.workspaceId, live.connectionId)!;
  const changed = await runNexoraMonitoringObservation({ trigger: "manual", connection: live, policy: currentPolicy, observedAt: T1, observe: () => prepared(9, 1, "OBS-B", T1) });
  assert.ok(changed.evaluation);
  const queued = enqueueProactiveAdvisorBrief({ monitoring: changed.evaluation! }).brief!;
  deliverProactiveAdvisorBrief(queued.workspaceId, queued.briefId, T1);
  acknowledgeProactiveAdvisorBrief(queued.workspaceId, queued.briefId, T1);
  persistDurableMonitoringRuntime(storage, T1);
  resetRuntime();
  recoverDurableMonitoringRuntime(storage, T2);
  assert.equal(listProactiveAdvisorBriefs("workspace-a")[0]?.status, "acknowledged");
  assert.equal(enqueueProactiveAdvisorBrief({ monitoring: changed.evaluation! }).reason, "already-delivered");
  const recoveredLive = getNexoraLiveConnection(live.workspaceId, live.connectionId)!;
  const recoveredPolicy = getAutomaticMonitoringPolicy(live.workspaceId, live.connectionId)!;
  const recovered = await runNexoraMonitoringObservation({ trigger: "manual", connection: recoveredLive, policy: recoveredPolicy, observedAt: T2, observe: () => prepared(2, 8, "OBS-C", T2) });
  assert.ok(recovered.evaluation);
  const recovery = enqueueProactiveAdvisorBrief({ monitoring: recovered.evaluation! });
  assert.equal(recovery.brief?.priority, "informational");
});

test("N/O — backoff and authorization-required survive without premature retry", async () => {
  const storage = new FakeStorage();
  const { live, policy } = enabled();
  const valid = await prepared(2, 8, "OBS-X", T0);
  await runNexoraMonitoringObservation({ trigger: "manual", connection: live, policy, observedAt: T0, observe: async () => { throw new Error("network"); } });
  await runNexoraMonitoringObservation({ trigger: "manual", connection: live, policy, observedAt: T0, observe: async () => { throw new Error("network"); } });
  persistDurableMonitoringRuntime(storage, T0);
  resetRuntime();
  recoverDurableMonitoringRuntime(storage, T1);
  const backoffPolicy = getAutomaticMonitoringPolicy(live.workspaceId, live.connectionId)!;
  assert.equal(getAutomaticMonitoringRuntimeState(live.workspaceId, live.connectionId)?.status, "backoff");
  assert.equal(evaluateAutomaticMonitoringEligibility({ policy: backoffPolicy, connection: getNexoraLiveConnection(live.workspaceId, live.connectionId), runtimeState: getAutomaticMonitoringRuntimeState(live.workspaceId, live.connectionId), now: T1 }).reason, "provider-backoff");

  resetRuntime(); storage.removeItem(DURABLE_MONITORING_STORAGE_KEY);
  const authorization = enabled();
  await runNexoraMonitoringObservation({ trigger: "scheduled", connection: authorization.live, policy: authorization.policy, observedAt: T0, observe: async () => failed(valid, "authorization") });
  persistDurableMonitoringRuntime(storage, T0);
  resetRuntime(); recoverDurableMonitoringRuntime(storage, T1);
  assert.equal(getAutomaticMonitoringRuntimeState(authorization.live.workspaceId, authorization.live.connectionId)?.status, "authorization-required");
  assert.equal(getNexoraLiveConnection(authorization.live.workspaceId, authorization.live.connectionId)?.status, "authorization-required");
});

test("P/Q/R/S/T — one catch-up is due, ordering/isolation/truth/freshness remain protected", async () => {
  const storage = new FakeStorage();
  const a = enabled("workspace-a");
  await runNexoraMonitoringObservation({ trigger: "scheduled", connection: a.live, policy: a.policy, observedAt: T0, observe: () => prepared(2, 8, "OBS-A", T0) });
  const b = enabled("workspace-b");
  await runNexoraMonitoringObservation({ trigger: "scheduled", connection: b.live, policy: b.policy, observedAt: T0, observe: () => prepared(2, 8, "OBS-B", T0, "workspace-b") });
  persistDurableMonitoringRuntime(storage, T0);
  resetRuntime();
  const report = recoverDurableMonitoringRuntime(storage, T3);
  assert.equal(report.overduePolicyCount, 2);
  assert.equal(report.staleStateCount, 2);
  assert.equal(listNexoraLiveObservations("workspace-a", a.live.connectionId).length, 1);
  assert.equal(listNexoraLiveObservations("workspace-b", b.live.connectionId).length, 1);
  assert.equal(getNexoraLiveConnection("workspace-a", b.live.connectionId), null);
  assert.equal(resolveDurableMonitoringFreshness({ lastSuccessAt: T0, nextEligibleAt: T1, now: T3 }), "stale");
  assert.equal(DURABLE_MONITORING_AUTHORITY_BOUNDARY.activatesStoredObservation, false);
});

test("U/V — UI wiring and A–V certification preserve truthful foreground semantics", () => {
  const source = readFileSync(new URL("./durableMonitoringRuntime.ts", import.meta.url), "utf8");
  const coordinator = readFileSync(new URL("../../executive/nex-mvp/data/NexoraAutomaticMonitoringCoordinator.tsx", import.meta.url), "utf8");
  const explorer = readFileSync(new URL("../../executive/nex-mvp/data/NexoraExecutiveDataExplorer.tsx", import.meta.url), "utf8");
  for (const forbidden of ["Notification(", "serviceWorker", "webhook", "setInterval(", "executiveMemory", "Authorization:", "Bearer "]) {
    assert.equal(source.includes(forbidden), false, forbidden);
  }
  for (const evidence of ["recoverDurableMonitoringRuntime", "acquireDurableMonitoringLease", "persistDurableMonitoringRuntime", "startNexoraForegroundMonitoringRuntime"]) assert.ok(coordinator.includes(evidence), evidence);
  assert.ok(explorer.includes("Monitoring resumes when Nexora is open"));
  const gates = Object.freeze(Object.fromEntries("ABCDEFGHIJKLMNOPQRSTUV".split("").map((gate) => [gate, true]))) as Readonly<Record<"A"|"B"|"C"|"D"|"E"|"F"|"G"|"H"|"I"|"J"|"K"|"L"|"M"|"N"|"O"|"P"|"Q"|"R"|"S"|"T"|"U"|"V", boolean>>;
  const certification = certifyDurableMonitoringRuntime(gates);
  assert.equal(certification.certified, true);
  assert.equal(certification.runtimeModel, "durable-policy+foreground-runner");
  assert.equal(certification.passedGateCount, 22);
});
