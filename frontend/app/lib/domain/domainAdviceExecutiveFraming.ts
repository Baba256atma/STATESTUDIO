export type NexoraAdviceTone =
  | "executive"
  | "strategic"
  | "analytical"
  | "operational"
  | "advisory"
  | "neutral";

export type NexoraExecutiveFramingStyle =
  | "what_why_action"
  | "risk_impact_action"
  | "signal_implication_response"
  | "scenario_consequence_recommendation"
  | "custom";

export type NexoraAdvicePriority =
  | "low"
  | "moderate"
  | "high"
  | "critical";

export interface NexoraDomainAdviceTemplate {
  id: string;
  label: string;
  tone: NexoraAdviceTone;
  framingStyle: NexoraExecutiveFramingStyle;
  introTemplate?: string;
  implicationTemplate?: string;
  actionTemplate?: string;
  tags?: string[];
  modeHints?: string[];
}

export interface NexoraExecutiveSummaryBlock {
  id: string;
  label: string;
  content?: string;
  priority?: number;
  tags?: string[];
}

export interface NexoraDomainAdviceConfig {
  domainId: string;
  defaultTone?: NexoraAdviceTone;
  defaultFramingStyle?: NexoraExecutiveFramingStyle;
  templates?: NexoraDomainAdviceTemplate[];
  defaultPriorityLabels?: Record<NexoraAdvicePriority, string>;
  managerHints?: string[];
  analystHints?: string[];
  executiveHints?: string[];
  tags?: string[];
}

export interface NexoraDomainAdviceInterpretation {
  domainId?: string | null;
  tone: NexoraAdviceTone;
  framingStyle: NexoraExecutiveFramingStyle;
  priority: NexoraAdvicePriority;
  headline?: string;
  implication?: string;
  recommendedAction?: string;
  summaryBlocks: NexoraExecutiveSummaryBlock[];
  notes?: string[];
}

function normalizeText(value: string): string {
  return value.toLowerCase().trim();
}

function uniq(values: string[]): string[] {
  return Array.from(new Set(values.map((value) => String(value ?? "").trim()).filter(Boolean)));
}

function priorityRank(priority: NexoraAdvicePriority | null | undefined): number {
  switch (priority) {
    case "critical":
      return 4;
    case "high":
      return 3;
    case "moderate":
      return 2;
    case "low":
      return 1;
    default:
      return 0;
  }
}

function normalizeMode(mode?: string | null): string {
  return normalizeText(String(mode ?? ""));
}

function sortTemplates(a: NexoraDomainAdviceTemplate, b: NexoraDomainAdviceTemplate): number {
  return a.label.localeCompare(b.label);
}

export function buildDefaultPriorityLabels(): Record<NexoraAdvicePriority, string> {
  return {
    low: "Low urgency",
    moderate: "Moderate priority",
    high: "High priority",
    critical: "Critical action",
  };
}

export function normalizeAdviceTemplate(
  input: Partial<NexoraDomainAdviceTemplate> & { id: string; label?: string }
): NexoraDomainAdviceTemplate {
  const id = String(input.id).trim();
  const label = String(input.label ?? id).trim() || id;

  return {
    id,
    label,
    tone: input.tone ?? "advisory",
    framingStyle: input.framingStyle ?? "what_why_action",
    ...(typeof input.introTemplate === "string" && input.introTemplate.trim()
      ? { introTemplate: input.introTemplate.trim() }
      : {}),
    ...(typeof input.implicationTemplate === "string" && input.implicationTemplate.trim()
      ? { implicationTemplate: input.implicationTemplate.trim() }
      : {}),
    ...(typeof input.actionTemplate === "string" && input.actionTemplate.trim()
      ? { actionTemplate: input.actionTemplate.trim() }
      : {}),
    tags: Array.isArray(input.tags) ? uniq(input.tags.map((value) => String(value))) : [],
    modeHints: Array.isArray(input.modeHints)
      ? uniq(input.modeHints.map((value) => String(value)))
      : [],
  };
}

