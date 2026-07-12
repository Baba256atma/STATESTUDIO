import type { ExecutiveCertificationGate } from "./executiveIntentResolutionCertificationTypes.ts";

const certified = Object.freeze({ status: "Certified", description: "Certified by immutable architectural metadata.", metadataOnly: true, immutable: true } as const);

export const ExecutiveIntentResolutionCertificationRegistry = Object.freeze({
  components: Object.freeze([
    Object.freeze({ id: "eng-3-certification-component-foundation", name: "Foundation", phase: "ENG-3:1", status: "Certified", stability: "Stable", publicationState: "Published", version: "1.0.0", owner: "ENG-3", metadataOnly: true, immutable: true } as const),
    Object.freeze({ id: "eng-3-certification-component-registry", name: "Registry", phase: "ENG-3:2", status: "Certified", stability: "Stable", publicationState: "Published", version: "1.0.0", owner: "ENG-3", metadataOnly: true, immutable: true } as const),
    Object.freeze({ id: "eng-3-certification-component-model", name: "Model", phase: "ENG-3:3", status: "Certified", stability: "Stable", publicationState: "Published", version: "1.0.0", owner: "ENG-3", metadataOnly: true, immutable: true } as const),
    Object.freeze({ id: "eng-3-certification-component-validation", name: "Validation", phase: "ENG-3:4", status: "Certified", stability: "Stable", publicationState: "Published", version: "1.0.0", owner: "ENG-3", metadataOnly: true, immutable: true } as const),
    Object.freeze({ id: "eng-3-certification-component-manifest", name: "Manifest", phase: "ENG-3:5", status: "Certified", stability: "Stable", publicationState: "Published", version: "1.0.0", owner: "ENG-3", metadataOnly: true, immutable: true } as const),
    Object.freeze({ id: "eng-3-certification-component-platform", name: "Platform", phase: "ENG-3:6", status: "Certified", stability: "Stable", publicationState: "Published", version: "1.0.0", owner: "ENG-3", metadataOnly: true, immutable: true } as const),
  ]),
  gates: Object.freeze([
    Object.freeze({ id: "eng-3-certification-gate-foundation-integrity", name: "Foundation Integrity", severity: "Critical", result: certified, metadataOnly: true, immutable: true } as const satisfies ExecutiveCertificationGate),
    Object.freeze({ id: "eng-3-certification-gate-registry-integrity", name: "Registry Integrity", severity: "Critical", result: certified, metadataOnly: true, immutable: true } as const satisfies ExecutiveCertificationGate),
    Object.freeze({ id: "eng-3-certification-gate-model-integrity", name: "Model Integrity", severity: "Critical", result: certified, metadataOnly: true, immutable: true } as const satisfies ExecutiveCertificationGate),
    Object.freeze({ id: "eng-3-certification-gate-validation-integrity", name: "Validation Integrity", severity: "Critical", result: certified, metadataOnly: true, immutable: true } as const satisfies ExecutiveCertificationGate),
    Object.freeze({ id: "eng-3-certification-gate-manifest-integrity", name: "Manifest Integrity", severity: "Critical", result: certified, metadataOnly: true, immutable: true } as const satisfies ExecutiveCertificationGate),
    Object.freeze({ id: "eng-3-certification-gate-platform-integrity", name: "Platform Integrity", severity: "Critical", result: certified, metadataOnly: true, immutable: true } as const satisfies ExecutiveCertificationGate),
    Object.freeze({ id: "eng-3-certification-gate-public-api-integrity", name: "Public API Integrity", severity: "Error", result: certified, metadataOnly: true, immutable: true } as const satisfies ExecutiveCertificationGate),
    Object.freeze({ id: "eng-3-certification-gate-dependency-integrity", name: "Dependency Integrity", severity: "Error", result: certified, metadataOnly: true, immutable: true } as const satisfies ExecutiveCertificationGate),
    Object.freeze({ id: "eng-3-certification-gate-compatibility-integrity", name: "Compatibility Integrity", severity: "Error", result: certified, metadataOnly: true, immutable: true } as const satisfies ExecutiveCertificationGate),
    Object.freeze({ id: "eng-3-certification-gate-metadata-integrity", name: "Metadata Integrity", severity: "Error", result: certified, metadataOnly: true, immutable: true } as const satisfies ExecutiveCertificationGate),
    Object.freeze({ id: "eng-3-certification-gate-immutability-integrity", name: "Immutability Integrity", severity: "Critical", result: certified, metadataOnly: true, immutable: true } as const satisfies ExecutiveCertificationGate),
    Object.freeze({ id: "eng-3-certification-gate-release-readiness", name: "Release Readiness", severity: "Warning", result: certified, metadataOnly: true, immutable: true } as const satisfies ExecutiveCertificationGate),
  ]),
  metadataOnly: true, immutable: true, deterministic: true,
} as const);
