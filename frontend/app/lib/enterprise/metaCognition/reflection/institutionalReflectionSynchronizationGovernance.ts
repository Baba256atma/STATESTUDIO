const MIN_PUBLISH_INTERVAL_MS = 580;

export class InstitutionalReflectionSynchronizationGovernance {
  private lastPublishAt = 0;

  shouldPublishSnapshot(now = Date.now()): boolean {
    if (now - this.lastPublishAt < MIN_PUBLISH_INTERVAL_MS) {
      return false;
    }
    this.lastPublishAt = now;
    return true;
  }

  reset(): void {
    this.lastPublishAt = 0;
  }
}

export const institutionalReflectionSynchronizationGovernance =
  new InstitutionalReflectionSynchronizationGovernance();
