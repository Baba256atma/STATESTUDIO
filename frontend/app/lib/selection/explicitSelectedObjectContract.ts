/**
 * OBJECT PANEL SELECTION CONTRACT:
 * Explicit selected object id resolves from the single MVP authority
 * (`HomeScreen.selectedObjectIdState`). The broader objectSelection payload is a
 * compatibility mirror for highlights/details, not a competing object store.
 *
 * Runtime enforcement: `objectSelectionRuntimeContract.ts`
 * Click pipeline: AnimatableObject → commitObjectSelectionFromUserClick → commitObjectSelection
 */
export type ExplicitSelectedObjectInput = {
  selectedObjectIdState?: string | null;
  objectSelection?: unknown;
};

export type ExplicitSelectedObjectResult = {
  explicitSelectedObjectId: string | null;
  hasExplicitSelection: boolean;
  reason: string;
};

export function resolveExplicitSelectedObject(
  input: ExplicitSelectedObjectInput
): ExplicitSelectedObjectResult {
  const selectedId =
    typeof input.selectedObjectIdState === "string"
      ? input.selectedObjectIdState.trim()
      : "";
  if (!selectedId) {
    return {
      explicitSelectedObjectId: null,
      hasExplicitSelection: false,
      reason: "no_selected_object_id_state",
    };
  }
  return {
    explicitSelectedObjectId: selectedId,
    hasExplicitSelection: true,
    reason: "explicit_selected_object_id_state",
  };
}
