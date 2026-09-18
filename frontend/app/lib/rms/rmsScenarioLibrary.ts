/**
 * NPA-T RMS:7 — initial Scenario Library. Neutral about Nexora conclusions.
 */

import type { RmsScenarioDefinition } from "./rmsScenarioContract.ts";
import {
  instantiateLogisticsTemplate,
  instantiateManufacturingTemplate,
  instantiateProjectDeliveryTemplate,
  instantiateServiceTemplate,
} from "./rmsWorldTemplates.ts";
import {
  RMS_COMBINED_DISTURBANCE_SCHEDULE,
  RMS_PROJECT_DISTURBANCE_SCHEDULE,
  RMS_RISK_EXPOSURE_SCHEDULE,
} from "./rmsEventFixtures.ts";
import { RMS_NORTHSTAR_AGENDA, RMS_WAREHOUSE_AGENDA } from "./rmsManagerTurnGeneration.ts";
import type { RmsScheduledDisturbance } from "./rmsEventContract.ts";
import type { RmsOperationalSourceFamily } from "./rmsOperatorContract.ts";

function serviceDemandAndStaff(): readonly RmsScheduledDisturbance[] {
  return Object.freeze([
    Object.freeze({
      eventId: "evt:service-demand",
      family: "DEMAND",
      kind: "INSTANT",
      scheduledTick: 4,
      durationTicks: null,
      targetEntityId: "org:northline",
      magnitude: 140,
      origin: "RMS_SCHEDULER",
      createsNexoraProblemObject: false,
      createsNexoraRiskObject: false,
      knownToNexora: false,
      knownToManager: false,
    }),
    Object.freeze({
      eventId: "evt:service-staff",
      family: "RESOURCE",
      kind: "INSTANT",
      scheduledTick: 4,
      durationTicks: null,
      targetEntityId: "resource:crew",
      magnitude: 8,
      origin: "RMS_SCHEDULER",
      createsNexoraProblemObject: false,
      createsNexoraRiskObject: false,
      knownToNexora: false,
      knownToManager: false,
    }),
  ]);
}

export const RMS_SCENARIO_MANUFACTURING_CAPACITY_PRESSURE: RmsScenarioDefinition = Object.freeze({
  scenarioId: "manufacturing-capacity-pressure",
  version: "1.0",
  title: "Manufacturing Under Capacity Pressure",
  description: "Manage a growing manufacturing operation as demand rises and operational capacity becomes constrained.",
  worldKind: "BUSINESS",
  category: "MANUFACTURING",
  complexity: "DEEP",
  worldTemplateId: "manufacturing-operations",
  instantiateWorld: instantiateManufacturingTemplate,
  enabledSources: Object.freeze(["ERP", "PRODUCTION", "INVENTORY", "MAINTENANCE", "CRM"] as const satisfies readonly RmsOperationalSourceFamily[]),
  observationPolicyId: "RMS_DEFAULT",
  eventSchedule: RMS_COMBINED_DISTURBANCE_SCHEDULE,
  managerProfileId: "DATA_DRIVEN_MANAGER",
  managerObjective: Object.freeze({
    objectiveId: "obj-delivery-pressure",
    statement: "Understand why delivery performance is deteriorating and identify what deserves management attention.",
    hostKind: "BUSINESS",
    agenda: RMS_NORTHSTAR_AGENDA,
  }),
  managerVisibleContext: Object.freeze(["I manage Northstar operations.", "Delivery performance is a concern."]),
  durationTicks: 21,
  managerTurns: 2,
  tags: Object.freeze(["manufacturing", "capacity", "delivery"]),
  requiredCapabilities: Object.freeze(["RMS:2", "RMS:3", "RMS:4", "RMS:5", "RMS:6"]),
  customer: Object.freeze({
    title: "Manufacturing Under Capacity Pressure",
    shortDescription: "Watch operational pressure develop in a manufacturing business as conditions change.",
    estimatedLength: "short",
    managementTopics: Object.freeze(["capacity management", "delivery performance", "operational evidence", "scenario thinking"]),
    dataSourcesInvolved: Object.freeze(["ERP", "PRODUCTION", "INVENTORY", "MAINTENANCE"]),
    whatUserMayLearn: Object.freeze(["how Nexora uses operational data", "how uncertainty is preserved"]),
    observationFocus: Object.freeze(["orders", "capacity-related operational fields", "machine status"]),
    disclosesHiddenEvents: false,
  }),
  forkCompatible: true,
});

