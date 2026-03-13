export type NexoraDomainScenarioId = string;

export type NexoraDomainKpiId = string;

export interface NexoraDomainScenarioDefinition {
  id: NexoraDomainScenarioId;
  label: string;
  description?: string;
  relatedObjectRoles?: string[];
  relatedRelationTypes?: string[];
  relatedLoopTypes?: string[];
  tags?: string[];
  keywords?: string[];
  severityHint?: "low" | "moderate" | "high" | "critical";
}

export interface NexoraDomainKpiDefinition {
  id: NexoraDomainKpiId;
  label: string;
  description?: string;
  relatedObjectRoles?: string[];
  relatedRelationTypes?: string[];
  relatedLoopTypes?: string[];
  tags?: string[];
  directionHint?: "increase_is_good" | "decrease_is_good" | "contextual";
}

export interface NexoraScenarioKpiLink {
  scenarioId: NexoraDomainScenarioId;
  kpiId: NexoraDomainKpiId;
  impactType: "positive" | "negative" | "mixed";
  weight?: number;
  notes?: string[];
}

export interface NexoraDomainScenarioKpiMapping {
  domainId: string;
  scenarios: NexoraDomainScenarioDefinition[];
  kpis: NexoraDomainKpiDefinition[];
  links: NexoraScenarioKpiLink[];
}

export interface NexoraScenarioMatch {
  id: string;
  label: string;
  score: number;
  severityHint?: "low" | "moderate" | "high" | "critical";
  matchedText?: string;
  tags?: string[];
}

export interface NexoraKpiMatch {
  id: string;
  label: string;
  score: number;
  directionHint?: "increase_is_good" | "decrease_is_good" | "contextual";
  matchedText?: string;
  tags?: string[];
}

export interface NexoraDomainScenarioKpiInterpretation {
  domainId?: string | null;
  rawText: string;
  normalizedText: string;
  scenarioMatches: NexoraScenarioMatch[];
  kpiMatches: NexoraKpiMatch[];
  inferredPrimaryScenario?: NexoraScenarioMatch | null;
  inferredPrimaryKpi?: NexoraKpiMatch | null;
  notes?: string[];
}

function normalizeText(value: string): string {
  return value.toLowerCase().trim().replace(/\s+/g, " ");
}

function tokenize(value: string): string[] {
  return normalizeText(value)
    .split(/[^a-z0-9_]+/g)
    .map((token) => token.trim())
    .filter(Boolean);
}

function uniq(values: string[]): string[] {
  return Array.from(new Set(values.map((value) => String(value ?? "").trim()).filter(Boolean)));
}

function clamp01(value: number | undefined): number | undefined {
  if (value === undefined) return undefined;
  if (!Number.isFinite(value)) return 0;
  if (value <= 0) return 0;
  if (value >= 1) return 1;
  return value;
}

function includesPhrase(normalizedText: string, phrase: string): boolean {
  const normalizedPhrase = normalizeText(phrase);
  return Boolean(normalizedPhrase) && normalizedText.includes(normalizedPhrase);
}

function scoreTextMatch(normalizedText: string, tokens: string[], candidate: string): number {
  const normalizedCandidate = normalizeText(candidate);
  if (!normalizedCandidate) return 0;

  const candidateTokens = tokenize(normalizedCandidate);
  if (candidateTokens.length === 0) return 0;

  let score = 0;
  const matchedCount = candidateTokens.filter((token) => tokens.includes(token)).length;
  if (matchedCount === candidateTokens.length) {
    score += candidateTokens.length + 2;
  } else if (matchedCount > 0) {
    score += matchedCount;
  }

  if (includesPhrase(normalizedText, normalizedCandidate)) {
    score += 2;
  }

  return score;
}

function compareScenarioMatches(a: NexoraScenarioMatch, b: NexoraScenarioMatch): number {
  if (b.score !== a.score) return b.score - a.score;
  return a.label.localeCompare(b.label);
}

function compareKpiMatches(a: NexoraKpiMatch, b: NexoraKpiMatch): number {
  if (b.score !== a.score) return b.score - a.score;
  return a.label.localeCompare(b.label);
}

export function normalizeScenarioDefinition(
  input: Partial<NexoraDomainScenarioDefinition> & { id: string; label?: string }
): NexoraDomainScenarioDefinition {
  const id = String(input.id).trim();
  const label = String(input.label ?? id).trim() || id;

  return {
    id,
    label,
    ...(typeof input.description === "string" && input.description.trim()
      ? { description: input.description.trim() }
      : {}),
    relatedObjectRoles: Array.isArray(input.relatedObjectRoles)
      ? uniq(input.relatedObjectRoles.map((value) => String(value)))
      : [],
    relatedRelationTypes: Array.isArray(input.relatedRelationTypes)
      ? uniq(input.relatedRelationTypes.map((value) => String(value)))
      : [],
    relatedLoopTypes: Array.isArray(input.relatedLoopTypes)
      ? uniq(input.relatedLoopTypes.map((value) => String(value)))
      : [],
    tags: Array.isArray(input.tags) ? uniq(input.tags.map((value) => String(value))) : [],
    keywords: Array.isArray(input.keywords)
      ? uniq(input.keywords.map((value) => String(value)))
      : [],
    ...(input.severityHint ? { severityHint: input.severityHint } : {}),
  };
}

