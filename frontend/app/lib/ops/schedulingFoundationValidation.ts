import {
  ExecutiveSchedulingIntelligenceFoundation,
  buildSchedulingIntelligenceManifest,
  validateSchedulingIntelligenceFoundation,
} from "./schedulingIntelligenceIndex.ts";
import type { SchedulingValidationEntry } from "./schedulingValidationTypes.ts";

export const SchedulingFoundationValidation = Object.freeze([
  Object.freeze({
    id: "scheduling-foundation-integrity",
    name: "Foundation Integrity",
    description: "Validates the OPS-6:1 scheduling foundation public surface.",
    category: "Foundation",
    status:
      ExecutiveSchedulingIntelligenceFoundation.identity.platformId === "OPS-6:1" &&
      validateSchedulingIntelligenceFoundation().summary.status === "PASS"
        ? "PASS"
        : "FAIL",
    metadataOnly: true,
  } as const satisfies SchedulingValidationEntry),
  Object.freeze({
    id: "scheduling-foundation-manifest",
    name: "Foundation Manifest Generation",
    description: "Validates deterministic manifest generation for OPS-6:1.",
    category: "Manifest",
    status:
      Object.isFrozen(buildSchedulingIntelligenceManifest()) &&
      buildSchedulingIntelligenceManifest().metadataOnly
        ? "PASS"
        : "FAIL",
    metadataOnly: true,
  } as const satisfies SchedulingValidationEntry),
  Object.freeze({
    id: "scheduling-foundation-immutability",
    name: "Foundation Immutability",
    description: "Validates immutable scheduling foundation exports.",
    category: "Immutability",
    status: Object.isFrozen(ExecutiveSchedulingIntelligenceFoundation) ? "PASS" : "FAIL",
    metadataOnly: true,
  } as const satisfies SchedulingValidationEntry),
] as const);
