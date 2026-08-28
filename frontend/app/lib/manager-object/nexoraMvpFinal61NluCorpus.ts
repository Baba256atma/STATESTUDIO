/**
 * NEX-MVP-FINAL:6.1 certification corpus.
 * Includes unseen paraphrases. Production interpreter must not list these
 * sentences; it must generalize from frames + registered objects.
 */

export type NluCorpusExpectation = {
  readonly operation?: string;
  readonly subjectName?: string | null;
  readonly communicativeIntent?: string;
  readonly questionType?: string;
  readonly minConfidence?: "HIGH" | "MEDIUM" | "LOW";
  readonly unknown?: boolean;
  readonly unresolved?: boolean;
  readonly observation?: boolean;
  readonly challenge?: boolean;
  readonly meta?: boolean;
  readonly mustNotCommit?: boolean;
  readonly mustNotExecute?: boolean;
  readonly mustNotFabricateObject?: boolean;
};

export type NluCorpusCase = {
  readonly id: string;
  readonly utterance: string;
  readonly form: string;
  readonly expected: NluCorpusExpectation;
};

function c(
  id: string,
  utterance: string,
  form: string,
  expected: NluCorpusExpectation,
): NluCorpusCase {
  return Object.freeze({ id, utterance, form, expected: Object.freeze(expected) });
}

