"use client";

import React, { useEffect, useMemo } from "react";
import {
  buildScenarioExplanationFromDecisionAnalysis,
  pickDecisionAnalysisFromResponse,
  riskExplanationDependencyKey,
} from "../../lib/panels/buildScenarioExplanationFromDecisionAnalysis";
import { ScenarioExplanationView, type WarRoomExplanationChrome } from "./ScenarioExplanationView";
import type { CanonicalRecommendation } from "../../lib/decision/recommendation/recommendationTypes";
import { buildDecisionExecutionIntent } from "../../lib/execution/buildDecisionExecutionIntent";
import type { DecisionExecutionResult } from "../../lib/executive/decisionExecutionTypes";
import type { DecisionAutomationResult } from "../../lib/execution/decisionAutomationTypes";
import type { DecisionExecutionIntent } from "../../lib/execution/decisionExecutionIntent";

type Props = {
  responseData?: unknown;
  sceneJson?: unknown;
  selectedObjectId?: string | null;
  selectedObjectLabel?: string | null;
  canonicalRecommendation?: CanonicalRecommendation | null;
  decisionResult?: DecisionExecutionResult | null;
  onSimulateDecision?: (() => void) | null;
  onApplyDecisionSafe?:
    | ((intent: DecisionExecutionIntent | null) => DecisionAutomationResult | Promise<DecisionAutomationResult | void> | void)
    | null;
};

function asRecord(value: unknown): Record<string, unknown> | null {
  return value && typeof value === "object" && !Array.isArray(value) ? (value as Record<string, unknown>) : null;
}

function shortenAction(action: string, maxChars: number): string {
  const t = action.trim().replace(/\s+/g, " ");
  if (!t) return "";
  if (t.length <= maxChars) return t;
  return `${t.slice(0, Math.max(1, maxChars - 1)).trimEnd()}…`;
}

function formatTimeHorizon(raw: unknown): string | null {
  const t = String(raw ?? "").trim().toLowerCase();
  if (t === "immediate") return "Immediate";
  if (t === "short") return "Short";
  if (t === "medium") return "Medium";
  return null;
}

export function RiskExplanationPanel(props: Props) {
  const decisionAnalysis = pickDecisionAnalysisFromResponse(props.responseData, props.sceneJson);
  const explanationKey = riskExplanationDependencyKey(decisionAnalysis, props.sceneJson, props.responseData);

  useEffect(() => {
    if (process.env.NODE_ENV === "production") return;
    if (!decisionAnalysis) return;
    console.log("DecisionAnalysis updated:", decisionAnalysis);
  }, [explanationKey, decisionAnalysis]);

  const block = useMemo(
    () => buildScenarioExplanationFromDecisionAnalysis(decisionAnalysis, props.sceneJson, props.responseData),
    // `explanationKey` includes analysis JSON + highlighted / object-impact context.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [explanationKey]
  );

  const warRoomChrome = useMemo((): WarRoomExplanationChrome => {
    const da = decisionAnalysis;
    if (!da) {
      const intentEmpty = buildDecisionExecutionIntent({
        source: "recommendation",
        canonicalRecommendation: props.canonicalRecommendation ?? null,
        responseData: props.responseData,
        decisionResult: props.decisionResult ?? null,
      });
      return {
        decisionFocus: null,
        timeHorizon: null,
        riskStatus: null,
        fragilityStatus: null,
        confidenceLabel: null,
        primaryNodeLabel:
          props.selectedObjectId && (props.selectedObjectLabel ?? "").trim()
            ? (props.selectedObjectLabel as string).trim()
            : null,
        onSimulate: props.onSimulateDecision ?? null,
        onExecute:
          props.onApplyDecisionSafe != null
            ? () => {
                void props.onApplyDecisionSafe?.(intentEmpty ?? null);
              }
            : null,
        executeDisabled: !intentEmpty?.target_ids?.length,
        dense: true,
      };
    }
    const rec = asRecord(da.recommended_action);
    const rawAction = typeof rec?.action === "string" ? rec.action.trim() : "";
    const decisionFocus = rawAction ? shortenAction(rawAction, 78) : null;
    const timeHorizon = formatTimeHorizon(rec?.time_horizon);

    const risk = asRecord(da.risk_analysis);
    const strategiesRaw = Array.isArray(da.strategies) ? da.strategies : [];
    const strategies = strategiesRaw.map((s) => asRecord(s)).filter((row): row is Record<string, unknown> => !!row);
    const rid = rec && typeof rec.id === "string" && rec.id.trim() ? rec.id.trim() : null;
    const ranked =
      (rid ? strategies.find((s) => String(s.id) === rid) : null) ??
      strategies[0] ??
      null;
    const br = risk ? Number(risk.baseline_risk) : NaN;
    const sr = ranked ? Number(ranked.risk) : NaN;
    let riskStatus: string | null = null;
    if (Number.isFinite(br) && Number.isFinite(sr)) {
      if (sr < br - 0.005) {
        riskStatus = `Risk: ${br.toFixed(2)} \u2192 ${sr.toFixed(2)} \u2193`;
      } else if (sr > br + 0.005) {
        riskStatus = `Risk: ${br.toFixed(2)} \u2192 ${sr.toFixed(2)} \u2191`;
      } else {
        riskStatus = `Risk: ${br.toFixed(2)} · path ${sr.toFixed(2)}`;
      }
    } else if (Number.isFinite(br)) {
      riskStatus = `Risk: ${br.toFixed(2)}`;
    }

    const fc = risk ? Number(risk.fragility_count) : NaN;
    const fragilityStatus = Number.isFinite(fc)
      ? `Fragility: ${Math.max(0, Math.floor(fc))} point${Math.floor(fc) === 1 ? "" : "s"}`
      : null;

    const trust = block.trust;
    const confidenceLabel = trust ? trust.confidence.label : null;

    const primaryNodeLabel =
      props.selectedObjectId && (props.selectedObjectLabel ?? "").trim()
        ? (props.selectedObjectLabel as string).trim()
        : null;

    const intent = buildDecisionExecutionIntent({
      source: "recommendation",
      canonicalRecommendation: props.canonicalRecommendation ?? null,
      responseData: props.responseData,
      decisionResult: props.decisionResult ?? null,
    });
    const executeDisabled = !intent?.target_ids?.length;

    return {
      decisionFocus,
      timeHorizon,
      riskStatus,
      fragilityStatus,
      confidenceLabel,
      primaryNodeLabel,
      onSimulate: props.onSimulateDecision ?? null,
      onExecute:
        props.onApplyDecisionSafe != null
          ? () => {
              void props.onApplyDecisionSafe?.(intent ?? null);
            }
          : null,
      executeDisabled,
      dense: true,
    };
  }, [
    block.trust,
    decisionAnalysis,
    props.canonicalRecommendation,
    props.decisionResult,
    props.onApplyDecisionSafe,
    props.onSimulateDecision,
    props.responseData,
    props.selectedObjectId,
    props.selectedObjectLabel,
  ]);

  return <ScenarioExplanationView block={block} showCaption={false} warRoom={warRoomChrome} />;
}
