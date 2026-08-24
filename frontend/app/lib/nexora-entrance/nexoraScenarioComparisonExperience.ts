/**
 * NEX-EXP:6 — comparison / trade-off / recommendation experience projection.
 * Does not steal Stage center, commit decisions, or mutate Reality.
 */

import type {
  NexoraMVPObjectInteractionCatalog,
  NexoraMVPObjectInteractionState,
} from "@/app/lib/nex-mvp/nexoraMVPObjectInteraction.ts";
import type { NexoraEntranceSession } from "./nexoraEntranceTypes.ts";
import { isDecisionOrExecutionCommand } from "./nexoraScenarioDiscoveryResolution.ts";
import {
  compactComparison,
  detectManagerPriority,
  isComparisonExperienceUtterance,
  isDecisionOrCommitmentUtterance,
  isPreferenceUtterance,
  projectScenarioComparison,
  scenarioFingerprint,
  toDecisionHandoff,
} from "./nexoraScenarioComparisonResolution.ts";
import {
  getNexoraScenarioComparisonExperienceIdentity,
  NEXORA_SCENARIO_COMPARISON_BOUNDARY,
  verifyNexoraScenarioComparisonExperience,
  type NexoraScenarioComparisonSession,
  type ScenarioComparisonExperienceState,
} from "./nexoraScenarioComparisonTypes.ts";

export {
  getNexoraScenarioComparisonExperienceIdentity,
  NEXORA_SCENARIO_COMPARISON_BOUNDARY,
  verifyNexoraScenarioComparisonExperience,
};

export function createNexoraScenarioComparisonSession(): NexoraScenarioComparisonSession {
  return freezeComparisonSession({
    state: "NOT_STARTED",
    comparison: null,
    recommendation: null,
    managerPriority: "UNKNOWN",
    fingerprint: "",
    askedQuestionKeys: [],
    introduced: false,
    handoff: null,
    lastMutatedReality: null,
    lastCommittedDecision: null,
  });
}

export function overlayComparisonCuesOnEntranceCatalog(
  catalog: NexoraMVPObjectInteractionCatalog,
  session: NexoraScenarioComparisonSession | null,
): NexoraMVPObjectInteractionCatalog {
  const recommended = session?.recommendation?.recommendedScenarioId;
  if (!recommended) return catalog;
  return Object.freeze({
    ...catalog,
    objects: Object.freeze(
      catalog.objects.map((object) =>
        object.id === recommended
          ? Object.freeze({ ...object, attention: "important" as const })
          : object,
      ),
    ),
    contextSubjects: Object.freeze(
      catalog.contextSubjects.map((subject) =>
        subject.id === recommended
          ? Object.freeze({ ...subject, attention: "important" as const })
          : subject,
      ),
    ),
  });
}

export function shouldNexoraScenarioComparisonOwnUtterance(
  entrance: NexoraEntranceSession | null | undefined,
  utterance: string,
): boolean {
  if (!entrance || entrance.workspaceResolution === "existing-workspace") {
    return false;
  }
  if (entrance.scenarioDiscovery?.state !== "READY_FOR_SCENARIO_COMPARISON") {
    return false;
  }
  const normalized = utterance.toLowerCase().replace(/[.!?]+$/g, "");
  if (isIdentityReserved(normalized)) return false;
  if (isDecisionOrExecutionCommand(normalized)) return false;
  if (isDecisionOrCommitmentUtterance(normalized)) return false;
  if (isManagerObjectUtterance(normalized)) return false;
  if (isGreeting(normalized)) {
    return !entrance.scenarioComparison?.introduced;
  }
  if (isComparisonExperienceUtterance(normalized)) return true;
  return Boolean(entrance.scenarioComparison?.introduced);
}

export type NexoraScenarioComparisonTurnResult = {
  readonly session: NexoraScenarioComparisonSession;
  readonly response: string;
  readonly ownsResponse: boolean;
  readonly shouldCommitRuntime: boolean;
  readonly nextRuntimeState: NexoraMVPObjectInteractionState;
  readonly catalog: NexoraMVPObjectInteractionCatalog;
};

