import {
  AutomationTriggerContract,
} from "./automationIndex.ts";
import type { AutomationTriggerDescriptor } from "./automationRegistryTypes.ts";

const createTriggerDescriptor = (
  id: string,
  type: AutomationTriggerDescriptor["type"],
  description: string,
) =>
  Object.freeze({
    id,
    type,
    description,
    metadata: AutomationTriggerContract.metadata,
  } as const satisfies AutomationTriggerDescriptor);

export const AutomationTriggerRegistry = Object.freeze([
  createTriggerDescriptor("automation-trigger-event", "Event Trigger", "Metadata-only event trigger catalog entry."),
  createTriggerDescriptor("automation-trigger-schedule", "Schedule Trigger", "Metadata-only schedule trigger catalog entry."),
  createTriggerDescriptor("automation-trigger-manual", "Manual Trigger", "Metadata-only manual trigger catalog entry."),
  createTriggerDescriptor("automation-trigger-system", "System Trigger", "Metadata-only system trigger catalog entry."),
  createTriggerDescriptor("automation-trigger-dependency", "Dependency Trigger", "Metadata-only dependency trigger catalog entry."),
  createTriggerDescriptor("automation-trigger-resource", "Resource Trigger", "Metadata-only resource trigger catalog entry."),
] as const);
