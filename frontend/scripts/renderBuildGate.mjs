/**
 * DEPLOY:5-BUILD-MEMORY-FIX:1 — one decision for the production build.
 *
 * Trust model:
 * The GitHub Actions workflow file `.github/workflows/ci.yml` is the authority.
 * A Render build may skip Next's in-build TypeScript pass only when that
 * workflow has a completed successful Frontend job for the same commit on main,
 * created by the GitHub Actions app. A check display name is not evidence.
 *
 * The newest matching workflow run is authoritative. An older success cannot
 * override a missing, pending, failed, cancelled, or skipped Frontend job on
 * that newest run. The workflow run's own conclusion is not required: the
 * release job lives in a separate workflow, and a parallel job in this
 * workflow may still be running when the Frontend job has passed.
 *
 * `npm run build` never reaches this gate. NEXORA_RENDER_BUILD is not evidence.
 */

import { readFileSync } from "node:fs";

export const NEXORA_REPOSITORY = "Baba256atma/STATESTUDIO";
export const FRONTEND_CHECK_NAME = "Frontend";
export const WORKFLOW_PATH = ".github/workflows/ci.yml";
export const REQUIRED_BRANCH = "main";
export const REQUIRED_EVENT = "push";
export const GITHUB_ACTIONS_APP_SLUG = "github-actions";
export const RENDER_BUILD_HEAP_MB = 6144;

const SHA = /^[0-9a-f]{40}$/;
const CHECK_RUN_ID = /^[1-9][0-9]{0,18}$/;

export function decideRenderBuild({ env, check = null, localProof = null }) {
  if (env.NEXORA_RENDER_BUILD !== "1") {
    return Object.freeze({ action: "full-typecheck", ignoreBuildErrors: false });
  }
  if (env.RENDER === "true") {
    if (env.NEXORA_LOCAL_COMPILE_MEASUREMENT === "1") {
      return refuse("The local measurement flag cannot authorize a Render build.");
    }
    const sha = typeof env.RENDER_GIT_COMMIT === "string" ? env.RENDER_GIT_COMMIT.trim() : "";
    const branch = typeof env.RENDER_GIT_BRANCH === "string" ? env.RENDER_GIT_BRANCH.trim() : "";
    if (!SHA.test(sha)) return refuse("RENDER_GIT_COMMIT is missing. TypeScript validation was not skipped.");
    if (branch !== REQUIRED_BRANCH) {
      return refuse("RENDER_GIT_BRANCH is not main. TypeScript validation was not skipped.");
    }
    if (!isTrustedFrontendCheck(check, sha)) {
      return refuse(
        "The Frontend CI check has not passed for this commit. TypeScript validation was not skipped.",
      );
    }
    return authorized(sha);
  }
  if (
    env.NEXORA_LOCAL_COMPILE_MEASUREMENT === "1" &&
    localProof &&
    localProof.purpose === "local-measurement" &&
    localProof.status === "passed" &&
    typeof localProof.nonce === "string" &&
    localProof.nonce.length >= 16 &&
    localProof.nonce === env.NEXORA_LOCAL_TYPECHECK_NONCE &&
    SHA.test(localProof.sha || "") &&
    Number.isFinite(Date.parse(localProof.expires || "")) &&
    Date.parse(localProof.expires) > Date.now()
  ) {
    return authorized(localProof.sha);
  }
  return refuse(
    "NEXORA_RENDER_BUILD does not skip TypeScript unless Render has verified the Frontend check for this commit.",
  );
}

export function isTrustedWorkflowCheck(check, sha, contract) {
  if (!check || !contract || check.name !== contract.jobName) return false;
  if (check.sha !== sha || check.status !== "completed" || check.conclusion !== "success") return false;
  if (check.repository !== NEXORA_REPOSITORY || check.workflowPath !== contract.workflowPath) return false;
  if (check.event !== REQUIRED_EVENT || check.branch !== REQUIRED_BRANCH) return false;
  if (check.appSlug !== GITHUB_ACTIONS_APP_SLUG) return false;
  if (check.workflowStatus !== "in_progress" && check.workflowStatus !== "completed") return false;
  if (!Number.isSafeInteger(check.workflowRunId) || !Number.isSafeInteger(check.jobId)) return false;
  return check.detailsUrl === detailsUrl(check.workflowRunId, check.jobId);
}

