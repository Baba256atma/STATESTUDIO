import type {
  ExecutiveContextPlatformGuarantee,
  ExecutiveContextPlatformReadinessGate,
} from "./executiveContextAssemblyPlatformTypes.ts";

const gate = (
  key: string,
  name: string,
  description: string,
  status: ExecutiveContextPlatformReadinessGate["status"] = "Pass",
) => Object.freeze({
  id: `eng-4-platform-readiness-${key}`,
  name, description, status, owner: "ENG-4",
  metadataOnly: true, immutable: true, deterministic: true,
} as const satisfies ExecutiveContextPlatformReadinessGate);

const guarantee = (key: string, name: string) => Object.freeze({
  id: `eng-4-platform-guarantee-${key}`,
  guarantee: name,
  status: "Guaranteed",
  metadataOnly: true, immutable: true,
} as const satisfies ExecutiveContextPlatformGuarantee);

export const ExecutiveContextAssemblyPlatformReadiness = Object.freeze([
  gate("foundation-available", "Foundation Available", "ENG-4:1 Foundation public surface is available."),
  gate("registry-available", "Registry Available", "ENG-4:2 Registry public surface is available."),
  gate("model-available", "Model Available", "ENG-4:3 Model public surface is available."),
  gate("validation-passed", "Validation Passed", "ENG-4:4 Validation remains passed."),
  gate("manifest-complete", "Manifest Complete", "ENG-4:5 Manifest is complete."),
  gate("component-inventory-complete", "Component Inventory Complete", "Exactly five canonical platform components are registered."),
  gate("dependencies-approved", "Dependencies Approved", "Dependencies remain public-index only and forward-only."),
  gate("ownership-protected", "Ownership Protected", "ENG-4 ownership boundaries remain protected."),
  gate("anti-duplication-protected", "Anti-Duplication Protected", "ENG-4 specialized models remain distinct from ENG-1 generics."),
  gate("public-apis-stable", "Public APIs Stable", "Approved public architectural helpers remain stable."),
  gate("namespace-compatibility-preserved", "Namespace Compatibility Preserved", "ENG-1 compatibility relocation remains approved."),
  gate("metadata-only-preserved", "Metadata-Only Preserved", "Platform architecture remains metadata-only."),
  gate("runtime-free-preserved", "Runtime-Free Preserved", "Platform architecture remains runtime-free."),
  gate("immutability-preserved", "Immutability Preserved", "Published platform metadata remains immutable."),
  gate("determinism-preserved", "Determinism Preserved", "Published platform helpers remain deterministic."),
  gate("ready-for-certification", "Ready for Certification", "Platform is ready for ENG-4:7 Certification.", "Ready"),
] as const);

export const ExecutiveContextAssemblyPlatformGuarantees = Object.freeze([
  guarantee("metadata-only", "Metadata Only"),
  guarantee("runtime-free", "Runtime Free"),
  guarantee("immutable", "Immutable"),
  guarantee("deterministic", "Deterministic"),
  guarantee("foundation-preserved", "Foundation Preserved"),
  guarantee("registry-preserved", "Registry Preserved"),
  guarantee("model-preserved", "Model Preserved"),
  guarantee("validation-preserved", "Validation Preserved"),
  guarantee("manifest-preserved", "Manifest Preserved"),
  guarantee("public-api-boundaries", "Public API Boundaries Preserved"),
  guarantee("ownership-protected", "Ownership Protected"),
  guarantee("anti-duplication-protected", "Anti-Duplication Protected"),
  guarantee("no-internal-cross-platform-imports", "No Internal Cross-Platform Imports"),
  guarantee("no-future-phase-implementation", "No Future-Phase Implementation"),
  guarantee("namespace-compatibility-preserved", "Namespace Compatibility Preserved"),
  guarantee("ready-for-certification", "Ready for Certification"),
] as const);
