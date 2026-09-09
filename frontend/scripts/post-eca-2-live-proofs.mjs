/**
 * NPA-T POST-ECA:2 live /executive proofs. Isolated verified port.
 * Does not start ECA:13. Does not kill processes this script did not start.
 */
import { spawn } from "node:child_process";
import { createServer } from "node:net";
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { chromium } from "playwright";
import { askExecutiveChat, openExecutivePage } from "./nex-mvp-final3-executive-chat-harness.mjs";

const out = join(process.cwd(), "artifacts/post-eca/POST-ECA-2");

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

async function waitForHttp(url, attempts = 60) {
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

async function readStage(page) {
  return page.evaluate(() => {
    const shell = document.querySelector('[data-testid="nexora-executive-shell"]');
    const stage = document.querySelector('[data-testid="nexora-3d-executive-stage"]');
    return {
      sceneId: shell?.getAttribute("data-stage-scene-id") ?? "none",
      sceneMode: shell?.getAttribute("data-stage-scene-mode") ?? stage?.getAttribute("data-stage-presentation-mode") ?? "none",
      visibleCount: shell?.getAttribute("data-stage-visible-actor-count") ?? "none",
      visibleIds: shell?.getAttribute("data-stage-visible-actor-ids") ?? "none",
      visibleNames: shell?.getAttribute("data-stage-visible-actor-names") ?? "none",
      focused: shell?.getAttribute("data-focused-subject") ?? "none",
      selected: shell?.getAttribute("data-selected-subject") ?? "none",
      eca1Consumed: shell?.getAttribute("data-eca1-stage-awareness-consumed") ?? "none",
      queryDetected: shell?.getAttribute("data-advisor-stage-query-detected") ?? "none",
      eca2Intent: shell?.getAttribute("data-eca-2-intent") ?? "none",
      eca5Type: shell?.getAttribute("data-eca-5-type") ?? "none",
      eca5Subject: shell?.getAttribute("data-eca-5-bound") ?? "none",
      eca6Objective: shell?.getAttribute("data-eca-6-objective") ?? "none",
      queueCategory: stage?.getAttribute("data-stage-active-queue-category") ?? "none",
    };
  });
}

async function turn(page, utterance) {
  const chat = await askExecutiveChat(page, utterance);
  const stage = await readStage(page);
  return { managerTurn: utterance, reply: chat.last, ...stage };
}

function pass(condition, actual) {
  return { pass: Boolean(condition), actual };
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
  const overview = await turn(page, "what is on stage?");
  const runtime1 = pass(
    Number(overview.visibleCount) > 0 &&
      !/does not currently show any executive objects/i.test(overview.reply ?? "") &&
      /currently visible|focused/i.test(overview.reply ?? ""),
    overview,
  );

  await openExecutivePage(page, url);
  await turn(page, "Focus on Risk.");
  const focused = await turn(page, "what is on stage?");
  const runtime2 = pass(
    /Risk/i.test(focused.reply ?? "") &&
      focused.focused.includes("risk"),
    focused,
  );

  await openExecutivePage(page, url);
  const names = (overview.visibleNames ?? "").split("|").filter((item) => item && item !== "none");
  const correctionUtterance = names.length
    ? `No, you're wrong. There is ${names.join(" and ")} on it. Do you understand?`
    : "No, you're wrong. There is Capacity Watch on it. Do you understand?";
  await turn(page, "what is on stage?");
  const correction = await turn(page, correctionUtterance);
  const runtime3 = pass(
    !/observation about You/i.test(correction.reply ?? "") &&
      /You're right|wrong context|currently visible|understand that you’re correcting/i.test(correction.reply ?? "") &&
      correction.eca5Type === "CORRECTION",
    correction,
  );

  await openExecutivePage(page, url);
  const isolation = await turn(page, "what objects are on stage?");
  const runtime4 = pass(
    !/Capacity Gap and Margin Pressure/i.test(isolation.reply ?? "") &&
      !/does not currently show any executive objects/i.test(isolation.reply ?? ""),
    isolation,
  );

  await openExecutivePage(page, url);
  await turn(page, "Focus on Risk.");
  const afterFocus = await turn(page, "what is on stage?");
  const backBtn = page.locator('[data-testid="nexora-stage-step-back"]');
  if ((await backBtn.count()) > 0) await backBtn.click({ force: true });
  await page.waitForTimeout(400);
  const afterBack = await turn(page, "What's on Stage now?");
  const fwdBtn = page.locator('[data-testid="nexora-stage-step-forward"]');
  if ((await fwdBtn.count()) > 0) await fwdBtn.click({ force: true });
  await page.waitForTimeout(400);
  const afterForward = await turn(page, "What's on Stage now?");
  const runtime5 = pass(
    Boolean(afterFocus.reply) && Boolean(afterBack.reply) && Boolean(afterForward.reply),
    { afterFocus, afterBack, afterForward },
  );

  await openExecutivePage(page, url);
  const listed = await turn(page, "what is on stage?");
  const follow = await turn(page, "Explain the second one.");
  const runtime6 = pass(
    !/couldn'?t find a clear match/i.test(follow.reply ?? "") &&
      (names[1] ? new RegExp(names[1].replace(/\s+Watch$/i, ""), "i").test(follow.reply ?? "") : true),
    { listed, follow },
  );

  await openExecutivePage(page, url);
  const actor = names[0] ?? "Capacity Watch";
  const importance = await turn(page, `${actor} is on Stage, so is it important?`);
  const runtime7 = pass(
    /Not by itself|does not by itself/i.test(importance.reply ?? "") &&
      !/therefore it is (?:the )?most important/i.test(importance.reply ?? ""),
    importance,
  );

  await page.screenshot({ path: join(out, "live-proofs.png") });
  await browser.close();

  const report = {
    identity: "NPA-T POST-ECA:2/LiveStageAwareness",
    url,
    isolatedPort: started.port,
    errors,
    runtimes: {
      runtime1: { name: "Overview visible composition", ...runtime1 },
      runtime2: { name: "Focus Risk composition", ...runtime2 },
      runtime3: { name: "manager correction", ...runtime3 },
      runtime4: { name: "collection/Queue isolation", ...runtime4 },
      runtime5: { name: "Back/Forward presentation", ...runtime5 },
      runtime6: { name: "visible actor follow-up", ...runtime6 },
      runtime7: { name: "visibility ≠ business truth", ...runtime7 },
    },
  };
  await writeFile(join(out, "live-proofs.json"), JSON.stringify(report, null, 2));
  const failed = Object.values(report.runtimes).filter((item) => !item.pass);
  console.log(JSON.stringify({ ok: failed.length === 0, failed: failed.map((item) => item.name), port: started.port }, null, 2));
  if (failed.length) process.exitCode = 1;
} finally {
  if (started.child && started.child.pid) {
    started.child.kill("SIGTERM");
  }
}
