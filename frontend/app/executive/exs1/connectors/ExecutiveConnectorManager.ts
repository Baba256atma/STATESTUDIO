/**
 * Phase C — Connector Manager (register, enable, health, version, status).
 */

import type {
  ConnectorDescriptor,
  ConnectorHealthReport,
  ExecutiveConnector,
} from "./ExecutiveConnectorContracts";
import {
  createConnectorRegistry,
  type ExecutiveConnectorRegistry,
} from "./ExecutiveConnectorRegistry";

export type ManagedConnectorStatus = {
  readonly descriptor: ConnectorDescriptor;
  readonly health: ConnectorHealthReport;
  readonly lastSync: string | null;
  readonly rows: string | null;
  readonly mappedObjects: readonly string[];
  readonly connectionStatus: "Connected" | "Disconnected" | "Error" | "Shell";
};

export type ExecutiveConnectorManager = {
  readonly registry: ExecutiveConnectorRegistry;
  readonly listDescriptors: () => readonly ConnectorDescriptor[];
  readonly getConnector: (id: string) => ExecutiveConnector | null;
  readonly register: (connector: ExecutiveConnector) => void;
  readonly enable: (id: string) => void;
  readonly disable: (id: string) => void;
  readonly refreshHealth: (id: string) => Promise<ConnectorHealthReport>;
  readonly snapshotStatuses: (
    extras?: ReadonlyMap<string, Partial<ManagedConnectorStatus>>,
  ) => Promise<ManagedConnectorStatus[]>;
};

export function createConnectorManager(
  registry: ExecutiveConnectorRegistry = createConnectorRegistry(),
): ExecutiveConnectorManager {
  return {
    registry,
    listDescriptors: () => registry.descriptors(),
    getConnector: (id) => registry.get(id),
    register: (connector) => registry.register(connector),
    enable: (id) => registry.setEnabled(id, true),
    disable: (id) => registry.setEnabled(id, false),
    async refreshHealth(id) {
      const connector = registry.get(id);
      if (!connector) {
        return {
          state: "Disconnected",
          detail: "Unknown connector",
          checkedAt: Date.now(),
        };
      }
      return connector.health();
    },
    async snapshotStatuses(extras) {
      const items: ManagedConnectorStatus[] = [];
      for (const connector of registry.list()) {
        const health = await connector.health();
        const extra = extras?.get(connector.descriptor.id);
        items.push({
          descriptor: connector.descriptor,
          health: extra?.health ?? health,
          lastSync: extra?.lastSync ?? null,
          rows: extra?.rows ?? null,
          mappedObjects: extra?.mappedObjects ?? [],
          connectionStatus:
            extra?.connectionStatus ??
            (connector.descriptor.shell
              ? "Shell"
              : health.state === "Healthy"
                ? "Connected"
                : health.state === "Disconnected"
                  ? "Disconnected"
                  : "Error"),
        });
      }
      return items;
    },
  };
}
