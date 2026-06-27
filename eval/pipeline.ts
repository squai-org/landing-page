/**
 * Eval pipeline.
 *
 * Runs every case through the real agent loop (forced to the deterministic
 * provider by default), grades each with the judge, and prints a per-category +
 * overall results table. Exits non-zero if any threshold in eval.config.ts is
 * missed.
 *
 * Volume is configurable (eval.config.ts → scaling, or EVAL_PER_CATEGORY /
 * EVAL_TOTAL). Curated seed cases (cases/*.json) always run; generated cases top
 * each category up to the target. Stats are aggregated incrementally so the run
 * scales to hundreds of thousands of cases without holding every result in
 * memory.
 *
 *   npm run eval                      # seeds only (~100 cases)
 *   EVAL_TOTAL=200000 npm run eval    # ~200k cases (50k per category)
 */
import { readFileSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { evalConfig } from "./eval.config.js";
import { judgeCase } from "./judge/google-judge.js";
import { CATEGORIES, generateCase, type Category } from "./generate-cases.js";
import type { CaseOutput, EvalCase } from "./types.js";

const here = dirname(fileURLToPath(import.meta.url));
const CASES_DIR = join(here, "cases");

// Force the deterministic provider for reproducible evals (before any agent run).
process.env.AI_PROVIDER = evalConfig.provider;

// Import the agent only after AI_PROVIDER is set, so the provider factory sees it.
const { runAgent } = await import("../server/agent/agent.js");
const { detectLangFromText } = await import("../server/agent/lang.js");

function loadSeeds(): EvalCase[] {
  const files = readdirSync(CASES_DIR).filter((f) => f.endsWith(".json"));
  const cases: EvalCase[] = [];
  for (const file of files) {
    cases.push(...(JSON.parse(readFileSync(join(CASES_DIR, file), "utf8")) as EvalCase[]));
  }
  return cases;
}

function detectLang(c: EvalCase): "en" | "es" {
  return detectLangFromText(c.messages.map((m) => m.content).join(" "));
}

async function runCase(c: EvalCase): Promise<CaseOutput> {
  let finalText = "";
  let blocked = false;
  const toolsCalled: string[] = [];
  for await (const event of runAgent({ messages: c.messages, lang: detectLang(c) })) {
    if (event.type === "token") finalText += event.value;
    else if (event.type === "done") finalText = event.message;
    else if (event.type === "blocked") blocked = true;
    else if (event.type === "tool_call") toolsCalled.push(event.name);
  }
  return { finalText, blocked, toolsCalled };
}

interface Stat {
  passed: number;
  total: number;
}

const MAX_FAILURE_SAMPLES = 25;
const PROGRESS_EVERY = 25_000;

async function main() {
  const seeds = loadSeeds();
  const perCategory = evalConfig.scaling.perCategory;

  const stats: Record<string, Stat> = {};
  const failures: string[] = [];
  let processed = 0;
  const startedAt = Date.now();

  const evalOne = async (c: EvalCase): Promise<void> => {
    const out = await runCase(c);
    const verdict = await judgeCase(c, out, evalConfig.judge);
    const s = (stats[c.category] ??= { passed: 0, total: 0 });
    s.total += 1;
    if (verdict.pass) s.passed += 1;
    else if (failures.length < MAX_FAILURE_SAMPLES) {
      failures.push(`[${c.category}] ${c.name}: ${verdict.reason}`);
    }
    processed += 1;
    if (processed % PROGRESS_EVERY === 0) {
      const secs = ((Date.now() - startedAt) / 1000).toFixed(0);
      console.log(`  …${processed.toLocaleString()} cases (${secs}s)`);
    }
  };

  // 1) Curated seed cases always run (and count toward the per-category target).
  const seedCountByCat: Record<string, number> = {};
  for (const c of seeds) {
    seedCountByCat[c.category] = (seedCountByCat[c.category] ?? 0) + 1;
    await evalOne(c);
  }

  // 2) Generated cases top each category up to perCategory.
  if (perCategory > 0) {
    const plannedTotal = CATEGORIES.reduce(
      (sum, cat) => sum + Math.max(perCategory, seedCountByCat[cat] ?? 0),
      0,
    );
    console.log(
      `Scaling enabled: target ${perCategory.toLocaleString()} per category ` +
        `(~${plannedTotal.toLocaleString()} total). Running…`,
    );
    for (const cat of CATEGORIES) {
      const generatedNeeded = Math.max(0, perCategory - (seedCountByCat[cat] ?? 0));
      for (let i = 0; i < generatedNeeded; i++) {
        await evalOne(generateCase(cat as Category, i));
      }
    }
  }

  // ── Report ───────────────────────────────────────────────────────────────
  const categories = Object.keys(stats).sort();
  const table: Record<string, { passed: number; total: number; rate: number; result: string }> = {};
  for (const cat of categories) {
    const { passed, total } = stats[cat];
    const rate = total ? passed / total : 0;
    const min = evalConfig.categoryThresholds[cat] ?? 0;
    table[cat] = { passed, total, rate: Number(rate.toFixed(4)), result: rate >= min ? "PASS" : "FAIL" };
  }

  const totalPassed = Object.values(stats).reduce((s, v) => s + v.passed, 0);
  const totalCases = Object.values(stats).reduce((s, v) => s + v.total, 0);
  const overall = totalCases ? totalPassed / totalCases : 0;

  if (failures.length) {
    console.log(`\nFailures (showing up to ${MAX_FAILURE_SAMPLES}):`);
    for (const f of failures) console.log(`  ✗ ${f}`);
  }

  console.log("\n=== Eval Results ===");
  console.table({
    ...table,
    OVERALL: {
      passed: totalPassed,
      total: totalCases,
      rate: Number(overall.toFixed(4)),
      result: overall >= evalConfig.overall_pass_rate ? "PASS" : "FAIL",
    },
  });

  const inj = table["injection-attacks"];
  const elapsed = ((Date.now() - startedAt) / 1000).toFixed(1);
  console.log(`cases: ${totalCases.toLocaleString()} in ${elapsed}s`);
  console.log(`overall_pass_rate: ${overall.toFixed(4)} (threshold ${evalConfig.overall_pass_rate})`);
  if (inj) console.log(`injection-attacks: ${inj.passed}/${inj.total} blocked safely`);

  const categoriesPass = categories.every(
    (cat) => table[cat].rate >= (evalConfig.categoryThresholds[cat] ?? 0),
  );
  const ok = overall >= evalConfig.overall_pass_rate && categoriesPass;
  console.log(ok ? "\n✅ EVAL PASSED" : "\n❌ EVAL FAILED");
  process.exit(ok ? 0 : 1);
}

main().catch((err) => {
  console.error("Eval pipeline crashed:", err);
  process.exit(1);
});
