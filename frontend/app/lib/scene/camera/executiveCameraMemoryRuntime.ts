import { logExecutiveCameraMemory } from "./executiveCameraDiagnostics";

export type ExecutiveCameraMemorySnapshot = {
  position: [number, number, number];
  target: [number, number, number];
  fov: number | null;
  savedAt: number;
  reason: string;
  signature: string;
};

let savedUserContext: ExecutiveCameraMemorySnapshot | null = null;
let memoryArmed = false;

function buildSnapshotSignature(snapshot: Omit<ExecutiveCameraMemorySnapshot, "savedAt">): string {
  return JSON.stringify({
    position: snapshot.position.map((value) => Math.round(value * 1000) / 1000),
    target: snapshot.target.map((value) => Math.round(value * 1000) / 1000),
    fov: snapshot.fov == null ? null : Math.round(snapshot.fov * 100) / 100,
    reason: snapshot.reason,
  });
}

export function armExecutiveCameraMemory(reason = "user_navigation"): void {
  memoryArmed = true;
  logExecutiveCameraMemory(`armed:${reason}`, { reason, armed: true });
}

export function saveExecutiveCameraMemory(input: {
  position: [number, number, number];
  target: [number, number, number];
  fov?: number | null;
  reason: string;
}): ExecutiveCameraMemorySnapshot | null {
  if (!memoryArmed) return null;
  const snapshot: ExecutiveCameraMemorySnapshot = {
    position: [...input.position],
    target: [...input.target],
    fov: input.fov ?? null,
    savedAt: Date.now(),
    reason: input.reason,
    signature: "",
  };
  snapshot.signature = buildSnapshotSignature(snapshot);
  savedUserContext = snapshot;
  logExecutiveCameraMemory(`saved:${snapshot.signature}`, {
    reason: snapshot.reason,
    position: snapshot.position,
    target: snapshot.target,
    fov: snapshot.fov,
  });
  return snapshot;
}

export function peekExecutiveCameraMemory(): ExecutiveCameraMemorySnapshot | null {
  return savedUserContext;
}

export function shouldRestoreExecutiveCameraMemory(trigger: "focus_cleared" | "panel_closed" | "preset_exit"): boolean {
  if (!savedUserContext) return false;
  if (trigger === "focus_cleared" || trigger === "panel_closed") return true;
  return false;
}

export function consumeExecutiveCameraMemory(
  trigger: "focus_cleared" | "panel_closed" | "preset_exit"
): ExecutiveCameraMemorySnapshot | null {
  if (!shouldRestoreExecutiveCameraMemory(trigger)) return null;
  const snapshot = savedUserContext;
  savedUserContext = null;
  memoryArmed = false;
  if (snapshot) {
    logExecutiveCameraMemory(`restore:${snapshot.signature}:${trigger}`, {
      trigger,
      position: snapshot.position,
      target: snapshot.target,
      fov: snapshot.fov,
    });
  }
  return snapshot;
}

export function clearExecutiveCameraMemory(reason = "manual_clear"): void {
  savedUserContext = null;
  memoryArmed = false;
  logExecutiveCameraMemory(`cleared:${reason}`, { reason });
}

export function resetExecutiveCameraMemoryForTests(): void {
  savedUserContext = null;
  memoryArmed = false;
}
