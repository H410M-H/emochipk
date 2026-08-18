import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Truck, RefreshCw, Shield, Award, MapPin, Sparkles, GraduationCap, CheckCircle2, ShieldCheck, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ProductCard } from '@/components/product-card';
import { CategorySlideshow } from '@/components/category-slideshow';
import { AzadiCountdownTimer } from '@/components/azadi-countdown-timer';
import { HeroProductMarquee } from '@/components/hero-product-marquee';
import { styleCategories, genderCategories, formatPrice } from '@/lib/data';
import { createCallerFactory } from '@/server/trpc';
import { appRouter } from '@/server/root';
import { db } from '@/server/db';
import type { CatalogProduct } from '@/lib/data';

const features = [
  { icon: Truck, title: 'Free Shipping', description: 'On orders above PKR 5,000' },
  { icon: RefreshCw, title: '7-Day Exchange', description: 'Easy returns & exchanges' },
  { icon: Shield, title: 'Secure Payment', description: 'COD · JazzCash · Raast' },
  { icon: Award, title: 'Handcrafted', description: 'Pasrur & Ghakhar artisans' },
];

/** Fetch products via tRPC server caller — no HTTP round-trip */
async function getHomeProducts() {
  const createCaller = createCallerFactory(appRouter);
  const caller = createCaller({ db, session: null });

  const [featuredRes, newRes, saleRes, kidsRes, allRes] = await Promise.allSettled([
    caller.product.getAll({ featured: true, pageSize: 40 }),
    caller.product.getAll({ sortBy: 'newest', pageSize: 4 }),
    caller.product.getAll({ onSale: true, pageSize: 4 }),
    caller.product.getAll({ category: 'KIDS', pageSize: 8 }),
    caller.product.getAll({ pageSize: 100 }),
  ]);

  return {
    featured: featuredRes.status === 'fulfilled' ? featuredRes.value.items : [],
    newArrivals: newRes.status === 'fulfilled' ? newRes.value.items : [],
    onSale: saleRes.status === 'fulfilled' ? saleRes.value.items : [],
    kidsCollection: kidsRes.status === 'fulfilled' ? kidsRes.value.items : [],
    allProducts: allRes.status === 'fulfilled' ? allRes.value.items : [],
  };
}

