/**
 * Phase C — REST API connector shell.
 */

import type { ExecutiveConnector } from "../ExecutiveConnectorContracts";
import { createShellConnector } from "./createShellConnector";

export function createRestApiConnector(): ExecutiveConnector {
  return createShellConnector({
    id: "connector-rest-api",
    kind: "REST API",
    family: "API",
    name: "REST API Connector",
    description: "Shell — REST intake reserved for a later phase.",
  });
}
