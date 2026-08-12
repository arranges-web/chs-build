/* eslint-disable no-console */
/**
 * CLI entrypoint for the demo seed. Wired to `pnpm --filter
 * @workspace/db run seed` via package.json.
 *
 * This is the ONLY file that closes the pg pool. seed.ts stays
 * pure so the api-server can safely import `seedDemo` for the
 * admin "Load demo data" button without accidentally killing the
 * shared connection pool.
 */
import { pool } from "./index";
import { seedDemo } from "./seed";

async function main() {
  console.log("Seeding demo customer…");
  const result = await seedDemo({ reset: process.argv.includes("--reset") });
  console.log("\nDone.\n");
  console.log("Try the portal:");
  console.log(`  → /portal?account=${result.accountNumber}`);
  console.log(`  → /portal  with  ${result.email}\n`);
  await pool.end();
}

main().catch(async (err) => {
  console.error("Seed failed:", err);
  try {
    await pool.end();
  } catch {
    // ignore
  }
  process.exit(1);
});
