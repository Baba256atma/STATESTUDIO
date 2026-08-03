/**
 * Phase C — Database connector shells (PostgreSQL / MySQL / SQL Server / Oracle).
 */

import type { ConnectorKind, ExecutiveConnector } from "../ExecutiveConnectorContracts";
import { createShellConnector } from "./createShellConnector";

export function createDatabaseConnector(
  kind: Extract<
    ConnectorKind,
    "PostgreSQL" | "MySQL" | "SQL Server" | "Oracle"
  > = "PostgreSQL",
): ExecutiveConnector {
  const id = `connector-${kind.toLowerCase().replace(/\s+/g, "-")}`;
  return createShellConnector({
    id,
    kind,
    family: "Database",
    name: `${kind} Connector`,
    description: `Shell — ${kind} intake reserved for a later phase.`,
  });
}
