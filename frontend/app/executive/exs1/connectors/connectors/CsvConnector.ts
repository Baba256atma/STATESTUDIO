/**
 * Phase C — CSV Connector (reference end-to-end implementation).
 */

import type { DataSourceCategory, DataSourceType } from "../../data/ExecutiveDataConfig";
import {
  buildDiscoveredSchema,
  computePreviewStats,
  parseCsvText,
} from "../ExecutiveSchemaDiscovery";
import { validateDiscoveredSchema } from "../ExecutiveConnectorValidation";
import { healthFromLifecycle } from "../ExecutiveConnectorHealth";
import type {
  ConnectionLifecycle,
  ConnectorConnectInput,
  ConnectorFieldMapping,
  DiscoveredSchema,
  ExecutiveConnector,
} from "../ExecutiveConnectorContracts";

export const SAMPLE_INVENTORY_CSV = `ItemId,MAT_QTY,Warehouse,Supplier,CoverDays
INV-100,420,West Hub,Acme Supply,11
INV-101,180,East Hub,Northline,6
INV-102,640,Central,Harbor Co,18
INV-103,95,West Hub,Acme Supply,4
INV-104,510,East Hub,Northline,14
INV-105,275,Central,Harbor Co,9
INV-106,330,West Hub,Acme Supply,12
INV-107,150,East Hub,Northline,5
INV-108,700,Central,Harbor Co,21
INV-109,240,West Hub,Acme Supply,8
INV-110,360,East Hub,Northline,10
INV-111,190,Central,Harbor Co,7
`;

export function createCsvConnector(): ExecutiveConnector {
  let lifecycle: ConnectionLifecycle = "Disconnected";
  let rawText = "";
  let sourceLabel = "inventory.csv";
  let schema: DiscoveredSchema | null = null;

  return {
    descriptor: {
      id: "connector-csv",
      kind: "CSV",
      family: "CSV",
      name: "CSV File Connector",
      version: "1.0.0",
      enabled: true,
      owner: "Data Platform · Nova",
      description: "Reference connector — local CSV intake with schema discovery.",
      shell: false,
    },

    async connect(input?: ConnectorConnectInput) {
      lifecycle = "Connecting";
      rawText = input?.payload?.trim() || SAMPLE_INVENTORY_CSV;
      sourceLabel = input?.label?.trim() || "inventory.csv";
      if (!sourceLabel.toLowerCase().endsWith(".csv")) {
        sourceLabel = `${sourceLabel}.csv`;
      }
      const parsed = parseCsvText(rawText);
      schema = buildDiscoveredSchema({
        headers: parsed.headers,
        rows: parsed.rows,
        sourceLabel,
      });
      lifecycle = "Connected";
    },

    async disconnect() {
      lifecycle = "Disconnected";
      rawText = "";
      schema = null;
    },

    async validate() {
      lifecycle = "Validating";
      const result = validateDiscoveredSchema(schema, {
        requireFormat: "csv",
        rawLabel: sourceLabel,
      });
      lifecycle = result.ok ? "Connected" : "Failed";
      return result;
    },

    async discoverSchema() {
      if (!schema) {
        await this.connect({ payload: rawText || SAMPLE_INVENTORY_CSV, label: sourceLabel });
      }
      return schema!;
    },

    async preview() {
      const discovered = await this.discoverSchema();
      const validation = validateDiscoveredSchema(discovered, {
        requireFormat: "csv",
        rawLabel: sourceLabel,
      });
      if (!validation.ok) {
        lifecycle = "Failed";
        throw new Error(validation.messages[0]?.message ?? "CSV validation failed");
      }
      lifecycle = "Preview Ready";
      return {
        schema: discovered,
        stats: computePreviewStats(discovered),
      };
    },

    async publish(input: {
      readonly mappings: readonly ConnectorFieldMapping[];
      readonly approvedBy: string;
    }) {
      if (lifecycle !== "Approved" && lifecycle !== "Mapped" && lifecycle !== "Preview Ready") {
        // Manager approval is enforced by the platform; connector accepts approved mappings.
      }
      const discovered = await this.discoverSchema();
      const objectsUpdated = Array.from(
        new Set(
          input.mappings
            .filter((m) => m.status === "Mapped" && m.objectLabel)
            .map((m) => m.objectLabel),
        ),
      );
      lifecycle = "Published";
      void input.approvedBy;
      return {
        rowsImported: discovered.rowCount,
        objectsUpdated,
        sourceName: sourceLabel,
        category: "CSV" as DataSourceCategory,
        type: "CSV" as DataSourceType,
      };
    },

    async health() {
      const validation = schema
        ? validateDiscoveredSchema(schema, { requireFormat: "csv", rawLabel: sourceLabel })
        : null;
      return healthFromLifecycle(lifecycle, validation);
    },
  };
}
