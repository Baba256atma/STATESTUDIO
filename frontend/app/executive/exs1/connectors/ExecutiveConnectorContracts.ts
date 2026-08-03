/**
 * Phase C — Unified Enterprise Connector contracts.
 * Trusted data intake only — no AI, sync, or ETL.
 */

import type { Exs1ObjectId } from "../exs1Types";
import type {
  DataSourceCategory,
  DataSourceType,
  ExecutiveDataMapping,
  ExecutiveDataSource,
} from "../data/ExecutiveDataConfig";

export type ConnectorKind =
  | "CSV"
  | "Excel"
  | "PostgreSQL"
  | "MySQL"
  | "SQL Server"
  | "Oracle"
  | "REST API"
  | "SAP"
  | "Microsoft Dynamics"
  | "SharePoint"
  | "Google Sheets"
  | "Manual Dataset";

export type ConnectorFamily = "CSV" | "Excel" | "Database" | "ERP" | "API" | "Cloud";

export type ConnectionLifecycle =
  | "Disconnected"
  | "Connecting"
  | "Connected"
  | "Validating"
  | "Preview Ready"
  | "Mapped"
  | "Approved"
  | "Published"
  | "Failed";

export type ConnectorHealthState =
  | "Healthy"
  | "Warning"
  | "Disconnected"
  | "Authentication Failed"
  | "Validation Failed";

export type ConnectorColumnType =
  | "string"
  | "number"
  | "boolean"
  | "date"
  | "unknown";

export type DiscoveredColumn = {
  readonly name: string;
  readonly type: ConnectorColumnType;
  readonly nullable: boolean;
  readonly sampleValues: readonly string[];
};

export type DiscoveredSchema = {
  readonly columns: readonly DiscoveredColumn[];
  readonly primaryKeyCandidates: readonly string[];
  readonly rowCount: number;
  readonly sampleRows: readonly (readonly string[])[];
  readonly sourceLabel: string;
};

export type SchemaPreviewStats = {
  readonly columnCount: number;
  readonly rowCount: number;
  readonly nullishSamples: number;
  readonly numericColumns: number;
};

export type ValidationSeverity = "error" | "warning" | "info";

export type ConnectorValidationMessage = {
  readonly code:
    | "MissingColumns"
    | "InvalidTypes"
    | "DuplicateIds"
    | "EmptyDataset"
    | "UnsupportedFormat";
  readonly severity: ValidationSeverity;
  readonly message: string;
};

export type ConnectorValidationResult = {
  readonly ok: boolean;
  readonly messages: readonly ConnectorValidationMessage[];
};

export type ConnectorFieldMapping = {
  readonly columnName: string;
  readonly detectedType: ConnectorColumnType;
  readonly metadataFieldId: string | null;
  readonly objectId: Exs1ObjectId | null;
  readonly objectLabel: string;
  readonly status: "Unmapped" | "Suggested" | "Mapped" | "Ignored";
};

export type ConnectorPublishResult = {
  readonly sourceId: string;
  readonly rowsImported: number;
  readonly objectsUpdated: readonly string[];
  readonly timestamp: number;
  readonly source: ExecutiveDataSource;
  readonly mappings: readonly ExecutiveDataMapping[];
};

export type ConnectorConnectInput = {
  readonly label?: string;
  /** CSV text or opaque connection descriptor for shells. */
  readonly payload?: string;
};

export type ConnectorDescriptor = {
  readonly id: string;
  readonly kind: ConnectorKind;
  readonly family: ConnectorFamily;
  readonly name: string;
  readonly version: string;
  readonly enabled: boolean;
  readonly owner: string;
  readonly description: string;
  readonly shell: boolean;
};

export type ConnectorHealthReport = {
  readonly state: ConnectorHealthState;
  readonly detail: string;
  readonly checkedAt: number;
};

/**
 * Standard connector interface — every connector implements this contract.
 */
export type ExecutiveConnector = {
  readonly descriptor: ConnectorDescriptor;
  connect(input?: ConnectorConnectInput): Promise<void>;
  disconnect(): Promise<void>;
  validate(): Promise<ConnectorValidationResult>;
  discoverSchema(): Promise<DiscoveredSchema>;
  preview(): Promise<{
    readonly schema: DiscoveredSchema;
    readonly stats: SchemaPreviewStats;
  }>;
  publish(input: {
    readonly mappings: readonly ConnectorFieldMapping[];
    readonly approvedBy: string;
  }): Promise<{
    readonly rowsImported: number;
    readonly objectsUpdated: readonly string[];
    readonly sourceName: string;
    readonly category: DataSourceCategory;
    readonly type: DataSourceType;
  }>;
  health(): Promise<ConnectorHealthReport>;
};

export type ConnectorFilter =
  | "All"
  | "Connected"
  | "Disconnected"
  | "Errors"
  | "CSV"
  | "Database"
  | "ERP"
  | "API";

export type ConnectorJournalEntry = {
  readonly id: string;
  readonly sourceId: string;
  readonly sourceName: string;
  readonly schemaSummary: string;
  readonly mappingsSummary: string;
  readonly objectsSummary: string;
  readonly published: boolean;
  readonly timestamp: string;
  readonly summary: string;
};
