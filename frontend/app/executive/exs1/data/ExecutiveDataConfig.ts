/**
 * Sprint 3 — Mock Executive Data Experience dataset.
 * Visual catalog / mapping only. No Runtime, drivers, parsing, or sync.
 */

import type { Exs1ObjectId } from "../exs1Types";

export type DataSourceType =
  | "CSV"
  | "Excel"
  | "SQL"
  | "PostgreSQL"
  | "MySQL"
  | "Oracle"
  | "SAP"
  | "ERP"
  | "REST API"
  | "Power BI"
  | "SharePoint"
  | "Manual Dataset";

export type DataSourceCategory =
  | "CSV"
  | "Excel"
  | "Database"
  | "API"
  | "Cloud Storage"
  | "Enterprise System";

export type ConnectionStatus =
  | "Connected"
  | "Disconnected"
  | "Warning"
  | "Syncing";

export type DataHealth = "Healthy" | "Warning" | "Disconnected" | "Pending";

export type MappingStatus = "Mapped" | "Suggested" | "Create Object" | "Ignored";

export type DataCatalogSection =
  | "Sources"
  | "Mappings"
  | "Connections"
  | "History";

export type DataFilter =
  | "All"
  | "Connected"
  | "CSV"
  | "Database"
  | "API"
  | "Warning";

export type WizardStep =
  | "type"
  | "details"
  | "preview"
  | "mapping"
  | "review"
  | "finish";

export type ExecutiveDataSource = {
  readonly id: string;
  readonly name: string;
  readonly type: DataSourceType;
  readonly category: DataSourceCategory;
  readonly status: ConnectionStatus;
  readonly health: DataHealth;
  readonly rows: string;
  readonly objectsConnected: readonly string[];
  readonly lastSync: string;
  readonly owner: string;
  readonly notes: string;
};

export type ExecutiveDataMapping = {
  readonly id: string;
  readonly sourceId: string;
  readonly sourceColumn: string;
  readonly objectId: Exs1ObjectId | null;
  readonly objectLabel: string;
  readonly status: MappingStatus;
};

export type DataHistoryEvent = {
  readonly id: string;
  readonly when: string;
  readonly title: string;
  readonly summary: string;
};

export type DataJournalEntry = {
  readonly id: string;
  readonly sourceId: string;
  readonly sourceName: string;
  readonly connection: ConnectionStatus;
  readonly mappingsSummary: string;
  readonly summary: string;
  readonly createdDate: string;
};

export type DataTimelinePack = {
  readonly id: string;
  readonly title: string;
  readonly sourceId: string;
  readonly risk: "warning" | "risk" | "success";
};

export const DATA_TRANSITION_MS = 250;

export const CONNECTION_STATUS_COLOR: Record<ConnectionStatus, string> = {
  Connected: "#12B76A",
  Disconnected: "#667085",
  Warning: "#FDB022",
  Syncing: "#1570EF",
};

export const DATA_HEALTH_COLOR: Record<DataHealth, string> = {
  Healthy: "#12B76A",
  Warning: "#FDB022",
  Disconnected: "#667085",
  Pending: "#53B1FD",
};

export const SOURCE_TYPE_OPTIONS: readonly DataSourceCategory[] = [
  "CSV",
  "Excel",
  "Database",
  "API",
  "Cloud Storage",
  "Enterprise System",
];

const initialSources = [
  {
    id: "source-sales-csv",
    name: "sales.csv",
    type: "CSV",
    category: "CSV",
    status: "Connected",
    health: "Healthy",
    rows: "248,000",
    objectsConnected: ["Revenue", "Customer"],
    lastSync: "Today",
    owner: "Finance · Nova",
    notes: "Weekly commercial extract for Capacity Expansion monitoring.",
  },
  {
    id: "source-inventory-sap",
    name: "SAP Inventory",
    type: "SAP",
    category: "Enterprise System",
    status: "Warning",
    health: "Warning",
    rows: "91,400",
    objectsConnected: ["Inventory"],
    lastSync: "Yesterday",
    owner: "Operations · Nova",
    notes: "Cover days lag the expected recovery band.",
  },
  {
    id: "source-supplier-api",
    name: "Supplier Reliability API",
    type: "REST API",
    category: "API",
    status: "Connected",
    health: "Healthy",
    rows: "12,880",
    objectsConnected: ["Supplier"],
    lastSync: "2 days ago",
    owner: "Supply · Nova",
    notes: "On-time reliability feed for inbound risk.",
  },
  {
    id: "source-warehouse-pg",
    name: "Warehouse PostgreSQL",
    type: "PostgreSQL",
    category: "Database",
    status: "Syncing",
    health: "Pending",
    rows: "54,210",
    objectsConnected: ["Inventory", "Factory"],
    lastSync: "Syncing…",
    owner: "Data Platform · Nova",
    notes: "Mock sync in progress — no runtime driver.",
  },
  {
    id: "source-powerbi",
    name: "Executive Power BI",
    type: "Power BI",
    category: "Cloud Storage",
    status: "Disconnected",
    health: "Disconnected",
    rows: "—",
    objectsConnected: [],
    lastSync: "7 days ago",
    owner: "COO Office",
    notes: "Awaiting reconnect for board pack visuals.",
  },
] as const satisfies readonly ExecutiveDataSource[];

