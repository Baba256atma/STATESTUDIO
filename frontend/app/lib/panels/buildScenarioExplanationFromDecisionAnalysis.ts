export type ScenarioExplanationConfidence = "low" | "medium" | "high";

/** Explainable confidence derived from strategy count, risk/stability deltas vs simulation. */
export type TrustConfidenceBlock = {
  label: "low" | "medium" | "high";
  /** Single scannable line; includes strategy count and risk/stability deltas. */
  summaryLine: string;
  /** One sentence tying evaluation to the signal above. */
  explanation: string;
};

export type ScenarioExplanationBlockInput = {
  problem: string;
  cause: string;
  impact: string;
  recommendation: string;
  /** Omitted when no analysis (no fabricated trust). */
  confidence?: ScenarioExplanationConfidence;
  trust?: {
    confidence: TrustConfidenceBlock;
    /** Why this choice vs alternatives (comparison-aware). */
    whyThisBullets: string[];
    /** Traceable metrics from risk, simulation, insights, strategy rows. */
    evidence: string[];
    /** Downsides and trade-offs (max 3 in mapping). */
    riskTradeoffs: string[];
    /** Auditable pipeline hint with real counts where possible. */
    decisionTrace: string;
  };
};

function clampLine(value: string, maxChars: number): string {
  const t = value.trim().replace(/\s+/g, " ");
  if (!t) return "";
  if (t.length <= maxChars) return t;
  return `${t.slice(0, Math.max(1, maxChars - 1)).trim()}…`;
}

function asRecord(value: unknown): Record<string, unknown> | null {
  return value && typeof value === "object" && !Array.isArray(value) ? (value as Record<string, unknown>) : null;
}

let __lastDecisionAnalysisSelectorScenarioLoadSig: string | null = null;

function buildDecisionAnalysisSelectorScenarioLoadSignature(
  responseData: Record<string, unknown> | null,
  sceneJson: Record<string, unknown> | null,
  source: "responseData" | "sceneJson" | "scene.scene",
  direct: Record<string, unknown> | null
): string {
  const responseKeys = responseData ? Object.keys(responseData).sort().slice(0, 24) : [];
  const sceneKeys = sceneJson ? Object.keys(sceneJson).sort().slice(0, 24) : [];
  const analysisSummary =
    typeof responseData?.analysis_summary === "string" ? responseData.analysis_summary.trim().slice(0, 180) : null;
  const strategyCount = Array.isArray(direct?.strategies) ? direct.strategies.length : 0;
  const hasRecommendedAction = Boolean(asRecord(direct?.recommended_action));
  return JSON.stringify({
    source,
    hasResponseData: Boolean(responseData),
    hasSceneJson: Boolean(sceneJson),
    responseKeys,
    sceneKeys,
    analysisSummary,
    strategyCount,
    hasRecommendedAction,
  });
}

function firstSentence(text: string): string {
  const t = text.trim();
  if (!t) return "";
  const cut = t.split(/(?<=[.!?])\s+/)[0] ?? t;
  return cut.trim();
}

function humanizeStrategyId(id: string): string {
  const raw = id.replace(/^act_/i, "").replace(/_/g, " ").trim();
  if (!raw) return id;
  return raw.charAt(0).toUpperCase() + raw.slice(1);
}

function riskLevelLabel(baselineRisk: number): string {
  if (!Number.isFinite(baselineRisk)) return "Unrated";
  if (baselineRisk >= 0.66) return "High";
  if (baselineRisk >= 0.4) return "Moderate";
  return "Low";
}

function confidenceFromStrategy(best: Record<string, unknown> | null): ScenarioExplanationConfidence | undefined {
  if (!best) return undefined;
  const score = Number(best.decision_score);
  const risk = Number(best.risk);
  if (!Number.isFinite(score) || !Number.isFinite(risk)) return undefined;
  const normalized = (Math.tanh(score) + 1) / 2;
  const blended = 0.55 * normalized + 0.45 * (1 - risk);
  if (blended >= 0.68 && risk <= 0.45) return "high";
  if (blended >= 0.48) return "medium";
  return "low";
}

