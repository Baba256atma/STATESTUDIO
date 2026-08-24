/**
 * NEX-EXP:4 — issue discovery turns and restrained Stage overlay.
 * Goal remains center. Candidates are not automatically confirmed issues.
 */

import type {
  NexoraMVPObjectInteractionCatalog,
  NexoraMVPObjectInteractionState,
} from "@/app/lib/nex-mvp/nexoraMVPObjectInteraction.ts";
import {
  isRealityDiscoveryComplete,
  isNexoraRealityMetaUtterance,
} from "./nexoraRealityDiscoveryExperience.ts";
import type { NexoraEntranceSession } from "./nexoraEntranceTypes.ts";
import type { NexoraIssueDiscoveryHandoff } from "./nexoraRealityDiscoveryTypes.ts";
import {
  applyConstraintChange,
  candidateFromUtterance,
  comparablePriorities,
  convertRiskIfCurrent,
  discoveryPrioritySubject,
  ei3HypothesisClaim,
  ei3UnknownCauseRelationship,
  emergeIssueObjects,
  isIssueClassificationUtterance,
  isIssueMetaUtterance,
  isRecommendationRequest,
  mergeIssueCandidate,
  relationshipIsNotCause,
  seedCandidatesFromHandoff,
  shouldBecomeStageObject,
} from "./nexoraIssueDiscoveryResolution.ts";
import { isScenarioDiscoveryUtterance } from "./nexoraScenarioDiscoveryResolution.ts";
import {
  NEXORA_ISSUE_DISCOVERY_BOUNDARY,
  getNexoraIssueDiscoveryExperienceIdentity,
  type ExecutiveIssueCandidate,
  type ExecutiveIssueObject,
  type IssueDiscoveryState,
  type NexoraIssueDiscoverySession,
  type NexoraScenarioDiscoveryHandoff,
} from "./nexoraIssueDiscoveryTypes.ts";

export {
  NEXORA_ISSUE_DISCOVERY_BOUNDARY,
  getNexoraIssueDiscoveryExperienceIdentity,
  verifyNexoraIssueDiscoveryExperience,
} from "./nexoraIssueDiscoveryTypes.ts";

const ISSUE_SLOTS: ReadonlyArray<readonly [number, number, number]> = [
  [2.2, 1.35, 0],
  [-2.2, 1.35, 0],
  [2.2, -1.9, 0],
  [-2.2, -1.9, 0],
];

export function createNexoraIssueDiscoverySession(input: {
  readonly existing?: NexoraIssueDiscoverySession | null;
  readonly handoff?: NexoraIssueDiscoveryHandoff | null;
}): NexoraIssueDiscoverySession {
  if (input.existing) return input.existing;
  const seeded = seedCandidatesFromHandoff(input.handoff ?? null);
  return freezeIssueSession({
    state: seeded.length ? "ASSESSING_SIGNALS" : "NOT_STARTED",
    candidates: seeded,
    objects: Object.freeze([]),
    causalHypotheses: Object.freeze([]),
    askedQuestionKeys: Object.freeze([]),
    introduced: false,
    noSupportedIssue: false,
    handoff: null,
  });
}

