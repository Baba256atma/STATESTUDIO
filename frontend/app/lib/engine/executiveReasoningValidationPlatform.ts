import {
  ExecutiveReasoningValidationManifest,
  ExecutiveReasoningValidationMetadata,
} from "./executiveReasoningValidationManifest.ts";
import {
  ExecutiveReasoningValidationRegistry,
  ExecutiveReasoningValidationRunner,
} from "./executiveReasoningValidationRunner.ts";

const validationResult = ExecutiveReasoningValidationRunner.run();

const summary = Object.freeze({
  validationId: "ENG-6:4",
  phase: "ENG-6:4",
  namespace: "nexora.engine.executive.reasoning.validation",
  owner: "ENG-6",
  status: validationResult.status,
  passCount: validationResult.passCount,
  warningCount: validationResult.warningCount,
  failCount: validationResult.failCount,
  totalRuleCount: validationResult.totalRuleCount,
  domainCount: validationResult.domainCount,
  validatedPhases: ExecutiveReasoningValidationManifest.validatedPhases,
  nextPhase: "ENG-6:5",
  manifestReady: validationResult.status === "PASS",
  metadataOnly: true,
  immutable: true,
  deterministic: true,
  runtimeFree: true,
  aiFree: true,
} as const);

export const ExecutiveReasoningValidationPlatform = Object.freeze({
  metadata: ExecutiveReasoningValidationMetadata,
  registry: ExecutiveReasoningValidationRegistry,
  manifest: ExecutiveReasoningValidationManifest,
  runner: ExecutiveReasoningValidationRunner,
  result: validationResult,
  summary,
  ownership: ExecutiveReasoningValidationManifest.ownership,
  metadataOnly: true,
  immutable: true,
  deterministic: true,
  runtimeFree: true,
  aiFree: true,
} as const);

export const getExecutiveReasoningValidation = () => ExecutiveReasoningValidationPlatform;
export const getExecutiveReasoningValidationSummary = () => summary;
export const getExecutiveReasoningValidationStatus = () => validationResult.status;

export { ExecutiveReasoningValidationManifest, ExecutiveReasoningValidationMetadata };
export { ExecutiveReasoningValidationRegistry, ExecutiveReasoningValidationRunner };