export const NLU_CERTIFICATION_CORPUS: readonly NluCorpusCase[] = Object.freeze([
  c("o1", "Show Delivery.", "command", { operation: "FOCUS", subjectName: "Delivery" }),
  c("o2", "Show Capacity.", "command", { operation: "FOCUS", subjectName: "Capacity" }),
  c("o3", "show risk object", "command", { operation: "FOCUS", subjectName: "Risk" }),
  c("o4", "Explain Delivery.", "command", { operation: "EXPLAIN", subjectName: "Delivery" }),
  c("o5", "explain it", "command", { operation: "EXPLAIN" }),
  c("o6", "Why is Delivery slipping?", "question", { operation: "CAUSE", subjectName: "Delivery", questionType: "CAUSE" }),
  c("o7", "what does it affect?", "question", { operation: "IMPACT" }),
  c("o8", "What happens if this continues?", "question", { operation: "CONSEQUENCE" }),
  c("o9", "How do we know that?", "question", { operation: "EVIDENCE", questionType: "EVIDENCE" }),
  c("o10", "What should I do?", "question", { operation: "RECOMMEND" }),
  c("o11", "Compare them", "command", { operation: "COMPARE" }),
  c("o12", "Why", "fragment", { operation: "CAUSE" }),
  c("o13", "Let's do that", "command", { mustNotCommit: true, mustNotExecute: true }),
  c("o14", "Approve", "command", { mustNotCommit: true, mustNotExecute: true }),
  c("o15", "Confirm", "command", { mustNotCommit: true, mustNotExecute: true }),
  c("o16", "what happens next", "question", { mustNotExecute: true }),
  c("o17", "start", "command", { mustNotExecute: true }),
  c("o18", "What changed?", "question", { mustNotFabricateObject: true }),
  c("o19", "Did it work?", "question", { mustNotFabricateObject: true }),
  c("o20", "What did we learn?", "question", { mustNotFabricateObject: true }),
  c("o21", "What should I do now?", "question", { operation: "RECOMMEND" }),
  c("o22", "Show Goal", "command", { subjectName: "Close Capacity Gap" }),
  c("o23", "Show Problem", "command", { operation: "FOCUS" }),
  c("o24", "Show Scenario", "command", { operation: "FOCUS" }),
  c("o25", "Show Decision", "command", { operation: "FOCUS" }),
  c("o26", "Show Execution", "command", { operation: "FOCUS" }),
  // NXA:1: a named interrogative is knowledge, not implicit navigation.
  c("o27", "Delivery?", "fragment", { operation: "EXPLAIN", subjectName: "Delivery" }),
  c("o28", "Capacity?", "fragment", { operation: "EXPLAIN", subjectName: "Capacity" }),
  c("p1", "Can you bring up delivery?", "polite", { operation: "FOCUS", subjectName: "Delivery" }),
  c("p2", "I want to understand our delivery performance.", "indirect", { operation: "EXPLAIN", subjectName: "Delivery" }),
  c("p3", "How are we doing on deliveries?", "question", { operation: "STATUS", subjectName: "Delivery" }),
  c("p4", "Is delivery becoming a problem?", "question", { subjectName: "Delivery" }),
  c("p5", "Tell me what you know about delivery.", "command", { operation: "EXPLAIN", subjectName: "Delivery" }),
  c("p6", "Could late deliveries hurt the goal?", "question", { subjectName: "Delivery" }),
  c("p7", "Do we need to worry about capacity?", "question", { operation: "ATTENTION", subjectName: "Capacity" }),
  c("p8", "What are my options?", "question", { operation: "COMPARE" }),
  c("p9", "Would doing nothing be safer?", "question", { operation: "CONSEQUENCE" }),
  c("p10", "Which one would you choose?", "question", { operation: "RECOMMEND" }),
  c("p11", "I'm not convinced.", "challenge", { challenge: true }),
  c("p12", "What makes you say that?", "challenge", { challenge: true }),
  c("u1", "Can we look at Delivery?", "unseen", { operation: "FOCUS", subjectName: "Delivery" }),
  c("u2", "What's actually going on with Delivery?", "unseen", { operation: "EXPLAIN", subjectName: "Delivery" }),
  c("u3", "Is anything putting the delivery goal at risk?", "unseen", { operation: "ATTENTION", subjectName: "Delivery" }),
  c("u4", "How confident are we about that?", "unseen", { operation: "EVIDENCE" }),
  c("u5", "What would happen if management did nothing?", "unseen", { operation: "CONSEQUENCE" }),
  c("u6", "I'd like to understand Capacity.", "unseen", { operation: "EXPLAIN", subjectName: "Capacity" }),
  c("u7", "Is Capacity really worth worrying about?", "unseen", { operation: "ATTENTION", subjectName: "Capacity" }),
  c("u8", "What evidence do we have?", "unseen", { operation: "EVIDENCE" }),
  c("u9", "What other options are there?", "unseen", { operation: "COMPARE" }),
  c("u10", "Which scenario looks safer?", "unseen", { operation: "COMPARE" }),
  c("u11", "Is anything threatening our delivery target?", "unseen", { operation: "ATTENTION", subjectName: "Delivery" }),
  c("u12", "Where should I be paying attention?", "unseen", { operation: "ATTENTION" }),
  c("u13", "What makes Capacity important right now?", "unseen", { subjectName: "Capacity" }),
  c("u14", "Is this actually worth investigating?", "unseen", { operation: "INVESTIGATE" }),
  c("u15", "What would happen if management left this alone?", "unseen", { operation: "CONSEQUENCE" }),
  c("u16", "Which option gives us the best balance?", "unseen", { operation: "COMPARE" }),
  c("u17", "Are we making this decision with enough evidence?", "unseen", { operation: "EVIDENCE" }),
  c("u18", "What information are we missing?", "unseen", { operation: "EVIDENCE" }),
  c("u19", "What would change your recommendation?", "unseen", { operation: "RECOMMEND" }),
  c("u20", "Can you walk me through why this matters?", "unseen", { operation: "CAUSE" }),
  c("u21", "Bring up Delivery.", "unseen", { operation: "FOCUS", subjectName: "Delivery" }),
  c("u22", "I'd like to look at Delivery.", "unseen", { operation: "FOCUS", subjectName: "Delivery" }),
  c("u23", "Can we inspect Delivery?", "unseen", { operation: "FOCUS", subjectName: "Delivery" }),
  c("u24", "Take me to the delivery picture.", "unseen", { operation: "FOCUS", subjectName: "Delivery" }),
  c("u25", "Let's look at how delivery is doing.", "unseen", { subjectName: "Delivery" }),
  c("m1", "Could you show me Delivery?", "mutation", { operation: "FOCUS", subjectName: "Delivery" }),
  c("m2", "delivery pls", "mutation", { operation: "FOCUS", subjectName: "Delivery" }),
  c("m3", "Can I see delivery", "mutation", { operation: "FOCUS", subjectName: "Delivery" }),
  c("m4", "DELIVERY?", "mutation", { operation: "EXPLAIN", subjectName: "Delivery" }),
  c("m5", "let's check deliveries", "mutation", { subjectName: "Delivery" }),
  c("n1", "Do something.", "unknown", { unknown: true, mustNotFabricateObject: true, mustNotCommit: true }),
  c("n2", "Fix everything.", "unknown", { unknown: true, mustNotFabricateObject: true }),
  c("n3", "Make it better.", "unknown", { unknown: true, mustNotFabricateObject: true }),
  c("n4", "That business thing.", "unknown", { mustNotFabricateObject: true }),
  c("n5", "Take care of it.", "unknown", { unknown: true, mustNotCommit: true, mustNotExecute: true }),
  c("n6", "Make the business awesome.", "unknown", { unknown: true, mustNotCommit: true, mustNotExecute: true }),
  c("n7", "Bring that thing up.", "ambiguous", { unresolved: true, mustNotFabricateObject: true }),
  c("obs1", "Delivery was around 91% last month.", "observation", { observation: true, subjectName: "Delivery" }),
  c("obs2", "We have a backlog.", "observation", { observation: true, mustNotCommit: true }),
  c("obs3", "Capacity feels constrained.", "observation", { observation: true, subjectName: "Capacity" }),
  c("obs4", "I don’t think this risk is serious.", "observation", { subjectName: "Risk" }),
  c("obs5", "The target is 96%.", "observation", { observation: true }),
  c("obs6", "Capacity seems tight.", "observation", { observation: true, subjectName: "Capacity" }),
  c("ch1", "Are you sure?", "challenge", { challenge: true }),
  c("ch2", "Why should I believe that?", "challenge", { challenge: true }),
  c("ch3", "That doesn’t make sense.", "challenge", { challenge: true }),
  c("ch4", "I disagree.", "challenge", { challenge: true }),
  c("ch5", "What evidence supports that?", "challenge", { operation: "EVIDENCE" }),
  c("ch6", "You’re assuming Capacity is the problem.", "challenge", { challenge: true, subjectName: "Capacity" }),
  c("meta1", "What can you do?", "meta", { meta: true }),
  c("meta2", "Can you explain how Nexora works?", "meta", { meta: true }),
  c("meta3", "What kinds of questions can I ask?", "meta", { meta: true }),
  c("meta4", "Can you help me investigate a KPI?", "meta", { meta: true, mustNotFabricateObject: true }),
  c("safe1", "Maybe we should expand capacity.", "suggestion", { mustNotCommit: true, mustNotExecute: true, subjectName: "Capacity" }),
  c("q1", "What is going on with Delivery?", "question", { operation: "EXPLAIN", subjectName: "Delivery" }),
  c("q2", "Why is Delivery slipping?", "question", { operation: "CAUSE", subjectName: "Delivery" }),
  c("q3", "What does this affect?", "question", { operation: "IMPACT" }),
  c("q4", "What happens if this continues?", "question", { operation: "CONSEQUENCE" }),
  c("q5", "How do we know that?", "question", { operation: "EVIDENCE" }),
  c("q6", "What would you do?", "question", { operation: "RECOMMEND" }),
  c("q7", "What else could we do?", "question", { operation: "COMPARE" }),
  c("q8", "Which option is safer?", "question", { operation: "COMPARE" }),
  c("q9", "Does this actually matter to my goal?", "question", { questionType: "GOAL_RELEVANCE" }),
  c("q10", "Where are we now?", "question", { operation: "STATUS" }),
  c("q11", "Can Nexora help me investigate this?", "meta", { meta: true }),
  c("k1", "Show me the KPI picture.", "command", { operation: "FOCUS" }),
  c("k2", "Open Outcome", "command", { operation: "FOCUS" }),
  c("k3", "Is quality affecting the goal?", "question", { operation: "IMPACT" }),
  c("amb1", "Show the risk problem.", "ambiguous", { unresolved: true }),
  c("ty1", "show delivry", "typo", { subjectName: "Delivery" }),
  c("ty2", "explain capacit", "typo", { subjectName: "Capacity" }),
  c("more1", "let me see delivery", "polite", { operation: "FOCUS", subjectName: "Delivery" }),
  c("more2", "I want to look at delivery", "indirect", { operation: "FOCUS", subjectName: "Delivery" }),
  c("more3", "can we look at delivery?", "polite", { operation: "FOCUS", subjectName: "Delivery" }),
  c("more4", "I'd like to see delivery", "polite", { operation: "FOCUS", subjectName: "Delivery" }),
  c("more5", "Should I worry about Delivery?", "question", { operation: "ATTENTION", subjectName: "Delivery" }),
  c("more6", "What affects Delivery?", "question", { operation: "IMPACT", subjectName: "Delivery" }),
  c("more7", "Explain Capacity.", "command", { operation: "EXPLAIN", subjectName: "Capacity" }),
]);

