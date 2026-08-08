/** DRI-3:5 — observational validation for resolved Scene orchestration. */

import {
  DIRECTOR_SCENE_ATTENTION_PRIORITY,
  DIRECTOR_SCENE_ORCHESTRATION_OPERATION_ORDER,
  directorRuntimeSceneFocusAttentionOrchestrationIdentity,
  type DirectorSceneAttention,
  type DirectorSceneOrchestrationOperation,
  type DirectorSceneOrchestrationPlan,
  type DirectorSceneRelationshipRef,
  type DirectorSceneSubjectRef,
} from "@/app/lib/dri/directorRuntimeSceneFocusAttentionOrchestration";

export type { DirectorSceneOrchestrationPlan }
  from "@/app/lib/dri/directorRuntimeSceneFocusAttentionOrchestration";

export const directorRuntimeSceneOrchestrationValidationIdentity =
  "DRI-3:5/DirectorRuntimeSceneOrchestrationValidation" as const;
export const directorRuntimeSceneOrchestrationValidationNamespace =
  "nexora.dri.scene.orchestration.validation" as const;
export const directorRuntimeSceneOrchestrationValidationVersion = "3.5.0" as const;
export const directorRuntimeSceneOrchestrationValidationUpstream =
  directorRuntimeSceneFocusAttentionOrchestrationIdentity;

export const DIRECTOR_SCENE_ORCHESTRATION_VALIDATION_STATUSES = Object.freeze([
  "valid", "invalid",
] as const);
export type DirectorSceneOrchestrationValidationStatus =
  (typeof DIRECTOR_SCENE_ORCHESTRATION_VALIDATION_STATUSES)[number];

export const DIRECTOR_SCENE_ORCHESTRATION_VALIDATION_SEVERITIES = Object.freeze([
  "notice", "warning", "error",
] as const);
export type DirectorSceneOrchestrationValidationSeverity =
  (typeof DIRECTOR_SCENE_ORCHESTRATION_VALIDATION_SEVERITIES)[number];

export const DIRECTOR_SCENE_ORCHESTRATION_VALIDATION_CATEGORIES = Object.freeze([
  "identity", "context", "focus", "attention", "relationship", "path", "operation",
  "lineage", "consistency", "ordering",
] as const);
export type DirectorSceneOrchestrationValidationCategory =
  (typeof DIRECTOR_SCENE_ORCHESTRATION_VALIDATION_CATEGORIES)[number];

export interface DirectorSceneOrchestrationValidationFinding {
  readonly ruleId: string;
  readonly code: string;
  readonly severity: DirectorSceneOrchestrationValidationSeverity;
  readonly message: string;
  readonly subjectId?: string;
  readonly relationshipId?: string;
  readonly pathId?: string;
  readonly operationId?: string;
}

export interface DirectorSceneOrchestrationValidationRule {
  readonly ruleId: string;
  readonly category: DirectorSceneOrchestrationValidationCategory;
  readonly description: string;
}

export interface DirectorSceneOrchestrationValidationReport {
  readonly validationId: string;
  readonly planId: string;
  readonly status: DirectorSceneOrchestrationValidationStatus;
  readonly findings: readonly DirectorSceneOrchestrationValidationFinding[];
  readonly checkedRuleIds: readonly string[];
  readonly errorCount: number;
  readonly warningCount: number;
  readonly noticeCount: number;
}

const rule = (ruleId: string, category: DirectorSceneOrchestrationValidationCategory,
  description: string): DirectorSceneOrchestrationValidationRule =>
  Object.freeze({ ruleId, category, description });

