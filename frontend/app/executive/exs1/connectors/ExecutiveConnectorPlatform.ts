/**
 * Phase C — Enterprise Connector Platform orchestration.
 */

import type { ExecutiveMetadataCatalog } from "../metadata/ExecutiveMetadataRegistry";
import {
  getObjectMetadata,
  resolveFieldByTechnicalOrSynonym,
} from "../metadata/ExecutiveMetadataRegistry";
import type { ExecutiveRuntimeStore } from "../runtime/ExecutiveRuntimeStore";
import type {
  ConnectorConnectInput,
  ConnectorFieldMapping,
  ConnectorFilter,
  ConnectorJournalEntry,
} from "./ExecutiveConnectorContracts";
import {
  createConnectorManager,
  type ExecutiveConnectorManager,
  type ManagedConnectorStatus,
} from "./ExecutiveConnectorManager";
import {
  createIdleSession,
  suggestMappingsFromSchema,
  toConnectorJournalEntry,
  type ExecutiveConnectionSession,
} from "./ExecutiveConnectionSession";
import { publishSessionToRuntime } from "./ExecutiveRuntimePublisher";

export type { ManagedConnectorStatus };

export type ConnectorPlatformSnapshot = {
  readonly session: ExecutiveConnectionSession | null;
  readonly statuses: readonly ManagedConnectorStatus[];
  readonly journalEntries: readonly ConnectorJournalEntry[];
};

export type ExecutiveConnectorPlatform = {
  readonly manager: ExecutiveConnectorManager;
  getSession: () => ExecutiveConnectionSession | null;
  getJournal: () => readonly ConnectorJournalEntry[];
  startSession: (connectorId: string) => ExecutiveConnectionSession;
  connect: (input?: ConnectorConnectInput) => Promise<ExecutiveConnectionSession>;
  validate: () => Promise<ExecutiveConnectionSession>;
  discoverAndPreview: () => Promise<ExecutiveConnectionSession>;
  applySuggestedMappings: (
    catalog: ExecutiveMetadataCatalog,
  ) => ExecutiveConnectionSession;
  updateMapping: (
    columnName: string,
    patch: Partial<ConnectorFieldMapping>,
  ) => ExecutiveConnectionSession;
  approve: (approvedBy?: string) => ExecutiveConnectionSession;
  publish: (store: ExecutiveRuntimeStore) => Promise<{
    session: ExecutiveConnectionSession;
    journal: ConnectorJournalEntry;
  }>;
  disconnect: () => Promise<ExecutiveConnectionSession | null>;
  filterStatuses: (
    statuses: readonly ManagedConnectorStatus[],
    filter: ConnectorFilter,
    query: string,
  ) => ManagedConnectorStatus[];
  refreshStatuses: () => Promise<ManagedConnectorStatus[]>;
};

function resolveColumn(
  catalog: ExecutiveMetadataCatalog,
  column: string,
): { fieldId: string | null; objectId: string | null; objectLabel: string } {
  const field = resolveFieldByTechnicalOrSynonym(catalog, column);
  if (field) {
    const objectId = field.mappedObjectId;
    const objectMeta = objectId ? getObjectMetadata(catalog, objectId) : null;
    return {
      fieldId: field.fieldId,
      objectId,
      objectLabel: objectMeta?.displayName ?? objectId ?? field.displayName,
    };
  }
  // Heuristic object match by column name only — does not create metadata.
  const object = catalog.objects.find(
    (o) =>
      o.displayName.toLowerCase() === column.toLowerCase() ||
      o.objectId.toLowerCase() === column.toLowerCase(),
  );
  if (object) {
    return {
      fieldId: null,
      objectId: object.objectId,
      objectLabel: object.displayName,
    };
  }
  return { fieldId: null, objectId: null, objectLabel: column };
}