export const NLU_PARAPHRASE_GROUPS: readonly {
  readonly operation: string;
  readonly subjectName?: string;
  readonly utterances: readonly string[];
}[] = Object.freeze([
  Object.freeze({
    operation: "FOCUS",
    subjectName: "Delivery",
    utterances: Object.freeze([
      "Show Delivery.",
      "Bring up Delivery.",
      "I'd like to look at Delivery.",
      "Can we inspect Delivery?",
      "Take me to the delivery picture.",
      "Let's look at how delivery is doing.",
    ]),
  }),
  Object.freeze({
    operation: "EXPLAIN",
    subjectName: "Delivery",
    utterances: Object.freeze([
      "Explain Delivery.",
      "What's actually going on with Delivery?",
      "I want to understand our delivery performance.",
      "Tell me what you know about delivery.",
    ]),
  }),
  Object.freeze({
    operation: "CAUSE",
    utterances: Object.freeze([
      "Why is Delivery slipping?",
      "Can you walk me through why this matters?",
    ]),
  }),
  Object.freeze({
    operation: "IMPACT",
    utterances: Object.freeze(["What does it affect?", "What affects Delivery?"]),
  }),
  Object.freeze({
    operation: "CONSEQUENCE",
    utterances: Object.freeze([
      "What happens if this continues?",
      "What would happen if management did nothing?",
      "What would happen if management left this alone?",
    ]),
  }),
  Object.freeze({
    operation: "EVIDENCE",
    utterances: Object.freeze([
      "How do we know that?",
      "What evidence do we have?",
      "How confident are we about that?",
    ]),
  }),
  Object.freeze({
    operation: "RECOMMEND",
    utterances: Object.freeze(["What should I do?", "What would you do?", "Which one would you choose?"]),
  }),
  Object.freeze({
    operation: "COMPARE",
    utterances: Object.freeze([
      "Compare them",
      "What other options are there?",
      "Which option is safer?",
    ]),
  }),
  Object.freeze({
    operation: "INVESTIGATE",
    utterances: Object.freeze(["Is this actually worth investigating?"]),
  }),
  Object.freeze({
    operation: "STATUS",
    utterances: Object.freeze(["Where are we now?", "How are we doing on deliveries?"]),
  }),
]);

export const NLU_FUTURE_OBJECT_UTTERANCES: readonly {
  readonly utterance: string;
  readonly subjectName: string;
  readonly operation: string;
}[] = Object.freeze([
  Object.freeze({ utterance: "Show me Profit.", subjectName: "Profit", operation: "FOCUS" }),
  Object.freeze({
    utterance: "What’s happening with cash flow?",
    subjectName: "Cash Flow",
    operation: "EXPLAIN",
  }),
  Object.freeze({
    utterance: "Should I worry about loan exposure?",
    subjectName: "Loan Exposure",
    operation: "ATTENTION",
  }),
  Object.freeze({
    utterance: "What do we know about Quality?",
    subjectName: "Quality",
    operation: "EXPLAIN",
  }),
]);