export function pickDecisionAnalysisFromResponse(responseData: unknown, sceneJson: unknown): Record<string, unknown> | null {
  const rd = asRecord(responseData);
  const sj = asRecord(sceneJson);
  const scene = asRecord(sj?.scene);
  const fromResponse = asRecord(rd?.decision_analysis);
  const fromScene = asRecord(sj?.decision_analysis);
  const fromNestedScene = asRecord(scene?.decision_analysis);
  const direct = fromResponse ?? fromScene ?? fromNestedScene ?? null;
  if (typeof process !== "undefined" && process.env.NODE_ENV !== "production" && direct) {
    const source: "responseData" | "sceneJson" | "scene.scene" = fromResponse ? "responseData" : fromScene ? "sceneJson" : "scene.scene";
    const signature = buildDecisionAnalysisSelectorScenarioLoadSignature(rd, sj, source, direct);
    if (__lastDecisionAnalysisSelectorScenarioLoadSig !== signature) {
      __lastDecisionAnalysisSelectorScenarioLoadSig = signature;
      console.debug("[Nexora][DecisionAnalysis][Selector][ScenarioLoad]", { source });
    }
  }
  return direct;
}

/** Stable memo/useEffect dependency when `decision_analysis` is updated in place on the same parent object. */
export function decisionAnalysisDependencyKey(decisionAnalysis: Record<string, unknown> | null): string {
  if (!decisionAnalysis) return "";
  try {
    return JSON.stringify(decisionAnalysis);
  } catch {
    return "__decision_analysis_unserializable__";
  }
}

/**
 * Map backend ``decision_analysis`` (+ optional fallbacks) to Problem / Cause / Impact / Recommendation copy.
 */
/** Short primary action line for assistant rail / headers (no fallbacks merge). */
export function extractDecisionRecommendationLine(decisionAnalysis: unknown): string | null {
  const da = asRecord(decisionAnalysis);
  if (!da) return null;
  const rec = asRecord(da.recommended_action);
  const strategies = Array.isArray(da.strategies) ? da.strategies : [];
  if (!rec || typeof rec.id !== "string" || !rec.id.trim()) return null;
  const execAction = typeof rec.action === "string" && rec.action.trim() ? rec.action.trim() : "";
  if (execAction) {
    const out =
      typeof rec.expected_outcome === "string" && rec.expected_outcome.trim()
        ? firstSentence(rec.expected_outcome)
        : "";
    return clampLine(out ? `${execAction} ${out}` : execAction, 240) || null;
  }
  const rid = rec.id.trim();
  const match = strategies.map((s) => asRecord(s)).find((row) => row && String(row.id) === rid) ?? null;
  const title =
    (match && typeof match.description === "string" && match.description.trim()) ||
    (typeof (rec as { title?: unknown }).title === "string" && String((rec as { title?: string }).title).trim()) ||
    humanizeStrategyId(rid);
  const reason = typeof rec.reason === "string" ? firstSentence(rec.reason) : "";
  const short =
    (match && typeof match.expected_outcome === "string" && firstSentence(String(match.expected_outcome))) || reason;
  const line = clampLine(short ? `${title} — ${short}` : title, 220);
  return line || null;
}

const NO_ANALYSIS_LINE = "No trusted decision available. Run analysis.";

const NO_DECISION_ANALYSIS_COPY: ScenarioExplanationBlockInput = {
  problem: NO_ANALYSIS_LINE,
  cause: NO_ANALYSIS_LINE,
  impact: NO_ANALYSIS_LINE,
  recommendation: NO_ANALYSIS_LINE,
};

function getSceneObjectsFromSource(source: unknown): Record<string, unknown>[] {
  const record = asRecord(source);
  if (!record) return [];
  const nestedScene = asRecord(record.scene);
  const directObjects = Array.isArray(record.objects) ? record.objects : null;
  const nestedObjects = nestedScene && Array.isArray(nestedScene.objects) ? nestedScene.objects : null;
  const objects = directObjects ?? nestedObjects ?? [];
  return objects.filter((value): value is Record<string, unknown> => !!asRecord(value));
}

function sceneObjectId(entry: Record<string, unknown>): string | null {
  const candidates = [entry.id, entry.objectId, entry.object_id, entry.name];
  for (const candidate of candidates) {
    if (typeof candidate === "string" && candidate.trim().length > 0) return candidate.trim();
  }
  return null;
}

function sceneObjectLabel(entry: Record<string, unknown>, fallbackId: string): string {
  const candidates = [entry.label, entry.name, entry.title];
  for (const candidate of candidates) {
    if (typeof candidate === "string" && candidate.trim().length > 0) return candidate.trim();
  }
  return fallbackId;
}

function resolveObjectLabel(sceneJson: unknown, responseData: unknown, objectId: string): string {
  for (const source of [sceneJson, responseData]) {
    const match = getSceneObjectsFromSource(source).find((o) => sceneObjectId(o) === objectId);
    if (match) return sceneObjectLabel(match, objectId);
  }
  return objectId;
}

