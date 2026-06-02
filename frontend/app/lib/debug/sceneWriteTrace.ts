import { recordDuplicateWritePrevented } from "./startupNoiseAudit";
import { traceRuntimeSceneWrite } from "./runtimeLoopTrace";
import { shouldProceedRuntimeWrite } from "../runtime/idleRuntimeWriteGuard";

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
  writer?: string;
  context?: Record<string, unknown>;
};

const lastWriteSigRef = new Map<SceneWriteSource, string>();
const duplicateCountBySig = new Map<string, number>();
const skippedLogKeys = new Set<string>();

function resolveSceneWriteWriter(input: SceneWriteTraceInput, source: SceneWriteSource): string {
  const candidate =
    input.writer ??
    input.context?.writer ??
    input.context?.source ??
    source ??
    "unknown";
  return typeof candidate === "string" && candidate.trim().length > 0 ? candidate : "unknown";
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

export function isDuplicateSceneWrite(input: SceneWriteTraceInput): boolean {
  const source = classifySceneWriteSource(input.context, input.source);
  return lastWriteSigRef.get(source) === input.semanticSig;
}

export function traceSceneWrite(input: SceneWriteTraceInput): boolean {
  const source = classifySceneWriteSource(input.context, input.source);
  const writer = resolveSceneWriteWriter(input, source);
  if (isDuplicateSceneWrite(input)) {
    recordDuplicateWritePrevented();
    logSceneWriteSkipped({
      source,
      writer,
      semanticSig: input.semanticSig,
      reason: "duplicate_scene_signature",
    });
    return false;
  }
  if (!shouldProceedRuntimeWrite(`scene-write:${writer}`, input.semanticSig)) {
    recordDuplicateWritePrevented();
    logSceneWriteSkipped({
      source,
      writer,
      semanticSig: input.semanticSig,
      reason: "runtime_write_guard",
    });
    return false;
  }
  const previousSceneSignature = lastWriteSigRef.get(source) ?? null;
  lastWriteSigRef.set(source, input.semanticSig);
  traceRuntimeSceneWrite({
    writer,
    reason: String(input.context?.reason ?? source),
    sceneSignature: input.semanticSig,
    previousSceneSignature,
    duplicateAttempt: false,
    detail: {
      source,
      visualSig: input.visualSig ?? null,
      context: input.context ?? {},
    },
  });
  globalThis.console?.log?.("[Nexora][SceneWrite]", { ...input, source });
  return true;
}

export function logSceneWriteSkippedOnce(payload: {
  source: SceneWriteSource | string;
  writer?: string;
  semanticSig: string;
  reason: string;
  [key: string]: unknown;
}): void {
  if (process.env.NODE_ENV === "production") return;
  const key = `${payload.source}:${payload.semanticSig}:${payload.reason}`;
  if (skippedLogKeys.has(key)) return;
  skippedLogKeys.add(key);
  globalThis.console?.debug?.("[Nexora][SceneWriteSkipped]", payload);
}

function logSceneWriteSkipped(payload: {
  source: SceneWriteSource;
  writer: string;
  semanticSig: string;
  reason: string;
}): void {
  logSceneWriteSkippedOnce(payload);
}

if (typeof window !== "undefined") {
  (window as Window & { __NEXORA_SCENE_WRITE_DUPES__?: typeof getSceneWriteDuplicateSummary }).__NEXORA_SCENE_WRITE_DUPES__ =
    getSceneWriteDuplicateSummary;
}