export function overlayIssuesOnEntranceCatalog(
  catalog: NexoraMVPObjectInteractionCatalog,
  session: NexoraIssueDiscoverySession | null,
): NexoraMVPObjectInteractionCatalog {
  if (!session?.objects.length) return catalog;
  const goalId =
    catalog.objects.find((entry) => entry.id.startsWith("goal-"))?.id ?? null;
  const extra = session.objects.map((object, index) => {
    const prior = catalog.objects.find((entry) => entry.id === object.id);
    return Object.freeze({
      id: object.id,
      label: object.displayName,
      kind: "object" as const,
      position: prior?.position ?? ISSUE_SLOTS[index] ?? [2.2, 1.35, 0],
      status: "watch" as const,
      attention: "elevated" as const,
    });
  });
  const relationships = goalId
    ? session.objects.map((object) =>
        Object.freeze({
          id: `rel-goal-issue-${object.id}`,
          sourceId: goalId,
          targetId: object.id,
        }),
      )
    : [];
  const contextSubjects = session.objects
    .filter((object) => object.kind === "PROBLEM")
    .map((object) =>
      Object.freeze({
        id: object.id,
        label: object.displayName,
        kind: "problem" as const,
        status: "watch" as const,
        attention: "elevated" as const,
      }),
    );
  return Object.freeze({
    objects: Object.freeze([
      ...catalog.objects.filter(
        (object) => !session.objects.some((entry) => entry.id === object.id),
      ),
      ...extra,
    ]),
    relationships: Object.freeze([
      ...catalog.relationships.filter(
        (rel) => !rel.id.startsWith("rel-goal-issue-"),
      ),
      ...relationships,
    ]),
    contextSubjects: Object.freeze([
      ...catalog.contextSubjects.filter(
        (entry) => !contextSubjects.some((item) => item.id === entry.id),
      ),
      ...contextSubjects,
    ]),
    contextLinks: catalog.contextLinks,
  });
}

export function isIssueDiscoveryComplete(
  session: NexoraIssueDiscoverySession | null | undefined,
): boolean {
  return (
    session?.state === "ISSUE_CONTEXT_ACTIVE" ||
    session?.state === "READY_FOR_SCENARIO_DISCOVERY"
  );
}

export function shouldNexoraIssueDiscoveryOwnUtterance(
  entrance: NexoraEntranceSession | null | undefined,
  utterance: string,
): boolean {
  if (!entrance || entrance.workspaceResolution === "existing-workspace") {
    return false;
  }
  if (!isRealityDiscoveryComplete(entrance.realityDiscovery)) return false;
  const normalized = utterance.toLowerCase().replace(/[.!?]+$/g, "");
  if (isIdentityReserved(normalized)) return false;
  if (
    isIssueDiscoveryComplete(entrance.issueDiscovery) &&
    isScenarioDiscoveryUtterance(normalized) &&
    !/ready to explore scenarios/.test(normalized)
  ) {
    return false;
  }
  if (
    /what don'?t we know/.test(normalized) &&
    !entrance.issueDiscovery?.introduced
  ) {
    return false;
  }
  if (
    isManagerObjectUtterance(normalized) &&
    (isIssueDiscoveryComplete(entrance.issueDiscovery) ||
      (entrance.issueDiscovery?.objects.length ?? 0) > 0)
  ) {
    return false;
  }
  if (isIssueMetaUtterance(normalized) || isIssueClassificationUtterance(normalized)) {
    return true;
  }
  if (
    isNexoraRealityMetaUtterance(normalized) &&
    !entrance.issueDiscovery?.introduced
  ) {
    return false;
  }
  if (isGreeting(normalized)) {
    return !entrance.issueDiscovery?.introduced && !isIssueDiscoveryComplete(entrance.issueDiscovery);
  }
  return Boolean(entrance.issueDiscovery?.introduced) && !isIssueDiscoveryComplete(entrance.issueDiscovery);
}

export type NexoraIssueDiscoveryTurnResult = {
  readonly session: NexoraIssueDiscoverySession;
  readonly response: string;
  readonly ownsResponse: boolean;
  readonly shouldCommitRuntime: boolean;
  readonly nextRuntimeState: NexoraMVPObjectInteractionState;
  readonly catalog: NexoraMVPObjectInteractionCatalog;
};