function firstHighlightedObjectId(sources: unknown[]): string | null {
  for (const source of sources) {
    const r = asRecord(source);
    if (!r) continue;
    const selections = [asRecord(r.object_selection), asRecord(asRecord(r.scene)?.object_selection)];
    for (const sel of selections) {
      const hi = Array.isArray(sel?.highlighted_objects) ? sel.highlighted_objects : [];
      for (const id of hi) {
        if (typeof id === "string" && id.trim()) return id.trim();
      }
    }
  }
  return null;
}

function pickObjectImpacts(
  da: Record<string, unknown> | null,
  rd: Record<string, unknown> | null,
  sj: Record<string, unknown> | null
): Record<string, unknown> | null {
  return (
    (da && asRecord(da.object_impacts)) ??
    (rd && asRecord(rd.object_impacts)) ??
    (sj && asRecord(sj.object_impacts)) ??
    null
  );
}

function firstObjectImpactId(impacts: Record<string, unknown> | null): string | null {
  if (!impacts) return null;
  const primary = Array.isArray(impacts.primary) ? impacts.primary : [];
  for (const row of primary) {
    const o = asRecord(row);
    const id = typeof o?.object_id === "string" ? o.object_id.trim() : "";
    if (id) return id;
  }
  const affected = Array.isArray(impacts.affected) ? impacts.affected : [];
  for (const row of affected) {
    const o = asRecord(row);
    const id = typeof o?.object_id === "string" ? o.object_id.trim() : "";
    if (id) return id;
  }
  return null;
}

function collectSimulationEventSignals(da: Record<string, unknown>): string[] {
  const strategies = Array.isArray(da.strategies) ? da.strategies : [];
  for (const s of strategies) {
    const row = asRecord(s);
    const sim = asRecord(row?.simulation);
    const events = Array.isArray(sim?.events) ? sim.events : [];
    const out: string[] = [];
    for (const ev of events) {
      const e = asRecord(ev);
      const sig = typeof e?.signal === "string" ? e.signal.trim() : "";
      const msg = typeof e?.message === "string" ? firstSentence(e.message) : "";
      const piece = (msg || sig).trim();
      if (piece) out.push(piece);
    }
    if (out.length) return out;
  }
  return [];
}

function capitalizeFirst(s: string): string {
  const t = s.trim();
  if (!t) return t;
  return t.charAt(0).toUpperCase() + t.slice(1);
}

/** Turn a short signal / fragility token into a business pressure phrase. */
function signalAsPressurePhrase(raw: string): string {
  const t = raw.trim().toLowerCase().replace(/\s+/g, " ");
  if (!t) return "cross-cutting operational stress";
  if (t.includes("pressure") || t.includes("strain") || t.includes("risk") || t.includes("imbalance")) return t;
  if (t.endsWith("delay") || t.includes("latency")) return `${t} exposure`;
  return `${t} pressure`;
}

function timingFromHorizon(rec: Record<string, unknown> | null): string {
  const h = rec ? String(rec.time_horizon ?? "").toLowerCase().trim() : "";
  if (h === "immediate") return "in the immediate cycle";
  if (h === "short") return "within the next few cycles";
  if (h === "medium") return "before downstream demand expands";
  return "within the next planning window";
}

function primaryPressureLabel(
  fragilities: string[],
  eventSignals: string[],
  insights: string[],
  problemSummary: string
): string {
  const pick = fragilities[0] || eventSignals[0] || insights[0] || "";
  if (pick) return signalAsPressurePhrase(pick);
  const ps = firstSentence(problemSummary) || problemSummary.trim();
  if (ps.length > 8) return ps.length > 72 ? `${ps.slice(0, 69)}…` : ps;
  return "multiple modeled stressors on throughput and commitments";
}

function buildCausalCause(
  sigA: string,
  sigB: string | null,
  objectLabel: string,
  problemSummary: string
): string {
  const anchor = objectLabel.trim() || "the operating network";
  const a = signalAsPressurePhrase(sigA);
  if (sigB && sigB !== sigA) {
    const b = signalAsPressurePhrase(sigB);
    return clampLine(
      `${capitalizeFirst(a)} and ${b} interact to tighten performance around ${anchor}, accelerating knock-on exposure before controls fully absorb the shock.`,
      280
    );
  }
  if (problemSummary.length > 12) {
    return clampLine(
      `${capitalizeFirst(a)} concentrates stress on ${anchor}, consistent with ${firstSentence(problemSummary).toLowerCase() || problemSummary.slice(0, 80)}`,
      280
    );
  }
  return clampLine(
    `${capitalizeFirst(a)} concentrates stress on ${anchor}, widening the gap between committed service levels and executable capacity.`,
    280
  );
}

