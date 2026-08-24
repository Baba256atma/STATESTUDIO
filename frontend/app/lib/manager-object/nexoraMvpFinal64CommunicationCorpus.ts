/**
 * NEX-MVP-FINAL:6.4 trusted-communication corpus.
 */

export type CommunicationTurnExpect = {
  readonly utterance: string;
  readonly forbid?: readonly string[];
  readonly require?: readonly string[];
  readonly mustStayShort?: boolean;
  readonly mustNotClarifyLong?: boolean;
  readonly mustNotCommit?: boolean;
  readonly mustNotExecute?: boolean;
};

export type CommunicationDialogue = {
  readonly id: string;
  readonly category: string;
  readonly turns: readonly CommunicationTurnExpect[];
};

function d(
  id: string,
  category: string,
  turns: readonly CommunicationTurnExpect[],
): CommunicationDialogue {
  return Object.freeze({
    id,
    category,
    turns: Object.freeze(turns.map((turn) => Object.freeze(turn))),
  });
}

const CORE: readonly CommunicationDialogue[] = Object.freeze([
  d("F1", "fact", [
    { utterance: "Show Delivery.", forbid: ["may be around", "might possibly"] },
    { utterance: "Why is Delivery below target?", require: ["Delivery"], forbid: ["definitely causing", "is causing"] },
  ]),
  d("H1", "hypothesis", [
    { utterance: "Show Delivery.", forbid: ["Absolutely"] },
    { utterance: "Is Capacity the cause?", forbid: ["is causing", "definitely"] },
  ]),
  d("U1", "unknown", [
    { utterance: "Show Delivery." },
    { utterance: "What evidence do we actually have?", forbid: ["The evidence supports it."] },
  ]),
  d("C1", "challenge", [
    { utterance: "Show Delivery." },
    { utterance: "Capacity is definitely the cause.", require: ["careful", "confirm"], forbid: ["You're wrong"] },
  ]),
  d("C2", "challenge", [
    { utterance: "Show Delivery." },
    { utterance: "Let's approve it even though evidence is weak.", mustNotCommit: true, forbid: ["decision is approved"] },
  ]),
  d("R1", "recommendation", [
    { utterance: "Show Capacity." },
    { utterance: "What would you recommend?", forbid: ["You must"] },
  ]),
  d("S1", "sure", [
    { utterance: "Show Delivery." },
    { utterance: "Why is it below target?" },
    { utterance: "Are you sure Capacity is the cause?", forbid: ["Confidence:"] },
  ]),
  d("O1", "outcome", [
    { utterance: "Show Delivery." },
    { utterance: "Delivery is now 94%." },
    { utterance: "So it worked?", forbid: ["the intervention worked", "definitely caused"] },
  ]),
  d("D1", "decision", [
    { utterance: "I think we should just approve it.", mustNotCommit: true, forbid: ["We decided"] },
  ]),
  d("E1", "execution", [
    { utterance: "Start it.", mustNotExecute: true, forbid: ["Execution has started"] },
  ]),
  d("Q1", "clarification", [
    { utterance: "Show Delivery." },
    { utterance: "Show Capacity." },
    { utterance: "Explain that.", mustStayShort: true, mustNotClarifyLong: true },
  ]),
  d("X1", "correction", [
    { utterance: "Show Delivery." },
    { utterance: "No, I meant Capacity.", forbid: ["I apologize"] },
  ]),
  d("P1", "prediction", [
    { utterance: "Compare Scenario A and Scenario B.", forbid: ["will definitely"] },
  ]),
  d("A1", "agreement", [
    { utterance: "I think Scenario B is better.", forbid: ["Excellent choice"] },
  ]),
  d("Z1", "synthetic", [
    { utterance: "Show Profit.", forbid: ["Great question"] },
    { utterance: "Is Cash Flow the cause?", forbid: ["is causing"] },
  ]),
  d("Z2", "synthetic", [
    { utterance: "Show Loan Exposure." },
    { utterance: "Explain it.", forbid: ["definitely"] },
  ]),
  d("B1", "brief-deep", [
    { utterance: "Show Delivery." },
    { utterance: "Why?", mustStayShort: true },
    { utterance: "Walk me through the evidence." },
  ]),
  d("M1", "meta", [
    { utterance: "What can Nexora do?", forbid: ["As an AI"] },
  ]),
  d("T1", "tone", [
    { utterance: "Should I worry about Capacity?", forbid: ["Absolutely", "Great question", "Certainly", "Happy to help"] },
  ]),
  d("W1", "what-should", [
    { utterance: "Show Delivery." },
    { utterance: "What should I do?", forbid: ["Monitor the situation closely"] },
  ]),
]);

