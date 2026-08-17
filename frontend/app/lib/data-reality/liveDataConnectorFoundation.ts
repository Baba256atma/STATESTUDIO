/**
 * RDI:4 — provider-independent live observation boundary.
 *
 * A connector may observe external facts. Only the existing RDI:1 mapping,
 * Data Reality, and Runtime projection chain may turn those facts into current
 * executive truth. No scheduling or autonomous activation lives here.
 */
import type { WorkspaceId } from "../workspace/workspaceRegistryContract.ts";
import {
  adaptNexoraDataSource,
  createNexoraDataRealityHandoff,
  type NexoraDataRealityFactProvenance,
  type NexoraDataRealityHandoff,
  type NexoraDataRealityMapper,
  type NexoraDataSource,
  type NexoraDataSourceAdapter,
  type NexoraDataSourceProvenance,
  type NexoraDataSourceSnapshot,
  type NexoraSourceRecord,
} from "./realDataIntegrationFoundation.ts";
import type { NexoraDataset, NexoraDatasetRecord } from "./dataRealityContracts.ts";
import { resolveDatasetExecutiveReality, type NexoraDatasetExecutiveRealityResult } from "./dataRealityFoundation.ts";
import { getExecutiveOperationsResolvedObjectBindings } from "./demo/executiveOperationsObjectBindings.ts";
import { getExecutiveOperationsKpiDefinitions } from "./demo/executiveOperationsKPIDefinitions.ts";
import { getExecutiveOperationsExecutiveStateRules } from "./demo/executiveOperationsExecutiveStateRules.ts";
import { projectDataRealityToExecutiveRuntime, type NexoraDataRealityStageProjectionResult } from "./dataRealityStageProjection.ts";
import { resolveDataRealityExecutiveAdvisorIntegration, type DataRealityExecutiveAdvisorIntegrationResult } from "./dataRealityExecutiveAdvisorIntegration.ts";

export const liveDataConnectorFoundationIdentity = "RDI:4/NexoraLiveDataConnectorFoundation" as const;
export const liveDataConnectorFoundationVersion = "1.0.0" as const;
export const liveDataConnectorFoundationNamespace = "nexora.real-data-integration.live-connector-foundation" as const;

export const LIVE_CONNECTION_STATES = Object.freeze([
  "disconnected", "connecting", "connected", "degraded",
  "authorization-required", "error", "disabled",
] as const);
export type NexoraLiveConnectionState = (typeof LIVE_CONNECTION_STATES)[number];

export const LIVE_CONNECTOR_CAPABILITIES = Object.freeze([
  "manual-fetch", "refresh", "incremental-observation", "historical-range",
  "schema-discovery", "health-check",
] as const);
export type NexoraLiveConnectorCapability = (typeof LIVE_CONNECTOR_CAPABILITIES)[number];

export const LIVE_DATA_CONNECTOR_AUTHORITY_BOUNDARY = Object.freeze({
  ownsExternalObservation: true as const,
  ownsConnectionHealth: true as const,
  ownsBusinessState: false as const,
  ownsRuntimeTruth: false as const,
  ownsAdvisorConclusion: false as const,
  ownsStageState: false as const,
  ownsDurableMemory: false as const,
  automaticObservation: false as const,
  automaticActivation: false as const,
  credentialTrustBoundary: "server-only" as const,
  downstreamProviderIndependentAfterSnapshot: true as const,
});

export type NexoraLiveConnection = Readonly<{
  connectionId: string;
  workspaceId: WorkspaceId;
  providerId: string;
  providerType: string;
  displayName: string;
  status: NexoraLiveConnectionState;
  capabilities: readonly NexoraLiveConnectorCapability[];
  createdAt: string;
  updatedAt: string;
  lastSuccessfulObservationAt: string | null;
  configurationReference: string;
  credentialReference: string | null;
  provenance: Readonly<{ createdBy: "manager"; boundary: typeof liveDataConnectorFoundationIdentity }>;
}>;

export type NexoraLiveConnectorIdentity = Readonly<{
  providerId: string;
  providerType: string;
  displayName: string;
  connectorVersion: string;
}>;

export type NexoraLiveConnectorConfiguration = Readonly<Record<string, string>>;
export type NexoraLiveConnectorCheck = Readonly<{ ok: boolean; state: NexoraLiveConnectionState; message: string }>;
export type NexoraLiveTransportFailure = "authorization" | "network" | "provider-unavailable" | "rate-limited" | "invalid-response";
export type NexoraLiveObservationResult = Readonly<{
  ok: boolean;
  snapshot: NexoraDataSourceSnapshot | null;
  failure: NexoraLiveTransportFailure | null;
  message: string;
}>;

