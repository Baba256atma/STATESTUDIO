/**
 * DECK-IDENTITY-CONTRACT:1 — Deck identity and ownership.
 *
 * A Deck is a management context inside one Workspace. This module validates
 * that pair. It does not register, persist, create, or delete Decks.
 */
import {
  DEMO_WORKSPACE_ID,
  isLegacyWorkflowWorkspaceIdentifier,
  normalizeWorkspaceId,
} from "../workspace/workspaceRegistryContract.ts";
import { isDemoProfileId, type DemoProfileId } from "../demo-profile/demoProfileContract.ts";

export const nexoraDeckIdentityContract = "DECK-IDENTITY-CONTRACT:1/NexoraDeckIdentity" as const;

export const NEXORA_DECK_BOUNDARY = Object.freeze({
  identity: nexoraDeckIdentityContract,
  createsDeckRegistry: false as const,
  persistsDecks: false as const,
  persistence: "contract-only" as const,
  databaseMigration: false as const,
  selectsManagerWorkspace: false as const,
  renamesDemoProfileFields: false as const,
  infersOwnershipFromLabels: false as const,
  executiveMembershipAuthorizesMutation: false as const,
  solarRendering: false as const,
});

export const NEXORA_DECK_KINDS = Object.freeze([
  "EXECUTIVE",
  "DEPARTMENT",
  "FUNCTIONAL",
] as const);

export type NexoraDeckKind = (typeof NEXORA_DECK_KINDS)[number];

export const NEXORA_DECK_STATUSES = Object.freeze(["ACTIVE", "ARCHIVED"] as const);

export type NexoraDeckStatus = (typeof NEXORA_DECK_STATUSES)[number];

/** Stable id of the cross-functional Deck. It is not a Workspace. */
export const NEXORA_EXECUTIVE_DECK_ID = "executive" as const;

export const NEXORA_STAGE_VIEW_IDS = Object.freeze([
  "organizational-solar",
  "decision-solar",
] as const);

export type NexoraStageViewId = (typeof NEXORA_STAGE_VIEW_IDS)[number];

/**
 * Navigation principles. The Deck selector is a separate component.
 * Selecting a Deck does not select a Workspace.
 */
export const NEXORA_DECK_NAVIGATION_CONTRACT = Object.freeze({
  workspaceSelectionChangesDeck: false as const,
  deckSelectionChangesWorkspace: false as const,
  workflowModeIsDeckId: false as const,
  duplicatesWorkspaceSelector: false as const,
  executiveDeckRemainsReachable: true as const,
});

/** Stable Deck id. The display name is not part of this value. */
export type NexoraDeckId = string;

/** Composite identity. The same deckId in another workspace is a different Deck. */
export type NexoraDeckIdentity = Readonly<{
  workspaceId: string;
  deckId: NexoraDeckId;
}>;

/** Identity plus a display name. Renaming changes name only. */
export type NexoraDeckDescriptor = Readonly<{
  workspaceId: string;
  deckId: NexoraDeckId;
  name: string;
}>;

/**
 * Explicit ownership. A missing deckId is legacy, not workspace-shared.
 * Workspace-shared must be stated. A Deck reference does not become this value.
 */
export type NexoraRecordOwnership = "workspace-shared" | "deck-owned" | "legacy-unassigned";

export type NexoraOwnershipRecord = Readonly<{
  workspaceId: string;
  deckId?: string | null;
  ownership?: NexoraRecordOwnership | null;
  fileName?: string | null;
  sceneName?: string | null;
  objectLabel?: string | null;
  observedAt?: string | null;
}>;

/** A Deck may point at a workspace dataset. The pointer is not the dataset owner. */
export type NexoraSharedDataReference = Readonly<{
  workspaceId: string;
  datasetId: string;
  referencedBy: NexoraDeckIdentity;
}>;

export function acceptDeckId(value: unknown): NexoraDeckId | null {
  if (typeof value !== "string") return null;
  const deckId = value.trim();
  if (deckId.length === 0 || isLegacyWorkflowWorkspaceIdentifier(deckId)) return null;
  return deckId;
}

export function acceptWorkspaceScopeId(value: unknown): string | null {
  const workspaceId = normalizeWorkspaceId(value);
  if (!workspaceId || isLegacyWorkflowWorkspaceIdentifier(workspaceId)) return null;
  return workspaceId;
}

export function acceptDeckIdentity(value: unknown): NexoraDeckIdentity | null {
  if (!value || typeof value !== "object") return null;
  const candidate = value as Partial<NexoraDeckIdentity>;
  const workspaceId = acceptWorkspaceScopeId(candidate.workspaceId);
  const deckId = acceptDeckId(candidate.deckId);
  if (!workspaceId || !deckId) return null;
  return Object.freeze({ workspaceId, deckId });
}

