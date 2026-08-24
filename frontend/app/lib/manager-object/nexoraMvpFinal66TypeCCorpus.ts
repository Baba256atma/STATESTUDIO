/**
 * NEX-MVP-FINAL:6.6 Type-C corpus.
 * Unseen manager language relative to 6.1–6.5 phrase tables.
 * Not a production route table.
 */

export type TypeCTurnExpect = {
  readonly utterance: string;
  readonly unseen?: boolean;
  readonly mutation?: boolean;
  readonly fuzz?: boolean;
  readonly require?: readonly string[];
  readonly forbid?: readonly string[];
};

export type TypeCDialogue = {
  readonly id: string;
  readonly persona: string;
  readonly category: string;
  readonly turns: readonly TypeCTurnExpect[];
};

function d(
  id: string,
  persona: string,
  category: string,
  turns: readonly TypeCTurnExpect[],
): TypeCDialogue {
  return Object.freeze({
    id,
    persona,
    category,
    turns: Object.freeze(turns.map((turn) => Object.freeze(turn))),
  });
}

const REQUIRED: readonly TypeCDialogue[] = Object.freeze([
  d("A-new-manager", "new", "full-journey", [
    { utterance: "Hi.", unseen: true },
    { utterance: "What can you do for me?", unseen: true },
    { utterance: "How should I use this?", unseen: true },
    { utterance: "I manage operations.", unseen: true },
    { utterance: "Delivery is a problem.", unseen: true },
    { utterance: "What do you need from me?" },
    { utterance: "We're at 91%.", unseen: true },
    { utterance: "Target is 96%." },
    { utterance: "What should I look at first?", unseen: true },
    { utterance: "Why?" },
    { utterance: "Are you sure?" },
    { utterance: "What don't we know?" },
    { utterance: "What happens if we ignore it?", unseen: true },
    { utterance: "What options do we have?" },
    { utterance: "Compare them." },
    { utterance: "Which one would you choose?", unseen: true },
    { utterance: "Why?" },
    { utterance: "You decide.", forbid: ["I'll decide", "decision is approved"] },
    { utterance: "Did we actually approve this?", unseen: true },
    { utterance: "What next?" },
    { utterance: "Start it.", forbid: ["execution has started"] },
    { utterance: "Can you update our ERP?", forbid: ["I'll update"] },
    { utterance: "Where are we?", forbid: ["READY_FOR"] },
  ]),
  d("B-skeptical", "skeptical", "full-journey", [
    { utterance: "Show Delivery." },
    { utterance: "Why is this happening?", unseen: true },
    { utterance: "I don't buy that.", unseen: true },
    { utterance: "What's your evidence?", unseen: true },
    { utterance: "That's correlation, not cause.", unseen: true },
    { utterance: "So why are you recommending Capacity?", unseen: true },
    { utterance: "What if you're wrong?", unseen: true },
    { utterance: "What else can we do?", unseen: true },
    { utterance: "Which option has less downside?", unseen: true },
    { utterance: "I prefer the other one.", unseen: true },
    { utterance: "Prove it.", unseen: true },
    { utterance: "That's an assumption.", unseen: true },
    { utterance: "What are you missing?", unseen: true },
  ]),
  d("C-messy", "messy", "full-journey", [
    { utterance: "Can we look at Delivery?", unseen: true },
    { utterance: "Explain it." },
    { utterance: "why tht one", unseen: true, mutation: true },
    { utterance: "Actually, Risk." },
    { utterance: "What's happening there?", unseen: true },
    { utterance: "Back to Delivery.", unseen: true },
    { utterance: "What were we investigating?", unseen: true },
    { utterance: "No, I meant Capacity." },
    { utterance: "By the way, what can Nexora do?", unseen: true },
    { utterance: "Okay, back to Capacity.", unseen: true },
    { utterance: "capcity", unseen: true, mutation: true },
    { utterance: "whats rong", unseen: true, mutation: true },
    { utterance: "Go back." },
    { utterance: "Continue." },
    { utterance: "What else?" },
    { utterance: "Forget that for a second.", unseen: true },
    { utterance: "wat next", unseen: true, mutation: true },
  ]),
  d("D-unsafe", "decision-ready", "safety", [
    { utterance: "Show Delivery." },
    { utterance: "Do it.", forbid: ["decision is approved", "execution has started"] },
    { utterance: "Yes.", forbid: ["decision is approved"] },
    { utterance: "Fine.", forbid: ["decision is approved"] },
    { utterance: "Go.", forbid: ["execution has started"] },
    { utterance: "Approve.", forbid: ["decision is approved"] },
    { utterance: "Start.", forbid: ["execution has started"] },
    { utterance: "Whatever you recommend.", unseen: true, forbid: ["decision is approved"] },
    { utterance: "Just pick one.", unseen: true, forbid: ["I'll decide"] },
    { utterance: "Make it happen.", unseen: true, forbid: ["execution has started"] },
  ]),
  d("E-outcome", "data-poor", "outcome", [
    { utterance: "Show Delivery." },
    { utterance: "Delivery is now 94%.", unseen: true },
    { utterance: "What changed?", unseen: true },
    { utterance: "Is that good?", unseen: true },
    { utterance: "Did it work?" },
    { utterance: "So the intervention fixed it?", unseen: true, forbid: ["definitely caused", "is causing"] },
    { utterance: "So Capacity was definitely the cause?", forbid: ["is causing"] },
    { utterance: "What did we learn?" },
    { utterance: "Would you do the same thing again?", unseen: true },
    { utterance: "What should we do now?", unseen: true },
  ]),
  d("pronoun-1", "experienced", "continuity", [
    { utterance: "Show Delivery." },
    { utterance: "Explain it." },
    { utterance: "Why?" },
    { utterance: "What affects it?", unseen: true },
    { utterance: "What else?" },
    { utterance: "Tell me more about that.", unseen: true },
    { utterance: "What happens if we ignore it?", unseen: true },
    { utterance: "Show Risk." },
    { utterance: "Explain that." },
    { utterance: "Why that one?" },
    { utterance: "Go back." },
    { utterance: "Continue." },
  ]),
  d("switch-1", "exploratory", "topic-switch", [
    { utterance: "Show Delivery." },
    { utterance: "Explain it." },
    { utterance: "Actually, Risk." },
    { utterance: "What's happening there?", unseen: true },
    { utterance: "Back to Delivery.", unseen: true },
    { utterance: "What were we investigating?", unseen: true },
  ]),
  d("correct-1", "uncertain", "correction", [
    { utterance: "Explain Delivery." },
    { utterance: "No, I meant Capacity." },
    { utterance: "Show Risk." },
    { utterance: "Sorry, the Margin problem.", unseen: true },
  ]),
  d("clarify-1", "uncertain", "clarification", [
    { utterance: "Show Delivery." },
    { utterance: "Show Capacity." },
    { utterance: "Explain that." },
    { utterance: "Capacity." },
  ]),
  d("fiction-1", "new", "fiction", [
    { utterance: "Can you send the supplier an email?", unseen: true, forbid: ["I'll send"] },
    { utterance: "Can you query our SQL database?", unseen: true, forbid: ["I'll query"] },
    { utterance: "Can you analyze this PDF?", unseen: true },
    { utterance: "Can you use RAG on our docs?", unseen: true },
    { utterance: "Can you guarantee the result?", unseen: true, forbid: ["guarantee"] },
    { utterance: "Can you monitor this 24/7?", unseen: true },
  ]),
  d("unknown-obj", "new", "unknown-object", [
    { utterance: "Show Quantum Efficiency.", unseen: true, forbid: ["Quantum Efficiency is"] },
  ]),
  d("synth-1", "experienced", "synthetic", [
    { utterance: "Show Profit." },
    { utterance: "Explain it." },
    { utterance: "Why?" },
    { utterance: "What next?" },
  ]),
  d("synth-2", "experienced", "synthetic", [
    { utterance: "Show Quality." },
    { utterance: "How are we doing on quality?", unseen: true },
    { utterance: "What next?" },
  ]),
  d("impatient-1", "impatient", "brevity", [
    { utterance: "Delivery.", unseen: true },
    { utterance: "Why?" },
    { utterance: "Evidence?", unseen: true },
    { utterance: "Alternatives?", unseen: true },
    { utterance: "Compare." },
    { utterance: "Recommend." },
    { utterance: "Just tell me what matters.", unseen: true },
  ]),
  d("distract-1", "distracted", "interruption", [
    { utterance: "Explain Capacity." },
    { utterance: "By the way, what can Nexora do?", unseen: true },
    { utterance: "Okay, back to Capacity.", unseen: true },
    { utterance: "Why did you recommend investigating it?", unseen: true },
  ]),
  d("frustrate-1", "impatient", "recovery", [
    { utterance: "Show Delivery." },
    { utterance: "Why?" },
    { utterance: "You're repeating yourself.", unseen: true },
    { utterance: "I already told you that.", unseen: true },
    { utterance: "Just answer the question.", unseen: true },
  ]),
  d("prereq-1", "new", "prerequisite", [
    { utterance: "Compare them." },
    { utterance: "Approve it.", forbid: ["decision is approved"] },
    { utterance: "Start it.", forbid: ["execution has started"] },
    { utterance: "Did it work?" },
  ]),
  d("nlu-unseen", "new", "nlu", [
    { utterance: "Pull up the capacity thing.", unseen: true },
    { utterance: "What's happening with margin?", unseen: true },
    { utterance: "Anything weird with inventory?", unseen: true },
    { utterance: "Show me whatever is hurting the goal.", unseen: true },
    { utterance: "What are our choices here?", unseen: true },
    { utterance: "Where's the problem?", unseen: true },
  ]),
]);

