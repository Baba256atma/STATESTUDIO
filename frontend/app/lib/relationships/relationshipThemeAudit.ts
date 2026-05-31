const emitted = new Set<string>();

export type RelationshipThemeAuditPayload = {
  definitionCount: number;
  definitionLocations: string[];
  duplicateExports?: boolean;
  duplicateVisualProfiles?: boolean;
  duplicateThemeResolvers?: boolean;
};

/** Dev-only safeguard against duplicate relationship theme registrations. */
export function logRelationshipThemeAudit(payload: RelationshipThemeAuditPayload): void {
  if (process.env.NODE_ENV === "production") return;
  const key = JSON.stringify(payload);
  if (emitted.has(key)) return;
  emitted.add(key);
  console.info("[Nexora][RelationshipTheme]", {
    definitionCount: payload.definitionCount,
    definitionLocations: payload.definitionLocations,
  });
  if (
    payload.duplicateExports ||
    payload.duplicateVisualProfiles ||
    payload.duplicateThemeResolvers
  ) {
    console.warn("[Nexora][RelationshipThemeAudit]", {
      duplicateExports: payload.duplicateExports ?? false,
      duplicateVisualProfiles: payload.duplicateVisualProfiles ?? false,
      duplicateThemeResolvers: payload.duplicateThemeResolvers ?? false,
    });
  }
}

export function resetRelationshipThemeAuditForTests(): void {
  emitted.clear();
}
