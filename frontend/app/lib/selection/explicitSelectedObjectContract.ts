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
