/**
 * DTH:7 — Decision Comparison composer.
 * Projects a read-only comparison from Theatre + authoritative membership.
 */

import type { NexoraDecisionTheatreFoundation } from "./nexoraDecisionTheatreContract.ts";
import type { NexoraDecisionTheatreExecutiveObject } from "./nexoraDecisionTheatreContract.ts";
import type { NexoraDecisionTheatreIconicObject } from "./nexoraDecisionTheatreIconicProjection.ts";
import {
  nexoraDecisionTheatreDecisionComparisonIdentity,
  nexoraDecisionTheatreDecisionComparisonVersion,
  type NexoraDecisionTheatreComparisonAction,
  type NexoraDecisionTheatreComparisonActionAvailability,
  type NexoraDecisionTheatreComparisonCandidate,
  type NexoraDecisionTheatreComparisonCriterion,
  type NexoraDecisionTheatreComparisonCriterionKey,
  type NexoraDecisionTheatreComparisonLevel,
  type NexoraDecisionTheatreDecisionComparison,
} from "./nexoraDecisionTheatreDecisionComparison.ts";
import { managerCriterionLabel } from "./nexoraDecisionTheatreDecisionComparisonRegistry.ts";

export const nexoraDecisionTheatreDecisionComparisonComposerIdentity =
  "DTH:7/DecisionComparisonComposer" as const;

export type NexoraDecisionTheatreComparisonAuthority = Readonly<{
  preferredCandidateId: string | null;
  statement: string | null;
  source: string;
  evidenceState: "SUFFICIENT" | "PARTIAL" | "INSUFFICIENT" | null;
}>;

export type NexoraDecisionTheatreActiveComparisonMembership = Readonly<{
  candidateIds: readonly string[];
  candidateKind: string | null;
  criterion: string | null;
}>;

function freezeTree<T>(value: T): T {
  if (value == null || typeof value !== "object") return value;
  if (Array.isArray(value)) {
    for (const item of value) freezeTree(item);
    return Object.freeze(value) as T;
  }
  for (const nested of Object.values(value as Record<string, unknown>)) {
    freezeTree(nested);
  }
  return Object.freeze(value);
}

function action(
  name: NexoraDecisionTheatreComparisonAction,
  available: boolean,
  reason: string,
): NexoraDecisionTheatreComparisonActionAvailability {
  return Object.freeze({ action: name, available, reason });
}

function honestIconic(item: NexoraDecisionTheatreIconicObject | undefined): string | null {
  if (item == null) return null;
  if (item.unknown) return "unknown";
  if (item.missing || item.value == null) return "unavailable";
  return `${item.value}${item.unit && item.unit !== "none" ? ` ${item.unit}` : ""}`;
}

function firstOfType(
  objects: readonly NexoraDecisionTheatreExecutiveObject[],
  type: string,
): NexoraDecisionTheatreExecutiveObject | null {
  return objects.find((item) => item.canonicalObjectType === type) ?? null;
}

export type NexoraDecisionTheatreCatalogMember = Readonly<{
  id: string;
  label: string;
  kind: string;
}>;

