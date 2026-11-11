/**
 * Assigns an existing Workspace CSV Dataset to a Deck.
 * The Dataset record stays in csvRealDataImportStore.
 */
import { getCsvRealDataImport, type CsvCommittedImport } from "../data-reality/csvRealDataImportStore.ts";
import { DEMO_WORKSPACE_ID } from "../workspace/workspaceRegistryContract.ts";
import { managerDeckWorkspaceEligible } from "./nexoraDeckRegistryAuthority.ts";
import { listWorkspaceDecks } from "./nexoraDeckRegistry.ts";
import {
  assignDatasetReference,
  getDeckDatasetReferenceSnapshot,
  listDatasetDeckReferences,
  listDeckDatasetReferences,
  removeDatasetReference,
  type DeckDatasetReference,
  type DeckDatasetReferenceFailure,
  type DeckDatasetReferenceResult,
} from "./nexoraDeckDatasetReferenceRegistry.ts";

export type WorkspaceDatasetIdentity = Readonly<{
  workspaceId: string;
  datasetId: string;
}>;

/** The CSV store key is the Dataset id. The file name is only a label. */
export function workspaceDatasetIdentity(committed: CsvCommittedImport): WorkspaceDatasetIdentity {
  return Object.freeze({
    workspaceId: committed.workspaceId,
    datasetId: committed.sourceContextId,
  });
}

function rejected<T>(reason: DeckDatasetReferenceFailure): DeckDatasetReferenceResult<T> {
  return Object.freeze({ ok: false, reason, snapshot: getDeckDatasetReferenceSnapshot() });
}

export function assignManagerDatasetReference(input: {
  readonly workspaceId: string;
  readonly deckId: string;
  readonly datasetId: string;
}): DeckDatasetReferenceResult<DeckDatasetReference> {
  if (!managerDeckWorkspaceEligible(input.workspaceId) || input.workspaceId === DEMO_WORKSPACE_ID) {
    return rejected("invalid-workspace");
  }
  const deck = listWorkspaceDecks(input.workspaceId).find((entry) => entry.deckId === input.deckId);
  if (!deck || deck.workspaceId !== input.workspaceId) return rejected("invalid-deck");
  if (deck.status !== "ACTIVE") return rejected("deck-archived");
  const dataset = getCsvRealDataImport(input.workspaceId, input.datasetId);
  if (!dataset) return rejected("dataset-missing");
  if (dataset.workspaceId !== input.workspaceId || dataset.sourceContextId !== input.datasetId) {
    return rejected("foreign-workspace");
  }
  return assignDatasetReference({
    workspaceId: input.workspaceId,
    deckId: input.deckId,
    datasetId: dataset.sourceContextId,
  });
}

export function removeManagerDatasetReference(input: {
  readonly workspaceId: string;
  readonly deckId: string;
  readonly datasetId: string;
}): DeckDatasetReferenceResult<DeckDatasetReference | null> {
  if (!managerDeckWorkspaceEligible(input.workspaceId)) return rejected("invalid-workspace");
  return removeDatasetReference(input);
}

export function resolveManagerDeckDataset(input: {
  readonly workspaceId: string;
  readonly deckId: string;
  readonly datasetId: string;
}): CsvCommittedImport | null {
  const reference = listDeckDatasetReferences(input.workspaceId, input.deckId)
    .find((entry) => entry.datasetId === input.datasetId);
  if (!reference) return null;
  const dataset = getCsvRealDataImport(reference.workspaceId, reference.datasetId);
  if (!dataset || dataset.workspaceId !== reference.workspaceId || dataset.sourceContextId !== reference.datasetId) {
    return null;
  }
  return dataset;
}

export function listManagerDeckDatasetIds(workspaceId: string, deckId: string): readonly string[] {
  if (!managerDeckWorkspaceEligible(workspaceId)) return Object.freeze([]);
  return Object.freeze(listDeckDatasetReferences(workspaceId, deckId).map((reference) => reference.datasetId));
}

export function listManagerDecksReferencingDataset(workspaceId: string, datasetId: string): readonly string[] {
  if (!managerDeckWorkspaceEligible(workspaceId)) return Object.freeze([]);
  return Object.freeze(listDatasetDeckReferences(workspaceId, datasetId).map((reference) => reference.deckId));
}
