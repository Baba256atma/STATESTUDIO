"use client";

import type React from "react";

import type { AdaptiveGovernanceIntelligenceSnapshot } from "../../../lib/enterprise/governance";
import { nx } from "../../ui/nexoraTheme";
import { enterpriseAdaptiveGovernanceStripStyle } from "./enterpriseAdaptiveGovernanceStyles";

export function EnterpriseAdaptiveGovernanceStrip(props: {
  governance: AdaptiveGovernanceIntelligenceSnapshot;
}): React.ReactElement {
  const { governance } = props;

  const unifiedDisplay =
    governance.unifiedGovernanceRuntimeActive ||
    (governance.institutionalStrategicEvolutionConverged &&
      governance.evolutionConvergencePosture !== "idle");

  const adaptationDisplay =
    !unifiedDisplay &&
    (governance.organizationalEvolutionActive ||
      (governance.adaptationGovernanceActive && governance.adaptationPosture !== "idle"));

  const pressureDisplay =
    !unifiedDisplay &&
    !adaptationDisplay &&
    (governance.executiveStabilityActive ||
      (governance.pressureGovernanceActive && governance.pressurePosture !== "idle"));

  const compact = unifiedDisplay
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

  const sectionLabel = unifiedDisplay
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

  const subline = unifiedDisplay
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

  const detailLine = adaptationDisplay
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

  const timelineLine = unifiedDisplay
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

  const accentLine = adaptationDisplay
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
      style={enterpriseAdaptiveGovernanceStripStyle}
      aria-label="Unified adaptive governance and institutional strategic evolution intelligence"
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