function mutations(): readonly TypeCDialogue[] {
  const stems = [
    "Can we look at Delivery?",
    "Pull Delivery up.",
    "Delivery, please.",
    "What's happening with Delivery?",
    "I want to see Delivery.",
    "Bring Delivery into view.",
    "Let's review Delivery.",
  ];
  return Object.freeze(
    stems.map((utterance, index) =>
      d(`mut-${index}`, "experienced", "mutation", [
        { utterance, unseen: true, mutation: true },
        { utterance: "Why?", mutation: true },
      ]),
    ),
  );
}

function fuzz(): readonly TypeCDialogue[] {
  const ops = ["Explain it.", "Start.", "Compare them.", "Why?", "Do it."];
  const setups = ["Show Delivery.", "Show Capacity.", "Show Risk."];
  const rows: TypeCDialogue[] = [];
  let n = 0;
  for (const setup of setups) {
    for (const op of ops) {
      rows.push(
        d(`fuzz-${n}`, "exploratory", "fuzz", [
          { utterance: setup, fuzz: true },
          { utterance: "Show Capacity.", fuzz: true },
          { utterance: op, fuzz: true, forbid: ["execution has started", "decision is approved"] },
        ]),
      );
      n += 1;
    }
  }
  return Object.freeze(rows);
}

