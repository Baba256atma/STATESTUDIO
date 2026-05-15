import type {
  CrossDomainRelationshipType,
  CrossDomainSeverity,
} from "./crossDomainTypes.ts";

function label(domainId: string): string {
  return domainId.replace(/_/g, " ");
}

export function buildCrossDomainTitle(params: {
  sourceDomainId: string;
  targetDomainId: string;
  relationshipType: CrossDomainRelationshipType;
}): string {
  return `${label(params.sourceDomainId)} pressure is affecting ${label(params.targetDomainId)}`;
}

export function buildCrossDomainSummary(params: {
  sourceDomainId: string;
  targetDomainId: string;
  relationshipType: CrossDomainRelationshipType;
  focus?: string;
}): string {
  const source = label(params.sourceDomainId);
  const target = label(params.targetDomainId);
  const focus = String(params.focus ?? "").trim();
  if (params.relationshipType === "delivery_impact") {
    return `${source} instability is increasing downstream ${target} delivery fragility${focus ? ` around ${focus}` : ""}.`;
  }
  if (params.relationshipType === "financial_impact") {
    return `${source} pressure is increasing financial exposure in ${target}${focus ? ` through ${focus}` : ""}.`;
  }
  if (params.relationshipType === "resource_impact") {
    return `${source} pressure is reducing resource flexibility across ${target}${focus ? ` around ${focus}` : ""}.`;
  }
  if (params.relationshipType === "customer_impact") {
    return `${source} instability is increasing customer-facing exposure in ${target}.`;
  }
  if (params.relationshipType === "stability_impact") {
    return `${source} pressure is weakening operating stability across ${target}.`;
  }
  if (params.relationshipType === "dependency_impact") {
    return `${source} dependency pressure is spreading into ${target}.`;
  }
  return `${source} pressure is creating operational impact across ${target}.`;
}

export function buildCrossDomainExecutiveImpact(params: {
  severity: CrossDomainSeverity;
  sourceDomainId: string;
  targetDomainId: string;
}): string {
  const source = label(params.sourceDomainId);
  const target = label(params.targetDomainId);
  if (params.severity === "critical") return `Critical ${source} pressure may materially affect ${target} decisions.`;
  if (params.severity === "high") return `${source} pressure deserves executive attention because it can influence ${target}.`;
  if (params.severity === "medium") return `${source} pressure should be monitored for ${target} impact.`;
  return `${source} pressure is currently a low-level ${target} context signal.`;
}
