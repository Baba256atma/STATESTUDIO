/**
 * CC:8 — MVP evidence projection from Stage catalog / fixtures.
 * Canonical facts + relationships only. No geometry. No invented KPIs.
 */

import type { NexoraMVPObjectInteractionCatalog } from "@/app/lib/nex-mvp/nexoraMVPObjectInteraction.ts";
import type { NexoraExecutiveContextSnapshot } from "@/app/lib/conversational-control/executiveContextSnapshot.ts";
import type {
  NexoraExecutiveEvidenceFact,
  NexoraExecutiveEvidenceRelationship,
  NexoraExecutiveReasoningEvidencePack,
} from "@/app/lib/conversational-control/executiveRecommendation.ts";
import { assembleNexoraExecutiveReasoningEvidence } from "@/app/lib/conversational-control/executiveRecommendationEvidence.ts";

export function projectNexoraMVPExecutiveRecommendationEvidence(input: {
  readonly catalog: NexoraMVPObjectInteractionCatalog;
  readonly executiveContext: NexoraExecutiveContextSnapshot;
  readonly primarySubjectId?: string | null;
}): NexoraExecutiveReasoningEvidencePack {
  const facts: NexoraExecutiveEvidenceFact[] = [];

  for (const object of input.catalog.objects) {
    facts.push(
      Object.freeze({
        evidenceId: `fact:${object.id}:attention`,
        subjectId: object.id,
        subjectLabel: object.label,
        attention: object.attention,
        status: object.status,
        factKey: "attention",
        factValue: object.attention,
        freshness: "current",
        source: Object.freeze({
          sourceKind: "runtime" as const,
          sourceId: object.id,
          subjectId: object.id,
          factKey: "attention",
        }),
      }),
    );
  }

  for (const subject of input.catalog.contextSubjects) {
    facts.push(
      Object.freeze({
        evidenceId: `fact:${subject.id}:attention`,
        subjectId: subject.id,
        subjectLabel: subject.label,
        attention: subject.attention,
        status: subject.status,
        factKey: "attention",
        factValue: subject.attention,
        freshness: "current",
        source: Object.freeze({
          sourceKind:
            subject.kind === "problem"
              ? ("problem" as const)
              : subject.kind === "scenario"
                ? ("scenario" as const)
                : subject.kind === "decision"
                  ? ("decision" as const)
                  : subject.kind === "execution"
                    ? ("execution" as const)
                    : ("runtime" as const),
          sourceId: subject.id,
          subjectId: subject.id,
          factKey: "attention",
        }),
      }),
    );
  }

  const relationships: NexoraExecutiveEvidenceRelationship[] = [];

  for (const rel of input.catalog.relationships) {
    relationships.push(
      Object.freeze({
        relationshipId: rel.id,
        sourceSubjectId: rel.sourceId,
        targetSubjectId: rel.targetId,
        supportKind: "related" as const,
        source: Object.freeze({
          sourceKind: "relationship" as const,
          sourceId: rel.id,
        }),
      }),
    );
  }

  for (const link of input.catalog.contextLinks) {
    const supportKind =
      link.relation.includes("constrain") || link.relation === "constrained-by"
        ? ("constraining" as const)
        : ("related" as const);
    relationships.push(
      Object.freeze({
        relationshipId: link.id,
        sourceSubjectId: link.objectId,
        targetSubjectId: link.contextId,
        supportKind,
        source: Object.freeze({
          sourceKind: "relationship" as const,
          sourceId: link.id,
          factKey: link.relation,
        }),
      }),
    );
  }

  return assembleNexoraExecutiveReasoningEvidence({
    executiveContext: input.executiveContext,
    primarySubjectId: input.primarySubjectId ?? null,
    facts: Object.freeze(facts),
    relationships: Object.freeze(relationships),
  });
}
