/**
 * B.13 — Domain maturity layer: pluggable vocabulary extensions (generic core + domain intelligence).
 * Does not replace `lib/visual/domainVocabulary.ts`; augments alias / hint surfaces only.
 */

export type B13MaturityDomain = "retail" | "supply_chain" | "finance" | "default";

/** Per-domain extras: canonical stems → alias phrases for payload / object matching. */
export type B13DomainVocabulary = {
  domainId: B13MaturityDomain;
  /** Extra alias tokens merged into B.6 payload expansion (additive). */
  payloadAliasExtension: Record<string, string[]>;
  /** Substring keys on driver label (lowercased) → richer display label (same driver id). */
  driverLabelEnrichment: Record<string, Partial<Record<B13MaturityDomain, string>>>;
};

const RETAIL_DRIVER_ENRICH: Record<string, Partial<Record<B13MaturityDomain, string>>> = {
  delay: {
    retail: "Delivery delay pressure affecting fulfillment reliability",
    default: "Delay pressure on operating flow",
  },
  inventory: {
    retail: "Inventory coverage risk affecting availability and service",
    default: "Inventory imbalance signal",
  },
  supplier: {
    retail: "Supplier exposure affecting replenishment stability",
    supply_chain: "Upstream / supplier instability affecting material flow",
    default: "Upstream dependency pressure",
  },
  cost: {
    finance: "Cost and margin pressure affecting financial headroom",
    retail: "Cost pressure affecting margins and pricing room",
    default: "Cost pressure signal",
  },
  liquidity: {
    finance: "Liquidity and funding posture risk",
    default: "Liquidity-related pressure",
  },
};

export const SUPPLY_CHAIN_ALIAS: Record<string, string[]> = {
  delivery: [
    "lead time spike",
    "transit delay",
    "container delay",
    "port congestion",
    "material arrival slip",
  ],
  supplier: ["tier-2 supplier", "tier 2 supplier", "subsupplier", "upstream bottleneck", "allocation"],
  inventory: ["safety stock breach", "raw material shortage", "wip buildup"],
  bottleneck: ["throughput constraint", "line stoppage", "material flow disruption"],
};

export const FINANCE_ALIAS: Record<string, string[]> = {
  cash: ["wc squeeze", "working capital strain", "refinance risk"],
  pricing: ["spread compression", "rate shock", "hedge gap"],
  margin: ["ebitda pressure", "margin walk"],
};

export const RETAIL_ALIAS: Record<string, string[]> = {
  inventory: ["shelf empty", "phantom inventory", "cycle count miss"],
  delivery: ["carrier miss", "promise date slip"],
};

export const DOMAIN_MATURITY_VOCABULARIES: Record<B13MaturityDomain, B13DomainVocabulary> = {
  retail: {
    domainId: "retail",
    payloadAliasExtension: RETAIL_ALIAS,
    driverLabelEnrichment: RETAIL_DRIVER_ENRICH,
  },
  supply_chain: {
    domainId: "supply_chain",
    payloadAliasExtension: SUPPLY_CHAIN_ALIAS,
    driverLabelEnrichment: RETAIL_DRIVER_ENRICH,
  },
  finance: {
    domainId: "finance",
    payloadAliasExtension: FINANCE_ALIAS,
    driverLabelEnrichment: RETAIL_DRIVER_ENRICH,
  },
  default: {
    domainId: "default",
    payloadAliasExtension: {},
    driverLabelEnrichment: RETAIL_DRIVER_ENRICH,
  },
};

/**
 * Normalize workspace / experience domain id to a B.13 bucket (deterministic, no ML).
 */
export function normalizeB13MaturityDomain(domainId?: string | null): B13MaturityDomain {
  const n = String(domainId ?? "")
    .trim()
    .toLowerCase();
  if (!n) return "default";
  if (n.includes("supply_chain") || n.includes("supply-chain") || n === "scm" || n.includes("supplier_network")) {
    return "supply_chain";
  }
  if (n.includes("finance") || n.includes("finops") || n.includes("treasury")) return "finance";
  if (n.includes("retail") || n.includes("commerce") || n.includes("store") || n.includes("merchant")) {
    return "retail";
  }
  return "default";
}

/** Merged B.13 alias extension for payload token expansion (additive only). */
export function getB13PayloadAliasExtension(domainId?: string | null): Record<string, string[]> {
  const key = normalizeB13MaturityDomain(domainId);
  const v = DOMAIN_MATURITY_VOCABULARIES[key] ?? DOMAIN_MATURITY_VOCABULARIES.default;
  return { ...v.payloadAliasExtension };
}

/** Evidence bias for trust score (B.13.d), clamped by caller to ±0.1. */
export function getB13TrustEvidenceBias(domainId?: string | null, mergedSignalCount: number, successfulSources: number): number {
  const key = normalizeB13MaturityDomain(domainId);
  let delta = 0;
  if (key === "finance") {
    if (mergedSignalCount < 3) delta -= 0.08;
    if (mergedSignalCount < 2) delta -= 0.04;
  }
  if (key === "supply_chain" && successfulSources >= 1 && mergedSignalCount >= 1 && mergedSignalCount <= 5) {
    delta += 0.06;
  }
  if (key === "retail" && mergedSignalCount >= 6) delta += 0.03;
  return Math.max(-0.1, Math.min(0.1, delta));
}