export function normalizeDomainAdviceConfig(
  input: Partial<NexoraDomainAdviceConfig> & { domainId: string }
): NexoraDomainAdviceConfig {
  const defaultLabels = buildDefaultPriorityLabels();
  const customLabels = input.defaultPriorityLabels ?? defaultLabels;

  return {
    domainId: String(input.domainId).trim(),
    defaultTone: input.defaultTone ?? "advisory",
    defaultFramingStyle: input.defaultFramingStyle ?? "what_why_action",
    templates: Array.isArray(input.templates)
      ? input.templates.map((template) => normalizeAdviceTemplate(template))
      : [],
    defaultPriorityLabels: {
      low: customLabels.low ?? defaultLabels.low,
      moderate: customLabels.moderate ?? defaultLabels.moderate,
      high: customLabels.high ?? defaultLabels.high,
      critical: customLabels.critical ?? defaultLabels.critical,
    },
    managerHints: Array.isArray(input.managerHints)
      ? uniq(input.managerHints.map((value) => String(value)))
      : [],
    analystHints: Array.isArray(input.analystHints)
      ? uniq(input.analystHints.map((value) => String(value)))
      : [],
    executiveHints: Array.isArray(input.executiveHints)
      ? uniq(input.executiveHints.map((value) => String(value)))
      : [],
    tags: Array.isArray(input.tags) ? uniq(input.tags.map((value) => String(value))) : [],
  };
}

export function resolveAdviceTone(args: {
  domainConfig?: NexoraDomainAdviceConfig | null;
  mode?: string | null;
}): NexoraAdviceTone {
  switch (normalizeMode(args.mode)) {
    case "executive":
      return "executive";
    case "manager":
      return "strategic";
    case "analyst":
      return "analytical";
    case "scanner":
      return "operational";
    default:
      return args.domainConfig?.defaultTone ?? "advisory";
  }
}

export function resolveExecutiveFramingStyle(args: {
  domainConfig?: NexoraDomainAdviceConfig | null;
  mode?: string | null;
}): NexoraExecutiveFramingStyle {
  switch (normalizeMode(args.mode)) {
    case "executive":
      return "risk_impact_action";
    case "manager":
      return "what_why_action";
    case "analyst":
      return "signal_implication_response";
    case "scanner":
      return "scenario_consequence_recommendation";
    default:
      return args.domainConfig?.defaultFramingStyle ?? "what_why_action";
  }
}

export function inferAdvicePriority(args: {
  scenarioSeverity?: "low" | "moderate" | "high" | "critical" | null;
  riskLevel?: "low" | "moderate" | "high" | "critical" | null;
}): NexoraAdvicePriority {
  const scenarioPriority = args.scenarioSeverity ?? null;
  const riskPriority = args.riskLevel ?? null;

  return priorityRank(scenarioPriority) >= priorityRank(riskPriority)
    ? scenarioPriority ?? riskPriority ?? "moderate"
    : riskPriority ?? scenarioPriority ?? "moderate";
}

export function selectAdviceTemplate(args: {
  domainConfig?: NexoraDomainAdviceConfig | null;
  tone: NexoraAdviceTone;
  framingStyle: NexoraExecutiveFramingStyle;
  mode?: string | null;
}): NexoraDomainAdviceTemplate | null {
  const templates = Array.isArray(args.domainConfig?.templates)
    ? args.domainConfig!.templates!.map((template) => normalizeAdviceTemplate(template))
    : [];
  if (templates.length === 0) return null;

  const mode = normalizeMode(args.mode);
  let bestTemplate: NexoraDomainAdviceTemplate | null = null;
  let bestScore = -1;

  for (const template of templates) {
    let score = 0;
    if (template.tone === args.tone) score += 4;
    if (template.framingStyle === args.framingStyle) score += 4;
    if (mode && (template.modeHints ?? []).some((hint) => normalizeText(hint) === mode)) score += 2;

    if (score > bestScore) {
      bestTemplate = template;
      bestScore = score;
      continue;
    }

    if (score === bestScore && bestTemplate) {
      const ordered = [bestTemplate, template].sort(sortTemplates);
      bestTemplate = ordered[0];
    }
  }

  return bestScore > 0 ? bestTemplate : null;
}

