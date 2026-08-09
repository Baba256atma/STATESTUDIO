/**
 * REX-2:3 — Runtime Executive Stage Model.
 *
 * Canonical deterministic runtime representation of the Executive Stage at a
 * specific logical moment. Model only — no orchestration, focus resolution,
 * presentation resolution, attention calculation, transitions, or rendering.
 *
 * Canonical flow:
 *   REX-2:2 Contracts → REX-2:3 Stage Model → later Stage runtime behavior
 *
 * REX-2:2 answers: What are the legal contracts for describing/requesting Stage state?
 * REX-2:3 answers: What does the complete Executive Stage look like semantically now?
 */

import {
  RUNTIME_EXECUTIVE_STAGE_CONTRACT_ATTENTION_LEVELS,
  RUNTIME_EXECUTIVE_STAGE_CONTRACT_CONNECTION_KINDS,
  RUNTIME_EXECUTIVE_STAGE_CONTRACT_FOCUS_ROLES,
  RUNTIME_EXECUTIVE_STAGE_CONTRACT_PRESENTATION_STATES,
  RUNTIME_EXECUTIVE_STAGE_CONTRACT_SCENE_STATES,
  RUNTIME_EXECUTIVE_STAGE_CONTRACT_SELECTION_STATES,
  RUNTIME_EXECUTIVE_STAGE_CONTRACT_SUBJECT_KINDS,
  RUNTIME_EXECUTIVE_STAGE_CONTRACT_VISIBILITY_STATES,
  createRuntimeExecutiveStageSceneContract,
  createRuntimeExecutiveStageSnapshotContract,
  runtimeExecutiveStageExperienceContractsIdentity,
  runtimeExecutiveStageExperienceContractsVersion,
  type RuntimeExecutiveStageAttentionContract,
  type RuntimeExecutiveStageConnectionContract,
  type RuntimeExecutiveStageContextContract,
  type RuntimeExecutiveStageContractReason,
  type RuntimeExecutiveStageContractSource,
  type RuntimeExecutiveStageFocusContract,
  type RuntimeExecutiveStagePresentationContract,
  type RuntimeExecutiveStageSceneContract,
  type RuntimeExecutiveStageSelectionContract,
  type RuntimeExecutiveStageSnapshotContract,
  type RuntimeExecutiveStageSubjectContract,
  type RuntimeExecutiveStageVisibilityContract,
} from "@/app/lib/rex/runtimeExecutiveStageExperienceContracts";

// ─── Transitively published Foundation shapes (via REX-2:2 contracts) ───────

/** Subject shape published through RuntimeExecutiveStageSubjectContract. */
export type RuntimeExecutiveStageSubject =
  RuntimeExecutiveStageSubjectContract["subject"];

/** Scene shape published through RuntimeExecutiveStageSceneContract. */
export type RuntimeExecutiveStageScene =
  RuntimeExecutiveStageSceneContract["scene"];

/** Connection shape published through RuntimeExecutiveStageConnectionContract. */
export type RuntimeExecutiveStageConnection =
  RuntimeExecutiveStageConnectionContract["connection"];

/** Context shape published through RuntimeExecutiveStageContextContract. */
export type RuntimeExecutiveStageContext =
  RuntimeExecutiveStageContextContract["context"];

/** Snapshot shape published through RuntimeExecutiveStageSnapshotContract. */
export type RuntimeExecutiveStageSnapshot =
  RuntimeExecutiveStageSnapshotContract["snapshot"];

export type RuntimeExecutiveStageSubjectKind =
  RuntimeExecutiveStageSubject["kind"];
export type RuntimeExecutiveStagePresentationState =
  RuntimeExecutiveStageSubject["presentationState"];
export type RuntimeExecutiveStageVisibility =
  RuntimeExecutiveStageSubject["visibility"];
export type RuntimeExecutiveStageSelectionState =
  RuntimeExecutiveStageSubject["selection"];
export type RuntimeExecutiveStageFocusRole =
  RuntimeExecutiveStageSubject["focusRole"];
export type RuntimeExecutiveStageAttentionLevel =
  RuntimeExecutiveStageSubject["attention"];
export type RuntimeExecutiveStageConnectionKind =
  RuntimeExecutiveStageConnection["kind"];
export type RuntimeExecutiveStageConnectionDirection =
  RuntimeExecutiveStageConnection["direction"];
export type RuntimeExecutiveStageConnectionState =
  RuntimeExecutiveStageConnection["state"];
export type RuntimeExecutiveStageSceneState =
  RuntimeExecutiveStageScene["sceneState"];

// ─── Identity ───────────────────────────────────────────────────────────────

export const runtimeExecutiveStageModelIdentity =
  "REX-2:3/RuntimeExecutiveStageModel" as const;

export const runtimeExecutiveStageModelVersion = "2.3.0" as const;

export const runtimeExecutiveStageModelNamespace =
  "nexora.rex.stage.model" as const;

export const runtimeExecutiveStageModelLayer =
  "RuntimeExecutiveExperience" as const;

export const runtimeExecutiveStageModelDomain = "ExecutiveStage" as const;

export const runtimeExecutiveStageModelPhase = "Model" as const;

export const runtimeExecutiveStageModelArchitecturalRole =
  "RuntimeExecutiveStageModelBoundary" as const;

export const runtimeExecutiveStageModelConsumerRole =
  "InternalRuntimeModel" as const;

export const runtimeExecutiveStageModelDependencyIdentity =
  runtimeExecutiveStageExperienceContractsIdentity;

export const runtimeExecutiveStageModelDependencyPath =
  "@/app/lib/rex/runtimeExecutiveStageExperienceContracts" as const;

export const runtimeExecutiveStageModelStability = "ModelReady" as const;

export const runtimeExecutiveStageModelDeterministic = true as const;

export const runtimeExecutiveStageModelSideEffectPolicy =
  "side-effect-free" as const;

export const runtimeExecutiveStageModelMutationPolicy = "immutable" as const;

export const runtimeExecutiveStageModelCanonicalIdentity = Object.freeze({
  identity: runtimeExecutiveStageModelIdentity,
  version: runtimeExecutiveStageModelVersion,
  namespace: runtimeExecutiveStageModelNamespace,
  layer: runtimeExecutiveStageModelLayer,
  domain: runtimeExecutiveStageModelDomain,
  phase: runtimeExecutiveStageModelPhase,
  architecturalRole: runtimeExecutiveStageModelArchitecturalRole,
  consumerRole: runtimeExecutiveStageModelConsumerRole,
  dependencyIdentity: runtimeExecutiveStageModelDependencyIdentity,
  dependencyPath: runtimeExecutiveStageModelDependencyPath,
  upstreamVersion: runtimeExecutiveStageExperienceContractsVersion,
  stabilityStatus: runtimeExecutiveStageModelStability,
  deterministicStatus: runtimeExecutiveStageModelDeterministic,
  sideEffectPolicy: runtimeExecutiveStageModelSideEffectPolicy,
  mutationPolicy: runtimeExecutiveStageModelMutationPolicy,
});

export const RUNTIME_EXECUTIVE_STAGE_MODEL_PRINCIPLE =
  "The Stage Model is the complete canonical semantic representation of the Executive Stage at a logical moment. It describes state; it does not decide, resolve, orchestrate, or render." as const;

export const RUNTIME_EXECUTIVE_STAGE_MODEL_BOUNDARY = Object.freeze({
  rexAuthority: "Runtime-enabled-Executive-Experience" as const,
  modelAuthority: "REX-2:3" as const,
  architecturalRole: "RuntimeExecutiveStageModelBoundary" as const,
  consumerRole: "InternalRuntimeModel" as const,
  soleImmediateDependency:
    "REX-2:2/RuntimeExecutiveStageExperienceContracts" as const,
  consumesContractsOnly: true as const,
  importsRex21Directly: false as const,
  importsRex1Directly: false as const,
  importsExDriDirectly: false as const,
  importsDriDirectly: false as const,
  importsNolDirectly: false as const,
  frameworkIndependent: true as const,
  rendererIndependent: true as const,
  mutatesStageState: false as const,
  resolvesFocus: false as const,
  resolvesPresentation: false as const,
  calculatesAttention: false as const,
  executesSceneTransitions: false as const,
  introducesOrchestration: false as const,
});

// ─── Reused vocabularies (exact REX-2:2 references) ─────────────────────────

export const RUNTIME_EXECUTIVE_STAGE_MODEL_PRESENTATION_STATES =
  RUNTIME_EXECUTIVE_STAGE_CONTRACT_PRESENTATION_STATES;
export const RUNTIME_EXECUTIVE_STAGE_MODEL_VISIBILITY_STATES =
  RUNTIME_EXECUTIVE_STAGE_CONTRACT_VISIBILITY_STATES;
export const RUNTIME_EXECUTIVE_STAGE_MODEL_SELECTION_STATES =
  RUNTIME_EXECUTIVE_STAGE_CONTRACT_SELECTION_STATES;