export const RMS_SCENARIO_PROJECT_DELIVERY_PRESSURE: RmsScenarioDefinition = Object.freeze({
  scenarioId: "project-delivery-pressure",
  version: "1.0",
  title: "Project Delivery Pressure",
  description: "A project where resource and schedule conditions may put actual progress behind plan.",
  worldKind: "PROJECT",
  category: "PROJECT_DELIVERY",
  complexity: "DEEP",
  worldTemplateId: "project-delivery",
  instantiateWorld: instantiateProjectDeliveryTemplate,
  enabledSources: Object.freeze(["PMO", "PROJECT_CONTROL", "FINANCE"] as const satisfies readonly RmsOperationalSourceFamily[]),
  observationPolicyId: "RMS_DEFAULT",
  eventSchedule: RMS_PROJECT_DISTURBANCE_SCHEDULE,
  managerProfileId: "STANDARD_MANAGER",
  managerObjective: Object.freeze({
    objectiveId: "obj-progress",
    statement: "Understand why actual progress is moving behind plan.",
    hostKind: "PROJECT",
    agenda: RMS_WAREHOUSE_AGENDA,
  }),
  managerVisibleContext: Object.freeze(["I sponsor Warehouse Expansion."]),
  durationTicks: 5,
  managerTurns: 2,
  tags: Object.freeze(["project", "schedule", "resources"]),
  requiredCapabilities: Object.freeze(["RMS:2", "RMS:3", "RMS:4", "RMS:5", "RMS:6"]),
  customer: Object.freeze({
    title: "Project Delivery Pressure",
    shortDescription: "Watch a project-control environment as progress and resources change.",
    estimatedLength: "short",
    managementTopics: Object.freeze(["project control", "resource capacity", "schedule exposure"]),
    dataSourcesInvolved: Object.freeze(["PMO", "PROJECT_CONTROL"]),
    whatUserMayLearn: Object.freeze(["how Nexora uses project-control observations"]),
    observationFocus: Object.freeze(["planned progress", "actual progress", "resource usage"]),
    disclosesHiddenEvents: false,
  }),
  forkCompatible: true,
});

export const RMS_SCENARIO_LOGISTICS_DELIVERY_PRESSURE: RmsScenarioDefinition = Object.freeze({
  scenarioId: "logistics-delivery-pressure",
  version: "1.0",
  title: "Logistics Delivery Pressure",
  description: "A logistics operation where inbound delay may pressure the outbound buffer.",
  worldKind: "BUSINESS",
  category: "LOGISTICS",
  complexity: "PARITY",
  worldTemplateId: "logistics-delivery",
  instantiateWorld: instantiateLogisticsTemplate,
  enabledSources: Object.freeze(["ERP", "INVENTORY", "CRM"] as const satisfies readonly RmsOperationalSourceFamily[]),
  observationPolicyId: "RMS_DEFAULT",
  eventSchedule: RMS_RISK_EXPOSURE_SCHEDULE,
  managerProfileId: "STANDARD_MANAGER",
  managerObjective: Object.freeze({
    objectiveId: "obj-logistics",
    statement: "Understand increasing delivery exposure.",
    hostKind: "BUSINESS",
    agenda: RMS_NORTHSTAR_AGENDA,
  }),
  managerVisibleContext: Object.freeze(["I oversee outbound delivery performance."]),
  durationTicks: 4,
  managerTurns: 1,
  tags: Object.freeze(["logistics", "inventory"]),
  requiredCapabilities: Object.freeze(["RMS:2", "RMS:3", "RMS:4", "RMS:5", "RMS:6"]),
  customer: Object.freeze({
    title: "Logistics Delivery Pressure",
    shortDescription: "Watch inventory-buffer pressure in a logistics business.",
    estimatedLength: "very short",
    managementTopics: Object.freeze(["delivery exposure", "inventory buffer"]),
    dataSourcesInvolved: Object.freeze(["ERP", "INVENTORY"]),
    whatUserMayLearn: Object.freeze(["risk exposure is not an observed failure"]),
    observationFocus: Object.freeze(["inventory quantity", "orders"]),
    disclosesHiddenEvents: false,
  }),
  forkCompatible: true,
});

export const RMS_SCENARIO_SERVICE_CAPACITY_PRESSURE: RmsScenarioDefinition = Object.freeze({
  scenarioId: "service-capacity-pressure",
  version: "1.0",
  title: "Service Capacity Pressure",
  description: "A service operation where demand and workforce conditions may affect service level.",
  worldKind: "BUSINESS",
  category: "SERVICE",
  complexity: "PARITY",
  worldTemplateId: "service-operations",
  instantiateWorld: instantiateServiceTemplate,
  enabledSources: Object.freeze(["CRM", "HR", "ERP"] as const satisfies readonly RmsOperationalSourceFamily[]),
  observationPolicyId: "RMS_DEFAULT",
  eventSchedule: serviceDemandAndStaff(),
  managerProfileId: "IMPATIENT_MANAGER",
  managerObjective: Object.freeze({
    objectiveId: "obj-service",
    statement: "Understand service-level deterioration.",
    hostKind: "BUSINESS",
    agenda: RMS_NORTHSTAR_AGENDA,
  }),
  managerVisibleContext: Object.freeze(["Customers are asking about wait times."]),
  durationTicks: 4,
  managerTurns: 1,
  tags: Object.freeze(["service", "workforce"]),
  requiredCapabilities: Object.freeze(["RMS:2", "RMS:3", "RMS:4", "RMS:5", "RMS:6"]),
  customer: Object.freeze({
    title: "Service Capacity Pressure",
    shortDescription: "Watch a service desk as demand and staffing conditions change.",
    estimatedLength: "very short",
    managementTopics: Object.freeze(["service level", "workforce capacity"]),
    dataSourcesInvolved: Object.freeze(["CRM", "HR"]),
    whatUserMayLearn: Object.freeze(["how Nexora uses operational demand observations"]),
    observationFocus: Object.freeze(["orders received", "resource usage"]),
    disclosesHiddenEvents: false,
  }),
  forkCompatible: true,
});

export const RMS_INITIAL_SCENARIO_LIBRARY = Object.freeze([
  RMS_SCENARIO_MANUFACTURING_CAPACITY_PRESSURE,
  RMS_SCENARIO_PROJECT_DELIVERY_PRESSURE,
  RMS_SCENARIO_LOGISTICS_DELIVERY_PRESSURE,
  RMS_SCENARIO_SERVICE_CAPACITY_PRESSURE,
]);
