import { ExecutiveRequestIntentModelManifest } from "./executiveRequestIntentModelIndex.ts";
import type { ExecutiveRequestIntentValidationRule } from "./executiveRequestIntentValidationTypes.ts";

const rule = (key: string, name: string, description: string, artifact: string) => Object.freeze({
  id: `eng-2-validation-ownership-${key}`, name, category: "Ownership", severity: "Critical",
  description,
  target: Object.freeze({ phase: "ENG-2:4", publicSurface: "executiveRequestIntentValidationIndex.ts", artifact }),
  evidence: Object.freeze({ evidenceType: "OwnershipDeclaration", reference: artifact, publicArtifact: ExecutiveRequestIntentModelManifest }),
  result: Object.freeze({ status: "Satisfied", description: "Ownership boundary is explicitly declared by ENG-2 architectural metadata.", metadataOnly: true }),
  metadataOnly: true, immutable: true,
} as const satisfies ExecutiveRequestIntentValidationRule);

export const ExecutiveRequestIntentOwnershipValidation = Object.freeze({
  id: "eng-2-validation-ownership-group", name: "ENG-2 Ownership and Anti-Duplication Validation",
  ownerPhase: "ENG-2:4", targetPhase: "ENG-2:4", namespace: "nexora.engine.executive.request-intent.validation",
  rules: Object.freeze([
    rule("files", "File Ownership", "ENG-1 owns its general request and intent files; ENG-2 must not overwrite or repurpose them.", "file ownership"),
    rule("symbols", "Symbol Ownership", "ENG-1 owns ExecutiveRequestModel and ExecutiveIntentModel; ENG-2 symbols remain collision-safe.", "symbol ownership"),
    rule("namespace", "Namespace Ownership", "ENG-2 owns only the specialized Request & Intent Platform namespace.", "namespace ownership"),
    rule("phase", "Phase Ownership", "ENG-2 validation owns only architectural validation metadata for ENG-2.", "phase ownership"),
    rule("runtime", "Runtime Responsibility Ownership", "Runtime validation, inference, routing, and persistence belong to future owning layers.", "runtime responsibility ownership"),
    rule("cross-layer", "Cross-Layer Dependency Boundaries", "User-facing explanation belongs to Advisor; runtime, orchestration, and persistence remain externally owned.", "cross-layer boundaries"),
    rule("anti-duplication", "Anti-Duplication Guarantee", "ENG-2 filenames, public symbols, and models remain distinct from ENG-1-owned artifacts.", "anti-duplication guarantee"),
  ]),
  status: "Defined", metadataOnly: true, immutable: true,
} as const);