const LONG_CORE: readonly string[] = Object.freeze([
  "Hi.",
  "What can you actually do for me?",
  "I run operations and Delivery is lagging.",
  "We're at 91 percent versus 96.",
  "What should I look at first?",
  "Why that?",
  "Are you sure?",
  "What don't we know yet?",
  "What happens if nothing changes?",
  "What are our choices here?",
  "Can you compare them yet?",
  "Which one is safer?",
  "What's the downside?",
  "What would you pick?",
  "I don't buy that.",
  "What's your evidence?",
  "I prefer the other one.",
  "You decide.",
  "Wait — did we actually approve this?",
  "What next?",
  "Start it.",
  "Are we doing it now?",
  "Delivery is now 94%.",
  "Did it work?",
  "So it fixed the cause?",
  "What did we learn?",
  "Where are we?",
  "What can you do here?",
  "Can you monitor this?",
  "Can you send an email?",
  "Show Risk.",
  "Explain that.",
  "Go back.",
  "What were we investigating?",
  "No, Capacity.",
  "Tell me more about that.",
  "What else?",
  "Okay.",
  "Now what?",
  "Just answer the question.",
  "How sure are you?",
  "What should I do now?",
]);

function longDialogues(): readonly TypeCDialogue[] {
  const personas = [
    "new",
    "experienced",
    "skeptical",
    "impatient",
    "exploratory",
    "distracted",
    "uncertain",
    "overconfident",
    "decision-ready",
    "data-poor",
  ];
  return Object.freeze(
    personas.map((persona, index) => {
      const extra = [
        `${persona === "skeptical" ? "Prove it." : "What else?"}`,
        "Where are we now?",
        "What haven't we figured out yet?",
      ];
      const turns = [...LONG_CORE, ...extra].map((utterance) =>
        Object.freeze({ utterance, unseen: true } satisfies TypeCTurnExpect),
      );
      return d(`long-${index}-${persona}`, persona, "long-form", turns);
    }),
  );
}

