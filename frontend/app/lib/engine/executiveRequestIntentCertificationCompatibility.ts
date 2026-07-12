import type { ExecutiveRequestIntentCompatibility } from "./executiveRequestIntentCertificationTypes.ts";

const compatibility = (identifier: ExecutiveRequestIntentCompatibility["identifier"], target: string, status: ExecutiveRequestIntentCompatibility["status"], description: string, boundary: string) => Object.freeze({
  identifier, target, status, description, boundary, metadataOnly: true, immutable: true,
} as const satisfies ExecutiveRequestIntentCompatibility);

export const ExecutiveRequestIntentCertificationCompatibility = Object.freeze([
  compatibility("eng-2-compatibility-eng-1", "ENG-1 Executive Engine Foundation", "Compatible", "Preserves ENG-1 ownership and public symbols.", "Public APIs and ownership metadata only"),
  compatibility("eng-2-compatibility-eng-2-8", "ENG-2:8 Freeze", "ArchitecturallyReady", "Certified platform is ready for immutable freeze metadata.", "Future public freeze layer"),
  compatibility("eng-2-compatibility-eng-2-9", "ENG-2:9 Public Index", "ArchitecturallyReady", "Certified platform is ready for final public aggregation.", "Future public index layer"),
  compatibility("eng-2-compatibility-engine", "Executive Engine Architecture", "Compatible", "Uses Executive Engine metadata conventions and ownership boundaries.", "Engine public architecture"),
  compatibility("eng-2-compatibility-bus", "BUS Layer", "Compatible", "Describes a public architectural boundary without BUS execution dependencies.", "BUS public boundary only"),
  compatibility("eng-2-compatibility-ops", "OPS Layer", "Compatible", "Describes a public architectural boundary without OPS execution dependencies.", "OPS public boundary only"),
  compatibility("eng-2-compatibility-advisor", "Advisor Layer", "Compatible", "Preserves Advisor ownership of user-facing explanation.", "Advisor public boundary only"),
  compatibility("eng-2-compatibility-core", "Core Platform", "Compatible", "Preserves Core platform ownership and dependency boundaries.", "Core public boundary only"),
] as const);
