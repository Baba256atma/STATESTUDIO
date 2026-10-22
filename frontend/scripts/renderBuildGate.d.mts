export const NEXORA_REPOSITORY: string;
export const FRONTEND_CHECK_NAME: string;
export const WORKFLOW_PATH: string;
export const REQUIRED_BRANCH: string;
export const REQUIRED_EVENT: string;
export const GITHUB_ACTIONS_APP_SLUG: string;
export const RENDER_BUILD_HEAP_MB: number;

export type FrontendCheck = Readonly<{
  name: string;
  sha: string;
  status: "completed";
  conclusion: "success";
  repository: string;
  workflowPath: string;
  workflowRunId: number;
  workflowStatus: "in_progress" | "completed";
  event: string;
  branch: string;
  jobId: number;
  appSlug: string;
  detailsUrl: string;
}>;

export type RenderBuildDecision =
  | Readonly<{ action: "full-typecheck"; ignoreBuildErrors: false }>
  | Readonly<{
    action: "compile-after-ci";
    ignoreBuildErrors: true;
    sha: string;
    heapMb: number;
  }>
  | Readonly<{ action: "refuse"; ignoreBuildErrors: false; reason: string }>;

export function decideRenderBuild(input: {
  readonly env: Readonly<Record<string, string | undefined>>;
  readonly check?: FrontendCheck | null;
  readonly localProof?: {
    purpose?: string;
    status?: string;
    nonce?: string;
    sha?: string;
    expires?: string;
  } | null;
}): RenderBuildDecision;

export function readLocalTypecheckProof(
  env: Readonly<Record<string, string | undefined>>,
): {
  purpose?: string;
  status?: string;
  nonce?: string;
  sha?: string;
  expires?: string;
} | null;

export function isTrustedFrontendCheck(
  check: FrontendCheck | null | undefined,
  sha: string,
): boolean;

export function isTrustedWorkflowCheck(
  check: FrontendCheck | null | undefined,
  sha: string,
  contract: { readonly workflowPath: string; readonly jobName: string },
): boolean;

export function trustedCheckFromApiPayloads(input: {
  readonly sha: string;
  readonly runs: unknown;
  readonly jobs: unknown;
  readonly check: unknown;
  readonly workflowPath?: string;
  readonly jobName?: string;
}): FrontendCheck | null;

export function fetchTrustedWorkflowCheck(
  sha: string,
  fetchImpl: typeof fetch,
  token: string | undefined,
  contract: { readonly workflowFile: string; readonly workflowPath: string; readonly jobName: string },
): Promise<FrontendCheck | null>;

export function fetchFrontendCheck(
  sha: string,
  fetchImpl: typeof fetch,
  token?: string,
): Promise<FrontendCheck | null>;