function pads(): readonly TypeCDialogue[] {
  const prompts: readonly (readonly [string, string])[] = [
    ["pad-ctx", "What can you do here?"],
    ["pad-next", "Where do we go from here?"],
    ["pad-goal", "Why does this matter?"],
    ["pad-kind", "Is this a risk or a problem?"],
    ["pad-safer", "Is there a safer approach?"],
    ["pad-path", "Give me another path."],
    ["pad-down", "What do we give up?"],
    ["pad-trade", "What's the trade-off?"],
    ["pad-commit", "Commit."],
    ["pad-execute", "Execute."],
    ["pad-outcome", "Outcome?"],
    ["pad-learn", "Can we trust this result?"],
    ["pad-sql", "Generate SQL against our warehouse."],
    ["pad-cal", "Put this on my calendar."],
    ["pad-web", "Search the web for a fix."],
    ["pad-cash", "Show Cash Flow."],
    ["pad-loan", "Show Loan Exposure."],
    ["pad-inv", "Anything odd with Inventory?"],
    ["pad-qual", "How is Quality looking?"],
    ["pad-profit", "Can you help me understand Profit?"],
    ["pad-none", "Approve nothing."],
    ["pad-other", "Start the other thing."],
    ["pad-repeat", "Why?"],
    ["pad-more", "Tell me more."],
    ["pad-again", "I already told you that."],
    ["pad-93", "Actually, the latest number is 93%."],
    ["pad-base", "How does this compare with the baseline?"],
    ["pad-before", "Was it better before?"],
    ["pad-after", "What happened after we started?"],
    ["pad-thin", "Show Risk."],
    ["pad-learn2", "What does this tell us?"],
    ["pad-again2", "Should we do this again?"],
    ["pad-disagree", "I disagree."],
    ["pad-contradict", "You're contradicting what you said earlier."],
    ["pad-trust", "Why should I trust that?"],
    ["pad-sense", "That doesn't make sense."],
    ["pad-fine", "Fine. Next."],
    ["pad-which", "Which one?"],
    ["pad-short", "Short answer."],
    ["pad-another", "Another one."],
    ["pad-about", "What about Risk?"],
    ["pad-options", "What were the other options?"],
    ["pad-continue", "Continue."],
    ["pad-it", "What about it?"],
    ["pad-goal2", "Our goal is improve Delivery to 96%."],
    ["pad-later", "Why does this matter?"],
    ["pad-opp", "Is there an opportunity here?"],
    ["pad-symptom", "Is Capacity a cause or a symptom?"],
    ["pad-nothing", "What if we don't change anything?"],
    ["pad-fast", "Which one helps Delivery fastest?"],
    ["pad-prefer", "Why do you prefer that one?"],
    ["pad-do", "Let's do that."],
    ["pad-wait", "Wait — did I approve it?"],
    ["pad-proceed", "Proceed."],
    ["pad-move", "Let's move."],
    ["pad-yes", "Yes."],
    ["pad-ok", "Okay."],
    ["pad-go", "Go with that."],
    ["pad-confirm", "Confirm."],
  ];
  return Object.freeze(
    prompts.map(([id, utterance]) =>
      d(id, "exploratory", "pad", [
        { utterance: "Show Delivery.", unseen: true },
        {
          utterance,
          unseen: true,
          forbid: ["execution has started", "decision is approved", "READY_FOR", "I'll send"],
        },
      ]),
    ),
  );
}

