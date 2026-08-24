/**
 * NEX-MVP-FINAL:6.2 multi-turn certification corpus.
 * Dialogues are not production routes. The resolver must generalize.
 */

export type ContinuityTurnExpectation = {
  readonly utterance: string;
  readonly subjectName?: string | null;
  readonly operation?: string;
  readonly unresolved?: boolean;
  readonly mustNotCommit?: boolean;
  readonly mustNotExecute?: boolean;
  readonly move?: string;
};

export type ContinuityDialogue = {
  readonly id: string;
  readonly category: string;
  readonly turns: readonly ContinuityTurnExpectation[];
};

function d(
  id: string,
  category: string,
  turns: readonly ContinuityTurnExpectation[],
): ContinuityDialogue {
  return Object.freeze({
    id,
    category,
    turns: Object.freeze(turns.map((turn) => Object.freeze(turn))),
  });
}

const CORE: readonly ContinuityDialogue[] = Object.freeze([
  d("A1", "A-pronoun", [
    { utterance: "Show Delivery.", subjectName: "Delivery", operation: "FOCUS" },
    { utterance: "Explain it.", subjectName: "Delivery", operation: "EXPLAIN" },
  ]),
  d("A2", "A-pronoun", [
    { utterance: "Show Capacity.", subjectName: "Capacity" },
    { utterance: "Explain this one.", subjectName: "Capacity" },
  ]),
  d("A3", "A-pronoun", [
    { utterance: "Show Risk.", subjectName: "Risk" },
    { utterance: "What's going on with that?", subjectName: "Risk" },
  ]),
  d("B1", "B-cause", [
    { utterance: "Show Delivery.", subjectName: "Delivery" },
    { utterance: "Why?", subjectName: "Delivery", operation: "CAUSE" },
    { utterance: "What evidence supports that?", subjectName: "Delivery", operation: "EVIDENCE" },
  ]),
  d("B2", "B-cause", [
    { utterance: "Explain Delivery.", subjectName: "Delivery" },
    { utterance: "How?", subjectName: "Delivery" },
    { utterance: "Based on what?", subjectName: "Delivery", operation: "EVIDENCE" },
  ]),
  d("C1", "C-investigation", [
    { utterance: "Show Delivery.", subjectName: "Delivery" },
    { utterance: "Why is it below target?", subjectName: "Delivery", operation: "CAUSE" },
    { utterance: "Tell me more." },
    { utterance: "What happens if we ignore it?", operation: "CONSEQUENCE" },
  ]),
  d("C2", "C-investigation", [
    { utterance: "Show Delivery.", subjectName: "Delivery" },
    { utterance: "Why is it below target?" },
    { utterance: "What does it affect?", operation: "IMPACT" },
    { utterance: "What if we ignore it?", operation: "CONSEQUENCE" },
    { utterance: "What should I do?", operation: "RECOMMEND", mustNotCommit: true },
  ]),
  d("D1", "D-topic-switch", [
    { utterance: "Show Delivery.", subjectName: "Delivery" },
    { utterance: "Explain it.", subjectName: "Delivery" },
    { utterance: "Show Risk.", subjectName: "Risk" },
    { utterance: "Explain it.", subjectName: "Risk" },
  ]),
  d("D2", "D-topic-switch", [
    { utterance: "Explain Delivery.", subjectName: "Delivery" },
    { utterance: "Why?", subjectName: "Delivery" },
    { utterance: "Show Capacity.", subjectName: "Capacity" },
    { utterance: "Explain it.", subjectName: "Capacity" },
  ]),
  d("E1", "E-previous", [
    { utterance: "Show Delivery.", subjectName: "Delivery" },
    { utterance: "Show Capacity.", subjectName: "Capacity" },
    { utterance: "Go back.", subjectName: "Delivery", move: "backtrack" },
    { utterance: "Explain it.", subjectName: "Delivery" },
  ]),
  d("E2", "E-previous", [
    { utterance: "Show Delivery.", subjectName: "Delivery" },
    { utterance: "Show Risk.", subjectName: "Risk" },
    { utterance: "the previous one", subjectName: "Delivery" },
  ]),
  d("F1", "F-what-else", [
    { utterance: "What risks should I investigate?" },
    { utterance: "What else?", move: "what-else" },
  ]),
  d("F2", "F-what-else", [
    { utterance: "What options do we have?", operation: "COMPARE" },
    { utterance: "Anything else?", move: "what-else" },
  ]),
  d("F3", "F-what-else", [
    { utterance: "Show Delivery.", subjectName: "Delivery" },
    { utterance: "What does this affect?", operation: "IMPACT" },
    { utterance: "What else?", move: "what-else" },
  ]),
  d("G1", "G-scenario", [
    { utterance: "What options do we have?", operation: "COMPARE" },
    { utterance: "Compare them.", operation: "COMPARE" },
    { utterance: "Which one is safer?", operation: "RECOMMEND" },
    { utterance: "Why?" },
  ]),
  d("G2", "G-scenario", [
    { utterance: "What options do we have?" },
    { utterance: "Compare them." },
    { utterance: "the other one" },
    { utterance: "What if we do nothing?", operation: "CONSEQUENCE" },
  ]),
  d("H1", "H-decision", [
    { utterance: "What options do we have?" },
    { utterance: "Which one do you recommend?", operation: "RECOMMEND", mustNotCommit: true },
    { utterance: "Let's do that.", mustNotCommit: true, mustNotExecute: true },
    { utterance: "Approve.", mustNotCommit: true },
    { utterance: "Confirm.", mustNotCommit: true },
  ]),
  d("H2", "H-decision", [
    { utterance: "Show Delivery.", subjectName: "Delivery" },
    { utterance: "What should I do?", mustNotCommit: true },
    { utterance: "Let's do that.", mustNotCommit: true, mustNotExecute: true },
  ]),
  d("I1", "I-execution", [
    { utterance: "What happens next?", mustNotExecute: true },
    { utterance: "Start it.", mustNotExecute: true },
    { utterance: "Confirm.", mustNotCommit: true, mustNotExecute: true },
    { utterance: "What changed?" },
  ]),
  d("I2", "I-execution", [
    { utterance: "Show Delivery.", subjectName: "Delivery" },
    { utterance: "What happens next?", mustNotExecute: true },
    { utterance: "How is it going?" },
  ]),
  d("J1", "J-ambiguity", [
    { utterance: "What options do we have?" },
    { utterance: "Compare them." },
    { utterance: "Explain that.", unresolved: true },
  ]),
  d("J2", "J-ambiguity", [
    { utterance: "Show Delivery.", subjectName: "Delivery" },
    { utterance: "Show Capacity.", subjectName: "Capacity" },
    { utterance: "How does it affect it?", unresolved: true },
  ]),
  d("K1", "K-interruption", [
    { utterance: "Explain Delivery.", subjectName: "Delivery" },
    { utterance: "Why?", subjectName: "Delivery" },
    { utterance: "By the way, what can Nexora do?" },
    { utterance: "Okay, back to Delivery.", subjectName: "Delivery" },
    { utterance: "Continue.", subjectName: "Delivery" },
  ]),
  d("K2", "K-interruption", [
    { utterance: "Show Capacity.", subjectName: "Capacity" },
    { utterance: "What can Nexora do?" },
    { utterance: "Where were we?", subjectName: "Capacity" },
  ]),
  d("M1", "M-synthetic", [
    { utterance: "Show Profit.", subjectName: "Profit" },
    { utterance: "Explain it.", subjectName: "Profit" },
    { utterance: "What affects it?", subjectName: "Profit" },
  ]),
  d("M2", "M-synthetic", [
    { utterance: "Show Loan Exposure.", subjectName: "Loan Exposure" },
    { utterance: "Should I worry about it?", subjectName: "Loan Exposure" },
  ]),
  d("M3", "M-synthetic", [
    { utterance: "Show Cash Flow.", subjectName: "Cash Flow" },
    { utterance: "Explain it.", subjectName: "Cash Flow" },
    { utterance: "How bad?", subjectName: "Cash Flow" },
  ]),
  d("N1", "fragments", [
    { utterance: "Show Delivery.", subjectName: "Delivery" },
    { utterance: "and capacity?", subjectName: "Capacity" },
    { utterance: "what about risk?", subjectName: "Risk" },
  ]),
  d("N2", "fragments", [
    { utterance: "Show Delivery.", subjectName: "Delivery" },
    { utterance: "why that?" },
    { utterance: "and if we wait?", operation: "CONSEQUENCE" },
  ]),
  d("N3", "fragments", [
    { utterance: "Show Capacity.", subjectName: "Capacity" },
    { utterance: "same for capacity?", subjectName: "Capacity" },
    { utterance: "how about the goal?" },
  ]),
  d("O1", "goal", [
    { utterance: "Show Goal." },
    { utterance: "What is preventing it?" },
    { utterance: "How serious is it?" },
  ]),
  d("O2", "outcome", [
    { utterance: "Show Delivery.", subjectName: "Delivery" },
    { utterance: "Did it work?" },
    { utterance: "What did we learn?" },
    { utterance: "What should I do now?", operation: "RECOMMEND", mustNotCommit: true },
  ]),
  d("P1", "safety", [
    { utterance: "What options do we have?" },
    { utterance: "Which one do you recommend?", mustNotCommit: true },
    { utterance: "Continue.", mustNotCommit: true, mustNotExecute: true },
  ]),
  d("P2", "safety", [
    { utterance: "What happens next?", mustNotExecute: true },
    { utterance: "Go on.", mustNotExecute: true, mustNotCommit: true },
    { utterance: "yes", mustNotCommit: true, mustNotExecute: true },
    { utterance: "do it", mustNotCommit: true, mustNotExecute: true },
  ]),
  d("Q1", "journey", [
    { utterance: "Show Goal." },
    { utterance: "Show Delivery.", subjectName: "Delivery" },
    { utterance: "Explain it.", subjectName: "Delivery" },
    { utterance: "Why?", subjectName: "Delivery" },
    { utterance: "What does that affect?" },
    { utterance: "What options do we have?" },
    { utterance: "Compare them." },
    { utterance: "Which one looks safer?" },
    { utterance: "Why that one?" },
    { utterance: "What should I do?", mustNotCommit: true },
  ]),
  d("R1", "runtime-shape", [
    { utterance: "Can we look at Delivery?", subjectName: "Delivery" },
    { utterance: "What's going on with it?", subjectName: "Delivery" },
    { utterance: "Why?", subjectName: "Delivery" },
    { utterance: "What does that affect?" },
    { utterance: "Anything else?" },
    { utterance: "What happens if we leave this alone?", operation: "CONSEQUENCE" },
    { utterance: "What could we do?", operation: "RECOMMEND", mustNotCommit: true },
    { utterance: "Compare the options.", operation: "COMPARE" },
    { utterance: "Which one looks safer?" },
    { utterance: "Why that one?" },
    { utterance: "Go back to the problem." },
    { utterance: "What evidence do we have?", operation: "EVIDENCE" },
    { utterance: "Continue." },
    { utterance: "Now show Risk.", subjectName: "Risk" },
    { utterance: "Explain it.", subjectName: "Risk" },
    { utterance: "Back to Delivery.", subjectName: "Delivery" },
    { utterance: "Where were we?" },
  ]),
]);