export function normalizeKpiDefinition(
  input: Partial<NexoraDomainKpiDefinition> & { id: string; label?: string }
): NexoraDomainKpiDefinition {
  const id = String(input.id).trim();
  const label = String(input.label ?? id).trim() || id;

  return {
    id,
    label,
    ...(typeof input.description === "string" && input.description.trim()
      ? { description: input.description.trim() }
      : {}),
    relatedObjectRoles: Array.isArray(input.relatedObjectRoles)
      ? uniq(input.relatedObjectRoles.map((value) => String(value)))
      : [],
    relatedRelationTypes: Array.isArray(input.relatedRelationTypes)
      ? uniq(input.relatedRelationTypes.map((value) => String(value)))
      : [],
    relatedLoopTypes: Array.isArray(input.relatedLoopTypes)
      ? uniq(input.relatedLoopTypes.map((value) => String(value)))
      : [],
    tags: Array.isArray(input.tags) ? uniq(input.tags.map((value) => String(value))) : [],
    ...(input.directionHint ? { directionHint: input.directionHint } : {}),
  };
}

export function normalizeScenarioKpiLink(
  input: NexoraScenarioKpiLink
): NexoraScenarioKpiLink {
  return {
    scenarioId: String(input.scenarioId).trim(),
    kpiId: String(input.kpiId).trim(),
    impactType: input.impactType,
    ...(input.weight !== undefined ? { weight: clamp01(input.weight) } : {}),
    notes: Array.isArray(input.notes) ? uniq(input.notes.map((value) => String(value))) : [],
  };
}

export function normalizeDomainScenarioKpiMapping(
  input: Partial<NexoraDomainScenarioKpiMapping> & { domainId: string }
): NexoraDomainScenarioKpiMapping {
  return {
    domainId: String(input.domainId).trim(),
    scenarios: Array.isArray(input.scenarios)
      ? input.scenarios.map((scenario) => normalizeScenarioDefinition(scenario))
      : [],
    kpis: Array.isArray(input.kpis)
      ? input.kpis.map((kpi) => normalizeKpiDefinition(kpi))
      : [],
    links: Array.isArray(input.links)
      ? input.links.map((link) => normalizeScenarioKpiLink(link))
      : [],
  };
}

export function matchPromptToDomainScenarios(
  text: string,
  mapping?: NexoraDomainScenarioKpiMapping | null
): NexoraScenarioMatch[] {
  if (!mapping) return [];

  const normalizedText = normalizeText(text);
  const tokens = tokenize(text);

  return mapping.scenarios
    .map((rawScenario) => {
      const scenario = normalizeScenarioDefinition(rawScenario);
      let bestScore = 0;
      let matchedText = "";

      const candidates: Array<{ text: string; bonus: number }> = [
        { text: scenario.label, bonus: 10 },
        ...scenario.keywords!.map((keyword) => ({ text: keyword, bonus: 8 })),
        ...scenario.tags!.map((tag) => ({ text: tag, bonus: 6 })),
        ...(scenario.description ? [{ text: scenario.description, bonus: 4 }] : []),
      ];

      for (const candidate of candidates) {
        const candidateScore = candidate.bonus + scoreTextMatch(normalizedText, tokens, candidate.text);
        if (candidateScore > bestScore) {
          bestScore = candidateScore;
          matchedText = candidate.text;
        }
      }

      if (bestScore <= 0) return null;

      const match: NexoraScenarioMatch = {
        id: scenario.id,
        label: scenario.label,
        score: bestScore,
        ...(scenario.severityHint ? { severityHint: scenario.severityHint } : {}),
        ...(matchedText ? { matchedText } : {}),
        tags: scenario.tags ?? [],
      };

      return match;
    })
    .filter((match): match is NexoraScenarioMatch => match !== null)
    .sort(compareScenarioMatches);
}

export function matchPromptToDomainKpis(
  text: string,
  mapping?: NexoraDomainScenarioKpiMapping | null
): NexoraKpiMatch[] {
  if (!mapping) return [];

  const normalizedText = normalizeText(text);
  const tokens = tokenize(text);

  return mapping.kpis
    .map((rawKpi) => {
      const kpi = normalizeKpiDefinition(rawKpi);
      let bestScore = 0;
      let matchedText = "";

      const candidates: Array<{ text: string; bonus: number }> = [
        { text: kpi.label, bonus: 10 },
        ...kpi.tags!.map((tag) => ({ text: tag, bonus: 6 })),
        ...(kpi.description ? [{ text: kpi.description, bonus: 4 }] : []),
      ];

      for (const candidate of candidates) {
        const candidateScore = candidate.bonus + scoreTextMatch(normalizedText, tokens, candidate.text);
        if (candidateScore > bestScore) {
          bestScore = candidateScore;
          matchedText = candidate.text;
        }
      }

      if (bestScore <= 0) return null;

      const match: NexoraKpiMatch = {
        id: kpi.id,
        label: kpi.label,
        score: bestScore,
        ...(kpi.directionHint ? { directionHint: kpi.directionHint } : {}),
        ...(matchedText ? { matchedText } : {}),
        tags: kpi.tags ?? [],
      };

      return match;
    })
    .filter((match): match is NexoraKpiMatch => match !== null)
    .sort(compareKpiMatches);
}

export function getPrimaryScenarioMatch(
  matches: NexoraScenarioMatch[]
): NexoraScenarioMatch | null {
  return Array.isArray(matches) && matches.length > 0 ? [...matches].sort(compareScenarioMatches)[0] : null;
}

export function getPrimaryKpiMatch(
  matches: NexoraKpiMatch[]
): NexoraKpiMatch | null {
  return Array.isArray(matches) && matches.length > 0 ? [...matches].sort(compareKpiMatches)[0] : null;
}

