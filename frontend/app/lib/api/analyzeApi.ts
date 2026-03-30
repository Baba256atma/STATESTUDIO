import { postAnalyzeFull } from "./client";
import type { AnalyzeFullIn, AnalyzeFullResponse } from "./generated";

export async function analyzeFull(params: {
  episodeId: string | null;
  text: string;
}): Promise<AnalyzeFullResponse> {
  const payload: AnalyzeFullIn = {
    episode_id: params.episodeId ?? null,
    text: params.text,
  };
  const data = await postAnalyzeFull(payload);
  if (!data || typeof data !== "object") {
    throw new Error("Invalid analyze response");
  }
  if (!data.episode_id || typeof data.episode_id !== "string") {
    throw new Error("Invalid analyze response: missing episode_id");
  }
  return data;
}
