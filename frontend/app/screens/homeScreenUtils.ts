import type { SceneJson, SceneLoop, StateVector } from "../lib/sceneTypes";
import type { HUDTabKey } from "../components/HUDShell";

export type Msg = { id?: string; role: "user" | "assistant"; text: string };

export type ScenePrefs = {
  theme: "day" | "night" | "stars";
  starDensity: number;
  showGrid: boolean;
  showAxes: boolean;
  orbitMode: "auto" | "manual";
  globalScale: number;
  shadowsEnabled?: boolean;
  overridePolicy?: "keep" | "match" | "clear";
  /** Reduces hover drift / scale emphasis on the 3D scene. */
  motionIntensity?: "low" | "normal";
};

export type PersistedProject = {
  version: "1";
  savedAt: string;
  sessionId: string | null;
  activeMode: string;
  sceneJson: SceneJson | null;
  messages: Msg[];
};

export type BackupV1 = {
  version: "1";
  kind: "backup";
  savedAt: string;
  sessionId: string | null;
  activeCompanyId: string;
  activeMode: string;
  activeTemplateId: string;
  hudTab: HUDTabKey;
  prefs: ScenePrefs;
  sceneJson: SceneJson | null;
  messages: Msg[];
  loops: SceneLoop[];
  activeLoopId: string | null;
  selectedLoopId: string | null;
  focusedId: string | null;
  focusMode: "all" | "selected";
  focusPinned: boolean;
  selectedObjectId: string | null;
  overrides: Record<string, unknown>;
  objectUxById: Record<string, { opacity?: number; scale?: number }>;
};

export const PROJECT_KEY = "statestudio.project.v1";
export const HISTORY_KEY = "statestudio.history.v1";
export const SESSION_KEY = "statestudio.sessionId";
export const PREFS_KEY = "statestudio.prefs.v1";
export const BACKUP_KEY = "statestudio.backup.v1";
export const AUTO_BACKUP_KEY = "statestudio.autobackup.enabled.v1";
export const MEMORY_KEY = "statestudio.memory.v1";

export const defaultPrefs: ScenePrefs = {
  theme: "night",
  starDensity: 0.6,
  showGrid: true,
  showAxes: true,
  orbitMode: "auto",
  globalScale: 1,
  shadowsEnabled: true,
  overridePolicy: "match",
  motionIntensity: "normal",
};

let msgIdSeq = 0;
export const makeMsg = (role: "user" | "assistant", text: string): Msg => ({
  id: `m-${Date.now()}-${msgIdSeq++}`,
  role,
  text,
});

export const normalizeMessages = (input?: Msg[] | null): Msg[] => {
  if (!Array.isArray(input)) return [];
  return input.map((m) => {
    if (!m) return m;
    return m.id ? m : { ...m, id: `m-${Date.now()}-${msgIdSeq++}` };
  });
};

export const isSameMessage = (a?: Msg | null, b?: Msg | null) => {
  if (!a || !b) return false;
  if (a.id && b.id) return a.id === b.id;
  return a.role === b.role && a.text === b.text;
};

export const appendMessages = (base: Msg[], next: Msg[]) => {
  const out = [...base];
  for (const msg of next) {
    if (!msg) continue;
    const last = out[out.length - 1];
    if (isSameMessage(last, msg)) continue;
    if (last && last.role === "assistant" && msg.role === "assistant") {
      if (msg.text && last.text && msg.text.startsWith(last.text)) {
        out[out.length - 1] = { ...last, text: msg.text };
        continue;
      }
      if (msg.text && last.text && last.text.startsWith(msg.text)) {
        continue;
      }
    }
    out.push(msg);
  }
  return out;
};

function readObjectRecord(value: unknown): Record<string, unknown> | null {
  return value !== null && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : null;
}

function buildStateVectorFromUnknown(raw: unknown): StateVector {
  const rec = readObjectRecord(raw);
  if (!rec) return {};
  const out: StateVector = {};
  for (const [k, v] of Object.entries(rec)) {
    if (typeof v === "number" && Number.isFinite(v)) {
      out[k] = v;
    }
  }
  return out;
}

