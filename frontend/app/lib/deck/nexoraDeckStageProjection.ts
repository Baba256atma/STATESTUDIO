/**
 * Deck Stage projection.
 * One canonical subject per Workspace Dataset. Decks choose membership.
 * The subject id is the existing Decision Theatre data-object id.
 */
import { deriveNexoraDecisionTheatreDataObjectId } from "../decision-theatre/nexoraDecisionTheatreDataObjectProjection.ts";

export type CanonicalStageObjectIdentity = Readonly<{
  workspaceId: string;
  datasetId: string;
  objectId: string;
}>;

export type DeckStageDatasetAvailability = "loaded" | "loading" | "missing";

export type DeckStageDatasetRecord = Readonly<{
  workspaceId: string;
  datasetId: string;
  availability: DeckStageDatasetAvailability;
  contentRevision: string | null;
}>;

export type DeckStageProjectionReference = Readonly<{
  workspaceId: string;
  deckId: string;
  datasetId: string;
}>;

export type DeckStageProjectedObject = Readonly<{
  identity: CanonicalStageObjectIdentity;
  contentRevision: string;
}>;

export type DeckStageProjectionStatus =
  | "inactive"
  | "archived"
  | "loading"
  | "empty"
  | "projected";

export type DeckStageProjection = Readonly<{
  status: DeckStageProjectionStatus;
  objects: readonly DeckStageProjectedObject[];
  pendingDatasetIds: readonly string[];
}>;

const EMPTY = Object.freeze({
  objects: Object.freeze([]),
  pendingDatasetIds: Object.freeze([]),
});

export function canonicalStageObjectIdentity(
  workspaceId: string,
  datasetId: string,
): CanonicalStageObjectIdentity {
  return Object.freeze({
    workspaceId,
    datasetId,
    objectId: deriveNexoraDecisionTheatreDataObjectId(workspaceId, datasetId),
  });
}

export function retainDeckStageSelection(
  selectedId: string | null,
  objectIds: readonly string[],
): string | null {
  if (selectedId == null) return null;
  return objectIds.includes(selectedId) ? selectedId : null;
}

export function resolveDeckStageProjection(input: {
  readonly workspaceId: string;
  readonly deck: Readonly<{ deckId: string; workspaceId: string; status: "ACTIVE" | "ARCHIVED" }> | null;
  readonly references: readonly DeckStageProjectionReference[];
  readonly datasets: readonly DeckStageDatasetRecord[];
}): DeckStageProjection {
  if (input.deck == null || input.deck.workspaceId !== input.workspaceId) {
    return Object.freeze({ status: "inactive", ...EMPTY });
  }
  if (input.deck.status !== "ACTIVE") {
    return Object.freeze({ status: "archived", ...EMPTY });
  }
  const datasetById = new Map(
    input.datasets
      .filter((dataset) => dataset.workspaceId === input.workspaceId)
      .map((dataset) => [dataset.datasetId, dataset]),
  );
  const datasetIds = [...new Set(
    input.references
      .filter((reference) => reference.workspaceId === input.workspaceId && reference.deckId === input.deck!.deckId)
      .map((reference) => reference.datasetId),
  )].sort();
  const objects: DeckStageProjectedObject[] = [];
  const pending: string[] = [];
  const seen = new Set<string>();
  for (const datasetId of datasetIds) {
    const dataset = datasetById.get(datasetId);
    if (dataset == null || dataset.availability === "missing" || dataset.workspaceId !== input.workspaceId) continue;
    if (dataset.availability === "loading" || dataset.contentRevision == null) {
      pending.push(datasetId);
      continue;
    }
    const identity = canonicalStageObjectIdentity(input.workspaceId, dataset.datasetId);
    if (seen.has(identity.objectId)) continue;
    seen.add(identity.objectId);
    objects.push(Object.freeze({ identity, contentRevision: dataset.contentRevision }));
  }
  const pendingDatasetIds = Object.freeze(pending);
  if (objects.length > 0) {
    return Object.freeze({
      status: "projected",
      objects: Object.freeze(objects),
      pendingDatasetIds,
    });
  }
  if (pendingDatasetIds.length > 0) {
    return Object.freeze({ status: "loading", objects: Object.freeze([]), pendingDatasetIds });
  }
  return Object.freeze({ status: "empty", objects: Object.freeze([]), pendingDatasetIds });
}