export function interpretScenarioAndKpiForDomain(args: {
  text: string;
  mapping?: NexoraDomainScenarioKpiMapping | null;
  domainId?: string | null;
}): NexoraDomainScenarioKpiInterpretation {
  const rawText = String(args.text ?? "");
  const normalizedText = normalizeText(rawText);
  const normalizedMapping = args.mapping ? normalizeDomainScenarioKpiMapping(args.mapping) : null;
  const scenarioMatches = matchPromptToDomainScenarios(rawText, normalizedMapping);
  const kpiMatches = matchPromptToDomainKpis(rawText, normalizedMapping);
  const inferredPrimaryScenario = getPrimaryScenarioMatch(scenarioMatches);
  const inferredPrimaryKpi = getPrimaryKpiMatch(kpiMatches);
  const notes: string[] = [];

  if (!normalizedText) {
    notes.push("Input text was empty after normalization.");
  }
  if (scenarioMatches.length === 0) {
    notes.push("No scenario matches detected.");
  }
  if (kpiMatches.length === 0) {
    notes.push("No KPI matches detected.");
  }

  return {
    domainId: args.domainId ?? normalizedMapping?.domainId ?? null,
    rawText,
    normalizedText,
    scenarioMatches,
    kpiMatches,
    inferredPrimaryScenario,
    inferredPrimaryKpi,
    notes,
  };
}

export function listKpisForScenario(
  mapping: NexoraDomainScenarioKpiMapping | null | undefined,
  scenarioId?: string | null
): NexoraScenarioKpiLink[] {
  const normalizedScenarioId = String(scenarioId ?? "").trim();
  if (!mapping || !normalizedScenarioId) return [];

  return mapping.links
    .map((link) => normalizeScenarioKpiLink(link))
    .filter((link) => link.scenarioId === normalizedScenarioId);
}

export function listScenariosForKpi(
  mapping: NexoraDomainScenarioKpiMapping | null | undefined,
  kpiId?: string | null
): NexoraScenarioKpiLink[] {
  const normalizedKpiId = String(kpiId ?? "").trim();
  if (!mapping || !normalizedKpiId) return [];

  return mapping.links
    .map((link) => normalizeScenarioKpiLink(link))
    .filter((link) => link.kpiId === normalizedKpiId);
}

