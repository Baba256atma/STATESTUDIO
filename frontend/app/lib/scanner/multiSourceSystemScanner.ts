import type { SceneJson, SceneLoop, SceneObject, SemanticObjectMeta } from "../sceneTypes";
import type { ScannerIntelligenceHints, ScannerMode, ScannerRelation, ScannerResult } from "../workspace/scannerContract";
import {
  interpretScannerOutputForDomain,
  type NexoraScannerEntityCandidate,
  type NexoraScannerLoopCandidate,
  type NexoraScannerRelationCandidate,
} from "../domain/domainScannerMapping";
import {
  assembleDomainProject,
  type NexoraDomainProjectAssemblyInput,
  type NexoraDomainProjectAssemblyResult,
  type NexoraDomainProjectKpiHint,
  type NexoraDomainProjectObject,
  type NexoraDomainProjectRelation,
  type NexoraDomainProjectScenarioHint,
  type NexoraDomainProjectLoop,
} from "../domain/domainProjectAssembly";
import {
  integrateDomainProjectIntoRuntime,
  type NexoraDomainRuntimeIntegrationResult,
} from "../runtime/domainRuntimeIntegration";

export type MultiSourceScannerSourceType =
  | "plain_text"
  | "document_text"
  | "webpage_text"
  | "repository_index"
  | "structured_json"
  | "dataset_summary"
  | "api_snapshot"
  | "repository"
  | "document"
  | "pdf_report"
  | "web_page"
  | "architecture"
  | "dataset"
  | "system_description";

export type ScannerInputSourceType = MultiSourceScannerSourceType;

export type ScannerInput = {
  source: {
    type: ScannerInputSourceType | string;
    id?: string;
    uri?: string;
    label?: string;
    metadata?: Record<string, unknown>;
    tags?: string[];
  };
  mode?: ScannerMode;
  targetProjectId?: string;
  payload:
    | string
    | {
        text?: string;
        files?: Array<{ path: string; content?: string; summary?: string; tags?: string[] }>;
        nodes?: Array<{ id?: string; label?: string; type?: string; tags?: string[]; metadata?: Record<string, unknown> }>;
        edges?: Array<{ from: string; to: string; type?: string; weight?: number; label?: string; metadata?: Record<string, unknown> }>;
        metadata?: Record<string, unknown>;
        tags?: string[];
      };
};

export interface MultiSourceScannerInput {
  sources: ScannerInput[];
  mode?: ScannerMode;
  targetProjectId?: string;
  domainId?: string | null;
  domainPack?: any | null;
  panelRegistry?: Record<string, any>;
  scenarioKpiMapping?: any | null;
  adviceConfig?: any | null;
  cockpitComposition?: any | null;
}

export interface ScannerNormalizedContentBlock {
  id: string;
  text: string;
  label?: string;
  tags: string[];
  metadata?: Record<string, unknown>;
}

export interface NormalizedScannerSource {
  sourceId: string;
  sourceType: MultiSourceScannerSourceType | string;
  label: string;
  tags: string[];
  contentBlocks: ScannerNormalizedContentBlock[];
  prebuiltNodes: Array<{ id?: string; label?: string; type?: string; tags?: string[]; metadata?: Record<string, unknown> }>;
  prebuiltEdges: Array<{ from: string; to: string; type?: string; weight?: number; label?: string; metadata?: Record<string, unknown> }>;
  metadata?: Record<string, unknown>;
}

export interface ScannerProvenance {
  sourceId: string;
  sourceType: string;
  blockId?: string;
  evidence: string;
  reason: string;
}

export interface MultiSourceEntityCandidate extends NexoraScannerEntityCandidate {
  confidence: number;
  provenance: ScannerProvenance[];
}

export interface MultiSourceRelationCandidate extends NexoraScannerRelationCandidate {
  confidence: number;
  inferredRelationType?: string | null;
  provenance: ScannerProvenance[];
}

export interface MultiSourceLoopCandidate extends NexoraScannerLoopCandidate {
  confidence: number;
  inferredLoopType?: string | null;
  provenance: ScannerProvenance[];
}

export interface MultiSourceKpiCandidate {
  id: string;
  label: string;
  tags: string[];
  relatedObjectIds: string[];
  provenance: ScannerProvenance[];
  confidence: number;
}

export interface MultiSourceScenarioCandidate {
  id: string;
  label: string;
  tags: string[];
  relatedObjectIds: string[];
  relatedKpiIds: string[];
  severityHint?: "low" | "moderate" | "high" | "critical";
  provenance: ScannerProvenance[];
  confidence: number;
}

export interface MultiSourceScannerMergedModel {
  entities: MultiSourceEntityCandidate[];
  relations: MultiSourceRelationCandidate[];
  loops: MultiSourceLoopCandidate[];
  kpiHints: MultiSourceKpiCandidate[];
  scenarioHints: MultiSourceScenarioCandidate[];
  inferredDomainId?: string | null;
  inferredTags: string[];
}

export interface MultiSourceScannerPipelineResult {
  normalizedSources: NormalizedScannerSource[];
  mergedModel: MultiSourceScannerMergedModel;
  domainInterpretation: ReturnType<typeof interpretScannerOutputForDomain>;
  projectAssemblyInput: NexoraDomainProjectAssemblyInput;
  project: NexoraDomainProjectAssemblyResult;
  runtimeIntegration: NexoraDomainRuntimeIntegrationResult;
  scannerResult: ScannerResult;
  notes: string[];
}

const DEFAULT_KIND = "component";
type DetectedEntityKind = "service" | "module" | "resource" | "actor" | "process" | "asset" | "component";

function clamp01(v: number): number {
  return Math.max(0, Math.min(1, Number.isFinite(v) ? v : 0));
}

function slug(value: string): string {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9_ -]+/g, "")
    .replace(/\s+/g, "_")
    .replace(/^_+|_+$/g, "");
}

function normalizeWords(text: string): string[] {
  return String(text || "")
    .toLowerCase()
    .split(/[^a-z0-9_]+/g)
    .map((x) => x.trim())
    .filter(Boolean);
}