export function resolveNexoraIssueDiscoveryTurn(input: {
  readonly utterance: string;
  readonly entrance: NexoraEntranceSession;
  readonly runtimeState: NexoraMVPObjectInteractionState;
  readonly catalog: NexoraMVPObjectInteractionCatalog;
}): NexoraIssueDiscoveryTurnResult {
  const previous =
    input.entrance.issueDiscovery ??
    createNexoraIssueDiscoverySession({
      handoff: input.entrance.realityDiscovery?.handoff ?? null,
    });
  const utterance = input.utterance.trim();
  const normalized = utterance.toLowerCase().replace(/[.!?]+$/g, "");

  if (isGreeting(normalized) && !previous.introduced) {
    return introduce(previous, input);
  }
  if (
    !previous.introduced &&
    isIssueMetaUtterance(normalized) === false &&
    !isIssueClassificationUtterance(normalized)
  ) {
    return introduce(previous, input);
  }

  if (
    isRecommendationRequest(normalized) &&
    /opportunity or a recommendation/.test(normalized) === false
  ) {
    return respond(
      previous,
      input,
      "Nexora is identifying what deserves investigation. That is not a recommendation to act.",
    );
  }

  if (/is .+ the root cause|root cause/.test(normalized)) {
    const next = addHypothesis(previous, utterance);
    return respond(
      next,
      input,
      "No. That remains an unconfirmed causal hypothesis. A related condition is not a confirmed root cause.",
    );
  }

  if (/is that an opportunity or a recommendation/.test(normalized)) {
    return respond(
      previous,
      input,
      "That is a possible Opportunity — a favorable condition or option. It is not a recommendation to implement it.",
    );
  }

  if (/ready to explore scenarios/.test(normalized)) {
    return closeIfReady(previous, input);
  }

  if (isIssueMetaUtterance(normalized)) {
    return metaTurn(previous, input, normalized);
  }

  const goalId = input.entrance.goalDiscovery?.object?.id ?? null;
  const goalTitle = input.entrance.goalDiscovery?.context.goalTitle ?? null;
  const reality = input.entrance.realityDiscovery;
  const stale = reality?.context.freshness === "STALE";
  let candidates = applyConstraintChange(
    convertRiskIfCurrent(previous.candidates, utterance),
    utterance,
  );
  const extracted = candidateFromUtterance({
    utterance,
    catalog: input.catalog,
    goalId,
    goalTitle,
    realityNames: (reality?.objects ?? []).map((entry) => entry.displayName),
    realityIds: (reality?.objects ?? []).map((entry) => entry.id),
    stale: Boolean(stale),
  });
  if (extracted) {
    candidates = mergeIssueCandidate(candidates, extracted);
  }
  const hypotheses = /because/.test(normalized)
    ? unique([...previous.causalHypotheses, utterance])
    : previous.causalHypotheses;
  if (/because/.test(normalized)) {
    ei3HypothesisClaim(utterance, `claim-hyp-${hypotheses.length}`);
    ei3UnknownCauseRelationship({
      relationshipId: `rel-hyp-${hypotheses.length}`,
      sourceEntityId: extracted?.objectId ?? "issue-hypothesis",
      targetEntityId: goalId ?? "goal",
    });
  }

  const clarification = nextClarification(normalized, previous.askedQuestionKeys);
  const objects = emergeIssueObjects(candidates, input.catalog, goalId);
  const noSupported =
    /no problem|nothing is wrong|everything is (?:fine|healthy)|no supported issue/.test(
      normalized,
    );
  const sufficient = objects.length > 0 || noSupported || previous.noSupportedIssue;
  const asked = clarification
    ? unique([...previous.askedQuestionKeys, clarification.key])
    : previous.askedQuestionKeys;
  const state = nextState({
    sufficient,
    objects,
    candidates,
    introduced: true,
  });
  const next = freezeIssueSession({
    ...previous,
    state,
    candidates,
    objects,
    causalHypotheses: hypotheses,
    askedQuestionKeys: asked,
    introduced: true,
    noSupportedIssue: previous.noSupportedIssue || noSupported,
    handoff: previous.handoff,
  });
  return Object.freeze({
    session: next,
    response: composeIssueResponse(
      next,
      utterance,
      clarification?.text ?? null,
      input.entrance,
    ),
    ownsResponse: true,
    shouldCommitRuntime: false,
    nextRuntimeState: input.runtimeState,
    catalog: overlayIssuesOnEntranceCatalog(input.catalog, next),
  });
}

