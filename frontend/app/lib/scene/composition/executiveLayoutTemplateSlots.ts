/**
 * P3 — Domain-specific executive layout slot maps (ground plane: Y = 0).
 */

import type { ExecutiveObjectLayoutRole } from "./normalizeExecutiveObjectLayout";
import type { ExecutiveLayoutTemplateId, ExecutiveLayoutTemplateSlot } from "./executiveLayoutTemplateTypes";

type LayoutObject = {
  id: string;
  label: string;
  role: ExecutiveObjectLayoutRole;
  rawPosition: [number, number, number];
  tokens: string[];
};

type Vector3Tuple = [number, number, number];

function ground(x: number, z: number): Vector3Tuple {
  return [x, 0, z];
}

function normalizeToken(value: string): string {
  return value.trim().toLowerCase().replace(/[_-]+/g, " ");
}

function scoreSlotMatch(object: LayoutObject, slot: ExecutiveLayoutTemplateSlot): number {
  const haystack = [object.label, ...object.tokens].join(" ").toLowerCase();
  let score = 0;
  for (const keyword of slot.keywords) {
    const normalized = normalizeToken(keyword);
    if (haystack.includes(normalized)) score += normalized.includes(" ") ? 3 : 2;
  }
  if (slot.role && slot.role === object.role) score += 1;
  return score;
}

function flowSequenceRank(object: LayoutObject, sequence: readonly string[]): number {
  const haystack = [object.label, ...object.tokens].join(" ").toLowerCase();
  for (let index = 0; index < sequence.length; index += 1) {
    const keyword = normalizeToken(sequence[index]);
    if (haystack.includes(keyword)) return index;
  }
  return sequence.length + 1;
}

function distance3(a: Vector3Tuple, b: Vector3Tuple): number {
  const dx = a[0] - b[0];
  const dy = a[1] - b[1];
  const dz = a[2] - b[2];
  return Math.sqrt(dx * dx + dy * dy + dz * dz);
}

function pushApart(positions: Vector3Tuple[], minDistance: number, iterations = 8): Vector3Tuple[] {
  const next = positions.map((pos) => [...pos] as Vector3Tuple);
  for (let pass = 0; pass < iterations; pass += 1) {
    for (let i = 0; i < next.length; i += 1) {
      for (let j = i + 1; j < next.length; j += 1) {
        const dist = distance3(next[i], next[j]);
        if (dist >= minDistance || dist <= 1e-6) continue;
        const push = (minDistance - dist) / 2;
        const dx = (next[j][0] - next[i][0]) / dist;
        const dz = (next[j][2] - next[i][2]) / dist;
        next[i][0] -= dx * push;
        next[i][1] = 0;
        next[i][2] -= dz * push;
        next[j][0] += dx * push;
        next[j][1] = 0;
        next[j][2] += dz * push;
      }
    }
  }
  return next.map(([x, y, z]) => [Number(x.toFixed(3)), Number(y.toFixed(3)), Number(z.toFixed(3))]);
}

function assignFromSlots(
  objects: LayoutObject[],
  slots: ExecutiveLayoutTemplateSlot[],
  minDistance: number
): {
  positions: Record<string, Vector3Tuple>;
  slotPositions: Record<string, Vector3Tuple>;
} {
  const available = slots.map((slot) => ({ ...slot, taken: false }));
  const positions: Record<string, Vector3Tuple> = {};
  const slotPositions: Record<string, Vector3Tuple> = {};
  const assigned: Vector3Tuple[] = [];
  const idOrder: string[] = [];

  const sortedObjects = [...objects].sort((a, b) => {
    const bestA = Math.max(...available.map((slot) => scoreSlotMatch(a, slot)));
    const bestB = Math.max(...available.map((slot) => scoreSlotMatch(b, slot)));
    return bestB - bestA;
  });

  for (const object of sortedObjects) {
    let bestIndex = -1;
    let bestScore = -1;
    for (let index = 0; index < available.length; index += 1) {
      if (available[index].taken) continue;
      const score = scoreSlotMatch(object, available[index]);
      if (score > bestScore) {
        bestScore = score;
        bestIndex = index;
      }
    }
    if (bestIndex < 0) {
      bestIndex = available.findIndex((slot) => !slot.taken);
    }
    const slot = available[bestIndex];
    const position = slot?.position ?? ground(0, 0);
    if (slot) slot.taken = true;
    positions[object.id] = [...position];
    slotPositions[object.id] = [...position];
    assigned.push([...position]);
    idOrder.push(object.id);
  }

  const pushed = pushApart(assigned, minDistance);
  idOrder.forEach((id, index) => {
    positions[id] = pushed[index] ?? positions[id];
  });

  return { positions, slotPositions };
}

