import type { ExecutiveEngineExtensionPolicyDescriptor } from "./engineFreezeTypes.ts";

export const ExecutiveEngineExtensionPolicy = Object.freeze({
  artifactId: "ENG-EXTENSION-001", foundationStatus: "Frozen",
  futureExtensionPoints: Object.freeze([
    "ENG-2 Request Understanding", "ENG-3 Intent Resolution", "ENG-4 Context Assembly",
    "ENG-5 Planning", "ENG-6 Decision Engine", "ENG-7 Orchestration",
  ]),
  rules: Object.freeze([
    "ENG-1 Foundation is frozen.",
    "Future Engine functionality must extend later Engine phases.",
    "ENG-1 must not gain new runtime capabilities.",
  ]),
  runtimeCapabilitiesAllowedInEng1: false,
  metadataOnly: true, immutable: true, deterministic: true,
} as const satisfies ExecutiveEngineExtensionPolicyDescriptor);
