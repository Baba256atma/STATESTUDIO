export type NexoraLoopType =
  | "reinforcing"
  | "balancing"
  | "risk_cascade"
  | "constraint"
  | "buffer_recovery"
  | "pressure"
  | "strategic_response";

export type NexoraLoopPolarity = "positive" | "negative" | "mixed";

export type NexoraLoopStrength = "low" | "medium" | "high" | "critical";

export interface NexoraLoopEdge {
  from: string;
  to: string;
  relationType?: string;
  weight?: number;
  label?: string;
}

export interface NexoraLoopMeta {
  type: NexoraLoopType;
  polarity: NexoraLoopPolarity;
  strength?: NexoraLoopStrength;
  label: string;
  description?: string;
  domain?: string;
  tags?: string[];
  riskWeight?: number;
}

export interface NexoraLoop {
  id: string;
  label: string;
  type: NexoraLoopType;
  polarity: NexoraLoopPolarity;
  strength?: NexoraLoopStrength;
  nodes: string[];
  edges: NexoraLoopEdge[];
  domain?: string;
  tags?: string[];
  meta?: NexoraLoopMeta;
}

export const CORE_LOOP_TYPES: NexoraLoopType[] = [
  "reinforcing",
  "balancing",
  "risk_cascade",
  "constraint",
  "buffer_recovery",
  "pressure",
  "strategic_response",
];

export const CORE_LOOP_TYPE_INFO: Record<NexoraLoopType, string> = {
  reinforcing: "A self-amplifying loop that strengthens system movement over time.",
  balancing: "A stabilizing loop that resists deviation and restores equilibrium.",
  risk_cascade: "A propagation loop where disruption spreads through dependent nodes.",
  constraint: "A limiting loop driven by bottlenecks, scarcity, or structural restrictions.",
  buffer_recovery: "A resilience loop where reserves or buffers absorb pressure and recover capacity.",
  pressure: "A loop where accumulating stress feeds back into operational or strategic strain.",
  strategic_response: "A loop where decisions or interventions reshape the system response.",
};

const RISK_LOOP_TYPES: ReadonlySet<NexoraLoopType> = new Set([
  "risk_cascade",
  "pressure",
  "constraint",
]);

const STABILIZING_LOOP_TYPES: ReadonlySet<NexoraLoopType> = new Set([
  "balancing",
  "buffer_recovery",
  "strategic_response",
]);

const AMPLIFYING_LOOP_TYPES: ReadonlySet<NexoraLoopType> = new Set([
  "reinforcing",
  "risk_cascade",
  "pressure",
]);

const LOOP_TYPE_KEYWORDS: Array<{ type: NexoraLoopType; terms: string[] }> = [
  { type: "risk_cascade", terms: ["risk", "cascade", "failure", "spread", "propagation", "disruption"] },
  { type: "constraint", terms: ["constraint", "limit", "capacity", "bottleneck", "scarcity", "restriction"] },
  { type: "buffer_recovery", terms: ["buffer", "reserve", "recovery", "absorb", "resilience", "replenish"] },
  { type: "pressure", terms: ["pressure", "stress", "strain", "load", "burn", "squeeze"] },
  { type: "strategic_response", terms: ["strategy", "response", "intervention", "mitigation", "decision", "action"] },
  { type: "balancing", terms: ["balance", "stability", "equilibrium", "stabilize", "counterweight", "restore"] },
  { type: "reinforcing", terms: ["growth", "amplify", "reinforce", "feedback", "momentum", "escalate"] },
];

function normalizeText(value: string): string {
  return value.toLowerCase().trim();
}

function tokenize(value: string): string[] {
  return normalizeText(value)
    .split(/[^a-z0-9]+/g)
    .map((token) => token.trim())
    .filter(Boolean);
}

function uniq(values: string[]): string[] {
  return Array.from(new Set(values.map((value) => String(value).trim()).filter(Boolean)));
}

function scoreTerms(haystack: string[], terms: string[]): number {
  let score = 0;

  for (const term of terms) {
    const normalizedTerm = normalizeText(term);
    if (!normalizedTerm) continue;

    if (normalizedTerm.includes(" ")) {
      const phraseTokens = tokenize(normalizedTerm);
      if (phraseTokens.length > 0 && phraseTokens.every((token) => haystack.includes(token))) {
        score += 3;
      }
      continue;
    }

    if (haystack.includes(normalizedTerm)) {
      score += 2;
    }
  }

  return score;
}

