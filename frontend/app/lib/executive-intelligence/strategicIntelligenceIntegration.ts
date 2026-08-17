/**
 * EI:2 — immutable strategic-context integration over existing authorities.
 * Relationships are accepted only when explicitly declared by an upstream
 * registry/binding. No strategic importance, causality, or domain truth is inferred.
 */
import type { ExecutiveStrategyDefinition } from "../bus/executiveStrategyDefinitionTypes.ts";
import type {
  ExecutiveStrategicObjective,
  ExecutiveStrategicObjectiveRelationship,
} from "../bus/executiveStrategicObjectiveTypes.ts";
import type { WorkspaceObjective, WorkspaceKeyResult } from "../okr/workspaceOkrContract.ts";
import type { WorkspaceOkrKpiBinding } from "../okr/workspaceOkrKpiBinding.ts";
import type { WorkspaceRisk } from "../risk/workspaceRiskContract.ts";
import type { NexoraDataRealitySnapshot } from "../data-reality/dataRealityContracts.ts";
import type {
  ExecutiveIntelligenceTrace,
  ExecutiveRealityReference,
} from "./executiveIntelligenceIntegration.ts";

export const strategicIntelligenceIntegrationIdentity =
  "EI:2/StrategyObjectiveIntelligenceIntegration" as const;
export const strategicIntelligenceIntegrationVersion = "1.0.0" as const;
export const strategicIntelligenceIntegrationNamespace =
  "nexora.executive-intelligence.strategic-context" as const;

export const STRATEGIC_INTELLIGENCE_BOUNDARY = Object.freeze({
  role: "explicit-reference-integration" as const,
  ownsStrategyTruth: false as const,
  ownsObjectiveTruth: false as const,
  ownsKpiTruth: false as const,
  ownsRiskTruth: false as const,
  ownsRealityTruth: false as const,
  infersRelationships: false as const,
  infersCausality: false as const,
  computesPriority: false as const,
  mutatesEi1: false as const,
  mutatesStage: false as const,
});

export type StrategicCapabilityStatus =
  | "CANONICAL"
  | "PARTIAL"
  | "LEGACY"
  | "PRESENTATION_ONLY"
  | "DUPLICATED"
  | "MISSING";

export type StrategicCapabilityInventoryEntry = Readonly<{
  concept: "strategy" | "objective-okr" | "key-result" | "csf" | "kpi" | "risk" | "reality";
  implementation: readonly string[];
  runtimeRegistry: string;
  authority: string;
  persistence: string;
  consumers: readonly string[];
  stageRepresentation: string;
  advisorUsage: string;
  status: StrategicCapabilityStatus;
}>;

