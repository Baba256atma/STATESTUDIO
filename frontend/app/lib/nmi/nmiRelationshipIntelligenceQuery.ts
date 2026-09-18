/**
 * NPA-T NMI:3 — management questions and relationship-gap reports.
 * Detects missing canonical links. Does not create them.
 */

import type { ManagementMap } from "./nmiManagementMapContract.ts";
import type { NmiManagementRelationship } from "./nmiRelationshipContract.ts";
import type {
  ManagementRelationshipGapReport,
  ManagementRelationshipIntelligence,
  NmiManagementQuestionAnswer,
  NmiManagementQuestionKind,
  NmiRelationshipGap,
  NmiRelationshipGapCheck,
  NmiVaiCausalOverlay,
} from "./nmiRelationshipIntelligenceContract.ts";
import { nmiRelationshipIntelligenceIdentity } from "./nmiRelationshipIntelligenceIdentity.ts";
import { interpretNmiRelationship, interpretNmiRelationships, overlayByRelationshipId } from "./nmiRelationshipIntelligenceInterpret.ts";

function matching(
  map: ManagementMap,
  predicate: (rel: NmiManagementRelationship) => boolean,
  overlays: ReadonlyMap<string, NmiVaiCausalOverlay>,
): {
  readonly ids: readonly string[];
  readonly relationshipIds: readonly string[];
  readonly interpretations: readonly ManagementRelationshipIntelligence[];
} {
  const rels = map.relationships.filter(predicate);
  return {
    ids: Object.freeze(
      rels.flatMap((rel) => [rel.fromId, rel.toId]).filter((id, index, all) => all.indexOf(id) === index),
    ),
    relationshipIds: Object.freeze(rels.map((rel) => rel.relationshipId)),
    interpretations: Object.freeze(rels.map((rel) => interpretNmiRelationship(map, rel, overlays.get(rel.relationshipId)))),
  };
}

export function answerNmiManagementQuestion(
  map: ManagementMap,
  question: NmiManagementQuestionKind,
  focalNodeId: string | null,
  overlays: readonly NmiVaiCausalOverlay[] = [],
): NmiManagementQuestionAnswer {
  const overlayMap = overlayByRelationshipId(overlays);
  const empty = (relatedIds: readonly string[] = [], relationshipIds: readonly string[] = [], interpretations: readonly ManagementRelationshipIntelligence[] = []): NmiManagementQuestionAnswer =>
    Object.freeze({
      question,
      focalNodeId,
      relatedIds: Object.freeze([...relatedIds]),
      relationshipIds: Object.freeze([...relationshipIds]),
      interpretations: Object.freeze([...interpretations]),
      inventsRelationships: false as const,
    });

  if (question === "DISCONNECTED_NODES") {
    return empty(map.disconnectedNodeIds);
  }
  if (!focalNodeId) return empty();

  switch (question) {
    case "GOAL_THREATENED_BY_PROBLEM": {
      const found = matching(map, (rel) => rel.kind === "threatens" && rel.fromId === focalNodeId, overlayMap);
      return empty(
        found.interpretations.map((item) => item.targetId),
        found.relationshipIds,
        found.interpretations,
      );
    }
    case "KPI_MEASURING_GOAL": {
      const found = matching(map, (rel) => rel.kind === "measures" && rel.toId === focalNodeId, overlayMap);
      return empty(
        found.interpretations.map((item) => item.sourceId),
        found.relationshipIds,
        found.interpretations,
      );
    }
    case "DATA_SUPPORTING_KPI": {
      const found = matching(map, (rel) => rel.kind === "evidenced_by" && rel.fromId === focalNodeId, overlayMap);
      return empty(
        found.interpretations.map((item) => item.targetId),
        found.relationshipIds,
        found.interpretations,
      );
    }
    case "OPERATIONS_RELATED_TO_PROBLEM": {
      const found = matching(
        map,
        (rel) =>
          (rel.kind === "belongs_to" || rel.kind === "supports" || rel.kind === "depends_on") &&
          (rel.fromId === focalNodeId || rel.toId === focalNodeId) &&
          (map.nodes.find((node) => node.nodeId === rel.fromId)?.kind === "PROCESS" ||
            map.nodes.find((node) => node.nodeId === rel.toId)?.kind === "PROCESS"),
        overlayMap,
      );
      const related = found.interpretations
        .flatMap((item) => [item.sourceId, item.targetId])
        .filter((id) => id !== focalNodeId && map.nodes.find((node) => node.nodeId === id)?.kind === "PROCESS");
      return empty(related, found.relationshipIds, found.interpretations);
    }
    case "VARIABLES_ASSOCIATED_WITH_ISSUE": {
      const found = matching(
        map,
        (rel) =>
          rel.kind === "affects" &&
          (rel.fromId === focalNodeId || rel.toId === focalNodeId),
        overlayMap,
      );
      const related = found.interpretations
        .flatMap((item) => [item.sourceId, item.targetId])
        .filter((id) => map.nodes.find((node) => node.nodeId === id)?.kind === "VARIABLE");
      return empty(related, found.relationshipIds, found.interpretations);
    }
    case "SCENARIOS_ADDRESSING": {
      const found = matching(map, (rel) => rel.kind === "addresses" && rel.toId === focalNodeId, overlayMap);
      return empty(
        found.interpretations.map((item) => item.sourceId),
        found.relationshipIds,
        found.interpretations,
      );
    }
    case "DECISION_SELECTING_SCENARIO": {
      const found = matching(map, (rel) => rel.kind === "selected_as" && rel.toId === focalNodeId, overlayMap);
      return empty(
        found.interpretations.map((item) => item.sourceId),
        found.relationshipIds,
        found.interpretations,
      );
    }
    case "EXECUTION_OF_DECISION": {
      const found = matching(map, (rel) => rel.kind === "executed_by" && rel.toId === focalNodeId, overlayMap);
      return empty(
        found.interpretations.map((item) => item.sourceId),
        found.relationshipIds,
        found.interpretations,
      );
    }
    case "OUTCOME_OF_EXECUTION": {
      const found = matching(map, (rel) => rel.kind === "observed_by" && rel.toId === focalNodeId, overlayMap);
      return empty(
        found.interpretations.map((item) => item.sourceId),
        found.relationshipIds,
        found.interpretations,
      );
    }
    default:
      return empty();
  }
}

