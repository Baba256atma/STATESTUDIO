import type {
  FragilityTrajectory,
  InstitutionalTrajectory,
} from "./institutionalFutureStateTypes";
import type { AdaptiveGovernanceIntelligenceSnapshot } from "../../governance/adaptiveGovernanceTypes";

/**
 * F10:4 — Organizational trajectory cognition (possible paths, not certain outcomes).
 */
export class OrganizationalTrajectoryLayer {
  inferCurrentTrajectory(
    stack: AdaptiveGovernanceIntelligenceSnapshot,
    fragilityElevated: boolean
  ): InstitutionalTrajectory {
    if (fragilityElevated) return "fragile";
    if (stack.organizationalEvolutionActive || stack.adaptationGovernanceActive) {
      return "adapting";
    }
    if (stack.pressureGovernanceActive && stack.pressurePosture !== "composed") {
      return "pressurized";
    }
    if (
      stack.cognitiveEvolutionActive ||
      stack.unifiedGovernanceRuntimeActive
    ) {
      return "ascending";
    }
    return "stable";
  }

  inferFragilityTrajectory(
    fragilityElevated: boolean,
    stack: AdaptiveGovernanceIntelligenceSnapshot
  ): FragilityTrajectory {
    if (fragilityElevated) return "elevating";
    if (stack.executiveStabilityActive && stack.cognitiveEvolutionActive) return "reducing";
    return "stable";
  }

  collectPossibleFutureStates(
    trajectory: InstitutionalTrajectory,
    stack: AdaptiveGovernanceIntelligenceSnapshot
  ): string[] {
    const states: string[] = [];

    if (trajectory === "fragile") {
      states.push("possible escalation if pressure compounds without stabilization");
      states.push("possible recovery if resilience reinforcement timing aligns");
    } else if (trajectory === "pressurized") {
      states.push("possible executive stability window if pressure governance holds");
      states.push("possible coordination strain if escalation paths widen");
    } else if (trajectory === "adapting") {
      states.push("possible organizational adaptation pathway if governance maturity sustains");
    } else if (trajectory === "ascending") {
      states.push("possible institutional maturity consolidation");
    } else {
      states.push("possible steady-state operations with incremental governance refinement");
    }

    if (stack.institutionalReflectionActive) {
      states.push("possible strategic maturity progression as reflection deepens");
    }

    return states.slice(0, 4);
  }

  collectEscalationRisks(
    trajectory: InstitutionalTrajectory,
    fragilityElevated: boolean
  ): string[] {
    const risks: string[] = [];
    if (fragilityElevated) risks.push("fragility elevation may widen escalation windows");
    if (trajectory === "pressurized") risks.push("operational pressure may outpace stabilization");
    if (trajectory === "fragile") risks.push("coordination gaps may amplify under sustained strain");
    return risks.slice(0, 3);
  }
}

export const organizationalTrajectoryLayer = new OrganizationalTrajectoryLayer();
