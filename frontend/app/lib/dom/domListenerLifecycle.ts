import { devLogOnSignatureChange, devLogOncePermanent } from "../runtime/diagnosticIdleGate";

export type DomListenerMeta = {
  component: string;
  elementId?: string | null;
  eventType: string;
};

function listenerSignature(meta: DomListenerMeta): string {
  return `${meta.component}:${meta.elementId ?? "window"}:${meta.eventType}`;
}

const stableListenerLogKeys = new Set<string>();

export function logDomListenerAttached(meta: DomListenerMeta): void {
  devLogOncePermanent("[Nexora][DOM][ListenerAttached]", listenerSignature(meta), meta, "info");
}

export function logDomListenerSkippedNull(meta: DomListenerMeta): void {
  devLogOnSignatureChange("[Nexora][DOM][ListenerSkippedNull]", listenerSignature(meta), meta, "info");
}

export function logDomListenerRemoved(meta: DomListenerMeta): void {
  devLogOncePermanent("[Nexora][DOM][ListenerRemoved]", listenerSignature(meta), meta, "info");
}

export function logDomListenerStable(meta: DomListenerMeta): void {
  const key = listenerSignature(meta);
  if (stableListenerLogKeys.has(key)) return;
  stableListenerLogKeys.add(key);
  devLogOncePermanent("[Nexora][DOMListenerStable]", key, meta, "info");
}

export type DomEventListener = (event: Event) => void;

export function attachDomListener(
  target: EventTarget | null | undefined,
  type: string,
  listener: DomEventListener | EventListenerOrEventListenerObject,
  options?: boolean | AddEventListenerOptions,
  meta?: DomListenerMeta
): boolean {
  if (!target) {
    if (meta) logDomListenerSkippedNull(meta);
    return false;
  }
  target.addEventListener(type, listener, options);
  if (meta) logDomListenerAttached(meta);
  return true;
}

export function detachDomListener(
  target: EventTarget | null | undefined,
  type: string,
  listener: DomEventListener | EventListenerOrEventListenerObject,
  options?: boolean | EventListenerOptions,
  meta?: DomListenerMeta
): void {
  if (!target) return;
  target.removeEventListener(type, listener, options);
  if (meta) logDomListenerRemoved(meta);
}

export function bindWindowListener(
  type: string,
  listener: DomEventListener | EventListenerOrEventListenerObject,
  options?: boolean | AddEventListenerOptions,
  meta?: DomListenerMeta
): () => void {
  if (typeof window === "undefined" || window == null) {
    if (meta) logDomListenerSkippedNull(meta);
    return () => {};
  }
  attachDomListener(window, type, listener, options, meta);
  return () => detachDomListener(window, type, listener, options, meta);
}

export function bindDocumentListener(
  type: string,
  listener: DomEventListener | EventListenerOrEventListenerObject,
  options?: boolean | AddEventListenerOptions,
  meta?: DomListenerMeta
): () => void {
  if (typeof document === "undefined" || document == null) {
    if (meta) logDomListenerSkippedNull(meta);
    return () => {};
  }
  attachDomListener(document, type, listener, options, meta);
  return () => detachDomListener(document, type, listener, options, meta);
}

export function bindMediaQueryListener(
  query: string,
  listener: (event: MediaQueryListEvent) => void,
  meta?: DomListenerMeta
): () => void {
  if (typeof window === "undefined" || window == null) {
    if (meta) logDomListenerSkippedNull(meta);
    return () => {};
  }
  const mq = window.matchMedia?.(query);
  if (!mq) {
    if (meta) logDomListenerSkippedNull(meta);
    return () => {};
  }
  if (typeof mq.addEventListener === "function") {
    attachDomListener(mq, "change", listener as EventListener, undefined, meta);
    return () => detachDomListener(mq, "change", listener as EventListener, undefined, meta);
  }
  mq.addListener(listener);
  if (meta) logDomListenerAttached(meta);
  return () => {
    mq.removeListener(listener);
    if (meta) logDomListenerRemoved(meta);
  };
}
