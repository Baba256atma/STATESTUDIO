import { normalizeEstablishedConceptMeaning } from "./businessProjectConceptRegistry.ts";
import type {
  BusinessProjectRelationshipType,
  RelationshipCrossSourcePolicy,
  RelationshipDirectionality,
  RelationshipScope,
} from "./businessProjectRelationshipContract.ts";
import type { BusinessProjectContextConfidence, BusinessProjectContextKind } from "./businessProjectContextContract.ts";

export type BusinessProjectRelationshipDefinition = Readonly<{
  registryId: string;
  from: string;
  to: string;
  relationshipType: BusinessProjectRelationshipType;
  directionality: RelationshipDirectionality;
  scope: RelationshipScope;
  contexts: readonly Exclude<BusinessProjectContextKind, "UNKNOWN">[];
  families: readonly string[];
  confidence: Extract<BusinessProjectContextConfidence, "KNOWN" | "SUPPORTED" | "LIKELY">;
  crossSource: RelationshipCrossSourcePolicy;
}>;

function definition(input: BusinessProjectRelationshipDefinition): BusinessProjectRelationshipDefinition {
  return Object.freeze({
    ...input,
    contexts: Object.freeze([...input.contexts]),
    families: Object.freeze([...input.families]),
  });
}

/** Small pair registry. Exact canonical names only. Dependency is not a default pair. */
export const BUSINESS_PROJECT_RELATIONSHIP_REGISTRY: readonly BusinessProjectRelationshipDefinition[] = Object.freeze([
  definition({ registryId: "otd.measures.delivery-performance", from: "On-Time Delivery", to: "Delivery Performance", relationshipType: "MEASURE_OF", directionality: "DIRECTED", scope: "GENERAL", contexts: ["BUSINESS"], families: ["OPERATIONS", "SERVICE"], confidence: "KNOWN", crossSource: "NEVER" }),
  definition({ registryId: "otd.relevant.delivery", from: "On-Time Delivery", to: "Delivery", relationshipType: "RELEVANT_TO", directionality: "DIRECTED", scope: "GENERAL", contexts: ["BUSINESS"], families: ["OPERATIONS"], confidence: "KNOWN", crossSource: "NEVER" }),
  definition({ registryId: "otd.relevant.service", from: "On-Time Delivery", to: "Quality", relationshipType: "RELEVANT_TO", directionality: "DIRECTED", scope: "GENERAL", contexts: ["BUSINESS"], families: ["SERVICE", "QUALITY"], confidence: "LIKELY", crossSource: "NEVER" }),
  definition({ registryId: "backlog.relevant.delivery", from: "Backlog", to: "Delivery", relationshipType: "RELEVANT_TO", directionality: "SYMMETRIC", scope: "GENERAL", contexts: ["BUSINESS"], families: ["OPERATIONS"], confidence: "KNOWN", crossSource: "NEVER" }),
  definition({ registryId: "backlog.potential.capacity", from: "Backlog", to: "Capacity", relationshipType: "POTENTIALLY_RELATED_TO", directionality: "SYMMETRIC", scope: "GENERAL", contexts: ["BUSINESS", "HYBRID"], families: ["OPERATIONS"], confidence: "SUPPORTED", crossSource: "NEVER" }),
  definition({ registryId: "capacity.relevant.throughput", from: "Capacity", to: "Throughput", relationshipType: "RELEVANT_TO", directionality: "DIRECTED", scope: "GENERAL", contexts: ["BUSINESS", "HYBRID"], families: ["OPERATIONS"], confidence: "KNOWN", crossSource: "NEVER" }),
  definition({ registryId: "capacity.potentially-constrains.throughput", from: "Capacity", to: "Throughput", relationshipType: "POTENTIALLY_CONSTRAINS", directionality: "DIRECTED", scope: "GENERAL", contexts: ["BUSINESS"], families: ["OPERATIONS"], confidence: "LIKELY", crossSource: "NEVER" }),
  definition({ registryId: "cost.relevant.margin", from: "Cost", to: "Gross Margin", relationshipType: "RELEVANT_TO", directionality: "DIRECTED", scope: "GENERAL", contexts: ["BUSINESS", "HYBRID"], families: ["FINANCE"], confidence: "KNOWN", crossSource: "NEVER" }),
  definition({ registryId: "revenue.relevant.margin", from: "Revenue", to: "Gross Margin", relationshipType: "RELEVANT_TO", directionality: "DIRECTED", scope: "GENERAL", contexts: ["BUSINESS"], families: ["FINANCE"], confidence: "KNOWN", crossSource: "NEVER" }),
  definition({ registryId: "cost.relevant.budget", from: "Cost", to: "Budget", relationshipType: "RELEVANT_TO", directionality: "DIRECTED", scope: "GENERAL", contexts: ["PROJECT", "HYBRID"], families: ["COST"], confidence: "KNOWN", crossSource: "NEVER" }),
  definition({ registryId: "cost.relevant.procurement", from: "Cost", to: "Procurement", relationshipType: "RELEVANT_TO", directionality: "DIRECTED", scope: "GENERAL", contexts: ["PROJECT", "HYBRID"], families: ["PROCUREMENT"], confidence: "SUPPORTED", crossSource: "NEVER" }),
  definition({ registryId: "procurement.relevant.budget", from: "Procurement", to: "Budget", relationshipType: "RELEVANT_TO", directionality: "DIRECTED", scope: "GENERAL", contexts: ["PROJECT"], families: ["PROCUREMENT", "COST"], confidence: "SUPPORTED", crossSource: "NEVER" }),
  definition({ registryId: "milestone.part-of.schedule", from: "Milestone", to: "Project Schedule", relationshipType: "PART_OF", directionality: "DIRECTED", scope: "GENERAL", contexts: ["PROJECT"], families: ["MILESTONE", "SCHEDULE"], confidence: "KNOWN", crossSource: "NEVER" }),
  definition({ registryId: "schedule-variance.measures.schedule-performance", from: "Schedule Variance", to: "Schedule Performance", relationshipType: "MEASURE_OF", directionality: "DIRECTED", scope: "GENERAL", contexts: ["PROJECT"], families: ["SCHEDULE"], confidence: "KNOWN", crossSource: "NEVER" }),
  definition({ registryId: "schedule-variance.relevant.milestone", from: "Schedule Variance", to: "Milestone", relationshipType: "RELEVANT_TO", directionality: "DIRECTED", scope: "GENERAL", contexts: ["PROJECT"], families: ["SCHEDULE"], confidence: "SUPPORTED", crossSource: "NEVER" }),
  definition({ registryId: "deliverable.part-of.scope", from: "Deliverable", to: "Project Scope", relationshipType: "PART_OF", directionality: "DIRECTED", scope: "GENERAL", contexts: ["PROJECT"], families: ["DELIVERABLE", "SCOPE"], confidence: "KNOWN", crossSource: "NEVER" }),
  definition({ registryId: "resource.relevant.schedule", from: "Resource Availability", to: "Project Schedule", relationshipType: "RELEVANT_TO", directionality: "DIRECTED", scope: "GENERAL", contexts: ["PROJECT"], families: ["RESOURCE", "SCHEDULE"], confidence: "SUPPORTED", crossSource: "NEVER" }),
  definition({ registryId: "capacity.relevant.resource", from: "Capacity", to: "Resource Availability", relationshipType: "POTENTIALLY_RELATED_TO", directionality: "CONTEXTUAL", scope: "GENERAL", contexts: ["HYBRID"], families: ["OPERATIONS", "RESOURCE"], confidence: "SUPPORTED", crossSource: "HYBRID_CONTEXT" }),
  definition({ registryId: "supplier-lead.relevant.delivery", from: "Supplier Lead Time", to: "Delivery", relationshipType: "RELEVANT_TO", directionality: "DIRECTED", scope: "GENERAL", contexts: ["BUSINESS"], families: ["SUPPLY_CHAIN"], confidence: "SUPPORTED", crossSource: "NEVER" }),
  definition({ registryId: "quality.relevant.delivery", from: "Quality", to: "Delivery", relationshipType: "RELEVANT_TO", directionality: "DIRECTED", scope: "GENERAL", contexts: ["BUSINESS", "PROJECT", "HYBRID"], families: ["QUALITY"], confidence: "SUPPORTED", crossSource: "NEVER" }),
]);

export function findBusinessProjectRelationshipDefinitions(): readonly BusinessProjectRelationshipDefinition[] {
  return BUSINESS_PROJECT_RELATIONSHIP_REGISTRY;
}

export function relationshipEndpointKey(value: string): string {
  return normalizeEstablishedConceptMeaning(value);
}

export function relationshipDefinitionMatches(entry: BusinessProjectRelationshipDefinition, fromMeaning: string, toMeaning: string): boolean {
  return relationshipEndpointKey(entry.from) === relationshipEndpointKey(fromMeaning) && relationshipEndpointKey(entry.to) === relationshipEndpointKey(toMeaning);
}
