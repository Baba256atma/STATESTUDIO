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

export function logExecutiveRelationship(payload: Record<string, unknown>): void {
  devLogEvent("[Nexora][Relationship]", payload);
}

export function logRelationshipFocus(payload: Record<string, unknown>): void {
  devLogEvent("[Nexora][RelationshipFocus]", payload);
}

export function logRelationshipDensity(payload: Record<string, unknown>): void {
  devLogOnce(`density-${payload.mode ?? "executive"}-${payload.visibleCount ?? 0}`, "[Nexora][RelationshipDensity]", payload);
}

export function logRelationshipClassification(payload: Record<string, unknown>): void {
  devLogOnce(`class-${payload.relationshipId ?? "unknown"}-${payload.classification ?? "unknown"}`, "[Nexora][RelationshipClassification]", payload);
}

export function logRelationshipContext(payload: Record<string, unknown>): void {
  devLogEvent("[Nexora][RelationshipContext]", payload);
}

export function logRelationshipPropagationContract(payload: Record<string, unknown>): void {
  devLogOnce(`propagation-${payload.relationshipId ?? "unknown"}`, "[Nexora][PropagationContract]", payload);
}

export function resetExecutiveRelationshipInstrumentationForTests(): void {
  loggedKeys.clear();
}
