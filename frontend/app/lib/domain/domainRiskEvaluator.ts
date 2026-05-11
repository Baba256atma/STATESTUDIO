import { calculateObjectFragilityScores } from "./domainFragilityScoring.ts";
import { getDomainDefinition } from "./domainRegistry.ts";
import { normalizeDomainId } from "./domainHelpers.ts";
import { dedupeBySignature, domainSignalDedupeSignature } from "./domainDedupe.ts";
import type { DomainObjectTemplate, DomainRiskSignal } from "./domainTypes.ts";
import type { DomainRiskSeverity, DomainRiskSignalResult } from "./domainRiskSignals.ts";

type EdgeView = {
  id?: string;
  from: string;
  to: string;
  relationshipType: string;
  weight: number;
};

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" ? (value as Record<string, unknown>) : {};
}

function objectId(object: unknown): string {
  return String(asRecord(object).id ?? "").trim();
}

function objectLabel(object: unknown): string {
  const record = asRecord(object);
  const semantic = asRecord(record.semantic);
  return String(record.label ?? record.name ?? semantic.display_label ?? record.id ?? "").trim();
}

function objectRole(object: unknown): DomainObjectTemplate["role"] | null {
  const record = asRecord(object);
  const meta = asRecord(record.meta);
  const semantic = asRecord(record.semantic);
  const raw = String(meta.semanticRole ?? semantic.role ?? record.role ?? "").trim();
  return isDomainRole(raw) ? raw : null;
}

function objectBlob(object: unknown): string {
  const record = asRecord(object);
  const meta = asRecord(record.meta);
  const semantic = asRecord(record.semantic);
  const values = [
    record.id,
    record.label,
    record.name,
    record.role,
    meta.templateId,
    meta.semanticRole,
    semantic.display_label,
    semantic.canonical_name,
    semantic.role,
    semantic.business_meaning,
    ...(Array.isArray(record.tags) ? record.tags : []),
    ...(Array.isArray(record.keywords) ? record.keywords : []),
    ...(Array.isArray(semantic.tags) ? semantic.tags : []),
    ...(Array.isArray(semantic.keywords) ? semantic.keywords : []),
  ];
  return values.join(" ").toLowerCase();
}

function isDomainRole(value: string): value is DomainObjectTemplate["role"] {
  return ["core", "input", "process", "constraint", "risk", "decision", "output", "monitor"].includes(value);
}

function edgeView(edge: unknown): EdgeView | null {
  const record = asRecord(edge);
  const metadata = asRecord(record.metadata);
  const from = String(record.from ?? "").trim();
  const to = String(record.to ?? "").trim();
  if (!from || !to) return null;
  const relationshipType = String(metadata.relationshipType ?? record.relationshipType ?? record.kind ?? record.type ?? "")
    .replace(/^domain_/, "")
    .trim();
  const weight = typeof record.weight === "number" && Number.isFinite(record.weight) ? record.weight : 0.55;
  return {
    id: String(record.id ?? "").trim() || undefined,
    from,
    to,
    relationshipType,
    weight,
  };
}

function clamp01(value: number): number {
  return Math.min(1, Math.max(0, Number.isFinite(value) ? value : 0));
}

function severityFromScore(score: number): DomainRiskSeverity {
  if (score >= 86) return "critical";
  if (score >= 66) return "high";
  if (score >= 36) return "medium";
  return "low";
}

function severityFromHint(hint: DomainRiskSignal["severityHint"]): DomainRiskSeverity {
  return hint === "high" ? "high" : hint === "medium" ? "medium" : "low";
}

function signalTypeForSignal(signal: DomainRiskSignal): DomainRiskSignalResult["signalType"] {
  const text = `${signal.id} ${signal.label} ${signal.aliases.join(" ")}`.toLowerCase();
  if (text.includes("delay") || text.includes("late") || text.includes("lead time")) return "delay";
  if (text.includes("capacity") || text.includes("bottleneck") || text.includes("shortage")) return "capacity";
  if (text.includes("threat") || text.includes("access") || text.includes("vulnerab") || text.includes("security")) return "security";
  if (text.includes("confidence") || text.includes("forecast")) return "confidence_drop";
  if (text.includes("exposure") || text.includes("compliance")) return "exposure";
  return "fragility";
}

