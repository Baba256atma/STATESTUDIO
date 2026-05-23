const loggedKeys = new Set<string>();

function devLogOnce(key: string, event: string, payload?: Record<string, unknown>): void {
  if (process.env.NODE_ENV === "production") return;
  if (loggedKeys.has(key)) return;
  loggedKeys.add(key);
  globalThis.console?.info?.(event, payload ?? {});
}

function devLogEvent(event: string, payload?: Record<string, unknown>): void {
  if (process.env.NODE_ENV === "production") return;
  globalThis.console?.info?.(event, payload ?? {});
}

export function logObjectCatalogOpened(source: string): void {
  devLogEvent("[Nexora][CatalogOpened]", { source });
}

export function logObjectCatalogClosed(source: string): void {
  devLogEvent("[Nexora][CatalogClosed]", { source });
}

export function logObjectCatalogSearch(payload: { query: string; matchCount: number }): void {
  devLogOnce(`catalog-search-${payload.query}-${payload.matchCount}`, "[Nexora][CatalogSearch]", payload);
}

export function logObjectCreated(payload: {
  objectId: string;
  category: string;
  source: string;
}): void {
  devLogEvent("[Nexora][ObjectCreated]", payload);
}

export function logObjectPlaced(payload: {
  objectId: string;
  category: string;
  position: [number, number, number];
  source: string;
}): void {
  devLogEvent("[Nexora][ObjectPlaced]", payload);
}

export function logObjectFocused(payload: { objectId: string; source: string }): void {
  devLogEvent("[Nexora][ObjectFocused]", payload);
}

export function logPlacementValidated(payload: {
  objectId: string;
  valid: boolean;
  reason?: string;
}): void {
  devLogOnce(
    `placement-validated-${payload.objectId}-${payload.valid}`,
    "[Nexora][PlacementValidated]",
    payload
  );
}

export function resetObjectCatalogInstrumentationForTests(): void {
  loggedKeys.clear();
}