export const strategicCapabilityInventory: readonly StrategicCapabilityInventoryEntry[] =
  deepFreeze([
    { concept: "strategy", implementation: ["bus/executiveStrategyDefinitionRegistry", "bus/executiveStrategyAlignmentRegistry"], runtimeRegistry: "BUS-18 frozen definition registry (metadata-only)", authority: "BUS-18 Executive Strategy Definition Platform", persistence: "none", consumers: ["BUS strategy layers"], stageRepresentation: "generic object only; no live specialized kind", advisorUsage: "not connected to CC:8", status: "PARTIAL" },
    { concept: "objective-okr", implementation: ["okr/workspaceOkrContract", "bus/executiveStrategicObjectiveRegistry", "executiveOkr/executiveOkrContract"], runtimeRegistry: "DS-5:1 workspace Objective store", authority: "DS-5:1 for workspace truth; BUS-20 for frozen strategic definitions", persistence: "localStorage-backed workspace store", consumers: ["workspace object panel", "OKR health", "risk detection"], stageRepresentation: "goal reference/generic object; no objective-specific live kind", advisorUsage: "CC:7 currentGoal reference", status: "DUPLICATED" },
    { concept: "key-result", implementation: ["okr/workspaceOkrContract"], runtimeRegistry: "DS-5:1 workspace Key Result store", authority: "DS-5:1 Workspace OKR", persistence: "localStorage-backed workspace store", consumers: ["OKR progress", "OKR health"], stageRepresentation: "none specialized", advisorUsage: "not directly consumed", status: "CANONICAL" },
    { concept: "csf", implementation: [], runtimeRegistry: "none", authority: "none", persistence: "none", consumers: [], stageRepresentation: "none", advisorUsage: "none", status: "MISSING" },
    { concept: "kpi", implementation: ["data-reality/dataRealityFoundation", "kpi/workspaceKpiContract", "executiveKpi/executiveKpiContract"], runtimeRegistry: "Data Reality live KPI snapshot + DS-4 workspace KPI store", authority: "P0:1 for interpreted live truth; DS-4:1 for workspace KPI configuration", persistence: "DS-4 localStorage; Data Reality snapshot lifecycle", consumers: ["Runtime", "Stage", "OKR health", "risk detection", "Advisor projection"], stageRepresentation: "value on generic Executive Object", advisorUsage: "CC:8 evidence fact", status: "DUPLICATED" },
    { concept: "risk", implementation: ["risk/workspaceRiskContract", "risk/workspaceRiskDetectionEngine", "bus/executiveStrategicObjectiveRegistry"], runtimeRegistry: "DS-6 workspace risk/detection stores", authority: "DS-6 for workspace risk; BUS references are metadata-only", persistence: "localStorage-backed workspace stores", consumers: ["risk workspace", "OKR/KPI health", "CC:8 assessment"], stageRepresentation: "generic risk object/problem projection", advisorUsage: "CC:8 evidence-backed issue framing", status: "DUPLICATED" },
    { concept: "reality", implementation: ["data-reality/realDataIntegrationFoundation", "data-reality/dataRealityFoundation"], runtimeRegistry: "validated RDI/Data Reality snapshot", authority: "RDI external observation + P0:1 interpretation", persistence: "source-specific; snapshot/reference boundary", consumers: ["Runtime", "Stage", "monitoring", "Advisor"], stageRepresentation: "canonical object value/state projection", advisorUsage: "runtime evidence, with incomplete RDI lineage in the current MVP bridge", status: "CANONICAL" },
  ] as const);

export type StrategicRelationshipStatus = "CONNECTED" | "PARTIAL" | "MISSING" | "DUPLICATED" | "PRESENTATION_ONLY" | "UNVERIFIED";

export const strategicRelationshipMap = deepFreeze([
  { relationship: "Strategy → Objective", status: "PARTIAL", evidence: "BUS-20 has explicit frozen relationships; no live workspace Strategy→DS-5 Objective binding." },
  { relationship: "Objective → Key Result", status: "CONNECTED", evidence: "DS-5:1 Key Results retain objectiveId and workspace scope." },
  { relationship: "Objective → CSF", status: "MISSING", evidence: "No canonical CSF contract or registry was found." },
  { relationship: "CSF → KPI", status: "MISSING", evidence: "No CSF authority exists to own this link." },
  { relationship: "Objective → KPI", status: "CONNECTED", evidence: "DS-5:4 persists explicit Objective→KPI bindings; BUS-20 also has metadata references." },
  { relationship: "Strategy/Objective → Risk", status: "PARTIAL", evidence: "BUS metadata has risk references, but they are not converged with DS-6 risk identity." },
  { relationship: "KPI → Reality", status: "PARTIAL", evidence: "Data Reality KPIs retain dataset lineage; DS-4/BUS KPI identity is not generally mapped to Data Reality KPI identity." },
] as const satisfies readonly Readonly<{ relationship: string; status: StrategicRelationshipStatus; evidence: string }>[]);

export type StrategicGap = Readonly<{
  gapId: string;
  relationship: string;
  currentImplementation: string;
  expectedImplementation: string;
  authority: string;
  rootCause: string;
  severity: "medium" | "high" | "critical";
  requiredIntegration: string;
  phase: "EI:2" | "EI:3" | "EI:4" | "EI:5" | "EI:6";
}>;

