import dotenv from "dotenv";
dotenv.config();

import { db as prisma } from "../server/db";
import { getGMCConfig, isGMCConfigured, syncAllProductsToGMC } from "../lib/google-merchant";

async function main() {
  console.log("=== Google Merchant Center Sync Utility ===");
  const config = getGMCConfig();
  const configured = isGMCConfigured(config);

  console.log(`Target Country: ${config.targetCountry}`);
  console.log(`Currency:       ${config.currency}`);
  console.log(`App URL:        ${config.appUrl}`);
  console.log(`Status:         ${configured ? "API Authenticated (Live Mode)" : "Dry-Run / Sandbox Mode"}\n`);

  console.log("Fetching products from database and syncing to Google Merchant Center...");

  const result = await syncAllProductsToGMC(config);

  console.log("\n--- Sync Summary ---");
  console.log(`Mode:            ${result.mode.toUpperCase()}`);
  console.log(`Total Products:  ${result.totalProducts}`);
  console.log(`Total Variants:  ${result.totalVariants}`);
  console.log(`Synced Variants: ${result.syncedVariants}`);
  console.log(`Errors:          ${result.errors.length}`);

  if (result.errors.length > 0) {
    console.log("\nErrors detail:");
    result.errors.forEach((err, idx) => {
      console.log(`  ${idx + 1}. [${err.sku}] ${err.error}`);
    });
  }

  if (result.batchResults && result.batchResults.length > 0) {
    console.log("\nValidated Item Preview (First 5):");
    result.batchResults.slice(0, 5).forEach((item, idx) => {
      console.log(`  ${idx + 1}. OfferID: ${item.offerId} | Title: ${item.title} | Price: ${item.price} | Stock: ${item.availability}`);
    });
  }

  console.log("\nSync process completed at:", result.timestamp);
}

main()
  .catch((err) => {
    console.error("GMC Sync Failed:", err);
    process.exit(1);
  })
  .finally(async () => {
    try {
      await prisma.$disconnect();
    } catch (_e) {
      // Ignore disconnect errors if fallback query driver was used
    }
  });