const SUPPLY_CHAIN_FLOW_SEQUENCE = [
  "supplier",
  "delivery",
  "operational flow",
  "inventory",
  "capacity",
  "warehouse",
  "operations",
  "fulfillment",
  "order flow",
  "demand",
] as const;

function supplyChainFlowRank(object: LayoutObject): number {
  const label = normalizeToken(object.label);
  const orderedLabels: readonly (readonly string[])[] = [
    ["supplier"],
    ["operational flow", "delivery"],
    ["capacity", "inventory", "buffer"],
    ["operations", "warehouse"],
    ["fulfillment", "order flow"],
    ["demand"],
  ];

  for (let index = 0; index < orderedLabels.length; index += 1) {
    if (orderedLabels[index].some((fragment) => label.includes(normalizeToken(fragment)))) {
      return index;
    }
  }

  return flowSequenceRank(object, SUPPLY_CHAIN_FLOW_SEQUENCE);
}

function pushApartLane(
  entries: Array<{ id: string; position: Vector3Tuple }>,
  minDistance: number
): Record<string, Vector3Tuple> {
  if (entries.length === 0) return {};
  const positions = entries.map((entry) => [...entry.position] as Vector3Tuple);
  const pushed = pushApart(positions, minDistance);
  const result: Record<string, Vector3Tuple> = {};
  entries.forEach((entry, index) => {
    result[entry.id] = pushed[index] ?? entry.position;
  });
  return result;
}

function assignSupplyChainPositions(
  objects: LayoutObject[],
  minDistance: number
): {
  positions: Record<string, Vector3Tuple>;
  slotPositions: Record<string, Vector3Tuple>;
} {
  const slotPositions: Record<string, Vector3Tuple> = {};
  const positions: Record<string, Vector3Tuple> = {};

  const flowXs = [-5.6, -3.4, -1.2, 1.0, 3.2, 5.4];
  const flowObjects = objects
    .filter((object) => object.role === "flow" || object.role === "center")
    .sort((a, b) => supplyChainFlowRank(a) - supplyChainFlowRank(b));

  const flowEntries = flowObjects.map((object, index) => {
    const position = ground(flowXs[Math.min(index, flowXs.length - 1)] ?? 0, 2.2);
    slotPositions[object.id] = [...position];
    return { id: object.id, position };
  });
  Object.assign(positions, pushApartLane(flowEntries, minDistance));

  const outcomeObjects = objects.filter((object) => object.role === "outcome");
  const outcomeXs = [4.8, 2.8, 0.8];
  const outcomeEntries = outcomeObjects.map((object, index) => {
    const position = ground(outcomeXs[index] ?? 1.8, -2.4);
    slotPositions[object.id] = [...position];
    return { id: object.id, position };
  });
  Object.assign(positions, pushApartLane(outcomeEntries, minDistance));

  const riskObjects = objects.filter((object) => object.role === "risk");
  const riskAnchors: Vector3Tuple[] = [
    ground(-3.4, -0.8),
    ground(0.8, -1.0),
    ground(3.0, -0.6),
    ground(-1.0, 0.6),
  ];
  const riskEntries = riskObjects.map((object, index) => {
    const position = riskAnchors[index] ?? ground(0, -1.2);
    slotPositions[object.id] = [...position];
    return { id: object.id, position };
  });
  Object.assign(positions, pushApartLane(riskEntries, minDistance));

  const placed = new Set(Object.keys(positions));
  const otherObjects = objects.filter((object) => !placed.has(object.id));
  const otherAnchors: Vector3Tuple[] = [ground(-5.0, -2.0), ground(5.6, -0.4), ground(-0.8, 2.6)];
  const otherEntries = otherObjects.map((object, index) => {
    const position = otherAnchors[index] ?? ground(0, -2.0);
    slotPositions[object.id] = [...position];
    return { id: object.id, position };
  });
  Object.assign(positions, pushApartLane(otherEntries, minDistance));

  return { positions, slotPositions };
}

