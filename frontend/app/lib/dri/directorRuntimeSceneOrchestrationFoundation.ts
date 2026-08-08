/** DRI-3:1 — immutable semantic Scene Orchestration Foundation. */

import {
  directorRuntimeStateContextBindingPublicIndexIdentity,
  type RuntimeContextReference,
  type RuntimeStateReference,
} from "@/app/lib/dri/directorRuntimeStateContextBindingPublicIndex";

export const directorRuntimeSceneOrchestrationFoundationIdentity =
  "DRI-3:1/DirectorRuntimeSceneOrchestrationFoundation" as const;
export const directorRuntimeSceneOrchestrationFoundationVersion = "3.1.0" as const;
export const directorRuntimeSceneOrchestrationFoundationNamespace =
  "nexora.dri.scene.orchestration.foundation" as const;
export const directorRuntimeSceneOrchestrationFoundationUpstream =
  directorRuntimeStateContextBindingPublicIndexIdentity;

export const DIRECTOR_SCENE_ORCHESTRATION_OPERATION_KINDS = Object.freeze([
  "focus", "emphasize", "deemphasize", "reveal", "conceal", "relate", "attention", "preserve",
] as const);
export type DirectorSceneOrchestrationOperationKind =
  (typeof DIRECTOR_SCENE_ORCHESTRATION_OPERATION_KINDS)[number];

export const DIRECTOR_SCENE_ATTENTION_LEVELS = Object.freeze([
  "normal", "notice", "important", "critical",
] as const);
export type DirectorSceneAttentionLevel = (typeof DIRECTOR_SCENE_ATTENTION_LEVELS)[number];

export interface DirectorSceneSubjectRef {
  readonly subjectId: string;
  readonly subjectKind: string;
  readonly namespace?: string;
}

export interface DirectorSceneRelationshipRef {
  readonly relationshipId: string;
  readonly source: DirectorSceneSubjectRef;
  readonly target: DirectorSceneSubjectRef;
  readonly relationshipKind?: string;
}

export interface DirectorSceneFocus {
  readonly primary: DirectorSceneSubjectRef | null;
  readonly secondary: readonly DirectorSceneSubjectRef[];
}

export interface DirectorSceneAttention {
  readonly subject: DirectorSceneSubjectRef;
  readonly level: DirectorSceneAttentionLevel;
  readonly reason?: string;
}

export interface DirectorScenePath {
  readonly pathId: string;
  readonly subjects: readonly DirectorSceneSubjectRef[];
  readonly relationships: readonly DirectorSceneRelationshipRef[];
}

export interface DirectorSceneOrchestrationOperation {
  readonly operationId: string;
  readonly kind: DirectorSceneOrchestrationOperationKind;
  readonly subjects: readonly DirectorSceneSubjectRef[];
  readonly relationships: readonly DirectorSceneRelationshipRef[];
  readonly reason?: string;
}

export interface DirectorSceneOrchestrationContext {
  readonly runtimeContextId: string;
  readonly runtimeStateId?: string;
  readonly mode?: string;
  readonly workspace?: string;
  readonly lens?: string;
  readonly runtimeContext?: RuntimeContextReference;
  readonly runtimeState?: RuntimeStateReference;
}

export interface DirectorSceneOrchestrationPlan {
  readonly planId: string;
  readonly context: DirectorSceneOrchestrationContext;
  readonly focus: DirectorSceneFocus;
  readonly attention: readonly DirectorSceneAttention[];
  readonly paths: readonly DirectorScenePath[];
  readonly operations: readonly DirectorSceneOrchestrationOperation[];
}

export function createDirectorSceneSubjectRef(
  input: DirectorSceneSubjectRef,
): DirectorSceneSubjectRef {
  return Object.freeze({ ...input });
}

function subjectKey(subject: DirectorSceneSubjectRef) {
  return `${subject.namespace ?? ""}\u0000${subject.subjectKind}\u0000${subject.subjectId}`;
}

/** Duplicate subjects use stable first-occurrence preservation. */
function uniqueSubjects(subjects: readonly DirectorSceneSubjectRef[]) {
  const seen = new Set<string>();
  const result: DirectorSceneSubjectRef[] = [];
  for (const subject of subjects) {
    const normalized = createDirectorSceneSubjectRef(subject);
    const key = subjectKey(normalized);
    if (!seen.has(key)) { seen.add(key); result.push(normalized); }
  }
  return Object.freeze(result);
}

export function createDirectorSceneRelationshipRef(
  input: DirectorSceneRelationshipRef,
): DirectorSceneRelationshipRef {
  return Object.freeze({ ...input, source: createDirectorSceneSubjectRef(input.source),
    target: createDirectorSceneSubjectRef(input.target) });
}

function relationships(values: readonly DirectorSceneRelationshipRef[]) {
  return Object.freeze(values.map(createDirectorSceneRelationshipRef));
}

export function createDirectorSceneFocus(input: {
  readonly primary?: DirectorSceneSubjectRef | null;
  readonly secondary?: readonly DirectorSceneSubjectRef[];
}): DirectorSceneFocus {
  const primary = input.primary == null ? null : createDirectorSceneSubjectRef(input.primary);
  const secondary = uniqueSubjects(input.secondary ?? [])
    .filter((subject) => primary === null || subjectKey(subject) !== subjectKey(primary));
  return Object.freeze({ primary, secondary: Object.freeze(secondary) });
}