const BUSINESS_MAPPING: NexoraDomainScenarioKpiMapping = normalizeDomainScenarioKpiMapping({
  domainId: "business",
  scenarios: [
    {
      id: "supplier_delay",
      label: "Supplier Delay",
      description: "Upstream disruption slows system input and delivery flow.",
      relatedObjectRoles: ["source", "dependency", "flow"],
      relatedRelationTypes: ["depends_on", "flows_to"],
      relatedLoopTypes: ["risk_cascade", "pressure"],
      tags: ["supplier", "delay", "upstream"],
      keywords: ["supplier delay", "vendor delay", "upstream disruption"],
      severityHint: "high",
    },
    {
      id: "demand_spike",
      label: "Demand Spike",
      description: "Demand exceeds normal throughput and buffer capacity.",
      relatedObjectRoles: ["pressure", "buffer", "flow"],
      relatedRelationTypes: ["amplifies", "flows_to"],
      relatedLoopTypes: ["pressure", "reinforcing"],
      tags: ["demand", "spike", "capacity"],
      keywords: ["demand spike", "surge", "volume pressure"],
      severityHint: "moderate",
    },
    {
      id: "cost_pressure",
      label: "Cost Pressure",
      description: "Rising costs constrain resilience and service quality.",
      relatedObjectRoles: ["pressure", "constraint", "kpi"],
      relatedRelationTypes: ["causes", "reduces"],
      relatedLoopTypes: ["constraint", "pressure"],
      tags: ["cost", "margin", "pressure"],
      keywords: ["cost pressure", "margin squeeze", "cost increase"],
      severityHint: "high",
    },
    {
      id: "capacity_bottleneck",
      label: "Capacity Bottleneck",
      description: "Throughput constraints are forming around operations, inventory, or fulfillment.",
      relatedObjectRoles: ["buffer", "flow", "constraint"],
      relatedRelationTypes: ["flows_to", "reduces", "depends_on"],
      relatedLoopTypes: ["constraint", "pressure"],
      tags: ["capacity", "bottleneck", "throughput"],
      keywords: ["capacity bottleneck", "operational bottleneck", "throughput bottleneck"],
      severityHint: "high",
    },
    {
      id: "cash_pressure",
      label: "Cash Pressure",
      description: "Operating strain is tightening liquidity and decision flexibility.",
      relatedObjectRoles: ["constraint", "kpi", "strategic_node"],
      relatedRelationTypes: ["reduces", "amplifies", "depends_on"],
      relatedLoopTypes: ["pressure", "constraint"],
      tags: ["cash", "liquidity", "margin"],
      keywords: ["cash pressure", "liquidity pressure", "working capital stress"],
      severityHint: "high",
    },
    {
      id: "customer_trust_drop",
      label: "Customer Trust Drop",
      description: "Service disruption is starting to weaken downstream customer confidence.",
      relatedObjectRoles: ["outcome", "kpi", "flow"],
      relatedRelationTypes: ["signals", "reduces", "amplifies"],
      relatedLoopTypes: ["strategic_response", "pressure"],
      tags: ["customer", "trust", "reputation"],
      keywords: ["customer trust decline", "customer trust drop", "reputation decline"],
      severityHint: "moderate",
    },
    {
      id: "delivery_disruption",
      label: "Delivery Disruption",
      description: "Fulfillment continuity is breaking down across the operating flow.",
      relatedObjectRoles: ["flow", "outcome", "dependency"],
      relatedRelationTypes: ["flows_to", "depends_on", "causes"],
      relatedLoopTypes: ["risk_cascade", "pressure"],
      tags: ["delivery", "fulfillment", "service"],
      keywords: ["delivery disruption", "fulfillment disruption", "service interruption"],
      severityHint: "high",
    },
  ],
  kpis: [
    {
      id: "delivery_reliability",
      label: "Delivery Reliability",
      description: "Measures the stability of commitments and fulfillment timing.",
      relatedObjectRoles: ["flow", "outcome"],
      relatedRelationTypes: ["flows_to", "depends_on"],
      relatedLoopTypes: ["balancing", "pressure"],
      tags: ["delivery", "reliability", "service"],
      directionHint: "increase_is_good",
    },
    {
      id: "inventory_health",
      label: "Inventory Health",
      description: "Tracks reserve capacity and stock resilience.",
      relatedObjectRoles: ["buffer", "constraint"],
      relatedRelationTypes: ["flows_to", "reduces"],
      relatedLoopTypes: ["buffer_recovery", "constraint"],
      tags: ["inventory", "buffer", "stock"],
      directionHint: "increase_is_good",
    },
    {
      id: "customer_trust",
      label: "Customer Trust",
      description: "Represents downstream customer confidence and experience.",
      relatedObjectRoles: ["outcome", "kpi"],
      relatedRelationTypes: ["signals", "amplifies"],
      relatedLoopTypes: ["pressure", "strategic_response"],
      tags: ["customer", "trust", "outcome"],
      directionHint: "increase_is_good",
    },
    {
      id: "operating_stability",
      label: "Operating Stability",
      description: "Tracks whether the business can sustain steady execution under pressure.",
      relatedObjectRoles: ["flow", "buffer", "constraint"],
      relatedRelationTypes: ["flows_to", "reduces", "depends_on"],
      relatedLoopTypes: ["balancing", "constraint", "pressure"],
      tags: ["operations", "stability", "continuity"],
      directionHint: "increase_is_good",
    },
    {
      id: "revenue_exposure",
      label: "Revenue Exposure",
      description: "Represents downside exposure to commercial performance and commitments.",
      relatedObjectRoles: ["kpi", "outcome", "strategic_node"],
      relatedRelationTypes: ["amplifies", "signals", "reduces"],
      relatedLoopTypes: ["pressure", "strategic_response"],
      tags: ["revenue", "exposure", "commercial"],
      directionHint: "decrease_is_good",
    },
    {
      id: "fulfillment_performance",
      label: "Fulfillment Performance",
      description: "Measures the reliability and speed of customer-facing delivery flow.",
      relatedObjectRoles: ["flow", "outcome", "operational_node"],
      relatedRelationTypes: ["flows_to", "depends_on"],
      relatedLoopTypes: ["balancing", "pressure"],
      tags: ["fulfillment", "service", "throughput"],
      directionHint: "increase_is_good",
    },
  ],
  links: [
    {
      scenarioId: "supplier_delay",
      kpiId: "delivery_reliability",
      impactType: "negative",
      weight: 0.85,
      notes: ["Upstream delay weakens commitment stability."],
    },
    {
      scenarioId: "supplier_delay",
      kpiId: "inventory_health",
      impactType: "negative",
      weight: 0.75,
      notes: ["Buffers are consumed while replenishment slows."],
    },
    {
      scenarioId: "demand_spike",
      kpiId: "inventory_health",
      impactType: "negative",
      weight: 0.8,
      notes: ["Demand spikes deplete buffer capacity."],
    },
    {
      scenarioId: "cost_pressure",
      kpiId: "customer_trust",
      impactType: "negative",
      weight: 0.55,
      notes: ["Cost cutting can degrade customer experience."],
    },
    {
      scenarioId: "capacity_bottleneck",
      kpiId: "operating_stability",
      impactType: "negative",
      weight: 0.84,
      notes: ["Throughput constraints weaken operational continuity."],
    },
    {
      scenarioId: "capacity_bottleneck",
      kpiId: "fulfillment_performance",
      impactType: "negative",
      weight: 0.8,
      notes: ["Bottlenecks delay fulfillment and weaken service reliability."],
    },
    {
      scenarioId: "cash_pressure",
      kpiId: "revenue_exposure",
      impactType: "negative",
      weight: 0.82,
      notes: ["Cash stress reduces flexibility and raises downside exposure."],
    },
    {
      scenarioId: "cash_pressure",
      kpiId: "operating_stability",
      impactType: "negative",
      weight: 0.67,
      notes: ["Liquidity stress restricts the system's ability to stabilize operations."],
    },
    {
      scenarioId: "customer_trust_drop",
      kpiId: "customer_trust",
      impactType: "negative",
      weight: 0.9,
      notes: ["Downstream trust deterioration is directly visible in customer outcomes."],
    },
    {
      scenarioId: "customer_trust_drop",
      kpiId: "revenue_exposure",
      impactType: "negative",
      weight: 0.7,
      notes: ["Weakening trust increases revenue and retention risk."],
    },
    {
      scenarioId: "delivery_disruption",
      kpiId: "delivery_reliability",
      impactType: "negative",
      weight: 0.9,
      notes: ["Delivery disruption directly harms commitment stability."],
    },
    {
      scenarioId: "delivery_disruption",
      kpiId: "fulfillment_performance",
      impactType: "negative",
      weight: 0.88,
      notes: ["Fulfillment degradation is the clearest downstream effect."],
    },
  ],
});

