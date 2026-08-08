/** DRI-3:4 — deterministic semantic focus and attention policy. */

import {
  DIRECTOR_SCENE_ORCHESTRATION_OPERATION_ORDER,
  directorRuntimeSceneOrchestrationModelIdentity,
  type DirectorSceneAttention,
  type DirectorSceneOrchestrationOperation,
  type DirectorSceneOrchestrationPlan,
  type DirectorScenePath,
  type DirectorSceneRelationshipRef,
  type DirectorSceneSubjectRef,
} from "@/app/lib/dri/directorRuntimeSceneOrchestrationModel";

export { DIRECTOR_SCENE_ORCHESTRATION_OPERATION_ORDER };
export type {
  DirectorSceneAttention, DirectorSceneOrchestrationOperation,
  DirectorSceneOrchestrationOperationKind, DirectorSceneOrchestrationPlan,
  DirectorScenePath, DirectorSceneRelationshipRef, DirectorSceneSubjectRef,
} from "@/app/lib/dri/directorRuntimeSceneOrchestrationModel";

export const directorRuntimeSceneFocusAttentionOrchestrationIdentity =
  "DRI-3:4/DirectorRuntimeSceneFocusAttentionOrchestration" as const;
export const directorRuntimeSceneFocusAttentionOrchestrationNamespace =
  "nexora.dri.scene.orchestration.focus-attention" as const;
export const directorRuntimeSceneFocusAttentionOrchestrationVersion = "3.4.0" as const;
export const directorRuntimeSceneFocusAttentionOrchestrationUpstream =
  directorRuntimeSceneOrchestrationModelIdentity;

export const DIRECTOR_SCENE_FOCUS_RESOLUTION_REASONS = Object.freeze([
  "explicit-primary", "attention-priority", "operation-priority", "preserved", "none",
] as const);
export type DirectorSceneFocusResolutionReason =
  (typeof DIRECTOR_SCENE_FOCUS_RESOLUTION_REASONS)[number];

export const DIRECTOR_SCENE_ATTENTION_PRIORITY = Object.freeze([
  "critical", "important", "notice", "normal",
] as const);

export const DIRECTOR_SCENE_FOCUS_ATTENTION_POLICY_PRECEDENCE = Object.freeze([
  "explicit-primary", "preserve", "critical-attention", "important-attention", "explicit-reveal",
  "explicit-emphasize", "notice-attention", "normal-attention", "deemphasize", "conceal",
] as const);

export interface DirectorSceneAttentionResolution {
  readonly ordered: readonly DirectorSceneAttention[];
  readonly highest: DirectorSceneAttention | null;
}

export interface DirectorSceneFocusResolution {
  readonly primary: DirectorSceneSubjectRef | null;
  readonly secondary: readonly DirectorSceneSubjectRef[];
  readonly reason: DirectorSceneFocusResolutionReason;
}

export interface DirectorSceneProminenceResolution {
  readonly emphasized: readonly DirectorSceneSubjectRef[];
  readonly deemphasized: readonly DirectorSceneSubjectRef[];
}

function subjectKey(subject: DirectorSceneSubjectRef) {
  return `${subject.namespace ?? ""}\u0000${subject.subjectKind}\u0000${subject.subjectId}`;
}

function cloneSubject(subject: DirectorSceneSubjectRef): DirectorSceneSubjectRef {
  return Object.freeze({ ...subject });
}

function cloneRelationship(value: DirectorSceneRelationshipRef): DirectorSceneRelationshipRef {
  return Object.freeze({ ...value, source: cloneSubject(value.source), target: cloneSubject(value.target) });
}

function cloneOperation(value: DirectorSceneOrchestrationOperation): DirectorSceneOrchestrationOperation {
  return Object.freeze({ ...value, subjects: Object.freeze(value.subjects.map(cloneSubject)),
    relationships: Object.freeze(value.relationships.map(cloneRelationship)) });
}

function uniqueSubjects(values: readonly DirectorSceneSubjectRef[], excluded?: string) {
  const seen = new Set<string>();
  const output: DirectorSceneSubjectRef[] = [];
  for (const subject of values) {
    const key = subjectKey(subject);
    if (key !== excluded && !seen.has(key)) { seen.add(key); output.push(cloneSubject(subject)); }
  }
  return Object.freeze(output);
}

