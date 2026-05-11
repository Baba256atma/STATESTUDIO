import { calculateObjectFragilityScores, type DomainFragilityScore } from "./domainFragilityScoring.ts";
import { evaluateDomainRiskSignals } from "./domainRiskEvaluator.ts";
import { normalizeDomainId } from "./domainHelpers.ts";
import { dedupeBySignature, domainScenarioDedupeSignature } from "./domainDedupe.ts";
import type { DomainObjectTemplate } from "./domainTypes.ts";
import type { DomainRiskSignalResult } from "./domainRiskSignals.ts";
import type { DomainScenario, DomainScenarioImpact, DomainScenarioSeverity } from "./domainScenarioTypes.ts";

type EdgeView = {
  id?: string;
  from: string;
  to: string;
  relationshipType: string;
  weight: number;
};

const MAX_SCENARIOS = 4;

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

function normalizeIdPart(value: unknown): string {
  return String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

function clamp01(value: number): number {
  return Math.min(1, Math.max(0, Number.isFinite(value) ? value : 0));
}

function severityRank(severity: DomainScenarioSeverity): number {
  if (severity === "critical") return 4;
  if (severity === "high") return 3;
  if (severity === "medium") return 2;
  return 1;
}

function scenarioSeverity(signals: DomainRiskSignalResult[], score?: DomainFragilityScore): DomainScenarioSeverity {
  const highestSignal = signals.reduce<DomainScenarioSeverity>(
    (highest, signal) => severityRank(signal.severity) > severityRank(highest) ? signal.severity : highest,
    "low"
  );
  if (highestSignal === "critical") return "critical";
  if (highestSignal === "high") return "high";
  if ((score?.score ?? 0) >= 76) return "critical";
  if ((score?.score ?? 0) >= 51) return "high";
  if (highestSignal === "medium" || (score?.score ?? 0) >= 26) return "medium";
  return "low";
}

function labelFor(objects: unknown[], objectIdValue: string): string {
  return objectLabel(objects.find((object) => objectId(object) === objectIdValue)) || objectIdValue;
}

function defaultImpacts(type: DomainScenario["type"], severity: DomainScenarioSeverity): DomainScenarioImpact[] {
  const base = severity === "critical" ? 82 : severity === "high" ? 68 : severity === "medium" ? 48 : 28;
  if (type === "mitigation") {
    return [
      { category: "risk", direction: "decrease", magnitude: base },
      { category: "stability", direction: "increase", magnitude: Math.max(20, base - 12) },
    ];
  }
  if (type === "containment") {
    return [
      { category: "risk", direction: "decrease", magnitude: Math.max(22, base - 8) },
      { category: "confidence", direction: "increase", magnitude: Math.max(18, base - 20) },
    ];
  }
  if (type === "fallback") {
    return [
      { category: "timeline", direction: "increase", magnitude: Math.max(18, base - 22) },
      { category: "risk", direction: "decrease", magnitude: Math.max(20, base - 16) },
    ];
  }
  if (type === "expansion") {
    return [
      { category: "confidence", direction: "increase", magnitude: Math.max(18, base - 24) },
      { category: "cost", direction: "increase", magnitude: Math.max(15, base - 30) },
    ];
  }
  return [
    { category: "stability", direction: "increase", magnitude: Math.max(18, base - 18) },
    { category: "cost", direction: "neutral", magnitude: Math.max(10, base - 38) },
  ];
}

function scenarioForDomain(params: {
  domainId: ReturnType<typeof normalizeDomainId>;
  objectId: string;
  objectLabel: string;
  role: DomainObjectTemplate["role"] | null;
  severity: DomainScenarioSeverity;
  signalIds: string[];
  fragilityScore: number;
  edgeCount: number;
}): DomainScenario {
  const { domainId, objectId, objectLabel: label, role, severity, signalIds, fragilityScore, edgeCount } = params;
  let title = `Stabilize ${label}`;
  let description = `Reduce fragility around ${label} before it propagates further.`;
  let type: DomainScenario["type"] = "mitigation";
  let actions = [`Reduce dependency concentration around ${label}`, "Recheck risk after one operating cycle"];

  if (domainId === "supply_chain") {
    if (role === "input") {
      title = `Add backup source for ${label}`;
      description = `Create a fallback source so upstream delay does not force downstream delivery risk.`;
      actions = [`Qualify alternate ${label.toLowerCase()} path`, "Protect inventory buffer for critical flow"];
    } else if (role === "process") {
      title = `Increase buffer around ${label}`;
      description = `Strengthen the operating buffer around ${label} to absorb supplier or logistics delay.`;
      actions = [`Increase ${label.toLowerCase()} buffer`, "Prioritize flow for constrained items"];
    }
  } else if (domainId === "pmo") {
    type = role === "constraint" ? "optimization" : "mitigation";
    title = role === "constraint" ? `Reduce pressure on ${label}` : `Stabilize ${label} delivery path`;
    description = `Lower project pressure around ${label} before timeline, budget, or resource exposure compounds.`;
    actions = [`Re-sequence work tied to ${label}`, "Escalate tradeoff decision to delivery owners"];
  } else if (domainId === "finance") {
    type = "containment";
    title = `Reduce exposure around ${label}`;
    description = `Contain financial exposure around ${label} before it reduces operating flexibility.`;
    actions = [`Set guardrail for ${label.toLowerCase()}`, "Increase monitoring cadence on cash and exposure"];
  } else if (domainId === "security") {
    type = "containment";
    title = `Segment risk around ${label}`;
    description = `Contain exposure around ${label} so access or vulnerability paths do not widen.`;
    actions = [`Limit access path touching ${label}`, "Validate control coverage before expansion"];
  } else if (domainId === "saas_devops") {
    type = "mitigation";
    title = `Protect reliability around ${label}`;
    description = `Reduce operational fragility around ${label} before reliability degradation becomes user-visible.`;
    actions = [`Add runtime guardrail around ${label}`, "Monitor latency and incident signals"];
  }

  const confidence = clamp01(0.5 + signalIds.length * 0.08 + Math.min(0.22, fragilityScore / 300) + Math.min(0.12, edgeCount * 0.025));
  return {
    id: `domain_scenario_${domainId}_${normalizeIdPart(title)}_${normalizeIdPart(objectId)}`,
    domainId,
    title,
    description,
    type,
    confidence: Number(confidence.toFixed(2)),
    severity,
    relatedObjectIds: [objectId],
    relatedSignalIds: signalIds,
    impacts: defaultImpacts(type, severity),
    recommendedActions: actions.slice(0, 3),
    executiveSummary: `${title}: ${description}`,
    metadata: {
      source: "domain_scenario_engine",
      fragilityScore,
      edgeCount,
    },
  };
}

function fallbackScenario(domainId: ReturnType<typeof normalizeDomainId>, objectIds: string[]): DomainScenario {
  return {
    id: `domain_scenario_${domainId}_monitor_current_posture`,
    domainId,
    title: "Monitor current posture",
    description: "Keep the current system posture under review until stronger risk signals emerge.",
    type: "optimization",
    confidence: 0.42,
    severity: "low",
    relatedObjectIds: objectIds.slice(0, 2),
    impacts: [
      { category: "confidence", direction: "increase", magnitude: 22 },
      { category: "risk", direction: "neutral", magnitude: 12 },
    ],
    recommendedActions: ["Monitor key domain signals", "Add more structure before committing a major move"],
    executiveSummary: "No high-priority scenario is available yet; maintain monitoring and improve structure.",
    metadata: {
      source: "domain_scenario_engine",
      fallback: true,
    },
  };
}

function dedupeScenarios(scenarios: DomainScenario[]): DomainScenario[] {
  return dedupeBySignature<DomainScenario>(scenarios, domainScenarioDedupeSignature);
}

export function generateDomainScenarios(params: {
  domainId: unknown;
  objects: unknown[];
  edges?: unknown[];
  riskSignals?: DomainRiskSignalResult[];
  fragilityScores?: DomainFragilityScore[];
}): DomainScenario[] {
  try {
    const domainId = normalizeDomainId(params.domainId);
    const objects = Array.isArray(params.objects) ? params.objects : [];
    const edges = Array.isArray(params.edges) ? params.edges.map(edgeView).filter((edge): edge is EdgeView => Boolean(edge)) : [];
    const objectIds = objects.map(objectId).filter(Boolean);
    if (objectIds.length === 0) return [];

    const riskSignals = params.riskSignals ?? evaluateDomainRiskSignals({ domainId, objects, edges });
    const fragilityScores = params.fragilityScores ?? calculateObjectFragilityScores({ objects, edges });
    const scoresByObject = new Map(fragilityScores.map((score) => [score.objectId, score]));
    const signalsByObject = new Map<string, DomainRiskSignalResult[]>();
    for (const signal of riskSignals) {
      for (const id of signal.relatedObjectIds) {
        signalsByObject.set(id, [...(signalsByObject.get(id) ?? []), signal]);
      }
    }
    const scenarios: DomainScenario[] = [];
    const candidateIds = Array.from(new Set([
      ...riskSignals.flatMap((signal) => signal.relatedObjectIds),
      ...fragilityScores.filter((score) => score.level !== "stable").map((score) => score.objectId),
    ])).filter((id) => objectIds.includes(id));

    for (const id of candidateIds) {
      const object = objects.find((candidate) => objectId(candidate) === id);
      const objectSignals = signalsByObject.get(id) ?? [];
      const score = scoresByObject.get(id);
      const connectedEdges = edges.filter((edge) => edge.from === id || edge.to === id);
      scenarios.push(
        scenarioForDomain({
          domainId,
          objectId: id,
          objectLabel: labelFor(objects, id),
          role: objectRole(object),
          severity: scenarioSeverity(objectSignals, score),
          signalIds: objectSignals.map((signal) => signal.id),
          fragilityScore: score?.score ?? 0,
          edgeCount: connectedEdges.length,
        })
      );
    }

    const sorted = dedupeScenarios(scenarios)
      .sort((left, right) => {
        const severityDelta = severityRank(right.severity) - severityRank(left.severity);
        if (severityDelta !== 0) return severityDelta;
        const confidenceDelta = right.confidence - left.confidence;
        if (confidenceDelta !== 0) return confidenceDelta;
        return left.id.localeCompare(right.id);
      })
      .slice(0, MAX_SCENARIOS);

    return sorted.length ? sorted : [fallbackScenario(domainId, objectIds)];
  } catch {
    return [];
  }
}
