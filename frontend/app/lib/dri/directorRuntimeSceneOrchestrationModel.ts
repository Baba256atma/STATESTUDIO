/** DRI-3:3 — deterministic structural Runtime-to-Scene orchestration model. */

import {
  createDirectorSceneOrchestrationIssue,
  createDirectorSceneOrchestrationRequest,
  createDirectorSceneOrchestrationResult,
  directorRuntimeSceneOrchestrationContractsIdentity,
  type DirectorSceneAttention,
  type DirectorSceneFocus,
  type DirectorSceneOrchestrationIssue,
  type DirectorSceneOrchestrationOperation,
  type DirectorSceneOrchestrationOperationKind,
  type DirectorSceneOrchestrationPlan,
  type DirectorSceneOrchestrationRequest,
  type DirectorSceneOrchestrationResult,
  type DirectorScenePath,
  type DirectorSceneRelationshipRef,
  type DirectorSceneSubjectRef,
} from "@/app/lib/dri/directorRuntimeSceneOrchestrationContracts";

export type {
  DirectorSceneAttention, DirectorSceneFocus, DirectorSceneOrchestrationOperation,
  DirectorSceneOrchestrationOperationKind, DirectorSceneOrchestrationPlan,
  DirectorSceneOrchestrationResult, DirectorScenePath, DirectorSceneRelationshipRef,
  DirectorSceneSubjectRef,
} from "@/app/lib/dri/directorRuntimeSceneOrchestrationContracts";

export const directorRuntimeSceneOrchestrationModelIdentity =
  "DRI-3:3/DirectorRuntimeSceneOrchestrationModel" as const;
export const directorRuntimeSceneOrchestrationModelNamespace =
  "nexora.dri.scene.orchestration.model" as const;
export const directorRuntimeSceneOrchestrationModelVersion = "3.3.0" as const;
export const directorRuntimeSceneOrchestrationModelUpstream =
  directorRuntimeSceneOrchestrationContractsIdentity;

export const DIRECTOR_SCENE_ORCHESTRATION_MODEL_STAGES = Object.freeze([
  "normalize-request", "resolve-subjects", "resolve-relationships", "resolve-focus",
  "resolve-attention", "resolve-paths", "resolve-operations", "assemble-plan", "produce-result",
] as const);

export const DIRECTOR_SCENE_ORCHESTRATION_OPERATION_ORDER = Object.freeze([
  "preserve", "reveal", "conceal", "relate", "focus", "emphasize", "deemphasize", "attention",
] as const satisfies readonly DirectorSceneOrchestrationOperationKind[]);

function subjectKey(subject: DirectorSceneSubjectRef) {
  return `${subject.namespace ?? ""}\u0000${subject.subjectKind}\u0000${subject.subjectId}`;
}

function cloneSubject(subject: DirectorSceneSubjectRef): DirectorSceneSubjectRef {
  return Object.freeze({ ...subject });
}

function cloneRelationship(relationship: DirectorSceneRelationshipRef): DirectorSceneRelationshipRef {
  return Object.freeze({ ...relationship, source: cloneSubject(relationship.source),
    target: cloneSubject(relationship.target) });
}

function uniqueSubjects(values: readonly DirectorSceneSubjectRef[]) {
  const seen = new Set<string>();
  return Object.freeze(values.flatMap((subject) => {
    const key = subjectKey(subject);
    if (seen.has(key)) return [];
    seen.add(key);
    return [cloneSubject(subject)];
  }));
}

function collectReferencedSubjects(request: DirectorSceneOrchestrationRequest) {
  const values: DirectorSceneSubjectRef[] = [...request.subjects];
  if (request.requestedFocus?.primary) values.push(request.requestedFocus.primary);
  if (request.requestedFocus) values.push(...request.requestedFocus.secondary);
  for (const attention of request.requestedAttention) values.push(attention.subject);
  for (const path of request.requestedPaths) {
    values.push(...path.subjects);
    for (const relationship of path.relationships) values.push(relationship.source, relationship.target);
  }
  for (const operation of request.requestedOperations) {
    values.push(...operation.subjects);
    for (const relationship of operation.relationships)
      values.push(relationship.source, relationship.target);
  }
  for (const relationship of request.relationships) values.push(relationship.source, relationship.target);
  return uniqueSubjects(values);
}

