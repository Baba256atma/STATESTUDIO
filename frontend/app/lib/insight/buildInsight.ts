import type { ReplayFrame } from "../api/replayApi";

type Insight = {
  title: string;
  summary: string;
  why: string[];
  lever: { label: string; hint: string } | null;
  confidence?: number;
};

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function formatSignalName(name: string) {
  return name.replace(/_/g, " ");
}

function formatLeverLabel(id: string) {
  return id.replace(/[:_]/g, " ");
}

function pickTopSignals(signals: Record<string, number>, limit: number) {
  return Object.entries(signals)
    .sort((a, b) => (b[1] ?? 0) - (a[1] ?? 0))
    .slice(0, limit);
}

export function buildInsight(frame: ReplayFrame | null): Insight {
  if (!frame) {
    return {
      title: "Live / Replay",
      summary: "No active replay frame is loaded.",
      why: [],
      lever: null,
    };
  }

  const systemState = frame.system_state as { results?: any[] } | undefined;
  const topResult = systemState?.results?.[0];
  const title =
    typeof topResult?.archetype_id === "string" ? topResult.archetype_id : "Live / Replay";
  const confidence =
    typeof topResult?.confidence === "number" ? clamp(topResult.confidence, 0, 1) : undefined;

  const signals = frame.system_signals ?? {};
  const why = pickTopSignals(signals, 3).map(
    ([name, value]) =>
      `${formatSignalName(name)} at ${(value ?? 0).toFixed(2)}`
  );

  const levers = (frame.visual as any)?.levers as { id: string; strength?: number }[] | undefined;
  let lever: Insight["lever"] = null;
  if (Array.isArray(levers) && levers.length > 0) {
    const sorted = [...levers].sort(
      (a, b) => (b.strength ?? 0) - (a.strength ?? 0)
    );
    const topLever = sorted[0];
    if (topLever?.id) {
      lever = {
        label: `Lever: ${formatLeverLabel(topLever.id)}`,
        hint: "Adjust this lever to reduce constraint drift.",
      };
    }
  }

  return {
    title,
    summary: "Current system state reflects normalized signal pressure.",
    why,
    lever,
    confidence,
  };
}