export function isTrustedFrontendCheck(check, sha) {
  return isTrustedWorkflowCheck(check, sha, {
    workflowPath: WORKFLOW_PATH,
    jobName: FRONTEND_CHECK_NAME,
  });
}

function detailsUrl(runId, jobId) {
  return `https://github.com/${NEXORA_REPOSITORY}/actions/runs/${runId}/job/${jobId}`;
}

function authorized(sha) {
  return Object.freeze({
    action: "compile-after-ci",
    ignoreBuildErrors: true,
    sha,
    heapMb: RENDER_BUILD_HEAP_MB,
  });
}

function refuse(reason) {
  return Object.freeze({ action: "refuse", ignoreBuildErrors: false, reason });
}

export function readLocalTypecheckProof(env, readImpl = readFileSync) {
  if (env.RENDER === "true") return null;
  const file = env.NEXORA_LOCAL_TYPECHECK_FILE;
  if (!file) return null;
  try {
    const parsed = JSON.parse(readImpl(file, "utf8"));
    return parsed && typeof parsed === "object" ? parsed : null;
  } catch {
    return null;
  }
}

function integerId(value) {
  return Number.isSafeInteger(value) && value > 0;
}

export function selectAuthoritativeRun(payload, sha, workflowPath = WORKFLOW_PATH) {
  if (!payload || typeof payload !== "object" || !Array.isArray(payload.workflow_runs)) return null;
  // One page of 100 is the bound. A larger total_count means a newer run may
  // be missing, so the page is not proof. There is no follow-up page request.
  if (typeof payload.total_count === "number" && payload.total_count > payload.workflow_runs.length) return null;
  const matches = [];
  for (const run of payload.workflow_runs) {
    if (!run || typeof run !== "object") return null;
    const repository = run.repository && run.repository.full_name;
    if (
      repository === NEXORA_REPOSITORY &&
      run.path === workflowPath &&
      run.event === REQUIRED_EVENT &&
      run.head_branch === REQUIRED_BRANCH &&
      run.head_sha === sha &&
      integerId(run.id) &&
      integerId(run.run_attempt)
    ) {
      matches.push(run);
    }
  }
  if (matches.length === 0) return null;
  matches.sort((left, right) => right.id - left.id || right.run_attempt - left.run_attempt);
  const newest = matches[0];
  const duplicates = matches.filter((run) => run.id === newest.id && run.run_attempt === newest.run_attempt);
  if (duplicates.length > 1) {
    const signatures = new Set(duplicates.map((run) => `${run.status}|${run.conclusion}`));
    if (signatures.size > 1) return null;
  }
  return newest;
}