export function buildExecutiveSummaryBlocks(args: {
  framingStyle: NexoraExecutiveFramingStyle;
  headline?: string;
  implication?: string;
  recommendedAction?: string;
  priority?: NexoraAdvicePriority;
}): NexoraExecutiveSummaryBlock[] {
  const priority = args.priority ?? "moderate";

  const blocksByStyle: Record<
    Exclude<NexoraExecutiveFramingStyle, "custom">,
    NexoraExecutiveSummaryBlock[]
  > = {
    what_why_action: [
      {
        id: "situation",
        label: "What happened",
        content: args.headline,
        priority: 10,
        tags: ["situation", priority],
      },
      {
        id: "implication",
        label: "Why it matters",
        content: args.implication,
        priority: 20,
        tags: ["implication", priority],
      },
      {
        id: "action",
        label: "What to do next",
        content: args.recommendedAction,
        priority: 30,
        tags: ["action", priority],
      },
    ],
    risk_impact_action: [
      {
        id: "risk",
        label: "Key risk",
        content: args.headline,
        priority: 10,
        tags: ["risk", priority],
      },
      {
        id: "impact",
        label: "Business impact",
        content: args.implication,
        priority: 20,
        tags: ["impact", priority],
      },
      {
        id: "action",
        label: "Recommended action",
        content: args.recommendedAction,
        priority: 30,
        tags: ["action", priority],
      },
    ],
    signal_implication_response: [
      {
        id: "signal",
        label: "Signal",
        content: args.headline,
        priority: 10,
        tags: ["signal", priority],
      },
      {
        id: "implication",
        label: "Implication",
        content: args.implication,
        priority: 20,
        tags: ["implication", priority],
      },
      {
        id: "response",
        label: "Response",
        content: args.recommendedAction,
        priority: 30,
        tags: ["response", priority],
      },
    ],
    scenario_consequence_recommendation: [
      {
        id: "scenario",
        label: "Scenario",
        content: args.headline,
        priority: 10,
        tags: ["scenario", priority],
      },
      {
        id: "consequence",
        label: "Consequence",
        content: args.implication,
        priority: 20,
        tags: ["consequence", priority],
      },
      {
        id: "recommendation",
        label: "Recommendation",
        content: args.recommendedAction,
        priority: 30,
        tags: ["recommendation", priority],
      },
    ],
  };

  const blocks =
    args.framingStyle === "custom"
      ? [
          {
            id: "headline",
            label: "Headline",
            content: args.headline,
            priority: 10,
            tags: ["headline", priority],
          },
          {
            id: "implication",
            label: "Implication",
            content: args.implication,
            priority: 20,
            tags: ["implication", priority],
          },
          {
            id: "action",
            label: "Action",
            content: args.recommendedAction,
            priority: 30,
            tags: ["action", priority],
          },
        ]
      : blocksByStyle[args.framingStyle];

  return blocks.map((block) => ({
    ...block,
    tags: block.tags ?? [],
  }));
}

export function buildDomainAdviceInterpretation(args: {
  domainId?: string | null;
  domainConfig?: NexoraDomainAdviceConfig | null;
  mode?: string | null;
  headline?: string;
  implication?: string;
  recommendedAction?: string;
  scenarioSeverity?: "low" | "moderate" | "high" | "critical" | null;
  riskLevel?: "low" | "moderate" | "high" | "critical" | null;
}): NexoraDomainAdviceInterpretation {
  const config = args.domainConfig ? normalizeDomainAdviceConfig(args.domainConfig) : null;
  const tone = resolveAdviceTone({ domainConfig: config, mode: args.mode });
  const framingStyle = resolveExecutiveFramingStyle({ domainConfig: config, mode: args.mode });
  const priority = inferAdvicePriority({
    scenarioSeverity: args.scenarioSeverity,
    riskLevel: args.riskLevel,
  });
  const selectedTemplate = selectAdviceTemplate({
    domainConfig: config,
    tone,
    framingStyle,
    mode: args.mode,
  });

  const headline =
    args.headline?.trim() ||
    selectedTemplate?.introTemplate ||
    undefined;
  const implication =
    args.implication?.trim() ||
    selectedTemplate?.implicationTemplate ||
    undefined;
  const recommendedAction =
    args.recommendedAction?.trim() ||
    selectedTemplate?.actionTemplate ||
    undefined;

  const summaryBlocks = buildExecutiveSummaryBlocks({
    framingStyle,
    headline,
    implication,
    recommendedAction,
    priority,
  });

  const notes: string[] = [];
  if (args.domainId ?? config?.domainId) {
    notes.push(`Domain: ${args.domainId ?? config?.domainId}`);
  }
  if (args.mode) {
    notes.push(`Mode: ${args.mode}`);
  }
  if (selectedTemplate) {
    notes.push(`Template: ${selectedTemplate.id}`);
  }

  return {
    domainId: args.domainId ?? config?.domainId ?? null,
    tone,
    framingStyle,
    priority,
    ...(headline ? { headline } : {}),
    ...(implication ? { implication } : {}),
    ...(recommendedAction ? { recommendedAction } : {}),
    summaryBlocks,
    notes,
  };
}

