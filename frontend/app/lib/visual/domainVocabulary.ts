import { toSafeLocaleDomainIdForRollout } from "../domain/nexoraDomainPackRollout.ts";
import { getNexoraLocalePack } from "../domain/nexoraDomainPackRegistry.ts";
import { getB13PayloadAliasExtension } from "../domain/domainVocabularyRegistry.ts";

export type DomainVocabularyEntry = {
  match: string[];
  displayName?: string;
  aliases?: string[];
  /** B.6 — lowercase tokens/phrases to score against scanner summary / driver text / user signals. */
  signalHints?: string[];
  /** B.6 — short object caption fragment (2–4 words), domain-specific. */
  clarityPhrase?: string;
  templates?: DomainLabelTemplate;
  primaryTitle: string;
  primaryBody: string;
  affectedTitle: string;
  affectedBody: string;
  contextTitle: string;
  contextBody: string;
};

export type DomainLabelSeverity = "low" | "medium" | "high" | "critical";

export type DomainLabelTemplate = {
  primaryTitle?: string;
  primaryBody?: string;
  affectedTitle?: string;
  affectedBody?: string;
  contextTitle?: string;
  contextBody?: string;
  primarySeverityTitles?: Partial<Record<DomainLabelSeverity, string>>;
  primarySeverityBodies?: Partial<Record<DomainLabelSeverity, string>>;
  affectedSeverityTitles?: Partial<Record<DomainLabelSeverity, string>>;
  affectedSeverityBodies?: Partial<Record<DomainLabelSeverity, string>>;
  contextSeverityTitles?: Partial<Record<DomainLabelSeverity, string>>;
  contextSeverityBodies?: Partial<Record<DomainLabelSeverity, string>>;
};

export type DomainVocabularyPack = {
  domainId: string;
  entries: DomainVocabularyEntry[];
};

function normalizeDomainKey(value: unknown): string {
  return String(value ?? "").trim().toLowerCase();
}