function uniq(values: string[]): string[] {
  return Array.from(new Set(values.map((value) => String(value ?? "").trim()).filter(Boolean)));
}

function normalizeText(value: unknown): string {
  return String(value ?? "").replace(/\s+/g, " ").trim();
}

function classifyKind(label: string): DetectedEntityKind {
  const t = String(label || "").toLowerCase();
  if (/(api|service|gateway|worker|daemon)/.test(t)) return "service";
  if (/(module|package|library|component|repository)/.test(t)) return "module";
  if (/(db|database|queue|topic|cache|bucket|storage|cluster|dataset)/.test(t)) return "resource";
  if (/(user|admin|client|partner|vendor|operator|customer|supplier)/.test(t)) return "actor";
  if (/(pipeline|process|workflow|job|sync|etl)/.test(t)) return "process";
  if (/(payment|credential|secret|token|account|inventory|cash|liquidity|portfolio)/.test(t)) return "asset";
  return DEFAULT_KIND;
}

function classifyRiskKind(label: string): string | undefined {
  const t = String(label || "").toLowerCase();
  if (/(vulnerab|threat|attack|patch|security|cyber)/.test(t)) return "security_exposure";
  if (/(delay|latency|queue|backlog|timeout|failure|outage)/.test(t)) return "flow_delay";
  if (/(cash|liquidity|debt|margin|drawdown)/.test(t)) return "financial_pressure";
  if (/(supplier|dependency|single point|bottleneck)/.test(t)) return "dependency_fragility";
  return undefined;
}

function classifyCategory(kind: string): string {
  if (kind === "asset") return "strategic_asset";
  if (kind === "resource") return "dependency";
  if (kind === "service") return "operational";
  if (kind === "process") return "flow";
  if (kind === "actor") return "external";
  return "supporting";
}

function inferRelationType(text: string): string {
  const t = String(text || "").toLowerCase();
  if (/(data|event|stream|emit|publish|consume)/.test(t)) return "flows_to";
  if (/(depends|dependency|requires|needs|relies on)/.test(t)) return "depends_on";
  if (/(calls|request|http|rpc|api|communicat)/.test(t)) return "signals";
  if (/(amplif|increase|worsen|cascade|spread)/.test(t)) return "amplifies";
  if (/(reduce|stabil|dampen|restore|balance)/.test(t)) return "reduces";
  if (/(risk|exposure|transfer)/.test(t)) return "transfers_risk";
  if (/(then|after|before|sequence|step|causes|triggers)/.test(t)) return "causes";
  return "depends_on";
}

function inferLoopType(text: string): string {
  const t = String(text || "").toLowerCase();
  if (/(cascade|spread|failure chain|propagation)/.test(t)) return "risk_cascade";
  if (/(pressure|stress|strain|load)/.test(t)) return "pressure";
  if (/(constraint|bottleneck|limit|scarcity)/.test(t)) return "constraint";
  if (/(buffer|reserve|recovery|absorb)/.test(t)) return "buffer_recovery";
  if (/(balance|stability|equilibrium)/.test(t)) return "balancing";
  if (/(response|intervention|mitigation|strategy)/.test(t)) return "strategic_response";
  return "reinforcing";
}

function normalizeSourceType(sourceType: string): MultiSourceScannerSourceType | string {
  const t = String(sourceType || "").toLowerCase().trim();
  switch (t) {
    case "plain_text":
    case "document_text":
    case "webpage_text":
    case "repository_index":
    case "structured_json":
    case "dataset_summary":
    case "api_snapshot":
      return t;
    case "document":
    case "pdf_report":
      return "document_text";
    case "web_page":
      return "webpage_text";
    case "repository":
    case "repo":
      return "repository_index";
    case "dataset":
      return "dataset_summary";
    case "architecture":
    case "system_description":
    default:
      return "plain_text";
  }
}

function sourceTypeTags(sourceType: string): string[] {
  switch (sourceType) {
    case "repository_index":
      return ["repository", "codebase"];
    case "structured_json":
      return ["structured", "json"];
    case "dataset_summary":
      return ["dataset", "summary"];
    case "api_snapshot":
      return ["api", "snapshot"];
    case "webpage_text":
      return ["webpage", "external"];
    case "document_text":
      return ["document", "report"];
    default:
      return ["text"];
  }
}

function blockId(sourceId: string, index: number): string {
  return `${sourceId}_block_${index + 1}`;
}

function normalizeSingleSource(input: ScannerInput): NormalizedScannerSource {
  const sourceType = normalizeSourceType(String(input?.source?.type ?? "plain_text"));
  const sourceId = normalizeText(input?.source?.id ?? `source_${slug(String(input?.source?.label ?? sourceType)) || Date.now().toString(36)}`) || `source_${Date.now().toString(36)}`;
  const label = normalizeText(input?.source?.label ?? sourceId) || sourceId;
  const tags = uniq([...(Array.isArray(input?.source?.tags) ? input.source.tags : []), ...sourceTypeTags(String(sourceType))]);
  const contentBlocks: ScannerNormalizedContentBlock[] = [];
  const prebuiltNodes: NormalizedScannerSource["prebuiltNodes"] = [];
  const prebuiltEdges: NormalizedScannerSource["prebuiltEdges"] = [];

  const pushBlock = (text: string, idx: number, extra?: Partial<ScannerNormalizedContentBlock>) => {
    const normalized = normalizeText(text);
    if (!normalized) return;
    contentBlocks.push({
      id: blockId(sourceId, idx),
      text: normalized,
      tags: uniq([...(extra?.tags ?? []), ...tags]),
      ...(extra?.label ? { label: normalizeText(extra.label) } : {}),
      ...(extra?.metadata ? { metadata: extra.metadata } : {}),
    });
  };

  if (typeof input.payload === "string") {
    pushBlock(input.payload, 0, { label });
  } else {
    const payload = input.payload ?? {};
    if (typeof payload.text === "string" && payload.text.trim()) {
      pushBlock(payload.text, contentBlocks.length, { label });
    }
    if (Array.isArray(payload.files)) {
      payload.files.forEach((file, index) => {
        const text = normalizeText(file?.content ?? file?.summary ?? file?.path ?? "");
        if (!text) return;
        pushBlock(text, contentBlocks.length + index, {
          label: normalizeText(file?.path ?? file?.summary ?? `file_${index + 1}`),
          tags: uniq([...(file?.tags ?? []), "file"]),
          metadata: { path: file?.path ?? null },
        });
      });
    }
    if (Array.isArray(payload.nodes)) prebuiltNodes.push(...payload.nodes);
    if (Array.isArray(payload.edges)) prebuiltEdges.push(...payload.edges);

    if (sourceType === "structured_json" || sourceType === "api_snapshot" || sourceType === "dataset_summary") {
      const rawSummary = normalizeText(JSON.stringify(payload.metadata ?? payload).slice(0, 4000));
      if (rawSummary) {
        pushBlock(rawSummary, contentBlocks.length, {
          label: `${label} structured summary`,
          tags: ["structured"],
        });
      }
    }
  }

  return {
    sourceId,
    sourceType,
    label,
    tags,
    contentBlocks,
    prebuiltNodes,
    prebuiltEdges,
    metadata:
      input?.source?.metadata && typeof input.source.metadata === "object"
        ? input.source.metadata
        : undefined,
  };
}

