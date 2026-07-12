import { ExecutiveRequestIntentRegistryManifest } from "./executiveRequestIntentRegistryIndex.ts";
import type { ExecutiveRequestIntentValidationCategory, ExecutiveRequestIntentValidationRule } from "./executiveRequestIntentValidationTypes.ts";

const rule = (key: string, name: string, category: ExecutiveRequestIntentValidationCategory, artifact: string) => Object.freeze({
  id: `eng-2-validation-registry-${key}`, name, category, severity: "High",
  description: `${name} is declared as satisfied architectural metadata.`,
  target: Object.freeze({ phase: "ENG-2:2", publicSurface: "executiveRequestIntentRegistryIndex.ts", artifact }),
  evidence: Object.freeze({ evidenceType: "PublicMetadata", reference: artifact, publicArtifact: ExecutiveRequestIntentRegistryManifest }),
  result: Object.freeze({ status: "Satisfied", description: "Satisfied by the approved ENG-2:2 registry manifest.", metadataOnly: true }),
  metadataOnly: true, immutable: true,
} as const satisfies ExecutiveRequestIntentValidationRule);

export const ExecutiveRequestIntentRegistryValidation = Object.freeze({
  id: "eng-2-validation-registry-group", name: "ENG-2:2 Registry Validation",
  ownerPhase: "ENG-2:4", targetPhase: "ENG-2:2", namespace: "nexora.engine.executive.request-intent.validation",
  rules: Object.freeze([
    rule("completeness", "Eight Registry Completeness", "Registry", "ExecutiveRequestIntentRegistryManifest.inventory"),
    rule("entry-identifiers", "Unique Entry Identifiers", "Registry", "registry entries"),
    rule("group-identifiers", "Unique Registry Identifiers", "Registry", "registry groups"),
    rule("namespace", "Namespace Consistency", "Namespace", "approvedNamespace"),
    rule("version", "Version Consistency", "Registry", "version"),
    rule("aggregation", "Manifest Aggregation", "Registry", "ExecutiveRequestIntentRegistryManifest"),
    rule("public-api", "Public API Stability", "Public API", "executiveRequestIntentRegistryIndex.ts"),
    rule("immutability", "Immutability Metadata", "Immutability", "registry inventory"),
  ]),
  status: "Defined", metadataOnly: true, immutable: true,
} as const);
