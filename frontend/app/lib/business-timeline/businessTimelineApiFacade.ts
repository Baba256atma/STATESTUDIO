/**
 * APP-7:6 — Business Timeline API facade.
 * Delegates to APP-7:2 through APP-7:5 public surfaces only.
 */

import {
  archiveBusinessEvent,
  createBusinessEvent,
  getBusinessEventById,
  getBusinessEventsByWorkspace,
  updateBusinessEventMetadata,
} from "./businessEventEngine.ts";
import {
  getBusinessTimelineOrderedEvents,
  getBusinessTimelineRange,
  getBusinessTimelineSummary,
  queryBusinessTimeline,
} from "./businessTimelineQuery.ts";
import {
  buildBusinessLifecycleModel,
  getBusinessLifecycleSummary,
} from "./businessTimelineLifecycle.ts";
import {
  buildBusinessTimelineContextModel,
  getBusinessEventContext,
  getBusinessRelatedEvents,
} from "./businessTimelineContext.ts";
import {
  BUSINESS_TIMELINE_API_CONTRACT_VERSION,
  BUSINESS_TIMELINE_API_ERROR_CODES,
  apiError,
  apiFailure,
  apiSuccess,
  type BusinessTimelineApi,
  type BusinessTimelineApiCertificationResult,
  type BusinessTimelineApiCertificationSurface,
  type BusinessTimelineApiContextSurface,
  type BusinessTimelineApiEventsSurface,
  type BusinessTimelineApiLifecycleSurface,
  type BusinessTimelineApiQuerySurface,
  type BusinessTimelineApiResponse,
} from "./businessTimelineApiTypes.ts";

function engineFailure<T>(reason: string): BusinessTimelineApiResponse<T> {
  return apiFailure(reason, [apiError(BUSINESS_TIMELINE_API_ERROR_CODES.validationFailure, reason)]);
}

export function createBusinessTimelineApiFacade(
  certificationRunner?: () => BusinessTimelineApiCertificationResult
): BusinessTimelineApi {
  const events: BusinessTimelineApiEventsSurface = {
    createEvent: (input) => {
      const result = createBusinessEvent(input);
      return result.success && result.data
        ? apiSuccess("Event created.", result.data)
        : engineFailure(result.reason);
    },
    getEventById: (eventId) => apiSuccess("Event retrieved.", getBusinessEventById(eventId)),
    getEventsByWorkspace: (workspaceId) =>
      apiSuccess("Workspace events retrieved.", getBusinessEventsByWorkspace(workspaceId)),
    updateEventMetadata: (input) => {
      const result = updateBusinessEventMetadata(input);
      return result.success && result.data
        ? apiSuccess("Event metadata updated.", result.data)
        : engineFailure(result.reason);
    },
    archiveEvent: (eventId, workspaceId) => {
      const result = archiveBusinessEvent(eventId, workspaceId);
      return result.success && result.data
        ? apiSuccess("Event archived.", result.data)
        : engineFailure(result.reason);
    },
  };

  const query: BusinessTimelineApiQuerySurface = {
    queryTimeline: (filters) => {
      const result = queryBusinessTimeline(filters);
      return result.success && result.data
        ? apiSuccess("Timeline queried.", result.data)
        : engineFailure(result.reason);
    },
    getOrderedEvents: (filters) =>
      apiSuccess("Ordered events retrieved.", getBusinessTimelineOrderedEvents(filters)),
    getRange: (workspaceId, occurredFrom, occurredTo, direction) => {
      const result = getBusinessTimelineRange(workspaceId, occurredFrom, occurredTo, direction);
      return result.success && result.data
        ? apiSuccess("Timeline range retrieved.", result.data)
        : engineFailure(result.reason);
    },
    getSummary: (filters) => apiSuccess("Timeline summary retrieved.", getBusinessTimelineSummary(filters)),
  };

  const lifecycle: BusinessTimelineApiLifecycleSurface = {
    buildLifecycle: (input) => apiSuccess("Lifecycle model built.", buildBusinessLifecycleModel(input)),
    getLifecycleSummary: (input) =>
      apiSuccess("Lifecycle summary retrieved.", getBusinessLifecycleSummary(input)),
    extractMilestones: (input) =>
      apiSuccess("Milestones extracted.", buildBusinessLifecycleModel(input).milestones),
  };

  const context: BusinessTimelineApiContextSurface = {
    buildContextModel: (input) =>
      apiSuccess("Context model built.", buildBusinessTimelineContextModel(input)),
    getEventContext: (model, eventId) =>
      apiSuccess("Event context retrieved.", getBusinessEventContext(model, eventId)),
    getRelatedEvents: (model, eventId) =>
      apiSuccess("Related events retrieved.", getBusinessRelatedEvents(model, eventId)),
  };

  const certification: BusinessTimelineApiCertificationSurface = {
    runCertification: () => {
      if (!certificationRunner) {
        return engineFailure("Certification runner is not bound.");
      }
      const result = certificationRunner();
      return apiSuccess(result.summary, result);
    },
  };

  return Object.freeze({
    events: Object.freeze(events),
    query: Object.freeze(query),
    lifecycle: Object.freeze(lifecycle),
    context: Object.freeze(context),
    certification: Object.freeze(certification),
    version: BUSINESS_TIMELINE_API_CONTRACT_VERSION,
    readOnly: true as const,
  });
}

export const BusinessTimelineApiFacade = Object.freeze({
  createBusinessTimelineApiFacade,
});
