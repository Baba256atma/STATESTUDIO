export type DecisionEvent =
  | { type: "CHAT_SUBMITTED"; payload: unknown }
  | { type: "INGESTION_COMPLETED"; payload: unknown }
  | { type: "SCANNER_COMPLETED"; payload: unknown };

type Listener = (event: DecisionEvent) => void;

const DEV = typeof process !== "undefined" && process.env.NODE_ENV !== "production";
const listeners = new Set<Listener>();
let lastEventSignature: string | null = null;
let lastEmitTime = 0;
let eventCount = 0;

function stableEventSignature(event: DecisionEvent): string {
  try {
    return JSON.stringify(event);
  } catch {
    return `${event.type}:${String(event.payload)}`;
  }
}

export function emitDecisionEvent(event: DecisionEvent): void {
  const now = Date.now();
  if (now - lastEmitTime < 50) return;
  const signature = stableEventSignature(event);
  if (signature === lastEventSignature) return;
  lastEmitTime = now;
  lastEventSignature = signature;
  eventCount += 1;
  if (DEV) {
    globalThis.console?.debug?.("[Nexora][EventBus]", event.type, eventCount);
  }
  for (const listener of listeners) {
    listener(event);
  }
}

export function subscribeDecisionEvent(listener: Listener): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}
