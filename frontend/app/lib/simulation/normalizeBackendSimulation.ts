type SimulationPropagationLink = {
  source: string;
  target: string;
  weight: number;
};

export type BackendSimulationContract = {
  summary: string | null;
  impacted_nodes: string[];
  propagation: SimulationPropagationLink[];
  risk_delta?: number;
};

type LooseRecord = Record<string, unknown>;

function asRecord(value: unknown): LooseRecord | null {
  return value && typeof value === "object" && !Array.isArray(value) ? (value as LooseRecord) : null;
}

function text(value: unknown): string | null {
  return typeof value === "string" && value.trim().length > 0 ? value.trim() : null;
}

function num(value: unknown): number | null {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

function normalizeImpactedNodes(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => {
      if (typeof item === "string") return item.trim();
      const record = asRecord(item);
      return text(record?.object_id) ?? text(record?.objectId) ?? text(record?.id) ?? "";
    })
    .filter(Boolean);
}

function normalizePropagation(value: unknown): SimulationPropagationLink[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => {
      const record = asRecord(item);
      if (!record) return null;
      const source = text(record.source) ?? text(record.from) ?? text(record.fromObjectId) ?? text(record.from_id);
      const target = text(record.target) ?? text(record.to) ?? text(record.toObjectId) ?? text(record.to_id);
      if (!source || !target) return null;
      return {
        source,
        target,
        weight: num(record.weight) ?? num(record.strength) ?? 0.6,
      };
    })
    .filter((item): item is SimulationPropagationLink => Boolean(item));
}

function unique(items: string[]) {
  return Array.from(new Set(items.filter(Boolean)));
}

export function normalizeBackendSimulation(input: unknown): BackendSimulationContract | null {
  const record = asRecord(input);
  if (!record) return null;

  const impact = asRecord(record.impact);
  const risk = asRecord(record.risk);

  const summary =
    text(record.summary) ??
    text(impact?.summary) ??
    text(risk?.summary) ??
    null;

  const impactedNodes = unique([
    ...normalizeImpactedNodes(record.impacted_nodes),
    ...normalizeImpactedNodes(record.affected_objects),
    ...normalizeImpactedNodes(impact?.directlyAffectedObjectIds),
    ...normalizeImpactedNodes(impact?.downstreamObjectIds),
  ]);

  const propagation = normalizePropagation(record.propagation);
  const riskDelta =
    num(record.risk_delta) ??
    num(record.risk_change) ??
    num(impact?.risk_change) ??
    undefined;

  if (!summary && impactedNodes.length === 0 && propagation.length === 0 && riskDelta == null) {
    return null;
  }

  return {
    summary,
    impacted_nodes: impactedNodes,
    propagation,
    ...(riskDelta == null ? {} : { risk_delta: riskDelta }),
  };
}
