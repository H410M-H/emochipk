import pg from 'pg';
import dotenv from 'dotenv';
import { randomUUID } from 'crypto';

dotenv.config();
const { Client } = pg;

function genId(prefix = 'c') {
  return `${prefix}${randomUUID().replace(/-/g, '').substring(0, 24)}`;
}

const accessoryProducts = [
  // ── 801 HOSIERY ──────────────────────────────────────────────────────────
  {
    articleNumber: 'GSOCKSFULL13',
    name: 'Executive Gents Full Length Dress Socks',
    slug: 'executive-gsocksfull13-gents-full-socks',
    description: 'Premium cotton-rich full length dress socks for gents. Soft, breathable knit with reinforced heel and toe for all-day formal and casual comfort.',
    basePrice: 350,
    salePrice: 350,
    category: 'ACCESSORIES',
    style: 'ACCESSORIES',
    leatherType: 'PREMIUM_SYNTHETIC',
    occasion: ['CASUAL', 'FORMAL'],
    manufacturingCity: 'Pasrur',
    isFeatured: true,
    image: '/images/products/socks-full.jpg',
    colors: [
      { name: 'Black', hex: '#1a1a1a' },
      { name: 'Navy', hex: '#1a1a3e' },
      { name: 'Grey', hex: '#808080' },
    ],
    sizes: [{ uk: 'Free Size', us: 'Free', eu: 'Free', cm: 'N/A' }],
    inventory: { pasrur: 20, ghakhar: 15 } // total 35
  },
  {
    articleNumber: 'GSOCKSHALF13',
    name: 'Executive Gents Half Crew Socks',
    slug: 'executive-gsockshalf13-gents-half-socks',
    description: 'Classic crew half-length cotton socks for gents. Ideal for everyday office wear, sneakers, and casual shoes with superior elasticity and comfort.',
    basePrice: 350,
    salePrice: 350,
    category: 'ACCESSORIES',
    style: 'ACCESSORIES',
    leatherType: 'PREMIUM_SYNTHETIC',
    occasion: ['CASUAL', 'FORMAL'],
    manufacturingCity: 'Pasrur',
    isFeatured: false,
    image: '/images/products/socks-half.jpg',
    colors: [
      { name: 'Black', hex: '#1a1a1a' },
      { name: 'Navy', hex: '#1a1a3e' },
      { name: 'Grey', hex: '#808080' },
    ],
    sizes: [{ uk: 'Free Size', us: 'Free', eu: 'Free', cm: 'N/A' }],
    inventory: { pasrur: 10, ghakhar: 9 } // total 19
  },
  {
    articleNumber: 'GSOCKSNKL13',
    name: 'Executive Gents Ankle Length Socks',
    slug: 'executive-gsocksnkl13-gents-ankle-socks',
    description: 'Low-cut ankle length socks crafted from combed cotton for maximum breathability and invisible fit in loafers, boat shoes, and sneakers.',
    basePrice: 350,
    salePrice: 350,
    category: 'ACCESSORIES',
    style: 'ACCESSORIES',
    leatherType: 'PREMIUM_SYNTHETIC',
    occasion: ['CASUAL', 'SPORTS'],
    manufacturingCity: 'Pasrur',
    isFeatured: false,
    image: '/images/products/socks-ankle.jpg',
    colors: [
      { name: 'Black', hex: '#1a1a1a' },
      { name: 'Navy', hex: '#1a1a3e' },
      { name: 'White', hex: '#FFFFFF' },
    ],
    sizes: [{ uk: 'Free Size', us: 'Free', eu: 'Free', cm: 'N/A' }],
    inventory: { pasrur: 15, ghakhar: 12 } // total 27
  },
  {
    articleNumber: 'UNIFORMSOCK',
    name: 'Executive Black Uniform Socks',
    slug: 'executive-uniformsock-uniform-socks-black',
    description: 'Durable black uniform and school socks made with reinforced cotton ribbing. Built for daily heavy use, school uniforms, and formal dress codes.',
    basePrice: 200,
    salePrice: 200,
    category: 'ACCESSORIES',
    style: 'ACCESSORIES',
    leatherType: 'PREMIUM_SYNTHETIC',
    occasion: ['CASUAL', 'FORMAL'],
    manufacturingCity: 'Pasrur',
    isFeatured: false,
    image: '/images/products/socks-uniform.jpg',
    colors: [
      { name: 'Black', hex: '#1a1a1a' },
    ],
    sizes: [{ uk: 'Free Size', us: 'Free', eu: 'Free', cm: 'N/A' }],
    inventory: { pasrur: 25, ghakhar: 22 } // total 47
  },

  // ── 802 ACCESSORIES ──────────────────────────────────────────────────────
  {
    articleNumber: 'SHOEARM-51',
    name: 'Executive Ergonomic Shoe Horn (Shoe Arm)',
    slug: 'executive-shoearm-51-shoe-horn',
    description: 'Ergonomically curved long shoe horn (shoe arm) designed to easily slip your feet into formal leather shoes without damaging the heel counter.',
    basePrice: 300,
    salePrice: 300,
    category: 'ACCESSORIES',
    style: 'ACCESSORIES',
    leatherType: 'PREMIUM_SYNTHETIC',
    occasion: ['CASUAL', 'FORMAL'],
    manufacturingCity: 'Pasrur',
    isFeatured: true,
    image: '/images/products/shoe-arm.jpg',
    colors: [{ name: 'Neutral', hex: '#C5A880' }],
    sizes: [{ uk: 'Standard', us: 'STD', eu: 'STD', cm: 'N/A' }],
    inventory: { pasrur: 4, ghakhar: 3 } // total 7
  },
  {
    articleNumber: 'SHOEBRUSH-01',
    name: 'Executive Horsehair Shoe Polishing Brush – Black',
    slug: 'executive-shoebrush-01-shoe-brush-black',
    description: '100% natural horsehair polishing brush with solid beechwood handle for buffing black leather shoes to an effortless mirror shine.',
    basePrice: 350,
    salePrice: 350,
    category: 'ACCESSORIES',
    style: 'ACCESSORIES',
    leatherType: 'PREMIUM_SYNTHETIC',
    occasion: ['CASUAL', 'FORMAL'],
    manufacturingCity: 'Pasrur',
    isFeatured: true,
    image: '/images/products/shoe-brush-black.jpg',
    colors: [{ name: 'Black', hex: '#1a1a1a' }],
    sizes: [{ uk: 'Standard', us: 'STD', eu: 'STD', cm: 'N/A' }],
    inventory: { pasrur: 5, ghakhar: 4 } // total 9
  },
  {
    articleNumber: 'SHOEBRUSH-02',
    name: 'Executive Horsehair Shoe Polishing Brush – Brown',
    slug: 'executive-shoebrush-02-shoe-brush-brown',
    description: '100% natural horsehair polishing brush dedicated for brown and tan leather shoes, preserving distinct polish shades without cross-contamination.',
    basePrice: 350,
    salePrice: 350,
    category: 'ACCESSORIES',
    style: 'ACCESSORIES',
    leatherType: 'PREMIUM_SYNTHETIC',
    occasion: ['CASUAL', 'FORMAL'],
    manufacturingCity: 'Pasrur',
    isFeatured: false,
    image: '/images/products/shoe-brush-brown.jpg',
    colors: [{ name: 'Brown', hex: '#8B4513' }],
    sizes: [{ uk: 'Standard', us: 'STD', eu: 'STD', cm: 'N/A' }],
    inventory: { pasrur: 5, ghakhar: 4 } // total 9
  },
  {
    articleNumber: 'SHOECREEM-01',
    name: 'Executive Nourishing Shoe Cream – Black',
    slug: 'executive-shoecreem-01-shoe-cream-black',
    description: 'Deeply nourishing beeswax and carnauba leather cream jar. Hydrates, restores rich color, and prevents leather cracking on black formal footwear.',
    basePrice: 350,
    salePrice: 350,
    category: 'ACCESSORIES',
    style: 'ACCESSORIES',
    leatherType: 'PREMIUM_SYNTHETIC',
    occasion: ['CASUAL', 'FORMAL'],
    manufacturingCity: 'Pasrur',
    isFeatured: false,
    image: '/images/products/shoe-cream-black.jpg',
    colors: [{ name: 'Black', hex: '#1a1a1a' }],
    sizes: [{ uk: 'Standard', us: 'STD', eu: 'STD', cm: 'N/A' }],
    inventory: { pasrur: 2, ghakhar: 1 } // total 3
  },
  {
    articleNumber: 'SHOECREEM-02',
    name: 'Executive Nourishing Shoe Cream – Tan',
    slug: 'executive-shoecreem-02-shoe-cream-tan',
    description: 'Deep conditioning shoe cream pomade specially blended for tan, beige, and camel colored leather shoes and Peshawari chappals.',
    basePrice: 350,
    salePrice: 350,
    category: 'ACCESSORIES',
    style: 'ACCESSORIES',
    leatherType: 'PREMIUM_SYNTHETIC',
    occasion: ['CASUAL', 'FORMAL'],
    manufacturingCity: 'Pasrur',
    isFeatured: false,
    image: '/images/products/shoe-cream-tan.jpg',
    colors: [{ name: 'Tan', hex: '#D2B48C' }],
    sizes: [{ uk: 'Standard', us: 'STD', eu: 'STD', cm: 'N/A' }],
    inventory: { pasrur: 1, ghakhar: 1 } // total 2
  },
  {
    articleNumber: 'SHOEINSOLE-51',
    name: 'Executive Classic Comfort Shoe Insoles',
    slug: 'executive-shoeinsole-51-comfort-insoles',
    description: 'Lightweight breathable shoe insoles providing instant cushioning and odor protection for everyday comfort in all types of footwear.',
    basePrice: 250,
    salePrice: 250,
    category: 'ACCESSORIES',
    style: 'ACCESSORIES',
    leatherType: 'PREMIUM_SYNTHETIC',
    occasion: ['CASUAL', 'FORMAL'],
    manufacturingCity: 'Pasrur',
    isFeatured: false,
    image: '/images/products/shoe-insole-standard.jpg',
    colors: [{ name: 'Neutral', hex: '#D2B48C' }],
    sizes: [{ uk: 'Free Size', us: 'Free', eu: 'Free', cm: 'N/A' }],
    inventory: { pasrur: 7, ghakhar: 6 } // total 13
  },
  {
    articleNumber: 'SHOEINSOLEM',
    name: 'Executive Memory Foam Cushion Insoles',
    slug: 'executive-shoeinsolem-memory-foam-insoles',
    description: 'High-density memory foam shoe insoles with ergonomic shock absorption. Contours perfectly to your foot shape to eliminate heel fatigue.',
    basePrice: 500,
    salePrice: 500,
    category: 'ACCESSORIES',
    style: 'ACCESSORIES',
    leatherType: 'PREMIUM_SYNTHETIC',
    occasion: ['CASUAL', 'FORMAL', 'SPORTS'],
    manufacturingCity: 'Pasrur',
    isFeatured: true,
    image: '/images/products/shoe-insole-memory.jpg',
    colors: [{ name: 'Neutral', hex: '#D2B48C' }],
    sizes: [{ uk: 'Free Size', us: 'Free', eu: 'Free', cm: 'N/A' }],
    inventory: { pasrur: 12, ghakhar: 12 } // total 24
  },
  {
    articleNumber: 'SHOEINSOLEMED',
    name: 'Executive Medical Orthopedic Arch Support Insoles',
    slug: 'executive-shoeinsolemed-medical-orthopedic-insoles',
    description: 'Medical-grade orthopedic insoles engineered with rigid arch support and deep heel cup for plantar fasciitis relief and long-standing support.',
    basePrice: 2000,
    salePrice: 2000,
    category: 'ACCESSORIES',
    style: 'ACCESSORIES',
    leatherType: 'PREMIUM_SYNTHETIC',
    occasion: ['CASUAL', 'FORMAL'],
    manufacturingCity: 'Pasrur',
    isFeatured: true,
    image: '/images/products/shoe-insole-orthopedic.jpg',
    colors: [{ name: 'Neutral', hex: '#D2B48C' }],
    sizes: [{ uk: 'Free Size', us: 'Free', eu: 'Free', cm: 'N/A' }],
    inventory: { pasrur: 4, ghakhar: 4 } // total 8
  },
  {
    articleNumber: 'SHOESHAINER-01',
    name: 'Executive Instant Shoe Shiner Sponge',
    slug: 'executive-shoeshainer-instant-shoe-shiner',
    description: 'Pocket-sized pre-treated silicone shine sponge for an instant, effortless gloss on smooth leather shoes without buffing or mess.',
    basePrice: 350,
    salePrice: 350,
    category: 'ACCESSORIES',
    style: 'ACCESSORIES',
    leatherType: 'PREMIUM_SYNTHETIC',
    occasion: ['CASUAL', 'FORMAL'],
    manufacturingCity: 'Pasrur',
    isFeatured: true,
    image: '/images/products/shoe-shiner.jpg',
    colors: [{ name: 'Black', hex: '#1a1a1a' }],
    sizes: [{ uk: 'Standard', us: 'STD', eu: 'STD', cm: 'N/A' }],
    inventory: { pasrur: 18, ghakhar: 17 } // total 35
  },
  {
    articleNumber: 'SHOESLIQPOLI-01',
    name: 'Executive Liquid Shoe Polish – Black',
    slug: 'executive-shoesliqpoli-01-liquid-shoe-polish-black',
    description: 'Self-shining liquid shoe polish with built-in sponge applicator. Provides water resistance and intense black shine with quick drying action.',
    basePrice: 400,
    salePrice: 400,
    category: 'ACCESSORIES',
    style: 'ACCESSORIES',
    leatherType: 'PREMIUM_SYNTHETIC',
    occasion: ['CASUAL', 'FORMAL'],
    manufacturingCity: 'Pasrur',
    isFeatured: true,
    image: '/images/products/shoe-liquid-polish-black.jpg',
    colors: [{ name: 'Black', hex: '#1a1a1a' }],
    sizes: [{ uk: 'Standard', us: 'STD', eu: 'STD', cm: 'N/A' }],
    inventory: { pasrur: 20, ghakhar: 18 } // total 38
  },
  {
    articleNumber: 'SHOESLIQPOLI-02',
    name: 'Executive Liquid Shoe Polish – Brown',
    slug: 'executive-shoesliqpoli-02-liquid-shoe-polish-brown',
    description: 'Self-shining brown liquid polish enriched with natural waxes for conditioning and polishing brown leather footwear.',
    basePrice: 400,
    salePrice: 400,
    category: 'ACCESSORIES',
    style: 'ACCESSORIES',
    leatherType: 'PREMIUM_SYNTHETIC',
    occasion: ['CASUAL', 'FORMAL'],
    manufacturingCity: 'Pasrur',
    isFeatured: false,
    image: '/images/products/shoe-liquid-polish-brown.jpg',
    colors: [{ name: 'Brown', hex: '#8B4513' }],
    sizes: [{ uk: 'Standard', us: 'STD', eu: 'STD', cm: 'N/A' }],
    inventory: { pasrur: 9, ghakhar: 8 } // total 17
  },
  {
    articleNumber: 'SHOESPOLISH-01',
    name: 'Executive Traditional Shoe Polish Tin – Black',
    slug: 'executive-shoespolish-01-shoe-polish-tin-black',
    description: 'Classic paste wax shoe polish tin formulated with refined mineral waxes for superior weather protection and high mirror gloss.',
    basePrice: 350,
    salePrice: 350,
    category: 'ACCESSORIES',
    style: 'ACCESSORIES',
    leatherType: 'PREMIUM_SYNTHETIC',
    occasion: ['CASUAL', 'FORMAL'],
    manufacturingCity: 'Pasrur',
    isFeatured: true,
    image: '/images/products/shoe-polish-tin-black.jpg',
    colors: [{ name: 'Black', hex: '#1a1a1a' }],
    sizes: [{ uk: 'Standard', us: 'STD', eu: 'STD', cm: 'N/A' }],
    inventory: { pasrur: 16, ghakhar: 16 } // total 32
  },
  {
    articleNumber: 'SHOESPOLISH-02',
    name: 'Executive Traditional Shoe Polish Tin – Brown',
    slug: 'executive-shoespolish-02-shoe-polish-tin-brown',
    description: 'Traditional paste wax shoe polish in rich brown, restoring pigment, repelling moisture, and polishing to a brilliant sheen.',
    basePrice: 350,
    salePrice: 350,
    category: 'ACCESSORIES',
    style: 'ACCESSORIES',
    leatherType: 'PREMIUM_SYNTHETIC',
    occasion: ['CASUAL', 'FORMAL'],
    manufacturingCity: 'Pasrur',
    isFeatured: false,
    image: '/images/products/shoe-polish-tin-brown.jpg',
    colors: [{ name: 'Brown', hex: '#8B4513' }],
    sizes: [{ uk: 'Standard', us: 'STD', eu: 'STD', cm: 'N/A' }],
    inventory: { pasrur: 12, ghakhar: 12 } // total 24
  },
  {
    articleNumber: 'SHOESPRY-03',
    name: 'Executive Waterproof Shoe Protector Spray',
    slug: 'executive-shoespry-03-waterproof-shoe-protector-spray',
    description: 'Advanced hydrophobic barrier spray protecting leather, suede, nubuck, and canvas shoes against rain, stains, and daily dirt.',
    basePrice: 250,
    salePrice: 250,
    category: 'ACCESSORIES',
    style: 'ACCESSORIES',
    leatherType: 'PREMIUM_SYNTHETIC',
    occasion: ['CASUAL', 'FORMAL', 'SPORTS'],
    manufacturingCity: 'Pasrur',
    isFeatured: false,
    image: '/images/products/shoe-spray.jpg',
    colors: [{ name: 'Neutral', hex: '#808080' }],
    sizes: [{ uk: 'Standard', us: 'STD', eu: 'STD', cm: 'N/A' }],
    inventory: { pasrur: 2, ghakhar: 2 } // total 4
  },
  {
    articleNumber: 'SHOEWAX-01',
    name: 'Executive High Gloss Shoe Wax Polish – Black',
    slug: 'executive-shoewax-01-high-gloss-shoe-wax-black',
    description: 'Professional high-gloss carnauba paste wax formulation for military and formal glaze finish on toe caps and heels.',
    basePrice: 350,
    salePrice: 350,
    category: 'ACCESSORIES',
    style: 'ACCESSORIES',
    leatherType: 'PREMIUM_SYNTHETIC',
    occasion: ['CASUAL', 'FORMAL'],
    manufacturingCity: 'Pasrur',
    isFeatured: false,
    image: '/images/products/shoe-wax-black.jpg',
    colors: [{ name: 'Black', hex: '#1a1a1a' }],
    sizes: [{ uk: 'Standard', us: 'STD', eu: 'STD', cm: 'N/A' }],
    inventory: { pasrur: 6, ghakhar: 5 } // total 11
  }
];