export const strategicGapRegister: readonly StrategicGap[] = deepFreeze([
  { gapId: "EI2-GAP-001", relationship: "Strategy → Objective", currentImplementation: "BUS metadata links only.", expectedImplementation: "Explicit workspace-scoped link to the active Objective authority.", authority: "BUS-18 + DS-5", rootCause: "Strategy definitions and workspace OKRs were built independently.", severity: "critical", requiredIntegration: "Add an explicit identity mapping without replacing either authority.", phase: "EI:2" },
  { gapId: "EI2-GAP-002", relationship: "Objective → CSF → KPI", currentImplementation: "CSF absent; Objective→KPI exists.", expectedImplementation: "Optional canonical CSF definitions and explicit measurement links.", authority: "unassigned", rootCause: "No CSF domain contract exists.", severity: "high", requiredIntegration: "Define CSF authority only when product semantics require it; retain direct Objective→KPI.", phase: "EI:2" },
  { gapId: "EI2-GAP-003", relationship: "Strategic Risk context", currentImplementation: "BUS risk references and DS-6 risk IDs do not converge.", expectedImplementation: "DS-6 Risk can reference the Strategy/Objective it threatens.", authority: "DS-6", rootCause: "Metadata and runtime risk phases have separate identities.", severity: "critical", requiredIntegration: "Add explicit strategic-entity references to DS-6 via a non-owning adapter.", phase: "EI:3" },
  { gapId: "EI2-GAP-004", relationship: "KPI → Reality", currentImplementation: "Data Reality lineage is canonical, but DS-4/BUS identifiers can differ.", expectedImplementation: "Configured KPI identity maps unambiguously to the active Data Reality KPI.", authority: "P0:1 + DS-4", rootCause: "Configuration and live interpretation use separate KPI models.", severity: "critical", requiredIntegration: "Publish explicit KPI identity mappings at the Data Reality boundary.", phase: "EI:2" },
  { gapId: "EI2-GAP-005", relationship: "Operational severity vs strategic priority", currentImplementation: "CC:8 checks explicit goal links; no broad strategic relevance policy exists.", expectedImplementation: "Priority considers severity and relevance as separate inputs.", authority: "future Priority Intelligence", rootCause: "Priority intelligence is intentionally deferred.", severity: "high", requiredIntegration: "Consume, but never conflate, both dimensions.", phase: "EI:4" },
  { gapId: "EI2-GAP-006", relationship: "Strategy → Decision rationale", currentImplementation: "Decision rationale carries goal/problem IDs but no canonical Strategy reference.", expectedImplementation: "Committed decisions can cite explicit strategic context.", authority: "CC:10R", rootCause: "Decision contracts predate strategic-context integration.", severity: "medium", requiredIntegration: "Add reference-only strategic rationale fields without changing commitment authority.", phase: "EI:5" },
  { gapId: "EI2-GAP-007", relationship: "Outcome → strategic learning", currentImplementation: "EI:1 outcome/learning remains partial and does not evaluate objective impact.", expectedImplementation: "Measured outcomes can be compared with explicit strategic expectations.", authority: "APP-4 + future outcome authority", rootCause: "Business outcome semantics are not yet integrated.", severity: "high", requiredIntegration: "Preserve objective/strategy references through Outcome and Learning.", phase: "EI:6" },
]);

export type StrategicReferenceKind = "strategy" | "objective" | "key-result" | "csf" | "kpi" | "risk" | "reality";
export type StrategicReference = Readonly<{
  kind: StrategicReferenceKind;
  id: string;
  label: string;
  authorityId: string;
  workspaceId: string;
  modelId: string | null;
  provenanceRefs: readonly string[];
  observedAt: string | null;
}>;