/** Coerce arbitrary backend / persistence blobs into a canonical SceneJson (fills safe defaults). */
export const normalizeSceneJson = (input: unknown): SceneJson => {
  const root = readObjectRecord(input);
  const metaDefault: Record<string, unknown> = { version: "dev", generated_at: new Date().toISOString() };
  const meta = readObjectRecord(root?.["meta"]) ?? metaDefault;
  const domain_model = readObjectRecord(root?.["domain_model"]) ?? { mode: "business" };
  const state_vector = buildStateVectorFromUnknown(root?.["state_vector"]);
  const sceneRaw = readObjectRecord(root?.["scene"]) ?? {};
  const objects = Array.isArray(sceneRaw["objects"]) ? sceneRaw["objects"] : [];
  const intensity =
    typeof state_vector.intensity === "number" && Number.isFinite(state_vector.intensity)
      ? state_vector.intensity
      : undefined;
  const innerScene = readObjectRecord(sceneRaw["scene"]) ?? {};
  const syncedScene: Record<string, unknown> =
    intensity !== undefined
      ? {
          ...sceneRaw,
          scene: { ...innerScene, intensity },
        }
      : sceneRaw;
  return {
    meta,
    domain_model,
    state_vector,
    scene: { ...syncedScene, objects },
  };
};

/**
 * Returns normalized scene JSON only when the payload yields at least one scene object after coercion.
 * Use for restores / replacements so empty or non-scene metadata blobs do not wipe the live scene.
 */
export function tryRenderableSceneJsonFromUnknown(input: unknown): SceneJson | null {
  if (input == null || typeof input !== "object" || Array.isArray(input)) return null;
  const normalized = normalizeSceneJson(input);
  const objects = Array.isArray(normalized.scene?.objects) ? normalized.scene.objects : [];
  return objects.length > 0 ? normalized : null;
}

export function saveProject(p: PersistedProject) {
  try {
    window.localStorage.setItem(PROJECT_KEY, JSON.stringify(p));
  } catch {
    // ignore
  }
}

export function loadProject(): PersistedProject | null {
  try {
    const raw = window.localStorage.getItem(PROJECT_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed?.version === "1") return parsed as PersistedProject;
  } catch {
    // ignore
  }
  return null;
}

export function loadHistory(): PersistedProject[] {
  try {
    const raw = window.localStorage.getItem(HISTORY_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed.filter((p) => p?.version === "1");
  } catch {
    // ignore
  }
  return [];
}

export function pushHistory(snapshot: PersistedProject) {
  try {
    const history = loadHistory();
    history.push(snapshot);
    const trimmed = history.slice(-10);
    window.localStorage.setItem(HISTORY_KEY, JSON.stringify(trimmed));
  } catch {
    // ignore
  }
}

export function saveBackup(b: BackupV1) {
  try {
    window.localStorage.setItem(BACKUP_KEY, JSON.stringify(b));
  } catch {}
}

export function loadBackup(): BackupV1 | null {
  try {
    const raw = window.localStorage.getItem(BACKUP_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed?.version === "1" && parsed?.kind === "backup") return parsed as BackupV1;
  } catch {}
  return null;
}

export const stableStringify = (value: any): string => {
  const seen = new WeakSet<object>();

  const normalize = (v: any): any => {
    if (v === null || v === undefined) return v;
    if (typeof v !== "object") return v;
    if (v instanceof Date) return v.toISOString();

    if (seen.has(v)) return "[Circular]";
    seen.add(v);

    if (Array.isArray(v)) return v.map(normalize);

    const out: Record<string, any> = {};
    for (const k of Object.keys(v).sort()) {
      out[k] = normalize((v as any)[k]);
    }
    return out;
  };

  try {
    return JSON.stringify(normalize(value));
  } catch {
    try {
      return String(value);
    } catch {
      return "";
    }
  }
};
