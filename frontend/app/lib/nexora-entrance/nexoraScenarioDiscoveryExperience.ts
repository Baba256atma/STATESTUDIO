/**
 * NEX-EXP:5 — scenario/option discovery turns and restrained Stage overlay.
 * Does not steal center, commit decisions, execute, or write Reality.
 */

import type {
  NexoraMVPObjectInteractionCatalog,
  NexoraMVPObjectInteractionState,
} from "@/app/lib/nex-mvp/nexoraMVPObjectInteraction.ts";
import { isIssueDiscoveryComplete } from "./nexoraIssueDiscoveryExperience.ts";
import type { NexoraEntranceSession } from "./nexoraEntranceTypes.ts";
import type { NexoraScenarioDiscoveryHandoff } from "./nexoraIssueDiscoveryTypes.ts";
import {
  addHorizonVariant,
  applyHorizonCorrection,
  cc9ScenarioIdentity,
  comparableSetReady,
  containsInventedNumeric,
  deactivateMatchingOptions,
  ei4ScenarioBoundary,
  emergeScenarioObjects,
  isDecisionOrExecutionCommand,
  isOptionProposalUtterance,
  isScenarioMetaUtterance,
  mergeOption,
  optionFromUtterance,
  seedOptionsFromHandoff,
} from "./nexoraScenarioDiscoveryResolution.ts";
import { isComparisonExperienceUtterance } from "./nexoraScenarioComparisonResolution.ts";
import {
  NEXORA_SCENARIO_DISCOVERY_BOUNDARY,
  type ExecutiveOptionCandidate,
  type ExecutiveScenarioObject,
  type NexoraScenarioComparisonHandoff,
  type NexoraScenarioDiscoverySession,
  type ScenarioDiscoveryState,
} from "./nexoraScenarioDiscoveryTypes.ts";

export {
  NEXORA_SCENARIO_DISCOVERY_BOUNDARY,
  getNexoraScenarioDiscoveryExperienceIdentity,
  verifyNexoraScenarioDiscoveryExperience,
} from "./nexoraScenarioDiscoveryTypes.ts";

const SCENARIO_SLOTS: ReadonlyArray<readonly [number, number, number]> = [
  [0, -2.35, 0],
  [2.55, 0.35, 0],
  [-2.55, 0.35, 0],
  [1.15, 2.15, 0],
];

export function createNexoraScenarioDiscoverySession(input: {
  readonly existing?: NexoraScenarioDiscoverySession | null;
  readonly handoff?: NexoraScenarioDiscoveryHandoff | null;
}): NexoraScenarioDiscoverySession {
  if (input.existing) return input.existing;
  const seeded = seedOptionsFromHandoff(input.handoff ?? null);
  return freezeScenarioSession({
    state: seeded.length ? "ASSESSING_CONTEXT" : "NOT_STARTED",
    options: seeded,
    scenarios: Object.freeze([]),
    askedQuestionKeys: Object.freeze([]),
    introduced: false,
    handoff: null,
    lastMutatedReality: null,
  });
}

