export type SceneWriteSource =
  | "chat"
  | "propagation"
  | "selection"
  | "material_effect"
  | "ui_event"
  | "system"
  | "system_fallback"
  | "ingestion";

type SceneWriteTraceInput = {
  source: SceneWriteSource;
  semanticSig: string;
  visualSig?: string;
  context?: Record<string, unknown>;
};

const lastWriteSigRef = new Map<SceneWriteSource, string>();
const duplicateCountBySig = new Map<string, number>();
const lastDuplicateLogAtBySig = new Map<string, number>();

function resolveWriter(context?: Record<string, unknown>): string {
  const writer = context?.writer ?? context?.reason ?? "system";
  return typeof writer === "string" && writer.trim().length > 0 ? writer : "system";
}

function classifySceneWriteSource(
  context?: Record<string, unknown>,
  fallback?: SceneWriteSource
): SceneWriteSource {
  if (fallback && fallback !== "system") return fallback;
  const ctxSource = context?.source;
  if (ctxSource === "chat") return "chat";
  if (ctxSource === "propagation") return "propagation";
  if (ctxSource === "selection") return "selection";
  if (ctxSource === "material_effect") return "material_effect";
  if (ctxSource === "ui_event") return "ui_event";
  if (ctxSource === "system_fallback") return "system_fallback";
  if (ctxSource === "ingestion") return "ingestion";
  if (ctxSource === "system") return "system";
  const writer = String(context?.writer ?? "");
  if (writer.includes("applySceneChangeSafe")) return "ui_event";
  if (writer.includes("setObjectSelection")) return "selection";
  if (writer.includes("setSelectedObjectIdState")) return "selection";
  if (writer.includes("empty_state_reset")) return "system_fallback";
  if (writer.includes("ingestion")) return "ingestion";
  if (writer.includes("chat")) return "chat";
  return "system";
}

export function getSceneWriteDuplicateSummary() {
  return Array.from(duplicateCountBySig.entries())
    .map(([key, count]) => ({ key, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);
}

export function traceSceneWrite(input: SceneWriteTraceInput): boolean {
  const source = classifySceneWriteSource(input.context, input.source);
  const prev = lastWriteSigRef.get(source);
  if (prev === input.semanticSig) {
    const writer = resolveWriter(input.context);
    const key = `${source}::${writer}::${input.semanticSig}`;
    const count = (duplicateCountBySig.get(key) ?? 0) + 1;
    duplicateCountBySig.set(key, count);
    const now = Date.now();
    const lastAt = lastDuplicateLogAtBySig.get(key) ?? 0;
    const shouldLog = count === 1 || count % 10 === 0 || now - lastAt > 2000;
    if (shouldLog) {
      lastDuplicateLogAtBySig.set(key, now);
      globalThis.console?.warn?.("[Nexora][SceneWriteBlocked][Duplicate]", {
        source,
        writer,
        count,
        semanticSig: input.semanticSig,
        visualSig: input.visualSig ?? null,
        context: input.context ?? {},
      });
    }
    return false;
  }
  lastWriteSigRef.set(source, input.semanticSig);
  globalThis.console?.log?.("[Nexora][SceneWrite]", { ...input, source });
  return true;
}

if (typeof window !== "undefined") {
  (window as any).__NEXORA_SCENE_WRITE_DUPES__ = getSceneWriteDuplicateSummary;
}
