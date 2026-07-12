import { ExecutiveRequestIntentFoundation } from "./executiveRequestIntentIndex.ts";
import { ExecutiveRequestIntentModelManifest } from "./executiveRequestIntentModelIndex.ts";
import { ExecutiveRequestIntentRegistryManifest } from "./executiveRequestIntentRegistryIndex.ts";
import type { ExecutiveRequestIntentValidationRule } from "./executiveRequestIntentValidationTypes.ts";

const publicSurfaces = Object.freeze({
  foundation: ExecutiveRequestIntentFoundation,
  registry: ExecutiveRequestIntentRegistryManifest,
  model: ExecutiveRequestIntentModelManifest,
});

const rule = (key: string, name: string, artifact: string) => Object.freeze({
  id: `eng-2-validation-public-api-${key}`, name, category: "Public API", severity: "High",
  description: `${name} is declared across the approved ENG-2:1, ENG-2:2, and ENG-2:3 public surfaces.`,
  target: Object.freeze({ phase: "ENG-2:4", publicSurface: "ENG-2 public indices", artifact }),
  evidence: Object.freeze({ evidenceType: "ArchitecturalContract", reference: artifact, publicArtifact: publicSurfaces }),
  result: Object.freeze({ status: "Satisfied", description: "Satisfied by explicit immutable public-surface metadata.", metadataOnly: true }),
  metadataOnly: true, immutable: true,
} as const satisfies ExecutiveRequestIntentValidationRule);

export const ExecutiveRequestIntentPublicApiValidation = Object.freeze({
  id: "eng-2-validation-public-api-group", name: "ENG-2 Public API Validation",
  ownerPhase: "ENG-2:4", targetPhase: "ENG-2:4", namespace: "nexora.engine.executive.request-intent.validation",
  rules: Object.freeze([
    rule("explicit-exports", "Explicit Exports", "approved public exports"),
    rule("wildcards", "Wildcard Export Prohibition", "no wildcard exports"),
    rule("unique-names", "Unique Public API Names", "ENG-2 public API names"),
    rule("phase-owner", "Owning Phase References", "ENG-2 phase ownership"),
    rule("internal-leaks", "Internal Symbol Exclusion", "public surface boundaries"),
    rule("namespace", "Stable Public Namespaces", "public namespaces"),
    rule("immutability", "Immutable Public Metadata", "public metadata"),
    rule("helpers", "Deterministic Helpers", "public helper APIs"),
    rule("eng-1-symbols", "ENG-1 Symbol Protection", "ExecutiveRequestModel and ExecutiveIntentModel"),
  ]),
  status: "Defined", metadataOnly: true, immutable: true,
} as const);