export type StrategicRelationshipType =
  | "strategy-supports-objective"
  | "objective-has-key-result"
  | "objective-requires-csf"
  | "csf-measured-by-kpi"
  | "objective-measured-by-kpi"
  | "strategy-threatened-by-risk"
  | "objective-threatened-by-risk"
  | "kpi-observed-in-reality";

export type StrategicRelationshipReference = Readonly<{
  relationshipId: string;
  type: StrategicRelationshipType;
  sourceId: string;
  targetId: string;
  authorityId: string;
  evidenceRefs: readonly string[];
  configured: true;
  causal: false;
}>;

export type OperationalSeverity = "normal" | "watch" | "critical" | "unresolved";
export type StrategicRelevanceLevel = "low" | "medium" | "high" | "unresolved";
export type StrategicRelevance = Readonly<{
  level: StrategicRelevanceLevel;
  rationale: string | null;
  basisRelationshipIds: readonly string[];
  source: "explicit-configuration" | "unresolved";
}>;

export type StrategicContext = Readonly<{
  contextId: string;
  workspaceId: string;
  modelId: string | null;
  references: readonly StrategicReference[];
  relationships: readonly StrategicRelationshipReference[];
  operationalSeverity: OperationalSeverity;
  strategicRelevance: StrategicRelevance;
  valid: boolean;
  issues: readonly string[];
}>;

export type StrategicTrace = Readonly<{
  contextId: string;
  referenceIds: readonly string[];
  relationshipIds: readonly string[];
  complete: boolean;
  unresolvedAt: StrategicReferenceKind | null;
}>;

function deepFreeze<T>(value: T): T {
  if (value !== null && typeof value === "object" && !Object.isFrozen(value)) {
    for (const child of Object.values(value as Record<string, unknown>)) deepFreeze(child);
    Object.freeze(value);
  }
  return value;
}

function unique(values: readonly string[]): readonly string[] {
  return Object.freeze([...new Set(values)].sort());
}

function ref(input: StrategicReference): StrategicReference {
  return deepFreeze({ ...input, provenanceRefs: unique(input.provenanceRefs) });
}

export function referenceStrategyDefinition(input: { readonly strategy: ExecutiveStrategyDefinition; readonly workspaceId: string; readonly modelId: string | null }): StrategicReference {
  return ref({ kind: "strategy", id: input.strategy.identity.strategyId, label: input.strategy.name.displayName, authorityId: "BUS-18/ExecutiveStrategyDefinitionPlatform", workspaceId: input.workspaceId, modelId: input.modelId, provenanceRefs: [input.strategy.version.versionId], observedAt: null });
}

export function referenceStrategicObjective(input: { readonly objective: ExecutiveStrategicObjective; readonly workspaceId: string; readonly modelId: string | null }): StrategicReference {
  return ref({ kind: "objective", id: input.objective.identity.objectiveId, label: input.objective.name.displayName, authorityId: "BUS-20/ExecutiveStrategicObjectivesPlatform", workspaceId: input.workspaceId, modelId: input.modelId, provenanceRefs: [input.objective.version.versionId], observedAt: null });
}

export function referenceWorkspaceObjective(input: { readonly objective: WorkspaceObjective; readonly modelId: string | null }): StrategicReference {
  return ref({ kind: "objective", id: input.objective.objectiveId, label: input.objective.title, authorityId: "DS-5:1/WorkspaceOkr", workspaceId: input.objective.workspaceId, modelId: input.modelId, provenanceRefs: [input.objective.source], observedAt: input.objective.updatedAt });
}

export function referenceWorkspaceKeyResult(input: { readonly keyResult: WorkspaceKeyResult; readonly modelId: string | null }): StrategicReference {
  return ref({ kind: "key-result", id: input.keyResult.keyResultId, label: input.keyResult.title, authorityId: "DS-5:1/WorkspaceOkr", workspaceId: input.keyResult.workspaceId, modelId: input.modelId, provenanceRefs: [input.keyResult.source, `objective:${input.keyResult.objectiveId}`], observedAt: input.keyResult.updatedAt });
}