export const RUNTIME_EXECUTIVE_STAGE_MODEL_FOCUS_ROLES =
  RUNTIME_EXECUTIVE_STAGE_CONTRACT_FOCUS_ROLES;
export const RUNTIME_EXECUTIVE_STAGE_MODEL_ATTENTION_LEVELS =
  RUNTIME_EXECUTIVE_STAGE_CONTRACT_ATTENTION_LEVELS;
export const RUNTIME_EXECUTIVE_STAGE_MODEL_CONNECTION_KINDS =
  RUNTIME_EXECUTIVE_STAGE_CONTRACT_CONNECTION_KINDS;
export const RUNTIME_EXECUTIVE_STAGE_MODEL_SCENE_STATES =
  RUNTIME_EXECUTIVE_STAGE_CONTRACT_SCENE_STATES;
export const RUNTIME_EXECUTIVE_STAGE_MODEL_SUBJECT_KINDS =
  RUNTIME_EXECUTIVE_STAGE_CONTRACT_SUBJECT_KINDS;

// ─── Model domains / capabilities ───────────────────────────────────────────

export const RUNTIME_EXECUTIVE_STAGE_MODEL_DOMAINS = Object.freeze([
  "StageModel",
  "SubjectModel",
  "SceneModel",
  "SelectionModel",
  "FocusModel",
  "PresentationModel",
  "VisibilityModel",
  "AttentionModel",
  "ConnectionModel",
  "RelationshipGraph",
  "Neighborhood",
  "SnapshotProjection",
  "StructuralConsistency",
  "ModelComparison",
] as const);

export type RuntimeExecutiveStageModelDomain =
  (typeof RUNTIME_EXECUTIVE_STAGE_MODEL_DOMAINS)[number];

export const RUNTIME_EXECUTIVE_STAGE_MODEL_CAPABILITIES = Object.freeze([
  "stage-model",
  "subject-model",
  "scene-model",
  "selection-state",
  "focus-state",
  "presentation-state",
  "visibility-state",
  "attention-state",
  "semantic-connections",
  "relationship-graph",
  "neighborhood-inspection",
  "snapshot-projection",
  "structural-consistency",
  "structural-comparison",
] as const);

export type RuntimeExecutiveStageModelCapability =
  (typeof RUNTIME_EXECUTIVE_STAGE_MODEL_CAPABILITIES)[number];

export const RUNTIME_EXECUTIVE_STAGE_MODEL_CONSISTENCY_CHECKS = Object.freeze([
  "unique-subject-ids",
  "unique-connection-ids",
  "valid-connection-endpoints",
  "selected-subject-exists",
  "primary-focus-exists",
  "at-most-one-selected",
  "at-most-one-primary-focus",
  "subject-state-vocabulary",
  "deterministic-collections",
  "scene-model-identity-alignment",
  "revision-alignment",
] as const);

export type RuntimeExecutiveStageModelConsistencyCheck =
  (typeof RUNTIME_EXECUTIVE_STAGE_MODEL_CONSISTENCY_CHECKS)[number];

// ─── Public model types ─────────────────────────────────────────────────────

export interface RuntimeExecutiveStageModelIdentity {
  readonly modelId: string;
  readonly sceneId: string;
  readonly revision: string;
  readonly logicalVersion?: string;
}

export interface RuntimeExecutiveStageSubjectModel {
  readonly subjectId: string;
  readonly kind: RuntimeExecutiveStageSubjectKind;
  readonly presentationState: RuntimeExecutiveStagePresentationState;
  readonly visibility: RuntimeExecutiveStageVisibility;
  readonly selection: RuntimeExecutiveStageSelectionState;
  readonly focusRole: RuntimeExecutiveStageFocusRole;
  readonly attention: RuntimeExecutiveStageAttentionLevel;
  readonly parentId?: string;
  readonly label?: string;
  readonly lifecycleState?: string;
  readonly sourceVersion?: string;
  readonly orderIndex: number;
  readonly subject: RuntimeExecutiveStageSubject;
}

export interface RuntimeExecutiveStageSelectionModel {
  readonly selectedSubjectId?: string;
  readonly selection: RuntimeExecutiveStageSelectionState;
  readonly sceneId: string;
  readonly revision: string;
  readonly source?: RuntimeExecutiveStageContractSource;
  readonly reason?: RuntimeExecutiveStageContractReason;
}

export interface RuntimeExecutiveStageFocusModel {
  readonly primaryFocusSubjectId?: string;
  readonly secondaryFocusSubjectIds: ReadonlyArray<string>;
  readonly contextualFocusSubjectIds: ReadonlyArray<string>;
  readonly backgroundFocusSubjectIds: ReadonlyArray<string>;
  readonly unfocusedSubjectIds: ReadonlyArray<string>;
  readonly orderedFocusedSubjectIds: ReadonlyArray<string>;
  readonly sceneId: string;
  readonly revision: string;
  readonly source?: RuntimeExecutiveStageContractSource;
  readonly reason?: RuntimeExecutiveStageContractReason;
}

export interface RuntimeExecutiveStagePresentationModel {
  readonly bySubjectId: Readonly<
    Record<string, RuntimeExecutiveStagePresentationState>
  >;
  readonly orderedSubjectIds: ReadonlyArray<string>;
  readonly sceneId: string;
  readonly revision: string;
}

export interface RuntimeExecutiveStageVisibilityModel {
  readonly bySubjectId: Readonly<Record<string, RuntimeExecutiveStageVisibility>>;
  readonly orderedSubjectIds: ReadonlyArray<string>;
  readonly sceneId: string;
  readonly revision: string;
}

export interface RuntimeExecutiveStageAttentionModel {
  readonly bySubjectId: Readonly<
    Record<string, RuntimeExecutiveStageAttentionLevel>
  >;
  readonly orderedSubjectIds: ReadonlyArray<string>;
  readonly sceneId: string;
  readonly revision: string;
}

export interface RuntimeExecutiveStageConnectionModel {
  readonly connectionId: string;
  readonly sourceSubjectId: string;
  readonly targetSubjectId: string;
  readonly kind: RuntimeExecutiveStageConnectionKind;
  readonly direction: RuntimeExecutiveStageConnectionDirection;
  readonly state: RuntimeExecutiveStageConnectionState;
  readonly attention?: RuntimeExecutiveStageAttentionLevel;
  readonly label?: string;
  readonly orderIndex: number;
  readonly connection: RuntimeExecutiveStageConnection;
}

export interface RuntimeExecutiveStageRelationshipGraph {
  readonly nodes: ReadonlyArray<RuntimeExecutiveStageSubjectModel>;
  readonly edges: ReadonlyArray<RuntimeExecutiveStageConnectionModel>;
  readonly adjacency: Readonly<Record<string, ReadonlyArray<string>>>;
  readonly inbound: Readonly<Record<string, ReadonlyArray<string>>>;
  readonly outbound: Readonly<Record<string, ReadonlyArray<string>>>;
}

export interface RuntimeExecutiveStageNeighborhood {
  readonly centerSubjectId: string;
  readonly center?: RuntimeExecutiveStageSubjectModel;
  readonly connectedSubjectIds: ReadonlyArray<string>;
  readonly inboundSubjectIds: ReadonlyArray<string>;
  readonly outboundSubjectIds: ReadonlyArray<string>;
  readonly connections: ReadonlyArray<RuntimeExecutiveStageConnectionModel>;
  readonly relationshipKinds: ReadonlyArray<RuntimeExecutiveStageConnectionKind>;
}

export interface RuntimeExecutiveStageSceneModel {
  readonly sceneId: string;
  readonly revision: string;
  readonly subjects: ReadonlyArray<RuntimeExecutiveStageSubjectModel>;
  readonly connections: ReadonlyArray<RuntimeExecutiveStageConnectionModel>;
  readonly selectedSubjectId?: string;
  readonly primaryFocusSubjectId?: string;
  readonly context: RuntimeExecutiveStageContext;
  readonly sceneState: RuntimeExecutiveStageSceneState;
  readonly presentationContext?: RuntimeExecutiveStagePresentationState;
  readonly scene: RuntimeExecutiveStageScene;
  readonly sceneContract: RuntimeExecutiveStageSceneContract;
}

export interface RuntimeExecutiveStageModel {
  readonly identity: RuntimeExecutiveStageModelIdentity;
  readonly revision: string;
  readonly scene: RuntimeExecutiveStageSceneModel;
  readonly subjects: ReadonlyArray<RuntimeExecutiveStageSubjectModel>;
  readonly connections: ReadonlyArray<RuntimeExecutiveStageConnectionModel>;
  readonly selection: RuntimeExecutiveStageSelectionModel;
  readonly focus: RuntimeExecutiveStageFocusModel;
  readonly presentation: RuntimeExecutiveStagePresentationModel;
  readonly visibility: RuntimeExecutiveStageVisibilityModel;
  readonly attention: RuntimeExecutiveStageAttentionModel;
  readonly context: RuntimeExecutiveStageContext;
  readonly lifecycleState: RuntimeExecutiveStageSceneState;
  readonly relationshipGraph: RuntimeExecutiveStageRelationshipGraph;
  readonly source?: RuntimeExecutiveStageContractSource;
  readonly reason?: RuntimeExecutiveStageContractReason;
  readonly modelIdentity: typeof runtimeExecutiveStageModelIdentity;
  readonly modelVersion: typeof runtimeExecutiveStageModelVersion;
}