export function acceptDeckDescriptor(value: unknown): NexoraDeckDescriptor | null {
  if (!value || typeof value !== "object") return null;
  const candidate = value as Partial<NexoraDeckDescriptor>;
  const identity = acceptDeckIdentity(candidate);
  if (!identity || typeof candidate.name !== "string") return null;
  const name = candidate.name.trim();
  if (name.length === 0) return null;
  return Object.freeze({ ...identity, name });
}

export function deckIdentityOf(descriptor: NexoraDeckDescriptor): NexoraDeckIdentity {
  return Object.freeze({
    workspaceId: descriptor.workspaceId,
    deckId: descriptor.deckId,
  });
}

export function sameDeckIdentity(
  left: NexoraDeckIdentity | null | undefined,
  right: NexoraDeckIdentity | null | undefined,
): boolean {
  if (!left || !right) return false;
  return left.workspaceId === right.workspaceId && left.deckId === right.deckId;
}

/** Display name is not compared. */
export function sameDeckDescriptorIdentity(
  left: NexoraDeckDescriptor,
  right: NexoraDeckDescriptor,
): boolean {
  return left.workspaceId === right.workspaceId && left.deckId === right.deckId;
}

/**
 * Workspace membership is necessary and sufficient for "these Decks share a parent".
 * It does not authorize one Deck to read the other Deck's records.
 */
export function decksShareWorkspace(decks: readonly NexoraDeckIdentity[]): boolean {
  if (decks.length === 0) return false;
  const workspaceId = decks[0]?.workspaceId;
  return decks.every((deck) => deck.workspaceId === workspaceId);
}

/**
 * A Deck id is not an access token. The authorized workspace must match.
 */
export function deckAccessAllowed(input: {
  readonly authorizedWorkspaceId: string | null | undefined;
  readonly deck: NexoraDeckIdentity;
}): boolean {
  return acceptWorkspaceScopeId(input.authorizedWorkspaceId) === input.deck.workspaceId;
}

/**
 * Switching workspaces drops a Deck that belongs to the previous workspace.
 * Switching decks does not change the workspace.
 */
export function deckSelectionAfterWorkspaceSwitch(
  selection: NexoraDeckIdentity | null,
  nextWorkspaceId: string | null | undefined,
): NexoraDeckIdentity | null {
  const workspaceId = acceptWorkspaceScopeId(nextWorkspaceId);
  if (!selection || !workspaceId || selection.workspaceId !== workspaceId) return null;
  return selection;
}

export function classifyRecordOwnership(record: NexoraOwnershipRecord): NexoraRecordOwnership {
  if (record.ownership === "workspace-shared") return "workspace-shared";
  if (record.ownership === "legacy-unassigned") return "legacy-unassigned";
  const deckId = acceptDeckId(record.deckId);
  if (record.ownership === "deck-owned") return deckId ? "deck-owned" : "legacy-unassigned";
  if (deckId) return "deck-owned";
  return "legacy-unassigned";
}

/**
 * Deck-owned rows are visible only to that composite identity.
 * Workspace-shared rows are visible to Decks in the same workspace.
 * Legacy rows stay stored and are not claimed by the active Deck.
 * A matching deckId in another workspace is rejected.
 */
export function recordVisibleToDeck(
  record: NexoraOwnershipRecord,
  viewer: NexoraDeckIdentity,
): boolean {
  if (record.workspaceId !== viewer.workspaceId) return false;
  if (!deckAccessAllowed({ authorizedWorkspaceId: viewer.workspaceId, deck: viewer })) return false;
  const ownership = classifyRecordOwnership(record);
  if (ownership === "workspace-shared") return true;
  if (ownership === "legacy-unassigned") return false;
  return acceptDeckId(record.deckId) === viewer.deckId;
}

/**
 * Demo profiles map to Deck identity only inside demo_workspace.
 * The stored demoProfileId is not renamed.
 */
export function deckIdentityForDemoProfile(
  workspaceId: string | null | undefined,
  profileId: DemoProfileId | string | null | undefined,
): NexoraDeckIdentity | null {
  if (workspaceId !== DEMO_WORKSPACE_ID || !isDemoProfileId(profileId)) return null;
  return Object.freeze({ workspaceId: DEMO_WORKSPACE_ID, deckId: profileId });
}

/**
 * A reference keeps the dataset workspace-owned. Cross-workspace references fail.
 */
export function datasetOwnershipAfterDeckReference(
  dataset: NexoraOwnershipRecord,
  reference: NexoraSharedDataReference,
): NexoraRecordOwnership | null {
  if (dataset.workspaceId !== reference.workspaceId) return null;
  if (reference.referencedBy.workspaceId !== reference.workspaceId) return null;
  if (classifyRecordOwnership(dataset) !== "workspace-shared") return null;
  return "workspace-shared";
}

/** Deleting a Deck does not delete a workspace-shared dataset. */
export function sharedDatasetSurvivesDeckDeletion(dataset: NexoraOwnershipRecord): boolean {
  return classifyRecordOwnership(dataset) === "workspace-shared";
}

