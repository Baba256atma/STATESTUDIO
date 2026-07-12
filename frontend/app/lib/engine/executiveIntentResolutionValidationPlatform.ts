import { ExecutiveIntentResolutionFoundationValidation } from "./executiveIntentResolutionFoundationValidation.ts";
import { ExecutiveIntentResolutionModelValidation } from "./executiveIntentResolutionModelValidation.ts";
import { ExecutiveIntentResolutionRegistryValidation } from "./executiveIntentResolutionRegistryValidation.ts";
import { ExecutiveIntentResolutionValidationManifest } from "./executiveIntentResolutionValidationManifest.ts";
import type { ExecutiveValidationPlatform } from "./executiveIntentResolutionValidationTypes.ts";

const metadata = Object.freeze({
  platformId: "ENG-3:4", name: "Executive Intent Resolution Validation Platform",
  namespace: "nexora.engine.executive.intent-resolution.validation", version: "1.0.0",
  owner: "ENG-3", status: "Published", metadataOnly: true, immutable: true, deterministic: true,
} as const);

export const ExecutiveIntentResolutionValidationPlatform = Object.freeze({
  foundationValidation: ExecutiveIntentResolutionFoundationValidation,
  registryValidation: ExecutiveIntentResolutionRegistryValidation,
  modelValidation: ExecutiveIntentResolutionModelValidation,
  manifest: ExecutiveIntentResolutionValidationManifest,
  metadata,
  metadataOnly: true, immutable: true, deterministic: true,
} as const satisfies ExecutiveValidationPlatform);

export const getExecutiveIntentResolutionValidationPlatform = () => ExecutiveIntentResolutionValidationPlatform;
export const getExecutiveIntentResolutionValidationManifest = () => ExecutiveIntentResolutionValidationManifest;
