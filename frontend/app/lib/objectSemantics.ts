import type { SceneJson, SceneObject, SemanticObjectMeta } from "./sceneTypes";

export type SemanticObject = SceneObject & { semantic?: SemanticObjectMeta };
export type SceneIntelligenceRole =
  | "core_system_node"
  | "support_node"
  | "risk_source"
  | "downstream_impact_node"
  | "operational_node"
  | "strategic_node"
  | "kpi_sensitive_node"
  | "flow_node"
  | "buffer_node"
  | "customer_or_outcome_node";

export function normalizeSemanticText(value: unknown): string {
  return String(value ?? "").toLowerCase().trim();
}

const SEMANTIC_STOP_WORDS = new Set([
  "a",
  "an",
  "and",
  "are",
  "at",
  "by",
  "for",
  "from",
  "how",
  "in",
  "into",
  "is",
  "of",
  "on",
  "or",
  "show",
  "system",
  "tell",
  "the",
  "to",
  "what",
  "with",
]);

const PROMPT_ROLE_HINTS: Array<{ role: SceneIntelligenceRole; terms: string[] }> = [
  { role: "risk_source", terms: ["risk", "disruption", "delay", "pressure", "fragility", "shock"] },
  { role: "buffer_node", terms: ["buffer", "inventory", "capacity", "stock", "coverage", "reserve"] },
  { role: "flow_node", terms: ["flow", "delivery", "throughput", "fulfillment", "pipeline"] },
  { role: "operational_node", terms: ["operations", "operational", "execution", "bottleneck", "workflow"] },
  { role: "strategic_node", terms: ["strategy", "strategic", "cash", "price", "margin", "cost"] },
  { role: "kpi_sensitive_node", terms: ["cash", "price", "margin", "cost", "liquidity", "exposure"] },
  { role: "customer_or_outcome_node", terms: ["customer", "trust", "satisfaction", "outcome", "retention"] },
  { role: "downstream_impact_node", terms: ["customer", "outcome", "impact", "downstream", "consequence"] },
];

export function tokenizeSemanticText(value: unknown): string[] {
  return Array.from(
    new Set(
      normalizeSemanticText(value)
        .split(/[^a-z0-9_]+/g)
        .map((t) => t.trim())
        .filter((t) => t.length >= 2 && !SEMANTIC_STOP_WORDS.has(t))
    )
  );
}

export function getObjectSemanticMeta(obj: SemanticObject): SemanticObjectMeta {
  const embedded = obj?.semantic && typeof obj.semantic === "object" ? obj.semantic : {};
  return {
    ...embedded,
    canonical_name:
      String(embedded?.canonical_name ?? obj?.canonical_name ?? obj?.name ?? obj?.label ?? obj?.id ?? "").trim() ||
      undefined,
    display_label:
      String(embedded?.display_label ?? obj?.display_label ?? obj?.label ?? obj?.name ?? obj?.id ?? "").trim() ||
      undefined,
    category: String(embedded?.category ?? obj?.category ?? "").trim() || undefined,
    role: String(embedded?.role ?? obj?.role ?? "").trim() || undefined,
    domain: String(embedded?.domain ?? obj?.domain ?? "").trim() || undefined,
    tags: Array.isArray(embedded?.tags)
      ? embedded.tags.map((x) => String(x))
      : Array.isArray(obj?.tags)
      ? obj.tags.map((x) => String(x))
      : undefined,
    keywords: Array.isArray(embedded?.keywords)
      ? embedded.keywords.map((x) => String(x))
      : Array.isArray(obj?.keywords)
      ? obj.keywords.map((x) => String(x))
      : undefined,
    dependencies: Array.isArray(embedded?.dependencies)
      ? embedded.dependencies.map((x) => String(x))
      : Array.isArray(obj?.dependencies)
      ? obj.dependencies.map((x) => String(x))
      : undefined,
    risk_kind: String(embedded?.risk_kind ?? obj?.risk_kind ?? "").trim() || undefined,
    business_meaning:
      String(embedded?.business_meaning ?? obj?.business_meaning ?? "").trim() || undefined,
    related_terms: Array.isArray(embedded?.related_terms)
      ? embedded.related_terms.map((x) => String(x))
      : Array.isArray(obj?.related_terms)
      ? obj.related_terms.map((x) => String(x))
      : undefined,
  };
}

export function getObjectDisplayLabel(obj: SemanticObject): string {
  const meta = getObjectSemanticMeta(obj);
  const label = String(meta.display_label ?? obj?.label ?? obj?.name ?? obj?.id ?? "Object")
    .replace(/^obj_/, "")
    .replace(/_/g, " ")
    .trim();
  return label ? label.replace(/\b\w/g, (m) => m.toUpperCase()) : "Object";
}

