/**
 * Phase C — Publish connector results into existing Runtime data slice.
 * Runtime remains owner; emits DataUpdated with published payload.
 */

import type {
  ExecutiveDataMapping,
  ExecutiveDataSource,
} from "../data/ExecutiveDataConfig";
import { toDataJournalEntry, toDataTimelinePack } from "../data/ExecutiveDataConfig";
import type { ExecutiveRuntimeStore } from "../runtime/ExecutiveRuntimeStore";
import type {
  ConnectorFieldMapping,
  ConnectorPublishResult,
} from "./ExecutiveConnectorContracts";
import type { ExecutiveConnectionSession } from "./ExecutiveConnectionSession";

export function buildPublishedSource(input: {
  readonly session: ExecutiveConnectionSession;
  readonly rowsImported: number;
  readonly objectsUpdated: readonly string[];
  readonly category: ExecutiveDataSource["category"];
  readonly type: ExecutiveDataSource["type"];
}): ExecutiveDataSource {
  return {
    id: `source-connector-${Date.now().toString(36)}`,
    name: input.session.sourceLabel || input.session.connectorName,
    type: input.type,
    category: input.category,
    status: "Connected",
    health: "Healthy",
    rows: input.rowsImported.toLocaleString("en-US"),
    objectsConnected: [...input.objectsUpdated],
    lastSync: "Just now",
    owner: input.session.approvedBy ?? "Executive · Nova",
    notes: `Published through ${input.session.connectorName} (Enterprise Connector).`,
  };
}

export function buildPublishedMappings(
  sourceId: string,
  mappings: readonly ConnectorFieldMapping[],
): ExecutiveDataMapping[] {
  return mappings
    .filter((m) => m.status === "Mapped" || m.status === "Suggested")
    .map((m, index) => ({
      id: `map-connector-${sourceId}-${index}`,
      sourceId,
      sourceColumn: m.columnName,
      objectId: m.objectId,
      objectLabel: m.objectLabel,
      status: m.status === "Mapped" ? ("Mapped" as const) : ("Suggested" as const),
    }));
}

/**
 * Publishes into Runtime via a dedicated action when available,
 * otherwise falls back to a compatible DataUpdated path.
 */
export function publishSessionToRuntime(
  store: ExecutiveRuntimeStore,
  input: {
    readonly session: ExecutiveConnectionSession;
    readonly rowsImported: number;
    readonly objectsUpdated: readonly string[];
    readonly category: ExecutiveDataSource["category"];
    readonly type: ExecutiveDataSource["type"];
  },
): ConnectorPublishResult {
  const source = buildPublishedSource(input);
  const mappings = buildPublishedMappings(source.id, input.session.mappings);
  const actions = store.actions as typeof store.actions & {
    publishConnectorSource?: (payload: {
      source: ExecutiveDataSource;
      mappings: readonly ExecutiveDataMapping[];
      rowsImported: number;
      objectsUpdated: readonly string[];
    }) => void;
  };

  if (typeof actions.publishConnectorSource === "function") {
    actions.publishConnectorSource({
      source,
      mappings,
      rowsImported: input.rowsImported,
      objectsUpdated: input.objectsUpdated,
    });
  } else {
    // Compatible fallback — wizard finish + event (tests without store extension).
    store.emit("DataUpdated", {
      published: true,
      sourceId: source.id,
      rowsImported: input.rowsImported,
      objectsUpdated: input.objectsUpdated,
      timestamp: Date.now(),
    });
  }

  void toDataJournalEntry;
  void toDataTimelinePack;

  return {
    sourceId: source.id,
    rowsImported: input.rowsImported,
    objectsUpdated: input.objectsUpdated,
    timestamp: Date.now(),
    source,
    mappings,
  };
}
