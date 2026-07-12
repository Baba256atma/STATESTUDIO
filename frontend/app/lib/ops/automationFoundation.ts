import { AutomationContracts } from "./automationContracts.ts";
import { AutomationMetadataCatalog } from "./automationMetadata.ts";
import { AutomationRegistry } from "./automationRegistry.ts";
import {
  AutomationTypes,
  type AutomationFoundationDescriptor,
} from "./automationTypes.ts";

const foundationDescriptor = Object.freeze({
  namespace: "nexora.ops.automation.foundation",
  contractCount: AutomationContracts.all.length,
  metadataCatalogCount: 4,
  registryStatus: "Complete",
  metadataOnly: true,
  immutable: true,
  deterministic: true,
} as const satisfies AutomationFoundationDescriptor);

export const ExecutiveAutomationFoundation = Object.freeze({
  contracts: AutomationContracts,
  registry: AutomationRegistry,
  metadata: AutomationMetadataCatalog,
  types: AutomationTypes,
  descriptor: foundationDescriptor,
  metadataOnly: true,
  immutable: true,
  deterministic: true,
} as const);

export const getExecutiveAutomationFoundation = () =>
  ExecutiveAutomationFoundation;

export const getExecutiveAutomationMetadata = () => AutomationMetadataCatalog;
