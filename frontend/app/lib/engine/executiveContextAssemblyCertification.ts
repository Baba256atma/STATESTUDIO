import { ExecutiveContextAssemblyCertificationCompatibility } from "./executiveContextAssemblyCertificationCompatibility.ts";
import { ExecutiveContextAssemblyCertificationEvidence } from "./executiveContextAssemblyCertificationEvidence.ts";
import { ExecutiveContextAssemblyCertificationGates } from "./executiveContextAssemblyCertificationGates.ts";
import { ExecutiveContextAssemblyCertificationMetadata } from "./executiveContextAssemblyCertificationMetadata.ts";
import { ExecutiveContextAssemblyCertificationRegression } from "./executiveContextAssemblyCertificationRegression.ts";
import { ExecutiveContextAssemblyDependencyManifest } from "./executiveContextAssemblyManifest.ts";
import { ExecutiveContextAssemblyPlatform } from "./executiveContextAssemblyPlatform.ts";
import type {
  ExecutiveContextAssemblyCertificationAggregate,
  ExecutiveContextCertificationCompatibilityEntry,
  ExecutiveContextCertificationEvidence,
  ExecutiveContextCertificationGate,
  ExecutiveContextCertificationGuarantee,
  ExecutiveContextCertificationRegressionEntry,
  ExecutiveContextCertificationResult,
  ExecutiveContextCertificationSummary,
} from "./executiveContextAssemblyCertificationTypes.ts";

const guarantee = (key: string, name: string) => Object.freeze({
  id: `eng-4-cert-guarantee-${key}`,
  guarantee: name,
  status: "Guaranteed",
  metadataOnly: true, immutable: true,
} as const satisfies ExecutiveContextCertificationGuarantee);

const guarantees = Object.freeze([
  guarantee("foundation-certified", "Foundation Certified"),
  guarantee("registry-certified", "Registry Certified"),
  guarantee("model-certified", "Model Certified"),
  guarantee("validation-certified", "Validation Certified"),
  guarantee("manifest-certified", "Manifest Certified"),
  guarantee("platform-certified", "Platform Certified"),
  guarantee("metadata-only", "Metadata Only"),
  guarantee("runtime-free", "Runtime Free"),
  guarantee("immutable", "Immutable"),
  guarantee("deterministic", "Deterministic"),
  guarantee("ownership-protected", "Ownership Protected"),
  guarantee("anti-duplication-protected", "Anti-Duplication Protected"),
  guarantee("public-api-stable", "Public API Stable"),
  guarantee("dependency-boundaries", "Dependency Boundaries Preserved"),
  guarantee("namespace-compatibility", "Namespace Compatibility Preserved"),
  guarantee("eng-1-compatibility", "ENG-1 Compatibility Preserved"),
  guarantee("regression-safety", "Regression Safety Confirmed"),
  guarantee("no-future-phase", "No Future-Phase Implementation"),
  guarantee("ready-for-freeze", "Ready for Freeze"),
] as const);

const result = Object.freeze({
  status: "Certified",
  description: "ENG-4:1 through ENG-4:6 are architecturally certified and ready for freeze.",
  freezeReadiness: "ReadyForFreeze",
  metadataOnly: true, immutable: true, deterministic: true,
} as const satisfies ExecutiveContextCertificationResult);

const summary = Object.freeze({
  certificationId: "ENG-4:7",
  phase: "ENG-4:7",
  namespace: "nexora.engine.executive.context-assembly.certification",
  owner: "ENG-4",
  certifiedPlatformId: "ENG-4:6",
  gateCount: ExecutiveContextAssemblyCertificationGates.length,
  passedGateCount: ExecutiveContextAssemblyCertificationGates.filter(({ status }) => status === "Pass").length,
  evidenceCount: ExecutiveContextAssemblyCertificationEvidence.length,
  compatibilityCount: ExecutiveContextAssemblyCertificationCompatibility.length,
  regressionCount: ExecutiveContextAssemblyCertificationRegression.length,
  guaranteeCount: guarantees.length,
  certificationResult: "Certified",
  freezeReadiness: "ReadyForFreeze",
  nextPhase: "ENG-4:8",
  metadataOnly: true, immutable: true, deterministic: true,
} as const satisfies ExecutiveContextCertificationSummary);

