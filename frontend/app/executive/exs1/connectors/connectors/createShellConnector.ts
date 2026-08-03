/**
 * Phase C — Shared shell connector factory for non-CSV kinds.
 */

import type {
  ConnectorConnectInput,
  ConnectorDescriptor,
  ConnectorFieldMapping,
  ExecutiveConnector,
} from "../ExecutiveConnectorContracts";

export function createShellConnector(
  descriptor: Omit<ConnectorDescriptor, "version" | "enabled" | "owner" | "shell"> & {
    readonly version?: string;
    readonly enabled?: boolean;
    readonly owner?: string;
  },
): ExecutiveConnector {
  const full: ConnectorDescriptor = {
    version: descriptor.version ?? "0.1.0-shell",
    enabled: descriptor.enabled ?? true,
    owner: descriptor.owner ?? "Data Platform · Nova",
    shell: true,
    id: descriptor.id,
    kind: descriptor.kind,
    family: descriptor.family,
    name: descriptor.name,
    description: descriptor.description,
  };

  async function unsupported(action: string): Promise<never> {
    throw new Error(
      `${full.name} is a connector shell — ${action} is not available in Phase C.`,
    );
  }

  return {
    descriptor: full,
    async connect(_input?: ConnectorConnectInput) {
      await unsupported("connect");
    },
    async disconnect() {
      /* no-op for shells */
    },
    async validate() {
      return {
        ok: false,
        messages: [
          {
            code: "UnsupportedFormat",
            severity: "error",
            message: `${full.name} is not implemented yet.`,
          },
        ],
      };
    },
    async discoverSchema() {
      return unsupported("discoverSchema");
    },
    async preview() {
      return unsupported("preview");
    },
    async publish(_input: {
      readonly mappings: readonly ConnectorFieldMapping[];
      readonly approvedBy: string;
    }) {
      return unsupported("publish");
    },
    async health() {
      return {
        state: "Disconnected",
        detail: "Connector shell — awaiting implementation.",
        checkedAt: Date.now(),
      };
    },
  };
}
