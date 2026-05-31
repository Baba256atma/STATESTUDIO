const stableLogKeys = new Set<string>();

/** Fixed UTC HH:mm — safe for SSR and client hydration. */
export function formatNexoraTimelineTime(input: string | number | Date | null | undefined): string {
  if (input == null || input === "") return "";
  const date = input instanceof Date ? input : new Date(input);
  if (Number.isNaN(date.getTime())) {
    return "";
  }
  const hours = String(date.getUTCHours()).padStart(2, "0");
  const minutes = String(date.getUTCMinutes()).padStart(2, "0");
  return `${hours}:${minutes}`;
}

export function logNexoraTimelineTimestampStable(
  rawTimestamp: string | number | Date | null | undefined,
  formattedTimestamp: string
): void {
  if (process.env.NODE_ENV === "production") return;
  const key = `${String(rawTimestamp)}:${formattedTimestamp}`;
  if (stableLogKeys.has(key)) return;
  stableLogKeys.add(key);
  globalThis.console?.debug?.("[Nexora][Hydration][TimelineTimestampStable]", {
    rawTimestamp,
    formattedTimestamp,
  });
}

export function resolveNexoraTimelineDisplayTime(input: {
  timestampIso?: string | null;
  timestamp?: string | null;
}): string {
  const formattedFromIso = formatNexoraTimelineTime(input.timestampIso);
  if (formattedFromIso) {
    logNexoraTimelineTimestampStable(input.timestampIso, formattedFromIso);
    return formattedFromIso;
  }

  const formattedFromTimestamp = formatNexoraTimelineTime(input.timestamp);
  if (formattedFromTimestamp) {
    logNexoraTimelineTimestampStable(input.timestamp, formattedFromTimestamp);
    return formattedFromTimestamp;
  }

  return input.timestamp?.trim() ?? "";
}

export function resetNexoraTimeFormatForTests(): void {
  stableLogKeys.clear();
}
