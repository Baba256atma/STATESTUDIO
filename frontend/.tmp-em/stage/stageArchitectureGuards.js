/**
 * PHASE-1 / STAGE-ARCH-2 — Stage architecture guards.
 * Validates manifests, allowed files, and forbidden boundary patterns.
 */
import { STAGE_GLOBAL_FORBIDDEN_PATTERNS, STAGE_LIFECYCLE_PHASES, } from "./stageArchitectureContract.ts";
import { recordStageArchitectureDiagnostic } from "./stageArchitectureDiagnostics.ts";
function issue(code, message) {
    return Object.freeze({ code, message });
}
function normalizePath(value) {
    return value.trim().replace(/\\/g, "/");
}
function matchesForbiddenPattern(path, pattern) {
    const normalizedPath = normalizePath(path).toLowerCase();
    const normalizedPattern = pattern.trim().toLowerCase();
    return normalizedPath.includes(normalizedPattern);
}
export function validateStageManifest(manifest) {
    const issues = [];
    if (!manifest.stageId.trim()) {
        issues.push(issue("missing_stage_id", "Stage manifest requires a non-empty stageId."));
    }
    if (!manifest.title.trim()) {
        issues.push(issue("missing_title", "Stage manifest requires a title."));
    }
    if (!manifest.goal.trim()) {
        issues.push(issue("missing_goal", "Stage manifest requires a goal."));
    }
    if (!STAGE_LIFECYCLE_PHASES.includes(manifest.lifecycle)) {
        issues.push(issue("unsupported_lifecycle", `Lifecycle "${manifest.lifecycle}" is not supported.`));
    }
    if (manifest.allowedFiles.length === 0) {
        issues.push(issue("empty_allowlist", "Stage manifest requires at least one allowed file."));
    }
    for (const filePath of manifest.allowedFiles) {
        const decision = evaluateStageFileBoundary({
            filePath,
            allowedFiles: manifest.allowedFiles,
            forbiddenPatterns: manifest.forbiddenPatterns,
        });
        if (!decision.allowed) {
            issues.push(issue("allowlist_violation", decision.message));
        }
    }
    return Object.freeze({
        valid: issues.length === 0,
        issues: Object.freeze(issues),
    });
}
export function evaluateStageFileBoundary(input) {
    const filePath = normalizePath(input.filePath);
    if (!filePath) {
        return Object.freeze({
            allowed: false,
            reason: "empty_path",
            message: "File path cannot be empty.",
        });
    }
    const patterns = input.forbiddenPatterns ?? STAGE_GLOBAL_FORBIDDEN_PATTERNS;
    for (const pattern of patterns) {
        if (matchesForbiddenPattern(filePath, pattern)) {
            recordStageArchitectureDiagnostic({
                event: "StageBoundaryRejected",
                message: `Forbidden pattern "${pattern}" matched path "${filePath}".`,
            });
            return Object.freeze({
                allowed: false,
                reason: "forbidden_pattern",
                message: `Path "${filePath}" matches forbidden pattern "${pattern}".`,
            });
        }
    }
    const allowed = input.allowedFiles.some((entry) => normalizePath(entry).toLowerCase() === filePath.toLowerCase());
    if (!allowed) {
        return Object.freeze({
            allowed: false,
            reason: "not_in_allowlist",
            message: `Path "${filePath}" is not listed in the stage allowlist.`,
        });
    }
    return Object.freeze({
        allowed: true,
        reason: "allowed",
        message: `Path "${filePath}" is allowed for this stage.`,
    });
}
export function assertStageManifestValid(manifest) {
    return validateStageManifest(manifest);
}
export const StageArchitectureGuards = Object.freeze({
    validateStageManifest,
    evaluateStageFileBoundary,
    assertStageManifestValid,
});
