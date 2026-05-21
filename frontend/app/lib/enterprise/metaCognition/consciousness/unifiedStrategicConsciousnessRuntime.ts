import { consciousnessSynchronizationGovernance } from "./consciousnessSynchronizationGovernance";
import {
  resolveUnifiedStrategicConsciousness,
  type ResolveUnifiedStrategicConsciousnessInput,
} from "./resolveUnifiedStrategicConsciousness";
import type { UnifiedStrategicConsciousnessRuntimeSnapshot } from "./unifiedStrategicConsciousnessTypes";

/**
 * F10:5 — Unified strategic consciousness + enterprise meta-intelligence completion runtime.
 * Coordinated cognition orchestration — not artificial general intelligence.
 */
export class UnifiedStrategicConsciousnessRuntime {
  private lastSnapshot: UnifiedStrategicConsciousnessRuntimeSnapshot | null = null;

  synchronize(
    input: ResolveUnifiedStrategicConsciousnessInput
  ): UnifiedStrategicConsciousnessRuntimeSnapshot {
    const snapshot = resolveUnifiedStrategicConsciousness(input);
    this.lastSnapshot = snapshot;
    return snapshot;
  }

  getLastSnapshot(): UnifiedStrategicConsciousnessRuntimeSnapshot | null {
    return this.lastSnapshot;
  }

  shouldPublish(): boolean {
    return consciousnessSynchronizationGovernance.shouldPublishSnapshot();
  }

  reset(): void {
    this.lastSnapshot = null;
    consciousnessSynchronizationGovernance.reset();
  }
}

export const unifiedStrategicConsciousnessRuntime = new UnifiedStrategicConsciousnessRuntime();
