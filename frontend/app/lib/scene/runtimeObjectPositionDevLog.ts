/**
 * AUDIT-REMOVE: Dev-only unified runtime position provider verification logs.
 */

const loggedPositionProviderSignatures = new Set<string>();
const loggedConnectionProviderSignatures = new Set<string>();

function isDev(): boolean {
  return typeof process === "undefined" || process.env.NODE_ENV !== "production";
}

export function logRuntimeObjectPositionProvider(input: {
  objectId: string;
  provider: string;
  position: { x: number; y: number; z: number };
}): void {
  if (!isDev()) return;
  const signature = `${input.objectId}|${input.provider}|${input.position.x.toFixed(3)},${input.position.y.toFixed(3)},${input.position.z.toFixed(3)}`;
  if (loggedPositionProviderSignatures.has(signature)) return;
  loggedPositionProviderSignatures.add(signature);
  globalThis.console?.debug?.("[NEXORA_POSITION_PROVIDER]", {
    objectId: input.objectId,
    provider: input.provider,
    position: input.position,
  });
}

export function logConnectionRuntimeProviders(input: {
  connectionId: string;
  sourceProvider: string;
  targetProvider: string;
}): void {
  if (!isDev()) return;
  const signature = `${input.connectionId}|${input.sourceProvider}|${input.targetProvider}`;
  if (loggedConnectionProviderSignatures.has(signature)) return;
  loggedConnectionProviderSignatures.add(signature);
  globalThis.console?.debug?.("[NEXORA_CONNECTION_PROVIDER]", {
    connectionId: input.connectionId,
    sourceProvider: input.sourceProvider,
    targetProvider: input.targetProvider,
  });
}

export function resetRuntimeObjectPositionDevLogsForTests(): void {
  loggedPositionProviderSignatures.clear();
  loggedConnectionProviderSignatures.clear();
}