function buildProjectPmoSlots(): ExecutiveLayoutTemplateSlot[] {
  return [
    { lane: "goal", role: "center", position: ground(0, 3.0), keywords: ["goal", "strategy", "project", "core"] },
    { lane: "milestone", role: "flow", position: ground(-4.8, 1.8), keywords: ["milestone", "phase", "gate"] },
    { lane: "milestone", role: "flow", position: ground(-2.4, 1.8), keywords: ["milestone", "checkpoint"] },
    { lane: "milestone", role: "flow", position: ground(0, 1.8), keywords: ["milestone", "delivery"] },
    { lane: "milestone", role: "flow", position: ground(2.4, 1.8), keywords: ["milestone", "release"] },
    { lane: "task", role: "flow", position: ground(-3.2, 0.2), keywords: ["task", "work", "backlog"] },
    { lane: "task", role: "flow", position: ground(-1.0, 0.2), keywords: ["task", "execution"] },
    { lane: "task", role: "flow", position: ground(1.2, 0.2), keywords: ["task", "delivery"] },
    { lane: "resource", role: "other", position: ground(-3.0, -2.0), keywords: ["resource", "capacity", "team"] },
    { lane: "budget", role: "other", position: ground(0, -2.0), keywords: ["budget", "cost", "spend"] },
    { lane: "risk", role: "risk", position: ground(3.0, -2.0), keywords: ["risk", "delay", "blocker"] },
    { lane: "stakeholder", role: "outcome", position: ground(4.8, -0.6), keywords: ["stakeholder", "sponsor", "customer"] },
    { lane: "decision", role: "outcome", position: ground(5.4, 1.2), keywords: ["decision", "approval", "steering"] },
  ];
}

function buildFinancialSlots(): ExecutiveLayoutTemplateSlot[] {
  return [
    { lane: "revenue", role: "flow", position: ground(-4.8, 2.0), keywords: ["revenue", "income", "sales"] },
    { lane: "margin", role: "flow", position: ground(-1.6, 2.0), keywords: ["margin", "profit", "contribution"] },
    { lane: "cash_flow", role: "center", position: ground(1.6, 2.0), keywords: ["cash flow", "cash_flow", "liquidity"] },
    { lane: "cost", role: "risk", position: ground(-3.2, -2.0), keywords: ["cost", "expense", "opex"] },
    { lane: "debt", role: "risk", position: ground(0, -2.0), keywords: ["debt", "liability", "leverage"] },
    { lane: "risk", role: "risk", position: ground(3.2, -2.0), keywords: ["risk", "exposure", "volatility"] },
    { lane: "forecast", role: "outcome", position: ground(4.6, 0.8), keywords: ["forecast", "projection", "outlook"] },
    { lane: "investment", role: "outcome", position: ground(5.2, 2.2), keywords: ["investment", "capex", "allocation"] },
    { lane: "decision", role: "outcome", position: ground(3.8, 0.8), keywords: ["decision", "approval", "capital"] },
    { lane: "other", role: "other", position: ground(-5.0, 0.4), keywords: ["kpi", "metric", "control"] },
  ];
}

