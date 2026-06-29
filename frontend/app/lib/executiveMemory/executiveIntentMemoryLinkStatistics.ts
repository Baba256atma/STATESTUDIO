/**
 * APP-4:5 — Executive Intent ↔ Memory link statistics.
 */

import { listAllExecutiveIntentMemoryLinksFromRegistry } from "./executiveIntentMemoryLinkRegistry.ts";
import type { ExecutiveIntentMemoryLinkStatistics } from "./executiveIntentMemoryLinkTypes.ts";

export function computeExecutiveIntentMemoryLinkStatistics(): ExecutiveIntentMemoryLinkStatistics {
  const links = listAllExecutiveIntentMemoryLinksFromRegistry();
  const activeLinks = links.filter((link) => link.lifecycle === "active");
  const archivedLinks = links.filter((link) => link.lifecycle === "archived");

  const typeCounts: Record<string, number> = {};
  const relationshipCounts: Record<string, number> = {};
  const intentCounts: Record<string, number> = {};
  const workspaceCounts: Record<string, number> = {};

  for (const link of links) {
    typeCounts[link.linkType] = (typeCounts[link.linkType] ?? 0) + 1;
    relationshipCounts[link.relationship] = (relationshipCounts[link.relationship] ?? 0) + 1;
    intentCounts[link.intentId] = (intentCounts[link.intentId] ?? 0) + 1;
    workspaceCounts[link.workspaceId] = (workspaceCounts[link.workspaceId] ?? 0) + 1;
  }

  return Object.freeze({
    totalLinks: links.length,
    activeLinks: activeLinks.length,
    archivedLinks: archivedLinks.length,
    linksByType: Object.freeze({ ...typeCounts }),
    linksByRelationship: Object.freeze({ ...relationshipCounts }),
    linksByIntent: Object.freeze({ ...intentCounts }),
    linksByWorkspace: Object.freeze({ ...workspaceCounts }),
    readOnly: true as const,
  });
}

export const ExecutiveIntentMemoryLinkStatisticsService = Object.freeze({
  computeExecutiveIntentMemoryLinkStatistics,
});
