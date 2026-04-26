/**
 * Rule-based executive signals for right-rail panels (no backend / no LLM).
 */

export type PanelIntelligence = {
  primary: string;
  implication: string;
  action: string;
  /** 0–1 */
  confidence: number;
};

function clamp01(n: number): number {
  if (!Number.isFinite(n)) return 0.65;
  return Math.max(0, Math.min(1, n));
}

function oneLine(text: string, max = 200): string {
  const t = String(text ?? "").replace(/\s+/g, " ").trim();
  if (!t) return "";
  return t.length > max ? `${t.slice(0, max - 1).trimEnd()}…` : t;
}

/** Dev-only trace for intelligence payloads. */
export function logPanelIntelligence(view: string, intelligence: PanelIntelligence): void {
  if (process.env.NODE_ENV === "production") return;
  console.log("[Nexora][PanelIntelligence]", { view, intelligence });
}

export function buildRiskIntelligence(
  risk: Record<string, unknown> | null | undefined,
  mode: "risk" | "fragility" = "risk"
): PanelIntelligence {
  const levelRaw = risk?.level ?? risk?.risk_level ?? "low";
  const level = String(levelRaw);
  const drivers = Array.isArray(risk?.drivers) ? (risk.drivers as unknown[]) : [];
  const edges = Array.isArray(risk?.edges) ? (risk.edges as unknown[]) : [];
  const summary = typeof risk?.summary === "string" ? risk.summary.trim() : "";
  const isCritical = /high|critical|severe/i.test(level);
  const cRaw = risk?.confidence;
  let confidence = 0.7;
  if (typeof cRaw === "number" && Number.isFinite(cRaw)) {
    confidence = cRaw > 1 ? clamp01(cRaw / 100) : clamp01(cRaw);
  } else {
    confidence = clamp01(0.52 + Math.min(12, edges.length + drivers.length) * 0.035 + (isCritical ? 0.08 : 0));
  }

  if (mode === "fragility") {
    const hasDrivers = drivers.length > 0;
    return {
      primary: hasDrivers
        ? "Fragility scan surfaced material weak links in the operating picture."
        : "Fragility posture is steady until the next inspector scan.",
      implication: hasDrivers
        ? "Driver concentration means localized stress can shift system behavior quickly."
        : "Use the inspector scanner to capture a short update and refresh drivers.",
      action: hasDrivers
        ? "Prioritize the top drivers for mitigation or monitoring this week."
        : "Run a fragility scan from the inspector to populate drivers and weak-link signals.",
      confidence,
    };
  }

  return {
    primary: isCritical
      ? "System is vulnerable to cascading disruption."
      : summary
        ? oneLine(summary, 180)
        : edges.length > 0
          ? "Risk propagation is visible across connected objects."
          : "Risk exposure is currently stable.",
    implication: isCritical
      ? "A single disruption can propagate across multiple nodes."
      : edges.length > 0
        ? "Dependency paths amplify how local shocks become system-wide exposure."
        : "Current system can absorb small disturbances.",
    action: isCritical
      ? "Investigate top drivers and reduce dependency risk."
      : edges.length > 0
        ? "Trace the highest-weight edges and validate buffers before the next move."
        : "Monitor key drivers and maintain buffer capacity.",
    confidence,
  };
}

export type AdviceIntelligenceInput = {
  summary: string;
  primaryRecommendation: string | null;
  why: string | null;
  executiveSummary: string | null;
  actionsCount: number;
  confidenceRaw: unknown;
};

