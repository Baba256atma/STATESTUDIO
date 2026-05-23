import type { DomainTemplate } from "./systemModelTypes";

const registry = new Map<string, DomainTemplate>();

function register(template: DomainTemplate): void {
  registry.set(template.id, template);
}

function registerBuiltInTemplates(): void {
  register({
    id: "supply_chain_visibility",
    name: "Supply Chain Visibility",
    category: "supply_chain",
    description: "Supplier through customer supply chain structure",
    purpose: "Supply Chain Visibility",
    version: "1.0",
    objects: [
      { key: "supplier", label: "Supplier", catalogId: "ops_supplier", role: "input" },
      { key: "factory", label: "Factory", catalogId: "ops_process", role: "process" },
      { key: "warehouse", label: "Warehouse", catalogId: "ops_warehouse", role: "constraint" },
      { key: "distribution", label: "Distribution", catalogId: "ops_distribution", role: "flow" },
      { key: "retail", label: "Retail", catalogId: "ops_team", role: "output" },
      { key: "customer", label: "Customer", catalogId: "strat_objective", role: "core" },
    ],
    relationships: [
      { sourceKey: "supplier", targetKey: "factory", type: "supplies" },
      { sourceKey: "factory", targetKey: "warehouse", type: "supplies" },
      { sourceKey: "warehouse", targetKey: "distribution", type: "transports" },
      { sourceKey: "distribution", targetKey: "retail", type: "delivers" },
      { sourceKey: "retail", targetKey: "customer", type: "delivers" },
    ],
    metadata: { layout: "linear_chain" },
  });

  register({
    id: "pmo_governance",
    name: "Project Governance",
    category: "pmo",
    description: "Portfolio through task PMO hierarchy",
    purpose: "Project Governance",
    version: "1.0",
    objects: [
      { key: "portfolio", label: "Portfolio", catalogId: "proj_program", role: "core" },
      { key: "program", label: "Program", catalogId: "proj_program", role: "core" },
      { key: "project", label: "Project", catalogId: "proj_project", role: "core" },
      { key: "milestone", label: "Milestone", catalogId: "proj_milestone", role: "output" },
      { key: "task", label: "Task", catalogId: "proj_task", role: "process" },
      { key: "risk", label: "Risk", catalogId: "strat_risk", role: "risk" },
    ],
    relationships: [
      { sourceKey: "program", targetKey: "portfolio", type: "reports_to" },
      { sourceKey: "project", targetKey: "program", type: "depends_on" },
      { sourceKey: "milestone", targetKey: "project", type: "depends_on" },
      { sourceKey: "task", targetKey: "milestone", type: "depends_on" },
      { sourceKey: "risk", targetKey: "project", type: "blocks" },
    ],
    metadata: { layout: "governance_stack" },
  });

  register({
    id: "finance_system",
    name: "Financial System Model",
    category: "finance",
    description: "Revenue, cost, budget, and cash flow structure",
    purpose: "Financial System Modeling",
    version: "1.0",
    objects: [
      { key: "revenue", label: "Revenue", catalogId: "fin_revenue", role: "monitor" },
      { key: "cost", label: "Cost", catalogId: "fin_cost", role: "monitor" },
      { key: "budget", label: "Budget", catalogId: "fin_budget", role: "core" },
      { key: "investment", label: "Investment", catalogId: "fin_investment", role: "process" },
      { key: "cash_flow", label: "Cash Flow", catalogId: "fin_cash_flow", role: "flow" },
      { key: "profit", label: "Profit", catalogId: "fin_revenue", role: "output" },
    ],
    relationships: [
      { sourceKey: "revenue", targetKey: "profit", type: "influences" },
      { sourceKey: "cost", targetKey: "profit", type: "influences" },
      { sourceKey: "budget", targetKey: "investment", type: "funds" },
      { sourceKey: "investment", targetKey: "cash_flow", type: "influences" },
      { sourceKey: "cash_flow", targetKey: "profit", type: "influences" },
    ],
    metadata: { layout: "finance_flow" },
  });

  register({
    id: "operations_visibility",
    name: "Operational Visibility",
    category: "operations",
    description: "Department, team, process, and asset operations model",
    purpose: "Operational Visibility",
    version: "1.0",
    objects: [
      { key: "department", label: "Department", catalogId: "ops_team", role: "core" },
      { key: "team", label: "Team", catalogId: "ops_team", role: "core" },
      { key: "process", label: "Process", catalogId: "ops_process", role: "process" },
      { key: "asset", label: "Asset", catalogId: "ops_machine", role: "constraint" },
      { key: "machine", label: "Machine", catalogId: "ops_machine", role: "process" },
      { key: "kpi", label: "KPI", catalogId: "fin_revenue", role: "monitor" },
    ],
    relationships: [
      { sourceKey: "team", targetKey: "department", type: "reports_to" },
      { sourceKey: "process", targetKey: "team", type: "supports" },
      { sourceKey: "machine", targetKey: "process", type: "depends_on" },
      { sourceKey: "department", targetKey: "asset", type: "owns", direction: "uni" },
      { sourceKey: "kpi", targetKey: "process", type: "influences" },
    ],
    metadata: { layout: "operations_hub" },
  });
}

registerBuiltInTemplates();

export function getDomainTemplate(id: string): DomainTemplate | undefined {
  return registry.get(id);
}

export function getAllDomainTemplates(): DomainTemplate[] {
  return Array.from(registry.values());
}

export function getDomainTemplatesByCategory(category: DomainTemplate["category"]): DomainTemplate[] {
  return getAllDomainTemplates().filter((template) => template.category === category);
}

/** Test-only reset. */
export function resetTemplateRegistryForTests(): void {
  registry.clear();
  registerBuiltInTemplates();
}