function cloneFocus(focus: DirectorSceneFocus | null): DirectorSceneFocus {
  return Object.freeze({ primary: focus?.primary ? cloneSubject(focus.primary) : null,
    secondary: Object.freeze((focus?.secondary ?? []).map(cloneSubject)) });
}

function cloneAttention(values: readonly DirectorSceneAttention[]) {
  return Object.freeze(values.map((attention) => Object.freeze({ ...attention,
    subject: cloneSubject(attention.subject) })));
}

function clonePaths(values: readonly DirectorScenePath[]) {
  return Object.freeze(values.map((path) => Object.freeze({ pathId: path.pathId,
    subjects: Object.freeze(path.subjects.map(cloneSubject)),
    relationships: Object.freeze(path.relationships.map(cloneRelationship)) })));
}

function operation(input: DirectorSceneOrchestrationOperation): DirectorSceneOrchestrationOperation {
  return Object.freeze({ ...input, subjects: Object.freeze(input.subjects.map(cloneSubject)),
    relationships: Object.freeze(input.relationships.map(cloneRelationship)) });
}

function derivePathOperations(request: DirectorSceneOrchestrationRequest) {
  const result: DirectorSceneOrchestrationOperation[] = [];
  for (const path of request.requestedPaths) {
    for (const subject of path.subjects) result.push(operation({
      operationId: `${request.requestId}:path:${path.pathId}:reveal:${subject.subjectId}`,
      kind: "reveal", subjects: [subject], relationships: [],
    }));
    for (const relationship of path.relationships) result.push(operation({
      operationId: `${request.requestId}:path:${path.pathId}:relate:${relationship.relationshipId}`,
      kind: "relate", subjects: [relationship.source, relationship.target],
      relationships: [relationship],
    }));
  }
  return result;
}

function deriveRelationshipOperations(request: DirectorSceneOrchestrationRequest) {
  return request.relationships.map((relationship) => operation({
    operationId: `${request.requestId}:relate:${relationship.relationshipId}`,
    kind: "relate", subjects: [relationship.source, relationship.target],
    relationships: [relationship],
  }));
}

function deriveFocusOperations(request: DirectorSceneOrchestrationRequest) {
  if (!request.requestedFocus?.primary) return [];
  return [operation({ operationId: `${request.requestId}:focus`, kind: "focus",
    subjects: [request.requestedFocus.primary], relationships: [] })];
}

function deriveAttentionOperations(request: DirectorSceneOrchestrationRequest) {
  return request.requestedAttention.map((attention, index) => operation({
    operationId: `${request.requestId}:attention:${attention.subject.subjectId}:${index}`,
    kind: "attention", subjects: [attention.subject], relationships: [], reason: attention.reason,
  }));
}

function operationKey(value: DirectorSceneOrchestrationOperation) {
  return JSON.stringify({ kind: value.kind, subjects: value.subjects.map(subjectKey),
    relationships: value.relationships.map(({ relationshipId, source, target, relationshipKind }) =>
      [relationshipId, subjectKey(source), subjectKey(target), relationshipKind ?? null]),
    reason: value.reason ?? null });
}