function mutateDialogue(
  source: ContinuityDialogue,
  id: string,
  first: string,
  second: string,
  third?: string,
): ContinuityDialogue {
  const turns = [...source.turns];
  turns[0] = Object.freeze({ ...turns[0], utterance: first });
  if (turns[1]) turns[1] = Object.freeze({ ...turns[1], utterance: second });
  if (third && turns[2]) turns[2] = Object.freeze({ ...turns[2], utterance: third });
  return d(id, "mutation", turns);
}

const MUTATIONS: readonly ContinuityDialogue[] = Object.freeze([
  mutateDialogue(CORE[0]!, "U1", "Can we look at deliveries?", "What's going on with that?"),
  mutateDialogue(CORE[0]!, "U2", "delivery pls", "explain it"),
  mutateDialogue(CORE[0]!, "U3", "DELIVERY?", "Explain this."),
  mutateDialogue(CORE[3]!, "U4", "Could you show me Delivery?", "why", "How do we know that?"),
  mutateDialogue(CORE[3]!, "U5", "Take a look at Delivery", "Why is that?", "What evidence do we have?"),
  d("U6", "mutation", [
    { utterance: "I'd like to understand Delivery.", subjectName: "Delivery" },
    { utterance: "really?" },
    { utterance: "since when?" },
  ]),
  d("U7", "mutation", [
    { utterance: "Show Delivery.", subjectName: "Delivery" },
    { utterance: "what about it?", subjectName: "Delivery" },
    { utterance: "then what?" },
  ]),
  d("U8", "mutation", [
    { utterance: "Show Risk.", subjectName: "Risk" },
    { utterance: "this problem" },
    { utterance: "that risk", subjectName: "Risk" },
  ]),
  d("U9", "mutation", [
    { utterance: "Show Delivery.", subjectName: "Delivery" },
    { utterance: "Go back to Delivery.", subjectName: "Delivery" },
    { utterance: "Continue.", subjectName: "Delivery" },
  ]),
  d("U10", "mutation", [
    { utterance: "Show Capacity.", subjectName: "Capacity" },
    { utterance: "this problem" },
    { utterance: "Tell me more." },
  ]),
  d("U11", "mutation", [
    { utterance: "Show Delivery.", subjectName: "Delivery" },
    { utterance: "What if we wait?", operation: "CONSEQUENCE" },
    { utterance: "What if we do nothing?", operation: "CONSEQUENCE" },
  ]),
  d("U12", "mutation", [
    { utterance: "Show Delivery.", subjectName: "Delivery" },
    { utterance: "How confident are we?", subjectName: "Delivery" },
  ]),
  d("U13", "mutation", [
    { utterance: "Show Inventory." },
    { utterance: "Explain it." },
    { utterance: "Why?" },
  ]),
  d("U14", "mutation", [
    { utterance: "show inventory" },
    { utterance: "explain it" },
    { utterance: "show risk object" },
    { utterance: "explain it" },
  ]),
  d("U15", "mutation", [
    { utterance: "Show Delivery.", subjectName: "Delivery" },
    { utterance: "okay" },
    { utterance: "Continue.", mustNotCommit: true },
  ]),
]);

export const CONTINUITY_CERTIFICATION_DIALOGUES: readonly ContinuityDialogue[] =
  Object.freeze([
    ...CORE,
    ...MUTATIONS,
    ...Object.freeze(
      [
        "Delivery",
        "Capacity",
        "Risk",
        "Inventory",
        "Quality",
        "Profit",
        "Cash Flow",
        "Loan Exposure",
      ].flatMap((name, index) =>
        [
          d(`X${index}a`, "generated", [
            { utterance: `Show ${name}.`, subjectName: name },
            { utterance: "Explain it.", subjectName: name },
            { utterance: "Why?", subjectName: name },
            { utterance: "What does it affect?" },
          ]),
          d(`X${index}b`, "generated", [
            { utterance: `Can we look at ${name}?`, subjectName: name },
            { utterance: "Tell me more." },
            { utterance: "How bad?", subjectName: name },
          ]),
        ],
      ),
    ),
  ]);

export function countContinuityTurns(
  dialogues: readonly ContinuityDialogue[] = CONTINUITY_CERTIFICATION_DIALOGUES,
): number {
  return dialogues.reduce((sum, dialogue) => sum + dialogue.turns.length, 0);
}
