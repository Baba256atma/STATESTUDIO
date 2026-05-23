import { stableSignature } from "../../intelligence/shared/dedupe.ts";
import { evaluateDemoSafetyControls } from "./demoSafetyControls.ts";
import type {
  DemoHealthValidation,
  DemoSafetyControl,
  ExecutiveDemoModeInput,
} from "./executiveDemoModeTypes.ts";

type ValidationStatus = "available" | "warning" | "blocked";

function statusFromControl(controls: readonly DemoSafetyControl[], source: string): ValidationStatus {
  const relevant = controls.filter((control) => control.source === source);
  if (relevant.some((control) => control.severity === "critical" || control.blocksPresentation)) return "blocked";
  if (relevant.length > 0) return "warning";
  return "available";
}

export function validateDemoHealth(input: ExecutiveDemoModeInput): DemoHealthValidation {
  const safety = evaluateDemoSafetyControls(input);
  const controls = safety.controls;
  const workflowAvailability: ValidationStatus =
    input.validationSuite?.summary.validationPassed === true && input.launchGate?.blockers.length === 0
      ? "available"
      : statusFromControl(controls, "validation") === "blocked" || statusFromControl(controls, "launch_gate") === "blocked"
        ? "blocked"
        : "warning";
  const scenarioIntegrity: ValidationStatus = safety.blockedJourneys.length > 0 ? "blocked" : "available";

  return {
    validationId: stableSignature(["d10-demo-health", input.organizationId ?? "nexora-default", input.mode]).slice(0, 56),
    readinessStatus: statusFromControl(controls, "dashboard"),
    trustStatus: input.dashboard?.runtimeTrust === "critical" ? "blocked" : input.dashboard?.runtimeTrust === "degraded" ? "warning" : "available",
    stabilityStatus:
      input.dashboard?.interactionStability === "critical"
        ? "blocked"
        : input.dashboard?.interactionStability === "degraded"
          ? "warning"
          : "available",
    workflowAvailability,
    scenarioIntegrity,
    warnings: Object.freeze(controls),
    signature: stableSignature([
      "d10-demo-health",
      input.mode,
      controls.map((control) => control.controlId),
      workflowAvailability,
      scenarioIntegrity,
    ]),
  };
}
