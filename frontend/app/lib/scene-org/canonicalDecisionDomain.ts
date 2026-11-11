/**
 * NPA-T DECISION-SOLAR-FOUNDATION:1
 *
 * Workspace-owned Goal, Scenario, Decision, and Execution Plan records.
 * This store does not own organizational objects or organizational relationships.
 * Approval is an explicit manager action. A plan stays PLANNED until a later
 * authority records execution evidence. This module does not record that evidence.
 */

import { evaluateWorkspaceAuthority, requireWorkspaceMutationCoordination, retainAuthorizedWorkspaceBuckets } from "../workspace/workspaceAuthorityFence.ts";
import { isProtectedDemoWorkspaceId } from "../workspace/workspaceRegistryContract.ts";
import { getCanonicalObject } from "./canonicalObjectRegistry.ts";

export const canonicalDecisionDomainIdentity =
  "NPA-T DECISION-SOLAR-FOUNDATION:1/CanonicalDecisionDomain" as const;

export const CANONICAL_DECISION_STORAGE_KEY = "nexora.decision-domain.v1" as const;
export const CANONICAL_DECISION_SCHEMA_VERSION = 1 as const;

export const DECISION_RELATIONSHIP_TYPES = Object.freeze([
  "EVALUATED_BY",
  "SUPPORTS",
  "AUTHORIZES",
  "TARGETS",
] as const);

export type DecisionRelationshipType = (typeof DECISION_RELATIONSHIP_TYPES)[number];

export type DecisionGoalStatus = "ACTIVE" | "ARCHIVED" | "DELETED";
export type DecisionScenarioStatus = "PROPOSED" | "APPROVED" | "ARCHIVED" | "DELETED";
export type ManagerDecisionStatus = "DRAFT" | "PROPOSED" | "REJECTED" | "APPROVED" | "ARCHIVED" | "DELETED";
export type ExecutionPlanStatus = "PLANNED" | "ARCHIVED" | "DELETED";

export type DecisionGoal = Readonly<{
  goalId: string;
  workspaceId: string;
  deckId: string;
  name: string;
  description: string;
  lifecycleStatus: DecisionGoalStatus;
  provenance: "MANAGER_DEFINED";
  targetValue: string | null;
  measurementUnit: string | null;
  timeHorizon: string | null;
  createdAt: string;
  updatedAt: string;
}>;

export const causalScenarioOriginIdentity =
  "NPA-T NEXOCAUSE-SCENARIO-HANDOFF:1/CausalScenarioOrigin" as const;

/** Reference to a NexoCause hypothesis. Dataset values are not copied here. */
export type CausalScenarioOrigin = Readonly<{
  identity: typeof causalScenarioOriginIdentity;
  version: 1;
  originType: "NEXOCAUSE";
  investigationId: string;
  hypothesisId: string;
  reviewId: string;
  workspaceId: string;
  deckId: string;
  evidenceFingerprint: string;
  observationIds: readonly string[];
  assumptions: readonly string[];
  limitations: readonly string[];
  handedOffAt: string;
  operationId: string;
  causalProof: false;
}>;

export type DecisionScenarioHandoffReceipt = Readonly<{
  operationId: string;
  payloadFingerprint: string;
  scenarioId: string;
}>;

export type DecisionScenario = Readonly<{
  scenarioId: string;
  workspaceId: string;
  deckId: string;
  name: string;
  description: string;
  lifecycleStatus: DecisionScenarioStatus;
  provenance: "MANAGER_DEFINED";
  createdAt: string;
  updatedAt: string;
  causalOrigin?: CausalScenarioOrigin;
}>;

export type ManagerDecision = Readonly<{
  decisionId: string;
  workspaceId: string;
  deckId: string;
  name: string;
  description: string;
  lifecycleStatus: ManagerDecisionStatus;
  provenance: "MANAGER_PROPOSED" | "MANAGER_APPROVED";
  approvedAt: string | null;
  createdAt: string;
  updatedAt: string;
}>;

export type ExecutionPlan = Readonly<{
  planId: string;
  workspaceId: string;
  deckId: string;
  name: string;
  description: string;
  lifecycleStatus: ExecutionPlanStatus;
  provenance: "MANAGER_DEFINED";
  createdAt: string;
  updatedAt: string;
}>;

export type DecisionDomainRelationship = Readonly<{
  relationshipId: string;
  workspaceId: string;
  relationshipType: DecisionRelationshipType;
  sourceId: string;
  targetId: string;
  status: "ACTIVE" | "ARCHIVED";
  provenance: "MANAGER_DECLARED";
  createdAt: string;
  updatedAt: string;
}>;

export type DecisionDomainFailure =
  | "storage-unavailable"
  | "storage-failed"
  | "corrupt"
  | "unsupported-version"
  | "invalid-workspace"
  | "revision-conflict"
  | "protected-workspace"
  | "invalid-name"
  | "invalid-deck"
  | "missing"
  | "wrong-deck"
  | "invalid-status"
  | "invalid-type"
  | "invalid-endpoint"
  | "cross-workspace"
  | "duplicate"
  | "unauthorized";

export type DecisionDomainResult<T> =
  | Readonly<{ ok: true; value: T }>
  | Readonly<{ ok: false; reason: DecisionDomainFailure }>;

type Bucket = Readonly<{
  nextGoal: number;
  nextScenario: number;
  nextDecision: number;
  nextPlan: number;
  nextRelationship: number;
  goals: readonly DecisionGoal[];
  scenarios: readonly DecisionScenario[];
  decisions: readonly ManagerDecision[];
  plans: readonly ExecutionPlan[];
  relationships: readonly DecisionDomainRelationship[];
  handoffReceipts: readonly DecisionScenarioHandoffReceipt[];
}>;

type Snapshot = Readonly<{
  identity: typeof canonicalDecisionDomainIdentity;
  schemaVersion: typeof CANONICAL_DECISION_SCHEMA_VERSION;
  workspaces: Readonly<Record<string, Bucket>>;
}>;

type AuthorityState =
  | Readonly<{ status: "ready" | "empty"; snapshot: Snapshot }>
  | Readonly<{ status: "corrupt" | "unsupported-version" }>;

const listeners = new Set<() => void>();
let revision = 0;
let storageOverride: Storage | null | undefined;
let authority: AuthorityState = { status: "empty", snapshot: emptySnapshot() };
let hydrated = false;
let baseRaw: string | null = null;

