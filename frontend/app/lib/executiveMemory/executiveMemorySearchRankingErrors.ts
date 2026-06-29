/**
 * APP-4:9 — Executive Memory Search & Ranking error model.
 */

import { EXECUTIVE_MEMORY_SEARCH_RANKING_ERROR_CODES } from "./executiveMemorySearchRankingConstants.ts";
import type { ExecutiveMemorySearchError } from "./executiveMemorySearchRankingTypes.ts";

export { EXECUTIVE_MEMORY_SEARCH_RANKING_ERROR_CODES };

export function createExecutiveMemorySearchError(
  code: string,
  message: string,
  field?: string
): ExecutiveMemorySearchError {
  return Object.freeze({ code, message, field, readOnly: true as const });
}

export function executiveMemorySearchErrorFromCode(
  code: keyof typeof EXECUTIVE_MEMORY_SEARCH_RANKING_ERROR_CODES,
  message: string,
  field?: string
): ExecutiveMemorySearchError {
  return createExecutiveMemorySearchError(EXECUTIVE_MEMORY_SEARCH_RANKING_ERROR_CODES[code], message, field);
}