export interface RuntimeExecutiveStageModelConsistencyIssue {
  readonly check: RuntimeExecutiveStageModelConsistencyCheck | string;
  readonly code: string;
  readonly message: string;
  readonly path?: string;
}

export interface RuntimeExecutiveStageModelConsistencyResult {
  readonly ok: boolean;
  readonly modelId: string;
  readonly revision: string;
  readonly checks: ReadonlyArray<RuntimeExecutiveStageModelConsistencyCheck>;
  readonly issues: ReadonlyArray<RuntimeExecutiveStageModelConsistencyIssue>;
}

export interface RuntimeExecutiveStageModelComparison {
  readonly identical: boolean;
  readonly subjectsDiffer: boolean;
  readonly connectionsDiffer: boolean;
  readonly selectionDiffers: boolean;
  readonly focusDiffers: boolean;
  readonly presentationDiffers: boolean;
  readonly visibilityDiffers: boolean;
  readonly attentionDiffers: boolean;
  readonly contextDiffers: boolean;
  readonly revisionDiffers: boolean;
  readonly leftRevision: string;
  readonly rightRevision: string;
}

// ─── Invariants ─────────────────────────────────────────────────────────────

export const RUNTIME_EXECUTIVE_STAGE_MODEL_INVARIANTS = Object.freeze([
  Object.freeze({
    id: "depends-only-on-rex-2-2",
    order: 1,
    statement: "REX-2:3 depends only on REX-2:2.",
  }),
  Object.freeze({
    id: "no-direct-rex-2-1",
    order: 2,
    statement: "REX-2:3 does not directly import REX-2:1.",
  }),
  Object.freeze({
    id: "no-direct-rex-1",
    order: 3,
    statement: "REX-2:3 does not directly import REX-1.",
  }),
  Object.freeze({
    id: "no-direct-dri",
    order: 4,
    statement: "REX-2:3 does not directly import DRI.",
  }),
  Object.freeze({
    id: "no-direct-nol",
    order: 5,
    statement: "REX-2:3 does not directly import NOL.",
  }),
  Object.freeze({
    id: "no-direct-ex-dri",
    order: 6,
    statement: "REX-2:3 does not directly import EX-DRI.",
  }),
  Object.freeze({
    id: "explicit-model-identity",
    order: 7,
    statement: "Model identity is explicit.",
  }),
  Object.freeze({
    id: "explicit-model-revision",
    order: 8,
    statement: "Model revision is explicit.",
  }),
  Object.freeze({
    id: "explicit-scene-identity",
    order: 9,
    statement: "Scene identity is explicit.",
  }),
  Object.freeze({
    id: "unique-subject-identifiers",
    order: 10,
    statement: "Subject identifiers are unique.",
  }),
  Object.freeze({
    id: "unique-connection-identifiers",
    order: 11,
    statement: "Connection identifiers are unique.",
  }),
  Object.freeze({
    id: "connection-endpoints-exist",
    order: 12,
    statement: "Connection endpoints exist.",
  }),
  Object.freeze({
    id: "deterministic-subject-order",
    order: 13,
    statement: "Subject order is deterministic.",
  }),
  Object.freeze({
    id: "deterministic-connection-order",
    order: 14,
    statement: "Connection order is deterministic.",
  }),
  Object.freeze({
    id: "at-most-one-selected",
    order: 15,
    statement: "At most one subject is selected.",
  }),
  Object.freeze({
    id: "at-most-one-primary-focus",
    order: 16,
    statement: "At most one primary focus exists.",
  }),
  Object.freeze({
    id: "selection-focus-independent",
    order: 17,
    statement: "Selection and focus are independent.",
  }),
  Object.freeze({
    id: "presentation-visibility-independent",
    order: 18,
    statement: "Presentation and visibility are independent.",
  }),
  Object.freeze({
    id: "attention-style-independent",
    order: 19,
    statement: "Attention and renderer styling are independent.",
  }),
  Object.freeze({
    id: "connection-geometry-independent",
    order: 20,
    statement: "Connections and renderer geometry are independent.",
  }),
  Object.freeze({
    id: "canonical-subject-vocabulary",
    order: 21,
    statement: "Subject state uses canonical upstream vocabulary.",
  }),
  Object.freeze({
    id: "deterministic-construction",
    order: 22,
    statement: "Model construction is deterministic.",
  }),
  Object.freeze({
    id: "side-effect-free-construction",
    order: 23,
    statement: "Model construction is side-effect free.",
  }),
  Object.freeze({
    id: "caller-input-immutable",
    order: 24,
    statement: "Caller input is never mutated.",
  }),
  Object.freeze({
    id: "side-effect-free-projections",
    order: 25,
    statement: "Model projections are side-effect free.",
  }),
  Object.freeze({
    id: "snapshot-preserves-semantics",
    order: 26,
    statement: "Snapshot projection preserves semantic state.",
  }),
  Object.freeze({
    id: "neighborhood-non-mutating",
    order: 27,
    statement: "Neighborhood inspection does not mutate graph state.",
  }),
  Object.freeze({
    id: "semantic-graph-no-renderer-nodes",
    order: 28,
    statement: "Semantic graph contains no renderer nodes.",
  }),
  Object.freeze({
    id: "no-react-types",
    order: 29,
    statement: "Model contains no React types.",
  }),
  Object.freeze({
    id: "no-threejs-types",
    order: 30,
    statement: "Model contains no Three.js types.",
  }),
  Object.freeze({
    id: "no-browser-dom-types",
    order: 31,
    statement: "Model contains no browser/DOM types.",
  }),
  Object.freeze({
    id: "no-animation-state",
    order: 32,
    statement: "Model contains no animation state.",
  }),
  Object.freeze({
    id: "no-layout-coordinates",
    order: 33,
    statement: "Model contains no layout coordinates.",
  }),
  Object.freeze({
    id: "no-orchestration",
    order: 34,
    statement: "Model performs no orchestration.",
  }),
  Object.freeze({
    id: "no-automatic-focus-resolution",
    order: 35,
    statement: "Model performs no automatic focus resolution.",
  }),
  Object.freeze({
    id: "no-automatic-presentation-resolution",
    order: 36,
    statement: "Model performs no automatic presentation resolution.",
  }),
  Object.freeze({
    id: "no-automatic-attention-calculation",
    order: 37,
    statement: "Model performs no automatic attention calculation.",
  }),
  Object.freeze({
    id: "no-scene-transition-execution",
    order: 38,
    statement: "Model performs no scene-transition execution.",
  }),
] as const);

export type RuntimeExecutiveStageModelInvariant =
  (typeof RUNTIME_EXECUTIVE_STAGE_MODEL_INVARIANTS)[number];

export const RUNTIME_EXECUTIVE_STAGE_MODEL_FORBIDDEN_RESPONSIBILITIES =
  Object.freeze([
    "orchestration",
    "focus-resolution",
    "presentation-resolution",
    "attention-calculation",
    "scene-transition-execution",
    "rendering",
    "animation",
    "layout",
    "interaction-handling",
    "director-decision-logic",
    "adapters",
  ] as const);

export const RUNTIME_EXECUTIVE_STAGE_MODEL_PUBLIC_TYPE_NAMES = Object.freeze([
  "RuntimeExecutiveStageModel",
  "RuntimeExecutiveStageModelIdentity",
  "RuntimeExecutiveStageSubjectModel",
  "RuntimeExecutiveStageSceneModel",
  "RuntimeExecutiveStageSelectionModel",
  "RuntimeExecutiveStageFocusModel",
  "RuntimeExecutiveStagePresentationModel",
  "RuntimeExecutiveStageVisibilityModel",
  "RuntimeExecutiveStageAttentionModel",
  "RuntimeExecutiveStageConnectionModel",
  "RuntimeExecutiveStageRelationshipGraph",
  "RuntimeExecutiveStageNeighborhood",
  "RuntimeExecutiveStageModelConsistencyResult",
  "RuntimeExecutiveStageModelComparison",
] as const);

export const RUNTIME_EXECUTIVE_STAGE_MODEL_REGISTRY_SECTIONS = Object.freeze([
  "Identity",
  "Dependency",
  "ModelDomains",
  "Capabilities",
  "PublicTypes",
  "APIs",
  "Invariants",
  "Vocabularies",
  "Consistency",
] as const);

// ─── Helpers ────────────────────────────────────────────────────────────────

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.length > 0;
}

