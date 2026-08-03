/**
 * Phase C — DevTools bridge for Connector inspector fields.
 */

export type ConnectorInspectorSnapshot = {
  readonly connectorStatus: string;
  readonly sessionLifecycle: string | null;
  readonly publishedSources: number;
  readonly lastPublish: string | null;
  readonly validationResult: string | null;
};

let snapshot: ConnectorInspectorSnapshot | null = null;
const listeners = new Set<() => void>();

export function publishConnectorInspectorSnapshot(
  next: ConnectorInspectorSnapshot,
): void {
  snapshot = next;
  listeners.forEach((listener) => listener());
}

export function getConnectorInspectorSnapshot(): ConnectorInspectorSnapshot | null {
  return snapshot;
}

export function subscribeConnectorInspector(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}