export interface NexoraLiveDataConnector {
  identify(): NexoraLiveConnectorIdentity;
  capabilities(): readonly NexoraLiveConnectorCapability[];
  validateConfiguration(configuration: NexoraLiveConnectorConfiguration): Promise<NexoraLiveConnectorCheck>;
  testConnection(connection: NexoraLiveConnection, configuration: NexoraLiveConnectorConfiguration): Promise<NexoraLiveConnectorCheck>;
  observe(input: Readonly<{
    connection: NexoraLiveConnection;
    configuration: NexoraLiveConnectorConfiguration;
    observationId: string;
    observedAt: string;
  }>): Promise<NexoraLiveObservationResult>;
  mapper(observationId: string, observedAt: string): NexoraDataRealityMapper;
}

export type NexoraLivePreparedObservation = Readonly<{
  ready: boolean;
  workspaceId: WorkspaceId;
  sourceContextId: string;
  observationId: string;
  sourceLabel: string;
  observedAt: string;
  recordCount: number;
  mappingId: string;
  snapshot: NexoraDataSourceSnapshot | null;
  handoff: NexoraDataRealityHandoff | null;
  dataReality: NexoraDatasetExecutiveRealityResult | null;
  runtime: NexoraDataRealityStageProjectionResult | null;
  advisor: DataRealityExecutiveAdvisorIntegrationResult | null;
  transportFailure: NexoraLiveTransportFailure | null;
  errors: readonly string[];
}>;

export type NexoraLiveCommittedObservation = NexoraLivePreparedObservation & Readonly<{
  ready: true;
  snapshot: NexoraDataSourceSnapshot;
  handoff: NexoraDataRealityHandoff;
  dataReality: NexoraDatasetExecutiveRealityResult;
  runtime: NexoraDataRealityStageProjectionResult;
  advisor: DataRealityExecutiveAdvisorIntegrationResult;
  committedAt: string;
  connectionId: string;
}>;

export function createNexoraLiveConnection(input: Readonly<{
  connectionId: string; workspaceId: WorkspaceId; providerId: string; providerType: string;
  displayName: string; capabilities: readonly NexoraLiveConnectorCapability[];
  createdAt: string; configurationReference: string; credentialReference?: string | null;
}>): NexoraLiveConnection {
  const connection: NexoraLiveConnection = {
    ...input,
    status: "disconnected" as const,
    capabilities: Object.freeze([...input.capabilities]),
    updatedAt: input.createdAt,
    lastSuccessfulObservationAt: null,
    credentialReference: input.credentialReference ?? null,
    provenance: Object.freeze({ createdBy: "manager" as const, boundary: liveDataConnectorFoundationIdentity }),
  };
  return Object.freeze(connection);
}

export function transitionNexoraLiveConnection(
  connection: NexoraLiveConnection,
  status: NexoraLiveConnectionState,
  updatedAt: string,
  lastSuccessfulObservationAt: string | null = connection.lastSuccessfulObservationAt,
): NexoraLiveConnection {
  return Object.freeze({ ...connection, status, updatedAt, lastSuccessfulObservationAt, capabilities: Object.freeze([...connection.capabilities]), provenance: Object.freeze({ ...connection.provenance }) });
}

function failedPreparation(connection: NexoraLiveConnection, observationId: string, observedAt: string, message: string, failure: NexoraLiveTransportFailure | null, snapshot: NexoraDataSourceSnapshot | null = null): NexoraLivePreparedObservation {
  return Object.freeze({ ready: false, workspaceId: connection.workspaceId, sourceContextId: `live:${connection.connectionId}`, observationId, sourceLabel: connection.displayName, observedAt, recordCount: snapshot?.records.length ?? 0, mappingId: "unavailable", snapshot, handoff: null, dataReality: null, runtime: null, advisor: null, transportFailure: failure, errors: Object.freeze([message]) });
}