export function overlayScenariosOnEntranceCatalog(
  catalog: NexoraMVPObjectInteractionCatalog,
  session: NexoraScenarioDiscoverySession | null,
): NexoraMVPObjectInteractionCatalog {
  if (!session?.scenarios.length) return catalog;
  const centerId =
    catalog.objects.find((entry) => entry.id.startsWith("goal-"))?.id ??
    catalog.objects[0]?.id ??
    null;
  const extra = session.scenarios.map((object, index) => {
    const prior = catalog.objects.find((entry) => entry.id === object.id);
    return Object.freeze({
      id: object.id,
      label: object.title,
      kind: "object" as const,
      position: prior?.position ?? SCENARIO_SLOTS[index] ?? [0, -2.35, 0],
      status: object.scenarioStatus === "CONSTRAINED" ? ("risk" as const) : ("watch" as const),
      attention: "elevated" as const,
    });
  });
  const relationships = centerId
    ? session.scenarios.map((object) =>
        Object.freeze({
          id: `rel-center-scenario-${object.id}`,
          sourceId: centerId,
          targetId: object.id,
        }),
      )
    : [];
  const contextSubjects = session.scenarios.map((object) =>
    Object.freeze({
      id: object.id,
      label: object.title,
      kind: "scenario" as const,
      status: "watch" as const,
      attention: "elevated" as const,
    }),
  );
  return Object.freeze({
    objects: Object.freeze([
      ...catalog.objects.filter(
        (object) => !session.scenarios.some((entry) => entry.id === object.id),
      ),
      ...extra,
    ]),
    relationships: Object.freeze([
      ...catalog.relationships.filter(
        (rel) => !rel.id.startsWith("rel-center-scenario-"),
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

export function isScenarioDiscoveryComplete(
  session: NexoraScenarioDiscoverySession | null | undefined,
): boolean {
  return (
    session?.state === "SCENARIO_CONTEXT_ACTIVE" ||
    session?.state === "READY_FOR_SCENARIO_COMPARISON"
  );
}

export function shouldNexoraScenarioDiscoveryOwnUtterance(
  entrance: NexoraEntranceSession | null | undefined,
  utterance: string,
): boolean {
  if (!entrance || entrance.workspaceResolution === "existing-workspace") {
    return false;
  }
  if (!isIssueDiscoveryComplete(entrance.issueDiscovery)) return false;
  const normalized = utterance.toLowerCase().replace(/[.!?]+$/g, "");
  if (isIdentityReserved(normalized)) return false;
  if (isDecisionOrExecutionCommand(normalized)) return false;
  if (
    entrance.scenarioDiscovery?.state === "READY_FOR_SCENARIO_COMPARISON" &&
    (isComparisonExperienceUtterance(normalized) ||
      (isScenarioMetaUtterance(normalized) && !isOptionProposalUtterance(normalized)))
  ) {
    return false;
  }
  if (
    isManagerObjectUtterance(normalized) &&
    (entrance.scenarioDiscovery?.scenarios.length ?? 0) > 0
  ) {
    return false;
  }
  if (
    /what don'?t we know/.test(normalized) &&
    !entrance.scenarioDiscovery?.introduced
  ) {
    return false;
  }
  if (isScenarioMetaUtterance(normalized) || isOptionProposalUtterance(normalized)) {
    return true;
  }
  if (isGreeting(normalized)) {
    return !entrance.scenarioDiscovery?.introduced;
  }
  return (
    Boolean(entrance.scenarioDiscovery?.introduced) &&
    !isScenarioDiscoveryComplete(entrance.scenarioDiscovery)
  );
}

export type NexoraScenarioDiscoveryTurnResult = {
  readonly session: NexoraScenarioDiscoverySession;
  readonly response: string;
  readonly ownsResponse: boolean;
  readonly shouldCommitRuntime: boolean;
  readonly nextRuntimeState: NexoraMVPObjectInteractionState;
  readonly catalog: NexoraMVPObjectInteractionCatalog;
};

export function resolveNexoraScenarioDiscoveryTurn(input: {
  readonly utterance: string;
  readonly entrance: NexoraEntranceSession;
  readonly runtimeState: NexoraMVPObjectInteractionState;
  readonly catalog: NexoraMVPObjectInteractionCatalog;
}): NexoraScenarioDiscoveryTurnResult {
  const previous =
    input.entrance.scenarioDiscovery ??
    createNexoraScenarioDiscoverySession({
      handoff: input.entrance.issueDiscovery?.handoff ?? null,
    });
  const utterance = input.utterance.trim();
  const normalized = utterance.toLowerCase().replace(/[.!?]+$/g, "");

  if (isGreeting(normalized) && !previous.introduced) {
    return introduce(previous, input);
  }
  if (
    !previous.introduced &&
    !isScenarioMetaUtterance(normalized) &&
    !isOptionProposalUtterance(normalized)
  ) {
    return introduce(previous, input);
  }

  if (isScenarioMetaUtterance(normalized)) {
    return metaTurn(previous, input, normalized);
  }

  const goalId = input.entrance.goalDiscovery?.object?.id ?? null;
  const issueIds = (input.entrance.issueDiscovery?.objects ?? []).map(
    (entry) => entry.id,
  );
  const realityIds = (input.entrance.realityDiscovery?.objects ?? []).map(
    (entry) => entry.id,
  );
  const constraints = [
    ...(input.entrance.issueDiscovery?.handoff?.constraints ?? []).map(
      (entry) => entry.displayName,
    ),
    ...((input.entrance.realityDiscovery?.context.constraints ?? []) as string[]),
  ];

  let options = deactivateMatchingOptions(previous.options, utterance);
  const extracted = optionFromUtterance({
    utterance,
    catalog: input.catalog,
    goalId,
    issueIds,
    realityIds,
    constraints,
  });
  if (extracted) {
    options = mergeOption(options, extracted);
  }
  let scenarios = applyHorizonCorrection(previous.scenarios, utterance);
  scenarios = addHorizonVariant(scenarios, options, utterance);
  scenarios = emergeScenarioObjects(options, scenarios);
  const clarification = nextClarification(normalized, previous.askedQuestionKeys, options);
  const asked = clarification
    ? unique([...previous.askedQuestionKeys, clarification.key])
    : previous.askedQuestionKeys;
  const ready = comparableSetReady(scenarios);
  const state = nextState(
    options,
    scenarios,
    ready,
    true,
    previous.state,
  );
  const next = freezeScenarioSession({
    ...previous,
    state,
    options,
    scenarios,
    askedQuestionKeys: asked,
    introduced: true,
    lastMutatedReality: null,
    handoff: previous.handoff,
  });
  return Object.freeze({
    session: next,
    response: composeResponse(next, utterance, clarification?.text ?? null, input.entrance),
    ownsResponse: true,
    shouldCommitRuntime: false,
    nextRuntimeState: input.runtimeState,
    catalog: overlayScenariosOnEntranceCatalog(input.catalog, next),
  });
}

function introduce(
  previous: NexoraScenarioDiscoverySession,
  input: {
    readonly entrance: NexoraEntranceSession;
    readonly runtimeState: NexoraMVPObjectInteractionState;
    readonly catalog: NexoraMVPObjectInteractionCatalog;
  },
): NexoraScenarioDiscoveryTurnResult {
  const next = freezeScenarioSession({
    ...previous,
    state: "OPTIONS_NEEDED",
    introduced: true,
    askedQuestionKeys: unique([...previous.askedQuestionKeys, "possible-response"]),
  });
  return respond(
    next,
    input,
    "Given the Goal, current Reality, and the issue under investigation, what possible response are you already considering?",
  );
}

function metaTurn(
  session: NexoraScenarioDiscoverySession,
  input: {
    readonly entrance: NexoraEntranceSession;
    readonly runtimeState: NexoraMVPObjectInteractionState;
    readonly catalog: NexoraMVPObjectInteractionCatalog;
  },
  normalized: string,
): NexoraScenarioDiscoveryTurnResult {
  const named = (letter: string) =>
    session.scenarios.find((entry) => entry.letter.toLowerCase() === letter.toLowerCase()) ??
    session.scenarios[0] ??
    null;
  if (/compare these scenarios|^compare them$/.test(normalized)) {
    return closeIfReady(session, input);
  }
  let response = summarize(session);
  if (/what options|what could we do|what are my options/.test(normalized)) {
    const titles = session.options.filter((entry) => entry.active).map((entry) => entry.title);
    response = titles.length
      ? `Candidate options: ${titles.join("; ")}. These are possible courses, not recommendations or decisions.`
      : "No manager-stated Options are on record yet. Nexora will not invent a set of choices.";
  } else if (/prediction or a scenario/.test(normalized)) {
    response =
      "That is a Scenario — a model of a possible path. It is not a prediction of what will happen, and it does not change current Reality.";
  } else if (/what does scenario ([a-d]) assume/.test(normalized)) {
    const letter = normalized.match(/scenario ([a-d])/)?.[1] ?? "a";
    const scenario = named(letter);
    const assumption = scenario?.assumptions[0];
    response = assumption
      ? `${scenario?.title ?? "This scenario"} assumes ${assumption.statement} That assumption is not a validated fact.`
      : "No explicit assumption is recorded yet.";
  } else if (/what don'?t we know/.test(normalized)) {
    const unknown = session.scenarios.flatMap((entry) => entry.unknowns)[0];
    response = unknown
      ? `Unknowns remain, including ${unknown}. Nexora will not fill them with estimates.`
      : "Exact cost, effect size, and timing remain unknown.";
  } else if (/what constraints affect/.test(normalized)) {
    const constraint = session.scenarios.flatMap((entry) => entry.constraints)[0]
      ?? input.entrance.issueDiscovery?.objects.find((entry) => entry.kind === "CONSTRAINT")
        ?.displayName;
    response = constraint
      ? `${constraint} still applies. A Scenario that violates a hard Constraint is CONSTRAINED, not equally ranked.`
      : "No additional Scenario-specific Constraint is recorded beyond the issue context.";
  } else if (/is scenario ([a-d]) feasible/.test(normalized)) {
    const letter = normalized.match(/scenario ([a-d])/)?.[1] ?? "a";
    const scenario = named(letter);
    response = scenario
      ? scenario.scenarioStatus === "CONSTRAINED"
        ? `${scenario.title} is constrained by known limits. It is retained, not presented as a valid equal path.`
        : `${scenario.title} appears feasible as a possibility. That is not a recommendation.`
      : "No Scenario is formed yet.";
  } else if (/does this mean you recommend/.test(normalized)) {
    response =
      "No. A feasible Scenario is not a recommendation, and ranking is not a choice.";
  } else if (/which scenario did i choose|haven'?t decided/.test(normalized)) {
    response =
      "None is selected or approved. Exploring a Scenario is not a Decision.";
  } else if (/what would happen if/.test(normalized)) {
    response =
      "If that path were taken, relevant conditions may change. That expected effect is prospective, not an observed outcome, and no numeric result is invented.";
  } else if (/give me another scenario|another option|another path/.test(normalized)) {
    response =
      "Say another possible path in your own words. Nexora will not invent extra Scenarios just to fill a set.";
  }
  return respond(session, input, response);
}

function closeIfReady(
  previous: NexoraScenarioDiscoverySession,
  input: {
    readonly entrance: NexoraEntranceSession;
    readonly runtimeState: NexoraMVPObjectInteractionState;
    readonly catalog: NexoraMVPObjectInteractionCatalog;
  },
): NexoraScenarioDiscoveryTurnResult {
  if (!comparableSetReady(previous.scenarios)) {
    return respond(
      previous,
      input,
      "Not yet. Comparison needs at least two comparable Scenarios, or one Scenario plus a meaningful baseline. Nexora will not invent extra paths.",
    );
  }
  const next = freezeScenarioSession({
    ...previous,
    state: "READY_FOR_SCENARIO_COMPARISON",
    scenarios: previous.scenarios.map((scenario) =>
      Object.freeze({
        ...scenario,
        scenarioStatus:
          scenario.scenarioStatus === "CONSTRAINED"
            ? scenario.scenarioStatus
            : ("READY_FOR_COMPARISON" as const),
      }),
    ),
    handoff: toComparisonHandoff(input.entrance, previous),
  });
  return respond(
    next,
    input,
    `${summarize(next)} None has been selected yet. We are now ready to compare them. Comparison itself has not started.`,
  );
}

function nextClarification(
  normalized: string,
  asked: readonly string[],
  options: readonly ExecutiveOptionCandidate[],
): { readonly key: string; readonly text: string } | null {
  if (/maybe more/.test(normalized) && !asked.includes("internal-vs-external")) {
    return {
      key: "internal-vs-external",
      text: "Are you considering increasing internal capacity, using external capacity, or both?",
    };
  }
  if (/let'?s model/.test(normalized) && !asked.includes("temporary-vs-staffing")) {
    return {
      key: "temporary-vs-staffing",
      text: "Should we model this using the current team, or additional staffing?",
    };
  }
  if (
    options.filter((entry) => entry.active && entry.feasibility === "POSSIBLE").length === 1 &&
    !asked.includes("baseline") &&
    !options.some((entry) => entry.source === "BASELINE")
  ) {
    return {
      key: "baseline",
      text: "Is maintaining the current plan also an option you want to compare?",
    };
  }
  return null;
}

function nextState(
  options: readonly ExecutiveOptionCandidate[],
  scenarios: readonly ExecutiveScenarioObject[],
  ready: boolean,
  _introduced: boolean,
  previousState?: ScenarioDiscoveryState,
): ScenarioDiscoveryState {
  if (previousState === "READY_FOR_SCENARIO_COMPARISON" && ready) {
    return "READY_FOR_SCENARIO_COMPARISON";
  }
  if (ready && scenarios.length >= 1) return "SCENARIO_OBJECTS_READY";
  if (scenarios.length) return "SCENARIOS_PARTIAL";
  if (options.some((entry) => entry.feasibility === "POSSIBLE")) return "OPTIONS_FOUND";
  if (options.length) return "ASSESSING_CONTEXT";
  return _introduced ? "OPTIONS_NEEDED" : "NOT_STARTED";
}

function composeResponse(
  session: NexoraScenarioDiscoverySession,
  utterance: string,
  clarification: string | null,
  entrance: NexoraEntranceSession,
): string {
  if (clarification) {
    return `Recorded as an Option candidate, not a Decision. ${clarification}`;
  }
  if (containsInventedNumeric(utterance) && !/\d+\s+weeks/.test(utterance)) {
    return "Nexora will not invent cost, percent improvement, or ROI. Unknowns stay unknown.";
  }
  const blocked = session.options.find((entry) => entry.feasibility === "CONSTRAINED");
  if (blocked && /purchase|new line|capital/.test(utterance.toLowerCase())) {
    return `${blocked.title} is CONSTRAINED by a known limit. It is retained for history, not treated as a valid equal path.`;
  }
  if (session.options.some((entry) => !entry.active)) {
    return "That Option is marked unavailable in the active set. Canonical history is not deleted, and nothing was selected.";
  }
  if (/conflict/.test(utterance.toLowerCase())) {
    return "A Scenario may support one Goal and conflict with another. That tension is exposed; Nexora will not decide which Goal wins.";
  }
  const names = session.scenarios.map((entry) => `${entry.letter}: ${entry.title}`).join("; ");
  const prefix = names
    ? `Formed Scenarios: ${names}. Each is a possible path, not a selected future.`
    : "That Option is kept as a candidate. Draft Options do not automatically become Stage objects.";
  const cause =
    " Cause remains unconfirmed; a response can still be modeled as a counterfactual without changing current Reality.";
  return `${prefix}${cause} ${summarize(session)} Active Goal: ${entrance.goalDiscovery?.context.goalTitle ?? "known"}.`;
}

function summarize(session: NexoraScenarioDiscoverySession): string {
  const viable = session.scenarios.filter(
    (entry) => entry.scenarioStatus !== "CONSTRAINED" && entry.scenarioStatus !== "INVALID",
  );
  if (!viable.length) {
    return "No comparison-ready Scenario set exists yet.";
  }
  return `We can currently examine ${viable.map((entry) => entry.title).join(", ")}. Each depends on assumptions, and we do not yet have enough evidence to say which is best.`;
}

function toComparisonHandoff(
  entrance: NexoraEntranceSession,
  session: NexoraScenarioDiscoverySession,
): NexoraScenarioComparisonHandoff {
  return Object.freeze({
    identityContext: entrance.identity,
    executiveContextObject: entrance.identityObject,
    activeGoal: entrance.goalDiscovery?.context ?? null,
    goalObject: entrance.goalDiscovery?.object ?? null,
    realityContext: entrance.realityDiscovery?.context ?? null,
    issueContext: entrance.issueDiscovery?.handoff ?? null,
    options: session.options,
    scenarios: session.scenarios,
    constraints: session.scenarios.flatMap((entry) => entry.constraints),
    assumptions: session.scenarios.flatMap((entry) => entry.assumptions),
    unknowns: session.scenarios.flatMap((entry) => entry.unknowns),
    evidence: session.scenarios.flatMap((entry) => entry.evidence),
    provenance: session.scenarios.flatMap((entry) => entry.provenance),
    conversationContext: entrance.conversationNotes.slice(-6).join(" | "),
    comparisonStarted: false,
  });
}

function respond(
  session: NexoraScenarioDiscoverySession,
  input: {
    readonly runtimeState: NexoraMVPObjectInteractionState;
    readonly catalog: NexoraMVPObjectInteractionCatalog;
  },
  response: string,
): NexoraScenarioDiscoveryTurnResult {
  return Object.freeze({
    session,
    response,
    ownsResponse: true,
    shouldCommitRuntime: false,
    nextRuntimeState: input.runtimeState,
    catalog: overlayScenariosOnEntranceCatalog(input.catalog, session),
  });
}

function freezeScenarioSession(
  session: NexoraScenarioDiscoverySession,
): NexoraScenarioDiscoverySession {
  return Object.freeze({
    ...session,
    options: Object.freeze([...session.options]),
    scenarios: Object.freeze([...session.scenarios]),
    askedQuestionKeys: Object.freeze([...session.askedQuestionKeys]),
    lastMutatedReality: null,
  });
}

function isManagerObjectUtterance(normalized: string): boolean {
  return (
    /^(?:explain this|what is this|show(?: me)? .+|what is connected|where should i look next|how does this (?:help|affect) my goal|where are we|what needs my attention)$/.test(
      normalized,
    ) ||
    /^explain .+/i.test(normalized) ||
    /^show scenario/.test(normalized)
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

export function scenarioDiscoveryUsesExistingAuthorities(): boolean {
  return (
    NEXORA_SCENARIO_DISCOVERY_BOUNDARY.startsNexExp6 === false &&
    NEXORA_SCENARIO_DISCOVERY_BOUNDARY.commitsDecision === false &&
    NEXORA_SCENARIO_DISCOVERY_BOUNDARY.writesDataReality === false &&
    ei4ScenarioBoundary().commitsDecisions === false &&
    cc9ScenarioIdentity() === "CC:9/ScenarioConversation"
  );
}