export function normalizeScannerSources(input: MultiSourceScannerInput): NormalizedScannerSource[] {
  return (Array.isArray(input.sources) ? input.sources : []).map((source) => normalizeSingleSource(source));
}

function buildProvenance(source: NormalizedScannerSource, block: ScannerNormalizedContentBlock | null, evidence: string, reason: string): ScannerProvenance {
  return {
    sourceId: source.sourceId,
    sourceType: String(source.sourceType),
    ...(block ? { blockId: block.id } : {}),
    evidence: normalizeText(evidence).slice(0, 240),
    reason: normalizeText(reason),
  };
}

function phraseCandidates(text: string): string[] {
  const matches = String(text || "").match(/\b([A-Za-z][A-Za-z0-9_-]{2,}(?:\s+[A-Za-z0-9_-]{2,}){0,2})\b/g) ?? [];
  return uniq(matches.map((value) => normalizeText(value))).filter((value) => value.length >= 3);
}

function extractEntitiesFromSources(sources: NormalizedScannerSource[]): MultiSourceEntityCandidate[] {
  const out = new Map<string, MultiSourceEntityCandidate>();

  const upsert = (candidate: MultiSourceEntityCandidate) => {
    const existing = out.get(candidate.id);
    if (!existing) {
      out.set(candidate.id, candidate);
      return;
    }
    out.set(candidate.id, {
      ...existing,
      label: existing.label.length >= candidate.label.length ? existing.label : candidate.label,
      tags: uniq([...(existing.tags ?? []), ...(candidate.tags ?? [])]),
      confidence: Math.max(existing.confidence, candidate.confidence),
      provenance: [...existing.provenance, ...candidate.provenance],
      metadata: {
        ...(existing.metadata ?? {}),
        ...(candidate.metadata ?? {}),
      },
    });
  };

  sources.forEach((source) => {
    source.prebuiltNodes.forEach((node, index) => {
      const label = normalizeText(node?.label ?? node?.id ?? `Node ${index + 1}`);
      if (!label) return;
      const id = normalizeText(node?.id ?? `obj_${slug(label)}`) || `obj_${index + 1}`;
      const provenance = [buildProvenance(source, null, label, "Prebuilt node provided by source payload.")];
      upsert({
        id,
        label,
        description: typeof node?.type === "string" ? node.type : undefined,
        tags: uniq([...(node?.tags ?? []), ...normalizeWords(label)]),
        sourceType: String(source.sourceType),
        confidence: 0.78,
        provenance,
        metadata: {
          source_label: source.label,
          kind: classifyKind(String(node?.type ?? label)),
        },
      });
    });

    source.contentBlocks.forEach((block) => {
      phraseCandidates(block.text).forEach((label) => {
        const words = normalizeWords(label);
        const hasSignal =
          /(service|module|api|gateway|db|database|queue|cache|pipeline|inventory|supplier|payment|firewall|server|liquidity|risk|customer|portfolio|market|pricing)/i.test(
            label
          ) || words.length === 1;
        if (!hasSignal) return;
        const id = `obj_${slug(label)}`;
        if (!id) return;
        upsert({
          id,
          label,
          tags: uniq([...words, ...block.tags]),
          sourceType: String(source.sourceType),
          confidence: 0.62,
          provenance: [buildProvenance(source, block, label, "Detected entity phrase in normalized content block.")],
          metadata: {
            kind: classifyKind(label),
            risk_kind: classifyRiskKind(label),
            source_label: source.label,
          },
        });
      });
    });
  });

  return Array.from(out.values()).slice(0, 80);
}

function relationBetween(text: string, a: string, b: string): boolean {
  const lower = text.toLowerCase();
  return lower.includes(a.toLowerCase()) && lower.includes(b.toLowerCase()) && /(depend|requires|uses|feeds|calls|connect|flow|risk|pressure|block|stabil)/.test(lower);
}