const FINANCE_MAPPING: NexoraDomainScenarioKpiMapping = normalizeDomainScenarioKpiMapping({
  domainId: "finance",
  scenarios: [
    {
      id: "liquidity_stress",
      label: "Liquidity Stress",
      description: "Funding tightness constrains system movement and resilience.",
      relatedObjectRoles: ["flow", "pressure", "constraint"],
      relatedRelationTypes: ["flows_to", "depends_on"],
      relatedLoopTypes: ["constraint", "pressure"],
      tags: ["liquidity", "stress", "cash"],
      keywords: ["liquidity stress", "cash stress", "funding squeeze"],
      severityHint: "critical",
    },
    {
      id: "drawdown_risk",
      label: "Drawdown Risk",
      description: "Loss exposure is increasing across the portfolio system.",
      relatedObjectRoles: ["risk", "outcome", "node"],
      relatedRelationTypes: ["transfers_risk", "amplifies"],
      relatedLoopTypes: ["risk_cascade", "pressure"],
      tags: ["drawdown", "loss", "risk"],
      keywords: ["drawdown risk", "loss risk", "portfolio decline"],
      severityHint: "high",
    },
    {
      id: "exposure_concentration",
      label: "Exposure Concentration",
      description: "Risk is overly concentrated in a small number of positions or channels.",
      relatedObjectRoles: ["risk", "dependency", "constraint"],
      relatedRelationTypes: ["depends_on", "transfers_risk"],
      relatedLoopTypes: ["constraint", "risk_cascade"],
      tags: ["exposure", "concentration", "portfolio"],
      keywords: ["exposure concentration", "concentration risk", "single exposure"],
      severityHint: "high",
    },
    {
      id: "volatility_spike",
      label: "Volatility Spike",
      description: "A sharp increase in market volatility is destabilizing price and liquidity conditions.",
      relatedObjectRoles: ["risk", "pressure", "flow"],
      relatedRelationTypes: ["signals", "amplifies", "causes"],
      relatedLoopTypes: ["pressure", "risk_cascade"],
      tags: ["volatility", "instability", "market"],
      keywords: ["volatility spike", "vol spike", "market volatility spike"],
      severityHint: "high",
    },
    {
      id: "leverage_risk",
      label: "Leverage Risk",
      description: "Amplified positioning is increasing the system's sensitivity to adverse price movement.",
      relatedObjectRoles: ["constraint", "risk", "node"],
      relatedRelationTypes: ["amplifies", "transfers_risk", "depends_on"],
      relatedLoopTypes: ["constraint", "pressure"],
      tags: ["leverage", "margin", "amplification"],
      keywords: ["leverage increase", "leverage risk", "margin pressure"],
      severityHint: "high",
    },
    {
      id: "market_selloff",
      label: "Market Selloff",
      description: "Broad selling pressure is weakening prices, confidence, and financial resilience.",
      relatedObjectRoles: ["flow", "risk", "outcome"],
      relatedRelationTypes: ["reduces", "signals", "causes"],
      relatedLoopTypes: ["risk_cascade", "pressure"],
      tags: ["selloff", "market", "price"],
      keywords: ["asset price drop", "market selloff", "price selloff"],
      severityHint: "critical",
    },
    {
      id: "credit_pressure",
      label: "Credit Pressure",
      description: "Funding and credit conditions are tightening across the financial system.",
      relatedObjectRoles: ["risk", "pressure", "constraint"],
      relatedRelationTypes: ["causes", "reduces", "signals"],
      relatedLoopTypes: ["constraint", "pressure"],
      tags: ["credit", "funding", "spread"],
      keywords: ["credit pressure", "spread widening", "credit stress"],
      severityHint: "high",
    },
    {
      id: "systemic_instability",
      label: "Systemic Instability",
      description: "Financial stress is propagating across multiple connected risk channels.",
      relatedObjectRoles: ["risk", "dependency", "outcome"],
      relatedRelationTypes: ["transfers_risk", "signals", "causes"],
      relatedLoopTypes: ["risk_cascade", "pressure"],
      tags: ["systemic", "instability", "contagion"],
      keywords: ["systemic risk", "systemic instability", "market contagion"],
      severityHint: "critical",
    },
  ],
  kpis: [
    {
      id: "liquidity_health",
      label: "Liquidity Health",
      description: "Tracks the system's ability to fund operations and absorb stress.",
      relatedObjectRoles: ["flow", "buffer"],
      relatedRelationTypes: ["flows_to", "reduces"],
      relatedLoopTypes: ["buffer_recovery", "constraint"],
      tags: ["liquidity", "cash", "funding"],
      directionHint: "increase_is_good",
    },
    {
      id: "capital_stability",
      label: "Capital Stability",
      description: "Measures resilience of capital position under pressure.",
      relatedObjectRoles: ["buffer", "kpi", "risk"],
      relatedRelationTypes: ["reduces", "transfers_risk"],
      relatedLoopTypes: ["balancing", "risk_cascade"],
      tags: ["capital", "stability", "resilience"],
      directionHint: "increase_is_good",
    },
    {
      id: "drawdown_control",
      label: "Drawdown Control",
      description: "Measures the ability to contain downside movement.",
      relatedObjectRoles: ["risk", "objective"],
      relatedRelationTypes: ["reduces", "signals"],
      relatedLoopTypes: ["strategic_response", "pressure"],
      tags: ["drawdown", "control", "risk"],
      directionHint: "increase_is_good",
    },
    {
      id: "market_stability",
      label: "Market Stability",
      description: "Tracks whether prices and conditions remain orderly under stress.",
      relatedObjectRoles: ["flow", "outcome", "risk"],
      relatedRelationTypes: ["signals", "reduces", "causes"],
      relatedLoopTypes: ["balancing", "pressure"],
      tags: ["market", "stability", "orderly"],
      directionHint: "increase_is_good",
    },
    {
      id: "portfolio_risk",
      label: "Portfolio Risk",
      description: "Measures downside exposure across the portfolio structure.",
      relatedObjectRoles: ["risk", "node", "objective"],
      relatedRelationTypes: ["transfers_risk", "amplifies"],
      relatedLoopTypes: ["risk_cascade", "constraint"],
      tags: ["portfolio", "exposure", "risk"],
      directionHint: "decrease_is_good",
    },
    {
      id: "systemic_fragility",
      label: "Systemic Fragility",
      description: "Represents how easily pressure can spread across the financial network.",
      relatedObjectRoles: ["risk", "outcome", "dependency"],
      relatedRelationTypes: ["transfers_risk", "signals", "causes"],
      relatedLoopTypes: ["risk_cascade", "pressure"],
      tags: ["systemic", "fragility", "contagion"],
      directionHint: "decrease_is_good",
    },
  ],
  links: [
    {
      scenarioId: "liquidity_stress",
      kpiId: "liquidity_health",
      impactType: "negative",
      weight: 0.9,
      notes: ["Funding strain directly weakens liquidity conditions."],
    },
    {
      scenarioId: "drawdown_risk",
      kpiId: "drawdown_control",
      impactType: "negative",
      weight: 0.85,
      notes: ["Loss exposure reduces drawdown containment."],
    },
    {
      scenarioId: "exposure_concentration",
      kpiId: "capital_stability",
      impactType: "negative",
      weight: 0.75,
      notes: ["Concentration makes capital less resilient."],
    },
    {
      scenarioId: "volatility_spike",
      kpiId: "market_stability",
      impactType: "negative",
      weight: 0.88,
      notes: ["Volatility spikes directly weaken orderly market conditions."],
    },
    {
      scenarioId: "volatility_spike",
      kpiId: "portfolio_risk",
      impactType: "negative",
      weight: 0.73,
      notes: ["Higher volatility raises downside exposure across portfolio positions."],
    },
    {
      scenarioId: "leverage_risk",
      kpiId: "capital_stability",
      impactType: "negative",
      weight: 0.84,
      notes: ["Leverage amplifies the effect of market moves on capital resilience."],
    },
    {
      scenarioId: "leverage_risk",
      kpiId: "portfolio_risk",
      impactType: "negative",
      weight: 0.8,
      notes: ["Higher leverage increases effective downside exposure."],
    },
    {
      scenarioId: "market_selloff",
      kpiId: "market_stability",
      impactType: "negative",
      weight: 0.9,
      notes: ["Selloffs weaken orderly conditions and deepen fragility."],
    },
    {
      scenarioId: "market_selloff",
      kpiId: "drawdown_control",
      impactType: "negative",
      weight: 0.86,
      notes: ["Rapid price declines reduce the system's ability to contain downside movement."],
    },
    {
      scenarioId: "credit_pressure",
      kpiId: "liquidity_health",
      impactType: "negative",
      weight: 0.87,
      notes: ["Tighter credit conditions weaken funding flexibility and market depth."],
    },
    {
      scenarioId: "credit_pressure",
      kpiId: "capital_stability",
      impactType: "negative",
      weight: 0.76,
      notes: ["Credit strain erodes capital resilience and decision flexibility."],
    },
    {
      scenarioId: "systemic_instability",
      kpiId: "systemic_fragility",
      impactType: "negative",
      weight: 0.93,
      notes: ["Systemic instability is the clearest signal of broad contagion risk."],
    },
    {
      scenarioId: "systemic_instability",
      kpiId: "market_stability",
      impactType: "negative",
      weight: 0.82,
      notes: ["Contagion reduces orderly financial conditions across the wider system."],
    },
  ],
});