export function getObjectSemanticTags(obj: SemanticObject): string[] {
  const meta = getObjectSemanticMeta(obj);
  return Array.from(
    new Set(
      [
        ...(Array.isArray(meta.tags) ? meta.tags : []),
        meta.category,
        meta.role,
        meta.domain,
        meta.risk_kind,
      ]
        .map((x) => String(x ?? "").trim())
        .filter(Boolean)
    )
  );
}

export function getObjectDependencies(obj: SemanticObject): string[] {
  const meta = getObjectSemanticMeta(obj);
  return Array.from(new Set((Array.isArray(meta.dependencies) ? meta.dependencies : []).map(String)));
}

export function getObjectRoleSignals(obj: SemanticObject): string[] {
  const meta = getObjectSemanticMeta(obj);
  return Array.from(
    new Set(
      [
        meta.role,
        ...(Array.isArray(meta.tags) ? meta.tags : []),
        meta.risk_kind,
        meta.category,
      ]
        .map((x) => String(x ?? "").trim())
        .filter(Boolean)
    )
  );
}

export function inferPromptRoleHints(prompt: string): string[] {
  const tokens = tokenizeSemanticText(prompt);
  return Array.from(
    new Set(
      PROMPT_ROLE_HINTS.filter((entry) => entry.terms.some((term) => tokens.includes(term))).map((entry) => entry.role)
    )
  );
}

export function getObjectMatchingTerms(obj: SemanticObject): string[] {
  const meta = getObjectSemanticMeta(obj);
  const baseTerms: string[] = [
    String(obj?.id ?? ""),
    String(obj?.type ?? ""),
    String(obj?.name ?? ""),
    String(obj?.label ?? ""),
    String(meta.display_label ?? ""),
    String(meta.canonical_name ?? ""),
    String(meta.category ?? ""),
    String(meta.role ?? ""),
    String(meta.domain ?? ""),
    String(meta.risk_kind ?? ""),
    String(meta.business_meaning ?? ""),
    ...(Array.isArray(meta.tags) ? meta.tags : []),
    ...(Array.isArray(meta.keywords) ? meta.keywords : []),
    ...(Array.isArray(meta.related_terms) ? meta.related_terms : []),
  ];

  const expanded = baseTerms.flatMap((t) => {
    const s = String(t || "").trim();
    if (!s) return [];
    const split = s.replace(/_/g, " ").split(/\s+/g).filter(Boolean);
    return [s, ...split];
  });

  return Array.from(new Set(expanded.map((t) => normalizeSemanticText(t)).filter(Boolean)));
}

export function getSceneObjectsFromPayload(payload: any, fallbackScene: SceneJson | null): SemanticObject[] {
  if (Array.isArray(payload?.scene_json?.scene?.objects)) return payload.scene_json.scene.objects as SemanticObject[];
  if (Array.isArray(fallbackScene?.scene?.objects)) return fallbackScene.scene.objects as SemanticObject[];
  return [];
}

export function matchObjectsFromPrompt(
  prompt: string,
  objects: SemanticObject[],
  maxResults = 4
): Array<{ id: string; score: number }> {
  const tokens = tokenizeSemanticText(prompt).filter((t) => t.length >= 3);
  if (!tokens.length || !Array.isArray(objects) || objects.length === 0) return [];
  const normalizedPrompt = normalizeSemanticText(prompt);
  const promptRoleHints = new Set(inferPromptRoleHints(prompt));

  const scored = objects
    .map((obj, idx) => {
      const id = String(obj?.id ?? obj?.name ?? `obj_${idx}`);
      const terms = getObjectMatchingTerms(obj);
      const labelTokens = tokenizeSemanticText(getObjectDisplayLabel(obj));
      const semanticTags = getObjectSemanticTags(obj).flatMap((t) => tokenizeSemanticText(t));
      const roleSignals = getObjectRoleSignals(obj).flatMap((t) => tokenizeSemanticText(t));
      const exactTerms = new Set(terms);
      const labelSet = new Set(labelTokens);
      const tagSet = new Set(semanticTags);
      const roleSet = new Set(roleSignals);
      let score = 0;

      for (const token of tokens) {
        if (labelSet.has(token)) {
          score += 5;
          continue;
        }
        if (tagSet.has(token)) {
          score += 4;
          continue;
        }
        if (exactTerms.has(token)) {
          score += 3;
          continue;
        }
        if (labelTokens.some((term) => term.includes(token) || token.includes(term))) {
          score += 2;
          continue;
        }
        if (terms.some((term) => term.includes(token) || token.includes(term))) {
          score += 1;
        }
      }

      const displayLabel = normalizeSemanticText(getObjectDisplayLabel(obj));
      if (displayLabel && normalizedPrompt.includes(displayLabel)) {
        score += 4;
      }
      if ([...promptRoleHints].some((role) => roleSet.has(role))) {
        score += 3;
      }

      return { id, score };
    })
    .filter((x) => x.score > 1)
    .sort((a, b) => (b.score !== a.score ? b.score - a.score : a.id.localeCompare(b.id)))
    .slice(0, Math.max(1, maxResults));

  return scored;
}