export const directorSceneOrchestrationValidationRules = Object.freeze([
  rule("identity.plan-id", "identity", "Plan identity must be present and non-empty."),
  rule("context.runtime-context", "context", "Runtime context identity must be present."),
  rule("focus.reference-integrity", "focus", "Focus references must be structurally valid."),
  rule("focus.primary-not-secondary", "focus", "Primary focus must not appear as secondary focus."),
  rule("focus.secondary-unique", "focus", "Secondary focus subjects must be unique."),
  rule("focus.primary-visible", "consistency", "Primary focus must not be concealed."),
  rule("attention.level-valid", "attention", "Attention levels must use canonical vocabulary."),
  rule("attention.subject-unique", "attention", "Effective attention subjects must be unique."),
  rule("attention.canonical-order", "ordering", "Attention must follow canonical priority order."),
  rule("attention.strong-visible", "consistency", "Strong attention must not be concealed."),
  rule("attention.strong-prominent", "consistency", "Strong attention must not be deemphasized."),
  rule("relationship.reference-integrity", "relationship", "Relationship references must be valid."),
  rule("path.integrity", "path", "Paths must have identity, valid references, and continuity."),
  rule("operation.kind-valid", "operation", "Operation kinds must be canonical."),
  rule("operation.canonical-order", "ordering", "Operations must follow canonical kind order."),
  rule("operation.semantic-deduplication", "operation", "Semantic operations must be unique."),
  rule("operation.relate-integrity", "operation", "Relate operations require valid relationships."),
  rule("operation.focus-consistency", "consistency", "Focus operations must match primary focus."),
  rule("consistency.visibility", "consistency", "Reveal and conceal must not conflict."),
  rule("consistency.prominence", "consistency", "Emphasize and deemphasize must not conflict."),
  rule("lineage.request-plan", "lineage", "Plan identity must preserve request lineage."),
] as const);