function unique(values: readonly string[]): boolean {
  return new Set(values).size === values.length;
}

function freezeSubject(
  subject: RuntimeExecutiveStageSubject,
  orderIndex: number,
): RuntimeExecutiveStageSubjectModel {
  return Object.freeze({
    subjectId: subject.subjectId,
    kind: subject.kind,
    presentationState: subject.presentationState,
    visibility: subject.visibility,
    selection: subject.selection,
    focusRole: subject.focusRole,
    attention: subject.attention,
    orderIndex,
    subject,
    ...(subject.parentId !== undefined ? { parentId: subject.parentId } : {}),
    ...(subject.label !== undefined ? { label: subject.label } : {}),
    ...(subject.lifecycleState !== undefined
      ? { lifecycleState: subject.lifecycleState }
      : {}),
    ...(subject.sourceVersion !== undefined
      ? { sourceVersion: subject.sourceVersion }
      : {}),
  });
}

function freezeConnection(
  connection: RuntimeExecutiveStageConnection,
  orderIndex: number,
): RuntimeExecutiveStageConnectionModel {
  return Object.freeze({
    connectionId: connection.connectionId,
    sourceSubjectId: connection.sourceSubjectId,
    targetSubjectId: connection.targetSubjectId,
    kind: connection.kind,
    direction: connection.direction,
    state: connection.state,
    orderIndex,
    connection,
    ...(connection.attention !== undefined
      ? { attention: connection.attention }
      : {}),
    ...(connection.label !== undefined ? { label: connection.label } : {}),
  });
}

function buildRelationshipGraph(
  subjects: ReadonlyArray<RuntimeExecutiveStageSubjectModel>,
  connections: ReadonlyArray<RuntimeExecutiveStageConnectionModel>,
): RuntimeExecutiveStageRelationshipGraph {
  const adjacency: Record<string, string[]> = {};
  const inbound: Record<string, string[]> = {};
  const outbound: Record<string, string[]> = {};

  for (const subject of subjects) {
    adjacency[subject.subjectId] = [];
    inbound[subject.subjectId] = [];
    outbound[subject.subjectId] = [];
  }

  for (const connection of connections) {
    const source = connection.sourceSubjectId;
    const target = connection.targetSubjectId;
    if (!adjacency[source]!.includes(target)) {
      adjacency[source]!.push(target);
    }
    if (!adjacency[target]!.includes(source)) {
      adjacency[target]!.push(source);
    }
    if (!outbound[source]!.includes(target)) {
      outbound[source]!.push(target);
    }
    if (!inbound[target]!.includes(source)) {
      inbound[target]!.push(source);
    }
    if (connection.direction === "bidirectional") {
      if (!outbound[target]!.includes(source)) {
        outbound[target]!.push(source);
      }
      if (!inbound[source]!.includes(target)) {
        inbound[source]!.push(target);
      }
    }
  }

  const freezeMap = (
    map: Record<string, string[]>,
  ): Readonly<Record<string, ReadonlyArray<string>>> => {
    const out: Record<string, ReadonlyArray<string>> = {};
    for (const key of Object.keys(map)) {
      out[key] = Object.freeze([...map[key]!]);
    }
    return Object.freeze(out);
  };

  return Object.freeze({
    nodes: subjects,
    edges: connections,
    adjacency: freezeMap(adjacency),
    inbound: freezeMap(inbound),
    outbound: freezeMap(outbound),
  });
}

function buildFocusModel(
  subjects: ReadonlyArray<RuntimeExecutiveStageSubjectModel>,
  sceneId: string,
  revision: string,
  primaryFocusSubjectId: string | undefined,
  source?: RuntimeExecutiveStageContractSource,
  reason?: RuntimeExecutiveStageContractReason,
): RuntimeExecutiveStageFocusModel {
  const secondary: string[] = [];
  const contextual: string[] = [];
  const background: string[] = [];
  const unfocused: string[] = [];
  const orderedFocused: string[] = [];

  for (const subject of subjects) {
    switch (subject.focusRole) {
      case "primary":
        orderedFocused.push(subject.subjectId);
        break;
      case "secondary":
        secondary.push(subject.subjectId);
        orderedFocused.push(subject.subjectId);
        break;
      case "contextual":
        contextual.push(subject.subjectId);
        orderedFocused.push(subject.subjectId);
        break;
      case "background":
        background.push(subject.subjectId);
        orderedFocused.push(subject.subjectId);
        break;
      case "unfocused":
        unfocused.push(subject.subjectId);
        break;
    }
  }

  return Object.freeze({
    ...(primaryFocusSubjectId !== undefined
      ? { primaryFocusSubjectId }
      : {}),
    secondaryFocusSubjectIds: Object.freeze(secondary),
    contextualFocusSubjectIds: Object.freeze(contextual),
    backgroundFocusSubjectIds: Object.freeze(background),
    unfocusedSubjectIds: Object.freeze(unfocused),
    orderedFocusedSubjectIds: Object.freeze(orderedFocused),
    sceneId,
    revision,
    ...(source !== undefined ? { source } : {}),
    ...(reason !== undefined ? { reason } : {}),
  });
}

function buildDimensionMaps(
  subjects: ReadonlyArray<RuntimeExecutiveStageSubjectModel>,
  sceneId: string,
  revision: string,
): {
  presentation: RuntimeExecutiveStagePresentationModel;
  visibility: RuntimeExecutiveStageVisibilityModel;
  attention: RuntimeExecutiveStageAttentionModel;
} {
  const presentationById: Record<string, RuntimeExecutiveStagePresentationState> =
    {};
  const visibilityById: Record<string, RuntimeExecutiveStageVisibility> = {};
  const attentionById: Record<string, RuntimeExecutiveStageAttentionLevel> = {};
  const orderedSubjectIds = subjects.map((subject) => subject.subjectId);

  for (const subject of subjects) {
    presentationById[subject.subjectId] = subject.presentationState;
    visibilityById[subject.subjectId] = subject.visibility;
    attentionById[subject.subjectId] = subject.attention;
  }

  return {
    presentation: Object.freeze({
      bySubjectId: Object.freeze({ ...presentationById }),
      orderedSubjectIds: Object.freeze([...orderedSubjectIds]),
      sceneId,
      revision,
    }),
    visibility: Object.freeze({
      bySubjectId: Object.freeze({ ...visibilityById }),
      orderedSubjectIds: Object.freeze([...orderedSubjectIds]),
      sceneId,
      revision,
    }),
    attention: Object.freeze({
      bySubjectId: Object.freeze({ ...attentionById }),
      orderedSubjectIds: Object.freeze([...orderedSubjectIds]),
      sceneId,
      revision,
    }),
  };
}

function structuralSerializeSubjects(
  subjects: ReadonlyArray<RuntimeExecutiveStageSubjectModel>,
): string {
  return JSON.stringify(
    subjects.map((subject) => ({
      subjectId: subject.subjectId,
      kind: subject.kind,
      presentationState: subject.presentationState,
      visibility: subject.visibility,
      selection: subject.selection,
      focusRole: subject.focusRole,
      attention: subject.attention,
      parentId: subject.parentId ?? null,
      label: subject.label ?? null,
      lifecycleState: subject.lifecycleState ?? null,
      sourceVersion: subject.sourceVersion ?? null,
    })),
  );
}

function structuralSerializeConnections(
  connections: ReadonlyArray<RuntimeExecutiveStageConnectionModel>,
): string {
  return JSON.stringify(
    connections.map((connection) => ({
      connectionId: connection.connectionId,
      sourceSubjectId: connection.sourceSubjectId,
      targetSubjectId: connection.targetSubjectId,
      kind: connection.kind,
      direction: connection.direction,
      state: connection.state,
      attention: connection.attention ?? null,
      label: connection.label ?? null,
    })),
  );
}

function structuralSerializeContext(
  context: RuntimeExecutiveStageContext,
): string {
  return JSON.stringify({
    contextId: context.contextId,
    experienceId: context.experienceId ?? null,
    activeSubjectId: context.activeSubjectId ?? null,
    goalId: context.goalId ?? null,
    intentionId: context.intentionId ?? null,
    presentationState: context.presentationState ?? null,
    runtimeContextId: context.runtimeContextId ?? null,
    mode: context.mode ?? null,
    lens: context.lens ?? null,
  });
}

// ─── Construction ───────────────────────────────────────────────────────────

export interface CreateRuntimeExecutiveStageModelInput {
  readonly modelId: string;
  readonly sceneContract?: RuntimeExecutiveStageSceneContract;
  readonly scene?: RuntimeExecutiveStageScene;
  readonly source?: RuntimeExecutiveStageContractSource;
  readonly revision?: string;
  readonly logicalVersion?: string;
  readonly reason?: RuntimeExecutiveStageContractReason;
  readonly selectionContract?: RuntimeExecutiveStageSelectionContract;
  readonly focusContract?: RuntimeExecutiveStageFocusContract;
  readonly presentationContract?: RuntimeExecutiveStagePresentationContract;
  readonly visibilityContract?: RuntimeExecutiveStageVisibilityContract;
  readonly attentionContract?: RuntimeExecutiveStageAttentionContract;
}