const DEVOPS_MAPPING: NexoraDomainScenarioKpiMapping = normalizeDomainScenarioKpiMapping({
  domainId: "devops",
  scenarios: [
    {
      id: "service_dependency_failure",
      label: "Service Dependency Failure",
      description: "A critical dependency failure spreads across connected services.",
      relatedObjectRoles: ["dependency", "risk", "node"],
      relatedRelationTypes: ["depends_on", "blocks"],
      relatedLoopTypes: ["risk_cascade", "constraint"],
      tags: ["service", "dependency", "failure"],
      keywords: ["service dependency failure", "dependency outage", "critical dependency"],
      severityHint: "critical",
    },
    {
      id: "database_latency",
      label: "Database Latency",
      description: "Persistent data-layer latency increases operational strain.",
      relatedObjectRoles: ["pressure", "dependency", "node"],
      relatedRelationTypes: ["signals", "amplifies"],
      relatedLoopTypes: ["pressure", "constraint"],
      tags: ["database", "latency", "performance"],
      keywords: ["database latency", "slow database", "db slowdown"],
      severityHint: "high",
    },
    {
      id: "traffic_spike",
      label: "Traffic Spike",
      description: "Traffic surge overwhelms service buffers and response paths.",
      relatedObjectRoles: ["pressure", "flow", "buffer"],
      relatedRelationTypes: ["flows_to", "amplifies"],
      relatedLoopTypes: ["pressure", "reinforcing"],
      tags: ["traffic", "spike", "load"],
      keywords: ["traffic spike", "load spike", "request surge"],
      severityHint: "moderate",
    },
    {
      id: "queue_backlog",
      label: "Queue Backlog",
      description: "Buffered work is accumulating faster than the system can clear it.",
      relatedObjectRoles: ["buffer", "constraint", "flow"],
      relatedRelationTypes: ["flows_to", "blocks", "amplifies"],
      relatedLoopTypes: ["constraint", "pressure"],
      tags: ["queue", "backlog", "buffer"],
      keywords: ["queue backlog", "backlog growth", "message backlog"],
      severityHint: "high",
    },
    {
      id: "cache_failure",
      label: "Cache Failure",
      description: "Protective cache behavior is lost, increasing dependency load and latency pressure.",
      relatedObjectRoles: ["buffer", "dependency", "risk"],
      relatedRelationTypes: ["depends_on", "signals", "amplifies"],
      relatedLoopTypes: ["pressure", "risk_cascade"],
      tags: ["cache", "failure", "latency"],
      keywords: ["cache failure", "cache outage", "cache miss storm"],
      severityHint: "high",
    },
    {
      id: "worker_bottleneck",
      label: "Worker Bottleneck",
      description: "Execution capacity is constrained and cannot clear runtime pressure quickly enough.",
      relatedObjectRoles: ["flow", "constraint", "node"],
      relatedRelationTypes: ["flows_to", "blocks", "depends_on"],
      relatedLoopTypes: ["constraint", "pressure"],
      tags: ["worker", "bottleneck", "throughput"],
      keywords: ["worker bottleneck", "worker saturation", "executor bottleneck"],
      severityHint: "high",
    },
    {
      id: "cascading_service_instability",
      label: "Cascading Service Instability",
      description: "Localized service pressure is spreading through the dependency graph into broader runtime instability.",
      relatedObjectRoles: ["dependency", "risk", "outcome"],
      relatedRelationTypes: ["depends_on", "blocks", "causes"],
      relatedLoopTypes: ["risk_cascade", "pressure"],
      tags: ["cascade", "service", "instability"],
      keywords: ["cascading service instability", "service cascade", "cascading failure"],
      severityHint: "critical",
    },
  ],
  kpis: [
    {
      id: "service_uptime",
      label: "Service Uptime",
      description: "Measures continuity and availability of critical services.",
      relatedObjectRoles: ["node", "outcome"],
      relatedRelationTypes: ["depends_on", "blocks"],
      relatedLoopTypes: ["balancing", "risk_cascade"],
      tags: ["uptime", "availability", "service"],
      directionHint: "increase_is_good",
    },
    {
      id: "response_latency",
      label: "Response Latency",
      description: "Tracks service response speed under operating pressure.",
      relatedObjectRoles: ["pressure", "kpi"],
      relatedRelationTypes: ["signals", "amplifies"],
      relatedLoopTypes: ["pressure", "constraint"],
      tags: ["latency", "response", "performance"],
      directionHint: "decrease_is_good",
    },
    {
      id: "error_rate",
      label: "Error Rate",
      description: "Measures failure frequency across service interactions.",
      relatedObjectRoles: ["risk", "outcome"],
      relatedRelationTypes: ["causes", "signals"],
      relatedLoopTypes: ["risk_cascade", "pressure"],
      tags: ["error", "failure", "quality"],
      directionHint: "decrease_is_good",
    },
    {
      id: "throughput_stability",
      label: "Throughput Stability",
      description: "Tracks whether the service path can sustain steady request and job completion under load.",
      relatedObjectRoles: ["flow", "buffer", "node"],
      relatedRelationTypes: ["flows_to", "depends_on", "signals"],
      relatedLoopTypes: ["balancing", "pressure", "constraint"],
      tags: ["throughput", "stability", "load"],
      directionHint: "increase_is_good",
    },
    {
      id: "recovery_resilience",
      label: "Recovery Resilience",
      description: "Measures how quickly the system can recover from dependency or runtime instability.",
      relatedObjectRoles: ["buffer", "outcome", "constraint"],
      relatedRelationTypes: ["reduces", "signals", "depends_on"],
      relatedLoopTypes: ["balancing", "buffer_recovery"],
      tags: ["recovery", "resilience", "fallback"],
      directionHint: "increase_is_good",
    },
    {
      id: "dependency_health",
      label: "Dependency Health",
      description: "Represents the stability of critical services and shared infrastructure dependencies.",
      relatedObjectRoles: ["dependency", "node", "risk"],
      relatedRelationTypes: ["depends_on", "blocks"],
      relatedLoopTypes: ["risk_cascade", "constraint"],
      tags: ["dependency", "health", "service"],
      directionHint: "increase_is_good",
    },
  ],
  links: [
    {
      scenarioId: "service_dependency_failure",
      kpiId: "service_uptime",
      impactType: "negative",
      weight: 0.95,
      notes: ["Dependency failure directly degrades service continuity."],
    },
    {
      scenarioId: "database_latency",
      kpiId: "response_latency",
      impactType: "negative",
      weight: 0.9,
      notes: ["Database slowdown propagates into end-to-end response time."],
    },
    {
      scenarioId: "traffic_spike",
      kpiId: "error_rate",
      impactType: "negative",
      weight: 0.65,
      notes: ["Overload often increases system errors."],
    },
    {
      scenarioId: "queue_backlog",
      kpiId: "throughput_stability",
      impactType: "negative",
      weight: 0.87,
      notes: ["Backlog growth is a direct sign of weakening throughput stability."],
    },
    {
      scenarioId: "queue_backlog",
      kpiId: "recovery_resilience",
      impactType: "negative",
      weight: 0.7,
      notes: ["Recovery gets harder when queued work keeps growing."],
    },
    {
      scenarioId: "cache_failure",
      kpiId: "response_latency",
      impactType: "negative",
      weight: 0.81,
      notes: ["Cache failure pushes more load into slower dependency paths."],
    },
    {
      scenarioId: "cache_failure",
      kpiId: "dependency_health",
      impactType: "negative",
      weight: 0.72,
      notes: ["The loss of a protective layer exposes core dependencies to higher strain."],
    },
    {
      scenarioId: "worker_bottleneck",
      kpiId: "throughput_stability",
      impactType: "negative",
      weight: 0.84,
      notes: ["Worker saturation reduces the system's ability to clear work under pressure."],
    },
    {
      scenarioId: "worker_bottleneck",
      kpiId: "error_rate",
      impactType: "negative",
      weight: 0.62,
      notes: ["Extended bottlenecks often increase retries, timeouts, and service failures."],
    },
    {
      scenarioId: "cascading_service_instability",
      kpiId: "service_uptime",
      impactType: "negative",
      weight: 0.9,
      notes: ["Cascading instability directly weakens end-to-end service continuity."],
    },
    {
      scenarioId: "cascading_service_instability",
      kpiId: "dependency_health",
      impactType: "negative",
      weight: 0.88,
      notes: ["Service cascades reflect a wider dependency-health breakdown."],
    },
  ],
});

