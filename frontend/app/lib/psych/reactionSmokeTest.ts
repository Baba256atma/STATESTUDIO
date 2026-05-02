import { createPsychStore } from "./reactionStore";

export function runPsychReactionSmokeTest() {
  const store = createPsychStore();

  const before0 = store.getState();
  const beforeObjs0 = store.getObjects();

  const r1 = store.applyText("I feel stress and pressure");
  const after1 = r1.state;
  const afterObjs1 = r1.objects;

  if (!(after1.tension > before0.tension)) {
    const snapshot = { before: before0, after: after1, objectsBefore: beforeObjs0, objectsAfter: afterObjs1 };
    if (process.env.NODE_ENV !== "production") console.log("[Sycho][SYCHO-CORE-01-TEST][SmokeTestFailed]", "stress path");
    return { ok: false, failedCheck: "tension not increased on stress", snapshot };
  }

  if (!((afterObjs1.fire.activity ?? 0) > (beforeObjs0.fire.activity ?? 0) || (afterObjs1.fire.brightness ?? 0) > (beforeObjs0.fire.brightness ?? 0))) {
    const snapshot = { objectsBefore: beforeObjs0, objectsAfter: afterObjs1 };
    if (process.env.NODE_ENV !== "production") console.log("[Sycho][SYCHO-CORE-01-TEST][SmokeTestFailed]", "fire not changed on stress");
    return { ok: false, failedCheck: "fire object not affected on stress", snapshot };
  }

  // calm
  const before2 = after1;
  const beforeObjs2 = afterObjs1;
  const r2 = store.applyText("I feel calm and peace");
  const after2 = r2.state;
  const afterObjs2 = r2.objects;

  if (!(after2.calm > before2.calm)) {
    const snapshot = { before: before2, after: after2 };
    if (process.env.NODE_ENV !== "production") console.log("[Sycho][SYCHO-CORE-01-TEST][SmokeTestFailed]", "calm path");
    return { ok: false, failedCheck: "calm not increased on calm input", snapshot };
  }

  if (!((afterObjs2.water.brightness ?? 0) > (beforeObjs2.water.brightness ?? 0))) {
    const snapshot = { objectsBefore: beforeObjs2, objectsAfter: afterObjs2 };
    if (process.env.NODE_ENV !== "production") console.log("[Sycho][SYCHO-CORE-01-TEST][SmokeTestFailed]", "water not changed on calm");
    return { ok: false, failedCheck: "water brightness not increased on calm input", snapshot };
  }

  // curiosity
  const before3 = after2;
  const beforeObjs3 = afterObjs2;
  const r3 = store.applyText("why am I curious?");
  const after3 = r3.state;
  const afterObjs3 = r3.objects;

  if (!(after3.curiosity > before3.curiosity)) {
    const snapshot = { before: before3, after: after3 };
    if (process.env.NODE_ENV !== "production") console.log("[Sycho][SYCHO-CORE-01-TEST][SmokeTestFailed]", "curiosity path");
    return { ok: false, failedCheck: "curiosity not increased on curious input", snapshot };
  }

  if (!((afterObjs3.air.activity ?? 0) > (beforeObjs3.air.activity ?? 0))) {
    const snapshot = { objectsBefore: beforeObjs3, objectsAfter: afterObjs3 };
    if (process.env.NODE_ENV !== "production") console.log("[Sycho][SYCHO-CORE-01-TEST][SmokeTestFailed]", "air not changed on curiosity");
    return { ok: false, failedCheck: "air activity not increased on curiosity input", snapshot };
  }

  if (process.env.NODE_ENV !== "production") console.log("[Sycho][SYCHO-CORE-01-TEST][SmokeTestPassed]");
  return {
    ok: true,
    checks: [
      "stress increases tension and fire",
      "calm increases calm and water",
      "curiosity increases curiosity and air",
    ],
  };
}

// Allow running directly via ts-node (CommonJS)
declare const require: any;
if (typeof require !== "undefined" && require.main === module) {
  const result = runPsychReactionSmokeTest();
  // eslint-disable-next-line no-console
  console.log("Psych Smoke Test Result:", result);
  if (!result.ok) process.exit(1);
}