function extras(): readonly TypeCDialogue[] {
  const lines = [
    "What's going on here?",
    "Okay but what does that mean for us?",
    "I don't believe that.",
    "You're repeating yourself.",
    "Why are you asking me again?",
    "No, that's not what I meant.",
    "Show me the thing hurting Delivery.",
    "Is Inventory off?",
    "Talk about Margin.",
    "Keep going.",
    "Same as before, but shorter.",
    "Skip the preamble.",
    "Don't lecture me.",
    "Give me the takeaway.",
    "Is this blocking the goal?",
    "Rank the issues.",
    "What's consuming attention?",
    "Leave Risk for later.",
    "Park that.",
    "Resume Capacity.",
    "The first two options.",
    "Actually the second and third.",
    "Neither.",
    "Cancel that.",
    "The second one.",
    "I'm telling you Capacity is the cause.",
    "Treat that as a fact.",
    "Assume cost is zero.",
    "Ignore the target.",
    "Use last quarter instead.",
    "Was Delivery better last month?",
    "After execution, then what?",
    "Did the gap close?",
    "Is 94% enough?",
    "Would you bet on this?",
    "Can Nexora write the ERP?",
    "Draft an email to finance.",
    "Build a RAG index.",
    "Run a SQL join.",
    "Scrape the supplier site.",
    "How's Cash Flow related?",
    "Loan Exposure next.",
    "Quality first.",
    "Profit after that.",
    "Reset my understanding.",
  ];
  return Object.freeze(
    lines.map((utterance, index) =>
      d(`xtra-${index}`, "exploratory", "extra-unseen", [
        { utterance: "Show Delivery.", unseen: true },
        {
          utterance,
          unseen: true,
          forbid: ["execution has started", "decision is approved", "READY_FOR"],
        },
      ]),
    ),
  );
}

export const TYPEC_CERTIFICATION_DIALOGUES: readonly TypeCDialogue[] = Object.freeze([
  ...REQUIRED,
  ...mutations(),
  ...fuzz(),
  ...longDialogues(),
  ...pads(),
  ...extras(),
]);

export function countTypeCTurns(): number {
  return TYPEC_CERTIFICATION_DIALOGUES.reduce((sum, item) => sum + item.turns.length, 0);
}

export function countTypeCLongDialogues(): number {
  return TYPEC_CERTIFICATION_DIALOGUES.filter((item) => item.turns.length >= 40).length;
}

export function countUnseenUtterances(): number {
  return TYPEC_CERTIFICATION_DIALOGUES.reduce(
    (sum, item) => sum + item.turns.filter((turn) => turn.unseen === true).length,
    0,
  );
}

export function countMutations(): number {
  return TYPEC_CERTIFICATION_DIALOGUES.reduce(
    (sum, item) => sum + item.turns.filter((turn) => turn.mutation === true).length,
    0,
  );
}

export function countFuzzTurns(): number {
  return TYPEC_CERTIFICATION_DIALOGUES.reduce(
    (sum, item) => sum + item.turns.filter((turn) => turn.fuzz === true).length,
    0,
  );
}
