/**
 * NEX-MVP-FINAL:6.5 guidance and self-knowledge corpus.
 */

export type GuidanceTurnExpect = {
  readonly utterance: string;
  readonly require?: readonly string[];
  readonly forbid?: readonly string[];
  readonly mustNotCommit?: boolean;
  readonly mustNotExecute?: boolean;
  readonly noInternalState?: boolean;
  readonly contextSensitive?: boolean;
};

export type GuidanceDialogue = {
  readonly id: string;
  readonly category: string;
  readonly turns: readonly GuidanceTurnExpect[];
};

function d(
  id: string,
  category: string,
  turns: readonly GuidanceTurnExpect[],
): GuidanceDialogue {
  return Object.freeze({
    id,
    category,
    turns: Object.freeze(turns.map((turn) => Object.freeze(turn))),
  });
}

const CORE: readonly GuidanceDialogue[] = Object.freeze([
  d("new-1", "new-manager", [
    { utterance: "Hi." },
    { utterance: "What can you do?", require: ["goal"], forbid: ["MO:1", "EI:4"] },
    { utterance: "How do I use Nexora?", require: ["improve"], forbid: ["SHOW OBJECT"] },
    { utterance: "I manage delivery performance." },
    { utterance: "What do you need from me?", require: ["goal"] },
  ]),
  d("new-2", "new-manager", [
    { utterance: "What can you actually do for me?", require: ["investigate"] },
    { utterance: "How should I use Nexora?", forbid: ["SHOW OBJECT"] },
    { utterance: "I want to improve Delivery." },
    { utterance: "We're at 91%. Target is 96%." },
    { utterance: "What should I ask now?" },
  ]),
  d("exp-1", "experienced", [
    { utterance: "Show Delivery.", forbid: ["Would you like me to explain"] },
    { utterance: "Why?" },
    { utterance: "What evidence do we have?" },
    { utterance: "What are our options?" },
    { utterance: "Compare them." },
  ]),
  d("cap-1", "capability", [
    { utterance: "What can you do?", require: ["goal"], noInternalState: true },
  ]),
  d("cap-2", "capability", [
    { utterance: "Show Delivery." },
    { utterance: "What can you do?", require: ["investigate"], contextSensitive: true },
  ]),
  d("how-1", "how-to", [
    { utterance: "How do I use this?", forbid: ["Step 1"] },
  ]),
  d("ask-1", "what-to-ask", [
    { utterance: "Show Delivery." },
    { utterance: "What should I ask?", forbid: ["SHOW OBJECT"] },
  ]),
  d("ex-1", "examples", [
    { utterance: "Give me examples.", require: ["Try"] },
  ]),
  d("next-1", "next", [
    { utterance: "Show Delivery." },
    { utterance: "What should I do next?" },
  ]),
  d("next-2", "next", [
    { utterance: "Show Delivery." },
    { utterance: "Now what?" },
  ]),
  d("where-1", "where", [
    { utterance: "Show Delivery." },
    { utterance: "Where are we?", noInternalState: true, forbid: ["READY_FOR"] },
  ]),
  d("done-1", "progress", [
    { utterance: "Show Delivery." },
    { utterance: "What have we done?" },
  ]),
  d("left-1", "remaining", [
    { utterance: "Show Delivery." },
    { utterance: "What is left?" },
  ]),
  d("need-1", "need-info", [
    { utterance: "What information do you need?" },
  ]),
  d("know-1", "know", [
    { utterance: "Show Delivery." },
    { utterance: "What do you know about Delivery?", forbid: ["I can help you define the goal"] },
  ]),
  d("unk-1", "dont-know", [
    { utterance: "Show Delivery." },
    { utterance: "What don't we know yet?" },
  ]),
  d("inv-1", "investigate", [
    { utterance: "Show Delivery." },
    { utterance: "What can we investigate?" },
  ]),
  d("opt-1", "options", [
    { utterance: "What options do we have?", require: ["options"] },
  ]),
  d("opt-2", "options", [
    { utterance: "Show Delivery." },
    { utterance: "Can you compare them yet?" },
  ]),
  d("dec-1", "decide", [
    { utterance: "Can you help me decide?", require: ["decision"] },
  ]),
  d("you-1", "you-decide", [
    { utterance: "You decide.", mustNotCommit: true, forbid: ["I'll decide"] },
  ]),
  d("do-1", "do-it", [
    { utterance: "Just handle it.", mustNotCommit: true, mustNotExecute: true },
  ]),
  d("start-1", "start", [
    { utterance: "Start.", mustNotExecute: true, require: ["decision"] },
  ]),
  d("start-2", "start", [
    { utterance: "Can you start it?", mustNotExecute: true },
  ]),
  d("mon-1", "monitor", [
    { utterance: "Can you monitor this?", forbid: ["I'll monitor this continuously", "24/7"] },
  ]),
  d("fic-1", "fiction", [
    { utterance: "Can you send this email?", forbid: ["I'll send"], require: ["can't"] },
  ]),
  d("fic-2", "fiction", [
    { utterance: "Can you update our ERP?", forbid: ["I'll update"] },
  ]),
  d("fic-3", "fiction", [
    { utterance: "Can you call the supplier?", forbid: ["calling"] },
  ]),
  d("fic-4", "fiction", [
    { utterance: "Can you monitor this 24/7?", forbid: ["I'll monitor this 24"] },
  ]),
  d("fic-5", "fiction", [
    { utterance: "Can you guarantee next quarter's revenue?", forbid: ["guarantee"] },
  ]),
  d("fic-6", "fiction", [
    { utterance: "Can you automatically approve this?", mustNotCommit: true },
  ]),
  d("part-1", "partial", [
    { utterance: "Can you forecast next quarter?", require: ["scenario"] },
  ]),
  d("part-2", "partial", [
    { utterance: "Predict exactly when Delivery will recover.", forbid: ["will recover on"] },
  ]),
  d("stuck-1", "stuck", [
    { utterance: "Show Delivery." },
    { utterance: "Okay." },
  ]),
  d("rej-1", "reject", [
    { utterance: "Show Delivery." },
    { utterance: "What should I do next?" },
    { utterance: "No, show Risk." },
  ]),
  d("alt-1", "alternative", [
    { utterance: "Show Delivery." },
    { utterance: "What else could I do?" },
  ]),
  d("why-1", "why-next", [
    { utterance: "Show Delivery." },
    { utterance: "What should I investigate first?" },
    { utterance: "Why?" },
  ]),
  d("did-1", "decision-state", [
    { utterance: "Did we decide?", forbid: ["READY_FOR"] },
  ]),
  d("doing-1", "execution-state", [
    { utterance: "Are we doing it?", mustNotExecute: true },
  ]),
  d("corr-1", "correction", [
    { utterance: "Show Delivery." },
    { utterance: "Show Capacity." },
    { utterance: "No, I meant Risk." },
  ]),
  d("clar-1", "clarification", [
    { utterance: "Show Delivery." },
    { utterance: "Show Capacity." },
    { utterance: "Explain that." },
  ]),
  d("syn-1", "synthetic", [
    { utterance: "Can you help me understand Profit?" },
  ]),
  d("syn-2", "synthetic", [
    { utterance: "What can we investigate about Quality?" },
  ]),
  d("unseen-1", "unseen", [
    { utterance: "What are you useful for?", require: ["goal"] },
  ]),
  d("unseen-2", "unseen", [
    { utterance: "How should I work with you?" },
  ]),
  d("unseen-3", "unseen", [
    { utterance: "Show Delivery." },
    { utterance: "Where do we go from here?" },
  ]),
  d("unseen-4", "unseen", [
    { utterance: "What would be smart to look at next?" },
  ]),
  d("unseen-5", "unseen", [
    { utterance: "What can we actually do at this point?" },
  ]),
  d("unseen-6", "unseen", [
    { utterance: "What's missing before we can decide?" },
  ]),
  d("unseen-7", "unseen", [
    { utterance: "Show Delivery." },
    { utterance: "Where have we got to?", noInternalState: true },
  ]),
  d("unseen-8", "unseen", [
    { utterance: "Show Delivery." },
    { utterance: "What haven't we figured out yet?" },
  ]),
  d("act-1", "unsafe", [
    { utterance: "Act now?", mustNotExecute: true, mustNotCommit: true },
  ]),
  d("miss-1", "prerequisite", [
    { utterance: "Compare them." },
  ]),
  d("miss-2", "prerequisite", [
    { utterance: "Did it work?" },
  ]),
  d("post-d", "post-decision", [
    { utterance: "Show Delivery." },
    { utterance: "Did we decide?" },
    { utterance: "What should I do next?" },
  ]),
  d("post-e", "post-execution", [
    { utterance: "Are we doing it now?" },
    { utterance: "What should I watch next?" },
  ]),
  d("post-o", "post-outcome", [
    { utterance: "Delivery is now 94%." },
    { utterance: "Did it work?" },
  ]),
  d("post-l", "post-learning", [
    { utterance: "What did we learn?" },
    { utterance: "What should I do next?" },
  ]),
  d("ctx-e", "context-help", [{ utterance: "What can you do?" }]),
  d("ctx-d", "context-help", [
    { utterance: "Show Delivery." },
    { utterance: "Why is Delivery below target?" },
    { utterance: "What can you do?" },
  ]),
  d("how-2", "how-to", [
    { utterance: "How should I use Nexora?", forbid: ["SHOW OBJECT", "EXPLAIN OBJECT"] },
  ]),
]);

