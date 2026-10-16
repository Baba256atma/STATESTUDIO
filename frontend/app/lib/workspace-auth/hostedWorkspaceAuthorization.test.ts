import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { test } from "node:test";
import { promisify } from "node:util";

import { evaluateHostedLlmProviderGate } from "../auth/hostedLlmProviderGate.ts";
import { authorizeNexoraWorkspace } from "./authorizeNexoraWorkspace.ts";
import { dispatchAuthorizedHostedLlm, hostedLlmUsageScope } from "./hostedLlmDispatch.ts";
import {
  createHostedWorkspace,
  hostedWorkspaceCreationRejected,
  listOwnedHostedWorkspaces,
} from "./hostedWorkspaceCommands.ts";
import { hostedWorkspaceFailure } from "./hostedWorkspaceHttp.ts";
import {
  closeHostedWorkspaceDatabaseForTests,
  failHostedWorkspaceDatabaseForTests,
  openHostedWorkspaceDatabaseForTests,
} from "./hostedWorkspaceStore.ts";

const execFileAsync = promisify(execFile);
const userA = Object.freeze({ userId: "dev:user_a" });
const userB = Object.freeze({ userId: "dev:user_b" });

test("workspace ownership is isolated and caller owner fields are ignored", async () => {
  const directory = await mkdtemp(join(tmpdir(), "nexora-hosted-workspace-"));
  await openHostedWorkspaceDatabaseForTests(directory);
  try {
    assert.equal(hostedWorkspaceCreationRejected({ name: "Attack", kind: "BUSINESS", ownerUserId: "dev:user_a" }), true);
    const companyA = await createHostedWorkspace({ principal: userA, name: "Company A", kind: "BUSINESS" });
    const projectA = await createHostedWorkspace({ principal: userA, name: "Project A", kind: "PROJECT" });
    const companyB = await createHostedWorkspace({ principal: userB, name: "Company B", kind: "BUSINESS" });
    assert.equal(companyA.ok && companyA.value.ownerUserId, "dev:user_a");
    assert.equal(projectA.ok && projectA.value.ownerUserId, "dev:user_a");
    assert.equal(companyB.ok && companyB.value.ownerUserId, "dev:user_b");
    if (!companyA.ok || !projectA.ok || !companyB.ok) return;

    const matrix = [
      [userA, companyA.value.workspaceId, "AUTHORIZED"],
      [userA, projectA.value.workspaceId, "AUTHORIZED"],
      [userA, companyB.value.workspaceId, "NOT_AUTHORIZED"],
      [userB, companyA.value.workspaceId, "NOT_AUTHORIZED"],
      [userB, projectA.value.workspaceId, "NOT_AUTHORIZED"],
      [userB, companyB.value.workspaceId, "AUTHORIZED"],
      [null, companyA.value.workspaceId, "NOT_AUTHENTICATED"],
      [null, projectA.value.workspaceId, "NOT_AUTHENTICATED"],
      [null, companyB.value.workspaceId, "NOT_AUTHENTICATED"],
    ] as const;
    for (const [principal, workspaceId, outcome] of matrix) {
      const authorization = await authorizeNexoraWorkspace({ principal, workspaceId });
      assert.equal(authorization.outcome, outcome);
    }

    const listedA = await listOwnedHostedWorkspaces(userA);
    const listedB = await listOwnedHostedWorkspaces(userB);
    assert.deepEqual(listedA.ok ? listedA.value.map((workspace) => workspace.name) : [], ["Company A", "Project A"]);
    assert.deepEqual(listedB.ok ? listedB.value.map((workspace) => workspace.name) : [], ["Company B"]);
    assert.equal(await (await listOwnedHostedWorkspaces(null)).ok, false);

    const denied = await authorizeNexoraWorkspace({ principal: userB, workspaceId: companyA.value.workspaceId });
    const missing = await authorizeNexoraWorkspace({ principal: userB, workspaceId: "ws_missingmissingmiss" });
    assert.equal(denied.outcome, "NOT_AUTHORIZED");
    assert.equal(missing.outcome, "WORKSPACE_NOT_FOUND");
    const deniedHttp = hostedWorkspaceFailure("NOT_AUTHORIZED");
    const missingHttp = hostedWorkspaceFailure("WORKSPACE_NOT_FOUND");
    assert.equal(deniedHttp.status, 404);
    assert.equal(missingHttp.status, 404);
    assert.deepEqual(await deniedHttp.json(), await missingHttp.json());
    assert.equal(JSON.stringify(await hostedWorkspaceFailure("NOT_AUTHORIZED").json()).includes("Company A"), false);

    for (const workspaceId of ["overview", "problem", "scenario", "decision", "execution", "demo_workspace"]) {
      assert.equal((await authorizeNexoraWorkspace({ principal: userA, workspaceId })).outcome, "WORKSPACE_NOT_FOUND");
      assert.equal(evaluateHostedLlmProviderGate({ deploymentMode: "hosted", principal: userA, workspaceId }).allowed, false);
    }

    const attacked = await createHostedWorkspace({ principal: userB, name: "Attack", kind: "BUSINESS" });
    assert.equal(attacked.ok && attacked.value.ownerUserId, "dev:user_b");

    process.env.NEXORA_LLM_GATEWAY_SECRET = "gateway-test-secret";
    let providerCalls = 0;
    const allowed = await dispatchAuthorizedHostedLlm({
      principal: userA,
      workspaceId: companyA.value.workspaceId,
      contextWorkspaceId: companyA.value.workspaceId,
      payload: { turnId: "t1" },
      apiBaseUrl: "http://127.0.0.1:9",
      fetchImpl: (async (_url, init) => {
        providerCalls += 1;
        const headers = new Headers(init?.headers);
        assert.equal(headers.get("X-Nexora-Usage-Scope"), hostedLlmUsageScope(userA.userId, companyA.value.workspaceId));
        assert.equal(headers.get("X-Nexora-Usage-Scope")?.includes("ws_default"), false);
        assert.equal(headers.get("X-Nexora-Gateway-Secret"), "gateway-test-secret");
        return new Response(JSON.stringify({ status: "skipped", contribution: null }), { status: 200 });
      }) as typeof fetch,
    });
    assert.equal(allowed.forwarded, true);
    assert.equal(providerCalls, 1);

    providerCalls = 0;
    const refused = await dispatchAuthorizedHostedLlm({
      principal: userB,
      workspaceId: companyA.value.workspaceId,
      contextWorkspaceId: companyA.value.workspaceId,
      payload: { turnId: "t2", managementContext: { workspaceId: companyA.value.workspaceId } },
      fetchImpl: (() => {
        providerCalls += 1;
        throw new Error("provider invoked");
      }) as typeof fetch,
    });
    assert.equal(refused.forwarded, false);
    assert.equal(providerCalls, 0);

    const mismatched = await dispatchAuthorizedHostedLlm({
      principal: userA,
      workspaceId: companyA.value.workspaceId,
      contextWorkspaceId: companyB.value.workspaceId,
      payload: { turnId: "t3" },
      fetchImpl: (() => {
        providerCalls += 1;
        throw new Error("provider invoked");
      }) as typeof fetch,
    });
    assert.equal(mismatched.forwarded, false);
    assert.equal(providerCalls, 0);

    failHostedWorkspaceDatabaseForTests(true);
    const unavailable = await authorizeNexoraWorkspace({ principal: userA, workspaceId: companyA.value.workspaceId });
    assert.equal(unavailable.outcome, "UNAVAILABLE");
    const blocked = await dispatchAuthorizedHostedLlm({
      principal: userA,
      workspaceId: companyA.value.workspaceId,
      contextWorkspaceId: companyA.value.workspaceId,
      payload: { turnId: "t4" },
      fetchImpl: (() => {
        providerCalls += 1;
        throw new Error("provider invoked");
      }) as typeof fetch,
    });
    assert.equal(blocked.forwarded, false);
    assert.equal(providerCalls, 0);
    assert.equal((await listOwnedHostedWorkspaces(userA)).ok, false);
  } finally {
    delete process.env.NEXORA_LLM_GATEWAY_SECRET;
    await closeHostedWorkspaceDatabaseForTests();
    await rm(directory, { recursive: true, force: true });
  }
});

