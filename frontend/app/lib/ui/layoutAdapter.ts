import type { LayoutMode } from "../contracts";

export function toShellLayoutMode(
  mode: LayoutMode | undefined
): "floating" | "split" | undefined {
  if (mode === undefined) return undefined;
  if (mode === "floating") return "floating";
  if (mode === "split") return "split";
  return "split";
}
