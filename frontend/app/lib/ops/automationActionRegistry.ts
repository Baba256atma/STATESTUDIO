import {
  AutomationActionContract,
} from "./automationIndex.ts";
import type { AutomationActionDescriptor } from "./automationRegistryTypes.ts";

const createActionDescriptor = (
  id: string,
  category: AutomationActionDescriptor["category"],
  description: string,
) =>
  Object.freeze({
    id,
    category,
    description,
    metadata: AutomationActionContract.metadata,
  } as const satisfies AutomationActionDescriptor);

export const AutomationActionRegistry = Object.freeze([
  createActionDescriptor("automation-action-create-task", "Create Task", "Metadata-only create-task action catalog entry."),
  createActionDescriptor("automation-action-update-task", "Update Task", "Metadata-only update-task action catalog entry."),
  createActionDescriptor("automation-action-notify-user", "Notify User", "Metadata-only notify-user action catalog entry."),
  createActionDescriptor("automation-action-assign-resource", "Assign Resource", "Metadata-only assign-resource action catalog entry."),
  createActionDescriptor("automation-action-create-workflow", "Create Workflow", "Metadata-only create-workflow action catalog entry."),
  createActionDescriptor("automation-action-start-project", "Start Project", "Metadata-only start-project action catalog entry."),
  createActionDescriptor("automation-action-update-schedule", "Update Schedule", "Metadata-only update-schedule action catalog entry."),
  createActionDescriptor("automation-action-generate-report", "Generate Report", "Metadata-only generate-report action catalog entry."),
  createActionDescriptor("automation-action-call-integration", "Call Integration", "Metadata-only call-integration action catalog entry."),
] as const);
