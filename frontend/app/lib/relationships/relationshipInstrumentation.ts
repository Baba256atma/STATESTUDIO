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

export function logRelationshipCreated(payload: {
  relationshipId: string;
  sourceId: string;
  targetId: string;
  type: string;
  direction: string;
}): void {
  devLogEvent("[Nexora][RelationshipCreated]", payload);
}

export function logRelationshipRemoved(payload: {
  relationshipId: string;
  sourceId: string;
  targetId: string;
  type: string;
}): void {
  devLogEvent("[Nexora][RelationshipRemoved]", payload);
}

export function logRelationshipDeleted(payload: {
  relationshipId: string;
  sourceId: string;
  targetId: string;
  type: string;
}): void {
  devLogEvent("[Nexora][RelationshipDeleted]", payload);
}

export function logRelationshipValidated(payload: {
  valid: boolean;
  sourceId: string;
  targetId: string;
  type: string;
  direction: string;
  reason?: string;
}): void {
  devLogOnce(
    `relationship-validated-${payload.sourceId}-${payload.targetId}-${payload.type}-${payload.valid}`,
    "[Nexora][RelationshipValidated]",
    payload
  );
}

export function logRelationshipRendered(payload: {
  relationshipId: string;
  sourceId: string;
  targetId: string;
  type: string;
}): void {
  devLogOnce(
    `relationship-rendered-${payload.relationshipId}`,
    "[Nexora][RelationshipRendered]",
    payload
  );
}

export function logRelationshipSelected(payload: {
  relationshipId?: string;
  sourceId: string;
  targetId?: string;
  type?: string;
  source: string;
}): void {
  devLogEvent("[Nexora][RelationshipSelected]", payload);
}

export function logRelationshipPreview(payload: {
  sourceId: string;
  targetId: string;
  type: string;
  direction: string;
}): void {
  devLogOnce(
    `relationship-preview-${payload.sourceId}-${payload.targetId}-${payload.type}`,
    "[Nexora][RelationshipPreview]",
    payload
  );
}

export function logRelationshipBuilderOpened(source: string, sourceObjectId: string | null): void {
  devLogEvent("[Nexora][RelationshipBuilderOpened]", { source, sourceObjectId });
}

export function logRelationshipBuilderClosed(source: string): void {
  devLogEvent("[Nexora][RelationshipBuilderClosed]", { source });
}

export function resetRelationshipInstrumentationForTests(): void {
  loggedKeys.clear();
}
