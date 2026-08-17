import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import { projectExecutiveSourceIntelligence, compareExecutiveSources, type ExecutiveSourceProjectionInput } from "./executiveSourceIntelligence.ts";
import {
  LIVE_CONNECTION_STATES, LIVE_DATA_CONNECTOR_AUTHORITY_BOUNDARY,
  certifyLiveDataConnectorFoundation, createGithubRepositoryConnector,
  createMockLiveConnector, createNexoraLiveConnection, liveDataConnectorFoundationIdentity,
  liveDataConnectorFoundationNamespace, liveDataConnectorFoundationVersion,
  prepareNexoraLiveObservation, transitionNexoraLiveConnection,
  type NexoraLiveCommittedObservation, type NexoraLiveFetch,
} from "./liveDataConnectorFoundation.ts";
import { commitNexoraLiveObservation, disconnectNexoraLiveConnection, listNexoraLiveObservations, resetLiveDataConnectionStoreForTests, saveNexoraLiveConnection } from "./liveDataConnectionStore.ts";

const NOW = "2026-08-16T18:00:00.000Z";
function fetcher(open: number, closed: number, capturedHeaders: HeadersInit[] = []): NexoraLiveFetch {
  return async (url, init) => {
    capturedHeaders.push(init?.headers ?? {});
    if (url.includes("/issues?")) return { ok: true, status: 200, json: async () => [...Array.from({ length: open }, (_, index) => ({ id: index + 1, state: "open" })), ...Array.from({ length: closed }, (_, index) => ({ id: open + index + 1, state: "closed" })), { id: 999, state: "open", pull_request: {} }] };
    return { ok: true, status: 200, json: async () => ({ full_name: "nexora/reference", html_url: "https://github.com/nexora/reference", stargazers_count: 42, forks_count: 7, open_issues_count: open }) };
  };
}
function connection(workspaceId = "workspace-a") {
  const connector = createGithubRepositoryConnector(fetcher(2, 8));
  return transitionNexoraLiveConnection(createNexoraLiveConnection({ connectionId: "github:reference", workspaceId, providerId: "github", providerType: "source-control", displayName: "Engineering Source", capabilities: connector.capabilities(), createdAt: NOW, configurationReference: "github:nexora/reference", credentialReference: "env:GITHUB_TOKEN" }), "connected", NOW);
}
async function prepared(open = 2, closed = 8, observationId = "OBS-1", workspaceId = "workspace-a") {
  return prepareNexoraLiveObservation({ connector: createGithubRepositoryConnector(fetcher(open, closed)), connection: connection(workspaceId), configuration: Object.freeze({ owner: "nexora", repository: "reference" }), observationId, observedAt: NOW });
}
function projection(observation: NexoraLiveCommittedObservation): ExecutiveSourceProjectionInput { return Object.freeze({ workspaceId: observation.workspaceId, sourceContextId: observation.sourceContextId, sourceLabel: observation.sourceLabel, committedAt: observation.committedAt, recordCount: observation.recordCount, mappingId: observation.mappingId, snapshot: observation.snapshot, handoff: observation.handoff, dataReality: observation.dataReality }); }

test("publishes canonical RDI:4 identity, states, and authority separation", () => {
  assert.equal(liveDataConnectorFoundationIdentity, "RDI:4/NexoraLiveDataConnectorFoundation");
  assert.equal(liveDataConnectorFoundationVersion, "1.0.0");
  assert.equal(liveDataConnectorFoundationNamespace, "nexora.real-data-integration.live-connector-foundation");
  assert.deepEqual(LIVE_CONNECTION_STATES, ["disconnected", "connecting", "connected", "degraded", "authorization-required", "error", "disabled"]);
  assert.equal(LIVE_DATA_CONNECTOR_AUTHORITY_BOUNDARY.ownsBusinessState, false);
  assert.equal(LIVE_DATA_CONNECTOR_AUTHORITY_BOUNDARY.automaticObservation, false);
});

test("A/B/D — connection identity is stable and provider lifecycle is deterministic", async () => {
  const value = connection(); const connector = createGithubRepositoryConnector(fetcher(2, 8));
  assert.equal(value.workspaceId, "workspace-a"); assert.equal(value.status, "connected");
  assert.deepEqual(connector.capabilities(), ["manual-fetch", "refresh", "health-check"]);
  assert.equal((await connector.testConnection(value, { owner: "nexora", repository: "reference" })).state, "connected");
});

test("B — reference and mock connectors produce the same canonical observation contract", async () => {
  const real = createGithubRepositoryConnector(fetcher(2, 8)); const live = connection();
  const observed = await real.observe({ connection: live, configuration: { owner: "nexora", repository: "reference" }, observationId: "OBS-PROVIDER", observedAt: NOW });
  assert.ok(observed.snapshot);
  const mock = createMockLiveConnector(() => observed.snapshot!, real.mapper.bind(real));
  const result = await prepareNexoraLiveObservation({ connector: mock, connection: live, configuration: {}, observationId: "OBS-MOCK", observedAt: NOW });
  assert.equal(result.ready, true); assert.equal(result.snapshot?.deterministic, true); assert.equal(result.handoff?.dataset.source, "api");
  assert.deepEqual(result.handoff?.dataset.records.map((item) => [item.objectKey, item.metricKey]), (await prepared()).handoff?.dataset.records.map((item) => [item.objectKey, item.metricKey]));
});

