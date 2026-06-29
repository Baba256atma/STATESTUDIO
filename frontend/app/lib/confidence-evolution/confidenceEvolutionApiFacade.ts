/**
 * APP-9:7 — Confidence Evolution API facade.
 * Delegates to APP-9:2 through APP-9:6 public surfaces only.
 */

import {
  archiveConfidenceRecord,
  createConfidenceRecord,
  getConfidenceRecordById,
  getConfidenceRecords,
  updateConfidenceMetadata,
} from "./confidenceEvolutionEngine.ts";
import {
  buildConfidenceEvidenceReasonLinkModel,
  buildConfidenceEvidenceLinks,
  buildConfidenceReasonLinks,
} from "./confidenceEvolutionEvidenceReason.ts";
import { detectConfidenceExplanationFlags } from "./confidenceEvolutionExplanationFlags.ts";
import {
  buildConfidenceCalibrationModel,
  calculateConfidenceAccuracyScore,
  calculateConfidenceCalibrationScore,
  evaluateConfidenceCalibration,
} from "./confidenceEvolutionCalibration.ts";
import {
  getConfidenceEvolutionRange,
  getConfidenceEvolutionSummary,
  getConfidenceRecordsOrdered,
  queryConfidenceEvolution,
} from "./confidenceEvolutionQuery.ts";
import {
  buildConfidenceTrendModel,
  calculateConfidenceDeltas,
  calculateConfidenceVolatility,
  classifyConfidenceTrendDirection,
} from "./confidenceEvolutionTrend.ts";
import {
  CONFIDENCE_EVOLUTION_API_CONTRACT_VERSION,
  CONFIDENCE_EVOLUTION_API_ERROR_CODES,
  apiError,
  apiFailure,
  apiSuccess,
  type ConfidenceEvolutionApi,
  type ConfidenceEvolutionApiCertificationResult,
  type ConfidenceEvolutionApiResponse,
} from "./confidenceEvolutionApiTypes.ts";

function engineFailure<T>(reason: string): ConfidenceEvolutionApiResponse<T> {
  return apiFailure(reason, [apiError(CONFIDENCE_EVOLUTION_API_ERROR_CODES.validationFailure, reason)]);
}

function recordNotFoundFailure<T>(): ConfidenceEvolutionApiResponse<T> {
  return apiFailure("Record not found.", [
    apiError(CONFIDENCE_EVOLUTION_API_ERROR_CODES.recordNotFound, "Record not found.", "recordId"),
  ]);
}

function resolveRecord(recordId: string, workspaceId: string) {
  const record = getConfidenceRecordById(recordId);
  if (!record || record.workspaceId !== workspaceId) {
    return null;
  }
  return record;
}

function loadOrderedRecords(workspaceId: string) {
  return getConfidenceRecordsOrdered(Object.freeze({ workspaceId, direction: "asc" }));
}

