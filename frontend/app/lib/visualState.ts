import { z } from "zod";

export type Vec3 = [number, number, number];

export type NodeShape = "sphere" | "box" | "ico" | "dodeca";
export type LoopType = "R" | "B";

export type VisualNode = {
  id: string;
  shape: NodeShape;
  pos: Vec3;
  color: string;
  intensity: number;
  opacity: number;
  scale?: number;
};

export type VisualLoop = {
  id: string;
  type: LoopType;
  center: Vec3;
  radius: number;
  intensity: number;
  flowSpeed: number;
  bottleneck?: number;
  delay?: number;
};

export type VisualLever = {
  id: string;
  target: string;
  pos: Vec3;
  strength: number;
};

export type VisualFlow = {
  id: string;
  from: string;
  to: string;
  type: "line" | "tube";
  speed: number;
  intensity?: number;
  color?: string;
};

export type VisualField = {
  chaos: number;
  density: number;
  noiseAmp: number;
};

export type VisualState = {
  t?: number;
  focus?: string;
  nodes: VisualNode[];
  loops: VisualLoop[];
  levers: VisualLever[];
  flows?: VisualFlow[];
  field?: VisualField;
};

const vec3Schema = z
  .tuple([z.number(), z.number(), z.number()])
  .transform((v) => [Number(v[0]), Number(v[1]), Number(v[2])] as Vec3);

const nodeSchema = z.object({
  id: z.string().min(1),
  shape: z.enum(["sphere", "box", "ico", "dodeca"]),
  pos: vec3Schema,
  color: z.string(),
  intensity: z.number(),
  opacity: z.number(),
  scale: z.number().optional(),
});

const loopSchema = z.object({
  id: z.string().min(1),
  type: z.enum(["R", "B"]),
  center: vec3Schema,
  radius: z.number(),
  intensity: z.number(),
  flowSpeed: z.number(),
  bottleneck: z.number().optional(),
  delay: z.number().optional(),
});

const leverSchema = z.object({
  id: z.string().min(1),
  target: z.string().min(1),
  pos: vec3Schema,
  strength: z.number(),
});

const flowSchema = z.object({
  id: z.string().min(1),
  from: z.string().min(1),
  to: z.string().min(1),
  type: z.enum(["line", "tube"]),
  speed: z.number(),
  intensity: z.number().optional(),
  color: z.string().optional(),
});

const fieldSchema = z.object({
  chaos: z.number(),
  density: z.number(),
  noiseAmp: z.number(),
});

export const visualStateSchema = z.object({
  t: z.number().optional(),
  focus: z.string().optional(),
  nodes: z.array(nodeSchema),
  loops: z.array(loopSchema),
  levers: z.array(leverSchema),
  flows: z.array(flowSchema).optional(),
  field: fieldSchema.optional(),
});

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function clamp01(value: number) {
  return clamp(value, 0, 1);
}

function clampVec3(v: Vec3): Vec3 {
  return [Number(v[0]) || 0, Number(v[1]) || 0, Number(v[2]) || 0];
}

function normalizeNode(node: VisualNode): VisualNode {
  return {
    ...node,
    pos: clampVec3(node.pos),
    intensity: clamp01(node.intensity),
    opacity: clamp01(node.opacity),
    scale: node.scale !== undefined ? clamp(node.scale, 0.1, 5) : undefined,
  };
}

function normalizeLoop(loop: VisualLoop): VisualLoop {
  return {
    ...loop,
    center: clampVec3(loop.center),
    radius: Math.max(0.01, Number(loop.radius) || 0.01),
    intensity: clamp01(loop.intensity),
    flowSpeed: Math.max(0, Number(loop.flowSpeed) || 0),
    bottleneck: loop.bottleneck !== undefined ? clamp01(loop.bottleneck) : undefined,
    delay: loop.delay !== undefined ? clamp01(loop.delay) : undefined,
  };
}

function normalizeLever(lever: VisualLever): VisualLever {
  return {
    ...lever,
    pos: clampVec3(lever.pos),
    strength: clamp01(lever.strength),
  };
}

function normalizeFlow(flow: VisualFlow): VisualFlow {
  return {
    ...flow,
    speed: Math.max(0, Number(flow.speed) || 0),
    intensity: flow.intensity !== undefined ? clamp01(flow.intensity) : undefined,
  };
}

function normalizeField(field: VisualField): VisualField {
  return {
    chaos: clamp01(field.chaos),
    density: clamp01(field.density),
    noiseAmp: clamp01(field.noiseAmp),
  };
}

export function parseVisualState(input: unknown):
  | { ok: true; data: VisualState }
  | { ok: false; error: string } {
  const parsed = visualStateSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.message };
  }
  const data = parsed.data;
  return {
    ok: true,
    data: {
      t: data.t,
      focus: data.focus,
      nodes: data.nodes.map(normalizeNode),
      loops: data.loops.map(normalizeLoop),
      levers: data.levers.map(normalizeLever),
      flows: data.flows?.map(normalizeFlow),
      field: data.field ? normalizeField(data.field) : undefined,
    },
  };
}