function extractRelationsFromSources(
  sources: NormalizedScannerSource[],
  entities: MultiSourceEntityCandidate[]
): MultiSourceRelationCandidate[] {
  const out = new Map<string, MultiSourceRelationCandidate>();
  const byLabel = entities.map((entity) => ({ id: entity.id, label: entity.label.toLowerCase() }));

  const upsert = (candidate: MultiSourceRelationCandidate) => {
    const existing = out.get(candidate.id);
    if (!existing) {
      out.set(candidate.id, candidate);
      return;
    }
    out.set(candidate.id, {
      ...existing,
      tags: uniq([...(existing.tags ?? []), ...(candidate.tags ?? [])]),
      confidence: Math.max(existing.confidence, candidate.confidence),
      provenance: [...existing.provenance, ...candidate.provenance],
      metadata: {
        ...(existing.metadata ?? {}),
        ...(candidate.metadata ?? {}),
      },
    });
  };

  sources.forEach((source) => {
    source.prebuiltEdges.forEach((edge) => {
      const relationType = normalizeText(edge?.type ?? edge?.label ?? inferRelationType(String(edge?.type ?? edge?.label ?? "")));
      const id = `rel_${slug(`${edge.from}_${edge.to}_${relationType}`)}`;
      upsert({
        id,
        from: normalizeText(edge.from),
        to: normalizeText(edge.to),
        label: normalizeText(edge?.label ?? relationType),
        description: `Prebuilt relation from ${source.label}`,
        tags: uniq([relationType, ...source.tags]),
        sourceType: String(source.sourceType),
        confidence: clamp01(Number(edge?.weight ?? 0.76)),
        inferredRelationType: relationType,
        provenance: [buildProvenance(source, null, `${edge.from} -> ${edge.to}`, "Prebuilt edge provided by source payload.")],
        metadata: edge?.metadata ?? {},
      });
    });

    source.contentBlocks.forEach((block) => {
      const lower = block.text.toLowerCase();
      const arrow = /([a-z0-9_-]{3,})\s*(?:->|=>|→)\s*([a-z0-9_-]{3,})/gi;
      let match: RegExpExecArray | null = null;
      while ((match = arrow.exec(lower))) {
        const from = byLabel.find((item) => item.label.includes(match![1]));
        const to = byLabel.find((item) => item.label.includes(match![2]));
        if (!from || !to) continue;
        const relationType = inferRelationType(block.text);
        const id = `rel_${slug(`${from.id}_${to.id}_${relationType}`)}`;
        upsert({
          id,
          from: from.id,
          to: to.id,
          label: relationType.replace(/_/g, " "),
          tags: uniq([relationType, ...block.tags]),
          sourceType: String(source.sourceType),
          confidence: 0.72,
          inferredRelationType: relationType,
          provenance: [buildProvenance(source, block, `${match[1]} -> ${match[2]}`, "Detected explicit directional relation in text.")],
        });
      }

      for (let i = 0; i < byLabel.length; i += 1) {
        for (let j = 0; j < byLabel.length; j += 1) {
          if (i === j) continue;
          const a = byLabel[i];
          const b = byLabel[j];
          if (!relationBetween(block.text, a.label, b.label)) continue;
          const relationType = inferRelationType(block.text);
          const id = `rel_${slug(`${a.id}_${b.id}_${relationType}`)}`;
          upsert({
            id,
            from: a.id,
            to: b.id,
            label: relationType.replace(/_/g, " "),
            tags: uniq([relationType, ...block.tags]),
            sourceType: String(source.sourceType),
            confidence: 0.56,
            inferredRelationType: relationType,
            provenance: [buildProvenance(source, block, `${a.label} / ${b.label}`, "Inferred relation from co-mentioned entities and dependency language.")],
          });
        }
      }
    });
  });

  return Array.from(out.values()).filter((relation) => relation.from && relation.to && relation.from !== relation.to).slice(0, 140);
}

function extractLoopHintsFromSources(
  sources: NormalizedScannerSource[],
  entities: MultiSourceEntityCandidate[],
  relations: MultiSourceRelationCandidate[]
): MultiSourceLoopCandidate[] {
  const out = new Map<string, MultiSourceLoopCandidate>();
  const relatedIds = uniq(relations.flatMap((relation) => [relation.from, relation.to]));

  const upsert = (candidate: MultiSourceLoopCandidate) => {
    const existing = out.get(candidate.id);
    if (!existing) {
      out.set(candidate.id, candidate);
      return;
    }
    out.set(candidate.id, {
      ...existing,
      nodes: uniq([...(existing.nodes ?? []), ...(candidate.nodes ?? [])]),
      tags: uniq([...(existing.tags ?? []), ...(candidate.tags ?? [])]),
      confidence: Math.max(existing.confidence, candidate.confidence),
      provenance: [...existing.provenance, ...candidate.provenance],
      metadata: { ...(existing.metadata ?? {}), ...(candidate.metadata ?? {}) },
    });
  };

  sources.forEach((source) => {
    source.contentBlocks.forEach((block) => {
      if (!/(loop|feedback|pressure|cascade|constraint|balance|buffer|recovery|intervention|stability|risk)/i.test(block.text)) {
        return;
      }
      const loopType = inferLoopType(block.text);
      const relatedObjects = entities
        .filter((entity) => block.text.toLowerCase().includes(entity.label.toLowerCase()))
        .map((entity) => entity.id)
        .slice(0, 4);
      const id = `loop_${slug(`${loopType}_${relatedObjects.join("_") || source.sourceId}`)}`;
      upsert({
        id,
        label: `${loopType.replace(/_/g, " ")} loop`,
        description: `Inferred from ${source.label}`,
        nodes: relatedObjects.length > 0 ? relatedObjects : relatedIds.slice(0, 3),
        tags: uniq([loopType, ...block.tags]),
        sourceType: String(source.sourceType),
        confidence: relatedObjects.length > 1 ? 0.66 : 0.54,
        inferredLoopType: loopType,
        provenance: [buildProvenance(source, block, block.text.slice(0, 120), "Detected loop-oriented language in normalized source content.")],
      });
    });
  });

  return Array.from(out.values()).filter((loop) => (loop.nodes ?? []).length >= 2).slice(0, 40);
}

const KPI_PATTERNS: Array<{ id: string; label: string; terms: string[] }> = [
  { id: "delivery_reliability", label: "Delivery Reliability", terms: ["delivery", "fulfillment", "logistics", "delay"] },
  { id: "liquidity_health", label: "Liquidity Health", terms: ["liquidity", "cash", "treasury", "drawdown"] },
  { id: "service_uptime", label: "Service Uptime", terms: ["uptime", "latency", "outage", "availability"] },
  { id: "strategic_position", label: "Strategic Position", terms: ["market share", "pricing", "competitor", "position"] },
];