export function buildAdviceIntelligence(input: AdviceIntelligenceInput): PanelIntelligence {
  const primary = input.primaryRecommendation
    ? oneLine(input.primaryRecommendation, 160)
    : oneLine(input.summary, 160) || "Strategic posture is not yet anchored to a single recommended move.";
  const implication =
    input.why ??
    input.executiveSummary ??
    (input.actionsCount > 0
      ? "Multiple viable paths exist—choosing one unlocks execution and measurement."
      : "More scenario or scan context will sharpen trade-offs and timing.");
  const action =
    input.primaryRecommendation?.trim() ||
    (input.actionsCount > 0 ? "Review suggested actions and pick the smallest reversible step first." : "Run a scan or short scenario to surface the next executive move.");
  let confidence = 0.68;
  const cr = input.confidenceRaw;
  if (typeof cr === "number" && Number.isFinite(cr)) {
    confidence = cr > 1 ? clamp01(cr / 100) : clamp01(cr);
  } else if (typeof cr === "string") {
    const m = /high|strong/i.test(cr) ? 0.82 : /medium|moderate/i.test(cr) ? 0.68 : /low|weak/i.test(cr) ? 0.52 : 0.65;
    confidence = m;
  }
  return {
    primary,
    implication: oneLine(implication, 220),
    action: oneLine(action, 200),
    confidence,
  };
}

export type ConflictIntelligenceInput = {
  summary: string | null;
  items: Array<{ score?: number; reason?: string; a?: string; b?: string }>;
};

export function buildConflictIntelligence(input: ConflictIntelligenceInput): PanelIntelligence {
  const n = input.items.length;
  const maxScore = input.items.reduce((m, x) => Math.max(m, Number(x.score ?? 0)), 0);
  const highTension = n > 2 || maxScore >= 0.55;
  const primary =
    input.summary?.trim() ||
    (n > 0
      ? `${n} active tension${n === 1 ? "" : "s"} between objectives or stakeholders.`
      : "No material conflicts are registered for this view.");
  return {
    primary: oneLine(primary, 180),
    implication: highTension
      ? "Overlapping priorities increase the chance of rework, delay, or silent misalignment."
      : "Conflict signals are contained—still worth validating assumptions before commitment.",
    action: highTension
      ? "Facilitate a short alignment session on the top two tensions and document decisions."
      : "Confirm owners and success metrics for the few items above before scaling work.",
    confidence: clamp01(0.55 + Math.min(8, n) * 0.04 + (maxScore > 0.5 ? 0.12 : 0)),
  };
}

export type TimelineIntelligenceInput = {
  stageCount: number;
  activeSummary: string | null;
  activeTitle: string | null;
  recommendationLabel: string | null;
  hasRecommendedPath: boolean;
};

export function buildTimelineIntelligence(input: TimelineIntelligenceInput): PanelIntelligence {
  const primary =
    oneLine(input.activeSummary ?? "", 180) ||
    oneLine(input.recommendationLabel ?? "", 160) ||
    (input.stageCount > 0
      ? "Decision story spans current, recommended, and alternative futures."
      : "Timeline narrative is not yet populated.");
  return {
    primary,
    implication: input.hasRecommendedPath
      ? "The recommended path concentrates benefit where uncertainty is already priced in."
      : "Stage the story before vs. after so stakeholders see why the move is justified.",
    action: "Play the story once, then compare options or simulate the recommended move for evidence.",
    confidence: clamp01(0.6 + Math.min(5, input.stageCount) * 0.06),
  };
}

export type WarRoomIntelligenceInput = {
  riskLevel: string;
  situation: string;
  primaryObject: string;
  recommendationAction: string | null;
  confidenceScore: number;
};

export function buildWarRoomIntelligence(input: WarRoomIntelligenceInput): PanelIntelligence {
  const critical = /critical|high/i.test(input.riskLevel);
  const primary = critical
    ? `Executive focus is elevated around ${oneLine(input.primaryObject, 80)}.`
    : oneLine(input.situation, 200) || `Operating picture centers on ${oneLine(input.primaryObject, 80)}.`;
  return {
    primary,
    implication: critical
      ? "Downside scenarios are close enough that delay increases exposure and stakeholder doubt."
      : "Room remains to align execution with the stated posture before shocks compound.",
    action:
      oneLine(input.recommendationAction ?? "", 200) ||
      "Confirm the recommended move, then open timeline or compare to pressure-test assumptions.",
    confidence: clamp01(Number.isFinite(input.confidenceScore) ? input.confidenceScore : 0.7),
  };
}

/** Text color hint for primary line (risk-style panels). */
export function intelligencePrimaryTone(isCritical: boolean): string {
  return isCritical ? "#fecaca" : "#f1f5f9";
}
