/**
 * NEX-MVP-FINAL:6.3 clarification/correction corpus.
 */

export type ClarificationTurnExpect = {
  readonly utterance: string;
  readonly mustClarify?: boolean;
  readonly mustNotClarify?: boolean;
  readonly resumeSubject?: string;
  readonly correction?: boolean;
  readonly mustNotCommit?: boolean;
  readonly mustNotExecute?: boolean;
};

export type ClarificationDialogue = {
  readonly id: string;
  readonly category: string;
  readonly turns: readonly ClarificationTurnExpect[];
};

function d(
  id: string,
  category: string,
  turns: readonly ClarificationTurnExpect[],
): ClarificationDialogue {
  return Object.freeze({
    id,
    category,
    turns: Object.freeze(turns.map((turn) => Object.freeze(turn))),
  });
}

const CLEAR: readonly ClarificationDialogue[] = Object.freeze([
  d("N1", "no-clarify", [{ utterance: "Show Delivery.", mustNotClarify: true }]),
  d("N2", "no-clarify", [{ utterance: "Explain Capacity.", mustNotClarify: true }]),
  d("N3", "no-clarify", [{ utterance: "Why is Delivery below target?", mustNotClarify: true }]),
  d("N4", "no-clarify", [{ utterance: "Show Risk.", mustNotClarify: true }]),
  d("N5", "no-clarify", [{ utterance: "Explain the Capacity Gap.", mustNotClarify: true }]),
  d("N6", "no-clarify", [{ utterance: "What evidence supports Delivery?", mustNotClarify: true }]),
  d("N7", "no-clarify", [
    { utterance: "Show Delivery.", mustNotClarify: true },
    { utterance: "Explain it.", mustNotClarify: true },
  ]),
  d("N8", "no-clarify", [
    { utterance: "Compare Scenario A and Scenario B.", mustNotClarify: true },
  ]),
]);

const CORE: readonly ClarificationDialogue[] = Object.freeze([
  d("A1", "ambiguous-pronoun", [
    { utterance: "Show Delivery.", mustNotClarify: true },
    { utterance: "Show Capacity.", mustNotClarify: true },
    { utterance: "Explain that.", mustClarify: true },
    { utterance: "Capacity.", resumeSubject: "Capacity" },
  ]),
  d("A2", "yes-no", [
    { utterance: "Show Delivery.", mustNotClarify: true },
    { utterance: "Show Capacity.", mustNotClarify: true },
    { utterance: "Explain that.", mustClarify: true },
    { utterance: "The second one.", resumeSubject: "Capacity" },
  ]),
  d("A3", "neither", [
    { utterance: "Show Delivery.", mustNotClarify: true },
    { utterance: "Show Capacity.", mustNotClarify: true },
    { utterance: "Explain that.", mustClarify: true },
    { utterance: "Neither.", mustClarify: true },
  ]),
  d("A4", "cancel", [
    { utterance: "Show Delivery.", mustNotClarify: true },
    { utterance: "Show Capacity.", mustNotClarify: true },
    { utterance: "Explain that.", mustClarify: true },
    { utterance: "Never mind." },
  ]),
  d("A5", "topic-shift", [
    { utterance: "Show Delivery.", mustNotClarify: true },
    { utterance: "Show Capacity.", mustNotClarify: true },
    { utterance: "Explain that.", mustClarify: true },
    { utterance: "Actually, show Risk.", mustNotClarify: true, resumeSubject: "Risk" },
  ]),
  d("C1", "correction", [
    { utterance: "Show Delivery.", mustNotClarify: true },
    { utterance: "No, I meant Capacity.", correction: true, resumeSubject: "Capacity" },
    { utterance: "Explain it.", mustNotClarify: true, resumeSubject: "Capacity" },
  ]),
  d("C2", "correction-after-answer", [
    { utterance: "Explain Delivery.", mustNotClarify: true },
    { utterance: "Actually, Capacity.", correction: true, resumeSubject: "Capacity" },
    { utterance: "Why?", mustNotClarify: true },
  ]),
  d("C3", "unseen", [
    { utterance: "Show Delivery.", mustNotClarify: true },
    { utterance: "That's not the one.", mustClarify: true },
  ]),
  d("C4", "unseen", [
    { utterance: "Show Delivery.", mustNotClarify: true },
    { utterance: "I was talking about Capacity.", correction: true, resumeSubject: "Capacity" },
  ]),
  d("C5", "unseen", [
    { utterance: "Show Risk.", mustNotClarify: true },
    { utterance: "Scratch that — Capacity.", correction: true, resumeSubject: "Capacity" },
  ]),
  d("S1", "safety", [
    { utterance: "Approve it.", mustNotCommit: true },
    { utterance: "Start it.", mustNotExecute: true },
  ]),
  d("S2", "safety", [
    { utterance: "Show Delivery.", mustNotClarify: true },
    { utterance: "Let's do that.", mustNotCommit: true, mustNotExecute: true },
  ]),
  d("R1", "resume-ops", [
    { utterance: "Show Delivery.", mustNotClarify: true },
    { utterance: "Show Capacity.", mustNotClarify: true },
    { utterance: "Explain that.", mustClarify: true },
    { utterance: "Delivery.", resumeSubject: "Delivery" },
  ]),
  d("M1", "meta", [
    { utterance: "Show Delivery.", mustNotClarify: true },
    { utterance: "Show Capacity.", mustNotClarify: true },
    { utterance: "Explain that.", mustClarify: true },
    { utterance: "What can Nexora do?" },
  ]),
  d("P1", "synthetic", [
    { utterance: "Show Profit.", mustNotClarify: true },
    { utterance: "Explain that.", mustNotClarify: true },
    { utterance: "No, Cash Flow.", correction: true, resumeSubject: "Cash Flow" },
    { utterance: "Why?" },
  ]),
  d("P2", "synthetic", [
    { utterance: "Show Loan Exposure.", mustNotClarify: true },
    { utterance: "Show Quality.", mustNotClarify: true },
    { utterance: "Explain that.", mustClarify: true },
  ]),
]);

