export type DomListenerMeta = {
  component: string;
  elementId?: string | null;
  eventType: string;
};

function devLog(event: string, payload?: Record<string, unknown>): void {
  if (process.env.NODE_ENV === "production") return;
  globalThis.console?.info?.(event, payload ?? {});
}

export function logDomListenerAttached(meta: DomListenerMeta): void {
  devLog("[Nexora][DOM][ListenerAttached]", meta);
}

export function logDomListenerSkippedNull(meta: DomListenerMeta): void {
  devLog("[Nexora][DOM][ListenerSkippedNull]", meta);
}

export function logDomListenerRemoved(meta: DomListenerMeta): void {
  devLog("[Nexora][DOM][ListenerRemoved]", meta);
}

export function attachDomListener(
  target: EventTarget | null | undefined,
  type: string,
  listener: EventListenerOrEventListenerObject,
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
  listener: EventListenerOrEventListenerObject,
  options?: boolean | EventListenerOptions,
  meta?: DomListenerMeta
): void {
  if (!target) return;
  target.removeEventListener(type, listener, options);
  if (meta) logDomListenerRemoved(meta);
}

export function bindWindowListener(
  type: string,
  listener: EventListenerOrEventListenerObject,
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
  listener: EventListenerOrEventListenerObject,
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
