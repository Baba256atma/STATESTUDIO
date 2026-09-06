import { normalizeEstablishedConceptMeaning } from "./businessProjectConceptRegistry.ts";
import type {
  BusinessProcessArea,
  ProcessParticipationType,
  ProjectControlArea,
  ProjectWorkPhase,
} from "./businessProjectProcessContextContract.ts";
import type { BusinessProjectContextKind } from "./businessProjectContextContract.ts";

export type BusinessProjectProcessContextDefinition = Readonly<{
  registryId: string;
  concept: string;
  contextKind: Exclude<BusinessProjectContextKind, "UNKNOWN">;
  processAreas: readonly BusinessProcessArea[];
  projectWorkPhases: readonly ProjectWorkPhase[];
  projectControlAreas: readonly ProjectControlArea[];
  participationTypes: readonly ProcessParticipationType[];
  aspect?: "GENERAL" | "CURRENT_OPERATIONS" | "PLANNED_PROJECT";
}>;

function definition(input: BusinessProjectProcessContextDefinition): BusinessProjectProcessContextDefinition {
  return Object.freeze({
    ...input,
    processAreas: Object.freeze([...input.processAreas]),
    projectWorkPhases: Object.freeze([...input.projectWorkPhases]),
    projectControlAreas: Object.freeze([...input.projectControlAreas]),
    participationTypes: Object.freeze([...input.participationTypes]),
  });
}

export const BUSINESS_PROJECT_PROCESS_CONTEXT_REGISTRY: readonly BusinessProjectProcessContextDefinition[] = Object.freeze([
  definition({ registryId: "backlog.fulfillment", concept: "Backlog", contextKind: "BUSINESS", processAreas: ["ORDER_MANAGEMENT", "PRODUCTION", "FULFILLMENT"], projectWorkPhases: [], projectControlAreas: [], participationTypes: ["MONITORED_IN"] }),
  definition({ registryId: "otd.delivery", concept: "On-Time Delivery", contextKind: "BUSINESS", processAreas: ["DELIVERY", "FULFILLMENT"], projectWorkPhases: [], projectControlAreas: [], participationTypes: ["PERFORMANCE_INDICATOR_FOR"] }),
  definition({ registryId: "supplier.procurement", concept: "Supplier Lead Time", contextKind: "BUSINESS", processAreas: ["PROCUREMENT", "SUPPLY"], projectWorkPhases: [], projectControlAreas: [], participationTypes: ["MONITORED_IN", "PERFORMANCE_INDICATOR_FOR"] }),
  definition({ registryId: "quality.quality", concept: "Quality", contextKind: "BUSINESS", processAreas: ["QUALITY"], projectWorkPhases: [], projectControlAreas: [], participationTypes: ["MONITORED_IN"] }),
  definition({ registryId: "quality.project", concept: "Quality", contextKind: "PROJECT", processAreas: ["QUALITY"], projectWorkPhases: ["MONITORING_CONTROL"], projectControlAreas: ["QUALITY_CONTROL"], participationTypes: ["MONITORED_IN"] }),
  definition({ registryId: "margin.finance", concept: "Gross Margin", contextKind: "BUSINESS", processAreas: ["FINANCE"], projectWorkPhases: [], projectControlAreas: [], participationTypes: ["PERFORMANCE_INDICATOR_FOR"] }),
  definition({ registryId: "capacity.production", concept: "Capacity", contextKind: "BUSINESS", processAreas: ["PRODUCTION", "PLANNING"], projectWorkPhases: [], projectControlAreas: [], participationTypes: ["USED_IN", "MONITORED_IN"], aspect: "CURRENT_OPERATIONS" }),
  definition({ registryId: "capacity.project-resource", concept: "Capacity", contextKind: "PROJECT", processAreas: ["PLANNING"], projectWorkPhases: ["PLANNING", "PROJECT_WORK_EXECUTION"], projectControlAreas: ["RESOURCE_MANAGEMENT"], participationTypes: ["RELEVANT_DURING"], aspect: "PLANNED_PROJECT" }),
  definition({ registryId: "milestone.control", concept: "Milestone", contextKind: "PROJECT", processAreas: [], projectWorkPhases: ["PLANNING", "PROJECT_WORK_EXECUTION", "MONITORING_CONTROL"], projectControlAreas: ["SCHEDULE_CONTROL", "DELIVERABLE_CONTROL"], participationTypes: ["RELEVANT_DURING", "CONTROLLED_IN"] }),
  definition({ registryId: "schedule-variance.control", concept: "Schedule Variance", contextKind: "PROJECT", processAreas: [], projectWorkPhases: ["MONITORING_CONTROL"], projectControlAreas: ["SCHEDULE_CONTROL"], participationTypes: ["PERFORMANCE_INDICATOR_FOR"] }),
  definition({ registryId: "cost.control", concept: "Cost", contextKind: "PROJECT", processAreas: ["FINANCE"], projectWorkPhases: ["PLANNING", "PROJECT_WORK_EXECUTION", "MONITORING_CONTROL"], projectControlAreas: ["COST_CONTROL"], participationTypes: ["CONTROLLED_IN"] }),
  definition({ registryId: "resource.planning", concept: "Resource Availability", contextKind: "PROJECT", processAreas: ["PLANNING"], projectWorkPhases: ["PLANNING", "PROJECT_WORK_EXECUTION"], projectControlAreas: ["RESOURCE_MANAGEMENT"], participationTypes: ["USED_IN"] }),
  definition({ registryId: "deliverable.scope", concept: "Deliverable", contextKind: "PROJECT", processAreas: [], projectWorkPhases: ["PLANNING", "PROJECT_WORK_EXECUTION"], projectControlAreas: ["DELIVERABLE_CONTROL", "SCOPE_CONTROL"], participationTypes: ["OUTPUT_OF"] }),
  definition({ registryId: "procurement.area", concept: "Procurement", contextKind: "PROJECT", processAreas: ["PROCUREMENT"], projectWorkPhases: ["PLANNING", "PROJECT_WORK_EXECUTION"], projectControlAreas: ["PROCUREMENT"], participationTypes: ["ASSOCIATED_WITH_PROCESS"] }),
  definition({ registryId: "delivery.fulfillment", concept: "Delivery", contextKind: "BUSINESS", processAreas: ["DELIVERY", "FULFILLMENT"], projectWorkPhases: [], projectControlAreas: [], participationTypes: ["ASSOCIATED_WITH_PROCESS"] }),
]);

export const PROJECT_WORK_REFERENCE_SEQUENCE = Object.freeze([
  "INITIATION", "PLANNING", "PROJECT_WORK_EXECUTION", "MONITORING_CONTROL", "CLOSURE",
] as const satisfies readonly ProjectWorkPhase[]);

export function processConceptKey(value: string): string {
  return normalizeEstablishedConceptMeaning(value);
}

export function findProcessContextDefinitions(conceptMeaning: string): readonly BusinessProjectProcessContextDefinition[] {
  const key = processConceptKey(conceptMeaning);
  return BUSINESS_PROJECT_PROCESS_CONTEXT_REGISTRY.filter((entry) => processConceptKey(entry.concept) === key);
}