const BUSINESS_ADVICE_CONFIG: NexoraDomainAdviceConfig = normalizeDomainAdviceConfig({
  domainId: "business",
  defaultTone: "strategic",
  defaultFramingStyle: "what_why_action",
  templates: [
    {
      id: "business_manager_brief",
      label: "Business Manager Brief",
      tone: "strategic",
      framingStyle: "what_why_action",
      introTemplate: "Operational pressure is beginning to affect business continuity.",
      implicationTemplate: "If the pressure persists, downstream service and customer outcomes will weaken.",
      actionTemplate: "Stabilize the exposed dependency and protect the available buffer.",
      tags: ["business", "manager"],
      modeHints: ["manager"],
    },
    {
      id: "business_exec_brief",
      label: "Business Executive Brief",
      tone: "executive",
      framingStyle: "risk_impact_action",
      introTemplate: "Business risk is moving beyond a local disruption.",
      implicationTemplate: "The current issue is becoming a system-level constraint with customer impact.",
      actionTemplate: "Protect critical commitments while reducing short-term fragility.",
      tags: ["business", "executive"],
      modeHints: ["executive"],
    },
    {
      id: "business_analyst_brief",
      label: "Business Analyst Brief",
      tone: "analytical",
      framingStyle: "signal_implication_response",
      introTemplate: "Business pressure is concentrating around a small set of exposed flow nodes.",
      implicationTemplate: "Without intervention, the current bottleneck will amplify KPI stress across fulfillment, cash, and customer trust.",
      actionTemplate: "Trace the pressure path, protect the buffer, and compare at least one stabilization scenario.",
      tags: ["business", "analyst"],
      modeHints: ["analyst"],
    },
  ],
  managerHints: [
    "Frame recommendations around business continuity, bottlenecks, and prioritization.",
    "Keep wording concise, decision-oriented, and grounded in operating reality.",
  ],
  analystHints: [
    "Connect pressure signals to dependencies, KPIs, and downstream customer impact.",
    "Make bottlenecks, flow constraints, and cascade paths explicit.",
  ],
  executiveHints: [
    "Emphasize business consequence, urgency, and the next stabilizing move.",
    "Tie the recommendation to continuity, customer outcomes, and downside exposure.",
  ],
  tags: ["business", "advice"],
});

const FINANCE_ADVICE_CONFIG: NexoraDomainAdviceConfig = normalizeDomainAdviceConfig({
  domainId: "finance",
  defaultTone: "analytical",
  defaultFramingStyle: "risk_impact_action",
  templates: [
    {
      id: "finance_analyst_brief",
      label: "Finance Analyst Brief",
      tone: "analytical",
      framingStyle: "risk_impact_action",
      introTemplate: "Financial exposure is increasing across the system.",
      implicationTemplate: "Liquidity and downside resilience are weakening under current pressure.",
      actionTemplate: "Contain the concentrated exposure and preserve funding flexibility.",
      tags: ["finance", "analyst"],
      modeHints: ["analyst"],
    },
    {
      id: "finance_exec_brief",
      label: "Finance Executive Brief",
      tone: "executive",
      framingStyle: "risk_impact_action",
      introTemplate: "Financial fragility is becoming more material.",
      implicationTemplate: "If not contained, the pressure will reduce capital stability and decision flexibility.",
      actionTemplate: "Prioritize liquidity protection and reduce immediate downside concentration.",
      tags: ["finance", "executive"],
      modeHints: ["executive", "manager"],
    },
    {
      id: "finance_manager_brief",
      label: "Finance Manager Brief",
      tone: "strategic",
      framingStyle: "what_why_action",
      introTemplate: "Financial pressure is concentrating in the most exposed part of the system.",
      implicationTemplate: "If the current pattern persists, liquidity and capital resilience will weaken together.",
      actionTemplate: "Protect liquidity first, then reduce the most concentrated downside exposure.",
      tags: ["finance", "manager"],
      modeHints: ["manager"],
    },
  ],
  managerHints: [
    "Highlight the immediate financial consequence of liquidity and exposure stress.",
    "Frame the recommendation around resilience, flexibility, and downside protection.",
  ],
  analystHints: [
    "Use exposure, liquidity, volatility, and downside terminology precisely.",
    "Make contagion paths and concentrated risk channels explicit.",
  ],
  executiveHints: [
    "Connect risk directly to capital resilience and funding decisions.",
    "Summarize fragility in terms of market stability and strategic flexibility.",
  ],
  tags: ["finance", "advice"],
});

