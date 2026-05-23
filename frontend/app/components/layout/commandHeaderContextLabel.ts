/** Server/first-client-safe label: matches CommandHeader fallback when contextLabel is absent. */
export function getCommandHeaderServerSafeContextLabel(activeModeLabel: string): string {
  return (activeModeLabel ?? "").trim() || "Decision workspace";
}

/** Fully resolved domain/context label after client-only sources are available. */
export function getCommandHeaderResolvedContextLabel(
  contextLabel: string | null | undefined,
  activeModeLabel: string
): string {
  return (contextLabel ?? activeModeLabel ?? "").trim() || "Decision workspace";
}