const GENERATED: readonly ClarificationDialogue[] = Object.freeze(
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
    d(`G${index}a`, "generated-clear", [
      { utterance: `Show ${name}.`, mustNotClarify: true },
      { utterance: "Explain it.", mustNotClarify: true },
      { utterance: "Why?", mustNotClarify: true },
      { utterance: "What evidence do we have?", mustNotClarify: true },
    ]),
    d(`G${index}b`, "generated-correct", [
      { utterance: `Show ${name}.`, mustNotClarify: true },
      {
        utterance: name === "Capacity" ? "No, I meant Delivery." : "No, I meant Capacity.",
        correction: true,
      },
      { utterance: "Explain it." },
    ]),
    d(`G${index}c`, "generated-shift", [
      { utterance: `Show ${name}.`, mustNotClarify: true },
      { utterance: name === "Risk" ? "Show Delivery." : "Show Risk.", mustNotClarify: true },
      { utterance: "Explain that.", mustClarify: true },
      { utterance: "The first one." },
    ]),
    d(`G${index}d`, "generated-padding", [
      { utterance: `Can we look at ${name}?`, mustNotClarify: true },
      { utterance: "Tell me more." },
      { utterance: "How bad?" },
      { utterance: "What should I do?", mustNotCommit: true },
    ]),
  ]),
);

const EXTRA: readonly ClarificationDialogue[] = Object.freeze([
  d("X1", "extra", [
    { utterance: "Show Delivery.", mustNotClarify: true },
    { utterance: "What happens if we ignore it?", mustNotClarify: true },
  ]),
  d("X2", "extra", [
    { utterance: "Show Capacity Gap.", mustNotClarify: true },
    { utterance: "How serious is it?", mustNotClarify: true },
  ]),
]);

export const CLARIFICATION_CERTIFICATION_DIALOGUES: readonly ClarificationDialogue[] =
  Object.freeze([...CLEAR, ...CORE, ...GENERATED, ...EXTRA]);

export const NO_CLARIFICATION_UTTERANCES: readonly string[] = Object.freeze([
  "Show Delivery.",
  "Explain Capacity.",
  "Why is Delivery below target?",
  "Show Risk.",
  "Explain the Capacity Gap.",
  "What evidence supports Delivery?",
  "Compare Scenario A and Scenario B.",
]);

export function countClarificationTurns(
  dialogues: readonly ClarificationDialogue[] = CLARIFICATION_CERTIFICATION_DIALOGUES,
): number {
  return dialogues.reduce((sum, dialogue) => sum + dialogue.turns.length, 0);
}