const SCENARIO_PATTERNS: Array<{ id: string; label: string; severityHint: "low" | "moderate" | "high" | "critical"; terms: string[] }> = [
  { id: "supplier_delay_stress", label: "Supplier Delay Stress", severityHint: "high", terms: ["supplier", "delay", "logistics"] },
  { id: "liquidity_stress", label: "Liquidity Stress", severityHint: "critical", terms: ["liquidity", "cash", "margin", "drawdown"] },
  { id: "service_dependency_failure", label: "Service Dependency Failure", severityHint: "critical", terms: ["service", "database", "queue", "outage"] },
  { id: "competitor_pricing_pressure", label: "Competitor Pricing Pressure", severityHint: "high", terms: ["competitor", "pricing", "market share"] },
];

function extractKpiHintsFromSources(sources: NormalizedScannerSource[], entities: MultiSourceEntityCandidate[]): MultiSourceKpiCandidate[] {
  const out = new Map<string, MultiSourceKpiCandidate>();

  const upsert = (candidate: MultiSourceKpiCandidate) => {
    const existing = out.get(candidate.id);
    if (!existing) {
      out.set(candidate.id, candidate);
      return;
    }
    out.set(candidate.id, {
      ...existing,
      tags: uniq([...(existing.tags ?? []), ...(candidate.tags ?? [])]),
      relatedObjectIds: uniq([...(existing.relatedObjectIds ?? []), ...(candidate.relatedObjectIds ?? [])]),
      confidence: Math.max(existing.confidence, candidate.confidence),
      provenance: [...existing.provenance, ...candidate.provenance],
    });
  };

  sources.forEach((source) => {
    source.contentBlocks.forEach((block) => {
      const lower = block.text.toLowerCase();
      KPI_PATTERNS.forEach((pattern) => {
        if (!pattern.terms.some((term) => lower.includes(term))) return;
        const relatedObjectIds = entities
          .filter((entity) => pattern.terms.some((term) => entity.label.toLowerCase().includes(term) || lower.includes(entity.label.toLowerCase())))
          .map((entity) => entity.id)
          .slice(0, 4);
        upsert({
          id: pattern.id,
          label: pattern.label,
          tags: uniq([...pattern.terms, ...block.tags]),
          relatedObjectIds,
          confidence: 0.6,
          provenance: [buildProvenance(source, block, pattern.label, "Matched KPI-oriented operational or strategic language.")],
        });
      });
    });
  });

  return Array.from(out.values()).slice(0, 12);
}

function extractScenarioHintsFromSources(
  sources: NormalizedScannerSource[],
  entities: MultiSourceEntityCandidate[],
  kpiHints: MultiSourceKpiCandidate[]
): MultiSourceScenarioCandidate[] {
  const out = new Map<string, MultiSourceScenarioCandidate>();

  const upsert = (candidate: MultiSourceScenarioCandidate) => {
    const existing = out.get(candidate.id);
    if (!existing) {
      out.set(candidate.id, candidate);
      return;
    }
    out.set(candidate.id, {
      ...existing,
      tags: uniq([...(existing.tags ?? []), ...(candidate.tags ?? [])]),
      relatedObjectIds: uniq([...(existing.relatedObjectIds ?? []), ...(candidate.relatedObjectIds ?? [])]),
      relatedKpiIds: uniq([...(existing.relatedKpiIds ?? []), ...(candidate.relatedKpiIds ?? [])]),
      confidence: Math.max(existing.confidence, candidate.confidence),
      provenance: [...existing.provenance, ...candidate.provenance],
    });
  };

  sources.forEach((source) => {
    source.contentBlocks.forEach((block) => {
      const lower = block.text.toLowerCase();
      SCENARIO_PATTERNS.forEach((pattern) => {
        if (!pattern.terms.some((term) => lower.includes(term))) return;
        const relatedObjectIds = entities
          .filter((entity) => pattern.terms.some((term) => entity.label.toLowerCase().includes(term)))
          .map((entity) => entity.id)
          .slice(0, 4);
        const relatedKpiIds = kpiHints
          .filter((kpi) => pattern.terms.some((term) => kpi.tags.includes(term)))
          .map((kpi) => kpi.id);
        upsert({
          id: pattern.id,
          label: pattern.label,
          tags: uniq([...pattern.terms, ...block.tags]),
          relatedObjectIds,
          relatedKpiIds,
          severityHint: pattern.severityHint,
          confidence: 0.62,
          provenance: [buildProvenance(source, block, pattern.label, "Matched scenario-oriented pressure or disruption pattern.")],
        });
      });
    });
  });

  return Array.from(out.values()).slice(0, 12);
}

function detectDomainHint(sources: NormalizedScannerSource[]): string | undefined {
  const text = sources.flatMap((source) => source.contentBlocks.map((block) => block.text)).join(" ").toLowerCase();
  if (/(inventory|supplier|logistics|delivery|store|sku|retail|customer)/.test(text)) return "business";
  if (/(liquidity|margin|cash|debt|portfolio|treasury|finance|drawdown)/.test(text)) return "finance";
  if (/(service|database|queue|latency|uptime|incident|deployment|repository|api)/.test(text)) return "devops";
  if (/(roadmap|objective|capability|execution|strategy|competitor|pricing|market share)/.test(text)) return "strategy";
  return undefined;
}

function inferTags(
  entities: MultiSourceEntityCandidate[],
  relations: MultiSourceRelationCandidate[],
  loops: MultiSourceLoopCandidate[],
  kpis: MultiSourceKpiCandidate[],
  scenarios: MultiSourceScenarioCandidate[]
): string[] {
  return uniq([
    ...entities.flatMap((entity) => entity.tags ?? []),
    ...relations.flatMap((relation) => relation.tags ?? []),
    ...loops.flatMap((loop) => loop.tags ?? []),
    ...kpis.flatMap((kpi) => kpi.tags ?? []),
    ...scenarios.flatMap((scenario) => scenario.tags ?? []),
  ]);
}