export function createDirectorSceneAttention(input: DirectorSceneAttention): DirectorSceneAttention {
  return Object.freeze({ ...input, subject: createDirectorSceneSubjectRef(input.subject) });
}

export function createDirectorScenePath(input: DirectorScenePath): DirectorScenePath {
  return Object.freeze({ pathId: input.pathId, subjects: uniqueSubjects(input.subjects),
    relationships: relationships(input.relationships) });
}

export function createDirectorSceneOrchestrationOperation(
  input: DirectorSceneOrchestrationOperation,
): DirectorSceneOrchestrationOperation {
  return Object.freeze({ ...input, subjects: uniqueSubjects(input.subjects),
    relationships: relationships(input.relationships) });
}

function createContext(input: DirectorSceneOrchestrationContext): DirectorSceneOrchestrationContext {
  return Object.freeze({ ...input,
    ...(input.runtimeContext === undefined ? {} :
      { runtimeContext: Object.freeze({ ...input.runtimeContext }) }),
    ...(input.runtimeState === undefined ? {} :
      { runtimeState: Object.freeze({ ...input.runtimeState }) }),
  });
}

export function createDirectorSceneOrchestrationPlan(
  input: DirectorSceneOrchestrationPlan,
): DirectorSceneOrchestrationPlan {
  return Object.freeze({ planId: input.planId, context: createContext(input.context),
    focus: createDirectorSceneFocus(input.focus),
    attention: Object.freeze(input.attention.map(createDirectorSceneAttention)),
    paths: Object.freeze(input.paths.map(createDirectorScenePath)),
    operations: Object.freeze(input.operations.map(createDirectorSceneOrchestrationOperation)),
  });
}

export function createEmptyDirectorSceneOrchestrationPlan(input: {
  readonly planId: string;
  readonly context: DirectorSceneOrchestrationContext;
}): DirectorSceneOrchestrationPlan {
  return createDirectorSceneOrchestrationPlan({ ...input, focus: { primary: null, secondary: [] },
    attention: [], paths: [], operations: [] });
}

export const directorRuntimeSceneOrchestrationFoundationConcepts = Object.freeze([
  "Subject Reference", "Relationship Reference", "Focus", "Attention", "Path", "Operation",
  "Context", "Orchestration Plan",
] as const);
export const directorRuntimeSceneOrchestrationFoundationContractNames = Object.freeze([
  "DirectorSceneSubjectRef", "DirectorSceneRelationshipRef", "DirectorSceneFocus",
  "DirectorSceneAttention", "DirectorScenePath", "DirectorSceneOrchestrationOperation",
  "DirectorSceneOrchestrationContext", "DirectorSceneOrchestrationPlan",
] as const);
export const directorRuntimeSceneOrchestrationFoundationApiNames = Object.freeze([
  "createDirectorSceneSubjectRef", "createDirectorSceneRelationshipRef", "createDirectorSceneFocus",
  "createDirectorSceneAttention", "createDirectorScenePath",
  "createDirectorSceneOrchestrationOperation", "createDirectorSceneOrchestrationPlan",
  "createEmptyDirectorSceneOrchestrationPlan",
] as const);

export const directorRuntimeSceneOrchestrationFoundationRegistry = Object.freeze({
  concepts: directorRuntimeSceneOrchestrationFoundationConcepts,
  conceptCount: directorRuntimeSceneOrchestrationFoundationConcepts.length,
  contracts: directorRuntimeSceneOrchestrationFoundationContractNames,
  contractCount: directorRuntimeSceneOrchestrationFoundationContractNames.length,
  operationKinds: DIRECTOR_SCENE_ORCHESTRATION_OPERATION_KINDS,
  operationKindCount: DIRECTOR_SCENE_ORCHESTRATION_OPERATION_KINDS.length,
  attentionLevels: DIRECTOR_SCENE_ATTENTION_LEVELS,
  attentionLevelCount: DIRECTOR_SCENE_ATTENTION_LEVELS.length,
  publicApis: directorRuntimeSceneOrchestrationFoundationApiNames,
  publicApiCount: directorRuntimeSceneOrchestrationFoundationApiNames.length,
  duplicateSubjectRule: "stable-first-occurrence" as const,
});

export const directorRuntimeSceneOrchestrationFoundation = Object.freeze({
  phase: "DRI-3:1" as const,
  name: "DirectorRuntimeSceneOrchestrationFoundation" as const,
  identity: directorRuntimeSceneOrchestrationFoundationIdentity,
  namespace: directorRuntimeSceneOrchestrationFoundationNamespace,
  version: directorRuntimeSceneOrchestrationFoundationVersion,
  layer: "DRI" as const,
  capability: "DirectorRuntimeSceneOrchestration" as const,
  stage: "Foundation" as const,
  upstreamDependency: directorRuntimeSceneOrchestrationFoundationUpstream,
  operationKinds: DIRECTOR_SCENE_ORCHESTRATION_OPERATION_KINDS,
  attentionLevels: DIRECTOR_SCENE_ATTENTION_LEVELS,
  duplicateSubjectRule: "stable-first-occurrence" as const,
  publicApiSurface: directorRuntimeSceneOrchestrationFoundationApiNames,
  registry: directorRuntimeSceneOrchestrationFoundationRegistry,
});