function buildGenericExecutiveSlots(count: number): ExecutiveLayoutTemplateSlot[] {
  if (count >= 6 && count <= 12) {
    return [
      { lane: "center", role: "center", position: ground(0, 0), keywords: ["core", "operations", "hub"] },
      { lane: "flow", role: "flow", position: ground(-4.2, 2.4), keywords: ["flow", "supplier", "delivery"] },
      { lane: "flow", role: "flow", position: ground(-1.4, 2.4), keywords: ["flow", "inventory", "buffer"] },
      { lane: "flow", role: "flow", position: ground(1.4, 2.4), keywords: ["flow", "fulfillment", "execution"] },
      { lane: "flow", role: "flow", position: ground(4.2, 2.4), keywords: ["flow", "demand", "throughput"] },
      { lane: "flow", role: "flow", position: ground(-4.2, -2.4), keywords: ["flow", "pipeline"] },
      { lane: "flow", role: "flow", position: ground(-1.4, -2.4), keywords: ["flow", "process"] },
      { lane: "risk", role: "risk", position: ground(-2.8, 0), keywords: ["risk", "delay", "pressure"] },
      { lane: "risk", role: "risk", position: ground(0, -0.8), keywords: ["risk", "fragility", "constraint"] },
      { lane: "risk", role: "risk", position: ground(2.8, 0), keywords: ["risk", "cash", "exposure"] },
      { lane: "outcome", role: "outcome", position: ground(1.4, -2.4), keywords: ["outcome", "customer", "value"] },
      { lane: "outcome", role: "outcome", position: ground(4.2, -2.4), keywords: ["outcome", "trust", "satisfaction"] },
      { lane: "other", role: "other", position: ground(-2.8, -1.2), keywords: ["support", "context"] },
      { lane: "other", role: "other", position: ground(2.8, -1.2), keywords: ["financial", "pressure"] },
      { lane: "other", role: "other", position: ground(0, 1.2), keywords: ["decision", "control"] },
    ];
  }

  const cols = Math.max(3, Math.ceil(Math.sqrt(count)));
  const spacing = 2.0;
  const slots: ExecutiveLayoutTemplateSlot[] = [];
  for (let index = 0; index < count; index += 1) {
    const col = index % cols;
    const row = Math.floor(index / cols);
    slots.push({
      lane: "grid",
      position: ground((col - (cols - 1) / 2) * spacing, (row - Math.floor((count - 1) / cols) / 2) * spacing),
      keywords: [],
    });
  }
  return slots;
}

function buildTemplateSlots(templateId: ExecutiveLayoutTemplateId, objects: LayoutObject[]): ExecutiveLayoutTemplateSlot[] {
  switch (templateId) {
    case "project_pmo":
      return buildProjectPmoSlots();
    case "financial":
      return buildFinancialSlots();
    case "generic_executive":
    case "supply_chain":
    default:
      return buildGenericExecutiveSlots(objects.length);
  }
}

export function assignExecutiveTemplatePositions(
  objects: LayoutObject[],
  templateId: ExecutiveLayoutTemplateId,
  minDistance: number
): {
  positions: Record<string, Vector3Tuple>;
  preset: string;
  slotPositions: Record<string, Vector3Tuple>;
} {
  const { positions, slotPositions } =
    templateId === "supply_chain"
      ? assignSupplyChainPositions(objects, minDistance)
      : assignFromSlots(objects, buildTemplateSlots(templateId, objects), minDistance);
  const preset =
    templateId === "generic_executive" && objects.length >= 6 && objects.length <= 12
      ? "generic_executive_map"
      : `${templateId}_executive_map`;

  return { positions, preset, slotPositions };
}

export function assertExecutiveLayoutGroundPlane(positions: Record<string, Vector3Tuple>): boolean {
  return Object.values(positions).every((position) => Math.abs(position[1]) < 1e-6);
}