test("hosted mode closes GitHub, customer monitoring, and legacy FastAPI", async () => {
  const previous = process.env.NEXORA_DEPLOYMENT_MODE;
  process.env.NEXORA_DEPLOYMENT_MODE = "hosted";
  try {
    const github = await import("../../api/rdi/live/github/route.ts");
    const githubResponse = await github.POST(new Request("http://127.0.0.1/api/rdi/live/github", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ action: "test", workspaceId: "ws_aaaaaaaaaaaaaaaaaa", connectionId: "c", owner: "o", repository: "r" }),
    }));
    assert.equal(githubResponse.status, 404);

    const monitoring = await import("../../api/monitoring/background/route.ts");
    const snapshot = await monitoring.GET(new Request("http://127.0.0.1/api/monitoring/background?workspaceId=ws_aaaaaaaaaaaaaaaaaa"));
    assert.equal(snapshot.status, 404);
    const manual = await monitoring.POST(new Request("http://127.0.0.1/api/monitoring/background", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ action: "manual", workspaceId: "ws_aaaaaaaaaaaaaaaaaa", connectionId: "c" }),
    }));
    assert.equal(manual.status, 404);
    const sync = await monitoring.POST(new Request("http://127.0.0.1/api/monitoring/background", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ action: "sync", snapshot: { identity: "x", policies: [] } }),
    }));
    assert.equal(sync.status, 404);
  } finally {
    if (previous === undefined) delete process.env.NEXORA_DEPLOYMENT_MODE;
    else process.env.NEXORA_DEPLOYMENT_MODE = previous;
  }

  const script = `
import json, os
os.environ["NEXORA_DEPLOYMENT_MODE"] = "hosted"
os.environ["NEXORA_LLM_GATEWAY_SECRET"] = "gateway-test-secret"
from fastapi.testclient import TestClient
import main
client = TestClient(main.app)
paths = ["/ingestion/upload", "/chat", "/chat/ai", "/decision/x", "/api/decisions", "/api/events", "/product/workspace/x", "/replay/x", "/scanner", "/scenario/x", "/simulation/x", "/system/analyze", "/montecarlo/run", "/typec/ai", "/psych/x", "/debug/system-state-schema", "/events", "/ai/local/x", "/config/x", "/objects", "/collaboration/x"]
results = {path: client.get(path).status_code for path in paths}
results["/chat-post"] = client.post("/chat", json={}).status_code
health = client.get("/health")
results["/health"] = health.status_code
results["/health-body"] = health.json()
llm = client.post("/nexora/llm/runtime", json={"turnId": "t", "deterministicResponse": "d", "experienceStatus": "ok", "managementContext": {}, "userId": "dev:user_a"})
results["/llm"] = llm.status_code
import app.routes.nexora_llm as llm_route
seen = {}
def capture(payload, adapter=None, **kwargs):
    seen["usage_scope"] = kwargs.get("usage_scope")
    return {"contribution": None, "status": "skipped", "failure": None, "runtime": {"provider": "none", "model": None, "requestId": None, "latencyMs": None}, "usage": {"inputTokens": None, "outputTokens": None, "totalTokens": None}, "cost": None, "policy": {"identity": "x", "allowed": False, "reason": "LLM_DISABLED", "reservationId": None, "dispatched": False}}
llm_route.execute_nexora_llm_guarded_runtime = capture
trusted = client.post("/nexora/llm/runtime", headers={"x-nexora-gateway-secret": "gateway-test-secret", "x-nexora-usage-scope": "hosted:dev:user_a:ws_aaaaaaaaaaaaaaaaaa"}, json={"turnId": "t", "deterministicResponse": "d", "experienceStatus": "ok", "managementContext": {"workspaceId": "ws_aaaaaaaaaaaaaaaaaa"}, "userId": "dev:user_b"})
results["/llm-trusted"] = trusted.status_code
results["/llm-scope"] = seen.get("usage_scope")
print(json.dumps(results))
`;
  const { stdout } = await execFileAsync("python3", ["-c", script], {
    cwd: join(fileURLToPath(new URL(".", import.meta.url)), "../../../../backend"),
  });
  const results = JSON.parse(stdout) as Record<string, number | { ok?: boolean }>;
  for (const [path, status] of Object.entries(results)) {
    if (path === "/health-body") {
      assert.deepEqual(status, { ok: true });
      continue;
    }
    if (path === "/health") {
      assert.equal(status, 200);
      continue;
    }
    if (path === "/llm") {
      assert.equal(status, 401);
      continue;
    }
    if (path === "/llm-trusted") {
      assert.equal(status, 200);
      continue;
    }
    if (path === "/llm-scope") {
      assert.equal(status, "hosted:dev:user_a:ws_aaaaaaaaaaaaaaaaaa");
      assert.equal(String(status).includes("ws_default"), false);
      continue;
    }
    assert.equal(status, 404, path);
  }
});