/** Fetch → canonical snapshot → map → Data Reality → Runtime preview. No commit. */
export async function prepareNexoraLiveObservation(input: Readonly<{
  connector: NexoraLiveDataConnector;
  connection: NexoraLiveConnection;
  configuration: NexoraLiveConnectorConfiguration;
  observationId: string;
  observedAt: string;
}>): Promise<NexoraLivePreparedObservation> {
  if (input.connection.status !== "connected" && input.connection.status !== "degraded") {
    return failedPreparation(input.connection, input.observationId, input.observedAt, "Connect and test this source before refreshing.", null);
  }
  const observed = await input.connector.observe(input);
  if (!observed.ok || !observed.snapshot) return failedPreparation(input.connection, input.observationId, input.observedAt, observed.message, observed.failure);
  const snapshot = observed.snapshot;
  const mapper = input.connector.mapper(input.observationId, input.observedAt);
  const handoffResult = createNexoraDataRealityHandoff(snapshot, mapper, input.connection.workspaceId);
  if (!handoffResult.ready) return failedPreparation(input.connection, input.observationId, input.observedAt, handoffResult.validation.issues[0]?.message ?? "Live observation mapping failed.", null, snapshot);
  const handoff = handoffResult.handoff;
  const dataReality = resolveDatasetExecutiveReality(handoff.dataset, {
    bindings: getExecutiveOperationsResolvedObjectBindings(), definitions: getExecutiveOperationsKpiDefinitions(),
    rules: getExecutiveOperationsExecutiveStateRules(), createdAt: input.observedAt,
  });
  if (dataReality.status === "invalid" || dataReality.objectStates.length === 0) return failedPreparation(input.connection, input.observationId, input.observedAt, "The observation did not produce a valid executive signal.", null, snapshot);
  const runtime = projectDataRealityToExecutiveRuntime(dataReality.snapshot);
  if (runtime.status === "invalid") return failedPreparation(input.connection, input.observationId, input.observedAt, runtime.issues[0]?.message ?? "Runtime projection failed.", null, snapshot);
  const advisor = resolveDataRealityExecutiveAdvisorIntegration({ dataset: handoff.dataset, currentWorkspace: input.connection.workspaceId });
  return Object.freeze({ ready: true, workspaceId: input.connection.workspaceId, sourceContextId: `live:${input.connection.connectionId}`, observationId: input.observationId, sourceLabel: input.connection.displayName, observedAt: input.observedAt, recordCount: snapshot.records.length, mappingId: mapper.mappingId, snapshot, handoff, dataReality, runtime, advisor, transportFailure: null, errors: Object.freeze([]) });
}

type GithubRepositoryResponse = Readonly<{ full_name: string; html_url: string; stargazers_count: number; forks_count: number; open_issues_count: number }>;
type GithubIssueResponse = Readonly<{ id: number; state: "open" | "closed"; pull_request?: unknown }>;
export type NexoraLiveFetch = (url: string, init?: RequestInit) => Promise<Readonly<{ ok: boolean; status: number; json(): Promise<unknown> }>>;

function githubFailure(status: number): NexoraLiveTransportFailure {
  if (status === 401 || status === 403) return status === 401 ? "authorization" : "rate-limited";
  if (status >= 500) return "provider-unavailable";
  return "network";
}

function isGithubRepository(value: unknown): value is GithubRepositoryResponse {
  if (!value || typeof value !== "object") return false;
  const item = value as Partial<GithubRepositoryResponse>;
  return typeof item.full_name === "string" && typeof item.html_url === "string" && Number.isFinite(item.stargazers_count) && Number.isFinite(item.forks_count) && Number.isFinite(item.open_issues_count);
}

function provenance(source: NexoraDataSource, observationId: string, observedAt: string, recordId: string, field: string): NexoraDataSourceProvenance {
  return Object.freeze({ sourceId: source.identity.sourceId, sourceType: source.identity.sourceType, providerName: source.identity.providerName, sourceRecordId: recordId, sourceFieldKey: field, observedAt, importedAt: observedAt, transformationRef: `rdi4:github:${observationId}:${field}`, confidenceState: "verified" as const, confidence: 1 });
}