export function resolveNexoraScenarioComparisonTurn(input: {
  readonly utterance: string;
  readonly entrance: NexoraEntranceSession;
  readonly runtimeState: NexoraMVPObjectInteractionState;
  readonly catalog: NexoraMVPObjectInteractionCatalog;
}): NexoraScenarioComparisonTurnResult {
  const previous =
    input.entrance.scenarioComparison ?? createNexoraScenarioComparisonSession();
  const scenarios = input.entrance.scenarioDiscovery?.scenarios ?? [];
  const normalized = input.utterance.toLowerCase().replace(/[.!?]+$/g, "");
  const managerPriority = detectManagerPriority(
    normalized,
    previous.managerPriority,
  );
  const fingerprint = `${scenarioFingerprint(scenarios)}::${managerPriority}`;
  const stale =
    Boolean(previous.comparison) &&
    previous.fingerprint !== "" &&
    previous.fingerprint !== fingerprint;
  const goalConflictNoted =
    previous.askedQuestionKeys.includes("goal-conflict") ||
    /conflict/.test(normalized) ||
    input.entrance.conversationNotes.some((note) =>
      /conflict/.test(note.toLowerCase()),
    );
  const projected = projectScenarioComparison({
    scenarios,
    entrance: input.entrance,
    managerPriority,
    goalConflictNoted,
  });
  const readyForDecision =
    projected.comparison.comparisonStatus === "READY" ||
    projected.recommendation.recommendationStatus === "TIED" ||
    projected.recommendation.recommendationStatus === "WITHHELD" ||
    projected.recommendation.recommendationStatus === "CONFLICTING_GOALS";
  const state = nextState(
    projected.comparison.comparisonStatus,
    projected.recommendation.recommendationStatus,
    readyForDecision,
    stale,
  );
  const asked = unique([
    ...previous.askedQuestionKeys,
    goalConflictNoted ? "goal-conflict" : "",
    /more important/.test(normalized) ? "priority-shift" : "",
  ]);
  const next = freezeComparisonSession({
    ...previous,
    state,
    comparison: projected.comparison,
    recommendation: projected.recommendation,
    managerPriority,
    fingerprint,
    askedQuestionKeys: asked,
    introduced: true,
    lastMutatedReality: null,
    lastCommittedDecision: null,
    handoff: readyForDecision
      ? toDecisionHandoff({
          entrance: input.entrance,
          comparison: projected.comparison,
          recommendation: projected.recommendation,
        })
      : previous.handoff,
  });
  return Object.freeze({
    session: next,
    response: composeResponse(next, normalized, input.utterance, stale),
    ownsResponse: true,
    shouldCommitRuntime: false,
    nextRuntimeState: input.runtimeState,
    catalog: overlayComparisonCuesOnEntranceCatalog(input.catalog, next),
  });
}

function nextState(
  comparisonStatus: "READY" | "PARTIAL" | "NOT_COMPARABLE" | "STALE",
  recommendationStatus: string,
  readyForDecision: boolean,
  stale: boolean,
): ScenarioComparisonExperienceState {
  if (stale && !readyForDecision) return "ASSESSING_COMPARABILITY";
  if (comparisonStatus === "NOT_COMPARABLE") return "COMPARISON_PARTIAL";
  if (readyForDecision) return "READY_FOR_DECISION";
  if (recommendationStatus === "AVAILABLE") return "RECOMMENDATION_AVAILABLE";
  if (
    recommendationStatus === "WITHHELD" ||
    recommendationStatus === "INSUFFICIENT_EVIDENCE" ||
    recommendationStatus === "CONFLICTING_GOALS" ||
    recommendationStatus === "NO_VALID_SCENARIO" ||
    recommendationStatus === "TIED"
  ) {
    return "RECOMMENDATION_WITHHELD";
  }
  if (comparisonStatus === "READY") return "TRADEOFFS_RESOLVED";
  return "COMPARISON_PARTIAL";
}

