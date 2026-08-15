/**
 * CC:8 — Evidence assembly (canonical facts only; no Stage geometry).
 */

import type { NexoraExecutiveContextSnapshot } from "./executiveContextSnapshot.ts";
import type {
  NexoraExecutiveEvidenceFact,
  NexoraExecutiveEvidenceRelationship,
  NexoraExecutiveReasoningEvidencePack,
} from "./executiveRecommendation.ts";

export type NexoraExecutiveEvidenceAssemblyInput = {
  readonly executiveContext: NexoraExecutiveContextSnapshot;
  readonly primarySubjectId: string | null;
  readonly facts?: readonly NexoraExecutiveEvidenceFact[];
  readonly relationships?: readonly NexoraExecutiveEvidenceRelationship[];
};

/**
 * Assemble a scoped evidence pack for CC:8.
 * Only includes facts/relationships for the reasoning scope subjects.
 */
export function assembleNexoraExecutiveReasoningEvidence(
  input: NexoraExecutiveEvidenceAssemblyInput,
): NexoraExecutiveReasoningEvidencePack {
  const scope = new Set<string>();
  if (input.primarySubjectId) scope.add(input.primarySubjectId);
  if (input.executiveContext.currentSubject) {
    scope.add(input.executiveContext.currentSubject.subjectId);
  }
  if (input.executiveContext.currentGoal) {
    scope.add(input.executiveContext.currentGoal.subjectId);
  }
  if (input.executiveContext.currentProblem) {
    scope.add(input.executiveContext.currentProblem.subjectId);
  }
  if (input.executiveContext.currentScenario) {
    scope.add(input.executiveContext.currentScenario.subjectId);
  }
  if (input.executiveContext.currentDecision) {
    scope.add(input.executiveContext.currentDecision.subjectId);
  }
  if (input.executiveContext.currentExecution) {
    scope.add(input.executiveContext.currentExecution.subjectId);
  }

  const facts = Object.freeze(
    (input.facts ?? []).filter((f) => scope.has(f.subjectId) || scope.size === 0),
  );

  // If primary is set, keep facts for primary + linked partners via relationships.
  const relationshipsAll = input.relationships ?? [];
  const linked = new Set<string>(scope);
  for (const rel of relationshipsAll) {
    if (scope.has(rel.sourceSubjectId) || scope.has(rel.targetSubjectId)) {
      linked.add(rel.sourceSubjectId);
      linked.add(rel.targetSubjectId);
    }
  }

  const scopedFacts = Object.freeze(
    (input.facts ?? []).filter((f) => linked.has(f.subjectId)),
  );
  const scopedRels = Object.freeze(
    relationshipsAll.filter(
      (r) => linked.has(r.sourceSubjectId) && linked.has(r.targetSubjectId),
    ),
  );

  return Object.freeze({
    facts: scopedFacts.length > 0 ? scopedFacts : facts,
    relationships: scopedRels,
    scopeSubjectIds: Object.freeze([...linked]),
  });
}