function buildForwardImpact(params: {
  riskLabel: string;
  brTxt: string;
  fcN: number;
  ccN: number;
  objectLabel: string;
  eventCount: number;
}): string {
  const focus = params.objectLabel.trim() || "critical flows";
  const fragPart =
    params.fcN > 0
      ? `${params.fcN} fragilit${params.fcN === 1 ? "y" : "ies"} in the model`
      : "thin redundancy in the model";
  const conflictPart = params.ccN > 0 ? `, plus ${params.ccN} strategic conflict(s) that couple decisions` : "";
  const evt =
    params.eventCount > 0
      ? ` Discrete simulation events (${params.eventCount}) reinforce that path dependency.`
      : "";
  return clampLine(
    `If unaddressed, ${params.riskLabel.toLowerCase()} baseline exposure (${params.brTxt}) with ${fragPart}${conflictPart} will propagate service risk—eroding delivery reliability, margin, and commitment credibility—particularly where ${focus} is thinnest.${evt}`,
    320
  );
}

function buildExecutiveRecommendation(
  rec: Record<string, unknown> | null,
  strategies: Record<string, unknown>[],
  objectLabel: string,
  primaryPressure: string,
  decisionSummary: string
): string {
  const anchor = objectLabel.trim() || "the network";
  const pressure = primaryPressure.toLowerCase().includes("pressure") ? primaryPressure : `${primaryPressure} pressure`;
  const timing = timingFromHorizon(rec);
  if (rec) {
    const execAction = typeof rec.action === "string" ? rec.action.trim() : "";
    if (execAction) {
      const execOutcome =
        typeof rec.expected_outcome === "string" && rec.expected_outcome.trim()
          ? firstSentence(rec.expected_outcome)
          : "";
      const core = execOutcome
        ? `${execAction} — targeting ${anchor} ${timing} to contain ${pressure} while locking in ${execOutcome.toLowerCase()}`
        : `${execAction} — prioritizing ${anchor} ${timing} to contain ${pressure}`;
      return clampLine(core, 300);
    }
  }
  const best = strategies[0] ?? null;
  if (best) {
    const desc = typeof best.description === "string" ? best.description.trim() : "";
    const exp =
      typeof best.expected_outcome === "string" && best.expected_outcome.trim()
        ? firstSentence(best.expected_outcome)
        : "";
    if (desc) {
      return clampLine(
        `${desc} Apply with focus on ${anchor} ${timing} to relieve ${pressure}${exp ? `; expected: ${exp}` : ""}.`,
        300
      );
    }
  }
  if (rec && typeof rec.id === "string" && rec.id.trim()) {
    const rid = rec.id.trim();
    const match = strategies.find((row) => row && String(row.id) === rid) ?? null;
    const title =
      (match && typeof match.description === "string" && match.description.trim()) ||
      (typeof rec.title === "string" && rec.title.trim()) ||
      humanizeStrategyId(rid);
    return clampLine(`${title} on ${anchor} ${timing} to reduce ${pressure}.`, 280);
  }
  return clampLine(firstSentence(decisionSummary) || decisionSummary, 280);
}

function buildExplainableConfidenceBlock(params: {
  label: "low" | "medium" | "high";
  strategyCount: number;
  portfolioRisk: number;
  strategyRisk: number;
  baselineStability: number;
  strategyStability: number;
}): TrustConfidenceBlock {
  const n = Math.max(0, params.strategyCount);
  const br = params.portfolioRisk;
  const sr = params.strategyRisk;
  const bs = params.baselineStability;
  const ss = params.strategyStability;

  let riskSeg: string;
  if (Number.isFinite(br) && Number.isFinite(sr)) {
    if (sr < br - 0.005) riskSeg = `Risk \u2193 ${br.toFixed(2)} \u2192 ${sr.toFixed(2)}`;
    else if (sr > br + 0.005) riskSeg = `Risk \u2191 ${br.toFixed(2)} \u2192 ${sr.toFixed(2)}`;
    else riskSeg = `Risk ${sr.toFixed(2)} (strategy) vs ${br.toFixed(2)} (portfolio)`;
  } else riskSeg = Number.isFinite(br) ? `Portfolio risk ${br.toFixed(2)}` : "Risk metrics partial";

  let stabSeg: string;
  if (Number.isFinite(bs) && Number.isFinite(ss)) {
    if (ss > bs + 0.02) stabSeg = `Stability \u2191 ${bs.toFixed(2)} \u2192 ${ss.toFixed(2)}`;
    else stabSeg = `Stability ${ss.toFixed(2)} vs baseline ${bs.toFixed(2)}`;
  } else if (Number.isFinite(ss)) stabSeg = `Stable outcome (stability ${ss.toFixed(2)})`;
  else stabSeg = "Outcome profile from strategy simulation";

  const summaryLine = clampLine(`Based on ${n} strateg${n === 1 ? "y" : "ies"} \u00b7 ${riskSeg} \u00b7 ${stabSeg}`, 260);
  const explanation = clampLine(
    `Derived from ${n} evaluated strateg${n === 1 ? "y" : "ies"}, with the portfolio-versus-strategy risk spread and stability readout above across the modeled simulation horizon.`,
    260
  );
  return { label: params.label, summaryLine, explanation };
}