function normalizeEdge(input: Partial<NexoraLoopEdge>): NexoraLoopEdge | null {
  const from = String(input.from ?? "").trim();
  const to = String(input.to ?? "").trim();
  if (!from || !to) return null;

  const edge: NexoraLoopEdge = {
    from,
    to,
  };

  if (typeof input.relationType === "string" && input.relationType.trim()) {
    edge.relationType = input.relationType.trim();
  }
  if (Number.isFinite(Number(input.weight))) {
    edge.weight = Number(input.weight);
  }
  if (typeof input.label === "string" && input.label.trim()) {
    edge.label = input.label.trim();
  }

  return edge;
}

export function getLoopTypeDescription(type: NexoraLoopType): string {
  return CORE_LOOP_TYPE_INFO[type];
}

export function isRiskLoop(type: NexoraLoopType): boolean {
  return RISK_LOOP_TYPES.has(type);
}

export function isStabilizingLoop(type: NexoraLoopType): boolean {
  return STABILIZING_LOOP_TYPES.has(type);
}

export function isAmplifyingLoop(type: NexoraLoopType): boolean {
  return AMPLIFYING_LOOP_TYPES.has(type);
}

export function classifyLoopType(args: {
  label?: string;
  tags?: string[];
  description?: string;
}): NexoraLoopType {
  const haystack = uniq([
    ...tokenize(args.label ?? ""),
    ...tokenize(args.description ?? ""),
    ...(Array.isArray(args.tags) ? args.tags.flatMap((tag) => tokenize(String(tag))) : []),
  ]);

  let bestType: NexoraLoopType = "reinforcing";
  let bestScore = 0;

  for (const entry of LOOP_TYPE_KEYWORDS) {
    const score = scoreTerms(haystack, entry.terms);
    if (score > bestScore) {
      bestType = entry.type;
      bestScore = score;
    }
  }

  return bestScore > 0 ? bestType : "reinforcing";
}

export function inferLoopPolarity(type: NexoraLoopType): NexoraLoopPolarity {
  switch (type) {
    case "reinforcing":
      return "positive";
    case "balancing":
      return "negative";
    case "risk_cascade":
      return "positive";
    case "constraint":
      return "negative";
    case "buffer_recovery":
      return "negative";
    case "pressure":
      return "positive";
    case "strategic_response":
      return "mixed";
    default:
      return "positive";
  }
}

export function normalizeLoop(input: Partial<NexoraLoop> & { id: string; label?: string }): NexoraLoop {
  const id = String(input.id).trim();
  const label = String(input.label ?? id).trim() || id;
  const type = input.type ?? "reinforcing";
  const polarity = input.polarity ?? inferLoopPolarity(type);
  const nodes = uniq((Array.isArray(input.nodes) ? input.nodes : []).map((node) => String(node)));
  const edges = (Array.isArray(input.edges) ? input.edges : [])
    .map((edge) => normalizeEdge(edge))
    .filter((edge): edge is NexoraLoopEdge => edge !== null);

  const normalized: NexoraLoop = {
    id,
    label,
    type,
    polarity,
    nodes,
    edges,
  };

  if (input.strength) {
    normalized.strength = input.strength;
  }
  if (typeof input.domain === "string" && input.domain.trim()) {
    normalized.domain = input.domain.trim();
  }
  if (Array.isArray(input.tags)) {
    normalized.tags = uniq(input.tags.map((tag) => String(tag)));
  }
  if (input.meta) {
    normalized.meta = {
      type: input.meta.type ?? type,
      polarity: input.meta.polarity ?? polarity,
      label: String(input.meta.label ?? label).trim() || label,
      ...(input.meta.strength ? { strength: input.meta.strength } : {}),
      ...(typeof input.meta.description === "string" && input.meta.description.trim()
        ? { description: input.meta.description.trim() }
        : {}),
      ...(typeof input.meta.domain === "string" && input.meta.domain.trim()
        ? { domain: input.meta.domain.trim() }
        : {}),
      ...(Array.isArray(input.meta.tags) ? { tags: uniq(input.meta.tags.map((tag) => String(tag))) } : {}),
      ...(Number.isFinite(Number(input.meta.riskWeight)) ? { riskWeight: Number(input.meta.riskWeight) } : {}),
    };
  }

  return normalized;
}