function attentionRank(level: DirectorSceneAttention["level"]) {
  return DIRECTOR_SCENE_ATTENTION_PRIORITY.indexOf(level);
}

export function rankDirectorSceneAttention(
  values: readonly DirectorSceneAttention[],
): DirectorSceneAttentionResolution {
  const records = new Map<string, { attention: DirectorSceneAttention; firstIndex: number }>();
  values.forEach((attention, index) => {
    const key = subjectKey(attention.subject);
    const existing = records.get(key);
    const normalized = Object.freeze({ ...attention, subject: cloneSubject(attention.subject) });
    if (!existing) records.set(key, { attention: normalized, firstIndex: index });
    else if (attentionRank(normalized.level) < attentionRank(existing.attention.level))
      records.set(key, { attention: normalized, firstIndex: existing.firstIndex });
  });
  const ordered = Object.freeze([...records.values()]
    .sort((left, right) => attentionRank(left.attention.level) - attentionRank(right.attention.level) ||
      left.firstIndex - right.firstIndex)
    .map(({ attention }) => attention));
  return Object.freeze({ ordered, highest: ordered[0] ?? null });
}

function firstOperationSubject(plan: DirectorSceneOrchestrationPlan, kind: string) {
  return plan.operations.find((value) => value.kind === kind)?.subjects[0] ?? null;
}

export function resolveDirectorSceneFocus(
  plan: DirectorSceneOrchestrationPlan,
  attention: DirectorSceneAttentionResolution = rankDirectorSceneAttention(plan.attention),
): DirectorSceneFocusResolution {
  const explicitPrimary = plan.focus.primary;
  const operationPrimary = firstOperationSubject(plan, "focus");
  const preserved = firstOperationSubject(plan, "preserve");
  const primary = explicitPrimary ?? operationPrimary ?? attention.highest?.subject ?? preserved;
  const reason: DirectorSceneFocusResolutionReason = explicitPrimary ? "explicit-primary" :
    operationPrimary ? "operation-priority" : attention.highest ? "attention-priority" :
      preserved ? "preserved" : "none";
  const candidates: DirectorSceneSubjectRef[] = [...plan.focus.secondary,
    ...attention.ordered.map(({ subject }) => subject)];
  for (const operation of plan.operations) candidates.push(...operation.subjects);
  for (const path of plan.paths) candidates.push(...path.subjects);
  return Object.freeze({ primary: primary ? cloneSubject(primary) : null,
    secondary: uniqueSubjects(candidates, primary ? subjectKey(primary) : undefined), reason });
}

function resolveProminence(plan: DirectorSceneOrchestrationPlan,
  attention: DirectorSceneAttentionResolution): DirectorSceneProminenceResolution {
  const emphasized = uniqueSubjects(plan.operations
    .filter(({ kind }) => kind === "emphasize").flatMap(({ subjects }) => subjects));
  const emphasizedKeys = new Set(emphasized.map(subjectKey));
  const stronglyAttended = new Set(attention.ordered
    .filter(({ level }) => level === "critical" || level === "important")
    .map(({ subject }) => subjectKey(subject)));
  const deemphasized = uniqueSubjects(plan.operations
    .filter(({ kind }) => kind === "deemphasize").flatMap(({ subjects }) => subjects)
    .filter((subject) => !emphasizedKeys.has(subjectKey(subject)) &&
      !stronglyAttended.has(subjectKey(subject))));
  return Object.freeze({ emphasized, deemphasized });
}

function semanticOperationKey(value: DirectorSceneOrchestrationOperation) {
  return JSON.stringify({ kind: value.kind, subjects: value.subjects.map(subjectKey),
    relationships: value.relationships.map(({ relationshipId, source, target, relationshipKind }) =>
      [relationshipId, subjectKey(source), subjectKey(target), relationshipKind ?? null]),
    reason: value.reason ?? null });
}