function buildTraceableEvidenceLines(params: {
  risk: Record<string, unknown> | null;
  brTxt: string;
  fcN: number;
  ccN: number;
  fragilities: string[];
  insights: string[];
  best: Record<string, unknown> | null;
  apiEvidence: string[];
}): string[] {
  const out: string[] = [];
  out.push(`Baseline risk (risk_analysis): ${params.brTxt}`);
  const bs = params.risk ? Number(params.risk.baseline_stability) : NaN;
  const ssBest = params.best ? Number(params.best.stability_score) : NaN;
  if (Number.isFinite(bs) && Number.isFinite(ssBest)) {
    if (ssBest > bs + 0.005) {
      out.push(`Stability \u2191 ${bs.toFixed(2)} \u2192 ${ssBest.toFixed(2)} (risk_analysis vs top strategy evaluation)`);
    } else if (ssBest < bs - 0.005) {
      out.push(`Stability \u2193 ${bs.toFixed(2)} \u2192 ${ssBest.toFixed(2)} (risk_analysis vs top strategy evaluation)`);
    } else {
      out.push(`Stability ${bs.toFixed(2)} \u2192 ${ssBest.toFixed(2)} (risk_analysis vs top strategy evaluation)`);
    }
  } else if (Number.isFinite(bs)) {
    out.push(`Baseline stability (risk_analysis): ${bs.toFixed(2)}`);
  }
  if (params.best) {
    const sr = Number(params.best.risk);
    const ss = Number(params.best.stability_score);
    const ds = Number(params.best.decision_score);
    const bits: string[] = [];
    if (Number.isFinite(sr)) bits.push(`residual risk ${sr.toFixed(2)}`);
    if (Number.isFinite(ss)) bits.push(`stability ${ss.toFixed(2)}`);
    if (Number.isFinite(ds)) bits.push(`decision score ${ds.toFixed(2)}`);
    if (bits.length) out.push(`Selected strategy evaluation: ${bits.join(", ")}`);
    const sim = asRecord(params.best.simulation);
    if (sim) {
      const simSt = Number(sim.stability_score);
      const evN = Array.isArray(sim.events) ? sim.events.length : 0;
      const tlN = Array.isArray(sim.timeline) ? sim.timeline.length : 0;
      const simBits: string[] = [];
      if (Number.isFinite(simSt)) simBits.push(`run stability ${simSt.toFixed(2)}`);
      if (tlN > 0) simBits.push(`${Math.max(0, tlN - 1)} step horizon`);
      if (evN > 0) simBits.push(`${evN} simulation event(s)`);
      if (simBits.length) out.push(`Baseline simulation (selected strategy path): ${simBits.join(", ")}`);
    }
  }
  if (params.fcN > 0 && params.fragilities.length) {
    out.push(
      `${params.fcN} fragilit${params.fcN === 1 ? "y" : "ies"} concentrated in: ${params.fragilities.slice(0, 3).join(", ")}`
    );
  } else if (params.risk && params.fcN === 0) {
    out.push("Fragility count in risk_analysis: 0");
  }
  out.push(
    params.ccN > 0 ? `Strategic conflicts (risk_analysis): ${params.ccN}` : "Strategic conflicts (risk_analysis): none flagged"
  );
  for (const ins of params.insights) {
    if (out.length >= 5) break;
    const line = clampLine(ins, 220);
    if (line && !out.some((x) => x.slice(0, 50) === line.slice(0, 50))) out.push(`Insight: ${line}`);
  }
  for (const ex of params.apiEvidence) {
    if (out.length >= 5) break;
    if (ex && !out.includes(ex)) out.push(ex);
  }
  return out.slice(0, 5);
}

