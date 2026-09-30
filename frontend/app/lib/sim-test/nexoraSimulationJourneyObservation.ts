/**
 * NPA-T SIM-TEST:3 — read-only journey measurement.
 * Classifies observed Manager/Nexora continuity. Does not answer, repair, or select subjects.
 */

import { isExplicitPresentationRequest } from "../manager-object/nexoraNxa5Fix4StageContextIntelligence.ts";
import { getDefaultNexoraMVPObjectInteractionCatalog } from "../nex-mvp/nexoraMVPObjectInteraction.ts";
import { hostNmiLiveManagementIntelligence } from "../nmi/nmiLivePipeline.ts";
import type {
  NexoraSimulationContinuityStatus,
  NexoraSimulationContinuitySummary,
  NexoraSimulationFreshnessRecord,
  NexoraSimulationJourneyFindingType,
  NexoraSimulationJourneyTurnObservation,
  NexoraSimulationTestFailureOwner,
  NexoraSimulationTestFinding,
  NexoraSimulationTestJourney,
  NexoraSimulationTestRunReport,
  NexoraSimulationTestSeverity,
} from "./nexoraSimulationTestContract.ts";

const FAMILIES: readonly (readonly [string, string])[] = Object.freeze([
  ["capacity", "capacity"],
  ["delivery", "delivery"],
  ["resource", "resource"],
  ["staffing", "resource"],
  ["customer", "customer"],
  ["maintenance", "maintenance"],
  ["inventory", "inventory"],
  ["schedule", "schedule"],
  ["milestone", "milestone"],
  ["operations", "operations"],
  ["supplier", "supplier"],
]);

const UNCERTAIN = /don't know|do not know|does not establish|not enough|unknown|cannot|can't tell|no data|not available|only an estimate|\bestimat|\bassum|\bpossible\b|not a confirmed cause|not confirmed/i;
const BEYOND_DATA = /competitor|next quarter|forecast/i;
const BACK_NAVIGATION = /^(?:go back|back|(?:the )?previous(?: one)?|the one before)[.!?]*$/i;
const COMMITTED_DECISION = new Set(["applied", "already-committed"]);

export const EMPTY_MANAGEMENT_CONTINUITY: NexoraSimulationContinuitySummary = Object.freeze({
  conversationContinuity: "NOT-EXERCISED",
  referentContinuity: "NOT-EXERCISED",
  nmiIdentityContinuity: "NOT-EXERCISED",
  mlevelContinuity: "NOT-EXERCISED",
  stageContinuity: "NOT-EXERCISED",
  advisorContinuity: "NOT-EXERCISED",
  ancestorContinuity: "NOT-EXERCISED",
  interactionContinuity: "NOT-EXERCISED",
  historicalReturnContinuity: "NOT-EXERCISED",
  identityPreservation: "NOT-EXERCISED",
  dataFreshness: "NOT-EXERCISED",
  evidenceSafety: "NOT-EXERCISED",
  causalSafety: "NOT-EXERCISED",
  decisionDeferredLegitimately: true,
});

export function subjectFamilies(value: string | null | undefined): ReadonlySet<string> {
  const found = new Set<string>();
  if (!value) return found;
  const text = value.toLowerCase();
  for (const [needle, family] of FAMILIES) {
    if (text.includes(needle)) found.add(family);
  }
  return found;
}

function familiesOf(values: readonly (string | null | undefined)[]): ReadonlySet<string> {
  const found = new Set<string>();
  for (const value of values) {
    for (const family of subjectFamilies(value)) found.add(family);
  }
  return found;
}

function disjoint(left: ReadonlySet<string>, right: ReadonlySet<string>): boolean {
  if (left.size === 0 || right.size === 0) return false;
  for (const item of left) if (right.has(item)) return false;
  return true;
}

function mentions(text: string, family: string): boolean {
  return subjectFamilies(text).has(family);
}

function csvSignature(observation: NexoraSimulationJourneyTurnObservation): string {
  return observation.csvVersions.map((item) => `${item.sourceType}@${item.version}`).join("|");
}

function claimNumbers(response: string): Readonly<Record<string, number>> {
  const claims: Record<string, number> = {};
  const patterns: readonly (readonly [string, RegExp])[] = [
    ["available capacity", /available capacity(?: is| of|:)?\s*(\d+(?:\.\d+)?)/i],
    ["capacity", /(?<!available )capacity(?: is| of|:)?\s*(\d+(?:\.\d+)?)/i],
  ];
  for (const [key, pattern] of patterns) {
    const match = pattern.exec(response);
    if (match?.[1]) claims[key] = Number(match[1]);
  }
  return claims;
}

