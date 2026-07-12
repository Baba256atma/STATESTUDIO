import type { ExecutiveCompatibilityEvidence, ExecutiveRegressionDeclaration } from "./executiveIntentResolutionCertificationTypes.ts";

export const ExecutiveIntentResolutionCompatibilityMatrix = Object.freeze([
  Object.freeze({ id: "eng-3-certification-compatibility-engine", target: "Executive Engine Layer", status: "Compatible", description: "Compatible with established Executive Engine metadata architecture.", metadataOnly: true, immutable: true } as const satisfies ExecutiveCompatibilityEvidence),
  Object.freeze({ id: "eng-3-certification-compatibility-request", target: "Executive Request Platform", status: "Compatible", description: "Compatible through public request and intent metadata boundaries.", metadataOnly: true, immutable: true } as const satisfies ExecutiveCompatibilityEvidence),
  Object.freeze({ id: "eng-3-certification-compatibility-planning", target: "Executive Planning Platform", status: "ArchitecturallyCompatible", description: "Prepared for future planning metadata dependencies.", metadataOnly: true, immutable: true } as const satisfies ExecutiveCompatibilityEvidence),
  Object.freeze({ id: "eng-3-certification-compatibility-orchestration", target: "Executive Orchestration Platform", status: "ArchitecturallyCompatible", description: "Prepared for future orchestration metadata dependencies.", metadataOnly: true, immutable: true } as const satisfies ExecutiveCompatibilityEvidence),
] as const);

export const ExecutiveIntentResolutionRegressionDeclarations = Object.freeze([
  Object.freeze({ id: "eng-3-certification-regression-backward", category: "Backward Compatibility", status: "Stable", description: "Prior ENG-3 public metadata remains compatible.", metadataOnly: true, immutable: true } as const satisfies ExecutiveRegressionDeclaration),
  Object.freeze({ id: "eng-3-certification-regression-public-api", category: "Public API Stability", status: "Stable", description: "Approved public API surfaces remain stable.", metadataOnly: true, immutable: true } as const satisfies ExecutiveRegressionDeclaration),
  Object.freeze({ id: "eng-3-certification-regression-dependency", category: "Dependency Stability", status: "Stable", description: "Public-index-only dependencies remain stable.", metadataOnly: true, immutable: true } as const satisfies ExecutiveRegressionDeclaration),
  Object.freeze({ id: "eng-3-certification-regression-metadata", category: "Metadata Stability", status: "Stable", description: "Canonical metadata remains stable.", metadataOnly: true, immutable: true } as const satisfies ExecutiveRegressionDeclaration),
  Object.freeze({ id: "eng-3-certification-regression-namespace", category: "Namespace Stability", status: "Stable", description: "Intent-resolution namespaces remain stable.", metadataOnly: true, immutable: true } as const satisfies ExecutiveRegressionDeclaration),
  Object.freeze({ id: "eng-3-certification-regression-architecture", category: "Architectural Stability", status: "Stable", description: "Metadata-only architecture remains stable.", metadataOnly: true, immutable: true } as const satisfies ExecutiveRegressionDeclaration),
] as const);