export function referenceWorkspaceRisk(input: { readonly risk: WorkspaceRisk; readonly modelId: string | null }): StrategicReference {
  return ref({ kind: "risk", id: input.risk.riskId, label: input.risk.title, authorityId: "DS-6:1/WorkspaceRisk", workspaceId: input.risk.workspaceId, modelId: input.modelId, provenanceRefs: [input.risk.source], observedAt: input.risk.updatedAt });
}

export function referenceDataRealityKpi(input: { readonly snapshot: NexoraDataRealitySnapshot; readonly reality: ExecutiveRealityReference; readonly kpiId: string; readonly modelId: string | null }): StrategicReference {
  if (input.snapshot.datasetId !== input.reality.recordId) throw new Error("ei2-kpi-reality-dataset-mismatch");
  const kpi = input.snapshot.kpis.find((candidate) => candidate.kpiId === input.kpiId);
  if (!kpi) throw new Error("ei2-kpi-not-found");
  return ref({ kind: "kpi", id: kpi.kpiId, label: kpi.kpiId, authorityId: "P0:1/NexoraDataRealityFoundation", workspaceId: input.reality.workspaceId, modelId: input.modelId, provenanceRefs: input.reality.provenanceRefs, observedAt: kpi.calculatedAt });
}

export function referenceEi1Reality(input: { readonly reality: ExecutiveRealityReference; readonly modelId: string | null }): StrategicReference {
  return ref({ kind: "reality", id: input.reality.recordId, label: input.reality.datasetId, authorityId: input.reality.authorityId, workspaceId: input.reality.workspaceId, modelId: input.modelId, provenanceRefs: input.reality.provenanceRefs, observedAt: input.reality.observedAt });
}

const BUS_RELATIONSHIP_TYPES: Readonly<Partial<Record<ExecutiveStrategicObjectiveRelationship["relationshipType"], StrategicRelationshipType>>> = Object.freeze({
  StrategyToObjective: "strategy-supports-objective",
  ObjectiveToKpiReference: "objective-measured-by-kpi",
  ObjectiveToRiskReference: "objective-threatened-by-risk",
});

export function referenceBusStrategicRelationship(relationship: ExecutiveStrategicObjectiveRelationship): StrategicRelationshipReference | null {
  const type = BUS_RELATIONSHIP_TYPES[relationship.relationshipType];
  if (!type) return null;
  return deepFreeze({ relationshipId: relationship.relationshipId, type, sourceId: relationship.sourceId, targetId: relationship.targetId, authorityId: "BUS-20/ExecutiveStrategicObjectivesPlatform", evidenceRefs: [relationship.relationshipId], configured: true, causal: false });
}

export function referenceOkrKpiBinding(binding: WorkspaceOkrKpiBinding): StrategicRelationshipReference {
  return deepFreeze({ relationshipId: binding.bindingId, type: "objective-measured-by-kpi", sourceId: binding.objectiveId, targetId: binding.kpiId, authorityId: "DS-5:4/WorkspaceOkrKpiBinding", evidenceRefs: [binding.source, binding.bindingReason], configured: true, causal: false });
}

export function referenceObjectiveKeyResult(input: { readonly objective: StrategicReference; readonly keyResult: StrategicReference }): StrategicRelationshipReference {
  if (input.objective.kind !== "objective" || input.keyResult.kind !== "key-result") throw new Error("ei2-objective-key-result-kind-mismatch");
  if (!input.keyResult.provenanceRefs.includes(`objective:${input.objective.id}`)) throw new Error("ei2-key-result-objective-mismatch");
  return deepFreeze({ relationshipId: `ds5:${input.objective.id}:${input.keyResult.id}`, type: "objective-has-key-result", sourceId: input.objective.id, targetId: input.keyResult.id, authorityId: "DS-5:1/WorkspaceOkr", evidenceRefs: input.keyResult.provenanceRefs, configured: true, causal: false });
}