export type NexoraDeckRecord = Readonly<{
  workspaceId: string;
  deckId: NexoraDeckId;
  name: string;
  kind: NexoraDeckKind;
  status: NexoraDeckStatus;
  createdAt: string;
  updatedAt: string;
}>;

export type NexoraStageContextIdentity = Readonly<{
  workspaceId: string;
  deckId: string | null;
  demoProfileId: string | null;
  stageViewId: NexoraStageViewId | null;
}>;

/** Membership of one canonical object in a Deck. The reference carries no dataset copy. */
export type NexoraDeckObjectReference = Readonly<{
  workspaceId: string;
  canonicalObjectId: string;
  sourceDeckId: NexoraDeckId;
  memberDeckId: NexoraDeckId;
}>;

function isDeckKind(value: unknown): value is NexoraDeckKind {
  return typeof value === "string" && (NEXORA_DECK_KINDS as readonly string[]).includes(value);
}

function isDeckStatus(value: unknown): value is NexoraDeckStatus {
  return typeof value === "string" && (NEXORA_DECK_STATUSES as readonly string[]).includes(value);
}

function acceptTimestamp(value: unknown): string | null {
  if (typeof value !== "string" || value.trim().length === 0) return null;
  return value;
}

export function acceptDeckRecord(value: unknown): NexoraDeckRecord | null {
  if (!value || typeof value !== "object") return null;
  const candidate = value as Partial<NexoraDeckRecord>;
  const identity = acceptDeckIdentity(candidate);
  if (!identity || typeof candidate.name !== "string" || !isDeckKind(candidate.kind) || !isDeckStatus(candidate.status)) {
    return null;
  }
  const name = candidate.name.trim();
  const createdAt = acceptTimestamp(candidate.createdAt);
  const updatedAt = acceptTimestamp(candidate.updatedAt);
  if (!name || !createdAt || !updatedAt) return null;
  return Object.freeze({ ...identity, name, kind: candidate.kind, status: candidate.status, createdAt, updatedAt });
}

/** Duplicate deckId values inside one Workspace are rejected. The same id in another Workspace stays distinct. */
export function acceptDeckIdentitySet(
  decks: readonly NexoraDeckIdentity[],
): readonly NexoraDeckIdentity[] | null {
  const seen = new Set<string>();
  for (const deck of decks) {
    const key = `${deck.workspaceId}\0${deck.deckId}`;
    if (seen.has(key)) return null;
    seen.add(key);
  }
  return decks;
}

export function executiveDeckIdentity(workspaceId: string | null | undefined): NexoraDeckIdentity | null {
  const accepted = acceptWorkspaceScopeId(workspaceId);
  if (!accepted) return null;
  return Object.freeze({ workspaceId: accepted, deckId: NEXORA_EXECUTIVE_DECK_ID });
}

export function acceptExecutiveObjectReference(value: unknown): NexoraDeckObjectReference | null {
  if (!value || typeof value !== "object") return null;
  const candidate = value as Partial<NexoraDeckObjectReference>;
  const workspaceId = acceptWorkspaceScopeId(candidate.workspaceId);
  const sourceDeckId = acceptDeckId(candidate.sourceDeckId);
  const memberDeckId = acceptDeckId(candidate.memberDeckId);
  if (
    !workspaceId ||
    !sourceDeckId ||
    memberDeckId !== NEXORA_EXECUTIVE_DECK_ID ||
    typeof candidate.canonicalObjectId !== "string" ||
    candidate.canonicalObjectId.trim().length === 0
  ) {
    return null;
  }
  if (sourceDeckId === memberDeckId) return null;
  return Object.freeze({
    workspaceId,
    canonicalObjectId: candidate.canonicalObjectId.trim(),
    sourceDeckId,
    memberDeckId,
  });
}

/** Two memberships of one canonical id are the same subject, not two objects. */
export function sameCanonicalObject(
  left: NexoraDeckObjectReference,
  right: NexoraDeckObjectReference,
): boolean {
  return left.workspaceId === right.workspaceId && left.canonicalObjectId === right.canonicalObjectId;
}

/** Viewing through the Executive Deck does not authorize a change to the source. */
export function executiveMembershipAuthorizesSourceMutation(
  _reference: NexoraDeckObjectReference,
): false {
  return false;
}

export function acceptStageViewId(value: unknown): NexoraStageViewId | null {
  if (typeof value !== "string") return null;
  return (NEXORA_STAGE_VIEW_IDS as readonly string[]).includes(value)
    ? value as NexoraStageViewId
    : null;
}

/** A view change keeps the Workspace and the Deck. */
export function stageContextAfterViewChange(
  context: NexoraStageContextIdentity,
  viewId: unknown,
): NexoraStageContextIdentity | null {
  const stageViewId = acceptStageViewId(viewId);
  if (!stageViewId) return null;
  return Object.freeze({ ...context, stageViewId });
}
