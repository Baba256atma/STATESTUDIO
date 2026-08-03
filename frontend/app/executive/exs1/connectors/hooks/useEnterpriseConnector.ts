"use client";

import { useContext } from "react";
import { ExecutiveConnectorContext } from "../ExecutiveConnectorProvider";

/**
 * Enterprise Connector hook — session, publish wizard, catalog filters.
 */
export function useEnterpriseConnector() {
  const value = useContext(ExecutiveConnectorContext);
  if (!value) {
    throw new Error(
      "useEnterpriseConnector must be used within ExecutiveConnectorProvider",
    );
  }
  return value;
}
