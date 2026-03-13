import type { KpiDefJson, LoopTemplateJson } from "./customerConfig";

type ValidationIssue = { level: "error" | "warn"; path: string; message: string };
type ValidationResult<T> = { ok: boolean; value: T; issues: ValidationIssue[] };

const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
const clamp11 = (v: number) => Math.max(-1, Math.min(1, v));

const isObject = (v: unknown): v is Record<string, unknown> =>
  typeof v === "object" && v !== null && !Array.isArray(v);
const isString = (v: unknown): v is string => typeof v === "string";
const isNumber = (v: unknown): v is number => typeof v === "number" && Number.isFinite(v);
const isArray = Array.isArray;

const normalizePercentLike = (v: number) => {
  if (v > 1 && v <= 100) return v / 100;
  return v;
};

export function validateKpiDefs(input: unknown): ValidationResult<KpiDefJson[]> {
  const issues: ValidationIssue[] = [];
  if (!isArray(input)) {
    issues.push({ level: "error", path: "kpis", message: "Expected array." });
    return { ok: false, value: [], issues };
  }

  const value: KpiDefJson[] = [];

  input.forEach((item, index) => {
    const path = `kpis[${index}]`;
    if (!isObject(item)) {
      issues.push({ level: "error", path, message: "Expected object." });
      return;
    }

    const id = isString(item.id) ? item.id.trim() : "";
    const label = isString(item.label) ? item.label.trim() : "";
    const unit = isString(item.unit) ? item.unit.trim() : "";
    const direction = item.direction === "up" || item.direction === "down" ? item.direction : null;
    const description = isString(item.description) ? item.description.trim() : "";

    let target = isNumber(item.target) ? item.target : NaN;
    if (isNumber(target)) target = clamp01(normalizePercentLike(target));

    if (!id || !label || !unit || !direction || !description || !isNumber(target)) {
      issues.push({ level: "error", path, message: "Missing or invalid required KPI fields." });
      return;
    }

    let thresholds: KpiDefJson["thresholds"];
    if (item.thresholds !== undefined) {
      if (!isObject(item.thresholds)) {
        issues.push({ level: "warn", path: `${path}.thresholds`, message: "Expected object." });
      } else {
        const t = item.thresholds;
        const next: NonNullable<KpiDefJson["thresholds"]> = {};
        const map: Array<["warnBelow" | "warnAbove" | "criticalBelow" | "criticalAbove", unknown]> = [
          ["warnBelow", t.warnBelow],
          ["warnAbove", t.warnAbove],
          ["criticalBelow", t.criticalBelow],
          ["criticalAbove", t.criticalAbove],
        ];
        map.forEach(([key, raw]) => {
          if (!isNumber(raw)) return;
          next[key] = clamp01(normalizePercentLike(raw));
        });
        thresholds = Object.keys(next).length ? next : undefined;
      }
    }

    let drivers: string[] | undefined;
    if (item.drivers !== undefined) {
      if (!isArray(item.drivers)) {
        issues.push({ level: "warn", path: `${path}.drivers`, message: "Expected array." });
      } else {
        drivers = item.drivers.filter(isString).map((d) => d.trim()).filter(Boolean);
      }
    }

    let driver_weights: Record<string, number> | undefined;
    if (item.driver_weights !== undefined) {
      if (!isObject(item.driver_weights)) {
        issues.push({ level: "warn", path: `${path}.driver_weights`, message: "Expected object." });
      } else {
        driver_weights = {};
        Object.entries(item.driver_weights).forEach(([key, raw]) => {
          if (!isNumber(raw)) return;
          const k = key.trim();
          if (!k) return;
          driver_weights![k] = clamp11(raw);
        });
        if (!Object.keys(driver_weights).length) driver_weights = undefined;
      }
    }

    value.push({
      id,
      label,
      unit,
      target,
      direction,
      description,
      thresholds,
      drivers,
      driver_weights,
    });
  });

  return { ok: issues.every((i) => i.level !== "error"), value, issues };
}

export function validateLoopTemplates(input: unknown): ValidationResult<LoopTemplateJson[]> {
  const issues: ValidationIssue[] = [];
  if (!isArray(input)) {
    issues.push({ level: "error", path: "loops", message: "Expected array." });
    return { ok: false, value: [], issues };
  }

  const value: LoopTemplateJson[] = [];

  input.forEach((item, index) => {
    const path = `loops[${index}]`;
    if (!isObject(item)) {
      issues.push({ level: "error", path, message: "Expected object." });
      return;
    }

    const type = isString(item.type) ? item.type.trim() : "";
    const label = isString(item.label) ? item.label.trim() : "";
    const category = isString(item.category) ? item.category.trim() : "";
    let default_intensity = isNumber(item.default_intensity) ? item.default_intensity : NaN;
    if (isNumber(default_intensity)) default_intensity = clamp01(default_intensity);

    if (!type || !label || !category || !isNumber(default_intensity)) {
      issues.push({ level: "error", path, message: "Missing or invalid required loop fields." });
      return;
    }

    let impact: Record<string, number> | undefined;
    if (item.impact !== undefined) {
      if (!isObject(item.impact)) {
        issues.push({ level: "warn", path: `${path}.impact`, message: "Expected object." });
      } else {
        impact = {};
        Object.entries(item.impact).forEach(([key, raw]) => {
          if (!isNumber(raw)) return;
          const k = key.trim();
          if (!k) return;
          impact![k] = clamp11(raw);
        });
        if (!Object.keys(impact).length) impact = undefined;
      }
    }

    value.push({
      type,
      label,
      category,
      default_intensity,
      impact,
    });
  });

  return { ok: issues.every((i) => i.level !== "error"), value, issues };
}

export function validateCustomerConfig(opts: {
  kpis: unknown;
  loops: unknown;
}): {
  kpis: KpiDefJson[];
  loops: LoopTemplateJson[];
  issues: ValidationIssue[];
} {
  const kpiResult = validateKpiDefs(opts.kpis);
  const loopResult = validateLoopTemplates(opts.loops);
  return {
    kpis: kpiResult.value,
    loops: loopResult.value,
    issues: [...kpiResult.issues, ...loopResult.issues],
  };
}