function buildSceneLoop(loop: MultiSourceLoopCandidate, relatedKpiIds: string[]): SceneLoop {
  const nodes = uniq(loop.nodes ?? []);
  return {
    id: loop.id,
    type: loop.inferredLoopType ?? "reinforcing",
    label: loop.label ?? loop.id,
    edges: nodes.slice(0, -1).map((node, index) => ({
      from: node,
      to: nodes[index + 1] ?? nodes[0],
      kind: loop.inferredLoopType ?? "reinforcing",
      polarity: (loop.inferredLoopType ?? "reinforcing").includes("balanc") ? "negative" : "positive",
    })),
    kpis: relatedKpiIds,
    severity: clamp01(loop.confidence),
    strength: clamp01(loop.confidence),
    suggestions: ["Validate this loop against runtime and simulation outputs."],
    triggered_by: loop.provenance,
  };
}

function buildSceneJson(args: {
  projectId: string;
  projectName: string;
  domainId?: string | null;
  entities: MultiSourceEntityCandidate[];
  relations: MultiSourceRelationCandidate[];
  loops: MultiSourceLoopCandidate[];
  kpis: MultiSourceKpiCandidate[];
}): { sceneJson: SceneJson; semanticObjectMeta: Record<string, SemanticObjectMeta> } {
  const n = Math.max(1, args.entities.length);
  const radius = 6 + Math.min(args.entities.length, 20) * 0.15;
  const objects: SceneObject[] = args.entities.map((entity, index) => {
    const angle = (index / n) * Math.PI * 2;
    const zBand = ((index % 5) - 2) * 0.65;
    const kind = String(entity.metadata?.kind ?? classifyKind(entity.label));
    const category = classifyCategory(kind);
    const riskKind = classifyRiskKind(`${entity.label} ${(entity.tags ?? []).join(" ")}`);
    return {
      id: entity.id,
      label: entity.label,
      type: kind,
      position: [Math.cos(angle) * radius, Math.sin(angle) * (radius * 0.35), zBand],
      scale: category === "strategic_asset" ? 1.08 : 0.98,
      emphasis: category === "operational" || category === "strategic_asset" ? 0.72 : 0.58,
      category,
      role: kind,
      risk_kind: riskKind,
      tags: entity.tags,
    };
  });

  const semanticObjectMeta: Record<string, SemanticObjectMeta> = {};
  args.entities.forEach((entity) => {
    const kind = String(entity.metadata?.kind ?? classifyKind(entity.label));
    semanticObjectMeta[entity.id] = {
      canonical_name: entity.label.toLowerCase(),
      display_label: entity.label,
      category: classifyCategory(kind),
      role: kind,
      domain: args.domainId ?? undefined,
      tags: entity.tags,
      keywords: entity.tags,
      risk_kind: classifyRiskKind(`${entity.label} ${(entity.tags ?? []).join(" ")}`),
      related_terms: (entity.tags ?? []).slice(0, 5),
      dependencies: args.relations.filter((relation) => relation.from === entity.id).map((relation) => relation.to),
      business_meaning: `${entity.label} discovered by multi-source scanner extraction`,
      source_provenance: entity.provenance,
    };
  });

  const relatedKpiIds = args.kpis.map((kpi) => kpi.id);
  const sceneLoops = args.loops.map((loop) => buildSceneLoop(loop, relatedKpiIds.slice(0, 3)));
  const sceneRelations: ScannerRelation[] = args.relations.map((relation) => ({
    from: relation.from,
    to: relation.to,
    type: relation.inferredRelationType ?? relation.label ?? "depends_on",
    weight: Number(relation.confidence.toFixed(2)),
    label: relation.label,
    metadata: {
      provenance: relation.provenance,
    },
  }));

  return {
    sceneJson: {
      meta: {
        project_name: args.projectName,
        project_id: args.projectId,
        domain: args.domainId ?? "generic",
        source: "nexora_multi_source_scanner",
        generated_at: new Date().toISOString(),
      },
      domain_model: {},
      state_vector: { intensity: 0.42, volatility: 0.36 },
      scene: {
        camera: { pos: [0, 0, 16], lookAt: [0, 0, 0], autoFrame: true },
        objects,
        loops: sceneLoops,
        relations: sceneRelations as any,
      },
    },
    semanticObjectMeta,
  };
}

function buildProjectObjects(
  entities: MultiSourceEntityCandidate[],
  interpretation: ReturnType<typeof interpretScannerOutputForDomain>,
  domainId?: string | null
): NexoraDomainProjectObject[] {
  const entityMapping = new Map((interpretation.entityMappings ?? []).map((mapping) => [mapping.entityId, mapping]));
  return entities.map((entity) => {
    const mapping = entityMapping.get(entity.id);
    return {
      id: entity.id,
      label: entity.label,
      coreRole: mapping?.mappedCoreRole ?? null,
      domainId: domainId ?? interpretation.domainId ?? null,
      tags: uniq([...(entity.tags ?? []), mapping?.source ?? "", ...(mapping?.notes ?? [])]),
      sourceType: "scanner",
      metadata: {
        confidence: entity.confidence,
        provenance: entity.provenance,
      },
    };
  });
}

function buildProjectRelations(
  relations: MultiSourceRelationCandidate[],
  interpretation: ReturnType<typeof interpretScannerOutputForDomain>,
  domainId?: string | null
): NexoraDomainProjectRelation[] {
  const relationMapping = new Map((interpretation.relationMappings ?? []).map((mapping) => [mapping.relationId, mapping]));
  return relations.map((relation) => {
    const mapping = relationMapping.get(relation.id);
    return {
      id: relation.id,
      from: relation.from,
      to: relation.to,
      relationType: mapping?.mappedRelationType ?? relation.inferredRelationType ?? null,
      domainId: domainId ?? interpretation.domainId ?? null,
      tags: uniq([...(relation.tags ?? []), mapping?.source ?? "", ...(mapping?.notes ?? [])]),
      metadata: {
        confidence: relation.confidence,
        provenance: relation.provenance,
      },
    };
  });
}

