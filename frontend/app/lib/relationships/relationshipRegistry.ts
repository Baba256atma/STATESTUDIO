import type { NexoraRelationshipType, RelationshipTypeDefinition } from "./relationshipTypes";

const registry = new Map<NexoraRelationshipType, RelationshipTypeDefinition>();

function register(definition: RelationshipTypeDefinition): void {
  registry.set(definition.id, definition);
}

function registerBuiltInRelationshipTypes(): void {
  register({
    id: "dependency",
    label: "Dependency",
    description: "Source depends on target to proceed or complete.",
    defaultDirection: "uni",
    examples: ["Task A → Task B", "Supplier → Warehouse", "Machine → Production Line"],
  });
  register({
    id: "flow",
    label: "Flow",
    description: "Source sends operational flow, demand, or work into target.",
    defaultDirection: "uni",
    examples: ["Factory → Inventory", "Inventory → Market"],
  });
  register({
    id: "ownership",
    label: "Ownership",
    description: "Source owns, governs, or is accountable for target.",
    defaultDirection: "uni",
    examples: ["Department → Objective", "Business Unit → Project"],
  });
  register({
    id: "information",
    label: "Information",
    description: "Source provides signal, reporting, or decision information to target.",
    defaultDirection: "uni",
    examples: ["Market Signal → Planning", "Operations → Executive Team"],
  });
  register({
    id: "resource",
    label: "Resource",
    description: "Source allocates resource, capacity, or support to target.",
    defaultDirection: "uni",
    examples: ["Team → Project", "Budget → Initiative"],
  });
  register({
    id: "risk",
    label: "Risk",
    description: "Source introduces risk, exposure, or pressure to target.",
    defaultDirection: "uni",
    examples: ["Risk → Department", "Supplier Delay → Factory"],
  });
  register({
    id: "influences",
    label: "Influences",
    description: "Source affects target outcomes or behavior.",
    defaultDirection: "uni",
    examples: ["Risk → Revenue", "Market → Demand", "Demand → Inventory"],
  });
  register({
    id: "supplies",
    label: "Supplies",
    description: "Source provides materials, capacity, or flow to target.",
    defaultDirection: "uni",
    examples: ["Supplier → Factory", "Factory → Distribution", "Warehouse → Retail"],
  });
  register({
    id: "reports_to",
    label: "Reports To",
    description: "Source reports upward to target in an organizational chain.",
    defaultDirection: "uni",
    examples: ["Team → Manager", "Manager → Director", "Director → Executive"],
  });
  register({
    id: "blocks",
    label: "Blocks",
    description: "Source impedes or stops target progress.",
    defaultDirection: "uni",
    examples: ["Risk → Project", "Failure → Production", "Issue → Delivery"],
  });
  register({
    id: "supports",
    label: "Supports",
    description: "Source enables or stabilizes target execution.",
    defaultDirection: "uni",
    examples: ["Process → Project", "Team → Initiative", "Budget → Program"],
  });
  register({
    id: "owns",
    label: "Owns",
    description: "Source has ownership or accountability over target.",
    defaultDirection: "uni",
    examples: ["Department → Asset", "Business Unit → Project"],
  });
  register({
    id: "custom",
    label: "Custom",
    description: "Future-ready enterprise relationship type.",
    defaultDirection: "bi",
    examples: ["User-defined enterprise links"],
  });
}

registerBuiltInRelationshipTypes();

export function getRelationshipTypeDefinition(
  type: NexoraRelationshipType
): RelationshipTypeDefinition | undefined {
  return registry.get(type);
}

export function getAllRelationshipTypeDefinitions(): RelationshipTypeDefinition[] {
  return Array.from(registry.values());
}

export function resolveRelationshipDirectionLabel(direction: "uni" | "bi"): string {
  return direction === "bi" ? "Bidirectional (A ↔ B)" : "Directional (A → B)";
}

/** Test-only reset. */
export function resetRelationshipRegistryForTests(): void {
  registry.clear();
  registerBuiltInRelationshipTypes();
}