export function referenceKpiReality(input: { readonly kpi: StrategicReference; readonly reality: StrategicReference }): StrategicRelationshipReference {
  if (input.kpi.kind !== "kpi" || input.reality.kind !== "reality") throw new Error("ei2-kpi-reality-kind-mismatch");
  const evidence = unique([...input.kpi.provenanceRefs, ...input.reality.provenanceRefs]);
  if (evidence.length === 0) throw new Error("ei2-kpi-reality-provenance-missing");
  return deepFreeze({ relationshipId: `p0:${input.kpi.id}:${input.reality.id}`, type: "kpi-observed-in-reality", sourceId: input.kpi.id, targetId: input.reality.id, authorityId: "P0:1/NexoraDataRealityFoundation", evidenceRefs: evidence, configured: true, causal: false });
}

export function referenceConfiguredStrategicRisk(input: {
  readonly strategicEntity: StrategicReference;
  readonly risk: StrategicReference;
  readonly authorityId: string;
  readonly evidenceRefs: readonly string[];
}): StrategicRelationshipReference {
  if (input.strategicEntity.kind !== "strategy" && input.strategicEntity.kind !== "objective") throw new Error("ei2-risk-source-kind-mismatch");
  if (input.risk.kind !== "risk") throw new Error("ei2-risk-target-kind-mismatch");
  if (input.authorityId.startsWith("EI:2") || input.evidenceRefs.length === 0) throw new Error("ei2-risk-relationship-authority-required");
  return deepFreeze({ relationshipId: `${input.authorityId}:${input.strategicEntity.id}:${input.risk.id}`, type: input.strategicEntity.kind === "strategy" ? "strategy-threatened-by-risk" : "objective-threatened-by-risk", sourceId: input.strategicEntity.id, targetId: input.risk.id, authorityId: input.authorityId, evidenceRefs: unique(input.evidenceRefs), configured: true, causal: false });
}

function pathFromStrategyToReality(references: readonly StrategicReference[], relationships: readonly StrategicRelationshipReference[]): { refs: string[]; rels: string[] } | null {
  const strategyIds = references.filter((item) => item.kind === "strategy").map((item) => item.id);
  const realityIds = new Set(references.filter((item) => item.kind === "reality").map((item) => item.id));
  const allowed = new Set<StrategicRelationshipType>(["strategy-supports-objective", "objective-requires-csf", "csf-measured-by-kpi", "objective-measured-by-kpi", "kpi-observed-in-reality"]);
  const walk = (current: string, seen: Set<string>, refs: string[], rels: string[]): { refs: string[]; rels: string[] } | null => {
    if (realityIds.has(current)) return { refs, rels };
    for (const relationship of relationships) {
      if (relationship.sourceId !== current || !allowed.has(relationship.type) || seen.has(relationship.targetId)) continue;
      const result = walk(relationship.targetId, new Set([...seen, relationship.targetId]), [...refs, relationship.targetId], [...rels, relationship.relationshipId]);
      if (result) return result;
    }
    return null;
  };
  for (const strategyId of strategyIds) {
    const result = walk(strategyId, new Set([strategyId]), [strategyId], []);
    if (result) return result;
  }
  return null;
}

