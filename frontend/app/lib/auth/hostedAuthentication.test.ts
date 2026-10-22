import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { fileURLToPath } from "node:url";

import { companyId } from "../apiBase.ts";
import { NEXORA_ENTRANCE_SESSION_STORAGE_KEY } from "../nexora-entrance/nexoraEntranceTypes.ts";
import {
  createInitialNexoraMVPObjectInteractionState,
  getDefaultNexoraMVPObjectInteractionCatalog,
} from "../nex-mvp/nexoraMVPObjectInteraction.ts";
import { executeNexoraConversationalExperience } from "../conversational-control/conversationalExperienceOrchestrator.ts";
import { completeNexoraLlmManagerPresentation } from "../conversational-control/nexoraLlmManagerPresentation.ts";
import { projectDefaultNexoraMvpConversationalSubjects } from "../conversational-control/conversationalSubjectRegistry.ts";
import { evaluateHostedLlmProviderGate } from "./hostedLlmProviderGate.ts";
import { assessHostedMyWorkspaceAccess } from "./hostedWorkspaceGate.ts";
import { readNexoraDeploymentMode } from "./nexoraDeploymentMode.ts";
import {
  devUserAllowed,
  productionAuthOriginReady,
  selectNexoraAuthProvider,
  stableProviderUserId,
} from "./nexoraAuthProviders.ts";
import {
  NON_AUTHORITATIVE_IDENTITY_FIELDS,
  projectNexoraClientSession,
  projectNexoraPrincipal,
} from "./nexoraPrincipal.ts";

const future = new Date(Date.now() + 60_000).toISOString();
const past = new Date(Date.now() - 60_000).toISOString();

test("deployment mode defaults to local and accepts only hosted", () => {
  assert.equal(readNexoraDeploymentMode({}), "local");
  assert.equal(readNexoraDeploymentMode({ NEXORA_DEPLOYMENT_MODE: "local" }), "local");
  assert.equal(readNexoraDeploymentMode({ NEXORA_DEPLOYMENT_MODE: "hosted" }), "hosted");
  assert.equal(readNexoraDeploymentMode({ NEXORA_DEPLOYMENT_MODE: "production" }), "local");
});

test("anonymous, invalid, and expired sessions have no principal", () => {
  assert.equal(projectNexoraPrincipal(null), null);
  assert.equal(projectNexoraPrincipal({}), null);
  assert.equal(projectNexoraPrincipal({ user: { id: "user_a" }, expires: future }), null);
  assert.equal(projectNexoraPrincipal({ user: { id: "person@example.com" }, expires: future }), null);
  assert.equal(projectNexoraPrincipal({ user: { id: companyId() }, expires: future }), null);
  assert.equal(projectNexoraPrincipal({ user: { id: NEXORA_ENTRANCE_SESSION_STORAGE_KEY }, expires: future }), null);
  assert.equal(projectNexoraPrincipal({ user: { id: "dev:user_a" }, expires: past }), null);
  assert.equal(projectNexoraPrincipal({ user: { email: "person@example.com" }, expires: future }), null);
});

test("authenticated principal is a stable user id, not company or entrance identity", () => {
  const principal = projectNexoraPrincipal({ user: { id: "dev:user_a", email: "hidden@example.com" }, expires: future });
  assert.equal(principal?.userId, "dev:user_a");
  assert.equal(principal?.provider, "nexora-dev");
  assert.notEqual(principal?.userId, principal?.email);
  const again = projectNexoraPrincipal({ user: { id: "dev:user_a" }, expires: future });
  assert.equal(again?.userId, principal?.userId);
  const other = projectNexoraPrincipal({ user: { id: "dev:user_b" }, expires: future });
  assert.notEqual(other?.userId, principal?.userId);
  assert.equal(stableProviderUserId("github", "4242"), "github:4242");
  assert.equal(stableProviderUserId("nexora-dev", "user_a"), "dev:user_a");
  assert.equal(stableProviderUserId("github", "person@example.com"), null);
  const projection = projectNexoraClientSession(principal);
  assert.deepEqual(
    Object.keys(projection).sort(),
    ["authenticated", "displayLabel", "email", "image", "name", "provider", "userId"],
  );
  assert.equal(projection.userId, "dev:user_a");
  assert.equal(projection.email, "hidden@example.com");
  assert.equal(JSON.stringify(projection).includes("token"), false);
  assert.ok(NON_AUTHORITATIVE_IDENTITY_FIELDS.includes("localStorage:nexora.company_id"));
  assert.ok(NON_AUTHORITATIVE_IDENTITY_FIELDS.includes("sessionStorage:nexora.entrance.identity.session.v1"));
  assert.notEqual(principal?.userId, companyId());
  assert.notEqual(principal?.userId, NEXORA_ENTRANCE_SESSION_STORAGE_KEY);
});

