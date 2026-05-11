import { buildDomainObjectCatalog } from "./domainObjectCatalog.ts";
import { getDomainDefinition } from "./domainRegistry.ts";
import { normalizeDomainId } from "./domainHelpers.ts";
import type { DomainObjectTemplate, NexoraDomainId } from "./domainTypes.ts";
import type { SceneObject, Vector3Tuple } from "../sceneTypes.ts";

export type DomainObjectCreationRequest = {
  domainId: NexoraDomainId;
  templateId: string;
  label?: string;
  source:
    | "user_add"
    | "chat_inferred"
    | "scenario_generation"
    | "system";
  preferredPosition?:
    | "center"
    | "orbit"
    | "auto";
};

export type DomainObjectCreationResult = {
  success: boolean;
  createdObjectId?: string;
  normalizedObject?: SceneObject;
  targetPanel?:
    | "objects"
    | "focus"
    | "risk"
    | "scenario"
    | "dashboard";
  warnings?: string[];
};

const ROLE_TO_SCENE_TYPE: Record<DomainObjectTemplate["role"], string> = {
  core: "core",
  input: "node",
  process: "flow",
  constraint: "ring",
  risk: "shield",
  decision: "diamond",
  output: "sphere",
  monitor: "signal",
};

const COLOR_BY_TOKEN = {
  neutral: "#f8fafc",
  blue: "#60a5fa",
  green: "#86efac",
  amber: "#fbbf24",
  red: "#f87171",
  purple: "#c084fc",
  cyan: "#67e8f9",
} as const;

function normalizeIdPart(value: unknown): string {
  return String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

function safeLabel(value: unknown, fallback: string): string {
  const label = String(value ?? "").trim();
  return label || fallback;
}

function findTemplate(domainId: NexoraDomainId, templateId: string): DomainObjectTemplate | null {
  const normalizedTemplateId = normalizeIdPart(templateId);
  return (
    getDomainDefinition(domainId).objectTemplates.find(
      (template) => normalizeIdPart(template.id) === normalizedTemplateId
    ) ?? null
  );
}

function fallbackTemplate(domainId: NexoraDomainId): DomainObjectTemplate | null {
  return getDomainDefinition(domainId).objectTemplates[0] ?? null;
}

function defaultPositionForRequest(
  role: DomainObjectTemplate["role"],
  preferredPosition: DomainObjectCreationRequest["preferredPosition"]
): Vector3Tuple {
  if (preferredPosition === "center" || role === "core") return [0, 0, 0];
  return [2.4, 0, 0];
}

export function createDomainSceneObject(
  request: DomainObjectCreationRequest
): DomainObjectCreationResult {
  const warnings: string[] = [];
  const domainId = normalizeDomainId(request.domainId);
  if (domainId !== request.domainId) warnings.push("domain_fallback_applied");

  let template = findTemplate(domainId, request.templateId);
  if (!template) {
    warnings.push(`template_not_found:${String(request.templateId ?? "")}`);
    template = fallbackTemplate(domainId);
  }
  if (!template) {
    return { success: false, warnings: [...warnings, "no_domain_templates_available"] };
  }

  const catalogItem = buildDomainObjectCatalog(domainId).find((item) => item.templateId === template.id);
  const visual = catalogItem ?? buildDomainObjectCatalog(domainId)[0];
  const label = safeLabel(request.label, template.label);
  const labelSlug = normalizeIdPart(label);
  const templateSlug = normalizeIdPart(template.id);
  const id = `domain_${domainId}_${labelSlug || templateSlug}`;
  const semanticRole = template.role;
  const createdAt = new Date().toISOString();
  const colorToken = visual?.suggestedColorToken ?? "neutral";

  const normalizedObject: SceneObject = {
    id,
    label,
    name: label,
    type: ROLE_TO_SCENE_TYPE[template.role],
    role: template.role,
    position: defaultPositionForRequest(template.role, request.preferredPosition),
    color: COLOR_BY_TOKEN[colorToken],
    scale: template.role === "core" ? 1.08 : 0.88 + Math.min(0.24, Math.max(0, template.defaultImportance) * 0.16),
    emphasis: Math.min(0.85, Math.max(0.2, template.defaultImportance)),
    domain: domainId,
    tags: ["domain_object", domainId, template.role, template.id],
    semantic: {
      canonical_name: labelSlug || templateSlug,
      display_label: label,
      category: "domain_object",
      role: template.role,
      domain: domainId,
      tags: ["domain_object", domainId, template.role],
      keywords: [...template.aliases],
      business_meaning: template.description,
      type: "domain_object",
    },
    ux: {
      shape: visual?.suggestedShape,
      base_color: colorToken,
    },
    meta: {
      domainId,
      templateId: template.id,
      createdFrom: "domain_catalog",
      creationSource: request.source,
      createdAt,
      semanticRole,
    },
  };

  return {
    success: true,
    createdObjectId: id,
    normalizedObject,
    targetPanel: visual?.suggestedPanel ?? "objects",
    warnings: warnings.length ? warnings : undefined,
  };
}
