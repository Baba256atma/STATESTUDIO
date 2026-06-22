export type ObjectClickSceneWriteGuardAction =
  | "allowed"
  | "selection_only"
  | "structural_write_blocked";

export type ObjectClickSceneWriteGuardResult = Readonly<{
  allowed: boolean;
  action: ObjectClickSceneWriteGuardAction;
  reason: string;
  structuralMutation: boolean;
  selectionMutation: boolean;
}>;

export type ObjectClickSelectionTransaction = Readonly<{
  objectId: string;
  eventId: string;
  startedAt: number;
}>;

let activeObjectClickSelectionTransaction: ObjectClickSelectionTransaction | null = null;

function asRecord(value: unknown): Record<string, unknown> | null {
  return value && typeof value === "object" ? (value as Record<string, unknown>) : null;
}

export function isObjectClickSceneWriteSource(source: string | null | undefined): boolean {
  const normalized = String(source ?? "").trim();
  if (!normalized) return false;
  return (
    normalized === "object_click" ||
    normalized.startsWith("object_click:") ||
    normalized === "pointer_object_click" ||
    normalized.startsWith("pointer_object_click:")
  );
}

export function beginObjectClickSelectionTransaction(input: {
  objectId: string;
  eventId: string;
  startedAt?: number;
}): void {
  activeObjectClickSelectionTransaction = Object.freeze({
    objectId: input.objectId,
    eventId: input.eventId,
    startedAt: input.startedAt ?? Date.now(),
  });
}

export function endObjectClickSelectionTransaction(eventId?: string | null): void {
  if (!activeObjectClickSelectionTransaction) return;
  if (eventId && activeObjectClickSelectionTransaction.eventId !== eventId) return;
  activeObjectClickSelectionTransaction = null;
}

export function getActiveObjectClickSelectionTransaction(): ObjectClickSelectionTransaction | null {
  return activeObjectClickSelectionTransaction;
}

export function isObjectClickSelectionTransactionActive(): boolean {
  return activeObjectClickSelectionTransaction != null;
}

export function readRelationshipIdsForSceneParity(sceneJson: unknown): readonly string[] {
  const sceneRecord = asRecord(asRecord(sceneJson)?.scene);
  const relationships = Array.isArray(sceneRecord?.relationships) ? sceneRecord.relationships : [];
  return Object.freeze(
    relationships
      .map((relationship: unknown) => String(asRecord(relationship)?.id ?? "").trim())
      .filter(Boolean)
      .sort((a, b) => a.localeCompare(b))
  );
}

function stableObjectIds(sceneJson: unknown): string[] {
  const objects = Array.isArray(asRecord(asRecord(sceneJson)?.scene)?.objects)
    ? (asRecord(asRecord(sceneJson)?.scene)?.objects as unknown[])
    : [];
  return objects
    .map((obj: unknown, idx: number) => {
      const record = asRecord(obj);
      return String(record?.id ?? record?.name ?? `${record?.type ?? "obj"}:${idx}`);
    })
    .filter(Boolean)
    .sort((a, b) => a.localeCompare(b));
}

function buildStructuralSceneSignature(sceneJson: unknown): string {
  const sceneRecord = asRecord(asRecord(sceneJson)?.scene);
  const relationshipIds = readRelationshipIdsForSceneParity(sceneJson);
  const loops = Array.isArray(sceneRecord?.loops) ? sceneRecord.loops : [];
  const scenarios = Array.isArray(sceneRecord?.scenarios) ? sceneRecord.scenarios : [];
  return JSON.stringify({
    objectIds: stableObjectIds(sceneJson),
    relationshipIds,
    activeLoop: sceneRecord?.active_loop ?? null,
    activeScenario: sceneRecord?.active_scenario ?? sceneRecord?.selectedScenarioId ?? null,
    loopCount: loops.length,
    scenarioCount: scenarios.length,
  });
}

function buildSelectionSceneSignature(sceneJson: unknown): string {
  return JSON.stringify(asRecord(sceneJson)?.object_selection ?? null);
}

export function classifySceneWriteMutation(input: {
  prev: unknown;
  next: unknown;
}): Readonly<{ structuralMutation: boolean; selectionMutation: boolean }> {
  const structuralMutation =
    buildStructuralSceneSignature(input.prev) !== buildStructuralSceneSignature(input.next);
  const selectionMutation =
    buildSelectionSceneSignature(input.prev) !== buildSelectionSceneSignature(input.next);
  return { structuralMutation, selectionMutation };
}

export function evaluateObjectClickSceneWriteGuard(input: {
  source: string;
  prev: unknown;
  next: unknown;
  transactionActive?: boolean;
}): ObjectClickSceneWriteGuardResult {
  const { structuralMutation, selectionMutation } = classifySceneWriteMutation({
    prev: input.prev,
    next: input.next,
  });
  const hasMutation = structuralMutation || selectionMutation;
  if (!hasMutation) {
    return {
      allowed: true,
      action: "allowed",
      reason: "no_scene_mutation",
      structuralMutation,
      selectionMutation,
    };
  }

  const objectClickSource = isObjectClickSceneWriteSource(input.source);
  const transactionActive = input.transactionActive ?? isObjectClickSelectionTransactionActive();
  if (!objectClickSource && !(transactionActive && structuralMutation)) {
    return {
      allowed: true,
      action: "allowed",
      reason: "non_object_click_source",
      structuralMutation,
      selectionMutation,
    };
  }

  if (structuralMutation) {
    return {
      allowed: false,
      action: "structural_write_blocked",
      reason: objectClickSource ? "selection_only" : "object_click_transaction",
      structuralMutation,
      selectionMutation,
    };
  }

  return {
    allowed: false,
    action: "selection_only",
    reason: "selection_only",
    structuralMutation,
    selectionMutation,
  };
}

export function traceObjectClickSceneWriteGuard(
  input: ObjectClickSceneWriteGuardResult & {
    source: string;
    selectedObjectId?: string | null;
    relationshipIds?: readonly string[];
  }
): void {
  if (process.env.NODE_ENV === "production") return;
  if (input.allowed) return;
  globalThis.console?.warn?.("[NexoraLoopGuard]", {
    source: "object_click",
    action: input.action === "selection_only" ? "structural_write_blocked" : input.action,
    reason: input.reason,
    selectedObjectId: input.selectedObjectId ?? null,
    relationshipIds: input.relationshipIds ?? [],
    writeSource: input.source,
    structuralMutation: input.structuralMutation,
    selectionMutation: input.selectionMutation,
  });
}

export function resetObjectClickSelectionReadOnlyGuardForTests(): void {
  activeObjectClickSelectionTransaction = null;
}
