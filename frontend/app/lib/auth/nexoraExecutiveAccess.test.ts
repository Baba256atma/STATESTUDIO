import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

import { DEMO_WORKSPACE_ID } from "../workspace/workspaceRegistryContract.ts";
import { nexoraGitHubCallbackUrl, resolveExecutiveAccess } from "./nexoraExecutiveAccess.ts";
import { projectNexoraClientSession, projectNexoraPrincipal } from "./nexoraPrincipal.ts";

const future = new Date(Date.now() + 60_000).toISOString();

test("A public homepage does not require a server session", () => {
  const home = readFileSync(new URL("../../page.tsx", import.meta.url), "utf8");
  const screen = readFileSync(new URL("../../components/DomainSelectionScreen.tsx", import.meta.url), "utf8");
  assert.doesNotMatch(home, /getServerSession|readAuthenticatedNexoraPrincipal|nexoraAuthOptions/);
  assert.match(screen, /data-testid="nexora-sign-in-entry"/);
  assert.match(screen, /href="\/executive"/);
});

test("B unauthenticated executive access stops at the authentication boundary", () => {
  const hosted = resolveExecutiveAccess({
    deploymentMode: "hosted",
    provider: "github",
    principal: null,
  });
  assert.equal(hosted.access, "authentication-boundary");
  const localGitHub = resolveExecutiveAccess({
    deploymentMode: "local",
    provider: "github",
    principal: null,
  });
  assert.equal(localGitHub.access, "authentication-boundary");
  const page = readFileSync(new URL("../../executive/page.tsx", import.meta.url), "utf8");
  const sandbox = readFileSync(new URL("../../executive/exs1/page.tsx", import.meta.url), "utf8");
  assert.match(page, /readNexoraExecutiveGate/);
  assert.match(page, /NexoraExecutiveAuthBoundary/);
  assert.doesNotMatch(page, /\bredirect\s*\(/);
  const boundary = page.slice(page.indexOf("authentication-boundary"), page.indexOf("hostedWorkspaces"));
  assert.doesNotMatch(boundary, /ExecutiveShell/);
  assert.match(sandbox, /readNexoraExecutiveGate/);
  assert.match(sandbox, /authentication-boundary/);
});

test("C one authenticated session resolves to one stable principal", () => {
  const principal = projectNexoraPrincipal({
    expires: future,
    user: {
      id: "github:4242",
      name: "Ada Lovelace",
      email: "ada@example.com",
      image: "https://avatars.githubusercontent.com/u/4242",
    },
  });
  assert.equal(principal?.userId, "github:4242");
  assert.equal(principal?.provider, "github");
  const again = projectNexoraPrincipal({
    expires: future,
    user: { id: "github:4242", name: "Different display name" },
  });
  assert.equal(again?.userId, principal?.userId);
  assert.equal(nexoraGitHubCallbackUrl("http://localhost:3000"), "http://localhost:3000/api/auth/callback/github");
  assert.equal(nexoraGitHubCallbackUrl("https://nexora.example"), "https://nexora.example/api/auth/callback/github");
});

test("D client identity fields cannot replace the authenticated principal", () => {
  const principal = projectNexoraPrincipal({
    expires: future,
    userId: "demo-user",
    email: "attacker@example.com",
    githubId: "999",
    workspaceOwner: "demo_workspace",
    role: "manager",
    user: { id: "github:4242", provider: "nexora-dev", email: "ada@example.com" },
  });
  assert.equal(principal?.userId, "github:4242");
  assert.equal(principal?.provider, "github");
  assert.notEqual(principal?.userId, "demo-user");
  assert.notEqual(principal?.email, "attacker@example.com");
});

test("E demo workspace identity is not an authenticated principal", () => {
  assert.equal(DEMO_WORKSPACE_ID, "demo_workspace");
  assert.equal(projectNexoraPrincipal({ expires: future, user: { id: DEMO_WORKSPACE_ID } }), null);
  assert.equal(projectNexoraPrincipal({ expires: future, user: { id: "demo-user", name: "Nexora Demo" } }), null);
  const manager = projectNexoraPrincipal({
    expires: future,
    user: { id: "github:4242", name: "Nexora Demo" },
  });
  assert.equal(manager?.userId, "github:4242");
  assert.notEqual(manager?.userId, DEMO_WORKSPACE_ID);
  const local = resolveExecutiveAccess({ deploymentMode: "local", provider: "none", principal: null });
  assert.equal(local.access, "local-certification");
});

test("F sign-out returns executive access to the authentication boundary", () => {
  const signedIn = resolveExecutiveAccess({
    deploymentMode: "hosted",
    provider: "github",
    principal: { userId: "github:4242", provider: "github" },
  });
  assert.equal(signedIn.access, "authenticated-executive");
  const signedOut = resolveExecutiveAccess({
    deploymentMode: "hosted",
    provider: "github",
    principal: projectNexoraPrincipal(null),
  });
  assert.equal(signedOut.access, "authentication-boundary");
  assert.equal(projectNexoraClientSession(null).authenticated, false);
  const browser = readFileSync(new URL("./nexoraAuthBrowser.ts", import.meta.url), "utf8");
  assert.match(browser, /\/api\/auth\/signout/);
  const options = readFileSync(new URL("./nexoraAuthOptions.ts", import.meta.url), "utf8");
  assert.match(options, /providerAccountId/);
  assert.match(options, /delete token\.accessToken/);
  assert.doesNotMatch(options, /console\.(log|debug|info)\(/);
});