/** Reference implementation. Fetch is injected so credentials stay at the server boundary. */
export function createGithubRepositoryConnector(fetcher: NexoraLiveFetch, serverToken?: string): NexoraLiveDataConnector {
  const headers = Object.freeze({ Accept: "application/vnd.github+json", "X-GitHub-Api-Version": "2022-11-28", ...(serverToken ? { Authorization: `Bearer ${serverToken}` } : {}) });
  const read = async (configuration: NexoraLiveConnectorConfiguration) => {
    const owner = configuration.owner?.trim(); const repository = configuration.repository?.trim();
    if (!owner || !repository) return Object.freeze({ ok: false as const, failure: "invalid-response" as const, message: "Repository owner and name are required.", repository: null, issues: Object.freeze([]) });
    try {
      const [repoResponse, issuesResponse] = await Promise.all([
        fetcher(`https://api.github.com/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repository)}`, { headers }),
        fetcher(`https://api.github.com/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repository)}/issues?state=all&sort=updated&direction=desc&per_page=100`, { headers }),
      ]);
      if (!repoResponse.ok) return Object.freeze({ ok: false as const, failure: githubFailure(repoResponse.status), message: `GitHub returned ${repoResponse.status}.`, repository: null, issues: Object.freeze([]) });
      if (!issuesResponse.ok) return Object.freeze({ ok: false as const, failure: githubFailure(issuesResponse.status), message: `GitHub issue observation returned ${issuesResponse.status}.`, repository: null, issues: Object.freeze([]) });
      const repositoryValue = await repoResponse.json(); const issueValue = await issuesResponse.json();
      if (!isGithubRepository(repositoryValue) || !Array.isArray(issueValue)) return Object.freeze({ ok: false as const, failure: "invalid-response" as const, message: "GitHub returned an unsupported response.", repository: null, issues: Object.freeze([]) });
      const issues = issueValue.filter((entry): entry is GithubIssueResponse => Boolean(entry && typeof entry === "object" && Number.isFinite((entry as GithubIssueResponse).id) && ((entry as GithubIssueResponse).state === "open" || (entry as GithubIssueResponse).state === "closed") && !(entry as GithubIssueResponse).pull_request));
      return Object.freeze({ ok: true as const, failure: null, message: "GitHub repository is reachable.", repository: repositoryValue, issues: Object.freeze(issues) });
    } catch {
      return Object.freeze({ ok: false as const, failure: "network" as const, message: "GitHub could not be reached.", repository: null, issues: Object.freeze([]) });
    }
  };
  const connector: NexoraLiveDataConnector = {
    identify: () => Object.freeze({ providerId: "github", providerType: "source-control", displayName: "GitHub Repository Health", connectorVersion: "1.0.0" }),
    capabilities: () => Object.freeze(["manual-fetch", "refresh", "health-check"] as const),
    validateConfiguration: async (configuration) => Object.freeze({ ok: Boolean(configuration.owner?.trim() && configuration.repository?.trim()), state: configuration.owner?.trim() && configuration.repository?.trim() ? "disconnected" : "error", message: configuration.owner?.trim() && configuration.repository?.trim() ? "Configuration is safe to test." : "Repository owner and name are required." }),
    testConnection: async (_connection, configuration) => { const result = await read(configuration); return Object.freeze({ ok: result.ok, state: result.ok ? "connected" : result.failure === "authorization" ? "authorization-required" : "error", message: result.message }); },
    observe: async ({ connection, configuration, observationId, observedAt }) => {
      const result = await read(configuration);
      if (!result.ok || !result.repository) return Object.freeze({ ok: false, snapshot: null, failure: result.failure, message: result.message });
      const source: NexoraDataSource = Object.freeze({ identity: Object.freeze({ sourceId: `live:${connection.connectionId}`, sourceType: "api", workspaceId: connection.workspaceId, providerName: "github", connectionId: connection.connectionId, observedAt, schemaVersion: "rdi4.github.repository-health.v1" }), metadata: Object.freeze({ displayName: connection.displayName, description: "GitHub repository issue workload and resolution observation", configurationRef: connection.configurationReference, tags: Object.freeze(["live", "github", "repository-health"]) }), adapterId: "rdi4.github.repository-health-adapter" });
      const issueTotal = result.issues.length; const open = result.issues.filter((issue) => issue.state === "open").length; const closed = issueTotal - open;
      const values = Object.freeze({ repository: result.repository.full_name, repository_url: result.repository.html_url, recent_issue_sample: issueTotal, recent_open_issues: open, recent_closed_issues: closed, stars: result.repository.stargazers_count, forks: result.repository.forks_count, provider_open_items: result.repository.open_issues_count });
      const adapter: NexoraDataSourceAdapter = Object.freeze({ adapterId: source.adapterId, adapterVersion: "1.0.0", sourceType: "api", providerName: "github", adapt: () => {
        const recordId = result.repository!.full_name;
        const recordProvenance = provenance(source, observationId, observedAt, recordId, "repository");
        const records: readonly NexoraSourceRecord[] = Object.freeze([Object.freeze({ recordId, provenance: recordProvenance, fields: Object.freeze(Object.entries(values).map(([key, value]) => Object.freeze({ key, sourceDataType: typeof value, value, provenance: provenance(source, observationId, observedAt, recordId, key) }))) })]);
        return Object.freeze({ records });
      } });
      const adapted = adaptNexoraDataSource(adapter, { source, snapshotId: `rdi4:snapshot:${observationId}`, importedAt: observedAt, payload: values }, { expectedWorkspaceId: connection.workspaceId, supportedSourceTypes: Object.freeze(["api"]) });
      return Object.freeze({ ok: adapted.ok, snapshot: adapted.snapshot, failure: adapted.ok ? null : "invalid-response", message: adapted.ok ? "Canonical GitHub observation prepared." : adapted.validation.issues[0]?.message ?? "Observation validation failed." });
    },
    mapper: (observationId, observedAt) => Object.freeze({ mappingId: `rdi4:github-repository-health:${observationId}`, mappingVersion: "1.0.0", map: (snapshot: NexoraDataSourceSnapshot) => {
      const fields = new Map(snapshot.records[0]?.fields.map((field) => [field.key, field]) ?? []);
      const total = Math.max(Number(fields.get("recent_issue_sample")?.value ?? 0), 1);
      const mappings = [
        ["production", "usedCapacity", "recent_open_issues", Number(fields.get("recent_open_issues")?.value ?? 0)],
        ["production", "totalCapacity", "recent_issue_sample", total],
        ["customer", "satisfactionScore", "recent_closed_issues", Number(fields.get("recent_closed_issues")?.value ?? 0)],
        ["customer", "maximumSatisfactionScore", "recent_issue_sample", total],
      ] as const;
      const records: NexoraDatasetRecord[] = []; const factProvenance: NexoraDataRealityFactProvenance[] = [];
      for (const [objectKey, metricKey, fieldKey, value] of mappings) { const trace = fields.get(fieldKey)?.provenance; if (!trace) continue; records.push(Object.freeze({ objectKey, metricKey, value, unit: metricKey.includes("Satisfaction") ? "score" : "units", observedAt })); factProvenance.push(Object.freeze({ objectKey, metricKey, provenance: Object.freeze({ ...trace, transformationRef: `rdi4:github-repository-health:${fieldKey}` }) })); }
      const dataset: NexoraDataset = Object.freeze({ id: `rdi4:dataset:${observationId}`, name: snapshot.source.metadata.displayName, version: "1.0.0", capturedAt: observedAt, source: "api", familyId: `nexora.github.repository-health:${snapshot.source.identity.connectionId}`, scenario: "baseline", records: Object.freeze(records) });
      return Object.freeze({ dataset, factProvenance: Object.freeze(factProvenance) });
    } }),
  };
  return Object.freeze(connector);
}

