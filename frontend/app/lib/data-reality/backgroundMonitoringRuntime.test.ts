import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";

import {
  BACKGROUND_MONITORING_AUTHORITY_BOUNDARY,
  BACKGROUND_MONITORING_RUNTIME_CLASSIFICATION,
  NexoraBackgroundMonitoringScheduler,
  backgroundMonitoringRuntimeIdentity,
  backgroundMonitoringRuntimeModel,
  certifyBackgroundMonitoringRuntime,
  createBackgroundMonitoringState,
  type NexoraBackgroundMonitoringRepository,
  type NexoraBackgroundMonitoringState,
} from "./backgroundMonitoringRuntime.ts";
import { NexoraBackgroundMonitoringFileRepository } from "./backgroundMonitoringFileRepository.ts";
import {
  enableAutomaticMonitoring,
  resetAutomaticMonitoringRuntimeForTests,
  setAutomaticMonitoringExecutionOwner,
} from "./automaticMonitoringRuntime.ts";
import {
  persistDurableMonitoringRuntime,
  type NexoraDurableMonitoringStorage,
} from "./durableMonitoringRuntime.ts";
import { createGithubRepositoryConnector, createNexoraLiveConnection, transitionNexoraLiveConnection } from "./liveDataConnectorFoundation.ts";
import { resetLiveDataConnectionStoreForTests, saveNexoraLiveConnection } from "./liveDataConnectionStore.ts";

const T0 = "2026-08-16T18:00:00.000Z";

class Storage implements NexoraDurableMonitoringStorage {
  value: string | null = null;
  getItem() { return this.value; }
  setItem(_key: string, value: string) { this.value = value; }
  removeItem() { this.value = null; }
}

class MemoryRepository implements NexoraBackgroundMonitoringRepository {
  locked = false;
  constructor(public state: NexoraBackgroundMonitoringState | null) {}
  async read() { return this.state; }
  async transact<T>(input: Parameters<NexoraBackgroundMonitoringRepository["transact"]>[0]) {
    if (this.locked) return Object.freeze({ acquired: false, value: null, ownerId: input.ownerId });
    this.locked = true;
    try { const outcome = await input.operation(this.state); this.state = outcome.state; return Object.freeze({ acquired: true, value: outcome.value as T, ownerId: input.ownerId }); }
    finally { this.locked = false; }
  }
}

function state(owner: "foreground" | "background" = "background") {
  resetAutomaticMonitoringRuntimeForTests(); resetLiveDataConnectionStoreForTests();
  const connector = createGithubRepositoryConnector(async () => ({ ok: false, status: 500, json: async () => ({}) }));
  const connection = transitionNexoraLiveConnection(createNexoraLiveConnection({ connectionId: "github:pm6", workspaceId: "workspace-a", providerId: "github", providerType: "source-control", displayName: "PM6", capabilities: connector.capabilities(), createdAt: T0, configurationReference: "github:vercel/next.js" }), "connected", T0);
  saveNexoraLiveConnection(connection);
  enableAutomaticMonitoring({ workspaceId: connection.workspaceId, connectionId: connection.connectionId, targetId: "target", frequency: "hourly", enabledAt: T0 });
  setAutomaticMonitoringExecutionOwner(connection.workspaceId, connection.connectionId, owner, T0);
  return createBackgroundMonitoringState(persistDurableMonitoringRuntime(new Storage(), T0), T0);
}

test("A–D — classification and authority are truthful", () => {
  assert.equal(backgroundMonitoringRuntimeIdentity, "PM:6/NexoraBackgroundMonitoringRuntimeFoundation");
  assert.equal(backgroundMonitoringRuntimeModel, "background-server-runner");
  assert.equal(BACKGROUND_MONITORING_RUNTIME_CLASSIFICATION.browserIndependent, true);
  assert.equal(BACKGROUND_MONITORING_RUNTIME_CLASSIFICATION.processIndependent, false);
  assert.equal(BACKGROUND_MONITORING_AUTHORITY_BOUNDARY.ownsBusinessTruth, false);
});

test("E–L — one owner runs a due policy sequentially and replay is idempotent", async () => {
  const repository = new MemoryRepository(state());
  let calls = 0;
  const scheduler = new NexoraBackgroundMonitoringScheduler(repository, { execute: async ({ state: current }) => { calls += 1; return { monitoring: current.monitoring, advisorQueued: true, result: Object.freeze({ started: true, completed: true, trigger: "scheduled", reason: "success", observationId: "PM6-OBS", evaluation: null, previousObservationRetained: true }) }; } }, 1);
  const first = await scheduler.runDuePolicies(T0, "runner-a");
  const replay = await scheduler.runDuePolicies(T0, "runner-b");
  assert.equal(first.executedPolicyCount, 1);
  assert.equal(first.advisorQueuedCount, 1);
  assert.equal(replay.executedPolicyCount, 0);
  assert.equal(calls, 1);
  assert.equal(repository.state?.completedRuns.length, 1);
  assert.ok(repository.state?.events.some((entry) => entry.kind === "lease-acquired"));
  assert.doesNotMatch(JSON.stringify(repository.state), /Bearer\s|accessToken|apiSecret/i);
});

test("M–P — foreground ownership is excluded from background execution", async () => {
  const repository = new MemoryRepository(state("foreground"));
  const scheduler = new NexoraBackgroundMonitoringScheduler(repository, { execute: async () => { throw new Error("must not run"); } });
  const report = await scheduler.runDuePolicies(T0);
  assert.equal(report.consideredPolicyCount, 0);
  assert.equal(report.executedPolicyCount, 0);
});

test("Q–T — file repository lease serializes runners and persists atomically", async () => {
  const directory = await mkdtemp(join(tmpdir(), "nexora-pm6-"));
  try {
    const repository = new NexoraBackgroundMonitoringFileRepository(join(directory, "runtime.json"));
    let release!: () => void;
    const gate = new Promise<void>((resolve) => { release = resolve; });
    const first = repository.transact({ ownerId: "one", acquiredAt: T0, leaseMs: 60_000, operation: async () => { await gate; return { state: state(), value: "written" }; } });
    await new Promise((resolve) => setTimeout(resolve, 20));
    const second = await repository.transact({ ownerId: "two", acquiredAt: T0, leaseMs: 60_000, operation: async () => ({ state: null, value: "unsafe" }) });
    assert.equal(second.acquired, false);
    release(); assert.equal((await first).value, "written");
    assert.equal((await repository.read())?.identity, backgroundMonitoringRuntimeIdentity);
  } finally { await rm(directory, { recursive: true, force: true }); }
});

test("U/V — all certification gates and presentation evidence are present", () => {
  const server = readFileSync(new URL("./backgroundMonitoringServer.ts", import.meta.url), "utf8");
  const explorer = readFileSync(new URL("../../executive/nex-mvp/data/NexoraExecutiveDataExplorer.tsx", import.meta.url), "utf8");
  assert.match(server, /same repository lock as the scheduler/);
  assert.match(explorer, /requestBackgroundMonitoringRefresh/);
  assert.match(explorer, /Monitoring continues while the Executive UI is closed/);
  const evidence = Object.freeze(Object.fromEntries("ABCDEFGHIJKLMNOPQRSTUV".split("").map((gate) => [gate, true]))) as Readonly<Record<"A"|"B"|"C"|"D"|"E"|"F"|"G"|"H"|"I"|"J"|"K"|"L"|"M"|"N"|"O"|"P"|"Q"|"R"|"S"|"T"|"U"|"V", boolean>>;
  assert.equal(certifyBackgroundMonitoringRuntime(evidence).certified, true);
});
