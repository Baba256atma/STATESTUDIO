/**
 * NPA-T RMS:4 — bounded manager behavior selection.
 * Chooses the next utterance from the manager's own objective, visible history,
 * and profile. It does not read Ground Truth, Observer state, or Nexora internals.
 */

import type { RmsManagerIntent, RmsManagerKnowledge, RmsManagerObjective, RmsManagerProfile, RmsManagerProfileId } from "./rmsManagerContract.ts";
import { assertNoArchitectureTerms } from "./rmsManagerTurnGeneration.ts";

const AGENDA_ONLY_PROFILES = new Set<RmsManagerProfileId>(["STANDARD_MANAGER", "DATA_DRIVEN_MANAGER"]);

export function profileUsesBoundedBehavior(profileId: RmsManagerProfileId, seed: number | null): boolean {
  return seed != null && !AGENDA_ONLY_PROFILES.has(profileId);
}

function permittedTopics(objective: RmsManagerObjective): readonly string[] {
  const statement = objective.statement.toLowerCase();
  if (objective.hostKind === "PROJECT" || statement.includes("progress")) {
    return Object.freeze(["Schedule", "Delivery", "Resources", "Risk", "Milestone"]);
  }
  if (statement.includes("service")) {
    return Object.freeze(["Service", "Capacity", "Staffing", "Risk", "Delivery"]);
  }
  if (statement.includes("exposure") || statement.includes("outbound")) {
    return Object.freeze(["Delivery", "Inventory", "Risk", "Capacity"]);
  }
  return Object.freeze(["Capacity", "Delivery", "Revenue", "Risk", "Inventory"]);
}

function visibleAnchor(knowledge: RmsManagerKnowledge): string {
  const last = [...knowledge.visibleFacts].reverse().find((item) => item.source === "nexora-response" || item.source === "stage-visible");
  return `${knowledge.currentSubject ?? ""}|${knowledge.discussedLabels.join(",")}|${last?.text.slice(0, 180) ?? ""}`;
}

