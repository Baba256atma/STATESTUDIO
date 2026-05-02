import type { CanonicalRecommendation } from "../decision/recommendation/recommendationTypes";

export type ExecutiveObjectPanelData = {
  objectId: string;
  objectName?: string;
  insight: string;
  riskLevel: "low" | "medium" | "high" | "critical" | "unknown";
  affectedObjects?: string[];
  recommendedAction: string;
  confidence?: number;
};

export const fallbackExecutiveData: Omit<ExecutiveObjectPanelData, "objectId" | "objectName"> = {
  insight: "No strong signal detected yet.",
  riskLevel: "unknown",
  affectedObjects: [],
  recommendedAction: "Review the selected object and run analysis again if needed.",
  confidence: 0.5,
};

function normalizeRiskLevel(raw: string | null | undefined): ExecutiveObjectPanelData["riskLevel"] {
  const s = String(raw ?? "")
    .trim()
    .toLowerCase();
  if (!s) return "unknown";
  if (s.includes("critical") || s.includes("severe")) return "critical";
  if (s.includes("high")) return "high";
  if (s.includes("medium") || s.includes("moderate")) return "medium";
  if (s.includes("low")) return "low";
  return "unknown";
}

function clip(s: string, max: number): string {
  const t = s.replace(/\s+/g, " ").trim();
  if (!t) return "";
  return t.length > max ? `${t.slice(0, max - 1).trimEnd()}…` : t;
}

function collectAffectedIds(args: {
  reco: CanonicalRecommendation | null;
  risk: Record<string, unknown> | null;
  objectId: string;
}): string[] {
  const out = new Set<string>();
  const add = (v: unknown) => {
    const t = String(v ?? "").trim();
    if (t && t !== args.objectId) out.add(t);
  };
  const targets = args.reco?.primary?.target_ids;
  if (Array.isArray(targets)) targets.forEach(add);
  const risk = args.risk;
  if (risk && typeof risk === "object") {
    const edges = (risk as { edges?: unknown }).edges;
    if (Array.isArray(edges)) {
      for (const e of edges) {
        if (e && typeof e === "object") {
          add((e as { from?: unknown }).from);
          add((e as { to?: unknown }).to);
        }
      }
    }
  }
  return Array.from(out).slice(0, 8);
}

function riskPayloadFromUnknown(riskPropagation: unknown): Record<string, unknown> | null {
  if (!riskPropagation || typeof riskPropagation !== "object") return null;
  return riskPropagation as Record<string, unknown>;
}

function hasObjectContext(input: {
  objectId: string;
  sceneJson?: unknown;
  responseData?: unknown;
  riskPropagation?: unknown;
  reco: CanonicalRecommendation | null;
}): boolean {
  const { objectId, sceneJson, responseData, riskPropagation, reco } = input;
  const inScene = (() => {
    const objects = (sceneJson as { scene?: { objects?: unknown[] } } | null | undefined)?.scene?.objects;
    if (!Array.isArray(objects)) return false;
    return objects.some((entry) => {
      if (!entry || typeof entry !== "object") return false;
      const id = String((entry as { id?: unknown; name?: unknown }).id ?? (entry as { id?: unknown; name?: unknown }).name ?? "").trim();
      return id === objectId;
    });
  })();
  if (inScene) return true;
  const inSelection = (() => {
    const highlighted =
      (responseData as { object_selection?: { highlighted_objects?: unknown[] } } | null | undefined)?.object_selection
        ?.highlighted_objects;
    return Array.isArray(highlighted) && highlighted.some((id) => String(id ?? "").trim() === objectId);
  })();
  if (inSelection) return true;
  const inRisk = (() => {
    const sources = (riskPropagation as { sources?: unknown[] } | null | undefined)?.sources;
    const edges = (riskPropagation as { edges?: unknown[] } | null | undefined)?.edges;
    const hasSource = Array.isArray(sources) && sources.some((id) => String(id ?? "").trim() === objectId);
    const hasEdge =
      Array.isArray(edges) &&
      edges.some((edge) => {
        if (!edge || typeof edge !== "object") return false;
        const from = String((edge as { from?: unknown }).from ?? "").trim();
        const to = String((edge as { to?: unknown }).to ?? "").trim();
        return from === objectId || to === objectId;
      });
    return hasSource || hasEdge;
  })();
  if (inRisk) return true;
  const inRecommendation = Array.isArray(reco?.primary?.target_ids)
    ? reco!.primary.target_ids!.some((id) => String(id ?? "").trim() === objectId)
    : false;
  return inRecommendation;
}

function fragilityLine(risk: Record<string, unknown> | null): string {
  const drivers = risk && Array.isArray((risk as { drivers?: unknown }).drivers) ? (risk as { drivers: unknown[] }).drivers : [];
  if (drivers.length >= 4) return "Several stress drivers are active.";
  if (drivers.length > 0) return "Focused pressure points visible.";
  return "No extra fragility detail yet.";
}

export function buildExecutiveObjectPanelData(input: {
  objectId: string;
  objectName?: string | null;
  responseData?: unknown;
  sceneJson?: unknown;
  riskPropagation?: unknown;
  canonicalRecommendation?: CanonicalRecommendation | null;
}): ExecutiveObjectPanelData {
  const objectId = String(input.objectId ?? "").trim();
  const base: ExecutiveObjectPanelData = {
    objectId: objectId || "—",
    objectName: input.objectName ? String(input.objectName).trim() : undefined,
    ...fallbackExecutiveData,
  };
  if (!objectId) return base;

  const reco = input.canonicalRecommendation ?? null;
  if (
    !hasObjectContext({
      objectId,
      sceneJson: input.sceneJson,
      responseData: input.responseData,
      riskPropagation: input.riskPropagation,
      reco,
    })
  ) {
    return base;
  }
  const risk = riskPayloadFromUnknown(input.riskPropagation);

  const riskLevelRaw =
    (risk && (String((risk as { level?: unknown }).level || (risk as { risk_level?: unknown }).risk_level))) ||
    reco?.reasoning?.risk_summary ||
    null;

  const what = clip(
    reco?.primary?.impact_summary ||
      reco?.reasoning?.key_drivers?.[0] ||
      reco?.primary?.action ||
      fallbackExecutiveData.insight,
    220
  );
  const whyFromReco = clip(reco?.reasoning?.why || "", 220);
  const why = whyFromReco.length > 0 ? whyFromReco : fragilityLine(risk);

  const insight = clip([what, why].filter(Boolean).join("\n"), 480);

  const recommendedAction = clip(reco?.primary?.action || fallbackExecutiveData.recommendedAction, 280);

  const confScore = reco?.confidence?.score;
  const confidence =
    typeof confScore === "number" && Number.isFinite(confScore) ? Math.max(0, Math.min(1, confScore)) : 0.5;

  const affected = collectAffectedIds({ reco, risk, objectId });

  return {
    ...base,
    insight: insight || fallbackExecutiveData.insight,
    riskLevel: normalizeRiskLevel(typeof riskLevelRaw === "string" ? riskLevelRaw : null),
    affectedObjects: affected.length > 0 ? affected : fallbackExecutiveData.affectedObjects,
    recommendedAction: recommendedAction || fallbackExecutiveData.recommendedAction,
    confidence,
  };
}
