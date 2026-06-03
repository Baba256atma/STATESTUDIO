import type { SceneObject } from "../sceneTypes";
import type { ExecutiveObjectVisualCategory } from "../scene/graphics/executiveGraphicsProfile";
import { deriveExecutiveObjectVisualCategory } from "../scene/graphics/executiveGraphicsProfile";

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
  category: ExecutiveObjectVisualCategory;
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
  if (role === "core") return { opacityMul: 1.0 * analystBoost, emissiveBoost: 0.08, scaleMul: 1.0, ambientMul: 0.62 };
  if (role === "risk") return { opacityMul: 0.96, emissiveBoost: 0.14, scaleMul: 1.0, ambientMul: 0.74 };
  if (role === "strategic") return { opacityMul: 0.98, emissiveBoost: 0.1, scaleMul: 1.0, ambientMul: 0.68 };
  if (role === "background") return { opacityMul: 0.78, emissiveBoost: 0, scaleMul: 0.98, ambientMul: 1.02 };
  return { opacityMul: 0.94, emissiveBoost: 0.04, scaleMul: 1.0, ambientMul: 0.92 };
}

function categoryToShapeFamily(category: ExecutiveObjectVisualCategory): ObjectVisualProfile["shape_family"] {
  switch (category) {
    case "process_risk":
      return "tense";
    case "decision_control":
    case "core_operations":
      return "stable";
    case "finance_pressure":
    case "constraint":
      return "strategic";
    case "customer_outcome":
      return "simple";
    case "flow":
    default:
      return "flow";
  }
}

function categoryToColorFamily(category: ExecutiveObjectVisualCategory): ObjectVisualProfile["color_family"] {
  switch (category) {
    case "process_risk":
    case "finance_pressure":
      return "pressure";
    case "decision_control":
      return "strategic";
    case "customer_outcome":
    case "constraint":
      return "muted";
    case "core_operations":
    case "flow":
    default:
      return "operational";
  }
}

export function buildObjectVisualProfile(
  obj: SceneObject,
  tags: string[],
  ctx: VisualLanguageContext
): ObjectVisualProfile {
  const role = deriveObjectVisualRole(obj, tags, ctx);
  const category = deriveExecutiveObjectVisualCategory({
    label: (obj as any)?.label ?? (obj as any)?.name,
    role: (obj as any)?.role,
    tags,
    semanticRole: (obj as any)?.semantic?.role,
    semanticCategory: (obj as any)?.semantic?.category,
    visualRole: role,
  });
  const state_visuals = roleToHierarchyStyle(role, ctx);
  const shape_family = categoryToShapeFamily(category);
  const color_family = categoryToColorFamily(category);
  const emphasis_level =
    category === "core_operations" || category === "process_risk"
      ? "high"
      : category === "decision_control" || category === "finance_pressure"
        ? "medium"
        : role === "background"
          ? "low"
          : "medium";

  return { role, category, shape_family, color_family, emphasis_level, state_visuals };
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
  if (profile?.category === "process_risk" || profile?.shape_family === "tense") return "icosahedron";
  if (profile?.category === "decision_control" || profile?.shape_family === "strategic") return "torus";
  if (profile?.category === "core_operations" || profile?.shape_family === "stable") return "sphere";
  if (profile?.category === "flow" || profile?.shape_family === "flow") return "cylinder";
  if (profile?.category === "customer_outcome" || profile?.shape_family === "simple") return "box";

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