const STRATEGY_MAPPING: NexoraDomainScenarioKpiMapping = normalizeDomainScenarioKpiMapping({
  domainId: "strategy",
  scenarios: [
    {
      id: "competitor_pricing_pressure",
      label: "Competitor Pricing Pressure",
      description: "Competitive pricing action weakens strategic positioning and margin resilience.",
      relatedObjectRoles: ["actor", "pressure", "objective"],
      relatedRelationTypes: ["competes_with", "amplifies"],
      relatedLoopTypes: ["pressure", "strategic_response"],
      tags: ["competitor", "pricing", "pressure"],
      keywords: ["competitor pricing pressure", "price war", "competitive pricing"],
      severityHint: "high",
    },
    {
      id: "market_share_decline",
      label: "Market Share Decline",
      description: "Strategic outcome is weakening across the market system.",
      relatedObjectRoles: ["outcome", "risk", "objective"],
      relatedRelationTypes: ["signals", "reduces"],
      relatedLoopTypes: ["reinforcing", "pressure"],
      tags: ["market share", "decline", "position"],
      keywords: ["market share decline", "share loss", "position weakening"],
      severityHint: "high",
    },
    {
      id: "execution_bottleneck",
      label: "Execution Bottleneck",
      description: "Operational execution limits strategic follow-through.",
      relatedObjectRoles: ["bottleneck", "constraint", "node"],
      relatedRelationTypes: ["blocks", "depends_on"],
      relatedLoopTypes: ["constraint", "balancing"],
      tags: ["execution", "bottleneck", "constraint"],
      keywords: ["execution bottleneck", "delivery bottleneck", "execution slowdown"],
      severityHint: "moderate",
    },
  ],
  kpis: [
    {
      id: "strategic_position",
      label: "Strategic Position",
      description: "Measures competitive strength and strategic standing.",
      relatedObjectRoles: ["objective", "outcome"],
      relatedRelationTypes: ["competes_with", "signals"],
      relatedLoopTypes: ["strategic_response", "reinforcing"],
      tags: ["strategy", "position", "market"],
      directionHint: "increase_is_good",
    },
    {
      id: "execution_stability",
      label: "Execution Stability",
      description: "Measures how reliably the organization can execute strategic moves.",
      relatedObjectRoles: ["node", "constraint", "kpi"],
      relatedRelationTypes: ["depends_on", "blocks"],
      relatedLoopTypes: ["balancing", "constraint"],
      tags: ["execution", "stability", "delivery"],
      directionHint: "increase_is_good",
    },
    {
      id: "growth_momentum",
      label: "Growth Momentum",
      description: "Measures the system's ability to sustain forward growth.",
      relatedObjectRoles: ["flow", "objective", "outcome"],
      relatedRelationTypes: ["amplifies", "reduces"],
      relatedLoopTypes: ["reinforcing", "pressure"],
      tags: ["growth", "momentum", "strategy"],
      directionHint: "increase_is_good",
    },
  ],
  links: [
    {
      scenarioId: "competitor_pricing_pressure",
      kpiId: "strategic_position",
      impactType: "negative",
      weight: 0.8,
      notes: ["Pricing pressure weakens strategic standing."],
    },
    {
      scenarioId: "market_share_decline",
      kpiId: "growth_momentum",
      impactType: "negative",
      weight: 0.85,
      notes: ["Share loss often slows forward momentum."],
    },
    {
      scenarioId: "execution_bottleneck",
      kpiId: "execution_stability",
      impactType: "negative",
      weight: 0.9,
      notes: ["Execution constraints reduce delivery stability."],
    },
  ],
});