function normalizeIdPart(value: unknown): string {
  return String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

function dedupeSignals(signals: DomainRiskSignalResult[]): DomainRiskSignalResult[] {
  return dedupeBySignature<DomainRiskSignalResult>(signals, domainSignalDedupeSignature);
}

function buildSignalId(parts: unknown[]): string {
  return `domain_risk_${parts.map(normalizeIdPart).filter(Boolean).join("_")}`.replace(/_+/g, "_");
}

export function evaluateDomainRiskSignals(params: {
  domainId: unknown;
  objects: unknown[];
  edges?: unknown[];
}): DomainRiskSignalResult[] {
  try {
    const domainId = normalizeDomainId(params.domainId);
    const domain = getDomainDefinition(domainId);
    const objects = Array.isArray(params.objects) ? params.objects : [];
    const edges = Array.isArray(params.edges) ? params.edges.map(edgeView).filter((edge): edge is EdgeView => Boolean(edge)) : [];
    const fragilityScores = calculateObjectFragilityScores({ objects, edges });
    const signals: DomainRiskSignalResult[] = [];

    for (const score of fragilityScores) {
      if (score.level === "stable") continue;
      const object = objects.find((candidate) => objectId(candidate) === score.objectId);
      const label = objectLabel(object);
      signals.push({
        id: buildSignalId([domainId, "fragility", score.objectId, score.level]),
        domainId,
        signalType: "fragility",
        label: `${label || score.objectId} fragility`,
        severity: severityFromScore(score.score),
        confidence: Number(clamp01(0.42 + score.score / 160).toFixed(2)),
        relatedObjectIds: [score.objectId],
        explanation: `${label || score.objectId} shows ${score.level} fragility from role and relationship pressure.`,
        recommendedPanel: "risk",
        metadata: {
          fragilityScore: score.score,
          fragilityLevel: score.level,
        },
      });
    }

    for (const object of objects) {
      const id = objectId(object);
      if (!id) continue;
      const connected = edges.filter((edge) => edge.from === id || edge.to === id);
      const outgoing = connected.filter((edge) => edge.from === id);
      const riskEdges = connected.filter((edge) => edge.relationshipType === "risk_path" || edge.relationshipType === "constraint");
      if (connected.length >= 3 || outgoing.length >= 3) {
        signals.push({
          id: buildSignalId([domainId, "dependency", id]),
          domainId,
          signalType: "dependency",
          label: `${objectLabel(object) || id} dependency concentration`,
          severity: connected.length >= 5 ? "critical" : "high",
          confidence: Number(clamp01(0.52 + connected.length * 0.08).toFixed(2)),
          relatedObjectIds: [id],
          relatedEdgeIds: connected.map((edge) => edge.id).filter((edgeId): edgeId is string => Boolean(edgeId)),
          explanation: `${objectLabel(object) || id} is connected to several relationship paths, increasing concentration exposure.`,
          recommendedPanel: "risk",
          metadata: {
            connectedEdgeCount: connected.length,
            outgoingEdgeCount: outgoing.length,
          },
        });
      }
      if (riskEdges.length > 0 && objectRole(object) !== "monitor") {
        signals.push({
          id: buildSignalId([domainId, "exposure", id]),
          domainId,
          signalType: "exposure",
          label: `${objectLabel(object) || id} exposure path`,
          severity: riskEdges.length > 1 ? "high" : "medium",
          confidence: Number(clamp01(0.48 + riskEdges.length * 0.14).toFixed(2)),
          relatedObjectIds: [id],
          relatedEdgeIds: riskEdges.map((edge) => edge.id).filter((edgeId): edgeId is string => Boolean(edgeId)),
          explanation: `${objectLabel(object) || id} participates in a risk or constraint path.`,
          recommendedPanel: "focus",
          metadata: {
            riskEdgeCount: riskEdges.length,
          },
        });
      }
    }

    for (const domainSignal of domain.riskSignals) {
      const tokens = [domainSignal.label, ...domainSignal.aliases].map((token) => token.toLowerCase());
      const relatedObjectIds = objects
        .filter((object) => tokens.some((token) => token && objectBlob(object).includes(token)))
        .map(objectId)
        .filter(Boolean);
      if (relatedObjectIds.length === 0) continue;
      signals.push({
        id: buildSignalId([domainId, domainSignal.id, relatedObjectIds.join("_")]),
        domainId,
        signalType: signalTypeForSignal(domainSignal),
        label: domainSignal.label,
        severity: severityFromHint(domainSignal.severityHint),
        confidence: Number(clamp01(0.58 + relatedObjectIds.length * 0.08).toFixed(2)),
        relatedObjectIds,
        explanation: domainSignal.explanation,
        recommendedPanel: "risk",
        metadata: {
          riskSignalId: domainSignal.id,
        },
      });
    }

    return dedupeSignals(signals);
  } catch {
    return [];
  }
}