function cleanObjectName(value: unknown): string {
  const normalized = normalizeDomainKey(value)
    .replace(/^obj_+/, "")
    .replace(/_\d+$/, "")
    .replace(/[_-]+/g, " ")
    .trim();
  if (!normalized) return "";
  return normalized
    .split(/\s+/)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

const DEFAULT_DOMAIN_VOCABULARY_PACK: DomainVocabularyPack = {
  domainId: "default",
  entries: [
    {
      match: ["risk", "issue", "constraint"],
      displayName: "Risk",
      aliases: ["risk", "issue", "constraint"],
      primaryTitle: "Primary Risk",
      primaryBody: "Main pressure source",
      affectedTitle: "Downstream Impact",
      affectedBody: "Impact linked to active risk",
      contextTitle: "Related Context",
      contextBody: "Linked to active pressure",
    },
    {
      match: ["system", "platform", "service"],
      displayName: "Service",
      aliases: ["system", "platform", "service"],
      primaryTitle: "System Pressure",
      primaryBody: "Observed system pressure",
      affectedTitle: "System Impact",
      affectedBody: "System impact signal",
      contextTitle: "System Context",
      contextBody: "Linked system context",
    },
  ],
};

const RETAIL_DOMAIN_VOCABULARY_PACK: DomainVocabularyPack = {
  domainId: "retail",
  entries: [
    {
      match: ["delivery", "shipment", "shipping", "logistics", "fulfillment"],
      displayName: "Delivery",
      aliases: ["shipment", "shipping", "logistics", "fulfillment", "carrier"],
      signalHints: [
        "delivery",
        "late delivery",
        "shipping delay",
        "shipment delay",
        "logistics",
        "logistics issue",
        "carrier",
        "lead time",
        "supplier delay",
        "transit",
        "backorder",
        "delay",
        "delays",
      ],
      clarityPhrase: "Delivery delay risk",
      templates: {
        primaryTitle: "{object} — Delay Pressure",
        primaryBody: "Main delivery pressure source",
        affectedTitle: "{object} — Delivery Impact",
        affectedBody: "Downstream delivery impact",
        contextTitle: "{object} — Delivery Context",
        contextBody: "Linked to delivery pressure",
        primarySeverityTitles: {
          low: "{object} — Delay Signal",
          medium: "{object} — Delay Pressure",
          high: "{object} — Elevated Delay Pressure",
          critical: "{object} — Critical Delay Pressure",
        },
        primarySeverityBodies: {
          low: "Observed pressure signal",
          medium: "Active pressure source",
          high: "Elevated pressure source",
          critical: "Critical pressure source",
        },
      },
      primaryTitle: "Delay Pressure",
      primaryBody: "Main delivery pressure source",
      affectedTitle: "Delivery Impact",
      affectedBody: "Downstream delivery impact",
      contextTitle: "Delivery Context",
      contextBody: "Linked to delivery pressure",
    },
    {
      match: ["inventory", "stock", "warehouse", "buffer"],
      displayName: "Inventory",
      aliases: ["stock", "warehouse", "buffer", "safety stock"],
      signalHints: [
        "inventory",
        "low inventory",
        "low stock",
        "stock",
        "stockout",
        "out of stock",
        "oos",
        "warehouse",
        "shortage",
        "depleted",
      ],
      clarityPhrase: "Inventory shortage",
      templates: {
        primaryTitle: "{object} — Stock Pressure",
        primaryBody: "Inventory flow under pressure",
        affectedTitle: "{object} — Stock Impact",
        affectedBody: "Inventory exposed to risk",
        contextTitle: "{object} — Inventory Context",
        contextBody: "Linked to stock pressure",
        primarySeverityTitles: {
          low: "{object} — Stock Signal",
          medium: "{object} — Stock Pressure",
          high: "{object} — Elevated Stock Pressure",
          critical: "{object} — Critical Stock Pressure",
        },
        primarySeverityBodies: {
          low: "Observed pressure signal",
          medium: "Active pressure source",
          high: "Elevated pressure source",
          critical: "Critical pressure source",
        },
      },
      primaryTitle: "Stock Pressure",
      primaryBody: "Inventory flow under pressure",
      affectedTitle: "Stock Impact",
      affectedBody: "Inventory exposed to risk",
      contextTitle: "Inventory Context",
      contextBody: "Linked to stock pressure",
    },
    {
      match: ["supplier", "supply", "vendor", "procurement"],
      displayName: "Supplier",
      aliases: ["supply", "vendor", "procurement", "sourcing"],
      signalHints: [
        "supplier",
        "suppliers",
        "vendor",
        "supply",
        "supply chain",
        "procurement",
        "upstream",
        "sourcing",
      ],
      clarityPhrase: "Supply pressure",
      templates: {
        primaryTitle: "{object} — Supply Risk",
        primaryBody: "Source-side pressure signal",
        affectedTitle: "{object} — Supply Impact",
        affectedBody: "Supplier-side impact",
        contextTitle: "{object} — Supply Context",
        contextBody: "Linked to supply pressure",
        primarySeverityBodies: {
          low: "Observed pressure signal",
          medium: "Source-side pressure signal",
          high: "Elevated pressure source",
          critical: "Critical pressure source",
        },
      },
      primaryTitle: "Supply Risk",
      primaryBody: "Source-side pressure signal",
      affectedTitle: "Supply Impact",
      affectedBody: "Supplier-side impact",
      contextTitle: "Supply Context",
      contextBody: "Linked to supply pressure",
    },
    {
      match: ["cash", "finance", "financial", "liquidity"],
      displayName: "Cash",
      aliases: ["finance", "financial", "liquidity", "working capital"],
      signalHints: ["liquidity", "cash flow", "working capital", "runway", "financing"],
      clarityPhrase: "Liquidity pressure",
      templates: {
        primaryTitle: "{object} — Liquidity Pressure",
        primaryBody: "Financial strain signal",
        primarySeverityTitles: {
          low: "{object} — Liquidity Signal",
          medium: "{object} — Liquidity Pressure",
          high: "{object} — Elevated Liquidity Pressure",
          critical: "{object} — Acute Liquidity Pressure",
        },
        primarySeverityBodies: {
          low: "Observed pressure signal",
          medium: "Active pressure source",
          high: "Elevated pressure source",
          critical: "Critical pressure source",
        },
      },
      primaryTitle: "Financial Pressure",
      primaryBody: "Financial strain signal",
      affectedTitle: "Financial Impact",
      affectedBody: "Downstream financial impact",
      contextTitle: "Financial Context",
      contextBody: "Linked to financial pressure",
    },
    {
      match: ["price", "pricing", "margin", "revenue", "cost", "profit"],
      displayName: "Pricing",
      aliases: ["price", "margin", "revenue", "cost", "profit", "cogs", "expense"],
      signalHints: [
        "margin",
        "margins",
        "pricing",
        "revenue",
        "cost",
        "costs",
        "cogs",
        "profit",
        "profitability",
        "expense",
        "expenses",
      ],
      clarityPhrase: "Margin pressure",
      templates: {
        primaryTitle: "{object} — Margin Pressure",
        primaryBody: "Commercial pressure signal",
        primarySeverityBodies: {
          low: "Observed pressure signal",
          medium: "Commercial pressure signal",
          high: "Elevated pressure source",
          critical: "Critical pressure source",
        },
      },
      primaryTitle: "Margin Pressure",
      primaryBody: "Commercial pressure signal",
      affectedTitle: "Margin Impact",
      affectedBody: "Commercial impact signal",
      contextTitle: "Pricing Context",
      contextBody: "Linked to pricing pressure",
    },
    {
      match: ["demand", "orders", "sales", "volume"],
      displayName: "Demand",
      aliases: ["orders", "sales", "volume", "storefront"],
      signalHints: [
        "demand",
        "demand drop",
        "orders",
        "order volume",
        "sales",
        "sales drop",
        "slowing demand",
        "customer demand",
      ],
      clarityPhrase: "Demand weakness",
      primaryTitle: "Demand Pressure",
      primaryBody: "Demand-side pressure signal",
      affectedTitle: "Demand Impact",
      affectedBody: "Volume and orders impact",
      contextTitle: "Demand Context",
      contextBody: "Linked to demand signals",
    },
    {
      match: ["customer", "sla", "service", "satisfaction"],
      displayName: "Service",
      aliases: ["customer", "sla", "satisfaction"],
      signalHints: ["customer", "sla", "satisfaction", "cx", "support"],
      clarityPhrase: "Service pressure",
      primaryTitle: "Service Pressure",
      primaryBody: "Customer-facing pressure signal",
      affectedTitle: "Service Impact",
      affectedBody: "Customer experience impact",
      contextTitle: "Service Context",
      contextBody: "Linked to service pressure",
    },
  ],
};

const FINANCE_DOMAIN_VOCABULARY_PACK: DomainVocabularyPack = {
  domainId: "finance",
  entries: [
    {
      match: ["cash", "liquidity", "working capital"],
      displayName: "Cash",
      aliases: ["liquidity", "working capital"],
      signalHints: ["liquidity", "cash", "runway", "covenant", "refinance", "working capital"],
      clarityPhrase: "Liquidity risk rising",
      templates: {
        primaryTitle: "{object} — Liquidity Pressure",
        primarySeverityTitles: {
          low: "{object} — Liquidity Signal",
          medium: "{object} — Liquidity Pressure",
          high: "{object} — Elevated Liquidity Pressure",
          critical: "{object} — Acute Liquidity Pressure",
        },
      },
      primaryTitle: "Liquidity Pressure",
      primaryBody: "Liquidity under pressure",
      affectedTitle: "Liquidity Impact",
      affectedBody: "Liquidity impact signal",
      contextTitle: "Liquidity Context",
      contextBody: "Linked to liquidity pressure",
    },
    {
      match: ["margin", "pricing", "revenue", "cost", "expense"],
      displayName: "Pricing",
      aliases: ["margin", "revenue", "cost", "expense", "spread"],
      signalHints: ["margin", "margins", "cost", "costs", "expense", "pricing", "spread", "profitability", "cogs"],
      clarityPhrase: "Cost & margin pressure",
      templates: {
        primaryTitle: "{object} — Margin Pressure",
        primarySeverityBodies: {
          low: "Observed pressure signal",
          medium: "Commercial pressure signal",
          high: "Elevated pressure source",
          critical: "Critical pressure source",
        },
      },
      primaryTitle: "Margin Pressure",
      primaryBody: "Commercial pressure signal",
      affectedTitle: "Margin Impact",
      affectedBody: "Margin impact signal",
      contextTitle: "Margin Context",
      contextBody: "Linked to margin pressure",
    },
  ],
};

const DEVOPS_DOMAIN_VOCABULARY_PACK: DomainVocabularyPack = {
  domainId: "devops",
  entries: [
    {
      match: ["deploy", "release", "pipeline"],
      displayName: "Release",
      aliases: ["deploy", "pipeline", "ci", "cd"],
      signalHints: ["deploy", "deployment", "release", "pipeline", "rollback", "hotfix", "change freeze"],
      clarityPhrase: "Release risk rising",
      templates: {
        primaryTitle: "{object} — Release Risk",
        primarySeverityTitles: {
          low: "{object} — Release Signal",
          medium: "{object} — Release Risk",
          high: "{object} — Elevated Release Risk",
          critical: "{object} — Critical Release Risk",
        },
      },
      primaryTitle: "Release Pressure",
      primaryBody: "Release pipeline under pressure",
      affectedTitle: "Release Impact",
      affectedBody: "Deployment impact signal",
      contextTitle: "Release Context",
      contextBody: "Linked to release pressure",
    },
    {
      match: ["service", "latency", "incident", "availability"],
      displayName: "Service",
      aliases: ["latency", "incident", "availability", "sre"],
      signalHints: [
        "latency",
        "incident",
        "outage",
        "degradation",
        "error budget",
        "availability",
        "on-call",
        "bottleneck",
      ],
      clarityPhrase: "Service bottleneck",
      templates: {
        primaryTitle: "{object} — Operational Pressure",
        primarySeverityTitles: {
          low: "{object} — Service Signal",
          medium: "{object} — Operational Pressure",
          high: "{object} — Elevated Operational Pressure",
          critical: "{object} — Critical Operational Pressure",
        },
      },
      primaryTitle: "Service Pressure",
      primaryBody: "Service reliability signal",
      affectedTitle: "Service Impact",
      affectedBody: "Operational impact signal",
      contextTitle: "Service Context",
      contextBody: "Linked to service pressure",
    },
  ],
};

const PMO_DOMAIN_VOCABULARY_PACK: DomainVocabularyPack = {
  domainId: "pmo",
  entries: [
    {
      match: ["timeline", "milestone", "schedule"],
      displayName: "Timeline",
      aliases: ["milestone", "schedule", "deadline"],
      signalHints: ["milestone", "schedule", "timeline", "slip", "critical path", "dependency"],
      clarityPhrase: "Schedule pressure",
      templates: {
        primaryTitle: "{object} — Delivery Variance",
        primarySeverityTitles: {
          low: "{object} — Variance Signal",
          medium: "{object} — Delivery Variance",
          high: "{object} — Elevated Delivery Variance",
          critical: "{object} — Critical Delivery Variance",
        },
      },
      primaryTitle: "Schedule Pressure",
      primaryBody: "Timeline under pressure",
      affectedTitle: "Schedule Impact",
      affectedBody: "Timeline impact signal",
      contextTitle: "Schedule Context",
      contextBody: "Linked to schedule pressure",
    },
    {
      match: ["resource", "capacity", "program"],
      displayName: "Capacity",
      aliases: ["resource", "program", "bandwidth"],
      signalHints: ["capacity", "resource", "bandwidth", "burnout", "overcommit", "throughput"],
      clarityPhrase: "Capacity bottleneck",
      templates: {
        primaryTitle: "{object} — Scope Pressure",
        primarySeverityBodies: {
          low: "Observed pressure signal",
          medium: "Active pressure source",
          high: "Elevated pressure source",
          critical: "Critical pressure source",
        },
      },
      primaryTitle: "Capacity Pressure",
      primaryBody: "Program capacity signal",
      affectedTitle: "Capacity Impact",
      affectedBody: "Capacity impact signal",
      contextTitle: "Capacity Context",
      contextBody: "Linked to capacity pressure",
    },
  ],
};

const SECURITY_DOMAIN_VOCABULARY_PACK: DomainVocabularyPack = {
  domainId: "security",
  entries: [
    {
      match: ["access", "identity", "credential"],
      displayName: "Access",
      aliases: ["identity", "credential", "iam"],
      signalHints: ["access", "identity", "credential", "privilege", "mfa", "sso"],
      clarityPhrase: "Access exposure",
      templates: {
        primaryTitle: "{object} — Exposure Signal",
        primarySeverityTitles: {
          low: "{object} — Exposure Signal",
          medium: "{object} — Exposure Risk",
          high: "{object} — Elevated Exposure Risk",
          critical: "{object} — Critical Exposure Risk",
        },
      },
      primaryTitle: "Access Risk",
      primaryBody: "Identity pressure signal",
      affectedTitle: "Access Impact",
      affectedBody: "Access impact signal",
      contextTitle: "Access Context",
      contextBody: "Linked to access risk",
    },
    {
      match: ["threat", "vulnerability", "incident"],
      displayName: "Threat",
      aliases: ["vulnerability", "incident", "malware"],
      signalHints: ["threat", "vulnerability", "exploit", "malware", "breach", "patch"],
      clarityPhrase: "Threat pressure",
      templates: {
        primaryTitle: "{object} — Endpoint Risk",
        primarySeverityTitles: {
          low: "{object} — Endpoint Signal",
          medium: "{object} — Endpoint Risk",
          high: "{object} — Elevated Endpoint Risk",
          critical: "{object} — Critical Endpoint Risk",
        },
      },
      primaryTitle: "Threat Pressure",
      primaryBody: "Threat pressure signal",
      affectedTitle: "Threat Impact",
      affectedBody: "Security impact signal",
      contextTitle: "Threat Context",
      contextBody: "Linked to threat pressure",
    },
  ],
};

/** B.13 — supply chain uses retail narrative pack with distinct domain id for maturity hooks. */
const SUPPLY_CHAIN_DOMAIN_VOCABULARY_PACK: DomainVocabularyPack = {
  ...RETAIL_DOMAIN_VOCABULARY_PACK,
  domainId: "supply_chain",
};

const DOMAIN_VOCABULARY_PACKS: Record<string, DomainVocabularyPack> = {
  default: DEFAULT_DOMAIN_VOCABULARY_PACK,
  retail: RETAIL_DOMAIN_VOCABULARY_PACK,
  finance: FINANCE_DOMAIN_VOCABULARY_PACK,
  devops: DEVOPS_DOMAIN_VOCABULARY_PACK,
  pmo: PMO_DOMAIN_VOCABULARY_PACK,
  security: SECURITY_DOMAIN_VOCABULARY_PACK,
  supply_chain: SUPPLY_CHAIN_DOMAIN_VOCABULARY_PACK,
};

/** Canonical stems for `applyFragilityScenePayload` semantic matching (aligned with canonicalId). */
const CORE_PAYLOAD_ALIAS_GROUPS: Record<string, string[]> = {
  bottleneck: ["bottleneck", "delay", "disruption", "constraint", "fulfillment", "flow", "operations"],
  delivery: ["delivery", "flow", "fulfillment", "throughput", "logistics", "execution", "shipment", "carrier"],
  supplier: ["supplier", "vendor", "dependency", "upstream", "source", "procurement"],
  inventory: ["inventory", "buffer", "capacity", "reserve", "coverage", "stock", "warehouse"],
  risk_zone: ["risk", "volatility", "credit", "disruption", "exposure", "fragility"],
  buffer: ["buffer", "liquidity", "reserve"],
  demand: ["demand", "orders", "sales", "volume", "storefront"],
  pricing: ["margin", "price", "pricing", "revenue", "cost", "profit", "cogs", "expense"],
  cash: ["cash", "liquidity", "working", "capital", "runway"],
  margin: ["margin", "spread", "profitability"],
  timeline: ["timeline", "milestone", "schedule", "deadline", "variance"],
  capacity: ["capacity", "resource", "program", "bandwidth", "scope"],
  release: ["release", "deploy", "deployment", "pipeline", "rollback", "hotfix"],
  service: ["service", "latency", "incident", "availability", "sre", "outage", "degradation"],
};

const DOMAIN_PAYLOAD_ALIAS_OVERRIDES: Partial<Record<string, Record<string, string[]>>> = {
  retail: {
    delivery: [
      "late delivery",
      "shipping delay",
      "logistics issue",
      "lead time",
      "supplier delay",
      "transit",
      "backorder",
    ],
    inventory: ["low stock", "out of stock", "oos", "stockout", "safety stock", "shortage", "depleted"],
    supplier: ["supply chain", "sourcing"],
    demand: ["demand drop", "sales slump", "order volume", "slowing demand"],
    pricing: ["shrinking margin", "margin squeeze", "rising costs", "cost pressure"],
  },
  finance: {
    cash: ["liquidity crunch", "cash constraint", "covenant"],
    pricing: ["margin compression", "rate exposure", "fx exposure"],
    margin: ["margin erosion"],
  },
  devops: {
    service: ["outage", "degradation", "error budget", "sre"],
    release: ["rollback", "hotfix", "canary"],
  },
  pmo: {
    timeline: ["slip", "dependency", "critical path"],
    capacity: ["bandwidth", "burnout", "overcommit"],
  },
  security: {
    access: ["privilege", "credential leak", "mfa"],
    threat: ["exploit", "malware", "breach"],
  },
};

function mergePayloadAliasGroups(
  base: Record<string, string[]>,
  overlay: Record<string, string[]> | undefined
): Record<string, string[]> {
  if (!overlay) return { ...base };
  const next: Record<string, string[]> = { ...base };
  for (const [k, v] of Object.entries(overlay)) {
    next[k] = Array.from(new Set([...(next[k] ?? []), ...v]));
  }
  return next;
}

/** Merged alias groups for fragility payload → scene object resolution (B.6). */
export function expandPayloadAliasTokensForDomain(domainId?: string | null): Record<string, string[]> {
  const d = getEffectiveVocabularyDomain(domainId);
  const withDomain = mergePayloadAliasGroups(CORE_PAYLOAD_ALIAS_GROUPS, DOMAIN_PAYLOAD_ALIAS_OVERRIDES[d]);
  const withB13 = mergePayloadAliasGroups(withDomain, getB13PayloadAliasExtension(domainId));
  return mergePayloadAliasGroups(withB13, getNexoraLocalePack(toSafeLocaleDomainIdForRollout(domainId)).vocabulary);
}

export function getDomainVocabularyPack(domainId?: string | null): DomainVocabularyPack {
  const d = getEffectiveVocabularyDomain(domainId);
  return DOMAIN_VOCABULARY_PACKS[d] ?? DOMAIN_VOCABULARY_PACKS.default;
}

/** Short headline used when shaping domain-aware pipeline insight lines. */
export function domainDefaultInsightHeadline(domainId?: string | null): string {
  const d = getEffectiveVocabularyDomain(domainId);
  const map: Record<string, string> = {
    retail: "Supply pressure",
    supply_chain: "Flow / supplier pressure",
    finance: "Liquidity pressure",
    devops: "Reliability pressure",
    pmo: "Delivery risk",
    security: "Exposure rising",
    default: "Operational pressure",
  };
  return map[d] ?? map.default;
}

export function getEffectiveVocabularyDomain(domainId?: string | null): string {
  const normalized = normalizeDomainKey(domainId);
  if (!normalized) return "retail";
  if (DOMAIN_VOCABULARY_PACKS[normalized]) return normalized;
  if (
    normalized.includes("supply_chain") ||
    normalized.includes("supply-chain") ||
    normalized === "scm" ||
    normalized.includes("supplier_network")
  ) {
    return "supply_chain";
  }
  if (normalized.includes("retail")) return "retail";
  if (normalized.includes("finance") || normalized.includes("finops")) return "finance";
  if (normalized.includes("devops") || normalized.includes("ops") || normalized.includes("platform")) return "devops";
  if (normalized.includes("pmo") || normalized.includes("program") || normalized.includes("project")) return "pmo";
  if (normalized.includes("security") || normalized.includes("risk")) return "security";
  return "retail";
}

function resolveFromPack(
  objectLabelName: string,
  pack: DomainVocabularyPack | undefined
): DomainVocabularyEntry | null {
  const key = normalizeDomainKey(objectLabelName);
  if (!key || !pack) return null;
  return pack.entries.find((entry) => entry.match.some((token) => key.includes(token))) ?? null;
}

export function resolveDomainVocabulary(
  objectLabelName: string,
  domainId?: string | null
): DomainVocabularyEntry | null {
  const effectiveDomain = getEffectiveVocabularyDomain(domainId);
  return (
    resolveFromPack(objectLabelName, DOMAIN_VOCABULARY_PACKS[effectiveDomain]) ??
    resolveFromPack(objectLabelName, DOMAIN_VOCABULARY_PACKS.default)
  );
}

function fillTemplate(template: string | undefined, objectLabelName: string): string | null {
  if (typeof template !== "string" || template.trim().length === 0) return null;
  return template.replace(/\{object\}/g, objectLabelName).trim();
}

export function resolveDomainAwareLabelTemplate(params: {
  objectLabelName: string;
  domainId?: string | null;
  role: "primary" | "affected" | "context" | "neutral";
  severity?: DomainLabelSeverity | null;
}): {
  titleTemplate?: string | null;
  bodyTemplate?: string | null;
} | null {
  const vocabulary = resolveDomainVocabulary(params.objectLabelName, params.domainId);
  if (!vocabulary) return null;

  if (params.role === "primary") {
    return {
      titleTemplate:
        fillTemplate(vocabulary.templates?.primarySeverityTitles?.[params.severity ?? "medium"], params.objectLabelName) ??
        fillTemplate(vocabulary.templates?.primaryTitle, params.objectLabelName),
      bodyTemplate:
        vocabulary.templates?.primarySeverityBodies?.[params.severity ?? "medium"] ??
        vocabulary.templates?.primaryBody ??
        null,
    };
  }

  if (params.role === "affected") {
    return {
      titleTemplate:
        fillTemplate(vocabulary.templates?.affectedSeverityTitles?.[params.severity ?? "medium"], params.objectLabelName) ??
        fillTemplate(vocabulary.templates?.affectedTitle, params.objectLabelName),
      bodyTemplate:
        vocabulary.templates?.affectedSeverityBodies?.[params.severity ?? "medium"] ??
        vocabulary.templates?.affectedBody ??
        null,
    };
  }

  if (params.role === "context") {
    return {
      titleTemplate:
        fillTemplate(vocabulary.templates?.contextSeverityTitles?.[params.severity ?? "medium"], params.objectLabelName) ??
        fillTemplate(vocabulary.templates?.contextTitle, params.objectLabelName),
      bodyTemplate:
        vocabulary.templates?.contextSeverityBodies?.[params.severity ?? "medium"] ??
        vocabulary.templates?.contextBody ??
        null,
    };
  }

  return null;
}

export function resolveDomainAwareObjectName(params: {
  explicitLabel?: string | null;
  objectName?: string | null;
  objectId?: string | null;
  tags?: string[] | null;
  domainId?: string | null;
}): string | null {
  const explicitLabel = String(params.explicitLabel ?? "").trim();
  if (explicitLabel) return explicitLabel;

  const candidates = [
    String(params.objectName ?? "").trim(),
    String(params.objectId ?? "").trim(),
    ...(Array.isArray(params.tags) ? params.tags.map((tag) => String(tag ?? "").trim()) : []),
  ].filter(Boolean);

  for (const candidate of candidates) {
    const vocabulary = resolveDomainVocabulary(candidate, params.domainId);
    if (vocabulary?.displayName) return vocabulary.displayName;
  }

  for (const candidate of candidates) {
    const cleaned = cleanObjectName(candidate);
    if (cleaned) return cleaned;
  }

  return null;
}