function resolveOperations(plan: DirectorSceneOrchestrationPlan, focus: DirectorSceneFocusResolution,
  attention: DirectorSceneAttentionResolution, prominence: DirectorSceneProminenceResolution) {
  const primaryKey = focus.primary ? subjectKey(focus.primary) : null;
  const strongKeys = new Set(attention.ordered
    .filter(({ level }) => level === "critical" || level === "important")
    .map(({ subject }) => subjectKey(subject)));
  const emphasizedKeys = new Set(prominence.emphasized.map(subjectKey));
  const revealKeys = new Set(plan.operations.filter(({ kind }) => kind === "reveal")
    .flatMap(({ subjects }) => subjects.map(subjectKey)));
  const protectedKeys = new Set([...strongKeys, ...(primaryKey ? [primaryKey] : [])]);
  const removedConcealSubjects: DirectorSceneSubjectRef[] = [];
  const seen = new Set<string>();
  const filtered: DirectorSceneOrchestrationOperation[] = [];
  for (const source of plan.operations) {
    let value = cloneOperation(source);
    if (value.kind === "focus") {
      const retained = value.subjects.filter((subject) => subjectKey(subject) === primaryKey);
      if (!retained.length) continue;
      value = cloneOperation({ ...value, subjects: retained });
    }
    if (value.kind === "conceal") {
      removedConcealSubjects.push(...value.subjects.filter((subject) =>
        protectedKeys.has(subjectKey(subject))));
      const retained = value.subjects.filter((subject) =>
        !protectedKeys.has(subjectKey(subject)) && !revealKeys.has(subjectKey(subject)));
      if (!retained.length) continue;
      value = cloneOperation({ ...value, subjects: retained });
    }
    if (value.kind === "deemphasize") {
      const retained = value.subjects.filter((subject) =>
        !strongKeys.has(subjectKey(subject)) && !emphasizedKeys.has(subjectKey(subject)));
      if (!retained.length) continue;
      value = cloneOperation({ ...value, subjects: retained });
    }
    const key = semanticOperationKey(value);
    if (!seen.has(key)) { seen.add(key); filtered.push(value); }
  }
  if (focus.primary && !filtered.some(({ kind, subjects }) =>
    kind === "focus" && subjects.some((subject) => subjectKey(subject) === primaryKey)))
    filtered.push(cloneOperation({ operationId: `policy:focus:${focus.primary.subjectId}`,
      kind: "focus", subjects: [focus.primary], relationships: [] }));
  for (const subject of uniqueSubjects(removedConcealSubjects))
    if (!filtered.some(({ kind, subjects }) => kind === "reveal" &&
      subjects.some((candidate) => subjectKey(candidate) === subjectKey(subject))))
      filtered.push(cloneOperation({ operationId: `policy:reveal:${subject.subjectId}`,
        kind: "reveal", subjects: [subject], relationships: [] }));
  const rank = new Map(DIRECTOR_SCENE_ORCHESTRATION_OPERATION_ORDER
    .map((kind, index) => [kind, index] as const));
  return Object.freeze(filtered.map((value, index) => ({ value, index }))
    .sort((left, right) => (rank.get(left.value.kind) ?? Number.MAX_SAFE_INTEGER) -
      (rank.get(right.value.kind) ?? Number.MAX_SAFE_INTEGER) || left.index - right.index)
    .map(({ value }) => value));
}

function prioritizePaths(paths: readonly DirectorScenePath[], primary: DirectorSceneSubjectRef | null,
  highest: DirectorSceneAttention | null) {
  const primaryKey = primary ? subjectKey(primary) : null;
  const attentionKey = highest ? subjectKey(highest.subject) : null;
  const contains = (path: DirectorScenePath, key: string | null) =>
    key !== null && path.subjects.some((subject) => subjectKey(subject) === key);
  return Object.freeze(paths.map((path, index) => ({ path, index,
    primary: contains(path, primaryKey), attention: contains(path, attentionKey) }))
    .sort((left, right) => Number(right.primary) - Number(left.primary) ||
      Number(right.attention) - Number(left.attention) || left.index - right.index)
    .map(({ path }) => Object.freeze({ pathId: path.pathId,
      subjects: Object.freeze(path.subjects.map(cloneSubject)),
      relationships: Object.freeze(path.relationships.map(cloneRelationship)) })));
}