export function createConfidenceEvolutionApiFacade(
  certificationRunner?: () => ConfidenceEvolutionApiCertificationResult
): ConfidenceEvolutionApi {
  return Object.freeze({
    records: Object.freeze({
      createRecord: (input) => {
        const result = createConfidenceRecord(input);
        return result.success && result.data
          ? apiSuccess("Record created.", result.data)
          : engineFailure(result.reason);
      },
      getRecordById: (recordId) => apiSuccess("Record retrieved.", getConfidenceRecordById(recordId)),
      getRecords: (workspaceId) => apiSuccess("Records retrieved.", getConfidenceRecords(workspaceId)),
      updateRecordMetadata: (input) => {
        const result = updateConfidenceMetadata(input);
        return result.success && result.data
          ? apiSuccess("Record metadata updated.", result.data)
          : engineFailure(result.reason);
      },
      archiveRecord: (recordId, workspaceId) => {
        const result = archiveConfidenceRecord(recordId, workspaceId);
        return result.success && result.data
          ? apiSuccess("Record archived.", result.data)
          : engineFailure(result.reason);
      },
    }),
    query: Object.freeze({
      queryConfidence: (filters) => {
        const result = queryConfidenceEvolution(filters);
        return result.success && result.data
          ? apiSuccess("Confidence queried.", result.data)
          : engineFailure(result.reason);
      },
      getOrderedRecords: (filters) =>
        apiSuccess("Ordered records retrieved.", getConfidenceRecordsOrdered(filters)),
      getRange: (workspaceId, updatedAtFrom, updatedAtTo, direction) => {
        const result = getConfidenceEvolutionRange(workspaceId, updatedAtFrom, updatedAtTo, direction);
        return result.success && result.data
          ? apiSuccess("Confidence range retrieved.", result.data)
          : engineFailure(result.reason);
      },
      getSummary: (filters) => apiSuccess("Confidence summary retrieved.", getConfidenceEvolutionSummary(filters)),
    }),
    trend: Object.freeze({
      buildTrendModel: (input) => {
        const result = buildConfidenceTrendModel(input);
        return result.success && result.data
          ? apiSuccess("Trend model built.", result.data)
          : engineFailure(result.reason);
      },
      calculateDeltas: (workspaceId) => {
        const records = loadOrderedRecords(workspaceId);
        return apiSuccess("Deltas calculated.", calculateConfidenceDeltas(records));
      },
      calculateVolatility: (workspaceId) => {
        const records = loadOrderedRecords(workspaceId);
        const deltas = calculateConfidenceDeltas(records);
        return apiSuccess("Volatility calculated.", calculateConfidenceVolatility(deltas, records.length));
      },
      classifyDirection: (workspaceId) => {
        const result = buildConfidenceTrendModel(Object.freeze({ workspaceId }));
        if (!result.success || !result.data) {
          return engineFailure(result.reason);
        }
        return apiSuccess("Trend direction classified.", result.data.direction);
      },
    }),
    evidenceReason: Object.freeze({
      buildEvidenceReasonModel: (input) => {
        const result = buildConfidenceEvidenceReasonLinkModel(input);
        return result.success && result.data
          ? apiSuccess("Evidence/reason model built.", result.data)
          : engineFailure(result.reason);
      },
      buildReasonLinks: (workspaceId) => {
        const records = loadOrderedRecords(workspaceId);
        return apiSuccess("Reason links built.", buildConfidenceReasonLinks(workspaceId, records));
      },
      buildEvidenceLinks: (workspaceId) => {
        const records = loadOrderedRecords(workspaceId);
        return apiSuccess("Evidence links built.", buildConfidenceEvidenceLinks(workspaceId, records));
      },
      detectExplanationFlags: (workspaceId) => {
        const records = loadOrderedRecords(workspaceId);
        const deltas = calculateConfidenceDeltas(records);
        return apiSuccess("Explanation flags detected.", detectConfidenceExplanationFlags(records, deltas));
      },
    }),
    calibration: Object.freeze({
      buildCalibrationModel: (input) => {
        const result = buildConfidenceCalibrationModel(input);
        return result.success && result.data
          ? apiSuccess("Calibration model built.", result.data)
          : engineFailure(result.reason);
      },
      evaluateCalibration: (confidenceScore, reason, source, evidenceReferences) =>
        apiSuccess("Calibration evaluated.", evaluateConfidenceCalibration(confidenceScore, reason, source, evidenceReferences)),
      calculateCalibrationScore: (confidenceScore, evidenceSupportScore) =>
        apiSuccess("Calibration score calculated.", calculateConfidenceCalibrationScore(confidenceScore, evidenceSupportScore)),
      calculateAccuracyScore: (confidenceScore, evidenceSupportScore) =>
        apiSuccess("Accuracy score calculated.", calculateConfidenceAccuracyScore(confidenceScore, evidenceSupportScore)),
    }),
    certification: Object.freeze({
      runCertification: () => {
        if (!certificationRunner) {
          return engineFailure("Certification runner is not bound.");
        }
        const result = certificationRunner();
        return apiSuccess(result.summary, result);
      },
    }),
    version: CONFIDENCE_EVOLUTION_API_CONTRACT_VERSION,
    readOnly: true as const,
  });
}

export const ConfidenceEvolutionApiFacade = Object.freeze({
  createConfidenceEvolutionApiFacade,
});
