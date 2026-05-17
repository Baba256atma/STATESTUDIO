/**
 * D7:2:1 — Deterministic operational universe classification.
 */

import type {
  OperationalDomainClass,
  TopologyObjectClassification,
  TopologyObjectInput,
} from "./topologyTypes.ts";
import { logTopologyDev } from "./topologyDevLog.ts";

export type CanonicalRegionId =
  | "finance"
  | "logistics"
  | "operations"
  | "manufacturing"
  | "executive_systems"
  | "supply_chain"
  | "infrastructure"
  | "customer_systems"
  | "external_dependencies"
  | "unclassified";

export const CANONICAL_REGION_LABELS: Readonly<Record<CanonicalRegionId, string>> = {
  finance: "Finance",
  logistics: "Logistics",
  operations: "Operations",
  manufacturing: "Manufacturing",
  executive_systems: "Executive Systems",
  supply_chain: "Supply Chain",
  infrastructure: "Infrastructure",
  customer_systems: "Customer Systems",
  external_dependencies: "External Dependencies",
  unclassified: "Unclassified Operations",
};

const REGION_KEYWORDS: ReadonlyArray<readonly [CanonicalRegionId, readonly string[]]> = [
  ["finance", ["finance", "financial", "treasury", "budget", "accounting", "revenue", "cost"]],
  ["logistics", ["logistics", "shipping", "warehouse", "distribution", "freight", "transport"]],
  ["manufacturing", ["manufacturing", "production", "factory", "plant", "assembly", "capacity"]],
  ["supply_chain", ["supply", "supplier", "procurement", "sourcing", "inventory", "chain"]],
  ["customer_systems", ["customer", "client", "service", "support", "sales", "market"]],
  ["infrastructure", ["infrastructure", "platform", "network", "cloud", "system", "it", "data"]],
  ["executive_systems", ["executive", "leadership", "board", "strategy", "governance", "ceo"]],
  ["operations", ["operations", "operational", "process", "workflow", "execution"]],
];

const DOMAIN_CLASS_BY_REGION: Readonly<Record<CanonicalRegionId, OperationalDomainClass>> = {
  finance: "financial",
  logistics: "operational",
  operations: "operational",
  manufacturing: "operational",
  executive_systems: "executive",
  supply_chain: "strategic",
  infrastructure: "infrastructure",
  customer_systems: "operational",
  external_dependencies: "external_dependency",
  unclassified: "unclassified",
};

function normalizeToken(value: string): string {
  return String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_");
}

function scoreRegionMatch(object: TopologyObjectInput, regionId: CanonicalRegionId, keywords: readonly string[]): number {
  const haystack = [
    object.domain,
    object.category,
    object.role,
    object.label,
    ...(object.tags ?? []),
  ]
    .map((v) => normalizeToken(String(v ?? "")))
    .join(" ");

  let score = 0;
  for (const keyword of keywords) {
    if (haystack.includes(normalizeToken(keyword))) score += 1;
  }
  if (normalizeToken(object.domain ?? "") === regionId.replace(/_/g, "")) score += 2;
  return score;
}

export function classifyTopologyObject(
  object: TopologyObjectInput,
  regionOverride?: string
): TopologyObjectClassification {
  if (regionOverride) {
    const regionId = normalizeToken(regionOverride) as CanonicalRegionId;
    return {
      objectId: object.objectId,
      regionId,
      domainClass: DOMAIN_CLASS_BY_REGION[regionId] ?? "operational",
      confidence: 1,
      rationale: `Explicit region override assigned ${regionId}.`,
    };
  }

  let best: CanonicalRegionId = "unclassified";
  let bestScore = 0;

  for (const [regionId, keywords] of REGION_KEYWORDS) {
    const score = scoreRegionMatch(object, regionId, keywords);
    if (score > bestScore) {
      bestScore = score;
      best = regionId;
    }
  }

  const confidence = bestScore === 0 ? 0.35 : Number(Math.min(1, 0.45 + bestScore * 0.15).toFixed(2));

  return {
    objectId: object.objectId,
    regionId: best,
    domainClass: DOMAIN_CLASS_BY_REGION[best],
    confidence,
    rationale:
      bestScore > 0
        ? `Matched ${best} via operational keywords (score ${bestScore}).`
        : "No strong domain signals; assigned to unclassified operations.",
  };
}

export function classifyTopologyObjects(input: {
  objects: readonly TopologyObjectInput[];
  regionOverrides?: Readonly<Record<string, string>>;
}): readonly TopologyObjectClassification[] {
  const classifications = input.objects
    .map((obj) =>
      classifyTopologyObject(obj, input.regionOverrides?.[obj.objectId])
    )
    .sort((a, b) => a.objectId.localeCompare(b.objectId));

  logTopologyDev("RegionClassification", {
    objectCount: classifications.length,
    regions: [...new Set(classifications.map((c) => c.regionId))].sort(),
  });

  return Object.freeze(classifications);
}

export function domainClassForRegion(regionId: string): OperationalDomainClass {
  const key = normalizeToken(regionId) as CanonicalRegionId;
  return DOMAIN_CLASS_BY_REGION[key] ?? "operational";
}