function introduce(
  previous: NexoraIssueDiscoverySession,
  input: {
    readonly entrance: NexoraEntranceSession;
    readonly runtimeState: NexoraMVPObjectInteractionState;
    readonly catalog: NexoraMVPObjectInteractionCatalog;
  },
): NexoraIssueDiscoveryTurnResult {
  const next = freezeIssueSession({
    ...previous,
    state: previous.candidates.length ? "ASSESSING_SIGNALS" : "NOT_STARTED",
    introduced: true,
    askedQuestionKeys: unique([
      ...previous.askedQuestionKeys,
      "limiting-condition",
    ]),
  });
  return Object.freeze({
    session: next,
    response:
      "Given this Goal and current Reality, what may be preventing, threatening, or enabling progress? Which current condition do you believe is most limiting progress?",
    ownsResponse: true,
    shouldCommitRuntime: false,
    nextRuntimeState: input.runtimeState,
    catalog: overlayIssuesOnEntranceCatalog(input.catalog, next),
  });
}

function metaTurn(
  session: NexoraIssueDiscoverySession,
  input: {
    readonly entrance: NexoraEntranceSession;
    readonly runtimeState: NexoraMVPObjectInteractionState;
    readonly catalog: NexoraMVPObjectInteractionCatalog;
  },
  normalized: string,
): NexoraIssueDiscoveryTurnResult {
  const gap = input.entrance.realityDiscovery?.context.gap;
  const problems = session.objects.filter((entry) => entry.kind === "PROBLEM");
  const risks = session.objects.filter((entry) => entry.kind === "RISK");
  const opportunities = session.objects.filter((entry) => entry.kind === "OPPORTUNITY");
  const constraints = session.objects.filter((entry) => entry.kind === "CONSTRAINT");
  let response = summarizeDiscovery(session, input.entrance);
  if (/do we have a problem/.test(normalized)) {
    response = problems[0]
      ? `${problems[0].displayName} is a supported Problem candidate. A Goal gap is not automatically a Problem.`
      : gap?.status === "KNOWN"
        ? "There is a known Goal gap, but Nexora does not yet have a supported Problem. The gap is an observed symptom, not a classified Problem."
        : "No supported Problem is identified.";
  } else if (/what may be preventing/.test(normalized)) {
    response = problems[0]
      ? `${problems[0].displayName} is the current condition most worth investigating relative to the Goal. That is discovery priority, not a recommended action.`
      : "Nexora can describe current Reality, but it does not yet have enough evidence to name a supported Problem or Risk.";
  } else if (/problem or a risk/.test(normalized)) {
    response =
      "A Problem is a current undesirable condition interfering with the Goal. A Risk is a possible future adverse condition. Current failure is not classified as a Risk.";
  } else if (/what risks/.test(normalized)) {
    response = risks[0]
      ? `${risks.map((entry) => entry.displayName).join(", ")} ${risks.length === 1 ? "is a" : "are"} future Risk candidate(s). No probability is invented.`
      : "No supported future Risk is identified. Nexora will not invent one.";
  } else if (/opportunities/.test(normalized)) {
    response = opportunities[0]
      ? `${opportunities[0].displayName} is a possible Opportunity. It is not a recommendation.`
      : "No supported Opportunity is identified. Underperformance alone does not create one.";
  } else if (/what constraints/.test(normalized)) {
    response = constraints[0]
      ? `${constraints[0].displayName} is a limiting boundary. A constraint is not automatically a Problem.`
      : "No defined Constraint is on record. Pressure is not the same as a hard limit.";
  } else if (/why do you think/.test(normalized)) {
    const named = session.objects[0]?.displayName
      ?? session.candidates.find((entry) => entry.kind === "PROBLEM")?.subject;
    response = named
      ? `${named} is classified from manager-stated or Reality-linked evidence. That does not establish root cause.`
      : "No Problem candidate is on record to explain.";
  } else if (/what evidence supports/.test(normalized)) {
    const evidence = session.objects.flatMap((entry) => entry.evidence);
    response = evidence[0]
      ? `Supporting evidence: ${evidence.slice(0, 3).join(" ")} Related is not the same as caused (${relationshipIsNotCause()}).`
      : "Evidence is still insufficient to support a confirmed issue.";
  } else if (/what don'?t we know/.test(normalized)) {
    response = session.causalHypotheses[0]
      ? "Causal contribution remains unconfirmed. Confirmed-cause authority is not wired, so root cause stays unknown."
      : session.objects.length
        ? "Issue identity is supported enough to investigate, but cause, probability, and option value remain unknown."
        : "Nexora does not yet know which issue, if any, is materially interfering with the Goal.";
  } else if (/ready to explore scenarios/.test(normalized)) {
    return closeIfReady(session, input);
  }
  return respond(session, input, response);
}