test("one provider is selected and production ignores the development sign-in", () => {
  assert.equal(selectNexoraAuthProvider({}, "development"), "none");
  assert.equal(selectNexoraAuthProvider({
    NEXORA_AUTH_DEV_SIGN_IN: "true",
    GITHUB_ID: "public",
    GITHUB_SECRET: "secret",
  }, "development"), "nexora-dev");
  assert.equal(selectNexoraAuthProvider({
    NEXORA_AUTH_DEV_SIGN_IN: "true",
    GITHUB_ID: "public",
    GITHUB_SECRET: "secret",
    NEXTAUTH_URL: "https://nexora.example",
  }, "production"), "github");
  assert.equal(selectNexoraAuthProvider({
    NEXTAUTH_URL: "http://localhost:3000",
    GITHUB_ID: "public",
    GITHUB_SECRET: "secret",
  }, "production"), "none");
  assert.equal(productionAuthOriginReady({ NEXTAUTH_URL: "https://nexora.example" }, "production"), true);
  assert.equal(devUserAllowed("user_a", { NEXORA_AUTH_DEV_USER_IDS: "user_a,user_b" }), true);
  assert.equal(devUserAllowed("user_c", { NEXORA_AUTH_DEV_USER_IDS: "user_a,user_b" }), false);
  assert.equal(devUserAllowed("person@example.com", { NEXORA_AUTH_DEV_USER_IDS: "person@example.com" }), false);
});

test("hosted My Workspace is blocked anonymously and open without legacy ownership", () => {
  assert.equal(assessHostedMyWorkspaceAccess({ deploymentMode: "local", principal: null }).access, "local-certification");
  assert.equal(assessHostedMyWorkspaceAccess({ deploymentMode: "hosted", principal: null }).access, "authentication-required");
  const opened = assessHostedMyWorkspaceAccess({ deploymentMode: "hosted", principal: { userId: "dev:user_a" } });
  assert.equal(opened.access, "authenticated-account");
  if (opened.access === "authenticated-account") {
    assert.equal(opened.accountWorkspaceStore, "unavailable");
    assert.equal(opened.userId, "dev:user_a");
  }
});

test("auth configuration keeps secrets server-side and sessions out of browser stores", () => {
  const options = readFileSync(new URL("./nexoraAuthOptions.ts", import.meta.url), "utf8");
  const browser = readFileSync(new URL("./nexoraAuthBrowser.ts", import.meta.url), "utf8");
  const providers = readFileSync(new URL("./nexoraAuthProviders.ts", import.meta.url), "utf8");
  assert.match(options, /strategy: "jwt"/);
  assert.match(options, /useSecureCookies: process\.env\.NODE_ENV === "production"/);
  assert.doesNotMatch(options, /adapter:/);
  assert.doesNotMatch(options, /NEXT_PUBLIC_/);
  assert.doesNotMatch(providers, /NEXT_PUBLIC_/);
  assert.doesNotMatch(browser, /localStorage|sessionStorage|indexedDB|IndexedDB|document\.cookie/);
  assert.match(browser, /\/api\/auth\/csrf/);
  assert.doesNotMatch(options, /bcrypt|scrypt|argon2|createHash|passwordHash/);
});

test("anonymous hosted demo does not call the LLM provider", async () => {
  let calls = 0;
  const result = conversation("What should I watch?");
  const presented = await completeNexoraLlmManagerPresentation(result, {
    deploymentMode: "hosted",
    principal: null,
    apiBaseUrl: "http://127.0.0.1:9",
    fetchImpl: (() => {
      calls += 1;
      throw new Error("provider invoked");
    }) as typeof fetch,
  });
  assert.equal(calls, 0);
  assert.equal(presented.llmParticipantTurn?.status, "skipped-by-policy");
  assert.equal(presented.llmParticipantTurn?.policyReason, "authentication_required");
  assert.equal(presented.nexoraMessage.text, result.response);
  assert.equal(evaluateHostedLlmProviderGate({ deploymentMode: "hosted", principal: null }).allowed, false);
});

test("authenticated hosted manager data is not sent to the provider", async () => {
  let calls = 0;
  const result = conversation("What should I watch?");
  const presented = await completeNexoraLlmManagerPresentation(result, {
    deploymentMode: "hosted",
    principal: { userId: "dev:user_a" },
    apiBaseUrl: "http://127.0.0.1:9",
    fetchImpl: (() => {
      calls += 1;
      throw new Error("provider invoked");
    }) as typeof fetch,
  });
  assert.equal(calls, 0);
  assert.equal(presented.llmParticipantTurn?.policyReason, "workspace_authorization_required");
  assert.equal(presented.nexoraMessage.text, result.response);
  const gate = evaluateHostedLlmProviderGate({
    deploymentMode: "hosted",
    principal: { userId: "github:4242" },
  });
  assert.equal(gate.allowed, false);
});

test("local certification still reaches the provider seam", async () => {
  let calls = 0;
  const result = conversation("What should I watch?");
  await completeNexoraLlmManagerPresentation(result, {
    deploymentMode: "local",
    principal: null,
    apiBaseUrl: "http://127.0.0.1:9",
    fetchImpl: (async () => {
      calls += 1;
      return { ok: true, json: async () => ({ status: "skipped", contribution: null, policy: { reason: "LLM_DISABLED" } }) } as Response;
    }) as typeof fetch,
  });
  assert.equal(calls, 1);
});

function conversation(utterance: string) {
  return executeNexoraConversationalExperience({
    utterance,
    conversationContext: Object.freeze({ currentSubjectId: null, previousSubjectIds: Object.freeze([]) }),
    executiveSubjects: projectDefaultNexoraMvpConversationalSubjects(),
    runtimeState: createInitialNexoraMVPObjectInteractionState({
      workspace: "overview",
      presentationState: "minimum",
      environmentIntent: "neutral",
    }),
    catalog: getDefaultNexoraMVPObjectInteractionCatalog(),
    scenarioSession: null,
    decisionSession: null,
    previousManagerObjectSession: null,
    messageIdSeed: `hosted-auth-${utterance}`,
  });
}
