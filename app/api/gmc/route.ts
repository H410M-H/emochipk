import { type NextRequest, NextResponse } from "next/server";
import { getGMCConfig, isGMCConfigured, syncAllProductsToGMC, syncSingleProductToGMC } from "@/lib/google-merchant";

/**
 * GET /api/gmc
 * Returns current Google Merchant Center integration status & configuration info.
 */
export async function GET() {
  try {
    const config = getGMCConfig();
    const configured = isGMCConfigured(config);

    return NextResponse.json({
      configured,
      merchantId: config.merchantId ? `${config.merchantId.slice(0, 3)}***${config.merchantId.slice(-3)}` : null,
      clientEmail: config.clientEmail ? config.clientEmail : null,
      targetCountry: config.targetCountry,
      currency: config.currency,
      feedUrl: `${config.appUrl}/api/gmc/feed`,
      mode: configured ? "API_READY" : "DRY_RUN",
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to retrieve GMC status" }, { status: 500 });
  }
}

/**
 * POST /api/gmc
 * Syncs products with Google Merchant Center API.
 * Request Body: { productId?: string } (omitting productId syncs ALL active products)
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { productId } = body;

    const config = getGMCConfig();

    if (productId) {
      const result = await syncSingleProductToGMC(productId, config);
      return NextResponse.json(result);
    }

    const result = await syncAllProductsToGMC(config);
    return NextResponse.json(result);
  } catch (err: any) {
    console.error("[GMC API Route] Error during product sync:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Failed to execute GMC sync" },
      { status: 500 }
    );
  }
}