function closeIfReady(
  previous: NexoraIssueDiscoverySession,
  input: {
    readonly entrance: NexoraEntranceSession;
    readonly runtimeState: NexoraMVPObjectInteractionState;
    readonly catalog: NexoraMVPObjectInteractionCatalog;
  },
): NexoraIssueDiscoveryTurnResult {
  const ready = previous.objects.length > 0 || previous.noSupportedIssue;
  if (!ready) {
    return respond(
      previous,
      input,
      "Not yet. Nexora still needs at least one material supported issue — or an explicit finding that no supported issue currently exists.",
    );
  }
  const next = freezeIssueSession({
    ...previous,
    state: "READY_FOR_SCENARIO_DISCOVERY",
    handoff: toScenarioHandoff(input.entrance, previous),
  });
  return respond(
    next,
    input,
    `${summarizeDiscovery(next, input.entrance)} We now understand the Goal, current Reality, and the main issue context. The next useful step is to explore possible scenarios or options. Those scenarios are not created yet.`,
  );
}

function addHypothesis(
  previous: NexoraIssueDiscoverySession,
  utterance: string,
): NexoraIssueDiscoverySession {
  const hypotheses = unique([...previous.causalHypotheses, utterance]);
  ei3HypothesisClaim(utterance, `claim-root-${hypotheses.length}`);
  return freezeIssueSession({
    ...previous,
    causalHypotheses: hypotheses,
    candidates: previous.candidates.map((candidate) =>
      candidate.kind === "PROBLEM"
        ? Object.freeze({ ...candidate, causalStatus: "HYPOTHESIZED" as const })
        : candidate,
    ),
    objects: previous.objects.map((object) =>
      object.kind === "PROBLEM"
        ? Object.freeze({ ...object, causalStatus: "HYPOTHESIZED" as const })
        : object,
    ),
    introduced: true,
  });
}

function nextClarification(
  normalized: string,
  asked: readonly string[],
): { readonly key: string; readonly text: string } | null {
  if (/capacity is bad|is bad/.test(normalized) && !asked.includes("problem-vs-risk")) {
    return {
      key: "problem-vs-risk",
      text: "Is that currently preventing the Goal, or are you concerned it may become a future risk?",
    };
  }
  if (
    /worries me|reliability worries/.test(normalized) &&
    !asked.includes("risk-vs-current")
  ) {
    return {
      key: "risk-vs-current",
      text: "Is that already affecting current progress, or is this mainly a future concern?",
    };
  }
  if (
    /we may be able to|weekend/.test(normalized) &&
    !asked.includes("opportunity-now")
  ) {
    return {
      key: "opportunity-now",
      text: "Is that actually available now, or is it still an option you need to validate?",
    };
  }
  if (/budget is tight/.test(normalized) && !asked.includes("constraint-limit")) {
    return {
      key: "constraint-limit",
      text: "Is there a defined spending limit for this Goal, or is budget simply under pressure?",
    };
  }
  return null;
}