function epistemicMarks(response: string): readonly string[] {
  const marks: string[] = [];
  if (/\bunknown\b|don't know|do not know|does not establish/i.test(response)) marks.push("UNKNOWN");
  if (/\bobserv/i.test(response)) marks.push("OBSERVED");
  if (/\bcalculat/i.test(response)) marks.push("CALCULATED");
  if (/\bestimat/i.test(response)) marks.push("ESTIMATED");
  if (/\bassum/i.test(response)) marks.push("ASSUMED");
  if (/\bknown\b/i.test(response)) marks.push("KNOWN");
  return Object.freeze(marks);
}

const EMPTY_NUMBERS: Readonly<Record<string, number>> = Object.freeze({});

export function decorateJourneyObservation(
  observation: Omit<NexoraSimulationJourneyTurnObservation, "epistemicMarks">,
): NexoraSimulationJourneyTurnObservation {
  return Object.freeze({
    observerHiddenNumbers: EMPTY_NUMBERS,
    problemId: null,
    scenarioId: null,
    decisionId: null,
    decisionCount: 0,
    executionId: null,
    executionCount: 0,
    executionStatus: null,
    npsOutcomeStatus: null,
    npsResolutionStatus: null,
    npsLearningStatus: null,
    npsLearningDurable: false,
    nxa3OutcomeState: null,
    worldAdvancedUnpublished: false,
    ...observation,
    epistemicMarks: epistemicMarks(observation.response),
  });
}

type Draft = {
  readonly type: NexoraSimulationJourneyFindingType;
  readonly severity: NexoraSimulationTestSeverity;
  readonly owner: NexoraSimulationTestFailureOwner;
  readonly turn: number;
  readonly tick: number;
  readonly observed: string;
  readonly expected: string;
  readonly subjectId: string | null;
  readonly mlevelActiveId: string | null;
  readonly stageActiveSubjectId: string | null;
};

function push(findings: Draft[], draft: Draft): void {
  findings.push(draft);
}

export function classifyManagerJourney(input: {
  readonly testRunId: string;
  readonly rmsRunId: string;
  readonly journey: NexoraSimulationTestJourney;
  readonly observations: readonly NexoraSimulationJourneyTurnObservation[];
  readonly causalOverclaimTurns: readonly number[];
}): {
  readonly findings: readonly NexoraSimulationTestFinding[];
  readonly continuity: NexoraSimulationContinuitySummary;
  readonly freshness: readonly NexoraSimulationFreshnessRecord[];
} {
  const drafts: Draft[] = [];
  const observations = input.observations;
  const clarificationBudget = input.journey.maxRepeatedClarificationAttempts ?? 2;
  const loopBudget = input.journey.maxUnresolvedLoops ?? 2;
  let repeatedClarification = 0;
  let previous: NexoraSimulationJourneyTurnObservation | null = null;
  let heldReferent: ReadonlySet<string> = new Set<string>();
  let priorReferent: ReadonlySet<string> = new Set<string>();
  const claimHistory = new Map<string, { readonly value: number; readonly signature: string; readonly turn: number }>();

  for (const observation of observations) {
    const executive = familiesOf([observation.canonicalSubjectId]);
    const conversation = familiesOf([observation.conversationSubjectId]);
    const label = familiesOf([observation.focusedSubjectLabel]);
    const referent = executive.size > 0 ? executive : conversation.size > 0 ? conversation : label;
    const intended = familiesOf([observation.intendedSubject]);
    const stage = familiesOf([observation.stageActiveSubjectId]);
    const nmi = familiesOf([observation.nmiCanonicalId]);
    const advisor = familiesOf([observation.advisorReferentId, observation.advisorReferentName]);
    const mlevel = familiesOf([observation.mlevelL1]);
    const previousExecutive = previous ? familiesOf([previous.canonicalSubjectId]) : new Set<string>();
    const previousConversation = previous ? familiesOf([previous.conversationSubjectId]) : new Set<string>();
    const previousReferent = previousExecutive.size > 0
      ? previousExecutive
      : previousConversation.size > 0
        ? previousConversation
        : previous ? familiesOf([previous.focusedSubjectLabel]) : new Set<string>();
    if (disjoint(executive, conversation)) {
      push(drafts, {
        type: "CONTEXT_OVERRIDE",
        severity: "S1",
        owner: "REFERENT",
        turn: observation.turn,
        tick: observation.tick,
        observed: "Executive subject and conversation referent diverged",
        expected: "CC:5 keeps one canonical subject across executive and conversation context",
        subjectId: observation.canonicalSubjectId,
        mlevelActiveId: observation.mlevelL1,
        stageActiveSubjectId: observation.stageActiveSubjectId,
      });
    }
    const namedMove = observation.intent === "CHANGE_CONTEXT"
      || observation.intent === "RETURN_TO_SUBJECT"
      || observation.intent === "FOCUS_PROBLEM";

    const acknowledgesActiveExecution =
      /already has an active Execution|Execution has started/i.test(observation.response) &&
      Boolean(observation.executionId) &&
      observation.executionStatus === "in-progress";
    if (observation.clarificationRequired && !acknowledgesActiveExecution) repeatedClarification += 1;
    else repeatedClarification = 0;
    if (repeatedClarification > clarificationBudget) {
      push(drafts, {
        type: "REPEATED_CLARIFICATION",
        severity: "S1",
        owner: "CC5_CONVERSATION",
        turn: observation.turn,
        tick: observation.tick,
        observed: observation.response,
        expected: "Clarification resolves after the manager answers it",
        subjectId: observation.canonicalSubjectId,
        mlevelActiveId: observation.mlevelL1,
        stageActiveSubjectId: observation.stageActiveSubjectId,
      });
      repeatedClarification = 0;
    }

    if (namedMove && intended.size > 0 && !observation.clarificationRequired) {
      const addressed = [...intended].some((family) => mentions(observation.response, family) || referent.has(family));
      if (!addressed && referent.size > 0 && disjoint(referent, intended)) {
        push(drafts, {
          type: observation.intent === "RETURN_TO_SUBJECT" ? "STALE_REFERENT" : "WRONG_REFERENT",
          severity: "S1",
          owner: "REFERENT",
          turn: observation.turn,
          tick: observation.tick,
          observed: `Resolved subject stayed apart from visible intent ${observation.intendedSubject}`,
          expected: "Nexora follows the manager's visible subject through existing referent continuity",
          subjectId: observation.canonicalSubjectId,
          mlevelActiveId: observation.mlevelL1,
          stageActiveSubjectId: observation.stageActiveSubjectId,
        });
      } else if (!addressed && referent.size === 0 && !UNCERTAIN.test(observation.response)) {
        push(drafts, {
          type: "SUBJECT_LOSS",
          severity: "S1",
          owner: "CC5_CONVERSATION",
          turn: observation.turn,
          tick: observation.tick,
          observed: "Named subject was neither resolved nor acknowledged",
          expected: "A named management subject remains continuous or is explicitly unresolved",
          subjectId: observation.canonicalSubjectId,
          mlevelActiveId: observation.mlevelL1,
          stageActiveSubjectId: observation.stageActiveSubjectId,
        });
      }
    }

    if (observation.deictic && !namedMove && previous && disjoint(referent, previousReferent) && !observation.clarificationRequired) {
      const utteranceNamesMove = [...referent].some((family) => mentions(observation.utterance, family));
      const returnsToPriorReferent =
        BACK_NAVIGATION.test(observation.utterance.trim()) &&
        priorReferent.size > 0 &&
        !disjoint(referent, priorReferent);
      if (!utteranceNamesMove && !returnsToPriorReferent) {
        push(drafts, {
          type: "WRONG_REFERENT",
          severity: "S1",
          owner: "REFERENT",
          turn: observation.turn,
          tick: observation.tick,
          observed: "Deictic follow-up resolved a different subject",
          expected: "Deictic follow-up keeps the current canonical subject",
          subjectId: observation.canonicalSubjectId,
          mlevelActiveId: observation.mlevelL1,
          stageActiveSubjectId: observation.stageActiveSubjectId,
        });
      }
    }

    const stageDisagrees = disjoint(stage, referent);
    const stageMatchesIntent = intended.size > 0 && !disjoint(stage, intended);
    const referentMatchesIntent = intended.size > 0 && !disjoint(referent, intended);
    if (stageDisagrees) {
      const stageMatchesPrevious = previous ? !disjoint(stage, previousReferent) && stage.size > 0 : false;
      const referentMoved = previous ? disjoint(referent, previousReferent) : false;
      const referentLag = stageMatchesIntent && !referentMatchesIntent;
      const stageLag = referentMatchesIntent && !stageMatchesIntent;
      const presentationRequested = isExplicitPresentationRequest(observation.utterance, observation.intent ?? "");
      const stagePersisted = Boolean(
        previous && observation.stageActiveSubjectId === previous.stageActiveSubjectId,
      );
      const namedPresentationMove = namedMove && intended.size > 0;
      const measureStageDisagreement =
        referentLag ||
        stageLag ||
        presentationRequested ||
        namedPresentationMove ||
        !stagePersisted;
      if (measureStageDisagreement) {
        push(drafts, {
          type: referentLag ? "STALE_REFERENT" : stageLag ? "STAGE_DIVERGENCE" : stageMatchesPrevious && referentMoved ? "CONTEXT_OVERRIDE" : "STAGE_DIVERGENCE",
          severity: "S1",
          owner: referentLag || (stageMatchesPrevious && referentMoved && !stageLag) ? "REFERENT" : "STAGE",
          turn: observation.turn,
          tick: observation.tick,
          observed: "Stage and conversation subjects diverged",
          expected: "Stage follows the canonical conversation subject when presentation requires a focus change",
          subjectId: observation.canonicalSubjectId ?? observation.focusedSubjectLabel,
          mlevelActiveId: observation.mlevelL1,
          stageActiveSubjectId: observation.stageActiveSubjectId,
        });
      }
    }
    const mlevelFollowsStage = stage.size > 0 && !disjoint(mlevel, stage);
    if (!mlevelFollowsStage && disjoint(mlevel, referent) && !(intended.size > 0 && !disjoint(mlevel, intended) && disjoint(referent, intended))) {
      push(drafts, {
        type: "MLEVEL_DIVERGENCE",
        severity: "S1",
        owner: "MLEVEL",
        turn: observation.turn,
        tick: observation.tick,
        observed: "MLEVEL L1 diverged from the conversation subject",
        expected: "MLEVEL L1 remains the canonical active subject",
        subjectId: observation.canonicalSubjectId,
        mlevelActiveId: observation.mlevelL1,
        stageActiveSubjectId: observation.stageActiveSubjectId,
      });
    }
    if (disjoint(nmi, referent)) {
      push(drafts, {
        type: "SUBJECT_LOSS",
        severity: "S1",
        owner: "NMI",
        turn: observation.turn,
        tick: observation.tick,
        observed: "NMI canonical identity diverged from the conversation subject",
        expected: "NMI identity matches the canonical conversation subject",
        subjectId: observation.nmiCanonicalId,
        mlevelActiveId: observation.mlevelL1,
        stageActiveSubjectId: observation.stageActiveSubjectId,
      });
    }
    const advisorMatchesIntent = intended.size > 0 && !disjoint(advisor, intended);
    if (disjoint(advisor, referent) && !advisorMatchesIntent) {
      push(drafts, {
        type: "ADVISOR_DIVERGENCE",
        severity: "S1",
        owner: "ADVISOR",
        turn: observation.turn,
        tick: observation.tick,
        observed: "Advisor referent diverged from the conversation subject",
        expected: "Advisor consumes the canonical conversation subject",
        subjectId: observation.advisorReferentId,
        mlevelActiveId: observation.mlevelL1,
        stageActiveSubjectId: observation.stageActiveSubjectId,
      });
    }

    if (observation.mlevelL2) {
      const live = hostNmiLiveManagementIntelligence({
        catalog: getDefaultNexoraMVPObjectInteractionCatalog(),
        focusedSubjectId: observation.mlevelL1,
      });
      const parentIds = live.map.relationships
        .filter((rel) => rel.kind === "belongs_to" && rel.fromId === observation.mlevelL1)
        .map((rel) => rel.toId);
      const uniqueParents = [...new Set(parentIds)];
      if (uniqueParents.length === 1 && uniqueParents[0] !== observation.mlevelL2) {
        push(drafts, {
          type: "STALE_PARENT",
          severity: "S1",
          owner: "MLEVEL",
          turn: observation.turn,
          tick: observation.tick,
          observed: `L2 ${observation.mlevelL2} is not the declared parent of ${observation.mlevelL1}`,
          expected: "L2 is the NMI belongs_to parent of L1, not a previous screen",
          subjectId: observation.canonicalSubjectId,
          mlevelActiveId: observation.mlevelL1,
          stageActiveSubjectId: observation.stageActiveSubjectId,
        });
      } else if (uniqueParents.length === 0) {
        push(drafts, {
          type: "STALE_PARENT",
          severity: "S1",
          owner: "MLEVEL",
          turn: observation.turn,
          tick: observation.tick,
          observed: `L2 ${observation.mlevelL2} is present without a declared belongs_to parent`,
          expected: "Missing ancestors remain NOT_APPLICABLE rather than a fabricated L2",
          subjectId: observation.canonicalSubjectId,
          mlevelActiveId: observation.mlevelL1,
          stageActiveSubjectId: observation.stageActiveSubjectId,
        });
      }
      if (observation.mlevelL3 && uniqueParents[0] === observation.mlevelL2) {
        const grandIds = live.map.relationships
          .filter((rel) => rel.kind === "belongs_to" && rel.fromId === observation.mlevelL2)
          .map((rel) => rel.toId);
        const uniqueGrands = [...new Set(grandIds)];
        if (uniqueGrands.length === 1 && uniqueGrands[0] !== observation.mlevelL3) {
          push(drafts, {
            type: "STALE_GRANDPARENT",
            severity: "S1",
            owner: "MLEVEL",
            turn: observation.turn,
            tick: observation.tick,
            observed: `L3 ${observation.mlevelL3} is not the declared parent of L2 ${observation.mlevelL2}`,
            expected: "L3 is NMI orientation for the active path, not a previous branch",
            subjectId: observation.canonicalSubjectId,
            mlevelActiveId: observation.mlevelL1,
            stageActiveSubjectId: observation.stageActiveSubjectId,
          });
        }
      }
      if (previous && disjoint(mlevel, familiesOf([previous.mlevelL1])) && previous.mlevelL2 === observation.mlevelL2 && observation.mlevelL2) {
        const previousParents = live.map.relationships
          .filter((rel) => rel.kind === "belongs_to" && rel.fromId === observation.mlevelL1)
          .map((rel) => rel.toId);
        if (!previousParents.includes(observation.mlevelL2)) {
          push(drafts, {
            type: "CROSS_BRANCH_ANCESTOR_LEAK",
            severity: "S1",
            owner: "MLEVEL",
            turn: observation.turn,
            tick: observation.tick,
            observed: "L2 remained on the previous branch after L1 changed",
            expected: "Cross-branch navigation recomputes ancestors from NMI",
            subjectId: observation.canonicalSubjectId,
            mlevelActiveId: observation.mlevelL1,
            stageActiveSubjectId: observation.stageActiveSubjectId,
          });
        }
      }
    }

    if (
      previous
      && !namedMove
      && !observation.deictic
      && disjoint(executive, previousExecutive)
      && disjoint(stage, previous ? familiesOf([previous.stageActiveSubjectId]) : new Set())
      && !disjoint(stage, previousExecutive)
      && !disjoint(executive, previous ? familiesOf([previous.stageActiveSubjectId]) : new Set())
    ) {
      push(drafts, {
        type: "CONTEXT_OSCILLATION",
        severity: "S1",
        owner: "STAGE",
        turn: observation.turn,
        tick: observation.tick,
        observed: "Executive subject and Stage swapped without a manager subject change",
        expected: "Canonical subject ownership does not oscillate without manager action",
        subjectId: observation.canonicalSubjectId,
        mlevelActiveId: observation.mlevelL1,
        stageActiveSubjectId: observation.stageActiveSubjectId,
      });
    }

    if (
      previous
      && observation.intent === "RETURN_TO_SUBJECT"
      && csvSignature(observation) !== csvSignature(previous)
      && observation.canonicalSubjectId
      && observation.canonicalSubjectId === previous.canonicalSubjectId
    ) {
      const priorTurn = previous;
      const priorClaims = claimNumbers(priorTurn.response);
      const currentClaims = claimNumbers(observation.response);
      for (const [metric, value] of Object.entries(currentClaims)) {
        const prior = priorClaims[metric];
        const visible = observation.visibleNumbers;
        const visibleChanged = Object.entries(visible).some(([key, current]) => priorTurn.visibleNumbers[key] !== current);
        if (prior === value && visibleChanged) {
          push(drafts, {
            type: "DATA_SNAPSHOT_RESTORE",
            severity: "S1",
            owner: "DATA_REALITY",
            turn: observation.turn,
            tick: observation.tick,
            observed: `${metric} restored ${value} after a newer ingestion`,
            expected: "Returning to an Object restores identity, not a stale data snapshot",
            subjectId: observation.canonicalSubjectId,
            mlevelActiveId: observation.mlevelL1,
            stageActiveSubjectId: observation.stageActiveSubjectId,
          });
        }
      }
    }
    if (
      observation.npsProblemLabel
      && disjoint(familiesOf([observation.npsProblemLabel]), referent)
      && (observation.intent === "FOCUS_PROBLEM" || observation.intent === "ASK_CAUSE")
      && !mentions(observation.response, [...referent][0] ?? "")
    ) {
      push(drafts, {
        type: "SUBJECT_LOSS",
        severity: "S3",
        owner: "NPS",
        turn: observation.turn,
        tick: observation.tick,
        observed: `NPS problem label ${observation.npsProblemLabel} differs from the active subject while the reply still discusses that subject`,
        expected: "NPS problem label and active subject stay semantically aligned",
        subjectId: observation.canonicalSubjectId,
        mlevelActiveId: observation.mlevelL1,
        stageActiveSubjectId: observation.stageActiveSubjectId,
      });
    }
    if (observation.intent === "ASK_VARIABLES" && disjoint(familiesOf([observation.vaiFocalObjectId]), referent)) {
      push(drafts, {
        type: "SUBJECT_LOSS",
        severity: "S1",
        owner: "VAI",
        turn: observation.turn,
        tick: observation.tick,
        observed: "VAI focal object diverged from the conversation subject",
        expected: "Existing VAI stays on the canonical conversation subject",
        subjectId: observation.vaiFocalObjectId,
        mlevelActiveId: observation.mlevelL1,
        stageActiveSubjectId: observation.stageActiveSubjectId,
      });
    }

    if (observation.intent === "REQUEST_EVIDENCE" && input.journey.mode === "INGESTION") {
      const available = new Set(observation.csvVersions.map((item) => item.sourceType.toLowerCase()));
      const named = observation.response.match(/\b(ERP|Production|Inventory|Maintenance|PMO|ProjectControl|CRM|HR)\.csv\b/gi) ?? [];
      const missing = named.filter((file) => !available.has(file.replace(/\.csv$/i, "").toLowerCase()));
      if (missing.length > 0) {
        push(drafts, {
          type: "EVIDENCE_MISMATCH",
          severity: "S1",
          owner: "ADVISOR",
          turn: observation.turn,
          tick: observation.tick,
          observed: `Response cited ${missing.join(", ")} outside ingested files`,
          expected: "Evidence cites current ingested data or stays unknown",
          subjectId: observation.canonicalSubjectId,
          mlevelActiveId: observation.mlevelL1,
          stageActiveSubjectId: observation.stageActiveSubjectId,
        });
      }
    }

    if (BEYOND_DATA.test(observation.utterance)) {
      const invented = /(?:competitor|forecast|next quarter)[^\d]{0,48}(\d+(?:\.\d+)?)/i.exec(observation.response);
      const visible = new Set(Object.values(observation.visibleNumbers));
      if (invented?.[1] && !visible.has(Number(invented[1])) && !UNCERTAIN.test(observation.response)) {
        push(drafts, {
          type: "UNSUPPORTED_FACT",
          severity: "S1",
          owner: "ADVISOR",
          turn: observation.turn,
          tick: observation.tick,
          observed: observation.response,
          expected: "Unavailable data stays unknown",
          subjectId: observation.canonicalSubjectId,
          mlevelActiveId: observation.mlevelL1,
          stageActiveSubjectId: observation.stageActiveSubjectId,
        });
      }
    }

    const signature = csvSignature(observation);
    for (const [metric, value] of Object.entries(claimNumbers(observation.response))) {
      const prior = claimHistory.get(metric);
      if (prior && prior.value !== value && prior.signature === signature) {
        push(drafts, {
          type: "STALE_DATA_USE",
          severity: "S1",
          owner: "DATA_REALITY",
          turn: observation.turn,
          tick: observation.tick,
          observed: `${metric} changed from ${prior.value} to ${value} without a data version change`,
          expected: "Numeric claims change only with legitimate Nexora-visible data",
          subjectId: observation.canonicalSubjectId,
          mlevelActiveId: observation.mlevelL1,
          stageActiveSubjectId: observation.stageActiveSubjectId,
        });
      }
      claimHistory.set(metric, { value, signature, turn: observation.turn });
    }

    const lifecycleJourney = input.journey.targetSurfaces.includes("CC10")
      || input.journey.targetSurfaces.includes("CC11");
    if (observation.decisionStatus && COMMITTED_DECISION.has(observation.decisionStatus) && !lifecycleJourney) {
      push(drafts, {
        type: "CONTEXT_OVERRIDE",
        severity: "S1",
        owner: "DECISION",
        turn: observation.turn,
        tick: observation.tick,
        observed: `Decision status ${observation.decisionStatus} during investigation`,
        expected: "Decision commitment stays with the existing Decision authority after the manager commits",
        subjectId: observation.canonicalSubjectId,
        mlevelActiveId: observation.mlevelL1,
        stageActiveSubjectId: observation.stageActiveSubjectId,
      });
    }

    if (input.journey.behaviorSeed != null) {
      const ambiguous = /^(what about that\??|is this bad\??|what changed\??|which one\??|can we improve it\??)$/i.test(observation.utterance.trim());
      const priorFamilies = previous
        ? familiesOf([previous.canonicalSubjectId, previous.conversationSubjectId, previous.focusedSubjectLabel])
        : new Set<string>();
      if (
        ambiguous
        && !observation.clarificationRequired
        && !UNCERTAIN.test(observation.response)
        && priorFamilies.size === 0
        && (referent.size > 0 || subjectFamilies(observation.response).size > 0)
      ) {
        push(drafts, {
          type: "FAILURE_TO_HANDLE_AMBIGUITY",
          severity: "S2",
          owner: "CC5_CONVERSATION",
          turn: observation.turn,
          tick: observation.tick,
          observed: observation.response,
          expected: "An underspecified turn is resolved from a visible subject or marked ambiguous",
          subjectId: observation.canonicalSubjectId,
          mlevelActiveId: observation.mlevelL1,
          stageActiveSubjectId: observation.stageActiveSubjectId,
        });
      }
      if (
        (observation.intent === "ASK_CAUSE" || observation.intent === "CHALLENGE")
        && /\b(definitely|certainly|proven cause|the cause is|we know that)\b/i.test(observation.response)
        && !UNCERTAIN.test(observation.response)
      ) {
        push(drafts, {
          type: "FALSE_CERTAINTY",
          severity: "S2",
          owner: "ADVISOR",
          turn: observation.turn,
          tick: observation.tick,
          observed: observation.response,
          expected: "Causal and challenge answers keep an epistemic mark when certainty is not established",
          subjectId: observation.canonicalSubjectId,
          mlevelActiveId: observation.mlevelL1,
          stageActiveSubjectId: observation.stageActiveSubjectId,
        });
      }
    }

    if (referent.size > 0 && (heldReferent.size === 0 || disjoint(referent, heldReferent))) {
      priorReferent = heldReferent;
      heldReferent = referent;
    }
    previous = observation;
  }

  const families = observations.map((observation) => {
    const current = familiesOf([
      observation.focusedSubjectLabel,
      observation.canonicalSubjectId,
      observation.intendedSubject,
    ]);
    return [...current][0] ?? "";
  });
  for (let index = 0; index + (loopBudget * 2) < families.length; index += 1) {
    const window = families.slice(index, index + (loopBudget * 2) + 2);
    const oscillating = window.length >= 6
      && window[0]
      && window[1]
      && window[0] !== window[1]
      && window.every((family, offset) => family === window[offset % 2]);
    const intents = observations.slice(index, index + window.length).map((item) => item.intent);
    const legitimate = intents.includes("RETURN_TO_SUBJECT") || intents.includes("CHECK_CHANGE");
    if (oscillating && !legitimate) {
      const turn = observations[index + window.length - 1]!;
      push(drafts, {
        type: "CONVERSATION_LOOP",
        severity: "S1",
        owner: "CC5_CONVERSATION",
        turn: turn.turn,
        tick: turn.tick,
        observed: window.join(" → "),
        expected: "Subject alternation includes management progression",
        subjectId: turn.canonicalSubjectId,
        mlevelActiveId: turn.mlevelL1,
        stageActiveSubjectId: turn.stageActiveSubjectId,
      });
      break;
    }
  }

  for (const turn of input.causalOverclaimTurns) {
    const observation = observations.find((item) => item.turn === turn) ?? observations[0];
    push(drafts, {
      type: "UNSUPPORTED_CAUSAL_CLAIM",
      severity: "S1",
      owner: "ADVISOR",
      turn,
      tick: observation?.tick ?? 0,
      observed: observation?.response ?? "Confirmed causal language",
      expected: "Hidden Ground Truth does not become Nexora causal knowledge",
      subjectId: observation?.canonicalSubjectId ?? null,
      mlevelActiveId: observation?.mlevelL1 ?? null,
      stageActiveSubjectId: observation?.stageActiveSubjectId ?? null,
    });
  }

  const unique = new Map<string, Draft>();
  for (const draft of drafts) unique.set(`${draft.type}:${draft.turn}:${draft.owner}`, draft);
  const findings = Object.freeze([...unique.values()].map((draft, index) => Object.freeze({
    findingId: `${input.testRunId}:journey:${draft.type}:${draft.turn}:${index}`,
    testRunId: input.testRunId,
    journeyId: input.journey.journeyId,
    scenarioId: input.journey.scenarioId,
    scenarioVersion: input.journey.scenarioVersion,
    rmsRunId: input.rmsRunId,
    tick: draft.tick,
    managerTurn: draft.turn,
    visibleDataRefs: Object.freeze([]),
    activeCanonicalSubjectId: draft.subjectId,
    mlevelActiveId: draft.mlevelActiveId,
    stageActiveSubjectId: draft.stageActiveSubjectId,
    observedBehavior: draft.observed,
    expectedInvariant: draft.expected,
    classification: `JOURNEY/${draft.type}`,
    severity: draft.severity,
    likelyOwner: draft.owner,
    traceReferences: Object.freeze([`${input.rmsRunId}:turn:${draft.turn}`]),
    repaired: false as const,
  })));

  return Object.freeze({
    findings,
    continuity: summarizeContinuity(input.journey, observations, findings),
    freshness: Object.freeze(observations.map((observation) => Object.freeze({
      turn: observation.turn,
      tick: observation.tick,
      latestIngestionTick: observation.csvVersions.reduce<number | null>(
        (latest, item) => latest == null ? item.tick : Math.max(latest, item.tick),
        null,
      ),
      dataRealityRefs: observation.dataPublicationIds,
      csvVersions: Object.freeze(observation.csvVersions.map((item) => Object.freeze({
        sourceType: item.sourceType,
        version: item.version,
      }))),
    }))),
  });
}

function exercised(observations: readonly NexoraSimulationJourneyTurnObservation[], intents: readonly string[]): boolean {
  return observations.some((item) => item.intent != null && intents.includes(item.intent));
}

function statusFor(
  exercisedDimension: boolean,
  failed: boolean,
): NexoraSimulationContinuityStatus {
  if (!exercisedDimension) return "NOT-EXERCISED";
  return failed ? "FAIL" : "PASS";
}

export function summarizeContinuity(
  _journey: NexoraSimulationTestJourney,
  observations: readonly NexoraSimulationJourneyTurnObservation[],
  findings: readonly NexoraSimulationTestFinding[],
): NexoraSimulationContinuitySummary {
  const has = (type: string) => findings.some((finding) => finding.classification.endsWith(`/${type}`) || finding.classification.includes(type));
  const asked = (intents: readonly string[]) => exercised(observations, intents);
  const dataMoved = observations.some((item, index) => index > 0 && csvSignature(item) !== csvSignature(observations[0]!));
  const decisionCommitted = observations.some((item) => item.decisionStatus != null && COMMITTED_DECISION.has(item.decisionStatus));
  return Object.freeze({
    conversationContinuity: statusFor(
      observations.length > 0,
      findings.some((finding) =>
        (finding.severity === "S0" || finding.severity === "S1")
        && finding.likelyOwner === "CC5_CONVERSATION"
        && ["SUBJECT_LOSS", "CONVERSATION_LOOP", "REPEATED_CLARIFICATION", "CROSS_SUBJECT_CONTAMINATION"].some((type) => finding.classification.includes(type)),
      ),
    ),
    referentContinuity: statusFor(
      asked(["FOLLOW_UP", "ASK_CAUSE", "CHANGE_CONTEXT", "RETURN_TO_SUBJECT", "COMPARE"]),
      has("STALE_REFERENT") || has("WRONG_REFERENT") || has("REFERENT_ERROR") || has("CONTEXT_OVERRIDE"),
    ),
    nmiIdentityContinuity: statusFor(
      observations.some((item) => item.nmiCanonicalId != null || item.canonicalSubjectId != null),
      findings.some((finding) => finding.likelyOwner === "NMI" && (finding.severity === "S0" || finding.severity === "S1")),
    ),
    mlevelContinuity: statusFor(
      observations.some((item) => item.mlevelL1 != null || item.intent === "REQUEST_PARENT"),
      has("MLEVEL_DIVERGENCE") || observations.some((item) => {
        if (item.intent !== "CHANGE_CONTEXT" && item.intent !== "FOLLOW_UP" && item.intent !== "RETURN_TO_SUBJECT") return false;
        return disjoint(
          familiesOf([item.mlevelL1]),
          familiesOf([item.canonicalSubjectId, item.conversationSubjectId]),
        );
      }),
    ),
    stageContinuity: statusFor(
      observations.some((item) => item.stageActiveSubjectId != null || item.sceneIntent != null),
      has("STAGE_DIVERGENCE"),
    ),
    advisorContinuity: statusFor(
      observations.some((item) => item.advisorReferentId != null || item.advisorReferentName != null || item.response.length > 0),
      has("ADVISOR_DIVERGENCE"),
    ),
    ancestorContinuity: statusFor(
      observations.some((item) => item.mlevelL2 != null || item.ancestorApplicable === "NOT_APPLICABLE" || item.intent === "REQUEST_PARENT"),
      has("STALE_PARENT") || has("STALE_GRANDPARENT") || has("CROSS_BRANCH_ANCESTOR_LEAK"),
    ),
    interactionContinuity: statusFor(
      asked(["FOLLOW_UP"]) && observations.some((item) => item.deictic),
      has("INTERACTION_DESYNC") || has("CONTEXT_OSCILLATION"),
    ),
    historicalReturnContinuity: statusFor(
      asked(["RETURN_TO_SUBJECT"]),
      findings.some((finding) =>
        finding.classification.includes("STALE_REFERENT")
        && observations.find((item) => item.turn === finding.managerTurn)?.intent === "RETURN_TO_SUBJECT",
      ),
    ),
    identityPreservation: statusFor(
      observations.length > 1,
      has("IDENTITY_DRIFT") || has("DATA_SNAPSHOT_RESTORE"),
    ),
    dataFreshness: statusFor(
      asked(["CHECK_CHANGE"]) || dataMoved,
      has("STALE_DATA_USE"),
    ),
    evidenceSafety: statusFor(
      asked(["REQUEST_EVIDENCE"]),
      has("EVIDENCE_MISMATCH") || has("UNSUPPORTED_FACT"),
    ),
    causalSafety: statusFor(
      asked(["ASK_CAUSE"]),
      has("UNSUPPORTED_CAUSAL_CLAIM") || has("CAUSAL_OVERCLAIM"),
    ),
    decisionDeferredLegitimately: !decisionCommitted && !findings.some((finding) => finding.likelyOwner === "DECISION"),
  });
}

export function assessCrossRunIsolation(
  reports: readonly NexoraSimulationTestRunReport[],
): { readonly status: "PASS" | "FAIL"; readonly findings: readonly NexoraSimulationTestFinding[] } {
  const findings: NexoraSimulationTestFinding[] = [];
  for (let left = 0; left < reports.length; left += 1) {
    for (let right = left + 1; right < reports.length; right += 1) {
      const a = reports[left]!;
      const b = reports[right]!;
      if (a.identity.scenarioId === b.identity.scenarioId && a.identity.journeyId === b.identity.journeyId) continue;
      const aFiles = new Set((a.ingestion?.files ?? []).map((file) => file.fileId));
      const bFiles = new Set((b.ingestion?.files ?? []).map((file) => file.fileId));
      const sharedFiles = [...aFiles].filter((id) => bFiles.has(id));
      const aPubs = new Set(a.checkpoints.flatMap((item) => item.dataRealityPublicationIds));
      const bPubs = new Set(b.checkpoints.flatMap((item) => item.dataRealityPublicationIds));
      const sharedPubs = [...aPubs].filter((id) => bPubs.has(id));
      const sharedRun = a.identity.rmsRunId === b.identity.rmsRunId;
      if (sharedFiles.length === 0 && sharedPubs.length === 0 && !sharedRun) continue;
      findings.push(Object.freeze({
        findingId: `cross-run:${a.identity.journeyId}:${b.identity.journeyId}`,
        testRunId: a.identity.simulationTestRunId,
        journeyId: a.identity.journeyId,
        scenarioId: a.identity.scenarioId,
        scenarioVersion: a.identity.scenarioVersion,
        rmsRunId: a.identity.rmsRunId,
        tick: 0,
        managerTurn: 0,
        visibleDataRefs: Object.freeze([...sharedFiles, ...sharedPubs]),
        activeCanonicalSubjectId: null,
        mlevelActiveId: null,
        stageActiveSubjectId: null,
        observedBehavior: sharedRun
          ? "Runs shared an RMS run id"
          : `Shared data identity across ${a.identity.scenarioId} and ${b.identity.scenarioId}`,
        expectedInvariant: "Manager, conversation, and Data Reality state stay isolated across journeys",
        classification: "JOURNEY/CROSS_SUBJECT_CONTAMINATION",
        severity: "S0",
        likelyOwner: sharedRun ? "HARNESS" : "DATA_REALITY",
        traceReferences: Object.freeze([a.identity.rmsRunId, b.identity.rmsRunId]),
        repaired: false as const,
      }));
    }
  }
  return Object.freeze({
    status: findings.length === 0 ? "PASS" as const : "FAIL" as const,
    findings: Object.freeze(findings),
  });
}

export function renderJourneyTimeline(report: NexoraSimulationTestRunReport): string {
  const lines = [`# ${report.identity.journeyId}`, ""];
  for (const observation of report.journeyObservations) {
    const failed = report.journeyFindings.some((finding) =>
      finding.managerTurn === observation.turn && (finding.severity === "S0" || finding.severity === "S1"),
    ) || report.findings.some((finding) =>
      finding.managerTurn === observation.turn && (finding.severity === "S0" || finding.severity === "S1"),
    );
    const versions = observation.csvVersions.map((item) => `${item.sourceType} v${item.version}`).join(", ");
    lines.push(
      `Turn ${String(observation.turn).padStart(2, "0")} — ${observation.intent ?? "TURN"}`,
      `Subject: ${observation.intendedSubject ?? observation.focusedSubjectLabel ?? "forming"}`,
      versions ? `Data: ${versions}` : "Data: unchanged",
      `Result: ${failed ? "FAIL" : "PASS"}`,
      "",
    );
  }
  return lines.join("\n");
}

export function renderStressTransitionTable(report: NexoraSimulationTestRunReport): string {
  const header = [
    "Turn | Manager action | Canonical subject | L1 | L2 | L3 | Stage focus | Referent | Data version | Result",
    "--- | --- | --- | --- | --- | --- | --- | --- | --- | ---",
  ];
  const rows = report.journeyObservations.map((observation) => {
    const failed = report.findings.some((finding) =>
      finding.managerTurn === observation.turn && (finding.severity === "S0" || finding.severity === "S1"),
    );
    const data = observation.csvVersions.map((item) => `${item.sourceType}@${item.version}`).join(",") || "—";
    return [
      observation.turn,
      observation.utterance.replace(/\|/g, "/"),
      observation.canonicalSubjectId ?? "—",
      observation.mlevelL1 ?? "—",
      observation.mlevelL2 ?? (observation.ancestorApplicable === "NOT_APPLICABLE" ? "NOT_APPLICABLE" : "—"),
      observation.mlevelL3 ?? (observation.ancestorApplicable === "NOT_APPLICABLE" ? "NOT_APPLICABLE" : "—"),
      observation.stageActiveSubjectId ?? "—",
      observation.conversationSubjectId ?? "—",
      data,
      failed ? "FAIL" : "PASS",
    ].join(" | ");
  });
  return ["# Transition evidence", "", ...header, ...rows].join("\n");
}

export function renderContinuitySummary(report: NexoraSimulationTestRunReport): string {
  const continuity = report.continuity;
  return [
    `Conversation continuity: ${continuity.conversationContinuity}`,
    `Referent continuity: ${continuity.referentContinuity}`,
    `NMI: ${continuity.nmiIdentityContinuity}`,
    `MLEVEL: ${continuity.mlevelContinuity}`,
    `Stage: ${continuity.stageContinuity}`,
    `Advisor: ${continuity.advisorContinuity}`,
    `Ancestors: ${continuity.ancestorContinuity}`,
    `Interaction: ${continuity.interactionContinuity}`,
    `Historical return: ${continuity.historicalReturnContinuity}`,
    `Identity: ${continuity.identityPreservation}`,
    `Data freshness: ${continuity.dataFreshness}`,
    `Evidence safety: ${continuity.evidenceSafety}`,
    `Causal safety: ${continuity.causalSafety}`,
    `Decision deferred: ${continuity.decisionDeferredLegitimately ? "YES" : "NO"}`,
  ].join("\n");
}

const SUCCESS_CLAIM = /\b(success(?:ful(?:ly)?)?|it worked|resolved|fixed|succeeded)\b/i;
const TOO_EARLY = /too early|not yet|insufficient|don't know|do not know|cannot tell|can't tell|partial|mixed|not enough evidence/i;
const CLAIMED_NUMBER = /\b\d{3,}(?:\.\d+)?\b|\b\d+\.\d+\b/g;

function claimedNumbers(text: string): readonly number[] {
  return Object.freeze((text.match(CLAIMED_NUMBER) ?? []).map((token) => Number(token)).filter((value) => Number.isFinite(value)));
}

function csvFingerprint(observation: NexoraSimulationJourneyTurnObservation): string {
  return observation.csvVersions.map((item) => `${item.sourceType}:${item.version}`).join("|");
}

export function classifyLifecycleJourney(input: {
  readonly testRunId: string;
  readonly rmsRunId: string;
  readonly journey: NexoraSimulationTestJourney;
  readonly observations: readonly NexoraSimulationJourneyTurnObservation[];
}): readonly NexoraSimulationTestFinding[] {
  const drafts: Draft[] = [];
  const observations = input.observations;
  let committedDecisionId: string | null = null;
  let committedTurn = 0;
  let previousDecisionCount = 0;
  let executionStartedId: string | null = null;
  let executionStartTurn = 0;
  let executionStartCsv = "";
  let firstOutcomeId: string | null = null;

  for (const observation of observations) {
    const hiddenOnly = Object.entries(observation.observerHiddenNumbers ?? {}).filter(([key, value]) => {
      const visible = observation.visibleNumbers[key];
      if (visible === value) return false;
      return !Object.values(observation.visibleNumbers).includes(value);
    });
    for (const claimed of claimedNumbers(observation.response)) {
      if (hiddenOnly.some(([, value]) => value === claimed)) {
        push(drafts, {
          type: "GROUND_TRUTH_LEAK",
          severity: "S0",
          owner: "ADVISOR",
          turn: observation.turn,
          tick: observation.tick,
          observed: `Response claimed ${claimed} matching sealed Ground Truth not present in Data Reality`,
          expected: "Nexora answers only from Data Reality and legitimate analysis",
          subjectId: observation.canonicalSubjectId,
          mlevelActiveId: observation.mlevelL1,
          stageActiveSubjectId: observation.stageActiveSubjectId,
        });
      }
    }

    if (observation.intent === "EXPLORE_OPTIONS" || observation.intent === "COMPARE") {
      const decisionCountAfter = observation.decisionCount ?? (observation.decisionId ? 1 : 0);
      const writtenThisTurn = decisionCountAfter > previousDecisionCount;
      if (writtenThisTurn || (observation.decisionId != null && !committedDecisionId)) {
        push(drafts, {
          type: "PREMATURE_DECISION",
          severity: "S1",
          owner: "CC10_DECISION",
          turn: observation.turn,
          tick: observation.tick,
          observed: writtenThisTurn
            ? `Decision ${observation.decisionId ?? "unknown"} was written during exploring/comparing`
            : `Decision ${observation.decisionId} appeared during exploring/comparing without a prior commitment event`,
          expected: "Scenario comparison does not create a canonical Decision; an already-committed Decision may remain visible",
          subjectId: observation.canonicalSubjectId,
          mlevelActiveId: observation.mlevelL1,
          stageActiveSubjectId: observation.stageActiveSubjectId,
        });
      }
    }

    if (observation.intent === "REQUEST_EXECUTION_BEFORE_COMMIT") {
      if (observation.executionId) {
        push(drafts, {
          type: "PREMATURE_EXECUTION",
          severity: "S1",
          owner: "CC11_EXECUTION",
          turn: observation.turn,
          tick: observation.tick,
          observed: `Execution ${observation.executionId} before a committed Decision`,
          expected: "Execution requires a legitimate committed Decision",
          subjectId: observation.canonicalSubjectId,
          mlevelActiveId: observation.mlevelL1,
          stageActiveSubjectId: observation.stageActiveSubjectId,
        });
      }
    }

    if (observation.executionId && !observation.decisionId) {
      push(drafts, {
        type: "PREMATURE_EXECUTION",
        severity: "S1",
        owner: "CC11_EXECUTION",
        turn: observation.turn,
        tick: observation.tick,
        observed: `Execution ${observation.executionId} without a Decision identity`,
        expected: "Valid Execution remains linked to a committed Decision",
        subjectId: observation.canonicalSubjectId,
        mlevelActiveId: observation.mlevelL1,
        stageActiveSubjectId: observation.stageActiveSubjectId,
      });
    }

    if (observation.intent === "COMMIT_DECISION" && observation.decisionId) {
      if (!committedDecisionId) {
        committedDecisionId = observation.decisionId;
        committedTurn = observation.turn;
      } else if ((observation.decisionCount ?? 0) > 1) {
        push(drafts, {
          type: "DUPLICATE_DECISION",
          severity: "S1",
          owner: "CC10_DECISION",
          turn: observation.turn,
          tick: observation.tick,
          observed: `${observation.decisionCount} canonical Decisions after repeated commitment`,
          expected: "Repeated commitment does not create a second Decision",
          subjectId: observation.canonicalSubjectId,
          mlevelActiveId: observation.mlevelL1,
          stageActiveSubjectId: observation.stageActiveSubjectId,
        });
      } else if (observation.decisionId !== committedDecisionId) {
        push(drafts, {
          type: "DECISION_IDENTITY_DRIFT",
          severity: "S1",
          owner: "CC10_DECISION",
          turn: observation.turn,
          tick: observation.tick,
          observed: `Decision identity moved from ${committedDecisionId} to ${observation.decisionId}`,
          expected: "Committed Decision identity remains stable",
          subjectId: observation.canonicalSubjectId,
          mlevelActiveId: observation.mlevelL1,
          stageActiveSubjectId: observation.stageActiveSubjectId,
        });
      }
    }

    if (committedDecisionId && observation.decisionId && observation.decisionId !== committedDecisionId && observation.intent !== "REVERSE_DECISION") {
      push(drafts, {
        type: "DECISION_IDENTITY_DRIFT",
        severity: "S1",
        owner: "CC10_DECISION",
        turn: observation.turn,
        tick: observation.tick,
        observed: `Committed Decision ${committedDecisionId} replaced by ${observation.decisionId}`,
        expected: "Discussing another scenario does not replace the committed Decision",
        subjectId: observation.canonicalSubjectId,
        mlevelActiveId: observation.mlevelL1,
        stageActiveSubjectId: observation.stageActiveSubjectId,
      });
    }

    if (observation.intent === "REQUEST_EXECUTION" && observation.executionId) {
      if (!executionStartedId) {
        executionStartedId = observation.executionId;
        executionStartTurn = observation.turn;
        executionStartCsv = csvFingerprint(observation);
      } else if ((observation.executionCount ?? 0) > 1) {
        push(drafts, {
          type: "DUPLICATE_EXECUTION",
          severity: "S1",
          owner: "CC11_EXECUTION",
          turn: observation.turn,
          tick: observation.tick,
          observed: `${observation.executionCount} canonical Executions after repeated start commands`,
          expected: "Repeated execution commands reuse the existing Execution",
          subjectId: observation.canonicalSubjectId,
          mlevelActiveId: observation.mlevelL1,
          stageActiveSubjectId: observation.stageActiveSubjectId,
        });
      }
      if (committedDecisionId && observation.decisionId && observation.decisionId !== committedDecisionId) {
        push(drafts, {
          type: "WRONG_EXECUTION_REFERENT",
          severity: "S1",
          owner: "CC11_EXECUTION",
          turn: observation.turn,
          tick: observation.tick,
          observed: `Execution linked to ${observation.decisionId} instead of ${committedDecisionId}`,
          expected: "Start it resolves to the committed Decision",
          subjectId: observation.canonicalSubjectId,
          mlevelActiveId: observation.mlevelL1,
          stageActiveSubjectId: observation.stageActiveSubjectId,
        });
      }
    }

    const establishedOutcome = observation.npsOutcomeStatus === "MEETS_EXPECTATION"
      || observation.npsOutcomeStatus === "EXCEEDS_EXPECTATION"
      || observation.npsResolutionStatus === "RESOLVED";

    if (observation.intent === "ASK_OUTCOME") {
      if (!executionStartedId && establishedOutcome) {
        push(drafts, {
          type: "PREMATURE_OUTCOME",
          severity: "S1",
          owner: "OUTCOME",
          turn: observation.turn,
          tick: observation.tick,
          observed: `Outcome ${observation.npsOutcomeStatus}/${observation.npsResolutionStatus} before Execution`,
          expected: "Outcome follows Execution and observable evidence",
          subjectId: observation.canonicalSubjectId,
          mlevelActiveId: observation.mlevelL1,
          stageActiveSubjectId: observation.stageActiveSubjectId,
        });
      }
      if (executionStartedId && csvFingerprint(observation) === executionStartCsv && establishedOutcome) {
        push(drafts, {
          type: "PREMATURE_OUTCOME",
          severity: "S1",
          owner: "OUTCOME",
          turn: observation.turn,
          tick: observation.tick,
          observed: "Outcome success before post-execution Data Reality change",
          expected: "Execution start is not Outcome success",
          subjectId: observation.canonicalSubjectId,
          mlevelActiveId: observation.mlevelL1,
          stageActiveSubjectId: observation.stageActiveSubjectId,
        });
      }
      if (executionStartedId && !establishedOutcome && SUCCESS_CLAIM.test(observation.response) && !TOO_EARLY.test(observation.response)) {
        push(drafts, {
          type: "PREMATURE_OUTCOME",
          severity: "S1",
          owner: "ADVISOR",
          turn: observation.turn,
          tick: observation.tick,
          observed: observation.response,
          expected: "Advisor does not convert execution started into success without evidence",
          subjectId: observation.canonicalSubjectId,
          mlevelActiveId: observation.mlevelL1,
          stageActiveSubjectId: observation.stageActiveSubjectId,
        });
      }
      if (observation.npsOutcomeStatus && !firstOutcomeId) firstOutcomeId = observation.npsOutcomeStatus;
    }

    if (observation.intent === "ASK_COUNTERFACTUAL" && establishedOutcome && /option a/i.test(observation.response) && SUCCESS_CLAIM.test(observation.response) && !/would|might|not executed|never executed|counterfactual/i.test(observation.response)) {
      push(drafts, {
        type: "UNSUPPORTED_OUTCOME",
        severity: "S1",
        owner: "OUTCOME",
        turn: observation.turn,
        tick: observation.tick,
        observed: observation.response,
        expected: "An unexecuted scenario is not observed Outcome",
        subjectId: observation.canonicalSubjectId,
        mlevelActiveId: observation.mlevelL1,
        stageActiveSubjectId: observation.stageActiveSubjectId,
      });
    }

    if (observation.npsLearningDurable) {
      push(drafts, {
        type: "SIMULATION_LEARNING_LEAK",
        severity: "S0",
        owner: "LEARNING",
        turn: observation.turn,
        tick: observation.tick,
        observed: "Durable Learning write observed in simulation context",
        expected: "Simulation results do not become durable real-world Learning",
        subjectId: observation.canonicalSubjectId,
        mlevelActiveId: observation.mlevelL1,
        stageActiveSubjectId: observation.stageActiveSubjectId,
      });
    }

    if (observation.intent === "ASK_OUTCOME" && observation.npsLearningStatus && observation.npsLearningStatus !== "NONE" && !executionStartedId) {
      push(drafts, {
        type: "PREMATURE_LEARNING",
        severity: "S1",
        owner: "LEARNING",
        turn: observation.turn,
        tick: observation.tick,
        observed: `Learning status ${observation.npsLearningStatus} before Execution`,
        expected: "Learning follows legitimate Outcome evidence",
        subjectId: observation.canonicalSubjectId,
        mlevelActiveId: observation.mlevelL1,
        stageActiveSubjectId: observation.stageActiveSubjectId,
      });
    }

    previousDecisionCount = observation.decisionCount ?? (observation.decisionId ? 1 : previousDecisionCount);
  }

  const commitBeforeExecute = observations.some((item) => item.intent === "REQUEST_EXECUTION" && item.executionId)
    && observations.some((item) => item.intent === "COMMIT_DECISION" && item.decisionId);
  if (commitBeforeExecute) {
    const commit = observations.find((item) => item.intent === "COMMIT_DECISION" && item.decisionId);
    const execute = observations.find((item) => item.intent === "REQUEST_EXECUTION" && item.executionId);
    if (commit && execute && execute.turn < commit.turn) {
      push(drafts, {
        type: "LIFECYCLE_ORDER_VIOLATION",
        severity: "S1",
        owner: "CC11_EXECUTION",
        turn: execute.turn,
        tick: execute.tick,
        observed: "Execution created before Decision commitment",
        expected: "Decision → Execution ordering",
        subjectId: execute.canonicalSubjectId,
        mlevelActiveId: execute.mlevelL1,
        stageActiveSubjectId: execute.stageActiveSubjectId,
      });
    }
  }

  const attemptedCommit = observations.find((item) => item.intent === "COMMIT_DECISION");
  if (attemptedCommit && !observations.some((item) => Boolean(item.decisionId))) {
    push(drafts, {
      type: "MISSING_DECISION",
      severity: "S1",
      owner: "CC5_CONVERSATION",
      turn: attemptedCommit.turn,
      tick: attemptedCommit.tick,
      observed: attemptedCommit.response,
      expected: "Explicit manager commitment reaches CC:10 as a canonical Decision",
      subjectId: attemptedCommit.canonicalSubjectId,
      mlevelActiveId: attemptedCommit.mlevelL1,
      stageActiveSubjectId: attemptedCommit.stageActiveSubjectId,
    });
  }

  void committedTurn;
  void executionStartTurn;
  void firstOutcomeId;

  return Object.freeze(drafts.map((draft, index) => Object.freeze({
    findingId: `${input.testRunId}:lifecycle:${draft.type}:${draft.turn}:${index}`,
    testRunId: input.testRunId,
    journeyId: input.journey.journeyId,
    scenarioId: input.journey.scenarioId,
    scenarioVersion: input.journey.scenarioVersion,
    rmsRunId: input.rmsRunId,
    tick: draft.tick,
    managerTurn: draft.turn,
    visibleDataRefs: Object.freeze([]),
    activeCanonicalSubjectId: draft.subjectId,
    mlevelActiveId: draft.mlevelActiveId,
    stageActiveSubjectId: draft.stageActiveSubjectId,
    observedBehavior: draft.observed,
    expectedInvariant: draft.expected,
    classification: `JOURNEY/${draft.type}`,
    severity: draft.severity,
    likelyOwner: draft.owner,
    traceReferences: Object.freeze([`${input.rmsRunId}:turn:${draft.turn}`]),
    repaired: false as const,
  })));
}

const SEALED_GROUND_TRUTH = /availableCapacity|machineAvailability|confirmedCausal|\bevt:machine|\bevt:demand|Ground Truth/i;
const CURRENT_LANGUAGE = /\b(now|currently|just changed|machine failed|capacity recovered|demand surge)\b/i;

function hiddenOnlyClaims(observation: NexoraSimulationJourneyTurnObservation): readonly number[] {
  const hidden = Object.entries(observation.observerHiddenNumbers ?? {}).filter(([key, value]) => {
    const visible = observation.visibleNumbers[key];
    if (visible === value) return false;
    return !Object.values(observation.visibleNumbers).includes(value);
  }).map(([, value]) => value);
  return Object.freeze(hidden);
}

export function classifyAdaptiveJourney(input: {
  readonly testRunId: string;
  readonly rmsRunId: string;
  readonly journey: NexoraSimulationTestJourney;
  readonly observations: readonly NexoraSimulationJourneyTurnObservation[];
}): readonly NexoraSimulationTestFinding[] {
  if (!input.journey.adaptiveFamily) return Object.freeze([]);
  const drafts: Draft[] = [];
  let previous: NexoraSimulationJourneyTurnObservation | null = null;
  for (const observation of input.observations) {
    const hiddenOnly = hiddenOnlyClaims(observation);
    const claimed = Object.values(claimNumbers(observation.response));
    const unpublished = observation.worldAdvancedUnpublished === true;
    if (SEALED_GROUND_TRUTH.test(observation.response)) {
      push(drafts, {
        type: "GROUND_TRUTH_LEAK",
        severity: "S0",
        owner: "ADVISOR",
        turn: observation.turn,
        tick: observation.tick,
        observed: observation.response,
        expected: "Nexora answers only from Data Reality and legitimate analysis",
        subjectId: observation.canonicalSubjectId,
        mlevelActiveId: observation.mlevelL1,
        stageActiveSubjectId: observation.stageActiveSubjectId,
      });
    }
    if (unpublished && claimed.some((value) => hiddenOnly.includes(value))) {
      push(drafts, {
        type: "GROUND_TRUTH_LEAK",
        severity: "S0",
        owner: "ADVISOR",
        turn: observation.turn,
        tick: observation.tick,
        observed: "Response used sealed Ground Truth numbers before Operator publication",
        expected: "Hidden Ground Truth does not become Nexora knowledge until Data Reality updates",
        subjectId: observation.canonicalSubjectId,
        mlevelActiveId: observation.mlevelL1,
        stageActiveSubjectId: observation.stageActiveSubjectId,
      });
    }
    if (unpublished && CURRENT_LANGUAGE.test(observation.response) && hiddenOnly.length > 0 && claimed.some((value) => hiddenOnly.includes(value))) {
      push(drafts, {
        type: "TEMPORAL_CONFUSION",
        severity: "S1",
        owner: "ADVISOR",
        turn: observation.turn,
        tick: observation.tick,
        observed: "Current-state language used unpublished Ground Truth",
        expected: "Before publication, Nexora keeps the last Data Reality or stays unknown",
        subjectId: observation.canonicalSubjectId,
        mlevelActiveId: observation.mlevelL1,
        stageActiveSubjectId: observation.stageActiveSubjectId,
      });
    }
    if (previous && csvSignature(observation) !== csvSignature(previous) && !observation.clarificationRequired && !UNCERTAIN.test(observation.response)) {
      const priorClaims = claimNumbers(previous.response);
      const currentClaims = claimNumbers(observation.response);
      const visibleChanged = Object.entries(observation.visibleNumbers).some(([key, value]) => previous.visibleNumbers[key] !== value);
      const staleClaim = Object.entries(currentClaims).some(([metric, value]) => priorClaims[metric] === value);
      if (visibleChanged && staleClaim) {
        const temporalAsk = observation.intent === "CHECK_CHANGE" || observation.intent === "REASSESS";
        push(drafts, {
          type: temporalAsk ? "CURRENT_STATE_IGNORED" : "STALE_EVIDENCE",
          severity: "S1",
          owner: "DATA_REALITY",
          turn: observation.turn,
          tick: observation.tick,
          observed: temporalAsk
            ? "Follow-up after a Data Reality update restated the previous numbers"
            : "Response kept prior numeric claims after a newer ingested version",
          expected: "Newer Data Reality supersedes older conversational numbers, or the answer stays unknown",
          subjectId: observation.canonicalSubjectId,
          mlevelActiveId: observation.mlevelL1,
          stageActiveSubjectId: observation.stageActiveSubjectId,
        });
      }
    }
    previous = observation;
  }
  const unique = new Map<string, Draft>();
  for (const draft of drafts) unique.set(`${draft.type}:${draft.turn}:${draft.owner}`, draft);
  return Object.freeze([...unique.values()].map((draft, index) => Object.freeze({
    findingId: `${input.testRunId}:adaptive:${draft.type}:${draft.turn}:${index}`,
    testRunId: input.testRunId,
    journeyId: input.journey.journeyId,
    scenarioId: input.journey.scenarioId,
    scenarioVersion: input.journey.scenarioVersion,
    rmsRunId: input.rmsRunId,
    tick: draft.tick,
    managerTurn: draft.turn,
    visibleDataRefs: Object.freeze([]),
    activeCanonicalSubjectId: draft.subjectId,
    mlevelActiveId: draft.mlevelActiveId,
    stageActiveSubjectId: draft.stageActiveSubjectId,
    observedBehavior: draft.observed,
    expectedInvariant: draft.expected,
    classification: `JOURNEY/${draft.type}`,
    severity: draft.severity,
    likelyOwner: draft.owner,
    traceReferences: Object.freeze([`${input.rmsRunId}:turn:${draft.turn}`]),
    repaired: false as const,
  })));
}

export function renderLifecycleTable(report: NexoraSimulationTestRunReport): string {
  const header = [
    "Turn | Tick | Manager action | Subject | Problem | Scenario | Decision | Execution | Data version | Outcome | Learning | Result",
    "--- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | ---",
  ];
  const rows = report.journeyObservations
    .filter((observation) => observation.intent && [
      "FOCUS_PROBLEM", "REQUEST_EVIDENCE", "ASK_VARIABLES", "EXPLORE_OPTIONS", "COMPARE",
      "REQUEST_EXECUTION_BEFORE_COMMIT", "COMMIT_DECISION", "REQUEST_EXECUTION",
      "ASK_OUTCOME", "ASK_COUNTERFACTUAL", "REVERSE_DECISION", "CHECK_CHANGE",
    ].includes(observation.intent))
    .map((observation) => {
      const failed = report.findings.some((finding) =>
        finding.managerTurn === observation.turn && (finding.severity === "S0" || finding.severity === "S1"),
      );
      const data = observation.csvVersions.map((item) => `${item.sourceType}@${item.version}`).join(",") || "—";
      return [
        observation.turn,
        observation.tick,
        observation.utterance.replace(/\|/g, "/"),
        observation.canonicalSubjectId ?? observation.focusedSubjectLabel ?? "—",
        observation.problemId ?? observation.npsProblemLabel ?? "—",
        observation.scenarioId ?? "—",
        observation.decisionId ?? "—",
        observation.executionId ?? "—",
        data,
        observation.npsOutcomeStatus ?? observation.nxa3OutcomeState ?? "—",
        observation.npsLearningDurable ? "DURABLE" : (observation.npsLearningStatus ?? "NOT_APPLICABLE"),
        failed ? "FAIL" : "PASS",
      ].join(" | ");
    });
  return ["# Lifecycle checkpoints", "", ...header, ...rows].join("\n");
}
