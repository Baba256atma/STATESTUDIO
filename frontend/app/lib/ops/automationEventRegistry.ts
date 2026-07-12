import {
  AutomationEventContract,
} from "./automationIndex.ts";
import type { AutomationEventDescriptor } from "./automationRegistryTypes.ts";

const createEventDescriptor = (
  id: string,
  category: AutomationEventDescriptor["category"],
  name: string,
  description: string,
) =>
  Object.freeze({
    id,
    category,
    name,
    description,
    metadata: AutomationEventContract.metadata,
  } as const satisfies AutomationEventDescriptor);

export const AutomationEventRegistry = Object.freeze([
  createEventDescriptor("automation-event-task", "Task", "Task Event", "Metadata-only task event category for automation registries."),
  createEventDescriptor("automation-event-workflow", "Workflow", "Workflow Event", "Metadata-only workflow event category for automation registries."),
  createEventDescriptor("automation-event-project", "Project", "Project Event", "Metadata-only project event category for automation registries."),
  createEventDescriptor("automation-event-resource", "Resource", "Resource Event", "Metadata-only resource event category for automation registries."),
  createEventDescriptor("automation-event-schedule", "Schedule", "Schedule Event", "Metadata-only schedule event category for automation registries."),
  createEventDescriptor("automation-event-dependency", "Dependency", "Dependency Event", "Metadata-only dependency event category for automation registries."),
  createEventDescriptor("automation-event-business", "Business", "Business Event", "Metadata-only business event category for automation registries."),
  createEventDescriptor("automation-event-user", "User", "User Event", "Metadata-only user event category for automation registries."),
  createEventDescriptor("automation-event-system", "System", "System Event", "Metadata-only system event category for automation registries."),
] as const);
