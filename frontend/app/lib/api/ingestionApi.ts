import { getJson, postJson } from "./client";
import { toNexoraError } from "../system/nexoraErrors";
import { withSingleNetworkRetry } from "../system/nexoraNetworkRetry";
import { emitNexoraB26ApiError } from "../system/nexoraReliabilityLog";

/**
 * Phase B.1 ingestion API (canonical text path + connector catalog scaffold).
 * - Manual text: POST `/ingestion/text`
 * - Connectors: GET `/ingestion/connectors`
 * Generic multi-type ingestion remains POST `/ingestion/run` (not used by this client).
 */

/** Mirrors backend `ConnectorSourceDefinition` (Phase B.1 scaffold). */
export type ConnectorSourceDefinitionOut = {
  connector_id: string;
  label: string;
  type: string;
  status: string;
  config_schema: string;
  enabled: boolean;
  /** B.10.a — optional until all gateways return it */
  description?: string;
};

export type ConnectorCatalogResponse = {
  connectors: ConnectorSourceDefinitionOut[];
};

export type IngestionSignalOut = {
  id: string;
  type: string;
  label: string;
  description: string;
  strength: number;
  entities: string[];
  source_id: string;
  metadata?: Record<string, unknown>;
};

export type SourceDocumentOut = {
  id: string;
  type: string;
  title?: string | null;
  raw_content: string;
  metadata: Record<string, unknown>;
};

export type SignalBundleOut = {
  source: SourceDocumentOut;
  signals: IngestionSignalOut[];
  summary: string;
  warnings: string[];
  ingestion_meta: Record<string, unknown>;
  created_at: string;
};

export type TextIngestionRequest = {
  text: string;
  title?: string | null;
  source_label?: string | null;
  domain?: string | null;
};

export type TextIngestionResponse = {
  ok: boolean;
  bundle: SignalBundleOut;
  errors: string[];
};

async function wrapIngestion<T>(endpoint: string, run: () => Promise<T>): Promise<T> {
  try {
    return await withSingleNetworkRetry(endpoint, run);
  } catch (e: unknown) {
    const ne = toNexoraError(e);
    emitNexoraB26ApiError(endpoint, ne.code);
    throw ne;
  }
}

/** GET `/ingestion/connectors` — static connector definitions (no execution). */
export async function fetchConnectorCatalog(
  options?: { signal?: AbortSignal }
): Promise<ConnectorCatalogResponse> {
  return wrapIngestion("GET /ingestion/connectors", () =>
    getJson<ConnectorCatalogResponse>("/ingestion/connectors", { signal: options?.signal })
  );
}

export type ConnectorRunRequest = {
  connector_id: string;
  config?: Record<string, unknown>;
};

/** POST `/ingestion/connector/run` — B.10.a connector → shared ingestion (stubs + manual). */
export async function runConnectorIngestion(
  payload: ConnectorRunRequest,
  options?: { signal?: AbortSignal }
): Promise<TextIngestionResponse> {
  return wrapIngestion("POST /ingestion/connector/run", () =>
    postJson<ConnectorRunRequest, TextIngestionResponse>("/ingestion/connector/run", payload, {
      signal: options?.signal,
    })
  );
}

/** POST `/ingestion/text` — deterministic manual text → `SignalBundle`. */
export async function runTextIngestion(
  payload: TextIngestionRequest,
  options?: { signal?: AbortSignal }
): Promise<TextIngestionResponse> {
  return wrapIngestion("POST /ingestion/text", () =>
    postJson<TextIngestionRequest, TextIngestionResponse>("/ingestion/text", payload, {
      signal: options?.signal,
    })
  );
}

/** B.10.e — one connector invocation inside a multi-source run. */
export type ConnectorRunInputOut = {
  connector_id: string;
  config?: Record<string, unknown>;
};

export type ConnectorRunResultOut = {
  connector_id: string;
  ok: boolean;
  bundle: SignalBundleOut | null;
  errors: string[];
  metadata: Record<string, unknown>;
};

export type MergedSignalBundleOut = {
  sources: ConnectorRunResultOut[];
  signals: IngestionSignalOut[];
  summary: string | null;
  warnings: string[];
  merge_meta: Record<string, unknown>;
};

export type MultiSourceIngestionRequest = {
  sources: ConnectorRunInputOut[];
  domain?: string | null;
};

export type MultiSourceIngestionResponse = {
  ok: boolean;
  bundle: MergedSignalBundleOut;
  errors: string[];
};

/** POST `/ingestion/multi/run` — B.10.e.3 multi-source merge (no scanner bridge here). */
export async function runMultiSourceIngestion(
  payload: MultiSourceIngestionRequest,
  options?: { signal?: AbortSignal }
): Promise<MultiSourceIngestionResponse> {
  return wrapIngestion("POST /ingestion/multi/run", () =>
    postJson<MultiSourceIngestionRequest, MultiSourceIngestionResponse>("/ingestion/multi/run", payload, {
      signal: options?.signal,
    })
  );
}
