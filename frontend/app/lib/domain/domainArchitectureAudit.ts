import { listDomainDefinitions } from "./domainRegistry.ts";

export type DomainArchitectureWarning = {
  id: string;
  category:
    | "duplication"
    | "unsafe_mutation"
    | "loop_risk"
    | "schema_risk"
    | "performance"
    | "normalization";
  message: string;
  severity:
    | "low"
    | "medium"
    | "high";
};

function warning(input: DomainArchitectureWarning): DomainArchitectureWarning {
  return input;
}

export function auditDomainArchitecture(): DomainArchitectureWarning[] {
  const warnings: DomainArchitectureWarning[] = [];
  const domains = listDomainDefinitions();

  for (const domain of domains) {
    const templateIds = domain.objectTemplates.map((template) => template.id);
    if (new Set(templateIds).size !== templateIds.length) {
      warnings.push(warning({
        id: `duplicate_templates_${domain.id}`,
        category: "duplication",
        message: `${domain.name} has duplicate object template ids.`,
        severity: "high",
      }));
    }
    const relationshipIds = domain.relationshipTemplates.map((template) => template.id);
    if (new Set(relationshipIds).size !== relationshipIds.length) {
      warnings.push(warning({
        id: `duplicate_relationships_${domain.id}`,
        category: "duplication",
        message: `${domain.name} has duplicate relationship template ids.`,
        severity: "medium",
      }));
    }
    if (!domain.objectTemplates.length) {
      warnings.push(warning({
        id: `empty_templates_${domain.id}`,
        category: "schema_risk",
        message: `${domain.name} has no object templates.`,
        severity: "high",
      }));
    }
    if (!domain.riskSignals.length) {
      warnings.push(warning({
        id: `empty_risk_signals_${domain.id}`,
        category: "schema_risk",
        message: `${domain.name} has no risk signal vocabulary.`,
        severity: "medium",
      }));
    }
  }

  return warnings;
}