function extras(): readonly GuidanceDialogue[] {
  const rows: GuidanceDialogue[] = [];
  const prompts: readonly (readonly [string, string, string])[] = [
    ["x1", "capability", "What are you able to help with here?"],
    ["x2", "capability", "How can you help?"],
    ["x3", "how-to", "How should I use this?"],
    ["x4", "next", "What next?"],
    ["x5", "next", "What's next?"],
    ["x6", "where", "Where are we now?"],
    ["x7", "need-info", "What do you need?"],
    ["x8", "need-info", "What's missing?"],
    ["x9", "investigate", "What should I investigate first?"],
    ["x10", "options", "What are my options?"],
    ["x11", "decide", "Can you help me make this decision?"],
    ["x12", "do-it", "Do it for me."],
    ["x13", "monitor", "Can you monitor it?"],
    ["x14", "fiction", "Can you send an email?"],
    ["x15", "fiction", "Can you change the ERP?"],
    ["x16", "partial", "Can you predict exact revenue next year?"],
    ["x17", "examples", "Give me example questions."],
    ["x18", "ask", "What should I ask?"],
    ["x19", "progress", "What have we done so far?"],
    ["x20", "remaining", "What is still open?"],
  ];
  for (const [id, category, utterance] of prompts) {
    rows.push(
      d(id, category, [
        { utterance: "Show Delivery." },
        {
          utterance,
          mustNotCommit: true,
          mustNotExecute: true,
          noInternalState: true,
          forbid: ["MO:", "EI:", "CC:", "READY_FOR"],
        },
      ]),
    );
  }
  for (let i = 0; i < 30; i += 1) {
    rows.push(
      d(`pad-${i}`, "pad", [
        { utterance: "Show Delivery." },
        { utterance: i % 2 === 0 ? "What should I do next?" : "Where are we?", noInternalState: true },
        { utterance: i % 3 === 0 ? "What don't we know yet?" : "What is left?" },
        { utterance: "What can you do?" },
      ]),
    );
  }
  return Object.freeze(rows);
}

export const GUIDANCE_CERTIFICATION_DIALOGUES: readonly GuidanceDialogue[] = Object.freeze([
  ...CORE,
  ...extras(),
]);

export const PROACTIVE_SHOULD: readonly GuidanceDialogue[] = Object.freeze([
  d("p-yes-1", "proactive-yes", [
    { utterance: "Show Delivery." },
    { utterance: "We're at 91%." },
    { utterance: "Now what?" },
  ]),
  d("p-yes-2", "proactive-yes", [
    { utterance: "Show Delivery." },
    { utterance: "Okay." },
  ]),
]);

export const PROACTIVE_SHOULD_NOT: readonly GuidanceDialogue[] = Object.freeze([
  d("p-no-1", "proactive-no", [
    { utterance: "Show Delivery.", forbid: ["Would you like me"] },
  ]),
  d("p-no-2", "proactive-no", [
    { utterance: "Show Delivery." },
    { utterance: "Show Capacity." },
    { utterance: "Explain that." },
  ]),
]);

export function countGuidanceTurns(): number {
  return GUIDANCE_CERTIFICATION_DIALOGUES.reduce(
    (sum, dialogue) => sum + dialogue.turns.length,
    0,
  );
}