export const INITIAL_DATA_SOURCES = Object.freeze(initialSources);

const initialMappings = [
  {
    id: "map-revenue",
    sourceId: "source-sales-csv",
    sourceColumn: "Revenue",
    objectId: "revenue",
    objectLabel: "Revenue",
    status: "Mapped",
  },
  {
    id: "map-customer",
    sourceId: "source-sales-csv",
    sourceColumn: "Customer",
    objectId: "customer",
    objectLabel: "Customer",
    status: "Mapped",
  },
  {
    id: "map-region",
    sourceId: "source-sales-csv",
    sourceColumn: "Region",
    objectId: null,
    objectLabel: "Region",
    status: "Suggested",
  },
  {
    id: "map-inventory",
    sourceId: "source-inventory-sap",
    sourceColumn: "Inventory Qty",
    objectId: "inventory",
    objectLabel: "Inventory",
    status: "Mapped",
  },
  {
    id: "map-supplier-score",
    sourceId: "source-supplier-api",
    sourceColumn: "Supplier Rating",
    objectId: null,
    objectLabel: "Supplier Rating",
    status: "Create Object",
  },
  {
    id: "map-warehouse",
    sourceId: "source-warehouse-pg",
    sourceColumn: "Warehouse",
    objectId: "inventory",
    objectLabel: "Inventory",
    status: "Mapped",
  },
] as const satisfies readonly ExecutiveDataMapping[];

export const INITIAL_DATA_MAPPINGS = Object.freeze(initialMappings);

const initialHistory = [
  {
    id: "hist-1",
    when: "Today",
    title: "CSV Imported",
    summary: "sales.csv connected · 248,000 rows (mock).",
  },
  {
    id: "hist-2",
    when: "Yesterday",
    title: "SAP Sync",
    summary: "SAP Inventory reported Warning health (mock).",
  },
  {
    id: "hist-3",
    when: "2 days ago",
    title: "API Connected",
    summary: "Supplier Reliability API linked to Supplier object.",
  },
] as const satisfies readonly DataHistoryEvent[];

export const INITIAL_DATA_HISTORY = Object.freeze(initialHistory);

export const MOCK_PREVIEW = Object.freeze({
  columns: ["Revenue", "Customer", "Region", "Units", "Supplier Rating"],
  sampleRows: [
    ["112", "Acme Retail", "West", "840", "4.2"],
    ["98", "Northline", "East", "610", "3.8"],
    ["121", "Harbor Co", "Central", "920", "4.6"],
  ],
  detectedFields: ["Revenue", "Customer", "Region", "Supplier Rating"],
  estimatedRecords: "248,000",
});

export function filterSources(
  sources: readonly ExecutiveDataSource[],
  filter: DataFilter,
  query: string,
): ExecutiveDataSource[] {
  const q = query.trim().toLowerCase();
  return sources.filter((source) => {
    const matchesFilter =
      filter === "All"
        ? true
        : filter === "Connected"
          ? source.status === "Connected"
          : filter === "CSV"
            ? source.category === "CSV" || source.type === "CSV"
            : filter === "Database"
              ? source.category === "Database" ||
                ["SQL", "PostgreSQL", "MySQL", "Oracle"].includes(source.type)
              : filter === "API"
                ? source.category === "API" || source.type === "REST API"
                : source.status === "Warning" || source.health === "Warning";
    if (!matchesFilter) return false;
    if (!q) return true;
    return (
      source.name.toLowerCase().includes(q) ||
      source.type.toLowerCase().includes(q) ||
      source.objectsConnected.some((o) => o.toLowerCase().includes(q)) ||
      source.owner.toLowerCase().includes(q)
    );
  });
}

export function createDataSource(input: {
  readonly name: string;
  readonly category: DataSourceCategory;
}): ExecutiveDataSource {
  const typeMap: Record<DataSourceCategory, DataSourceType> = {
    CSV: "CSV",
    Excel: "Excel",
    Database: "PostgreSQL",
    API: "REST API",
    "Cloud Storage": "SharePoint",
    "Enterprise System": "SAP",
  };
  return {
    id: `source-${Date.now().toString(36)}`,
    name: input.name.trim() || "new-source.csv",
    type: typeMap[input.category],
    category: input.category,
    status: "Connected",
    health: "Healthy",
    rows: "12,400",
    objectsConnected: ["Revenue"],
    lastSync: "Just now",
    owner: "Executive · Nova",
    notes: "Added through Executive Data Wizard (mock).",
  };
}

export function toDataJournalEntry(
  source: ExecutiveDataSource,
  mappingsCount: number,
): DataJournalEntry {
  return {
    id: `journal-data-${source.id}`,
    sourceId: source.id,
    sourceName: source.name,
    connection: source.status,
    mappingsSummary: `${mappingsCount} mappings reviewed`,
    summary: `Data · ${source.name} · ${source.type} · ${source.status}`,
    createdDate: new Date().toISOString().slice(0, 10),
  };
}

export function toDataTimelinePack(
  source: ExecutiveDataSource,
): DataTimelinePack {
  return {
    id: `pack-data-${source.id}`,
    title: `Data · ${source.name}`,
    sourceId: source.id,
    risk:
      source.health === "Warning" || source.status === "Warning"
        ? "warning"
        : source.status === "Disconnected"
          ? "risk"
          : "success",
  };
}