export function createMockLiveConnector(
  snapshotFactory: (input: Parameters<NexoraLiveDataConnector["observe"]>[0]) => NexoraDataSourceSnapshot,
  mapperFactory?: (observationId: string, observedAt: string) => NexoraDataRealityMapper,
): NexoraLiveDataConnector {
  const connector: NexoraLiveDataConnector = { identify: () => Object.freeze({ providerId: "mock", providerType: "test", displayName: "Mock Connector", connectorVersion: "1.0.0" }), capabilities: () => Object.freeze(["manual-fetch", "health-check"] as const), validateConfiguration: async () => Object.freeze({ ok: true, state: "disconnected", message: "Valid." }), testConnection: async () => Object.freeze({ ok: true, state: "connected", message: "Connected." }), observe: async (input) => Object.freeze({ ok: true, snapshot: snapshotFactory(input), failure: null, message: "Observed." }), mapper: mapperFactory ?? (() => Object.freeze({ mappingId: "rdi4:mock-mapping", mappingVersion: "1.0.0", map: (snapshot) => Object.freeze({ dataset: Object.freeze({ id: `mock:${snapshot.snapshotId}`, name: "Mock", version: "1.0.0", capturedAt: snapshot.importedAt, source: "api", familyId: "nexora.mock", scenario: "baseline", records: Object.freeze([]) }), factProvenance: Object.freeze([]) }) })) };
  return Object.freeze(connector);
}

export type LiveDataConnectorCertificationGate = "A"|"B"|"C"|"D"|"E"|"F"|"G"|"H"|"I"|"J"|"K"|"L"|"M"|"N"|"O"|"P"|"Q"|"R";
export function certifyLiveDataConnectorFoundation(evidence: Readonly<Record<LiveDataConnectorCertificationGate, boolean>>) {
  const gates = Object.freeze((Object.keys(evidence) as LiveDataConnectorCertificationGate[]).sort().map((gate) => Object.freeze({ gate, passed: evidence[gate] })));
  return Object.freeze({ certified: gates.length === 18 && gates.every((entry) => entry.passed), passedGateCount: gates.filter((entry) => entry.passed).length, failedGateCount: gates.filter((entry) => !entry.passed).length, gates });
}
