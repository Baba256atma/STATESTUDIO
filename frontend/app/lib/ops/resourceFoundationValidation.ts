import {
  ExecutiveResourceIntelligenceFoundation,
  buildResourceIntelligenceManifest,
  validateResourceIntelligenceFoundation,
} from "./resourceIntelligenceIndex.ts";
import type { ResourceValidationEntry } from "./resourceValidationTypes.ts";

export const ResourceFoundationValidation = Object.freeze([
  Object.freeze({
    id: "resource-foundation-integrity",
    name: "Foundation Integrity",
    description: "Validates the OPS-5:1 resource foundation public surface.",
    category: "Foundation",
    status:
      ExecutiveResourceIntelligenceFoundation.identity.platformId === "OPS-5:1" &&
      validateResourceIntelligenceFoundation().summary.status === "PASS"
        ? "PASS"
        : "FAIL",
    metadataOnly: true,
  } as const satisfies ResourceValidationEntry),
  Object.freeze({
    id: "resource-foundation-manifest",
    name: "Foundation Manifest Generation",
    description: "Validates deterministic manifest generation for OPS-5:1.",
    category: "Manifest",
    status:
      Object.isFrozen(buildResourceIntelligenceManifest()) &&
      buildResourceIntelligenceManifest().metadataOnly
        ? "PASS"
        : "FAIL",
    metadataOnly: true,
  } as const satisfies ResourceValidationEntry),
  Object.freeze({
    id: "resource-foundation-immutability",
    name: "Foundation Immutability",
    description: "Validates immutable resource foundation exports.",
    category: "Immutability",
    status: Object.isFrozen(ExecutiveResourceIntelligenceFoundation) ? "PASS" : "FAIL",
    metadataOnly: true,
  } as const satisfies ResourceValidationEntry),
] as const);