function trustedJob(jobsPayload, run, sha, jobName) {
  if (!jobsPayload || typeof jobsPayload !== "object" || !Array.isArray(jobsPayload.jobs)) return null;
  if (typeof jobsPayload.total_count === "number" && jobsPayload.total_count > jobsPayload.jobs.length) return null;
  const jobs = jobsPayload.jobs.filter((job) => job && job.name === jobName);
  if (jobs.length !== 1) return null;
  const job = jobs[0];
  if (job.run_id !== run.id || job.head_sha !== sha || !integerId(job.id)) return null;
  if (job.status !== "completed" || job.conclusion !== "success") return null;
  const prefix = `https://api.github.com/repos/${NEXORA_REPOSITORY}/check-runs/`;
  if (typeof job.check_run_url !== "string" || !job.check_run_url.startsWith(prefix)) return null;
  const checkRunId = job.check_run_url.slice(prefix.length).split(/[?#]/, 1)[0];
  if (!CHECK_RUN_ID.test(checkRunId)) return null;
  return { job, checkRunId };
}

function checkAgrees(checkPayload, run, job, sha, jobName) {
  if (!checkPayload || typeof checkPayload !== "object") return false;
  const app = checkPayload.app && checkPayload.app.slug;
  return app === GITHUB_ACTIONS_APP_SLUG
    && checkPayload.name === jobName
    && checkPayload.head_sha === sha
    && checkPayload.status === "completed"
    && checkPayload.conclusion === "success"
    && checkPayload.details_url === detailsUrl(run.id, job.id);
}

export function trustedCheckFromApiPayloads({
  sha,
  runs,
  jobs,
  check,
  workflowPath = WORKFLOW_PATH,
  jobName = FRONTEND_CHECK_NAME,
}) {
  if (!SHA.test(sha)) return null;
  const run = selectAuthoritativeRun(runs, sha, workflowPath);
  if (!run) return null;
  if (run.status !== "in_progress" && run.status !== "completed") return null;
  const selected = trustedJob(jobs, run, sha, jobName);
  if (!selected || !checkAgrees(check, run, selected.job, sha, jobName)) return null;
  return Object.freeze({
    name: jobName,
    sha,
    status: "completed",
    conclusion: "success",
    repository: NEXORA_REPOSITORY,
    workflowPath,
    workflowRunId: run.id,
    workflowStatus: run.status,
    event: REQUIRED_EVENT,
    branch: REQUIRED_BRANCH,
    jobId: selected.job.id,
    appSlug: GITHUB_ACTIONS_APP_SLUG,
    detailsUrl: detailsUrl(run.id, selected.job.id),
  });
}

export function frontendCheckFromApiPayloads(input) {
  return trustedCheckFromApiPayloads(input);
}

function githubHeaders(token) {
  const headers = {
    Accept: "application/vnd.github+json",
    "User-Agent": "nexora-render-build",
  };
  if (token) headers.Authorization = `Bearer ${token}`;
  return headers;
}

async function readJson(response) {
  if (!response || response.ok !== true || typeof response.json !== "function") return null;
  try {
    return await response.json();
  } catch {
    return null;
  }
}

export async function fetchTrustedWorkflowCheck(sha, fetchImpl, token, contract) {
  if (!SHA.test(sha) || !contract?.workflowFile || !contract.workflowPath || !contract.jobName) return null;
  try {
    const headers = githubHeaders(token);
    const runsUrl = `https://api.github.com/repos/${NEXORA_REPOSITORY}/actions/workflows/${encodeURIComponent(contract.workflowFile)}/runs?head_sha=${encodeURIComponent(sha)}&branch=${REQUIRED_BRANCH}&event=${REQUIRED_EVENT}&per_page=100`;
    const runs = await readJson(await fetchImpl(runsUrl, { headers }));
    const run = runs && selectAuthoritativeRun(runs, sha, contract.workflowPath);
    if (!run) return null;
    const jobsUrl = `https://api.github.com/repos/${NEXORA_REPOSITORY}/actions/runs/${run.id}/jobs?per_page=100`;
    const jobs = await readJson(await fetchImpl(jobsUrl, { headers }));
    const selected = jobs && trustedJob(jobs, run, sha, contract.jobName);
    if (!selected) return null;
    const checkUrl = `https://api.github.com/repos/${NEXORA_REPOSITORY}/check-runs/${selected.checkRunId}`;
    const check = await readJson(await fetchImpl(checkUrl, { headers }));
    return trustedCheckFromApiPayloads({
      sha,
      runs,
      jobs,
      check,
      workflowPath: contract.workflowPath,
      jobName: contract.jobName,
    });
  } catch {
    return null;
  }
}

export async function fetchFrontendCheck(sha, fetchImpl, token) {
  return fetchTrustedWorkflowCheck(sha, fetchImpl, token, {
    workflowFile: "ci.yml",
    workflowPath: WORKFLOW_PATH,
    jobName: FRONTEND_CHECK_NAME,
  });
}
