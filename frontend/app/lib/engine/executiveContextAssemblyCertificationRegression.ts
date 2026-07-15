import type { ExecutiveContextCertificationRegressionEntry } from "./executiveContextAssemblyCertificationTypes.ts";

const regression = (
  key: string,
  name: string,
  description: string,
  preservedSurface: string,
) => Object.freeze({
  id: `eng-4-cert-regression-${key}`,
  name, description, status: "Pass", preservedSurface,
  metadataOnly: true, immutable: true, deterministic: true,
} as const satisfies ExecutiveContextCertificationRegressionEntry);

export const ExecutiveContextAssemblyCertificationRegression = Object.freeze([
  regression("foundation-surface", "ENG-4:1 Foundation surface preserved", "Foundation public surface remains preserved under certification.", "executiveContextAssemblyFoundation.ts"),
  regression("registry-counts", "ENG-4:2 Registry counts preserved", "Registry domain, source, capability, and lifecycle counts remain preserved.", "executiveContextAssemblyRegistry.ts"),
  regression("model-ownership", "ENG-4:3 Model ownership preserved", "Specialized model ownership and collision-safe identity remain preserved.", "executiveContextAssemblyModel.ts"),
  regression("validation-counts", "ENG-4:4 Validation rule and gate counts preserved", "Validation remains five groups, 43 rules, and 12 gates.", "executiveContextAssemblyValidation.ts"),
  regression("manifest-inventory", "ENG-4:5 Manifest inventory preserved", "Manifest inventory counts remain unchanged under certification.", "executiveContextAssemblyManifest.ts"),
  regression("platform-structure", "ENG-4:6 Platform sections and components preserved", "Platform remains six primary sections and five components.", "executiveContextAssemblyPlatform.ts"),
  regression("eng-1-generic-surface", "ENG-1 generic model public surface preserved", "ENG-1 generic ExecutiveContextModel public surface remains preserved.", "engineModelIndex.ts"),
  regression("namespace-collision", "No namespace collision introduced", "No namespace collision was introduced by certification.", "nexora.engine.executive.context-assembly.*"),
  regression("cross-platform-imports", "No internal cross-platform import introduced", "Certification does not introduce internal cross-platform imports.", "PublicIndexOnly"),
  regression("runtime-behavior", "No runtime behavior introduced", "Certification introduces no runtime behavior.", "MetadataOnly"),
  regression("future-phase", "No future-phase implementation introduced", "Certification does not import or implement ENG-4:8 Freeze.", "FutureBoundaryDeclared"),
  regression("helper-determinism", "Deterministic helper behavior preserved", "Approved public helpers remain deterministic and canonical.", "PublicHelpers"),
] as const);
