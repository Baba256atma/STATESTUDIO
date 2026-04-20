export type NexoraProductMode = "dev" | "pilot";

export function getNexoraProductMode(): NexoraProductMode {
  if (process.env.NEXT_PUBLIC_NEXORA_PRODUCT_MODE === "pilot") {
    return "pilot";
  }
  return "dev";
}
