import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { styleCategories, genderCategories } from '@/lib/utils/catalog';
import { createCallerFactory } from '@/server/trpc';
import { appRouter } from '@/server/root';
import { db } from '@/server/db';
import { ProductDetails } from './product-details';
import { ProductCard } from '@/components/product-card';
import type { Metadata } from 'next';
import { JsonLd } from '@/components/seo/JsonLd';

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

// Server-side caller for RSC data fetching (no HTTP overhead)
const createCaller = createCallerFactory(appRouter);
const caller = createCaller({ session: null, db });

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  try {
    const product = await caller.product.getBySlug(slug);
    if (!product) return { title: 'Product Not Found' };
    return {
      title: `${product.name} – ${product.articleNumber} | Executive Mochi`,
      description: product.description.substring(0, 160),
      openGraph: {
        title: product.name,
        description: product.description.substring(0, 160),
        images: product.images[0]?.url ? [{ url: product.images[0].url }] : [],
      },
    };
  } catch {
    return { title: 'Product Not Found' };
  }
}

/** Normalize a raw URL slug: lowercase, spaces/underscores → hyphens, strip leading/trailing hyphens */
function normalizeSlug(raw: string): string {
  return raw
    .toLowerCase()
    .replace(/[\s_]+/g, '-')   // spaces / underscores → hyphens
    .replace(/[^a-z0-9-]/g, '') // remove any remaining non-URL chars
    .replace(/^-+|-+$/g, '');   // trim leading/trailing hyphens
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;

  // ── Tier 1: exact lookup (happy path) ──────────────────────────────────
  let product = await caller.product.getBySlug(slug);

  if (!product) {
    // ── Tier 2: slug is malformed (spaces, wrong case, etc.) ─────────────
    const cleanSlug = normalizeSlug(slug);
    if (cleanSlug && cleanSlug !== slug) {
      // Redirect to the canonical URL so the browser/SEO sees the right slug
      redirect(`/product/${cleanSlug}`);
    }

    // ── Tier 3: product exists but has no images ──────────────────────────
    const bare = await db.product.findFirst({
      where: {
        OR: [
          { slug },
          ...(cleanSlug && cleanSlug !== slug ? [{ slug: cleanSlug }] : []),
        ],
        isActive: true,
      },
      select: { id: true, category: true, slug: true },
    });

    if (bare) {
      // Product exists (no images yet) — redirect to its category shop page
      redirect(`/shop?category=${bare.category}`);
    }

    // ── Tier 4: truly not found ───────────────────────────────────────────
    notFound();
  }

  const styleLabel = styleCategories.find((s) => s.id === product.style)?.label ?? product.style;
  const genderLabel = genderCategories.find((g) => g.id === product.category)?.label ?? product.category;

  // Related: same style, same category
  const related = await caller.product.getAll({
    style: product.style as never,
    category: product.category as never,
    page: 1, pageSize: 5,
  });
  const relatedProducts = related.items.filter((p: any) => p.id !== product.id).slice(0, 4);

  return (
    <div className="min-h-screen">
      {/* Structured Data */}
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "Product",
              "name": product.name,
              "image": product.images.map((img: any) => img.url),
              "description": product.description,
              "sku": (product.articleNumber ?? product.id).replace(/^\d+-/, ''),
              "brand": {
                "@type": "Brand",
                "name": "Executive Mochi"
              },
              "offers": {
                "@type": "Offer",
                "url": `https://executivemochi.pk/product/${product.slug}`,
                "priceCurrency": "PKR",
                "price": product.salePrice ?? product.basePrice,
                "availability": product.isActive ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
                "itemCondition": "https://schema.org/NewCondition",
                "validFrom": new Date().toISOString().split('T')[0],
                "priceValidUntil": new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0],
                "hasMerchantReturnPolicy": {
                  "@type": "MerchantReturnPolicy",
                  "applicableCountry": "PK",
                  "returnPolicyCategory": "https://schema.org/MerchantReturnFiniteReturnWindow",
                  "merchantReturnDays": 30,
                  "returnMethod": "https://schema.org/ReturnByMail",
                  "returnFees": "https://schema.org/FreeReturn"
                },
                "shippingDetails": {
                  "@type": "OfferShippingDetails",
                  "shippingRate": {
                    "@type": "MonetaryAmount",
                    "value": "0",
                    "currency": "PKR"
                  },
                  "shippingDestination": {
                    "@type": "DefinedRegion",
                    "addressCountry": "PK"
                  },
                  "deliveryTime": {
                    "@type": "ShippingDeliveryTime",
                    "handlingTime": {
                      "@type": "QuantitativeValue",
                      "minValue": 1,
                      "maxValue": 2,
                      "unitCode": "DAY"
                    },
                    "transitTime": {
                      "@type": "QuantitativeValue",
                      "minValue": 2,
                      "maxValue": 5,
                      "unitCode": "DAY"
                    }
                  }
                }
              }
            },
            {
              "@type": "BreadcrumbList",
              "itemListElement": [
                {
                  "@type": "ListItem",
                  "position": 1,
                  "name": "Home",
                  "item": "https://executivemochi.pk"
                },
                {
                  "@type": "ListItem",
                  "position": 2,
                  "name": "Shop",
                  "item": "https://executivemochi.pk/shop"
                },
                {
                  "@type": "ListItem",
                  "position": 3,
                  "name": genderLabel,
                  "item": `https://executivemochi.pk/shop/${product.category.toLowerCase()}`
                },
                {
                  "@type": "ListItem",
                  "position": 4,
                  "name": product.name,
                  "item": `https://executivemochi.pk/product/${product.slug}`
                }
              ]
            }
          ]
        }}
      />

      {/* Breadcrumb */}
      <div className="bg-muted/40 py-3 border-b">
        <div className="container mx-auto px-4">
          <nav className="flex items-center gap-1.5 text-xs text-muted-foreground flex-wrap">
            <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
            <ChevronRight className="h-3 w-3 shrink-0" />
            <Link href="/shop" className="hover:text-foreground transition-colors">Shop</Link>
            <ChevronRight className="h-3 w-3 shrink-0" />
            <Link href={`/shop?category=${product.category}`} className="hover:text-foreground transition-colors">
              {genderLabel}
            </Link>
            <ChevronRight className="h-3 w-3 shrink-0" />
            <Link href={`/shop?style=${product.style}`} className="hover:text-foreground transition-colors">
              {styleLabel}
            </Link>
            <ChevronRight className="h-3 w-3 shrink-0" />
            <span className="text-foreground font-medium truncate max-w-[200px]">{product.name}</span>
          </nav>
        </div>
      </div>

      {/* Product Details */}
      <ProductDetails product={product as never} />

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="py-16 lg:py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <h2 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight mb-8">You May Also Like</h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
              {relatedProducts.map((p: any) => (
                <ProductCard key={p.id} product={p as never} />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