function buildRiskTransparencyBullets(
  best: Record<string, unknown> | null,
  second: Record<string, unknown> | null,
  rec: Record<string, unknown> | null
): string[] {
  const out: string[] = [];
  if (best && Array.isArray(best.unintended_consequences)) {
    for (const u of best.unintended_consequences) {
      const t = String(u ?? "").trim();
      if (t && out.length < 3) out.push(clampLine(t, 220));
    }
  }
  if (rec && typeof rec.tradeoffs === "string" && rec.tradeoffs.trim()) {
    const parts = rec.tradeoffs
      .split(/[.\n]+/)
      .map((s) => s.trim())
      .filter(Boolean);
    for (const p of parts) {
      if (out.length >= 3) break;
      const line = clampLine(p, 220);
      if (line && !out.includes(line)) out.push(line);
    }
  }
  if (second && best && out.length < 3) {
    const r1 = Number(best.risk);
    const r2 = Number(second.risk);
    const s1 = Number(best.stability_score);
    const s2 = Number(second.stability_score);
    const c1 = Number(best.cost);
    const c2 = Number(second.cost);
    const sid = String(second.id ?? "runner-up");
    if (Number.isFinite(r1) && Number.isFinite(r2) && Number.isFinite(s1) && Number.isFinite(s2)) {
      if (r2 < r1 - 0.02 && s2 >= s1) {
        out.push(
          `Runner-up ${sid} shows lower modeled risk (${r2.toFixed(2)} vs ${r1.toFixed(2)}) and comparable stability; lead selection reflects the composite score, not risk alone.`
        );
      } else if (s2 > s1 + 0.03) {
        out.push(
          `Runner-up ${sid} lifts stability faster (${s2.toFixed(2)} vs ${s1.toFixed(2)}) but carries higher residual risk (${r2.toFixed(2)} vs ${r1.toFixed(2)}).`
        );
      } else if (Number.isFinite(c2) && Number.isFinite(c1) && c2 + 0.04 < c1) {
        out.push(
          `Runner-up ${sid} is cheaper on the cost axis (${c2.toFixed(2)} vs ${c1.toFixed(2)}) with different risk-return geometry.`
        );
      }
    }
  }
  if (out.length < 3 && best) {
    const sim = asRecord(best.simulation);
    const events = sim && Array.isArray(sim.events) ? sim.events : [];
    const last = events.length > 0 ? asRecord(events[events.length - 1]) : null;
    const msg = last && typeof last.message === "string" ? last.message.trim() : "";
    if (msg) out.push(`Simulation tail risk signal: ${clampLine(firstSentence(msg), 200)}`);
  }
  return out.slice(0, 3);
}

function buildWhyThisTrustBullets(params: {
  strategyCount: number;
  portfolioRisk: number;
  best: Record<string, unknown> | null;
  second: Record<string, unknown> | null;
  rec: Record<string, unknown> | null;
}): string[] {
  const bullets: string[] = [];
  const n = Math.max(0, params.strategyCount);
  const rid =
    params.rec && typeof params.rec.id === "string" && params.rec.id.trim()
      ? params.rec.id.trim()
      : params.best && params.best.id != null
        ? String(params.best.id)
        : "selected strategy";
  bullets.push(
    n > 0
      ? `Evaluated ${n} strateg${n === 1 ? "y" : "ies"} for flow and stability under this system model.`
      : `Ranked candidate strategies from the attached baseline simulation.`
  );
  const br = params.portfolioRisk;
  const sr = params.best ? Number(params.best.risk) : NaN;
  if (Number.isFinite(br) && Number.isFinite(sr)) {
    if (sr < br - 0.005) {
      bullets.push(
        `Top strategy (${rid}) reduces modeled residual risk from portfolio baseline ${br.toFixed(2)} to ${sr.toFixed(2)} on the evaluated path.`
      );
    } else {
      bullets.push(
        `Top strategy (${rid}) lands at modeled residual risk ${sr.toFixed(2)} against portfolio baseline ${br.toFixed(2)}; ranking optimizes the blended ledger.`
      );
    }
  }
  if (params.second && params.best) {
    const b1 = Number(params.best.risk);
    const b2 = Number(params.second.risk);
    const s1 = Number(params.best.stability_score);
    const s2 = Number(params.second.stability_score);
    const c1 = Number(params.best.cost);
    const c2 = Number(params.second.cost);
    const sid = String(params.second.id ?? "runner-up");
    if (Number.isFinite(b1) && Number.isFinite(b2) && Number.isFinite(s1) && Number.isFinite(s2)) {
      if (b2 < b1 && s2 + 0.02 < s1) {
        bullets.push(
          `Runner-up ${sid} is risk-light (${b2.toFixed(2)}) but sacrifices stability (${s2.toFixed(2)} vs ${s1.toFixed(2)}); ${rid} wins on balance.`
        );
      } else if (s2 > s1 + 0.02) {
        bullets.push(
          `Runner-up ${sid} improves speed-to-stability (${s2.toFixed(2)} vs ${s1.toFixed(2)}) at higher modeled risk (${b2.toFixed(2)} vs ${b1.toFixed(2)}).`
        );
      } else if (Number.isFinite(c2) && Number.isFinite(c1) && c2 + 0.05 < c1) {
        bullets.push(
          `Runner-up ${sid} lowers execution cost (${c2.toFixed(2)} vs ${c1.toFixed(2)}) yet does not beat ${rid} on the composite decision score.`
        );
      } else {
        bullets.push(
          `Runner-up ${sid} stays competitive (risk ${b2.toFixed(2)}, stability ${s2.toFixed(2)}) but underperforms ${rid} on the ranked objective.`
        );
      }
    }
  }
  bullets.push(`${rid} best balances risk, stability, and cost in the strategy ranking for this snapshot.`);
  return bullets.slice(0, 5);
}

