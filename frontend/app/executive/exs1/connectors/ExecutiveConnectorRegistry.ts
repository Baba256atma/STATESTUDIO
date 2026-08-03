/**
 * Phase C — Connector registration catalogue.
 */

import { createCsvConnector } from "./connectors/CsvConnector";
import { createDatabaseConnector } from "./connectors/DatabaseConnector";
import { createExcelConnector } from "./connectors/ExcelConnector";
import { createRestApiConnector } from "./connectors/RestApiConnector";
import { createSapConnector } from "./connectors/SapConnector";
import { createShellConnector } from "./connectors/createShellConnector";
import type {
  ConnectorDescriptor,
  ExecutiveConnector,
} from "./ExecutiveConnectorContracts";

export function createDefaultConnectors(): ExecutiveConnector[] {
  return [
    createCsvConnector(),
    createExcelConnector(),
    createRestApiConnector(),
    createDatabaseConnector("PostgreSQL"),
    createDatabaseConnector("MySQL"),
    createDatabaseConnector("SQL Server"),
    createDatabaseConnector("Oracle"),
    createSapConnector("SAP"),
    createSapConnector("Microsoft Dynamics"),
    createShellConnector({
      id: "connector-sharepoint",
      kind: "SharePoint",
      family: "Cloud",
      name: "SharePoint Connector",
      description: "Shell — SharePoint intake reserved for a later phase.",
    }),
    createShellConnector({
      id: "connector-google-sheets",
      kind: "Google Sheets",
      family: "Cloud",
      name: "Google Sheets Connector",
      description: "Shell — Google Sheets intake reserved for a later phase.",
    }),
    createShellConnector({
      id: "connector-manual-dataset",
      kind: "Manual Dataset",
      family: "CSV",
      name: "Manual Dataset Connector",
      description: "Shell — manual dataset paste reserved for a later phase.",
    }),
  ];
}

export type ExecutiveConnectorRegistry = {
  readonly list: () => readonly ExecutiveConnector[];
  readonly descriptors: () => readonly ConnectorDescriptor[];
  readonly get: (id: string) => ExecutiveConnector | null;
  readonly register: (connector: ExecutiveConnector) => void;
  readonly setEnabled: (id: string, enabled: boolean) => void;
};

export function createConnectorRegistry(
  initial: readonly ExecutiveConnector[] = createDefaultConnectors(),
): ExecutiveConnectorRegistry {
  const map = new Map<string, ExecutiveConnector>();
  initial.forEach((c) => map.set(c.descriptor.id, c));

  return {
    list: () => Array.from(map.values()),
    descriptors: () => Array.from(map.values()).map((c) => c.descriptor),
    get: (id) => map.get(id) ?? null,
    register: (connector) => {
      map.set(connector.descriptor.id, connector);
    },
    setEnabled: (id, enabled) => {
      const current = map.get(id);
      if (!current) return;
      map.set(id, {
        ...current,
        descriptor: { ...current.descriptor, enabled },
      });
    },
  };
}