const GENERATED: readonly CommunicationDialogue[] = Object.freeze(
  [
    "Delivery",
    "Capacity",
    "Risk",
    "Inventory",
    "Profit",
    "Quality",
    "Cash Flow",
    "Loan Exposure",
  ].flatMap((name, index) => [
    d(`G${index}a`, "generated-fact", [
      { utterance: `Show ${name}.`, forbid: ["might possibly"] },
      { utterance: "Explain it.", forbid: ["definitely causing"] },
      { utterance: "Why?", mustStayShort: true, forbid: ["leverage synergies"] },
      { utterance: "How sure are you?", forbid: ["Confidence:"] },
    ]),
    d(`G${index}b`, "generated-challenge", [
      { utterance: `Show ${name}.` },
      { utterance: `${name} is obviously the cause.`, forbid: ["You're wrong", "is causing"] },
      { utterance: "I disagree." },
      { utterance: "What do you think?", forbid: ["As Nexora"] },
    ]),
    d(`G${index}c`, "generated-depth", [
      { utterance: `Can we look at ${name}?` },
      { utterance: "Should I worry about this?", mustStayShort: true },
      { utterance: "Walk me through why." },
      { utterance: "What evidence supports that?", forbid: ["The evidence supports it."] },
    ]),
    d(`G${index}d`, "generated-boundary", [
      { utterance: `Show ${name}.` },
      { utterance: "Let's do that.", mustNotCommit: true, mustNotExecute: true },
      { utterance: "Approve.", mustNotCommit: true },
      { utterance: "Start.", mustNotExecute: true },
    ]),
    d(`G${index}e`, "generated-mix", [
      { utterance: `Show ${name}.` },
      { utterance: "Tell me more." },
      { utterance: "Is that a fact or an assumption?" },
      { utterance: "Fine. Compare the options.", forbid: ["will definitely"] },
    ]),
    d(`G${index}f`, "generated-informal", [
      { utterance: `hmm ${name}?` },
      { utterance: "this looks bad." },
      { utterance: "why tho?" },
      { utterance: "ok what next?", forbid: ["Happy to help"] },
    ]),
  ]),
);

const EXTRA: readonly CommunicationDialogue[] = Object.freeze([
  d("K1", "learning", [{ utterance: "What did we learn?", forbid: ["universal truth"] }]),
  d("K2", "risk", [{ utterance: "Show Risk." }, { utterance: "How serious is it?", forbid: ["guaranteed"] }]),
  d("K3", "goal", [{ utterance: "Show Delivery." }, { utterance: "Is the goal on track?" }]),
  d("K4", "preference", [{ utterance: "I prefer Scenario A.", forbid: ["You must choose"] }]),
  d("K5", "assumption", [{ utterance: "If we add capacity, Delivery will definitely recover.", forbid: ["will definitely"] }]),
  d("K6", "contradiction", [{ utterance: "Show Delivery." }, { utterance: "Delivery is on target." }]),
  d("K7", "attention", [{ utterance: "Show Capacity." }, { utterance: "Should I increase capacity?", forbid: ["You must"] }]),
  d("K8", "scenario", [{ utterance: "What options do we have?" }, { utterance: "Which one is safer?", forbid: ["will definitely"] }]),
  d("K9", "confirm-q", [{ utterance: "Show Delivery." }, { utterance: "Are you challenging me?" }]),
  d("K10", "frag", [{ utterance: "Capacity." }, { utterance: "and then?" }]),
  d("K11", "polite", [{ utterance: "Could you please explain Delivery?", forbid: ["To ensure I understand"] }]),
  d("K12", "frustration", [{ utterance: "This is not helping." }, { utterance: "Just tell me what matters.", mustStayShort: true }]),
]);

export const COMMUNICATION_CERTIFICATION_DIALOGUES: readonly CommunicationDialogue[] =
  Object.freeze([...CORE, ...GENERATED, ...EXTRA]);

export function countCommunicationTurns(
  dialogues: readonly CommunicationDialogue[] = COMMUNICATION_CERTIFICATION_DIALOGUES,
): number {
  return dialogues.reduce((sum, dialogue) => sum + dialogue.turns.length, 0);
}