function composeResponse(
  session: NexoraScenarioComparisonSession,
  normalized: string,
  utterance: string,
  stale: boolean,
): string {
  const comparison = session.comparison;
  const recommendation = session.recommendation;
  const scenarios = comparison?.scenarioResults ?? [];
  const named = namedFromResults(scenarios, utterance);
  const prefix = stale
    ? "Prior comparison is stale because the Scenario set or evidence changed. Recalculated. "
    : "";
  if (!comparison) {
    return `${prefix}Comparison has not started.`;
  }
  if (comparison.comparisonStatus === "NOT_COMPARABLE") {
    return `${prefix}These Scenarios are not meaningfully comparable. Nexora will not manufacture a ranking.`;
  }
  if (/have i decided/.test(normalized)) {
    return `${prefix}No. A recommendation is not a Decision. The decision is still yours.`;
  }
  if (/are you choosing this for me/.test(normalized)) {
    return `${prefix}No. Nexora may recommend; it does not choose or approve for you.`;
  }
  if (isPreferenceUtterance(normalized)) {
    return `${prefix}Preference noted. That is not approval, and no Decision was committed.`;
  }
  if (/how confident/.test(normalized)) {
    return `${prefix}Confidence is ${recommendation?.confidence ?? "UNKNOWN"}, not a percentage. It is not fabricated precision.`;
  }
  if (/what don'?t we know|what are we missing/.test(normalized)) {
    return `${prefix}Unknowns remain visible: ${comparison.unknowns.slice(0, 4).join("; ") || "exact cost and effect size"}. Unknown is not high risk.`;
  }
  if (/what assumptions matter|which assumption matters/.test(normalized)) {
    const assumption =
      recommendation?.assumptions[0] ??
      "unvalidated conditions required to carry out a path";
    return `${prefix}Material assumptions include ${assumption}. A path can look strong only because an assumption is unvalidated. That is not automatically high risk.`;
  }
  if (/what do i gain/.test(normalized)) {
    const tradeoff =
      comparison.tradeoffs.find((entry) => entry.scenarioId === named?.scenarioId) ??
      comparison.tradeoffs[0];
    return `${prefix}${named?.title ?? "This path"} gain: ${tradeoff?.gains[0] ?? "not evidenced"}.`;
  }
  if (/what do i sacrifice|downside|trade-?offs/.test(normalized)) {
    const lines = comparison.tradeoffs
      .map((entry) => {
        const letter =
          scenarios.find((item) => item.scenarioId === entry.scenarioId)?.letter ??
          "?";
        return `${letter}: gain ${entry.gains[0] ?? "—"}; sacrifice ${entry.sacrifices[0] ?? "—"}`;
      })
      .join(" ");
    return `${prefix}Trade-off is the exchange, not a verdict that every path is bad. ${lines}`;
  }
  if (/which one is faster/.test(normalized)) {
    return `${prefix}${fasterFromComparison(comparison)}`;
  }
  if (/which one costs less|which one is cheaper/.test(normalized)) {
    return `${prefix}${cheaperFromComparison(comparison)}`;
  }
  if (
    /which one has more risk|which one is safer|which option is safer|show me the safer option/.test(
      normalized,
    )
  ) {
    return `${prefix}${riskFromComparison(comparison)} Unknown is not high risk.`;
  }
  if (
    /which one is better|which one fits my goal|which option best supports my goal/.test(
      normalized,
    )
  ) {
    const fits = [...scenarios]
      .filter((entry) => entry.ranked)
      .sort(
        (left, right) =>
          (right.levels["goal-fit"] === "HIGH" ? 1 : 0) -
          (left.levels["goal-fit"] === "HIGH" ? 1 : 0),
      )[0];
    return `${prefix}${fits ? `${fits.title} currently shows stronger Goal fit.` : "Goal fit is inferred from the active Goal, not a hidden score."} Feasible is not the same as desirable.`;
  }
  if (/why not scenario/.test(normalized) || /what would make scenario/.test(normalized)) {
    const other =
      named ??
      scenarios.find(
        (entry) => entry.scenarioId !== recommendation?.recommendedScenarioId,
      );
    return `${prefix}${other?.title ?? "That alternative"} ranks lower or stays conditional because of Goal fit, constraint, unknown cost, or a weaker evidenced benefit. It would become stronger if the missing evidence landed in its favor or if your stated priority changed.`;
  }
  if (/what would change the recommendation/.test(normalized)) {
    return `${prefix}The recommendation depends on Goal priority and unvalidated assumptions. If those change, Nexora recalculates rather than keeping a stale ranking.`;
  }
  if (
    /recommend|strongest|makes the most sense|nexora choose|does this mean you recommend|^why$/.test(
      normalized,
    )
  ) {
    return `${prefix}${recommendationSpeech(session)}`;
  }
  if (/how are they different|compare/.test(normalized)) {
    return `${prefix}${compactComparison(comparison)}\nExpected effects remain PREDICTED, not observed. Ranking is not a Decision.`;
  }
  return `${prefix}${compactComparison(comparison)} ${recommendationSpeech(session)}`;
}