function resolveOperations(request: DirectorSceneOrchestrationRequest) {
  const candidates = [...derivePathOperations(request), ...deriveRelationshipOperations(request),
    ...request.requestedOperations.map(operation), ...deriveFocusOperations(request),
    ...deriveAttentionOperations(request)];
  const seen = new Set<string>();
  const unique = candidates.filter((candidate) => {
    const key = operationKey(candidate);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
  const rank = new Map(DIRECTOR_SCENE_ORCHESTRATION_OPERATION_ORDER
    .map((kind, index) => [kind, index] as const));
  return Object.freeze(unique.map((value, index) => ({ value, index }))
    .sort((left, right) => (rank.get(left.value.kind) ?? Number.MAX_SAFE_INTEGER) -
      (rank.get(right.value.kind) ?? Number.MAX_SAFE_INTEGER) || left.index - right.index)
    .map(({ value }) => value));
}

function structuralIssues(request: DirectorSceneOrchestrationRequest) {
  const issues: DirectorSceneOrchestrationIssue[] = [];
  if (!request.requestId.trim()) issues.push(createDirectorSceneOrchestrationIssue({
    code: "missing-request-identity", severity: "error", message: "Request identity is required.",
  }));
  if (!request.context.runtimeContextId.trim()) issues.push(createDirectorSceneOrchestrationIssue({
    code: "missing-runtime-context-identity", severity: "error",
    message: "Runtime context identity is required.",
  }));
  const declared = new Set(request.subjects.map(subjectKey));
  for (const subject of collectReferencedSubjects(request)) {
    const key = subjectKey(subject);
    if (!declared.has(key)) issues.push(createDirectorSceneOrchestrationIssue({
      code: "implicit-subject-reference", severity: "warning",
      message: "A referenced orchestration subject was not declared in the request subject collection.",
      subjectId: subject.subjectId,
    }));
  }
  return Object.freeze(issues);
}

export function resolveDirectorSceneOrchestration(
  source: DirectorSceneOrchestrationRequest,
): DirectorSceneOrchestrationResult {
  const request = createDirectorSceneOrchestrationRequest(source);
  const issues = structuralIssues(request);
  if (issues.some(({ severity }) => severity === "error")) return createDirectorSceneOrchestrationResult({
    requestId: request.requestId, status: "rejected", plan: null, issues,
  });
  const plan: DirectorSceneOrchestrationPlan = {
    planId: `${request.requestId}:scene-orchestration-plan`, context: request.context,
    focus: cloneFocus(request.requestedFocus), attention: cloneAttention(request.requestedAttention),
    paths: clonePaths(request.requestedPaths), operations: resolveOperations(request),
  };
  return createDirectorSceneOrchestrationResult({ requestId: request.requestId,
    status: issues.length ? "partial" : "resolved", plan, issues });
}

export const directorRuntimeSceneOrchestrationModelConcepts = Object.freeze([
  "Request Resolution", "Subject Resolution", "Relationship Resolution", "Focus Resolution",
  "Attention Resolution", "Path Resolution", "Operation Resolution", "Plan Assembly",
  "Result Resolution",
] as const);
export const directorRuntimeSceneOrchestrationModelApiNames = Object.freeze([
  "resolveDirectorSceneOrchestration",
] as const);

export const directorRuntimeSceneOrchestrationModelRegistry = Object.freeze({
  concepts: directorRuntimeSceneOrchestrationModelConcepts,
  conceptCount: directorRuntimeSceneOrchestrationModelConcepts.length,
  stages: DIRECTOR_SCENE_ORCHESTRATION_MODEL_STAGES,
  stageCount: DIRECTOR_SCENE_ORCHESTRATION_MODEL_STAGES.length,
  operationOrder: DIRECTOR_SCENE_ORCHESTRATION_OPERATION_ORDER,
  operationOrderCount: DIRECTOR_SCENE_ORCHESTRATION_OPERATION_ORDER.length,
  publicApis: directorRuntimeSceneOrchestrationModelApiNames,
  publicApiCount: directorRuntimeSceneOrchestrationModelApiNames.length,
  subjectDuplicateRule: "stable-first-occurrence" as const,
  operationDuplicateRule: "stable-first-semantic-occurrence" as const,
  planIdentityRule: "request-id:scene-orchestration-plan" as const,
});

export const directorRuntimeSceneOrchestrationModel = Object.freeze({
  phase: "DRI-3:3" as const,
  name: "DirectorRuntimeSceneOrchestrationModel" as const,
  identity: directorRuntimeSceneOrchestrationModelIdentity,
  namespace: directorRuntimeSceneOrchestrationModelNamespace,
  version: directorRuntimeSceneOrchestrationModelVersion,
  layer: "DRI" as const, capability: "DirectorRuntimeSceneOrchestration" as const,
  stage: "Model" as const, immediateDependency: directorRuntimeSceneOrchestrationModelUpstream,
  resolutionStages: DIRECTOR_SCENE_ORCHESTRATION_MODEL_STAGES,
  operationOrder: DIRECTOR_SCENE_ORCHESTRATION_OPERATION_ORDER,
  publicApiSurface: directorRuntimeSceneOrchestrationModelApiNames,
  registry: directorRuntimeSceneOrchestrationModelRegistry,
});
