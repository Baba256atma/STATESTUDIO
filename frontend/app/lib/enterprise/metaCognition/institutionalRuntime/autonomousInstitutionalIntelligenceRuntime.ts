import { institutionalRuntimeSynchronizationGovernance } from "./institutionalRuntimeSynchronizationGovernance";
import {
  resolveAutonomousInstitutionalIntelligence,
  type ResolveAutonomousInstitutionalIntelligenceInput,
} from "./resolveAutonomousInstitutionalIntelligence";
import type { AutonomousInstitutionalIntelligenceRuntimeSnapshot } from "./enterpriseCognitiveRuntimeTypes";

/**
 * F10:6 — Autonomous institutional intelligence + final enterprise cognitive runtime.
 * Continuously synchronized enterprise cognition — executive remains final authority.
 */
export class AutonomousInstitutionalIntelligenceRuntime {
  private lastSnapshot: AutonomousInstitutionalIntelligenceRuntimeSnapshot | null = null;

  synchronize(
    input: ResolveAutonomousInstitutionalIntelligenceInput
  ): AutonomousInstitutionalIntelligenceRuntimeSnapshot {
    const snapshot = resolveAutonomousInstitutionalIntelligence(input);
    this.lastSnapshot = snapshot;
    return snapshot;
  }

  getLastSnapshot(): AutonomousInstitutionalIntelligenceRuntimeSnapshot | null {
    return this.lastSnapshot;
  }

  shouldPublish(): boolean {
    return institutionalRuntimeSynchronizationGovernance.shouldPublishSnapshot();
  }

  reset(): void {
    this.lastSnapshot = null;
    institutionalRuntimeSynchronizationGovernance.reset();
  }
}

export const autonomousInstitutionalIntelligenceRuntime =
  new AutonomousInstitutionalIntelligenceRuntime();
