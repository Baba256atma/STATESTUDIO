/**
 * Stable entry for chat pipeline hooks — Turbopack/dev sometimes mis-resolves deep
 * `./useChatPipelineController.ts` imports; `./hooks/chat` → this barrel keeps one canonical path.
 */
export { useChatPipelineController } from "./useChatPipelineController.ts";
export type {
  UseChatPipelineControllerInput,
  UseChatPipelineControllerResult,
} from "./useChatPipelineController.ts";
