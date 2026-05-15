import { normalizeDomainId } from "./domainHelpers.ts";
import type { NexoraDomainId } from "./domainTypes.ts";
import type { DomainRelationshipMeta, DomainRelationshipSemantic } from "./domainRelationshipTypes.ts";

type RelationshipRuleInput = {
  domainId: unknown;
  sourceObject?: unknown;
  targetObject?: unknown;
  relationshipType?: unknown;
};

type ObjectProfile = {
  role: string;
  text: string;
};

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" ? (value as Record<string, unknown>) : {};
}

function normalizeText(value: unknown): string {
  return String(value ?? "")
    .toLowerCase()
    .replace(/[_-]+/g, " ")
    .replace(/[^a-z0-9\s]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function arrayText(value: unknown): string {
  return Array.isArray(value) ? value.map((item) => normalizeText(item)).join(" ") : "";
}

function objectProfile(value: unknown): ObjectProfile {
  const record = asRecord(value);
  const semantic = asRecord(record.semantic);
  const meta = asRecord(record.meta);
  const metadata = asRecord(record.metadata);
  const role = normalizeText(meta.semanticRole ?? semantic.role ?? metadata.semanticRole ?? record.role ?? record.type);
  const text = [
    record.id,
    record.label,
    record.name,
    record.canonical_name,
    record.display_label,
    record.category,
    record.domain,
    record.risk_kind,
    record.business_meaning,
    semantic.canonical_name,
    semantic.display_label,
    semantic.category,
    semantic.role,
    semantic.business_meaning,
    meta.templateId,
    metadata.templateId,
    arrayText(record.tags),
    arrayText(record.keywords),
    arrayText(record.related_terms),
    arrayText(semantic.tags),
    arrayText(semantic.keywords),
    arrayText(semantic.related_terms),
  ]
    .map(normalizeText)
    .filter(Boolean)
    .join(" ");

  return { role, text };
}

function includesAny(text: string, terms: string[]): boolean {
  return terms.some((term) => text.includes(term));
}

function clamp01(value: number): number {
  return Math.min(1, Math.max(0, Number.isFinite(value) ? value : 0));
}

function meta(
  semantic: DomainRelationshipSemantic,
  strength: number,
  executiveLabel: string,
  directional = true
): DomainRelationshipMeta {
  return {
    semantic,
    strength: Number(clamp01(strength).toFixed(2)),
    directional,
    executiveLabel,
  };
}

function semanticFromRelationshipType(type: unknown): DomainRelationshipSemantic | null {
  const raw = normalizeText(type);
  if (!raw) return null;
  if (raw.includes("risk")) return "risk";
  if (raw.includes("flow")) return "flow";
  if (raw.includes("constraint") || raw.includes("decision")) return "control";
  if (raw.includes("feedback")) return "monitoring";
  if (raw.includes("dependency")) return "dependency";
  return null;
}

function fallbackForSemantic(semantic: DomainRelationshipSemantic): DomainRelationshipMeta {
  switch (semantic) {
    case "dependency":
      return meta("dependency", 0.82, "Operational Dependency");
    case "flow":
      return meta("flow", 0.74, "Operating Flow");
    case "risk":
      return meta("risk", 0.86, "Risk Path");
    case "ownership":
      return meta("ownership", 0.62, "Ownership Link");
    case "communication":
      return meta("communication", 0.56, "Communication Channel");
    case "financial":
      return meta("financial", 0.8, "Financial Exposure");
    case "control":
      return meta("control", 0.72, "Control Path");
    case "support":
      return meta("support", 0.64, "Support Relationship", false);
    case "monitoring":
      return meta("monitoring", 0.48, "Monitoring Feed");
  }
}

function inferByRole(source: ObjectProfile, target: ObjectProfile): DomainRelationshipMeta | null {
  if (source.role === "monitor" || target.role === "monitor") return fallbackForSemantic("monitoring");
  if (source.role === "risk" || target.role === "risk") return fallbackForSemantic("risk");
  if (source.role === "constraint" || target.role === "constraint") return fallbackForSemantic("control");
  if (source.role === "decision" || target.role === "decision") return fallbackForSemantic("control");
  if (source.role === "input" && target.role === "process") return fallbackForSemantic("flow");
  if (source.role === "process" && target.role === "output") return fallbackForSemantic("dependency");
  if (source.role === "process" && target.role === "process") return fallbackForSemantic("dependency");
  if (target.role === "core") return meta("support", 0.58, "Core Support", false);
  return null;
}

function inferByDomain(domainId: NexoraDomainId, source: ObjectProfile, target: ObjectProfile): DomainRelationshipMeta | null {
  if (domainId === "supply_chain" || domainId === "retail") {
    if (includesAny(source.text, ["supplier", "vendor"]) && includesAny(target.text, ["inventory", "stock"])) {
      return meta("flow", 0.84, "Supply Flow");
    }
    if (includesAny(source.text, ["inventory", "stock"]) && includesAny(target.text, ["delivery", "fulfillment", "logistics"])) {
      return meta("dependency", 0.82, "Fulfillment Dependency");
    }
    if (includesAny(source.text, ["logistics", "transport"]) && includesAny(target.text, ["delivery", "customer"])) {
      return meta("flow", 0.78, "Delivery Flow");
    }
  }

  if (domainId === "pmo") {
    if (includesAny(source.text, ["task", "scope", "resource", "budget"]) && includesAny(target.text, ["dependency", "timeline", "milestone"])) {
      return meta("dependency", 0.8, "Project Dependency");
    }
    if (includesAny(source.text, ["change request", "governance"]) || includesAny(target.text, ["decision", "gate"])) {
      return meta("control", 0.72, "Delivery Control");
    }
  }

  if (domainId === "finance") {
    if (includesAny(source.text, ["asset", "revenue", "cash", "cost", "forecast"]) && includesAny(target.text, ["exposure", "liquidity", "cash", "compliance"])) {
      return meta("financial", 0.82, "Financial Exposure");
    }
  }

  if (domainId === "saas_devops") {
    if (includesAny(source.text, ["service", "application", "api"]) && includesAny(target.text, ["database", "infrastructure"])) {
      return meta("dependency", 0.85, "Service Dependency");
    }
    if (includesAny(source.text, ["database", "service", "deployment"]) && includesAny(target.text, ["incident", "failure", "reliability risk"])) {
      return meta("risk", 0.86, "Reliability Risk Path");
    }
    if (includesAny(source.text, ["database", "service", "infrastructure"]) && includesAny(target.text, ["alert", "monitor", "signal"])) {
      return meta("monitoring", 0.5, "Operational Monitoring");
    }
  }

  if (domainId === "security") {
    if (includesAny(source.text, ["vulnerability", "threat", "exposure"]) && includesAny(target.text, ["asset", "identity", "access"])) {
      return meta("risk", 0.88, "Security Exposure Path");
    }
    if (includesAny(source.text, ["identity", "access", "control"]) && includesAny(target.text, ["asset", "access path"])) {
      return meta("control", 0.76, "Access Control");
    }
  }

  return null;
}

export function inferDomainRelationshipMeta(input: RelationshipRuleInput): DomainRelationshipMeta {
  const domainId = normalizeDomainId(input.domainId);
  const source = objectProfile(input.sourceObject);
  const target = objectProfile(input.targetObject);
  const domainMeta = inferByDomain(domainId, source, target);
  if (domainMeta) return domainMeta;

  const roleMeta = inferByRole(source, target);
  if (roleMeta) return roleMeta;

  const relationshipSemantic = semanticFromRelationshipType(input.relationshipType);
  if (relationshipSemantic) return fallbackForSemantic(relationshipSemantic);

  return fallbackForSemantic("dependency");
}