function check(
  name: NmiRelationshipGapCheck["check"],
  present: boolean,
  relatedIds: readonly string[],
  missing: NmiRelationshipGapCheck["reason"],
): NmiRelationshipGapCheck {
  return Object.freeze({
    check: name,
    present,
    reason: present ? null : missing,
    relatedIds: Object.freeze([...relatedIds]),
  });
}

export function composeNmiRelationshipGapReport(
  map: ManagementMap,
  focalNodeId: string,
  overlays: readonly NmiVaiCausalOverlay[] = [],
): ManagementRelationshipGapReport {
  const interpretations = interpretNmiRelationships(map, overlays);
  const goals = answerNmiManagementQuestion(map, "GOAL_THREATENED_BY_PROBLEM", focalNodeId, overlays);
  const scenarios = answerNmiManagementQuestion(map, "SCENARIOS_ADDRESSING", focalNodeId, overlays);

  const goalIds = goals.relatedIds;
  const kpiAnswers = goalIds.flatMap((goalId) => answerNmiManagementQuestion(map, "KPI_MEASURING_GOAL", goalId, overlays).relatedIds);
  const dataAnswers = kpiAnswers.flatMap((kpiId) => answerNmiManagementQuestion(map, "DATA_SUPPORTING_KPI", kpiId, overlays).relatedIds);
  const confirmedDrivers = interpretations.filter(
    (item) =>
      item.causalCommunication === "CONFIRMED_CAUSAL_RELATIONSHIP" &&
      (item.sourceId === focalNodeId || item.targetId === focalNodeId),
  );
  const decisionIds = scenarios.relatedIds.flatMap(
    (scenarioId) => answerNmiManagementQuestion(map, "DECISION_SELECTING_SCENARIO", scenarioId, overlays).relatedIds,
  );
  const executionIds = decisionIds.flatMap(
    (decisionId) => answerNmiManagementQuestion(map, "EXECUTION_OF_DECISION", decisionId, overlays).relatedIds,
  );
  const outcomeIds = executionIds.flatMap(
    (executionId) => answerNmiManagementQuestion(map, "OUTCOME_OF_EXECUTION", executionId, overlays).relatedIds,
  );

  const checks = Object.freeze([
    check("GOAL", goalIds.length > 0, goalIds, "MISSING_RELATIONSHIP"),
    check("KPI", kpiAnswers.length > 0, kpiAnswers, "MISSING_RELATIONSHIP"),
    check("DATA", dataAnswers.length > 0, dataAnswers, "MISSING_EVIDENCE"),
    check("CONFIRMED_DRIVER", confirmedDrivers.length > 0, confirmedDrivers.map((item) => item.sourceId), "UNSUPPORTED_CAUSAL_LINK"),
    check("SCENARIO", scenarios.relatedIds.length > 0, scenarios.relatedIds, "MISSING_RELATIONSHIP"),
    check("DECISION", decisionIds.length > 0, decisionIds, "MISSING_RELATIONSHIP"),
    check("EXECUTION", executionIds.length > 0, executionIds, "MISSING_RELATIONSHIP"),
    check("OUTCOME", outcomeIds.length > 0, outcomeIds, "MISSING_RELATIONSHIP"),
  ]);

  const gaps: NmiRelationshipGap[] = checks
    .filter((item) => !item.present && item.reason)
    .map((item) =>
      Object.freeze({
        gapId: `gap:${focalNodeId}:${item.check}`,
        focalNodeId,
        reason: item.reason!,
        detail: `${item.check} not canonically linked`,
        inventedRelationship: false as const,
      }),
    );

  for (const unresolvedId of map.unresolvedRelationshipIds) {
    gaps.push(
      Object.freeze({
        gapId: `gap:unresolved:${unresolvedId}`,
        focalNodeId,
        reason: "CANONICAL_REFERENCE_MISSING" as const,
        detail: unresolvedId,
        inventedRelationship: false as const,
      }),
    );
  }

  if (map.nodes.find((node) => node.nodeId === focalNodeId)?.contextKind === "UNKNOWN") {
    gaps.push(
      Object.freeze({
        gapId: `gap:${focalNodeId}:UNKNOWN_CONTEXT`,
        focalNodeId,
        reason: "UNKNOWN_CONTEXT" as const,
        detail: "focal node context is UNKNOWN",
        inventedRelationship: false as const,
      }),
    );
  }

  const ambiguous = interpretations.filter(
    (item) =>
      (item.sourceId === focalNodeId || item.targetId === focalNodeId) &&
      item.certainty === "AMBIGUOUS",
  );
  for (const item of ambiguous) {
    gaps.push(
      Object.freeze({
        gapId: `gap:ambiguous:${item.relationshipId}`,
        focalNodeId,
        reason: "AMBIGUOUS_TARGET" as const,
        detail: item.relationshipId,
        inventedRelationship: false as const,
      }),
    );
  }

  return Object.freeze({
    identity: nmiRelationshipIntelligenceIdentity,
    focalNodeId,
    checks,
    gaps: Object.freeze(gaps),
    disconnectedValidNodeIds: map.disconnectedNodeIds,
    fabricatesMissingEdges: false,
  });
}
