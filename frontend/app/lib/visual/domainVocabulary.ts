export type DomainVocabularyEntry = {
  match: string[];
  displayName?: string;
  aliases?: string[];
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
      match: ["delivery", "shipment", "shipping", "logistics"],
      displayName: "Delivery",
      aliases: ["shipment", "shipping", "logistics"],
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
      match: ["inventory", "stock", "warehouse"],
      displayName: "Inventory",
      aliases: ["stock", "warehouse"],
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
      aliases: ["supply", "vendor", "procurement"],
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
      aliases: ["finance", "financial", "liquidity"],
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
      match: ["price", "pricing", "margin", "revenue"],
      displayName: "Pricing",
      aliases: ["price", "margin", "revenue"],
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
      match: ["customer", "sla", "service", "satisfaction"],
      displayName: "Service",
      aliases: ["customer", "sla", "satisfaction"],
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
      match: ["margin", "pricing", "revenue"],
      displayName: "Pricing",
      aliases: ["margin", "revenue"],
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
      aliases: ["deploy", "pipeline"],
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
      match: ["service", "latency", "incident"],
      displayName: "Service",
      aliases: ["latency", "incident"],
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
      aliases: ["milestone", "schedule"],
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
      aliases: ["resource", "program"],
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
      aliases: ["identity", "credential"],
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
      aliases: ["vulnerability", "incident"],
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

const DOMAIN_VOCABULARY_PACKS: Record<string, DomainVocabularyPack> = {
  default: DEFAULT_DOMAIN_VOCABULARY_PACK,
  retail: RETAIL_DOMAIN_VOCABULARY_PACK,
  finance: FINANCE_DOMAIN_VOCABULARY_PACK,
  devops: DEVOPS_DOMAIN_VOCABULARY_PACK,
  pmo: PMO_DOMAIN_VOCABULARY_PACK,
  security: SECURITY_DOMAIN_VOCABULARY_PACK,
};

export function getEffectiveVocabularyDomain(domainId?: string | null): string {
  const normalized = normalizeDomainKey(domainId);
  if (!normalized) return "retail";
  if (DOMAIN_VOCABULARY_PACKS[normalized]) return normalized;
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
