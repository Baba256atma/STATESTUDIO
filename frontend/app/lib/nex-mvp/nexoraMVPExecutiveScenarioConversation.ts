/**
 * CC:9 — MVP baseline projection for scenario evaluation.
 * Catalog attention only — no Stage geometry.
 */

import type { NexoraMVPObjectInteractionCatalog } from "@/app/lib/nex-mvp/nexoraMVPObjectInteraction.ts";
import type { NexoraExecutiveContextSnapshot } from "@/app/lib/conversational-control/executiveContextSnapshot.ts";
import { createNexoraScenarioBaselineSnapshot } from "@/app/lib/conversational-control/executiveScenarioEvaluation.ts";
import type { NexoraScenarioBaselineSnapshot } from "@/app/lib/conversational-control/executiveScenarioEvaluation.ts";

export function projectNexoraMVPExecutiveScenarioBaseline(input: {
  readonly catalog: NexoraMVPObjectInteractionCatalog;
  readonly executiveContext?: NexoraExecutiveContextSnapshot | null;
}): NexoraScenarioBaselineSnapshot {
  const attentionBySubject: Record<
    string,
    "normal" | "elevated" | "important" | "critical" | undefined
  > = {};

  for (const object of input.catalog.objects) {
    attentionBySubject[object.id] = object.attention;
  }
  for (const subject of input.catalog.contextSubjects) {
    attentionBySubject[subject.id] = subject.attention;
  }

  return createNexoraScenarioBaselineSnapshot({
    baselineId: `cc9:baseline:${input.executiveContext?.currentWorkspaceId ?? "overview"}`,
    attentionBySubject,
  });
}

export function relatedSubjectIdsForPrimary(input: {
  readonly catalog: NexoraMVPObjectInteractionCatalog;
  readonly primarySubjectId: string | null;
}): readonly string[] {
  if (!input.primarySubjectId) return Object.freeze([]);
  const related = new Set<string>();
  for (const rel of input.catalog.relationships) {
    if (rel.sourceId === input.primarySubjectId) related.add(rel.targetId);
    if (rel.targetId === input.primarySubjectId) related.add(rel.sourceId);
  }
  for (const link of input.catalog.contextLinks) {
    if (link.objectId === input.primarySubjectId) related.add(link.contextId);
    if (link.contextId === input.primarySubjectId) related.add(link.objectId);
  }
  return Object.freeze([...related]);
}
