/**
 * EX-1:4 — Executive Stage Integrity Validation.
 *
 * Global Stage integrity validation rules and integrity/runtime-compatibility
 * check catalogues. Policies only — evaluation is declared, not executed.
 *
 * Ownership: owned exclusively by EX-1:4.
 */

import type { ExecutiveStageValidationRuleDeclaration } from "./executiveStageValidationRules.ts";

const integrityRule = (
  categoryOrder: number,
  executionOrder: number,
  ruleKey: string,
  name: string,
  description: string,
  severity: "Error" | "Critical",
): ExecutiveStageValidationRuleDeclaration =>
  Object.freeze({
    ruleId: `EX-1:4/Rule/${String(executionOrder).padStart(2, "0")}`,
    ruleKey,
    name,
    description,
    category: "Integrity" as const,
    severity,
    preventsRendering: true as const,
    executionOrder,
    categoryOrder,
    evaluatesOnly: true as const,
    mutatesState: false as const,
    executable: false as const,
    metadataOnly: true as const,
    immutable: true as const,
  });

/**
 * Integrity validation rules (37..40) — part of the canonical 40-rule baseline.
 */
export const ExecutiveStageIntegrityValidationRules = Object.freeze([
  integrityRule(
    1,
    37,
    "ExactlyOneStageRoot",
    "Exactly one Stage root",
    "Stage must contain exactly one ExecutiveStage root.",
    "Critical",
  ),
  integrityRule(
    2,
    38,
    "ExactlyOneSurface",
    "Exactly one Surface",
    "Stage must contain exactly one Surface.",
    "Critical",
  ),
  integrityRule(
    3,
    39,
    "ExactlyOneViewport",
    "Exactly one Viewport",
    "Stage must contain exactly one Viewport.",
    "Critical",
  ),
  integrityRule(
    4,
    40,
    "RuntimeCompatibilityIntact",
    "Runtime compatibility",
    "Stage must remain compatible with the Executive Context Runtime.",
    "Critical",
  ),
] as const);

/**
 * Full integrity check catalogue (7) — verified before rendering.
 * Extends the four Integrity category rules with Overlay, Focus, and layer order.
 */
export const ExecutiveStageIntegrityChecks = Object.freeze([
  Object.freeze({
    checkId: "EX-1:4/IntegrityCheck/01",
    name: "Exactly one Stage root",
    subject: "ExecutiveStage",
    cardinality: "ExactlyOne",
  }),
  Object.freeze({
    checkId: "EX-1:4/IntegrityCheck/02",
    name: "Exactly one Surface",
    subject: "Surface",
    cardinality: "ExactlyOne",
  }),
  Object.freeze({
    checkId: "EX-1:4/IntegrityCheck/03",
    name: "Exactly one Viewport",
    subject: "Viewport",
    cardinality: "ExactlyOne",
  }),
  Object.freeze({
    checkId: "EX-1:4/IntegrityCheck/04",
    name: "Fixed layer ordering",
    subject: "Layers",
    cardinality: "ExactlyOrdered",
  }),
  Object.freeze({
    checkId: "EX-1:4/IntegrityCheck/05",
    name: "One Overlay root",
    subject: "Overlay",
    cardinality: "ExactlyOne",
  }),
  Object.freeze({
    checkId: "EX-1:4/IntegrityCheck/06",
    name: "One Focus model",
    subject: "Focus",
    cardinality: "ExactlyOne",
  }),
  Object.freeze({
    checkId: "EX-1:4/IntegrityCheck/07",
    name: "Runtime compatibility",
    subject: "RuntimeBindings",
    cardinality: "Compatible",
  }),
] as const);

/**
 * Runtime compatibility verification catalogue (5).
 * No Runtime implementation is executed.
 */
export const ExecutiveStageRuntimeCompatibilityChecks = Object.freeze([
  Object.freeze({
    checkId: "EX-1:4/RuntimeCompatibility/01",
    name: "Executive Context Runtime",
    description: "Stage remains compatible with Executive Context Runtime.",
  }),
  Object.freeze({
    checkId: "EX-1:4/RuntimeCompatibility/02",
    name: "Runtime Public Index",
    description: "Stage remains compatible with Runtime Public Index.",
  }),
  Object.freeze({
    checkId: "EX-1:4/RuntimeCompatibility/03",
    name: "Runtime Context identity",
    description: "Stage surface binds to a valid Runtime Context identity.",
  }),
  Object.freeze({
    checkId: "EX-1:4/RuntimeCompatibility/04",
    name: "Runtime object references",
    description: "Stage objects bind to valid Runtime object references.",
  }),
  Object.freeze({
    checkId: "EX-1:4/RuntimeCompatibility/05",
    name: "Runtime focus references",
    description: "Stage focus binds to valid Runtime focus references.",
  }),
] as const);

/** Integrity validation catalogue metadata. */
export const ExecutiveStageIntegrityValidation = Object.freeze({
  integrityId: "EX-1:4/IntegrityValidation",
  sourcePhase: "EX-1:4" as const,
  rules: ExecutiveStageIntegrityValidationRules,
  ruleCount: ExecutiveStageIntegrityValidationRules.length,
  checks: ExecutiveStageIntegrityChecks,
  checkCount: ExecutiveStageIntegrityChecks.length,
  runtimeCompatibilityChecks: ExecutiveStageRuntimeCompatibilityChecks,
  runtimeCompatibilityCheckCount:
    ExecutiveStageRuntimeCompatibilityChecks.length,
  coversStageRoot: true as const,
  coversSurface: true as const,
  coversViewport: true as const,
  coversLayerOrder: true as const,
  coversOverlay: true as const,
  coversFocus: true as const,
  coversRuntimeCompatibility: true as const,
  executesRuntime: false as const,
  evaluatesOnly: true as const,
  mutatesState: false as const,
  executable: false as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
} as const);