export function projectNexoraDecisionTheatreDecisionComparison(input: {
  readonly theatre: NexoraDecisionTheatreFoundation;
  readonly level?: NexoraDecisionTheatreComparisonLevel | null;
  readonly ncaActiveComparison?: NexoraDecisionTheatreActiveComparisonMembership | null;
  readonly comparisonAuthority?: NexoraDecisionTheatreComparisonAuthority | null;
  readonly catalogMembers?: readonly NexoraDecisionTheatreCatalogMember[] | null;
}): NexoraDecisionTheatreDecisionComparison | null {
  const theatre = input.theatre;
  const sceneMembers =
    theatre.sceneIntent.intentKind === "COMPARE_CANDIDATES" && theatre.sceneIntent.comparisonMembers.length >= 2
      ? theatre.sceneIntent.comparisonMembers
      : Object.freeze([] as string[]);
  const ncaMembers = input.ncaActiveComparison?.candidateIds ?? [];
  const membershipSource: "scene-intent" | "nca-active-comparison" =
    sceneMembers.length >= 2 ? "scene-intent" : "nca-active-comparison";
  const requestedIds = sceneMembers.length >= 2 ? sceneMembers : ncaMembers;
  if (requestedIds.length < 2) return null;

  const byId = new Map(theatre.visibleExecutiveObjects.map((item) => [item.id, item]));
  const catalogById = new Map((input.catalogMembers ?? []).map((item) => [item.id, item]));
  const resolvedObjects: NexoraDecisionTheatreExecutiveObject[] = [];
  const catalogOnly: NexoraDecisionTheatreCatalogMember[] = [];
  for (const id of requestedIds) {
    const visible = byId.get(id);
    if (visible) {
      resolvedObjects.push(visible);
      continue;
    }
    const catalogMember = catalogById.get(id);
    if (catalogMember) catalogOnly.push(catalogMember);
  }
  if (resolvedObjects.length + catalogOnly.length < 2) return null;

  const objectCandidates = resolvedObjects.map((object) => {
    const iconics = theatre.iconicObjects.filter((item) => item.ownerExecutiveObjectId === object.id);
    const evidence = iconics.find((item) => item.role === "evidence" || item.role === "confidence");
    const cost = iconics.find((item) => item.role === "cost");
    const time = iconics.find((item) => item.role === "time");
    const risk = iconics.find((item) => item.role === "uncertainty");
    const reversibility = iconics.find((item) => item.role === "reversibility");
    const assumption = iconics.find((item) => item.epistemicStatus === "expectation" && item.role !== "cost" && item.role !== "time");
    return Object.freeze({
      id: object.id,
      label: object.label,
      kind: object.canonicalObjectType,
      state: object.lifecycleStatus ?? "active",
      isDoNothing: /do nothing|current plan|baseline/i.test(object.label),
      evidence: honestIconic(evidence),
      cost: honestIconic(cost),
      time: honestIconic(time),
      risk: honestIconic(risk),
      reversibility: honestIconic(reversibility),
      assumption: assumption != null ? assumption.managerReadableLabel : null,
      epistemicStatus: assumption != null
        ? ("assumption" as const)
        : evidence?.unknown
          ? ("unknown" as const)
          : evidence?.missing
            ? ("unavailable" as const)
            : evidence
              ? ("known" as const)
              : ("unavailable" as const),
    });
  });
  const hiddenCandidates = catalogOnly.map((item) =>
    Object.freeze({
      id: item.id,
      label: item.label,
      kind: item.kind,
      state: "active",
      isDoNothing: /do nothing|current plan|baseline/i.test(item.label),
      evidence: null,
      cost: null,
      time: null,
      risk: null,
      reversibility: null,
      assumption: null,
      epistemicStatus: "unavailable" as const,
    }),
  );
  const objectById = new Map(objectCandidates.map((item) => [item.id, item]));
  const hiddenById = new Map(hiddenCandidates.map((item) => [item.id, item]));
  const ordered: NexoraDecisionTheatreComparisonCandidate[] = [];
  for (const id of requestedIds) {
    const candidate = objectById.get(id) ?? hiddenById.get(id);
    if (candidate) ordered.push(candidate);
  }
  const candidates: readonly NexoraDecisionTheatreComparisonCandidate[] = Object.freeze(ordered);
  const candidateIds = Object.freeze(candidates.map((item) => item.id));
  const nearbyNonCandidates = theatre.visibleExecutiveObjects.filter((item) => !candidateIds.includes(item.id));
  const focalGoal = firstOfType(nearbyNonCandidates, "goal");
  const focalProblem =
    firstOfType(nearbyNonCandidates, "problem") ?? firstOfType(nearbyNonCandidates, "opportunity");
  const activeId =
    theatre.selectedExecutiveObjectId && candidateIds.includes(theatre.selectedExecutiveObjectId)
      ? theatre.selectedExecutiveObjectId
      : theatre.primaryExecutiveObjectId && candidateIds.includes(theatre.primaryExecutiveObjectId)
        ? theatre.primaryExecutiveObjectId
        : null;

  const anyEvidence = candidates.some((item) => item.evidence != null && item.evidence !== "unavailable" && item.evidence !== "unknown");
  const anyCost = candidates.some((item) => item.cost != null && item.cost !== "unavailable" && item.cost !== "unknown");
  const anyTime = candidates.some((item) => item.time != null && item.time !== "unavailable" && item.time !== "unknown");
  const anyRisk = candidates.some((item) => item.risk != null && item.risk !== "unavailable" && item.risk !== "unknown");
  const anyReversibility = candidates.some((item) => item.reversibility != null && item.reversibility !== "unavailable");
  const requestedCriterion =
    managerCriterionLabel(theatre.sceneIntent.comparisonCriterion) ??
    managerCriterionLabel(input.ncaActiveComparison?.criterion ?? null);

  function criterion(
    key: NexoraDecisionTheatreComparisonCriterionKey,
    label: string,
    supported: boolean,
    explicit: boolean,
  ): NexoraDecisionTheatreComparisonCriterion | null {
    if (!supported && !explicit) return null;
    return Object.freeze({
      key,
      label,
      available: supported,
      reason: supported ? `${label} is present from an authoritative source.` : `${label} is not available for this comparison.`,
    });
  }

  const explicit = (token: string) =>
    requestedCriterion != null && requestedCriterion.includes(token);

  const criteria = Object.freeze(
    [
      criterion("goal-impact", "Goal relevance", focalGoal != null, explicit("goal")),
      criterion("evidence", "Evidence", anyEvidence, explicit("evidence")),
      criterion("risk", "Risk", anyRisk, explicit("risk")),
      criterion("cost", "Cost", anyCost, explicit("cost")),
      criterion("time", "Time", anyTime, explicit("time")),
      criterion("reversibility", "Reversibility", anyReversibility, explicit("reversib")),
      criterion("uncertainty", "Uncertainty", true, false),
    ].filter((item): item is NexoraDecisionTheatreComparisonCriterion => item != null),
  );

  const tradeOffs: string[] = [];
  for (const item of candidates) {
    const parts: string[] = [];
    if (item.cost && item.cost !== "unavailable" && item.cost !== "unknown") parts.push(`cost ${item.cost}`);
    if (item.time && item.time !== "unavailable" && item.time !== "unknown") parts.push(`time ${item.time}`);
    if (item.evidence && item.evidence !== "unavailable" && item.evidence !== "unknown") parts.push(`evidence ${item.evidence}`);
    if (parts.length > 0) tradeOffs.push(`${item.label}: ${parts.join("; ")}.`);
  }

  const missingIndicators = candidates.flatMap((item) => {
    const missing: string[] = [];
    if (item.cost == null || item.cost === "unavailable" || item.cost === "unknown") missing.push(`${item.label} cost is unavailable.`);
    if (item.time == null || item.time === "unavailable" || item.time === "unknown") missing.push(`${item.label} time is unavailable.`);
    if (item.evidence == null || item.evidence === "unavailable" || item.evidence === "unknown") missing.push(`${item.label} does not have comparable evidence.`);
    return missing;
  });

  const authority = input.comparisonAuthority;
  const recommendedId =
    authority?.preferredCandidateId && candidateIds.includes(authority.preferredCandidateId)
      ? authority.preferredCandidateId
      : null;
  const recommendation =
    recommendedId != null && authority?.statement
      ? Object.freeze({
          candidateId: recommendedId,
          statement: authority.statement,
          source: authority.source,
          isDecision: false as const,
        })
      : null;

  const readiness =
    authority?.evidenceState === "SUFFICIENT"
      ? "Ready to decide"
      : authority?.evidenceState === "PARTIAL"
        ? "More investigation useful"
        : authority?.evidenceState === "INSUFFICIENT"
          ? "Evidence insufficient"
          : null;

  const names = candidates.map((item) => item.label);
  const problemOrGoal =
    focalProblem != null
      ? `These options are being considered because of ${focalProblem.label}.`
      : focalGoal != null
        ? `These options are being considered in relation to ${focalGoal.label}.`
        : "These options are the current comparison candidates.";
  const choice = `Nexora is comparing ${names.length} options. ${problemOrGoal}`;
  const evidenceCopy = anyEvidence
    ? "Stronger supporting evidence is not a guaranteed outcome. Association is not a confirmed cause."
    : "Nexora does not yet have enough comparable evidence to prefer one option.";
  const uncertainty = missingIndicators.length > 0
    ? missingIndicators.slice(0, 4).join(" ")
    : "Available support is limited to what the current sources provide.";
  const tradeOffCopy =
    tradeOffs.length > 0
      ? tradeOffs.join(" ")
      : "There is not enough comparable information to state a trade-off without inventing one.";
  const unresolvedCriteria = Object.freeze(
    requestedCriterion == null ? ["Which dimension matters has not been resolved."] : [],
  );
  const level = input.level ?? "choice";
  const suggested = Object.freeze(
    [
      "Compare them.",
      anyEvidence ? "Which one has stronger evidence?" : null,
      requestedCriterion == null ? "Which one is better?" : null,
      anyCost ? "Which costs less?" : null,
      "What do we still not know?",
    ].filter((item): item is string => Boolean(item)).slice(0, 4),
  );
  const actions = Object.freeze([
    action("INVESTIGATE_CANDIDATE", true, "Selecting a candidate opens the existing investigation."),
    action("COMPARE_EVIDENCE", anyEvidence, anyEvidence ? "Evidence indicators are present." : "No comparable evidence is available."),
    action("COMPARE_RISK", anyRisk, anyRisk ? "Risk or uncertainty indicators are present." : "No risk indicator is available."),
    action("COMPARE_COST", anyCost, anyCost ? "Cost indicators are present." : "Cost is unavailable; it is not zero."),
    action("COMPARE_TIME", anyTime, anyTime ? "Time indicators are present." : "Time is unavailable; it is not zero days."),
    action("COMPARE_GOAL_IMPACT", focalGoal != null, focalGoal != null ? "A related Goal is present." : "No Goal context is in this comparison."),
    action("SHOW_TRADE_OFFS", tradeOffs.length > 0, tradeOffs.length > 0 ? "Supported differences can be shown." : "No supported trade-off is available."),
    action("SHOW_UNCERTAINTY", true, "Uncertainty remains visible."),
    action("EXPLAIN_RECOMMENDATION", recommendation != null, recommendation != null ? "An authoritative recommendation is present and is not a Decision." : "No recommendation is available."),
    action("RETURN_TO_COMPARISON", theatre.objectInvestigation != null, "Closing investigation restores this comparison."),
    action(
      "PROCEED_TO_DECISION",
      Boolean(activeId),
      activeId
        ? "Opens Decision review. Confirmation is still required before a Decision exists."
        : "Select a candidate before reviewing a Decision. Clicking does not approve it.",
    ),
  ]);
  const comparisonId = `dth7-comparison:${theatre.sceneScript.scriptId}:${candidateIds.join(",")}:${level}:${membershipSource}`;
  return freezeTree({
    identity: nexoraDecisionTheatreDecisionComparisonIdentity,
    version: nexoraDecisionTheatreDecisionComparisonVersion,
    comparisonId,
    open: true,
    level,
    sceneIntentKind: theatre.sceneIntent.intentKind,
    sceneScriptId: theatre.sceneScript.scriptId,
    membershipSource,
    focalGoal: focalGoal ? Object.freeze({ id: focalGoal.id, label: focalGoal.label }) : null,
    focalProblem: focalProblem ? Object.freeze({ id: focalProblem.id, label: focalProblem.label }) : null,
    candidates,
    candidateIds,
    activeCandidateId: activeId,
    criterion: requestedCriterion,
    unresolvedCriteria,
    criteria,
    tradeOffs: Object.freeze(tradeOffs),
    uncertainty,
    recommendation,
    readiness,
    suggestedQuestions: suggested,
    actions,
    advisorReadable: Object.freeze({
      choice,
      candidates: names.join(", "),
      differences: tradeOffCopy,
      evidence: evidenceCopy,
      uncertainty,
      tradeOffs: tradeOffCopy,
      recommendation: recommendation
        ? `${recommendation.statement} This is not an approved Decision.`
        : null,
      readiness,
      ambiguousBetter:
        "Better is not one meaning. Faster, lower cost, lower risk, stronger evidence, and Goal impact are different questions.",
      mustNotInfer: Object.freeze([
        "Candidates are not approved Decisions.",
        "Clicking a candidate investigates it; it does not choose it.",
        "Stronger evidence is not guaranteed success.",
        "Missing cost or time is not zero.",
        "Importance, urgency, risk, and recommendation remain different.",
        "Relatedness is not a confirmed cause.",
        "An assumption is not a fact.",
      ]),
    }),
    limitations: Object.freeze([
      "No candidate was added from nearby objects.",
      "No numeric score was invented.",
      recommendation == null ? "No winner was invented." : "Recommendation is not a Decision.",
    ]),
    derivationMetadata: Object.freeze({
      composer: "DTH:7/DecisionComparisonComposer" as const,
      inventedCandidates: false as const,
      inventedScores: false as const,
      inventedRecommendation: false as const,
      approvedDecision: false as const,
      startedExecution: false as const,
      proximityInferred: false as const,
      unknownFlattenedToZero: false as const,
      mutatedStage: false as const,
      timestampUsed: false as const,
      randomUsed: false as const,
    }),
  });
}