export function resolveDirectorSceneFocusAttentionOrchestration(
  plan: DirectorSceneOrchestrationPlan,
): DirectorSceneOrchestrationPlan {
  const attention = rankDirectorSceneAttention(plan.attention);
  const focus = resolveDirectorSceneFocus(plan, attention);
  const prominence = resolveProminence(plan, attention);
  const operations = resolveOperations(plan, focus, attention, prominence);
  return Object.freeze({ planId: plan.planId,
    context: Object.freeze({ ...plan.context,
      ...(plan.context.runtimeContext === undefined ? {} :
        { runtimeContext: Object.freeze({ ...plan.context.runtimeContext }) }),
      ...(plan.context.runtimeState === undefined ? {} :
        { runtimeState: Object.freeze({ ...plan.context.runtimeState }) }) }),
    focus: Object.freeze({ primary: focus.primary, secondary: focus.secondary }),
    attention: attention.ordered,
    paths: prioritizePaths(plan.paths, focus.primary, attention.highest), operations });
}

export const directorRuntimeSceneFocusAttentionOrchestrationConcepts = Object.freeze([
  "Focus Resolution", "Attention Resolution", "Attention Ranking", "Attention Deduplication",
  "Secondary Focus Resolution", "Prominence Resolution", "Visibility Conflict Resolution",
  "Path Priority Resolution", "Operation Conflict Resolution", "Policy Resolution",
] as const);
export const directorRuntimeSceneFocusAttentionOrchestrationApiNames = Object.freeze([
  "rankDirectorSceneAttention", "resolveDirectorSceneFocus",
  "resolveDirectorSceneFocusAttentionOrchestration",
] as const);
export const directorRuntimeSceneFocusAttentionOrchestrationRegistry = Object.freeze({
  concepts: directorRuntimeSceneFocusAttentionOrchestrationConcepts,
  conceptCount: directorRuntimeSceneFocusAttentionOrchestrationConcepts.length,
  focusResolutionReasons: DIRECTOR_SCENE_FOCUS_RESOLUTION_REASONS,
  focusResolutionReasonCount: DIRECTOR_SCENE_FOCUS_RESOLUTION_REASONS.length,
  attentionPriority: DIRECTOR_SCENE_ATTENTION_PRIORITY,
  attentionPriorityCount: DIRECTOR_SCENE_ATTENTION_PRIORITY.length,
  policyPrecedence: DIRECTOR_SCENE_FOCUS_ATTENTION_POLICY_PRECEDENCE,
  policyPrecedenceCount: DIRECTOR_SCENE_FOCUS_ATTENTION_POLICY_PRECEDENCE.length,
  publicApis: directorRuntimeSceneFocusAttentionOrchestrationApiNames,
  publicApiCount: directorRuntimeSceneFocusAttentionOrchestrationApiNames.length,
  attentionDuplicateRule: "strongest-level-first-subject-occurrence" as const,
  prominenceConflictRule: "emphasize-over-deemphasize" as const,
  visibilityConflictRule: "focus-or-strong-attention-over-conceal" as const,
  tieBreakRule: "stable-first-occurrence" as const,
});

export const directorRuntimeSceneFocusAttentionOrchestration = Object.freeze({
  phase: "DRI-3:4" as const, name: "DirectorRuntimeSceneFocusAttentionOrchestration" as const,
  identity: directorRuntimeSceneFocusAttentionOrchestrationIdentity,
  namespace: directorRuntimeSceneFocusAttentionOrchestrationNamespace,
  version: directorRuntimeSceneFocusAttentionOrchestrationVersion,
  layer: "DRI" as const, capability: "DirectorRuntimeSceneOrchestration" as const,
  stage: "FocusAttentionOrchestration" as const,
  immediateDependency: directorRuntimeSceneFocusAttentionOrchestrationUpstream,
  attentionPriority: DIRECTOR_SCENE_ATTENTION_PRIORITY,
  policyPrecedence: DIRECTOR_SCENE_FOCUS_ATTENTION_POLICY_PRECEDENCE,
  publicApiSurface: directorRuntimeSceneFocusAttentionOrchestrationApiNames,
  registry: directorRuntimeSceneFocusAttentionOrchestrationRegistry,
});
