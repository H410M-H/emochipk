import { db as prisma } from "@/server/db";
import { getGMCConfig, buildGMCProductItem } from "@/lib/google-merchant";

/**
 * Escapes special XML characters to prevent feed formatting errors
 */
function escapeXml(unsafe: string): string {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

/**
 * Generates valid Google Shopping RSS 2.0 XML Feed string for all active products
 */
export async function generateGoogleShoppingXmlFeed(): Promise<string> {
  const config = getGMCConfig();
  const { appUrl } = config;

  const products = await prisma.product.findMany({
    where: { isActive: true },
    include: {
      images: { orderBy: { sortOrder: "asc" } },
      variants: {
        where: { isActive: true },
        include: { inventory: true },
      },
    },
  });

  const itemsXml: string[] = [];

  for (const product of products) {
    for (const variant of product.variants) {
      try {
        const item = buildGMCProductItem(product, variant, config);

        const additionalImages = (item.additionalImageLinks || [])
          .map((imgUrl) => `<g:additional_image_link>${escapeXml(imgUrl)}</g:additional_image_link>`)
          .join("\n        ");

        const salePriceXml = item.salePrice
          ? `<g:sale_price>${item.salePrice.value} ${item.salePrice.currency}</g:sale_price>`
          : "";

        itemsXml.push(`
    <item>
      <g:id>${escapeXml(item.offerId)}</g:id>
      <title>${escapeXml(item.title)}</title>
      <description>${escapeXml(item.description)}</description>
      <link>${escapeXml(item.link)}</link>
      <g:image_link>${escapeXml(item.imageLink)}</g:image_link>
      ${additionalImages}
      <g:availability>${item.availability}</g:availability>
      <g:price>${item.price.value} ${item.price.currency}</g:price>
      ${salePriceXml}
      <g:brand>${escapeXml(item.brand)}</g:brand>
      <g:condition>${item.condition}</g:condition>
      <g:google_product_category>${escapeXml(item.googleProductCategory || "")}</g:google_product_category>
      <g:gender>${item.gender}</g:gender>
      <g:age_group>${item.ageGroup}</g:age_group>
      <g:color>${escapeXml(item.color || "")}</g:color>
      <g:size>${escapeXml(item.sizes?.[0] || "")}</g:size>
      <g:item_group_id>${escapeXml(item.itemGroupId || "")}</g:item_group_id>
      <g:mpn>${escapeXml(item.mpn || "")}</g:mpn>
      <g:identifier_exists>false</g:identifier_exists>
    </item>`);
      } catch (err) {
        console.error(`[GMC Feed] Skipping variant ${variant.sku}:`, err);
      }
    }
  }

  const rssXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">
  <channel>
    <title>Executive Mochi Product Feed</title>
    <link>${escapeXml(appUrl)}</link>
    <description>Bespoke Genuine Leather Handcrafted Footwear Feed for Google Merchant Center</description>
    ${itemsXml.join("\n")}
  </channel>
</rss>`;

  return rssXml;
}