function emptyBucket(): Bucket {
  return Object.freeze({
    nextGoal: 1,
    nextScenario: 1,
    nextDecision: 1,
    nextPlan: 1,
    nextRelationship: 1,
    goals: Object.freeze([]),
    scenarios: Object.freeze([]),
    decisions: Object.freeze([]),
    plans: Object.freeze([]),
    relationships: Object.freeze([]),
    handoffReceipts: Object.freeze([]),
  });
}

function emptySnapshot(): Snapshot {
  return Object.freeze({
    identity: canonicalDecisionDomainIdentity,
    schemaVersion: CANONICAL_DECISION_SCHEMA_VERSION,
    workspaces: Object.freeze({}),
  });
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return value != null && typeof value === "object" && !Array.isArray(value);
}

function nowIso(value?: string): string {
  return value ?? new Date().toISOString();
}

function storage(): Storage | null {
  if (storageOverride !== undefined) return storageOverride;
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

function emit(): void {
  revision += 1;
  for (const listener of listeners) listener();
}

export function decisionDomainRevision(): number {
  hydrate();
  return revision;
}

export function subscribeDecisionDomain(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function canonicalDecisionAuthorityStatus(): "ready" | "empty" | "corrupt" | "unsupported-version" {
  hydrate();
  return authority.status;
}

function idFor(prefix: string, workspaceId: string, number: number): string {
  return `${prefix}:${encodeURIComponent(workspaceId)}:${number}`;
}

function workspaceAllowed(workspaceId: string): DecisionDomainFailure | null {
  if (workspaceId.length === 0) return "invalid-workspace";
  if (isProtectedDemoWorkspaceId(workspaceId)) return "protected-workspace";
  if (!evaluateWorkspaceAuthority(workspaceId).ok) return "invalid-workspace";
  return null;
}

function validName(value: string): boolean {
  const name = value.trim();
  return name.length > 0 && name.length <= 160;
}

function optionalText(value: unknown): string | null {
  if (value == null) return null;
  if (typeof value !== "string") return null;
  const text = value.trim();
  return text.length === 0 ? null : text.slice(0, 160);
}

function parseGoal(value: unknown, workspaceId: string): DecisionGoal | null {
  if (!isRecord(value) || value.workspaceId !== workspaceId) return null;
  if (typeof value.goalId !== "string" || typeof value.deckId !== "string") return null;
  if (typeof value.name !== "string" || typeof value.description !== "string") return null;
  if (value.lifecycleStatus !== "ACTIVE" && value.lifecycleStatus !== "ARCHIVED" && value.lifecycleStatus !== "DELETED") return null;
  if (value.provenance !== "MANAGER_DEFINED") return null;
  if (typeof value.createdAt !== "string" || typeof value.updatedAt !== "string") return null;
  return Object.freeze({
    goalId: value.goalId,
    workspaceId,
    deckId: value.deckId,
    name: value.name,
    description: value.description,
    lifecycleStatus: value.lifecycleStatus,
    provenance: "MANAGER_DEFINED",
    targetValue: typeof value.targetValue === "string" ? value.targetValue : null,
    measurementUnit: typeof value.measurementUnit === "string" ? value.measurementUnit : null,
    timeHorizon: typeof value.timeHorizon === "string" ? value.timeHorizon : null,
    createdAt: value.createdAt,
    updatedAt: value.updatedAt,
  });
}

function textList(value: unknown): readonly string[] | null {
  if (!Array.isArray(value) || value.length > 20) return null;
  const texts: string[] = [];
  for (const entry of value) {
    if (typeof entry !== "string" || entry.trim().length === 0 || entry.length > 500) return null;
    texts.push(entry.trim());
  }
  return Object.freeze(texts);
}

function parseCausalOrigin(value: unknown, workspaceId: string): CausalScenarioOrigin | null {
  if (!isRecord(value)) return null;
  if (value.identity !== causalScenarioOriginIdentity || value.version !== 1 || value.originType !== "NEXOCAUSE") return null;
  if (value.workspaceId !== workspaceId || value.causalProof !== false) return null;
  const observationIds = textList(value.observationIds);
  const assumptions = textList(value.assumptions);
  const limitations = textList(value.limitations);
  if (!observationIds || !assumptions || !limitations || limitations.length === 0) return null;
  const fields = ["investigationId", "hypothesisId", "reviewId", "deckId", "evidenceFingerprint", "handedOffAt", "operationId"] as const;
  for (const field of fields) {
    if (typeof value[field] !== "string" || value[field].trim().length === 0) return null;
  }
  return Object.freeze({
    identity: causalScenarioOriginIdentity,
    version: 1 as const,
    originType: "NEXOCAUSE" as const,
    investigationId: value.investigationId as string,
    hypothesisId: value.hypothesisId as string,
    reviewId: value.reviewId as string,
    workspaceId,
    deckId: value.deckId as string,
    evidenceFingerprint: value.evidenceFingerprint as string,
    observationIds,
    assumptions,
    limitations,
    handedOffAt: value.handedOffAt as string,
    operationId: value.operationId as string,
    causalProof: false as const,
  });
}

function parseHandoffReceipt(value: unknown): DecisionScenarioHandoffReceipt | null {
  if (!isRecord(value)) return null;
  if (typeof value.operationId !== "string" || typeof value.payloadFingerprint !== "string" || typeof value.scenarioId !== "string") return null;
  if (value.operationId.length === 0 || value.payloadFingerprint.length === 0 || value.scenarioId.length === 0) return null;
  return Object.freeze({
    operationId: value.operationId,
    payloadFingerprint: value.payloadFingerprint,
    scenarioId: value.scenarioId,
  });
}

function parseScenario(value: unknown, workspaceId: string): DecisionScenario | null {
  if (!isRecord(value) || value.workspaceId !== workspaceId) return null;
  if (typeof value.scenarioId !== "string" || typeof value.deckId !== "string") return null;
  if (typeof value.name !== "string" || typeof value.description !== "string") return null;
  if (!["PROPOSED", "APPROVED", "ARCHIVED", "DELETED"].includes(String(value.lifecycleStatus))) return null;
  if (value.provenance !== "MANAGER_DEFINED") return null;
  if (typeof value.createdAt !== "string" || typeof value.updatedAt !== "string") return null;
  const causalOrigin = value.causalOrigin == null ? undefined : parseCausalOrigin(value.causalOrigin, workspaceId);
  if (value.causalOrigin != null && !causalOrigin) return null;
  return Object.freeze({
    scenarioId: value.scenarioId,
    workspaceId,
    deckId: value.deckId,
    name: value.name,
    description: value.description,
    lifecycleStatus: value.lifecycleStatus as DecisionScenarioStatus,
    provenance: "MANAGER_DEFINED",
    createdAt: value.createdAt,
    updatedAt: value.updatedAt,
    ...(causalOrigin ? { causalOrigin } : {}),
  });
}

function parseDecision(value: unknown, workspaceId: string): ManagerDecision | null {
  if (!isRecord(value) || value.workspaceId !== workspaceId) return null;
  if (typeof value.decisionId !== "string" || typeof value.deckId !== "string") return null;
  if (typeof value.name !== "string" || typeof value.description !== "string") return null;
  if (!["DRAFT", "PROPOSED", "REJECTED", "APPROVED", "ARCHIVED", "DELETED"].includes(String(value.lifecycleStatus))) return null;
  if (value.provenance !== "MANAGER_PROPOSED" && value.provenance !== "MANAGER_APPROVED") return null;
  if (value.approvedAt != null && typeof value.approvedAt !== "string") return null;
  if (typeof value.createdAt !== "string" || typeof value.updatedAt !== "string") return null;
  if (value.lifecycleStatus === "APPROVED" && value.provenance !== "MANAGER_APPROVED") return null;
  if (value.provenance === "MANAGER_APPROVED" && typeof value.approvedAt !== "string") return null;
  return Object.freeze({
    decisionId: value.decisionId,
    workspaceId,
    deckId: value.deckId,
    name: value.name,
    description: value.description,
    lifecycleStatus: value.lifecycleStatus as ManagerDecisionStatus,
    provenance: value.provenance,
    approvedAt: typeof value.approvedAt === "string" ? value.approvedAt : null,
    createdAt: value.createdAt,
    updatedAt: value.updatedAt,
  });
}

function parsePlan(value: unknown, workspaceId: string): ExecutionPlan | null {
  if (!isRecord(value) || value.workspaceId !== workspaceId) return null;
  if (typeof value.planId !== "string" || typeof value.deckId !== "string") return null;
  if (typeof value.name !== "string" || typeof value.description !== "string") return null;
  if (value.lifecycleStatus !== "PLANNED" && value.lifecycleStatus !== "ARCHIVED" && value.lifecycleStatus !== "DELETED") return null;
  if (value.provenance !== "MANAGER_DEFINED") return null;
  if (typeof value.createdAt !== "string" || typeof value.updatedAt !== "string") return null;
  return Object.freeze({
    planId: value.planId,
    workspaceId,
    deckId: value.deckId,
    name: value.name,
    description: value.description,
    lifecycleStatus: value.lifecycleStatus,
    provenance: "MANAGER_DEFINED",
    createdAt: value.createdAt,
    updatedAt: value.updatedAt,
  });
}

function parseRelationship(value: unknown, workspaceId: string): DecisionDomainRelationship | null {
  if (!isRecord(value) || value.workspaceId !== workspaceId) return null;
  if (typeof value.relationshipId !== "string" || typeof value.sourceId !== "string" || typeof value.targetId !== "string") return null;
  if (!DECISION_RELATIONSHIP_TYPES.includes(value.relationshipType as DecisionRelationshipType)) return null;
  if (value.status !== "ACTIVE" && value.status !== "ARCHIVED") return null;
  if (value.provenance !== "MANAGER_DECLARED") return null;
  if (typeof value.createdAt !== "string" || typeof value.updatedAt !== "string") return null;
  return Object.freeze({
    relationshipId: value.relationshipId,
    workspaceId,
    relationshipType: value.relationshipType as DecisionRelationshipType,
    sourceId: value.sourceId,
    targetId: value.targetId,
    status: value.status,
    provenance: "MANAGER_DECLARED",
    createdAt: value.createdAt,
    updatedAt: value.updatedAt,
  });
}

function parseBucket(value: unknown, workspaceId: string): Bucket | null {
  if (!isRecord(value)) return null;
  const counters = ["nextGoal", "nextScenario", "nextDecision", "nextPlan", "nextRelationship"] as const;
  for (const counter of counters) {
    if (typeof value[counter] !== "number" || !Number.isInteger(value[counter]) || value[counter] < 1) return null;
  }
  const goals = Array.isArray(value.goals) ? value.goals.map((entry) => parseGoal(entry, workspaceId)) : null;
  const scenarios = Array.isArray(value.scenarios) ? value.scenarios.map((entry) => parseScenario(entry, workspaceId)) : null;
  const decisions = Array.isArray(value.decisions) ? value.decisions.map((entry) => parseDecision(entry, workspaceId)) : null;
  const plans = Array.isArray(value.plans) ? value.plans.map((entry) => parsePlan(entry, workspaceId)) : null;
  const relationships = Array.isArray(value.relationships) ? value.relationships.map((entry) => parseRelationship(entry, workspaceId)) : null;
  const handoffReceipts = value.handoffReceipts == null
    ? []
    : Array.isArray(value.handoffReceipts) ? value.handoffReceipts.map((entry) => parseHandoffReceipt(entry)) : null;
  if (!goals || !scenarios || !decisions || !plans || !relationships || !handoffReceipts) return null;
  if (goals.includes(null) || scenarios.includes(null) || decisions.includes(null) || plans.includes(null) || relationships.includes(null) || handoffReceipts.includes(null)) return null;
  return Object.freeze({
    nextGoal: value.nextGoal as number,
    nextScenario: value.nextScenario as number,
    nextDecision: value.nextDecision as number,
    nextPlan: value.nextPlan as number,
    nextRelationship: value.nextRelationship as number,
    goals: Object.freeze(goals as DecisionGoal[]),
    scenarios: Object.freeze(scenarios as DecisionScenario[]),
    decisions: Object.freeze(decisions as ManagerDecision[]),
    plans: Object.freeze(plans as ExecutionPlan[]),
    relationships: Object.freeze(relationships as DecisionDomainRelationship[]),
    handoffReceipts: Object.freeze(handoffReceipts as DecisionScenarioHandoffReceipt[]),
  });
}

function parseSnapshot(raw: string): AuthorityState {
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return { status: "corrupt" };
  }
  if (!isRecord(parsed) || parsed.identity !== canonicalDecisionDomainIdentity) return { status: "corrupt" };
  if (parsed.schemaVersion !== CANONICAL_DECISION_SCHEMA_VERSION) return { status: "unsupported-version" };
  if (!isRecord(parsed.workspaces)) return { status: "corrupt" };
  const workspaces: Record<string, Bucket> = {};
  const seen = new Set<string>();
  for (const [workspaceId, value] of Object.entries(parsed.workspaces)) {
    const bucket = parseBucket(value, workspaceId);
    if (!bucket) return { status: "corrupt" };
    for (const id of [
      ...bucket.goals.map((goal) => goal.goalId),
      ...bucket.scenarios.map((scenario) => scenario.scenarioId),
      ...bucket.decisions.map((decision) => decision.decisionId),
      ...bucket.plans.map((plan) => plan.planId),
      ...bucket.relationships.map((relationship) => relationship.relationshipId),
    ]) {
      if (seen.has(id)) return { status: "corrupt" };
      seen.add(id);
    }
    workspaces[workspaceId] = bucket;
  }
  return {
    status: Object.keys(workspaces).length === 0 ? "empty" : "ready",
    snapshot: Object.freeze({
      identity: canonicalDecisionDomainIdentity,
      schemaVersion: CANONICAL_DECISION_SCHEMA_VERSION,
      workspaces: Object.freeze(workspaces),
    }),
  };
}

function hydrate(): void {
  if (hydrated) return;
  hydrated = true;
  const current = storage();
  if (!current) return;
  let raw: string | null = null;
  try {
    raw = current.getItem(CANONICAL_DECISION_STORAGE_KEY);
  } catch {
    authority = { status: "corrupt" };
    return;
  }
  baseRaw = raw;
  if (raw == null) {
    authority = { status: "empty", snapshot: emptySnapshot() };
    return;
  }
  authority = parseSnapshot(raw);
}

function persist(next: Snapshot): DecisionDomainFailure | null {
  const current = storage();
  if (!current) return "storage-unavailable";
  const encoded = JSON.stringify(next);
  try {
    current.setItem(CANONICAL_DECISION_STORAGE_KEY, encoded);
    if (current.getItem(CANONICAL_DECISION_STORAGE_KEY) !== encoded) return "storage-failed";
  } catch {
    return "storage-failed";
  }
  return null;
}

function storedWorkspaceBuckets(): Readonly<Record<string, Bucket>> {
  const current = storage();
  if (!current) return authority.status === "ready" || authority.status === "empty" ? authority.snapshot.workspaces : {};
  let raw: string | null = null;
  try {
    raw = current.getItem(CANONICAL_DECISION_STORAGE_KEY);
  } catch {
    return {};
  }
  if (raw == null) return {};
  const parsed = parseSnapshot(raw);
  return parsed.status === "ready" || parsed.status === "empty" ? parsed.snapshot.workspaces : {};
}

function commit(next: Snapshot): DecisionDomainFailure | null {
  if (requireWorkspaceMutationCoordination()) return "invalid-workspace";
  hydrate();
  if (authority.status === "corrupt" || authority.status === "unsupported-version") {
    return authority.status === "corrupt" ? "corrupt" : "unsupported-version";
  }
  const fenced = retainAuthorizedWorkspaceBuckets(storedWorkspaceBuckets(), next.workspaces);
  if (!fenced.ok) return "invalid-workspace";
  const current = storage();
  let raw: string | null = null;
  try {
    raw = current?.getItem(CANONICAL_DECISION_STORAGE_KEY) ?? null;
  } catch {
    return "storage-failed";
  }
  if (current && raw !== baseRaw) {
    hydrated = false;
    hydrate();
    return "revision-conflict";
  }
  const failure = persist(Object.freeze({ ...next, workspaces: Object.freeze(fenced.workspaces) }));
  if (failure) return failure;
  const fencedSnapshot = Object.freeze({ ...next, workspaces: Object.freeze(fenced.workspaces) });
  authority = {
    status: Object.keys(fencedSnapshot.workspaces).length === 0 ? "empty" : "ready",
    snapshot: fencedSnapshot,
  };
  baseRaw = JSON.stringify(fencedSnapshot);
  emit();
  return null;
}

function snapshot(): Snapshot {
  hydrate();
  return authority.status === "ready" || authority.status === "empty" ? authority.snapshot : emptySnapshot();
}

function blocked(): DecisionDomainFailure | null {
  hydrate();
  if (authority.status === "corrupt") return "corrupt";
  if (authority.status === "unsupported-version") return "unsupported-version";
  return null;
}

function bucket(workspaceId: string): Bucket {
  return snapshot().workspaces[workspaceId] ?? emptyBucket();
}

function writeBucket(workspaceId: string, next: Bucket): DecisionDomainFailure | null {
  if (!evaluateWorkspaceAuthority(workspaceId).ok) return "invalid-workspace";
  const current = snapshot();
  return commit(Object.freeze({
    ...current,
    workspaces: Object.freeze({ ...current.workspaces, [workspaceId]: next }),
  }));
}

export function countWorkspaceDecisionRecords(workspaceId: string): number {
  const current = bucket(workspaceId);
  return current.goals.length + current.scenarios.length + current.decisions.length + current.plans.length + current.relationships.length;
}

export function listDecisionGoals(workspaceId: string, deckId: string): readonly DecisionGoal[] {
  return bucket(workspaceId).goals.filter((goal) => goal.deckId === deckId);
}

export function getDecisionScenario(workspaceId: string, scenarioId: string): DecisionScenario | null {
  return bucket(workspaceId).scenarios.find((scenario) => scenario.scenarioId === scenarioId) ?? null;
}

export function listDecisionScenarios(workspaceId: string, deckId: string): readonly DecisionScenario[] {
  return bucket(workspaceId).scenarios.filter((scenario) => scenario.deckId === deckId);
}

export function listManagerDecisions(workspaceId: string, deckId: string): readonly ManagerDecision[] {
  return bucket(workspaceId).decisions.filter((decision) => decision.deckId === deckId);
}

export function getManagerDecision(workspaceId: string, decisionId: string): ManagerDecision | null {
  return bucket(workspaceId).decisions.find((decision) => decision.decisionId === decisionId) ?? null;
}

export function listExecutionPlans(workspaceId: string, deckId: string): readonly ExecutionPlan[] {
  return bucket(workspaceId).plans.filter((plan) => plan.deckId === deckId);
}

export function listDecisionRelationships(workspaceId: string): readonly DecisionDomainRelationship[] {
  return bucket(workspaceId).relationships;
}

export function createDecisionGoal(input: {
  readonly workspaceId: string;
  readonly deckId: string;
  readonly name: string;
  readonly description?: string;
  readonly targetValue?: string | null;
  readonly measurementUnit?: string | null;
  readonly timeHorizon?: string | null;
  readonly now?: string;
}): DecisionDomainResult<DecisionGoal> {
  const failure = blocked();
  if (failure) return { ok: false, reason: failure };
  const workspaceId = input.workspaceId.trim();
  const rejected = workspaceAllowed(workspaceId);
  if (rejected) return { ok: false, reason: rejected };
  const deckId = input.deckId.trim();
  if (deckId.length === 0) return { ok: false, reason: "invalid-deck" };
  if (!validName(input.name)) return { ok: false, reason: "invalid-name" };
  const current = bucket(workspaceId);
  const stamp = nowIso(input.now);
  const goal: DecisionGoal = Object.freeze({
    goalId: idFor("goal", workspaceId, current.nextGoal),
    workspaceId,
    deckId,
    name: input.name.trim(),
    description: (input.description ?? "").trim().slice(0, 500),
    lifecycleStatus: "ACTIVE",
    provenance: "MANAGER_DEFINED",
    targetValue: optionalText(input.targetValue),
    measurementUnit: optionalText(input.measurementUnit),
    timeHorizon: optionalText(input.timeHorizon),
    createdAt: stamp,
    updatedAt: stamp,
  });
  const write = writeBucket(workspaceId, Object.freeze({
    ...current,
    nextGoal: current.nextGoal + 1,
    goals: Object.freeze([...current.goals, goal]),
  }));
  if (write) return { ok: false, reason: write };
  return { ok: true, value: goal };
}

function link(input: {
  readonly workspaceId: string;
  readonly relationshipType: DecisionRelationshipType;
  readonly sourceId: string;
  readonly targetId: string;
  readonly now: string;
  readonly current: Bucket;
}): DecisionDomainResult<{ readonly bucket: Bucket; readonly relationship: DecisionDomainRelationship }> {
  const duplicate = input.current.relationships.some((relationship) =>
    relationship.relationshipType === input.relationshipType &&
    relationship.sourceId === input.sourceId &&
    relationship.targetId === input.targetId &&
    relationship.status === "ACTIVE");
  if (duplicate) return { ok: false, reason: "duplicate" };
  const relationship: DecisionDomainRelationship = Object.freeze({
    relationshipId: idFor("drel", input.workspaceId, input.current.nextRelationship),
    workspaceId: input.workspaceId,
    relationshipType: input.relationshipType,
    sourceId: input.sourceId,
    targetId: input.targetId,
    status: "ACTIVE",
    provenance: "MANAGER_DECLARED",
    createdAt: input.now,
    updatedAt: input.now,
  });
  return {
    ok: true,
    value: {
      relationship,
      bucket: Object.freeze({
        ...input.current,
        nextRelationship: input.current.nextRelationship + 1,
        relationships: Object.freeze([...input.current.relationships, relationship]),
      }),
    },
  };
}

export function createDecisionScenario(input: {
  readonly workspaceId: string;
  readonly deckId: string;
  readonly name: string;
  readonly description?: string;
  readonly goalId: string;
  readonly now?: string;
}): DecisionDomainResult<DecisionScenario> {
  const failure = blocked();
  if (failure) return { ok: false, reason: failure };
  const workspaceId = input.workspaceId.trim();
  const rejected = workspaceAllowed(workspaceId);
  if (rejected) return { ok: false, reason: rejected };
  const deckId = input.deckId.trim();
  if (deckId.length === 0) return { ok: false, reason: "invalid-deck" };
  if (!validName(input.name)) return { ok: false, reason: "invalid-name" };
  const current = bucket(workspaceId);
  const goal = current.goals.find((entry) => entry.goalId === input.goalId);
  if (!goal || goal.lifecycleStatus === "DELETED") return { ok: false, reason: "missing" };
  if (goal.deckId !== deckId) return { ok: false, reason: "wrong-deck" };
  if (goal.lifecycleStatus !== "ACTIVE") return { ok: false, reason: "invalid-status" };
  const stamp = nowIso(input.now);
  const scenario: DecisionScenario = Object.freeze({
    scenarioId: idFor("scenario", workspaceId, current.nextScenario),
    workspaceId,
    deckId,
    name: input.name.trim(),
    description: (input.description ?? "").trim().slice(0, 500),
    lifecycleStatus: "PROPOSED",
    provenance: "MANAGER_DEFINED",
    createdAt: stamp,
    updatedAt: stamp,
  });
  const linked = link({
    workspaceId,
    relationshipType: "EVALUATED_BY",
    sourceId: goal.goalId,
    targetId: scenario.scenarioId,
    now: stamp,
    current: Object.freeze({ ...current, nextScenario: current.nextScenario + 1, scenarios: Object.freeze([...current.scenarios, scenario]) }),
  });
  if (!linked.ok) return linked;
  const write = writeBucket(workspaceId, linked.value.bucket);
  if (write) return { ok: false, reason: write };
  return { ok: true, value: scenario };
}

function handoffPayloadFingerprint(input: {
  readonly workspaceId: string;
  readonly deckId: string;
  readonly goalId: string;
  readonly name: string;
  readonly description: string;
  readonly origin: CausalScenarioOrigin;
}): string {
  const body = JSON.stringify({
    workspaceId: input.workspaceId,
    deckId: input.deckId,
    goalId: input.goalId,
    name: input.name,
    description: input.description,
    investigationId: input.origin.investigationId,
    hypothesisId: input.origin.hypothesisId,
    reviewId: input.origin.reviewId,
    evidenceFingerprint: input.origin.evidenceFingerprint,
    observationIds: input.origin.observationIds,
    assumptions: input.origin.assumptions,
    limitations: input.origin.limitations,
  });
  let hash = 2166136261;
  for (let index = 0; index < body.length; index += 1) {
    hash ^= body.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return `handoff:${(hash >>> 0).toString(16)}`;
}

/**
 * One Decision-domain write for a NexoCause handoff.
 * The same operation id and payload returns the original Scenario.
 * This does not approve a Decision or create an Execution Plan.
 */
export function commitDecisionScenarioHandoff(input: {
  readonly workspaceId: string;
  readonly deckId: string;
  readonly goalId: string;
  readonly name: string;
  readonly description: string;
  readonly origin: CausalScenarioOrigin;
  readonly operationId: string;
  readonly now?: string;
}): DecisionDomainResult<Readonly<{ scenario: DecisionScenario; replayed: boolean }>> {
  const failure = blocked();
  if (failure) return { ok: false, reason: failure };
  const workspaceId = input.workspaceId.trim();
  const rejected = workspaceAllowed(workspaceId);
  if (rejected) return { ok: false, reason: rejected };
  const deckId = input.deckId.trim();
  const operationId = input.operationId.trim();
  if (deckId.length === 0) return { ok: false, reason: "invalid-deck" };
  if (operationId.length === 0 || operationId.length > 80) return { ok: false, reason: "invalid-name" };
  if (!validName(input.name) || input.description.trim().length === 0) return { ok: false, reason: "invalid-name" };
  if (input.origin.workspaceId !== workspaceId || input.origin.deckId !== deckId || input.origin.operationId !== operationId) {
    return { ok: false, reason: "invalid-endpoint" };
  }
  if (input.origin.causalProof !== false || input.origin.limitations.length === 0) return { ok: false, reason: "unauthorized" };
  const current = bucket(workspaceId);
  const fingerprint = handoffPayloadFingerprint({
    workspaceId,
    deckId,
    goalId: input.goalId,
    name: input.name.trim(),
    description: input.description.trim().slice(0, 500),
    origin: input.origin,
  });
  const existing = current.handoffReceipts.find((receipt) => receipt.operationId === operationId);
  if (existing) {
    if (existing.payloadFingerprint !== fingerprint) return { ok: false, reason: "duplicate" };
    const scenario = current.scenarios.find((entry) => entry.scenarioId === existing.scenarioId);
    return scenario ? { ok: true, value: Object.freeze({ scenario, replayed: true }) } : { ok: false, reason: "corrupt" };
  }
  const goal = current.goals.find((entry) => entry.goalId === input.goalId);
  if (!goal || goal.lifecycleStatus === "DELETED") return { ok: false, reason: "missing" };
  if (goal.deckId !== deckId) return { ok: false, reason: "wrong-deck" };
  if (goal.lifecycleStatus !== "ACTIVE") return { ok: false, reason: "invalid-status" };
  const stamp = nowIso(input.now);
  const scenario: DecisionScenario = Object.freeze({
    scenarioId: idFor("scenario", workspaceId, current.nextScenario),
    workspaceId,
    deckId,
    name: input.name.trim(),
    description: input.description.trim().slice(0, 500),
    lifecycleStatus: "PROPOSED",
    provenance: "MANAGER_DEFINED",
    createdAt: stamp,
    updatedAt: stamp,
    causalOrigin: Object.freeze({ ...input.origin, handedOffAt: stamp, observationIds: Object.freeze([...input.origin.observationIds]), assumptions: Object.freeze([...input.origin.assumptions]), limitations: Object.freeze([...input.origin.limitations]) }),
  });
  const linked = link({
    workspaceId,
    relationshipType: "EVALUATED_BY",
    sourceId: goal.goalId,
    targetId: scenario.scenarioId,
    now: stamp,
    current: Object.freeze({
      ...current,
      nextScenario: current.nextScenario + 1,
      scenarios: Object.freeze([...current.scenarios, scenario]),
      handoffReceipts: Object.freeze([...current.handoffReceipts, Object.freeze({
        operationId,
        payloadFingerprint: fingerprint,
        scenarioId: scenario.scenarioId,
      })]),
    }),
  });
  if (!linked.ok) return linked;
  const write = writeBucket(workspaceId, linked.value.bucket);
  if (write) return { ok: false, reason: write };
  return { ok: true, value: Object.freeze({ scenario, replayed: false }) };
}

export function createManagerDecision(input: {
  readonly workspaceId: string;
  readonly deckId: string;
  readonly name: string;
  readonly description?: string;
  readonly scenarioId: string;
  readonly now?: string;
}): DecisionDomainResult<ManagerDecision> {
  const failure = blocked();
  if (failure) return { ok: false, reason: failure };
  const workspaceId = input.workspaceId.trim();
  const rejected = workspaceAllowed(workspaceId);
  if (rejected) return { ok: false, reason: rejected };
  const deckId = input.deckId.trim();
  if (deckId.length === 0) return { ok: false, reason: "invalid-deck" };
  if (!validName(input.name)) return { ok: false, reason: "invalid-name" };
  const current = bucket(workspaceId);
  const scenario = current.scenarios.find((entry) => entry.scenarioId === input.scenarioId);
  if (!scenario || scenario.lifecycleStatus === "DELETED") return { ok: false, reason: "missing" };
  if (scenario.deckId !== deckId) return { ok: false, reason: "wrong-deck" };
  if (scenario.lifecycleStatus !== "PROPOSED" && scenario.lifecycleStatus !== "APPROVED") return { ok: false, reason: "invalid-status" };
  const stamp = nowIso(input.now);
  const decision: ManagerDecision = Object.freeze({
    decisionId: idFor("decision", workspaceId, current.nextDecision),
    workspaceId,
    deckId,
    name: input.name.trim(),
    description: (input.description ?? "").trim().slice(0, 500),
    lifecycleStatus: "PROPOSED",
    provenance: "MANAGER_PROPOSED",
    approvedAt: null,
    createdAt: stamp,
    updatedAt: stamp,
  });
  const linked = link({
    workspaceId,
    relationshipType: "SUPPORTS",
    sourceId: scenario.scenarioId,
    targetId: decision.decisionId,
    now: stamp,
    current: Object.freeze({ ...current, nextDecision: current.nextDecision + 1, decisions: Object.freeze([...current.decisions, decision]) }),
  });
  if (!linked.ok) return linked;
  const write = writeBucket(workspaceId, linked.value.bucket);
  if (write) return { ok: false, reason: write };
  return { ok: true, value: decision };
}

export function approveManagerDecision(input: {
  readonly workspaceId: string;
  readonly deckId: string;
  readonly decisionId: string;
  readonly now?: string;
}): DecisionDomainResult<ManagerDecision> {
  const failure = blocked();
  if (failure) return { ok: false, reason: failure };
  const workspaceId = input.workspaceId.trim();
  const rejected = workspaceAllowed(workspaceId);
  if (rejected) return { ok: false, reason: rejected };
  const current = bucket(workspaceId);
  const decision = current.decisions.find((entry) => entry.decisionId === input.decisionId);
  if (!decision) return { ok: false, reason: "missing" };
  if (decision.deckId !== input.deckId.trim()) return { ok: false, reason: "wrong-deck" };
  if (decision.lifecycleStatus === "APPROVED") return { ok: true, value: decision };
  if (decision.lifecycleStatus !== "PROPOSED") return { ok: false, reason: "invalid-status" };
  const stamp = nowIso(input.now);
  const next: ManagerDecision = Object.freeze({
    ...decision,
    lifecycleStatus: "APPROVED",
    provenance: "MANAGER_APPROVED",
    approvedAt: stamp,
    updatedAt: stamp,
  });
  const write = writeBucket(workspaceId, Object.freeze({
    ...current,
    decisions: Object.freeze(current.decisions.map((entry) => entry.decisionId === next.decisionId ? next : entry)),
  }));
  if (write) return { ok: false, reason: write };
  return { ok: true, value: next };
}

export function rejectManagerDecision(input: {
  readonly workspaceId: string;
  readonly deckId: string;
  readonly decisionId: string;
  readonly now?: string;
}): DecisionDomainResult<ManagerDecision> {
  const failure = blocked();
  if (failure) return { ok: false, reason: failure };
  const workspaceId = input.workspaceId.trim();
  const rejected = workspaceAllowed(workspaceId);
  if (rejected) return { ok: false, reason: rejected };
  const current = bucket(workspaceId);
  const decision = current.decisions.find((entry) => entry.decisionId === input.decisionId);
  if (!decision) return { ok: false, reason: "missing" };
  if (decision.deckId !== input.deckId.trim()) return { ok: false, reason: "wrong-deck" };
  if (decision.lifecycleStatus === "REJECTED") return { ok: true, value: decision };
  if (decision.lifecycleStatus !== "PROPOSED") return { ok: false, reason: "invalid-status" };
  const stamp = nowIso(input.now);
  const next: ManagerDecision = Object.freeze({
    ...decision,
    lifecycleStatus: "REJECTED",
    provenance: "MANAGER_PROPOSED",
    approvedAt: null,
    updatedAt: stamp,
  });
  const write = writeBucket(workspaceId, Object.freeze({
    ...current,
    decisions: Object.freeze(current.decisions.map((entry) => entry.decisionId === next.decisionId ? next : entry)),
  }));
  if (write) return { ok: false, reason: write };
  return { ok: true, value: next };
}

export function createExecutionPlan(input: {
  readonly workspaceId: string;
  readonly deckId: string;
  readonly name: string;
  readonly description?: string;
  readonly decisionId: string;
  readonly organizationalObjectId: string;
  readonly now?: string;
}): DecisionDomainResult<ExecutionPlan> {
  const failure = blocked();
  if (failure) return { ok: false, reason: failure };
  const workspaceId = input.workspaceId.trim();
  const rejected = workspaceAllowed(workspaceId);
  if (rejected) return { ok: false, reason: rejected };
  const deckId = input.deckId.trim();
  if (deckId.length === 0) return { ok: false, reason: "invalid-deck" };
  if (!validName(input.name)) return { ok: false, reason: "invalid-name" };
  const current = bucket(workspaceId);
  const decision = current.decisions.find((entry) => entry.decisionId === input.decisionId);
  if (!decision) return { ok: false, reason: "missing" };
  if (decision.deckId !== deckId) return { ok: false, reason: "wrong-deck" };
  if (decision.lifecycleStatus !== "APPROVED") return { ok: false, reason: "invalid-status" };
  const objectId = input.organizationalObjectId.trim();
  if (!objectId.startsWith(`org:${encodeURIComponent(workspaceId)}:`)) return { ok: false, reason: "cross-workspace" };
  const object = getCanonicalObject(workspaceId, objectId);
  if (!object || object.lifecycleStatus === "DELETED") return { ok: false, reason: "missing" };
  if (object.workspaceId !== workspaceId) return { ok: false, reason: "cross-workspace" };
  if (!object.deckIds.includes(deckId) || object.lifecycleStatus !== "ACTIVE") return { ok: false, reason: "unauthorized" };
  const stamp = nowIso(input.now);
  const plan: ExecutionPlan = Object.freeze({
    planId: idFor("plan", workspaceId, current.nextPlan),
    workspaceId,
    deckId,
    name: input.name.trim(),
    description: (input.description ?? "").trim().slice(0, 500),
    lifecycleStatus: "PLANNED",
    provenance: "MANAGER_DEFINED",
    createdAt: stamp,
    updatedAt: stamp,
  });
  const withPlan = Object.freeze({
    ...current,
    nextPlan: current.nextPlan + 1,
    plans: Object.freeze([...current.plans, plan]),
  });
  const authorizes = link({
    workspaceId,
    relationshipType: "AUTHORIZES",
    sourceId: decision.decisionId,
    targetId: plan.planId,
    now: stamp,
    current: withPlan,
  });
  if (!authorizes.ok) return authorizes;
  const targets = link({
    workspaceId,
    relationshipType: "TARGETS",
    sourceId: plan.planId,
    targetId: object.canonicalObjectId,
    now: stamp,
    current: authorizes.value.bucket,
  });
  if (!targets.ok) return targets;
  const write = writeBucket(workspaceId, targets.value.bucket);
  if (write) return { ok: false, reason: write };
  return { ok: true, value: plan };
}

function setLifecycle(input: {
  readonly workspaceId: string;
  readonly deckId: string;
  readonly nodeId: string;
  readonly lifecycleStatus: string;
  readonly now?: string;
}): DecisionDomainResult<string> {
  const failure = blocked();
  if (failure) return { ok: false, reason: failure };
  const workspaceId = input.workspaceId.trim();
  const rejected = workspaceAllowed(workspaceId);
  if (rejected) return { ok: false, reason: rejected };
  const current = bucket(workspaceId);
  const stamp = nowIso(input.now);
  const deckId = input.deckId.trim();
  const goal = current.goals.find((entry) => entry.goalId === input.nodeId);
  if (goal) {
    if (goal.deckId !== deckId) return { ok: false, reason: "wrong-deck" };
    if (input.lifecycleStatus !== "ARCHIVED" && input.lifecycleStatus !== "DELETED" && input.lifecycleStatus !== "ACTIVE") return { ok: false, reason: "invalid-status" };
    const next = Object.freeze({ ...goal, lifecycleStatus: input.lifecycleStatus as DecisionGoalStatus, updatedAt: stamp });
    const write = writeBucket(workspaceId, Object.freeze({ ...current, goals: Object.freeze(current.goals.map((entry) => entry.goalId === next.goalId ? next : entry)) }));
    return write ? { ok: false, reason: write } : { ok: true, value: next.goalId };
  }
  const scenario = current.scenarios.find((entry) => entry.scenarioId === input.nodeId);
  if (scenario) {
    if (scenario.deckId !== deckId) return { ok: false, reason: "wrong-deck" };
    if (!["PROPOSED", "APPROVED", "ARCHIVED", "DELETED"].includes(input.lifecycleStatus)) return { ok: false, reason: "invalid-status" };
    const next = Object.freeze({ ...scenario, lifecycleStatus: input.lifecycleStatus as DecisionScenarioStatus, updatedAt: stamp });
    const write = writeBucket(workspaceId, Object.freeze({ ...current, scenarios: Object.freeze(current.scenarios.map((entry) => entry.scenarioId === next.scenarioId ? next : entry)) }));
    return write ? { ok: false, reason: write } : { ok: true, value: next.scenarioId };
  }
  const decision = current.decisions.find((entry) => entry.decisionId === input.nodeId);
  if (decision) {
    if (decision.deckId !== deckId) return { ok: false, reason: "wrong-deck" };
    if (input.lifecycleStatus === "APPROVED") return { ok: false, reason: "invalid-status" };
    if (!["ARCHIVED", "DELETED", "PROPOSED", "REJECTED"].includes(input.lifecycleStatus)) return { ok: false, reason: "invalid-status" };
    const next = Object.freeze({ ...decision, lifecycleStatus: input.lifecycleStatus as ManagerDecisionStatus, updatedAt: stamp });
    const write = writeBucket(workspaceId, Object.freeze({ ...current, decisions: Object.freeze(current.decisions.map((entry) => entry.decisionId === next.decisionId ? next : entry)) }));
    return write ? { ok: false, reason: write } : { ok: true, value: next.decisionId };
  }
  const plan = current.plans.find((entry) => entry.planId === input.nodeId);
  if (plan) {
    if (plan.deckId !== deckId) return { ok: false, reason: "wrong-deck" };
    if (input.lifecycleStatus !== "PLANNED" && input.lifecycleStatus !== "ARCHIVED" && input.lifecycleStatus !== "DELETED") return { ok: false, reason: "invalid-status" };
    const next = Object.freeze({ ...plan, lifecycleStatus: input.lifecycleStatus as ExecutionPlanStatus, updatedAt: stamp });
    const write = writeBucket(workspaceId, Object.freeze({ ...current, plans: Object.freeze(current.plans.map((entry) => entry.planId === next.planId ? next : entry)) }));
    return write ? { ok: false, reason: write } : { ok: true, value: next.planId };
  }
  return { ok: false, reason: "missing" };
}

export function renameDecisionGoal(input: {
  readonly workspaceId: string;
  readonly deckId: string;
  readonly goalId: string;
  readonly name: string;
  readonly now?: string;
}): DecisionDomainResult<DecisionGoal> {
  const failure = blocked();
  if (failure) return { ok: false, reason: failure };
  const workspaceId = input.workspaceId.trim();
  const rejected = workspaceAllowed(workspaceId);
  if (rejected) return { ok: false, reason: rejected };
  if (!validName(input.name)) return { ok: false, reason: "invalid-name" };
  const current = bucket(workspaceId);
  const goal = current.goals.find((entry) => entry.goalId === input.goalId);
  if (!goal) return { ok: false, reason: "missing" };
  if (goal.deckId !== input.deckId.trim()) return { ok: false, reason: "wrong-deck" };
  const next = Object.freeze({ ...goal, name: input.name.trim(), updatedAt: nowIso(input.now) });
  const write = writeBucket(workspaceId, Object.freeze({
    ...current,
    goals: Object.freeze(current.goals.map((entry) => entry.goalId === next.goalId ? next : entry)),
  }));
  if (write) return { ok: false, reason: write };
  return { ok: true, value: next };
}

export function archiveDecisionNode(input: {
  readonly workspaceId: string;
  readonly deckId: string;
  readonly nodeId: string;
  readonly now?: string;
}): DecisionDomainResult<string> {
  return setLifecycle({ ...input, lifecycleStatus: "ARCHIVED" });
}

export function deleteDecisionNode(input: {
  readonly workspaceId: string;
  readonly deckId: string;
  readonly nodeId: string;
  readonly now?: string;
}): DecisionDomainResult<string> {
  return setLifecycle({ ...input, lifecycleStatus: "DELETED" });
}

export function forgetWorkspaceDecisionDomain(workspaceId: string): DecisionDomainResult<null> {
  const failure = blocked();
  if (failure) return { ok: false, reason: failure };
  const current = snapshot();
  if (!current.workspaces[workspaceId]) return { ok: true, value: null };
  const workspaces = { ...current.workspaces };
  delete workspaces[workspaceId];
  const write = commit(Object.freeze({ ...current, workspaces: Object.freeze(workspaces) }));
  if (write) return { ok: false, reason: write };
  return { ok: true, value: null };
}

export function resetDecisionDomainForTests(nextStorage?: Storage | null): void {
  storageOverride = nextStorage === undefined ? undefined : nextStorage;
  authority = { status: "empty", snapshot: emptySnapshot() };
  hydrated = false;
  baseRaw = null;
  revision = 0;
}
