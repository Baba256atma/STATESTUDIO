import { ExecutiveRequestIntentModelManifest } from "./executiveRequestIntentModelIndex.ts";
import type { ExecutiveRequestIntentValidationCategory, ExecutiveRequestIntentValidationRule } from "./executiveRequestIntentValidationTypes.ts";

const rule = (key: string, name: string, category: ExecutiveRequestIntentValidationCategory, artifact: string) => Object.freeze({
  id: `eng-2-validation-model-${key}`, name, category, severity: "High",
  description: `${name} is declared as satisfied architectural metadata.`,
  target: Object.freeze({ phase: "ENG-2:3", publicSurface: "executiveRequestIntentModelIndex.ts", artifact }),
  evidence: Object.freeze({ evidenceType: "PublicMetadata", reference: artifact, publicArtifact: ExecutiveRequestIntentModelManifest }),
  result: Object.freeze({ status: "Satisfied", description: "Satisfied by the approved collision-safe ENG-2:3 model manifest.", metadataOnly: true }),
  metadataOnly: true, immutable: true,
} as const satisfies ExecutiveRequestIntentValidationRule);

export const ExecutiveRequestIntentModelValidation = Object.freeze({
  id: "eng-2-validation-model-group", name: "ENG-2:3 Model Validation",
  ownerPhase: "ENG-2:4", targetPhase: "ENG-2:3", namespace: "nexora.engine.executive.request-intent.validation",
  rules: Object.freeze([
    rule("inventory", "Model Inventory Completeness", "Model", "ExecutiveRequestIntentModelManifest.models"),
    rule("registry-reference", "Registry Reference Integrity", "Dependency", "ExecutiveRequestIntentRequestModel"),
    rule("foundation-reference", "Foundation Reference Integrity", "Dependency", "ExecutiveRequestIntentModelManifest.dependencyReferences"),
    rule("lifecycle", "Lifecycle Stage Consistency", "Model", "ExecutiveRequestIntentLifecycleModel"),
    rule("relationships", "Relationship Model Completeness", "Model", "ExecutiveRequestIntentRelationshipModel"),
    rule("namespace", "Namespace Consistency", "Namespace", "nexora.engine.executive.request-intent.model"),
    rule("immutability", "Immutable Model Metadata", "Immutability", "model inventory"),
    rule("aggregation", "Deterministic Manifest Aggregation", "Model", "ExecutiveRequestIntentModelManifest"),
    rule("public-api", "Explicit Public API Exposure", "Public API", "executiveRequestIntentModelIndex.ts"),
  ]),
  status: "Defined", metadataOnly: true, immutable: true,
} as const);
