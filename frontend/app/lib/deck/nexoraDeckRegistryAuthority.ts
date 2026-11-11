/**
 * Workspace eligibility for the Deck registry.
 * Demo workspaces stay on Demo Profiles and are not written here.
 */
import { getActiveWorkspaceId, getWorkspaceById } from "../workspace/workspaceRegistryStore.ts";
import {
  isManagerWorkspaceKind,
  isProtectedDemoWorkspaceId,
} from "../workspace/workspaceRegistryContract.ts";
import {
  archiveDeck,
  createDeck,
  ensureExecutiveDeck,
  getDeckRegistrySnapshot,
  listWorkspaceDecks,
  readActiveDeckId,
  renameDeck,
  restoreDeck,
  selectDeck,
  type NexoraDeckRegistryResult,
} from "./nexoraDeckRegistry.ts";
import { NEXORA_EXECUTIVE_DECK_ID, type NexoraDeckKind, type NexoraDeckRecord } from "./nexoraDeckIdentityContract.ts";

export function managerDeckWorkspaceEligible(workspaceId: string | null | undefined): boolean {
  if (!workspaceId || isProtectedDemoWorkspaceId(workspaceId)) return false;
  const workspace = getWorkspaceById(workspaceId);
  return workspace != null && isManagerWorkspaceKind(workspace.kind);
}

function rejected<T>(reason: "invalid-workspace"): NexoraDeckRegistryResult<T> {
  return Object.freeze({
    ok: false,
    reason,
    snapshot: getDeckRegistrySnapshot(),
  });
}

export function ensureManagerExecutiveDeck(workspaceId: string): NexoraDeckRegistryResult<NexoraDeckRecord> {
  if (!managerDeckWorkspaceEligible(workspaceId)) return rejected("invalid-workspace");
  const before = getActiveWorkspaceId();
  const ensured = ensureExecutiveDeck(workspaceId);
  if (getActiveWorkspaceId() !== before) return rejected("invalid-workspace");
  return ensured;
}

export function createManagerDeck(input: {
  readonly workspaceId: string;
  readonly name: string;
  readonly kind: NexoraDeckKind;
}): NexoraDeckRegistryResult<NexoraDeckRecord> {
  if (!managerDeckWorkspaceEligible(input.workspaceId)) return rejected("invalid-workspace");
  const before = getActiveWorkspaceId();
  const created = createDeck(input);
  if (getActiveWorkspaceId() !== before) return rejected("invalid-workspace");
  return created;
}

export function renameManagerDeck(input: {
  readonly workspaceId: string;
  readonly deckId: string;
  readonly name: string;
}): NexoraDeckRegistryResult<NexoraDeckRecord> {
  if (!managerDeckWorkspaceEligible(input.workspaceId)) return rejected("invalid-workspace");
  return renameDeck(input);
}

export function archiveManagerDeck(workspaceId: string, deckId: string): NexoraDeckRegistryResult<NexoraDeckRecord> {
  if (!managerDeckWorkspaceEligible(workspaceId)) return rejected("invalid-workspace");
  return archiveDeck(workspaceId, deckId);
}

export function restoreManagerDeck(workspaceId: string, deckId: string): NexoraDeckRegistryResult<NexoraDeckRecord> {
  if (!managerDeckWorkspaceEligible(workspaceId)) return rejected("invalid-workspace");
  return restoreDeck(workspaceId, deckId);
}

export function selectManagerDeck(workspaceId: string, deckId: string): NexoraDeckRegistryResult<NexoraDeckRecord> {
  if (!managerDeckWorkspaceEligible(workspaceId)) return rejected("invalid-workspace");
  const before = getActiveWorkspaceId();
  const selected = selectDeck(workspaceId, deckId);
  if (getActiveWorkspaceId() !== before) return rejected("invalid-workspace");
  return selected;
}

export function listManagerDecks(workspaceId: string): readonly NexoraDeckRecord[] {
  if (!managerDeckWorkspaceEligible(workspaceId)) return Object.freeze([]);
  return listWorkspaceDecks(workspaceId);
}

export function readManagerActiveDeckId(workspaceId: string): string | null {
  if (!managerDeckWorkspaceEligible(workspaceId)) return null;
  return readActiveDeckId(workspaceId) ?? NEXORA_EXECUTIVE_DECK_ID;
}
