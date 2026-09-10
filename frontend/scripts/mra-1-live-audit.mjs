/**
 * MRA:1 live /executive diagnostic. Records manager chat + Stage attributes.
 * Isolated verified port. Does not start MRA:2 or patch product behavior.
 */
import { spawn } from "node:child_process";
import { createServer } from "node:net";
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { chromium } from "playwright";
import { askExecutiveChat, openExecutivePage } from "./nex-mvp-final3-executive-chat-harness.mjs";

const out = join(process.cwd(), "artifacts/mra/MRA-1");

function findFreePort() {
  return new Promise((resolve, reject) => {
    const server = createServer();
    server.unref();
    server.on("error", reject);
    server.listen(0, "127.0.0.1", () => {
      const address = server.address();
      const port = typeof address === "object" && address ? address.port : 0;
      server.close((error) => (error ? reject(error) : resolve(port)));
    });
  });
}

async function waitForHttp(url, attempts = 80) {
  for (let i = 0; i < attempts; i += 1) {
    try {
      const response = await fetch(url, { redirect: "manual" });
      if (response.status > 0) return;
    } catch {
      // retry
    }
    await new Promise((resolve) => setTimeout(resolve, 500));
  }
  throw new Error(`Timed out waiting for ${url}`);
}

async function readShell(page) {
  return page.evaluate(() => {
    const shell = document.querySelector('[data-testid="nexora-executive-shell"]');
    const stage = document.querySelector('[data-testid="nexora-3d-executive-stage"]');
    return {
      focused: shell?.getAttribute("data-focused-subject") ?? "none",
      moActive: shell?.getAttribute("data-mo1-active-object-id") ?? "none",
      intent: shell?.getAttribute("data-eca-2-intent") ?? "none",
      nextAction: shell?.getAttribute("data-eca-2-next-action") ?? "none",
      authority: shell?.getAttribute("data-eca-2-authority") ?? "none",
      dataRoute: shell?.getAttribute("data-advisor-data-route") ?? "none",
      stageMode: stage?.getAttribute("data-stage-presentation-mode") ?? "none",
      decisionCount: document.querySelector("[data-stage-thread-decision-count]")?.getAttribute("data-stage-thread-decision-count") ?? "none",
      executionCount: document.querySelector("[data-stage-thread-decision-count]")?.getAttribute("data-stage-thread-execution-count") ?? "none",
      eca7: shell?.getAttribute("data-eca-7-readiness") ?? "none",
      eca8: shell?.getAttribute("data-eca-8-state") ?? "none",
      eca8Writes: shell?.getAttribute("data-eca-8-writes") ?? "none",
      eca9: shell?.getAttribute("data-eca-9-readiness") ?? "none",
      eca10: shell?.getAttribute("data-eca-10-live") ?? "none",
    };
  });
}

const started = { child: null, port: null };
try {
  let base = process.env.EXECUTIVE_URL ?? null;
  if (!base) {
    const port = await findFreePort();
    started.port = port;
    const child = spawn("npx", ["next", "start", "-H", "127.0.0.1", "-p", String(port)], {
      cwd: process.cwd(),
      stdio: "pipe",
      env: { ...process.env, PORT: String(port) },
    });
    started.child = child;
    base = `http://127.0.0.1:${port}/executive`;
    await waitForHttp(base);
  } else {
    base = base.split("?")[0];
  }
  const url = `${base}?reset=1`;
  const browser = await chromium.launch({ channel: "chrome", headless: true });
  const page = await browser.newPage({ viewport: { width: 1502, height: 942 } });
  const errors = [];
  page.on("pageerror", (error) => errors.push(String(error)));
  await mkdir(out, { recursive: true });
  await openExecutivePage(page, url);

  async function turn(utterance) {
    const chat = await askExecutiveChat(page, utterance);
    return { managerTurn: utterance, reply: chat.last, ...(await readShell(page)) };
  }

  const live = {
    identity: "NPA-T MRA:1/LiveExecutiveAudit",
    url,
    errors,
    journeys: {},
  };

  live.journeys.natural = [];
  for (const utterance of [
    "show me all problems",
    "what is Capacity Gap?",
    "explain it",
    "why?",
    "which one is important?",
    "what should I do?",
    "no, I mean the execution",
    "show me what is on Stage",
  ]) {
    live.journeys.natural.push(await turn(utterance));
  }

  await openExecutivePage(page, url);
  live.journeys.stage = [];
  live.journeys.stage.push(await turn("what is on stage?"));
  live.journeys.stage.push(await turn("Focus on Risk."));
  live.journeys.stage.push(await turn("what is on stage?"));
  live.journeys.stage.push(await turn("show me all problems"));
  live.journeys.stage.push(await turn("how many problems?"));

  await openExecutivePage(page, url);
  live.journeys.decision = [];
  live.journeys.decision.push(await turn("show scenarios"));
  live.journeys.decision.push(await turn("Compare them."));
  live.journeys.decision.push(await turn("What should I do?"));
  live.journeys.decision.push(await turn("I prefer Demand Surge."));
  live.journeys.decision.push(await turn("Approve Demand Surge"));
  live.journeys.decision.push(await turn("yes"));
  live.journeys.decision.push(await turn("start it"));
  live.journeys.decision.push(await turn("how is execution going?"));

  await openExecutivePage(page, url);
  live.journeys.mutation = [];
  live.journeys.mutation.push(await turn("Add Supplier Delay as a Risk."));
  live.journeys.mutation.push(await turn("yes"));

  await openExecutivePage(page, url);
  live.journeys.knowledgeVsShow = [];
  live.journeys.knowledgeVsShow.push(await turn("What is Capacity Gap?"));
  const afterKnowledge = await readShell(page);
  live.journeys.knowledgeVsShow.push({ managerTurn: "(after knowledge, no extra utterance)", reply: null, ...afterKnowledge });
  await openExecutivePage(page, url);
  live.journeys.knowledgeVsShow.push(await turn("Show Capacity Gap."));

  await page.screenshot({ path: join(out, "live-audit.png") });
  await browser.close();

  live.zeroPageErrors = errors.length === 0;
  await writeFile(join(out, "live-audit.json"), JSON.stringify(live, null, 2));
  console.log(JSON.stringify({ identity: live.identity, url, errorCount: errors.length, out: join(out, "live-audit.json") }, null, 2));
} finally {
  if (started.child) started.child.kill("SIGTERM");
}