const certificationDependencies = Object.freeze([
  ...ExecutiveContextAssemblyDependencyManifest,
  Object.freeze({
    id: "eng-4-dep-certification-platform",
    source: "ENG-4:7",
    target: "ENG-4:6",
    direction: "ForwardOnly",
    consumption: "PublicIndexOnly",
    reverseDependency: false,
    circularDependency: false,
    internalImplementationDependency: false,
    futurePhaseDependency: false,
    publicIndexReference: "executiveContextAssemblyPlatform.ts",
    metadataOnly: true, immutable: true,
  } as const),
] as const);

export const ExecutiveContextAssemblyCertification = Object.freeze({
  metadata: ExecutiveContextAssemblyCertificationMetadata,
  platform: ExecutiveContextAssemblyPlatform,
  gates: ExecutiveContextAssemblyCertificationGates,
  evidence: ExecutiveContextAssemblyCertificationEvidence,
  compatibility: ExecutiveContextAssemblyCertificationCompatibility,
  regression: ExecutiveContextAssemblyCertificationRegression,
  guarantees,
  dependencies: certificationDependencies,
  result,
  summary,
  metadataOnly: true, immutable: true, deterministic: true,
} as const satisfies ExecutiveContextAssemblyCertificationAggregate);

const gateIndex = Object.freeze(
  Object.fromEntries(ExecutiveContextAssemblyCertificationGates.map((gate) => [gate.gateId, gate])) as Readonly<
    Record<string, ExecutiveContextCertificationGate | undefined>
  >,
);
const evidenceIndex = Object.freeze(
  Object.fromEntries(ExecutiveContextAssemblyCertificationEvidence.map((entry) => [entry.evidenceId, entry])) as Readonly<
    Record<string, ExecutiveContextCertificationEvidence | undefined>
  >,
);
const compatibilityIndex = Object.freeze(
  Object.fromEntries(ExecutiveContextAssemblyCertificationCompatibility.map((entry) => [entry.id, entry])) as Readonly<
    Record<string, ExecutiveContextCertificationCompatibilityEntry | undefined>
  >,
);
const regressionIndex = Object.freeze(
  Object.fromEntries(ExecutiveContextAssemblyCertificationRegression.map((entry) => [entry.id, entry])) as Readonly<
    Record<string, ExecutiveContextCertificationRegressionEntry | undefined>
  >,
);

export { ExecutiveContextAssemblyCertificationCompatibility } from "./executiveContextAssemblyCertificationCompatibility.ts";
export { ExecutiveContextAssemblyCertificationEvidence } from "./executiveContextAssemblyCertificationEvidence.ts";
export { ExecutiveContextAssemblyCertificationGates } from "./executiveContextAssemblyCertificationGates.ts";
export { ExecutiveContextAssemblyCertificationMetadata } from "./executiveContextAssemblyCertificationMetadata.ts";
export { ExecutiveContextAssemblyCertificationRegression } from "./executiveContextAssemblyCertificationRegression.ts";

export const getExecutiveContextAssemblyCertification = () => ExecutiveContextAssemblyCertification;
export const getExecutiveContextAssemblyCertificationMetadata = () => ExecutiveContextAssemblyCertificationMetadata;
export const getExecutiveContextAssemblyCertificationGates = () => ExecutiveContextAssemblyCertificationGates;
export const getExecutiveContextAssemblyCertificationEvidence = () => ExecutiveContextAssemblyCertificationEvidence;
export const getExecutiveContextAssemblyCertificationCompatibility = () => ExecutiveContextAssemblyCertificationCompatibility;
export const getExecutiveContextAssemblyCertificationRegression = () => ExecutiveContextAssemblyCertificationRegression;
export const getExecutiveContextAssemblyCertificationSummary = () => summary;

export const getExecutiveContextAssemblyCertificationGateById = (
  id: string,
): ExecutiveContextCertificationGate | undefined => gateIndex[id];
export const getExecutiveContextAssemblyCertificationEvidenceById = (
  id: string,
): ExecutiveContextCertificationEvidence | undefined => evidenceIndex[id];
export const getExecutiveContextAssemblyCertificationCompatibilityById = (
  id: string,
): ExecutiveContextCertificationCompatibilityEntry | undefined => compatibilityIndex[id];
export const getExecutiveContextAssemblyCertificationRegressionById = (
  id: string,
): ExecutiveContextCertificationRegressionEntry | undefined => regressionIndex[id];