function mix(seed: number, profileId: string, turnCount: number, objective: string, visible: string): number {
  let hash = (seed >>> 0) || 1;
  const text = `${profileId}\n${turnCount}\n${objective}\n${visible}`;
  for (let index = 0; index < text.length; index += 1) {
    hash ^= text.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function pick<T>(hash: number, items: readonly T[]): T {
  return items[hash % items.length]!;
}

function topicFor(hash: number, topics: readonly string[], knowledge: RmsManagerKnowledge): string {
  const discussed = knowledge.discussedLabels.filter((label) =>
    topics.some((topic) => label.toLowerCase().includes(topic.toLowerCase())),
  );
  if (discussed.length > 0 && hash % 3 !== 0) {
    const recent = discussed[discussed.length - 1]!;
    const match = topics.find((topic) => recent.toLowerCase().includes(topic.toLowerCase()));
    if (match) return match;
  }
  return topics[hash % topics.length]!;
}

function spoken(intent: RmsManagerIntent, utterance: string): { readonly intent: RmsManagerIntent; readonly utterance: string; readonly replacesNexoraIntent: false } {
  assertNoArchitectureTerms(utterance);
  return Object.freeze({ intent, utterance, replacesNexoraIntent: false as const });
}

function drivingLine(topic: string, objective: RmsManagerObjective): string {
  if (topic === "Capacity" && objective.hostKind === "BUSINESS" && !objective.statement.toLowerCase().includes("service")) {
    return "What is driving Capacity Gap?";
  }
  return `What is driving ${topic}?`;
}

export function selectBoundedRmsManagerBehaviorTurn(input: {
  readonly profile: RmsManagerProfile;
  readonly objective: RmsManagerObjective;
  readonly knowledge: RmsManagerKnowledge;
  readonly turnCount: number;
  readonly seed: number;
}): { readonly intent: RmsManagerIntent; readonly utterance: string; readonly replacesNexoraIntent: false } {
  if (input.profile.groundTruthAccess) throw new Error("RMS:4 behavior profile must not grant Ground Truth");
  if (input.knowledge.sealedGroundTruth || input.knowledge.observerKnowledge) {
    throw new Error("RMS:4 behavior selection cannot read sealed or Observer knowledge");
  }
  const topics = permittedTopics(input.objective);
  const hash = mix(input.seed, input.profile.profileId, input.turnCount, input.objective.statement, visibleAnchor(input.knowledge));
  const topic = topicFor(hash, topics, input.knowledge);
  const profileId = input.profile.profileId;

  if (profileId === "IMPATIENT_MANAGER") {
    const bank = Object.freeze([
      spoken("ASK_CAUSE", "Why?"),
      spoken("INSPECT", "Show me."),
      spoken("FOLLOW_UP", "And this?"),
      spoken("ASK_OPTIONS", "Fix it."),
      spoken("FOLLOW_UP", "Next."),
      spoken("COMPARE", "Compare them."),
      spoken("ASK_CAUSE", "What about yesterday?"),
      spoken("ASK_CAUSE", "Has it changed?"),
    ]);
    if (input.turnCount > 0 && input.turnCount % 7 === 6) return spoken("INVESTIGATE", "No, I meant Delivery.");
    return pick(hash, bank);
  }

  if (profileId === "AMBIGUOUS_MANAGER") {
    const bank = Object.freeze([
      spoken("FOLLOW_UP", "What about that?"),
      spoken("FOLLOW_UP", "Is this bad?"),
      spoken("ASK_CAUSE", "What changed?"),
      spoken("FOLLOW_UP", "Which one?"),
      spoken("ASK_OPTIONS", "Can we improve it?"),
    ]);
    if (hash % 13 === 0) return spoken("INVESTIGATE", "No, I meant Delivery.");
    return pick(hash, bank);
  }

  if (profileId === "DISTRACTED_MANAGER") {
    if (input.turnCount > 0 && input.turnCount % 4 === 3) return spoken("INVESTIGATE", `Go back to ${topics[0]}.`);
    const bank = Object.freeze([
      spoken("INVESTIGATE", `What about ${topic}?`),
      spoken("INSPECT", `Show the ${topic} problem.`),
      spoken("ASK_CAUSE", "What about that?"),
      spoken("FOLLOW_UP", "Wait — show Revenue first."),
    ]);
    return pick(hash, bank);
  }

  if (profileId === "INVESTIGATIVE_MANAGER") {
    const bank = Object.freeze([
      spoken("ASK_CAUSE", "Why?"),
      spoken("ASK_CAUSE", "What caused this?"),
      spoken("ASK_DATA", "What evidence supports that?"),
      spoken("ASK_OPTIONS", "What variables matter?"),
      spoken("ASK_DATA", "What don't we know?"),
      spoken("ASK_CAUSE", "What would change the conclusion?"),
      spoken("ASK_CAUSE", "What changed since yesterday?"),
      spoken("FOLLOW_UP", "Is this still a problem?"),
      spoken("ASK_CAUSE", "Has anything changed?"),
    ]);
    return pick(hash, bank);
  }

  if (profileId === "DECISION_ORIENTED_MANAGER") {
    const phase = input.turnCount % 6;
    if (phase === 0) return pick(hash, Object.freeze([
      spoken("INSPECT", `Show the ${topic} problem.`),
      spoken("UNDERSTAND", "What is the problem?"),
    ]));
    if (phase === 1) return pick(hash, Object.freeze([
      spoken("ASK_OPTIONS", "Show me a scenario."),
      spoken("ASK_OPTIONS", "What are the options?"),
    ]));
    if (phase === 2) return pick(hash, Object.freeze([
      spoken("COMPARE", "Compare the three scenarios."),
      spoken("COMPARE", "Compare those two."),
    ]));
    if (phase === 3) return pick(hash, Object.freeze([
      spoken("ASK_RECOMMENDATION", "Let's go with the first option."),
      spoken("ASK_RECOMMENDATION", "What do you recommend?"),
    ]));
    if (phase === 4) return spoken("ASK_RECOMMENDATION", "Yes, make that the decision.");
    return pick(hash, Object.freeze([
      spoken("FOLLOW_UP", "Start it."),
      spoken("FOLLOW_UP", "Did it work?"),
    ]));
  }

  if (profileId === "SKEPTICAL_MANAGER") {
    const bank = Object.freeze([
      spoken("ASK_DATA", "How do you know?"),
      spoken("ASK_CAUSE", "That doesn't make sense."),
      spoken("ASK_DATA", "Show the evidence."),
      spoken("ASK_CAUSE", "Are you assuming that?"),
      spoken("ASK_DATA", "Did we observe that or calculate it?"),
      spoken("ASK_DATA", "Where did that come from?"),
      spoken("FOLLOW_UP", "Does this decision still make sense?"),
    ]);
    return pick(hash, bank);
  }

  if (profileId === "NONLINEAR_MANAGER") {
    const bank = Object.freeze([
      spoken("FOLLOW_UP", "How is execution going?"),
      spoken("ASK_DATA", "What is the KPI?"),
      spoken("INVESTIGATE", "Go back to the earlier decision."),
      spoken("INVESTIGATE", "Where is the risk?"),
      spoken("COMPARE", "Compare the scenarios."),
      spoken("UNDERSTAND", "What is the goal?"),
      spoken("FOLLOW_UP", "Start it."),
    ]);
    return pick(hash, bank);
  }

  if (profileId === "EXECUTIVE_MANAGER") {
    if (hash % 5 === 0) return spoken("INSPECT", `Show the ${topic} problem.`);
    const bank = Object.freeze([
      spoken("UNDERSTAND", "What needs my attention?"),
      spoken("UNDERSTAND", "Where are we exposed?"),
      spoken("ASK_RECOMMENDATION", "What decision is blocking the project?"),
      spoken("ASK_RECOMMENDATION", "What should I look at before approving this?"),
      spoken("INSPECT", "Give me the management picture."),
      spoken("FOLLOW_UP", "Do I still need to act?"),
    ]);
    return pick(hash, bank);
  }

  if (profileId === "DATA_CHALLENGING_MANAGER") {
    const bank = Object.freeze([
      spoken("ASK_DATA", "Is this current?"),
      spoken("ASK_DATA", "Where did this number come from?"),
      spoken("ASK_DATA", "Do we actually have enough information?"),
      spoken("ASK_DATA", "Which CSV contains this?"),
      spoken("ASK_CAUSE", "What happens if this data is wrong?"),
      spoken("ASK_CAUSE", "Has anything changed?"),
      spoken("ASK_DATA", "Is this current?"),
    ]);
    return pick(hash, bank);
  }

  const structured = Object.freeze([
    spoken("INSPECT", `Show the ${topic} problem.`),
    spoken("COMPARE", "Compare the three scenarios."),
    spoken("ASK_CAUSE", drivingLine(topic, input.objective)),
    spoken("ASK_RECOMMENDATION", "Recommend what I should investigate next."),
  ]);
  return pick(hash, structured);
}