function buildProjectLoops(
  loops: MultiSourceLoopCandidate[],
  interpretation: ReturnType<typeof interpretScannerOutputForDomain>,
  domainId?: string | null
): NexoraDomainProjectLoop[] {
  const loopMapping = new Map((interpretation.loopMappings ?? []).map((mapping) => [mapping.loopId, mapping]));
  return loops.map((loop) => {
    const mapping = loopMapping.get(loop.id);
    return {
      id: loop.id,
      label: loop.label ?? loop.id,
      loopType: mapping?.mappedLoopType ?? loop.inferredLoopType ?? null,
      nodes: uniq(loop.nodes ?? []),
      domainId: domainId ?? interpretation.domainId ?? null,
      tags: uniq([...(loop.tags ?? []), mapping?.source ?? "", ...(mapping?.notes ?? [])]),
      metadata: {
        confidence: loop.confidence,
        provenance: loop.provenance,
      },
    };
  });
}

function buildProjectKpiHintsFromCandidates(kpis: MultiSourceKpiCandidate[], domainId?: string | null): NexoraDomainProjectKpiHint[] {
  return kpis.map((kpi) => ({
    id: kpi.id,
    label: kpi.label,
    domainId: domainId ?? null,
    relatedObjectRoles: [],
    tags: uniq([...(kpi.tags ?? []), "scanner"]),
  }));
}

function buildProjectScenarioHintsFromCandidates(
  scenarios: MultiSourceScenarioCandidate[],
  domainId?: string | null
): NexoraDomainProjectScenarioHint[] {
  return scenarios.map((scenario) => ({
    id: scenario.id,
    label: scenario.label,
    domainId: domainId ?? null,
    relatedKpiIds: uniq(scenario.relatedKpiIds ?? []),
    ...(scenario.severityHint ? { severityHint: scenario.severityHint } : {}),
    tags: uniq([...(scenario.tags ?? []), "scanner"]),
  }));
}

