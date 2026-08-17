import { mkdir, open, readFile, rename, unlink, writeFile } from "node:fs/promises";
import { dirname } from "node:path";

import {
  backgroundMonitoringRuntimeIdentity,
  backgroundMonitoringRuntimeModel,
  backgroundMonitoringRuntimeVersion,
  type NexoraBackgroundMonitoringRepository,
  type NexoraBackgroundMonitoringState,
  type NexoraBackgroundTransactionResult,
} from "./backgroundMonitoringRuntime.ts";

type LockRecord = Readonly<{ ownerId: string; acquiredAt: string; expiresAt: string }>;

function validState(value: unknown): NexoraBackgroundMonitoringState | null {
  const state = value as NexoraBackgroundMonitoringState;
  return state?.identity === backgroundMonitoringRuntimeIdentity &&
    state.version === backgroundMonitoringRuntimeVersion &&
    state.runtimeModel === backgroundMonitoringRuntimeModel &&
    Array.isArray(state.completedRuns) && Array.isArray(state.events) && state.monitoring
      ? state : null;
}

export class NexoraBackgroundMonitoringFileRepository implements NexoraBackgroundMonitoringRepository {
  private readonly lockPath: string;

  constructor(private readonly statePath: string) {
    this.lockPath = `${statePath}.lock`;
  }

  async read(): Promise<NexoraBackgroundMonitoringState | null> {
    try { return validState(JSON.parse(await readFile(this.statePath, "utf8"))); } catch { return null; }
  }

  private async acquire(ownerId: string, acquiredAt: string, leaseMs: number): Promise<boolean> {
    await mkdir(dirname(this.statePath), { recursive: true });
    const record: LockRecord = Object.freeze({ ownerId, acquiredAt, expiresAt: new Date(Date.parse(acquiredAt) + leaseMs).toISOString() });
    try {
      const handle = await open(this.lockPath, "wx");
      await handle.writeFile(JSON.stringify(record), "utf8");
      await handle.close();
      return true;
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== "EEXIST") throw error;
      try {
        const current = JSON.parse(await readFile(this.lockPath, "utf8")) as LockRecord;
        if (current.expiresAt > acquiredAt) return false;
        await unlink(this.lockPath);
        return this.acquire(ownerId, acquiredAt, leaseMs);
      } catch (readError) {
        if ((readError as NodeJS.ErrnoException).code !== "ENOENT") {
          try { await unlink(this.lockPath); } catch { return false; }
        }
        return this.acquire(ownerId, acquiredAt, leaseMs);
      }
    }
  }

  async transact<T>(input: Readonly<{
    ownerId: string;
    acquiredAt: string;
    leaseMs: number;
    operation: (state: NexoraBackgroundMonitoringState | null) => Promise<Readonly<{ state: NexoraBackgroundMonitoringState | null; value: T }>>;
  }>): Promise<NexoraBackgroundTransactionResult<T>> {
    if (!await this.acquire(input.ownerId, input.acquiredAt, input.leaseMs)) return Object.freeze({ acquired: false, value: null, ownerId: input.ownerId });
    try {
      const outcome = await input.operation(await this.read());
      if (outcome.state) {
        const serialized = JSON.stringify(outcome.state);
        if (/Bearer\s+[A-Za-z0-9._~-]+|"(?:accessToken|apiSecret|oauthToken|pat)"\s*:/i.test(serialized)) throw new Error("PM:6 repository rejected credential material.");
        const temporaryPath = `${this.statePath}.${input.ownerId.replace(/[^a-zA-Z0-9._-]+/g, "_")}.tmp`;
        await writeFile(temporaryPath, serialized, { encoding: "utf8", mode: 0o600 });
        await rename(temporaryPath, this.statePath);
      }
      return Object.freeze({ acquired: true, value: outcome.value, ownerId: input.ownerId });
    } finally {
      try {
        const lock = JSON.parse(await readFile(this.lockPath, "utf8")) as LockRecord;
        if (lock.ownerId === input.ownerId) await unlink(this.lockPath);
      } catch { /* already released or replaced after expiry */ }
    }
  }
}