function nextState(input: {
  readonly sufficient: boolean;
  readonly objects: readonly ExecutiveIssueObject[];
  readonly candidates: readonly ExecutiveIssueCandidate[];
  readonly introduced: boolean;
}): IssueDiscoveryState {
  if (input.objects.length && input.sufficient) return "ISSUE_OBJECTS_READY";
  if (input.sufficient) return "ISSUES_SUFFICIENT";
  if (input.objects.length) return "ISSUES_PARTIAL";
  if (input.candidates.some((entry) => entry.kind !== "UNKNOWN")) {
    return "CANDIDATES_FOUND";
  }
  if (input.candidates.length) return "ASSESSING_SIGNALS";
  return input.introduced ? "INVESTIGATING" : "NOT_STARTED";
}

function composeIssueResponse(
  session: NexoraIssueDiscoverySession,
  utterance: string,
  clarification: string | null,
  entrance: NexoraEntranceSession,
): string {
  if (clarification) {
    return `Noted as a candidate, not confirmed canonical truth. ${clarification}`;
  }
  if (/because/.test(utterance.toLowerCase())) {
    return "Recorded as a manager-stated causal hypothesis. Causal status is HYPOTHESIZED / unconfirmed. Related is not the same as caused.";
  }
  if (session.noSupportedIssue && session.objects.length === 0) {
    return "Nexora can confirm current Reality, but it does not yet have enough evidence to identify a supported Problem or Risk. Absence of a Problem is valid.";
  }
  const staged = session.objects.map((entry) => entry.displayName).join(", ");
  const prefix = staged
    ? `Recorded supported issue context: ${staged}.`
    : "That signal is kept as a candidate. Weak candidates do not become Stage objects.";
  const comparable = comparablePriorities(session.objects)
    ? " Those issues are comparably important to investigate."
    : "";
  const stale = session.candidates.some((entry) => entry.staleEvidence)
    ? " Latest supporting evidence is stale, so certainty is reduced."
    : "";
  const conflict = conflictingKinds(session.candidates);
  const conflictText = conflict
    ? ` Evidence is in conflict for ${conflict}; Nexora will not silently resolve it.`
    : "";
  if (session.objects.length >= 1) {
    return `${prefix}${comparable}${stale}${conflictText} ${summarizeDiscovery(session, entrance)}`;
  }
  return `${prefix}${comparable}${stale}${conflictText}`;
}

function summarizeDiscovery(
  session: NexoraIssueDiscoverySession,
  entrance: NexoraEntranceSession,
): string {
  const gap = entrance.realityDiscovery?.context.gap;
  const problem = session.objects.find((entry) => entry.kind === "PROBLEM");
  const risk = session.objects.find((entry) => entry.kind === "RISK");
  const opportunity = session.objects.find((entry) => entry.kind === "OPPORTUNITY");
  const constraint = session.objects.find((entry) => entry.kind === "CONSTRAINT");
  const primary = discoveryPrioritySubject(session.objects);
  const gapText =
    gap?.status === "KNOWN"
      ? `Current evidence shows a Goal gap (${gap.delta ?? "known"}).`
      : "Current Reality is on record.";
  const parts = [
    problem ? `${problem.displayName} is a supported Problem candidate` : null,
    risk ? `${risk.displayName} is a future Risk` : null,
    opportunity ? `${opportunity.displayName} is a possible Opportunity` : null,
    constraint ? `${constraint.displayName} is a Constraint` : null,
  ].filter(Boolean);
  const body = parts.length
    ? `${parts.join(", ")}.`
    : "No mandatory Problem, Risk, or Opportunity is invented.";
  const investigate = primary
    ? ` Most useful to investigate first: ${primary}. That is not manager attention priority and not a recommended solution.`
    : "";
  return `${gapText} ${body} None is yet established as the confirmed root cause.${investigate}`;
}