export function createStrategicContext(input: {
  readonly contextId: string;
  readonly workspaceId: string;
  readonly modelId: string | null;
  readonly references: readonly StrategicReference[];
  readonly relationships: readonly StrategicRelationshipReference[];
  readonly operationalSeverity: OperationalSeverity;
  readonly declaredRelevance?: Readonly<{ level: Exclude<StrategicRelevanceLevel, "unresolved">; rationale: string; basisRelationshipIds: readonly string[] }> | null;
}): StrategicContext {
  const issues: string[] = [];
  const ids = new Set(input.references.map((item) => item.id));
  if (ids.size !== input.references.length) issues.push("duplicate-reference-id");
  for (const reference of input.references) {
    if (reference.workspaceId !== input.workspaceId) issues.push(`workspace-mismatch:${reference.id}`);
    if (reference.modelId !== input.modelId) issues.push(`model-mismatch:${reference.id}`);
    if (reference.authorityId.startsWith("EI:2")) issues.push(`duplicate-authority:${reference.id}`);
  }
  for (const relationship of input.relationships) {
    if (!ids.has(relationship.sourceId) || !ids.has(relationship.targetId)) issues.push(`relationship-endpoint-missing:${relationship.relationshipId}`);
    if (relationship.evidenceRefs.length === 0) issues.push(`relationship-evidence-missing:${relationship.relationshipId}`);
  }
  const path = pathFromStrategyToReality(input.references, input.relationships);
  const declared = input.declaredRelevance ?? null;
  const relationshipIds = new Set(input.relationships.map((item) => item.relationshipId));
  const declaredValid = Boolean(declared && declared.rationale.trim() && declared.basisRelationshipIds.length > 0 && declared.basisRelationshipIds.every((id) => relationshipIds.has(id)) && path);
  const strategicRelevance: StrategicRelevance = declaredValid
    ? { level: declared!.level, rationale: declared!.rationale, basisRelationshipIds: unique(declared!.basisRelationshipIds), source: "explicit-configuration" }
    : { level: "unresolved", rationale: null, basisRelationshipIds: [], source: "unresolved" };
  return deepFreeze({ contextId: input.contextId, workspaceId: input.workspaceId, modelId: input.modelId, references: [...input.references], relationships: [...input.relationships], operationalSeverity: input.operationalSeverity, strategicRelevance, valid: issues.length === 0, issues: unique(issues) });
}

export function resolveStrategicTrace(context: StrategicContext): StrategicTrace {
  const path = pathFromStrategyToReality(context.references, context.relationships);
  if (path) return deepFreeze({ contextId: context.contextId, referenceIds: path.refs, relationshipIds: path.rels, complete: context.valid, unresolvedAt: null });
  const kinds = new Set(context.references.map((item) => item.kind));
  const unresolvedAt: StrategicReferenceKind = !kinds.has("strategy") ? "strategy" : !kinds.has("objective") ? "objective" : !kinds.has("kpi") ? "kpi" : "reality";
  return deepFreeze({ contextId: context.contextId, referenceIds: [], relationshipIds: [], complete: false, unresolvedAt });
}

export type StrategicEi1Trace = Readonly<{
  ei1: ExecutiveIntelligenceTrace;
  strategicContext: StrategicContext;
  strategicTrace: StrategicTrace;
  compatible: boolean;
  issues: readonly string[];
}>;

export function enrichEi1TraceWithStrategicContext(input: { readonly ei1: ExecutiveIntelligenceTrace; readonly strategicContext: StrategicContext }): StrategicEi1Trace {
  const issues: string[] = [];
  if (input.ei1.workspaceId !== input.strategicContext.workspaceId) issues.push("ei1-strategic-workspace-mismatch");
  const realityIds = input.strategicContext.references.filter((item) => item.kind === "reality").map((item) => item.id);
  if (input.ei1.reality && !realityIds.includes(input.ei1.reality.recordId)) issues.push("ei1-strategic-reality-mismatch");
  const strategicTrace = resolveStrategicTrace(input.strategicContext);
  return deepFreeze({ ei1: input.ei1, strategicContext: input.strategicContext, strategicTrace, compatible: input.ei1.valid && input.strategicContext.valid && issues.length === 0, issues });
}

export type StrategicAdvisorStatus = "KNOWN" | "LINKED" | "UNRESOLVED";
export type StrategicAdvisorProjection = Readonly<{
  contextId: string;
  factsOnly: true;
  authority: false;
  operationalSeverity: OperationalSeverity;
  strategicRelevance: StrategicRelevanceLevel;
  answers: Readonly<Record<"whyKpiMatters" | "supportedObjective" | "affectedStrategy" | "objectiveKpis" | "knownRisks" | "relevantReality", Readonly<{ status: StrategicAdvisorStatus; referenceIds: readonly string[] }>>>;
}>;