/** Memo key: decision analysis content plus highlighted / impact object context from scene + response. */
export function riskExplanationDependencyKey(
  decisionAnalysis: Record<string, unknown> | null,
  sceneJson: unknown,
  responseData: unknown
): string {
  const daKey = decisionAnalysisDependencyKey(decisionAnalysis);
  const rd = asRecord(responseData);
  const sj = asRecord(sceneJson);
  const da = decisionAnalysis;
  const impacts = pickObjectImpacts(da, rd, sj);
  const ctx = {
    h: firstHighlightedObjectId([sj, rd]),
    oi: firstObjectImpactId(impacts),
  };
  try {
    return `${daKey}@@${JSON.stringify(ctx)}`;
  } catch {
    return `${daKey}@@`;
  }
}

/**
 * Map backend ``decision_analysis`` + scene/response context to Problem / Cause / Impact / Recommendation.
 * When no analysis is present, returns a single minimal fallback (no generic “enter prompt” copy).
 */
export function buildScenarioExplanationFromDecisionAnalysis(
  decisionAnalysis: unknown,
  sceneJson?: unknown,
  responseData?: unknown
): ScenarioExplanationBlockInput {
  const da = asRecord(decisionAnalysis);
  if (!da) {
    return { ...NO_DECISION_ANALYSIS_COPY };
  }

  const rd = asRecord(responseData) ?? null;
  const sj = asRecord(sceneJson) ?? null;
  const risk = asRecord(da.risk_analysis);
  const systemModel = asRecord(da.system_model);
  const problemSummary = typeof systemModel?.problem_summary === "string" ? systemModel.problem_summary.trim() : "";
  const decisionSummary = typeof da.decision_summary === "string" ? da.decision_summary.trim() : "";

  const impacts = pickObjectImpacts(da, rd, sj);
  const highlightId = firstHighlightedObjectId([sj, rd]);
  const impactObjectId = firstObjectImpactId(impacts);
  const primaryObjectId = highlightId ?? impactObjectId;
  const objectLabel = primaryObjectId ? resolveObjectLabel(sceneJson, responseData, primaryObjectId) : "";

  const fragilities = Array.isArray(risk?.primary_fragilities)
    ? (risk.primary_fragilities as unknown[]).map((x) => String(x).trim()).filter(Boolean)
    : [];
  const eventSignals = collectSimulationEventSignals(da);
  const insights = Array.isArray(da.system_insights) ? da.system_insights.map((x) => String(x).trim()).filter(Boolean) : [];
  const primaryPressure = primaryPressureLabel(fragilities, eventSignals, insights, problemSummary);

  const networkSubject = objectLabel.trim() || "This operating network";
  const problem = clampLine(`${networkSubject} is constrained by ${primaryPressure}`, 220);

  const sigA = fragilities[0] || eventSignals[0] || insights[0] || primaryPressure;
  const sigBRaw = fragilities[1] || eventSignals[1] || insights[1] || null;
  const sigB = sigBRaw && sigBRaw !== sigA ? sigBRaw : null;
  const cause = buildCausalCause(sigA, sigB, objectLabel.trim() || networkSubject, problemSummary);

  const br = risk ? Number(risk.baseline_risk) : NaN;
  const fc = risk ? Number(risk.fragility_count) : NaN;
  const cc = risk ? Number(risk.conflict_count) : NaN;
  const ec = risk ? Number(risk.event_count) : NaN;
  const riskLabel = risk ? riskLevelLabel(br) : "Unrated";
  const fcN = Number.isFinite(fc) ? Math.max(0, Math.floor(fc)) : 0;
  const ccN = Number.isFinite(cc) ? Math.max(0, Math.floor(cc)) : 0;
  const eventCount = Number.isFinite(ec) ? Math.max(0, Math.floor(ec)) : 0;
  const brTxt = Number.isFinite(br) ? br.toFixed(2) : "?";

  const impact = risk
    ? buildForwardImpact({
        riskLabel,
        brTxt,
        fcN,
        ccN,
        objectLabel,
        eventCount,
      })
    : clampLine(
        `Without a quantified risk profile in this payload, unmitigated stress on ${objectLabel.trim() || "core flows"} still threatens delivery and margin if leadership delays a decision.`,
        260
      );

  const strategiesRaw = Array.isArray(da.strategies) ? da.strategies : [];
  const strategies = strategiesRaw.map((s) => asRecord(s)).filter((row): row is Record<string, unknown> => !!row);
  const rec = asRecord(da.recommended_action);
  const recommendation = buildExecutiveRecommendation(rec, strategies, objectLabel, primaryPressure, decisionSummary);

  const best = strategies[0] ?? null;
  const second = strategies[1] ?? null;
  const conf = confidenceFromStrategy(best);

  const trustConfLabel = ((): TrustConfidenceBlock["label"] => {
    const fromStrategy = confidenceFromStrategy(best);
    if (fromStrategy) return fromStrategy;
    const priority = String(rec?.priority ?? "").toLowerCase();
    if (priority === "high") return "high";
    if (priority === "low") return "low";
    return "low";
  })();

  const meta = asRecord(da.metadata);
  const strategyCount =
    typeof meta?.strategy_count === "number" && Number.isFinite(meta.strategy_count)
      ? Math.max(0, Math.floor(meta.strategy_count))
      : strategies.length;

  const trustRec = asRecord(da.recommended_action);
  const apiEvidence = Array.isArray(trustRec?.evidence)
    ? trustRec.evidence.map((x) => clampLine(String(x ?? "").trim(), 180)).filter(Boolean)
    : [];

  const bs = risk ? Number(risk.baseline_stability) : NaN;
  const sr = best ? Number(best.risk) : NaN;
  const ss = best ? Number(best.stability_score) : NaN;

  const explainConfidence = buildExplainableConfidenceBlock({
    label: trustConfLabel,
    strategyCount,
    portfolioRisk: br,
    strategyRisk: sr,
    baselineStability: bs,
    strategyStability: ss,
  });

  const whyThisBulletsRaw = buildWhyThisTrustBullets({
    strategyCount,
    portfolioRisk: br,
    best,
    second,
    rec,
  });
  const apiWhy =
    (typeof trustRec?.why_this === "string" ? trustRec.why_this.trim() : "") ||
    (typeof trustRec?.rationale === "string" ? trustRec.rationale.trim() : "") ||
    "";
  const whyThisBullets = (() => {
    const raw = whyThisBulletsRaw;
    if (!apiWhy) return raw;
    const head = clampLine(apiWhy, 240);
    const headKey = head.slice(0, 48);
    if (raw.some((r) => r.slice(0, 48) === headKey)) return raw.slice(0, 5);
    return [head, ...raw].slice(0, 5);
  })();

  const evidence = buildTraceableEvidenceLines({
    risk,
    brTxt,
    fcN,
    ccN,
    fragilities,
    insights,
    best,
    apiEvidence,
  });

  let riskTradeoffs = buildRiskTransparencyBullets(best, second, rec);
  if (riskTradeoffs.length === 0 && Number.isFinite(br) && br >= 0.45) {
    riskTradeoffs = [
      clampLine(
        `Modeled baseline risk remains material (${br.toFixed(2)}); benefits assume the recommended controls land as simulated.`,
        220
      ),
    ];
  }

  const traceId =
    rec && typeof rec.id === "string" && rec.id.trim()
      ? rec.id.trim()
      : best && best.id != null
        ? String(best.id)
        : "selection";
  const decisionTrace = clampLine(
    `Decision derived from: System Model → Simulation → ${strategyCount}-strategy ranking → ${traceId}`,
    240
  );

  return {
    problem,
    cause,
    impact,
    recommendation,
    ...(conf ? { confidence: conf } : {}),
    trust: {
      confidence: explainConfidence,
      whyThisBullets,
      evidence,
      riskTradeoffs,
      decisionTrace,
    },
  };
}