test("C — server credential is used only in transport headers and never enters evidence", async () => {
  const headers: HeadersInit[] = []; const connector = createGithubRepositoryConnector(fetcher(2, 8, headers), "super-secret-token");
  const result = await prepareNexoraLiveObservation({ connector, connection: connection(), configuration: { owner: "nexora", repository: "reference" }, observationId: "OBS-SECRET", observedAt: NOW });
  assert.equal(result.ready, true); assert.match(JSON.stringify(headers), /super-secret-token/); assert.doesNotMatch(JSON.stringify(result), /super-secret-token/);
  assert.doesNotMatch(JSON.stringify(result.snapshot?.source), /credential|token|secret/i);
});

test("E/F/G/H — real-shaped GitHub response becomes immutable validated RDI:1 evidence with provenance", async () => {
  const result = await prepared(); assert.equal(result.ready, true); assert.ok(result.snapshot);
  assert.equal(result.snapshot.validation.state, "valid"); assert.equal(Object.isFrozen(result.snapshot), true);
  assert.equal(result.snapshot.source.identity.providerName, "github"); assert.equal(result.snapshot.records[0]?.recordId, "nexora/reference");
  const trace = result.handoff?.factProvenance.find((item) => item.metricKey === "usedCapacity")?.provenance;
  assert.equal(trace?.sourceFieldKey, "recent_open_issues"); assert.match(trace?.transformationRef ?? "", /github-repository-health/);
});

test("I/J/K — live mapping uses existing Data Reality and only its validated output reaches Runtime", async () => {
  const result = await prepared(2, 8); assert.equal(result.ready, true);
  assert.equal(result.handoff?.dataset.source, "api"); assert.equal(result.handoff?.dataset.records.length, 4);
  assert.deepEqual(result.dataReality?.objectStates.map((item) => item.objectKey).sort(), ["customer", "production"]);
  assert.equal(result.runtime?.status, "projected");
});

test("L — failed refresh cannot replace the last committed observation", async () => {
  resetLiveDataConnectionStoreForTests(); const live = connection(); saveNexoraLiveConnection(live);
  const valid = await prepared(); const committed = commitNexoraLiveObservation({ connection: live, prepared: valid, committedAt: NOW }); assert.equal(committed.committed, true);
  const failed = Object.freeze({ ...valid, ready: false, snapshot: null, handoff: null, dataReality: null, runtime: null, advisor: null, errors: Object.freeze(["provider unavailable"]) });
  assert.equal(commitNexoraLiveObservation({ connection: live, prepared: failed, committedAt: NOW }).committed, false);
  assert.equal(listNexoraLiveObservations("workspace-a", live.connectionId).length, 1);
});

test("M/N — committed live observations reuse RDI:3 intelligence and comparison", async () => {
  resetLiveDataConnectionStoreForTests(); const live = connection(); saveNexoraLiveConnection(live);
  const first = commitNexoraLiveObservation({ connection: live, prepared: await prepared(2, 8, "OBS-1"), committedAt: NOW }).observation!;
  const second = commitNexoraLiveObservation({ connection: live, prepared: await prepared(9, 1, "OBS-2"), committedAt: "2026-08-16T19:00:00.000Z" }).observation!;
  const intelligence = projectExecutiveSourceIntelligence(projection(second)); const comparison = compareExecutiveSources(projection(first), projection(second));
  assert.equal(intelligence.sourceLabel, "Engineering Source"); assert.equal(intelligence.overallState, "critical");
  assert.equal(comparison.readiness, "compatible"); assert.ok(comparison.metricDeltas.length >= 2);
});

test("O/P/Q — connected, selected, active, disconnect, and workspace ownership stay separate", async () => {
  resetLiveDataConnectionStoreForTests(); const live = connection(); saveNexoraLiveConnection(live);
  assert.equal(listNexoraLiveObservations("workspace-a", live.connectionId).length, 0);
  assert.equal(disconnectNexoraLiveConnection({ workspaceId: "workspace-a", connectionId: live.connectionId, activeSourceContextId: `live:${live.connectionId}`, disconnectedAt: NOW }).reason, "active_source");
  assert.equal(disconnectNexoraLiveConnection({ workspaceId: "workspace-b", connectionId: live.connectionId, activeSourceContextId: null, disconnectedAt: NOW }).reason, "not_found");
  assert.equal((await prepared(2, 8, "OBS-X", "workspace-b")).workspaceId, "workspace-b");
});

test("R — UI integrates one implemented provider without monitoring infrastructure", () => {
  const explorer = readFileSync(new URL("../../executive/nex-mvp/data/NexoraExecutiveDataExplorer.tsx", import.meta.url), "utf8");
  const route = readFileSync(new URL("../../api/rdi/live/github/route.ts", import.meta.url), "utf8");
  const combined = `${explorer}\n${route}`;
  assert.match(combined, /Connect Source/); assert.match(combined, /Refresh/); assert.match(combined, /Use as Active Source/);
  assert.doesNotMatch(combined, /setInterval|setTimeout|cron|webhook|Notification\(|serviceWorker/);
});

test("A–R certification reports 18/18", () => {
  const evidence = Object.fromEntries("ABCDEFGHIJKLMNOPQR".split("").map((gate) => [gate, true])) as Record<"A"|"B"|"C"|"D"|"E"|"F"|"G"|"H"|"I"|"J"|"K"|"L"|"M"|"N"|"O"|"P"|"Q"|"R", boolean>;
  const result = certifyLiveDataConnectorFoundation(evidence); assert.equal(result.certified, true); assert.equal(result.passedGateCount, 18);
});