export function createConnectorPlatform(
  manager: ExecutiveConnectorManager = createConnectorManager(),
): ExecutiveConnectorPlatform {
  let session: ExecutiveConnectionSession | null = null;
  let journalEntries: ConnectorJournalEntry[] = [];
  const publishedMeta = new Map<string, Partial<ManagedConnectorStatus>>();

  function requireSession(): ExecutiveConnectionSession {
    if (!session) throw new Error("No active connection session.");
    return session;
  }

  function setSession(next: ExecutiveConnectionSession) {
    session = next;
    return next;
  }

  return {
    manager,
    getSession: () => session,
    getJournal: () => journalEntries,

    startSession(connectorId) {
      const connector = manager.getConnector(connectorId);
      if (!connector) throw new Error(`Unknown connector ${connectorId}`);
      if (!connector.descriptor.enabled) {
        throw new Error(`${connector.descriptor.name} is disabled.`);
      }
      return setSession(
        createIdleSession(connectorId, connector.descriptor.name),
      );
    },

    async connect(input) {
      const current = requireSession();
      const connector = manager.getConnector(current.connectorId)!;
      await connector.connect(input);
      const health = await connector.health();
      return setSession({
        ...current,
        sourceLabel: input?.label?.trim() || current.sourceLabel || "inventory.csv",
        lifecycle: "Connected",
        health,
        error: null,
        updatedAt: Date.now(),
      });
    },

    async validate() {
      const current = requireSession();
      const connector = manager.getConnector(current.connectorId)!;
      const validation = await connector.validate();
      return setSession({
        ...current,
        lifecycle: validation.ok ? "Connected" : "Failed",
        validation,
        health: await connector.health(),
        error: validation.ok
          ? null
          : validation.messages[0]?.message ?? "Validation failed",
        updatedAt: Date.now(),
      });
    },

    async discoverAndPreview() {
      const current = requireSession();
      const connector = manager.getConnector(current.connectorId)!;
      const preview = await connector.preview();
      const validation = await connector.validate();
      return setSession({
        ...current,
        lifecycle: "Preview Ready",
        schema: preview.schema,
        previewStats: preview.stats,
        sourceLabel: preview.schema.sourceLabel,
        validation,
        health: await connector.health(),
        error: null,
        updatedAt: Date.now(),
      });
    },

    applySuggestedMappings(catalog) {
      const current = requireSession();
      if (!current.schema) throw new Error("Discover schema before mapping.");
      const mappings = suggestMappingsFromSchema(current.schema, (column) =>
        resolveColumn(catalog, column),
      );
      return setSession({
        ...current,
        lifecycle: "Mapped",
        mappings,
        updatedAt: Date.now(),
      });
    },

    updateMapping(columnName, patch) {
      const current = requireSession();
      const mappings = current.mappings.map((m) =>
        m.columnName === columnName
          ? {
              ...m,
              ...patch,
              status: patch.status ?? m.status,
            }
          : m,
      );
      return setSession({
        ...current,
        mappings,
        lifecycle: "Mapped",
        updatedAt: Date.now(),
      });
    },

    approve(approvedBy = "Executive Manager") {
      const current = requireSession();
      if (current.lifecycle === "Failed") {
        throw new Error("Cannot approve a failed session.");
      }
      const mappings = current.mappings.map((m) =>
        m.status === "Suggested"
          ? { ...m, status: "Mapped" as const }
          : m,
      );
      return setSession({
        ...current,
        mappings,
        approved: true,
        approvedBy,
        lifecycle: "Approved",
        updatedAt: Date.now(),
      });
    },

    async publish(store) {
      const current = requireSession();
      if (!current.approved) {
        throw new Error("Manager approval is required before publish.");
      }
      const connector = manager.getConnector(current.connectorId)!;
      const published = await connector.publish({
        mappings: current.mappings,
        approvedBy: current.approvedBy ?? "Executive Manager",
      });
      const result = publishSessionToRuntime(store, {
        session: current,
        rowsImported: published.rowsImported,
        objectsUpdated: published.objectsUpdated,
        category: published.category,
        type: published.type,
      });
      const next = setSession({
        ...current,
        published: true,
        publishedSourceId: result.sourceId,
        lifecycle: "Published",
        updatedAt: Date.now(),
      });
      const journal = toConnectorJournalEntry(next);
      journalEntries = [journal, ...journalEntries].slice(0, 24);
      publishedMeta.set(current.connectorId, {
        lastSync: "Just now",
        rows: result.rowsImported.toLocaleString("en-US"),
        mappedObjects: [...result.objectsUpdated],
        connectionStatus: "Connected",
        health: {
          state: "Healthy",
          detail: `Published ${result.source.name}`,
          checkedAt: Date.now(),
        },
      });
      return { session: next, journal };
    },

    async disconnect() {
      if (!session) return null;
      const connector = manager.getConnector(session.connectorId);
      if (connector) await connector.disconnect();
      return setSession({
        ...session,
        lifecycle: "Disconnected",
        updatedAt: Date.now(),
      });
    },

    filterStatuses(statuses, filter, query) {
      const q = query.trim().toLowerCase();
      return statuses.filter((item) => {
        const matchesFilter =
          filter === "All"
            ? true
            : filter === "Connected"
              ? item.connectionStatus === "Connected"
              : filter === "Disconnected"
                ? item.connectionStatus === "Disconnected" ||
                  item.health.state === "Disconnected"
                : filter === "Errors"
                  ? item.connectionStatus === "Error" ||
                    item.health.state === "Validation Failed" ||
                    item.health.state === "Authentication Failed"
                  : filter === "CSV"
                    ? item.descriptor.family === "CSV" ||
                      item.descriptor.kind === "CSV"
                    : filter === "Database"
                      ? item.descriptor.family === "Database"
                      : filter === "ERP"
                        ? item.descriptor.family === "ERP"
                        : item.descriptor.family === "API";
        if (!matchesFilter) return false;
        if (!q) return true;
        return (
          item.descriptor.name.toLowerCase().includes(q) ||
          item.descriptor.kind.toLowerCase().includes(q) ||
          item.mappedObjects.some((o) => o.toLowerCase().includes(q)) ||
          (item.descriptor.description ?? "").toLowerCase().includes(q)
        );
      });
    },

    async refreshStatuses() {
      return manager.snapshotStatuses(publishedMeta);
    },
  };
}
