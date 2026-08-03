export type ObjectNameDensityTier =
  | "comfortable"
  | "balanced"
  | "compact";
export type ObjectNameDensityProfile = {
  readonly tier: ObjectNameDensityTier;
  readonly maxVisibleNames: number;
  readonly showEveryNthObject: number;
  readonly fontSizePx: number;
  readonly minOpacity: number;
  readonly selectedOpacity: number;
  /** Legacy signature/compat flags derived from tier density. */
  readonly showAllNames: boolean;
  readonly showSelectedOnly: boolean;
};
export type ShouldRenderExecutiveObjectNameInput = {
  readonly profile?: ObjectNameDensityProfile;
  readonly objectCount?: number;
  readonly selected: boolean;
  readonly focused: boolean;
  readonly index: number;
};
const OBJECT_NAME_DENSITY_PROFILES: Record<
  ObjectNameDensityTier,
  ObjectNameDensityProfile
> = {
  comfortable: {
    tier: "comfortable",
    maxVisibleNames: 12,
    showEveryNthObject: 1,
    fontSizePx: 16,
    minOpacity: 0.78,
    selectedOpacity: 1,
    showAllNames: true,
    showSelectedOnly: false,
  },
  balanced: {
    tier: "balanced",
    maxVisibleNames: 8,
    showEveryNthObject: 2,
    fontSizePx: 14,
    minOpacity: 0.68,
    selectedOpacity: 1,
    showAllNames: true,
    showSelectedOnly: false,
  },
  compact: {
    tier: "compact",
    maxVisibleNames: 5,
    showEveryNthObject: 3,
    fontSizePx: 12,
    minOpacity: 0.56,
    selectedOpacity: 1,
    showAllNames: false,
    showSelectedOnly: true,
  },
};
function normalizeNonNegativeInteger(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.max(0, Math.floor(value));
}
export function resolveObjectNameDensityTier(
  objectCount: number
): ObjectNameDensityTier {
  const normalizedObjectCount =
    normalizeNonNegativeInteger(objectCount);
  if (normalizedObjectCount <= 8) {
    return "comfortable";
  }
  if (normalizedObjectCount <= 18) {
    return "balanced";
  }
  return "compact";
}
export function resolveObjectNameDensityProfile(
  objectCount: number
): ObjectNameDensityProfile {
  const tier = resolveObjectNameDensityTier(objectCount);
  return OBJECT_NAME_DENSITY_PROFILES[tier];
}
export function shouldRenderExecutiveObjectName({
  profile,
  objectCount,
  selected,
  focused,
  index,
}: ShouldRenderExecutiveObjectNameInput): boolean {
  if (selected || focused) return true;
  const resolvedProfile =
    profile ?? resolveObjectNameDensityProfile(objectCount ?? 0);
  const normalizedIndex = normalizeNonNegativeInteger(index);
  const normalizedObjectCount =
    objectCount == null
      ? resolvedProfile.maxVisibleNames
      : normalizeNonNegativeInteger(objectCount);
  if (normalizedIndex >= normalizedObjectCount) return false;
  if (normalizedIndex >= resolvedProfile.maxVisibleNames) return false;
  return normalizedIndex % resolvedProfile.showEveryNthObject === 0;
}
export type ResolveObjectNameOpacityInput = {
  readonly profile: ObjectNameDensityProfile;
  readonly objectCount?: number;
  readonly selected: boolean;
  readonly focused: boolean;
};
export function resolveObjectNameOpacity({
  profile,
  objectCount,
  selected,
  focused,
}: ResolveObjectNameOpacityInput): number {
  if (selected || focused) {
    return profile.selectedOpacity;
  }
  const normalizedObjectCount =
    objectCount == null
      ? profile.maxVisibleNames
      : normalizeNonNegativeInteger(objectCount);
  if (normalizedObjectCount <= 0) {
    return 0;
  }
  return profile.minOpacity;
}
/** Retained for test harness compatibility — no logging side effects. */
export function resetObjectNameDensityLogsForTests(): void {
  /* no-op */
}
