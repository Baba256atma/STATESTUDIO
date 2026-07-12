import { ExecutiveOperationsSuiteValidationManifest } from "./executiveOperationsSuiteValidationManifest.ts";
import { ExecutiveOperationsSuiteValidationMetadata, ExecutiveOperationsSuiteValidationRegistry } from "./executiveOperationsSuiteValidationRegistry.ts";

export const ExecutiveOperationsSuiteValidation = Object.freeze({
  metadata: ExecutiveOperationsSuiteValidationMetadata,
  registry: ExecutiveOperationsSuiteValidationRegistry,
  manifest: ExecutiveOperationsSuiteValidationManifest,
  metadataOnly: true, immutable: true, deterministic: true,
} as const);

export const getExecutiveOperationsSuiteValidation = () => ExecutiveOperationsSuiteValidation;
export const getExecutiveOperationsSuiteValidationRegistry = () => ExecutiveOperationsSuiteValidationRegistry;
export const getExecutiveOperationsSuiteValidationManifest = () => ExecutiveOperationsSuiteValidationManifest;
export const getExecutiveOperationsSuiteValidationMetadata = () => ExecutiveOperationsSuiteValidationMetadata;
export const getExecutiveOperationsSuiteValidationRuleById = (id: string) => ExecutiveOperationsSuiteValidationRegistry.find((entry) => entry.id === id);
export const getExecutiveOperationsSuiteValidationRulesByCategory = (category: string) => Object.freeze(ExecutiveOperationsSuiteValidationRegistry.filter((entry) => entry.category === category));
