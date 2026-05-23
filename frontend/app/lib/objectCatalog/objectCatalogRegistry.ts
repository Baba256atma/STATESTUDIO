import type { CatalogObjectDefinition } from "./objectCatalogTypes";

const registry = new Map<string, CatalogObjectDefinition>();

function register(definition: CatalogObjectDefinition): void {
  registry.set(definition.id, definition);
}

function registerBuiltInCatalog(): void {
  const ops = (id: string, label: string, icon: string, role: string, severity = 0.45) =>
    register({
      id: `ops_${id}`,
      label,
      category: "operations",
      icon,
      description: `${label} operational entity`,
      defaultRole: role,
      defaultSeverity: severity,
    });

  ops("process", "Process", "⟲", "process", 0.42);
  ops("team", "Team", "◫", "core", 0.38);
  ops("supplier", "Supplier", "⬡", "input", 0.52);
  ops("warehouse", "Warehouse", "▣", "constraint", 0.48);
  ops("distribution", "Distribution", "↯", "flow", 0.5);
  ops("machine", "Machine", "⚙", "process", 0.46);

  const fin = (id: string, label: string, icon: string, severity = 0.4) =>
    register({
      id: `fin_${id}`,
      label,
      category: "finance",
      icon,
      description: `${label} financial signal`,
      defaultRole: "monitor",
      defaultSeverity: severity,
    });

  fin("revenue", "Revenue", "↑", 0.35);
  fin("cost", "Cost", "↓", 0.55);
  fin("budget", "Budget", "▤", 0.42);
  fin("cash_flow", "Cash Flow", "↔", 0.48);
  fin("investment", "Investment", "◎", 0.44);

  const proj = (id: string, label: string, icon: string, role: string, severity = 0.43) =>
    register({
      id: `proj_${id}`,
      label,
      category: "project",
      icon,
      description: `${label} delivery object`,
      defaultRole: role,
      defaultSeverity: severity,
    });

  proj("milestone", "Milestone", "◆", "output", 0.4);
  proj("project", "Project", "▣", "core", 0.46);
  proj("task", "Task", "•", "process", 0.38);
  proj("program", "Program", "⬢", "core", 0.5);
  proj("dependency", "Dependency", "⇄", "constraint", 0.47);

  const strat = (id: string, label: string, icon: string, role: string, severity = 0.5) =>
    register({
      id: `strat_${id}`,
      label,
      category: "strategy",
      icon,
      description: `${label} strategic element`,
      defaultRole: role,
      defaultSeverity: severity,
    });

  strat("objective", "Objective", "◎", "core", 0.52);
  strat("initiative", "Initiative", "→", "process", 0.48);
  strat("risk", "Risk", "!", "risk", 0.62);
  strat("opportunity", "Opportunity", "+", "output", 0.44);
  strat("scenario", "Scenario", "◫", "decision", 0.46);

  register({
    id: "custom_object",
    label: "Custom Object",
    category: "custom",
    icon: "✦",
    description: "Placeholder for future user-defined enterprise objects",
    defaultRole: "core",
    defaultSeverity: 0.4,
    defaultMetadata: { placeholder: true },
  });
}

registerBuiltInCatalog();

export function getCatalogObjectDefinition(id: string): CatalogObjectDefinition | undefined {
  return registry.get(id);
}

export function getAllCatalogObjectDefinitions(): CatalogObjectDefinition[] {
  return Array.from(registry.values());
}

export function getCatalogObjectsByCategory(category: CatalogObjectDefinition["category"]): CatalogObjectDefinition[] {
  return getAllCatalogObjectDefinitions().filter((item) => item.category === category);
}

/** Test-only reset. */
export function resetObjectCatalogRegistryForTests(): void {
  registry.clear();
  registerBuiltInCatalog();
}
