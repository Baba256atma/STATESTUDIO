import type { SceneLoop } from "../sceneTypes";
import type { DecisionSnapshot } from "./decisionTypes";

export type LoopChange = {
  loopId: string;
  type?: string;
  change: "added" | "removed" | "modified" | "unchanged";
  severityFrom?: number;
  severityTo?: number;
  statusFrom?: string;
  statusTo?: string;
};

export type DecisionDiff = {
  aId: string;
  bId: string;
  aTime: number;
  bTime: number;
  activeLoopChanged: boolean;
  activeLoopFrom: string | null;
  activeLoopTo: string | null;
  loopChanges: LoopChange[];
  summary: {
    added: number;
    removed: number;
    modified: number;
    unchanged: number;
    severityUp: number;
    severityDown: number;
  };
};

const clamp01 = (n: number): number => Math.max(0, Math.min(1, n));

const safeNum = (n: unknown, fallback: number | undefined = undefined): number | undefined => {
  if (typeof n === "number" && Number.isFinite(n)) return n;
  return fallback;
};

const normalizeSeverity = (loop: any): number | undefined => {
  const sev = safeNum(loop?.severity);
  if (typeof sev === "number") return clamp01(sev);
  const strength = safeNum(loop?.strength);
  if (typeof strength === "number") return clamp01(strength);
  return undefined;
};

const normalizeStatus = (loop: any): string | undefined => {
  const status = loop?.status;
  return typeof status === "string" ? status : undefined;
};

type LoopIndex = Record<string, SceneLoop>;

const indexLoops = (loops: SceneLoop[]): LoopIndex => {
  const map: LoopIndex = {};
  loops.forEach((l, idx) => {
    const id = typeof l?.id === "string" && l.id.length > 0 ? l.id : `loop_${idx}`;
    map[id] = l;
  });
  return map;
};

export function diffSnapshots(a: DecisionSnapshot, b: DecisionSnapshot): DecisionDiff {
  const idxA = indexLoops(Array.isArray(a?.loops) ? a.loops : []);
  const idxB = indexLoops(Array.isArray(b?.loops) ? b.loops : []);

  const ids = new Set<string>([...Object.keys(idxA), ...Object.keys(idxB)]);
  const loopChanges: LoopChange[] = [];

  let added = 0;
  let removed = 0;
  let modified = 0;
  let unchanged = 0;
  let severityUp = 0;
  let severityDown = 0;

  ids.forEach((id) => {
    const loopA = idxA[id];
    const loopB = idxB[id];

    const severityA = normalizeSeverity(loopA);
    const severityB = normalizeSeverity(loopB);
    const statusA = normalizeStatus(loopA);
    const statusB = normalizeStatus(loopB);
    const typeA = loopA?.type;
    const typeB = loopB?.type;

    let change: LoopChange["change"] = "unchanged";

    if (loopA && !loopB) {
      change = "removed";
      removed += 1;
    } else if (!loopA && loopB) {
      change = "added";
      added += 1;
    } else if (loopA && loopB) {
      const typeChanged = typeA !== typeB;
      const statusChanged = statusA !== statusB;
      const severityChanged =
        typeof severityA === "number" && typeof severityB === "number"
          ? Math.abs(severityA - severityB) >= 0.01
          : severityA !== severityB;

      if (typeChanged || statusChanged || severityChanged) {
        change = "modified";
        modified += 1;
        if (typeof severityA === "number" && typeof severityB === "number") {
          if (severityB - severityA >= 0.05) severityUp += 1;
          if (severityA - severityB >= 0.05) severityDown += 1;
        }
      } else {
        unchanged += 1;
      }
    }

    loopChanges.push({
      loopId: id,
      type: (loopB?.type ?? loopA?.type) as string | undefined,
      change,
      severityFrom: severityA,
      severityTo: severityB,
      statusFrom: statusA,
      statusTo: statusB,
    });
  });

  const diff: DecisionDiff = {
    aId: a.id,
    bId: b.id,
    aTime: a.timestamp,
    bTime: b.timestamp,
    activeLoopChanged: a.activeLoopId !== b.activeLoopId,
    activeLoopFrom: a.activeLoopId ?? null,
    activeLoopTo: b.activeLoopId ?? null,
    loopChanges,
    summary: {
      added,
      removed,
      modified,
      unchanged,
      severityUp,
      severityDown,
    },
  };

  return diff;
}