export const DEFAULT_DOMAIN_SCENARIO_KPI_MAPPINGS: Record<
  string,
  NexoraDomainScenarioKpiMapping
> = {
  business: BUSINESS_MAPPING,
  finance: FINANCE_MAPPING,
  devops: DEVOPS_MAPPING,
  strategy: STRATEGY_MAPPING,
};

export function getDomainScenarioKpiMapping(
  registry: Record<string, NexoraDomainScenarioKpiMapping>,
  domainId?: string | null
): NexoraDomainScenarioKpiMapping | null {
  const normalizedDomainId = String(domainId ?? "").trim();
  if (!normalizedDomainId) return null;
  const mapping = registry?.[normalizedDomainId];
  return mapping ? normalizeDomainScenarioKpiMapping(mapping) : null;
}

export function listDomainScenarios(
  mapping?: NexoraDomainScenarioKpiMapping | null
): NexoraDomainScenarioDefinition[] {
  if (!mapping) return [];
  return mapping.scenarios.map((scenario) => normalizeScenarioDefinition(scenario));
}

export function listDomainKpis(
  mapping?: NexoraDomainScenarioKpiMapping | null
): NexoraDomainKpiDefinition[] {
  if (!mapping) return [];
  return mapping.kpis.map((kpi) => normalizeKpiDefinition(kpi));
}
