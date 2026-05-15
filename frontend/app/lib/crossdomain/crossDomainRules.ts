import type {
  CrossDomainInfluenceRule,
  CrossDomainRelationshipType,
} from "./crossDomainTypes.ts";

export const CROSS_DOMAIN_INFLUENCE_RULES: CrossDomainInfluenceRule[] = [
  {
    sourceDomainId: "supply_chain",
    targetDomainId: "retail",
    relationshipType: "delivery_impact",
    label: "Supply Chain to Retail Delivery",
    explanation: "Supplier and inventory instability can increase retail delivery pressure.",
    baseConfidence: 0.78,
  },
  {
    sourceDomainId: "supply_chain",
    targetDomainId: "finance",
    relationshipType: "financial_impact",
    label: "Supply Chain to Financial Exposure",
    explanation: "Operational supply disruption can increase margin and cash exposure.",
    baseConfidence: 0.68,
  },
  {
    sourceDomainId: "finance",
    targetDomainId: "pmo",
    relationshipType: "resource_impact",
    label: "Finance to Resource Allocation",
    explanation: "Financial pressure can constrain project capacity and resource allocation.",
    baseConfidence: 0.7,
  },
  {
    sourceDomainId: "pmo",
    targetDomainId: "finance",
    relationshipType: "financial_impact",
    label: "PMO to Financial Exposure",
    explanation: "Timeline and scope pressure can increase budget and revenue exposure.",
    baseConfidence: 0.72,
  },
  {
    sourceDomainId: "saas_devops",
    targetDomainId: "retail",
    relationshipType: "customer_impact",
    label: "DevOps to Customer Continuity",
    explanation: "Service reliability issues can reduce customer experience and business continuity.",
    baseConfidence: 0.74,
  },
  {
    sourceDomainId: "security",
    targetDomainId: "saas_devops",
    relationshipType: "stability_impact",
    label: "Security to Platform Stability",
    explanation: "Access or vulnerability pressure can reduce system reliability.",
    baseConfidence: 0.73,
  },
  {
    sourceDomainId: "general",
    targetDomainId: "finance",
    relationshipType: "operational_impact",
    label: "Operating Model to Finance",
    explanation: "General operational pressure can create financial exposure.",
    baseConfidence: 0.52,
  },
];

export function listCrossDomainInfluenceRules(): CrossDomainInfluenceRule[] {
  return CROSS_DOMAIN_INFLUENCE_RULES.map((rule) => ({ ...rule }));
}

export function findCrossDomainInfluenceRules(params: {
  sourceDomainId?: string | null;
  targetDomainId?: string | null;
  relationshipType?: CrossDomainRelationshipType;
}): CrossDomainInfluenceRule[] {
  return CROSS_DOMAIN_INFLUENCE_RULES.filter((rule) => {
    if (params.sourceDomainId && rule.sourceDomainId !== params.sourceDomainId) return false;
    if (params.targetDomainId && rule.targetDomainId !== params.targetDomainId) return false;
    if (params.relationshipType && rule.relationshipType !== params.relationshipType) return false;
    return true;
  }).map((rule) => ({ ...rule }));
}
