import type { SceneObject } from "../sceneTypes";

export type ObjectVisualRole =
  | "core"
  | "supporting"
  | "risk"
  | "strategic"
  | "background";

export type ObjectStateVisuals = {
  opacityMul: number;
  emissiveBoost: number;
  scaleMul: number;
  ambientMul: number;
};

export type ObjectVisualProfile = {
  role: ObjectVisualRole;
  shape_family: "stable" | "flow" | "tense" | "simple" | "strategic";
  color_family: "operational" | "pressure" | "strategic" | "muted";
  emphasis_level: "high" | "medium" | "low";
  state_visuals: ObjectStateVisuals;
};

export type RelationVisualProfile = {
  family: "flow" | "dependency" | "pressure" | "mitigation";
  color: string;
  opacity: number;
  pulse: number;
};

export type VisualLanguageTheme = "day" | "night" | "stars";

export type VisualLanguageContext = {
  theme: VisualLanguageTheme;
  mode_id?: string;
};

const GEOMETRY_SET = new Set([
  "sphere",
  "box",
  "torus",
  "ring",
  "cone",
  "cylinder",
  "icosahedron",
  "line_path",
  "points_cloud",
]);

function norm(value: unknown): string {
  return String(value ?? "").trim().toLowerCase();
}

function tokens(obj: SceneObject, tags: string[]): string[] {
  const root = [
    norm((obj as any)?.id),
    norm((obj as any)?.type),
    norm((obj as any)?.label ?? (obj as any)?.name),
    norm((obj as any)?.role),
    norm((obj as any)?.category),
    norm((obj as any)?.risk_kind),
    norm((obj as any)?.semantic?.role),
    norm((obj as any)?.semantic?.category),
    norm((obj as any)?.semantic?.risk_kind),
  ]
    .join(" ")
    .split(/[^a-z0-9_]+/g)
    .filter(Boolean);

  const semanticTags = Array.isArray((obj as any)?.semantic?.tags)
    ? (obj as any).semantic.tags.map((t: any) => norm(t)).filter(Boolean)
    : [];

  const ownTags = Array.isArray(tags) ? tags.map((t) => norm(t)).filter(Boolean) : [];
  return Array.from(new Set([...root, ...semanticTags, ...ownTags]));
}

function hasAny(items: string[], re: RegExp): boolean {
  return items.some((t) => re.test(t));
}

export function deriveObjectVisualRole(
  obj: SceneObject,
  tags: string[],
  _ctx: VisualLanguageContext
): ObjectVisualRole {
  const ts = tokens(obj, tags);
  const text = ts.join(" ");

  if (hasAny(ts, /risk|fragil|pressure|delay|threat|warning|critical|vulnerability|exposure/)) {
    return "risk";
  }
  if (hasAny(ts, /kpi|strategy|objective|portfolio|governance|value|executive/)) {
    return "strategic";
  }
  if (hasAny(ts, /core|primary|main|hub|anchor|critical_path|backbone/)) {
    return "core";
  }

  const emphasisRaw = Number((obj as any)?.emphasis);
  if (Number.isFinite(emphasisRaw) && emphasisRaw >= 0.72) return "core";
  if (Number.isFinite(emphasisRaw) && emphasisRaw <= 0.22) return "background";

  if (/background|helper|aux|meta|context|decor/.test(text)) return "background";
  return "supporting";
}

export function roleToHierarchyStyle(
  role: ObjectVisualRole,
  ctx: VisualLanguageContext
): ObjectStateVisuals {
  const analystBoost = ctx.mode_id === "analyst" ? 1.08 : 1;
  if (role === "core") return { opacityMul: 1.02 * analystBoost, emissiveBoost: 0.1, scaleMul: 1.03, ambientMul: 0.65 };
  if (role === "risk") return { opacityMul: 0.98, emissiveBoost: 0.2, scaleMul: 1.04, ambientMul: 0.78 };
  if (role === "strategic") return { opacityMul: 1.0, emissiveBoost: 0.14, scaleMul: 1.02, ambientMul: 0.7 };
  if (role === "background") return { opacityMul: 0.74, emissiveBoost: -0.02, scaleMul: 0.95, ambientMul: 1.08 };
  return { opacityMul: 1.0, emissiveBoost: 0.0, scaleMul: 1.0, ambientMul: 1.0 };
}

export function buildObjectVisualProfile(
  obj: SceneObject,
  tags: string[],
  ctx: VisualLanguageContext
): ObjectVisualProfile {
  const role = deriveObjectVisualRole(obj, tags, ctx);
  const state_visuals = roleToHierarchyStyle(role, ctx);
  if (role === "risk") {
    return { role, shape_family: "tense", color_family: "pressure", emphasis_level: "high", state_visuals };
  }
  if (role === "core") {
    return { role, shape_family: "stable", color_family: "operational", emphasis_level: "high", state_visuals };
  }
  if (role === "strategic") {
    return { role, shape_family: "strategic", color_family: "strategic", emphasis_level: "medium", state_visuals };
  }
  if (role === "background") {
    return { role, shape_family: "simple", color_family: "muted", emphasis_level: "low", state_visuals };
  }
  return { role, shape_family: "flow", color_family: "operational", emphasis_level: "medium", state_visuals };
}

export function resolveGeometryKindForObject(params: {
  obj: SceneObject;
  explicitShape?: unknown;
  fallbackType?: unknown;
  profile?: ObjectVisualProfile;
}): string {
  const explicit = norm(params.explicitShape);
  const fallback = norm(params.fallbackType);
  if (GEOMETRY_SET.has(explicit)) return explicit;
  if (GEOMETRY_SET.has(fallback)) return fallback;

  const profile = params.profile;
  if (profile?.shape_family === "tense") return "icosahedron";
  if (profile?.shape_family === "strategic") return "torus";
  if (profile?.shape_family === "stable") return "sphere";
  if (profile?.shape_family === "flow") return "cylinder";
  if (profile?.shape_family === "simple") return "box";

  return "box";
}

export function resolveRelationVisualProfile(params: {
  kind?: unknown;
  polarity?: unknown;
  active?: boolean;
  mode_id?: string;
}): RelationVisualProfile {
  const kind = norm(params.kind);
  const polarity = norm(params.polarity);
  const active = !!params.active;

  let family: RelationVisualProfile["family"] = "dependency";
  if (/flow|transfer|order|delivery|pipeline/.test(kind)) family = "flow";
  else if (/pressure|risk|delay|threat|fragil/.test(kind) || /negative/.test(polarity)) family = "pressure";
  else if (/mitig|protect|stabil/.test(kind) || /positive/.test(polarity)) family = "mitigation";

  const analyst = params.mode_id === "analyst";

  if (family === "pressure") {
    return {
      family,
      color: active ? "#ff6b6b" : "#d97706",
      opacity: active ? 0.62 : analyst ? 0.24 : 0.18,
      pulse: active ? 1 : 0.35,
    };
  }
  if (family === "mitigation") {
    return {
      family,
      color: active ? "#34d399" : "#10b981",
      opacity: active ? 0.58 : analyst ? 0.22 : 0.16,
      pulse: active ? 0.85 : 0.25,
    };
  }
  if (family === "flow") {
    return {
      family,
      color: active ? "#60a5fa" : "#64748b",
      opacity: active ? 0.55 : analyst ? 0.2 : 0.14,
      pulse: active ? 0.7 : 0.2,
    };
  }
  return {
    family,
    color: active ? "#94a3b8" : "#95a5a6",
    opacity: active ? 0.52 : analyst ? 0.18 : 0.12,
    pulse: active ? 0.55 : 0.15,
  };
}