function buildIntelligenceHints(args: {
  entities: MultiSourceEntityCandidate[];
  relations: MultiSourceRelationCandidate[];
  loops: MultiSourceLoopCandidate[];
  kpiHints: MultiSourceKpiCandidate[];
  scenarioHints: MultiSourceScenarioCandidate[];
  sources: NormalizedScannerSource[];
  domainId?: string | null;
}): ScannerIntelligenceHints {
  const inbound = new Map<string, number>();
  const outbound = new Map<string, number>();
  args.relations.forEach((relation) => {
    inbound.set(relation.to, (inbound.get(relation.to) ?? 0) + 1);
    outbound.set(relation.from, (outbound.get(relation.from) ?? 0) + 1);
  });

  const critical = args.entities
    .map((entity) => ({ id: entity.id, score: (inbound.get(entity.id) ?? 0) + (outbound.get(entity.id) ?? 0) + entity.confidence }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 6)
    .map((item) => item.id);

  const riskNodes = args.entities
    .filter((entity) => classifyRiskKind(`${entity.label} ${(entity.tags ?? []).join(" ")}`))
    .map((entity) => entity.id)
    .slice(0, 8);

  const categories = args.entities.reduce<Record<string, string>>((acc, entity) => {
    const kind = String(entity.metadata?.kind ?? classifyKind(entity.label));
    acc[entity.id] = classifyCategory(kind);
    return acc;
  }, {});

  const roles = args.entities.reduce<Record<string, string>>((acc, entity) => {
    acc[entity.id] = String(entity.metadata?.kind ?? classifyKind(entity.label));
    return acc;
  }, {});

  return {
    critical_objects: critical,
    risk_nodes: riskNodes,
    dependency_chains: args.relations.slice(0, 8).map((relation) => [relation.from, relation.to]),
    categories,
    roles,
    domain_hints: args.entities.reduce<Record<string, string[]>>((acc, entity) => {
      acc[entity.id] = uniq([String(args.domainId ?? ""), ...(entity.tags ?? [])]).filter(Boolean);
      return acc;
    }, {}),
    fragility_markers: Array.from(new Set([...critical.slice(0, 4), ...riskNodes.slice(0, 4)])),
    scenario_hints: args.scenarioHints.map((scenario) => scenario.id),
    kpi_hints: args.kpiHints.map((kpi) => kpi.id),
    source_provenance: args.sources.map((source) => ({
      source_id: source.sourceId,
      source_type: source.sourceType,
      block_count: source.contentBlocks.length,
    })),
  };
}

function buildProjectId(targetProjectId: string | undefined, domainId: string | null | undefined, entities: MultiSourceEntityCandidate[]): string {
  const explicit = normalizeText(targetProjectId ?? "");
  if (explicit) return explicit;
  const domain = normalizeText(domainId ?? "") || "nexora";
  const topEntity = entities[0]?.id ?? "system";
  return `scan_${domain}_${slug(topEntity) || "system"}`;
}

function buildProjectName(domainId: string | null | undefined, sourceCount: number): string {
  const domain = normalizeText(domainId ?? "");
  if (domain) return `Scanned ${domain.charAt(0).toUpperCase()}${domain.slice(1)} System`;
  return sourceCount > 1 ? "Scanned Multi-Source System" : "Scanned System";
}

export function runMultiSourceSystemScanner(input: MultiSourceScannerInput): MultiSourceScannerPipelineResult {
  const normalizedSources = normalizeScannerSources(input);
  const entities = extractEntitiesFromSources(normalizedSources);
  const relations = extractRelationsFromSources(normalizedSources, entities);
  const loops = extractLoopHintsFromSources(normalizedSources, entities, relations);
  const kpiHints = extractKpiHintsFromSources(normalizedSources, entities);
  const scenarioHints = extractScenarioHintsFromSources(normalizedSources, entities, kpiHints);
  const inferredDomainId = input.domainId ?? detectDomainHint(normalizedSources) ?? null;
  const inferredTags = inferTags(entities, relations, loops, kpiHints, scenarioHints);

  const mergedModel: MultiSourceScannerMergedModel = {
    entities,
    relations,
    loops,
    kpiHints,
    scenarioHints,
    inferredDomainId,
    inferredTags,
  };

  const domainInterpretation = interpretScannerOutputForDomain({
    domainId: inferredDomainId,
    domainPack: input.domainPack,
    entities: entities.map((entity) => ({
      id: entity.id,
      label: entity.label,
      description: entity.description,
      tags: entity.tags,
      sourceType: entity.sourceType,
      metadata: entity.metadata,
    })),
    relations: relations.map((relation) => ({
      id: relation.id,
      from: relation.from,
      to: relation.to,
      label: relation.label,
      description: relation.description,
      tags: relation.tags,
      sourceType: relation.sourceType,
      metadata: relation.metadata,
    })),
    loops: loops.map((loop) => ({
      id: loop.id,
      label: loop.label,
      description: loop.description,
      nodes: loop.nodes,
      tags: loop.tags,
      sourceType: loop.sourceType,
      metadata: loop.metadata,
    })),
  });

  const projectId = buildProjectId(input.targetProjectId, inferredDomainId, entities);
  const projectName = buildProjectName(inferredDomainId, normalizedSources.length);
  const projectAssemblyInput: NexoraDomainProjectAssemblyInput = {
    projectId,
    label: projectName,
    domainId: inferredDomainId,
    mode: input.mode ?? "create",
    domainPack: input.domainPack,
    panelRegistry: input.panelRegistry,
    scenarioKpiMapping: input.scenarioKpiMapping,
    adviceConfig: input.adviceConfig,
    scannerInterpretation: domainInterpretation,
    cockpitComposition: input.cockpitComposition,
    objects: buildProjectObjects(entities, domainInterpretation, inferredDomainId),
    relations: buildProjectRelations(relations, domainInterpretation, inferredDomainId),
    loops: buildProjectLoops(loops, domainInterpretation, inferredDomainId),
    scenarioHints: buildProjectScenarioHintsFromCandidates(scenarioHints, inferredDomainId),
    kpiHints: buildProjectKpiHintsFromCandidates(kpiHints, inferredDomainId),
    tags: inferredTags,
  };

  const project = assembleDomainProject(projectAssemblyInput);
  const runtimeIntegration = integrateDomainProjectIntoRuntime({
    project,
    mode: input.mode ?? inferredDomainId ?? null,
  });

  const { sceneJson, semanticObjectMeta } = buildSceneJson({
    projectId: project.projectId,
    projectName: project.label,
    domainId: inferredDomainId,
    entities,
    relations,
    loops,
    kpis: kpiHints,
  });

  const scannerResult: ScannerResult = {
    mode: input.mode === "enrich" ? "enrich" : "create",
    source: {
      type: normalizedSources.length > 1 ? "multi_source" : String(normalizedSources[0]?.sourceType ?? "plain_text"),
      id: normalizedSources.length > 1 ? `multi_${project.projectId}` : normalizedSources[0]?.sourceId,
      label: normalizedSources.length > 1 ? `${normalizedSources.length} sources` : normalizedSources[0]?.label,
      metadata: {
        source_count: normalizedSources.length,
        source_types: normalizedSources.map((source) => source.sourceType),
      },
    },
    targetProjectId: input.targetProjectId,
    project: {
      id: project.projectId,
      name: project.label,
      domain: inferredDomainId ?? undefined,
      description: "Generated by Nexora Multi-Source System Scanner",
      tags: inferredTags,
      metadata: {
        scanner_pipeline: "source_intake_normalization_extraction_merge_mapping_assembly_runtime",
      },
    },
    sceneJson,
    objects: sceneJson.scene.objects ?? [],
    semanticObjectMeta,
    relations: sceneJson.scene.relations as ScannerRelation[],
    loops: sceneJson.scene.loops,
    intelligenceHints: buildIntelligenceHints({
      entities,
      relations,
      loops,
      kpiHints,
      scenarioHints,
      sources: normalizedSources,
      domainId: inferredDomainId,
    }),
    warnings: [
      ...(entities.length < 3 ? ["Low entity count; provide richer source data for stronger analysis."] : []),
      ...(relations.length === 0 ? ["No explicit dependencies detected; model may be under-connected."] : []),
    ],
    unresolvedItems: [
      ...(entities.length < 3 ? ["Limited entity evidence."] : []),
      ...(loops.length === 0 ? ["No explicit loop hints detected."] : []),
    ],
    confidence: clamp01(
      0.42 +
        Math.min(entities.length, 20) * 0.015 +
        Math.min(relations.length, 40) * 0.005 +
        Math.min(normalizedSources.length, 5) * 0.03
    ),
    metadata: {
      scanner_contract: "nexora_multi_source_system_scanner_v1",
      detected_entities: entities.length,
      detected_relations: relations.length,
      detected_loops: loops.length,
      detected_kpis: kpiHints.length,
      detected_scenarios: scenarioHints.length,
      runtime_snapshot: runtimeIntegration.cockpitHints,
      scanner_project: project,
    },
  };

  return {
    normalizedSources,
    mergedModel,
    domainInterpretation,
    projectAssemblyInput,
    project,
    runtimeIntegration,
    scannerResult,
    notes: [
      `Normalized ${normalizedSources.length} source(s).`,
      `Merged ${entities.length} entities, ${relations.length} relations, and ${loops.length} loop hints.`,
      "Scanner remains modular: normalization, extraction, mapping, assembly, and runtime handoff are separate stages.",
    ],
  };
}

export function scanSourcesToScannerResult(input: MultiSourceScannerInput): ScannerResult {
  return runMultiSourceSystemScanner(input).scannerResult;
}

export function scanSystemToScannerResult(input: ScannerInput): ScannerResult {
  return scanSourcesToScannerResult({
    sources: [input],
    mode: input.mode,
    targetProjectId: input.targetProjectId,
  });
}
