/**
 * EX-1:7 — Executive Stage Certification Audits.
 *
 * Quality gates, architecture audits, dependency audits, public API audits,
 * and Runtime compatibility checks. Verification declarations only.
 *
 * Ownership: owned exclusively by EX-1:7.
 */

/** Exactly six quality gates. */
export const ExecutiveStageQualityGates = Object.freeze([
  Object.freeze({
    qualityGateId: "EX-1:7/QualityGate/01",
    name: "Strict TypeScript",
    description: "Strict TypeScript compilation must pass.",
    order: 1,
  }),
  Object.freeze({
    qualityGateId: "EX-1:7/QualityGate/02",
    name: "ESLint",
    description: "ESLint must pass with zero warnings.",
    order: 2,
  }),
  Object.freeze({
    qualityGateId: "EX-1:7/QualityGate/03",
    name: "Unit Tests",
    description: "Unit tests for Stage phases must pass.",
    order: 3,
  }),
  Object.freeze({
    qualityGateId: "EX-1:7/QualityGate/04",
    name: "Architecture Tests",
    description: "Architecture boundary tests must pass.",
    order: 4,
  }),
  Object.freeze({
    qualityGateId: "EX-1:7/QualityGate/05",
    name: "Dependency Audits",
    description: "Dependency direction and isolation audits must pass.",
    order: 5,
  }),
  Object.freeze({
    qualityGateId: "EX-1:7/QualityGate/06",
    name: "Public API Audits",
    description: "Public API surface audits must pass.",
    order: 6,
  }),
] as const);

/** Architecture audit checks. */
export const ExecutiveStageArchitectureAudits = Object.freeze([
  "canonical architecture",
  "phase ordering",
  "module boundaries",
  "prohibited dependency violations",
  "architectural completeness",
] as const);

/** Dependency audit checks. */
export const ExecutiveStageDependencyAudits = Object.freeze([
  "approved upstream imports",
  "prohibited imports",
  "dependency direction",
  "Runtime Public Index usage",
  "architectural isolation",
] as const);

/** Public API audit checks. */
export const ExecutiveStagePublicApiAudits = Object.freeze([
  "stable API surface",
  "public operation identities",
  "API naming consistency",
  "deterministic exports",
  "future compatibility",
] as const);

/**
 * Runtime compatibility checks (6).
 * No Runtime execution occurs.
 */
export const ExecutiveStageRuntimeCompatibilityChecks = Object.freeze([
  Object.freeze({
    checkId: "EX-1:7/RuntimeCompatibility/01",
    name: "Executive Context Runtime",
    description: "Stage remains compatible with Executive Context Runtime.",
    executesRuntime: false as const,
    order: 1,
  }),
  Object.freeze({
    checkId: "EX-1:7/RuntimeCompatibility/02",
    name: "Runtime Public Index",
    description: "Stage Platform consumes Runtime Public Index only.",
    executesRuntime: false as const,
    order: 2,
  }),
  Object.freeze({
    checkId: "EX-1:7/RuntimeCompatibility/03",
    name: "Runtime lifecycle",
    description: "Stage remains compatible with Runtime lifecycle contracts.",
    executesRuntime: false as const,
    order: 3,
  }),
  Object.freeze({
    checkId: "EX-1:7/RuntimeCompatibility/04",
    name: "Runtime context",
    description: "Stage remains compatible with Runtime context identity.",
    executesRuntime: false as const,
    order: 4,
  }),
  Object.freeze({
    checkId: "EX-1:7/RuntimeCompatibility/05",
    name: "Runtime focus",
    description: "Stage remains compatible with Runtime focus contracts.",
    executesRuntime: false as const,
    order: 5,
  }),
  Object.freeze({
    checkId: "EX-1:7/RuntimeCompatibility/06",
    name: "Runtime updates",
    description: "Stage remains compatible with Runtime update notifications.",
    executesRuntime: false as const,
    order: 6,
  }),
] as const);

/** Certification audits catalogue. */
export const ExecutiveStageCertificationAudits = Object.freeze({
  auditsId: "EX-1:7/CertificationAudits",
  qualityGates: ExecutiveStageQualityGates,
  qualityGateCount: ExecutiveStageQualityGates.length,
  architectureAudits: ExecutiveStageArchitectureAudits,
  architectureAuditCount: ExecutiveStageArchitectureAudits.length,
  dependencyAudits: ExecutiveStageDependencyAudits,
  dependencyAuditCount: ExecutiveStageDependencyAudits.length,
  publicApiAudits: ExecutiveStagePublicApiAudits,
  publicApiAuditCount: ExecutiveStagePublicApiAudits.length,
  runtimeCompatibilityChecks: ExecutiveStageRuntimeCompatibilityChecks,
  runtimeCompatibilityCheckCount:
    ExecutiveStageRuntimeCompatibilityChecks.length,
  executesRuntime: false as const,
  modifiesSourceCode: false as const,
  readOnly: true as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
} as const);