export function createRuntimeExecutiveStageModel(
  input: CreateRuntimeExecutiveStageModelInput,
): RuntimeExecutiveStageModel {
  if (!isNonEmptyString(input.modelId)) {
    throw new TypeError("modelId must be a non-empty string");
  }

  const sceneContract =
    input.sceneContract ??
    (input.scene !== undefined && input.source !== undefined
      ? createRuntimeExecutiveStageSceneContract({
          scene: input.scene,
          source: input.source,
          ...(input.reason !== undefined ? { reason: input.reason } : {}),
        })
      : undefined);

  if (sceneContract === undefined) {
    throw new TypeError(
      "createRuntimeExecutiveStageModel requires sceneContract or scene+source",
    );
  }

  const scene = sceneContract.scene;
  const revision = input.revision ?? scene.revision;
  if (!isNonEmptyString(revision)) {
    throw new TypeError("revision must be explicit and non-empty");
  }

  const subjects = Object.freeze(
    scene.subjects.map((subject, index) => freezeSubject(subject, index)),
  );
  const connections = Object.freeze(
    scene.connections.map((connection, index) =>
      freezeConnection(connection, index),
    ),
  );

  const subjectIds = subjects.map((subject) => subject.subjectId);
  if (!unique(subjectIds)) {
    throw new TypeError("subject identifiers within a Stage Model must be unique");
  }
  const connectionIds = connections.map(
    (connection) => connection.connectionId,
  );
  if (!unique(connectionIds)) {
    throw new TypeError(
      "connection identifiers within a Stage Model must be unique",
    );
  }

  const idSet = new Set(subjectIds);
  for (const connection of connections) {
    if (
      !idSet.has(connection.sourceSubjectId) ||
      !idSet.has(connection.targetSubjectId)
    ) {
      throw new TypeError(
        `connection ${connection.connectionId} references unknown Stage subjects`,
      );
    }
  }

  const selectedSubjects = subjects.filter(
    (subject) => subject.selection === "selected",
  );
  if (selectedSubjects.length > 1) {
    throw new TypeError("at most one subject may be selected");
  }
  const primaryFocusSubjects = subjects.filter(
    (subject) => subject.focusRole === "primary",
  );
  if (primaryFocusSubjects.length > 1) {
    throw new TypeError("at most one primary focus subject may exist");
  }

  const selectedSubjectId =
    scene.selectedSubjectId ?? selectedSubjects[0]?.subjectId;
  if (
    selectedSubjectId !== undefined &&
    !idSet.has(selectedSubjectId)
  ) {
    throw new TypeError("selectedSubjectId must reference a model subject");
  }

  const primaryFocusSubjectId =
    scene.primaryFocusSubjectId ?? primaryFocusSubjects[0]?.subjectId;
  if (
    primaryFocusSubjectId !== undefined &&
    !idSet.has(primaryFocusSubjectId)
  ) {
    throw new TypeError("primaryFocusSubjectId must reference a model subject");
  }

  const source = input.source ?? sceneContract.source;
  const reason = input.reason ?? sceneContract.reason;

  const selection: RuntimeExecutiveStageSelectionModel = Object.freeze({
    ...(selectedSubjectId !== undefined ? { selectedSubjectId } : {}),
    selection:
      selectedSubjectId !== undefined
        ? ("selected" as const)
        : ("unselected" as const),
    sceneId: scene.sceneId,
    revision,
    ...(input.selectionContract?.source !== undefined
      ? { source: input.selectionContract.source }
      : source !== undefined
        ? { source }
        : {}),
    ...(input.selectionContract?.reason !== undefined
      ? { reason: input.selectionContract.reason }
      : reason !== undefined
        ? { reason }
        : {}),
  });

  const focus = buildFocusModel(
    subjects,
    scene.sceneId,
    revision,
    primaryFocusSubjectId,
    input.focusContract?.source ?? source,
    input.focusContract?.reason ?? reason,
  );

  const dimensions = buildDimensionMaps(subjects, scene.sceneId, revision);
  const relationshipGraph = buildRelationshipGraph(subjects, connections);

  const sceneModel: RuntimeExecutiveStageSceneModel = Object.freeze({
    sceneId: scene.sceneId,
    revision: scene.revision,
    subjects,
    connections,
    ...(selectedSubjectId !== undefined ? { selectedSubjectId } : {}),
    ...(primaryFocusSubjectId !== undefined
      ? { primaryFocusSubjectId }
      : {}),
    context: scene.context,
    sceneState: scene.sceneState,
    ...(scene.presentationContext !== undefined
      ? { presentationContext: scene.presentationContext }
      : {}),
    scene,
    sceneContract,
  });

  const identity: RuntimeExecutiveStageModelIdentity = Object.freeze({
    modelId: input.modelId,
    sceneId: scene.sceneId,
    revision,
    ...(input.logicalVersion !== undefined
      ? { logicalVersion: input.logicalVersion }
      : {}),
  });

  return Object.freeze({
    identity,
    revision,
    scene: sceneModel,
    subjects,
    connections,
    selection,
    focus,
    presentation: dimensions.presentation,
    visibility: dimensions.visibility,
    attention: dimensions.attention,
    context: scene.context,
    lifecycleState: scene.sceneState,
    relationshipGraph,
    ...(source !== undefined ? { source } : {}),
    ...(reason !== undefined ? { reason } : {}),
    modelIdentity: runtimeExecutiveStageModelIdentity,
    modelVersion: runtimeExecutiveStageModelVersion,
  });
}

// ─── Accessors / projections ────────────────────────────────────────────────

export function getRuntimeExecutiveStageSubjectById(
  model: RuntimeExecutiveStageModel,
  subjectId: string,
): RuntimeExecutiveStageSubjectModel | undefined {
  return model.subjects.find((subject) => subject.subjectId === subjectId);
}

export function getRuntimeExecutiveStageSubjectIndex(
  model: RuntimeExecutiveStageModel,
  subjectId: string,
): number {
  return model.subjects.findIndex((subject) => subject.subjectId === subjectId);
}

export function getRuntimeExecutiveStageSubjectsByKind(
  model: RuntimeExecutiveStageModel,
  kind: RuntimeExecutiveStageSubjectKind,
): ReadonlyArray<RuntimeExecutiveStageSubjectModel> {
  return Object.freeze(
    model.subjects.filter((subject) => subject.kind === kind),
  );
}

export function getRuntimeExecutiveStageVisibleSubjects(
  model: RuntimeExecutiveStageModel,
): ReadonlyArray<RuntimeExecutiveStageSubjectModel> {
  return Object.freeze(
    model.subjects.filter((subject) => subject.visibility === "visible"),
  );
}

export function getRuntimeExecutiveStageSelectedSubject(
  model: RuntimeExecutiveStageModel,
): RuntimeExecutiveStageSubjectModel | undefined {
  if (model.selection.selectedSubjectId !== undefined) {
    return getRuntimeExecutiveStageSubjectById(
      model,
      model.selection.selectedSubjectId,
    );
  }
  return model.subjects.find((subject) => subject.selection === "selected");
}

export function getRuntimeExecutiveStagePrimaryFocus(
  model: RuntimeExecutiveStageModel,
): RuntimeExecutiveStageSubjectModel | undefined {
  if (model.focus.primaryFocusSubjectId !== undefined) {
    return getRuntimeExecutiveStageSubjectById(
      model,
      model.focus.primaryFocusSubjectId,
    );
  }
  return model.subjects.find((subject) => subject.focusRole === "primary");
}

export function getRuntimeExecutiveStageFocusedSubjects(
  model: RuntimeExecutiveStageModel,
): ReadonlyArray<RuntimeExecutiveStageSubjectModel> {
  return Object.freeze(
    model.focus.orderedFocusedSubjectIds
      .map((subjectId) => getRuntimeExecutiveStageSubjectById(model, subjectId))
      .filter(
        (subject): subject is RuntimeExecutiveStageSubjectModel =>
          subject !== undefined,
      ),
  );
}

export function getRuntimeExecutiveStageSubjectsByAttention(
  model: RuntimeExecutiveStageModel,
  level: RuntimeExecutiveStageAttentionLevel,
): ReadonlyArray<RuntimeExecutiveStageSubjectModel> {
  return Object.freeze(
    model.subjects.filter((subject) => subject.attention === level),
  );
}

export function getRuntimeExecutiveStageSubjectsByPresentationState(
  model: RuntimeExecutiveStageModel,
  state: RuntimeExecutiveStagePresentationState,
): ReadonlyArray<RuntimeExecutiveStageSubjectModel> {
  return Object.freeze(
    model.subjects.filter((subject) => subject.presentationState === state),
  );
}