function toScenarioHandoff(
  entrance: NexoraEntranceSession,
  session: NexoraIssueDiscoverySession,
): NexoraScenarioDiscoveryHandoff {
  return Object.freeze({
    identityContext: entrance.identity,
    executiveContextObject: entrance.identityObject,
    activeGoal: entrance.goalDiscovery?.context ?? null,
    goalObject: entrance.goalDiscovery?.object ?? null,
    realityContext: entrance.realityDiscovery?.context ?? null,
    goalRealityGap: entrance.realityDiscovery?.context.gap ?? null,
    problems: session.objects.filter((entry) => entry.kind === "PROBLEM"),
    risks: session.objects.filter((entry) => entry.kind === "RISK"),
    opportunities: session.objects.filter((entry) => entry.kind === "OPPORTUNITY"),
    constraints: session.objects.filter((entry) => entry.kind === "CONSTRAINT"),
    causalHypotheses: session.causalHypotheses,
    evidence: session.objects.flatMap((entry) => entry.evidence),
    provenance: entrance.realityDiscovery?.context.provenance ?? [],
    unknowns: Object.freeze([
      ...(session.causalHypotheses.length ? ["confirmed cause"] : []),
      ...(session.objects.some((entry) => entry.kind === "RISK")
        ? ["risk probability"]
        : []),
    ]),
    primaryInvestigationSubject: discoveryPrioritySubject(session.objects),
    conversationContext: entrance.conversationNotes.slice(-6).join(" | "),
  });
}

function respond(
  session: NexoraIssueDiscoverySession,
  input: {
    readonly runtimeState: NexoraMVPObjectInteractionState;
    readonly catalog: NexoraMVPObjectInteractionCatalog;
  },
  response: string,
): NexoraIssueDiscoveryTurnResult {
  return Object.freeze({
    session,
    response,
    ownsResponse: true,
    shouldCommitRuntime: false,
    nextRuntimeState: input.runtimeState,
    catalog: overlayIssuesOnEntranceCatalog(input.catalog, session),
  });
}

function conflictingKinds(
  candidates: readonly ExecutiveIssueCandidate[],
): string | null {
  const groups = new Map<string, Set<string>>();
  for (const candidate of candidates) {
    const key = candidate.subject.toLowerCase();
    const set = groups.get(key) ?? new Set();
    set.add(candidate.kind);
    groups.set(key, set);
  }
  for (const [subject, kinds] of groups) {
    if (kinds.has("PROBLEM") && kinds.has("CONSTRAINT")) return subject;
  }
  return null;
}

function freezeIssueSession(
  session: NexoraIssueDiscoverySession,
): NexoraIssueDiscoverySession {
  return Object.freeze({
    ...session,
    candidates: Object.freeze([...session.candidates]),
    objects: Object.freeze([...session.objects]),
    causalHypotheses: Object.freeze([...session.causalHypotheses]),
    askedQuestionKeys: Object.freeze([...session.askedQuestionKeys]),
  });
}

function isManagerObjectUtterance(normalized: string): boolean {
  return (
    /^(?:explain this|what is this|show(?: me)? .+|what is connected|where should i look next|how does this (?:help|affect) my goal|where are we|what needs my attention)$/.test(
      normalized,
    ) ||
    /^explain .+/i.test(normalized) ||
    /^show the (?:problem|risk|opportunity|constraint)/.test(normalized)
  );
}

function isIdentityReserved(normalized: string): boolean {
  return /what do you know about me/.test(normalized) || normalized === "who are you";
}

function isGreeting(normalized: string): boolean {
  return /^(?:hi|hello|hey)$/.test(normalized);
}

function unique(values: readonly string[]): readonly string[] {
  return Object.freeze([...new Set(values.filter(Boolean))]);
}

export function issueDiscoveryUsesExistingAuthorities(): boolean {
  return (
    NEXORA_ISSUE_DISCOVERY_BOUNDARY.parallelProblemIntelligence === false &&
    NEXORA_ISSUE_DISCOVERY_BOUNDARY.parallelCausalEngine === false &&
    NEXORA_ISSUE_DISCOVERY_BOUNDARY.startsNexExp5 === false &&
    shouldBecomeStageObject !== null &&
    getNexoraIssueDiscoveryExperienceIdentity().id ===
      "NEX-EXP:4/ProblemRiskOpportunityDiscovery"
  );
}
