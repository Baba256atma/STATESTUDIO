/**
 * Phase C — Excel connector shell (not fully functional).
 */

import type { ExecutiveConnector } from "../ExecutiveConnectorContracts";
import { createShellConnector } from "./createShellConnector";

export function createExcelConnector(): ExecutiveConnector {
  return createShellConnector({
    id: "connector-excel",
    kind: "Excel",
    family: "Excel",
    name: "Excel Workbook Connector",
    description: "Shell — Excel intake reserved for a later phase.",
  });
}
