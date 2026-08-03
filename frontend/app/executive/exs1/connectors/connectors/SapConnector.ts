/**
 * Phase C — ERP connector shells (SAP / Dynamics).
 */

import type { ConnectorKind, ExecutiveConnector } from "../ExecutiveConnectorContracts";
import { createShellConnector } from "./createShellConnector";

export function createSapConnector(
  kind: Extract<ConnectorKind, "SAP" | "Microsoft Dynamics"> = "SAP",
): ExecutiveConnector {
  return createShellConnector({
    id: `connector-${kind.toLowerCase().replace(/\s+/g, "-")}`,
    kind,
    family: "ERP",
    name: `${kind} Connector`,
    description: `Shell — ${kind} ERP intake reserved for a later phase.`,
  });
}
