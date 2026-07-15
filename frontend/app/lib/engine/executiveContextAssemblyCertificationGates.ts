import type { ExecutiveContextCertificationGate } from "./executiveContextAssemblyCertificationTypes.ts";

const gate = (
  key: string,
  name: string,
  description: string,
  category: ExecutiveContextCertificationGate["category"],
  certifiedPhase: ExecutiveContextCertificationGate["certifiedPhase"],
  guarantee: string,
  evidenceReferences: readonly string[],
  severity: ExecutiveContextCertificationGate["severity"] = "Critical",
) => Object.freeze({
  gateId: `eng-4-cert-gate-${key}`,
  name, description, category, severity, status: "Pass",
  evidenceReferences, certifiedPhase, owner: "ENG-4", guarantee,
  runtimeFree: true, metadataOnly: true, immutable: true, deterministic: true,
} as const satisfies ExecutiveContextCertificationGate);

export const ExecutiveContextAssemblyCertificationGates = Object.freeze([
  gate("foundation-complete", "Foundation Complete", "ENG-4:1 Foundation is complete and certified.", "Foundation", "ENG-4:1", "Foundation Certified", Object.freeze(["eng-4-cert-evidence-foundation"])),
  gate("registry-complete", "Registry Complete", "ENG-4:2 Registry is complete and certified.", "Registry", "ENG-4:2", "Registry Certified", Object.freeze(["eng-4-cert-evidence-registry"])),
  gate("model-complete", "Model Complete", "ENG-4:3 Model is complete and certified.", "Model", "ENG-4:3", "Model Certified", Object.freeze(["eng-4-cert-evidence-model"])),
  gate("validation-passed", "Validation Passed", "ENG-4:4 Validation remains passed.", "Validation", "ENG-4:4", "Validation Certified", Object.freeze(["eng-4-cert-evidence-validation"])),
  gate("manifest-complete", "Manifest Complete", "ENG-4:5 Manifest is complete and certified.", "Manifest", "ENG-4:5", "Manifest Certified", Object.freeze(["eng-4-cert-evidence-manifest"])),
  gate("platform-assembled", "Platform Assembled", "ENG-4:6 Platform is assembled and certified.", "Platform", "ENG-4:6", "Platform Certified", Object.freeze(["eng-4-cert-evidence-platform"])),
  gate("ownership-protected", "Ownership Protected", "ENG-4 ownership boundaries remain protected.", "Ownership", "ENG-4:7", "Ownership Protected", Object.freeze(["eng-4-cert-evidence-ownership"])),
  gate("anti-duplication-protected", "Anti-Duplication Protected", "ENG-4 specialized models remain non-duplicative of ENG-1 generics.", "Ownership", "ENG-4:7", "Anti-Duplication Protected", Object.freeze(["eng-4-cert-evidence-ownership", "eng-4-cert-evidence-compatibility"])),
  gate("dependencies-approved", "Dependencies Approved", "Dependencies remain public-index only and forward-only.", "Boundary", "ENG-4:7", "Dependency Boundaries Preserved", Object.freeze(["eng-4-cert-evidence-dependency"])),
  gate("public-apis-stable", "Public APIs Stable", "Approved public architectural helpers remain stable.", "PublicApi", "ENG-4:7", "Public API Stable", Object.freeze(["eng-4-cert-evidence-public-api"])),
  gate("namespace-compatibility-preserved", "Namespace Compatibility Preserved", "Namespace compatibility remains preserved.", "Compatibility", "ENG-4:7", "Namespace Compatibility Preserved", Object.freeze(["eng-4-cert-evidence-compatibility"])),
  gate("metadata-only-preserved", "Metadata-Only Preserved", "Architecture remains metadata-only.", "Boundary", "ENG-4:7", "Metadata Only", Object.freeze(["eng-4-cert-evidence-runtime-boundary"])),
  gate("runtime-free-preserved", "Runtime-Free Preserved", "Architecture remains runtime-free.", "Boundary", "ENG-4:7", "Runtime Free", Object.freeze(["eng-4-cert-evidence-runtime-boundary"])),
  gate("immutability-preserved", "Immutability Preserved", "Published certification metadata remains immutable.", "Boundary", "ENG-4:7", "Immutable", Object.freeze(["eng-4-cert-evidence-runtime-boundary"])),
  gate("determinism-preserved", "Determinism Preserved", "Published helpers remain deterministic.", "Boundary", "ENG-4:7", "Deterministic", Object.freeze(["eng-4-cert-evidence-public-api"])),
  gate("inventory-integrity-preserved", "Inventory Integrity Preserved", "Manifest and validation inventory counts remain intact.", "Manifest", "ENG-4:5", "Manifest Certified", Object.freeze(["eng-4-cert-evidence-manifest", "eng-4-cert-evidence-validation"])),
  gate("eng-1-compatibility-preserved", "ENG-1 Compatibility Preserved", "ENG-1 generic model relocation remains approved compatibility.", "Compatibility", "ENG-4:7", "ENG-1 Compatibility Preserved", Object.freeze(["eng-4-cert-evidence-compatibility"])),
  gate("regression-safety-confirmed", "Regression Safety Confirmed", "Regression declarations confirm prior surfaces remain preserved.", "Regression", "ENG-4:7", "Regression Safety Confirmed", Object.freeze(["eng-4-cert-evidence-regression"])),
  gate("no-future-phase-implementation", "No Future-Phase Implementation", "ENG-4:8 Freeze is not imported or implemented.", "Boundary", "ENG-4:7", "No Future-Phase Implementation", Object.freeze(["eng-4-cert-evidence-runtime-boundary"])),
  gate("ready-for-freeze", "Ready for Freeze", "Certification is ready for ENG-4:8 Freeze.", "Readiness", "ENG-4:7", "Ready for Freeze", Object.freeze(["eng-4-cert-evidence-platform", "eng-4-cert-evidence-regression"])),
] as const);
