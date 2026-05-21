"use client";

import type React from "react";

import type { AdaptiveGovernanceIntelligenceSnapshot } from "../../../lib/enterprise/governance";
import { nx } from "../../ui/nexoraTheme";
import { enterpriseAdaptiveGovernanceStripStyle } from "./enterpriseAdaptiveGovernanceStyles";

export function EnterpriseAdaptiveGovernanceStrip(props: {
  governance: AdaptiveGovernanceIntelligenceSnapshot;
}): React.ReactElement {
  const { governance } = props;

  const institutionalDisplay =
    governance.enterpriseCognitiveRuntimeComplete ||
    (governance.autonomousInstitutionalIntelligenceActive &&
      governance.institutionalIntelligencePosture !== "idle");

  const consciousnessDisplay =
    !institutionalDisplay &&
    (governance.enterpriseMetaIntelligenceActive ||
      (governance.unifiedStrategicConsciousnessActive &&
        governance.metaIntelligencePosture !== "idle"));

  const foresightDisplay =
    !institutionalDisplay &&
    !consciousnessDisplay &&
    (governance.futureStateIntelligenceActive ||
      (governance.strategicForesightActive && governance.strategicForesightPosture !== "idle"));

  const evolutionDisplay =
    !institutionalDisplay &&
    !consciousnessDisplay &&
    !foresightDisplay &&
    (governance.cognitiveEvolutionActive ||
      (governance.institutionalReflectionActive && governance.cognitiveEvolutionPosture !== "idle"));

  const metaDisplay =
    !institutionalDisplay &&
    !consciousnessDisplay &&
    !foresightDisplay &&
    !evolutionDisplay &&
    (governance.executiveMetaCognitionActive ||
      (governance.strategicSelfAwarenessActive && governance.metaCognitionPosture !== "idle"));

  const unifiedDisplay =
    !institutionalDisplay &&
    !consciousnessDisplay &&
    !foresightDisplay &&
    !evolutionDisplay &&
    !metaDisplay &&
    (governance.unifiedGovernanceRuntimeActive ||
      (governance.institutionalStrategicEvolutionConverged &&
        governance.evolutionConvergencePosture !== "idle"));

  const adaptationDisplay =
    !institutionalDisplay &&
    !consciousnessDisplay &&
    !foresightDisplay &&
    !evolutionDisplay &&
    !metaDisplay &&
    !unifiedDisplay &&
    (governance.organizationalEvolutionActive ||
      (governance.adaptationGovernanceActive && governance.adaptationPosture !== "idle"));

  const pressureDisplay =
    !institutionalDisplay &&
    !consciousnessDisplay &&
    !foresightDisplay &&
    !evolutionDisplay &&
    !metaDisplay &&
    !unifiedDisplay &&
    !adaptationDisplay &&
    (governance.executiveStabilityActive ||
      (governance.pressureGovernanceActive && governance.pressurePosture !== "idle"));

  const compact = institutionalDisplay
    ? governance.institutionalIntelligencePosture === "complete" ||
      governance.institutionalIntelligencePosture === "operational"
    : consciousnessDisplay
      ? governance.metaIntelligencePosture === "sustained" ||
        governance.metaIntelligencePosture === "orchestrated"
      : foresightDisplay
      ? governance.strategicForesightPosture === "sustained" ||
        governance.strategicForesightPosture === "anticipating"
      : evolutionDisplay
      ? governance.cognitiveEvolutionPosture === "sustained" ||
        governance.cognitiveEvolutionPosture === "evolving"
      : metaDisplay
      ? governance.metaCognitionPosture === "transparent" ||
        governance.metaCognitionPosture === "reflecting"
      : unifiedDisplay
      ? governance.evolutionConvergencePosture === "synchronized" ||
        governance.evolutionConvergencePosture === "self_regulating"
      : adaptationDisplay
      ? governance.adaptationPosture === "evolving" || governance.adaptationPosture === "progressive"
      : pressureDisplay
      ? governance.pressurePosture === "composed" || governance.pressurePosture === "resilient"
      : governance.strategicCalibrationActive
        ? governance.calibrationPosture === "adaptive" ||
          governance.calibrationPosture === "calibrating"
        : governance.enterpriseCoherenceActive
          ? governance.coherencePosture === "harmonized" ||
            governance.coherencePosture === "synchronized"
          : governance.oversightPosture === "oversight_active" ||
            governance.oversightPosture === "synchronized";

  const sectionLabel = institutionalDisplay
    ? "Enterprise cognition"
    : consciousnessDisplay
      ? "Meta-intelligence"
      : foresightDisplay
      ? "Strategic foresight"
      : evolutionDisplay
      ? "Cognitive evolution"
      : metaDisplay
      ? "Strategic self-awareness"
      : unifiedDisplay
      ? "Unified governance"
      : adaptationDisplay
      ? "Organizational evolution"
      : pressureDisplay
      ? "Executive stability"
      : governance.strategicCalibrationActive
        ? "Strategic calibration"
        : governance.enterpriseCoherenceActive
          ? "Strategic coherence"
          : "Governance intelligence";

  const subline = institutionalDisplay
    ? governance.institutionalSubline
    : consciousnessDisplay
      ? governance.consciousnessSubline
      : foresightDisplay
      ? governance.foresightSubline
      : evolutionDisplay
      ? governance.evolutionSubline
      : metaDisplay
      ? governance.reflectionSubline
      : unifiedDisplay
      ? governance.unifiedGovernanceSubline
      : adaptationDisplay
      ? governance.evolutionSubline
      : pressureDisplay
      ? governance.stabilitySubline
      : governance.strategicCalibrationActive
        ? governance.calibrationSubline
        : governance.enterpriseCoherenceActive
          ? governance.coherenceSubline
          : governance.governanceSubline;

  const detailLine = institutionalDisplay
    ? governance.synchronizationHealthLine ||
      governance.adaptationContinuityLine ||
      governance.executiveCognitionSyncLine
    : consciousnessDisplay
      ? governance.cognitionIntegrityLine ||
        governance.crossLayerSyncLine ||
        governance.executiveAttentionLine
      : foresightDisplay
      ? governance.trajectoryLine ||
        governance.resilienceForecastLine ||
        governance.strategicTimingLine
      : evolutionDisplay
      ? governance.strategicMaturityLine ||
        governance.resilienceEvolutionLine ||
        governance.organizationalLearningLine
      : metaDisplay
      ? governance.reasoningPathLine ||
        governance.assumptionsLine ||
        governance.uncertaintyLine
      : adaptationDisplay
      ? governance.transformationContinuityLine ||
        governance.adaptationGovernanceLine ||
        governance.operationalEvolutionLine
      : pressureDisplay
      ? governance.executiveStabilityLine ||
        governance.escalationGovernanceLine ||
        governance.pressureStabilizationLine
      : governance.strategicCalibrationActive
        ? governance.decisionQualityLine ||
          governance.operationalCorrectionLine ||
          governance.refinementInterpretationLine
        : governance.enterpriseCoherenceActive
          ? governance.alignmentIntegrityLine ||
            governance.operationalHarmonyLine ||
            governance.fragmentationAwarenessLine
          : governance.selfCalibrationLine || governance.oversightInterpretationLine;

  const timelineLine = institutionalDisplay
    ? governance.timelineInstitutionalContinuityLine
    : consciousnessDisplay
      ? governance.timelineStrategicContinuityLine
      : foresightDisplay
      ? governance.timelineFutureStateLine
      : evolutionDisplay
      ? governance.timelineInstitutionalEvolutionLine
      : metaDisplay
      ? governance.timelineReasoningLine
      : unifiedDisplay
      ? governance.timelineStrategicEvolutionLine
      : adaptationDisplay
      ? governance.timelineTransformationLine
      : pressureDisplay
      ? governance.timelineStabilityLine
      : governance.strategicCalibrationActive
        ? governance.timelineCalibrationLine
        : governance.enterpriseCoherenceActive
          ? governance.timelineCoherenceLine
          : governance.timelineGovernanceLine;

  const accentLine = institutionalDisplay
    ? governance.synchronizationHealthLine || governance.executiveCognitionSyncLine
    : consciousnessDisplay
      ? governance.continuityHealthLine || governance.cognitionIntegrityLine
      : foresightDisplay
      ? governance.uncertaintyFactorsLine || governance.resilienceForecastLine
      : evolutionDisplay
        ? governance.resilienceEvolutionLine || governance.strategicMaturityLine
        : metaDisplay
      ? governance.confidenceEvolutionLine || governance.advisoryLimitsLine
      : adaptationDisplay
      ? governance.adaptationGovernanceLine
      : pressureDisplay
      ? governance.escalationGovernanceLine
      : governance.strategicCalibrationActive
        ? governance.refinementInterpretationLine
        : governance.enterpriseCoherenceActive
          ? governance.operationalHarmonyLine
          : governance.strategicAlignmentLine;

  return (
    <section
      className="nx-enterprise-adaptive-governance-strip"
      data-nx-governance-posture={governance.oversightPosture}
      data-nx-governance-oversight={governance.governanceOversightActive ? "true" : "false"}
      data-nx-enterprise-self-calibration={
        governance.enterpriseSelfCalibrationActive ? "true" : "false"
      }
      data-nx-coherence-posture={governance.coherencePosture}
      data-nx-enterprise-coherence={governance.enterpriseCoherenceActive ? "true" : "false"}
      data-nx-alignment-integrity={
        governance.strategicAlignmentIntegrityActive ? "true" : "false"
      }
      data-nx-calibration-posture={governance.calibrationPosture}
      data-nx-strategic-calibration={governance.strategicCalibrationActive ? "true" : "false"}
      data-nx-decision-quality-cognition={
        governance.decisionQualityCognitionActive ? "true" : "false"
      }
      data-nx-pressure-posture={governance.pressurePosture}
      data-nx-executive-stability={governance.executiveStabilityActive ? "true" : "false"}
      data-nx-pressure-governance={governance.pressureGovernanceActive ? "true" : "false"}
      data-nx-adaptation-posture={governance.adaptationPosture}
      data-nx-organizational-evolution={
        governance.organizationalEvolutionActive ? "true" : "false"
      }
      data-nx-adaptation-governance={governance.adaptationGovernanceActive ? "true" : "false"}
      data-nx-evolution-convergence={governance.evolutionConvergencePosture}
      data-nx-unified-governance-runtime={governance.unifiedGovernanceRuntimeActive ? "true" : "false"}
      data-nx-strategic-evolution-converged={
        governance.institutionalStrategicEvolutionConverged ? "true" : "false"
      }
      data-nx-meta-cognition-posture={governance.metaCognitionPosture}
      data-nx-executive-meta-cognition={governance.executiveMetaCognitionActive ? "true" : "false"}
      data-nx-strategic-self-awareness={governance.strategicSelfAwarenessActive ? "true" : "false"}
      data-nx-cognitive-evolution-posture={governance.cognitiveEvolutionPosture}
      data-nx-institutional-reflection={governance.institutionalReflectionActive ? "true" : "false"}
      data-nx-cognitive-evolution={governance.cognitiveEvolutionActive ? "true" : "false"}
      data-nx-strategic-foresight-posture={governance.strategicForesightPosture}
      data-nx-strategic-foresight={governance.strategicForesightActive ? "true" : "false"}
      data-nx-future-state-intelligence={governance.futureStateIntelligenceActive ? "true" : "false"}
      data-nx-meta-intelligence-posture={governance.metaIntelligencePosture}
      data-nx-unified-consciousness={governance.unifiedStrategicConsciousnessActive ? "true" : "false"}
      data-nx-enterprise-meta-intelligence={governance.enterpriseMetaIntelligenceActive ? "true" : "false"}
      data-nx-institutional-intelligence-posture={governance.institutionalIntelligencePosture}
      data-nx-autonomous-institutional-intelligence={
        governance.autonomousInstitutionalIntelligenceActive ? "true" : "false"
      }
      data-nx-enterprise-cognitive-runtime-complete={
        governance.enterpriseCognitiveRuntimeComplete ? "true" : "false"
      }
      style={enterpriseAdaptiveGovernanceStripStyle}
      aria-label="Enterprise cognitive runtime, meta-intelligence, and governance orchestration"
    >
      <div
        style={{
          fontSize: 9,
          fontWeight: 800,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          color: nx.lowMuted,
        }}
      >
        {sectionLabel}
      </div>
      <div
        style={{
          marginTop: 3,
          fontSize: compact ? 10 : 11,
          fontWeight: 700,
          color: nx.textStrong,
          lineHeight: 1.35,
        }}
      >
        {governance.governanceHeadline}
      </div>
      {!compact && accentLine ? (
        <p style={{ margin: "3px 0 0", fontSize: 9, fontWeight: 700, color: nx.textSoft }}>
          {accentLine}
        </p>
      ) : null}
      {!compact ? (
        <>
          <p style={{ margin: "4px 0 0", fontSize: 10, color: nx.muted, lineHeight: 1.4 }}>
            {subline}
          </p>
          <p style={{ margin: "2px 0 0", fontSize: 9, color: nx.textSoft, lineHeight: 1.4 }}>
            {detailLine}
          </p>
        </>
      ) : (
        <p style={{ margin: "2px 0 0", fontSize: 9, color: nx.textSoft, lineHeight: 1.4 }}>
          {timelineLine}
        </p>
      )}
    </section>
  );
}