export function getRuntimeExecutiveStageSubjectsByVisibility(
  model: RuntimeExecutiveStageModel,
  visibility: RuntimeExecutiveStageVisibility,
): ReadonlyArray<RuntimeExecutiveStageSubjectModel> {
  return Object.freeze(
    model.subjects.filter((subject) => subject.visibility === visibility),
  );
}

export function getRuntimeExecutiveStageConnectionById(
  model: RuntimeExecutiveStageModel,
  connectionId: string,
): RuntimeExecutiveStageConnectionModel | undefined {
  return model.connections.find(
    (connection) => connection.connectionId === connectionId,
  );
}

export function getRuntimeExecutiveStageOutgoingConnections(
  model: RuntimeExecutiveStageModel,
  subjectId: string,
): ReadonlyArray<RuntimeExecutiveStageConnectionModel> {
  return Object.freeze(
    model.connections.filter(
      (connection) => connection.sourceSubjectId === subjectId,
    ),
  );
}

export function getRuntimeExecutiveStageIncomingConnections(
  model: RuntimeExecutiveStageModel,
  subjectId: string,
): ReadonlyArray<RuntimeExecutiveStageConnectionModel> {
  return Object.freeze(
    model.connections.filter(
      (connection) => connection.targetSubjectId === subjectId,
    ),
  );
}

export function getRuntimeExecutiveStageConnectionsForSubject(
  model: RuntimeExecutiveStageModel,
  subjectId: string,
): ReadonlyArray<RuntimeExecutiveStageConnectionModel> {
  return Object.freeze(
    model.connections.filter(
      (connection) =>
        connection.sourceSubjectId === subjectId ||
        connection.targetSubjectId === subjectId,
    ),
  );
}

export function getRuntimeExecutiveStageConnectionsByKind(
  model: RuntimeExecutiveStageModel,
  kind: RuntimeExecutiveStageConnectionKind,
): ReadonlyArray<RuntimeExecutiveStageConnectionModel> {
  return Object.freeze(
    model.connections.filter((connection) => connection.kind === kind),
  );
}

export function getRuntimeExecutiveStageRelatedSubjects(
  model: RuntimeExecutiveStageModel,
  subjectId: string,
): ReadonlyArray<RuntimeExecutiveStageSubjectModel> {
  const relatedIds = model.relationshipGraph.adjacency[subjectId] ?? [];
  return Object.freeze(
    relatedIds
      .map((id) => getRuntimeExecutiveStageSubjectById(model, id))
      .filter(
        (subject): subject is RuntimeExecutiveStageSubjectModel =>
          subject !== undefined,
      ),
  );
}

export function areRuntimeExecutiveStageSubjectsConnected(
  model: RuntimeExecutiveStageModel,
  subjectIdA: string,
  subjectIdB: string,
): boolean {
  return (model.relationshipGraph.adjacency[subjectIdA] ?? []).includes(
    subjectIdB,
  );
}

export function getRuntimeExecutiveStageRelationshipGraph(
  model: RuntimeExecutiveStageModel,
): RuntimeExecutiveStageRelationshipGraph {
  return model.relationshipGraph;
}

export function getRuntimeExecutiveStageNeighborhood(
  model: RuntimeExecutiveStageModel,
  subjectId: string,
): RuntimeExecutiveStageNeighborhood {
  const center = getRuntimeExecutiveStageSubjectById(model, subjectId);
  const connections = getRuntimeExecutiveStageConnectionsForSubject(
    model,
    subjectId,
  );
  const inboundSubjectIds = Object.freeze([
    ...(model.relationshipGraph.inbound[subjectId] ?? []),
  ]);
  const outboundSubjectIds = Object.freeze([
    ...(model.relationshipGraph.outbound[subjectId] ?? []),
  ]);
  const connectedSubjectIds = Object.freeze([
    ...(model.relationshipGraph.adjacency[subjectId] ?? []),
  ]);
  const kinds = Object.freeze(
    [...new Set(connections.map((connection) => connection.kind))],
  );

  return Object.freeze({
    centerSubjectId: subjectId,
    ...(center !== undefined ? { center } : {}),
    connectedSubjectIds,
    inboundSubjectIds,
    outboundSubjectIds,
    connections,
    relationshipKinds: kinds,
  });
}

export function projectRuntimeExecutiveStageModelToSnapshot(
  model: RuntimeExecutiveStageModel,
  input: {
    readonly snapshotId: string;
    readonly source?: RuntimeExecutiveStageContractSource;
    readonly reason?: RuntimeExecutiveStageContractReason;
    readonly requestId?: string;
  },
): RuntimeExecutiveStageSnapshotContract {
  if (!isNonEmptyString(input.snapshotId)) {
    throw new TypeError("snapshotId must be a non-empty string");
  }

  const scene = model.scene.scene;
  const snapshot: RuntimeExecutiveStageSnapshot = Object.freeze({
    snapshotId: input.snapshotId,
    scene,
    observedRevision: scene.revision,
    subjectCount: scene.subjects.length,
    connectionCount: scene.connections.length,
    foundationIdentity: scene.foundationIdentity,
    foundationVersion: scene.foundationVersion,
    ...(scene.selectedSubjectId !== undefined
      ? { selectedSubjectId: scene.selectedSubjectId }
      : {}),
    ...(scene.primaryFocusSubjectId !== undefined
      ? { primaryFocusSubjectId: scene.primaryFocusSubjectId }
      : {}),
  });

  return createRuntimeExecutiveStageSnapshotContract({
    snapshot,
    source: input.source ?? model.source ?? "runtime",
    ...(input.reason !== undefined
      ? { reason: input.reason }
      : model.reason !== undefined
        ? { reason: model.reason }
        : {}),
    ...(input.requestId !== undefined ? { requestId: input.requestId } : {}),
  });
}

export function compareRuntimeExecutiveStageModels(
  left: RuntimeExecutiveStageModel,
  right: RuntimeExecutiveStageModel,
): RuntimeExecutiveStageModelComparison {
  const subjectsDiffer =
    structuralSerializeSubjects(left.subjects) !==
    structuralSerializeSubjects(right.subjects);
  const connectionsDiffer =
    structuralSerializeConnections(left.connections) !==
    structuralSerializeConnections(right.connections);
  const selectionDiffers =
    (left.selection.selectedSubjectId ?? null) !==
    (right.selection.selectedSubjectId ?? null);
  const focusDiffers =
    (left.focus.primaryFocusSubjectId ?? null) !==
      (right.focus.primaryFocusSubjectId ?? null) ||
    JSON.stringify(left.focus.orderedFocusedSubjectIds) !==
      JSON.stringify(right.focus.orderedFocusedSubjectIds);
  const presentationDiffers =
    JSON.stringify(left.presentation.bySubjectId) !==
    JSON.stringify(right.presentation.bySubjectId);
  const visibilityDiffers =
    JSON.stringify(left.visibility.bySubjectId) !==
    JSON.stringify(right.visibility.bySubjectId);
  const attentionDiffers =
    JSON.stringify(left.attention.bySubjectId) !==
    JSON.stringify(right.attention.bySubjectId);
  const contextDiffers =
    structuralSerializeContext(left.context) !==
    structuralSerializeContext(right.context);
  const revisionDiffers = left.revision !== right.revision;

  const identical =
    !subjectsDiffer &&
    !connectionsDiffer &&
    !selectionDiffers &&
    !focusDiffers &&
    !presentationDiffers &&
    !visibilityDiffers &&
    !attentionDiffers &&
    !contextDiffers &&
    !revisionDiffers;

  return Object.freeze({
    identical,
    subjectsDiffer,
    connectionsDiffer,
    selectionDiffers,
    focusDiffers,
    presentationDiffers,
    visibilityDiffers,
    attentionDiffers,
    contextDiffers,
    revisionDiffers,
    leftRevision: left.revision,
    rightRevision: right.revision,
  });
}

