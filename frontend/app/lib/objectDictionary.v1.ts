export type ObjectDictionaryEntry = {
  id: string;                 // "obj_37"
  title: string;              // short label
  meaning: string;            // 1-2 line meaning
  signals: string[];          // keywords the AI might map from text
  color_hint?: string;        // optional hex color
  links?: {
    type: "cause" | "support" | "conflict";
    target: string; // object id
  }[];
};

export const CORE_14_IDS = [
  "obj_11",
  "obj_12",
  "obj_13",
  "obj_14",
  "obj_15",
  "obj_16",
  "obj_18",
  "obj_19",
  "obj_20",
  "obj_21",
  "obj_22",
  "obj_23",
  "obj_24",
  "obj_37",
] as const;

export const OBJECT_DICTIONARY_V1: Record<string, ObjectDictionaryEntry> = {
  // Core 14 (quality-first). We can expand to 49 after this set is stable.

  obj_11: {
    id: "obj_11",
    title: "North Star / Purpose",
    meaning: "Use when you need clarity on the primary direction, purpose, and the 'why' behind a decision.",
    signals: ["purpose", "north star", "vision", "why", "meaning", "mission"],
    color_hint: "#7c3aed",
    links: [
      { type: "support", target: "obj_12" },
      { type: "support", target: "obj_13" },
      { type: "support", target: "obj_20" },
    ],
  },

  obj_12: {
    id: "obj_12",
    title: "Context / Reality Check",
    meaning: "Use when the situation, constraints, data, and external conditions must be made explicit.",
    signals: ["context", "constraints", "reality", "facts", "data", "environment"],
    color_hint: "#64748b",
    links: [
      { type: "support", target: "obj_11" },
      { type: "cause", target: "obj_15" },
      { type: "support", target: "obj_22" },
    ],
  },

  obj_13: {
    id: "obj_13",
    title: "Decision / Trade-off",
    meaning: "Use when you must choose between options and accept trade-offs (cost/benefit).",
    signals: ["decide", "decision", "choose", "trade-off", "option A", "option B"],
    color_hint: "#f59e0b",
    links: [
      { type: "cause", target: "obj_11" },
      { type: "conflict", target: "obj_15" },
      { type: "support", target: "obj_21" },
    ],
  },

  obj_14: {
    id: "obj_14",
    title: "Stakeholders / Power Map",
    meaning: "Use when influence, internal politics, stakeholders, and coalitions shape the outcome.",
    signals: ["stakeholder", "power", "influence", "politics", "coalition", "alignment"],
    color_hint: "#0ea5e9",
    links: [
      { type: "support", target: "obj_13" },
      { type: "support", target: "obj_19" },
      { type: "conflict", target: "obj_23" },
    ],
  },

  obj_15: {
    id: "obj_15",
    title: "Risk / Uncertainty",
    meaning: "Use when the future is uncertain and you need to manage risks, scenarios, and probabilities.",
    signals: ["risk", "uncertainty", "unknown", "scenario", "probability", "volatility"],
    color_hint: "#ef4444",
    links: [
      { type: "conflict", target: "obj_12" },
      { type: "support", target: "obj_21" },
      { type: "cause", target: "obj_24" },
    ],
  },

  obj_16: {
    id: "obj_16",
    title: "Capacity / Resources",
    meaning: "Use when time, money, people, or energy are limited and allocation matters.",
    signals: ["capacity", "resources", "budget", "time", "team", "bandwidth"],
    color_hint: "#22c55e",
    links: [
      { type: "support", target: "obj_13" },
      { type: "cause", target: "obj_18" },
      { type: "conflict", target: "obj_08" },
    ],
  },

  // You chose obj_37 as “Growth Crisis”, so it stays in the core set.
  obj_37: {
    id: "obj_37",
    title: "Growth Crisis / Scaling Pain",
    meaning: "Use when growth outpaces structure: scaling creates bottlenecks, overload, and process breakdowns.",
    signals: ["growth", "scaling", "bottleneck", "overload", "process break", "growing pains"],
    color_hint: "#ff6b6b",
    links: [
      { type: "cause", target: "obj_16" },
      { type: "cause", target: "obj_08" },
      { type: "support", target: "obj_22" },
    ],
  },

  obj_18: {
    id: "obj_18",
    title: "System / Process",
    meaning: "Use when the issue is system design: workflow, rules, handoffs, or dependencies.",
    signals: ["process", "system", "workflow", "handoff", "dependency", "governance"],
    color_hint: "#14b8a6",
    links: [
      { type: "support", target: "obj_16" },
      { type: "conflict", target: "obj_37" },
      { type: "support", target: "obj_22" },
    ],
  },

  obj_19: {
    id: "obj_19",
    title: "Narrative / Messaging",
    meaning: "Use when you must craft or shift the narrative, framing, and messaging for an audience.",
    signals: ["narrative", "message", "story", "framing", "PR", "positioning"],
    color_hint: "#a855f7",
    links: [
      { type: "support", target: "obj_11" },
      { type: "support", target: "obj_14" },
      { type: "cause", target: "obj_23" },
    ],
  },

  obj_20: {
    id: "obj_20",
    title: "Values / Ethics",
    meaning: "Use when the decision is ethical: values, fairness, integrity, and trust are central.",
    signals: ["values", "ethics", "fair", "integrity", "principle", "trust"],
    color_hint: "#f97316",
    links: [
      { type: "support", target: "obj_11" },
      { type: "conflict", target: "obj_14" },
      { type: "support", target: "obj_23" },
    ],
  },

  obj_21: {
    id: "obj_21",
    title: "Experiment / Test",
    meaning: "Use when the best way to reduce risk is a small test, pilot, or fast learning loop.",
    signals: ["experiment", "test", "pilot", "A/B", "MVP", "hypothesis"],
    color_hint: "#22c55e",
    links: [
      { type: "support", target: "obj_13" },
      { type: "cause", target: "obj_15" },
      { type: "support", target: "obj_22" },
    ],
  },

  obj_22: {
    id: "obj_22",
    title: "Feedback / Signals",
    meaning: "Use when you need signals from data, customers, team, or market to adjust direction.",
    signals: ["feedback", "signals", "metrics", "KPIs", "customer", "learning"],
    color_hint: "#06b6d4",
    links: [
      { type: "support", target: "obj_12" },
      { type: "support", target: "obj_18" },
      { type: "support", target: "obj_21" },
    ],
  },

  obj_23: {
    id: "obj_23",
    title: "Identity / Character",
    meaning: "Use when identity matters: roles, brand, persona design, character building.",
    signals: ["identity", "character", "brand", "persona", "role", "archetype"],
    color_hint: "#ec4899",
    links: [
      { type: "support", target: "obj_19" },
      { type: "support", target: "obj_20" },
      { type: "conflict", target: "obj_24" },
    ],
  },

  obj_24: {
    id: "obj_24",
    title: "Regulation / External Pressure",
    meaning: "Use when external forces apply pressure: regulation, media, competitors, or crises.",
    signals: ["regulation", "law", "compliance", "media", "competitor", "crisis"],
    color_hint: "#475569",
    links: [
      { type: "conflict", target: "obj_12" },
      { type: "cause", target: "obj_15" },
      { type: "support", target: "obj_14" },
    ],
  },
};

export function getLinkedObjects(id: string): { entry: ObjectDictionaryEntry; type: "cause" | "support" | "conflict" }[] {
  const base = OBJECT_DICTIONARY_V1[id];
  if (!base?.links) return [];
  return base.links
    .map((l) => ({ entry: OBJECT_DICTIONARY_V1[l.target], type: l.type }))
    .filter((x) => Boolean(x.entry));
}