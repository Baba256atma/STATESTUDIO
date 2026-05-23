import { stableSignature } from "../../intelligence/shared/dedupe.ts";
import { getDemoScenarioById } from "./demoContentRegistry.ts";
import type {
  DemoJourneyId,
  DemoSafetyControl,
  DemoSafetyEvaluation,
  DemoSeverity,
  ExecutiveDemoModeInput,
} from "./executiveDemoModeTypes.ts";

const severityRank: Record<DemoSeverity, number> = {
  informational: 0,
  caution: 1,
  warning: 2,
  critical: 3,
};

function control(
  severity: DemoSeverity,
  description: string,
  source: string,
  blocksPresentation: boolean,
  recommendedAction: string
): DemoSafetyControl {
  return {
    controlId: stableSignature(["d10-demo-safety", source, description]).slice(0, 48),
    severity,
    description,
    source,
    reversible: true,
    blocksPresentation,
    recommendedAction,
  };
}

function highestSeverity(controls: readonly DemoSafetyControl[]): DemoSeverity {
  return controls.reduce<DemoSeverity>(
    (highest, item) => (severityRank[item.severity] > severityRank[highest] ? item.severity : highest),
    "informational"
  );
}

export function demoSeverityRank(severity: DemoSeverity): number {
  return severityRank[severity];
}

export function evaluateDemoSafetyControls(input: ExecutiveDemoModeInput): DemoSafetyEvaluation {
  const controls: DemoSafetyControl[] = [];
  const requestedJourneys = input.requestedJourneyIds?.length
    ? input.requestedJourneyIds
    : input.activeJourneyId
      ? [input.activeJourneyId]
      : [];

  if (input.mode === "disabled") {
    controls.push(
      control(
        "critical",
        "Demo mode is disabled.",
        "demo_mode",
        true,
        "Enable demo, pilot, or review mode before presenting."
      )
    );
  }

  if (!input.dashboard) {
    controls.push(
      control("warning", "Executive readiness dashboard evidence is missing.", "dashboard", true, "Generate the D10 dashboard before demonstration.")
    );
  } else if (input.dashboard.healthSurface.status === "critical" || input.dashboard.healthSurface.status === "degraded") {
    controls.push(
      control(
        input.dashboard.healthSurface.status === "critical" ? "critical" : "warning",
        `Runtime health is ${input.dashboard.healthSurface.status}.`,
        "dashboard",
        input.dashboard.healthSurface.status === "critical",
        "Resolve dashboard health gaps before claiming demo readiness."
      )
    );
  }

  if (!input.validationSuite) {
    controls.push(
      control("warning", "Executive validation suite has not been executed.", "validation", true, "Run D10 validation before the presentation.")
    );
  } else if (!input.validationSuite.summary.validationPassed) {
    controls.push(
      control("critical", "Executive validation did not pass.", "validation", true, "Resolve failed validation scenarios before demo.")
    );
  } else if (input.validationSuite.summary.requiresAttention.length > 0) {
    controls.push(
      control("caution", "Validation passed with items requiring attention.", "validation", false, "Review validation attention items before presenting.")
    );
  }

  if (!input.launchGate) {
    controls.push(
      control("warning", "Executive launch gate evidence is missing.", "launch_gate", true, "Evaluate D10 launch gate before demonstration.")
    );
  } else if (input.launchGate.state === "blocked" || input.launchGate.recommendation === "do_not_launch") {
    controls.push(
      control("critical", "Launch gate blocks presentation readiness.", "launch_gate", true, "Resolve launch blockers before demo or pilot.")
    );
  } else if (input.launchGate.blockers.length > 0) {
    controls.push(
      control("warning", "Launch gate has unresolved blockers.", "launch_gate", true, "Resolve launch blockers or switch to internal review mode.")
    );
  }

  for (const flag of input.requestedFeatureFlags ?? []) {
    if (flag.startsWith("experimental") || flag.includes("unstable") || flag.includes("incomplete")) {
      controls.push(
        control(
          "warning",
          `Requested feature flag ${flag} is not presentation-safe.`,
          "feature_flag",
          true,
          "Remove experimental or incomplete feature flags from the presentation path."
        )
      );
    }
  }

  const blockedJourneys: DemoJourneyId[] = [];
  for (const journeyId of requestedJourneys) {
    const scenario = getDemoScenarioById(journeyId);
    if (!scenario || !scenario.supportedModes.includes(input.mode)) {
      blockedJourneys.push(journeyId);
      controls.push(
        control(
          "warning",
          `Journey ${journeyId} is not supported in ${input.mode}.`,
          "journey_registry",
          true,
          "Choose a supported guided journey for the active mode."
        )
      );
    }
  }

  const safeToPresent = controls.every((item) => !item.blocksPresentation);
  const highest = highestSeverity(controls);

  return {
    safeToPresent,
    controls: Object.freeze(controls),
    blockedJourneys: Object.freeze(Array.from(new Set(blockedJourneys))),
    highestSeverity: highest,
    signature: stableSignature([
      "d10-demo-safety",
      input.mode,
      controls.map((item) => item.controlId),
      blockedJourneys,
    ]),
  };
}