export function verifyRuntimeExecutiveStageModelConsistency(
  model: RuntimeExecutiveStageModel,
): RuntimeExecutiveStageModelConsistencyResult {
  const issues: RuntimeExecutiveStageModelConsistencyIssue[] = [];

  const subjectIds = model.subjects.map((subject) => subject.subjectId);
  if (!unique(subjectIds)) {
    issues.push({
      check: "unique-subject-ids",
      code: "duplicate-subject-id",
      message: "Subject identifiers must be unique",
    });
  }

  const connectionIds = model.connections.map(
    (connection) => connection.connectionId,
  );
  if (!unique(connectionIds)) {
    issues.push({
      check: "unique-connection-ids",
      code: "duplicate-connection-id",
      message: "Connection identifiers must be unique",
    });
  }

  const idSet = new Set(subjectIds);
  for (const connection of model.connections) {
    if (
      !idSet.has(connection.sourceSubjectId) ||
      !idSet.has(connection.targetSubjectId)
    ) {
      issues.push({
        check: "valid-connection-endpoints",
        code: "unknown-connection-endpoint",
        message: `Connection ${connection.connectionId} has invalid endpoints`,
        path: connection.connectionId,
      });
    }
  }

  if (
    model.selection.selectedSubjectId !== undefined &&
    !idSet.has(model.selection.selectedSubjectId)
  ) {
    issues.push({
      check: "selected-subject-exists",
      code: "missing-selected-subject",
      message: "selectedSubjectId does not exist in the model",
    });
  }

  if (
    model.focus.primaryFocusSubjectId !== undefined &&
    !idSet.has(model.focus.primaryFocusSubjectId)
  ) {
    issues.push({
      check: "primary-focus-exists",
      code: "missing-primary-focus",
      message: "primaryFocusSubjectId does not exist in the model",
    });
  }

  const selectedCount = model.subjects.filter(
    (subject) => subject.selection === "selected",
  ).length;
  if (selectedCount > 1) {
    issues.push({
      check: "at-most-one-selected",
      code: "multiple-selected-subjects",
      message: "At most one subject may be selected",
    });
  }

  const primaryCount = model.subjects.filter(
    (subject) => subject.focusRole === "primary",
  ).length;
  if (primaryCount > 1) {
    issues.push({
      check: "at-most-one-primary-focus",
      code: "multiple-primary-focus",
      message: "At most one primary focus may exist",
    });
  }

  for (const subject of model.subjects) {
    if (
      !(
        RUNTIME_EXECUTIVE_STAGE_MODEL_SUBJECT_KINDS as readonly string[]
      ).includes(subject.kind) ||
      !(
        RUNTIME_EXECUTIVE_STAGE_MODEL_PRESENTATION_STATES as readonly string[]
      ).includes(subject.presentationState) ||
      !(
        RUNTIME_EXECUTIVE_STAGE_MODEL_VISIBILITY_STATES as readonly string[]
      ).includes(subject.visibility) ||
      !(
        RUNTIME_EXECUTIVE_STAGE_MODEL_SELECTION_STATES as readonly string[]
      ).includes(subject.selection) ||
      !(
        RUNTIME_EXECUTIVE_STAGE_MODEL_FOCUS_ROLES as readonly string[]
      ).includes(subject.focusRole) ||
      !(
        RUNTIME_EXECUTIVE_STAGE_MODEL_ATTENTION_LEVELS as readonly string[]
      ).includes(subject.attention)
    ) {
      issues.push({
        check: "subject-state-vocabulary",
        code: "invalid-subject-vocabulary",
        message: `Subject ${subject.subjectId} uses non-canonical vocabulary`,
        path: subject.subjectId,
      });
    }
  }

  const orderOk = model.subjects.every(
    (subject, index) => subject.orderIndex === index,
  );
  const connectionOrderOk = model.connections.every(
    (connection, index) => connection.orderIndex === index,
  );
  if (!orderOk || !connectionOrderOk) {
    issues.push({
      check: "deterministic-collections",
      code: "non-deterministic-order",
      message: "Subject/connection order indexes must match canonical order",
    });
  }

  if (
    model.identity.sceneId !== model.scene.sceneId ||
    model.identity.sceneId !== model.scene.scene.sceneId
  ) {
    issues.push({
      check: "scene-model-identity-alignment",
      code: "scene-identity-mismatch",
      message: "Model identity sceneId must align with scene model",
    });
  }

  if (
    model.revision !== model.identity.revision ||
    (model.selection.revision !== model.revision &&
      model.focus.revision !== model.revision)
  ) {
    // revision alignment: identity.revision === model.revision; scene may keep own revision
    if (model.revision !== model.identity.revision) {
      issues.push({
        check: "revision-alignment",
        code: "model-revision-mismatch",
        message: "Model revision must align with identity.revision",
      });
    }
  }
  if (model.selection.revision !== model.revision) {
    issues.push({
      check: "revision-alignment",
      code: "selection-revision-mismatch",
      message: "Selection revision must align with model revision",
    });
  }
  if (model.focus.revision !== model.revision) {
    issues.push({
      check: "revision-alignment",
      code: "focus-revision-mismatch",
      message: "Focus revision must align with model revision",
    });
  }

  return Object.freeze({
    ok: issues.length === 0,
    modelId: model.identity.modelId,
    revision: model.revision,
    checks: RUNTIME_EXECUTIVE_STAGE_MODEL_CONSISTENCY_CHECKS,
    issues: Object.freeze(issues),
  });
}

export function getRuntimeExecutiveStageModelIdentity():
  typeof runtimeExecutiveStageModelCanonicalIdentity {
  return runtimeExecutiveStageModelCanonicalIdentity;
}

// ─── Registry / module ──────────────────────────────────────────────────────

export const runtimeExecutiveStageModelApiNames = Object.freeze([
  "createRuntimeExecutiveStageModel",
  "getRuntimeExecutiveStageSubjectById",
  "getRuntimeExecutiveStageSubjectIndex",
  "getRuntimeExecutiveStageSubjectsByKind",
  "getRuntimeExecutiveStageVisibleSubjects",
  "getRuntimeExecutiveStageSelectedSubject",
  "getRuntimeExecutiveStagePrimaryFocus",
  "getRuntimeExecutiveStageFocusedSubjects",
  "getRuntimeExecutiveStageSubjectsByAttention",
  "getRuntimeExecutiveStageSubjectsByPresentationState",
  "getRuntimeExecutiveStageSubjectsByVisibility",
  "getRuntimeExecutiveStageConnectionById",
  "getRuntimeExecutiveStageOutgoingConnections",
  "getRuntimeExecutiveStageIncomingConnections",
  "getRuntimeExecutiveStageConnectionsForSubject",
  "getRuntimeExecutiveStageConnectionsByKind",
  "getRuntimeExecutiveStageRelatedSubjects",
  "areRuntimeExecutiveStageSubjectsConnected",
  "getRuntimeExecutiveStageRelationshipGraph",
  "getRuntimeExecutiveStageNeighborhood",
  "projectRuntimeExecutiveStageModelToSnapshot",
  "compareRuntimeExecutiveStageModels",
  "verifyRuntimeExecutiveStageModelConsistency",
  "verifyRuntimeExecutiveStageModel",
  "getRuntimeExecutiveStageModelIdentity",
] as const);

export const RUNTIME_EXECUTIVE_STAGE_MODEL_REGISTRY = Object.freeze({
  identity: runtimeExecutiveStageModelIdentity,
  version: runtimeExecutiveStageModelVersion,
  namespace: runtimeExecutiveStageModelNamespace,
  layer: runtimeExecutiveStageModelLayer,
  domain: runtimeExecutiveStageModelDomain,
  phase: runtimeExecutiveStageModelPhase,
  consumerRole: runtimeExecutiveStageModelConsumerRole,
  immediateDependency: runtimeExecutiveStageModelDependencyIdentity,
  dependencyPath: runtimeExecutiveStageModelDependencyPath,
  sections: RUNTIME_EXECUTIVE_STAGE_MODEL_REGISTRY_SECTIONS,
  sectionCount: RUNTIME_EXECUTIVE_STAGE_MODEL_REGISTRY_SECTIONS.length,
  modelDomains: RUNTIME_EXECUTIVE_STAGE_MODEL_DOMAINS,
  modelDomainCount: RUNTIME_EXECUTIVE_STAGE_MODEL_DOMAINS.length,
  capabilities: RUNTIME_EXECUTIVE_STAGE_MODEL_CAPABILITIES,
  capabilityCount: RUNTIME_EXECUTIVE_STAGE_MODEL_CAPABILITIES.length,
  publicTypeNames: RUNTIME_EXECUTIVE_STAGE_MODEL_PUBLIC_TYPE_NAMES,
  publicTypeCount: RUNTIME_EXECUTIVE_STAGE_MODEL_PUBLIC_TYPE_NAMES.length,
  publicApis: runtimeExecutiveStageModelApiNames,
  publicApiCount: runtimeExecutiveStageModelApiNames.length,
  invariants: RUNTIME_EXECUTIVE_STAGE_MODEL_INVARIANTS,
  invariantCount: RUNTIME_EXECUTIVE_STAGE_MODEL_INVARIANTS.length,
  consistencyChecks: RUNTIME_EXECUTIVE_STAGE_MODEL_CONSISTENCY_CHECKS,
  consistencyCheckCount: RUNTIME_EXECUTIVE_STAGE_MODEL_CONSISTENCY_CHECKS.length,
  presentationStates: RUNTIME_EXECUTIVE_STAGE_MODEL_PRESENTATION_STATES,
  presentationStateCount: RUNTIME_EXECUTIVE_STAGE_MODEL_PRESENTATION_STATES.length,
  subjectKinds: RUNTIME_EXECUTIVE_STAGE_MODEL_SUBJECT_KINDS,
  subjectKindCount: RUNTIME_EXECUTIVE_STAGE_MODEL_SUBJECT_KINDS.length,
  connectionKinds: RUNTIME_EXECUTIVE_STAGE_MODEL_CONNECTION_KINDS,
  connectionKindCount: RUNTIME_EXECUTIVE_STAGE_MODEL_CONNECTION_KINDS.length,
  sceneStates: RUNTIME_EXECUTIVE_STAGE_MODEL_SCENE_STATES,
  sceneStateCount: RUNTIME_EXECUTIVE_STAGE_MODEL_SCENE_STATES.length,
});

