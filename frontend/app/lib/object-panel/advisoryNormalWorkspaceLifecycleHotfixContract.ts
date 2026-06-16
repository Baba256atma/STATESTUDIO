/**
 * Advisory normal workspace lifecycle hotfix — HomeScreen must not special-case Advisory.
 *
 * Tag: [ADVISORY_NORMAL_WORKSPACE_LIFECYCLE_FIXED]
 */

export const ADVISORY_NORMAL_WORKSPACE_LIFECYCLE_FIXED_TAG =
  "[ADVISORY_NORMAL_WORKSPACE_LIFECYCLE_FIXED]" as const;

/** Advisory uses the same executeApprovedWorkspaceLaunch path as Risk, Scenario, War Room, etc. */
export const ADVISORY_USES_CANONICAL_WORKSPACE_LAUNCH = true as const;

/** Legacy HomeScreen advisory early-return is removed — do not reintroduce. */
export const ADVISORY_HOMESCREEN_SPECIAL_CASE_REMOVED = true as const;
