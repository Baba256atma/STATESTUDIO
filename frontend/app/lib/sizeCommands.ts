export function clamp(value: number, min: number, max: number) {
  if (!Number.isFinite(value)) return min;
  return Math.min(max, Math.max(min, value));
}

export function round2(value: number) {
  return Math.round(value * 100) / 100;
}

const MIN_SCALE = 0.2;
const MAX_SCALE = 2;

type SizeParseResult =
  | { handled: true; nextScale: number; reply: string }
  | { handled: false };

function formatScale(value: number) {
  return `${round2(value).toFixed(2)}x`;
}

export function parseSizeCommand(text: string, currentScale: number): SizeParseResult {
  const normalized = text.trim().toLowerCase();
  if (!normalized) return { handled: false };

  const clampScale = (value: number) => clamp(value, MIN_SCALE, MAX_SCALE);

  const directMatch = normalized.match(
    /(?:^|\b)(?:set\s+)?(?:global\s+)?scale(?:\s+to)?\s+([0-9]*\.?[0-9]+)/i
  );
  if (directMatch) {
    const value = parseFloat(directMatch[1]);
    if (!Number.isNaN(value)) {
      const nextScale = clampScale(value);
      return { handled: true, nextScale, reply: `✅ Global size set to ${formatScale(nextScale)}` };
    }
  }

  const increasePctMatch = normalized.match(
    /increase(?:\s+the)?\s+size[^0-9%]*([0-9]+(?:\.[0-9]+)?)\s*%/
  );
  if (increasePctMatch) {
    const pct = parseFloat(increasePctMatch[1]);
    if (!Number.isNaN(pct)) {
      const nextScale = clampScale(currentScale * (1 + pct / 100));
      return { handled: true, nextScale, reply: `✅ Global size set to ${formatScale(nextScale)}` };
    }
  }

  const decreasePctMatch = normalized.match(
    /decrease(?:\s+the)?\s+size[^0-9%]*([0-9]+(?:\.[0-9]+)?)\s*%/
  );
  if (decreasePctMatch) {
    const pct = parseFloat(decreasePctMatch[1]);
    if (!Number.isNaN(pct)) {
      const nextScale = clampScale(currentScale * (1 - pct / 100));
      return { handled: true, nextScale, reply: `✅ Global size set to ${formatScale(nextScale)}` };
    }
  }

  const wantsIncrease =
    /make\s+(?:it\s+)?bigger/.test(normalized) || /increase\s+(?:the\s+)?size/.test(normalized);
  if (wantsIncrease) {
    const nextScale = clampScale(currentScale + 0.1);
    return { handled: true, nextScale, reply: `✅ Global size set to ${formatScale(nextScale)}` };
  }

  const wantsDecrease =
    /make\s+(?:it\s+)?smaller/.test(normalized) || /decrease\s+(?:the\s+)?size/.test(normalized);
  if (wantsDecrease) {
    const nextScale = clampScale(currentScale - 0.1);
    return { handled: true, nextScale, reply: `✅ Global size set to ${formatScale(nextScale)}` };
  }

  return { handled: false };
}

export type SizeCommandResult =
  | { handled: true; nextScale: number; reply: string }
  | { handled: false };

export function parseSelectedSizeCommand(
  text: string,
  currentScale: number
): SizeCommandResult {
  const normalized = text.trim().toLowerCase();
  if (!normalized) return { handled: false };

  const clampScale = (value: number) => clamp(value, MIN_SCALE, MAX_SCALE);

  // Direct set: "selected scale 0.8" or "set selected scale to 1.2" or "selected size 0.75"
  const directMatch = normalized.match(/(?:^|\b)(?:set\s+)?selected\s+(?:scale|size)(?:\s+to)?\s+([0-9]*\.?[0-9]+)/i);
  if (directMatch) {
    const v = parseFloat(directMatch[1]);
    if (!Number.isNaN(v)) {
      const nextScale = clampScale(v);
      return { handled: true, nextScale, reply: `✅ Selected size set to ${round2(nextScale).toFixed(2)}x` };
    }
  }

  // Percentage: increase/decrease selected size 10%
  const incPct = normalized.match(/increase(?:\s+selected)?\s+(?:size|scale)\s+([0-9]+(?:\.[0-9]+)?)%/i);
  if (incPct) {
    const pct = parseFloat(incPct[1]);
    if (!Number.isNaN(pct)) {
      const nextScale = clampScale(currentScale * (1 + pct / 100));
      return { handled: true, nextScale, reply: `✅ Selected size set to ${round2(nextScale).toFixed(2)}x` };
    }
  }
  const decPct = normalized.match(/decrease(?:\s+selected)?\s+(?:size|scale)\s+([0-9]+(?:\.[0-9]+)?)%/i);
  if (decPct) {
    const pct = parseFloat(decPct[1]);
    if (!Number.isNaN(pct)) {
      const nextScale = clampScale(currentScale * (1 - pct / 100));
      return { handled: true, nextScale, reply: `✅ Selected size set to ${round2(nextScale).toFixed(2)}x` };
    }
  }

  // Relative step: make selected bigger/smaller, increase selected size, decrease selected size
  if (/make\s+selected\s+bigger|make\s+it\s+bigger|increase\s+(?:selected\s+)?(?:size|scale)/i.test(normalized)) {
    const nextScale = clampScale(currentScale + 0.1);
    return { handled: true, nextScale, reply: `✅ Selected size set to ${round2(nextScale).toFixed(2)}x` };
  }
  if (/make\s+selected\s+smaller|make\s+it\s+smaller|decrease\s+(?:selected\s+)?(?:size|scale)/i.test(normalized)) {
    const nextScale = clampScale(currentScale - 0.1);
    return { handled: true, nextScale, reply: `✅ Selected size set to ${round2(nextScale).toFixed(2)}x` };
  }

  return { handled: false };
}
