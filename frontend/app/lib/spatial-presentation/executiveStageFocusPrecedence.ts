/**
 * Stage focus precedence for explicit user selection vs automatic attention.
 *
 * STAGE-PROD:0 absolute interaction rule:
 *   DIRECT OBJECT CLICK
 *     > NAVIGATION RESTORE
 *     > AUTOMATIC FOCUS
 *     > ATTENTION
 *     > FALLBACK
 *
 * Diagnostic-only focusSource labels — not a new runtime architecture.
 * A direct click must never be stolen by Data Reality attention,
 * recommendation, choreography, Director, or fallback selection.
 */

export type ExecutiveStageFocusSource =
  | "user-selection"
  | "navigation-restore"
  | "automatic-attention"
  | "fallback";

export function resolveExecutiveStageFocusPrecedence(input: {
  readonly explicitFocusedObjectId?: string | null;
  readonly navigationRestoredObjectId?: string | null;
  readonly automaticAttentionObjectId?: string | null;
  readonly fallbackObjectId?: string | null;
}): Readonly<{
  readonly focusedObjectId: string | null;
  readonly focusSource: ExecutiveStageFocusSource;
  readonly automaticAttentionObjectId: string | null;
}> {
  const automatic =
    input.automaticAttentionObjectId != null &&
    input.automaticAttentionObjectId.length > 0
      ? input.automaticAttentionObjectId
      : null;
  const explicit =
    input.explicitFocusedObjectId != null &&
    input.explicitFocusedObjectId.length > 0
      ? input.explicitFocusedObjectId
      : null;
  const navigation =
    input.navigationRestoredObjectId != null &&
    input.navigationRestoredObjectId.length > 0
      ? input.navigationRestoredObjectId
      : null;
  const fallback =
    input.fallbackObjectId != null && input.fallbackObjectId.length > 0
      ? input.fallbackObjectId
      : null;

  if (explicit != null) {
    return Object.freeze({
      focusedObjectId: explicit,
      focusSource: "user-selection" as const,
      automaticAttentionObjectId: automatic,
    });
  }
  if (navigation != null) {
    return Object.freeze({
      focusedObjectId: navigation,
      focusSource: "navigation-restore" as const,
      automaticAttentionObjectId: automatic,
    });
  }
  if (automatic != null) {
    return Object.freeze({
      focusedObjectId: automatic,
      focusSource: "automatic-attention" as const,
      automaticAttentionObjectId: automatic,
    });
  }
  return Object.freeze({
    focusedObjectId: fallback,
    focusSource: "fallback" as const,
    automaticAttentionObjectId: automatic,
  });
}
