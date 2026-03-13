export type UICommand =
  | { type: "select"; id: string | null }
  | { type: "pin"; id: string }
  | { type: "unpin"; id: string }
  | { type: "setObjectUx"; id: string; patch: { opacity?: number; scale?: number } }
  | { type: "toast"; message: string };

export const isUICommand = (value: unknown): value is UICommand => {
  if (!value || typeof value !== "object") return false;
  const v = value as { type?: unknown };
  return typeof v.type === "string";
};