function nonEmpty(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function subjectKey(subject: DirectorSceneSubjectRef) {
  return `${subject.namespace ?? ""}\u0000${subject.subjectKind}\u0000${subject.subjectId}`;
}

function validSubject(subject: DirectorSceneSubjectRef) {
  return nonEmpty(subject.subjectId) && nonEmpty(subject.subjectKind) &&
    (subject.namespace === undefined || nonEmpty(subject.namespace));
}

function validRelationship(value: DirectorSceneRelationshipRef) {
  return nonEmpty(value.relationshipId) && validSubject(value.source) && validSubject(value.target) &&
    (value.relationshipKind === undefined || nonEmpty(value.relationshipKind));
}

function operationKey(value: DirectorSceneOrchestrationOperation) {
  return JSON.stringify({ kind: value.kind, subjects: value.subjects.map(subjectKey),
    relationships: value.relationships.map(({ relationshipId, source, target, relationshipKind }) =>
      [relationshipId, subjectKey(source), subjectKey(target), relationshipKind ?? null]),
    reason: value.reason ?? null });
}

function operationSubjectKeys(plan: DirectorSceneOrchestrationPlan, kind: string) {
  return new Set(plan.operations.filter((value) => value.kind === kind)
    .flatMap(({ subjects }) => subjects.map(subjectKey)));
}

function attentionRank(attention: DirectorSceneAttention) {
  return DIRECTOR_SCENE_ATTENTION_PRIORITY.indexOf(attention.level);
}

function finding(ruleId: string, code: string, message: string,
  references: Partial<Omit<DirectorSceneOrchestrationValidationFinding,
    "ruleId" | "code" | "severity" | "message">> = {}) {
  return Object.freeze({ ruleId, code, severity: "error" as const, message, ...references });
}

function evaluateRule(ruleId: string, plan: DirectorSceneOrchestrationPlan) {
  const output: DirectorSceneOrchestrationValidationFinding[] = [];
  const primaryKey = plan.focus.primary ? subjectKey(plan.focus.primary) : null;
  const concealed = operationSubjectKeys(plan, "conceal");
  const revealed = operationSubjectKeys(plan, "reveal");
  const emphasized = operationSubjectKeys(plan, "emphasize");
  const deemphasized = operationSubjectKeys(plan, "deemphasize");
  if (ruleId === "identity.plan-id" && !nonEmpty(plan.planId))
    output.push(finding(ruleId, "plan-id-missing", "Plan identity is required."));
  if (ruleId === "context.runtime-context" && !nonEmpty(plan.context.runtimeContextId))
    output.push(finding(ruleId, "runtime-context-id-missing", "Runtime context identity is required."));
  if (ruleId === "focus.reference-integrity") {
    if (plan.focus.primary && !validSubject(plan.focus.primary)) output.push(finding(ruleId,
      "invalid-primary-reference", "Primary focus reference is invalid.",
      { subjectId: plan.focus.primary.subjectId }));
    for (const subject of plan.focus.secondary) if (!validSubject(subject)) output.push(finding(ruleId,
      "invalid-secondary-reference", "Secondary focus reference is invalid.",
      { subjectId: subject.subjectId }));
  }
  if (ruleId === "focus.primary-not-secondary" && primaryKey)
    for (const subject of plan.focus.secondary) if (subjectKey(subject) === primaryKey)
      output.push(finding(ruleId, "primary-also-secondary",
        "Primary focus must not also be secondary.", { subjectId: subject.subjectId }));
  if (ruleId === "focus.secondary-unique") {
    const seen = new Set<string>();
    for (const subject of plan.focus.secondary) {
      const key = subjectKey(subject);
      if (seen.has(key)) output.push(finding(ruleId, "duplicate-secondary-focus",
        "Secondary focus subject is duplicated.", { subjectId: subject.subjectId }));
      seen.add(key);
    }
  }
  if (ruleId === "focus.primary-visible" && plan.focus.primary && concealed.has(primaryKey!))
    output.push(finding(ruleId, "focus-primary-concealed", "Primary focus is concealed.",
      { subjectId: plan.focus.primary.subjectId }));
  if (ruleId === "attention.level-valid")
    for (const attention of plan.attention)
      if (!DIRECTOR_SCENE_ATTENTION_PRIORITY.includes(attention.level as never)) output.push(finding(ruleId,
        "invalid-attention-level", "Attention level is not canonical.",
        { subjectId: attention.subject.subjectId }));
  if (ruleId === "attention.subject-unique") {
    const seen = new Set<string>();
    for (const attention of plan.attention) {
      const key = subjectKey(attention.subject);
      if (!validSubject(attention.subject)) output.push(finding(ruleId, "invalid-attention-subject",
        "Attention subject reference is invalid.", { subjectId: attention.subject.subjectId }));
      if (seen.has(key)) output.push(finding(ruleId, "duplicate-attention-subject",
        "Attention subject is duplicated.", { subjectId: attention.subject.subjectId }));
      seen.add(key);
    }
  }
  if (ruleId === "attention.canonical-order")
    for (let index = 1; index < plan.attention.length; index++)
      if (attentionRank(plan.attention[index]!) < attentionRank(plan.attention[index - 1]!)) {
        output.push(finding(ruleId, "attention-order-invalid",
          "Attention entries are not in canonical semantic priority order.")); break;
      }
  if (ruleId === "attention.strong-visible")
    for (const attention of plan.attention)
      if ((attention.level === "critical" || attention.level === "important") &&
          concealed.has(subjectKey(attention.subject))) output.push(finding(ruleId,
        "strong-attention-concealed", "Strong attention subject is concealed.",
        { subjectId: attention.subject.subjectId }));
  if (ruleId === "attention.strong-prominent")
    for (const attention of plan.attention)
      if ((attention.level === "critical" || attention.level === "important") &&
          deemphasized.has(subjectKey(attention.subject))) output.push(finding(ruleId,
        "strong-attention-deemphasized", "Strong attention subject is deemphasized.",
        { subjectId: attention.subject.subjectId }));
  if (ruleId === "relationship.reference-integrity")
    for (const relationship of [...plan.paths.flatMap(({ relationships }) => relationships),
      ...plan.operations.flatMap(({ relationships }) => relationships)])
      if (!validRelationship(relationship)) output.push(finding(ruleId, "invalid-relationship-reference",
        "Relationship reference is invalid.", { relationshipId: relationship.relationshipId }));
  if (ruleId === "path.integrity") for (const path of plan.paths) {
    if (!nonEmpty(path.pathId)) output.push(finding(ruleId, "path-id-missing",
      "Path identity is required.", { pathId: path.pathId }));
    for (const subject of path.subjects) if (!validSubject(subject)) output.push(finding(ruleId,
      "invalid-path-subject", "Path subject reference is invalid.",
      { pathId: path.pathId, subjectId: subject.subjectId }));
    const expected = Math.max(0, path.subjects.length - 1);
    if (path.relationships.length !== expected) output.push(finding(ruleId, "path-relationship-count",
      "Path relationship count does not match subject continuity.", { pathId: path.pathId }));
    path.relationships.forEach((relationship, index) => {
      const source = path.subjects[index]; const target = path.subjects[index + 1];
      if (!validRelationship(relationship)) output.push(finding(ruleId, "invalid-path-relationship",
        "Path relationship reference is invalid.",
        { pathId: path.pathId, relationshipId: relationship.relationshipId }));
      if (!source || !target || subjectKey(relationship.source) !== subjectKey(source) ||
          subjectKey(relationship.target) !== subjectKey(target)) output.push(finding(ruleId,
        "path-relationship-continuity", "Path relationship direction does not match consecutive subjects.",
        { pathId: path.pathId, relationshipId: relationship.relationshipId }));
    });
  }
  if (ruleId === "operation.kind-valid")
    for (const operation of plan.operations)
      if (!DIRECTOR_SCENE_ORCHESTRATION_OPERATION_ORDER.includes(operation.kind as never))
        output.push(finding(ruleId, "invalid-operation-kind", "Operation kind is not canonical.",
          { operationId: operation.operationId }));
      else {
        if (!nonEmpty(operation.operationId)) output.push(finding(ruleId, "operation-id-missing",
          "Operation identity is required.", { operationId: operation.operationId }));
        for (const subject of operation.subjects) if (!validSubject(subject)) output.push(finding(ruleId,
          "invalid-operation-subject", "Operation subject reference is invalid.",
          { operationId: operation.operationId, subjectId: subject.subjectId }));
      }
  if (ruleId === "operation.canonical-order") {
    let previous = -1;
    for (const operation of plan.operations) {
      const rank = DIRECTOR_SCENE_ORCHESTRATION_OPERATION_ORDER.indexOf(operation.kind as never);
      if (rank >= 0 && rank < previous) { output.push(finding(ruleId, "operation-order-invalid",
        "Operations are not in canonical kind order.", { operationId: operation.operationId })); break; }
      if (rank >= 0) previous = rank;
    }
  }
  if (ruleId === "operation.semantic-deduplication") {
    const seen = new Set<string>();
    for (const operation of plan.operations) {
      const key = operationKey(operation);
      if (seen.has(key)) output.push(finding(ruleId, "duplicate-semantic-operation",
        "Semantic operation is duplicated.", { operationId: operation.operationId }));
      seen.add(key);
    }
  }
  if (ruleId === "operation.relate-integrity")
    for (const operation of plan.operations.filter(({ kind }) => kind === "relate"))
      if (!operation.relationships.length || operation.relationships.some((value) => !validRelationship(value)))
        output.push(finding(ruleId, "relate-relationship-missing",
          "Relate operation requires valid relationship references.",
          { operationId: operation.operationId }));
  if (ruleId === "operation.focus-consistency" && primaryKey)
    for (const operation of plan.operations.filter(({ kind }) => kind === "focus"))
      if (!operation.subjects.length || operation.subjects.some((subject) => subjectKey(subject) !== primaryKey))
        output.push(finding(ruleId, "focus-operation-mismatch",
          "Focus operation does not match primary focus.", { operationId: operation.operationId }));
  if (ruleId === "consistency.visibility")
    for (const key of revealed) if (concealed.has(key)) output.push(finding(ruleId,
      "reveal-conceal-conflict", "Subject is both revealed and concealed."));
  if (ruleId === "consistency.prominence")
    for (const key of emphasized) if (deemphasized.has(key)) output.push(finding(ruleId,
      "emphasize-deemphasize-conflict", "Subject is both emphasized and deemphasized."));
  if (ruleId === "lineage.request-plan" && (!plan.planId.endsWith(":scene-orchestration-plan") ||
      !nonEmpty(plan.planId.slice(0, -":scene-orchestration-plan".length))))
    output.push(finding(ruleId, "plan-lineage-invalid", "Plan identity does not preserve request lineage."));
  return output;
}

export function validateDirectorRuntimeSceneOrchestration(
  plan: DirectorSceneOrchestrationPlan,
): DirectorSceneOrchestrationValidationReport {
  const findings = Object.freeze(directorSceneOrchestrationValidationRules
    .flatMap(({ ruleId }) => evaluateRule(ruleId, plan)));
  const errorCount = findings.filter(({ severity }) => severity === "error").length;
  const warningCount = findings.filter(({ severity }) => severity === "warning").length;
  const noticeCount = findings.filter(({ severity }) => severity === "notice").length;
  return Object.freeze({ validationId: `${plan.planId}:DRI-3:5:validation`, planId: plan.planId,
    status: errorCount ? "invalid" as const : "valid" as const, findings,
    checkedRuleIds: Object.freeze(directorSceneOrchestrationValidationRules.map(({ ruleId }) => ruleId)),
    errorCount, warningCount, noticeCount });
}

export function isDirectorRuntimeSceneOrchestrationValid(plan: DirectorSceneOrchestrationPlan) {
  return validateDirectorRuntimeSceneOrchestration(plan).status === "valid";
}

export const directorRuntimeSceneOrchestrationValidationConcepts = Object.freeze([
  "Identity Validation", "Context Validation", "Focus Validation", "Attention Validation",
  "Subject Integrity", "Relationship Validation", "Path Validation", "Operation Validation",
  "Ordering Validation", "Lineage Validation", "Consistency Validation",
] as const);
export const directorRuntimeSceneOrchestrationValidationApiNames = Object.freeze([
  "validateDirectorRuntimeSceneOrchestration", "isDirectorRuntimeSceneOrchestrationValid",
] as const);
export const directorRuntimeSceneOrchestrationValidationRegistry = Object.freeze({
  concepts: directorRuntimeSceneOrchestrationValidationConcepts,
  conceptCount: directorRuntimeSceneOrchestrationValidationConcepts.length,
  statuses: DIRECTOR_SCENE_ORCHESTRATION_VALIDATION_STATUSES,
  statusCount: DIRECTOR_SCENE_ORCHESTRATION_VALIDATION_STATUSES.length,
  severities: DIRECTOR_SCENE_ORCHESTRATION_VALIDATION_SEVERITIES,
  severityCount: DIRECTOR_SCENE_ORCHESTRATION_VALIDATION_SEVERITIES.length,
  categories: DIRECTOR_SCENE_ORCHESTRATION_VALIDATION_CATEGORIES,
  categoryCount: DIRECTOR_SCENE_ORCHESTRATION_VALIDATION_CATEGORIES.length,
  rules: directorSceneOrchestrationValidationRules,
  ruleCount: directorSceneOrchestrationValidationRules.length,
  publicApis: directorRuntimeSceneOrchestrationValidationApiNames,
  publicApiCount: directorRuntimeSceneOrchestrationValidationApiNames.length,
});

export const directorRuntimeSceneOrchestrationValidation = Object.freeze({
  phase: "DRI-3:5" as const, name: "DirectorRuntimeSceneOrchestrationValidation" as const,
  identity: directorRuntimeSceneOrchestrationValidationIdentity,
  namespace: directorRuntimeSceneOrchestrationValidationNamespace,
  version: directorRuntimeSceneOrchestrationValidationVersion,
  layer: "DRI" as const, capability: "DirectorRuntimeSceneOrchestration" as const,
  stage: "Validation" as const, immediateDependency: directorRuntimeSceneOrchestrationValidationUpstream,
  rules: directorSceneOrchestrationValidationRules,
  publicApiSurface: directorRuntimeSceneOrchestrationValidationApiNames,
  registry: directorRuntimeSceneOrchestrationValidationRegistry,
});
