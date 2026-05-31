import type { ExecutiveObjectScaleProfileId } from "./executiveDensityTypes";
import { logExecutiveObjectScaleApplied } from "./executiveDensityInstrumentation";

export const DEFAULT_EXECUTIVE_SCALE_PROFILE: ExecutiveObjectScaleProfileId = "STRATEGIC";

export type ExecutiveObjectScaleProfile = {
  id: ExecutiveObjectScaleProfileId;
  /** Global multiplier applied to normalized executive scale. */
  multiplier: number;
  /** Default scale for core/system nodes. */
  baseCore: number;
  /** Default scale for peripheral nodes. */
  baseNode: number;
  maxScale: number;
  minScale: number;
};

export const EXECUTIVE_OBJECT_SCALE_PROFILES: Record<ExecutiveObjectScaleProfileId, ExecutiveObjectScaleProfile> = {
  FOCUSED: {
    id: "FOCUSED",
    multiplier: 0.92,
    baseCore: 0.68,
    baseNode: 0.58,
    maxScale: 0.82,
    minScale: 0.38,
  },
  BALANCED: {
    id: "BALANCED",
    multiplier: 0.82,
    baseCore: 0.62,
    baseNode: 0.52,
    maxScale: 0.74,
    minScale: 0.34,
  },
  STRATEGIC: {
    id: "STRATEGIC",
    multiplier: 0.68,
    baseCore: 0.52,
    baseNode: 0.44,
    maxScale: 0.62,
    minScale: 0.3,
  },
  SYSTEM: {
    id: "SYSTEM",
    multiplier: 0.58,
    baseCore: 0.46,
    baseNode: 0.38,
    maxScale: 0.54,
    minScale: 0.26,
  },
};

let activeProfileId: ExecutiveObjectScaleProfileId = DEFAULT_EXECUTIVE_SCALE_PROFILE;

const applyScaleResultCache = new Map<string, number>();
const baseScaleResultCache = new Map<string, number>();
let lastApplyExecutionSignature: string | null = null;
let lastBaseExecutionSignature: string | null = null;

function isDev(): boolean {
  return process.env.NODE_ENV !== "production";
}

function formatScale(value: number): string {
  return Number(value.toFixed(2)).toString();
}

export function buildExecutiveApplyScaleSignature(input: {
  profileId: ExecutiveObjectScaleProfileId;
  inputScale: number;
  selected: boolean;
}): string {
  return `${input.profileId}|${formatScale(input.inputScale)}|${input.selected ? 1 : 0}`;
}

export function buildExecutiveBaseScaleSignature(input: {
  profileId: ExecutiveObjectScaleProfileId;
  role: string;
}): string {
  return `${input.profileId}|${input.role}|base`;
}

export function diffExecutiveScaleSignature(
  previousSignature: string | null,
  nextSignature: string
): string[] {
  if (!previousSignature) return ["initial"];
  if (previousSignature === nextSignature) return [];

  const [prevProfile, prevSecond, prevThird] = previousSignature.split("|");
  const [nextProfile, nextSecond, nextThird] = nextSignature.split("|");
  const changed: string[] = [];
  if (prevProfile !== nextProfile) changed.push("profile");
  if (prevSecond !== nextSecond) {
    changed.push(prevThird === "base" || nextThird === "base" ? "role" : "inputScale");
  }
  if (prevThird !== nextThird) {
    changed.push(prevThird === "base" || nextThird === "base" ? "role" : "selected");
  }
  return changed.length > 0 ? changed : ["unknown"];
}

function logScaleDependencyChange(input: {
  kind: "apply" | "base";
  signature: string;
  previousExecutionSignature: string | null;
  payload: Record<string, unknown>;
}): void {
  if (!isDev()) return;
  logExecutiveObjectScaleApplied({
    ...input.payload,
    kind: input.kind,
    dependencySignature: input.signature,
    previousDependencySignature: input.previousExecutionSignature,
    changedDependencies: diffExecutiveScaleSignature(
      input.previousExecutionSignature,
      input.signature
    ),
  });
}

export function getExecutiveObjectScaleProfile(
  profileId: ExecutiveObjectScaleProfileId = activeProfileId
): ExecutiveObjectScaleProfile {
  return EXECUTIVE_OBJECT_SCALE_PROFILES[profileId] ?? EXECUTIVE_OBJECT_SCALE_PROFILES.STRATEGIC;
}

export function setExecutiveObjectScaleProfile(profileId: ExecutiveObjectScaleProfileId): void {
  if (activeProfileId === profileId) return;
  activeProfileId = profileId;
  applyScaleResultCache.clear();
  baseScaleResultCache.clear();
  lastApplyExecutionSignature = null;
  lastBaseExecutionSignature = null;
}

export function resolveExecutiveBaseObjectScale(input: {
  role?: string | null;
  profileId?: ExecutiveObjectScaleProfileId;
}): number {
  const profile = getExecutiveObjectScaleProfile(input.profileId);
  const role = String(input.role ?? "core").toLowerCase();
  const signature = buildExecutiveBaseScaleSignature({ profileId: profile.id, role });
  const cached = baseScaleResultCache.get(signature);
  if (cached !== undefined) {
    return cached;
  }

  const base = role === "core" || role === "decision" ? profile.baseCore : profile.baseNode;
  baseScaleResultCache.set(signature, base);

  logScaleDependencyChange({
    kind: "base",
    signature,
    previousExecutionSignature: lastBaseExecutionSignature,
    payload: {
      profile: profile.id,
      role,
      baseScale: Number(base.toFixed(3)),
    },
  });
  lastBaseExecutionSignature = signature;

  return base;
}

export function applyExecutiveObjectScaleProfile(input: {
  scale: number;
  selected?: boolean;
  profileId?: ExecutiveObjectScaleProfileId;
  objectId?: string | null;
  objectCount?: number;
}): number {
  const profile = getExecutiveObjectScaleProfile(input.profileId);
  const inputScale = Number(input.scale);
  const selected = input.selected === true;
  const signature = buildExecutiveApplyScaleSignature({
    profileId: profile.id,
    inputScale,
    selected,
  });
  const cached = applyScaleResultCache.get(signature);
  if (cached !== undefined) {
    return cached;
  }

  const selectedBoost = selected ? 0.06 : 0;
  const scaled = inputScale * profile.multiplier;
  const max = Math.min(0.9, profile.maxScale + selectedBoost);
  const min = profile.minScale;
  const normalized = Math.max(min, Math.min(max, Number.isFinite(scaled) ? scaled : profile.baseCore));

  applyScaleResultCache.set(signature, normalized);

  logScaleDependencyChange({
    kind: "apply",
    signature,
    previousExecutionSignature: lastApplyExecutionSignature,
    payload: {
      objectId: input.objectId ?? null,
      objectCount: input.objectCount,
      profile: profile.id,
      inputScale: Number(inputScale.toFixed(2)),
      normalizedScale: Number(normalized.toFixed(2)),
      selected,
    },
  });
  lastApplyExecutionSignature = signature;

  return normalized;
}

export function resetExecutiveObjectScaleProfileForTests(): void {
  activeProfileId = DEFAULT_EXECUTIVE_SCALE_PROFILE;
  applyScaleResultCache.clear();
  baseScaleResultCache.clear();
  lastApplyExecutionSignature = null;
  lastBaseExecutionSignature = null;
}