async function seedAccessories() {
  const url = process.env.DATABASE_URL_DEV || process.env.DATABASE_URL;
  console.log('Connecting to PostgreSQL...');
  const client = new Client({ connectionString: url });
  await client.connect();

  console.log('1. Cleaning up old miscategorized accessories entries...');
  const oldArticleNumbers = [
    'GSOCKS13-', 'GSOCKSFU', 'GSOCKSHA', 'GSOCKSMO', 'GSOCKSNK', 'UNIFORMS',
    'SHOEARM-', 'SHOECREE', 'SHOEINSOL', 'SHOESHAIN', 'SHOESLIQP', 'SHOESPOL', 'SHOESPRY'
  ];

  for (const art of oldArticleNumbers) {
    const oldProds = await client.query('SELECT id FROM products WHERE "articleNumber" = $1', [art]);
    for (const r of oldProds.rows) {
      await client.query('DELETE FROM inventory WHERE "variantId" IN (SELECT id FROM product_variants WHERE "productId" = $1)', [r.id]);
      await client.query('DELETE FROM product_variants WHERE "productId" = $1', [r.id]);
      await client.query('DELETE FROM product_images WHERE "productId" = $1', [r.id]);
      await client.query('DELETE FROM products WHERE id = $1', [r.id]);
      console.log(`  🗑️ Cleaned up old product: ${art}`);
    }
  }

  console.log('\n2. Upserting 19 Accessories & Hosiery Products...');
  let count = 0;

  for (const p of accessoryProducts) {
    count++;
    const productId = genId('p');

    // Upsert product
    const prodRes = await client.query(`
      INSERT INTO products (id, "articleNumber", name, slug, description, "basePrice", "salePrice", category, occasion, style, "leatherType", "manufacturingCity", "isFeatured", "isActive", "createdAt", "updatedAt")
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8::"ProductCategory", $9::"Occasion"[], $10::"Style", $11::"LeatherType", $12, $13, true, NOW(), NOW())
      ON CONFLICT (slug) DO UPDATE SET 
        name = EXCLUDED.name,
        "articleNumber" = EXCLUDED."articleNumber",
        description = EXCLUDED.description,
        "basePrice" = EXCLUDED."basePrice",
        "salePrice" = EXCLUDED."salePrice",
        category = EXCLUDED.category,
        occasion = EXCLUDED.occasion,
        style = EXCLUDED.style,
        "leatherType" = EXCLUDED."leatherType",
        "manufacturingCity" = EXCLUDED."manufacturingCity",
        "isFeatured" = EXCLUDED."isFeatured",
        "isActive" = true,
        "updatedAt" = NOW()
      RETURNING id, slug;
    `, [
      productId, p.articleNumber, p.name, p.slug, p.description,
      p.basePrice, p.salePrice, p.category, p.occasion, p.style,
      p.leatherType, p.manufacturingCity, p.isFeatured
    ]);

    const realProductId = prodRes.rows[0].id;

    // Add primary image
    if (p.image) {
      const existingImg = await client.query('SELECT id FROM product_images WHERE "productId" = $1 AND url = $2', [realProductId, p.image]);
      if (existingImg.rows.length === 0) {
        await client.query(`
          INSERT INTO product_images (id, "productId", url, "altText", "isPrimary", "sortOrder")
          VALUES ($1, $2, $3, $4, true, 0);
        `, [genId('img'), realProductId, p.image, p.name]);
      }
    }

    // Add variants and inventory
    for (const color of p.colors) {
      for (const size of p.sizes) {
        const sku = `${p.articleNumber}-${color.name.substring(0, 3).toUpperCase()}-${size.eu.toUpperCase()}-STD`;
        const varId = genId('v');

        const varRes = await client.query(`
          INSERT INTO product_variants (id, "productId", sku, "sizeUK", "sizeUS", "sizeEU", "sizeCM", color, "colorHex", width, "priceDelta", "isActive", "createdAt", "updatedAt")
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, 'STANDARD'::"Width", 0, true, NOW(), NOW())
          ON CONFLICT (sku) DO UPDATE SET 
            "productId" = EXCLUDED."productId",
            color = EXCLUDED.color,
            "colorHex" = EXCLUDED."colorHex",
            "isActive" = true,
            "updatedAt" = NOW()
          RETURNING id;
        `, [varId, realProductId, sku, size.uk, size.us, size.eu, size.cm, color.name, color.hex]);

        const realVarId = varRes.rows[0].id;

        // Pasrur inventory
        const qtyPasrur = Math.max(1, Math.round(p.inventory.pasrur / p.colors.length));
        await client.query(`
          INSERT INTO inventory (id, "branchId", "variantId", quantity, reserved, "lowStockThreshold", "updatedAt")
          VALUES ($1, 'branch-pasrur-01', $2, $3, 0, 5, NOW())
          ON CONFLICT ("branchId", "variantId") DO UPDATE SET quantity = EXCLUDED.quantity, "updatedAt" = NOW();
        `, [genId('inv'), realVarId, qtyPasrur]);

        // Ghakhar inventory
        const qtyGhakhar = Math.max(1, Math.round(p.inventory.ghakhar / p.colors.length));
        await client.query(`
          INSERT INTO inventory (id, "branchId", "variantId", quantity, reserved, "lowStockThreshold", "updatedAt")
          VALUES ($1, 'branch-ghakhar-01', $2, $3, 0, 5, NOW())
          ON CONFLICT ("branchId", "variantId") DO UPDATE SET quantity = EXCLUDED.quantity, "updatedAt" = NOW();
        `, [genId('inv'), realVarId, qtyGhakhar]);
      }
    }

    console.log(`  ✅ [${count}/19] ${p.articleNumber}: ${p.name}`);
  }

  // Count total accessories products
  const totalAcc = await client.query(`SELECT count(*) FROM products WHERE category = 'ACCESSORIES'`);
  console.log(`\n🎉 Done! Total ACCESSORIES products in database: ${totalAcc.rows[0].count}`);

  await client.end();
}

seedAccessories().catch(console.error);
