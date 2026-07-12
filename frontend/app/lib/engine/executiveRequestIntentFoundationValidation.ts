import { ExecutiveRequestIntentFoundation } from "./executiveRequestIntentIndex.ts";
import type { ExecutiveRequestIntentValidationCategory, ExecutiveRequestIntentValidationRule } from "./executiveRequestIntentValidationTypes.ts";

const rule = (key: string, name: string, category: ExecutiveRequestIntentValidationCategory, artifact: string) => Object.freeze({
  id: `eng-2-validation-foundation-${key}`, name, category, severity: "High",
  description: `${name} is declared as satisfied architectural metadata.`,
  target: Object.freeze({ phase: "ENG-2:1", publicSurface: "executiveRequestIntentIndex.ts", artifact }),
  evidence: Object.freeze({ evidenceType: "PublicMetadata", reference: artifact, publicArtifact: ExecutiveRequestIntentFoundation }),
  result: Object.freeze({ status: "Satisfied", description: "Satisfied by the approved ENG-2:1 public metadata.", metadataOnly: true }),
  metadataOnly: true, immutable: true,
} as const satisfies ExecutiveRequestIntentValidationRule);

export const ExecutiveRequestIntentFoundationValidation = Object.freeze({
  id: "eng-2-validation-foundation-group", name: "ENG-2:1 Foundation Validation",
  ownerPhase: "ENG-2:4", targetPhase: "ENG-2:1", namespace: "nexora.engine.executive.request-intent.validation",
  rules: Object.freeze([
    rule("existence", "Foundation Existence", "Foundation", "ExecutiveRequestIntentFoundation"),
    rule("contracts", "Contract Inventory Completeness", "Foundation", "ExecutiveRequestIntentContracts"),
    rule("metadata", "Metadata Completeness", "Foundation", "ExecutiveRequestIntentMetadata"),
    rule("registry", "Registry Reference Integrity", "Dependency", "ExecutiveRequestIntentRegistry"),
    rule("aggregation", "Foundation Aggregation Integrity", "Foundation", "ExecutiveRequestIntentFoundation"),
    rule("public-api", "Public API Consistency", "Public API", "executiveRequestIntentIndex.ts"),
    rule("immutability", "Immutability Declaration", "Immutability", "ExecutiveRequestIntentFoundation"),
    rule("namespace", "Namespace Ownership", "Namespace", "nexora.engine.executive.request-intent.foundation"),
  ]),
  status: "Defined", metadataOnly: true, immutable: true,
} as const);
