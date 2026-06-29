/**
 * APP-4:5 — Executive Intent ↔ Memory link registry (in-memory).
 */

import type { IntentIdentifier } from "../executiveIntent/executiveIntentTypes.ts";
import type { ExecutiveMemoryId } from "./executiveMemoryTypes.ts";
import type {
  ExecutiveIntentMemoryLink,
  ExecutiveIntentMemoryLinkId,
  ExecutiveIntentMemoryLinkQuery,
} from "./executiveIntentMemoryLinkTypes.ts";

const links = new Map<ExecutiveIntentMemoryLinkId, ExecutiveIntentMemoryLink>();

function freezeLink(link: ExecutiveIntentMemoryLink): ExecutiveIntentMemoryLink {
  return Object.freeze({
    ...link,
    metadata: Object.freeze({ ...link.metadata, customMetadata: Object.freeze({ ...link.metadata.customMetadata }) }),
    version: Object.freeze({ ...link.version }),
    readOnly: true as const,
  });
}

function matchesQuery(link: ExecutiveIntentMemoryLink, query: ExecutiveIntentMemoryLinkQuery): boolean {
  if (query.intentId && link.intentId !== query.intentId) return false;
  if (query.memoryId && link.memoryId !== query.memoryId) return false;
  if (query.workspaceId && link.workspaceId !== query.workspaceId) return false;
  if (query.goalId && link.goalId !== query.goalId) return false;
  if (query.scenarioId && link.scenarioId !== query.scenarioId) return false;
  if (query.decisionId && link.decisionId !== query.decisionId) return false;
  if (query.linkType && link.linkType !== query.linkType) return false;
  if (query.relationship && link.relationship !== query.relationship) return false;
  if (query.lifecycle && link.lifecycle !== query.lifecycle) return false;
  return true;
}

export function resetExecutiveIntentMemoryLinkRegistryForTests(): void {
  links.clear();
}

export function snapshotExecutiveIntentMemoryLinks(): ReadonlyMap<ExecutiveIntentMemoryLinkId, ExecutiveIntentMemoryLink> {
  return new Map(links);
}

export function restoreExecutiveIntentMemoryLinkSnapshot(
  snapshot: ReadonlyMap<ExecutiveIntentMemoryLinkId, ExecutiveIntentMemoryLink>
): void {
  links.clear();
  for (const [key, value] of snapshot.entries()) {
    links.set(key, freezeLink(value));
  }
}

export function commitExecutiveIntentMemoryLink(link: ExecutiveIntentMemoryLink): void {
  links.set(link.linkId, freezeLink(link));
}

export function getExecutiveIntentMemoryLinkFromRegistry(
  linkId: ExecutiveIntentMemoryLinkId
): ExecutiveIntentMemoryLink | null {
  return links.get(linkId) ?? null;
}

export function hasExecutiveIntentMemoryLinkInRegistry(linkId: ExecutiveIntentMemoryLinkId): boolean {
  return links.has(linkId);
}

export function listExecutiveIntentMemoryLinksFromRegistry(
  query: ExecutiveIntentMemoryLinkQuery = {}
): readonly ExecutiveIntentMemoryLink[] {
  return Object.freeze(
    [...links.values()]
      .filter((link) => matchesQuery(link, query))
      .sort((left, right) => left.linkId.localeCompare(right.linkId))
      .map((link) => freezeLink(link))
  );
}

export function listAllExecutiveIntentMemoryLinksFromRegistry(): readonly ExecutiveIntentMemoryLink[] {
  return listExecutiveIntentMemoryLinksFromRegistry({});
}

export function countExecutiveIntentMemoryLinksInRegistry(
  query: ExecutiveIntentMemoryLinkQuery = {}
): number {
  return listExecutiveIntentMemoryLinksFromRegistry(query).length;
}

export function listLinkedMemoryIdsForIntent(intentId: IntentIdentifier): readonly ExecutiveMemoryId[] {
  const memoryIds = listExecutiveIntentMemoryLinksFromRegistry({ intentId, lifecycle: "active" })
    .map((link) => link.memoryId)
    .filter((memoryId): memoryId is ExecutiveMemoryId => memoryId !== null);
  return Object.freeze([...new Set(memoryIds)].sort((left, right) => left.localeCompare(right)));
}

export function listLinkedIntentIdsForMemory(memoryId: ExecutiveMemoryId): readonly IntentIdentifier[] {
  const intentIds = listExecutiveIntentMemoryLinksFromRegistry({ memoryId, lifecycle: "active" }).map(
    (link) => link.intentId
  );
  return Object.freeze([...new Set(intentIds)].sort((left, right) => left.localeCompare(right)));
}

export const ExecutiveIntentMemoryLinkRegistry = Object.freeze({
  resetExecutiveIntentMemoryLinkRegistryForTests,
  snapshotExecutiveIntentMemoryLinks,
  restoreExecutiveIntentMemoryLinkSnapshot,
  commitExecutiveIntentMemoryLink,
  getExecutiveIntentMemoryLinkFromRegistry,
  hasExecutiveIntentMemoryLinkInRegistry,
  listExecutiveIntentMemoryLinksFromRegistry,
  listAllExecutiveIntentMemoryLinksFromRegistry,
  countExecutiveIntentMemoryLinksInRegistry,
  listLinkedMemoryIdsForIntent,
  listLinkedIntentIdsForMemory,
});