export const runtimeExecutiveStageModel = Object.freeze({
  phase: "Model" as const,
  name: "RuntimeExecutiveStageModel" as const,
  identity: runtimeExecutiveStageModelIdentity,
  version: runtimeExecutiveStageModelVersion,
  namespace: runtimeExecutiveStageModelNamespace,
  layer: runtimeExecutiveStageModelLayer,
  domain: runtimeExecutiveStageModelDomain,
  architecturalRole: runtimeExecutiveStageModelArchitecturalRole,
  consumerRole: runtimeExecutiveStageModelConsumerRole,
  role: "Model" as const,
  status: runtimeExecutiveStageModelStability,
  upstreamDependency: runtimeExecutiveStageModelDependencyIdentity,
  dependencyPath: runtimeExecutiveStageModelDependencyPath,
  deterministic: runtimeExecutiveStageModelDeterministic,
  immutable: true as const,
  sideEffectFree: true as const,
  frameworkIndependent: true as const,
  rendererIndependent: true as const,
  browserIndependent: true as const,
  principle: RUNTIME_EXECUTIVE_STAGE_MODEL_PRINCIPLE,
  boundary: RUNTIME_EXECUTIVE_STAGE_MODEL_BOUNDARY,
  modelDomains: RUNTIME_EXECUTIVE_STAGE_MODEL_DOMAINS,
  capabilities: RUNTIME_EXECUTIVE_STAGE_MODEL_CAPABILITIES,
  invariants: RUNTIME_EXECUTIVE_STAGE_MODEL_INVARIANTS,
  forbiddenResponsibilities:
    RUNTIME_EXECUTIVE_STAGE_MODEL_FORBIDDEN_RESPONSIBILITIES,
  publicTypeNames: RUNTIME_EXECUTIVE_STAGE_MODEL_PUBLIC_TYPE_NAMES,
  publicApiSurface: runtimeExecutiveStageModelApiNames,
  registry: RUNTIME_EXECUTIVE_STAGE_MODEL_REGISTRY,
  contractsBoundary: "REX-2:2-contracts-only" as const,
  architecturalStatus:
    "REX-2:3 Runtime Executive Stage Model Complete — Ready for REX-2:4 Runtime Executive Stage Focus & Selection" as const,
});

export interface RuntimeExecutiveStageModelVerification {
  readonly ok: boolean;
  readonly identity: typeof runtimeExecutiveStageModelIdentity;
  readonly version: typeof runtimeExecutiveStageModelVersion;
  readonly namespace: typeof runtimeExecutiveStageModelNamespace;
  readonly dependencyIdentity: typeof runtimeExecutiveStageModelDependencyIdentity;
  readonly consumerRole: typeof runtimeExecutiveStageModelConsumerRole;
  readonly modelDomainCount: number;
  readonly publicTypeCount: number;
  readonly publicApiCount: number;
  readonly capabilityCount: number;
  readonly invariantCount: number;
  readonly consistencyCheckCount: number;
  readonly frozen: boolean;
  readonly contractsBoundaryIntact: boolean;
  readonly rendererIndependent: boolean;
  readonly declarativeOnly: boolean;
}

export function verifyRuntimeExecutiveStageModel():
  RuntimeExecutiveStageModelVerification {
  const registry = RUNTIME_EXECUTIVE_STAGE_MODEL_REGISTRY;
  const frozen =
    Object.isFrozen(RUNTIME_EXECUTIVE_STAGE_MODEL_DOMAINS) &&
    Object.isFrozen(RUNTIME_EXECUTIVE_STAGE_MODEL_CAPABILITIES) &&
    Object.isFrozen(RUNTIME_EXECUTIVE_STAGE_MODEL_INVARIANTS) &&
    Object.isFrozen(RUNTIME_EXECUTIVE_STAGE_MODEL_PUBLIC_TYPE_NAMES) &&
    Object.isFrozen(runtimeExecutiveStageModelApiNames) &&
    Object.isFrozen(RUNTIME_EXECUTIVE_STAGE_MODEL_REGISTRY) &&
    Object.isFrozen(runtimeExecutiveStageModel);

  const contractsBoundaryIntact =
    runtimeExecutiveStageModelDependencyIdentity ===
      runtimeExecutiveStageExperienceContractsIdentity &&
    runtimeExecutiveStageModelDependencyPath ===
      "@/app/lib/rex/runtimeExecutiveStageExperienceContracts" &&
    RUNTIME_EXECUTIVE_STAGE_MODEL_BOUNDARY.consumesContractsOnly === true &&
    RUNTIME_EXECUTIVE_STAGE_MODEL_BOUNDARY.importsRex21Directly === false &&
    RUNTIME_EXECUTIVE_STAGE_MODEL_BOUNDARY.importsRex1Directly === false &&
    RUNTIME_EXECUTIVE_STAGE_MODEL_BOUNDARY.importsDriDirectly === false &&
    RUNTIME_EXECUTIVE_STAGE_MODEL_BOUNDARY.importsNolDirectly === false &&
    RUNTIME_EXECUTIVE_STAGE_MODEL_BOUNDARY.importsExDriDirectly === false;

  const countsAligned =
    registry.modelDomainCount === RUNTIME_EXECUTIVE_STAGE_MODEL_DOMAINS.length &&
    registry.capabilityCount ===
      RUNTIME_EXECUTIVE_STAGE_MODEL_CAPABILITIES.length &&
    registry.publicTypeCount ===
      RUNTIME_EXECUTIVE_STAGE_MODEL_PUBLIC_TYPE_NAMES.length &&
    registry.publicApiCount === runtimeExecutiveStageModelApiNames.length &&
    registry.invariantCount === RUNTIME_EXECUTIVE_STAGE_MODEL_INVARIANTS.length &&
    registry.consistencyCheckCount ===
      RUNTIME_EXECUTIVE_STAGE_MODEL_CONSISTENCY_CHECKS.length;

  const invariantsOrdered =
    RUNTIME_EXECUTIVE_STAGE_MODEL_INVARIANTS.length === 38 &&
    RUNTIME_EXECUTIVE_STAGE_MODEL_INVARIANTS.every(
      (entry, index) => entry.order === index + 1,
    );

  const declarativeOnly =
    RUNTIME_EXECUTIVE_STAGE_MODEL_BOUNDARY.resolvesFocus === false &&
    RUNTIME_EXECUTIVE_STAGE_MODEL_BOUNDARY.resolvesPresentation === false &&
    RUNTIME_EXECUTIVE_STAGE_MODEL_BOUNDARY.calculatesAttention === false &&
    RUNTIME_EXECUTIVE_STAGE_MODEL_BOUNDARY.executesSceneTransitions === false &&
    RUNTIME_EXECUTIVE_STAGE_MODEL_BOUNDARY.introducesOrchestration === false;

  const ok =
    frozen &&
    contractsBoundaryIntact &&
    countsAligned &&
    invariantsOrdered &&
    declarativeOnly &&
    runtimeExecutiveStageModelIdentity ===
      "REX-2:3/RuntimeExecutiveStageModel" &&
    runtimeExecutiveStageModelVersion === "2.3.0" &&
    runtimeExecutiveStageModelNamespace === "nexora.rex.stage.model" &&
    runtimeExecutiveStageModelConsumerRole === "InternalRuntimeModel";

  return Object.freeze({
    ok,
    identity: runtimeExecutiveStageModelIdentity,
    version: runtimeExecutiveStageModelVersion,
    namespace: runtimeExecutiveStageModelNamespace,
    dependencyIdentity: runtimeExecutiveStageModelDependencyIdentity,
    consumerRole: runtimeExecutiveStageModelConsumerRole,
    modelDomainCount: RUNTIME_EXECUTIVE_STAGE_MODEL_DOMAINS.length,
    publicTypeCount: RUNTIME_EXECUTIVE_STAGE_MODEL_PUBLIC_TYPE_NAMES.length,
    publicApiCount: runtimeExecutiveStageModelApiNames.length,
    capabilityCount: RUNTIME_EXECUTIVE_STAGE_MODEL_CAPABILITIES.length,
    invariantCount: RUNTIME_EXECUTIVE_STAGE_MODEL_INVARIANTS.length,
    consistencyCheckCount: RUNTIME_EXECUTIVE_STAGE_MODEL_CONSISTENCY_CHECKS.length,
    frozen,
    contractsBoundaryIntact,
    rendererIndependent:
      RUNTIME_EXECUTIVE_STAGE_MODEL_BOUNDARY.rendererIndependent,
    declarativeOnly,
  });
}