function recommendationSpeech(session: NexoraScenarioComparisonSession): string {
  const recommendation = session.recommendation;
  const comparison = session.comparison;
  if (!recommendation || !comparison) {
    return "Nexora is not recommending a Scenario yet.";
  }
  const recommended = comparison.scenarioResults.find(
    (entry) => entry.scenarioId === recommendation.recommendedScenarioId,
  );
  if (recommendation.recommendationStatus === "CONFLICTING_GOALS") {
    return "Nexora cannot recommend confidently until you clarify which Goal has priority. Which matters more for this decision: speed of recovery or minimizing cost impact? This is a successful outcome, not a failure to choose.";
  }
  if (recommendation.recommendationStatus === "TIED") {
    return "Nexora currently finds the comparable Scenarios too close to distinguish confidently. A recommendation is not required; the decision is still yours.";
  }
  if (recommendation.recommendationStatus === "INSUFFICIENT_EVIDENCE") {
    return "Nexora is not recommending a Scenario yet because material evidence is insufficient. Withholding is preferable to an invented winner.";
  }
  if (recommendation.recommendationStatus === "NO_VALID_SCENARIO") {
    return "No valid Scenario remains to recommend as an equal feasible path.";
  }
  if (recommendation.recommendationStatus === "WITHHELD") {
    return "Nexora is not recommending a Scenario yet because comparison is incomplete or uncertainty is too high to rank responsibly.";
  }
  const alternative = comparison.scenarioResults.find(
    (entry) => entry.scenarioId === recommendation.alternativeScenarioIds[0],
  );
  const provisional =
    recommendation.confidence === "LOW"
      ? " Treat this as provisional."
      : "";
  return `Nexora currently recommends ${recommended?.title ?? "one path"} — that is a recommendation, not an approval, and it does not start execution. Why: ${recommendation.reasoningSummary} Alternative: ${alternative?.title ?? "none evidenced as a conditional substitute"}.${provisional} Decision remains yours.`;
}

function namedFromResults(
  results: readonly {
    readonly scenarioId: string;
    readonly title: string;
    readonly letter: string;
  }[],
  utterance: string,
) {
  const letter = utterance.match(/scenario\s+([a-d])\b/i)?.[1];
  if (letter) {
    return (
      results.find(
        (entry) => entry.letter.toLowerCase() === letter.toLowerCase(),
      ) ?? null
    );
  }
  return null;
}

function cheaperFromComparison(comparison: {
  readonly scenarioResults: readonly {
    readonly title: string;
    readonly numericValues: Readonly<Record<string, string>>;
  }[];
}): string {
  const priced = comparison.scenarioResults.filter(
    (entry) => entry.numericValues.cost,
  );
  if (priced.length < 2) {
    return "Cost remains unknown where it is not evidenced. Nexora will not rank a Scenario as cheaper from missing numbers.";
  }
  return `${priced[0].title} has recorded cost ${priced[0].numericValues.cost}.`;
}

function fasterFromComparison(comparison: {
  readonly scenarioResults: readonly {
    readonly title: string;
    readonly levels: Readonly<Record<string, string>>;
  }[];
}): string {
  const fast = comparison.scenarioResults.filter(
    (entry) => entry.levels["time-to-effect"] === "FAST",
  );
  if (!fast.length) {
    return "Time to effect is not evidenced as an exact duration. Nexora will not invent days or weeks.";
  }
  return `${fast.map((entry) => entry.title).join(" and ")} currently has a stated faster horizon. Others remain UNKNOWN on time.`;
}

function riskFromComparison(comparison: {
  readonly scenarioResults: readonly {
    readonly letter: string;
    readonly levels: Readonly<Record<string, string>>;
  }[];
}): string {
  const known = comparison.scenarioResults.filter(
    (entry) => entry.levels.risk && entry.levels.risk !== "UNKNOWN",
  );
  if (!known.length) {
    return "No Scenario has a supported risk classification to treat as 'more risk'.";
  }
  return known.map((entry) => `${entry.letter}: ${entry.levels.risk}`).join("; ");
}

function freezeComparisonSession(
  session: NexoraScenarioComparisonSession,
): NexoraScenarioComparisonSession {
  return Object.freeze({
    ...session,
    askedQuestionKeys: Object.freeze([...session.askedQuestionKeys]),
    lastMutatedReality: null,
    lastCommittedDecision: null,
  });
}

function unique(values: readonly string[]): readonly string[] {
  return Object.freeze([...new Set(values.filter(Boolean))]);
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
  return (
    /what do you know about me/.test(normalized) || normalized === "who are you"
  );
}

function isGreeting(normalized: string): boolean {
  return /^(?:hi|hello|hey)$/.test(normalized);
}

export function scenarioComparisonUsesExistingAuthorities(): boolean {
  return (
    NEXORA_SCENARIO_COMPARISON_BOUNDARY.startsNexExp7 === false &&
    NEXORA_SCENARIO_COMPARISON_BOUNDARY.commitsDecision === false &&
    NEXORA_SCENARIO_COMPARISON_BOUNDARY.startsExecution === false &&
    NEXORA_SCENARIO_COMPARISON_BOUNDARY.writesDataReality === false &&
    NEXORA_SCENARIO_COMPARISON_BOUNDARY.parallelComparisonEngine === false &&
    getNexoraScenarioComparisonExperienceIdentity().id ===
      "NEX-EXP:6/ScenarioComparisonTradeoffRecommendation"
  );
}