const DEVOPS_ADVICE_CONFIG: NexoraDomainAdviceConfig = normalizeDomainAdviceConfig({
  domainId: "devops",
  defaultTone: "operational",
  defaultFramingStyle: "signal_implication_response",
  templates: [
    {
      id: "devops_operational_brief",
      label: "DevOps Operational Brief",
      tone: "operational",
      framingStyle: "signal_implication_response",
      introTemplate: "Service reliability signals are deteriorating.",
      implicationTemplate: "Dependency strain is likely to increase latency and failure propagation.",
      actionTemplate: "Contain the unstable dependency and activate fallback capacity.",
      tags: ["devops", "operations"],
      modeHints: ["scanner", "analyst"],
    },
    {
      id: "devops_manager_brief",
      label: "DevOps Manager Brief",
      tone: "strategic",
      framingStyle: "scenario_consequence_recommendation",
      introTemplate: "A technical issue is becoming a broader service risk.",
      implicationTemplate: "Without intervention, the disruption will spread through critical dependencies.",
      actionTemplate: "Protect priority services first, then reduce the unstable dependency path.",
      tags: ["devops", "manager"],
      modeHints: ["manager"],
    },
    {
      id: "devops_exec_brief",
      label: "DevOps Executive Brief",
      tone: "executive",
      framingStyle: "risk_impact_action",
      introTemplate: "Service instability is becoming a broader reliability and continuity risk.",
      implicationTemplate: "If the current dependency hotspot is not contained, customer-visible reliability will degrade and recovery will become more expensive.",
      actionTemplate: "Contain the critical dependency path first, then protect throughput and recovery capacity.",
      tags: ["devops", "executive"],
      modeHints: ["executive"],
    },
  ],
  managerHints: [
    "Translate service issues into continuity, reliability, and customer-facing impact.",
    "Prioritize stabilizing the hottest dependency path before broad remediation.",
  ],
  analystHints: [
    "Focus on dependencies, signal quality, propagation paths, and containment.",
    "Make latency, error-rate, and backlog pressure explicit in the recommendation.",
  ],
  executiveHints: [
    "Summarize reliability risk in clear operational terms for engineering leaders.",
    "Connect the issue to service continuity, resilience, and the next stabilizing move.",
  ],
  tags: ["devops", "advice"],
});

const STRATEGY_ADVICE_CONFIG: NexoraDomainAdviceConfig = normalizeDomainAdviceConfig({
  domainId: "strategy",
  defaultTone: "executive",
  defaultFramingStyle: "scenario_consequence_recommendation",
  templates: [
    {
      id: "strategy_exec_brief",
      label: "Strategy Executive Brief",
      tone: "executive",
      framingStyle: "scenario_consequence_recommendation",
      introTemplate: "Strategic pressure is shifting the system against current objectives.",
      implicationTemplate: "If the current pattern continues, strategic position and execution confidence will weaken.",
      actionTemplate: "Reduce near-term pressure while protecting the most important strategic commitments.",
      tags: ["strategy", "executive"],
      modeHints: ["executive", "manager"],
    },
    {
      id: "strategy_analyst_brief",
      label: "Strategy Analyst Brief",
      tone: "analytical",
      framingStyle: "signal_implication_response",
      introTemplate: "Competitive and execution signals are becoming less favorable.",
      implicationTemplate: "The observed pattern suggests weakening momentum and higher strategic fragility.",
      actionTemplate: "Prioritize the exposed objective and reinforce the constrained execution path.",
      tags: ["strategy", "analyst"],
      modeHints: ["analyst"],
    },
  ],
  managerHints: [
    "Keep the framing tied to decisions and objectives.",
  ],
  analystHints: [
    "Connect signals to strategic implications and system constraints.",
  ],
  executiveHints: [
    "Lead with consequence and recommended action.",
  ],
  tags: ["strategy", "advice"],
});

export const DEFAULT_DOMAIN_ADVICE_CONFIGS: Record<string, NexoraDomainAdviceConfig> = {
  business: BUSINESS_ADVICE_CONFIG,
  finance: FINANCE_ADVICE_CONFIG,
  devops: DEVOPS_ADVICE_CONFIG,
  strategy: STRATEGY_ADVICE_CONFIG,
};

export function getDomainAdviceConfig(
  registry: Record<string, NexoraDomainAdviceConfig>,
  domainId?: string | null
): NexoraDomainAdviceConfig | null {
  const normalizedDomainId = String(domainId ?? "").trim();
  if (!normalizedDomainId) return null;
  const config = registry?.[normalizedDomainId];
  return config ? normalizeDomainAdviceConfig(config) : null;
}

export function listAdviceTemplates(
  config?: NexoraDomainAdviceConfig | null
): NexoraDomainAdviceTemplate[] {
  if (!config) return [];
  return (config.templates ?? [])
    .map((template) => normalizeAdviceTemplate(template))
    .sort(sortTemplates);
}
