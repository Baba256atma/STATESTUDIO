/**
 * Phase C — Connection session model.
 */

import type {
  ConnectionLifecycle,
  ConnectorFieldMapping,
  ConnectorHealthReport,
  ConnectorJournalEntry,
  ConnectorValidationResult,
  DiscoveredSchema,
  SchemaPreviewStats,
} from "./ExecutiveConnectorContracts";

export type ExecutiveConnectionSession = {
  readonly sessionId: string;
  readonly connectorId: string;
  readonly connectorName: string;
  readonly sourceLabel: string;
  readonly lifecycle: ConnectionLifecycle;
  readonly schema: DiscoveredSchema | null;
  readonly previewStats: SchemaPreviewStats | null;
  readonly validation: ConnectorValidationResult | null;
  readonly mappings: readonly ConnectorFieldMapping[];
  readonly approved: boolean;
  readonly approvedBy: string | null;
  readonly published: boolean;
  readonly publishedSourceId: string | null;
  readonly health: ConnectorHealthReport | null;
  readonly error: string | null;
  readonly updatedAt: number;
};

export function createIdleSession(
  connectorId: string,
  connectorName: string,
): ExecutiveConnectionSession {
  return {
    sessionId: `session-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`,
    connectorId,
    connectorName,
    sourceLabel: "",
    lifecycle: "Disconnected",
    schema: null,
    previewStats: null,
    validation: null,
    mappings: [],
    approved: false,
    approvedBy: null,
    published: false,
    publishedSourceId: null,
    health: null,
    error: null,
    updatedAt: Date.now(),
  };
}

export function suggestMappingsFromSchema(
  schema: DiscoveredSchema,
  resolveField: (
    column: string,
  ) => { fieldId: string | null; objectId: string | null; objectLabel: string },
): ConnectorFieldMapping[] {
  return schema.columns.map((column) => {
    const resolved = resolveField(column.name);
    const mapped = Boolean(resolved.fieldId || resolved.objectId);
    return {
      columnName: column.name,
      detectedType: column.type,
      metadataFieldId: resolved.fieldId,
      objectId: resolved.objectId as ConnectorFieldMapping["objectId"],
      objectLabel: resolved.objectLabel || column.name,
      status: mapped ? "Suggested" : "Unmapped",
    };
  });
}

export function toConnectorJournalEntry(
  session: ExecutiveConnectionSession,
): ConnectorJournalEntry {
  return {
    id: `journal-connector-${session.sessionId}`,
    sourceId: session.publishedSourceId ?? session.sessionId,
    sourceName: session.sourceLabel || session.connectorName,
    schemaSummary: session.schema
      ? `${session.schema.columns.length} columns · ${session.schema.rowCount} rows`
      : "No schema",
    mappingsSummary: `${session.mappings.filter((m) => m.status === "Mapped").length} fields mapped`,
    objectsSummary:
      Array.from(
        new Set(
          session.mappings
            .filter((m) => m.status === "Mapped")
            .map((m) => m.objectLabel),
        ),
      ).join(", ") || "—",
    published: session.published,
    timestamp: new Date().toISOString(),
    summary: `[Connector] ${session.sourceLabel || session.connectorName} · ${session.lifecycle}`,
  };
}