export function projectStrategicContextForAdvisor(context: StrategicContext): StrategicAdvisorProjection {
  const trace = resolveStrategicTrace(context);
  const byKind = (kind: StrategicReferenceKind) => context.references.filter((item) => item.kind === kind).map((item) => item.id);
  const state = (kind: StrategicReferenceKind, requireLink = false) => {
    const ids = byKind(kind);
    return Object.freeze({ status: ids.length === 0 ? "UNRESOLVED" as const : requireLink && !trace.complete ? "KNOWN" as const : "LINKED" as const, referenceIds: Object.freeze(ids) });
  };
  const risks = byKind("risk");
  const riskLinked = context.relationships.some((item) => item.type === "strategy-threatened-by-risk" || item.type === "objective-threatened-by-risk");
  return deepFreeze({ contextId: context.contextId, factsOnly: true, authority: false, operationalSeverity: context.operationalSeverity, strategicRelevance: context.strategicRelevance.level, answers: { whyKpiMatters: Object.freeze({ status: trace.complete && context.strategicRelevance.level !== "unresolved" ? "LINKED" as const : byKind("kpi").length ? "KNOWN" as const : "UNRESOLVED" as const, referenceIds: trace.referenceIds }), supportedObjective: state("objective", true), affectedStrategy: state("strategy", true), objectiveKpis: state("kpi", true), knownRisks: Object.freeze({ status: risks.length === 0 ? "UNRESOLVED" as const : riskLinked ? "LINKED" as const : "KNOWN" as const, referenceIds: Object.freeze(risks) }), relevantReality: state("reality", true) } });
}

export const strategicStageCompatibility = deepFreeze({
  compatibleAsGenericExecutiveObjects: true,
  specializedKindsPresent: false,
  existingTopologyPreserved: true,
  zPlane: 0,
  clickToCenterPreserved: true,
  fixedCameraPreserved: true,
  strategicAuthorityOwnedByStage: false,
});

export type StrategicIntelligenceCertification = Readonly<{
  certified: boolean;
  authorityPreserved: boolean;
  explicitRelationshipsOnly: boolean;
  strategicTraceComplete: boolean;
  severitySeparatedFromRelevance: boolean;
  ei1Compatible: boolean;
  checks: readonly string[];
}>;

export function certifyStrategicIntelligence(input: StrategicEi1Trace): StrategicIntelligenceCertification {
  const authorityPreserved = input.strategicContext.references.every((item) => !item.authorityId.startsWith("EI:2"));
  const explicitRelationshipsOnly = input.strategicContext.relationships.every((item) => item.configured && item.causal === false && item.evidenceRefs.length > 0);
  const strategicTraceComplete = input.strategicTrace.complete;
  const severitySeparatedFromRelevance = STRATEGIC_INTELLIGENCE_BOUNDARY.computesPriority === false && input.strategicContext.strategicRelevance.source !== "unresolved";
  const checks = Object.freeze([`authority:${authorityPreserved ? "passed" : "failed"}`, `relationships:${explicitRelationshipsOnly ? "passed" : "failed"}`, `trace:${strategicTraceComplete ? "passed" : "failed"}`, `severity-relevance:${severitySeparatedFromRelevance ? "passed" : "failed"}`, `ei1:${input.compatible ? "passed" : "failed"}`]);
  return deepFreeze({ certified: authorityPreserved && explicitRelationshipsOnly && strategicTraceComplete && severitySeparatedFromRelevance && input.compatible, authorityPreserved, explicitRelationshipsOnly, strategicTraceComplete, severitySeparatedFromRelevance, ei1Compatible: input.compatible, checks });
}
