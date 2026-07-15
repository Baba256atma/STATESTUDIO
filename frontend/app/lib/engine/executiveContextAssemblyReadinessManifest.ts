import type { ExecutiveContextManifestGuarantee, ExecutiveContextManifestReadinessGate } from "./executiveContextAssemblyManifestTypes.ts";

const gate = (
  key: string,
  name: string,
  description: string,
  status: ExecutiveContextManifestReadinessGate["status"] = "Pass",
) => Object.freeze({
  id: `eng-4-readiness-${key}`,
  name, description, status, owner: "ENG-4",
  metadataOnly: true, immutable: true, deterministic: true,
} as const satisfies ExecutiveContextManifestReadinessGate);

const guarantee = (key: string, name: string) => Object.freeze({
  id: `eng-4-guarantee-${key}`,
  guarantee: name,
  status: "Guaranteed",
  metadataOnly: true, immutable: true,
} as const satisfies ExecutiveContextManifestGuarantee);

export const ExecutiveContextAssemblyReadinessManifest = Object.freeze([
  gate("foundation-complete", "Foundation Complete", "ENG-4:1 Foundation is complete and published."),
  gate("registry-complete", "Registry Complete", "ENG-4:2 Registry is complete and published."),
  gate("model-complete", "Model Complete", "ENG-4:3 Model is complete and published."),
  gate("validation-passed", "Validation Passed", "ENG-4:4 Validation passed all canonical rules and gates."),
  gate("ownership-protected", "Ownership Protected", "ENG-4 ownership boundaries are protected."),
  gate("dependencies-approved", "Dependencies Approved", "Dependencies are public-index only and forward-only."),
  gate("public-apis-stable", "Public APIs Stable", "Approved public helper APIs remain deterministic and stable."),
  gate("namespace-compatibility-preserved", "Namespace Compatibility Preserved", "ENG-1 compatibility relocation remains approved."),
  gate("anti-duplication-preserved", "Anti-Duplication Preserved", "ENG-4 specialized models remain distinct from ENG-1 generics."),
  gate("metadata-only-preserved", "Metadata-Only Preserved", "Platform architecture remains metadata-only."),
  gate("runtime-free-preserved", "Runtime-Free Preserved", "Platform architecture remains runtime-free."),
  gate("immutability-preserved", "Immutability Preserved", "Published metadata remains immutable."),
  gate("determinism-preserved", "Determinism Preserved", "Published helpers remain deterministic."),
  gate("inventory-complete", "Inventory Complete", "Manifest inventories match ENG-4:1–ENG-4:4 public metadata."),
  gate("ready-for-platform", "Ready for Platform", "Manifest is ready for ENG-4:6 Platform.", "Ready"),
] as const);

export const ExecutiveContextAssemblyGuaranteeManifest = Object.freeze([
  guarantee("metadata-only", "Metadata Only"),
  guarantee("runtime-free", "Runtime Free"),
  guarantee("immutable", "Immutable"),
  guarantee("deterministic", "Deterministic"),
  guarantee("public-api-boundaries", "Public API Boundaries Preserved"),
  guarantee("ownership-protected", "Ownership Protected"),
  guarantee("anti-duplication-protected", "Anti-Duplication Protected"),
  guarantee("no-internal-cross-platform-imports", "No Internal Cross-Platform Imports"),
  guarantee("no-future-phase-dependency", "No Future-Phase Dependency"),
  guarantee("namespace-compatibility-preserved", "Namespace Compatibility Preserved"),
  guarantee("snapshot-no-runtime-data", "Snapshot Contains No Stored Runtime Data"),
  guarantee("ready-for-platform", "Ready for Platform"),
] as const);
