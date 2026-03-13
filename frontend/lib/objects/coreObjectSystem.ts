export type CoreObjectRole =
  | "source"
  | "flow"
  | "buffer"
  | "node"
  | "dependency"
  | "bottleneck"
  | "pressure"
  | "risk"
  | "constraint"
  | "outcome"
  | "kpi"
  | "objective"
  | "actor"
  | "shock";

export interface CoreObjectMeta {
  role: CoreObjectRole;
  label: string;
  description?: string;
  domain?: string;
  tags?: string[];
  riskWeight?: number;
  importance?: number;
}

export interface NexoraObject {
  id: string;
  label: string;
  role: CoreObjectRole;
  domain?: string;
  tags?: string[];
  semantic?: CoreObjectMeta;
  dependencies?: string[];
}

export const CORE_ROLES: CoreObjectRole[] = [
  "source",
  "flow",
  "buffer",
  "node",
  "dependency",
  "bottleneck",
  "pressure",
  "risk",
  "constraint",
  "outcome",
  "kpi",
  "objective",
  "actor",
  "shock",
];

export const CORE_OBJECT_ROLE_INFO: Record<CoreObjectRole, string> = {
  source: "Origin of system inputs or drivers",
  flow: "Primary movement or throughput in the system",
  buffer: "Shock absorber or reserve capacity",
  node: "Operational processing unit",
  dependency: "Critical reliance relationship",
  bottleneck: "Capacity limitation point",
  pressure: "Accumulating system stress",
  risk: "Potential failure or vulnerability node",
  constraint: "Structural or policy limitation",
  outcome: "Downstream result of system dynamics",
  kpi: "Measured performance indicator",
  objective: "Strategic target or goal",
  actor: "Decision-making entity",
  shock: "External or internal disruptive event",
};

const RISK_ROLES: ReadonlySet<CoreObjectRole> = new Set([
  "risk",
  "pressure",
  "shock",
  "dependency",
  "bottleneck",
]);

const OPERATIONAL_ROLES: ReadonlySet<CoreObjectRole> = new Set([
  "flow",
  "node",
  "buffer",
]);

const ROLE_KEYWORDS: Array<{ role: CoreObjectRole; terms: string[] }> = [
  { role: "source", terms: ["supplier", "source", "origin", "input", "feed", "upstream"] },
  { role: "flow", terms: ["flow", "pipeline", "delivery", "stream", "throughput", "fulfillment"] },
  { role: "buffer", terms: ["inventory", "reserve", "cache", "buffer", "capacity", "stock"] },
  { role: "dependency", terms: ["dependency", "integration", "reliance", "vendor", "third party"] },
  { role: "bottleneck", terms: ["bottleneck", "queue", "latency", "slowdown", "congestion"] },
  { role: "pressure", terms: ["pressure", "stress", "strain", "load", "burn"] },
  { role: "risk", terms: ["risk", "failure", "threat", "vulnerability", "incident"] },
  { role: "constraint", terms: ["constraint", "limit", "policy", "compliance", "cap"] },
  { role: "outcome", terms: ["outcome", "result", "impact", "customer", "trust"] },
  { role: "kpi", terms: ["kpi", "metric", "score", "sla", "uptime"] },
  { role: "objective", terms: ["goal", "target", "mission", "objective", "priority"] },
  { role: "actor", terms: ["actor", "team", "competitor", "owner", "partner"] },
  { role: "shock", terms: ["shock", "disruption", "outage", "event", "crisis"] },
];

function normalizeTerm(value: string): string {
  return value.toLowerCase().trim();
}

function tokenize(value: string): string[] {
  return normalizeTerm(value)
    .split(/[^a-z0-9]+/g)
    .map((token) => token.trim())
    .filter(Boolean);
}

function scoreTerms(haystack: string[], terms: string[]): number {
  let score = 0;

  for (const term of terms) {
    const normalized = normalizeTerm(term);
    if (!normalized) continue;

    if (normalized.includes(" ")) {
      const phraseTokens = tokenize(normalized);
      if (phraseTokens.length > 0 && phraseTokens.every((token) => haystack.includes(token))) {
        score += 3;
      }
      continue;
    }

    if (haystack.includes(normalized)) {
      score += 2;
    }
  }

  return score;
}

export function getRoleDescription(role: CoreObjectRole): string {
  return CORE_OBJECT_ROLE_INFO[role];
}

export function isRiskRole(role: CoreObjectRole): boolean {
  return RISK_ROLES.has(role);
}

export function isOperationalRole(role: CoreObjectRole): boolean {
  return OPERATIONAL_ROLES.has(role);
}

export function classifyEntityToCoreRole(label: string, tags?: string[]): CoreObjectRole {
  const haystack = Array.from(
    new Set([
      ...tokenize(label),
      ...(Array.isArray(tags) ? tags.flatMap((tag) => tokenize(String(tag))) : []),
    ])
  );

  let bestRole: CoreObjectRole = "node";
  let bestScore = 0;

  for (const entry of ROLE_KEYWORDS) {
    const score = scoreTerms(haystack, entry.terms);
    if (score > bestScore) {
      bestRole = entry.role;
      bestScore = score;
    }
  }

  return bestScore > 0 ? bestRole : "node";
}