export default async function HomePage() {
  const { featured, newArrivals, onSale, kidsCollection, allProducts } = await getHomeProducts();

  const featuredGrid = featured.slice(0, 4);

  const categoryImages: Record<string, string[]> = {
    MEN: [],
    WOMEN: [],
    KIDS: [],
  };

  const heroImagesSet = new Set<string>();

  (allProducts as unknown as CatalogProduct[]).forEach((prod) => {
    if (prod.images && prod.images.length > 0) {
      prod.images.forEach((img) => {
        if (img?.url) {
          heroImagesSet.add(img.url);
          if (prod.category && categoryImages[prod.category] !== undefined) {
            categoryImages[prod.category].push(img.url);
          }
        }
      });
    }
  });

  const heroImages = Array.from(heroImagesSet).slice(0, 30);

  return (
    <>
      {/* ─── HERO — PAKISTANI FLAG GREEN AZADI THEME ─────────────────────────── */}
      <section className="relative min-h-[85vh] flex items-center overflow-hidden bg-gradient-to-b from-[#013516] via-[#01411C] to-[#002611] text-white py-12 lg:py-20 border-b border-amber-400/30">
        {/* Animated product images scrolling in background */}
        <HeroProductMarquee images={heroImages} />

        <div className="container mx-auto px-4 relative z-20">
          <div className="grid lg:grid-cols-12 gap-8 items-center">
            {/* Left Copy */}
            <div className="lg:col-span-7 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 bg-emerald-950/80 border border-amber-400/40 rounded-full px-4 py-1.5 mb-6 text-amber-300 text-xs sm:text-sm font-semibold shadow-inner">
                <span className="text-base">🇵🇰</span>
                <span>JASHN-E-AZADI CELEBRATION SALE</span>
                <span className="bg-amber-400 text-[#01411C] text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">14% OFF</span>
              </div>

              <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-white leading-[1.08] mb-6">
                Step Into
                <br />
                <span className="text-amber-300 drop-shadow-md">Pakistani Craft</span>
                <br />
                &amp; Azadi Pride
              </h1>

              <p className="text-emerald-100/90 text-base sm:text-lg leading-relaxed mb-8 max-w-xl mx-auto lg:mx-0">
                Celebrate Independence with <strong>14% OFF Storewide</strong> on all handcrafted shoes from Pasrur and Ghakhar — Peshawari, Formal Oxfords, Ladies Chappal, and Kids School Shoes!
              </p>

              <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
                <Button asChild size="lg" className="bg-amber-400 hover:bg-amber-500 text-[#01411C] font-bold text-base px-8 py-6 shadow-xl hover:scale-105 transition-all">
                  <Link href="/shop">
                    Shop Azadi Sale (14% OFF)
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>

                <Button asChild variant="outline" size="lg" className="border-white/50 text-white bg-transparent hover:bg-white/10 hover:text-white text-base px-8 py-6">
                  <Link href="/shop?category=KIDS">Kids School Shoes</Link>
                </Button>
              </div>
            </div>

            {/* Right Timer Card */}
            <div className="lg:col-span-5 flex justify-center">
              <AzadiCountdownTimer variant="hero" />
            </div>
          </div>
        </div>
      </section>

      {/* ─── FEATURES BAR ──────────────────────────────────── */}
      <section className="border-b bg-[#01411C]/5 dark:bg-[#01411C]/20 border-emerald-900/20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-emerald-800/10">
            {features.map((f) => (
              <div key={f.title} className="flex items-center gap-3 py-5 px-4 lg:px-6">
                <f.icon className="h-7 w-7 text-[#01411C] dark:text-amber-400 shrink-0" />
                <div>
                  <p className="font-semibold text-sm text-foreground">{f.title}</p>
                  <p className="text-xs text-muted-foreground">{f.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FEATURED AZADI SECTION: KIDS SCHOOL SHOES COLLECTION ───────────────────────────── */}
      <section className="py-16 lg:py-24 bg-gradient-to-b from-emerald-950/5 via-background to-background">
        <div className="container mx-auto px-4">
          <div className="bg-gradient-to-r from-[#01411C] via-[#025624] to-[#013516] rounded-3xl p-6 sm:p-10 text-white mb-12 relative overflow-hidden shadow-2xl border border-amber-400/30">
            <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
              <GraduationCap className="w-64 h-64 text-amber-400" />
            </div>

            <div className="relative z-10 max-w-3xl">
              <div className="inline-flex items-center gap-2 bg-amber-400 text-[#01411C] px-3 py-1 rounded-full font-bold text-xs uppercase tracking-wider mb-4">
                <span>🇵🇰</span> Azadi Special Feature
              </div>

              <h2 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-white mb-4">
                Kids School Shoes Collection
              </h2>

              <p className="text-emerald-100 text-base sm:text-lg leading-relaxed mb-6">
                Get your children ready for school with premium durable handcrafted school shoes from Pasrur and Ghakhar! Made with extra durability, flexible rubber soles, and arch support by our skilled artisans.
                <br />
                <span className="text-amber-300 font-semibold">14% OFF auto-applied at checkout until 30 August 2026!</span>
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs text-emerald-100 mb-8">
                <div className="flex items-center gap-1.5 bg-emerald-950/70 p-2.5 rounded-lg border border-emerald-700/50">
                  <ShieldCheck className="h-4 w-4 text-amber-400 shrink-0" />
                  <span>Real Leather Upper</span>
                </div>
                <div className="flex items-center gap-1.5 bg-emerald-950/70 p-2.5 rounded-lg border border-emerald-700/50">
                  <CheckCircle2 className="h-4 w-4 text-amber-400 shrink-0" />
                  <span>Non-Slip Soles</span>
                </div>
                <div className="flex items-center gap-1.5 bg-emerald-950/70 p-2.5 rounded-lg border border-emerald-700/50">
                  <Award className="h-4 w-4 text-amber-400 shrink-0" />
                  <span>Pasrur Handcrafted</span>
                </div>
                <div className="flex items-center gap-1.5 bg-emerald-950/70 p-2.5 rounded-lg border border-emerald-700/50">
                  <Sparkles className="h-4 w-4 text-amber-400 shrink-0" />
                  <span>14% Azadi Sale</span>
                </div>
              </div>

              <Button asChild size="lg" className="bg-amber-400 hover:bg-amber-500 text-[#01411C] font-bold px-8">
                <Link href="/shop?category=KIDS">
                  Explore All Kids School Shoes
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>

          {/* Kids Products Grid */}
          <div className="flex items-end justify-between mb-8">
            <div>
              <h3 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight mb-2">
                Featured Kids Footwear &amp; School Shoes
              </h3>
              <p className="text-muted-foreground">Black, Brown &amp; White school articles with 14% Azadi Discount</p>
            </div>
            <Button asChild variant="outline" className="hidden sm:flex border-[#01411C] text-[#01411C] hover:bg-[#01411C] hover:text-white">
              <Link href="/shop?category=KIDS">
                View All Kids <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

          {kidsCollection.length > 0 ? (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
              {(kidsCollection as unknown as CatalogProduct[]).slice(0, 4).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="p-8 text-center bg-muted/40 rounded-2xl border border-dashed">
              <p className="text-muted-foreground font-medium mb-3">Browse our full range of Kids School Shoes in the catalog.</p>
              <Button asChild className="bg-[#01411C]">
                <Link href="/shop?category=KIDS">Shop Kids Shoes</Link>
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* ─── GENDER CATEGORIES ─────────────────────────────── */}
      <section className="py-16 lg:py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight mb-3">
              Shop by Collection
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Gents · Ladies · Kids — crafted in Pasrur and Ghakhar with 14% Azadi discount
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {genderCategories.map((cat) => (
              <Link
                key={cat.id}
                href={`/shop?category=${cat.id}`}
                className="group relative aspect-[3/4] overflow-hidden rounded-2xl bg-stone-100 dark:bg-stone-900 border border-emerald-950/10"
              >
                <div className="absolute inset-0 bg-gradient-to-t from-[#01411C]/90 via-stone-950/20 to-transparent z-10" />
                <div className="absolute inset-0 transition-transform duration-700 group-hover:scale-105">
                  <CategorySlideshow
                    images={categoryImages[cat.id] || []}
                    fallbackUrl={cat.imageUrl}
                    alt={cat.label}
                  />
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-5 z-20">
                  <Badge className="bg-amber-400 text-[#01411C] font-bold text-[10px] mb-2">14% OFF AZADI</Badge>
                  <h3 className="font-serif text-2xl font-bold text-white">{cat.label}</h3>
                  <span className="text-amber-300 text-sm flex items-center gap-1 mt-1 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                    Shop {cat.label} <ArrowRight className="h-3 w-3" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ─── STYLE CATEGORIES ──────────────────────────────── */}
      <section className="py-12 bg-muted/40">
        <div className="container mx-auto px-4">
          <h2 className="font-serif text-2xl font-bold mb-6 text-center">Browse by Style</h2>
          <div className="grid grid-cols-3 sm:grid-cols-7 gap-3">
            {styleCategories.map((cat) => (
              <Link
                key={cat.id}
                href={`/shop?style=${cat.id}`}
                className="flex flex-col items-center gap-2 p-4 rounded-xl bg-card border hover:border-[#01411C] hover:shadow-md transition-all duration-200 group"
              >
                <span className="text-3xl">{cat.emoji}</span>
                <span className="text-xs font-medium text-center text-foreground group-hover:text-[#01411C] transition-colors leading-tight">
                  {cat.label}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FEATURED COLLECTION ───────────────────────────── */}
      {featured.length > 0 && (
        <section className="py-16 lg:py-24">
          <div className="container mx-auto px-4">
            <div className="flex items-end justify-between mb-10">
              <div>
                <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#01411C] mb-1">
                  <span>🇵🇰</span> 14% Off All Articles
                </div>
                <h2 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight mb-2">
                  Featured Collection
                </h2>
                <p className="text-muted-foreground">Our most sought-after styles</p>
              </div>
              <Button asChild variant="outline" className="hidden sm:flex border-[#01411C] text-[#01411C]">
                <Link href="/shop?filter=featured">
                  View All <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
              {(featuredGrid as unknown as CatalogProduct[]).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ─── AZADI CRAFTSMANSHIP BANNER ─────────────────────────── */}
      <section className="relative py-24 lg:py-32 overflow-hidden bg-gradient-to-br from-[#013516] via-[#01411C] to-[#002611] text-white">
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-xs uppercase tracking-[0.3em] text-amber-400 mb-4 font-semibold">
              Handcrafted in Pasrur &amp; Ghakhar 🇵🇰
            </p>
            <h2 className="font-serif text-4xl sm:text-5xl font-bold tracking-tight mb-6 text-white">
              The Heritage of Pakistani Shoemaking
            </h2>
            <p className="text-emerald-100 text-lg leading-relaxed mb-8">
              Generations of master craftsmen in Pasrur and Ghakhar handcraft
              every pair — from traditional Peshawari to modern formal oxfords and kids school shoes.
              Discover footwear made with pride, delivered nationwide with Cash on Delivery.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button asChild size="lg" className="bg-amber-400 hover:bg-amber-500 text-[#01411C] font-bold px-8">
                <Link href="/shop">Explore Azadi Collection (14% OFF)</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-white/40 text-white hover:bg-white/10 px-8">
                <Link href="/about">Our Story</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ─── NEW ARRIVALS ──────────────────────────────────── */}
      {newArrivals.length > 0 && (
        <section className="py-16 lg:py-24">
          <div className="container mx-auto px-4">
            <div className="flex items-end justify-between mb-10">
              <div>
                <h2 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight mb-2">
                  New Arrivals
                </h2>
                <p className="text-muted-foreground">Fresh additions to the collection</p>
              </div>
              <Button asChild variant="outline" className="hidden sm:flex">
                <Link href="/shop?filter=new">
                  View All <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
              {(newArrivals as unknown as CatalogProduct[]).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ─── STORE LOCATIONS ───────────────────────────────── */}
      <section className="py-16 lg:py-24 bg-[#002611] text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <p className="text-xs uppercase tracking-[0.3em] text-amber-400 mb-3 font-medium">Visit Us</p>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight mb-4">
              Two Outlets in Pasrur &amp; Ghakhar
            </h2>
            <p className="text-emerald-200/80 max-w-xl mx-auto">
              Walk into our Pasrur or Ghakhar stores and experience the craftsmanship firsthand.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
            {[
              { city: 'Pasrur', address: 'Timber Market, Pasrur', landmark: 'Near Service Super Shoes' },
              { city: 'Ghakhar', address: 'GT Road, Ghakhar Mandi', landmark: 'Near Service Super Shoes' },
            ].map((store) => (
              <div key={store.city} className="bg-[#013516] border border-emerald-800/50 rounded-2xl p-6 shadow-lg">
                <div className="flex items-start gap-[#01411C] mb-4">
                  <MapPin className="h-5 w-5 text-amber-400 mt-0.5 shrink-0" />
                  <div>
                    <h3 className="font-semibold text-lg text-white">Executive Mochi – {store.city}</h3>
                    <p className="text-emerald-200/80 text-sm mt-1">{store.address}</p>
                    <p className="text-emerald-300/60 text-xs mt-0.5">{store.landmark}</p>
                  </div>
                </div>
                <p className="text-emerald-400/60 text-xs">Mon–Sat: 10:00 AM – 9:00 PM</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Button asChild variant="outline" className="border-emerald-700 text-emerald-200 hover:bg-emerald-800">
              <Link href="/stores">
                <MapPin className="mr-2 h-4 w-4" />
                Get Directions
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
